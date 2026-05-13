// ── Supabase credentials ──────────────────────────────────────────────────────
// 1. Go to https://supabase.com/dashboard → your project → Settings → API
// 2. Replace the two values below with your Project URL and anon/public key
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://dehuqknpnlzumxhebhlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaHVqa25wbmx6dW14aGViaGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTE3NzEsImV4cCI6MjA5NDI2Nzc3MX0.pmx9BF5go7KuJpMDMCdot3SyZF5QTLc1ctjN1ehQFx0";

window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
