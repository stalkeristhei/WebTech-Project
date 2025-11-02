// Centralized Supabase initializer
// Usage: import { getSupabase, setSupabaseConfig } from './js/supabase-init.js'
// Call getSupabase() to obtain a ready-to-use Supabase client.

export async function getSupabase() {
  if (window.supabaseClient) return window.supabaseClient;

  // Try multiple config locations: global window.__SUPABASE__, localStorage
  // Prefer explicit config object, otherwise read the standard localStorage keys
  // Tolerant wait: sometimes a page includes a module that runs slightly before a dev's `config.js` executes —
  // poll briefly for config to appear to reduce flaky "not found" errors.
  const maxWaitMs = 800; // total wait time
  const intervalMs = 50;
  let waited = 0;
  let supabaseUrl = null;
  let supabaseKey = null;

  while (waited <= maxWaitMs) {
    const cfg = window.__SUPABASE__ || {};
    supabaseUrl = cfg.url || localStorage.getItem('SUPABASE_URL');
    supabaseKey = cfg.key || localStorage.getItem('SUPABASE_KEY');
    if (supabaseUrl && supabaseKey) break;
    // small sleep
    // eslint-disable-next-line no-await-in-loop
    await new Promise(r => setTimeout(r, intervalMs));
    waited += intervalMs;
  }

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration not found. Set window.__SUPABASE__ or localStorage keys SUPABASE_URL and SUPABASE_KEY.');
  }

  // Dynamically import the ESM build from CDN
  const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
  const { createClient } = mod;
  window.supabaseClient = createClient(supabaseUrl, supabaseKey);
  return window.supabaseClient;
}

export function setSupabaseConfig(url, key, persist = false) {
  window.__SUPABASE__ = { url, key };
  if (persist) {
    localStorage.setItem('SUPABASE_URL', url);
    localStorage.setItem('SUPABASE_KEY', key);
  }
}

// Optional helper used by pages that want to check availability quickly
export function hasSupabaseConfig() {
  const cfg = window.__SUPABASE__ || {};
  return Boolean(cfg.url || localStorage.getItem('SUPABASE_URL')) && Boolean(cfg.key || localStorage.getItem('SUPABASE_KEY'));
}
