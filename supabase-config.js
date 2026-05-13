// ── Supabase credentials ──────────────────────────────────────────────────────
// 1. Go to https://supabase.com/dashboard → your project → Settings → API
// 2. Replace the two values below with your Project URL and anon/public key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL     = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
