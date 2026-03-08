import React from "react";
import NeuralNetworks from "./NeuralNetworks";
import ActivationFunctions from "./ActivationFunctions";
import Backpropagation from "./Backpropagation";
import CNNs from "./CNNs";
import RNNs from "./RNNs";
import LSTM from "./LSTM";
import Transformers from "./Transformers";

/* ══════════════════════════════════════════════════════════════════
   Level4 DeepLearning — Level 4 Container
   ─────────────────────────────────────────────────────────────────
   Named re-exports: App.js imports individual lesson pages from here.
   Default export  : Level container (renders lesson selector UI).
   
   HOW TO ADD A NEW LESSON:
     1. Create MyLesson.js in this folder
     2. Add: export { default as MyLesson } from "./MyLesson";
     3. Add its route key to LESSON_ROUTES in App.js
══════════════════════════════════════════════════════════════════ */

// ── Named re-exports — consumed by App.js routing ─────────────────
export { default as NeuralNetworks } from "./NeuralNetworks";
export { default as ActivationFunctions } from "./ActivationFunctions";
export { default as Backpropagation } from "./Backpropagation";
export { default as CNNs } from "./CNNs";
export { default as RNNs } from "./RNNs";
export { default as LSTM } from "./LSTM";
export { default as Transformers } from "./Transformers";

// ── Lesson metadata ───────────────────────────────────────────────
export const LESSONS = [
  { key:"neuralnetworks", label:"Neural Networks", accent:"#7c3aed", lesson:1 },
  { key:"activationfunctions", label:"Activation Functions", accent:"#0891b2", lesson:2 },
  { key:"backpropagation", label:"Backpropagation", accent:"#e11d48", lesson:3 },
  { key:"cnns", label:"Convolutional Neural Nets", accent:"#f59e0b", lesson:4 },
  { key:"rnns", label:"Recurrent Neural Nets", accent:"#059669", lesson:5 },
  { key:"lstm", label:"LSTM", accent:"#4f46e5", lesson:6 },
  { key:"transformers", label:"Transformers", accent:"#ec4899", lesson:7 }
];

// ── Default export: Level 4 container component ─────────────
function Level4_DeepLearning({ onOpenLesson }) {
  const ACC = "#7c3aed";
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

export default Level4_DeepLearning;
