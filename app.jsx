// ============================================================
// Marathon Foundation Calendar — root app (Performance theme)
// ============================================================

const STORAGE_KEY_PREFIX = "marathon-foundation-v2";

const DEFAULT_STATE = {
  completed: {},
  feelings: {},
  notes: {},
};

function getStorageKey(userId) {
  return `${STORAGE_KEY_PREFIX}-${userId}`;
}

function loadUserState(userId) {
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (_) {
    return DEFAULT_STATE;
  }
}

// ─────── Tweaks ───────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "volt",
  "font": "cera",
  "startDate": "2026-05-12"
}/*EDITMODE-END*/;

const FONT_STACKS = {
  cera:    '"Cera Pro", "Mona Sans", "Manrope", "DM Sans", system-ui, sans-serif',
  mona:    '"Mona Sans", "Cera Pro", "Manrope", system-ui, sans-serif',
  manrope: '"Manrope", "Cera Pro", system-ui, sans-serif',
  dm:      '"DM Sans", "Cera Pro", system-ui, sans-serif',
};

const ACCENT_PALETTES = {
  volt:   { accent: "#D9FF3D", ink:  "#0E1700" },
  orange: { accent: "#FF5C1F", ink:  "#FFFFFF" },
  pink:   { accent: "#FF3D88", ink:  "#FFFFFF" },
  cyan:   { accent: "#3DFFD2", ink:  "#0A1F1A" },
  red:    { accent: "#FF3D3D", ink:  "#FFFFFF" },
};

function parseISO(iso) {
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  return new Date(+m[1], +m[2] - 1, +m[3]);
}
function toISO(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}

function App() {
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);

  // ── Auth ─────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    window._supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = window._supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Per-user workout state ─────────────────────────
  const [state, setState] = useState(DEFAULT_STATE);
  // Ref guard: prevents saving DEFAULT_STATE while we're loading from storage.
  const loadedForUserRef = useRef(null);

  useEffect(() => {
    if (!user) {
      loadedForUserRef.current = null;
      setState(DEFAULT_STATE);
      return;
    }
    loadedForUserRef.current = user.id;
    setState(loadUserState(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (!user || loadedForUserRef.current !== user.id) return;
    try {
      localStorage.setItem(getStorageKey(user.id), JSON.stringify(state));
    } catch (_) {}
  }, [state]);

  // ── Tweaks ────────────────────────────────────────
  const [tab, setTab] = useState("today");
  const [detailId, setDetailId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const parsed = parseISO(t.startDate) || new Date(2026, 4, 12);
    setPlanStart(parsed);
  }, [t.startDate]);

  const [openWeek, setOpenWeek] = useState(0);
  useEffect(() => {
    setOpenWeek(currentWeekIndex(today));
  }, [today, t.startDate]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", t.theme || "light");
    const font = FONT_STACKS[t.font] || FONT_STACKS.cera;
    root.style.setProperty("--sans", font);
    root.style.setProperty("--display", font);
    const palette = ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.volt;
    root.style.setProperty("--accent", palette.accent);
    root.style.setProperty("--accent-ink", palette.ink);
    const themeCol = t.theme === "dark" ? "#060606" : "#F2F2EF";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeCol);
  }, [t]);

  // ── Actions ───────────────────────────────────────
  const actions = useMemo(() => ({
    toggleComplete(id) {
      setState(s => ({
        ...s,
        completed: { ...s.completed, [id]: !s.completed[id] },
      }));
    },
    setFeeling(id, value) {
      setState(s => ({ ...s, feelings: { ...s.feelings, [id]: value } }));
    },
    setNote(id, patch) {
      setState(s => ({
        ...s,
        notes: { ...s.notes, [id]: { ...(s.notes[id] || {}), ...patch } },
      }));
    },
    reset() {
      if (confirm("Reset all progress, feelings, and notes?")) {
        setState(DEFAULT_STATE);
      }
    },
  }), []);

  const openDetail = useCallback((id) => {
    setDetailId(id);
    requestAnimationFrame(() => setSheetOpen(true));
  }, []);
  const closeDetail = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setDetailId(null), 280);
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const setStartDate = useCallback((iso) => {
    const parsed = parseISO(iso);
    if (parsed) {
      const snapped = snapToTuesday(parsed);
      setTweak("startDate", toISO(snapped));
    } else {
      setTweak("startDate", iso);
    }
  }, [setTweak]);

  const logout = useCallback(async () => {
    await window._supabase.auth.signOut();
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key !== "Escape") return;
      if (sheetOpen) closeDetail();
      else if (settingsOpen) closeSettings();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [sheetOpen, settingsOpen, closeDetail, closeSettings]);

  const jumpWeek = useCallback((weekIndex) => {
    setOpenWeek(weekIndex);
    setTab("plan");
    requestAnimationFrame(() => {
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    });
  }, []);

  // ── Render gates ─────────────────────────────────
  if (authLoading) {
    return (
      <div className="auth-wrap">
        <div className="auth-spinner" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  return (
    <div className="app">
      {tab === "today" && (
        <TodayScreen
          today={today}
          state={state}
          actions={actions}
          onOpenDetail={openDetail}
          onJumpWeek={jumpWeek}
          onOpenSettings={openSettings}
        />
      )}
      {tab === "plan" && (
        <PlanScreen
          today={today}
          state={state}
          actions={actions}
          onOpenDetail={openDetail}
          openWeek={openWeek}
          setOpenWeek={setOpenWeek}
          onOpenSettings={openSettings}
        />
      )}
      {tab === "guide" && (
        <GuideScreen today={today} onOpenSettings={openSettings} />
      )}

      <TabBar value={tab} onChange={setTab} />

      <DetailSheet
        id={detailId}
        open={sheetOpen}
        onClose={closeDetail}
        state={state}
        actions={actions}
      />

      <SettingsSheet
        open={settingsOpen}
        onClose={closeSettings}
        startDate={t.startDate || "2026-05-12"}
        onSetStartDate={setStartDate}
        theme={t.theme || "light"}
        onSetTheme={(v) => setTweak("theme", v)}
        user={user}
        onLogout={logout}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Schedule">
          <TweakRow label="Plan starts" value={
            (() => {
              const d = parseISO(t.startDate);
              if (!d) return "";
              const snapped = snapToTuesday(d);
              return fmtDate(snapped) + " · Tue";
            })()
          }>
            <input
              className="twk-field"
              type="date"
              value={t.startDate || "2026-05-12"}
              onChange={(e) => {
                const v = e.target.value;
                const parsed = parseISO(v);
                if (parsed) {
                  const snapped = snapToTuesday(parsed);
                  setTweak("startDate", toISO(snapped));
                } else {
                  setTweak("startDate", v);
                }
              }}
            />
          </TweakRow>
          <TweakButton
            label="Start today (next Tuesday)"
            secondary
            onClick={() => {
              const n = new Date();
              const t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
              const snapped = snapToTuesday(t0);
              if (snapped < t0) snapped.setDate(snapped.getDate() + 7);
              setTweak("startDate", toISO(snapped));
            }}
          />
        </TweakSection>

        <TweakSection label="Theme">
          <TweakRadio
            label="Mode"
            value={t.theme}
            options={[
              { value: "light", label: "Light" },
              { value: "dark",  label: "Dark" },
            ]}
            onChange={(v) => setTweak("theme", v)}
          />
        </TweakSection>

        <TweakSection label="Accent">
          <TweakColor
            label="Color"
            value={(ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.volt).accent}
            options={["volt", "orange", "pink", "cyan", "red"].map(k => ACCENT_PALETTES[k].accent)}
            onChange={(hex) => {
              const key = Object.keys(ACCENT_PALETTES).find(
                k => ACCENT_PALETTES[k].accent.toLowerCase() === String(hex).toLowerCase()
              ) || "volt";
              setTweak("accent", key);
            }}
          />
        </TweakSection>

        <TweakSection label="Type">
          <TweakSelect
            label="Family"
            value={t.font}
            options={[
              { value: "cera",    label: "Cera Pro (if installed) → Mona Sans" },
              { value: "mona",    label: "Mona Sans" },
              { value: "manrope", label: "Manrope" },
              { value: "dm",      label: "DM Sans" },
            ]}
            onChange={(v) => setTweak("font", v)}
          />
        </TweakSection>

        <TweakSection label="Data">
          <TweakButton
            label="Reset progress & notes"
            secondary
            onClick={actions.reset}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
