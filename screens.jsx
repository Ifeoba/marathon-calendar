// ============================================================
// Marathon Foundation Calendar — screens (Performance theme)
// ============================================================

// ───────── TODAY ─────────
function TodayScreen({ today, state, actions, onOpenDetail, onJumpWeek, onOpenSettings }) {
  const weekIndex = currentWeekIndex(today);
  const focus = findFocusWorkout(today, state.completed);
  const focusWO = WEEKS[focus.week].workouts[focus.day.key];
  const focusId = focus.id;
  const isDone = !!state.completed[focusId];

  const daysToRace = Math.max(0, Math.round(
    (ymd_dt(RACE_DATE) - ymd_dt(today)) / 86400000
  ));
  const totalCompleted = Object.values(state.completed).filter(Boolean).length;
  const totalWorkouts = WEEKS.length * DAYS.length;
  const displayWeek = focus.week;

  return (
    <main>
      <Masthead todayDate={today} onOpenSettings={onOpenSettings} />

      {/* HERO */}
      <section className="hero">
        <div className="hero-head">
          <span className="now-badge">
            <span className="dot" />
            {focus.isToday ? "Today" : "Next up"}
          </span>
          <div className="now-meta">
            {focus.day.label}, {fmtDate(focus.date)}<br />
            <span style={{ opacity: 0.7 }}>{focus.day.time} · WK {String(focus.week + 1).padStart(2, "0")}</span>
          </div>
        </div>
        <div className="focus-line">{FOCUS[focus.day.key]}</div>
        <h1 className="workout-title">{focusWO.title}</h1>
        <div className="workout-sub">{focusWO.sub}</div>

        <div className="tips">
          {focusWO.tips.map((t, i) => (
            <div className="tip" key={i}>
              <div className="ix">{String(i + 1).padStart(2, "0")}</div>
              <div>{t}</div>
            </div>
          ))}
        </div>

        <div className="cta-row">
          <button
            className={"cta " + (isDone ? "primary done" : "accent")}
            onClick={() => actions.toggleComplete(focusId)}
          >
            {isDone ? (
              <>
                <CheckIcon size={16} color="currentColor" />
                <span>Completed</span>
              </>
            ) : (
              <span>Mark Complete</span>
            )}
          </button>
          <button
            className="cta ghost icon-only"
            onClick={() => onOpenDetail(focusId)}
            aria-label="Details and notes"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      <StatsRow
        daysToRace={daysToRace}
        weekIndex={weekIndex}
        completedCount={totalCompleted}
        totalWorkouts={totalWorkouts}
      />

      <ProgressBars
        completed={state.completed}
        weekIndex={weekIndex}
        onJumpWeek={onJumpWeek}
      />

      {/* This week */}
      <section className="section" style={{ marginTop: 22 }}>
        <div className="eyebrow">
          <span className="dot" />
          <span className="em">Week {String(displayWeek + 1).padStart(2, "0")}</span>
          <span>·</span>
          <span>{MONTH_INFO[WEEKS[displayWeek].month - 1].name}</span>
          <span className="line" />
        </div>
      </section>
      <div className="workout-list">
        {DAYS.map(d => (
          <WorkoutCard
            key={d.key}
            weekIndex={displayWeek}
            dayKey={d.key}
            completed={state.completed}
            today={today}
            onToggleComplete={actions.toggleComplete}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>

      {/* Target card */}
      <div className="target-card">
        <div className="tc-eyebrow"><span className="dot" />The Target</div>
        <div className="tc-title">{RACE_NAME}</div>
        <div className="tc-sub">Finishing is the goal. Time is for another year.</div>
        <div className="tc-meta">
          <div>
            <div className="lab">Race Day</div>
            <div className="val">{fmtDate(RACE_DATE)} '27</div>
          </div>
          <div>
            <div className="lab">Distance</div>
            <div className="val">42.2<span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", marginLeft: 4 }}>km</span></div>
          </div>
        </div>
      </div>

      <div style={{ height: 24 }} />
    </main>
  );
}

// ───────── PLAN ─────────
function PlanScreen({ today, state, actions, onOpenDetail, openWeek, setOpenWeek, onOpenSettings }) {
  const months = [1, 2, 3].map(mn => ({
    info: MONTH_INFO[mn - 1],
    weeks: WEEKS.map((w, i) => ({ ...w, index: i })).filter(w => w.month === mn),
  }));
  const currentW = currentWeekIndex(today);
  const totalCompleted = Object.values(state.completed).filter(Boolean).length;
  const totalWorkouts = WEEKS.length * DAYS.length;
  const pct = Math.round((totalCompleted / totalWorkouts) * 100);

  return (
    <main>
      <Masthead todayDate={today} onOpenSettings={onOpenSettings} />

      <section className="page-head">
        <div className="eyebrow">
          <span className="dot" />
          <span>The Plan</span>
          <span className="line" />
          <span>{pct}% complete</span>
        </div>
        <h1 className="page-title">Twelve weeks. Three chapters.</h1>
        <div className="page-sub">From walk-jog intervals to thirty minutes of running, without stopping.</div>
      </section>

      {months.map(m => (
        <section key={m.info.num} className="plan-month">
          <header className="plan-month-head">
            <div>
              <div className="mn-num">Month {m.info.num}</div>
              <div className="mn-title">{m.info.name}</div>
            </div>
            <div className="mn-goal">{m.info.goal}</div>
          </header>

          {m.weeks.map(week => {
            const wIdx = week.index;
            const doneCount = DAYS.filter(d => state.completed[workoutId(wIdx, d.key)]).length;
            const startDate = dateForWeekDay(wIdx, 0);
            const endDate = dateForWeekDay(wIdx, 5);
            const isOpen = openWeek === wIdx;
            const isCurrent = wIdx === currentW;

            return (
              <div key={wIdx} className={"plan-week" + (isOpen ? " open" : "")}>
                <button
                  className="plan-week-head"
                  onClick={() => setOpenWeek(isOpen ? -1 : wIdx)}
                >
                  <div>
                    <div className="wk-label">
                      Week {String(wIdx + 1).padStart(2, "0")}
                      {isCurrent && <span className="now-pill">Now</span>}
                    </div>
                    <div className="wk-dates">{fmtDate(startDate)} – {fmtDate(endDate)}</div>
                  </div>
                  <div className="right">
                    <div className="wk-count"><b>{doneCount}</b> / {DAYS.length}</div>
                    <div className="chev" />
                  </div>
                </button>
                <div className="plan-week-body">
                  <div className="workout-list">
                    {DAYS.map(d => (
                      <WorkoutCard
                        key={d.key}
                        weekIndex={wIdx}
                        dayKey={d.key}
                        completed={state.completed}
                        today={today}
                        onToggleComplete={actions.toggleComplete}
                        onOpenDetail={onOpenDetail}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ))}

      {/* After 12 weeks */}
      <section className="page-head" style={{ marginTop: 32 }}>
        <div className="eyebrow">
          <span className="dot" />
          <span>After Week 12</span>
          <span className="line" />
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink-2)", marginTop: 6, marginBottom: 28 }}>
          First 5K, then 10K, then half marathon, then the marathon. The plan
          you finish next becomes the foundation for the plan that comes after.
        </p>
      </section>
    </main>
  );
}

// ───────── GUIDE ─────────
function GuideScreen({ today, onOpenSettings }) {
  return (
    <main>
      <Masthead todayDate={today} onOpenSettings={onOpenSettings} />

      <section className="page-head">
        <div className="eyebrow">
          <span className="dot" />
          <span>Guide</span>
          <span className="line" />
        </div>
        <h1 className="page-title">Rules. Routines. Routes.</h1>
        <div className="page-sub">The reference page. Come back to it on heavy weeks.</div>
      </section>

      {/* Beginner rules */}
      <section className="guide-block">
        <div className="gb-eyebrow">Rules for the road</div>
        <h2 className="gb-title">Five things to hold close.</h2>
        <div className="gb-sub">Before the running, before the gear, before the route. These first.</div>
        <div>
          {BEGINNER_RULES.map((r, i) => (
            <div className="rule-item" key={i}>
              <div className="num">{i + 1}</div>
              <div>
                <div className="rt">{r.title}</div>
                <div className="rb">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saturday recovery */}
      <section className="guide-block">
        <div className="gb-eyebrow">Saturday routine</div>
        <h2 className="gb-title">Recovery, not training.</h2>
        <div className="gb-sub">
          Saturday is the one day you can't substitute. Keep it light, keep it short, keep it honest.
        </div>
        <ul className="recovery-list">
          {SATURDAY_RECOVERY.map((s, i) => (
            <li key={i}>
              <span className="ix">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <span className="lab">{s.lab}</span>
                <span className="note">{s.note}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Lagos spots */}
      <section className="guide-block" style={{ borderBottom: 0 }}>
        <div className="gb-eyebrow">Where to run in Lagos</div>
        <h2 className="gb-title">Five spots, all forgiving.</h2>
        <div className="gb-sub">
          Run after 6 PM. Avoid afternoons. Prioritize lighting and low traffic over scenery.
        </div>
        <div>
          {LAGOS_SPOTS.map((s, i) => (
            <div className="spot" key={i}>
              <div className="sp-icon" aria-hidden>
                <div className="pin-line" />
              </div>
              <div>
                <div className="sp-name">{s.name}</div>
                <div className="sp-meta">{s.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 24 }} />
    </main>
  );
}

// ───────── DETAIL SHEET ─────────
function DetailSheet({ id, open, onClose, state, actions }) {
  const data = id ? workoutById(id) : null;

  const [mood, setMood] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    if (id) {
      const n = state.notes[id] || {};
      setMood(n.mood || "");
      setTime(n.time || "");
      setLocation(n.location || "");
      setText(n.text || "");
    }
  }, [id, state.notes]);

  const persistNote = useCallback((patch) => {
    if (!id) return;
    actions.setNote(id, { mood, time, location, text, ...patch });
  }, [id, mood, time, location, text, actions]);

  if (!data) {
    return (
      <>
        <div className={"sheet-scrim" + (open ? " open" : "")} onClick={onClose} />
        <div className={"sheet" + (open ? " open" : "")}>
          <div className="grabber" />
        </div>
      </>
    );
  }

  const done = !!state.completed[id];
  const feel = state.feelings[id] || "";

  return (
    <>
      <div className={"sheet-scrim" + (open ? " open" : "")} onClick={onClose} />
      <div className={"sheet" + (open ? " open" : "")}>
        <div className="grabber" />
        <div className="sheet-scroll">
          <div className="sheet-head">
            <div className="crumb">
              <span>WK {String(data.week + 1).padStart(2, "0")} · {data.day.label} · {fmtDate(data.date)}</span>
              <button className="close" onClick={onClose} aria-label="Close">×</button>
            </div>
            <div className="focus-tag">{FOCUS[data.day.key]} · {data.day.time}</div>
            <h2 className="stitle">{data.workout.title}</h2>
            <div className="ssub">{data.workout.sub}</div>
          </div>

          <div className="sheet-body">
            <div className="label">Coach's notes</div>
            <div className="tip-list">
              {data.workout.tips.map((t, i) => (
                <div className="tip-item" key={i}>
                  <div className="ix">{String(i + 1).padStart(2, "0")}</div>
                  <div className="tx">{t}</div>
                </div>
              ))}
            </div>

            <div className="label">How did it feel?</div>
            <div className="feel">
              {[
                { id: "easy",    gl: "Easy",    label: "Cruise" },
                { id: "good",    gl: "Solid",   label: "Right" },
                { id: "tough",   gl: "Tough",   label: "Push" },
                { id: "skipped", gl: "—",       label: "Skipped" },
              ].map(f => (
                <button
                  key={f.id}
                  className={feel === f.id ? "active" : ""}
                  onClick={() => actions.setFeeling(id, feel === f.id ? "" : f.id)}
                >
                  <span className="gl">{f.gl}</span>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="label">Notes</div>
            <div className="note-grid">
              <input
                placeholder="Time (e.g. 6:15 PM)"
                value={time}
                onChange={e => setTime(e.target.value)}
                onBlur={() => persistNote({ time })}
              />
              <input
                placeholder="Location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onBlur={() => persistNote({ location })}
              />
            </div>
            <div style={{ height: 8 }} />
            <input
              className="note-area"
              style={{ height: "auto", minHeight: 0, padding: "12px 14px" }}
              placeholder="Mood / weather (cool, focused, tired…)"
              value={mood}
              onChange={e => setMood(e.target.value)}
              onBlur={() => persistNote({ mood })}
            />
            <div style={{ height: 8 }} />
            <textarea
              className="note-area"
              placeholder="How was the run? Distance, splits, what worked, what hurt…"
              value={text}
              onChange={e => setText(e.target.value)}
              onBlur={() => persistNote({ text })}
            />
          </div>
        </div>

        <div className="sheet-foot">
          <button
            className={"cta " + (done ? "primary done" : "accent")}
            style={{ flex: 1 }}
            onClick={() => actions.toggleComplete(id)}
          >
            {done ? (
              <>
                <CheckIcon size={16} color="currentColor" />
                <span>Completed</span>
              </>
            ) : (
              <span>Mark Complete</span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TodayScreen, PlanScreen, GuideScreen, DetailSheet, SettingsSheet });

// ───────── SETTINGS SHEET ─────────
function SettingsSheet({ open, onClose, startDate, onSetStartDate }) {
  const parsed = startDate ? new Date(
    +startDate.slice(0,4), +startDate.slice(5,7)-1, +startDate.slice(8,10)
  ) : new Date(2026, 4, 12);
  const startDay = parsed;
  const startDayLong = fmtDateLong(startDay);

  // Compute derived race-relative numbers for context
  const today = useMemo(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, []);
  const planEnd = addDays(startDay, 12 * 7 - 1);
  const daysToStart = Math.round((ymd_dt(startDay) - ymd_dt(today)) / 86400000);
  const daysFromStartToRace = Math.round((ymd_dt(RACE_DATE) - ymd_dt(startDay)) / 86400000);
  const weeksToRace = Math.round(daysFromStartToRace / 7);

  return (
    <>
      <div className={"sheet-scrim" + (open ? " open" : "")} onClick={onClose} />
      <div className={"sheet" + (open ? " open" : "")}>
        <div className="grabber" />
        <div className="sheet-scroll">
          <div className="sheet-head">
            <div className="crumb">
              <span>Plan Settings</span>
              <button className="close" onClick={onClose} aria-label="Close">×</button>
            </div>
            <div className="focus-tag">Personalize the 12-week window</div>
            <h2 className="stitle">When do you start?</h2>
            <div className="ssub">
              Pick the Tuesday you begin Week 01. The plan auto-snaps to the
              nearest Tuesday so Tue/Fri/Sat/Sun stays intact.
            </div>
          </div>

          <div className="sheet-body">
            <div className="label">Start date</div>
            <input
              className="note-area"
              type="date"
              value={startDate}
              onChange={(e) => onSetStartDate(e.target.value)}
              style={{ minHeight: 0, height: 48, padding: "0 14px", fontFamily: "var(--mono)", letterSpacing: "0.04em", fontSize: 15 }}
            />

            <div style={{
              marginTop: 16,
              padding: "14px 16px",
              background: "var(--bg-3)",
              borderRadius: 10,
              fontSize: 13.5,
              color: "var(--ink-2)",
              lineHeight: 1.5,
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                Week 01 begins
              </div>
              <div style={{ fontFamily: "var(--display)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", color: "var(--ink)", lineHeight: 1.1 }}>
                {startDayLong}
              </div>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>Plan ends</div>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 15, marginTop: 4, color: "var(--ink)" }}>{fmtDate(planEnd)}, {planEnd.getFullYear()}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>
                    {daysToStart > 0 ? "Starts in" : daysToStart < 0 ? "Started" : "Starts"}
                  </div>
                  <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 15, marginTop: 4, color: "var(--ink)" }}>
                    {daysToStart > 0 ? `${daysToStart} day${daysToStart === 1 ? "" : "s"}` : daysToStart < 0 ? `${Math.abs(daysToStart)} day${Math.abs(daysToStart) === 1 ? "" : "s"} ago` : "Today"}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--rule)", fontSize: 13 }}>
                That leaves <b style={{ color: "var(--ink)" }}>{weeksToRace} weeks</b> between
                the end of foundation training and race day —
                plenty of room to ramp through 5K, 10K and half-marathon plans.
              </div>
            </div>

            <div className="label">Quick presets</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button
                className="cta ghost"
                style={{ height: 44, padding: 0, fontSize: 13, fontFamily: "var(--display)", fontWeight: 600 }}
                onClick={() => {
                  const n = new Date();
                  const t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
                  const snapped = snapToTuesday(t0);
                  if (snapped < t0) snapped.setDate(snapped.getDate() + 7);
                  onSetStartDate(toISOLocal(snapped));
                }}
              >
                Next Tuesday
              </button>
              <button
                className="cta ghost"
                style={{ height: 44, padding: 0, fontSize: 13, fontFamily: "var(--display)", fontWeight: 600 }}
                onClick={() => {
                  const n = new Date();
                  const t0 = new Date(n.getFullYear(), n.getMonth(), n.getDate());
                  const snapped = snapToTuesday(t0);
                  if (snapped < t0) snapped.setDate(snapped.getDate() + 7);
                  snapped.setDate(snapped.getDate() + 14);
                  onSetStartDate(toISOLocal(snapped));
                }}
              >
                In 2 weeks
              </button>
            </div>
          </div>
        </div>

        <div className="sheet-foot">
          <button
            className="cta primary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

// Local ISO util (kept in screens to avoid round-tripping through app)
function toISOLocal(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}
