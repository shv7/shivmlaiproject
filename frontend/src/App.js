import { GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useRef, useState } from "react";

/* ─── New feature components ────────────────────────────────────── */
import AccountPage from "./components/AccountPage";
import LessonNavigation from "./components/LessonNavigation";
import { useAuth } from "./hooks/useAuth";
import { useProgress } from "./hooks/useProgress";

/* ─── Level 1 — AI Fundamentals ─────────────────────────────────── */
import {
  AIApplications as AIApplicationsPage, AIVsMLVsDL as AIvsMLPage, HistoryOfAI as HistoryOfAIPage, TypesOfAI as TypesOfAIPage, WhatIsAI as WhatIsAIPage
} from "./levels/Level1_AIFundamentals/Level1_AIFundamentals";

/* ─── Level 2 — Math for AI ─────────────────────────────────────── */
import {
  DotProduct as DotProductPage,
  GradientDescent as GradientDescentPage,
  Probability as ProbabilityPage,
  Statistics as StatisticsPage, VectorsMatrices as VectorsMatricesPage
} from "./levels/Level2_MathForAI/Level2_MathForAI";

/* ─── Level 3 — Machine Learning ────────────────────────────────── */
import {
  Classification as ClassificationPage, Clustering as ClusteringPage, DecisionTrees as DecisionTreesPage, EvaluationMetrics as EvaluationMetricsPage,
  LibrariesAndProject as LibrariesAndProjectPage, RandomForests as RandomForestsPage, Regression as RegressionPage, SupervisedLearning as SupervisedLearningPage
} from "./levels/Level3_MachineLearning/Level3_MachineLearning";

/* ─── Level 4 — Deep Learning ───────────────────────────────────── */
import {
  ActivationFunctions as ActivationFunctionsPage,
  Backpropagation as BackpropagationPage,
  CNNs as CNNsPage, LSTM as LSTMPage, NeuralNetworks as NeuralNetworksPage, RNNs as RNNsPage, Transformers as TransformersPage
} from "./levels/Level4_DeepLearning/Level4_DeepLearning";

/* ─── Level 5 — Modern AI Systems ───────────────────────────────── */
import {
  DiffusionModels as DiffusionModelsPage, Embeddings as EmbeddingsPage, LargeLanguageModels as LargeLanguageModelsPage, RAGSystems as RAGSystemsPage, VectorDatabases as VectorDatabasesPage
} from "./levels/Level5_ModernAISystems/Level5_ModernAISystems";

/* ─── Level 6 — Agentic AI ──────────────────────────────────────── */
import {
  AIAgents as AIAgentsPage, MultiAgentSystems as MultiAgentSystemsPage, PlanningMemory as PlanningMemoryPage, ReActFramework as ReActFrameworkPage, ToolUsage as ToolUsagePage
} from "./levels/Level6_AgenticAI/Level6_AgenticAI";

/* ─── Level 7 — AGI & The Future ────────────────────────────────── */
import {
  AIAlignment as AIAlignmentPage, ArtificialGeneralIntelligence as AGIPage, FutureOfAI as FutureOfAIPage, SafetyEthics as SafetyEthicsPage, Superintelligence as SuperintelligencePage
} from "./levels/Level7_AGI_Future/Level7_AGI_Future";

/* ─── Shared palette (T.amber / T.paper used in lesson nav CSS) ─── */

/* ═══════════════════════════════════════════════════════════════════
   SHIVMLAI — MAIN PLATFORM
   Platform palette, helpers, and all platform-level components live
   here. Lesson content lives in src/levels/...
═══════════════════════════════════════════════════════════════════ */

/* Google OAuth Client ID */
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";

// ── Main platform palette ─────────────────────────────────────────
const C = {
  bg: "#050810", surface: "#0c1122", card: "#111827", border: "#1e2d47",
  accent: "#00d4ff", accent2: "#7c3aed", accent3: "#10b981",
  gold: "#f59e0b", warn: "#ef4444", text: "#e2e8f0", muted: "#64748b",
};


const useTyping = (words, speed = 80, pause = 1800) => {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const w = words[idx]; let timeout;
    if (!deleting && charIdx <= w.length) { setDisplay(w.slice(0, charIdx)); timeout = setTimeout(() => setCharIdx(c => c + 1), speed); }
    else if (!deleting && charIdx > w.length) { timeout = setTimeout(() => setDeleting(true), pause); }
    else if (deleting && charIdx >= 0) { setDisplay(w.slice(0, charIdx)); timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2); }
    else { setDeleting(false); setIdx(i => (i + 1) % words.length); }
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIdx, deleting, idx]);
  return display;
};

const cardStyle = { background: `linear-gradient(135deg, ${C.card}, ${C.surface})`, border: `1px solid ${C.border}`, borderRadius: 16, padding: "20px" };
const btnStyle = (color) => ({ background: `${color}22`, border: `1px solid ${color}88`, borderRadius: 8, padding: "8px 16px", color, cursor: "pointer", fontWeight: 600, fontSize: 14, display: "inline-block" });
const sectionHeading = (text, sub, accent = C.accent) => (
  <div style={{ textAlign: "center", marginBottom: 40 }}>
    <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900, color: C.text, fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
      {text.split(" ").map((w, i) => <span key={i} style={{ color: i === 0 ? accent : C.text }}>{w} </span>)}
    </h2>
    {sub && <p style={{ color: C.muted, marginTop: 8, fontSize: 16 }}>{sub}</p>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   PLATFORM COMPONENTS
═══════════════════════════════════════════════════════════════════ */

const NeuralCanvas = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const layers = [[3, 5, 4, 3], [4, 6, 5, 4, 3]];
    const chosen = layers[Math.floor(Math.random() * 2)];
    const nodes = [];
    const xStep = W / (chosen.length + 1);
    chosen.forEach((n, li) => {
      const x = xStep * (li + 1), yStep = H / (n + 1);
      for (let ni = 0; ni < n; ni++) nodes.push({ x, y: yStep * (ni + 1), layer: li, val: Math.random() });
    });
    const connections = [];
    for (let i = 0; i < nodes.length; i++)
      for (let j = 0; j < nodes.length; j++)
        if (nodes[j].layer === nodes[i].layer + 1) connections.push({ from: i, to: j, w: Math.random() });
    let t = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W, H); t += 0.01;
      connections.forEach(({ from, to, w }) => {
        const a = nodes[from], b = nodes[to], pulse = (Math.sin(t * 2 + w * 10) + 1) / 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(0,212,255,${0.05 + pulse * 0.15})`; ctx.lineWidth = 0.8; ctx.stroke();
      });
      nodes.forEach((n, i) => {
        const pulse = (Math.sin(t * 1.5 + i * 0.7) + 1) / 2, r = 8 + pulse * 4;
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r);
        const colors = ["#00d4ff", "#7c3aed", "#10b981"], col = colors[n.layer % colors.length];
        grad.addColorStop(0, col + "cc"); grad.addColorStop(1, col + "00");
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fillStyle = grad; ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);
  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

const ParticleField = () => {
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 2 + 1 }));
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(0,212,255,0.25)"; ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = `rgba(0,212,255,${0.1 * (1 - d / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
      }));
      requestAnimationFrame(draw);
    };
    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
};

const GradientViz = () => {
  const canvasRef = useRef();
  const [running, setRunning] = useState(false);
  const [lr, setLr] = useState(0.05);
  const posRef = useRef({ x: 0.85, y: 0.15 }), pathRef = useRef([]), rafRef = useRef();
  const loss = (x, y) => Math.pow(x, 2) * 2 + Math.pow(y, 2) * 3 + x * y - x * 0.5;
  const gradX = (x, y) => 4 * x + y - 0.5, gradY = (x, y) => 6 * y + x;
  const toCanvas = (x, y, W, H) => ({ cx: ((x + 1) / 2) * W, cy: ((1 - (y + 1) / 2)) * H });
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let xi = 0; xi < W; xi += 4) for (let yi = 0; yi < H; yi += 4) {
        const wx = (xi / W) * 2 - 1, wy = 1 - (yi / H) * 2, l = Math.min(loss(wx, wy) / 3, 1);
        ctx.fillStyle = `rgb(${Math.round(l * 30 + 5)},${Math.round((1 - l) * 100 + 20)},${Math.round(l * 120 + 60)})`; ctx.fillRect(xi, yi, 4, 4);
      }
      ctx.beginPath();
      pathRef.current.forEach((p, i) => { const { cx, cy } = toCanvas(p.x, p.y, W, H); i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy); });
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.stroke();
      if (pathRef.current.length > 0) {
        const last = pathRef.current[pathRef.current.length - 1], { cx, cy } = toCanvas(last.x, last.y, W, H);
        ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fillStyle = "#00d4ff"; ctx.fill();
      }
    };
    const step = () => {
      const { x, y } = posRef.current, nx = x - lr * gradX(x, y), ny = y - lr * gradY(x, y);
      posRef.current = { x: nx, y: ny }; pathRef.current.push({ x: nx, y: ny }); draw();
      if (Math.abs(nx) > 0.001 || Math.abs(ny) > 0.001) rafRef.current = setTimeout(() => requestAnimationFrame(step), 80);
    };
    if (running) { pathRef.current = [{ ...posRef.current }]; requestAnimationFrame(step); } else { draw(); }
    return () => clearTimeout(rafRef.current);
  }, [running, lr]); // eslint-disable-line react-hooks/exhaustive-deps
  const reset = () => { posRef.current = { x: 0.85, y: 0.15 }; pathRef.current = []; setRunning(false); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 220, borderRadius: 12, border: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setRunning(r => !r)} style={btnStyle(running ? C.warn : C.accent3)}>{running ? "⏸ Pause" : "▶ Run GD"}</button>
        <button onClick={reset} style={btnStyle(C.muted)}>↺ Reset</button>
        <label style={{ color: C.muted, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
          LR: <input type="range" min="0.01" max="0.2" step="0.01" value={lr} onChange={e => { setLr(+e.target.value); reset(); }} style={{ width: 80 }} />
          <span style={{ color: C.accent, width: 32 }}>{lr.toFixed(2)}</span>
        </label>
      </div>
      <p style={{ fontSize: 12, color: C.muted }}>🎯 The dot rolls down the loss landscape. Yellow = high loss, green = low loss.</p>
    </div>
  );
};

const ClusteringDemo = () => {
  const canvasRef = useRef();
  const [k, setK] = useState(3);
  const [pts] = useState(() => Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), c: -1 })));
  const [centroids, setCentroids] = useState([]);
  const [step, setStep] = useState(0);
  const colors = ["#00d4ff", "#f59e0b", "#10b981", "#ef4444", "#7c3aed"];
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const assign = (pts, cents) => pts.map(p => ({ ...p, c: cents.reduce((best, c, i) => dist(p, c) < dist(p, cents[best]) ? i : best, 0) }));
  const moveCentroids = (pts, k) => Array.from({ length: k }, (_, i) => { const m = pts.filter(p => p.c === i); return !m.length ? centroids[i] || { x: Math.random(), y: Math.random() } : { x: m.reduce((s, p) => s + p.x, 0) / m.length, y: m.reduce((s, p) => s + p.y, 0) / m.length }; });
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { const col = p.c >= 0 ? colors[p.c % colors.length] : C.muted; ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 5, 0, Math.PI * 2); ctx.fillStyle = col + "aa"; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.stroke(); });
    centroids.forEach((c2, i) => { ctx.beginPath(); ctx.arc(c2.x * W, c2.y * H, 10, 0, Math.PI * 2); ctx.fillStyle = colors[i % colors.length]; ctx.fill(); ctx.fillStyle = "#000"; ctx.font = "bold 10px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("✕", c2.x * W, c2.y * H); });
  }, [pts, centroids, step]); // eslint-disable-line react-hooks/exhaustive-deps
  const initCentroids = () => { const s = [...pts].sort(() => Math.random() - 0.5); setCentroids(s.slice(0, k).map(p => ({ x: p.x, y: p.y }))); pts.forEach(p => p.c = -1); setStep(0); };
  const doStep = () => {
    if (!centroids.length) return initCentroids();
    if (step % 2 === 0) { const a = assign(pts, centroids); a.forEach((x, i) => pts[i].c = x.c); }
    else { setCentroids(moveCentroids(pts, k)); }
    setStep(s => s + 1);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 220, borderRadius: 12, border: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={initCentroids} style={btnStyle(C.accent2)}>🎲 Init Clusters</button>
        <button onClick={doStep} style={btnStyle(C.accent)}>▶ Step ({step})</button>
        <label style={{ color: C.muted, fontSize: 13, display: "flex", gap: 6 }}>K: <input type="range" min="2" max="5" value={k} onChange={e => { setK(+e.target.value); initCentroids(); }} style={{ width: 60 }} /><span style={{ color: C.accent }}>{k}</span></label>
      </div>
      <p style={{ fontSize: 12, color: C.muted }}>🔵 Watch K-Means group data points step by step.</p>
    </div>
  );
};

const NNBuilder = () => {
  const [layers, setLayers] = useState([3, 4, 3, 2]);
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    ctx.clearRect(0, 0, W, H);
    const nodes = []; const xStep = W / (layers.length + 1);
    layers.forEach((n, li) => { const x = xStep * (li + 1), yStep = H / (n + 1); for (let ni = 0; ni < n; ni++) nodes.push({ x, y: yStep * (ni + 1), layer: li }); });
    nodes.forEach(a => nodes.forEach(b => { if (b.layer === a.layer + 1) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.strokeStyle = "rgba(0,212,255,0.12)"; ctx.lineWidth = 1; ctx.stroke(); } }));
    const cols = [C.accent, C.accent2, C.accent3, C.gold];
    nodes.forEach(n => { ctx.beginPath(); ctx.arc(n.x, n.y, 10, 0, Math.PI * 2); ctx.fillStyle = cols[n.layer % cols.length] + "cc"; ctx.fill(); ctx.strokeStyle = cols[n.layer % cols.length]; ctx.lineWidth = 2; ctx.stroke(); });
  }, [layers]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 200, borderRadius: 12, border: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {layers.map((n, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <label style={{ fontSize: 11, color: C.muted }}>{i === 0 ? "Input" : i === layers.length - 1 ? "Output" : `H${i}`}</label>
            <input type="range" min="1" max="8" value={n} onChange={e => setLayers(l => l.map((v, j) => j === i ? +e.target.value : v))} style={{ width: 60, writingMode: "vertical-lr" }} />
            <span style={{ fontSize: 11, color: C.accent }}>{n}</span>
          </div>
        ))}
        <button onClick={() => setLayers(l => [...l.slice(0, -1), 2, l[l.length - 1]])} style={{ ...btnStyle(C.accent3), fontSize: 12, padding: "4px 10px" }}>+Layer</button>
        <button onClick={() => layers.length > 2 && setLayers(l => [...l.slice(0, -2), l[l.length - 1]])} style={{ ...btnStyle(C.warn), fontSize: 12, padding: "4px 10px" }}>-Layer</button>
      </div>
      <p style={{ fontSize: 12, color: C.muted }}>🧠 Drag sliders to change neurons per layer.</p>
    </div>
  );
};

const AGENT_STEPS = [
  { phase: "👁️ Observe", desc: "Scanning environment for user query and available tools...", color: C.accent },
  { phase: "🧠 Think", desc: "Reasoning about best approach: use Search, or use Calculator?", color: C.accent2 },
  { phase: "📋 Plan", desc: "Breaking goal into sub-tasks: (1) Search web, (2) Summarize results.", color: C.gold },
  { phase: "⚡ Act", desc: "Calling web_search('latest AI news')... ✓ Got 10 results.", color: C.accent3 },
  { phase: "🔁 Loop", desc: "Goal not complete. Looping back to re-observe with new information.", color: "#f97316" },
  { phase: "📝 Reflect", desc: "Evaluating quality of action results and refining plan.", color: "#ec4899" },
  { phase: "✅ Complete", desc: "Goal achieved! Delivering final answer to user.", color: C.accent3 },
];
function AgentSimulator() {
  const [stepIdx, setStepIdx] = useState(-1), [running, setRunning] = useState(false), intervalRef = useRef();
  useEffect(() => {
    if (running) { intervalRef.current = setInterval(() => setStepIdx(s => { if (s >= AGENT_STEPS.length - 1) { setRunning(false); return s; } return s + 1; }), 800); }
    return () => clearInterval(intervalRef.current);
  }, [running]);
  const reset = () => { setStepIdx(-1); setRunning(false); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {AGENT_STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: i <= stepIdx ? `${s.color}22` : C.bg, border: `1px solid ${i <= stepIdx ? s.color : C.border}`, transition: "all 0.4s", opacity: i <= stepIdx ? 1 : 0.35 }}>
            <span style={{ fontSize: 18, minWidth: 28 }}>{s.phase.split(" ")[0]}</span>
            <div style={{ flex: 1 }}><div style={{ color: i <= stepIdx ? s.color : C.muted, fontWeight: 700, fontSize: 13 }}>{s.phase}</div>{i <= stepIdx && <div style={{ color: C.muted, fontSize: 12 }}>{s.desc}</div>}</div>
            {i === stepIdx && <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, animation: "glow 1s infinite" }} />}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { reset(); setTimeout(() => setRunning(true), 100); }} style={btnStyle(C.accent)}>▶ Run Agent</button>
        <button onClick={reset} style={btnStyle(C.muted)}>↺ Reset</button>
      </div>
    </div>
  );
}

const QUIZZES = [
  { title: "AI Fundamentals", emoji: "🤖", questions: [
    { q: "What does AI stand for?", opts: ["Automatic Intelligence", "Artificial Intelligence", "Applied Iteration", "Advanced Imaging"], a: 1 },
    { q: "Which year did the term 'Artificial Intelligence' originate?", opts: ["1943", "1950", "1956", "1969"], a: 2 },
    { q: "Which of these is NOT a type of AI?", opts: ["Narrow AI", "General AI", "Super AI", "Liquid AI"], a: 3 },
    { q: "Machine Learning is a subset of:", opts: ["Data Science only", "Artificial Intelligence", "Statistics only", "Programming"], a: 1 },
    { q: "Who is considered the 'father of AI'?", opts: ["Alan Turing", "John McCarthy", "Marvin Minsky", "Geoffrey Hinton"], a: 1 },
    { q: "What is a neural network inspired by?", opts: ["Computer circuits", "The human brain", "DNA structure", "Solar systems"], a: 1 },
    { q: "Turing Test measures:", opts: ["Computation speed", "Machine's ability to exhibit intelligent behavior", "Memory capacity", "Algorithm efficiency"], a: 1 },
    { q: "NLP stands for:", opts: ["Neural Logic Processing", "Natural Language Processing", "Network Layer Protocol", "Numeric Learning Pattern"], a: 1 },
    { q: "Which of these is a real-world AI application?", opts: ["Calculator", "Thermostat", "ChatGPT", "USB drive"], a: 2 },
    { q: "Deep Learning uses:", opts: ["Decision trees", "Multi-layer neural networks", "Rule-based systems", "SQL queries"], a: 1 },
  ]},
  { title: "Neural Networks", emoji: "🧠", questions: [
    { q: "What is an activation function?", opts: ["A training algorithm", "A function that decides neuron output", "A loss calculator", "A data loader"], a: 1 },
    { q: "ReLU stands for:", opts: ["Recursive Linear Unit", "Rectified Linear Unit", "Random Learning Unit", "Robust Logic Unit"], a: 1 },
    { q: "Backpropagation is used for:", opts: ["Forward pass", "Computing gradients", "Pooling layers", "Tokenization"], a: 1 },
    { q: "Overfitting means:", opts: ["Model performs well on train but poorly on test", "Model is too simple", "Batch size is too small", "Learning rate is zero"], a: 0 },
    { q: "Which optimizer uses momentum?", opts: ["SGD", "Adam", "RMSProp", "All of the above"], a: 3 },
    { q: "What does dropout do?", opts: ["Speeds up training", "Randomly disables neurons to prevent overfitting", "Adds more neurons", "Loads data"], a: 1 },
    { q: "A CNN is best suited for:", opts: ["Text data", "Time series", "Image data", "Tabular data"], a: 2 },
    { q: "LSTM solves the:", opts: ["Underfitting problem", "Vanishing gradient problem", "Class imbalance", "Overfitting problem"], a: 1 },
    { q: "Batch normalization:", opts: ["Normalizes inputs to each layer", "Removes outliers", "Sorts batches", "Increases batch size"], a: 0 },
    { q: "Transfer learning means:", opts: ["Moving data between servers", "Using a pre-trained model on a new task", "Training from scratch", "Testing on new data"], a: 1 },
  ]},
  { title: "Machine Learning", emoji: "📊", questions: [
    { q: "Supervised learning requires:", opts: ["Unlabeled data", "Labeled data", "Reward signals", "No data"], a: 1 },
    { q: "K-Means is a type of:", opts: ["Classification", "Regression", "Clustering", "Reinforcement"], a: 2 },
    { q: "What is the bias-variance tradeoff?", opts: ["Balance between model complexity and generalization", "Speed vs accuracy", "Training vs testing split", "Precision vs recall"], a: 0 },
    { q: "Random Forest is an ensemble of:", opts: ["Neural networks", "SVMs", "Decision trees", "KNN"], a: 2 },
    { q: "Precision measures:", opts: ["All correct positives / all actual positives", "True positives / (True positives + False positives)", "True negatives / all negatives", "Accuracy on test set"], a: 1 },
    { q: "Which algorithm is best for email spam detection?", opts: ["K-Means", "Naive Bayes", "PCA", "DBSCAN"], a: 1 },
    { q: "Cross-validation is used to:", opts: ["Increase training data", "Evaluate model on unseen data", "Normalize features", "Increase accuracy"], a: 1 },
    { q: "Feature engineering means:", opts: ["Building new features from raw data", "Removing all features", "Adding random noise", "Selecting only numeric columns"], a: 0 },
    { q: "Logistic regression outputs:", opts: ["Continuous value", "Probability between 0 and 1", "Cluster labels", "Raw scores"], a: 1 },
    { q: "The elbow method helps choose:", opts: ["Learning rate", "Number of clusters K", "Number of trees", "Hidden layers"], a: 1 },
  ]},
];

const QuizSection = () => {
  const [active, setActive] = useState(null), [qIdx, setQIdx] = useState(0), [score, setScore] = useState(0), [selected, setSelected] = useState(null), [done, setDone] = useState(false);
  const start = (i) => { setActive(i); setQIdx(0); setScore(0); setSelected(null); setDone(false); };
  const answer = (i) => {
    if (selected !== null) return; setSelected(i);
    if (i === QUIZZES[active].questions[qIdx].a) setScore(s => s + 1);
    setTimeout(() => { if (qIdx + 1 < QUIZZES[active].questions.length) { setQIdx(q => q + 1); setSelected(null); } else setDone(true); }, 900);
  };
  if (active === null) return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
      {QUIZZES.map((q, i) => (
        <button key={i} onClick={() => start(i)} style={{ ...cardStyle, cursor: "pointer", textAlign: "left", border: `1px solid ${C.accent}44` }}>
          <div style={{ fontSize: 32 }}>{q.emoji}</div>
          <div style={{ fontWeight: 700, color: C.text, marginTop: 8 }}>{q.title}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{q.questions.length} questions</div>
          <div style={{ ...btnStyle(C.accent), marginTop: 12, textAlign: "center", fontSize: 13 }}>Start Quiz →</div>
        </button>
      ))}
    </div>
  );
  const quiz = QUIZZES[active];
  if (done) return (
    <div style={{ ...cardStyle, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ fontSize: 64 }}>{score >= 8 ? "🎉" : score >= 5 ? "😊" : "📚"}</div>
      <h3 style={{ color: C.accent, fontSize: 24 }}>{score >= 8 ? "Excellent!" : score >= 5 ? "Good job!" : "Keep learning!"}</h3>
      <p style={{ color: C.text, fontSize: 20 }}>Score: {score} / {quiz.questions.length}</p>
      <div style={{ marginTop: 16, display: "flex", gap: 8, justifyContent: "center" }}>
        <button onClick={() => start(active)} style={btnStyle(C.accent)}>Retry</button>
        <button onClick={() => setActive(null)} style={btnStyle(C.muted)}>All Quizzes</button>
      </div>
    </div>
  );
  const question = quiz.questions[qIdx];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ color: C.muted, fontSize: 13 }}>{quiz.emoji} {quiz.title}</span>
        <span style={{ color: C.accent, fontSize: 13 }}>{qIdx + 1}/{quiz.questions.length}</span>
      </div>
      <div style={{ background: `linear-gradient(135deg,${C.surface},${C.card})`, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 16 }}>
        <p style={{ color: C.text, fontSize: 17, fontWeight: 600, marginBottom: 20 }}>{question.q}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.opts.map((opt, i) => {
            let bg = C.card, border2 = C.border, col = C.text;
            if (selected !== null) { if (i === question.a) { bg = C.accent3 + "33"; border2 = C.accent3; col = C.accent3; } else if (i === selected && selected !== question.a) { bg = C.warn + "22"; border2 = C.warn; col = C.warn; } }
            return <button key={i} onClick={() => answer(i)} style={{ background: bg, border: `1px solid ${border2}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", textAlign: "left", color: col, fontSize: 14, transition: "all 0.2s" }}>{["A", "B", "C", "D"][i]}. {opt}</button>;
          })}
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 8, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(qIdx / quiz.questions.length) * 100}%`, background: `linear-gradient(90deg,${C.accent},${C.accent2})`, transition: "width 0.4s" }} />
      </div>
    </div>
  );
};

const CONCEPTS = [
  { title: "Machine Learning", emoji: "🤖", simple: "Teaching computers to learn from examples, just like humans.", visual: "Imagine showing 1000 cat photos to a computer. It learns patterns.", analogy: "Like teaching a kid to recognize dogs: show them 100 dogs, now they just know!", example: "Netflix recommends movies based on what you watched before.", math: "Find f(x) such that f(x) ≈ y, minimizing error ∑(yᵢ - ŷᵢ)²" },
  { title: "Neural Networks", emoji: "🧠", simple: "Layers of math nodes inspired by brain neurons that transform input to output.", visual: "Picture a factory: raw material goes in, through machines, finished product comes out.", analogy: "Like playing telephone — each layer whispers a transformed message forward.", example: "Face ID on your iPhone uses a neural network to recognize you.", math: "output = activation(W · x + b) repeated through layers" },
  { title: "Gradient Descent", emoji: "⛷️", simple: "A way for AI to get better by slowly moving in the direction that reduces mistakes.", visual: "Imagine blindfolded on a hilly landscape — take small steps downhill.", analogy: "Like adjusting oven temperature: too hot? lower it a bit. Too cold? raise it.", example: "Every time ChatGPT trains, gradient descent corrects its billions of weights.", math: "θ = θ - α · ∂L/∂θ (α = learning rate, L = loss)" },
  { title: "Overfitting", emoji: "🎭", simple: "When a model memorizes training data too well and fails on new data.", visual: "A student who memorizes only past exam questions fails on new ones.", analogy: "Like someone who only knows pizza recipes — can't cook spaghetti!", example: "A spam detector trained only on old emails misses new scam techniques.", math: "Training acc ≈ 99% but Test acc ≈ 60% → overfitting!" },
  { title: "Clustering", emoji: "🫧", simple: "Grouping similar things together without being told what the groups are.", visual: "Toss different colored marbles — they naturally roll into color groups.", analogy: "Like sorting laundry: you group clothes without a manual.", example: "Spotify groups listeners with similar tastes to make playlist recommendations.", math: "Minimize ∑ ‖xᵢ - μₖ‖² where μₖ are cluster centers" },
  { title: "Transformers", emoji: "🔀", simple: "An architecture that processes sequence data by paying 'attention' to all parts at once.", visual: "Reading an entire book at once and highlighting which words matter most.", analogy: "Like a detective who re-reads every clue whenever solving each part of the mystery.", example: "GPT-4, BERT, and all modern LLMs use transformer architecture.", math: "Attention(Q,K,V) = softmax(QKᵀ/√d) · V" },
];
const ConceptCards = () => {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 16 }}>
      {CONCEPTS.map((c, i) => (
        <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ ...cardStyle, cursor: "pointer", transition: "all 0.3s", border: `1px solid ${open === i ? C.accent : C.border}`, transform: open === i ? "scale(1.02)" : "scale(1)" }}>
          <div style={{ fontSize: 36 }}>{c.emoji}</div>
          <h3 style={{ color: C.text, fontWeight: 700, margin: "8px 0 4px" }}>{c.title}</h3>
          {open === i ? (
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              <div style={{ color: C.accent, marginBottom: 6 }}>📖 {c.simple}</div>
              <div style={{ color: C.text, marginBottom: 6 }}>👁️ <em>{c.visual}</em></div>
              <div style={{ color: C.gold, marginBottom: 6 }}>😄 {c.analogy}</div>
              <div style={{ color: C.accent3, marginBottom: 6 }}>🌍 {c.example}</div>
              <div style={{ background: C.bg, borderRadius: 8, padding: "6px 10px", fontFamily: "monospace", fontSize: 12, color: C.accent, marginTop: 8 }}>∑ {c.math}</div>
            </div>
          ) : <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{c.simple}</p>}
          <div style={{ color: C.accent, fontSize: 12, marginTop: 8 }}>{open === i ? "▲ close" : "▼ explore"}</div>
        </div>
      ))}
    </div>
  );
};

const CURRICULUM = [
  { level: 1, title: "AI Fundamentals", emoji: "🌱", color: C.accent3, topics: ["What is AI", "History of AI", "AI vs ML vs DL", "Types of AI", "AI Applications"] },
  { level: 2, title: "Math for AI", emoji: "📐", color: C.accent, topics: ["Vectors & Matrices", "Dot Product", "Gradient Descent", "Probability", "Statistics"] },
  { level: 3, title: "Machine Learning", emoji: "📊", color: C.gold, topics: ["Supervised Learning", "Regression", "Classification", "Decision Trees", "Random Forests", "Clustering", "Evaluation Metrics", "ML Libraries & Final Project"] },
  { level: 4, title: "Deep Learning", emoji: "🧠", color: C.accent2, topics: ["Neural Networks", "Activation Functions", "Backpropagation", "CNNs", "RNNs", "LSTM", "Transformers"] },
  { level: 5, title: "Modern AI Systems", emoji: "🚀", color: "#ec4899", topics: ["Large Language Models", "Embeddings", "Vector Databases", "RAG Systems", "Diffusion Models"] },
  { level: 6, title: "Agentic AI", emoji: "🤖", color: "#f97316", topics: ["AI Agents", "Planning & Memory", "Tool Usage", "Multi-Agent Systems", "ReAct Framework"] },
  { level: 7, title: "AGI & Future", emoji: "🌌", color: C.warn, topics: ["Artificial General Intelligence", "Superintelligence", "AI Alignment", "Safety & Ethics", "Future of AI"] },
];

// Lesson routes: topic → page key
const LESSON_ROUTES = {
  // Level 1 — AI Fundamentals
  "What is AI":                    "what-is-ai",
  "History of AI":                 "history-of-ai",
  "AI vs ML vs DL":                "ai-vs-ml-dl",
  "Types of AI":                   "types-of-ai",
  "AI Applications":               "ai-applications",
  // Level 2 — Math for AI
  "Vectors & Matrices":            "vectors-matrices",
  "Dot Product":                   "dot-product",
  "Gradient Descent":              "gradient-descent",
  "Probability":                   "probability",
  "Statistics":                    "statistics",
  // Level 3 — Machine Learning
  "Supervised Learning":           "supervised-learning",
  "Regression":                    "regression",
  "Classification":                "classification",
  "Decision Trees":                "decision-trees",
  "Random Forests":                "random-forests",
  "Clustering":                    "clustering",
  "Evaluation Metrics":            "evaluation-metrics",
  "ML Libraries & Final Project":  "libraries-and-project",
  // Level 4 — Deep Learning
  "Neural Networks":               "neural-networks",
  "Activation Functions":          "activation-functions",
  "Backpropagation":               "backpropagation",
  "CNNs":                          "cnns",
  "RNNs":                          "rnns",
  "LSTM":                          "lstm",
  "Transformers":                  "transformers",
  // Level 5 — Modern AI Systems
  "Large Language Models":         "large-language-models",
  "Embeddings":                    "embeddings",
  "Vector Databases":              "vector-databases",
  "RAG Systems":                   "rag-systems",
  "Diffusion Models":              "diffusion-models",
  // Level 6 — Agentic AI
  "AI Agents":                     "ai-agents",
  "Planning & Memory":             "planning-memory",
  "Tool Usage":                    "tool-usage",
  "Multi-Agent Systems":           "multi-agent-systems",
  "ReAct Framework":               "react-framework",
  // Level 7 — AGI & The Future
  "Artificial General Intelligence":"artificial-general-intelligence",
  "Superintelligence":             "superintelligence",
  "AI Alignment":                  "ai-alignment",
  "Safety & Ethics":               "safety-ethics",
  "Future of AI":                  "future-of-ai",
};

const CurriculumSection = ({ onOpenLesson }) => {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {CURRICULUM.map((c, i) => (
        <div key={i} onClick={() => setOpen(open === i ? null : i)} style={{ background: C.card, border: `1px solid ${open === i ? c.color : C.border}`, borderRadius: 14, padding: "16px 20px", cursor: "pointer", transition: "all 0.3s" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: c.color + "22", borderRadius: 10, padding: "8px 12px", fontSize: 22 }}>{c.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: c.color, fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>LEVEL {c.level}</div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: 16 }}>{c.title}</div>
            </div>
            <div style={{ color: c.color, fontSize: 20 }}>{open === i ? "▲" : "▼"}</div>
          </div>
          {open === i && (
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
              {c.topics.map((t, j) => {
                const hasLesson = !!LESSON_ROUTES[t];
                return (
                  <span key={j}
                    onClick={e => { if (hasLesson) { e.stopPropagation(); onOpenLesson(LESSON_ROUTES[t]); } }}
                    style={{ background: c.color + "22", border: `1px solid ${c.color}44`, borderRadius: 20, padding: "4px 14px", fontSize: 13, color: c.color, cursor: hasLesson ? "pointer" : "default", textDecoration: hasLesson ? "underline" : "none", display: "flex", alignItems: "center", gap: 4 }}>
                    {t}{hasLesson && <span style={{ fontSize: 10, background: c.color + "33", borderRadius: 8, padding: "1px 5px" }}>▶ Open</span>}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PROJECTS = [
  { title: "Spam Classifier", emoji: "📧", tools: "Python, Sklearn, NLTK", desc: "Build a model that detects spam emails using Naive Bayes." },
  { title: "House Price Predictor", emoji: "🏠", tools: "Python, Linear Regression, Pandas", desc: "Predict housing prices from features like size and location." },
  { title: "Movie Recommender", emoji: "🎬", tools: "Collaborative Filtering, Cosine Similarity", desc: "Build a recommendation engine like Netflix." },
  { title: "Digit Recognition", emoji: "✍️", tools: "TensorFlow, CNN, MNIST", desc: "Recognize handwritten digits from the famous MNIST dataset." },
  { title: "Sentiment Analysis", emoji: "💬", tools: "BERT, HuggingFace, PyTorch", desc: "Classify tweet emotions as positive, negative, or neutral." },
  { title: "Image Classifier", emoji: "🖼️", tools: "PyTorch, ResNet, Transfer Learning", desc: "Classify images using a pre-trained ResNet model." },
  { title: "Chatbot", emoji: "🤖", tools: "LangChain, OpenAI API, RAG", desc: "Build a Q&A chatbot with document memory." },
  { title: "Customer Clustering", emoji: "🎯", tools: "K-Means, PCA, Matplotlib", desc: "Segment customers into behavior groups for marketing." },
  { title: "Face Detection", emoji: "👤", tools: "OpenCV, MTCNN, Python", desc: "Detect and track human faces in real-time video." },
  { title: "AI Agent Assistant", emoji: "🧬", tools: "LangChain Agents, Tools API", desc: "An autonomous AI agent that searches, plans, and acts." },
];
const ProjectsSection = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 16 }}>
    {PROJECTS.map((p, i) => (
      <div key={i} style={{ ...cardStyle, borderTop: `3px solid ${[C.accent, C.accent2, C.accent3, C.gold][i % 4]}` }}>
        <div style={{ fontSize: 36 }}>{p.emoji}</div>
        <h3 style={{ color: C.text, fontWeight: 700, margin: "8px 0 4px" }}>{p.title}</h3>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {p.tools.split(", ").map((t, j) => <span key={j} style={{ background: C.bg, borderRadius: 20, padding: "3px 10px", fontSize: 11, color: C.accent, border: `1px solid ${C.border}` }}>{t}</span>)}
        </div>
      </div>
    ))}
  </div>
);

const DIAGRAMS = [
  { title: "AI Hierarchy Globe", emoji: "🌐", desc: "Nested 3D spheres: AI > ML > DL, each rotating at a different speed." },
  { title: "AI Timeline River", emoji: "🏔️", desc: "A flowing 3D timeline river with key milestones as floating islands." },
  { title: "Neural Network City", emoji: "🏙️", desc: "Neurons as glowing buildings, synapses as light-beam roads." },
  { title: "Gradient Descent Valley", emoji: "⛷️", desc: "A 3D mountain range; ball rolls down showing loss optimization." },
  { title: "K-Means Galaxy", emoji: "🌌", desc: "Data points as stars clustering into constellation groups." },
  { title: "Transformer Attention Heatmap", emoji: "🔥", desc: "3D grid showing which tokens attend to which — glowing connections." },
  { title: "Embedding Space Cosmos", emoji: "✨", desc: "Words as stars in 3D space; similar words cluster together." },
  { title: "Backpropagation River", emoji: "🔄", desc: "Gradients flowing backward through the network like water." },
  { title: "Decision Tree Forest", emoji: "🌳", desc: "An actual 3D forest where decision branches split visually." },
  { title: "AI Agent Loop", emoji: "🔁", desc: "Observe-Think-Plan-Act shown as a rotating 3D orbit." },
  { title: "Multi-Agent Network", emoji: "🕸️", desc: "Multiple AI agents as connected spheres passing messages." },
  { title: "CNN Feature Maps", emoji: "🎨", desc: "Stacked 3D feature map layers glowing as image passes through." },
  { title: "LSTM Memory Tape", emoji: "📼", desc: "Memory cell as a 3D tape machine with gates opening/closing." },
  { title: "LLM Context Window", emoji: "📖", desc: "Token stream visualized as pages in a 3D book with attention." },
  { title: "RAG Pipeline Flow", emoji: "📥", desc: "Query → Vector Search → Chunk Retrieval → Generation as 3D pipeline." },
  { title: "Bias-Variance Landscape", emoji: "⚖️", desc: "A 3D surface showing underfitting valley and overfitting peak." },
  { title: "Reinforcement Learning Maze", emoji: "🧩", desc: "Agent navigating a 3D maze, rewards glowing green." },
  { title: "Diffusion Denoising", emoji: "🌫️", desc: "Image starting as noise gradually clearing into a photo — 3D timeline." },
  { title: "Softmax Distribution", emoji: "📊", desc: "3D bar chart showing probability distribution after softmax." },
  { title: "AGI Horizon", emoji: "🌅", desc: "A vast 3D horizon where human and machine intelligence curves converge." },
];

const RoadmapViz = () => {
  const nodes = ["AI Basics", "Math for AI", "Machine Learning", "Deep Learning", "Transformers", "Agentic AI", "AGI & Future"];
  const colors = [C.accent3, C.accent, C.gold, C.accent2, "#ec4899", "#f97316", C.warn];
  return (
    <div style={{ overflowX: "auto", paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", minWidth: 700 }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle, ${colors[i]}44, ${colors[i]}11)`, border: `2px solid ${colors[i]}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, boxShadow: `0 0 18px ${colors[i]}55` }}>
                {["🌱", "📐", "📊", "🧠", "🔀", "🤖", "🌌"][i]}
              </div>
              <span style={{ color: colors[i], fontSize: 11, fontWeight: 700, textAlign: "center", width: 72 }}>{n}</span>
            </div>
            {i < nodes.length - 1 && <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${colors[i]}, ${colors[i + 1]})`, margin: "0 4px", marginBottom: 28 }} />}
          </div>
        ))}
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   ROOT APP COMPONENT
═══════════════════════════════════════════════════════════════════ */

export default function App() {
  const typed = useTyping(["Artificial Intelligence", "Machine Learning", "Deep Learning", "Transformers", "Agentic AI", "AGI"]);
  const [activeSection, setActiveSection] = useState("home");
  const [activePage, setActivePage] = useState(null); // e.g. "what-is-ai"

  /* ── Auth + Progress ─────────────────────────────────────────── */
  const { user, login, logout, isLoggedIn } = useAuth();
  const {
    completed, markComplete, isComplete,
    getLevelProgress, getOverallProgress, completedLevels,
  } = useProgress();

  const navItems = [
    { id: "home", label: "Home" }, { id: "roadmap", label: "Roadmap" }, { id: "concepts", label: "Concepts" },
    { id: "playground", label: "Playground" }, { id: "quiz", label: "Quizzes" }, { id: "projects", label: "Projects" },
    { id: "diagrams", label: "3D Diagrams" }, { id: "complete", label: "Certificate" },
    { id: "account", label: isLoggedIn ? `👤 ${user?.name?.split(" ")[0] || "Me"}` : "Account" },
  ];

  const handleOpenLesson = (pageKey) => { setActivePage(pageKey); window.scrollTo(0, 0); };
  const handleBackFromLesson = () => { setActivePage(null); window.scrollTo(0, 0); };

  // If a lesson page is active, render it full-screen with navigation bar
  const lessonNav = (color, Page, pageKey) => (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;900&family=Lora:wght@400;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#faf7f2}::-webkit-scrollbar-thumb{background:${color}66;border-radius:4px}`}</style>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, background: `${C.bg}ee`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, height: 52, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `radial-gradient(${C.accent}, ${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: C.text }}>ShivML<span style={{ color: C.accent }}>AI</span></span>
        </div>
        {isLoggedIn && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", marginRight: 8 }}>
            {user?.picture && <img src={user.picture} alt="" style={{ width: 26, height: 26, borderRadius: "50%" }} />}
            <span style={{ color: C.muted, fontSize: 12 }}>{user?.name?.split(" ")[0]}</span>
          </div>
        )}
        <button onClick={handleBackFromLesson} style={{ marginLeft: isLoggedIn ? 0 : "auto", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "6px 16px", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back to Platform</button>
      </nav>
      <div style={{ paddingTop: 52 }}>
        <Page onBack={handleBackFromLesson} />
        <LessonNavigation
          currentKey={pageKey}
          isLoggedIn={isLoggedIn}
          isComplete={pageKey ? isComplete(pageKey) : false}
          onMarkComplete={markComplete}
          onNavigate={handleOpenLesson}
          onBack={handleBackFromLesson}
        />
      </div>
    </div>
  );

  // ── Level 1 routes ──────────────────────────────────────────────
  if (activePage === "ai-vs-ml-dl")       return lessonNav("#7c3aed", AIvsMLPage, "ai-vs-ml-dl");
  if (activePage === "types-of-ai")       return lessonNav("#0284c7", TypesOfAIPage, "types-of-ai");
  if (activePage === "ai-applications")       return lessonNav("#10b981", AIApplicationsPage, "ai-applications");

  // ── Level 2 routes — Math for AI ────────────────────────────────
  if (activePage === "vectors-matrices")       return lessonNav("#4f46e5", VectorsMatricesPage, "vectors-matrices");
  if (activePage === "dot-product")       return lessonNav("#7c3aed", DotProductPage, "dot-product");
  if (activePage === "gradient-descent")       return lessonNav("#0891b2", GradientDescentPage, "gradient-descent");
  if (activePage === "probability")       return lessonNav("#059669", ProbabilityPage, "probability");
  if (activePage === "statistics")       return lessonNav("#d97706", StatisticsPage, "statistics");

  // ── Level 3 routes — Machine Learning ───────────────────────────
  if (activePage === "supervised-learning")       return lessonNav("#f59e0b", SupervisedLearningPage, "supervised-learning");
  if (activePage === "regression")       return lessonNav("#ef4444", RegressionPage, "regression");
  if (activePage === "classification")       return lessonNav("#8b5cf6", ClassificationPage, "classification");
  if (activePage === "decision-trees")       return lessonNav("#059669", DecisionTreesPage, "decision-trees");
  if (activePage === "random-forests")       return lessonNav("#0891b2", RandomForestsPage, "random-forests");
  if (activePage === "clustering")       return lessonNav("#ec4899", ClusteringPage, "clustering");
  if (activePage === "evaluation-metrics")       return lessonNav("#f97316", EvaluationMetricsPage, "evaluation-metrics");
  if (activePage === "libraries-and-project")       return lessonNav("#4f46e5", LibrariesAndProjectPage, "libraries-and-project");

  // ── Level 4 routes — Deep Learning ──────────────────────────────
  if (activePage === "neural-networks")       return lessonNav("#7c3aed", NeuralNetworksPage, "neural-networks");
  if (activePage === "activation-functions")       return lessonNav("#0891b2", ActivationFunctionsPage, "activation-functions");
  if (activePage === "backpropagation")       return lessonNav("#e11d48", BackpropagationPage, "backpropagation");
  if (activePage === "cnns")       return lessonNav("#f59e0b", CNNsPage, "cnns");
  if (activePage === "rnns")       return lessonNav("#059669", RNNsPage, "rnns");
  if (activePage === "lstm")       return lessonNav("#4f46e5", LSTMPage, "lstm");
  if (activePage === "transformers")       return lessonNav("#ec4899", TransformersPage, "transformers");

  // ── Level 5 routes — Modern AI Systems ──────────────────────────
  if (activePage === "large-language-models")       return lessonNav("#ec4899", LargeLanguageModelsPage, "large-language-models");
  if (activePage === "embeddings")       return lessonNav("#8b5cf6", EmbeddingsPage, "embeddings");
  if (activePage === "vector-databases")       return lessonNav("#0891b2", VectorDatabasesPage, "vector-databases");
  if (activePage === "rag-systems")       return lessonNav("#059669", RAGSystemsPage, "rag-systems");
  if (activePage === "diffusion-models")       return lessonNav("#f97316", DiffusionModelsPage, "diffusion-models");

  // ── Level 6 routes — Agentic AI ─────────────────────────────────
  if (activePage === "ai-agents")       return lessonNav("#f97316", AIAgentsPage, "ai-agents");
  if (activePage === "planning-memory")       return lessonNav("#7c3aed", PlanningMemoryPage, "planning-memory");
  if (activePage === "tool-usage")       return lessonNav("#0891b2", ToolUsagePage, "tool-usage");
  if (activePage === "multi-agent-systems")       return lessonNav("#e11d48", MultiAgentSystemsPage, "multi-agent-systems");
  if (activePage === "react-framework")       return lessonNav("#059669", ReActFrameworkPage, "react-framework");

  // ── Level 7 routes — AGI & The Future ───────────────────────────
  if (activePage === "artificial-general-intelligence")       return lessonNav("#ef4444", AGIPage, "artificial-general-intelligence");
  if (activePage === "superintelligence")       return lessonNav("#7c3aed", SuperintelligencePage, "superintelligence");
  if (activePage === "ai-alignment")       return lessonNav("#f59e0b", AIAlignmentPage, "ai-alignment");
  if (activePage === "safety-ethics")       return lessonNav("#0891b2", SafetyEthicsPage, "safety-ethics");
  if (activePage === "future-of-ai")       return lessonNav("#059669", FutureOfAIPage, "future-of-ai");

  if (activePage === "history-of-ai")     return lessonNav("#f59e0b", HistoryOfAIPage, "history-of-ai");

  if (activePage === "what-is-ai")       return lessonNav("#f59e0b", WhatIsAIPage, "what-is-ai");

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;900&family=Lora:wght@400;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${C.bg}}::-webkit-scrollbar-thumb{background:${C.accent}44;border-radius:3px}
        input[type=range]{accent-color:${C.accent}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes glow{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .animate-float{animation:float 4s ease-in-out infinite}
        .animate-glow{animation:glow 2s ease-in-out infinite}
        .slide-in{animation:slideIn 0.5s ease forwards}
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${C.bg}dd`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="animate-glow" style={{ width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(${C.accent}, ${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧠</div>
            <div><div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: C.text }}>ShivML<span style={{ color: C.accent }}>AI</span></div><div style={{ fontSize: 9, color: C.muted, letterSpacing: 1.5 }}>ZERO TO AGI</div></div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setActiveSection(n.id); setActivePage(null); }}
                style={{ background: activeSection === n.id ? `${C.accent}22` : "transparent", border: activeSection === n.id ? `1px solid ${C.accent}` : "1px solid transparent", borderRadius: 8, padding: "6px 12px", color: activeSection === n.id ? C.accent : C.muted, cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 64 }}>

        {/* HOME */}
        {activeSection === "home" && (
          <div>
            <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
              <ParticleField />
              <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
                <div className="slide-in">
                  <div style={{ background: `${C.accent}22`, border: `1px solid ${C.accent}44`, borderRadius: 20, padding: "4px 14px", display: "inline-block", fontSize: 12, color: C.accent, fontWeight: 700, letterSpacing: 1.5, marginBottom: 20 }}>🚀 FREE AI EDUCATION PLATFORM</div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2.2rem,6vw,4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                    Learn<br /><span style={{ color: C.accent, display: "block", minHeight: "1.2em" }}>{typed}<span style={{ animation: "glow 1s infinite", color: C.accent }}>|</span></span>Visually
                  </h1>
                  <p style={{ color: C.muted, fontSize: 18, lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>From zero to AGI — explained with diagrams, stories, math, and interactive demos. No PhD required.</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={() => setActiveSection("roadmap")} style={{ background: `linear-gradient(135deg,${C.accent},${C.accent2})`, border: "none", borderRadius: 12, padding: "14px 28px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: `0 0 30px ${C.accent}44` }}>Start Learning 🚀</button>
                    <button onClick={() => setActiveSection("playground")} style={{ ...btnStyle(C.accent3), padding: "14px 28px", fontSize: 16 }}>Try Playground ⚡</button>
                  </div>
                  <div style={{ display: "flex", gap: 24, marginTop: 32 }}>
                    {[["7", "Learning Levels"], ["50+", "Concepts"], ["10", "Mini Games"], ["Free", "Forever"]].map(([v, l]) => <div key={l}><div style={{ color: C.accent, fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22 }}>{v}</div><div style={{ color: C.muted, fontSize: 12 }}>{l}</div></div>)}
                  </div>
                </div>
                <div style={{ position: "relative", height: 400 }} className="animate-float">
                  <div style={{ width: "100%", height: "100%", borderRadius: 24, overflow: "hidden", border: `1px solid ${C.accent}33`, boxShadow: `0 0 60px ${C.accent}22` }}><NeuralCanvas /></div>
                  <div style={{ position: "absolute", top: -20, right: -20, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 16px", fontSize: 12 }}><span style={{ color: C.accent3 }}>● </span><span style={{ color: C.muted }}>Live Neural Network</span></div>
                </div>
              </div>
            </section>

            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
              {sectionHeading("Learning Roadmap", "Your journey from AI basics to AGI — step by step")}
              <RoadmapViz />
            </section>

            <section style={{ background: C.surface, padding: "80px 24px" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                {sectionHeading("Why ShivMLAI?", "We teach AI differently")}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                  {[{ emoji: "🎨", title: "Visual Diagrams", desc: "Complex ideas explained with beautiful 3D visuals.", color: C.accent }, { emoji: "🗣️", title: "Simple Language", desc: "No jargon. Every concept explained like you're 10 years old first.", color: C.accent3 }, { emoji: "🎮", title: "Interactive Games", desc: "Learn by doing — build neural nets, play clustering puzzles.", color: C.gold }, { emoji: "🆓", title: "100% Free", desc: "Completely free forever. No paywalls. AI education for everyone.", color: C.accent2 }, { emoji: "📱", title: "Mobile Friendly", desc: "Fully responsive design for phone, tablet, and desktop.", color: "#ec4899" }, { emoji: "🗺️", title: "Structured Path", desc: "Clear 7-level curriculum from AI basics to AGI.", color: "#f97316" }].map((f, i) => (
                    <div key={i} style={{ ...cardStyle, borderLeft: `3px solid ${f.color}` }}>
                      <div style={{ fontSize: 32 }}>{f.emoji}</div>
                      <h3 style={{ color: f.color, fontWeight: 700, margin: "10px 0 6px" }}>{f.title}</h3>
                      <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
              {sectionHeading("AI in the Real World", "AI is already everywhere around you")}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
                {[{ emoji: "🚗", title: "Self-Driving Cars", tech: "Computer Vision + RL", example: "Tesla Autopilot" }, { emoji: "💬", title: "ChatGPT / LLMs", tech: "Transformers + RLHF", example: "GPT-4, Claude, Gemini" }, { emoji: "🏥", title: "Medical AI", tech: "CNN + Image Classification", example: "Cancer detection" }, { emoji: "🎵", title: "Recommendations", tech: "Collaborative Filtering", example: "Spotify, Netflix" }, { emoji: "🎨", title: "Image Generation", tech: "Diffusion Models", example: "DALL-E, Midjourney" }, { emoji: "🔒", title: "Fraud Detection", tech: "Anomaly Detection", example: "Bank transactions" }, { emoji: "🗣️", title: "Voice Assistants", tech: "ASR + NLP + TTS", example: "Siri, Alexa" }, { emoji: "🤖", title: "AI Coding", tech: "LLMs + Agents", example: "GitHub Copilot" }].map((app, i) => (
                  <div key={i} style={{ ...cardStyle, textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{app.emoji}</div>
                    <div style={{ color: C.text, fontWeight: 700, marginBottom: 4 }}>{app.title}</div>
                    <div style={{ color: C.accent, fontSize: 11, marginBottom: 4 }}>{app.tech}</div>
                    <div style={{ color: C.muted, fontSize: 11 }}>{app.example}</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: `linear-gradient(135deg, ${C.accent2}22, ${C.accent}11)`, padding: "80px 24px", textAlign: "center", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${C.accent},${C.accent2})`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👨‍💻</div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 900, color: C.text }}>Created by <span style={{ color: C.accent }}>Shivesh Mishra</span></h2>
                <p style={{ color: C.muted, marginTop: 12, fontSize: 16, lineHeight: 1.7 }}>AI educator, curriculum designer, and technologist on a mission to make Artificial Intelligence education accessible to every person on Earth — visually, simply, and freely.</p>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                  {["🎓 Educator", "🔬 Researcher", "🛠️ Builder", "🌍 Open Source"].map(t => <span key={t} style={{ ...btnStyle(C.accent), fontSize: 12 }}>{t}</span>)}
                </div>
              </div>
            </section>

            <footer style={{ background: C.surface, padding: "40px 24px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 24, marginBottom: 8 }}>ShivML<span style={{ color: C.accent }}>AI</span>.com</div>
                <p style={{ color: C.muted, fontSize: 13 }}>Learn Artificial Intelligence Visually – From Zero to AGI</p>
                <p style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>Created with ❤️ by <span style={{ color: C.accent }}>Shivesh Mishra</span> · Free forever · Open Education</p>
              </div>
            </footer>
          </div>
        )}

        {/* ROADMAP */}
        {activeSection === "roadmap" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("Full Curriculum", "7 levels · 40+ topics · From beginner to AGI")}
            <div style={{ background: `${C.accent}11`, border: `1px solid ${C.accent}33`, borderRadius: 12, padding: "12px 18px", marginBottom: 24, fontSize: 13, color: C.accent }}>
              💡 <strong>Tip:</strong> Expand a level and click a topic with <span style={{ background: `${C.accent}22`, padding: "1px 6px", borderRadius: 4 }}>▶ Open</span> to enter the full lesson page!
            </div>
            <CurriculumSection onOpenLesson={handleOpenLesson} />
          </div>
        )}

        {/* CONCEPTS */}
        {activeSection === "concepts" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("Core Concepts", "Click any card to dive deep — definition, analogy, math & more")}
            <ConceptCards />
          </div>
        )}

        {/* PLAYGROUND */}
        {activeSection === "playground" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("Interactive Playground", "Learn by doing — no code required")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(400px,1fr))", gap: 24 }}>
              <div style={{ ...cardStyle }}><h3 style={{ color: C.accent, fontWeight: 700, marginBottom: 4 }}>⛷️ Gradient Descent Simulator</h3><p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Watch how AI minimizes loss by rolling down a cost landscape.</p><GradientViz /></div>
              <div style={{ ...cardStyle }}><h3 style={{ color: C.gold, fontWeight: 700, marginBottom: 4 }}>🫧 K-Means Clustering Demo</h3><p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>See K-Means group random points step by step.</p><ClusteringDemo /></div>
              <div style={{ ...cardStyle }}><h3 style={{ color: C.accent2, fontWeight: 700, marginBottom: 4 }}>🧠 Neural Network Builder</h3><p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Drag sliders to change neuron counts. See your network live!</p><NNBuilder /></div>
              <div style={{ ...cardStyle }}><h3 style={{ color: C.accent3, fontWeight: 700, marginBottom: 4 }}>🤖 AI Agent Simulator</h3><p style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Watch an AI agent Observe → Think → Plan → Act in a loop.</p><AgentSimulator /></div>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {activeSection === "quiz" && (
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("Quiz System", "Test your knowledge across 10 AI topics")}
            <QuizSection />
          </div>
        )}

        {/* PROJECTS */}
        {activeSection === "projects" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("Practical Projects", "Build real AI systems — 10 hands-on projects")}
            <ProjectsSection />
            <div style={{ marginTop: 60 }}>
              {sectionHeading("Advanced Projects", "20 more ideas for serious builders", C.accent2)}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
                {["🎙️ Voice Assistant", "💳 Fraud Detection", "💻 AI Coding Assistant", "🎮 RL Game Bot", "📝 Document Summarizer", "🔎 RAG Knowledge System", "🌐 AI Research Agent", "🎨 Style Transfer App", "🔊 Speech Emotion Recognition", "📈 Stock Trend Predictor", "🌍 Language Translator", "🧬 Protein Structure Predictor", "🏥 Medical Symptom Checker", "🎵 Music Generation", "📸 Image Captioner", "🤝 Meeting Summarizer", "🚀 A/B Test Analyzer", "🛡️ Deepfake Detector", "📊 Business Intelligence Bot", "🌱 Personalized Tutor AI"].map((p, i) => <div key={i} style={{ ...cardStyle, fontSize: 14, color: C.text, fontWeight: 500 }}>{p}</div>)}
              </div>
            </div>
          </div>
        )}

        {/* DIAGRAMS */}
        {activeSection === "diagrams" && (
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
            {sectionHeading("3D Visual Diagrams", "20 immersive visualizations planned for ShivMLAI")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
              {DIAGRAMS.map((d, i) => <div key={i} style={{ ...cardStyle, borderTop: `3px solid ${[C.accent, C.accent2, C.accent3, C.gold][i % 4]}` }}><div style={{ fontSize: 36 }}>{d.emoji}</div><h3 style={{ color: C.text, fontWeight: 700, margin: "8px 0 6px", fontSize: 15 }}>{d.title}</h3><p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{d.desc}</p><div style={{ marginTop: 10, ...btnStyle(C.accent), fontSize: 11, textAlign: "center" }}>Coming in Three.js 🚀</div></div>)}
            </div>
          </div>
        )}

        {/* ACCOUNT */}
        {activeSection === "account" && (
          <AccountPage
            user={user}
            isLoggedIn={isLoggedIn}
            onLogin={login}
            onLogout={logout}
            completed={completed}
            getLevelProgress={getLevelProgress}
            getOverallProgress={getOverallProgress}
            completedLevels={completedLevels}
            onOpenLesson={handleOpenLesson}
          />
        )}

        {/* CERTIFICATE */}
        {activeSection === "complete" && (
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
            <div style={{ marginBottom: 40 }}><div style={{ fontSize: 80 }} className="animate-float">🏆</div></div>
            <div style={{ background: `linear-gradient(135deg, ${C.card}, ${C.surface})`, border: `2px solid ${C.gold}`, borderRadius: 24, padding: "48px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg,${C.accent},${C.accent2},${C.accent3},${C.gold})` }} />
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎓</div>
              <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 900, color: C.gold, marginBottom: 16 }}>Congratulations!</h1>
              <p style={{ fontSize: 18, color: C.text, lineHeight: 1.7, marginBottom: 24, maxWidth: 520, margin: "0 auto 24px" }}>You have completed the <strong style={{ color: C.accent }}>ShivMLAI</strong> journey and now understand Artificial Intelligence — from Fundamentals all the way to AGI.</p>
              <div style={{ background: C.bg, borderRadius: 16, padding: "20px", margin: "24px 0", display: "inline-block", minWidth: 280 }}>
                <div style={{ color: C.muted, fontSize: 12, marginBottom: 4 }}>CERTIFICATE OF COMPLETION</div>
                <div style={{ color: C.text, fontWeight: 700 }}>ShivMLAI — From Zero to AGI</div>
                <div style={{ color: C.accent, fontSize: 13, marginTop: 4 }}>Created by Shivesh Mishra</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginTop: 32, textAlign: "left" }}>
                {[{ emoji: "📚", title: "Continue Learning", desc: "Read research papers on arXiv", link: "arXiv.org" }, { emoji: "🛠️", title: "Build Projects", desc: "Apply skills on Kaggle challenges", link: "Kaggle.com" }, { emoji: "🤝", title: "Join Community", desc: "Connect with other AI learners", link: "Discord" }, { emoji: "🎯", title: "Get Certified", desc: "Pursue DeepLearning.ai certificates", link: "DeepLearning.ai" }, { emoji: "💼", title: "Start Career", desc: "Apply for AI/ML roles on LinkedIn", link: "LinkedIn" }, { emoji: "🌱", title: "Give Back", desc: "Teach someone else what you learned", link: "Community" }].map((s, i) => (
                  <div key={i} style={{ ...cardStyle, padding: 16 }}>
                    <div style={{ fontSize: 24 }}>{s.emoji}</div>
                    <div style={{ color: C.text, fontWeight: 700, margin: "6px 0 4px", fontSize: 14 }}>{s.title}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{s.desc}</div>
                    <div style={{ color: C.accent, fontSize: 11, marginTop: 6 }}>→ {s.link}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}