import { useCallback, useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   SHIVMLAI.COM — Full Platform (Merged)
   Created by Shivesh Mishra
   Includes: Main Platform Shell + Lesson: "What is AI?"
═══════════════════════════════════════════════════════════════════ */

// ── Main platform palette ─────────────────────────────────────────
const C = {
  bg: "#050810", surface: "#0c1122", card: "#111827", border: "#1e2d47",
  accent: "#00d4ff", accent2: "#7c3aed", accent3: "#10b981",
  gold: "#f59e0b", warn: "#ef4444", text: "#e2e8f0", muted: "#64748b",
};

// ── Lesson palette (WhatIsAI) ─────────────────────────────────────
const T = {
  ink: "#0f1117", paper: "#faf7f2", cream: "#f0ead8", card: "#ffffff",
  amber: "#f59e0b", amber2: "#d97706", teal: "#0d9488", rose: "#e11d48",
  violet: "#7c3aed", sky: "#0284c7", muted: "#6b7280", border: "#e5e0d5",
  dark: "#1e293b",
};

// ── Lesson utilities ──────────────────────────────────────────────
const px = (n) => `${n}px`;
const lFlex = (dir = "row", align = "center", justify = "flex-start", gap = 0) => ({
  display: "flex", flexDirection: dir, alignItems: align, justifyContent: justify, gap: px(gap),
});

// ── Lesson shared styles ──────────────────────────────────────────
const LCARD = { background: T.card, borderRadius: px(20), border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: px(28) };
const LTAG = (color = T.amber) => ({ display: "inline-block", background: color + "18", border: `1px solid ${color}55`, borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color, letterSpacing: "1.5px", textTransform: "uppercase" });
const LH2 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.7rem, 4vw, 2.5rem)", fontWeight: 900, color: T.ink, lineHeight: 1.2, margin: 0 };
const LBODY = { fontFamily: "'Lora', Georgia, serif", fontSize: px(16), color: T.muted, lineHeight: 1.8 };
const LSEC = { maxWidth: px(1100), margin: "0 auto", padding: "80px 24px" };
const LBTN = (bg = T.amber) => ({ background: bg, border: "none", borderRadius: px(10), padding: "12px 24px", color: bg === T.amber ? T.ink : "#fff", fontWeight: 700, fontSize: px(14), cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.15s" });

// ── Main platform helpers ─────────────────────────────────────────
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
  { level: 3, title: "Machine Learning", emoji: "📊", color: C.gold, topics: ["Supervised Learning", "Regression", "Classification", "Decision Trees", "Random Forests", "Clustering", "Evaluation Metrics"] },
  { level: 4, title: "Deep Learning", emoji: "🧠", color: C.accent2, topics: ["Neural Networks", "Activation Functions", "Backpropagation", "CNNs", "RNNs", "LSTM", "Transformers"] },
  { level: 5, title: "Modern AI Systems", emoji: "🚀", color: "#ec4899", topics: ["Large Language Models", "Embeddings", "Vector Databases", "RAG Systems", "Diffusion Models"] },
  { level: 6, title: "Agentic AI", emoji: "🤖", color: "#f97316", topics: ["AI Agents", "Planning & Memory", "Tool Usage", "Multi-Agent Systems", "ReAct Framework"] },
  { level: 7, title: "AGI & Future", emoji: "🌌", color: C.warn, topics: ["Artificial General Intelligence", "Superintelligence", "AI Alignment", "Safety & Ethics", "Future of AI"] },
];

// Lesson routes: topic → page key
const LESSON_ROUTES = { "What is AI": "what-is-ai" };

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
   LESSON: WHAT IS AI — ALL COMPONENTS
═══════════════════════════════════════════════════════════════════ */

const BrainCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const nodes = Array.from({ length: 22 }, (_, i) => ({ x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.7, r: 4 + Math.random() * 6, phase: Math.random() * Math.PI * 2, col: [T.amber, T.teal, T.violet, T.sky, T.rose][i % 5] }));
    let t = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach((a, i) => nodes.slice(i + 1).forEach(b => { const d = Math.hypot((a.x - b.x) * W, (a.y - b.y) * H); if (d < 160) { const pulse = (Math.sin(t * 1.5 + a.phase) + 1) / 2; ctx.beginPath(); ctx.moveTo(a.x * W, a.y * H); ctx.lineTo(b.x * W, b.y * H); ctx.strokeStyle = `rgba(245,158,11,${0.04 + pulse * 0.12})`; ctx.lineWidth = 1 + pulse; ctx.stroke(); } }));
      nodes.forEach(n => { const pulse = (Math.sin(t + n.phase) + 1) / 2, r = n.r + pulse * 3, g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, r * 3); g.addColorStop(0, n.col + "cc"); g.addColorStop(1, n.col + "00"); ctx.beginPath(); ctx.arc(n.x * W, n.y * H, r * 3, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); ctx.beginPath(); ctx.arc(n.x * W, n.y * H, r, 0, Math.PI * 2); ctx.fillStyle = n.col + "dd"; ctx.fill(); });
      t += 0.018; requestAnimationFrame(loop);
    };
    loop();
    const onResize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
};

const LessonHeroSection = ({ onBack }) => (
  <section style={{ background: `linear-gradient(160deg, ${T.ink} 0%, #1a1f2e 60%, #0f2027 100%)`, minHeight: "88vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${T.amber}08 1px, transparent 1px), linear-gradient(90deg, ${T.amber}08 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
    <div style={{ maxWidth: px(1100), width: "100%", padding: "80px 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: px(60), alignItems: "center", position: "relative", zIndex: 1 }}>
      <div>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 16px", color: "#94a3b8", cursor: "pointer", fontSize: 13, marginBottom: 24 }}>← Back to Roadmap</button>
        <div style={{ ...LTAG(T.amber), marginBottom: px(20) }}>🧠 Lesson 1 of 7 · AI Fundamentals</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.4rem,6vw,4.2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: px(20) }}>
          What is<br /><span style={{ color: T.amber }}>Artificial</span><br />Intelligence?
        </h1>
        <div style={{ width: px(60), height: px(4), background: T.amber, borderRadius: px(2), marginBottom: px(24) }} />
        <p style={{ ...LBODY, color: "#cbd5e1", fontSize: px(18), marginBottom: px(16) }}><strong style={{ color: "#fff" }}>Simple definition:</strong> AI is a computer program that learns from experience and makes smart decisions — just like a human mind, but made of math.</p>
        <p style={{ ...LBODY, color: "#94a3b8", marginBottom: px(28) }}><strong style={{ color: "#e2e8f0" }}>Deeper definition:</strong> Artificial Intelligence is the science of building systems that can perceive their environment, learn from data, reason about problems, and take actions to achieve goals.</p>
        <div style={{ background: "rgba(245,158,11,0.1)", border: `1px solid ${T.amber}44`, borderRadius: px(14), padding: "16px 20px", marginBottom: px(32) }}>
          <div style={{ color: T.amber, fontWeight: 700, fontSize: px(13), marginBottom: px(6), letterSpacing: "1px" }}>💡 ANALOGY</div>
          <p style={{ ...LBODY, color: "#cbd5e1", margin: 0, fontSize: px(15) }}>Just like a child learns to recognize dogs by seeing hundreds of them — not by reading a manual — AI learns by being shown millions of examples until it understands the pattern.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Beginner", "No math needed", "11 sections", "Interactive"].map(l => <span key={l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: px(20), padding: "4px 12px", fontSize: px(11), color: "#64748b" }}>{l}</span>)}
        </div>
      </div>
      <div style={{ height: px(420), borderRadius: px(24), overflow: "hidden", border: `1px solid rgba(245,158,11,0.2)`, boxShadow: `0 0 80px rgba(245,158,11,0.1)` }}>
        <BrainCanvas />
      </div>
    </div>
  </section>
);

const RulesVsLearning = () => {
  const [mode, setMode] = useState("rules");
  const rulesSteps = [
    { emoji: "👨‍💻", label: "Programmer writes rules", desc: "if (has_fur && four_legs && barks) → DOG" },
    { emoji: "🐈", label: "New animal: cat with 4 legs", desc: "Has fur ✓ Four legs ✓ Barks? ✗ → NOT DOG" },
    { emoji: "🦊", label: "What about a fox?", desc: "Has fur ✓ Four legs ✓ Barks sometimes? 🤷 → CONFUSED" },
    { emoji: "💥", label: "Rules break", desc: "Thousands of edge cases. Programmer can't cover them all!" },
  ];
  const learnSteps = [
    { emoji: "📸", label: "Show 10,000 dog photos", desc: "AI sees patterns: ears, snout, fur texture, body shape..." },
    { emoji: "📸", label: "Show 10,000 cat photos", desc: "AI learns the difference: cat eyes, whiskers, smaller body..." },
    { emoji: "🧠", label: "AI builds internal model", desc: "Not rules — but a statistical understanding of 'dog-ness'" },
    { emoji: "✅", label: "Show a new photo", desc: "AI says: 98.7% dog. Never seen this dog before — still correct!" },
  ];
  const steps = mode === "rules" ? rulesSteps : learnSteps;
  return (
    <div>
      <div style={{ ...lFlex("row", "center", "center", 12), marginBottom: px(28) }}>
        {["rules", "learning"].map(m => <button key={m} onClick={() => setMode(m)} style={{ background: mode === m ? T.amber : T.cream, border: `1px solid ${mode === m ? T.amber : T.border}`, borderRadius: px(10), padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: px(14), color: mode === m ? T.ink : T.muted, transition: "all 0.2s" }}>{m === "rules" ? "📜 Rules Approach" : "🤖 Learning Approach"}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: px(16) }}>
        {steps.map((s, i) => (
          <div key={i} style={{ ...LCARD, borderLeft: `4px solid ${mode === "rules" ? T.rose : T.teal}` }}>
            <div style={{ fontSize: px(32), marginBottom: px(10) }}>{s.emoji}</div>
            <div style={{ fontWeight: 700, color: T.ink, fontSize: px(15), marginBottom: px(6) }}>{s.label}</div>
            <div style={{ fontSize: px(13), color: T.muted, lineHeight: 1.6, fontFamily: "monospace" }}>{s.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: px(24), ...LCARD, background: mode === "rules" ? "#fff0f3" : "#f0fdf9", borderLeft: `4px solid ${mode === "rules" ? T.rose : T.teal}` }}>
        <strong style={{ color: mode === "rules" ? T.rose : T.teal }}>{mode === "rules" ? "❌ Problem with rules:" : "✅ Why learning works:"}</strong>
        <p style={{ ...LBODY, margin: "8px 0 0", fontSize: px(15) }}>{mode === "rules" ? "Rules work for simple problems, but the real world is messy. You'd need millions of rules to handle all edge cases — and they'd still break." : "Instead of rules, AI finds patterns in data. The more data it sees, the better it gets — just like a child who gets smarter the more they experience the world."}</p>
      </div>
    </div>
  );
};

const SimpleIdeaSection = () => (
  <section style={{ background: T.paper }}>
    <div style={LSEC}>
      <div style={{ ...lFlex("row", "center", "space-between", 20), marginBottom: px(48), flexWrap: "wrap" }}>
        <div style={{ maxWidth: px(520) }}>
          <div style={{ ...LTAG(T.teal), marginBottom: px(16) }}>Part 2</div>
          <h2 style={LH2}>AI in <span style={{ color: T.teal }}>One Simple Idea</span></h2>
          <p style={{ ...LBODY, marginTop: px(16) }}>Forget the sci-fi robots. At its core, AI is just this: <strong>instead of programming explicit rules, you show the computer thousands of examples and let it figure out the rules itself.</strong></p>
        </div>
        <div style={{ ...LCARD, padding: "20px 28px", maxWidth: px(300), textAlign: "center" }}>
          <div style={{ fontSize: px(48) }}>👶</div>
          <p style={{ ...LBODY, fontSize: px(15), margin: "10px 0 0" }}>A toddler learns "dog" not from a definition, but from seeing 500 dogs. <strong>AI works exactly the same way.</strong></p>
        </div>
      </div>
      <RulesVsLearning />
      <div style={{ marginTop: px(40), display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: px(20) }}>
        {[{ icon: "📦", title: "Data = Examples", desc: "AI needs lots of examples to learn from — photos, text, numbers, sounds.", color: T.sky }, { icon: "🔍", title: "Pattern = Knowledge", desc: "AI finds hidden patterns in that data that humans might never notice.", color: T.violet }, { icon: "🎯", title: "Prediction = Answer", desc: "Once trained, AI uses those patterns to answer new questions accurately.", color: T.amber }].map((c, i) => (
          <div key={i} style={{ ...LCARD, textAlign: "center", borderTop: `4px solid ${c.color}` }}>
            <div style={{ fontSize: px(36), margin: "0 0 12px" }}>{c.icon}</div>
            <div style={{ fontWeight: 800, color: T.ink, marginBottom: px(8) }}>{c.title}</div>
            <p style={{ ...LBODY, fontSize: px(14), margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const L_PIPELINE = [
  { emoji: "📦", label: "Data", color: T.sky, desc: "Raw examples — photos, text, numbers. The fuel of AI.", example: "10,000 labelled dog/cat photos" },
  { emoji: "⚙️", label: "Training Algorithm", color: T.violet, desc: "A mathematical process that adjusts AI's internal settings to reduce mistakes.", example: "Gradient Descent tunes millions of parameters" },
  { emoji: "🧠", label: "AI Model", color: T.amber, desc: "A trained mathematical function that has 'learned' patterns from data.", example: "A neural network with weights baked in" },
  { emoji: "🔮", label: "Prediction", color: T.teal, desc: "The model applies learned patterns to new unseen inputs.", example: "New photo → '97% cat'" },
  { emoji: "💬", label: "Feedback", color: T.rose, desc: "We tell the AI when it's wrong so it can improve.", example: "Correct label sent back to training loop" },
  { emoji: "📈", label: "Improvement", color: T.amber2, desc: "The model updates itself, becoming more accurate each cycle.", example: "Accuracy: 65% → 89% → 97% over iterations" },
];
const PipelineSection = () => {
  const [active, setActive] = useState(0); const step = L_PIPELINE[active];
  return (
    <section style={{ background: T.ink }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.amber), marginBottom: px(16) }}>Part 3</div>
          <h2 style={{ ...LH2, color: "#fff" }}>How AI Actually <span style={{ color: T.amber }}>Works</span></h2>
          <p style={{ ...LBODY, color: "#94a3b8", maxWidth: px(560), margin: "16px auto 0" }}>Every AI system follows this same core pipeline. Click each stage to explore.</p>
        </div>
        <div style={{ ...lFlex("row", "center", "center"), flexWrap: "wrap", marginBottom: px(32) }}>
          {L_PIPELINE.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <button onClick={() => setActive(i)} style={{ background: active === i ? s.color : "rgba(255,255,255,0.05)", border: `2px solid ${active === i ? s.color : "rgba(255,255,255,0.1)"}`, borderRadius: px(14), padding: "14px 18px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.25s", minWidth: px(90) }}>
                <span style={{ fontSize: px(26) }}>{s.emoji}</span>
                <span style={{ fontSize: px(11), fontWeight: 700, color: active === i ? T.ink : "#94a3b8", textAlign: "center" }}>{s.label}</span>
              </button>
              {i < L_PIPELINE.length - 1 && <div style={{ color: "#334155", fontSize: px(20), padding: "0 4px" }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${step.color}44`, borderRadius: px(20), padding: "32px 36px", display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div style={{ fontSize: px(64) }}>{step.emoji}</div>
          <div style={{ flex: 1, minWidth: px(200) }}>
            <div style={{ ...LTAG(step.color), marginBottom: px(12) }}>Stage {active + 1} of 6</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: px(26), color: "#fff", marginBottom: px(12) }}>{step.label}</h3>
            <p style={{ ...LBODY, color: "#cbd5e1", marginBottom: px(16) }}>{step.desc}</p>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: px(10), padding: "12px 16px", fontFamily: "monospace", fontSize: px(13), color: step.color }}>💡 Example: {step.example}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const L_COMPARE = [
  { cat: "🧠 Learning", human: "Learns from a few examples and life experience", ai: "Needs millions of examples but learns faster", winner: "human", desc: "Humans generalize incredibly well from small data — AI struggles with this." },
  { cat: "💾 Memory", human: "Forgets over time — memory is imperfect and emotional", ai: "Perfect recall — never forgets what it was trained on", winner: "ai", desc: "AI has perfect memory for training data, but can't learn new facts without retraining." },
  { cat: "🔍 Patterns", human: "Great at context, humor, nuance, body language", ai: "Superhuman at recognizing patterns in images, text, speech", winner: "tie", desc: "AI crushes humans at narrow tasks like recognizing X-ray anomalies or spam." },
  { cat: "💭 Reasoning", human: "Common sense, abstract thought, creativity, emotions", ai: "Logical reasoning over defined rules, no common sense yet", winner: "human", desc: "AI still lacks the common sense a 5-year-old has — a huge open challenge." },
  { cat: "⚡ Speed", human: "Slow — biological neurons fire at 100ms", ai: "Billions of calculations per second on GPUs", winner: "ai", desc: "AI can analyze a million documents in the time you read one page." },
  { cat: "🔋 Energy", human: "20 watts — the most efficient intelligence known", ai: "Megawatts — GPT-4 training cost ~$100M in energy", winner: "human", desc: "Human brain is astonishingly efficient. AI is a power-hungry beast by comparison." },
];
const BrainVsAI = () => {
  const [selected, setSelected] = useState(0); const item = L_COMPARE[selected];
  return (
    <section style={{ background: T.cream }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.violet), marginBottom: px(16) }}>Part 4</div>
          <h2 style={LH2}>Human Brain <span style={{ color: T.violet }}>vs</span> Artificial Intelligence</h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: px(8), justifyContent: "center", marginBottom: px(32) }}>
          {L_COMPARE.map((c, i) => <button key={i} onClick={() => setSelected(i)} style={{ background: selected === i ? T.violet : T.card, border: `1px solid ${selected === i ? T.violet : T.border}`, borderRadius: px(20), padding: "8px 18px", cursor: "pointer", fontSize: px(13), fontWeight: 600, color: selected === i ? "#fff" : T.muted, transition: "all 0.2s" }}>{c.cat}</button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: px(20), alignItems: "stretch" }}>
          <div style={{ ...LCARD, borderTop: `4px solid ${T.amber}`, textAlign: "center" }}>
            <div style={{ fontSize: px(48), marginBottom: px(12) }}>🧠</div>
            <div style={{ fontWeight: 800, color: T.ink, fontSize: px(16), marginBottom: px(12) }}>Human</div>
            <p style={{ ...LBODY, fontSize: px(15) }}>{item.human}</p>
            {item.winner === "human" && <div style={{ ...LTAG(T.amber), marginTop: px(12) }}>🏆 Wins here</div>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 8px" }}>
            <div style={{ width: px(2), flex: 1, background: T.border }} />
            <div style={{ background: item.winner === "tie" ? T.teal : item.winner === "ai" ? T.violet : T.amber, borderRadius: "50%", width: px(44), height: px(44), display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(20), color: "#fff", fontWeight: 900 }}>VS</div>
            <div style={{ width: px(2), flex: 1, background: T.border }} />
          </div>
          <div style={{ ...LCARD, borderTop: `4px solid ${T.violet}`, textAlign: "center" }}>
            <div style={{ fontSize: px(48), marginBottom: px(12) }}>🤖</div>
            <div style={{ fontWeight: 800, color: T.ink, fontSize: px(16), marginBottom: px(12) }}>AI</div>
            <p style={{ ...LBODY, fontSize: px(15) }}>{item.ai}</p>
            {item.winner === "ai" && <div style={{ ...LTAG(T.violet), marginTop: px(12) }}>🏆 Wins here</div>}
          </div>
        </div>
        <div style={{ ...LCARD, marginTop: px(20), background: "#f5f3ff", borderLeft: `4px solid ${T.violet}` }}>
          <strong style={{ color: T.violet }}>🔬 The insight:</strong>
          <p style={{ ...LBODY, margin: "8px 0 0", fontSize: px(15) }}>{item.desc}</p>
        </div>
      </div>
    </section>
  );
};

const L_APPS = [
  { emoji: "🎬", name: "Netflix", color: T.rose, simple: "Netflix watches what you watch, when you pause, what you re-watch — and predicts what you'll want next.", data: "Watch history, ratings, browsing time, what similar users liked", prediction: "You'll enjoy 'Squid Game' next — 94% match!", detail: "Uses collaborative filtering + deep neural networks." },
  { emoji: "🗺️", name: "Google Maps", color: T.sky, simple: "Maps doesn't just know roads — it learns live traffic patterns from millions of phones moving right now.", data: "GPS speed of millions of phones, historical traffic patterns, road events", prediction: "Take Highway 101 — 14 minutes faster than usual route", detail: "Real-time graph neural networks + time-series prediction." },
  { emoji: "💬", name: "ChatGPT", color: T.teal, simple: "ChatGPT learned from reading most of the internet — books, articles, code. It learned patterns of human language.", data: "Trillions of words from the internet, books, Wikipedia, GitHub", prediction: "Given your question → generates the most likely helpful response", detail: "Transformer neural network with 175B parameters (GPT-3)." },
  { emoji: "🚗", name: "Self-Driving Cars", color: T.amber, simple: "Tesla's AI watches millions of hours of human driving — then learns to steer, brake, and navigate by itself.", data: "Camera video, radar, lidar sensor data from millions of miles driven", prediction: "Object is a pedestrian crossing — brake immediately", detail: "Computer vision + reinforcement learning + sensor fusion." },
  { emoji: "🏥", name: "Medical AI", color: "#10b981", simple: "AI analyzes X-rays pixel by pixel — spotting cancer patterns that human doctors might miss in seconds.", data: "Millions of labelled medical scans with diagnosis outcomes", prediction: "Nodule in lower-left lung — 87% probability malignant", detail: "Convolutional Neural Networks trained on radiology datasets." },
  { emoji: "📧", name: "Spam Detection", color: T.violet, simple: "Gmail's AI learned from billions of emails what spam looks like — sender, words, links, formatting patterns.", data: "Billions of emails labelled spam/not-spam by users over years", prediction: "This email is 99.9% spam — skip inbox", detail: "Naive Bayes + gradient boosted trees + neural networks." },
  { emoji: "🗣️", name: "Voice Assistants", color: "#f97316", simple: "Voice assistants convert your speech to text, understand meaning, then generate a spoken response.", data: "Millions of hours of labelled voice recordings + intent datasets", prediction: "User said 'play jazz' → identify intent → execute action", detail: "Speech-to-text (Whisper) + NLP intent + TTS pipeline." },
];
const RealWorldSection = () => {
  const [active, setActive] = useState(0); const app = L_APPS[active];
  return (
    <section style={{ background: T.paper }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.rose), marginBottom: px(16) }}>Part 5</div>
          <h2 style={LH2}>AI in the <span style={{ color: T.rose }}>Real World</span></h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: px(10), justifyContent: "center", marginBottom: px(32) }}>
          {L_APPS.map((a, i) => <button key={i} onClick={() => setActive(i)} style={{ background: active === i ? a.color : T.card, border: `1px solid ${active === i ? a.color : T.border}`, borderRadius: px(12), padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: px(14), fontWeight: 600, color: active === i ? (a.color === T.amber ? T.ink : "#fff") : T.muted, transition: "all 0.2s" }}><span>{a.emoji}</span><span>{a.name}</span></button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: px(20) }}>
          <div style={{ ...LCARD, borderTop: `4px solid ${app.color}` }}><div style={{ ...LTAG(app.color), marginBottom: px(12) }}>Simple Explanation</div><div style={{ fontSize: px(48), marginBottom: px(12) }}>{app.emoji}</div><h3 style={{ fontWeight: 800, color: T.ink, marginBottom: px(10) }}>{app.name}</h3><p style={{ ...LBODY, fontSize: px(15) }}>{app.simple}</p></div>
          <div style={{ ...LCARD }}><div style={{ ...LTAG(T.sky), marginBottom: px(12) }}>📦 Training Data</div><p style={{ ...LBODY, fontSize: px(15), marginBottom: px(16) }}>{app.data}</p><div style={{ background: T.cream, borderRadius: px(10), padding: "12px 14px", fontFamily: "monospace", fontSize: px(12), color: T.sky }}>INPUT → LEARN → MODEL</div></div>
          <div style={{ ...LCARD }}><div style={{ ...LTAG(T.teal), marginBottom: px(12) }}>🎯 AI Prediction</div><div style={{ background: "#f0fdf9", border: `1px solid ${T.teal}33`, borderRadius: px(10), padding: "14px 16px", fontFamily: "monospace", fontSize: px(13), color: T.teal, marginBottom: px(12) }}>"{app.prediction}"</div><p style={{ ...LBODY, fontSize: px(13) }}>{app.detail}</p></div>
        </div>
      </div>
    </section>
  );
};

const HierarchyViz = () => {
  const [hovered, setHovered] = useState(null);
  const layers = [{ label: "Artificial Intelligence", size: 320, color: T.sky, emoji: "🌐", desc: "The broadest field — any technique that makes machines smart." }, { label: "Machine Learning", size: 240, color: T.violet, emoji: "📊", desc: "A subset of AI. ML systems learn from data instead of rules." }, { label: "Deep Learning", size: 160, color: T.amber, emoji: "🧠", desc: "A subset of ML using multi-layer neural networks." }, { label: "Large Language Models", size: 90, color: T.rose, emoji: "💬", desc: "Massive transformers trained on text. GPT-4, Claude, Gemini live here." }];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32), alignItems: "center" }}>
      <div style={{ position: "relative", height: px(340), display: "flex", alignItems: "center", justifyContent: "center" }}>
        {layers.map((l, i) => <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ position: "absolute", width: px(l.size), height: px(l.size), borderRadius: "50%", border: `2px solid ${l.color}`, background: hovered === i ? l.color + "22" : l.color + "08", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s", boxShadow: hovered === i ? `0 0 30px ${l.color}44` : "none" }}>{i === layers.length - 1 && <span style={{ fontSize: px(20) }}>{l.emoji}</span>}</div>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: px(12) }}>
        {layers.map((l, i) => <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ ...LCARD, border: `2px solid ${hovered === i ? l.color : T.border}`, cursor: "pointer", transition: "all 0.2s", transform: hovered === i ? "translateX(6px)" : "none" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ background: l.color + "22", borderRadius: "50%", width: px(36), height: px(36), display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(18) }}>{l.emoji}</div><div><div style={{ fontWeight: 800, color: T.ink, fontSize: px(14) }}>{l.label}</div>{hovered === i && <p style={{ ...LBODY, fontSize: px(13), margin: "4px 0 0" }}>{l.desc}</p>}</div></div></div>)}
      </div>
    </div>
  );
};
const HierarchySection = () => (
  <section style={{ background: T.ink }}>
    <div style={LSEC}>
      <div style={{ textAlign: "center", marginBottom: px(48) }}>
        <div style={{ ...LTAG(T.sky), marginBottom: px(16) }}>Part 6</div>
        <h2 style={{ ...LH2, color: "#fff" }}>The AI <span style={{ color: T.sky }}>Hierarchy</span></h2>
        <p style={{ ...LBODY, color: "#94a3b8", maxWidth: px(560), margin: "16px auto 0" }}>AI, ML, Deep Learning, and LLMs are NOT the same thing. Hover each layer.</p>
      </div>
      <HierarchyViz />
      <div style={{ marginTop: px(32), display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: px(16) }}>
        {[["🌐 AI", "The whole universe", T.sky], ["📊 ML", "Learning from data", T.violet], ["🧠 DL", "Neural networks", T.amber], ["💬 LLMs", "Language models", T.rose]].map(([t, d, c]) => <div key={t} style={{ textAlign: "center", background: "rgba(255,255,255,0.04)", borderRadius: px(14), padding: "16px", border: `1px solid ${c}33` }}><div style={{ fontWeight: 800, color: c, marginBottom: px(6) }}>{t}</div><div style={{ fontSize: px(12), color: "#64748b" }}>{d}</div></div>)}
      </div>
    </div>
  </section>
);

const L_TYPES = [
  { name: "Narrow AI (ANI)", emoji: "🎯", color: T.teal, exists: "✅ Exists Today", def: "AI that is extremely good at ONE specific task but helpless outside it.", examples: ["Chess: Deep Blue beats world champions", "Images: Google Photos recognizes your face", "Language: ChatGPT writes essays", "Driving: Tesla Autopilot on highways"], impact: "Already transforming industries — healthcare, finance, creative work, science.", analogy: "Like a world-class surgeon who can't cook their own breakfast." },
  { name: "General AI (AGI)", emoji: "🌍", color: T.amber, exists: "🔬 Not Yet — Being Researched", def: "AI that can learn and perform ANY intellectual task a human can do, across all domains.", examples: ["Learn chess AND cook AND write poetry AND do surgery", "Transfer knowledge between domains", "Understand context, nuance, common sense", "Adapt to completely new situations"], impact: "Would be the most transformative technology ever created. Timeline unknown.", analogy: "Like having Einstein's brain available as software." },
  { name: "Super AI (ASI)", emoji: "🌌", color: T.rose, exists: "🚀 Theoretical — Far Future", def: "AI that surpasses the best human minds in every domain — science, creativity, social skills, everything.", examples: ["Solve climate change in days", "Cure all diseases", "Design technology beyond human comprehension", "Self-improve recursively"], impact: "Completely unpredictable impact on civilization. Major AI safety research focus.", analogy: "The gap between a mouse and Einstein — but the mouse is us." },
];
const TypesSection = () => {
  const [active, setActive] = useState(0); const t = L_TYPES[active];
  return (
    <section style={{ background: T.cream }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.amber), marginBottom: px(16) }}>Part 7</div>
          <h2 style={LH2}>The Three <span style={{ color: T.amber }}>Types</span> of AI</h2>
        </div>
        <div style={{ display: "flex", borderRadius: px(16), overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: px(32) }}>
          {L_TYPES.map((tp, i) => <button key={i} onClick={() => setActive(i)} style={{ flex: 1, background: active === i ? tp.color : T.card, border: "none", borderRight: i < 2 ? `1px solid ${T.border}` : "none", padding: "20px", cursor: "pointer", transition: "all 0.25s", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><div style={{ fontSize: px(32) }}>{tp.emoji}</div><div style={{ fontWeight: 800, color: active === i ? (tp.color === T.amber ? T.ink : "#fff") : T.ink, fontSize: px(13) }}>{tp.name}</div><div style={{ fontSize: px(10), color: active === i ? "rgba(255,255,255,0.7)" : T.muted }}>{tp.exists}</div></button>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: px(24) }}>
          <div style={{ ...LCARD, borderLeft: `4px solid ${t.color}` }}>
            <div style={{ ...LTAG(t.color), marginBottom: px(16) }}>{t.emoji} {t.name}</div>
            <p style={{ ...LBODY, fontSize: px(16), marginBottom: px(20), fontWeight: 600, color: T.ink }}>{t.def}</p>
            <div style={{ fontWeight: 700, color: T.muted, fontSize: px(12), marginBottom: px(8), letterSpacing: "1px" }}>EXAMPLES</div>
            {t.examples.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><div style={{ width: px(6), height: px(6), borderRadius: "50%", background: t.color, flexShrink: 0 }} /><span style={{ ...LBODY, fontSize: px(14) }}>{e}</span></div>)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: px(16) }}>
            <div style={{ ...LCARD, background: t.color + "11", border: `1px solid ${t.color}33` }}><div style={{ fontWeight: 700, color: t.color, fontSize: px(12), marginBottom: px(8), letterSpacing: "1px" }}>🌍 REAL IMPACT</div><p style={{ ...LBODY, fontSize: px(14), margin: 0 }}>{t.impact}</p></div>
            <div style={{ ...LCARD }}><div style={{ fontWeight: 700, color: T.muted, fontSize: px(12), marginBottom: px(8) }}>😄 ANALOGY</div><p style={{ ...LBODY, fontSize: px(14), margin: 0, fontStyle: "italic" }}>"{t.analogy}"</p></div>
            <div style={{ ...LCARD, textAlign: "center" }}><div style={{ fontSize: px(32) }}>{t.exists.split(" ")[0]}</div><div style={{ fontWeight: 700, color: T.ink, marginTop: px(6) }}>{t.exists}</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MathSection = () => {
  const [houseSize, setHouseSize] = useState(1500), [spamWords, setSpamWords] = useState(3);
  const price = Math.round(houseSize * 180 + 50000), spamProb = Math.min(99, spamWords * 18 + 10);
  return (
    <section style={{ background: T.paper }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.violet), marginBottom: px(16) }}>Part 8</div>
          <h2 style={LH2}>Simple <span style={{ color: T.violet }}>Math</span> Intuition</h2>
        </div>
        <div style={{ ...LCARD, textAlign: "center", padding: "40px", marginBottom: px(40), background: "linear-gradient(135deg, #f5f3ff, #ede9fe)", border: `2px solid ${T.violet}44` }}>
          <div style={{ fontFamily: "monospace", fontSize: px(32), color: T.violet, fontWeight: 900, letterSpacing: px(2), marginBottom: px(16) }}>Prediction = Model(Data)</div>
          <p style={{ ...LBODY, maxWidth: px(480), margin: "0 auto" }}>Every AI system boils down to this. Feed data in, get a prediction out.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
          <div style={{ ...LCARD }}>
            <div style={{ ...LTAG(T.amber), marginBottom: px(16) }}>🏠 House Price Prediction</div>
            <div style={{ fontFamily: "monospace", background: T.cream, borderRadius: px(10), padding: "12px 16px", fontSize: px(13), color: T.amber2, marginBottom: px(20) }}>Price = (Size × $180) + $50,000</div>
            <label style={{ ...LBODY, fontSize: px(14), display: "block", marginBottom: px(8) }}>House size: <strong style={{ color: T.amber }}>{houseSize.toLocaleString()} sq ft</strong></label>
            <input type="range" min="500" max="5000" value={houseSize} onChange={e => setHouseSize(+e.target.value)} style={{ width: "100%", accentColor: T.amber, marginBottom: px(16) }} />
            <div style={{ background: "#fffbeb", border: `1px solid ${T.amber}55`, borderRadius: px(12), padding: "16px", textAlign: "center" }}><div style={{ fontSize: px(28), fontWeight: 900, color: T.amber2 }}>${price.toLocaleString()}</div><div style={{ fontSize: px(12), color: T.muted }}>Predicted house price</div></div>
          </div>
          <div style={{ ...LCARD }}>
            <div style={{ ...LTAG(T.rose), marginBottom: px(16) }}>📧 Spam Email Detection</div>
            <div style={{ fontFamily: "monospace", background: T.cream, borderRadius: px(10), padding: "12px 16px", fontSize: px(13), color: T.rose, marginBottom: px(20) }}>P(spam) = sigmoid(word_score + link_score)</div>
            <label style={{ ...LBODY, fontSize: px(14), display: "block", marginBottom: px(8) }}>Suspicious words: <strong style={{ color: T.rose }}>{spamWords}</strong></label>
            <input type="range" min="0" max="5" value={spamWords} onChange={e => setSpamWords(+e.target.value)} style={{ width: "100%", accentColor: T.rose, marginBottom: px(16) }} />
            <div style={{ background: "#fff1f2", border: `1px solid ${T.rose}55`, borderRadius: px(12), padding: "16px", textAlign: "center" }}><div style={{ fontSize: px(28), fontWeight: 900, color: T.rose }}>{spamProb}%</div><div style={{ fontSize: px(12), color: T.muted }}>Probability of spam</div></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const L_ANIMALS = [
  { img: "🐶", type: "dog" }, { img: "🐱", type: "cat" }, { img: "🐕", type: "dog" }, { img: "🐈", type: "cat" },
  { img: "🦮", type: "dog" }, { img: "😺", type: "cat" }, { img: "🐩", type: "dog" }, { img: "🐈‍⬛", type: "cat" },
  { img: "🐾", type: "dog" }, { img: "🙀", type: "cat" }, { img: "🦴", type: "dog" }, { img: "🐟", type: "cat" },
];
const TrainGameSection = () => {
  const [labeled, setLabeled] = useState({}), [phase, setPhase] = useState("label"), [trainIter, setTrainIter] = useState(0), [accuracy, setAccuracy] = useState(0), [testAnswer, setTestAnswer] = useState(null);
  const [testItem] = useState({ img: "🐕‍🦺", type: "dog" }); const intervalRef = useRef();
  const labeledCount = Object.keys(labeled).length;
  const label = (i) => setLabeled(l => { const n = { ...l }; if (!n[i]) n[i] = "dog"; else if (n[i] === "dog") n[i] = "cat"; else delete n[i]; return n; });
  const startTraining = () => {
    setPhase("train"); setTrainIter(0); setAccuracy(0); let iter = 0;
    intervalRef.current = setInterval(() => { iter++; setTrainIter(iter); setAccuracy(Math.min(98, Math.round(30 + iter * 4.5 + Math.random() * 3))); if (iter >= 15) { clearInterval(intervalRef.current); setPhase("test"); } }, 200);
  };
  useEffect(() => () => clearInterval(intervalRef.current), []);
  return (
    <section style={{ background: T.ink }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.amber), marginBottom: px(16) }}>Part 9 · Interactive Game</div>
          <h2 style={{ ...LH2, color: "#fff" }}>🎮 Train Your <span style={{ color: T.amber }}>First AI</span></h2>
          <p style={{ ...LBODY, color: "#94a3b8", maxWidth: px(560), margin: "16px auto 0" }}>Label animals → Train the AI → Test it. This is exactly how real ML works!</p>
        </div>
        {phase === "label" && (
          <div>
            <p style={{ ...LBODY, color: "#94a3b8", textAlign: "center", marginBottom: px(24) }}>Click each animal to cycle: 🐶 Dog → 🐱 Cat → unlabeled. Label at least 8!</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: px(12), marginBottom: px(32) }}>
              {L_ANIMALS.map((a, i) => (
                <div key={i} onClick={() => label(i)} style={{ ...LCARD, textAlign: "center", cursor: "pointer", border: `2px solid ${labeled[i] === "dog" ? T.teal : labeled[i] === "cat" ? T.rose : T.border}`, background: labeled[i] ? (labeled[i] === "dog" ? "#f0fdf9" : "#fff1f2") : T.card, padding: px(14), transition: "all 0.2s" }}>
                  <div style={{ fontSize: px(32) }}>{a.img}</div>
                  {labeled[i] && <div style={{ fontSize: px(11), fontWeight: 700, color: labeled[i] === "dog" ? T.teal : T.rose, marginTop: px(4) }}>{labeled[i] === "dog" ? "🐶 DOG" : "🐱 CAT"}</div>}
                  {!labeled[i] && <div style={{ fontSize: px(11), color: "#475569", marginTop: px(4) }}>click</div>}
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#64748b", fontSize: px(14), marginBottom: px(16) }}>Labeled: <strong style={{ color: T.amber }}>{labeledCount}</strong> / {L_ANIMALS.length} {labeledCount >= 8 && <span style={{ color: T.teal, marginLeft: px(10) }}>✓ Ready to train!</span>}</div>
              <button disabled={labeledCount < 8} onClick={startTraining} style={{ ...LBTN(labeledCount >= 8 ? T.amber : "#334155"), opacity: labeledCount >= 8 ? 1 : 0.5, cursor: labeledCount >= 8 ? "pointer" : "not-allowed", fontSize: px(16), padding: "14px 32px" }}>{labeledCount >= 8 ? "🚀 Train the AI!" : `Label ${8 - labeledCount} more...`}</button>
            </div>
          </div>
        )}
        {phase === "train" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ ...LCARD, maxWidth: px(480), margin: "0 auto", padding: "40px" }}>
              <div style={{ fontSize: px(64), marginBottom: px(16) }}>⚙️</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: T.ink, marginBottom: px(20) }}>Training in progress...</h3>
              <div style={{ background: T.cream, borderRadius: px(8), height: px(12), overflow: "hidden", marginBottom: px(12) }}><div style={{ height: "100%", width: `${(trainIter / 15) * 100}%`, background: `linear-gradient(90deg, ${T.amber}, ${T.teal})`, transition: "width 0.2s", borderRadius: px(8) }} /></div>
              <div style={{ fontFamily: "monospace", fontSize: px(13), color: T.muted, marginBottom: px(8) }}>Epoch {trainIter}/15</div>
              <div style={{ fontSize: px(36), fontWeight: 900, color: T.teal }}>{accuracy}%</div>
              <div style={{ color: T.muted, fontSize: px(14) }}>Training Accuracy</div>
            </div>
          </div>
        )}
        {phase === "test" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "rgba(16,185,129,0.1)", border: `1px solid ${T.teal}44`, borderRadius: px(16), padding: "24px", maxWidth: px(400), margin: "0 auto 32px" }}>
              <div style={{ color: T.teal, fontWeight: 700, marginBottom: px(8) }}>✅ Training Complete!</div>
              <div style={{ fontSize: px(42), fontWeight: 900, color: T.teal }}>{accuracy}%</div>
              <div style={{ color: "#94a3b8", fontSize: px(14) }}>Final Accuracy</div>
            </div>
            <div style={{ ...LCARD, maxWidth: px(480), margin: "0 auto", padding: "36px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: T.ink, marginBottom: px(8) }}>🔮 New Animal — What is it?</h3>
              <div style={{ fontSize: px(80), marginBottom: px(24) }}>{testItem.img}</div>
              {!testAnswer ? (
                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                  <button onClick={() => setTestAnswer("dog")} style={{ ...LBTN(T.teal), fontSize: px(16), padding: "12px 28px" }}>🐶 Dog</button>
                  <button onClick={() => setTestAnswer("cat")} style={{ ...LBTN(T.rose), fontSize: px(16), padding: "12px 28px" }}>🐱 Cat</button>
                </div>
              ) : (
                <div style={{ background: testAnswer === testItem.type ? "#f0fdf9" : "#fff1f2", border: `1px solid ${testAnswer === testItem.type ? T.teal : T.rose}`, borderRadius: px(16), padding: "20px" }}>
                  <div style={{ fontSize: px(36) }}>{testAnswer === testItem.type ? "🎉" : "🤔"}</div>
                  <div style={{ fontWeight: 800, color: testAnswer === testItem.type ? T.teal : T.rose, marginTop: px(8) }}>{testAnswer === testItem.type ? "Correct! It's a dog!" : `Actually it's a ${testItem.type}!`}</div>
                  <button onClick={() => { setPhase("label"); setLabeled({}); setTestAnswer(null); }} style={{ ...LBTN(T.amber), marginTop: px(16) }}>🔄 Train Again</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const LessonClusterCanvas = () => {
  const canvasRef = useRef(), [running, setRunning] = useState(false), [step, setStep] = useState(0);
  const colors = [T.amber, T.teal, T.rose], ptsRef = useRef(null), centroidsRef = useRef(null), stepRef = useRef(0), timerRef = useRef();
  const initPts = useCallback(() => { const clusters = [[0.2, 0.2], [0.7, 0.25], [0.45, 0.75]], pts = []; clusters.forEach(([cx, cy]) => { for (let i = 0; i < 22; i++) pts.push({ x: cx + (Math.random() - 0.5) * 0.25, y: cy + (Math.random() - 0.5) * 0.25, c: -1 }); }); return pts; }, []);
  const draw = useCallback((pts, centroids) => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext("2d"), W = c.width = c.offsetWidth, H = c.height = c.offsetHeight; ctx.clearRect(0, 0, W, H);
    pts.forEach(p => { if (p.c >= 0 && centroids[p.c]) { ctx.beginPath(); ctx.moveTo(p.x * W, p.y * H); ctx.lineTo(centroids[p.c].x * W, centroids[p.c].y * H); ctx.strokeStyle = colors[p.c % colors.length] + "33"; ctx.lineWidth = 1; ctx.stroke(); } });
    pts.forEach(p => { ctx.beginPath(); ctx.arc(p.x * W, p.y * H, 7, 0, Math.PI * 2); ctx.fillStyle = p.c >= 0 ? colors[p.c % colors.length] + "cc" : "#94a3b8cc"; ctx.fill(); ctx.strokeStyle = p.c >= 0 ? colors[p.c % colors.length] : "#64748b"; ctx.lineWidth = 1.5; ctx.stroke(); });
    centroids.forEach((c2, i) => { ctx.beginPath(); ctx.arc(c2.x * W, c2.y * H, 14, 0, Math.PI * 2); const g = ctx.createRadialGradient(c2.x * W, c2.y * H, 0, c2.x * W, c2.y * H, 14); g.addColorStop(0, colors[i] + "ff"); g.addColorStop(1, colors[i] + "44"); ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("C" + (i + 1), c2.x * W, c2.y * H); });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const doStep = useCallback(() => {
    const pts = ptsRef.current, centroids = centroidsRef.current; if (!pts || !centroids) return;
    if (stepRef.current % 2 === 0) { pts.forEach(p => { let best = 0, bestD = Infinity; centroids.forEach((c, i) => { const d = Math.hypot(p.x - c.x, p.y - c.y); if (d < bestD) { bestD = d; best = i; } }); p.c = best; }); }
    else { centroids.forEach((c, i) => { const m = pts.filter(p => p.c === i); if (m.length) { c.x = m.reduce((s, p) => s + p.x, 0) / m.length; c.y = m.reduce((s, p) => s + p.y, 0) / m.length; } }); }
    stepRef.current++; setStep(stepRef.current); draw(pts, centroids);
  }, [draw]);
  const start = useCallback(() => { const pts = initPts(), cents = [{ x: Math.random(), y: Math.random() }, { x: Math.random(), y: Math.random() }, { x: Math.random(), y: Math.random() }]; ptsRef.current = pts; centroidsRef.current = cents; stepRef.current = 0; setStep(0); setRunning(true); draw(pts, cents); timerRef.current = setInterval(doStep, 600); }, [initPts, draw, doStep]);
  const stop = useCallback(() => { clearInterval(timerRef.current); setRunning(false); }, []);
  useEffect(() => () => clearInterval(timerRef.current), []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: px(16) }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: px(300), borderRadius: px(16), border: `1px solid rgba(255,255,255,0.1)`, background: "rgba(255,255,255,0.03)" }} />
      <div style={{ display: "flex", gap: px(12), alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={running ? stop : start} style={{ ...LBTN(running ? T.rose : T.amber), fontSize: px(15) }}>{running ? "⏸ Pause" : "▶ Start Clustering"}</button>
        <button onClick={() => { stop(); start(); }} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: px(10), padding: "12px 20px", color: "#94a3b8", cursor: "pointer", fontWeight: 700 }}>↺ Reset</button>
        <div style={{ color: "#64748b", fontSize: px(13) }}>Iteration: <span style={{ color: T.amber, fontWeight: 700 }}>{Math.floor(step / 2)}</span></div>
      </div>
    </div>
  );
};
const PatternSection = () => (
  <section style={{ background: T.dark }}>
    <div style={LSEC}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(48), alignItems: "center" }}>
        <div>
          <div style={{ ...LTAG(T.teal), marginBottom: px(16) }}>Part 10</div>
          <h2 style={{ ...LH2, color: "#fff" }}>AI Sees <span style={{ color: T.teal }}>Patterns</span> Everywhere</h2>
          <p style={{ ...LBODY, color: "#94a3b8", marginTop: px(16), marginBottom: px(24) }}>One of AI's superpowers is <strong style={{ color: "#e2e8f0" }}>clustering</strong> — grouping similar things together without being told what the groups are.</p>
          {[{ icon: "1️⃣", title: "Random start", desc: "AI places 3 random center points (C1, C2, C3)" }, { icon: "2️⃣", title: "Assign points", desc: "Each dot joins its nearest center" }, { icon: "3️⃣", title: "Move centers", desc: "Centers move to the middle of their group" }, { icon: "🔁", title: "Repeat", desc: "Keep going until groups stop changing" }].map((s, i) => <div key={i} style={{ display: "flex", gap: 12, marginBottom: px(14) }}><div style={{ fontSize: px(20), width: px(28), flexShrink: 0 }}>{s.icon}</div><div><div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: px(14) }}>{s.title}</div><div style={{ ...LBODY, fontSize: px(13), color: "#64748b" }}>{s.desc}</div></div></div>)}
        </div>
        <LessonClusterCanvas />
      </div>
    </div>
  </section>
);

const L_TAKEAWAYS = [
  { emoji: "🤖", text: "AI is software that learns from data instead of following fixed rules.", color: T.sky },
  { emoji: "📊", text: "Machine Learning ⊂ AI. Deep Learning ⊂ ML. LLMs ⊂ Deep Learning.", color: T.violet },
  { emoji: "🎯", text: "Today's AI (ANI) is superhuman at narrow tasks but lacks common sense.", color: T.teal },
  { emoji: "🔁", text: "The AI pipeline: Data → Train → Model → Predict → Feedback → Improve.", color: T.amber },
  { emoji: "🧮", text: "All AI = finding a math function f(x) that maps inputs to correct outputs.", color: T.rose },
  { emoji: "🌍", text: "AI is already in Netflix, Maps, Gmail, your phone, hospitals, and cars.", color: T.amber2 },
  { emoji: "🚀", text: "AGI (human-level AI) doesn't exist yet — it's the frontier everyone is racing toward.", color: "#10b981" },
];
const TakeawaysSection = ({ onBack }) => {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));
  const score = Object.values(checked).filter(Boolean).length;
  return (
    <section style={{ background: T.paper }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ ...LTAG(T.amber), marginBottom: px(16) }}>Part 11 · Wrap Up</div>
          <h2 style={LH2}>Key <span style={{ color: T.amber }}>Takeaways</span></h2>
          <p style={{ ...LBODY, maxWidth: px(560), margin: "16px auto 0" }}>Check off each one as you understand it.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: px(12), marginBottom: px(40) }}>
          {L_TAKEAWAYS.map((t, i) => (
            <div key={i} onClick={() => toggle(i)} style={{ ...LCARD, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: `2px solid ${checked[i] ? t.color : T.border}`, background: checked[i] ? t.color + "0a" : T.card, transition: "all 0.2s" }}>
              <div style={{ width: px(28), height: px(28), borderRadius: "50%", border: `2px solid ${checked[i] ? t.color : T.border}`, background: checked[i] ? t.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(14), color: "#fff", flexShrink: 0, transition: "all 0.2s" }}>{checked[i] ? "✓" : ""}</div>
              <div style={{ fontSize: px(24) }}>{t.emoji}</div>
              <p style={{ ...LBODY, margin: 0, fontSize: px(15), flex: 1, color: checked[i] ? T.ink : T.muted, fontWeight: checked[i] ? 600 : 400 }}>{t.text}</p>
            </div>
          ))}
        </div>
        <div style={{ ...LCARD, textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: px(48), marginBottom: px(8) }}>{score === 7 ? "🎉" : score >= 4 ? "💪" : "📚"}</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: px(28), color: T.ink, marginBottom: px(16) }}>{score}/7 concepts understood</div>
          <div style={{ background: T.cream, borderRadius: px(8), height: px(12), overflow: "hidden", maxWidth: px(400), margin: "0 auto 20px" }}><div style={{ height: "100%", width: `${(score / 7) * 100}%`, background: `linear-gradient(90deg, ${T.amber}, ${T.teal})`, transition: "width 0.5s", borderRadius: px(8) }} /></div>
          {score === 7 ? (
            <div>
              <p style={{ ...LBODY, marginBottom: px(20) }}>🎓 You've mastered <strong>What is AI</strong>! You're ready for the next lesson.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ background: T.amber, borderRadius: px(10), padding: "12px 24px", fontWeight: 700, cursor: "pointer", color: T.ink }}>Next: Math for AI →</div>
                <button onClick={onBack} style={{ border: `1px solid ${T.border}`, background: "none", borderRadius: px(10), padding: "12px 24px", color: T.muted, cursor: "pointer", fontSize: px(14) }}>← Back to Roadmap</button>
              </div>
            </div>
          ) : <p style={{ ...LBODY, color: T.muted }}>{score === 0 ? "Check off each idea as you understand it above 👆" : `Great progress! ${7 - score} more to go.`}</p>}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   WHAT IS AI — LESSON PAGE WRAPPER
═══════════════════════════════════════════════════════════════════ */
const WhatIsAIPage = ({ onBack }) => {
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const sectionRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { const idx = sectionRefs.current.indexOf(e.target); if (idx >= 0) setActiveSecIdx(idx); } }),
      { threshold: 0.3 }
    );
    sectionRefs.current.forEach(r => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);
  const refFor = (i) => (el) => { sectionRefs.current[i] = el; };
  const lessonSections = ["Hero", "Simple Idea", "Pipeline", "Brain vs AI", "Real World", "Hierarchy", "Types", "Math", "Game", "Patterns", "Takeaways"];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: T.paper, color: T.ink }}>
      {/* floating dot nav */}
      <div style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lessonSections.map((s, i) => <div key={i} title={s} style={{ width: i === activeSecIdx ? 10 : 7, height: i === activeSecIdx ? 10 : 7, borderRadius: "50%", background: i === activeSecIdx ? T.amber : "rgba(100,116,139,0.4)", cursor: "pointer", transition: "all 0.2s", boxShadow: i === activeSecIdx ? `0 0 8px ${T.amber}` : "none" }} />)}
      </div>
      {/* breadcrumb */}
      <div style={{ background: T.ink, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, padding: 0 }}>ShivMLAI</button>
        <span style={{ color: "#334155" }}>›</span><span style={{ color: "#475569", fontSize: 13 }}>AI Fundamentals</span>
        <span style={{ color: "#334155" }}>›</span><span style={{ color: T.amber, fontSize: 13, fontWeight: 600 }}>What is AI?</span>
        <div style={{ marginLeft: "auto", ...LTAG(T.amber), fontSize: 10 }}>Lesson 1 of 7</div>
      </div>
      <div ref={refFor(0)}><LessonHeroSection onBack={onBack} /></div>
      <div ref={refFor(1)}><SimpleIdeaSection /></div>
      <div ref={refFor(2)}><PipelineSection /></div>
      <div ref={refFor(3)}><BrainVsAI /></div>
      <div ref={refFor(4)}><RealWorldSection /></div>
      <div ref={refFor(5)}><HierarchySection /></div>
      <div ref={refFor(6)}><TypesSection /></div>
      <div ref={refFor(7)}><MathSection /></div>
      <div ref={refFor(8)}><TrainGameSection /></div>
      <div ref={refFor(9)}><PatternSection /></div>
      <div ref={refFor(10)}><TakeawaysSection onBack={onBack} /></div>
      <footer style={{ background: T.ink, padding: "32px 24px", textAlign: "center", borderTop: "1px solid #1e293b" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: px(20), color: "#fff", marginBottom: px(6) }}>ShivML<span style={{ color: T.amber }}>AI</span>.com</div>
        <p style={{ color: "#475569", fontSize: px(13) }}>Learn Artificial Intelligence Visually · Created by <span style={{ color: T.amber }}>Shivesh Mishra</span></p>
      </footer>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN SHIVMLAI APP
═══════════════════════════════════════════════════════════════════ */
export default function ShivMLAI() {
  const typed = useTyping(["Artificial Intelligence", "Machine Learning", "Deep Learning", "Transformers", "Agentic AI", "AGI"]);
  const [activeSection, setActiveSection] = useState("home");
  const [activePage, setActivePage] = useState(null); // e.g. "what-is-ai"

  const navItems = [
    { id: "home", label: "Home" }, { id: "roadmap", label: "Roadmap" }, { id: "concepts", label: "Concepts" },
    { id: "playground", label: "Playground" }, { id: "quiz", label: "Quizzes" }, { id: "projects", label: "Projects" },
    { id: "diagrams", label: "3D Diagrams" }, { id: "complete", label: "Certificate" },
  ];

  const handleOpenLesson = (pageKey) => { setActivePage(pageKey); window.scrollTo(0, 0); };
  const handleBackFromLesson = () => { setActivePage(null); window.scrollTo(0, 0); };

  // If a lesson page is active, render it full-screen (but keep nav)
  if (activePage === "what-is-ai") {
    return (
      <div style={{ background: C.bg, minHeight: "100vh" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;900&family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700;900&family=Lora:wght@400;600&display=swap');*{box-sizing:border-box;margin:0;padding:0;}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes glow{0%,100%{opacity:0.6}50%{opacity:1}}input[type=range]{accent-color:${T.amber};cursor:pointer;}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${T.paper}}::-webkit-scrollbar-thumb{background:${T.amber}66;border-radius:4px}`}</style>
        {/* mini top nav */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, background: `${C.bg}ee`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, height: 52, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `radial-gradient(${C.accent}, ${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧠</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: C.text }}>ShivML<span style={{ color: C.accent }}>AI</span></span>
          </div>
          <button onClick={handleBackFromLesson} style={{ marginLeft: "auto", background: `${C.accent}22`, border: `1px solid ${C.accent}44`, borderRadius: 8, padding: "6px 16px", color: C.accent, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>← Back to Platform</button>
        </nav>
        <div style={{ paddingTop: 52 }}>
          <WhatIsAIPage onBack={handleBackFromLesson} />
        </div>
      </div>
    );
  }

  return (
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
  );
}