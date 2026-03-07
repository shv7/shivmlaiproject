import React from "react";
import VectorsMatrices from "./VectorsMatrices";
import DotProduct from "./DotProduct";
import GradientDescent from "./GradientDescent";
import Probability from "./Probability";
import Statistics from "./Statistics";

/* ══════════════════════════════════════════════════════════════════
   Level2 MathForAI — Level 2 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as VectorsMatrices } from "./VectorsMatrices";
export { default as DotProduct } from "./DotProduct";
export { default as GradientDescent } from "./GradientDescent";
export { default as Probability } from "./Probability";
export { default as Statistics } from "./Statistics";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"vectorsmatrices", label:"Vectors & Matrices", accent:"#4f46e5", lesson:1 },
  { key:"dotproduct", label:"Dot Product", accent:"#7c3aed", lesson:2 },
  { key:"gradientdescent", label:"Gradient Descent", accent:"#0891b2", lesson:3 },
  { key:"probability", label:"Probability", accent:"#059669", lesson:4 },
  { key:"statistics", label:"Statistics", accent:"#d97706", lesson:5 }
];

// ── Default export: Level 2 container component ─────────────
function Level2_MathForAI({ onOpenLesson }) {
  const ACC = "#4f46e5";
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

export default Level2_MathForAI;
