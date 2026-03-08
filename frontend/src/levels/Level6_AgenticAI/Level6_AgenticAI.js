import React from "react";
import AIAgents from "./AIAgents";
import PlanningMemory from "./PlanningMemory";
import ToolUsage from "./ToolUsage";
import MultiAgentSystems from "./MultiAgentSystems";
import ReActFramework from "./ReActFramework";

/* ══════════════════════════════════════════════════════════════════
   Level6 AgenticAI — Level 6 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as AIAgents } from "./AIAgents";
export { default as PlanningMemory } from "./PlanningMemory";
export { default as ToolUsage } from "./ToolUsage";
export { default as MultiAgentSystems } from "./MultiAgentSystems";
export { default as ReActFramework } from "./ReActFramework";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"aiagents", label:"AI Agents", accent:"#f97316", lesson:1 },
  { key:"planningmemory", label:"Planning & Memory", accent:"#7c3aed", lesson:2 },
  { key:"toolusage", label:"Tool Usage", accent:"#0891b2", lesson:3 },
  { key:"multiagentsystems", label:"Multi-Agent Systems", accent:"#e11d48", lesson:4 },
  { key:"reactframework", label:"ReAct Framework", accent:"#059669", lesson:5 }
];

// ── Default export: Level 6 container component ─────────────
function Level6_AgenticAI({ onOpenLesson }) {
  const ACC = "#f97316";
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

export default Level6_AgenticAI;
