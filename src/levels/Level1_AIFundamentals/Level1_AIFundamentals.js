import React from "react";
import WhatIsAI from "./WhatIsAI";
import HistoryOfAI from "./HistoryOfAI";
import AIVsMLVsDL from "./AIVsMLVsDL";
import TypesOfAI from "./TypesOfAI";
import AIApplications from "./AIApplications";

/* ══════════════════════════════════════════════════════════════════
   Level1 AIFundamentals — Level 1 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as WhatIsAI } from "./WhatIsAI";
export { default as HistoryOfAI } from "./HistoryOfAI";
export { default as AIVsMLVsDL } from "./AIVsMLVsDL";
export { default as TypesOfAI } from "./TypesOfAI";
export { default as AIApplications } from "./AIApplications";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"whatisai", label:"What is AI", accent:"#f59e0b", lesson:1 },
  { key:"historyofai", label:"History of AI", accent:"#0d9488", lesson:2 },
  { key:"aivsmlvsdl", label:"AI vs ML vs Deep Learning", accent:"#7c3aed", lesson:3 },
  { key:"typesofai", label:"Types of AI", accent:"#0284c7", lesson:4 },
  { key:"aiapplications", label:"AI Applications", accent:"#10b981", lesson:5 }
];

// ── Default export: Level 1 container component ─────────────
function Level1_AIFundamentals({ onOpenLesson }) {
  const ACC = "#00d4ff";
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

export default Level1_AIFundamentals;
