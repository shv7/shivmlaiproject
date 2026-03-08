import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — VECTORS & MATRICES FOR AI
   Level 2 · Math for AI · Lesson 1 of 5
   Color accent: Indigo #4f46e5
══════════════════════════════════════════════════════════════════ */

const IND = "#4f46e5";   // indigo — lesson accent
const CYN = "#0891b2";   // cyan
const EMR = "#059669";   // emerald
const AMB = "#d97706";   // amber

/* ── tiny shared helpers local to this lesson ─────────────────── */
const math = (expr, color = IND) => (
  <span style={{ fontFamily: "monospace", background: color + "12", border: `1px solid ${color}33`, borderRadius: 6, padding: "2px 10px", fontSize: px(14), color, fontWeight: 700 }}>{expr}</span>
);
const Formula = ({ children, color = IND }) => (
  <div style={{ background: color + "0d", border: `1px solid ${color}44`, borderRadius: px(14), padding: "18px 24px", fontFamily: "monospace", fontSize: px(15), color, fontWeight: 700, textAlign: "center", margin: `${px(16)} 0` }}>{children}</div>
);
const Step = ({ n, label, children, color = IND }) => (
  <div style={{ display: "flex", gap: 16, marginBottom: px(20) }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: color + "22", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(13), fontWeight: 800, color, flexShrink: 0 }}>{n}</div>
    <div><div style={{ fontWeight: 700, color: V.ink, marginBottom: 4, fontSize: px(14) }}>{label}</div><div style={{ ...LBODY, fontSize: px(14) }}>{children}</div></div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   SECTION 1 — Hero Canvas (animated vectors)
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    let t = 0;
    const vecs = [
      { ox: 0.5, oy: 0.5, angle: 0.5, len: 0.28, col: IND, speed: 0.4 },
      { ox: 0.5, oy: 0.5, angle: 1.8, len: 0.22, col: CYN, speed: 0.6 },
      { ox: 0.5, oy: 0.5, angle: 3.5, len: 0.18, col: EMR, speed: 0.35 },
      { ox: 0.5, oy: 0.5, angle: 5.1, len: 0.24, col: AMB, speed: 0.5 },
    ];
    const arrow = (x1, y1, x2, y2, col, lw = 2) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(ang - 0.4), y2 - 12 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 12 * Math.cos(ang + 0.4), y2 - 12 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080d1a"; ctx.fillRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = "rgba(79,70,229,0.07)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // axes
      ctx.strokeStyle = "rgba(79,70,229,0.25)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
      // origin dot
      ctx.beginPath(); ctx.arc(W / 2, H / 2, 5, 0, Math.PI * 2); ctx.fillStyle = "rgba(79,70,229,0.6)"; ctx.fill();
      // vectors
      vecs.forEach(v => {
        const a = v.angle + t * v.speed;
        const ex = W / 2 + Math.cos(a) * v.len * Math.min(W, H);
        const ey = H / 2 + Math.sin(a) * v.len * Math.min(W, H);
        // glow
        const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 20);
        g.addColorStop(0, v.col + "66"); g.addColorStop(1, v.col + "00");
        ctx.beginPath(); ctx.arc(ex, ey, 20, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        arrow(W / 2, H / 2, ex, ey, v.col, 2.5);
        ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2); ctx.fillStyle = v.col; ctx.fill();
      });
      // sum vector
      const sx = vecs.reduce((s, v) => s + Math.cos(v.angle + t * v.speed) * v.len * 0.5, 0);
      const sy = vecs.reduce((s, v) => s + Math.sin(v.angle + t * v.speed) * v.len * 0.5, 0);
      arrow(W / 2, H / 2, W / 2 + sx * Math.min(W, H), H / 2 + sy * Math.min(W, H), "rgba(255,255,255,0.7)", 3);
      // label
      ctx.font = "bold 11px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.textAlign = "center"; ctx.fillText("v₁ + v₂ + v₃ + v₄", W / 2, H - 16);
      t += 0.006; requestAnimationFrame(draw);
    };
    draw();
    const onR = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 4 — Interactive Vector Operations
══════════════════════════════════════════════════════════════════ */
const VectorOpsDemo = () => {
  const [v, setV] = useState([3, 4]);
  const [w, setW] = useState([1, 2]);
  const [scalar, setScalar] = useState(2);
  const [op, setOp] = useState("add");

  const add = [v[0] + w[0], v[1] + w[1]];
  const sub = [v[0] - w[0], v[1] - w[1]];
  const smul = [scalar * v[0], scalar * v[1]];
  const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2).toFixed(3);
  const unit = mag > 0 ? [+(v[0] / mag).toFixed(3), +(v[1] / mag).toFixed(3)] : [0, 0];

  const results = { add, sub, smul, mag: [+mag], unit };
  const result = results[op];

  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const cx = W / 2, cy = H / 2, scale = Math.min(W, H) / 12;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8faff"; ctx.fillRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = "#e0e7ff"; ctx.lineWidth = 1;
    for (let x = cx % scale; x < W; x += scale) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = cy % scale; y < H; y += scale) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // axes
    ctx.strokeStyle = IND + "55"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    // axis labels
    ctx.font = "10px sans-serif"; ctx.fillStyle = IND + "88"; ctx.textAlign = "center";
    for (let i = -5; i <= 5; i++) { if (i !== 0) { ctx.fillText(i, cx + i * scale, cy + 14); ctx.fillText(-i, cx - 4, cy - i * scale + 4); } }
    const arrow = (x1, y1, x2, y2, col, label = "") => {
      ctx.beginPath(); ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
      ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
      ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
      const ang = Math.atan2(-(y2 - y1), x2 - x1);
      const ex = cx + x2 * scale, ey = cy - y2 * scale;
      ctx.beginPath(); ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 10 * Math.cos(ang - 0.4), ey + 10 * Math.sin(ang - 0.4));
      ctx.lineTo(ex - 10 * Math.cos(ang + 0.4), ey + 10 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
      if (label) { ctx.font = "bold 12px sans-serif"; ctx.fillStyle = col; ctx.textAlign = "left"; ctx.fillText(label, ex + 6, ey - 6); }
    };
    arrow(0, 0, v[0], v[1], IND, "v");
    if (op === "add" || op === "sub") arrow(0, 0, w[0], w[1], CYN, "w");
    if (result && result.length === 2) arrow(0, 0, result[0], result[1], EMR, "result");
  }, [v, w, scalar, op]);

  const Slider = ({ label, idx, vec, setVec, color }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: px(12), color: V.muted }}>{label}</span>
        <span style={{ fontSize: px(12), fontWeight: 700, color }}>{vec[idx]}</span>
      </div>
      <input type="range" min="-5" max="5" value={vec[idx]} onChange={e => { const n = [...vec]; n[idx] = +e.target.value; setVec(n); }} style={{ width: "100%", accentColor: color }} />
    </div>
  );

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight: 700, color: IND, marginBottom: px(8), fontSize: px(15) }}>🧮 Interactive Vector Operations</div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: px(16) }}>Adjust the sliders and switch operations. The canvas updates in real time.</p>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: 280, borderRadius: 12, border: `1px solid ${IND}22` }} />
        </div>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: px(12), fontWeight: 700, color: IND, marginBottom: 8 }}>VECTOR v = [{v[0]}, {v[1]}]</div>
            <Slider label="v₁" idx={0} vec={v} setVec={setV} color={IND} />
            <Slider label="v₂" idx={1} vec={v} setVec={setV} color={IND} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: px(12), fontWeight: 700, color: CYN, marginBottom: 8 }}>VECTOR w = [{w[0]}, {w[1]}]</div>
            <Slider label="w₁" idx={0} vec={w} setVec={setW} color={CYN} />
            <Slider label="w₂" idx={1} vec={w} setVec={setW} color={CYN} />
          </div>
          {op === "smul" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: px(12), fontWeight: 700, color: AMB, marginBottom: 8 }}>SCALAR c = {scalar}</div>
              <input type="range" min="-3" max="3" step="0.5" value={scalar} onChange={e => setScalar(+e.target.value)} style={{ width: "100%", accentColor: AMB }} />
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {[["add", "v + w"], ["sub", "v − w"], ["smul", "c·v"], ["mag", "||v||"], ["unit", "v̂"]].map(([k, l]) => (
              <button key={k} onClick={() => setOp(k)} style={{ background: op === k ? IND : V.cream, border: `1px solid ${op === k ? IND : V.border}`, borderRadius: 8, padding: "5px 12px", fontSize: px(12), fontWeight: 700, color: op === k ? "#fff" : V.muted, cursor: "pointer" }}>{l}</button>
            ))}
          </div>
          <div style={{ background: IND + "0d", border: `1px solid ${IND}33`, borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ fontSize: px(11), fontWeight: 700, color: IND, marginBottom: 6, letterSpacing: "1px" }}>RESULT</div>
            {op === "mag" ? (
              <div style={{ fontFamily: "monospace", fontSize: px(20), color: IND, fontWeight: 900 }}>||v|| = {mag}</div>
            ) : op === "unit" ? (
              <div style={{ fontFamily: "monospace", fontSize: px(14), color: IND, fontWeight: 700 }}>v̂ = [{unit[0]}, {unit[1]}]</div>
            ) : (
              <div style={{ fontFamily: "monospace", fontSize: px(14), color: IND, fontWeight: 700 }}>[{result[0]}, {result[1]}]</div>
            )}
            <div style={{ fontSize: px(12), color: V.muted, marginTop: 6 }}>
              {op === "add" && `[${v[0]}+${w[0]}, ${v[1]}+${w[1]}]`}
              {op === "sub" && `[${v[0]}−${w[0]}, ${v[1]}−${w[1]}]`}
              {op === "smul" && `[${scalar}×${v[0]}, ${scalar}×${v[1]}]`}
              {op === "mag" && `√(${v[0]}² + ${v[1]}²) = √${v[0] ** 2 + v[1] ** 2}`}
              {op === "unit" && `v / ||v|| = v / ${mag}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 5 & 6 — Interactive Matrix
══════════════════════════════════════════════════════════════════ */
const MatrixDisplay = ({ data, color = IND, label = "" }) => (
  <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, margin: "0 8px" }}>
    {label && <div style={{ fontSize: px(11), fontWeight: 700, color, textAlign: "center", marginBottom: 2 }}>{label}</div>}
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <div style={{ width: 3, height: data.length * 36 + (data.length - 1) * 4, borderLeft: `3px solid ${color}`, borderTop: `3px solid ${color}`, borderBottom: `3px solid ${color}`, borderRadius: "4px 0 0 4px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {data.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 4 }}>
            {row.map((val, ci) => (
              <div key={ci} style={{ width: 36, height: 36, borderRadius: 6, background: color + "12", border: `1px solid ${color}33`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: px(14), fontWeight: 700, color }}>{val}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ width: 3, height: data.length * 36 + (data.length - 1) * 4, borderRight: `3px solid ${color}`, borderTop: `3px solid ${color}`, borderBottom: `3px solid ${color}`, borderRadius: "0 4px 4px 0" }} />
    </div>
  </div>
);

const MatrixOpsDemo = () => {
  const [op, setOp] = useState("add");
  const [A, setA] = useState([[1, 2], [3, 4]]);
  const [B, setB] = useState([[5, 6], [7, 8]]);

  const matAdd = A.map((row, i) => row.map((v, j) => v + B[i][j]));
  const matSub = A.map((row, i) => row.map((v, j) => v - B[i][j]));
  const matMul = A.map((row, i) => B[0].map((_, j) => row.reduce((s, _, k) => s + A[i][k] * B[k][j], 0)));
  const results = { add: matAdd, sub: matSub, mul: matMul };

  const updateCell = (mat, setMat, r, c, val) => {
    const n = mat.map(row => [...row]);
    n[r][c] = isNaN(val) ? 0 : +val;
    setMat(n);
  };

  const EditMatrix = ({ mat, setMat, color, label }) => (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4, margin: "0 8px" }}>
      <div style={{ fontSize: px(11), fontWeight: 700, color, textAlign: "center", marginBottom: 2 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {mat.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 4 }}>
            {row.map((val, ci) => (
              <input key={ci} type="number" value={val} onChange={e => updateCell(mat, setMat, ri, ci, e.target.value)} style={{ width: 40, height: 36, borderRadius: 6, border: `1px solid ${color}44`, background: color + "0d", textAlign: "center", fontFamily: "monospace", fontSize: px(14), fontWeight: 700, color, outline: "none" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight: 700, color: CYN, marginBottom: 8, fontSize: px(15) }}>🔢 Interactive Matrix Operations</div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: 16 }}>Edit any cell in matrices A or B. The result updates instantly.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[["add", "A + B"], ["sub", "A − B"], ["mul", "A × B"]].map(([k, l]) => (
          <button key={k} onClick={() => setOp(k)} style={{ background: op === k ? CYN : V.cream, border: `1px solid ${op === k ? CYN : V.border}`, borderRadius: 8, padding: "6px 16px", fontSize: px(13), fontWeight: 700, color: op === k ? "#fff" : V.muted, cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <EditMatrix mat={A} setMat={setA} color={IND} label="A (edit me)" />
        <div style={{ fontSize: px(28), color: CYN, fontWeight: 900 }}>{op === "add" ? "+" : op === "sub" ? "−" : "×"}</div>
        <EditMatrix mat={B} setMat={setB} color={CYN} label="B (edit me)" />
        <div style={{ fontSize: px(28), color: V.muted, fontWeight: 900 }}>=</div>
        <MatrixDisplay data={results[op]} color={EMR} label="Result" />
      </div>
      {op === "mul" && (
        <div style={{ marginTop: 16, background: AMB + "0d", border: `1px solid ${AMB}44`, borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: px(12), fontWeight: 700, color: AMB, marginBottom: 4 }}>📐 HOW MATRIX MULTIPLICATION WORKS</div>
          <p style={{ ...LBODY, fontSize: px(13), margin: 0 }}>Each cell result[i][j] = dot product of row i of A with column j of B. For 2×2: result[0][0] = A[0][0]×B[0][0] + A[0][1]×B[1][0] = {A[0][0]}×{B[0][0]} + {A[0][1]}×{B[1][0]} = <strong style={{ color: EMR }}>{A[0][0] * B[0][0] + A[0][1] * B[1][0]}</strong></p>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 10 — Vector Movement Mini-Game
══════════════════════════════════════════════════════════════════ */
const VectorMovementGame = () => {
  const canvasRef = useRef();
  const stateRef = useRef({ px: 200, py: 200, tx: 350, ty: 100, score: 0, moves: 0, trail: [] });
  const [info, setInfo] = useState({ px: 200, py: 200, tx: 350, ty: 100, score: 0, moves: 0, vec: [0, 0] });
  const [msg, setMsg] = useState("");

  const draw = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width, H = c.height;
    const s = stateRef.current;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#f8faff"; ctx.fillRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = "#e0e7ff"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // trail
    if (s.trail.length > 1) {
      ctx.beginPath(); ctx.moveTo(s.trail[0].x, s.trail[0].y);
      s.trail.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = IND + "44"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
    }
    // target
    const pulse = Math.sin(Date.now() * 0.005) * 5;
    ctx.beginPath(); ctx.arc(s.tx, s.ty, 18 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = EMR + "22"; ctx.fill();
    ctx.beginPath(); ctx.arc(s.tx, s.ty, 14, 0, Math.PI * 2);
    ctx.fillStyle = EMR + "44"; ctx.fill();
    ctx.font = "18px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🎯", s.tx, s.ty);
    // player
    ctx.beginPath(); ctx.arc(s.px, s.py, 18, 0, Math.PI * 2);
    ctx.fillStyle = IND + "22"; ctx.fill();
    ctx.beginPath(); ctx.arc(s.px, s.py, 14, 0, Math.PI * 2);
    ctx.fillStyle = IND + "cc"; ctx.fill();
    ctx.font = "16px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("🤖", s.px, s.py);
    // distance vector arrow
    ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(s.tx, s.ty);
    ctx.strokeStyle = AMB + "88"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
    const dx = +(((s.tx - s.px) / 40).toFixed(1)), dy = +(((s.py - s.ty) / 40).toFixed(1));
    ctx.font = "bold 11px sans-serif"; ctx.fillStyle = AMB; ctx.textAlign = "center";
    ctx.fillText(`d = [${dx}, ${dy}]`, (s.px + s.tx) / 2, (s.py + s.ty) / 2 - 8);
  }, []);

  useEffect(() => { const id = setInterval(draw, 50); return () => clearInterval(id); }, [draw]);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    c.width = c.offsetWidth; c.height = c.offsetHeight;
    stateRef.current.tx = c.width * 0.75; stateRef.current.ty = c.height * 0.25;
    stateRef.current.px = c.width * 0.25; stateRef.current.py = c.height * 0.75;
    draw();
  }, [draw]);

  const DIRS = [
    { label: "[−1, 0]", emoji: "⬅", dx: -40, dy: 0 },
    { label: "[1, 0]",  emoji: "➡", dx: 40,  dy: 0 },
    { label: "[0, 1]",  emoji: "⬆", dx: 0,   dy: -40 },
    { label: "[0, −1]", emoji: "⬇", dx: 0,   dy: 40 },
    { label: "[1, 1]",  emoji: "↗", dx: 40,  dy: -40 },
    { label: "[−1, 1]", emoji: "↖", dx: -40, dy: -40 },
    { label: "[1, −1]", emoji: "↘", dx: 40,  dy: 40 },
    { label: "[−1, −1]",emoji: "↙", dx: -40, dy: 40 },
  ];

  const move = (dx, dy) => {
    const s = stateRef.current;
    const c = canvasRef.current; if (!c) return;
    const nx = Math.max(20, Math.min(c.width - 20, s.px + dx));
    const ny = Math.max(20, Math.min(c.height - 20, s.py + dy));
    s.trail.push({ x: s.px, y: s.py });
    if (s.trail.length > 20) s.trail.shift();
    s.px = nx; s.py = ny; s.moves++;
    const dist = Math.hypot(nx - s.tx, ny - s.ty);
    const vec = [+(dx / 40).toFixed(0), +((-dy) / 40).toFixed(0)];
    if (dist < 22) {
      s.score++;
      const newTx = 60 + Math.random() * (c.width - 120);
      const newTy = 60 + Math.random() * (c.height - 120);
      s.tx = newTx; s.ty = newTy; s.trail = [];
      setMsg(`✅ Target reached! Applied vector [${vec}]`);
      setTimeout(() => setMsg(""), 2000);
    }
    setInfo({ px: +(nx / 40).toFixed(1), py: +((c.height - ny) / 40).toFixed(1), tx: +(s.tx / 40).toFixed(1), ty: +((c.height - s.ty) / 40).toFixed(1), score: s.score, moves: s.moves, vec });
  };

  const reset = () => {
    const c = canvasRef.current; if (!c) return;
    const s = stateRef.current;
    s.px = c.width * 0.25; s.py = c.height * 0.75;
    s.tx = c.width * 0.75; s.ty = c.height * 0.25;
    s.score = 0; s.moves = 0; s.trail = [];
    setInfo({ px: 0, py: 0, tx: 0, ty: 0, score: 0, moves: 0, vec: [0, 0] });
    setMsg("");
  };

  return (
    <div style={{ ...LCARD, background: "#f8faff", border: `2px solid ${IND}33` }}>
      <div style={{ fontWeight: 800, color: IND, fontSize: px(17), marginBottom: 8 }}>🎮 Vector Movement Game</div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: 16 }}>
        Move the 🤖 robot to the 🎯 target using direction vectors. Each button applies a <strong>displacement vector</strong> to the robot's position. This is exactly how AI models update weights!
      </p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 12, border: `1px solid ${IND}22`, display: "block" }} />
          {msg && <div style={{ background: EMR + "11", border: `1px solid ${EMR}44`, borderRadius: 8, padding: "8px 12px", marginTop: 8, color: EMR, fontWeight: 700, fontSize: px(13) }}>{msg}</div>}
        </div>
        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
            {[5, 2, 6, 0, null, 1, 7, 3, 4].map((idx, i) => idx === null ? (
              <div key={i} style={{ background: IND + "0a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(20), fontWeight: 900, color: IND, padding: 8 }}>·</div>
            ) : (
              <button key={i} onClick={() => move(DIRS[idx].dx, DIRS[idx].dy)}
                style={{ background: IND + "12", border: `1px solid ${IND}44`, borderRadius: 8, padding: "8px 4px", cursor: "pointer", fontSize: px(16), display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span>{DIRS[idx].emoji}</span>
                <span style={{ fontSize: px(9), fontFamily: "monospace", color: IND, fontWeight: 700 }}>{DIRS[idx].label}</span>
              </button>
            ))}
          </div>
          <div style={{ background: IND + "08", border: `1px solid ${IND}22`, borderRadius: 10, padding: "10px 14px" }}>
            <div style={{ fontFamily: "monospace", fontSize: px(12), color: V.muted, lineHeight: 1.8 }}>
              <div>Robot: [{info.px}, {info.py}]</div>
              <div>Target: [{info.tx}, {info.ty}]</div>
              <div>Last Δ: [{info.vec[0]}, {info.vec[1]}]</div>
              <div style={{ marginTop: 4, color: IND, fontWeight: 700 }}>Score: {info.score} | Moves: {info.moves}</div>
            </div>
          </div>
          <button onClick={reset} style={{ border: `1px solid ${V.border}`, background: V.cream, borderRadius: 8, padding: "8px", cursor: "pointer", fontSize: px(13), color: V.muted, fontWeight: 600 }}>↺ Reset</button>
          <div style={{ background: AMB + "0d", border: `1px solid ${AMB}33`, borderRadius: 8, padding: "10px 12px", fontSize: px(12), color: AMB, lineHeight: 1.6 }}>
            <strong>Math connection:</strong> New position = Old position + Displacement vector. This is <em>vector addition</em>!
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 11 — Takeaways Checklist
══════════════════════════════════════════════════════════════════ */
const VectorTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d => ({ ...d, [i]: !d[i] }));
  const items = [
    { e: "📐", t: "A vector is an ordered list of numbers representing magnitude and direction.", c: IND },
    { e: "📊", t: "A matrix is a 2D grid of numbers — the fundamental data structure of AI.", c: CYN },
    { e: "➕", t: "Vectors can be added, subtracted, scaled by a scalar, and normalised.", c: EMR },
    { e: "📏", t: "Magnitude ||v|| = √(v₁² + v₂² + … + vₙ²) measures a vector's length.", c: AMB },
    { e: "🔢", t: "Matrix multiplication is NOT commutative: A×B ≠ B×A in general.", c: IND },
    { e: "🖼️", t: "A greyscale image is literally a matrix of pixel values from 0 to 255.", c: CYN },
    { e: "🧠", t: "Neural network weights are stored as matrices; inputs are vectors.", c: EMR },
    { e: "💬", t: "Word embeddings represent words as vectors so math works on language.", c: AMB },
  ];
  const score = Object.values(done).filter(Boolean).length;
  return (
    <div style={{ ...LSEC }}>
      {STag("Key Insights", IND)}
      <h2 style={{ ...LH2, color: V.ink, marginBottom: px(28) }}>What You Now <span style={{ color: IND }}>Know</span></h2>
      <div style={{ marginBottom: px(32) }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)} style={{ ...LCARD, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: `2px solid ${done[i] ? item.c : V.border}`, background: done[i] ? item.c + "08" : V.card, transition: "all 0.2s", marginBottom: px(10) }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${done[i] ? item.c : V.border}`, background: done[i] ? item.c : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(13), color: "#fff", flexShrink: 0 }}>{done[i] ? "✓" : ""}</div>
            <span style={{ fontSize: px(22) }}>{item.e}</span>
            <p style={{ ...LBODY, margin: 0, fontSize: px(15), flex: 1, color: done[i] ? V.ink : V.muted, fontWeight: done[i] ? 600 : 400 }}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{ ...LCARD, textAlign: "center", padding: "36px" }}>
        <div style={{ fontSize: px(56), marginBottom: 8 }}>{score === 8 ? "🎓" : score >= 5 ? "💪" : "📖"}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: px(24), color: V.ink, marginBottom: 16 }}>{score}/8 concepts understood</div>
        <div style={{ background: V.cream, borderRadius: 8, height: 10, overflow: "hidden", maxWidth: 400, margin: "0 auto 20px" }}>
          <div style={{ height: "100%", width: `${(score / 8) * 100}%`, background: `linear-gradient(90deg,${IND},${CYN})`, transition: "width 0.5s", borderRadius: 8 }} />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ background: IND, border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: px(14) }}>Next: Dot Product →</button>
          <button onClick={onBack} style={{ border: `1px solid ${V.border}`, background: "none", borderRadius: 10, padding: "12px 24px", color: V.muted, cursor: "pointer", fontSize: px(13) }}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════════ */
const VectorsAndMatricesPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Vectors & Matrices" lessonNum="Lesson 1 of 5" accent={IND}
    levelLabel="Math for AI"
    dotLabels={["Hero", "Simple Def", "Math Def", "Vector Repr", "Vec Ops", "Matrix Basics", "Matrix Ops", "AI Purpose", "Real Examples", "Game", "Insights"]}>
    {R => (
      <>
        {/* ── SECTION 1 — HERO ─────────────────────────────────────── */}
        <div ref={R(0)} style={{ background: "linear-gradient(160deg,#06040f 0%,#0d0a2a 60%,#080d1a 100%)", minHeight: "75vh", display: "flex", alignItems: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ maxWidth: px(1100), width: "100%", margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(48), alignItems: "center", position: "relative", zIndex: 1 }}>
            <div>
              <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "7px 16px", color: "#64748b", cursor: "pointer", fontSize: 13, marginBottom: 24 }}>← Back</button>
              {STag("📐 Lesson 1 of 5 · Math for AI", IND)}
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: px(20) }}>Vectors &<br /><span style={{ color: "#818cf8" }}>Matrices</span></h1>
              <div style={{ width: px(56), height: px(4), background: IND, borderRadius: px(2), marginBottom: px(22) }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: px(17), color: "#cbd5e1", lineHeight: 1.8, marginBottom: px(20) }}>Before you can understand neural networks, you need one thing: the language of vectors and matrices. They are the alphabet of AI — every model, every image, every sentence is just numbers arranged in these structures.</p>
              <div style={{ background: "rgba(79,70,229,0.12)", border: "1px solid rgba(79,70,229,0.35)", borderRadius: 14, padding: "14px 20px" }}>
                <div style={{ color: "#a5b4fc", fontWeight: 700, fontSize: px(12), marginBottom: 6, letterSpacing: "1px" }}>💡 ONE LINE SUMMARY</div>
                <p style={{ fontFamily: "'Lora',serif", color: "#cbd5e1", margin: 0, fontSize: px(14), lineHeight: 1.7 }}>Vectors = arrows (or lists of numbers). Matrices = grids of numbers. AI = math on these two things, at massive scale.</p>
              </div>
            </div>
            <div style={{ height: px(380), background: "rgba(79,70,229,0.06)", border: "1px solid rgba(79,70,229,0.2)", borderRadius: 24, overflow: "hidden" }}>
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* ── SECTION 2 — SIMPLE DEFINITION ───────────────────────── */}
        <div ref={R(1)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 1 · Simple Definition", IND)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(20) }}>What Are They — <span style={{ color: IND }}>In Plain English</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24), marginBottom: px(32) }}>
              <div style={{ ...LCARD, borderLeft: `5px solid ${IND}` }}>
                <div style={{ fontSize: px(44), marginBottom: 12 }}>🏹</div>
                <h3 style={{ fontWeight: 800, color: IND, fontSize: px(20), marginBottom: 10 }}>A Vector is…</h3>
                <p style={{ ...LBODY, fontSize: px(15), marginBottom: 14 }}>…an arrow pointing somewhere, or equivalently, an ordered list of numbers. It has two key properties: <strong style={{ color: V.ink }}>magnitude</strong> (how long) and <strong style={{ color: V.ink }}>direction</strong> (which way).</p>
                <div style={{ background: IND + "0d", borderRadius: 10, padding: "12px 16px", fontFamily: "monospace", fontSize: px(14), color: IND, fontWeight: 700 }}>v = [3, 4] &nbsp;← a 2D vector</div>
                <p style={{ ...LBODY, fontSize: px(13), marginTop: 10 }}>Think of it as GPS coordinates: "go 3 east, 4 north." That's a vector.</p>
              </div>
              <div style={{ ...LCARD, borderLeft: `5px solid ${CYN}` }}>
                <div style={{ fontSize: px(44), marginBottom: 12 }}>📋</div>
                <h3 style={{ fontWeight: 800, color: CYN, fontSize: px(20), marginBottom: 10 }}>A Matrix is…</h3>
                <p style={{ ...LBODY, fontSize: px(15), marginBottom: 14 }}>…a rectangle of numbers arranged in rows and columns. Like a spreadsheet. Every image you see, every neural network layer, every dataset table is a matrix.</p>
                <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                  <MatrixDisplay data={[[1, 2], [3, 4]]} color={CYN} />
                  <div style={{ ...LBODY, fontSize: px(13), paddingTop: 16 }}>← 2 rows × 2 cols = "2×2 matrix"</div>
                </div>
              </div>
            </div>
            <IBox color={IND} title="The Key Analogy" body="A vector is a single column in a spreadsheet (one observation with multiple features). A matrix is the full spreadsheet (many observations). Every dataset in machine learning is a matrix." />
          </div>
        </div>

        {/* ── SECTION 3 — MATH DEFINITION ─────────────────────────── */}
        <div ref={R(2)} style={{ background: "#0d0a2a" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 2 · Mathematical Definition", "#818cf8")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(28) }}>The Formal <span style={{ color: "#818cf8" }}>Definitions</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
              <div>
                <div style={{ fontWeight: 700, color: "#818cf8", fontSize: px(15), marginBottom: 16 }}>VECTOR — Formal Definition</div>
                <div style={{ ...LCARD, marginBottom: px(16) }}>
                  <p style={{ ...LBODY, fontSize: px(14), marginBottom: 14 }}>An <strong>n-dimensional vector</strong> v ∈ ℝⁿ is an ordered tuple of n real numbers:</p>
                  <Formula color="#818cf8">v = [v₁, v₂, …, vₙ]ᵀ</Formula>
                  <p style={{ ...LBODY, fontSize: px(13) }}>The superscript ᵀ means it's a <em>column vector</em> (transposed). Each vᵢ is called a <strong>component</strong> or <strong>element</strong>.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[["2D vector", "v ∈ ℝ²", "[3, 4]", IND], ["3D vector", "v ∈ ℝ³", "[1, 2, 3]", CYN]].map(([t, n, ex, c]) => (
                    <div key={t} style={{ background: c + "0d", border: `1px solid ${c}33`, borderRadius: 10, padding: "12px" }}>
                      <div style={{ fontWeight: 700, color: c, fontSize: px(12), marginBottom: 4 }}>{t}</div>
                      <div style={{ fontFamily: "monospace", color: "#94a3b8", fontSize: px(12) }}>{n}</div>
                      <div style={{ fontFamily: "monospace", color: c, fontSize: px(16), fontWeight: 700, marginTop: 4 }}>{ex}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#818cf8", fontSize: px(15), marginBottom: 16 }}>MATRIX — Formal Definition</div>
                <div style={{ ...LCARD, marginBottom: px(16) }}>
                  <p style={{ ...LBODY, fontSize: px(14), marginBottom: 14 }}>An <strong>m×n matrix</strong> A ∈ ℝᵐˣⁿ is a rectangular array of mn real numbers with m rows and n columns:</p>
                  <Formula color={CYN}>A = [aᵢⱼ], i=1..m, j=1..n</Formula>
                  <p style={{ ...LBODY, fontSize: px(13) }}>Element aᵢⱼ is at row i, column j. A vector is just a matrix with one column (m×1) or one row (1×n).</p>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: px(11), color: "#64748b", marginBottom: 6, fontWeight: 700 }}>2×2 Matrix</div>
                    <MatrixDisplay data={[[1, 2], [3, 4]]} color={CYN} />
                  </div>
                  <div>
                    <div style={{ fontSize: px(11), color: "#64748b", marginBottom: 6, fontWeight: 700 }}>3×3 Matrix</div>
                    <MatrixDisplay data={[[1, 2, 3], [4, 5, 6], [7, 8, 9]]} color={EMR} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — VECTOR REPRESENTATION ───────────────────── */}
        <div ref={R(3)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 3 · Vector Representation", IND)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Three Ways to <span style={{ color: IND }}>See a Vector</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: px(20), marginBottom: px(32) }}>
              {[
                { n: "1", t: "Arrow in Space", e: "🏹", c: IND, body: "A vector from the origin to a point. v = [3,4] is an arrow pointing to (3,4) in the plane. Length = magnitude. Direction = angle.", ex: "v = [3, 4] → point at x=3, y=4" },
                { n: "2", t: "Ordered List of Numbers", e: "📝", c: CYN, body: "Just numbers in order. v = [1, 2, 3] is a 3D vector. Order matters — [1,2,3] ≠ [3,2,1]. Each number is a coordinate along one axis.", ex: "v = [1, 2, 3] → 3 coordinates" },
                { n: "3", t: "Coordinates / Features", e: "🎯", c: EMR, body: "In ML, each number is a feature. A house described as [3, 2, 1500] might mean 3 bedrooms, 2 bathrooms, 1500 sq ft.", ex: "house = [3, 2, 1500, 2008]" },
              ].map(item => (
                <div key={item.n} style={{ ...LCARD, borderTop: `4px solid ${item.c}` }}>
                  <div style={{ fontSize: px(36), marginBottom: 10 }}>{item.e}</div>
                  <div style={{ ...LTAG(item.c), marginBottom: 10 }}>View {item.n}</div>
                  <h3 style={{ fontWeight: 800, color: item.c, fontSize: px(16), marginBottom: 10 }}>{item.t}</h3>
                  <p style={{ ...LBODY, fontSize: px(14), marginBottom: 12 }}>{item.body}</p>
                  <div style={{ background: item.c + "0d", borderRadius: 8, padding: "8px 12px", fontFamily: "monospace", fontSize: px(12), color: item.c, fontWeight: 700 }}>{item.ex}</div>
                </div>
              ))}
            </div>
            <div style={{ ...LCARD, background: IND + "04" }}>
              <div style={{ fontWeight: 700, color: IND, marginBottom: 12, fontSize: px(15) }}>📐 Dimensions Explained</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[["1D", "[5]", "Single number (scalar)", IND], ["2D", "[3, 4]", "Point on a plane (x, y)", CYN], ["3D", "[1, 2, 3]", "Point in space (x, y, z)", EMR], ["nD", "[x₁…xₙ]", "Any n features (AI data)", AMB]].map(([d, ex, desc, c]) => (
                  <div key={d} style={{ background: c + "0d", border: `1px solid ${c}33`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontWeight: 900, color: c, fontSize: px(20), marginBottom: 4 }}>{d}</div>
                    <div style={{ fontFamily: "monospace", color: c, fontSize: px(13), marginBottom: 6 }}>{ex}</div>
                    <div style={{ ...LBODY, fontSize: px(12) }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — VECTOR OPERATIONS ───────────────────────── */}
        <div ref={R(4)} style={{ background: "#06040f" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 4 · Vector Operations", "#818cf8")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(16) }}>What You Can <span style={{ color: "#818cf8" }}>Do With Vectors</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(20), marginBottom: px(28) }}>
              {[
                { t: "Vector Addition", formula: "v + w = [v₁+w₁, v₂+w₂]", ex: "[3,4] + [1,2] = [4,6]", c: IND, desc: "Add corresponding elements. In AI: combining feature sets." },
                { t: "Vector Subtraction", formula: "v − w = [v₁−w₁, v₂−w₂]", ex: "[3,4] − [1,2] = [2,2]", c: CYN, desc: "Subtract element-wise. Used to compute error: actual − predicted." },
                { t: "Scalar Multiplication", formula: "cv = [cv₁, cv₂, …, cvₙ]", ex: "2 × [3,4] = [6,8]", c: EMR, desc: "Multiply every element by a scalar c. Scales the vector's magnitude." },
                { t: "Magnitude (Length)", formula: "||v|| = √(v₁² + v₂² + … + vₙ²)", ex: "||[3,4]|| = √(9+16) = 5", c: AMB, desc: "The length of the vector (Pythagorean theorem in n dimensions)." },
              ].map(op => (
                <div key={op.t} style={{ background: op.c + "0d", border: `1px solid ${op.c}33`, borderRadius: px(16), padding: "20px 24px" }}>
                  <div style={{ fontWeight: 800, color: op.c, fontSize: px(15), marginBottom: 8 }}>{op.t}</div>
                  <div style={{ fontFamily: "monospace", background: op.c + "15", borderRadius: 8, padding: "8px 14px", fontSize: px(13), color: op.c, fontWeight: 700, marginBottom: 10 }}>{op.formula}</div>
                  <div style={{ fontFamily: "monospace", fontSize: px(13), color: "#94a3b8", marginBottom: 8 }}>Example: {op.ex}</div>
                  <p style={{ ...LBODY, fontSize: px(13), margin: 0, color: "#64748b" }}>{op.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#1e1b4b", border: "1px solid #4f46e533", borderRadius: px(16), padding: "20px 24px", marginBottom: px(20) }}>
              <div style={{ fontWeight: 700, color: "#818cf8", marginBottom: 10, fontSize: px(14) }}>🎯 Unit Vector — Normalisation</div>
              <p style={{ ...LBODY, color: "#94a3b8", marginBottom: 10, fontSize: px(14) }}>A unit vector v̂ has magnitude exactly 1. You get it by dividing v by its magnitude. It preserves direction but strips the scale.</p>
              <div style={{ fontFamily: "monospace", background: "#4f46e520", borderRadius: 8, padding: "10px 16px", color: "#818cf8", fontSize: px(15), fontWeight: 700, textAlign: "center" }}>v̂ = v / ||v|| &nbsp;&nbsp;→ &nbsp;&nbsp;||v̂|| = 1</div>
              <p style={{ ...LBODY, color: "#64748b", fontSize: px(13), marginTop: 8 }}>Example: v = [3,4] → ||v|| = 5 → v̂ = [0.6, 0.8] &nbsp;→&nbsp; check: √(0.36 + 0.64) = √1 = 1 ✓</p>
            </div>
            <VectorOpsDemo />
          </div>
        </div>

        {/* ── SECTION 6 — MATRIX BASICS ────────────────────────────── */}
        <div ref={R(5)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 5 · Matrix Basics", CYN)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Matrices — <span style={{ color: CYN }}>Grids of Numbers</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: px(32), alignItems: "start", marginBottom: px(28) }}>
              <div>
                <p style={{ ...LBODY, fontSize: px(15), marginBottom: 14 }}>A matrix is simply a rectangular arrangement of numbers in rows and columns. You already use matrices every day without knowing it — every photo, every spreadsheet, every table of data is a matrix.</p>
                <Step n="1" label="Rows — horizontal" color={CYN}>Each horizontal line is a row. The matrix below has 2 rows. In ML, each row typically represents one data sample.</Step>
                <Step n="2" label="Columns — vertical" color={IND}>Each vertical line is a column. Columns represent features or dimensions of the data.</Step>
                <Step n="3" label="Dimensions m×n" color={EMR}>An m×n matrix has m rows and n columns. Always state rows first! A 3×4 matrix has 3 rows, 4 columns.</Step>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: px(20) }}>
                {[
                  { label: "2×2 Matrix", data: [[1, 2], [3, 4]], color: CYN, note: "2 rows × 2 cols = 4 elements" },
                  { label: "3×3 Matrix (Identity)", data: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], color: IND, note: "Diagonal 1s — the 'do nothing' matrix" },
                  { label: "2×3 Matrix", data: [[2, 4, 6], [1, 3, 5]], color: EMR, note: "2 rows × 3 cols — rectangular" },
                ].map(m => (
                  <div key={m.label} style={{ ...LCARD }}>
                    <div style={{ fontWeight: 700, color: m.color, fontSize: px(13), marginBottom: 12 }}>{m.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <MatrixDisplay data={m.data} color={m.color} />
                      <p style={{ ...LBODY, fontSize: px(13), margin: 0 }}>{m.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — MATRIX OPERATIONS ────────────────────────── */}
        <div ref={R(6)} style={{ background: "#06040f" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 6 · Matrix Operations", CYN)}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(16) }}>Operating on <span style={{ color: "#67e8f9" }}>Matrices</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(20), marginBottom: px(28) }}>
              {[
                { t: "Addition A + B", rule: "Same dimensions required", formula: "(A+B)ᵢⱼ = aᵢⱼ + bᵢⱼ", c: IND, note: "Add element by element. Dimensions must match exactly." },
                { t: "Subtraction A − B", rule: "Same dimensions required", formula: "(A−B)ᵢⱼ = aᵢⱼ − bᵢⱼ", c: CYN, note: "Subtract element by element. Used in gradient computation." },
                { t: "Scalar Multiplication cA", rule: "Always works", formula: "(cA)ᵢⱼ = c · aᵢⱼ", c: EMR, note: "Multiply every element by scalar c. Scales the whole matrix." },
                { t: "Matrix Multiplication A×B", rule: "A is m×k, B must be k×n → result is m×n", formula: "(AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ", c: AMB, note: "Row of A dotted with column of B. The core operation in neural networks!" },
              ].map(op => (
                <div key={op.t} style={{ background: op.c + "0d", border: `1px solid ${op.c}33`, borderRadius: px(16), padding: "18px 22px" }}>
                  <div style={{ fontWeight: 800, color: op.c, fontSize: px(14), marginBottom: 6 }}>{op.t}</div>
                  <div style={{ background: op.c + "18", borderRadius: 6, padding: "4px 10px", display: "inline-block", fontSize: px(11), color: op.c, fontWeight: 700, marginBottom: 8 }}>{op.rule}</div>
                  <div style={{ fontFamily: "monospace", background: "#1e1b4b", borderRadius: 8, padding: "8px 12px", fontSize: px(13), color: op.c, fontWeight: 700, marginBottom: 8 }}>{op.formula}</div>
                  <p style={{ ...LBODY, fontSize: px(13), margin: 0, color: "#64748b" }}>{op.note}</p>
                </div>
              ))}
            </div>
            <MatrixOpsDemo />
          </div>
        </div>

        {/* ── SECTION 8 — WHY IT MATTERS IN AI ────────────────────── */}
        <div ref={R(7)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 7 · Why It Matters in AI", IND)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Why AI <span style={{ color: IND }}>Needs Vectors & Matrices</span></h2>
            <p style={{ ...LBODY, maxWidth: px(680), marginBottom: px(32) }}>Every single operation in a neural network — from the first layer to the last — is matrix multiplication. Without understanding matrices, you cannot understand how AI learns.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: px(18) }}>
              {[
                { e: "📊", t: "Data Representation", c: IND, b: "A dataset with 1000 samples and 10 features is stored as a 1000×10 matrix. Every training batch is a matrix." },
                { e: "🧠", t: "Neural Networks", c: CYN, b: "Layer weights are matrices. Forward pass = input vector × weight matrix. The entire network is stacked matrix multiplications." },
                { e: "🖼️", t: "Image Data", c: EMR, b: "A 28×28 pixel image = a 28×28 matrix of pixel values. A colour image is three stacked matrices (R, G, B channels)." },
                { e: "💬", t: "Word Embeddings", c: AMB, b: "Each word is a vector (e.g. 300 numbers). A sentence of 10 words becomes a 10×300 matrix. Math now works on language." },
                { e: "🔄", t: "Transformations", c: IND, b: "Rotation, scaling, and projection are all matrix operations. Computer graphics and robotics are entirely matrix math." },
                { e: "📈", t: "Gradient Descent", c: CYN, b: "The weight update step is: W = W − α × gradient. The gradient is a matrix (Jacobian). Learning = matrix subtraction." },
              ].map(c => (
                <div key={c.t} style={{ ...LCARD, borderTop: `3px solid ${c.c}` }}>
                  <div style={{ fontSize: px(36), marginBottom: 8 }}>{c.e}</div>
                  <div style={{ fontWeight: 700, color: c.c, fontSize: px(14), marginBottom: 8 }}>{c.t}</div>
                  <p style={{ ...LBODY, fontSize: px(13), margin: 0 }}>{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 9 — REAL AI EXAMPLES ─────────────────────────── */}
        <div ref={R(8)} style={{ background: "#06040f" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 8 · Real AI Examples", "#818cf8")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(28) }}>Seeing It In <span style={{ color: "#818cf8" }}>Real Systems</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
              {/* Image as matrix */}
              <div style={{ ...LCARD, background: "#0d0a2a", border: `1px solid ${IND}33` }}>
                <div style={{ ...LTAG(IND), marginBottom: 14 }}>🖼️ Images as Matrices</div>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14), marginBottom: 16 }}>A greyscale image is literally a matrix where each number is a pixel brightness (0=black, 255=white). Your 12MP phone camera creates a 3000×4000 matrix every photo.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 14 }}>
                  {[[230, 245, 255, 240, 225], [180, 210, 250, 215, 185], [120, 160, 200, 165, 125], [180, 210, 250, 215, 185], [230, 245, 255, 240, 225]].map((row, ri) => (
                    <div key={ri} style={{ display: "flex", gap: 3 }}>
                      {row.map((v, ci) => (
                        <div key={ci} style={{ width: 38, height: 28, borderRadius: 4, background: `rgb(${v},${v},${v})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(8), color: v < 128 ? "#fff" : "#000", fontWeight: 700 }}>{v}</div>
                      ))}
                    </div>
                  ))}
                </div>
                <p style={{ ...LBODY, color: "#64748b", fontSize: px(13) }}>↑ This IS an image! CNN reads exactly this matrix to recognise faces, objects, and text.</p>
              </div>
              {/* Sentence as vectors */}
              <div style={{ ...LCARD, background: "#0d0a2a", border: `1px solid ${CYN}33` }}>
                <div style={{ ...LTAG(CYN), marginBottom: 14 }}>💬 Words as Vectors (Embeddings)</div>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14), marginBottom: 16 }}>Words that mean similar things get similar vectors. The famous Word2Vec example: King − Man + Woman ≈ Queen. Math works on meaning!</p>
                {[["king", [0.9, 0.2, 0.8, 0.1], IND], ["queen", [0.85, 0.75, 0.79, 0.15], "#818cf8"], ["man", [0.8, 0.1, 0.5, 0.05], CYN], ["woman", [0.75, 0.7, 0.48, 0.08], "#67e8f9"]].map(([word, emb, c]) => (
                  <div key={word} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ minWidth: 56, fontFamily: "monospace", fontWeight: 700, color: c, fontSize: px(13) }}>"{word}"</div>
                    <div style={{ flex: 1, display: "flex", gap: 3 }}>
                      {emb.map((v, i) => <div key={i} style={{ flex: 1, height: 24, borderRadius: 4, background: c + "22", position: "relative", overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${v * 100}%`, background: c + "88", transition: "width 0.5s" }} /></div>)}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: px(10), color: "#64748b", minWidth: 100 }}>[{emb.join(", ")}…]</div>
                  </div>
                ))}
                <p style={{ ...LBODY, color: "#64748b", fontSize: px(13), marginTop: 8 }}>GPT-4 represents each word token as a vector of ~12,288 numbers. The full context window is a matrix of 128,000 × 12,288!</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 10 — MINI GAME ────────────────────────────────── */}
        <div ref={R(9)} style={{ background: V.cream }}>
          <div style={{ ...LSEC }}>
            {STag("Section 10 · Mini Game", IND)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Learn by Playing — <span style={{ color: IND }}>Vector Movement</span></h2>
            <p style={{ ...LBODY, maxWidth: px(660), marginBottom: px(28) }}>Every button applies a <strong>displacement vector</strong> to the robot's position: new_pos = old_pos + direction_vector. This is the same math used in gradient descent, robot motion, and physics engines.</p>
            <VectorMovementGame />
          </div>
        </div>

        {/* ── SECTION 11 — KEY INSIGHTS ─────────────────────────────── */}
        <div ref={R(10)} style={{ background: V.paper }}>
          <VectorTakeaways onBack={onBack} />
        </div>
      </>
    )}
  </NavPage>
);

export default VectorsAndMatricesPage;
