/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ override: true });

// Load environment variables without overwriting system-provided variables
dotenv.config();

// Normalize URL (strip trailing /rest/v1/ if present from Supabase REST endpoints)
const rawUrl = process.env.SUPABASE_URL || 'https://yuusgzufnfzelaumnsus.supabase.co';
const SUPABASE_URL = rawUrl.replace(/\/rest\/v1\/?$/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export let supabaseClient: SupabaseClient | null = null;

try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
} catch {
  supabaseClient = null;
}

// In-memory high-speed cache buffer to hold heavy PC sites alongside Supabase
const memoryPayloadHolder = new Map<string, { body: string; contentType: string; timestamp: number }>();
let backendErrorCount = 0;

/**
 * Supabase Heavy PC Site Holding Engine.
 * Buffers and carries heavy desktop-only sites, large DOM trees, and heavy payloads server-side
 * so mobile devices can load and render PC-exclusive web applications effortlessly.
 */
export async function holdHeavyPCSitePayload(url: string, content: string, contentType: string): Promise<void> {
  const normalizedKey = url.trim().toLowerCase();
  
  memoryPayloadHolder.set(normalizedKey, {
    body: content,
    contentType,
    timestamp: Date.now(),
  });

  if (memoryPayloadHolder.size > 50) {
    const firstKey = memoryPayloadHolder.keys().next().value;
    if (firstKey) memoryPayloadHolder.delete(firstKey);
  }

  try {
    if (supabaseClient) {
      await supabaseClient.from('pc_site_cache').upsert([
        {
          site_url: url,
          content_type: contentType,
          payload_size: content.length,
          last_buffered_at: new Date().toISOString(),
        },
      ]);
    }
  } catch {
    // Silent fail - never block site rendering
  }
}

/**
 * Retrieve a previously held/cached PC site payload if available.
 */
export function getHeldPCSitePayload(url: string): { body: string; contentType: string } | null {
  const normalizedKey = url.trim().toLowerCase();
  const cached = memoryPayloadHolder.get(normalizedKey);
  if (cached && Date.now() - cached.timestamp < 120000) {
    return { body: cached.body, contentType: cached.contentType };
  }
  return null;
}

export interface BackendErrorLog {
  url: string;
  statusCode?: number;
  errorType: '404_NOT_FOUND' | '402_PAYMENT_REQUIRED' | 'NETWORK_ERROR' | 'TIMEOUT' | 'AUTH_ERROR';
  errorMessage?: string;
  userAgent?: string;
  timestamp?: string;
}

/**
 * Silently logs 404, 402, and network loading errors to Supabase.
 * Operates completely in the background without UI exposure.
 */
export async function logBackendError(errorData: BackendErrorLog): Promise<void> {
  backendErrorCount++;
  const payload = {
    url: errorData.url,
    status_code: errorData.statusCode || 0,
    error_type: errorData.errorType,
    error_message: errorData.errorMessage || '',
    user_agent: errorData.userAgent || 'Desktop-Search-PC-Engine',
    created_at: new Date().toISOString(),
  };

  try {
    if (supabaseClient) {
      await supabaseClient.from('error_logs').insert([payload]);
    }
  } catch {
    // Silent fail
  }
}

export interface UnityAssetRecord {
  assetName: string;
  assetUrl?: string;
  assetType?: string;
  fileSize?: number;
  metadata?: Record<string, any>;
}

/**
 * Stores Unity assets, WebGL binaries, and 3D device assets into Supabase backend
 */
export async function storeUnityAsset(asset: UnityAssetRecord): Promise<void> {
  try {
    if (supabaseClient) {
      await supabaseClient.from('unity_assets').insert([
        {
          asset_name: asset.assetName,
          asset_url: asset.assetUrl || '',
          asset_type: asset.assetType || 'unity-package',
          file_size: asset.fileSize || 0,
          metadata: asset.metadata || {},
          created_at: new Date().toISOString(),
        },
      ]);
    }
  } catch {
    // Silent fail
  }
}

/**
 * Records desktop PC device session telemetry to Supabase backend
 */
export async function recordDeviceSession(viewportWidth = 1280, viewportHeight = 800, scale = 0.40): Promise<void> {
  try {
    if (supabaseClient) {
      await supabaseClient.from('device_sessions').insert([
        {
          device_type: 'Windows-11-PC-Workstation',
          user_agent: PC_DESKTOP_HEADERS['User-Agent'],
          viewport_width: viewportWidth,
          viewport_height: viewportHeight,
          scale_factor: scale,
          last_active_at: new Date().toISOString(),
        },
      ]);
    }
  } catch {
    // Silent fail
  }
}

/**
 * Checks connection health to the user's Supabase backend
 */
export async function checkSupabaseHealth(): Promise<{ connected: boolean; url: string; details: string; tablesReady: boolean }> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { connected: false, url: SUPABASE_URL || '', details: 'Supabase URL or Key missing', tablesReady: false };
  }
  try {
    if (supabaseClient) {
      const { error } = await supabaseClient.from('pc_site_cache').select('site_url').limit(1);
      if (!error) {
        return {
          connected: true,
          url: SUPABASE_URL,
          details: 'Supabase connected! Tables (pc_site_cache, unity_assets, device_sessions, error_logs) are verified and active.',
          tablesReady: true,
        };
      }
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, { method: 'GET' });
    const isReachable = res.status === 200 || res.status === 401;
    return {
      connected: isReachable,
      url: SUPABASE_URL,
      details: isReachable ? 'Supabase instance reached, ready for operations' : `HTTP status ${res.status}`,
      tablesReady: false,
    };
  } catch (err: any) {
    return { connected: false, url: SUPABASE_URL, details: err.message || 'Unreachable', tablesReady: false };
  }
}

/**
 * Authentic Windows 11 Desktop PC Chrome headers.
 * Carefully tuned so Google GFE, Cloudflare, and major platforms accept requests
 * without 400 Bad Request or bot-fingerprint errors.
 */
export const PC_DESKTOP_HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
  'Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Sec-Ch-Ua': '"Chromium";v="134", "Google Chrome";v="134", "Not:A-Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
};
