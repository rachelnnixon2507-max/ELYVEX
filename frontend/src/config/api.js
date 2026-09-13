/**
 * ==============================================================================
 * Elyvex Echo Hub - Centralized API Configuration & Universal HTTP Client
 * ==============================================================================
 * 
 * Automatically manages:
 * 1. Environment-based base URL resolution (Localhost dev proxy, Live Render, or Vercel API)
 * 2. URL normalization (removes trailing slashes, auto-appends /api if needed)
 * 3. Safe response parsing (verifies application/json before parsing, eliminates HTML 404 syntax errors)
 * 4. Request timeout protection via AbortController (prevents infinite hanging)
 * 5. Resilient handling for Render free tier cold-starts
 */

export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, ''); // Strip trailing slashes
    // If user specified 'https://elyvex.onrender.com' without '/api', append it
    if (!clean.endsWith('/api') && !clean.includes('/api/')) {
      clean = `${clean}/api`;
    }
    return clean;
  }

  // In production if VITE_API_URL not specified, relative '/api' calls same origin (Vercel Serverless Functions)
  // In development Vite proxies '/api' to http://localhost:5001
  return '/api';
}

export const API_BASE = getApiBaseUrl();

/**
 * Universal safe API fetch wrapper with timeout & auto-diagnostics
 * @param {string} endpoint - e.g. '/help-requests', '/chat', or '/health'
 * @param {RequestInit & { timeout?: number }} [options] - Standard fetch options + timeout (ms)
 * @returns {Promise<{ ok: boolean, status: number, data?: any, error?: string }>}
 */
export async function apiFetch(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = cleanEndpoint.startsWith('http') ? cleanEndpoint : `${API_BASE}${cleanEndpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const timeoutMs = options.timeout || 25000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    let responseData = null;

    if (contentType.includes('application/json')) {
      try {
        responseData = await res.json();
      } catch (parseErr) {
        console.warn('[API] Failed to parse JSON response body:', parseErr);
        responseData = null;
      }
    } else {
      const rawText = await res.text();
      if (!res.ok) {
        let helpfulMessage = `Server error (${res.status})`;
        if (res.status === 404 || res.status === 405) {
          helpfulMessage = `Backend API endpoint not found (${res.status}). If using a separate Render backend, ensure VITE_API_URL is configured in your Vercel Project Settings (e.g. https://your-app.onrender.com/api) and redeploy.`;
        } else if (res.status === 502 || res.status === 503) {
          helpfulMessage = `Backend server is starting up or temporarily unavailable (${res.status}). Free Render instances take ~30-50s to wake up on the first request.`;
        } else if (rawText && rawText.length < 160) {
          helpfulMessage = rawText;
        }
        return {
          ok: false,
          status: res.status,
          error: helpfulMessage
        };
      }
    }

    if (!res.ok || (responseData && responseData.ok === false)) {
      const errorMsg = responseData?.error || responseData?.message || `Request failed with status ${res.status}`;
      return {
        ok: false,
        status: res.status,
        data: responseData,
        error: errorMsg
      };
    }

    return {
      ok: true,
      status: res.status,
      data: responseData
    };
  } catch (netErr) {
    clearTimeout(timeoutId);
    if (netErr.name === 'AbortError') {
      console.warn(`[API] Request timed out after ${timeoutMs}ms:`, fullUrl);
      return {
        ok: false,
        status: 408,
        error: `Transmission timed out (>25s). If hosted on Render free tier, the server may have been sleeping. Please click Retry.`
      };
    }

    console.error(`[API] Network failure while contacting ${fullUrl}:`, netErr);
    return {
      ok: false,
      status: 0,
      error: `Unable to reach Echo Hub backend (${netErr.message || 'Network Error'}). Please check your connection or retry.`
    };
  }
}
