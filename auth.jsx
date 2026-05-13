// ============================================================
// Marathon Foundation Calendar — Auth screen
// ============================================================

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "verify"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => { setMode(m); setError(""); };

  async function handleSignUp(e) {
    e.preventDefault();
    if (!username || !email || !password) { setError("Please fill in all fields."); return; }
    if (username.trim().length < 2) { setError("Username must be at least 2 characters."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    const { error: err } = await window._supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username: username.trim() },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setMode("verify");
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError(""); setLoading(true);
    const { data, error: err } = await window._supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    onAuth(data.user);
  }

  if (mode === "verify") {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-glyph" />
            <div>
              <div className="auth-brand-name">MARATHON</div>
              <div className="auth-brand-sub">Lagos · 2027</div>
            </div>
          </div>

          <div className="auth-verify-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor">
              <rect x="4" y="10" width="40" height="28" rx="4" strokeWidth="2.5" />
              <path d="M4 16l20 13 20-13" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-body">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then come back to log in.
          </p>
          <button
            className="cta primary"
            style={{ width: "100%", marginTop: 8 }}
            onClick={() => switchMode("login")}
          >
            Back to log in
          </button>
        </div>
      </div>
    );
  }

  const isSignup = mode === "signup";

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-glyph" />
          <div>
            <div className="auth-brand-name">FOUNDATION</div>
            <div className="auth-brand-sub">Lagos · 2027</div>
          </div>
        </div>

        <h1 className="auth-title">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>
        <p className="auth-body">
          {isSignup
            ? "Start your 12-week marathon prep."
            : "Log in to your training plan."}
        </p>

        <div className="auth-tabs">
          <button
            className={!isSignup ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Log in
          </button>
          <button
            className={isSignup ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={isSignup ? handleSignUp : handleLogin}>
          <div className="auth-fields">
            {isSignup && (
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            )}
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="auth-input-wrap">
              <input
                className="auth-input auth-input-pw"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="cta accent"
            style={{ width: "100%", marginTop: 12 }}
            disabled={loading}
          >
            {loading
              ? "Please wait…"
              : isSignup
              ? "Create account"
              : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}

window.AuthScreen = AuthScreen;
