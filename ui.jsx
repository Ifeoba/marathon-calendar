// ============================================================
// Marathon Foundation Calendar — UI helpers (Performance theme)
// ============================================================
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function CheckIcon({ size = 14, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5L6 10.5L11 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CircleCheck({ done, onClick }) {
  return (
    <button
      className={"check" + (done ? " is-done" : "")}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      aria-label={done ? "Mark incomplete" : "Mark complete"}
    >
      <CheckIcon />
    </button>
  );
}

// Tab icons (originals, not branded)
function TabIcon({ name, active }) {
  const stroke = active ? "currentColor" : "currentColor";
  const sw = 1.6;
  if (name === "today") {
    // Stopwatch-ish dial
    return (
      <svg viewBox="0 0 24 24" fill="none" className="tab-icon" aria-hidden>
        <circle cx="12" cy="13" r="7.5" stroke={stroke} strokeWidth={sw}/>
        <path d="M12 13l3-3" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        <path d="M10 3h4" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        <path d="M12 3v2" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "plan") {
    // Calendar grid
    return (
      <svg viewBox="0 0 24 24" fill="none" className="tab-icon" aria-hidden>
        <rect x="3.5" y="5.5" width="17" height="15" rx="2" stroke={stroke} strokeWidth={sw}/>
        <path d="M3.5 10.5h17" stroke={stroke} strokeWidth={sw}/>
        <path d="M8 3.5v4M16 3.5v4" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
      </svg>
    );
  }
  if (name === "guide") {
    // Open book
    return (
      <svg viewBox="0 0 24 24" fill="none" className="tab-icon" aria-hidden>
        <path d="M12 7v13" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
        <path d="M3.5 5.5c3-1 5.5-1 8.5.5 3-1.5 5.5-1.5 8.5-.5v13c-3-1-5.5-1-8.5.5-3-1.5-5.5-1.5-8.5-.5v-13z"
          stroke={stroke} strokeWidth={sw} strokeLinejoin="round"/>
      </svg>
    );
  }
  return null;
}

function TabBar({ value, onChange }) {
  const tabs = [
    { id: "today", label: "Today" },
    { id: "plan",  label: "Plan" },
    { id: "guide", label: "Guide" },
  ];
  return (
    <nav className="tabbar" aria-label="Primary">
      {tabs.map(t => (
        <button
          key={t.id}
          className={value === t.id ? "active" : ""}
          onClick={() => onChange(t.id)}
        >
          <TabIcon name={t.id} active={value === t.id} />
          {t.label}
        </button>
      ))}
    </nav>
  );
}

// Top mast — brand + race chip + settings
function Masthead({ todayDate, onOpenSettings }) {
  const daysToRace = Math.max(0, Math.round(
    (ymd_dt(RACE_DATE) - ymd_dt(todayDate)) / 86400000
  ));
  return (
    <header className="masthead">
      <div className="brand-mark">
        <div className="glyph" aria-hidden />
        <div className="name">
          MARATHON
          <small>Lagos · 2027</small>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="race-chip" title={`${daysToRace} days to ${RACE_NAME}`}>
          <span className="dot" />
          <b>{daysToRace}</b>
          <span>days</span>
        </div>
        {onOpenSettings && (
          <button
            type="button"
            aria-label="Plan settings"
            onClick={onOpenSettings}
            style={{
              width: 36, height: 36, borderRadius: 999,
              border: "1px solid var(--rule)",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg-2)",
              color: "var(--ink)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}

// Workout card row
function WorkoutCard({ weekIndex, dayKey, completed, today, onToggleComplete, onOpenDetail }) {
  const day = DAYS.find(d => d.key === dayKey);
  const date = dateForWeekDay(weekIndex, day.dayOffset);
  const wo = WEEKS[weekIndex].workouts[dayKey];
  const id = workoutId(weekIndex, dayKey);
  const done = !!completed[id];
  const isThisDay = sameDay(date, today);

  return (
    <div
      role="button"
      tabIndex={0}
      className={
        "workout"
        + (done ? " completed" : "")
        + (isThisDay ? " is-today" : "")
      }
      onClick={() => onOpenDetail(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenDetail(id);
        }
      }}
    >
      <div className="w-day">
        <div className="dow">{day.short}</div>
        <div className="num">{date.getDate()}</div>
      </div>
      <div className="w-body">
        <div className="w-focus">{FOCUS[dayKey]} · {day.time}</div>
        <div className="w-title">{wo.title}</div>
      </div>
      <CircleCheck done={done} onClick={() => onToggleComplete(id)} />
    </div>
  );
}

// Stats row
function StatsRow({ daysToRace, weekIndex, completedCount, totalWorkouts }) {
  const pct = Math.round((completedCount / totalWorkouts) * 100);
  return (
    <div className="stats">
      <div className="stat dark">
        <div className="stat-label">Race Day</div>
        <div className="stat-value">{daysToRace}<span className="stat-unit">days</span></div>
      </div>
      <div className="stat">
        <div className="stat-label">Week</div>
        <div className="stat-value">{String(weekIndex + 1).padStart(2, "0")}<span className="stat-unit">of 12</span></div>
      </div>
      <div className="stat accent">
        <div className="stat-label">Done</div>
        <div className="stat-value">{pct}<span className="stat-unit">%</span></div>
      </div>
    </div>
  );
}

// Progress bar block — 12 weekly bars
function ProgressBars({ completed, weekIndex, onJumpWeek }) {
  const weekCounts = [];
  for (let w = 0; w < 12; w++) {
    let c = 0;
    for (let d of DAYS) {
      if (completed[workoutId(w, d.key)]) c++;
    }
    weekCounts.push(c);
  }
  const total = weekCounts.reduce((a, b) => a + b, 0);
  const totalW = WEEKS.length * DAYS.length;
  const pct = Math.round((total / totalW) * 100);

  return (
    <div className="progress-card">
      <div className="progress-head">
        <div className="label">12-Week Foundation</div>
        <div className="pct">{total}<span className="small">/ {totalW}</span></div>
      </div>
      <div className="week-bars">
        {weekCounts.map((c, i) => {
          const isFull = c === DAYS.length;
          const fillH = (c / DAYS.length) * 100;
          const cls = [
            i === weekIndex ? "current" : "",
            isFull ? "full" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={i}
              className={cls}
              title={`Week ${i + 1}: ${c}/${DAYS.length}`}
              onClick={() => onJumpWeek && onJumpWeek(i)}
            >
              <div className="fill" style={{ height: fillH + "%" }} />
              <span className="num">{i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  CheckIcon, CircleCheck, TabIcon, TabBar, Masthead,
  WorkoutCard, StatsRow, ProgressBars,
});
