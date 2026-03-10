import { LESSON_SEQUENCE, LESSON_NAMES, LEVEL_MAP, getLevelForLesson } from "../hooks/useProgress";

/* ── Platform colours (must match App.js C palette) ─────────────── */
const C = {
  bg: "#050810", surface: "#0c1122", card: "#111827", border: "#1e2d47",
  accent: "#00d4ff", text: "#e2e8f0", muted: "#64748b",
};

const LEVEL_COLORS = {
  1:"#10b981", 2:"#4f46e5", 3:"#f59e0b",
  4:"#7c3aed", 5:"#ec4899", 6:"#f97316", 7:"#ef4444",
};

/**
 * LessonNavigation
 * A sticky bottom bar with:
 *   [← Previous Lesson]   [✔ Mark Complete]   [Next Lesson →]
 *
 * Props:
 *   currentKey  — e.g. "what-is-ai"
 *   isLoggedIn  — bool: whether to show progress features
 *   isComplete  — bool: whether this lesson is already marked complete
 *   onMarkComplete(key) — callback
 *   onNavigate(key)     — callback to open a lesson by key
 *   onBack()            — callback to go back to platform home
 */
export default function LessonNavigation({
  currentKey, isLoggedIn, isComplete, onMarkComplete, onNavigate, onBack,
}) {
  const idx     = LESSON_SEQUENCE.indexOf(currentKey);
  const prevKey = idx > 0  ? LESSON_SEQUENCE[idx - 1] : null;
  const nextKey = idx >= 0 && idx < LESSON_SEQUENCE.length - 1
    ? LESSON_SEQUENCE[idx + 1] : null;

  /* Is this the last lesson of the entire curriculum? */
  const isLastLesson = idx === LESSON_SEQUENCE.length - 1;

  /* Is the next lesson crossing into a new level? */
  const currentLevel = getLevelForLesson(currentKey);
  const nextLevel    = nextKey ? getLevelForLesson(nextKey) : null;
  const isCrossingLevel = nextLevel && nextLevel !== currentLevel;

  const accentColor = LEVEL_COLORS[currentLevel] || C.accent;

  const btnBase = {
    border: "none", borderRadius: 10, padding: "10px 20px",
    cursor: "pointer", fontWeight: 700, fontSize: 14,
    display: "flex", alignItems: "center", gap: 8,
    transition: "all 0.2s", whiteSpace: "nowrap",
  };

  const handlePrev = () => {
    if (prevKey) onNavigate(prevKey);
    else onBack(); // First lesson of level 1 → back to platform
  };

  const handleNext = () => {
    if (nextKey) onNavigate(nextKey);
  };

  return (
    <div style={{
      position: "sticky", bottom: 0, zIndex: 200,
      background: `${C.bg}f0`, backdropFilter: "blur(16px)",
      borderTop: `1px solid ${accentColor}33`,
      padding: "12px 20px",
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8, flexWrap: "wrap",
      }}>

        {/* ← Previous */}
        <button
          onClick={handlePrev}
          style={{
            ...btnBase,
            background: C.card,
            border: `1px solid ${C.border}`,
            color: C.muted,
            flex: "0 0 auto",
          }}
        >
          ← {prevKey ? LESSON_NAMES[prevKey] || "Previous" : "Back to Platform"}
        </button>

        {/* ✔ Mark Complete (centre) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: "0 0 auto" }}>
          {isLoggedIn ? (
            <button
              onClick={() => onMarkComplete(currentKey)}
              style={{
                ...btnBase,
                background: isComplete ? "#05966922" : accentColor + "22",
                border: `1px solid ${isComplete ? "#059669" : accentColor}66`,
                color: isComplete ? "#059669" : accentColor,
              }}
            >
              {isComplete ? "✔ Completed" : "○ Mark Complete"}
            </button>
          ) : (
            <span style={{ fontSize: 12, color: C.muted }}>
              🔒 Login to track progress
            </span>
          )}
          {/* Lesson name pill */}
          <span style={{
            fontSize: 11, color: C.muted,
            background: C.surface, borderRadius: 20,
            padding: "2px 10px", border: `1px solid ${C.border}`,
          }}>
            {LESSON_NAMES[currentKey] || currentKey}
          </span>
        </div>

        {/* Next → */}
        {isLastLesson ? (
          <button
            onClick={onBack}
            style={{ ...btnBase, background: `linear-gradient(135deg,#7c3aed,#059669)`, color: "#fff" }}
          >
            🎓 Finish Curriculum
          </button>
        ) : nextKey ? (
          <button
            onClick={handleNext}
            style={{
              ...btnBase,
              background: `linear-gradient(135deg,${accentColor}22,${LEVEL_COLORS[nextLevel] || accentColor}22)`,
              border: `1px solid ${accentColor}66`,
              color: accentColor,
            }}
          >
            {isCrossingLevel
              ? `Next Level: ${LESSON_NAMES[nextKey] || nextKey} →`
              : `${LESSON_NAMES[nextKey] || nextKey} →`
            }
          </button>
        ) : null}
      </div>
    </div>
  );
}
