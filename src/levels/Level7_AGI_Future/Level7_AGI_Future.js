import React from "react";
import ArtificialGeneralIntelligence from "./ArtificialGeneralIntelligence";
import Superintelligence from "./Superintelligence";
import AIAlignment from "./AIAlignment";
import SafetyEthics from "./SafetyEthics";
import FutureOfAI from "./FutureOfAI";

/* ══════════════════════════════════════════════════════════════════
   Level7 AGI Future — Level 7 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as ArtificialGeneralIntelligence } from "./ArtificialGeneralIntelligence";
export { default as Superintelligence } from "./Superintelligence";
export { default as AIAlignment } from "./AIAlignment";
export { default as SafetyEthics } from "./SafetyEthics";
export { default as FutureOfAI } from "./FutureOfAI";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"artificialgeneralintelligence", label:"Artificial General Intelligence", accent:"#ef4444", lesson:1 },
  { key:"superintelligence", label:"Superintelligence", accent:"#7c3aed", lesson:2 },
  { key:"aialignment", label:"AI Alignment", accent:"#f59e0b", lesson:3 },
  { key:"safetyethics", label:"Safety & Ethics", accent:"#0891b2", lesson:4 },
  { key:"futureofai", label:"Future of AI", accent:"#059669", lesson:5 }
];

// ── Default export: Level 7 container component ─────────────
function Level7_AGI_Future({ onOpenLesson }) {
  const ACC = "#ef4444";
  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", padding:"20px" }}>
      {LESSONS.map(l => (
        <button key={l.key}
          onClick={() => onOpenLesson && onOpenLesson(l.key)}
          style={{ margin:6, padding:"8px 16px", background:l.accent+"18",
            border:`1px solid ${l.accent}44`, borderRadius:10,
            color:l.accent, cursor:"pointer", fontSize:13, fontWeight:700 }}>
          {l.lesson}. {l.label}
        </button>
      ))}
    </div>
  );
}

export default Level7_AGI_Future;
