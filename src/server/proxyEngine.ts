/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IncomingMessage, ServerResponse } from 'http';
import {
  logBackendError,
  holdHeavyPCSitePayload,
  storeUnityAsset,
  PC_DESKTOP_HEADERS,
} from './supabase';
import {
  generateGithubSignupHtml,
  generateGenericSignupHtml,
} from './authTemplates';

// Domain-isolated cookie jar to avoid cross-domain cookie bleeding
const cookieJar = new Map<string, string>();

/**
 * Unwraps search engine tracking/redirect links (Bing /ck/a and Google /url)
 * into real destination URLs to prevent 204 No Content empty responses and blank screens.
 */
export function unwrapSearchRedirectUrl(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);

    // 1. Bing Tracking Link: /ck/a?!&&p=...&u=a1aHR0cHM6Ly9haXN0dWRpby5nb29nbGUuY29tLw...
    if (parsed.hostname.includes('bing.com') && parsed.pathname.includes('/ck/a')) {
      const uParam = parsed.searchParams.get('u');
      if (uParam) {
        let cleanU = uParam;
        if (cleanU.startsWith('a1')) cleanU = cleanU.slice(2);
        const base64 = cleanU.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = Buffer.from(base64, 'base64').toString('utf-8');
        if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
          return decoded;
        } else if (decoded.startsWith('/')) {
          return `https://www.bing.com${decoded}`;
        }
      }
    }

    // 2. Google Tracking Link: /url?q=https://... or url=...
    if (parsed.hostname.includes('google.com') && parsed.pathname.includes('/url')) {
      const target = parsed.searchParams.get('q') || parsed.searchParams.get('url');
      if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
        return target;
      }
    }
  } catch {}
  return rawUrl;
}

/**
 * Core Proxy Request Handler.
 * Shared across Vite dev server, Vite preview server, standalone Express server, and Vercel serverless functions.
 */
export async function handleProxyRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
  let fullUrl = '';
  try {
    const host = req.headers.host || 'localhost:3000';
    const parsedReqUrl = new URL(req.url || '', `http://${host}`);
    const targetUrl = parsedReqUrl.searchParams.get('url');

    if (!targetUrl) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<h3 style="color:#EF4444;font-family:sans-serif;padding:20px;">Desktop Search: No destination specified</h3>');
      return;
    }

    // Normalize and unwrap search redirect URLs (automatically upgrade to https)
    fullUrl = targetUrl.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `https://${fullUrl}`;
    } else if (fullUrl.startsWith('http://') && !fullUrl.includes('localhost') && !fullUrl.includes('127.0.0.1')) {
      fullUrl = fullUrl.replace(/^http:\/\//i, 'https://');
    }
    fullUrl = unwrapSearchRedirectUrl(fullUrl);

    const parsedTarget = new URL(fullUrl);
    const domain = parsedTarget.hostname;

    // Retrieve saved cookies specifically for this target domain
    const savedDomainCookie = cookieJar.get(domain) || '';

    // Read incoming request body (for real live login forms & search posts)
    let requestBody: Buffer | null = null;
    if (req.method === 'POST' || req.method === 'PUT') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      if (chunks.length > 0) {
        requestBody = Buffer.concat(chunks);
      }
    }

    // Construct clean desktop headers without bot-flagging mismatches
    const headersToSend: Record<string, string> = {
      ...PC_DESKTOP_HEADERS,
      ...(savedDomainCookie ? { 'Cookie': savedDomainCookie } : {}),
      'Referer': `${parsedTarget.protocol}//${parsedTarget.host}/`,
    };

    // Pre-seed Google consent cookies to eliminate European GDPR 302 consent redirect loops and blinking
    if (domain.includes('google.com')) {
      const googleConsentCookie = 'SOCS=CAESHAgBEhJnd3NfMjAyNDA5MjQtMF9SQzIaAmVuIAEaBgiA_L22Bg; CONSENT=YES+cb.20230531-04-p0.en+FX+999;';
      headersToSend['Cookie'] = [googleConsentCookie, savedDomainCookie].filter(Boolean).join('; ');
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      headersToSend['Content-Type'] = (req.headers['content-type'] as string) || 'application/x-www-form-urlencoded';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        method: req.method || 'GET',
        headers: headersToSend,
        ...(requestBody ? { body: new Uint8Array(requestBody) } : {}),
        redirect: 'follow',
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      await logBackendError({
        url: fullUrl,
        errorType: 'NETWORK_ERROR',
        errorMessage: fetchErr.message || 'Fetch failed',
        userAgent: PC_DESKTOP_HEADERS['User-Agent'],
      });
      throw fetchErr;
    } finally {
      clearTimeout(timeout);
    }

    // Save Set-Cookie headers for this domain
    const rawSetCookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
    if (rawSetCookies && rawSetCookies.length > 0) {
      const current = cookieJar.get(domain) || '';
      const newCookies = rawSetCookies.map((c) => c.split(';')[0]).join('; ');
      cookieJar.set(domain, [current, newCookies].filter(Boolean).join('; '));
      rawSetCookies.forEach((c) => res.appendHeader('Set-Cookie', c));
    }

    const contentType = response.headers.get('content-type') || 'text/html';

    // Set open CORS and iframe-friendly headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Content-Security-Policy');

    // -----------------------------------------------------------------
    // 1. 403 FORBIDDEN / DATACENTER WAF AUTOMATIC RESIDENTIAL FALLBACK
    // If a site blocks datacenter IP with 403 (e.g. games.co.uk or Cloudflare/AWS WAF),
    // immediately trigger client-side direct loading using the user's mobile residential IP!
    // -----------------------------------------------------------------
    if (response.status === 403 || response.status === 401) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0">
  <title>Desktop Search</title>
</head>
<body style="margin:0;padding:0;background:#121214;overflow:hidden;">
  <script>
    try {
      window.parent.postMessage({ type: 'DESKTOP_DIRECT_FALLBACK', url: ${JSON.stringify(fullUrl)} }, '*');
    } catch(e) {}
    window.location.replace(${JSON.stringify(fullUrl)});
  </script>
</body>
</html>`);
      return;
    }

    // -----------------------------------------------------------------
    // 2. HTML CONTENT HANDLING & GOOGLE 400 / CAPTCHA / CONSENT BYPASS
    // -----------------------------------------------------------------
    if (contentType.includes('text/html')) {
      let html = await response.text();

      // Check if Google returned a 400, 429, captcha, or consent loop
      const isGoogleSearch = fullUrl.includes('google.com/search') || fullUrl.includes('sorry/index') || fullUrl.includes('consent.google.com');
      const isGoogleError =
        isGoogleSearch &&
        (response.status >= 400 ||
          html.includes('400. That') ||
          html.includes('unusual traffic') ||
          html.includes('recaptcha') ||
          html.includes('consent.google.com') ||
          html.includes('malformed or illegal request'));

      if (isGoogleError) {
        const query = parsedTarget.searchParams.get('q') || 'search';
        const bingDesktopUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}&setlang=en`;

        try {
          const fallbackResponse = await fetch(bingDesktopUrl, {
            headers: PC_DESKTOP_HEADERS,
            redirect: 'follow',
          });
          if (fallbackResponse.ok) {
            html = await fallbackResponse.text();
            fullUrl = bingDesktopUrl;
          }
        } catch {
          // Keep current html if fallback fetch fails
        }
      }

      // Check for Sign Up pages blocked by bot protection
      const isSignupUrl = /(github\.com\/(signup|join)|\/signup|\/register|\/join)/i.test(fullUrl);
      const isBotRestricted = html.includes('captcha-delivery.com') || html.includes('Access is temporarily restricted');

      if (isSignupUrl && isBotRestricted) {
        if (fullUrl.includes('github.com')) {
          html = generateGithubSignupHtml(fullUrl);
        } else {
          html = generateGenericSignupHtml(domain, fullUrl);
        }
      }

      // Direct link unwrapping in search engine results to prevent 204 empty responses
      if (html.includes('bing.com/ck/a')) {
        html = html.replace(/href=["']https:\/\/www\.bing\.com\/ck\/a[^"']*(?:&|&amp;)u=([a-zA-Z0-9_-]+)[^"']*["']/g, (match, uParam) => {
          try {
            let cleanU = uParam;
            if (cleanU.startsWith('a1')) cleanU = cleanU.slice(2);
            const base64 = cleanU.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = Buffer.from(base64, 'base64').toString('utf-8');
            if (decoded.startsWith('http')) {
              return `href="${decoded}"`;
            }
          } catch {}
          return match;
        });
      }

      // Buffer heavy PC payload to backend
      await holdHeavyPCSitePayload(fullUrl, html, contentType);

      // Inject base tag, desktop viewport, and authentic browser interaction scripts
      const baseTag = `<base href="${fullUrl}">`;
      const desktopViewportTag = `<meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=5.0">`;
      const injectedScript = `
        <script>
          (function() {
            var hasSynced = false;

            function unwrapClientUrl(url) {
              try {
                var p = new URL(url, window.location.href);
                if (p.hostname.indexOf('bing.com') !== -1 && p.pathname.indexOf('/ck/a') !== -1) {
                  var u = p.searchParams.get('u');
                  if (u) {
                    if (u.indexOf('a1') === 0) u = u.slice(2);
                    var b64 = u.replace(/-/g, '+').replace(/_/g, '/');
                    var decoded = atob(b64);
                    if (decoded.indexOf('http') === 0) return decoded;
                  }
                }
                if (p.hostname.indexOf('google.com') !== -1 && p.pathname.indexOf('/url') !== -1) {
                  var q = p.searchParams.get('q') || p.searchParams.get('url');
                  if (q && q.indexOf('http') === 0) return q;
                }
                return p.href;
              } catch(e) {
                return url;
              }
            }

            function getRealPageUrl() {
              try {
                var p = new URL(window.location.href);
                var u = p.searchParams.get('url');
                return u ? decodeURIComponent(u) : window.location.href;
              } catch(e) {
                return window.location.href;
              }
            }

            function syncUrlToParent() {
              if (hasSynced) return;
              hasSynced = true;
              try {
                var real = getRealPageUrl();
                window.parent.postMessage({ type: 'DESKTOP_URL_SYNC', url: real }, '*');
              } catch(e) {}
            }

            // Real OAuth & Popup handling
            var originalOpen = window.open;
            window.open = function(targetUrl, windowName, windowFeatures) {
              if (targetUrl) {
                var absoluteUrl = targetUrl;
                try {
                  absoluteUrl = new URL(targetUrl, window.location.href).href;
                } catch(e) {}

                var isAuthPattern = /(accounts\\.google\\.com|appleid\\.apple\\.com|login\\.live\\.com|auth0\\.com|oauth2?|authorize)/i;
                if (isAuthPattern.test(absoluteUrl)) {
                  if (originalOpen) {
                    return originalOpen.call(window, absoluteUrl, '_blank');
                  }
                  return window;
                }

                var finalUrl = unwrapClientUrl(absoluteUrl);
                try {
                  window.parent.postMessage({ type: 'DESKTOP_INTERNAL_NAVIGATE', url: finalUrl }, '*');
                } catch(err) {}

                window.location.href = '/api/proxy?url=' + encodeURIComponent(finalUrl);
              }
              return window;
            };

            // Authentic click interceptor
            document.addEventListener('click', function(e) {
              var target = e.target.closest('a, button, [role="button"]');
              if (!target) return;

              var href = target.getAttribute('href') || target.href || '';

              // 1. REAL GOOGLE / OAUTH AUTHENTICATION:
              // If link is a dedicated OAuth authorization URL (with client_id or parameters),
              // open it natively so the user can select their real Google email
              var isRealOAuth = /(accounts\\.google\\.com\\/o\\/oauth2|appleid\\.apple\\.com|login\\.live\\.com|auth0\\.com)/i.test(href);
              if (isRealOAuth) {
                e.preventDefault();
                e.stopPropagation();
                if (originalOpen) {
                  originalOpen.call(window, href, '_blank');
                } else {
                  window.open(href, '_blank');
                }
                return;
              }

              // 2. FULL DOWNLOAD ACCESS:
              // If user taps a download link (apk, zip, exe, dmg, pdf, unitypackage, etc.),
              // trigger native browser download prompt directly
              var a = target.tagName === 'A' ? target : target.closest('a');
              if (a && a.href) {
                var rawHref = a.getAttribute('href') || a.href;
                if (!rawHref.startsWith('javascript:') && !rawHref.startsWith('#')) {
                  var destination = unwrapClientUrl(a.href);
                  var isDownload =
                    target.hasAttribute('download') ||
                    a.hasAttribute('download') ||
                    /\\.(apk|zip|rar|7z|tar|gz|tgz|exe|msi|dmg|pkg|deb|rpm|pdf|doc|docx|xls|xlsx|ppt|pptx|iso|unitypackage|blend|epub|mp3|mp4|mov|avi)$/i.test(destination);

                  if (isDownload) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (originalOpen) {
                      originalOpen.call(window, destination, '_blank');
                    } else {
                      window.open(destination, '_blank');
                    }
                    return;
                  }

                  // 3. CONTINUOUS IN-BROWSER NAVIGATION:
                  // Tell parent the address changed so Omnibox updates immediately,
                  // and navigate iframe to destination without double-reloading or white screen
                  e.preventDefault();
                  e.stopPropagation();
                  try {
                    window.parent.postMessage({ type: 'DESKTOP_INTERNAL_NAVIGATE', url: destination }, '*');
                  } catch(err) {}
                  window.location.href = '/api/proxy?url=' + encodeURIComponent(destination);
                }
              }
            }, true);

            // 4. IN-PAGE SEARCH AND FORM SUBMISSION:
            document.addEventListener('submit', function(e) {
              var form = e.target;
              if (!form || form.tagName !== 'FORM') return;

              var method = (form.method || 'GET').toUpperCase();
              var action = form.getAttribute('action') || window.location.href;
              var resolvedAction = new URL(action, window.location.href).href;

              if (method === 'GET') {
                e.preventDefault();
                var formData = new FormData(form);
                var params = new URLSearchParams();
                for (var pair of formData.entries()) {
                  if (typeof pair[1] === 'string') {
                    params.append(pair[0], pair[1]);
                  }
                }
                var fullTarget = resolvedAction + (resolvedAction.includes('?') ? '&' : '?') + params.toString();
                var dest = unwrapClientUrl(fullTarget);
                try {
                  window.parent.postMessage({ type: 'DESKTOP_INTERNAL_NAVIGATE', url: dest }, '*');
                } catch(err) {}
                window.location.href = '/api/proxy?url=' + encodeURIComponent(dest);
              }
            }, true);

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', syncUrlToParent);
            } else {
              syncUrlToParent();
            }

            window.addEventListener('load', syncUrlToParent);
          })();
        </script>
      `;

      const injection = `${baseTag}${desktopViewportTag}${injectedScript}`;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${injection}`);
      } else {
        html = `${injection}${html}`;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(html);
    } else {
      // Binary and Asset handling (e.g. downloads, Unity assets, 3D models, JS, CSS, fonts)
      const buffer = Buffer.from(await response.arrayBuffer());

      // Forward native Content-Disposition for real Chrome downloads
      const originalDisposition = response.headers.get('content-disposition');
      if (originalDisposition) {
        res.setHeader('Content-Disposition', originalDisposition);
      } else {
        const isDownloadable = /\.(apk|zip|rar|7z|tar|gz|tgz|exe|msi|dmg|pkg|deb|rpm|pdf|doc|docx|xls|xlsx|ppt|pptx|iso|unitypackage|blend|epub)$/i.test(fullUrl);
        if (isDownloadable) {
          const filename = fullUrl.split('/').pop()?.split('?')[0] || 'download';
          res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        }
      }

      const isUnityOrDevAsset =
        /\.(unitypackage|unity3d|bundle|wasm|glb|gltf|fbx|obj|zip)$/i.test(fullUrl) ||
        fullUrl.includes('assetstore.unity.com') ||
        fullUrl.includes('unity3d.com') ||
        contentType.includes('application/octet-stream') ||
        contentType.includes('application/wasm');

      if (isUnityOrDevAsset) {
        const urlParts = fullUrl.split('/');
        const assetFileName = urlParts[urlParts.length - 1].split('?')[0] || 'unity-asset';
        storeUnityAsset({
          assetName: assetFileName,
          assetUrl: fullUrl,
          assetType: contentType,
          fileSize: buffer.length,
          metadata: {
            domain,
            heldAt: new Date().toISOString(),
          },
        }).catch(() => {});
      }

      res.statusCode = response.status;
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.end(buffer);
    }
  } catch (err: any) {
    if (fullUrl) {
      await logBackendError({
        url: fullUrl,
        errorType: 'NETWORK_ERROR',
        errorMessage: err.message,
        userAgent: PC_DESKTOP_HEADERS['User-Agent'],
      });
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    const errorMsg = err.message || 'Connecting to destination...';
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta name="viewport" content="width=1280, initial-scale=1.0">
        <title>Desktop Search</title>
        <style>
          body { margin: 0; padding: 40px; background: #121214; color: #F4F4F5; font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
          .card { background: #1E1E22; border: 1px solid #2D2D33; border-radius: 20px; padding: 36px; max-width: 520px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
          h2 { color: #EF4444; margin: 0 0 12px 0; font-size: 22px; font-weight: 700; }
          p { color: #A1A1AA; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; }
          .btn { display: inline-block; background: #D32F2F; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; text-decoration: none; }
          .btn:hover { background: #E53935; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Desktop Search PC Engine</h2>
          <p>Rendering destination in full desktop workstation view.<br><span style="color:#71717A;font-size:12px;">Notice: ${errorMsg}</span></p>
          <button onclick="window.location.reload()" class="btn">Retry Loading</button>
        </div>
      </body>
      </html>
    `);
  }
}
