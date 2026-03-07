import { useCallback, useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — DIFFUSION MODELS
   Level 5 · Modern AI Systems · Lesson 5 of 5
   Accent: Orange #f97316
══════════════════════════════════════════════════════════════════ */
const ORG  = "#f97316";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const PNK  = "#ec4899";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const GRN  = "#059669";
const CYN  = "#0891b2";
const TEAL = "#0d9488";
const EMR  = "#10b981";

const Formula = ({ children, color = ORG }) => (
  <div style={{
    background: color + "0d", border: `1px solid ${color}44`, borderRadius: 14,
    padding: "18px 24px", fontFamily: "monospace", fontSize: px(15), color, fontWeight: 700,
    textAlign: "center", margin: `${px(14)} 0`
  }}>{children}</div>
);

const CodeBox = ({ lines, color = ORG, bg = "#100a00" }) => (
  <div style={{
    fontFamily: "monospace", background: bg, borderRadius: 10,
    padding: "14px 18px", fontSize: px(13), lineHeight: 1.9
  }}>
    {lines.map((l, i) => (
      <div key={i} style={{
        color: (l.startsWith("#") || l.startsWith("from") || l.startsWith("import"))
          ? "#475569" : color
      }}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — noise → image ═════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    // denoising frames — pre-generate pixel patches
    const FRAMES = 60;
    const PW = 80, PH = 80;
    const frames = [];
    for (let f = 0; f < FRAMES; f++) {
      const frac = f / (FRAMES - 1); // 0=noise, 1=clear
      const imgData = new ImageData(PW, PH);
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          const i = (y * PW + x) * 4;
          // target: concentric gradient pattern (simulated image)
          const cx = x - PW / 2, cy = y - PH / 2;
          const r = Math.sqrt(cx * cx + cy * cy);
          const baseR = 200 + 55 * Math.sin(r * 0.2);
          const baseG = 120 + 80 * Math.cos(r * 0.25 + 1);
          const baseB = 80 + 60 * Math.sin(r * 0.18 + 2);
          // noise
          const noise = (Math.random() - 0.5) * 255 * (1 - frac) * 2;
          imgData.data[i] = Math.min(255, Math.max(0, baseR * frac + 128 + noise));
          imgData.data[i + 1] = Math.min(255, Math.max(0, baseG * frac + 128 * (1 - frac) + noise * 0.8));
          imgData.data[i + 2] = Math.min(255, Math.max(0, baseB * frac + 128 * (1 - frac) + noise * 0.6));
          imgData.data[i + 3] = 255;
        }
      }
      frames.push(imgData);
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#100a00"; ctx.fillRect(0, 0, W, H);
      // grid
      ctx.strokeStyle = "rgba(249,115,22,0.04)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      // multiple denoising steps shown side by side
      const steps = [0, 15, 30, 45, 59];
      const SCALE = 3;
      steps.forEach((f, si) => {
        const offX = W * 0.08 + si * (PW * SCALE + 20);
        const offY = H / 2 - (PH * SCALE) / 2;
        // draw noise frame
        const fc = Math.min(FRAMES - 1, Math.floor(((Math.sin(t * 0.4) + 1) / 2 * FRAMES + f) % FRAMES));
        const frameData = frames[f];
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = PW; tmpCanvas.height = PH;
        const tc = tmpCanvas.getContext("2d");
        tc.putImageData(frameData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmpCanvas, offX, offY, PW * SCALE, PH * SCALE);
        // border
        const prog = f / 59;
        ctx.strokeStyle = `rgba(249,115,22,${0.3 + prog * 0.7})`; ctx.lineWidth = 2;
        ctx.strokeRect(offX, offY, PW * SCALE, PH * SCALE);
        // label
        ctx.font = `bold ${px(9)} monospace`; ctx.textAlign = "center";
        ctx.fillStyle = ORG + Math.round((0.3 + prog * 0.7) * 255).toString(16).padStart(2, "0");
        ctx.fillText(`t=${1000 - f * 17}`, offX + PW * SCALE / 2, offY + PH * SCALE + 14);
        // arrow
        if (si < steps.length - 1) {
          const ax = offX + PW * SCALE + 8, ay = offY + (PH * SCALE) / 2;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 12, ay);
          ctx.strokeStyle = ORG + "88"; ctx.lineWidth = 1.5; ctx.stroke();
          ctx.beginPath(); ctx.moveTo(ax + 12, ay); ctx.lineTo(ax + 7, ay - 4); ctx.lineTo(ax + 7, ay + 4);
          ctx.fillStyle = ORG + "88"; ctx.fill();
        }
      });

      // labels
      ctx.font = `bold ${px(11)} sans-serif`; ctx.textAlign = "center";
      ctx.fillStyle = "#475569"; ctx.fillText("← Pure Noise", W * 0.13, H * 0.88);
      ctx.fillStyle = ORG; ctx.fillText("Generated Image →", W * 0.82, H * 0.88);
      ctx.font = `${px(10)} sans-serif`; ctx.fillStyle = "#475569";
      ctx.fillText("Reverse Diffusion: denoising step-by-step", W / 2, H * 0.95);

      t += 0.02; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
};

/* ══════ FORWARD DIFFUSION DEMO ══════════════════════════════════ */
const ForwardDiffusionDemo = () => {
  const [T, setT] = useState(0);
  const [beta, setBeta] = useState(0.015);
  const canvasRef = useRef();
  const animRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const TOTAL = 100;

  const drawFrame = useCallback((tStep) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const PW = Math.min(200, W * 0.35), PH = PW;
    const offX = W / 2 - PW / 2, offY = H / 2 - PH / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#1a0800"; ctx.fillRect(0, 0, W, H);

    // compute alpha bar = product of (1-beta) up to t
    const alphaBar = Math.pow(1 - beta, tStep);
    const noiseLevel = 1 - alphaBar;

    // draw image with progressive noise overlay
    const imgData = new ImageData(Math.round(PW), Math.round(PH));
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const i = (Math.floor(y) * Math.round(PW) + Math.floor(x)) * 4;
        const cx = x / PW - 0.5, cy = y / PH - 0.5;
        // target image: concentric rings
        const r = Math.sqrt(cx * cx + cy * cy);
        const baseR = 230 + 25 * Math.sin(r * 18);
        const baseG = 160 + 50 * Math.cos(r * 22 + 1);
        const baseB = 60 + 40 * Math.sin(r * 14 + 2);
        // Gaussian noise
        const u1 = Math.random(), u2 = Math.random();
        const noise = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2) * 128;
        imgData.data[i] = Math.min(255, Math.max(0, baseR * alphaBar + 128 + noise * noiseLevel));
        imgData.data[i + 1] = Math.min(255, Math.max(0, baseG * alphaBar + 128 * noiseLevel + noise * 0.8 * noiseLevel));
        imgData.data[i + 2] = Math.min(255, Math.max(0, baseB * alphaBar + 128 * noiseLevel + noise * 0.6 * noiseLevel));
        imgData.data[i + 3] = 255;
      }
    }
    const tmp = document.createElement("canvas");
    tmp.width = Math.round(PW); tmp.height = Math.round(PH);
    tmp.getContext("2d").putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, offX, offY, PW, PH);

    // border
    ctx.strokeStyle = ORG + "88"; ctx.lineWidth = 2;
    ctx.strokeRect(offX, offY, PW, PH);

    // noise meter
    const meterX = offX + PW + 20, meterH = PH;
    ctx.fillStyle = "#1e0f00"; ctx.fillRect(meterX, offY, 20, meterH);
    ctx.fillStyle = `rgba(249,115,22,${0.3 + noiseLevel * 0.7})`;
    ctx.fillRect(meterX, offY + meterH * (1 - noiseLevel), 20, meterH * noiseLevel);
    ctx.strokeStyle = ORG + "66"; ctx.lineWidth = 1; ctx.strokeRect(meterX, offY, 20, meterH);
    ctx.font = `${px(9)} monospace`; ctx.fillStyle = ORG; ctx.textAlign = "center";
    ctx.fillText("noise", meterX + 10, offY + meterH + 14);

    // SNR indicator
    const snr = (1 - noiseLevel) / (noiseLevel + 0.01);
    ctx.font = `bold ${px(10)} monospace`; ctx.fillStyle = "#94a3b8"; ctx.textAlign = "left";
    ctx.fillText(`t = ${tStep}  /  T = ${TOTAL}`, offX, offY - 16);
    ctx.fillText(`αᵦₐᵣ(t) = ${alphaBar.toFixed(4)}`, offX + 140, offY - 16);
    ctx.fillText(`noise = ${(noiseLevel * 100).toFixed(1)}%`, offX, offY + PH + 14);
    ctx.fillText(`SNR = ${snr.toFixed(3)}`, offX + 120, offY + PH + 14);

    // beta schedule visualization
    const bsX = offX, bsY = offY - 50, bsW = PW, bsH = 30;
    ctx.fillStyle = "#1e0f00"; ctx.fillRect(bsX, bsY, bsW, bsH);
    for (let i = 0; i <= TOTAL; i++) {
      const bx = bsX + (i / TOTAL) * bsW;
      const bt = beta * (0.5 + i / TOTAL * 1.5); // linear schedule
      const bh = bt * bsH * 30;
      ctx.fillStyle = i <= tStep ? ORG + "cc" : ORG + "22";
      ctx.fillRect(bx, bsY + bsH - bh, bsW / TOTAL + 1, bh);
    }
    ctx.font = `${px(8)} monospace`; ctx.fillStyle = "#475569"; ctx.textAlign = "left";
    ctx.fillText("β schedule (linear)", bsX, bsY - 4);
  }, [beta, T]);

  useEffect(() => { drawFrame(T); }, [T, beta, drawFrame]);

  const play = () => {
    if (playing) return;
    setPlaying(true); let tt = 0;
    animRef.current = setInterval(() => {
      tt++; setT(tt); drawFrame(tt);
      if (tt >= TOTAL) { clearInterval(animRef.current); setPlaying(false); tt = 0; }
    }, 60);
  };
  useEffect(() => () => clearInterval(animRef.current), []);

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(15) }}>
        🌫️ Forward Diffusion Process — Watching Noise Accumulate
      </div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: 14 }}>
        In training, noise is <em>added</em> to images step-by-step. At <strong>t=0</strong>: the original clean image.
        At <strong>t=T</strong>: pure Gaussian noise. The model learns the <em>reverse</em> — to undo this process.
      </p>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 14, display: "block", border: `2px solid ${ORG}22`, marginBottom: 14 }} />
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: px(11), marginBottom: 3 }}>
            <span style={{ color: V.muted, fontWeight: 700 }}>Timestep t</span>
            <span style={{ fontFamily: "monospace", color: ORG, fontWeight: 700 }}>{T} / {TOTAL}</span>
          </div>
          <input type="range" min={0} max={TOTAL} step={1} value={T}
            onChange={e => { clearInterval(animRef.current); setPlaying(false); setT(+e.target.value); }}
            style={{ width: "100%", accentColor: ORG }} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: px(11), marginBottom: 3 }}>
            <span style={{ color: V.muted, fontWeight: 700 }}>β (noise per step)</span>
            <span style={{ fontFamily: "monospace", color: AMB, fontWeight: 700 }}>{beta.toFixed(3)}</span>
          </div>
          <input type="range" min={0.005} max={0.05} step={0.005} value={beta}
            onChange={e => setBeta(+e.target.value)} style={{ width: "100%", accentColor: AMB }} />
        </div>
        <button onClick={play} disabled={playing}
          style={{
            background: ORG, border: "none", borderRadius: 10, padding: "9px 20px",
            color: "#fff", fontWeight: 800, cursor: "pointer", opacity: playing ? 0.6 : 1, fontSize: px(12)
          }}>
          {playing ? "Running..." : "▶ Animate"}
        </button>
        <button onClick={() => { clearInterval(animRef.current); setPlaying(false); setT(0); }}
          style={{
            background: "transparent", border: `1px solid ${V.border}`, borderRadius: 10,
            padding: "9px 16px", color: V.muted, fontWeight: 700, cursor: "pointer", fontSize: px(12)
          }}>↺ Reset</button>
      </div>
    </div>
  );
};

/* ══════ UNET ARCHITECTURE VIZ ════════════════════════════════════ */
const UNetViz = () => {
  const [hover, setHover] = useState(null);
  const BLOCKS = [
    { id: "input", label: "Noisy x_t", sub: "64×64×3", c: ORG, tier: 0, col: 0, desc: "The noisy image at timestep t, plus optional conditioning (text embedding, class label). Input to the encoder path." },
    { id: "time", label: "Time embed", sub: "t → 256d", c: AMB, tier: 0, col: 1, desc: "Sinusoidal encoding of timestep t (like positional encoding). Injected via AdaLayerNorm or additive into every ResNet block. Tells the model 'how much noise to expect to remove at this step'." },
    { id: "enc1", label: "ResBlock×2", sub: "64×64×64", c: VIO, tier: 1, col: 0, desc: "Two ResNet blocks with GroupNorm. Maintains spatial resolution. Self-attention at 16×16 and 8×8 layers. Skip connection stores features for decoder." },
    { id: "down1", label: "Downsample", sub: "32×32×64", c: VIO, tier: 2, col: 0, desc: "Stride-2 convolution or average pooling. Halves spatial dimensions. Enables receptive field to grow and computation to decrease in deeper layers." },
    { id: "enc2", label: "ResBlock×2", sub: "32×32×128", c: IND, tier: 2, col: 1, desc: "Channels grow as spatial size shrinks. Cross-attention here if text-conditioned: each spatial position attends to text token embeddings from CLIP/T5." },
    { id: "down2", label: "Downsample", sub: "16×16×128", c: IND, tier: 3, col: 0, desc: "Further downsampling. At this resolution, attention is still computationally feasible — 16×16 = 256 tokens." },
    { id: "bottleneck", label: "Bottleneck", sub: "8×8×256", c: ROSE, tier: 4, col: 0, desc: "Deepest features. Full self-attention over 8×8=64 spatial tokens. Captures global structure and semantics. Largest receptive field. Cross-attention with full text context." },
    { id: "up2", label: "Upsample", sub: "16×16×128", c: IND, tier: 3, col: 1, desc: "Bilinear upsample or transposed convolution. Skip connection concatenated from encoder at same resolution — provides fine-grained spatial detail." },
    { id: "dec2", label: "ResBlock×2", sub: "16×16×128", c: IND, tier: 2, col: 2, desc: "Decoder ResBlocks with concatenated skip connection. Gradually reconstructs spatial detail from bottleneck features plus encoder skip features." },
    { id: "up1", label: "Upsample", sub: "32×32×64", c: VIO, tier: 2, col: 3, desc: "Restores 32×32 resolution. Note: the U-Net predicts noise ε, not the clean image directly. Loss: ||ε - ε_θ(x_t, t)||²." },
    { id: "dec1", label: "ResBlock×2", sub: "64×64×64", c: VIO, tier: 1, col: 3, desc: "Final spatial resolution. Self-attention at this level can still capture long-range dependencies at pixel level." },
    { id: "output", label: "Noise ε̂", sub: "64×64×3", c: ORG, tier: 0, col: 4, desc: "Output: predicted noise ε̂_θ(x_t, t). Training loss: ||ε - ε̂||². At inference, subtract this noise × scheduler weight to get x_{t-1}." },
  ];
  const TIER_COLORS = { 0: ORG, 1: VIO, 2: IND, 3: IND, 4: ROSE };

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(15) }}>
        🏗️ U-Net Architecture — The Denoising Network
      </div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: 16 }}>
        Stable Diffusion uses a U-Net to predict the noise in a noisy image. Hover over any block to understand its role.
        The architecture: encoder (↓) → bottleneck → decoder (↑) with skip connections at each resolution.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gridTemplateRows: "repeat(5,54px)", gap: 4 }}>
            {BLOCKS.map(b => (
              <div key={b.id}
                onMouseEnter={() => setHover(b.id)}
                onMouseLeave={() => setHover(null)}
                style={{
                  gridColumn: b.col + 1, gridRow: b.tier + 1,
                  background: hover === b.id ? b.c + "33" : b.c + "18",
                  border: `2px solid ${hover === b.id ? b.c : b.c + "44"}`,
                  borderRadius: 8, padding: "4px 6px", cursor: "default",
                  display: "flex", flexDirection: "column", justifyContent: "center",
                  transition: "all 0.15s", textAlign: "center"
                }}>
                <div style={{ fontWeight: 700, color: b.c, fontSize: px(9), lineHeight: 1.3 }}>{b.label}</div>
                <div style={{ fontFamily: "monospace", color: V.muted, fontSize: px(8) }}>{b.sub}</div>
              </div>
            ))}
            {/* Skip connection arrows */}
            {[[1, 1], [2, 2]].map(([row, col]) => (
              <div key={`skip-${row}`} style={{
                gridColumn: `${col + 1} / ${6 - col}`, gridRow: row + 1,
                border: `1px dashed ${TIER_COLORS[row]}44`, borderRadius: 6,
                pointerEvents: "none", zIndex: 0
              }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            {[["Encoder (↓)", VIO], ["Bottleneck", ROSE], ["Decoder (↑)", IND], ["I/O", ORG]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: px(10), color: V.muted }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          {hover ? (
            <div style={{ background: (BLOCKS.find(b => b.id === hover)?.c || ORG) + "0d", border: `2px solid ${(BLOCKS.find(b => b.id === hover)?.c || ORG)}33`, borderRadius: 14, padding: "16px" }}>
              <div style={{ fontWeight: 800, color: BLOCKS.find(b => b.id === hover)?.c, fontSize: px(15), marginBottom: 8 }}>
                {BLOCKS.find(b => b.id === hover)?.label}
                <span style={{ fontFamily: "monospace", fontSize: px(11), marginLeft: 8, opacity: 0.7 }}>
                  {BLOCKS.find(b => b.id === hover)?.sub}
                </span>
              </div>
              <p style={{ ...LBODY, fontSize: px(14), margin: 0 }}>{BLOCKS.find(b => b.id === hover)?.desc}</p>
            </div>
          ) : (
            <div style={{ background: ORG + "0d", border: `2px solid ${ORG}22`, borderRadius: 14, padding: "16px", textAlign: "center", color: V.muted, fontSize: px(13) }}>
              <div style={{ fontSize: px(32), marginBottom: 8 }}>👆</div>
              Hover over any block to see its role in the denoising process
            </div>
          )}
          <IBox color={ORG} title="Why U-Net? The skip connection insight"
            body="The encoder captures increasingly abstract features (edges → textures → objects → global composition). The decoder needs both high-level semantics (to know what to draw) AND low-level details (to know where to draw fine textures). Skip connections pipe encoder features directly to corresponding decoder layers — the bottleneck provides semantics, the skips provide spatial precision." />
          <div style={{ ...LCARD, marginTop: 10, background: ORG + "0d", border: `1px solid ${ORG}22` }}>
            <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(12) }}>Attention in the U-Net</div>
            <p style={{ ...LBODY, fontSize: px(12), margin: 0 }}>
              Self-attention is added at 16×16 and 8×8 spatial resolutions. For text-conditioned models,
              cross-attention is added in every ResBlock: spatial queries attend to text token keys/values.
              This is how "a photorealistic image of a cat in the style of Van Gogh" steers generation —
              each spatial patch attends to all text tokens to extract what to paint where.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ NOISE-TO-IMAGE ANIMATION ════════════════════════════════ */
const NoiseToImageGame = () => {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [prompt, setPrompt] = useState("sunset over mountains");
  const canvasRef = useRef();
  const animRef = useRef(null);
  const TOTAL = 50;

  const PROMPTS = [
    { p: "sunset over mountains", rPalette: [[220, 90, 40], [180, 60, 80], [100, 40, 120]] },
    { p: "deep ocean with bioluminescent fish", rPalette: [[0, 40, 120], [0, 120, 180], [80, 200, 220]] },
    { p: "enchanted forest at night", rPalette: [[20, 60, 20], [40, 100, 40], [80, 160, 60]] },
    { p: "futuristic city neon lights", rPalette: [[20, 0, 60], [180, 0, 160], [0, 200, 240]] },
  ];

  const getCurrentPalette = () => PROMPTS.find(p => p.p === prompt)?.rPalette || PROMPTS[0].rPalette;

  const drawStep = useCallback((s) => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const PW = Math.min(240, W * 0.45), PH = PW * 0.65;
    const offX = W / 2 - PW / 2, offY = H / 2 - PH / 2 - 20;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#100a00"; ctx.fillRect(0, 0, W, H);

    const frac = s / TOTAL; // 0=pure noise, 1=clear image
    const palette = getCurrentPalette();

    const imgData = new ImageData(Math.round(PW), Math.round(PH));
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const idx = (Math.floor(y) * Math.round(PW) + Math.floor(x)) * 4;
        // target: gradient landscape based on prompt palette
        const gradY = y / PH;
        const bandN = Math.floor(gradY * palette.length);
        const [tR, tG, tB] = palette[Math.min(bandN, palette.length - 1)];
        const wavelet = Math.sin(x * 0.15 + y * 0.08 + frac * 10) * 20 * frac;
        // noise decreases as s increases (reverse diffusion)
        const noiseAmp = 255 * (1 - frac) * 2.2;
        const u1 = Math.random(), u2 = Math.random();
        const noise = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
        imgData.data[idx] = Math.min(255, Math.max(0, tR * frac + 128 * (1 - frac) + noise * noiseAmp + wavelet));
        imgData.data[idx + 1] = Math.min(255, Math.max(0, tG * frac + 128 * (1 - frac) + noise * noiseAmp * 0.85 + wavelet));
        imgData.data[idx + 2] = Math.min(255, Math.max(0, tB * frac + 128 * (1 - frac) + noise * noiseAmp * 0.7 + wavelet));
        imgData.data[idx + 3] = 255;
      }
    }
    const tmp = document.createElement("canvas");
    tmp.width = Math.round(PW); tmp.height = Math.round(PH);
    tmp.getContext("2d").putImageData(imgData, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tmp, offX, offY, PW, PH);
    ctx.strokeStyle = ORG + "88"; ctx.lineWidth = 2; ctx.strokeRect(offX, offY, PW, PH);

    // progress bar
    const pbY = offY + PH + 16;
    ctx.fillStyle = "#1e0f00"; ctx.fillRect(offX, pbY, PW, 8);
    const g = ctx.createLinearGradient(offX, 0, offX + PW, 0);
    g.addColorStop(0, ROSE); g.addColorStop(0.5, AMB); g.addColorStop(1, ORG);
    ctx.fillStyle = g; ctx.fillRect(offX, pbY, PW * frac, 8);
    ctx.strokeStyle = ORG + "44"; ctx.lineWidth = 1; ctx.strokeRect(offX, pbY, PW, 8);

    // labels
    ctx.font = `bold ${px(10)} monospace`; ctx.textAlign = "left";
    ctx.fillStyle = "#94a3b8"; ctx.fillText(`Step: ${TOTAL - s} → ${TOTAL - s === 0 ? "clean" : "noisy"}  t=${1000 - Math.floor(s * 20)}`, offX, offY - 14);
    ctx.textAlign = "right"; ctx.fillStyle = ORG;
    ctx.fillText(`${Math.round(frac * 100)}% denoised`, offX + PW, offY - 14);
    ctx.font = `${px(9)} sans-serif`; ctx.fillStyle = "#475569"; ctx.textAlign = "center";
    ctx.fillText(`"${prompt}"`, W / 2, pbY + 22);
  }, [prompt]);

  useEffect(() => { drawStep(step); }, [step, prompt, drawStep]);

  const play = () => {
    if (playing) return;
    setPlaying(true); setStep(0); let ss = 0;
    animRef.current = setInterval(() => {
      ss++; setStep(ss); drawStep(ss);
      if (ss >= TOTAL) { clearInterval(animRef.current); setPlaying(false); }
    }, 60);
  };
  useEffect(() => () => clearInterval(animRef.current), []);

  return (
    <div style={{ ...LCARD, background: "#100a00", border: `2px solid ${ORG}22` }}>
      <div style={{ fontWeight: 800, color: ORG, fontSize: px(16), marginBottom: 8 }}>
        🎮 Noise to Image — Watch Stable Diffusion Denoise
      </div>
      <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(13), marginBottom: 16 }}>
        Observe the reverse diffusion process: starting from pure Gaussian noise,
        the model removes noise step-by-step guided by the text prompt. Each colour palette
        is steered by different prompts via cross-attention.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {PROMPTS.map(pp => (
          <button key={pp.p} onClick={() => { setPrompt(pp.p); clearInterval(animRef.current); setPlaying(false); setStep(0); }}
            style={{
              background: prompt === pp.p ? ORG : ORG + "0d",
              border: `2px solid ${prompt === pp.p ? ORG : ORG + "33"}`,
              borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontWeight: 700,
              fontSize: px(10), color: prompt === pp.p ? "#fff" : ORG
            }}>{pp.p}</button>
        ))}
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 14, display: "block", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="range" min={0} max={TOTAL} step={1} value={step}
          onChange={e => { clearInterval(animRef.current); setPlaying(false); setStep(+e.target.value); }}
          style={{ flex: 1, accentColor: ORG }} />
        <button onClick={play} disabled={playing}
          style={{
            background: ORG, border: "none", borderRadius: 10, padding: "8px 18px",
            color: "#fff", fontWeight: 800, cursor: "pointer", opacity: playing ? 0.6 : 1, fontSize: px(12)
          }}>
          {playing ? "Denoising..." : "▶ Reverse Diffuse"}
        </button>
        <button onClick={() => { clearInterval(animRef.current); setPlaying(false); setStep(0); }}
          style={{ background: "transparent", border: `1px solid ${ORG}44`, borderRadius: 10, padding: "8px 14px", color: ORG, fontWeight: 700, cursor: "pointer", fontSize: px(12) }}>
          ↺
        </button>
      </div>
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Denoising steps", val: "50 (DDIM) / 1000 (DDPM)", c: ORG },
          { label: "Noise predictor", val: "U-Net (860M params)", c: AMB },
          { label: "Guidance scale", val: "7.5 (text influence)", c: VIO },
        ].map(item => (
          <div key={item.label} style={{ background: item.c + "0d", border: `1px solid ${item.c}22`, borderRadius: 8, padding: "8px", textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontWeight: 700, color: item.c, fontSize: px(11) }}>{item.val}</div>
            <div style={{ fontSize: px(9), color: "#475569", marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════ CLASSIFIER-FREE GUIDANCE DEMO ══════════════════════════ */
const CFGDemo = () => {
  const [guidance, setGuidance] = useState(7.5);
  const [steps, setSteps] = useState(30);
  const [sampler, setSampler] = useState("DDIM");

  const SAMPLERS = {
    DDPM: { steps: "1000+", speed: "⭐", quality: "⭐⭐⭐⭐⭐", desc: "Original formulation. Denoises 1000 steps one by one. Slow but theoretically clean." },
    DDIM: { steps: "20-100", speed: "⭐⭐⭐⭐", quality: "⭐⭐⭐⭐", desc: "Non-Markovian acceleration. Same final quality in 50 steps as DDPM in 1000. The standard." },
    PLMS: { steps: "20-50", speed: "⭐⭐⭐⭐", quality: "⭐⭐⭐⭐", desc: "Pseudo Linear Multi-Step. Slightly better than DDIM for the same step count." },
    "DPM++": { steps: "15-30", speed: "⭐⭐⭐⭐⭐", quality: "⭐⭐⭐⭐⭐", desc: "DPM-Solver++. Best quality/speed trade-off. 15-20 steps approach 1000-step DDPM quality." },
    LCM: { steps: "4-8", speed: "⭐⭐⭐⭐⭐⭐", quality: "⭐⭐⭐", desc: "Latent Consistency Model. Distilled to run in 4 steps. Real-time generation on consumer GPU." },
  };

  const getQualityScore = () => {
    const s = SAMPLERS[sampler];
    let q = s.quality.length / 2; // rough stars count
    q *= (0.6 + (guidance / 20) * 0.4);
    q *= (0.5 + (steps / 100) * 0.5);
    return Math.min(100, Math.round(q * 15));
  };

  const getDiversityScore = () => {
    return Math.max(5, Math.round(100 - guidance * 6 - steps * 0.3));
  };

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(15) }}>
        🎛️ Sampling Configuration — Guidance Scale & Schedulers
      </div>
      <p style={{ ...LBODY, fontSize: px(13), marginBottom: 16 }}>
        Classifier-Free Guidance (CFG) controls how strongly the text prompt steers generation.
        The sampler controls how noise is removed at each step. These are the key inference hyperparameters.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: px(12) }}>
              <span style={{ fontWeight: 700, color: V.muted }}>Guidance Scale (CFG)</span>
              <span style={{ fontFamily: "monospace", color: ORG, fontWeight: 700 }}>{guidance.toFixed(1)}</span>
            </div>
            <input type="range" min={1} max={20} step={0.5} value={guidance}
              onChange={e => setGuidance(+e.target.value)} style={{ width: "100%", accentColor: ORG }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: px(10), color: V.muted, marginTop: 2 }}>
              <span>1.0 — ignore prompt (pure noise)</span>
              <span>20 — maximal prompt adherence</span>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: px(12) }}>
              <span style={{ fontWeight: 700, color: V.muted }}>Inference steps</span>
              <span style={{ fontFamily: "monospace", color: AMB, fontWeight: 700 }}>{steps}</span>
            </div>
            <input type="range" min={4} max={100} step={2} value={steps}
              onChange={e => setSteps(+e.target.value)} style={{ width: "100%", accentColor: AMB }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: px(12), fontWeight: 700, color: V.muted, marginBottom: 8 }}>Sampler</div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Object.keys(SAMPLERS).map(s => (
                <button key={s} onClick={() => setSampler(s)}
                  style={{
                    background: sampler === s ? ORG : ORG + "0d",
                    border: `2px solid ${sampler === s ? ORG : ORG + "22"}`,
                    borderRadius: 8, padding: "5px 12px", cursor: "pointer",
                    fontWeight: 700, fontSize: px(11), color: sampler === s ? "#fff" : ORG
                  }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ background: ORG + "0d", border: `1px solid ${ORG}33`, borderRadius: 10, padding: "12px" }}>
            <div style={{ fontWeight: 700, color: ORG, marginBottom: 6, fontSize: px(12) }}>
              {sampler} — {SAMPLERS[sampler].steps} steps optimal
            </div>
            <p style={{ ...LBODY, fontSize: px(12), margin: 0 }}>{SAMPLERS[sampler].desc}</p>
          </div>
        </div>
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: GRN + "0d", border: `2px solid ${GRN}33`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 900, color: GRN, fontSize: px(28) }}>{getQualityScore()}</div>
              <div style={{ fontSize: px(11), color: V.muted }}>Quality score</div>
              <div style={{ background: V.cream, borderRadius: 4, height: 6, margin: "6px 0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${getQualityScore()}%`, background: GRN, borderRadius: 4 }} />
              </div>
            </div>
            <div style={{ background: VIO + "0d", border: `2px solid ${VIO}33`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontWeight: 900, color: VIO, fontSize: px(28) }}>{getDiversityScore()}</div>
              <div style={{ fontSize: px(11), color: V.muted }}>Diversity</div>
              <div style={{ background: V.cream, borderRadius: 4, height: 6, margin: "6px 0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${getDiversityScore()}%`, background: VIO, borderRadius: 4 }} />
              </div>
            </div>
          </div>
          <div style={{ background: "#100a00", borderRadius: 10, padding: "12px", fontFamily: "monospace", fontSize: px(11), lineHeight: 2 }}>
            <div style={{ color: "#475569" }}># CFG formula at each denoising step:</div>
            <div style={{ color: ORG }}>ε = ε_uncond + guidance × (ε_text - ε_uncond)</div>
            <div style={{ color: "#475569", marginTop: 4 }}># Two forward passes per step:</div>
            <div style={{ color: AMB }}>ε_text   = unet(x_t, t, text_embedding)</div>
            <div style={{ color: "#94a3b8" }}>ε_uncond = unet(x_t, t, empty_embedding)</div>
            <div style={{ color: "#475569", marginTop: 4 }}># guidance=7.5: strong text adherence</div>
            <div style={{ color: "#475569" }}># guidance=1.0: ignores text (unconditional)</div>
          </div>
          <div style={{ ...LCARD, marginTop: 10 }}>
            <div style={{ fontWeight: 700, color: ORG, fontSize: px(12), marginBottom: 6 }}>Guidance scale intuition</div>
            {[
              { g: "1-3", note: "Ignores prompt, generates random samples" },
              { g: "5-7", note: "Balanced: diverse but prompt-aligned" },
              { g: "7-10", note: "Strong prompt adherence (sweet spot)" },
              { g: "12-15", note: "Very literal, less natural-looking" },
              { g: "15+", note: "Over-saturated, distorted artifacts" },
            ].map(row => (
              <div key={row.g} style={{ display: "flex", gap: 10, marginBottom: 4, fontSize: px(11) }}>
                <span style={{ fontFamily: "monospace", fontWeight: 700, color: ORG, minWidth: 38 }}>{row.g}</span>
                <span style={{ color: V.muted }}>{row.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ TEXT-TO-IMAGE PROJECT ════════════════════════════════════ */
const TextToImageProject = () => {
  const [prompt, setPrompt] = useState("a serene mountain lake at golden hour, photorealistic");
  const [negPrompt, setNegPrompt] = useState("blurry, low quality, distorted");
  const [steps, setSteps] = useState(30);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState(42);
  const [mode, setMode] = useState("sd15");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef();
  const animRef = useRef(null);

  const MODELS = {
    sd15: { name: "SD 1.5", desc: "Stable Diffusion 1.5 (RunwayML)", params: "860M", res: "512×512", vram: "4GB" },
    sdxl: { name: "SDXL", desc: "Stable Diffusion XL 1.0", params: "6.6B", res: "1024×1024", vram: "12GB" },
    flux: { name: "FLUX.1", desc: "Black Forest Labs FLUX.1-dev", params: "12B", res: "1024×1024+", vram: "24GB" },
    dalle3: { name: "DALL·E 3", desc: "OpenAI DALL·E 3 (API)", params: "~N/A", res: "1024×1024", vram: "API only" },
  };

  const SAMPLE_PROMPTS = [
    "cyberpunk city at night, neon lights, rain",
    "oil painting portrait of a cat, rembrandt lighting",
    "abstract geometric shapes, vibrant colours",
    "underwater coral reef, tropical fish, cinematic",
  ];

  const getPalette = (p) => {
    if (p.includes("mountain") || p.includes("golden")) return [[220, 160, 60], [180, 120, 80], [80, 120, 180]];
    if (p.includes("cyber") || p.includes("neon")) return [[20, 0, 60], [180, 0, 200], [0, 200, 240]];
    if (p.includes("ocean") || p.includes("coral") || p.includes("under")) return [[0, 40, 120], [0, 120, 200], [80, 200, 200]];
    if (p.includes("forest") || p.includes("nature")) return [[20, 80, 20], [40, 140, 40], [80, 180, 60]];
    if (p.includes("portrait") || p.includes("cat")) return [[180, 130, 90], [220, 160, 110], [100, 80, 60]];
    return [[120, 80, 160], [200, 100, 140], [80, 120, 200]];
  };

  const generate = () => {
    setGenerating(true); setProgress(0);
    clearInterval(animRef.current);
    let s = 0;
    animRef.current = setInterval(() => {
      s++; setProgress(s / steps);
      // draw partial generation
      const c = canvasRef.current; if (!c) return;
      const ctx = c.getContext("2d");
      const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
      const PW = 200, PH = 200;
      const offX = W / 2 - PW / 2, offY = H / 2 - PH / 2;
      const frac = s / steps;
      const palette = getPalette(prompt.toLowerCase());
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#100a00"; ctx.fillRect(0, 0, W, H);
      const imgData = new ImageData(PW, PH);
      for (let y = 0; y < PH; y++) {
        for (let x = 0; x < PW; x++) {
          const idx = (y * PW + x) * 4;
          const band = Math.floor((y / PH) * palette.length);
          const [tR, tG, tB] = palette[Math.min(band, palette.length - 1)];
          const n = (Math.random() - 0.5) * 255 * (1 - frac) * 2;
          const wav = Math.sin(x * 0.12 + y * 0.09 + frac * 8) * 30 * frac;
          imgData.data[idx] = Math.min(255, Math.max(0, tR * frac + 128 * (1 - frac) + n + wav));
          imgData.data[idx + 1] = Math.min(255, Math.max(0, tG * frac + 128 * (1 - frac) + n * 0.85 + wav));
          imgData.data[idx + 2] = Math.min(255, Math.max(0, tB * frac + 128 * (1 - frac) + n * 0.7 + wav));
          imgData.data[idx + 3] = 255;
        }
      }
      const tmp = document.createElement("canvas");
      tmp.width = PW; tmp.height = PH;
      tmp.getContext("2d").putImageData(imgData, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tmp, offX, offY, PW, PH);
      ctx.strokeStyle = ORG + "88"; ctx.lineWidth = 2; ctx.strokeRect(offX, offY, PW, PH);
      ctx.font = `${px(9)} monospace`; ctx.fillStyle = "#94a3b8"; ctx.textAlign = "center";
      ctx.fillText(`Step ${s}/${steps} · Denoising...`, W / 2, offY + PH + 16);

      if (s >= steps) { clearInterval(animRef.current); setGenerating(false); setProgress(1); }
    }, 1000 / steps * 3);
  };

  useEffect(() => () => clearInterval(animRef.current), []);
  const m = MODELS[mode];

  return (
    <div style={{ ...LCARD, background: "#100a00", border: `2px solid ${ORG}22` }}>
      <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(15) }}>
        🎨 Mini Project — Text-to-Image Generator
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: px(11), fontWeight: 700, color: "#94a3b8", marginBottom: 6 }}>MODEL</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(MODELS).map(([k, v]) => (
                <button key={k} onClick={() => setMode(k)}
                  style={{
                    background: mode === k ? ORG + "22" : "transparent",
                    border: `2px solid ${mode === k ? ORG : ORG + "22"}`,
                    borderRadius: 8, padding: "6px 10px", cursor: "pointer", textAlign: "left",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                  <div>
                    <span style={{ fontWeight: 700, color: ORG, fontSize: px(11) }}>{v.name} </span>
                    <span style={{ fontSize: px(10), color: "#475569" }}>{v.desc}</span>
                  </div>
                  <span style={{ fontFamily: "monospace", fontSize: px(9), color: "#475569" }}>{v.res}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: px(11), fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>PROMPT</div>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
              rows={2} style={{
                width: "100%", padding: "8px 10px", borderRadius: 8, border: `2px solid ${ORG}33`,
                fontFamily: "monospace", fontSize: px(12), resize: "vertical",
                background: "#1a0e00", color: ORG, boxSizing: "border-box"
              }} />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
              {SAMPLE_PROMPTS.map(p => (
                <button key={p} onClick={() => setPrompt(p)}
                  style={{ background: ORG + "0d", border: `1px solid ${ORG}22`, borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: px(9), color: ORG }}>{p.slice(0, 20)}...</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: px(11), fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>NEGATIVE PROMPT</div>
            <input value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
              style={{ width: "100%", padding: "7px 10px", borderRadius: 8, border: `2px solid ${ROSE}22`, fontFamily: "monospace", fontSize: px(12), background: "#1a0000", color: "#f87171", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              ["Steps", steps, setSteps, 4, 100, ORG],
              ["CFG", guidance, setGuidance, 1, 20, AMB],
              ["Seed", seed, setSeed, 0, 9999, VIO],
            ].map(([l, v, s, mn, mx, c]) => (
              <div key={l}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: px(10), marginBottom: 2 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>{l}</span>
                  <span style={{ fontFamily: "monospace", color: c, fontWeight: 700 }}>{typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(1)) : v}</span>
                </div>
                <input type="range" min={mn} max={mx} step={l === "CFG" ? 0.5 : 1} value={v}
                  onChange={e => s(+e.target.value)} style={{ width: "100%", accentColor: c }} />
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={generating}
            style={{
              width: "100%", background: `linear-gradient(135deg,${ROSE},${ORG})`, border: "none",
              borderRadius: 10, padding: "12px", color: "#fff", fontWeight: 800, fontSize: px(13),
              cursor: generating ? "default" : "pointer", opacity: generating ? 0.6 : 1
            }}>
            {generating ? `Generating... ${Math.round(progress * 100)}%` : "🎨 Generate Image"}
          </button>
          {generating && (
            <div style={{ background: "#1a0800", borderRadius: 8, height: 8, overflow: "hidden", marginTop: 8 }}>
              <div style={{ height: "100%", width: `${progress * 100}%`, background: `linear-gradient(90deg,${ROSE},${ORG})`, borderRadius: 8, transition: "width 0.1s" }} />
            </div>
          )}
        </div>
        <div>
          <canvas ref={canvasRef} style={{ width: "100%", height: 260, borderRadius: 14, display: "block", border: `2px solid ${ORG}22`, marginBottom: 12 }} />
          <div style={{ background: "#1a0800", borderRadius: 10, padding: "10px", fontFamily: "monospace", fontSize: px(10), lineHeight: 2, color: "#94a3b8" }}>
            <div style={{ color: "#475569" }}># Config:</div>
            <div style={{ color: ORG }}>model: {m.name} · params: {m.params}</div>
            <div style={{ color: ORG }}>resolution: {m.res} · VRAM: {m.vram}</div>
            <div style={{ color: AMB }}>steps: {steps} · cfg_scale: {guidance} · seed: {seed}</div>
            <div style={{ color: "#475569", marginTop: 4 }}># Code:</div>
            <div style={{ color: GRN }}>pipe = DiffusionPipeline.from_pretrained(</div>
            <div style={{ color: GRN }}>  "stabilityai/stable-diffusion-xl-base-1.0")</div>
            <div style={{ color: GRN }}>image = pipe(</div>
            <div style={{ color: GRN }}>  prompt="{prompt.slice(0, 30)}...",</div>
            <div style={{ color: GRN }}>  negative_prompt="{negPrompt.slice(0, 20)}...",</div>
            <div style={{ color: GRN }}>  num_inference_steps={steps},</div>
            <div style={{ color: GRN }}>  guidance_scale={guidance},</div>
            <div style={{ color: GRN }}>  generator=torch.Generator().manual_seed({seed})</div>
            <div style={{ color: GRN }}>).images[0]</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ════════════════════════════════════════════ */
const DiffusionTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d => ({ ...d, [i]: !d[i] }));
  const items = [
    { e: "💡", c: ORG, t: "Diffusion models work by learning to reverse a noise process. Forward diffusion (training): add Gaussian noise to images step-by-step until pure noise. Reverse diffusion (inference): start from noise, repeatedly remove noise. The model learns only one thing: 'given this noisy image at step t, predict the noise component'." },
    { e: "🔢", c: AMB, t: "The core training objective: L = E[||ε - ε_θ(x_t, t)||²] — minimise the distance between true noise ε and predicted noise ε_θ. Deceptively simple. A U-Net learns this prediction. At inference, subtract the predicted noise × a scheduler weighting to denoise one step." },
    { e: "🏗️", c: VIO, t: "The U-Net is the workhorse architecture: encoder path (↓) captures global semantics, decoder path (↑) reconstructs spatial detail, skip connections transfer low-level features from encoder to decoder at each resolution. Cross-attention layers at 16×16 and 8×8 resolution inject text conditioning from CLIP/T5." },
    { e: "🎯", c: CYN, t: "Classifier-Free Guidance (CFG) controls text adherence. Two forward passes: one with text embedding, one with empty embedding. Final noise = uncond + scale × (cond - uncond). Guidance=7.5: strong text adherence. Guidance=1: ignores text. This doubles inference cost but is essential for quality." },
    { e: "⚡", c: GRN, t: "Latent Diffusion Models (LDM, basis of Stable Diffusion): compress images to a 64×64×4 latent space via a VAE encoder before diffusing. Run the U-Net in latent space (8× smaller). Decode final latent with VAE decoder. Reduces computation 8x with minimal quality loss — the key to practical image generation." },
    { e: "📝", c: TEAL, t: "Text conditioning: CLIP or T5 encodes the prompt into a sequence of token embeddings. These are injected into the U-Net via cross-attention at multiple spatial resolutions. Each spatial patch learns to 'query' the text tokens for what to paint. SDXL uses two text encoders for richer conditioning." },
    { e: "⚠️", c: ROSE, t: "Critical limitations: (1) Photorealistic human faces require special training (portrait models). (2) Multi-character consistency — generating two people with consistent faces is unsolved without ControlNet/IP-Adapter. (3) Text rendering in images is often garbled. (4) Slow inference: 30 steps × 2 U-Net passes = 60 forward passes." },
    { e: "🚀", c: IND, t: "Future: Video diffusion (Sora uses space-time U-Net), 3D generation (Zero-1-to-3, Wonder3D), real-time generation (LCM, SDXL Turbo with 1-4 steps), multimodal diffusion (text + image + audio in same latent space). FLUX.1 (2024) achieves unprecedented prompt adherence with a transformer-only architecture (no U-Net)." },
  ];
  const cnt = Object.values(done).filter(Boolean).length;
  return (
    <div style={{ ...LSEC }}>
      {STag("Key Insights", ORG)}
      <h2 style={{ ...LH2, color: V.ink, marginBottom: px(28) }}>What You Now <span style={{ color: ORG }}>Know</span></h2>
      <div style={{ marginBottom: px(32) }}>
        {items.map((item, i) => (
          <div key={i} onClick={() => toggle(i)}
            style={{
              ...LCARD, display: "flex", alignItems: "center", gap: 16, cursor: "pointer",
              border: `2px solid ${done[i] ? item.c : V.border}`,
              background: done[i] ? item.c + "08" : V.card, transition: "all 0.2s", marginBottom: px(10)
            }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${done[i] ? item.c : V.border}`,
              background: done[i] ? item.c : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: px(13)
            }}>{done[i] ? "✓" : ""}</div>
            <span style={{ fontSize: px(22) }}>{item.e}</span>
            <p style={{ ...LBODY, margin: 0, fontSize: px(14), flex: 1, color: done[i] ? V.ink : V.muted, fontWeight: done[i] ? 600 : 400 }}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{
        ...LCARD, textAlign: "center", padding: "40px",
        background: "linear-gradient(135deg,#fff8f0,#fef3e8)"
      }}>
        <div style={{ fontSize: px(56), marginBottom: 10 }}>{cnt === 8 ? "🎓" : cnt >= 5 ? "🎨" : "📖"}</div>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: px(24), color: V.ink, marginBottom: 8 }}>{cnt}/8 mastered</div>
        <div style={{ background: V.cream, borderRadius: 8, height: 10, overflow: "hidden", maxWidth: 400, margin: "0 auto 16px" }}>
          <div style={{ height: "100%", width: `${(cnt / 8) * 100}%`, background: `linear-gradient(90deg,${ROSE},${ORG},${AMB})`, transition: "width 0.5s", borderRadius: 8 }} />
        </div>
        <p style={{ ...LBODY, maxWidth: px(560), margin: "0 auto 24px", fontSize: px(15), fontFamily: "'Lora',serif" }}>
          🎉 Congratulations — you've completed <strong>Level 5: Modern AI Systems</strong>!
          You now understand LLMs, Embeddings, Vector Databases, RAG Systems, and Diffusion Models —
          the full stack behind ChatGPT, Perplexity, Midjourney, and Stable Diffusion.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onBack} style={{ background: `linear-gradient(135deg,${ROSE},${ORG})`, border: "none", borderRadius: 10, padding: "13px 32px", fontWeight: 800, cursor: "pointer", color: "#fff", fontSize: px(15) }}>
            🚀 Continue to Level 6 — Agentic AI
          </button>
          <button onClick={onBack} style={{ border: `1px solid ${V.border}`, background: "none", borderRadius: 10, padding: "12px 24px", color: V.muted, cursor: "pointer", fontSize: px(13) }}>
            ← Back to Level Map
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const DiffusionModelsPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Diffusion Models" lessonNum="Lesson 5 of 5"
    accent={ORG} levelLabel="Modern AI Systems"
    dotLabels={["Hero", "Introduction", "Intuition", "Forward Diffusion", "Reverse Diffusion", "U-Net Architecture", "Stable Diffusion", "CFG & Sampling", "Python", "Applications", "Limitations", "Future", "Game", "Project", "Insights"]}>
    {R => (
      <>
        {/* ── HERO ── */}
        <div ref={R(0)} style={{
          background: "linear-gradient(160deg,#100a00 0%,#2a0e00 60%,#0a0010 100%)",
          minHeight: "75vh", display: "flex", alignItems: "center", overflow: "hidden"
        }}>
          <div style={{
            maxWidth: px(1100), width: "100%", margin: "0 auto", padding: "80px 24px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(48), alignItems: "center"
          }}>
            <div>
              <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "7px 16px", color: "#64748b", cursor: "pointer", fontSize: 13, marginBottom: 24 }}>← Back</button>
              {STag("🎨 Lesson 5 of 5 · Modern AI Systems", ORG)}
              <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: px(20) }}>
                Diffusion<br /><span style={{ color: "#fdba74" }}>Models</span>
              </h1>
              <div style={{ width: px(56), height: px(4), background: ORG, borderRadius: px(2), marginBottom: px(22) }} />
              <p style={{ fontFamily: "'Lora',serif", fontSize: px(17), color: "#cbd5e1", lineHeight: 1.8, marginBottom: px(20) }}>
                Midjourney, DALL·E 3, Stable Diffusion, Adobe Firefly, Imagen.
                Every modern AI image generator uses diffusion models — a remarkable technique
                that learns to create images by learning to remove noise. Starting from pure
                random static, a neural network iteratively denoises until a photorealistic image emerges.
              </p>
              <div style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 14, padding: "14px 20px" }}>
                <div style={{ color: "#fdba74", fontWeight: 700, fontSize: px(12), marginBottom: 6, letterSpacing: "1px" }}>💡 CORE INSIGHT</div>
                <p style={{ fontFamily: "'Lora',serif", color: "#cbd5e1", margin: 0, fontSize: px(14), lineHeight: 1.7 }}>
                  "Rather than directly learning to generate images (hard), teach a network to remove
                  a tiny amount of noise from an image (easy). Repeat 1000 times. The composition of
                  1000 easy denoising steps produces a photorealistic image from nothing." — the diffusion insight.
                </p>
              </div>
            </div>
            <div style={{ height: px(400), background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 24, overflow: "hidden" }}>
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* ── S1: INTRODUCTION ── */}
        <div ref={R(1)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 1 · What are Diffusion Models?", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(20) }}>The <span style={{ color: ORG }}>Generative Revolution</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32) }}>
              <div>
                <p style={{ ...LBODY, fontSize: px(15), marginBottom: 16 }}>
                  Diffusion models are a class of generative models that learn a data distribution
                  by modelling a <strong>gradual denoising process</strong>. Unlike GANs (adversarial training)
                  or VAEs (variational lower bound), diffusion models train on a simple, stable objective:
                  predict the noise added to a data point at each step of a Markov chain.
                </p>
                <p style={{ ...LBODY, fontSize: px(14), marginBottom: 16 }}>
                  The key insight: if you can reverse a noising process, you can generate new samples
                  by starting from noise and iteratively denoising. The denoising function — a U-Net
                  that learns to predict noise — is easy to train but powerful enough to generate
                  photorealistic images, music, proteins, and video.
                </p>
                {[
                  { year: "2015", paper: "Deep Unsupervised Learning using Nonequilibrium Thermodynamics", note: "Sohl-Dickstein et al. — original diffusion framework" },
                  { year: "2020", paper: "DDPM (Denoising Diffusion Probabilistic Models)", note: "Ho et al. — first high-quality image results" },
                  { year: "2021", paper: "DDIM", note: "Song et al. — 50× faster sampling, deterministic" },
                  { year: "2022", paper: "LDM / Stable Diffusion", note: "Rombach et al. — latent diffusion, text-to-image" },
                  { year: "2022", paper: "DALL·E 2 / Imagen", note: "OpenAI / Google — CLIP conditioning at scale" },
                  { year: "2024", paper: "Stable Diffusion 3 / FLUX.1", note: "Transformer-based diffusion (DiT / MM-DiT)" },
                ].map(row => (
                  <div key={row.year} style={{ display: "grid", gridTemplateColumns: "50px 1.2fr 1fr", gap: 6, marginBottom: 5, padding: "4px 0", borderBottom: `1px solid ${V.border}` }}>
                    <span style={{ fontFamily: "monospace", fontSize: px(11), color: ORG, fontWeight: 700 }}>{row.year}</span>
                    <span style={{ fontWeight: 700, fontSize: px(11), color: V.ink }}>{row.paper}</span>
                    <span style={{ fontSize: px(10), color: V.muted }}>{row.note}</span>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={ORG} title="Diffusion vs GAN vs VAE"
                  body="GANs: adversarial training, fast sampling, but mode collapse and training instability. VAEs: stable training, but blurry outputs (optimising reconstruction + KL). Diffusion: slow sampling (1000 steps), but training is stable (simple MSE loss), no mode collapse, highest quality images. DDIM reduced sampling to 50 steps; LCM to 4 steps — eliminating the main disadvantage." />
                <div style={{ ...LCARD, marginTop: 14 }}>
                  <div style={{ fontWeight: 700, color: ORG, marginBottom: 10, fontSize: px(13) }}>Diffusion-powered systems (2024)</div>
                  {[
                    { s: "Midjourney v6", d: "Highest quality, artistic style" },
                    { s: "DALL·E 3 (ChatGPT)", d: "Best prompt adherence" },
                    { s: "Stable Diffusion 3", d: "Open source, customisable" },
                    { s: "Adobe Firefly", d: "Commercial-safe, enterprise" },
                    { s: "Runway Gen-3", d: "Video generation" },
                    { s: "Sora (OpenAI)", d: "Long-form video, physics-aware" },
                    { s: "Udio / Suno", d: "Music generation via diffusion" },
                    { s: "RFDiffusion", d: "Protein structure generation" },
                  ].map(item => (
                    <div key={item.s} style={{ display: "flex", gap: 8, marginBottom: 5, fontSize: px(12) }}>
                      <span style={{ fontWeight: 700, color: ORG }}>{item.s}:</span>
                      <span style={{ color: V.muted }}>{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2: INTUITION ── */}
        <div ref={R(2)} style={{ background: "#100a00" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 2 · Intuitive Explanation", "#fdba74")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(20) }}>Denoising as <span style={{ color: "#fdba74" }}>Creation</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32) }}>
              <div>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(15), marginBottom: 16 }}>
                  Imagine someone hands you a blurry, static-filled photograph. Your brain
                  can often reconstruct what the image should look like — you're performing denoising.
                  Diffusion models learn to do this systematically, one small step at a time.
                </p>
                {[
                  { title: "The sculptor analogy", desc: "Michelangelo said 'I saw the angel in the marble and carved until I set him free.' Diffusion models start with pure marble (noise) and carve away (denoise) until an image emerges. The prompt tells the model what angel to free.", c: ORG },
                  { title: "The photograph development analogy", desc: "Film photography develops gradually in a chemical bath — an image slowly emerges from uniform grey. Diffusion models 'develop' an image from noise, with the text prompt acting as the chemical composition that determines what appears.", c: AMB },
                  { title: "The thermodynamics analogy", desc: "In physics, entropy always increases (order → disorder). Diffusion models learn to reverse entropy locally: disorder (noise) → order (image). Like a movie of scrambled eggs spontaneously unscrambling — impossible in reality, learned by the model.", c: VIO },
                ].map(item => (
                  <div key={item.title} style={{ background: item.c + "0d", border: `1px solid ${item.c}33`, borderRadius: 12, padding: "14px", marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: item.c, fontSize: px(13), marginBottom: 4 }}>{item.title}</div>
                    <p style={{ ...LBODY, fontSize: px(13), margin: 0, color: "#94a3b8" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ background: "#1a0e00", border: `1px solid ${ORG}33`, borderRadius: 14, padding: "16px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fdba74", marginBottom: 10, fontSize: px(13) }}>The training curriculum</div>
                  <div style={{ fontFamily: "monospace", fontSize: px(11), lineHeight: 2.2, color: "#94a3b8" }}>
                    <div style={{ color: "#475569" }}># Training data generation:</div>
                    <div>for each image x_0 in dataset:</div>
                    <div>  t = random.randint(1, T)  # random step</div>
                    <div>  ε = random Gaussian noise</div>
                    <div>  x_t = sqrt(ᾱ_t)*x_0 + sqrt(1-ᾱ_t)*ε</div>
                    <div>  prediction = model(x_t, t, text_embedding)</div>
                    <div>  loss = MSE(ε, prediction)  # predict noise!</div>
                    <div style={{ color: ORG, marginTop: 4 }}># The model trains on MILLIONS of (x_t, ε) pairs</div>
                    <div style={{ color: ORG }}># with random t and random noise ε</div>
                    <div style={{ color: ORG }}># This is why training is stable — just MSE!</div>
                  </div>
                </div>
                <IBox color="#fdba74" title="Why does predicting noise work?"
                  body="Predicting noise ε is equivalent to predicting the clean image x_0 (they differ by a known linear combination). But predicting noise is numerically better: the network output is in [-1, 1] range (noise scale), while predicting x_0 directly produces outputs in image pixel range [0, 255], harder to learn. The DDPM paper proved these are equivalent via the reparameterisation trick." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S3: FORWARD DIFFUSION ── */}
        <div ref={R(3)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 3 · Forward Diffusion Process", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Adding Noise <span style={{ color: ORG }}>Step by Step</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32), marginBottom: px(24) }}>
              <div>
                <Formula color={ORG}>x_t = √(ᾱ_t) · x_0 + √(1 − ᾱ_t) · ε</Formula>
                <p style={{ ...LBODY, fontSize: px(14), marginBottom: 14 }}>
                  The <strong>reparameterisation trick</strong>: we can jump directly from the clean image x_0
                  to any noisy step x_t in a single operation, without iterating through all t−1 steps.
                  ᾱ_t = ∏ᵢ₌₁ᵗ(1−βᵢ) is the cumulative noise schedule.
                </p>
                <div style={{ ...LCARD, background: "#fff8f0", border: `2px solid ${ORG}22` }}>
                  <div style={{ fontWeight: 700, color: ORG, marginBottom: 8, fontSize: px(13) }}>Noise schedule types</div>
                  {[
                    { name: "Linear (DDPM)", desc: "β grows linearly from 0.0001 to 0.02. Works but wastes steps: images become pure noise by t=500/1000, last 500 steps add no information." },
                    { name: "Cosine (improved DDPM)", desc: "β = 1 - cos²(tπ/2T) schedule. Images retain structure longer — noising is slower at the start, faster at the end. Better sample quality at the same step count." },
                    { name: "Zero-terminal SNR", desc: "Ensures that at t=T, the signal-to-noise ratio reaches exactly 0 (pure noise). Required for the model to learn unconditional distribution. SD3 / FLUX use this." },
                  ].map(item => (
                    <div key={item.name} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: `1px solid ${V.border}` }}>
                      <div style={{ fontWeight: 700, color: ORG, fontSize: px(12) }}>{item.name}</div>
                      <div style={{ fontSize: px(11), color: V.muted }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <IBox color={ORG} title="Why Gaussian noise?"
                  body="Gaussian noise has special mathematical properties: the sum of Gaussian random variables is Gaussian. This means q(x_t | x_0) = N(√ᾱ_t · x_0, (1-ᾱ_t)I) has a closed form — we can compute x_t from x_0 directly without simulation. Non-Gaussian noise breaks this tractability. The entire efficiency of diffusion models depends on the Gaussian assumption." />
                <div style={{ background: "#100a00", borderRadius: 12, padding: "14px", fontFamily: "monospace", fontSize: px(11), lineHeight: 2 }}>
                  <div style={{ color: "#475569" }}># Forward process: q(x_t | x_{t-1})</div>
                  <div style={{ color: ORG }}>{"q(x_t|x_{t-1}) = N(x_t; √(1-β_t)x_{t-1}, β_t·I)"}</div>
                  <div style={{ color: "#475569", marginTop: 4 }}># Marginal: q(x_t | x_0) — jump directly to step t</div>
                  <div style={{ color: AMB }}>q(x_t|x_0) = N(x_t; √ᾱ_t·x_0, (1-ᾱ_t)·I)</div>
                  <div style={{ color: "#475569", marginTop: 4 }}># ᾱ_t = cumulative product of (1-β)</div>
                  <div style={{ color: VIO }}>ᾱ_t = ∏{"{"+"i=1..t}"}(1-β_i)</div>
                  <div style={{ color: "#475569", marginTop: 4 }}># Python:</div>
                  <div style={{ color: GRN }}>alphas_cumprod = torch.cumprod(1 - betas, dim=0)</div>
                  <div style={{ color: GRN }}>x_t = sqrt_alpha_bar * x0 + sqrt_one_minus_alpha_bar * eps</div>
                </div>
              </div>
            </div>
            <ForwardDiffusionDemo />
          </div>
        </div>

        {/* ── S4: REVERSE DIFFUSION ── */}
        <div ref={R(4)} style={{ background: "#100a00" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 4 · Reverse Diffusion", "#fdba74")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(20) }}>Learning to <span style={{ color: "#fdba74" }}>Denoise</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32) }}>
              <div>
                <Formula color={ORG}>{"p_θ(x_{t-1} | x_t) = N(μ_θ(x_t, t), σ_t² I)"}</Formula>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14), marginBottom: 16 }}>
                  The reverse process is a Gaussian with <strong>learned mean</strong> μ_θ and a fixed variance σ_t².
                  Rather than learning μ_θ directly, DDPM parameterises it in terms of predicted noise ε_θ:
                </p>
                <div style={{ background: "#1a0e00", border: `1px solid ${ORG}33`, borderRadius: 12, padding: "14px", marginBottom: 14, fontFamily: "monospace", fontSize: px(11), lineHeight: 2.2 }}>
                  <div style={{ color: "#475569" }}># Reverse step: go from x_t to x_{t-1}</div>
                  <div style={{ color: ORG }}>μ_θ(x_t,t) = (1/√α_t) · (x_t - β_t/√(1-ᾱ_t) · ε_θ(x_t,t))</div>
                  <div style={{ color: "#475569", marginTop: 4 }}># Sampling one step:</div>
                  <div style={{ color: AMB }}>eps_pred = unet(x_t, t, text_embed)  # predict noise</div>
                  <div style={{ color: AMB }}>mean = (x_t - beta_t/sqrt(1-alpha_bar_t)*eps_pred) / sqrt(alpha_t)</div>
                  <div style={{ color: AMB }}>x_prev = mean + sigma_t * torch.randn_like(x_t)</div>
                  <div style={{ color: "#475569", marginTop: 4 }}># Repeat T times: x_T→x_{T-1}→...→x_0</div>
                </div>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(13) }}>
                  The only learned component is ε_θ (the U-Net). Everything else is fixed by the
                  noise schedule. This is why training is straightforward: just minimise the MSE
                  between true noise ε and predicted noise ε_θ.
                </p>
              </div>
              <div>
                <div style={{ ...LCARD, background: "#1a0e00", border: `1px solid ${ORG}33`, marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fdba74", marginBottom: 10, fontSize: px(13) }}>DDIM: deterministic faster sampling</div>
                  <p style={{ ...LBODY, fontSize: px(13), color: "#94a3b8", marginBottom: 10 }}>
                    DDPM adds noise at every reverse step (stochastic). DDIM reformulates the reverse process
                    as a non-Markovian chain with no stochastic noise term — fully deterministic.
                    The same noise latent always produces the same image, enabling:
                  </p>
                  <div style={{ fontFamily: "monospace", fontSize: px(11), lineHeight: 2, color: "#94a3b8" }}>
                    <div style={{ color: ORG }}># DDIM reverse step (no random noise added)</div>
                    <div>x_prev = sqrt(ᾱ_{"{t-1}"}) * pred_x0 + sqrt(1-ᾱ_{"{t-1}"}) * eps_theta</div>
                    <div style={{ color: "#475569", marginTop: 4 }}># Advantages:</div>
                    <div>✅  50 steps ≈ 1000-step DDPM quality</div>
                    <div>✅  Deterministic: same latent → same image</div>
                    <div>✅  Latent interpolation between images</div>
                    <div>✅  DDIM inversion: image → noise (for editing)</div>
                  </div>
                </div>
                <IBox color={ORG} title="DDIM inversion: the basis of image editing"
                  body="Because DDIM is deterministic, you can invert a real image: run the reverse process backwards (forward through the ODE) to find the noise latent that would have generated it. Then modify the text prompt and denoise from this latent — the image changes according to the new prompt while preserving structure. This is how Prompt2Prompt, Null-Text Inversion, and InstructPix2Pix work." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S5: U-NET ── */}
        <div ref={R(5)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 5 · U-Net Architecture", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>The <span style={{ color: ORG }}>Denoising Network</span></h2>
            <UNetViz />
          </div>
        </div>

        {/* ── S6: STABLE DIFFUSION ── */}
        <div ref={R(6)} style={{ background: "#100a00" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 6 · Stable Diffusion — Latent Diffusion Models", "#fdba74")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(20) }}>Diffusion in <span style={{ color: "#fdba74" }}>Compressed Space</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32) }}>
              <div>
                <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(15), marginBottom: 16 }}>
                  Running a full diffusion model in pixel space for 512×512 images requires billions of
                  operations per step. The <strong>key insight of Latent Diffusion Models (LDM)</strong>:
                  compress images first, diffuse in the latent space, then decode.
                </p>
                {[
                  { n: 1, c: AMB, label: "VAE Encoder", desc: "Variational Autoencoder encodes 512×512×3 image → 64×64×4 latent. 8× spatial compression. Perceptual loss + adversarial loss preserves visual quality. Frozen during diffusion training." },
                  { n: 2, c: ORG, label: "Latent Diffusion", desc: "Run all T=1000 noising and denoising steps in 64×64×4 space. The U-Net operates on latents, not pixels. 64² = 4,096 tokens vs 512² = 262,144 pixels — 64× fewer operations per step." },
                  { n: 3, c: VIO, label: "Text Conditioning (CLIP)", desc: "CLIP ViT-L/14 or OpenCLIP encodes text prompt → sequence of 77 token embeddings × 768 dims. Injected into U-Net via cross-attention at spatial resolutions 16×16 and 8×8." },
                  { n: 4, c: GRN, label: "VAE Decoder", desc: "Decodes final latent x_0 back to pixel space: 64×64×4 → 512×512×3. One forward pass at the end of inference (not per step). The VAE is the reason SD images sometimes have characteristic texture." },
                ].map(item => (
                  <div key={item.n} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, background: item.c + "22", border: `2px solid ${item.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: item.c, fontSize: px(12) }}>{item.n}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: item.c, fontSize: px(13), marginBottom: 3 }}>{item.label}</div>
                      <p style={{ ...LBODY, fontSize: px(12), margin: 0, color: "#64748b" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ background: "#1a0e00", border: `1px solid ${ORG}33`, borderRadius: 14, padding: "14px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, color: "#fdba74", marginBottom: 8, fontSize: px(13) }}>SD model family comparison</div>
                  {[
                    { m: "SD 1.5 (2022)", params: "860M U-Net", res: "512×512", text: "CLIP ViT-L/14" },
                    { m: "SDXL (2023)", params: "6.6B (2×U-Nets)", res: "1024×1024", text: "2× CLIP encoders" },
                    { m: "SD 3 (2024)", params: "2B / 8B DiT", res: "1024×1024+", text: "T5-XXL + 2× CLIP" },
                    { m: "FLUX.1 (2024)", params: "12B (transformer)", res: "1024-4K", text: "T5-XXL + CLIP" },
                  ].map(row => (
                    <div key={row.m} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 0.8fr 1fr", gap: 4, marginBottom: 5, padding: "4px 0", borderBottom: "1px solid #1a0e00" }}>
                      <span style={{ fontWeight: 700, color: ORG, fontSize: px(11) }}>{row.m}</span>
                      <span style={{ fontSize: px(10), color: "#94a3b8" }}>{row.params}</span>
                      <span style={{ fontFamily: "monospace", fontSize: px(10), color: AMB }}>{row.res}</span>
                      <span style={{ fontSize: px(10), color: "#94a3b8" }}>{row.text}</span>
                    </div>
                  ))}
                </div>
                <IBox color={ORG} title="DiT: Diffusion Transformers (SD3 / FLUX)"
                  body="Peebles & Xie (2022) replaced the U-Net with a pure Vision Transformer. Images are patchified (16×16 patches) → flattened to a 1D sequence → processed by transformer blocks with attention over all patches simultaneously. MM-DiT (SD3) adds a parallel text token stream that cross-attends with image patches. FLUX.1 shows transformers outperform U-Nets at scale — the architecture is shifting." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S7: CFG & SAMPLING ── */}
        <div ref={R(7)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 7 · Guidance & Sampling Schedulers", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>Controlling <span style={{ color: ORG }}>Generation</span></h2>
            <CFGDemo />
          </div>
        </div>

        {/* ── S8: PYTHON ── */}
        <div ref={R(8)} style={{ background: "#100a00" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 8 · Python with 🤗 Diffusers", "#fdba74")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(16) }}>Diffusion <span style={{ color: "#fdba74" }}>in Code</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24) }}>
              <CodeBox color={ORG} lines={[
                "from diffusers import (StableDiffusionPipeline,",
                "  StableDiffusionXLPipeline, DPMSolverMultistepScheduler)",
                "import torch",
                "",
                "# ── Stable Diffusion 1.5 ─────────────────",
                "pipe = StableDiffusionPipeline.from_pretrained(",
                "  'runwayml/stable-diffusion-v1-5',",
                "  torch_dtype=torch.float16,",
                "  safety_checker=None)",
                "pipe = pipe.to('cuda')",
                "",
                "# Fast sampler: DPM-Solver++ in 25 steps",
                "pipe.scheduler = DPMSolverMultistepScheduler.from_config(",
                "  pipe.scheduler.config,",
                "  algorithm_type='dpmsolver++',",
                "  use_karras_sigmas=True)",
                "",
                "image = pipe(",
                "  prompt='a serene mountain lake at golden hour, photorealistic',",
                "  negative_prompt='blurry, distorted, low quality',",
                "  num_inference_steps=25,",
                "  guidance_scale=7.5,",
                "  width=512, height=512,",
                "  generator=torch.Generator('cuda').manual_seed(42)",
                ").images[0]",
                "image.save('output.png')",
                "",
                "# ── SDXL (better quality, 1024px) ────────",
                "pipe_xl = StableDiffusionXLPipeline.from_pretrained(",
                "  'stabilityai/stable-diffusion-xl-base-1.0',",
                "  torch_dtype=torch.float16)",
                "pipe_xl.to('cuda')",
                "",
                "image_xl = pipe_xl(",
                "  prompt='professional portrait, studio lighting, 8k',",
                "  negative_prompt='amateur, blurry, noise',",
                "  num_inference_steps=30,",
                "  guidance_scale=8.0,",
                "  height=1024, width=1024",
                ").images[0]",
                "",
                "# ── Image-to-image (editing) ──────────────",
                "from diffusers import StableDiffusionImg2ImgPipeline",
                "from PIL import Image",
                "",
                "pipe_i2i = StableDiffusionImg2ImgPipeline.from_pretrained(",
                "  'runwayml/stable-diffusion-v1-5',",
                "  torch_dtype=torch.float16).to('cuda')",
                "",
                "init_image = Image.open('photo.jpg').resize((512,512))",
                "edited = pipe_i2i(",
                "  prompt='same scene in Van Gogh style',",
                "  image=init_image,",
                "  strength=0.75,  # how much to change (0-1)",
                "  guidance_scale=7.5",
                ").images[0]",
                "",
                "# ── ControlNet (pose/depth/edge guidance) ─",
                "from diffusers import ControlNetModel",
                "from diffusers import StableDiffusionControlNetPipeline",
                "",
                "controlnet = ControlNetModel.from_pretrained(",
                "  'lllyasviel/sd-controlnet-canny',",
                "  torch_dtype=torch.float16)",
                "pipe_cn = StableDiffusionControlNetPipeline.from_pretrained(",
                "  'runwayml/stable-diffusion-v1-5',",
                "  controlnet=controlnet, torch_dtype=torch.float16).to('cuda')",
                "",
                "# Generate conditioned on edge map",
                "edge_image = detect_edges(source_image)  # Canny",
                "result = pipe_cn(",
                "  prompt='a photo of a tiger, photorealistic',",
                "  image=edge_image,",
                "  controlnet_conditioning_scale=0.8",
                ").images[0]",
              ]} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { l: "from_pretrained()", c: ORG, d: "Downloads model weights from Hugging Face Hub. Models are stored as safetensors shards. SD 1.5: ~4GB. SDXL: ~14GB. Auto-cached locally. Use torch_dtype=float16 to halve memory usage on GPU." },
                  { l: "DPMSolverMultistepScheduler", c: AMB, d: "State-of-the-art sampler. 25 steps with DPM-Solver++ + Karras sigmas produces quality approaching 1000-step DDPM. use_karras_sigmas=True improves results further. Better than DDIM for most use cases." },
                  { l: "guidance_scale", c: VIO, d: "Classifier-Free Guidance scale. 7.5 is the standard default. Below 5: images ignore the prompt. Above 15: over-saturated, unnatural. For artistic styles, try 3-5. For photorealism, try 7-10." },
                  { l: "strength (img2img)", c: CYN, d: "How much to change the input image. 0.0: keep original. 1.0: generate from scratch. 0.7-0.8: significant style change while preserving composition. The image is noised to step T*strength then denoised." },
                  { l: "ControlNet", c: GRN, d: "Adds structural conditioning: canny edges, depth maps, human pose (OpenPose), normal maps, segmentation. The conditioning image guides spatial structure while the prompt guides appearance. The main way to control composition precisely." },
                  { l: "generator.manual_seed()", c: TEAL, d: "Sets the random seed for reproducibility. Same seed + same prompt + same parameters = same image. Useful for: A/B testing prompts, iterative refinement, sharing reproducible outputs. Different seeds produce different compositions." },
                ].map(item => (
                  <div key={item.l} style={{ background: item.c + "0d", border: `1px solid ${item.c}33`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontFamily: "monospace", fontWeight: 700, color: item.c, fontSize: px(11), marginBottom: 4 }}>{item.l}</div>
                    <p style={{ ...LBODY, fontSize: px(12), margin: 0, color: "#94a3b8" }}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S9: APPLICATIONS ── */}
        <div ref={R(9)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 9 · Real-World Applications", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(28) }}>Diffusion <span style={{ color: ORG }}>Everywhere</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: px(16) }}>
              {[
                { e: "🎨", c: ORG, t: "AI Art & Creative Tools", b: "Adobe Firefly integrated into Photoshop — generative fill, background removal, style transfer. Canva Magic Studio. Midjourney used by 15M+ artists. Designers use Stable Diffusion for mood boards, concept art, and reference generation. Prompting is the new sketching." },
                { e: "✏️", c: AMB, t: "Image Editing & Inpainting", b: "DALL·E 3 inpainting: select a region, describe what you want, the model fills it respecting lighting and style. Stable Diffusion inpainting. Runway Gen-2 for video inpainting. ControlNet for structure-guided editing. SDXL Inpaint for high-resolution results." },
                { e: "🎬", c: ROSE, t: "Video & Motion Generation", b: "Runway Gen-3, Pika, Stable Video Diffusion. Sora (OpenAI): temporal U-Net over space-time patches generates coherent multi-minute videos. AnimateDiff adds temporal attention to still diffusion models. Used in film pre-viz, advertising, and social media content." },
                { e: "🧬", c: GRN, t: "Scientific Discovery", b: "RFDiffusion (Baker lab): designs protein structures from scratch. DiffDock: docks molecules into protein binding sites. Genie: generates protein backbones for drug targets. MusicLDM: generates music from text. AudioLDM: generates sound effects. Diffusion found its way into every modality." },
              ].map(a => (
                <div key={a.t} style={{ background: a.c + "0d", border: `1px solid ${a.c}33`, borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ fontSize: px(32), marginBottom: 8 }}>{a.e}</div>
                  <div style={{ fontWeight: 800, color: a.c, fontSize: px(14), marginBottom: 8 }}>{a.t}</div>
                  <p style={{ ...LBODY, fontSize: px(12), color: V.muted }}>{a.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S10: LIMITATIONS ── */}
        <div ref={R(10)} style={{ background: "#100a00" }}>
          <div style={{ ...LSEC }}>
            {STag("Section 10 · Limitations", "#fdba74")}
            <h2 style={{ ...LH2, color: "#fff", marginBottom: px(28) }}>Where <span style={{ color: "#fdba74" }}>Diffusion Models Struggle</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: px(16) }}>
              {[
                { e: "⏱️", c: ROSE, t: "Inference Speed", d: "Even SDXL DPM++ requires 30 forward passes through a 6.6B parameter network per image — 5-30 seconds on a consumer GPU. FLUX.1 requires more. Real-time generation (LCM, SDXL Turbo) uses distillation to 4 steps but quality drops. The fundamental challenge: sequential generation cannot be parallelised." },
                { e: "📝", c: AMB, t: "Text Rendering", d: "Diffusion models consistently fail to generate readable text in images. 'A poster saying HELLO' produces garbled or near-correct letters. Reason: CLIP tokenises words, not letters; the spatial correspondence between text tokens and pixels is imprecise. FLUX.1 partially solves this but still unreliable." },
                { e: "🧑‍🤝‍🧑", c: VIO, t: "Multi-Subject Consistency", d: "Generating two specific named people, or maintaining character consistency across frames of a video, is unsolved. Each image is generated independently — no memory of previous generations. IP-Adapter and face ControlNets partially address this but artifacts remain." },
                { e: "⚖️", c: GRN, t: "Copyright & Ethics", d: "Training data (LAION-5B) includes copyrighted artworks, photographs, and private faces. Style mimicry ('in the style of [living artist]') raises copyright questions. Deepfake generation of real people. Mitigations: watermarking (C2PA), training data curation, style-opt-out registries, consent frameworks." },
                { e: "🎮", c: CYN, t: "Compositional Failures", d: "Complex prompts with multiple attributes fail: 'a red cube to the left of a blue sphere' often produces wrong spatial relationships. Attribute binding failures: 'a man with a red hat and a woman with a blue hat' may swap attributes. Structured diffusion and layout conditioning partially address this." },
                { e: "💾", c: ORG, t: "Hardware Requirements", d: "SD 1.5: 4GB VRAM. SDXL: 12GB VRAM. FLUX.1 12B: 24GB VRAM. SD 3 8B: 18GB VRAM. Consumer GPUs (RTX 3080: 10GB) can run SD 1.5 and SDXL at full precision. Quantisation (4-bit, 8-bit) via bitsandbytes enables large models on 8GB but with quality trade-offs." },
              ].map(a => (
                <div key={a.t} style={{ background: a.c + "0d", border: `1px solid ${a.c}33`, borderRadius: 14, padding: "18px" }}>
                  <div style={{ fontSize: px(28), marginBottom: 6 }}>{a.e}</div>
                  <div style={{ fontWeight: 800, color: a.c, fontSize: px(14), marginBottom: 8 }}>{a.t}</div>
                  <p style={{ ...LBODY, fontSize: px(12), margin: 0, color: "#94a3b8" }}>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S11: FUTURE ── */}
        <div ref={R(11)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 11 · Future Research Directions", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(28) }}>The <span style={{ color: ORG }}>Next Wave</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(32) }}>
              <div>
                {[
                  { e: "🎬", c: ROSE, t: "World Models & Video Generation", d: "Sora treats video as a sequence of visual patches in space and time. Next: generate physically plausible worlds where objects interact correctly — not just visually coherent but causally consistent. Google's VideoPoet, Meta's Movie Gen. The path to simulation." },
                  { e: "🧊", c: VIO, t: "3D & Scene Generation", d: "DreamFusion (Google 2022): use diffusion loss to optimise a NeRF for text-to-3D. Gaussian Splatting diffusion generates 3D scenes directly. MVDiffusion generates multi-view consistent images. Applications: game asset creation, AR/VR content, robotics simulation." },
                  { e: "🎵", c: CYN, t: "Multimodal Diffusion", d: "Unified models that diffuse over text, images, audio, and video simultaneously in one latent space. CoDi (2023): generates correlated multimodal outputs. AudioVisual diffusion: generate video and matching soundtrack together. The next frontier beyond unimodal generation." },
                  { e: "⚡", c: GRN, t: "Ultra-Fast Generation", d: "Flow Matching (FLUX.1): replaces diffusion with straight-line trajectories through the latent space — fewer curvature corrections needed, better sample efficiency. Consistency Models: distil 1000-step diffusion into single-step generation with comparable quality. Real-time 4K video generation on a laptop." },
                ].map(item => (
                  <div key={item.t} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <span style={{ fontSize: px(26) }}>{item.e}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: item.c, fontSize: px(14), marginBottom: 4 }}>{item.t}</div>
                      <p style={{ ...LBODY, fontSize: px(13), margin: 0 }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={ORG} title="Flow Matching — the post-diffusion paradigm"
                  body="Flow Matching (Lipman et al. 2022, basis of FLUX.1 and SD3) learns to transport noise to data along straight-line trajectories in latent space. Unlike diffusion (curved, noisy paths), FM paths are straight — requiring fewer steps for the same quality. The training objective: predict the velocity field that moves noise toward data. Converges faster than diffusion and achieves better FID scores at equal compute." />
                <div style={{ ...LCARD, marginTop: 14, background: "#fff8f0", border: `2px solid ${ORG}22` }}>
                  <div style={{ fontWeight: 700, color: ORG, marginBottom: 10, fontSize: px(13) }}>Research to watch</div>
                  {[
                    "Masked diffusion for discrete (text) generation",
                    "Personalisation (DreamBooth, LoRA) scalability",
                    "Editing via null-text inversion + attention manipulation",
                    "Diffusion for structured prediction (graphs, molecules)",
                    "Certified safe image generation (C2PA provenance)",
                    "Diffusion world models for RL and robotics",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: px(12), color: V.muted }}>
                      <span style={{ color: ORG, fontWeight: 700 }}>→</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S12: GAME ── */}
        <div ref={R(12)} style={{ background: V.cream }}>
          <div style={{ ...LSEC }}>
            {STag("Section 12 · Mini Game", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>🎮 Noise to Image — Watch Diffusion Happen</h2>
            <NoiseToImageGame />
          </div>
        </div>

        {/* ── S13: PROJECT ── */}
        <div ref={R(13)} style={{ background: V.paper }}>
          <div style={{ ...LSEC }}>
            {STag("Section 13 · Mini Project", ORG)}
            <h2 style={{ ...LH2, color: V.ink, marginBottom: px(16) }}>🎨 Text-to-Image Generator</h2>
            <p style={{ ...LBODY, maxWidth: px(680), marginBottom: px(28) }}>
              Configure prompt, negative prompt, guidance scale, steps, and model.
              Watch the denoising progress step-by-step with realistic colour palette generation.
            </p>
            <TextToImageProject />
          </div>
        </div>

        {/* ── S14: INSIGHTS ── */}
        <div ref={R(14)} style={{ background: "#fff8f0" }}>
          <DiffusionTakeaways onBack={onBack} />
        </div>
      </>
    )}
  </NavPage>
);

export default DiffusionModelsPage;