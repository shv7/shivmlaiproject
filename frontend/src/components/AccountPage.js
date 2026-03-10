import { useState } from "react";
import ProgressBar from "./ProgressBar";
import GoogleLoginComponent from "./GoogleLoginComponent";
import {
  LEVEL_MAP, LEVEL_COLORS, LEVEL_TITLES,
  LESSON_NAMES, getLevelForLesson,
} from "../hooks/useProgress";

const C = {
  bg: "#050810", surface: "#0c1122", card: "#111827", border: "#1e2d47",
  accent: "#00d4ff", accent2: "#7c3aed", text: "#e2e8f0", muted: "#64748b",
};

const card = {
  background: C.card, border: `1px solid ${C.border}`,
  borderRadius: 16, padding: "24px",
};

/* ── Mini section heading ────────────────────────────────────────── */
const SH = ({ title, icon }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <span style={{ fontSize: 20 }}>{icon}</span>
    <h3 style={{ color: C.text, fontWeight: 800, fontSize: 16, margin: 0 }}>{title}</h3>
  </div>
);

/* ── Not logged in state ─────────────────────────────────────────── */
const NotLoggedIn = ({ onLogin }) => (
  <div style={{ textAlign: "center", padding: "80px 24px" }}>
    <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
    <h2 style={{ color: C.text, fontWeight: 800, fontSize: 24, marginBottom: 8 }}>
      Login to Access Your Account
    </h2>
    <p style={{ color: C.muted, fontSize: 15, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
      Login with Google to track your progress, see completed lessons, and view your learning dashboard.
    </p>
    <GoogleLoginComponent onLoginSuccess={onLogin} accentColor={C.accent} />
  </div>
);

/* ── Profile Card ────────────────────────────────────────────────── */
const ProfileCard = ({ user, onLogout }) => (
  <div style={{ ...card, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
    {user.picture ? (
      <img src={user.picture} alt={user.name}
        style={{ width: 72, height: 72, borderRadius: "50%", border: `3px solid ${C.accent}`, flexShrink: 0 }} />
    ) : (
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
        {user.name?.[0]?.toUpperCase() || "?"}
      </div>
    )}
    <div style={{ flex: 1, minWidth: 160 }}>
      <div style={{ color: C.text, fontWeight: 800, fontSize: 20 }}>{user.name}</div>
      <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{user.email}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ background: "#10b98122", border: "1px solid #10b98144", borderRadius: 20, padding: "2px 10px", color: "#10b981", fontSize: 11, fontWeight: 700 }}>
          ✓ Google Account
        </span>
        <span style={{ color: C.muted, fontSize: 11 }}>
          Joined {user.loginAt ? new Date(user.loginAt).toLocaleDateString() : "—"}
        </span>
      </div>
    </div>
    <button onClick={onLogout} style={{
      background: "#ef444415", border: "1px solid #ef444433",
      borderRadius: 10, padding: "8px 18px", color: "#ef4444",
      cursor: "pointer", fontWeight: 700, fontSize: 13,
    }}>
      Logout
    </button>
  </div>
);

/* ── Stats row ───────────────────────────────────────────────────── */
const StatsRow = ({ overall, completedLevels, completedLessonsCount }) => {
  const stats = [
    { icon: "📚", value: 7, label: "Total Levels" },
    { icon: "🏆", value: completedLevels, label: "Levels Complete" },
    { icon: "✅", value: completedLessonsCount, label: "Lessons Done" },
    { icon: "🎯", value: `${overall.pct}%`, label: "Overall Progress" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12 }}>
      {stats.map(s => (
        <div key={s.label} style={{ ...card, textAlign: "center", padding: "16px 12px" }}>
          <div style={{ fontSize: 28 }}>{s.icon}</div>
          <div style={{ color: C.accent, fontWeight: 900, fontSize: 26, fontFamily: "monospace", margin: "4px 0" }}>
            {s.value}
          </div>
          <div style={{ color: C.muted, fontSize: 12 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ── Level progress list ─────────────────────────────────────────── */
const LevelProgressSection = ({ getLevelProgress, onOpenLesson }) => (
  <div style={card}>
    <SH title="Learning Progress" icon="📊" />
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {Object.entries(LEVEL_MAP).map(([lvl, lessons]) => {
        const { done, total, pct } = getLevelProgress(Number(lvl));
        const color = LEVEL_COLORS[lvl];
        return (
          <div key={lvl}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
              <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>
                Level {lvl} — {LEVEL_TITLES[lvl]}
              </span>
              <span style={{ color, fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
                {done}/{total}
              </span>
            </div>
            <ProgressBar pct={pct} color={color} showPct={false} height={7} />
          </div>
        );
      })}
    </div>
  </div>
);

/* ── Completed lessons list ──────────────────────────────────────── */
const CompletedLessonsSection = ({ completed, onOpenLesson }) => {
  const [showAll, setShowAll] = useState(false);
  const allCompleted = [...completed];
  const visible = showAll ? allCompleted : allCompleted.slice(0, 10);

  if (allCompleted.length === 0) {
    return (
      <div style={card}>
        <SH title="Completed Lessons" icon="✅" />
        <div style={{ color: C.muted, fontSize: 14, textAlign: "center", padding: "24px 0" }}>
          No lessons completed yet. Start learning! 🚀
        </div>
      </div>
    );
  }

  return (
    <div style={card}>
      <SH title={`Completed Lessons (${allCompleted.length})`} icon="✅" />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {visible.map(key => {
          const lvl = getLevelForLesson(key);
          const color = LEVEL_COLORS[lvl] || C.accent;
          return (
            <div key={key}
              onClick={() => onOpenLesson(key)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", background: C.surface,
                borderRadius: 10, cursor: "pointer",
                border: `1px solid ${C.border}`,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = color + "66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
            >
              <span style={{ color: "#059669", fontWeight: 700, fontSize: 16 }}>✔</span>
              <span style={{ color: C.text, fontSize: 13, flex: 1 }}>
                {LESSON_NAMES[key] || key}
              </span>
              <span style={{
                fontSize: 10, color, background: color + "15",
                border: `1px solid ${color}33`, borderRadius: 20,
                padding: "1px 8px", fontWeight: 700,
              }}>
                L{lvl}
              </span>
            </div>
          );
        })}
      </div>
      {allCompleted.length > 10 && (
        <button onClick={() => setShowAll(s => !s)} style={{
          marginTop: 10, background: "transparent",
          border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "6px 14px", color: C.muted, cursor: "pointer",
          fontSize: 12, width: "100%",
        }}>
          {showAll ? "Show less ▲" : `Show ${allCompleted.length - 10} more ▼`}
        </button>
      )}
    </div>
  );
};

/* ── All lessons (including locked) ─────────────────────────────── */
const AllLessonsSection = ({ completed, onOpenLesson }) => {
  const [expandedLevel, setExpandedLevel] = useState(null);
  return (
    <div style={card}>
      <SH title="All Lessons" icon="📖" />
      {Object.entries(LEVEL_MAP).map(([lvl, lessons]) => {
        const color = LEVEL_COLORS[lvl];
        const doneCount = lessons.filter(k => completed.has(k)).length;
        const open = expandedLevel === lvl;
        return (
          <div key={lvl} style={{ marginBottom: 8 }}>
            <div
              onClick={() => setExpandedLevel(open ? null : lvl)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", background: C.surface,
                borderRadius: 10, cursor: "pointer",
                border: `1px solid ${open ? color + "66" : C.border}`,
              }}
            >
              <span style={{ color, fontWeight: 700, fontSize: 13, flex: 1 }}>
                Level {lvl} — {LEVEL_TITLES[lvl]}
              </span>
              <span style={{ color: C.muted, fontSize: 12 }}>{doneCount}/{lessons.length}</span>
              <span style={{ color }}>{open ? "▲" : "▼"}</span>
            </div>
            {open && (
              <div style={{ paddingLeft: 8, marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                {lessons.map(key => {
                  const done = completed.has(key);
                  return (
                    <div key={key}
                      onClick={() => onOpenLesson(key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 14px", background: done ? "#05966910" : C.bg,
                        borderRadius: 8, cursor: "pointer",
                        border: `1px solid ${done ? "#05966933" : C.border}`,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: done ? "#059669" : C.muted, fontWeight: 700 }}>
                        {done ? "✔" : "○"}
                      </span>
                      <span style={{ color: done ? C.text : C.muted, flex: 1 }}>
                        {LESSON_NAMES[key] || key}
                      </span>
                      <span style={{ color: color, fontSize: 10 }}>▶ Open</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN AccountPage
══════════════════════════════════════════════════════════════════ */
export default function AccountPage({
  user, isLoggedIn, onLogin, onLogout,
  completed, getLevelProgress, getOverallProgress, completedLevels,
  onOpenLesson,
}) {
  const [tab, setTab] = useState("progress");
  const overall = getOverallProgress();

  if (!isLoggedIn) {
    return (
      <div style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
        <NotLoggedIn onLogin={onLogin} />
      </div>
    );
  }

  const tabs = [
    { id: "progress",  label: "📊 Progress"  },
    { id: "completed", label: "✅ Completed"  },
    { id: "all",       label: "📖 All Lessons"},
  ];

  return (
    <div style={{ background: C.bg, minHeight: "calc(100vh - 64px)" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div>
          <h2 style={{ color: C.text, fontWeight: 900, fontSize: "clamp(1.4rem,4vw,2rem)", marginBottom: 4, fontFamily: "'Syne',sans-serif" }}>
            My <span style={{ color: C.accent }}>Account</span>
          </h2>
          <p style={{ color: C.muted, fontSize: 14 }}>Your learning profile and progress dashboard</p>
        </div>

        {/* Profile */}
        <ProfileCard user={user} onLogout={onLogout} />

        {/* Stats */}
        <StatsRow
          overall={overall}
          completedLevels={completedLevels}
          completedLessonsCount={completed.size}
        />

        {/* Overall progress bar */}
        <div style={card}>
          <SH title="Overall Progress" icon="🎯" />
          <ProgressBar pct={overall.pct} color={C.accent} label={`${overall.done} of ${overall.total} lessons complete`} height={12} />
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, background: C.surface, borderRadius: 12, padding: 6, border: `1px solid ${C.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, background: tab === t.id ? C.accent + "22" : "transparent",
              border: tab === t.id ? `1px solid ${C.accent}66` : "1px solid transparent",
              borderRadius: 8, padding: "8px 4px", cursor: "pointer",
              color: tab === t.id ? C.accent : C.muted,
              fontWeight: 700, fontSize: 13, transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "progress"  && <LevelProgressSection getLevelProgress={getLevelProgress} onOpenLesson={onOpenLesson} />}
        {tab === "completed" && <CompletedLessonsSection completed={completed} onOpenLesson={onOpenLesson} />}
        {tab === "all"       && <AllLessonsSection completed={completed} onOpenLesson={onOpenLesson} />}

      </div>
    </div>
  );
}
