import React from "react";
import SupervisedLearning from "./SupervisedLearning";
import Regression from "./Regression";
import Classification from "./Classification";
import DecisionTrees from "./DecisionTrees";
import RandomForests from "./RandomForests";
import Clustering from "./Clustering";
import EvaluationMetrics from "./EvaluationMetrics";
import LibrariesAndProject from "./LibrariesAndProject";

/* ══════════════════════════════════════════════════════════════════
   Level3 MachineLearning — Level 3 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as SupervisedLearning } from "./SupervisedLearning";
export { default as Regression } from "./Regression";
export { default as Classification } from "./Classification";
export { default as DecisionTrees } from "./DecisionTrees";
export { default as RandomForests } from "./RandomForests";
export { default as Clustering } from "./Clustering";
export { default as EvaluationMetrics } from "./EvaluationMetrics";
export { default as LibrariesAndProject } from "./LibrariesAndProject";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"supervisedlearning",  label:"Supervised Learning", accent:"#f59e0b", lesson:1 },
  { key:"regression",          label:"Regression",          accent:"#ef4444", lesson:2 },
  { key:"classification",      label:"Classification",      accent:"#8b5cf6", lesson:3 },
  { key:"decisiontrees",       label:"Decision Trees",      accent:"#059669", lesson:4 },
  { key:"randomforests",       label:"Random Forests",      accent:"#0891b2", lesson:5 },
  { key:"clustering",          label:"Clustering",          accent:"#ec4899", lesson:6 },
  { key:"evaluationmetrics",   label:"Evaluation Metrics",  accent:"#f97316", lesson:7 },
  { key:"librariesandproject", label:"ML Libraries & Final Project", accent:"#4f46e5", lesson:8 },
];

// ── Default export: Level 3 container component ─────────────
function Level3_MachineLearning({ onOpenLesson }) {
  const ACC = "#f59e0b";
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

export default Level3_MachineLearning;
