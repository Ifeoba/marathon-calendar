const SUPABASE_URL = "https://dehujknpnlzumxhebhlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlaHVqa25wbmx6dW14aGViaGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTE3NzEsImV4cCI6MjA5NDI2Nzc3MX0.pmx9BF5go7KuJpMDMCdot3SyZF5QTLc1ctjN1ehQFx0";

try {
    if (typeof supabase === "undefined" || typeof supabase.createClient !== "function") {
        throw new Error("Supabase library did not load — check the CDN script tag.");
    }
    window._supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("[Supabase] client ready:", SUPABASE_URL);
} catch (e) {
    console.error("[Supabase] init failed:", e);
    window._supabaseError = e.message;
}
