// ============================================================
// Marathon Foundation Calendar — data
// 12-week beginner plan, 4 evening workouts/week (Tue/Fri/Sat/Sun)
// ============================================================

// --- Plan window ---
let PLAN_START = new Date(2026, 4, 12);   // May 12, 2026 — Tuesday (default)
const RACE_DATE  = new Date(2027, 1, 6);    // Feb 6, 2027 — generic "Lagos City Marathon 2027"
const RACE_NAME  = "Lagos City Marathon 2027";

function getPlanStart() { return PLAN_START; }
function setPlanStart(d) {
  // Snap to the same-week Tuesday so the 4-day Tue/Fri/Sat/Sun structure stays intact.
  const snapped = snapToTuesday(d);
  PLAN_START = snapped;
  window.PLAN_START = snapped;
  return snapped;
}
function snapToTuesday(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, ...
  // distance to nearest Tuesday (Tue=2)
  let delta = 2 - dow;
  if (delta < -3) delta += 7;   // e.g. Sat(6): -4 → +3
  else if (delta > 3) delta -= 7;
  date.setDate(date.getDate() + delta);
  return date;
}

// Offsets from each week's Tuesday for the 4 workouts
const DAYS = [
  { key: "tue", dayOffset: 0, label: "Tuesday",  short: "TUE", time: "6:00 PM" },
  { key: "fri", dayOffset: 3, label: "Friday",   short: "FRI", time: "6:00 PM" },
  { key: "sat", dayOffset: 4, label: "Saturday", short: "SAT", time: "6:00 PM" },
  { key: "sun", dayOffset: 5, label: "Sunday",   short: "SUN", time: "6:00 PM" },
];

const FOCUS = {
  tue: "Easy Run + Technique",
  fri: "Strength + Short Run",
  sat: "Recovery / Mobility",
  sun: "Long Run",
};

// 12 weeks × 4 workouts
const WEEKS = [
  // ───────── MONTH 1 — LEARN TO RUN ─────────
  {
    month: 1,
    workouts: {
      tue: { title: "Run 30s / Walk 60s × 10", sub: "Easy intervals", tips: ["You should still be able to talk through the running blocks.", "Land softly on the mid-foot — quick steps, 1-2-3, 1-2-3.", "If 10 rounds feel hard, drop to 8 and end strong."] },
      fri: { title: "Bodyweight strength + short run", sub: "10-minute intervals after", tips: ["Friday strength: squats × 12, lunges × 10 each, glute bridges × 15, plank 30s, bird dogs × 10. Two rounds only.", "Then jog 30s / walk 60s for 10 minutes.", "Strength comes first — let the legs feel warm before you run."] },
      sat: { title: "Calf stretches & shin strengthening", sub: "Recovery, not training", tips: ["Heel raises × 15 (both feet, then single leg).", "Toe taps against a wall × 20 each side.", "Hold each calf stretch 30 seconds.", "Saturday is for repair. Resist the urge to run."] },
      sun: { title: "Easy walk-jog for 30 minutes", sub: "Conversational pace, no clock pressure", tips: ["Mix walking and jogging by feel — no rounds, no math.", "If breathing gets sharp, walk until it softens.", "Pick a flat, well-lit route. Hydrate before you leave."] },
    },
  },
  {
    month: 1,
    workouts: {
      tue: { title: "Run 45s / Walk 75s", sub: "Slightly longer running blocks", tips: ["Add a 10-second sprint at the very start — this is your weekly sprint activation.", "After the sprint, jog easy back to your normal pace.", "8–10 rounds depending on energy."] },
      fri: { title: "Sprint 10s + easy intervals", sub: "Mechanics + endurance", tips: ["Warm up with 5 minutes of brisk walking.", "10-second sprint, then 2 minutes easy jog.", "Repeat 4–5 times. Quality over quantity."] },
      sat: { title: "Mobility + foot strengthening", sub: "Recovery", tips: ["Ankle circles, hip openers, short barefoot walks on grass.", "Toe spreads and toe curls × 20.", "No running today."] },
      sun: { title: "Long easy walk-jog", sub: "35–40 minutes by feel", tips: ["Time on feet matters more than distance right now.", "Slower than you think it should be.", "End feeling like you could keep going."] },
    },
  },
  {
    month: 1,
    workouts: {
      tue: { title: "Run 60s / Walk 90s", sub: "Equal effort across rounds", tips: ["Aim for 8 rounds. If the last two are sloppy, your pace was too fast.", "Quick feet — count 1-2-3 in your head.", "Soft landings, eyes ahead."] },
      fri: { title: "Strength + easy intervals", sub: "Two rounds of the routine", tips: ["Full strength routine (2 rounds).", "After: jog 60s / walk 90s × 6.", "If knees feel tired, swap to walking only after strength."] },
      sat: { title: "Stretching + recovery walk", sub: "Light only", tips: ["20-minute walk + full lower-body stretch.", "Focus on calves, hamstrings, hips, glutes.", "Sleep early tonight — Sunday's session matters."] },
      sun: { title: "Long easy session", sub: "40–45 minutes", tips: ["Mix run / walk by feel.", "Last 5 minutes: walking only — that's your cool-down.", "Conversational. Always."] },
    },
  },
  {
    month: 1,
    workouts: {
      tue: { title: "Run 90s / Walk 90s", sub: "Even ratio — a milestone", tips: ["First week where running equals walking. Big psychological shift.", "Slow down even more than feels natural.", "8 rounds."] },
      fri: { title: "Sprint activation + intervals", sub: "Mechanics focus", tips: ["10-second sprint to start.", "Then 90s run / 90s walk × 6.", "Keep the sprint short and sharp — don't go all out."] },
      sat: { title: "Shin strengthening + mobility", sub: "Targeted recovery", tips: ["Toe taps × 25 each side. Heel walks 30s × 3.", "Ankle mobility: alphabet drill with each foot.", "If shins feel tender, add an extra calf stretch round."] },
      sun: { title: "30-minute walk-jog", sub: "Final easy session of Month 1", tips: ["Celebrate that you finished a month of consistent training.", "Easy, easy, easy.", "Take a photo at your halfway point — you'll want it later."] },
    },
  },
  // ───────── MONTH 2 — BUILD ENDURANCE ─────────
  {
    month: 2,
    workouts: {
      tue: { title: "Run 2 min / Walk 90s", sub: "Running > walking, finally", tips: ["This is when you start feeling like a runner. Trust it.", "Drop pace if 2 minutes feels too long.", "6–8 rounds."] },
      fri: { title: "Strength + easy jog", sub: "Two rounds + 10-min jog", tips: ["Strength routine first, full 2 rounds.", "Then steady jog for 10 minutes — no walk breaks unless you need them.", "Sprint activation: 10s at minute 5 of the jog."] },
      sat: { title: "Mobility work", sub: "Recovery", tips: ["Hip flexor stretches × 45s each side.", "Foam roll calves and quads if you have one.", "If not — tennis ball under the foot for 60s each side."] },
      sun: { title: "Long easy intervals", sub: "45 minutes total", tips: ["3 min run / 1 min walk, repeated until 45 minutes is up.", "Last 5 minutes: walk only.", "Hydrate before you leave the house."] },
    },
  },
  {
    month: 2,
    workouts: {
      tue: { title: "Run 3 min / Walk 90s", sub: "Longer running blocks", tips: ["6 rounds.", "Quick feet on every block. 1-2-3.", "If the last round is shaky, walk an extra minute to finish."] },
      fri: { title: "Sprint activation + jog", sub: "Mechanics + steady jog", tips: ["10s sprint, then 15 minutes of steady jogging.", "Walk breaks only if heart rate spikes.", "Focus on shoulder relaxation — they like to creep up."] },
      sat: { title: "Stretch + calf work", sub: "Recovery", tips: ["Calf stretches × 30s each, both straight-leg and bent-knee.", "Single-leg heel raises × 12 each side.", "Eat well today. Tomorrow is long."] },
      sun: { title: "Long easy run/walk", sub: "50 minutes", tips: ["4 min run / 1 min walk × 10.", "Slower than Tuesday. Always.", "If the run feels too easy — good. That's the point."] },
    },
  },
  {
    month: 2,
    workouts: {
      tue: { title: "Run 4 min / Walk 1 min", sub: "Endurance build", tips: ["5 rounds = 25 minutes of movement.", "Form check halfway through: jaw soft, shoulders down.", "Hydrate after."] },
      fri: { title: "Strength + recovery jog", sub: "Light effort", tips: ["Full strength routine.", "10–12 minute easy jog — recovery pace, not workout pace.", "If legs feel heavy, walk it."] },
      sat: { title: "Mobility work", sub: "Recovery", tips: ["Full body mobility flow — 10–15 minutes.", "Pay attention to hips and ankles.", "Bed by 10pm if possible."] },
      sun: { title: "Long run", sub: "55 minutes, 4:1 ratio", tips: ["Run 4 min / walk 1 min × 11.", "Save energy for the last 2 rounds.", "Eat a small snack 60 minutes before."] },
    },
  },
  {
    month: 2,
    workouts: {
      tue: { title: "Run 5 min / Walk 1 min", sub: "Big jump — handle with care", tips: ["4 rounds. If you reach round 4, you've earned a quiet pride.", "Walking break should feel like relief, not necessity.", "Cool down with 5 minutes of slow walking."] },
      fri: { title: "Sprint activation + easy jog", sub: "Light Friday", tips: ["10s sprint, 12 minutes of jogging.", "Tomorrow is mobility — go a little harder if it feels good.", "Stretch immediately after."] },
      sat: { title: "Stretching", sub: "Pure recovery", tips: ["Hold each stretch for at least 30 seconds.", "Hips, hamstrings, calves, quads, shoulders.", "Tomorrow's session is a checkpoint — rest matters."] },
      sun: { title: "35–40 minutes continuous movement", sub: "Run as much as you can; walk when you must", tips: ["This is your bridge to Month 3.", "No fixed intervals. Listen to your body.", "If you run the full 35–40 minutes, you've crossed a line."] },
    },
  },
  // ───────── MONTH 3 — BECOMING A RUNNER ─────────
  {
    month: 3,
    workouts: {
      tue: { title: "10-minute continuous jog", sub: "No walk breaks", tips: ["Pace should be slower than feels natural. Embarrassingly slow.", "If you must walk, you went out too fast.", "Add 5 minutes of walking on each end as warm-up + cool-down."] },
      fri: { title: "Strength + recovery jog", sub: "Light effort", tips: ["Full strength routine.", "10 minutes of jogging — true recovery pace.", "Notice how the strength routine is starting to feel easier."] },
      sat: { title: "Mobility", sub: "Recovery", tips: ["Full mobility flow.", "Roll out any tight spots.", "Hydrate and sleep — Sunday is long."] },
      sun: { title: "Long slow run", sub: "Goal: 4 km continuous, or 35 min by time", tips: ["Continuous = no scheduled walk breaks. Walk if you need to.", "Slow. Slower. There you go.", "End with a smile, not a stagger."] },
    },
  },
  {
    month: 3,
    workouts: {
      tue: { title: "15-minute continuous jog", sub: "Stretch the threshold", tips: ["From here on, you're a runner who occasionally walks.", "5 minutes warm-up + 15 minutes jog + 5 minutes cool-down.", "Check your shoes — laces snug but not tight."] },
      fri: { title: "Sprint activation + easy jog", sub: "Mechanics + steady", tips: ["10s sprint after a thorough walk-warmup.", "Then 15 minutes easy jog.", "If you ever feel sharp pain — stop. Rest is part of the plan."] },
      sat: { title: "Stretching", sub: "Recovery", tips: ["Long, slow stretches.", "Bonus: 5 minutes of breathing — box breathing 4-4-4-4.", "Tomorrow is your longest run yet."] },
      sun: { title: "Long slow run", sub: "Goal: 5 km, or 45 min by time", tips: ["Conversational pace. If you can't speak a full sentence, slow down.", "Take water if it's over 30 minutes.", "Halfway turnaround point — pick a landmark."] },
    },
  },
  {
    month: 3,
    workouts: {
      tue: { title: "20-minute continuous jog", sub: "Big psychological milestone", tips: ["Easier than 15 minutes felt last week, somehow.", "Don't speed up just because you feel good.", "Cool-down walk is non-negotiable."] },
      fri: { title: "Strength + quick-feet drills", sub: "Mechanics focus", tips: ["Full strength routine.", "Then 30 seconds of fast leg turnover × 4 — short, light strides in place.", "No long run today, that's tomorrow's job."] },
      sat: { title: "Mobility", sub: "Recovery", tips: ["Final pre-checkpoint recovery.", "Take it seriously. No bonus exercises.", "Eat well, sleep well."] },
      sun: { title: "Long slow run", sub: "Goal: 6 km, or 50–55 min", tips: ["You're 90% of the way to your first nonstop 5K.", "Walk breaks fine if needed.", "Save something for Week 12."] },
    },
  },
  {
    month: 3,
    workouts: {
      tue: { title: "30-minute continuous run attempt", sub: "Your foundation checkpoint", tips: ["This is the moment. You've been building toward it for 11 weeks.", "Start slower than feels right. The second half is when it matters.", "If you finish: you can run continuously for 30 minutes. That's everything."] },
      fri: { title: "Recovery jog", sub: "Easy, short", tips: ["10–15 minutes of very easy jogging.", "Body's still processing Tuesday.", "Stretch thoroughly after."] },
      sat: { title: "Full stretching session", sub: "Celebrate by recovering", tips: ["20-minute stretching routine.", "Every muscle you've been working.", "Reflect: 12 weeks ago, what could you do?"] },
      sun: { title: "Easy celebratory run", sub: "Whatever feels good", tips: ["No targets. No clocks.", "Just go for a run. Because you can.", "Tomorrow: take a photo of yourself in your running clothes. You've earned it."] },
    },
  },
];

// ============================================================
// Helpers
// ============================================================
function addDays(d, n) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
function dateForWeekDay(weekIndex, dayOffset) {
  return addDays(PLAN_START, weekIndex * 7 + dayOffset);
}
function ymd(d) {
  return d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0");
}
function sameDay(a, b) { return ymd(a) === ymd(b); }
function daysBetween(a, b) {
  const ms = 86400000;
  return Math.round((ymd_dt(b) - ymd_dt(a)) / ms);
}
function ymd_dt(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
function fmtDate(d, opts = { weekday: false }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const wkd = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const w = opts.weekday ? `${wkd[d.getDay()]}, ` : "";
  return `${w}${months[d.getMonth()]} ${d.getDate()}`;
}
function fmtDateLong(d) {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const wkd = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return `${wkd[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

// Find current week index (0–11) based on today.
// If today is before PLAN_START → week 0.
// If today is after the plan ends → week 11.
function currentWeekIndex(today) {
  const ms = 86400000;
  const diff = Math.floor((ymd_dt(today) - ymd_dt(PLAN_START)) / ms);
  if (diff < 0) return 0;
  const w = Math.floor(diff / 7);
  return Math.max(0, Math.min(11, w));
}

// Find the next upcoming workout (or today's, if today has one)
function findFocusWorkout(today, completed) {
  const todayMs = ymd_dt(today);
  // Look at all workouts, find first one whose date >= today AND not completed.
  // Also: today's workout is the focus if it exists, completed or not.
  for (let w = 0; w < WEEKS.length; w++) {
    for (let i = 0; i < DAYS.length; i++) {
      const dd = dateForWeekDay(w, DAYS[i].dayOffset);
      const id = workoutId(w, DAYS[i].key);
      if (ymd_dt(dd) === todayMs) {
        return { week: w, day: DAYS[i], date: dd, id, isToday: true };
      }
    }
  }
  // No workout today — find next upcoming
  for (let w = 0; w < WEEKS.length; w++) {
    for (let i = 0; i < DAYS.length; i++) {
      const dd = dateForWeekDay(w, DAYS[i].dayOffset);
      const id = workoutId(w, DAYS[i].key);
      if (ymd_dt(dd) >= todayMs && !completed[id]) {
        return { week: w, day: DAYS[i], date: dd, id, isToday: false };
      }
    }
  }
  // All done or all past — return last
  const lastW = WEEKS.length - 1;
  const lastD = DAYS[DAYS.length - 1];
  return {
    week: lastW, day: lastD,
    date: dateForWeekDay(lastW, lastD.dayOffset),
    id: workoutId(lastW, lastD.key),
    isToday: false,
  };
}

function workoutId(weekIndex, dayKey) { return `w${weekIndex + 1}-${dayKey}`; }
function workoutById(id) {
  const m = id.match(/^w(\d+)-(\w+)$/);
  if (!m) return null;
  const w = parseInt(m[1], 10) - 1;
  const dayKey = m[2];
  const day = DAYS.find(d => d.key === dayKey);
  if (!day || !WEEKS[w]) return null;
  const wo = WEEKS[w].workouts[dayKey];
  return { week: w, day, date: dateForWeekDay(w, day.dayOffset), workout: wo, id };
}

const MONTH_INFO = [
  { num: 1, name: "Learn to Run", goal: "Build consistency without injuries." },
  { num: 2, name: "Build Endurance", goal: "Run more than you walk." },
  { num: 3, name: "Becoming a Runner", goal: "Run continuously with confidence." },
];

const BEGINNER_RULES = [
  { title: "Run easy.", body: "If you can't speak a full sentence, you're going too fast. The conversation test is your truest pace." },
  { title: "Quick feet — 1-2-3, 1-2-3.", body: "Light, short steps. Land under your hips, not in front of them. Speed will come later; rhythm is the work now." },
  { title: "Once-weekly sprint activation.", body: "At the start of one run each week, sprint for 10 seconds. Then jog easy. This wakes up your running mechanics." },
  { title: "Hydrate before, sleep after.", body: "Drink water 30 minutes before the run. Get to bed early on Saturday — Sunday is the day that matters most." },
  { title: "Sharp pain means stop.", body: "Soreness is fine. Sharp pain in joints or shins means rest, not push through. There is no medal for ignoring your body." },
];

const SATURDAY_RECOVERY = [
  { lab: "Calf stretches", note: "Both straight-leg and bent-knee. 30 seconds each." },
  { lab: "Hip stretches", note: "Pigeon, hip flexor lunge, butterfly. 45s holds." },
  { lab: "Ankle mobility", note: "Circles each direction × 20, alphabet drill with toes." },
  { lab: "Foam rolling", note: "Calves, quads, IT band — if available. Tennis ball works too." },
  { lab: "Shin strengthening", note: "Toe taps and heel walks. Lagos pavement is unforgiving." },
  { lab: "Easy walking", note: "20 minutes max. Not training — recovery." },
];

const LAGOS_SPOTS = [
  { name: "Lekki-Ikoyi Link Bridge", meta: "Flat · ~2 km · Well-lit" },
  { name: "Muri Okunola Park", meta: "Looped path · ~600 m · Safe" },
  { name: "University of Lagos", meta: "Track + roads · Quiet evenings" },
  { name: "Quiet estate roads", meta: "Variable · Lowest traffic" },
  { name: "Local school tracks", meta: "Measured · Flat · Predictable" },
];

// ============================================================
// Export to window
// ============================================================
Object.assign(window, {
  PLAN_START, RACE_DATE, RACE_NAME,
  DAYS, FOCUS, WEEKS, MONTH_INFO,
  BEGINNER_RULES, SATURDAY_RECOVERY, LAGOS_SPOTS,
  addDays, dateForWeekDay, ymd, sameDay, fmtDate, fmtDateLong, ymd_dt,
  currentWeekIndex, findFocusWorkout, workoutId, workoutById,
  getPlanStart, setPlanStart, snapToTuesday,
});
