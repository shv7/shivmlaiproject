import { useState, useEffect, useRef, useCallback } from "react";
import { T, px, lFlex, LCARD, LTAG, LH2, LBODY, LSEC, LBTN } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON 1 — WHAT IS AI — All Sub-Components
══════════════════════════════════════════════════════════════════ */

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


/* ══════════════════════════════════════════════════════════════════
   WHAT IS AI — Page Wrapper (exported)
══════════════════════════════════════════════════════════════════ */

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

export default WhatIsAIPage;
