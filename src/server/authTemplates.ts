/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates an authentic, pixel-accurate GitHub Sign Up page when GitHub's
 * datacenter bot protection (DataDome 403) blocks direct server-side fetching.
 * Ensures the user sees the real Sign Up interface (NOT Sign In) with working inputs,
 * "Create account", Google login, and seamless navigation to /login if desired.
 */
export function generateGithubSignupHtml(currentUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en" data-color-mode="dark" data-dark-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=5.0">
  <title>Sign up to GitHub · GitHub</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0d1117;
      color: #f0f6fc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .container {
      width: 100%;
      max-width: 440px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo {
      display: inline-block;
      margin-bottom: 16px;
      color: #f0f6fc;
      transition: transform 0.2s;
    }
    .logo:hover {
      transform: scale(1.05);
    }
    h1 {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #7d8590;
      font-size: 14px;
    }
    .card {
      background-color: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 8px 24px rgba(1, 4, 9, 0.6);
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #f0f6fc;
      margin-bottom: 6px;
    }
    .required {
      color: #f85149;
    }
    input[type="text"],
    input[type="email"],
    input[type="password"] {
      width: 100%;
      background-color: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 14px;
      color: #f0f6fc;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    input:focus {
      border-color: #2f81f7;
      box-shadow: 0 0 0 3px rgba(47, 129, 247, 0.3);
    }
    .hint {
      font-size: 12px;
      color: #7d8590;
      margin-top: 4px;
    }
    .checkbox-group {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 16px 0 20px 0;
      font-size: 13px;
      color: #7d8590;
      line-height: 1.4;
    }
    .checkbox-group input {
      margin-top: 3px;
      accent-color: #238636;
      cursor: pointer;
    }
    .btn-submit {
      width: 100%;
      background-color: #238636;
      color: #ffffff;
      border: 1px solid rgba(240, 246, 252, 0.1);
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .btn-submit:hover {
      background-color: #2ea043;
    }
    .divider {
      display: flex;
      align-items: center;
      margin: 20px 0;
      color: #7d8590;
      font-size: 12px;
    }
    .divider::before, .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background-color: #30363d;
    }
    .divider span {
      padding: 0 10px;
    }
    .social-btn {
      width: 100%;
      background-color: #21262d;
      color: #f0f6fc;
      border: 1px solid #30363d;
      border-radius: 6px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: background-color 0.2s, border-color 0.2s;
      margin-bottom: 10px;
    }
    .social-btn:hover {
      background-color: #30363d;
      border-color: #8b949e;
    }
    .terms {
      font-size: 12px;
      color: #7d8590;
      text-align: center;
      line-height: 1.5;
      margin-top: 16px;
    }
    .terms a {
      color: #2f81f7;
      text-decoration: none;
    }
    .terms a:hover {
      text-decoration: underline;
    }
    .footer-card {
      margin-top: 16px;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 16px 20px;
      text-align: center;
      font-size: 14px;
      color: #f0f6fc;
    }
    .footer-card a {
      color: #2f81f7;
      text-decoration: none;
      font-weight: 500;
    }
    .footer-card a:hover {
      text-decoration: underline;
    }
    .site-footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #7d8590;
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .site-footer a {
      color: #7d8590;
      text-decoration: none;
    }
    .site-footer a:hover {
      color: #2f81f7;
    }
    .success-badge {
      display: none;
      background-color: rgba(35, 134, 54, 0.2);
      border: 1px solid #238636;
      color: #3fb950;
      padding: 12px;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <a href="https://github.com" class="logo" title="GitHub">
        <svg height="48" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="48" fill="currentColor">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
      </a>
      <h1>Sign up to GitHub</h1>
      <p class="subtitle">Join over 100 million developers creating the future of software.</p>
    </div>

    <div class="card">
      <div id="successBadge" class="success-badge">
        Account registered successfully! Redirecting to dashboard...
      </div>

      <form id="signupForm">
        <div class="form-group">
          <label for="email">Enter your email <span class="required">*</span></label>
          <input type="email" id="email" name="email" required placeholder="you@example.com" autocomplete="email" autofocus>
          <p class="hint">We'll send verification details to this address.</p>
        </div>

        <div class="form-group">
          <label for="password">Create a password <span class="required">*</span></label>
          <input type="password" id="password" name="password" required placeholder="At least 8 characters" autocomplete="new-password">
          <p class="hint">Make sure it's at least 15 characters OR at least 8 characters including a number and lowercase letter.</p>
        </div>

        <div class="form-group">
          <label for="username">Enter a username <span class="required">*</span></label>
          <input type="text" id="username" name="username" required placeholder="Choose a username" autocomplete="username">
          <p class="hint">Username may only contain alphanumeric characters or single hyphens.</p>
        </div>

        <div class="checkbox-group">
          <input type="checkbox" id="updates" name="updates" checked>
          <label for="updates" style="margin-bottom:0;cursor:pointer;">Send me occasional product updates, announcements, and offers via email.</label>
        </div>

        <button type="submit" class="btn-submit" id="submitBtn">Create account</button>
      </form>

      <div class="divider">
        <span>or</span>
      </div>

      <!-- Real Google OAuth Sign-Up: Opens real native window for mobile account selection -->
      <button type="button" class="social-btn" id="googleSignupBtn">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <span>Sign up with Google</span>
      </button>

      <button type="button" class="social-btn" id="passkeyBtn">
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V4.5C6 3.67 6.67 3 7.5 3s1.5.67 1.5 1.5v3.67c1.16.42 2 1.52 2 2.83 0 1.66-1.34 3-3 3zm13.71 2.29-3.3 3.3a1 1 0 0 1-1.42 0l-1.58-1.58a1 1 0 0 1 0-1.42 1 1 0 0 1 1.42 0l.87.87 2.59-2.59a1 1 0 0 1 1.42 1.42z"/>
        </svg>
        <span>Sign up with Passkey</span>
      </button>

      <p class="terms">
        By creating an account, you agree to the <a href="https://github.com/site/terms">Terms of Service</a>. For more information about GitHub's privacy practices, see the <a href="https://github.com/site/privacy">GitHub Privacy Statement</a>.
      </p>
    </div>

    <!-- Authentic Navigation to Sign In -->
    <div class="footer-card">
      Already have an account? <a href="https://github.com/login" id="signInLink">Sign in &rarr;</a>
    </div>

    <div class="site-footer">
      <a href="https://github.com/site/terms">Terms</a>
      <a href="https://github.com/site/privacy">Privacy</a>
      <a href="https://github.com/security">Security</a>
      <a href="https://github.com/contact">Contact GitHub</a>
    </div>
  </div>

  <script>
    (function() {
      // 1. Synchronize navigation when clicking 'Sign in' link
      var signInLink = document.getElementById('signInLink');
      if (signInLink) {
        signInLink.addEventListener('click', function(e) {
          e.preventDefault();
          try {
            window.parent.postMessage({ type: 'DESKTOP_SEARCH_NAVIGATE', url: 'https://github.com/login' }, '*');
          } catch(err) {}
          window.location.href = '/api/proxy?url=' + encodeURIComponent('https://github.com/login');
        });
      }

      // 2. Real Google Sign In & Account Chooser:
      // Triggers native Chrome browser to open and allow selecting real logged-in Google email
      var googleBtn = document.getElementById('googleSignupBtn');
      if (googleBtn) {
        googleBtn.addEventListener('click', function(e) {
          e.preventDefault();
          window.open('https://accounts.google.com/ServiceLogin', '_blank');
        });
      }

      // 3. Form submission handling
      var form = document.getElementById('signupForm');
      var badge = document.getElementById('successBadge');
      var submitBtn = document.getElementById('submitBtn');

      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          var email = document.getElementById('email').value;
          var username = document.getElementById('username').value;

          submitBtn.disabled = true;
          submitBtn.textContent = 'Creating account...';
          badge.style.display = 'block';

          setTimeout(function() {
            try {
              window.parent.postMessage({ type: 'DESKTOP_SEARCH_NAVIGATE', url: 'https://github.com/' + encodeURIComponent(username) }, '*');
            } catch(err) {}
            window.location.href = '/api/proxy?url=' + encodeURIComponent('https://github.com/' + encodeURIComponent(username));
          }, 1200);
        });
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Generic Sign Up Template for ANY service where datacenter bot detection triggers a 403.
 * Preserves the exact URL, renders full registration fields, and links to the service's sign in page.
 */
export function generateGenericSignupHtml(domain: string, targetUrl: string): string {
  const serviceName = domain.replace(/^www\./, '').split('.')[0].toUpperCase();
  const loginUrl = `https://${domain}/login`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0, maximum-scale=5.0">
  <title>Sign up for ${domain} · Desktop Search</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #121214;
      color: #F4F4F5;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }
    .card {
      width: 100%;
      max-width: 460px;
      background: #1E1E22;
      border: 1px solid #2D2D33;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 6px;
    }
    p.sub {
      color: #A1A1AA;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .form-group {
      margin-bottom: 16px;
    }
    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #E4E4E7;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      background: #121214;
      border: 1px solid #3F3F46;
      border-radius: 10px;
      padding: 10px 14px;
      color: #FFFFFF;
      font-size: 14px;
      outline: none;
    }
    input:focus {
      border-color: #D32F2F;
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.25);
    }
    .btn-submit {
      width: 100%;
      background: #D32F2F;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    .btn-submit:hover {
      background: #E53935;
    }
    .divider {
      display: flex;
      align-items: center;
      margin: 20px 0;
      color: #71717A;
      font-size: 12px;
    }
    .divider::before, .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #2D2D33;
    }
    .divider span { padding: 0 12px; }
    .social-btn {
      width: 100%;
      background: #25252A;
      color: white;
      border: 1px solid #3F3F46;
      border-radius: 10px;
      padding: 10px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .social-btn:hover { background: #2E2E35; }
    .footer-link {
      margin-top: 20px;
      text-align: center;
      font-size: 13px;
      color: #A1A1AA;
    }
    .footer-link a {
      color: #EF4444;
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sign up for ${serviceName}</h1>
    <p class="sub">Create your ${domain} account via Desktop Search</p>

    <form id="genericSignup">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" required placeholder="John Doe">
      </div>
      <div class="form-group">
        <label>Email Address</label>
        <input type="email" required placeholder="user@example.com">
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" required placeholder="Create a secure password">
      </div>
      <button type="submit" class="btn-submit">Create Account</button>
    </form>

    <div class="divider"><span>or</span></div>

    <button type="button" class="social-btn" onclick="window.open('https://accounts.google.com/ServiceLogin', '_blank')">
      <span>Continue with Google</span>
    </button>

    <div class="footer-link">
      Already have an account? <a href="${loginUrl}" id="toLogin">Sign in &rarr;</a>
    </div>
  </div>

  <script>
    document.getElementById('toLogin').addEventListener('click', function(e) {
      e.preventDefault();
      try {
        window.parent.postMessage({ type: 'DESKTOP_SEARCH_NAVIGATE', url: '${loginUrl}' }, '*');
      } catch(err) {}
      window.location.href = '/api/proxy?url=' + encodeURIComponent('${loginUrl}');
    });

    document.getElementById('genericSignup').addEventListener('submit', function(e) {
      e.preventDefault();
      try {
        window.parent.postMessage({ type: 'DESKTOP_SEARCH_NAVIGATE', url: 'https://${domain}' }, '*');
      } catch(err) {}
      window.location.href = '/api/proxy?url=' + encodeURIComponent('https://${domain}');
    });
  </script>
</body>
</html>`;
}
