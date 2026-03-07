import React from "react";
import LargeLanguageModels from "./LargeLanguageModels";
import Embeddings from "./Embeddings";
import VectorDatabases from "./VectorDatabases";
import RAGSystems from "./RAGSystems";
import DiffusionModels from "./DiffusionModels";

/* ══════════════════════════════════════════════════════════════════
   Level5 ModernAISystems — Level 5 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as LargeLanguageModels } from "./LargeLanguageModels";
export { default as Embeddings } from "./Embeddings";
export { default as VectorDatabases } from "./VectorDatabases";
export { default as RAGSystems } from "./RAGSystems";
export { default as DiffusionModels } from "./DiffusionModels";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"largelanguagemodels", label:"Large Language Models", accent:"#ec4899", lesson:1 },
  { key:"embeddings", label:"Embeddings", accent:"#8b5cf6", lesson:2 },
  { key:"vectordatabases", label:"Vector Databases", accent:"#0891b2", lesson:3 },
  { key:"ragsystems", label:"RAG Systems", accent:"#059669", lesson:4 },
  { key:"diffusionmodels", label:"Diffusion Models", accent:"#f97316", lesson:5 }
];

// ── Default export: Level 5 container component ─────────────
function Level5_ModernAISystems({ onOpenLesson }) {
  const ACC = "#ec4899";
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

export default Level5_ModernAISystems;
