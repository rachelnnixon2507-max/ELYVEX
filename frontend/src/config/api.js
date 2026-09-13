/**
 * ==============================================================================
 * Elyvex Echo Hub - Centralized API Configuration & Universal HTTP Client
 * ==============================================================================
 * 
 * Automatically manages:
 * 1. Environment-based base URL resolution (Localhost dev proxy vs Live Render backend)
 * 2. URL normalization (removes trailing slashes, auto-appends /api if needed)
 * 3. Safe response parsing (verifies application/json before parsing, eliminates HTML 404 syntax errors)
 * 4. Resilient handling for Render free tier cold-starts
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

  // Development defaults to relative '/api' proxied by Vite to http://localhost:5001
  return '/api';
}

export const API_BASE = getApiBaseUrl();

/**
 * Universal safe API fetch wrapper
 * @param {string} endpoint - e.g. '/help-requests', '/chat', or '/health'
 * @param {RequestInit} [options] - Standard fetch options
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

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers
    });

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
          helpfulMessage = `Backend API unreachable (${res.status} ${res.status === 405 ? 'Method Not Allowed' : 'Not Found'}). The request went to Vercel instead of your live Render backend. Please set VITE_API_URL in your Vercel Project Settings (e.g. https://your-app.onrender.com/api) and redeploy on Vercel.`;
        } else if (res.status === 502 || res.status === 503) {
          helpfulMessage = `Backend server is starting up or temporarily unavailable (${res.status}). Free Render instances take ~30-50s to wake up on first request.`;
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
    console.error(`[API] Network failure while contacting ${fullUrl}:`, netErr);
    return {
      ok: false,
      status: 0,
      error: `Unable to connect to Echo Hub backend (${netErr.message || 'Network Error'}). If hosted on Render, the instance may be spinning up.`
    };
  }
}
