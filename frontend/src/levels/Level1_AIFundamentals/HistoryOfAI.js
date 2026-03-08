import { useState, useEffect, useRef } from "react";
import { T, px, LCARD, LTAG, LH2, LBODY, LSEC, LBTN } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON 2 — HISTORY OF AI — All Sub-Components
══════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════
   HISTORY OF AI — LESSON 2 — All Components
   Design: Deep navy + amber — editorial dark timeline aesthetic
═══════════════════════════════════════════════════════════════════ */

// ── History data ──────────────────────────────────────────────────

const HIST_TIMELINE = [
  { year:"350 BC", emoji:"🏛️", color:"#8b5cf6", label:"Aristotle", event:"Logic & Reasoning", desc:"Aristotle invents formal logic — the idea that you can reach true conclusions by following rules. AI would one day encode exactly this." },
  { year:"1843",   emoji:"👩‍💻", color:"#0d9488", label:"Ada Lovelace", event:"First Algorithm", desc:"Ada Lovelace writes the world's first computer algorithm. She imagines machines that could go far beyond arithmetic — composing music, playing chess." },
  { year:"1936",   emoji:"📜", color:"#0284c7", label:"Turing Machine", event:"Universal Computing", desc:"Alan Turing publishes 'On Computable Numbers' — proving that a single machine with the right instructions could compute anything computable." },
  { year:"1950",   emoji:"🧠", color:"#f59e0b", label:"Turing Test", event:"Can Machines Think?", desc:"Turing publishes 'Computing Machinery and Intelligence' and proposes the Turing Test — the gold standard for measuring machine intelligence." },
  { year:"1956",   emoji:"🎓", color:"#00d4ff", label:"Dartmouth",   event:"AI is Born", desc:"John McCarthy coins 'Artificial Intelligence' at the Dartmouth Conference. Six weeks of summer meetings launch a field that would change humanity." },
  { year:"1966",   emoji:"🤖", color:"#10b981", label:"ELIZA",       event:"First Chatbot", desc:"Joseph Weizenbaum creates ELIZA at MIT — a chatbot that simulates a therapist. People were so convinced it was real, it sparked debate about machine empathy." },
  { year:"1974",   emoji:"❄️", color:"#94a3b8", label:"AI Winter 1", event:"Funding Collapses", desc:"AI fails to live up to bold promises. The Lighthill Report devastates UK funding. DARPA cuts budgets. The first AI winter begins." },
  { year:"1980s",  emoji:"📋", color:"#f97316", label:"Expert Systems", event:"Rules Come Back", desc:"Rule-based Expert Systems briefly revive AI in corporations. They work for narrow tasks but are expensive, brittle, and impossible to scale." },
  { year:"1987",   emoji:"❄️", color:"#94a3b8", label:"AI Winter 2", event:"Second Collapse", desc:"Expert systems are overtaken by cheaper PCs. The Lisp machine market crashes. A second AI winter freezes the field for years." },
  { year:"1997",   emoji:"♟️", color:"#7c3aed", label:"Deep Blue",   event:"Chess Champion Falls", desc:"IBM's Deep Blue defeats chess world champion Garry Kasparov. AI proves it can beat humans at complex strategic reasoning — the world takes notice." },
  { year:"2006",   emoji:"🔥", color:"#e11d48", label:"Deep Learning", event:"Neural Nets Wake Up", desc:"Geoffrey Hinton publishes deep belief networks. Neural networks — once abandoned — finally work at scale. The deep learning revolution quietly begins." },
  { year:"2012",   emoji:"👁️", color:"#f59e0b", label:"AlexNet",    event:"ImageNet Breakthrough", desc:"AlexNet wins ImageNet by a historic 10% margin using deep CNNs and GPUs. Computer vision is transformed overnight. Everything changes." },
  { year:"2017",   emoji:"🔀", color:"#0d9488", label:"Transformers", event:"Attention is All You Need", desc:"Google Brain publishes 'Attention is All You Need'. The Transformer architecture is born. BERT, GPT, Claude — every modern AI descends from this paper." },
  { year:"2022",   emoji:"💬", color:"#00d4ff", label:"ChatGPT",    event:"AI Goes Mainstream", desc:"OpenAI releases ChatGPT. 100 million users in 2 months. AI stops being a niche research topic — it becomes part of everyday life for billions." },
  { year:"2024+",  emoji:"🚀", color:"#10b981", label:"AGI Race",   event:"The Frontier Opens", desc:"Anthropic, OpenAI, DeepMind, Google all race toward AGI. Multimodal models, AI agents, and reasoning systems emerge. The goal is in sight." },
];

const ERAS = [
  { id:"birth",    label:"Birth", emoji:"🌱", color:"#00d4ff", years:"1943–1969", title:"The Dawn", tagline:"Boundless hope, no limits.", desc:"Researchers believed AI was just around the corner. Marvin Minsky famously predicted a machine with human-level intelligence within a generation. Early programs like Logic Theorist proved mathematical theorems — it felt like magic." },
  { id:"winter1",  label:"Winter 1", emoji:"❄️", color:"#94a3b8", years:"1974–1980", title:"The First Freeze", tagline:"The hype collapses.", desc:"AI failed to scale. Translation systems were terrible. Robots couldn't navigate real rooms. Funding agencies grew frustrated and cut budgets. Researchers called it an 'AI winter' — progress frozen solid." },
  { id:"revival",  label:"Revival", emoji:"📋", color:"#f97316", years:"1980–1987", title:"Expert Systems", tagline:"Rules rule — briefly.", desc:"Companies like DEC built rule-based Expert Systems that encoded expert knowledge in IF-THEN logic. XCON saved DEC $40M per year. AI seemed useful — until the cost of maintaining thousands of rules became unbearable." },
  { id:"winter2",  label:"Winter 2", emoji:"❄️", color:"#64748b", years:"1987–1993", title:"The Second Freeze", tagline:"Even rules fail.", desc:"Desktop computers outperformed expensive Lisp machines. Expert systems became obsolete. The market collapsed. The UK and US both slashed AI budgets. A second winter — colder and longer than the first." },
  { id:"ml",       label:"ML Rise", emoji:"📊", color:"#7c3aed", years:"1993–2010", title:"Machine Learning", tagline:"Data beats rules.", desc:"Instead of programming rules, researchers taught machines to find rules in data. Support Vector Machines, Random Forests, and Bayesian Networks thrived. IBM Deep Blue beat Kasparov. The internet began generating the vast data AI needed." },
  { id:"dl",       label:"Deep Learning", emoji:"🧠", color:"#f59e0b", years:"2010–2020", title:"The Deep Learning Era", tagline:"Neural nets take over.", desc:"Hinton's deep learning + ImageNet + GPU computing created a perfect storm. AlexNet in 2012. AlphaGo in 2016. Transformers in 2017. AI began beating humans at perception, translation, and game-playing — one domain at a time." },
  { id:"modern",   label:"Modern AI", emoji:"🌍", color:"#10b981", years:"2020–Now", title:"Generative AI", tagline:"AI for everyone.", desc:"GPT-3 showed LLMs could write, code, and reason. DALL-E drew images. Stable Diffusion democratized art. ChatGPT reached 100M users in 60 days. AI entered offices, hospitals, schools, and living rooms worldwide." },
];

const AI_MYTHS = [
  { myth: "Researchers said: 'AI is 20 years away'", reality: "They've been saying this since 1956 — 70 years ago.", year: "1956" },
  { myth: "Marvin Minsky: 'The problem of AI is largely solved'", reality: "Within years, funding collapsed in the first AI winter.", year: "1970" },
  { myth: "'Expert Systems will replace human professionals'", reality: "They became too brittle and expensive to maintain.", year: "1985" },
  { myth: "'Deep learning is just another fad'", reality: "It became the foundation of every modern AI system.", year: "2010" },
];

// ── Section 1: History Hero ───────────────────────────────────────

const HistoryHero = ({ onBack }) => {
  const canvasRef = useRef();
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const stars = Array.from({ length: 120 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.3, phase: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.4 }));
    const nodes = [
      { x: 0.15, y: 0.6, label: "1950", col: "#f59e0b" }, { x: 0.28, y: 0.35, label: "1956", col: "#00d4ff" },
      { x: 0.42, y: 0.7, label: "1974", col: "#94a3b8" }, { x: 0.55, y: 0.3, label: "1997", col: "#7c3aed" },
      { x: 0.67, y: 0.65, label: "2012", col: "#f59e0b" }, { x: 0.80, y: 0.28, label: "2017", col: "#0d9488" },
      { x: 0.90, y: 0.6, label: "2022", col: "#10b981" },
    ];
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080d1a"; ctx.fillRect(0, 0, W, H);
      // stars
      stars.forEach(s => { const a = (Math.sin(t * s.speed + s.phase) + 1) / 2; ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${0.1 + a * 0.5})`; ctx.fill(); });
      // connecting line
      ctx.beginPath(); nodes.forEach((n, i) => i === 0 ? ctx.moveTo(n.x * W, n.y * H) : ctx.lineTo(n.x * W, n.y * H));
      ctx.strokeStyle = "rgba(245,158,11,0.25)"; ctx.lineWidth = 2; ctx.stroke();
      // nodes
      nodes.forEach(n => {
        const pulse = (Math.sin(t * 1.2 + n.x * 10) + 1) / 2;
        const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, 22 + pulse * 8);
        g.addColorStop(0, n.col + "cc"); g.addColorStop(1, n.col + "00");
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, 22 + pulse * 8, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        ctx.beginPath(); ctx.arc(n.x * W, n.y * H, 7, 0, Math.PI * 2); ctx.fillStyle = n.col; ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "bold 10px DM Sans,sans-serif"; ctx.textAlign = "center"; ctx.fillText(n.label, n.x * W, n.y * H + 22);
      });
      t += 0.012; requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section style={{ background: "linear-gradient(160deg, #080d1a 0%, #0d1525 60%, #0a1020 100%)", minHeight: "88vh", position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ maxWidth: px(1100), width: "100%", margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(60), alignItems: "center", position: "relative", zIndex: 1 }}>
        <div>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "7px 16px", color: "#64748b", cursor: "pointer", fontSize: 13, marginBottom: 24 }}>← Back to Roadmap</button>
          <div style={{ display: "inline-block", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(20) }}>📖 Lesson 2 of 7 · AI Fundamentals</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem,5.5vw,3.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: px(20) }}>
            History of<br /><span style={{ color: "#f59e0b" }}>Artificial</span><br />Intelligence
          </h1>
          <div style={{ width: px(60), height: px(4), background: "#f59e0b", borderRadius: px(2), marginBottom: px(24) }} />
          <p style={{ fontFamily: "'Lora',serif", fontSize: px(17), color: "#cbd5e1", lineHeight: 1.8, marginBottom: px(20) }}>
            <strong style={{ color: "#fff" }}>The simple version:</strong> Humans have dreamed of thinking machines for centuries. What started as a summer research project in 1956 became the most transformative technology in history.
          </p>
          <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: px(14), padding: "14px 20px", marginBottom: px(28) }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: px(12), marginBottom: px(6), letterSpacing: "1px" }}>💡 ANALOGY</div>
            <p style={{ fontFamily: "'Lora',serif", color: "#cbd5e1", margin: 0, fontSize: px(14), lineHeight: 1.7 }}>AI's history is like learning to ride a bike — lots of excited attempts, painful falls (the AI winters), then one day everything clicks and you never look back.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["70+ Years", "9 Sections", "Interactive", "Beginner"].map(l => <span key={l} style={{ background: "rgba(255,255,255,0.05)", borderRadius: px(20), padding: "4px 12px", fontSize: px(11), color: "#475569" }}>{l}</span>)}
          </div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: px(24), overflow: "hidden", height: px(380) }}>
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {/* The main canvas already covers the background — show a stats panel */}
          <div style={{ padding: px(28), height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ color: "#f59e0b", fontWeight: 700, fontSize: px(13), letterSpacing: "1px" }}>⏱ TIMELINE SNAPSHOT</div>
            {[["1950", "Turing asks: Can machines think?", "#f59e0b"],["1956", "AI officially born at Dartmouth", "#00d4ff"],["1974", "First AI Winter — funding collapses", "#94a3b8"],["1997", "Deep Blue beats chess champion", "#7c3aed"],["2012", "Deep learning breakthrough (AlexNet)", "#f59e0b"],["2022", "ChatGPT — AI goes mainstream", "#10b981"],].map(([y, t2, col]) => (
              <div key={y} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ minWidth: px(44), fontFamily: "monospace", fontSize: px(12), fontWeight: 700, color: col }}>{y}</div>
                <div style={{ fontSize: px(13), color: "#94a3b8", lineHeight: 1.4 }}>{t2}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 2: Early Ideas ────────────────────────────────────────

const EarlyIdeasSection = () => {
  const [active, setActive] = useState(0);
  const ideas = [
    { emoji: "🏛️", era: "350 BC", name: "Aristotle", color: "#8b5cf6", title: "Logic Machine", simple: "Aristotle invented formal logic — a set of rules for reaching true conclusions from true statements.", analogy: "Like a rulebook for thinking correctly. If A → B and B → C, then A → C. AI would one day encode these exact rules into code.", impact: "Without formal logic, computers can't reason. Every AI system that makes decisions uses logic at its core." },
    { emoji: "⚙️", era: "1843", name: "Ada Lovelace", color: "#0d9488", title: "First Programmer", simple: "Ada wrote the first algorithm — a step-by-step set of instructions for Babbage's mechanical Analytical Engine.", analogy: "Like writing the world's first recipe — not for food, but for computation. She imagined machines that could compose music and play chess.", impact: "She was the first to see that a machine could be general-purpose — not just a calculator, but a thinking tool." },
    { emoji: "📜", era: "1936", name: "Alan Turing", color: "#0284c7", title: "Universal Machine", simple: "Turing proved mathematically that a single, universal machine could simulate any computable process by reading instructions from tape.", analogy: "Like a single employee who, given the right manual, can do any job in the company — accounting, writing, design, anything.", impact: "This theoretical machine became the blueprint for every computer ever built. All software is 'Turing machine instructions'." },
    { emoji: "🧠", era: "1950", name: "Turing Test", color: "#f59e0b", title: "Can Machines Think?", simple: "Turing proposed: if a machine can have a text conversation so convincing that you can't tell it's not human — it's intelligent.", analogy: "Like judging a chef by the food they cook, not by watching them cook. Judge intelligence by its output, not its mechanism.", impact: "The Turing Test became the most famous benchmark in AI. ChatGPT arguably passes it today — 74 years later." },
  ];
  const item = ideas[active];
  return (
    <section style={{ background: "#faf7f2" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#8b5cf618", border: "1px solid #8b5cf655", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#8b5cf6", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 2</div>
          <h2 style={{ ...LH2, color: T.ink }}>Early Ideas of <span style={{ color: "#8b5cf6" }}>Intelligent Machines</span></h2>
          <p style={{ ...LBODY, maxWidth: px(580), margin: "16px auto 0" }}>Long before computers existed, humans were already dreaming of machines that could think. Here are the key ideas that laid the foundation.</p>
        </div>
        {/* era tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: px(32) }}>
          {ideas.map((idea, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ background: active === i ? idea.color : T.card, border: `1px solid ${active === i ? idea.color : T.border}`, borderRadius: px(12), padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: px(14), fontWeight: 700, color: active === i ? (idea.color === "#f59e0b" ? T.ink : "#fff") : T.muted, transition: "all 0.2s" }}>
              <span>{idea.emoji}</span> <span>{idea.era}</span>
            </button>
          ))}
        </div>
        {/* detail card */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: px(24) }}>
          <div style={{ ...LCARD, borderLeft: `4px solid ${item.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: px(20) }}>
              <div style={{ fontSize: px(48) }}>{item.emoji}</div>
              <div>
                <div style={{ display: "inline-block", background: item.color + "18", border: `1px solid ${item.color}55`, borderRadius: px(20), padding: "2px 12px", fontSize: px(11), fontWeight: 700, color: item.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{item.era} · {item.name}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: px(22), color: T.ink, marginTop: px(6) }}>{item.title}</h3>
              </div>
            </div>
            <p style={{ ...LBODY, fontSize: px(15), marginBottom: px(16) }}>{item.simple}</p>
            <div style={{ background: "#f0fdf9", border: `1px solid ${item.color}33`, borderRadius: px(12), padding: "14px 16px" }}>
              <div style={{ fontWeight: 700, fontSize: px(12), color: item.color, marginBottom: px(6) }}>😄 ANALOGY</div>
              <p style={{ ...LBODY, fontSize: px(14), margin: 0 }}>{item.analogy}</p>
            </div>
          </div>
          <div style={{ ...LCARD, background: item.color + "08", border: `1px solid ${item.color}33` }}>
            <div style={{ fontWeight: 700, fontSize: px(12), color: item.color, marginBottom: px(12), letterSpacing: "1px" }}>🌍 WHY IT MATTERED</div>
            <p style={{ ...LBODY, fontSize: px(15) }}>{item.impact}</p>
            <div style={{ marginTop: px(24), background: T.card, borderRadius: px(14), padding: "20px" }}>
              <div style={{ fontWeight: 700, fontSize: px(12), color: T.muted, marginBottom: px(10), letterSpacing: "1px" }}>THE CHAIN OF IDEAS</div>
              {["Aristotle: Logic rules", "Lovelace: Machines can compute anything", "Turing: Universal machines → Computers", "Turing Test: Judge by behavior"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: px(8) }}>
                  <div style={{ minWidth: px(22), height: px(22), borderRadius: "50%", background: item.color + "22", border: `1px solid ${item.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(11), color: item.color, fontWeight: 700 }}>{i + 1}</div>
                  <span style={{ ...LBODY, fontSize: px(13) }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 3: Birth of AI (1956) ────────────────────────────────

const BirthOfAISection = () => {
  const [revealed, setRevealed] = useState(false);
  const people = [
    { name: "John McCarthy", emoji: "🎓", role: "Coined 'Artificial Intelligence'", color: "#00d4ff" },
    { name: "Marvin Minsky", emoji: "🧠", role: "Neural network pioneer", color: "#7c3aed" },
    { name: "Claude Shannon", emoji: "📡", role: "Information theory founder", color: "#10b981" },
    { name: "Nathaniel Rochester", emoji: "💻", role: "IBM 701 architect", color: "#f59e0b" },
  ];
  return (
    <section style={{ background: "#080d1a" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#00d4ff18", border: "1px solid #00d4ff55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#00d4ff", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 3</div>
          <h2 style={{ ...LH2, color: "#fff" }}>Birth of <span style={{ color: "#00d4ff" }}>Artificial Intelligence</span></h2>
          <p style={{ ...LBODY, color: "#94a3b8", maxWidth: px(600), margin: "16px auto 0" }}>Summer 1956. A small group of visionaries gathered at Dartmouth College, New Hampshire, and officially started a field that would change history.</p>
        </div>

        {/* Dartmouth story card */}
        <div style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: px(24), padding: "40px 36px", marginBottom: px(32) }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(40), alignItems: "center" }}>
            <div>
              <div style={{ fontSize: px(56), marginBottom: px(16) }}>🎓</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: px(26), color: "#fff", marginBottom: px(16) }}>The Dartmouth Conference</h3>
              <p style={{ ...LBODY, color: "#94a3b8", marginBottom: px(16) }}>In the summer of 1956, John McCarthy organized a 6-week workshop at Dartmouth College. His proposal contained one of the boldest claims in academic history:</p>
              <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: px(14), padding: "16px 20px", marginBottom: px(20) }}>
                <p style={{ fontFamily: "'Lora',serif", color: "#fbbf24", fontSize: px(15), fontStyle: "italic", margin: 0 }}>"Every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it."</p>
                <div style={{ color: "#64748b", fontSize: px(12), marginTop: px(8) }}>— John McCarthy, Dartmouth Proposal, 1956</div>
              </div>
              <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14) }}>🧠 Translation: They believed human intelligence could be fully described in code. It was audacious. It was partly wrong. But it launched the most important field in history.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: px(12) }}>
              <div style={{ color: "#64748b", fontSize: px(12), fontWeight: 700, letterSpacing: "1px", marginBottom: px(4) }}>THE FOUNDING FATHERS</div>
              {people.map((p, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${p.color}33`, borderRadius: px(14), padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: px(28) }}>{p.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: p.color, fontSize: px(14) }}>{p.name}</div>
                    <div style={{ color: "#64748b", fontSize: px(12) }}>{p.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What they believed */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: px(16) }}>
          {[
            { emoji: "✅", title: "What they got right", items: ["AI needs symbolic reasoning", "Logic is central to intelligence", "Computers can simulate thought", "Collaboration across disciplines"], color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { emoji: "❌", title: "What they got wrong", items: ["Solved in one summer? No.", "Simple rules = intelligence? No.", "Intelligence is fully describable? Not quite.", "No need for data? Very wrong."], color: "#e11d48", bg: "rgba(225,29,72,0.08)" },
            { emoji: "🎯", title: "What they started", items: ["The first AI research labs", "Government funding for AI", "Published AI journals & conferences", "A 70-year scientific journey"], color: "#00d4ff", bg: "rgba(0,212,255,0.08)" },
          ].map((col, i) => (
            <div key={i} style={{ background: col.bg, border: `1px solid ${col.color}33`, borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontSize: px(28), marginBottom: px(10) }}>{col.emoji}</div>
              <div style={{ fontWeight: 700, color: col.color, fontSize: px(14), marginBottom: px(12) }}>{col.title}</div>
              {col.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 8, marginBottom: px(8) }}>
                  <div style={{ color: col.color, fontSize: px(14), marginTop: 2, flexShrink: 0 }}>{col.emoji === "✅" ? "✓" : col.emoji === "❌" ? "✗" : "→"}</div>
                  <span style={{ ...LBODY, fontSize: px(13), color: "#94a3b8" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div style={{ marginTop: px(32), background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: px(16), padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={{ fontSize: px(28) }}>💡</span>
          <div>
            <div style={{ fontWeight: 700, color: "#f59e0b", marginBottom: px(6) }}>Key Insight: The Name Matters</div>
            <p style={{ ...LBODY, color: "#94a3b8", margin: 0, fontSize: px(14) }}>By giving the field a name — "Artificial Intelligence" — McCarthy did something powerful. It created an identity, attracted funding, students, and press. A name is a magnet for belief. The Dartmouth Conference didn't solve AI. It <em>started the conversation</em> that's still happening today.</p>
          </div>
        </div>
        {!revealed && <div style={{ textAlign: "center", marginTop: px(24) }}><button onClick={() => setRevealed(true)} style={{ background: "#00d4ff22", border: "1px solid #00d4ff44", borderRadius: 10, padding: "10px 24px", color: "#00d4ff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>🔍 What happened next? →</button></div>}
        {revealed && <div style={{ marginTop: px(20), ...LCARD, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.2)" }}><div style={{ fontWeight: 700, color: "#00d4ff", marginBottom: px(8) }}>What happened next:</div><p style={{ ...LBODY, margin: 0, color: "#94a3b8", fontSize: px(14) }}>Early programs like the Logic Theorist proved mathematical theorems. The General Problem Solver could solve any well-defined problem in theory. Researchers were euphoric. Governments poured money in. Everyone believed AGI was just around the corner — perhaps 20 years away. They were wrong. But they were pointing in the right direction.</p></div>}
      </div>
    </section>
  );
};

// ── Section 4: Early Optimism ─────────────────────────────────────

const EarlyOptimismSection = () => (
  <section style={{ background: "#faf7f2" }}>
    <div style={LSEC}>
      <div style={{ textAlign: "center", marginBottom: px(48) }}>
        <div style={{ display: "inline-block", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 4</div>
        <h2 style={{ ...LH2, color: T.ink }}>Early <span style={{ color: "#f59e0b" }}>Optimism</span> (1956–1974)</h2>
        <p style={{ ...LBODY, maxWidth: px(580), margin: "16px auto 0" }}>The early AI researchers were like explorers who'd just found a new continent — full of excitement, convinced the riches were just over the next hill.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(24), marginBottom: px(32) }}>
        <div style={{ ...LCARD }}>
          <div style={{ fontWeight: 700, fontSize: px(13), color: T.muted, marginBottom: px(16), letterSpacing: "1px" }}>THE BOLD PREDICTIONS</div>
          {AI_MYTHS.slice(0, 2).map((m, i) => (
            <div key={i} style={{ borderLeft: `3px solid #f59e0b`, paddingLeft: px(16), marginBottom: px(20) }}>
              <div style={{ fontWeight: 700, color: T.ink, fontSize: px(14), marginBottom: px(6) }}>"{m.myth}" — {m.year}</div>
              <div style={{ ...LBODY, fontSize: px(13), color: T.muted }}>Reality: {m.reality}</div>
            </div>
          ))}
        </div>
        <div style={{ ...LCARD }}>
          <div style={{ fontWeight: 700, fontSize: px(13), color: T.muted, marginBottom: px(16), letterSpacing: "1px" }}>REAL EARLY ACHIEVEMENTS</div>
          {[
            { emoji: "🔢", title: "Logic Theorist (1955)", desc: "Proved 38 of 52 theorems from Principia Mathematica — better than some humans!", color: "#7c3aed" },
            { emoji: "🗣️", title: "ELIZA (1966)", desc: "MIT chatbot that fooled people into thinking they were talking to a real therapist.", color: "#0d9488" },
            { emoji: "🎮", title: "Checkers AI (1959)", desc: "Arthur Samuel's program taught itself checkers by playing thousands of games — early machine learning!", color: "#f59e0b" },
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: px(16) }}>
              <div style={{ fontSize: px(28) }}>{a.emoji}</div>
              <div><div style={{ fontWeight: 700, color: a.color, fontSize: px(13) }}>{a.title}</div><div style={{ ...LBODY, fontSize: px(13) }}>{a.desc}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...LCARD, background: "#fffbeb", borderLeft: `4px solid #f59e0b` }}>
        <strong style={{ color: "#d97706" }}>🤔 Why were they so optimistic?</strong>
        <p style={{ ...LBODY, margin: "10px 0 0", fontSize: px(15) }}>Early programs worked on <em>toy problems</em> — puzzles with simple rules and clear answers. Researchers assumed scaling up would solve everything. But the real world is messy, ambiguous, and full of exceptions. The gap between "solving puzzles" and "understanding language" turned out to be enormous.</p>
      </div>
    </div>
  </section>
);

// ── Section 5: AI Winters ─────────────────────────────────────────

const AIWintersSection = () => {
  const [activeWinter, setActiveWinter] = useState(0);
  const winters = [
    {
      num: 1, years: "1974–1980", emoji: "❄️", title: "The First AI Winter",
      cause: "AI programs worked great on small toy problems but completely failed to scale. A chess program couldn't write a poem. A translation system that handled French couldn't handle Russian. Every AI was a specialist for one tiny thing.",
      trigger: "The UK government commissioned the 'Lighthill Report' in 1973. James Lighthill reviewed all AI research and concluded it was failing to deliver on its promises. Funding was cut dramatically across the UK and US.",
      analogy: "Imagine funding a startup that promised to cure all diseases — and then discovering they could only cure one rare condition. Investors would leave. That's what happened to AI funding.",
      lesson: "AI needed more than clever rules. It needed data, better algorithms, and computers far more powerful than existed at the time.",
    },
    {
      num: 2, years: "1987–1993", emoji: "🥶", title: "The Second AI Winter",
      cause: "Expert Systems — AI powered by thousands of hand-written IF-THEN rules — briefly worked in corporations. XCON saved DEC $40M per year configuring computers. But maintaining those rules was a nightmare. When conditions changed, the rules broke.",
      trigger: "Desktop computers became dramatically cheaper and more powerful than specialized 'Lisp machines' that AI ran on. Companies abandoned expensive AI hardware. The market collapsed almost overnight.",
      analogy: "Like building a massive encyclopedia by hand — great until someone invents Wikipedia. Expert systems were Wikipedia's predecessor, and they couldn't adapt.",
      lesson: "Hand-crafted rules can't capture the full complexity of the world. AI needed to learn from data — not be programmed by hand.",
    },
  ];
  const w = winters[activeWinter];
  return (
    <section style={{ background: "#0d1525" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#94a3b818", border: "1px solid #94a3b855", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#94a3b8", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 5</div>
          <h2 style={{ ...LH2, color: "#fff" }}>The AI <span style={{ color: "#94a3b8" }}>Winters</span></h2>
          <p style={{ ...LBODY, color: "#64748b", maxWidth: px(580), margin: "16px auto 0" }}>Not once but twice, AI research froze solid. The promises were too big, the results too small, and the money ran out. These winters shaped everything that came after.</p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: px(32) }}>
          {winters.map((win, i) => (
            <button key={i} onClick={() => setActiveWinter(i)} style={{ flex: 1, maxWidth: px(280), background: activeWinter === i ? "rgba(148,163,184,0.15)" : "rgba(255,255,255,0.03)", border: `2px solid ${activeWinter === i ? "#94a3b8" : "rgba(255,255,255,0.08)"}`, borderRadius: px(16), padding: "18px 20px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <div style={{ fontSize: px(32), marginBottom: px(8) }}>{win.emoji}</div>
              <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: px(15) }}>{win.title}</div>
              <div style={{ color: "#64748b", fontSize: px(13) }}>{win.years}</div>
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(20) }}>
          <div style={{ background: "rgba(148,163,184,0.06)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: px(20), padding: px(28) }}>
            <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: px(13), marginBottom: px(16), letterSpacing: "1px" }}>❄️ WHAT CAUSED IT</div>
            <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(15), marginBottom: px(20) }}>{w.cause}</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: px(16) }}>
              <div style={{ fontWeight: 700, color: "#64748b", fontSize: px(12), marginBottom: px(8) }}>TRIGGER EVENT</div>
              <p style={{ ...LBODY, color: "#64748b", fontSize: px(14) }}>{w.trigger}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: px(16) }}>
            <div style={{ background: "rgba(148,163,184,0.04)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>😄 SIMPLE ANALOGY</div>
              <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14), fontStyle: "italic" }}>"{w.analogy}"</p>
            </div>
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>💡 LESSON LEARNED</div>
              <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14) }}>{w.lesson}</p>
            </div>
            <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontWeight: 700, color: "#10b981", fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>🔥 THE SILVER LINING</div>
              <p style={{ ...LBODY, color: "#64748b", fontSize: px(14) }}>Winters forced researchers to be honest. The hype died, but the real science survived. Every winter was followed by a stronger revival — because the survivors were working on the right problems.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 6: ML Revolution ──────────────────────────────────────

const MLRevolutionSection = () => {
  const [hovered, setHovered] = useState(null);
  const pillars = [
    { emoji: "📦", title: "Data", color: "#00d4ff", desc: "The internet created an ocean of data — images, text, clicks, purchases. AI suddenly had fuel.", example: "ImageNet: 14 million labelled images. Wikipedia: 6M+ articles. All freely available." },
    { emoji: "⚡", title: "Computing Power", color: "#7c3aed", desc: "GPUs (graphics cards) turned out to be perfect for neural networks — 1000x faster than regular CPUs for matrix math.", example: "A modern GPU can do 10 trillion calculations per second. The first AI programs ran on machines that did millions." },
    { emoji: "🧮", title: "Better Algorithms", color: "#10b981", desc: "New approaches like Support Vector Machines, Random Forests, and Gradient Boosting solved real problems more reliably.", example: "SVM was used in early email spam filters. Random Forests are still used in medicine and finance today." },
    { emoji: "🌐", title: "Open Source", color: "#f59e0b", desc: "Researchers started sharing code freely. PyTorch, TensorFlow, scikit-learn made AI accessible to anyone with a laptop.", example: "Hugging Face hosts 500,000+ free AI models. Any programmer can use them in 3 lines of code." },
  ];
  return (
    <section style={{ background: "#faf7f2" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#7c3aed18", border: "1px solid #7c3aed55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#7c3aed", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 6</div>
          <h2 style={{ ...LH2, color: T.ink }}>The Machine Learning <span style={{ color: "#7c3aed" }}>Revolution</span></h2>
          <p style={{ ...LBODY, maxWidth: px(600), margin: "16px auto 0" }}>After two winters, AI finally found the formula. Not rules. Not logic. Just three things working together perfectly.</p>
        </div>
        {/* 3 pillars */}
        <div style={{ ...LCARD, background: "#f5f3ff", border: "2px solid #7c3aed33", textAlign: "center", padding: "32px", marginBottom: px(32) }}>
          <div style={{ fontFamily: "monospace", fontSize: px(22), color: "#7c3aed", fontWeight: 900, marginBottom: px(8) }}>Data + Algorithms + Computing = 🚀</div>
          <p style={{ ...LBODY, margin: 0, fontSize: px(15) }}>The convergence of big data, better math, and powerful hardware created the perfect storm for AI's comeback. This time — it stuck.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: px(20), marginBottom: px(32) }}>
          {pillars.map((p, i) => (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{ ...LCARD, borderTop: `4px solid ${p.color}`, cursor: "pointer", transition: "all 0.2s", transform: hovered === i ? "translateY(-4px)" : "none", boxShadow: hovered === i ? `0 12px 32px ${p.color}22` : "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div style={{ fontSize: px(40), marginBottom: px(12) }}>{p.emoji}</div>
              <h3 style={{ fontWeight: 800, color: p.color, fontSize: px(20), marginBottom: px(10) }}>{p.title}</h3>
              <p style={{ ...LBODY, fontSize: px(14), marginBottom: px(14) }}>{p.desc}</p>
              <div style={{ background: p.color + "0f", border: `1px solid ${p.color}33`, borderRadius: px(10), padding: "10px 14px", fontFamily: "monospace", fontSize: px(12), color: p.color }}>📌 {p.example}</div>
            </div>
          ))}
        </div>
        {/* Key events */}
        <div style={{ ...LCARD }}>
          <div style={{ fontWeight: 700, color: T.muted, fontSize: px(13), marginBottom: px(20), letterSpacing: "1px" }}>KEY ML MILESTONES</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: px(16) }}>
            {[["1997 ♟️", "Deep Blue beats Kasparov", "#7c3aed"], ["2002 🎯", "Netflix Prize: ML for recommendations", "#0284c7"], ["2006 🔥", "Hinton revives deep neural nets", "#e11d48"], ["2009 📦", "ImageNet dataset released", "#f59e0b"]].map(([yr, ev, col]) => (
              <div key={yr} style={{ background: col + "0f", border: `1px solid ${col}33`, borderRadius: px(12), padding: "14px 16px" }}>
                <div style={{ fontFamily: "monospace", fontWeight: 700, color: col, fontSize: px(13), marginBottom: px(6) }}>{yr}</div>
                <div style={{ ...LBODY, fontSize: px(13) }}>{ev}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 7: Deep Learning Breakthrough ────────────────────────

const DeepLearningSection = () => {
  const [activeBreakthrough, setActiveBreakthrough] = useState(0);
  const breakthroughs = [
    { year: "2006", emoji: "🔥", title: "Hinton's Deep Belief Networks", color: "#e11d48", story: "Geoffrey Hinton had been working on neural networks for decades while most researchers abandoned them. In 2006, he published a paper showing how to train deep neural networks layer by layer — a technique called pre-training. It was the spark that lit the fire.", analogy: "Like teaching someone to walk before they run. Hinton taught networks one layer at a time, then connected them. Suddenly deep networks worked.", impact: "Neural networks went from academic curiosity to the most powerful AI technique ever discovered." },
    { year: "2012", emoji: "👁️", title: "AlexNet & ImageNet", color: "#f59e0b", story: "The ImageNet challenge asked AI to classify 1.2 million images into 1,000 categories. Previous methods got ~26% error. Then Alex Krizhevsky, Ilya Sutskever, and Geoffrey Hinton entered AlexNet. Error: 15.3%. The runner-up: 26.2%. A 10% gap. The AI world went into shock.", analogy: "Imagine a cooking competition where every chef scores 70/100 — then one newcomer scores 93/100. Everyone's recipe book became irrelevant overnight.", impact: "Every major tech company immediately pivoted to deep learning. Google, Facebook, Microsoft, Apple — all hired deep learning researchers at any cost." },
    { year: "2014", emoji: "🎨", title: "GANs — Generating Fake Images", color: "#7c3aed", story: "Ian Goodfellow invented Generative Adversarial Networks while arguing with a colleague at a bar. Two neural networks fight each other — one generates fake images, one tries to detect fakes. As they compete, both get better. The result: photorealistic fake faces.", analogy: "Like a counterfeit artist and a detective in a training loop. The artist gets better because the detective gets better. Both improve each other.", impact: "GANs created deepfakes, AI art, and image synthesis. Every AI image generator today is a descendant of this pub-napkin idea." },
    { year: "2016", emoji: "♟️", title: "AlphaGo Defeats World Champion", color: "#0d9488", story: "Go is considered the most complex board game humans play — more possible positions than atoms in the universe. Experts said AI was 10 years from beating humans. AlphaGo beat 18-time world champion Lee Sedol 4-1. It invented moves humans had never considered in 2,500 years of Go.", analogy: "Imagine a child learning to play chess — then inventing moves no grandmaster ever thought of. AlphaGo didn't just beat humans. It surpassed human understanding of the game.", impact: "Proved AI could handle intuition and creativity — not just brute force. Reinforcement learning became a mainstream research direction." },
    { year: "2017", emoji: "🔀", title: "The Transformer Paper", color: "#00d4ff", story: "'Attention is All You Need' — published by 8 Google researchers — introduced the Transformer architecture. Instead of processing sequences step by step (like RNNs), it processes everything at once using 'attention' — weighting how much each word relates to every other word.", analogy: "Reading a sentence and instantly understanding how every word relates to every other word simultaneously — vs. reading one word at a time and forgetting earlier words.", impact: "BERT, GPT-1, GPT-2, GPT-3, GPT-4, Claude, Gemini, LLaMA — every major language model is built on this architecture. It's the most important ML paper of the decade." },
  ];
  const b = breakthroughs[activeBreakthrough];
  return (
    <section style={{ background: "#080d1a" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 7</div>
          <h2 style={{ ...LH2, color: "#fff" }}>The Deep Learning <span style={{ color: "#f59e0b" }}>Breakthrough</span></h2>
          <p style={{ ...LBODY, color: "#64748b", maxWidth: px(600), margin: "16px auto 0" }}>Five discoveries in eleven years completely rewrote what AI could do. Click each one to hear its story.</p>
        </div>
        {/* breakthrough tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: px(32) }}>
          {breakthroughs.map((br, i) => (
            <button key={i} onClick={() => setActiveBreakthrough(i)} style={{ background: activeBreakthrough === i ? br.color + "22" : "rgba(255,255,255,0.04)", border: `2px solid ${activeBreakthrough === i ? br.color : "rgba(255,255,255,0.08)"}`, borderRadius: px(12), padding: "10px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.2s", minWidth: px(80) }}>
              <span style={{ fontSize: px(24) }}>{br.emoji}</span>
              <span style={{ fontSize: px(11), fontWeight: 700, color: activeBreakthrough === i ? br.color : "#64748b" }}>{br.year}</span>
            </button>
          ))}
        </div>
        {/* story card */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: px(24) }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: `2px solid ${b.color}44`, borderRadius: px(24), padding: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: px(20) }}>
              <div style={{ fontSize: px(52) }}>{b.emoji}</div>
              <div>
                <div style={{ display: "inline-block", background: b.color + "22", border: `1px solid ${b.color}55`, borderRadius: px(20), padding: "2px 12px", fontSize: px(11), fontWeight: 700, color: b.color, letterSpacing: "1.5px", textTransform: "uppercase" }}>{b.year}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: px(22), marginTop: px(6) }}>{b.title}</h3>
              </div>
            </div>
            <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(15) }}>{b.story}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: px(16) }}>
            <div style={{ background: b.color + "0f", border: `1px solid ${b.color}33`, borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontWeight: 700, color: b.color, fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>😄 ANALOGY</div>
              <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14), fontStyle: "italic" }}>"{b.analogy}"</p>
            </div>
            <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: px(16), padding: px(20) }}>
              <div style={{ fontWeight: 700, color: "#f59e0b", fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>🌍 REAL IMPACT</div>
              <p style={{ ...LBODY, color: "#94a3b8", fontSize: px(14) }}>{b.impact}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 8: Modern AI Era ──────────────────────────────────────

const ModernAISection = () => {
  const [activeModel, setActiveModel] = useState(0);
  const models = [
    { name: "GPT-3 (2020)", emoji: "✍️", color: "#10b981", params: "175B params", maker: "OpenAI", what: "The first model that could write essays, code, translate, and answer questions — all without fine-tuning. Just ask it.", breakthrough: "Showed that scale works. Bigger model + more data = emergent abilities nobody programmed.", analogy: "Like a student who learned from every book ever written and can discuss any topic without studying it specifically." },
    { name: "DALL-E (2021)", emoji: "🎨", color: "#7c3aed", params: "12B params", maker: "OpenAI", what: "Type a description, get a photorealistic image. 'A cat wearing astronaut gear on the moon' — instantly generated.", breakthrough: "AI crossed into creativity. It could make art, illustrations, and product images from scratch.", analogy: "Like hiring an artist who can draw anything you describe, in any style, in 3 seconds." },
    { name: "AlphaFold (2021)", emoji: "🧬", color: "#0d9488", params: "~21B params", maker: "DeepMind", what: "Solved a 50-year-old biology problem: predicting the 3D structure of proteins from their amino acid sequences.", breakthrough: "Modelled 200M+ protein structures. Decades of drug discovery work done in months. Literally changing medicine.", analogy: "Like instantly knowing how a Lego set looks assembled, just by reading the bag of pieces." },
    { name: "ChatGPT (2022)", emoji: "💬", color: "#00d4ff", params: "GPT-3.5 base", maker: "OpenAI", what: "GPT-3 tuned with human feedback (RLHF) to follow instructions, refuse harmful requests, and have conversations.", breakthrough: "100 million users in 60 days — the fastest product adoption in history. AI entered everyday life.", analogy: "Like giving everyone a brilliant personal assistant who never sleeps, charges nothing, and knows almost everything." },
    { name: "Claude & Gemini (2023–24)", emoji: "🤝", color: "#f59e0b", params: "Unknown", maker: "Anthropic & Google", what: "Multimodal AI that handles text, images, code, documents, and audio. Claude focuses on safety and reasoning. Gemini on scale.", breakthrough: "AI became a platform — not just a chatbot. Agents, tools, long context, and reasoning brought AI closer to AGI.", analogy: "Like upgrading from a calculator to a full research team that can read, write, plan, and execute tasks." },
  ];
  const m = models[activeModel];
  return (
    <section style={{ background: "#f0ead8" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#10b98118", border: "1px solid #10b98155", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#10b981", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 8</div>
          <h2 style={{ ...LH2, color: T.ink }}>The <span style={{ color: "#10b981" }}>Modern AI</span> Era</h2>
          <p style={{ ...LBODY, maxWidth: px(600), margin: "16px auto 0" }}>2020–Now. The decade when AI stopped being a research topic and became something billions of people use every single day.</p>
        </div>
        {/* model tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: px(32) }}>
          {models.map((mod, i) => (
            <button key={i} onClick={() => setActiveModel(i)} style={{ background: activeModel === i ? mod.color : T.card, border: `1px solid ${activeModel === i ? mod.color : T.border}`, borderRadius: px(12), padding: "10px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: px(13), fontWeight: 700, color: activeModel === i ? (mod.color === "#f59e0b" ? T.ink : "#fff") : T.muted, transition: "all 0.2s" }}>
              <span>{mod.emoji}</span><span style={{ whiteSpace: "nowrap" }}>{mod.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
        {/* detail */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: px(24) }}>
          <div style={{ ...LCARD, borderLeft: `4px solid ${m.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: px(20) }}>
              <div style={{ fontSize: px(52) }}>{m.emoji}</div>
              <div>
                <div style={{ display: "inline-block", background: m.color + "18", border: `1px solid ${m.color}44`, borderRadius: px(20), padding: "2px 12px", fontSize: px(11), fontWeight: 700, color: m.color, letterSpacing: "1px", textTransform: "uppercase" }}>{m.maker} · {m.params}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: px(22), color: T.ink, marginTop: px(6) }}>{m.name}</h3>
              </div>
            </div>
            <p style={{ ...LBODY, fontSize: px(15), marginBottom: px(16) }}>{m.what}</p>
            <p style={{ ...LBODY, fontSize: px(14), color: T.muted }}><strong style={{ color: T.ink }}>Key breakthrough:</strong> {m.breakthrough}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: px(16) }}>
            <div style={{ ...LCARD, background: m.color + "0a", border: `1px solid ${m.color}33` }}>
              <div style={{ fontWeight: 700, color: m.color, fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>😄 ANALOGY</div>
              <p style={{ ...LBODY, fontSize: px(14), fontStyle: "italic", margin: 0 }}>"{m.analogy}"</p>
            </div>
            <div style={{ ...LCARD, background: "#fffbeb", border: "1px solid rgba(245,158,11,0.3)" }}>
              <div style={{ fontWeight: 700, color: "#d97706", fontSize: px(12), marginBottom: px(10), letterSpacing: "1px" }}>📊 THE SCALE</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Users", "100M+ using AI weekly"], ["Models", "500,000+ on HuggingFace"], ["Investment", "$100B+ in 2024"], ["Growth", "Fastest tech adoption ever"]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: px(13) }}>
                    <span style={{ color: T.muted }}>{k}</span>
                    <span style={{ fontWeight: 700, color: T.ink }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Section 9: Path to AGI ────────────────────────────────────────

const PathToAGISection = ({ onBack }) => {
  const [checked, setChecked] = useState({});
  const toggle = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));
  const score = Object.values(checked).filter(Boolean).length;

  const takeaways = [
    { emoji: "🌱", text: "AI started with a bold idea in 1956: that intelligence can be described in code.", color: "#10b981" },
    { emoji: "❄️", text: "Two AI winters proved that hype without results kills funding — and that matters.", color: "#94a3b8" },
    { emoji: "📊", text: "Machine Learning beat rule-based AI because data > hand-crafted rules.", color: "#7c3aed" },
    { emoji: "🧠", text: "Deep Learning + GPUs + Big Data = the perfect storm that changed everything.", color: "#f59e0b" },
    { emoji: "🔀", text: "The Transformer (2017) is the most important AI paper in a decade.", color: "#0d9488" },
    { emoji: "💬", text: "ChatGPT made AI real for billions of people — the biggest product launch in history.", color: "#00d4ff" },
    { emoji: "🚀", text: "Every breakthrough in AI history has gotten us closer to AGI — and the pace is accelerating.", color: "#e11d48" },
  ];

  return (
    <section style={{ background: "#faf7f2" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(48) }}>
          <div style={{ display: "inline-block", background: "#e11d4818", border: "1px solid #e11d4855", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#e11d48", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Section 9</div>
          <h2 style={{ ...LH2, color: T.ink }}>The Path Toward <span style={{ color: "#e11d48" }}>AGI</span></h2>
          <p style={{ ...LBODY, maxWidth: px(600), margin: "16px auto 0" }}>Every breakthrough in AI history — logic, neural nets, deep learning, transformers — has been one step on a long staircase. Here's where that staircase is leading.</p>
        </div>

        {/* Staircase visual */}
        <div style={{ ...LCARD, background: "#fff", marginBottom: px(32), padding: "36px" }}>
          <div style={{ fontWeight: 700, color: T.muted, fontSize: px(12), marginBottom: px(20), letterSpacing: "1px", textAlign: "center" }}>THE STAIRCASE TO AGI</div>
          <div style={{ position: "relative", overflowX: "auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 0, minWidth: px(640), height: px(220) }}>
              {[
                { label: "Logic", era: "1950s", height: 40, color: "#8b5cf6" },
                { label: "Chatbots", era: "1966", height: 65, color: "#0284c7" },
                { label: "Expert Sys.", era: "1980s", height: 90, color: "#f97316" },
                { label: "ML", era: "1990s", height: 115, color: "#7c3aed" },
                { label: "Deep Learning", era: "2012", height: 148, color: "#f59e0b" },
                { label: "Transformers", era: "2017", height: 172, color: "#0d9488" },
                { label: "LLMs", era: "2022", height: 196, color: "#10b981" },
                { label: "AGI?", era: "Future", height: 220, color: "#e11d48", future: true },
              ].map((step, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                  <div style={{ fontSize: px(10), color: T.muted, textAlign: "center", height: px(28), display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.2 }}>{step.label}</div>
                  <div style={{ width: "80%", height: px(step.height), background: step.future ? `repeating-linear-gradient(45deg, ${step.color}33, ${step.color}33 4px, transparent 4px, transparent 8px)` : `linear-gradient(180deg, ${step.color}, ${step.color}88)`, border: `2px solid ${step.color}`, borderRadius: `${px(6)} ${px(6)} 0 0`, position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: px(6) }}>
                    {step.future && <span style={{ fontSize: px(14) }}>🚀</span>}
                  </div>
                  <div style={{ fontSize: px(9), color: step.future ? step.color : T.muted, fontWeight: step.future ? 700 : 400 }}>{step.era}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key insight box */}
        <div style={{ ...LCARD, background: "linear-gradient(135deg, #fff0f3, #ffe4e1)", border: "2px solid #e11d4833", marginBottom: px(32) }}>
          <div style={{ fontWeight: 700, color: "#e11d48", fontSize: px(13), marginBottom: px(12), letterSpacing: "1px" }}>🔑 THE BIG PICTURE — KEY INSIGHT</div>
          <p style={{ ...LBODY, fontSize: px(16), color: T.ink, marginBottom: px(12) }}>AI's history isn't a straight line — it's a story of <strong>oscillation between hope and despair</strong>, with each cycle building on lessons from the last.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: px(12) }}>
            {[["🌱 Idea", "Every revolution starts with one person asking 'what if?'"], ["❄️ Winter", "Failures aren't endings — they're course corrections."], ["🔥 Breakthrough", "The next breakthrough always comes from an unexpected direction."]].map(([t, d]) => (
              <div key={t} style={{ background: "rgba(255,255,255,0.7)", borderRadius: px(12), padding: "12px 14px" }}>
                <div style={{ fontWeight: 700, color: "#e11d48", fontSize: px(14), marginBottom: px(6) }}>{t}</div>
                <div style={{ ...LBODY, fontSize: px(13) }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Takeaways checklist */}
        <div style={{ marginBottom: px(32) }}>
          <div style={{ fontWeight: 700, color: T.muted, fontSize: px(13), marginBottom: px(16), letterSpacing: "1px" }}>✅ CHECK OFF WHAT YOU'VE UNDERSTOOD</div>
          {takeaways.map((t, i) => (
            <div key={i} onClick={() => toggle(i)} style={{ ...LCARD, display: "flex", alignItems: "center", gap: 16, cursor: "pointer", border: `2px solid ${checked[i] ? t.color : T.border}`, background: checked[i] ? t.color + "08" : T.card, transition: "all 0.2s", marginBottom: px(10) }}>
              <div style={{ width: px(26), height: px(26), borderRadius: "50%", border: `2px solid ${checked[i] ? t.color : T.border}`, background: checked[i] ? t.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: px(13), color: "#fff", flexShrink: 0 }}>{checked[i] ? "✓" : ""}</div>
              <div style={{ fontSize: px(22) }}>{t.emoji}</div>
              <p style={{ ...LBODY, margin: 0, fontSize: px(15), flex: 1, color: checked[i] ? T.ink : T.muted, fontWeight: checked[i] ? 600 : 400 }}>{t.text}</p>
            </div>
          ))}
        </div>

        {/* Progress + nav */}
        <div style={{ ...LCARD, textAlign: "center", padding: "36px" }}>
          <div style={{ fontSize: px(48), marginBottom: px(8) }}>{score === 7 ? "🎉" : score >= 4 ? "💪" : "📖"}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: px(26), color: T.ink, marginBottom: px(16) }}>{score}/7 insights mastered</div>
          <div style={{ background: T.cream, borderRadius: px(8), height: px(10), overflow: "hidden", maxWidth: px(400), margin: "0 auto 20px" }}>
            <div style={{ height: "100%", width: `${(score / 7) * 100}%`, background: `linear-gradient(90deg, #e11d48, #f59e0b)`, transition: "width 0.5s", borderRadius: px(8) }} />
          </div>
          {score === 7 ? (
            <div>
              <p style={{ ...LBODY, marginBottom: px(20) }}>🎓 You now understand the full history of AI — from Aristotle to AGI!</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <div style={{ background: "#f59e0b", borderRadius: px(10), padding: "12px 24px", fontWeight: 700, cursor: "pointer", color: T.ink }}>Next: AI vs ML vs DL →</div>
                <button onClick={onBack} style={{ border: `1px solid ${T.border}`, background: "none", borderRadius: px(10), padding: "12px 24px", color: T.muted, cursor: "pointer", fontSize: px(14) }}>← Back to Roadmap</button>
              </div>
            </div>
          ) : (
            <p style={{ ...LBODY, color: T.muted }}>{score === 0 ? "Click each insight above as you understand it 👆" : `Good progress! ${7 - score} more to master this lesson.`}</p>
          )}
        </div>

        {/* Lesson nav */}
        <div style={{ marginTop: px(32), display: "grid", gridTemplateColumns: "1fr 1fr", gap: px(20) }}>
          <div style={{ ...LCARD, display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={onBack}>
            <span style={{ fontSize: px(24) }}>←</span>
            <div><div style={{ fontSize: px(12), color: T.muted }}>Previous</div><div style={{ fontWeight: 700, color: T.ink }}>What is AI?</div></div>
          </div>
          <div style={{ ...LCARD, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, border: `2px solid #f59e0b`, cursor: "pointer" }}>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: px(12), color: T.muted }}>Next Lesson</div><div style={{ fontWeight: 700, color: T.ink }}>AI vs ML vs DL →</div></div>
            <span style={{ fontSize: px(24) }}>→</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Interactive Timeline Section ──────────────────────────────────

const InteractiveTimeline = () => {
  const [selected, setSelected] = useState(null);
  return (
    <section style={{ background: "#0d1525" }}>
      <div style={LSEC}>
        <div style={{ textAlign: "center", marginBottom: px(40) }}>
          <div style={{ display: "inline-block", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: px(16) }}>Visual Timeline</div>
          <h2 style={{ ...LH2, color: "#fff" }}>75 Years of AI — <span style={{ color: "#f59e0b" }}>Every Milestone</span></h2>
          <p style={{ ...LBODY, color: "#64748b", margin: "12px auto 0", maxWidth: px(500) }}>Click any milestone to read the full story behind it.</p>
        </div>
        <div style={{ position: "relative" }}>
          {/* center line */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: px(2), background: "linear-gradient(180deg, rgba(245,158,11,0.6), rgba(245,158,11,0.1))", transform: "translateX(-50%)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: px(20) }}>
            {HIST_TIMELINE.map((ev, i) => {
              const isLeft = i % 2 === 0;
              const isSelected = selected === i;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", alignItems: "center", gap: 0 }}>
                  {/* left side */}
                  <div style={{ paddingRight: px(24), textAlign: "right", opacity: isLeft ? 1 : 0, pointerEvents: isLeft ? "auto" : "none" }}>
                    {isLeft && (
                      <div onClick={() => setSelected(isSelected ? null : i)} style={{ display: "inline-block", background: isSelected ? ev.color + "22" : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? ev.color : "rgba(255,255,255,0.08)"}`, borderRadius: px(16), padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", maxWidth: px(360) }}>
                        <div style={{ fontFamily: "monospace", fontSize: px(12), color: ev.color, fontWeight: 700, marginBottom: px(4) }}>{ev.year} · {ev.emoji}</div>
                        <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: px(14), marginBottom: isSelected ? px(8) : 0 }}>{ev.event}</div>
                        {isSelected && <p style={{ ...LBODY, fontSize: px(13), color: "#94a3b8", margin: 0 }}>{ev.desc}</p>}
                      </div>
                    )}
                  </div>
                  {/* center dot */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: px(14), height: px(14), borderRadius: "50%", background: ev.color, boxShadow: `0 0 12px ${ev.color}88`, border: `2px solid ${ev.color}`, flexShrink: 0 }} />
                  </div>
                  {/* right side */}
                  <div style={{ paddingLeft: px(24), opacity: isLeft ? 0 : 1, pointerEvents: isLeft ? "none" : "auto" }}>
                    {!isLeft && (
                      <div onClick={() => setSelected(isSelected ? null : i)} style={{ display: "inline-block", background: isSelected ? ev.color + "22" : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? ev.color : "rgba(255,255,255,0.08)"}`, borderRadius: px(16), padding: "14px 18px", cursor: "pointer", transition: "all 0.2s", maxWidth: px(360) }}>
                        <div style={{ fontFamily: "monospace", fontSize: px(12), color: ev.color, fontWeight: 700, marginBottom: px(4) }}>{ev.year} · {ev.emoji}</div>
                        <div style={{ fontWeight: 700, color: "#e2e8f0", fontSize: px(14), marginBottom: isSelected ? px(8) : 0 }}>{ev.event}</div>
                        {isSelected && <p style={{ ...LBODY, fontSize: px(13), color: "#94a3b8", margin: 0 }}>{ev.desc}</p>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   HISTORY OF AI — PAGE WRAPPER
═══════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
   HISTORY OF AI — Page Wrapper (exported)
══════════════════════════════════════════════════════════════════ */

const HistoryOfAIPage = ({ onBack }) => {
  const [activeSecIdx, setActiveSecIdx] = useState(0);
  const sectionRefs = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { const idx = sectionRefs.current.indexOf(e.target); if (idx >= 0) setActiveSecIdx(idx); } }),
      { threshold: 0.25 }
    );
    sectionRefs.current.forEach(r => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);
  const refFor = (i) => el => { sectionRefs.current[i] = el; };
  const histSections = ["Hero", "Early Ideas", "Birth 1956", "Optimism", "Winters", "ML Revolution", "Deep Learning", "Modern AI", "Timeline", "AGI Path"];
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: T.paper, color: T.ink }}>
      {/* floating dot nav */}
      <div style={{ position: "fixed", right: 20, top: "50%", transform: "translateY(-50%)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {histSections.map((s, i) => <div key={i} title={s} style={{ width: i === activeSecIdx ? 10 : 7, height: i === activeSecIdx ? 10 : 7, borderRadius: "50%", background: i === activeSecIdx ? "#f59e0b" : "rgba(100,116,139,0.4)", cursor: "pointer", transition: "all 0.2s", boxShadow: i === activeSecIdx ? "0 0 8px #f59e0b" : "none" }} />)}
      </div>
      {/* breadcrumb */}
      <div style={{ background: T.ink, padding: "10px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, padding: 0 }}>ShivMLAI</button>
        <span style={{ color: "#334155" }}>›</span><span style={{ color: "#475569", fontSize: 13 }}>AI Fundamentals</span>
        <span style={{ color: "#334155" }}>›</span><span style={{ color: "#f59e0b", fontSize: 13, fontWeight: 600 }}>History of AI</span>
        <div style={{ marginLeft: "auto", display: "inline-block", background: "#f59e0b18", border: "1px solid #f59e0b55", borderRadius: px(20), padding: "2px 12px", fontSize: px(10), fontWeight: 700, color: "#f59e0b", letterSpacing: "1.5px", textTransform: "uppercase" }}>Lesson 2 of 7</div>
      </div>
      <div ref={refFor(0)}><HistoryHero onBack={onBack} /></div>
      <div ref={refFor(1)}><EarlyIdeasSection /></div>
      <div ref={refFor(2)}><BirthOfAISection /></div>
      <div ref={refFor(3)}><EarlyOptimismSection /></div>
      <div ref={refFor(4)}><AIWintersSection /></div>
      <div ref={refFor(5)}><MLRevolutionSection /></div>
      <div ref={refFor(6)}><DeepLearningSection /></div>
      <div ref={refFor(7)}><ModernAISection /></div>
      <div ref={refFor(8)}><InteractiveTimeline /></div>
      <div ref={refFor(9)}><PathToAGISection onBack={onBack} /></div>
      <footer style={{ background: T.ink, padding: "32px 24px", textAlign: "center", borderTop: "1px solid #1e293b" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: px(20), color: "#fff", marginBottom: px(6) }}>ShivML<span style={{ color: "#f59e0b" }}>AI</span>.com</div>
        <p style={{ color: "#475569", fontSize: px(13) }}>Learn Artificial Intelligence Visually · Created by <span style={{ color: "#f59e0b" }}>Shivesh Mishra</span></p>
      </footer>
    </div>
  );
};

export default HistoryOfAIPage;
