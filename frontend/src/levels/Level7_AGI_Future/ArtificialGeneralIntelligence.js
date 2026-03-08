import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — ARTIFICIAL GENERAL INTELLIGENCE
   Level 7 · AGI & Future of AI · Lesson 1 of 5
   Accent: Red #ef4444
══════════════════════════════════════════════════════════════════ */
const RED  = "#ef4444";
const RSE  = "#f87171";
const ORG  = "#f97316";
const AMB  = "#d97706";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const GRN  = "#059669";
const CYN  = "#0891b2";
const TEAL = "#0d9488";
const EMR  = "#10b981";
const SKY  = "#0284c7";

const Formula = ({ children, color = RED }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}44`, borderRadius:14, padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700, textAlign:"center", margin:`${px(14)} 0` }}>{children}</div>
);

/* ══════ HERO CANVAS ═════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    // Capability dimensions radiating from center
    const DIMS = [
      { label:"Reasoning",    angle:0 },
      { label:"Language",     angle:Math.PI/3 },
      { label:"Planning",     angle:2*Math.PI/3 },
      { label:"Learning",     angle:Math.PI },
      { label:"Creativity",   angle:4*Math.PI/3 },
      { label:"Perception",   angle:5*Math.PI/3 },
    ];

    const PROFILES = [
      { name:"Narrow AI",  color:"#3b82f6", vals:[0.3,0.9,0.2,0.2,0.1,0.5] },
      { name:"Human",      color:"#f59e0b", vals:[0.8,0.9,0.85,0.85,0.9,0.85] },
      { name:"AGI",        color:RED,       vals:[0.95,0.95,0.95,0.95,0.95,0.95] },
    ];

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#150000"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(239,68,68,0.04)"; ctx.lineWidth=1;
      for (let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for (let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      const cx=W/2, cy=H/2, R=Math.min(W,H)*0.37;

      // Grid rings
      [0.25,0.5,0.75,1.0].forEach(r => {
        ctx.beginPath();
        DIMS.forEach((d,i) => {
          const x=cx+Math.cos(d.angle)*R*r, y=cy+Math.sin(d.angle)*R*r;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.closePath();
        ctx.strokeStyle=RED+"22"; ctx.lineWidth=0.5; ctx.stroke();
      });

      // Axis lines
      DIMS.forEach(d => {
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(d.angle)*R, cy+Math.sin(d.angle)*R);
        ctx.strokeStyle=RED+"33"; ctx.lineWidth=0.8; ctx.stroke();
      });

      // Profiles
      const pulse = (Math.sin(t)+1)/2;
      PROFILES.forEach((prof,pi) => {
        ctx.beginPath();
        DIMS.forEach((d,i) => {
          const v = prof.vals[i]+(pi===2?pulse*0.03:0);
          const x=cx+Math.cos(d.angle)*R*v, y=cy+Math.sin(d.angle)*R*v;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.closePath();
        ctx.fillStyle=prof.color+(pi===2?"33":"18");
        ctx.strokeStyle=prof.color+(pi===2?"cc":"77");
        ctx.lineWidth=pi===2?2:1.5;
        ctx.fill(); ctx.stroke();
      });

      // Labels
      DIMS.forEach(d => {
        const lx=cx+Math.cos(d.angle)*(R+16), ly=cy+Math.sin(d.angle)*(R+16);
        ctx.font=`bold ${px(9)} sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillStyle=RED+"cc"; ctx.fillText(d.label,lx,ly);
      });

      // Legend
      PROFILES.forEach((p,i) => {
        ctx.fillStyle=p.color; ctx.fillRect(W*0.05, H*0.05+i*16, 10, 10);
        ctx.font=`${px(8)} sans-serif`; ctx.textAlign="left"; ctx.textBaseline="top";
        ctx.fillStyle=p.color+"cc"; ctx.fillText(p.name, W*0.05+14, H*0.05+i*16);
      });

      t+=0.02; raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}} />;
};

/* ══════ NARROW vs AGI CAPABILITY SPECTRUM ═══════════════════════ */
const CapabilitySpectrumViz = () => {
  const [hovered, setHovered] = useState(null);
  const SYSTEMS = [
    { name:"Deep Blue",          year:1997, breadth:2,  level:95, color:SKY,  tags:["Chess"],                       desc:"World-champion chess engine. Evaluates 200M positions/second. Completely unable to play checkers, let alone have a conversation." },
    { name:"AlphaGo",            year:2016, breadth:3,  level:98, color:CYN,  tags:["Go","Strategy"],               desc:"Surpassed human Go champions. Cannot play chess. Cannot describe why a move was good. No transfer to adjacent strategy games." },
    { name:"GPT-2",              year:2019, breadth:35, level:55, color:AMB,  tags:["Language","Writing"],          desc:"Impressive text generation. Gets confused on basic logic. Cannot browse the web. No reasoning trace." },
    { name:"GPT-4",              year:2023, breadth:65, level:80, color:ORG,  tags:["Reasoning","Code","Math","Language"], desc:"Passes bar exam, writes code, reasons multi-step. Still fails on novel physical reasoning, true causal understanding, long-horizon planning." },
    { name:"Claude 3 Opus",      year:2024, breadth:68, level:82, color:RED,  tags:["Reasoning","Code","Analysis"],  desc:"Strong multi-domain reasoning. Extended context. Nuanced analysis. Still a prediction engine — no persistent memory, no real understanding of consequences." },
    { name:"Gemini Ultra",       year:2024, breadth:70, level:83, color:VIO,  tags:["Multimodal","Reasoning"],       desc:"First model claimed to exceed human performance on MMLU. Multimodal. Still narrow in the sense that it cannot autonomously improve itself." },
    { name:"Theoretical AGI",    year:"?",  breadth:99, level:95, color:RED,  tags:["All domains","Self-improving"], desc:"Would match or exceed human-level performance across virtually all cognitive tasks. Can transfer learning between any domains. Solves novel problems with little data." },
  ];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:RED, marginBottom:8, fontSize:px(15)}}>
        📊 AI Capability Spectrum — From Narrow to General
      </div>
      <div style={{display:"flex", gap:px(4), marginBottom:16, alignItems:"flex-end", height:180, padding:"0 8px"}}>
        {SYSTEMS.map((s,i)=>(
          <div key={i} onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
            style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", cursor:"default"}}>
            <div style={{
              width:"100%", background: hovered===i ? s.color : s.color+"44",
              border:`2px solid ${s.color}`, borderRadius:"6px 6px 0 0",
              height:`${s.level}%`, transition:"all 0.2s", position:"relative"
            }}>
              {hovered===i && (
                <div style={{position:"absolute", bottom:"105%", left:"50%", transform:"translateX(-50%)", background:"#fff", border:`1px solid ${s.color}33`, borderRadius:8, padding:"8px 10px", minWidth:180, zIndex:10, boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
                  <div style={{fontWeight:800, color:s.color, fontSize:px(11), marginBottom:3}}>{s.name} ({s.year})</div>
                  <div style={{fontSize:px(10), color:V.muted, marginBottom:3}}>{s.desc}</div>
                  <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                    {s.tags.map(tag=><span key={tag} style={{background:s.color+"15",border:`1px solid ${s.color}33`,borderRadius:4,padding:"1px 5px",fontSize:px(9),color:s.color}}>{tag}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div style={{fontSize:px(8), color:s.color, textAlign:"center", marginTop:4, fontWeight:700, lineHeight:1.2}}>{s.name.split(" ")[0]}</div>
            <div style={{fontSize:px(8), color:V.muted, textAlign:"center"}}>{s.year}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:px(11),color:V.muted,marginTop:4}}>
        <span>Narrow AI →</span>
        <span style={{color:RED,fontWeight:700}}>← AGI →</span>
        <span>← Superintelligence</span>
      </div>
      <p style={{...LBODY, fontSize:px(12), marginTop:8, color:V.muted}}>Hover each bar for details. Height = task performance level. Width implies breadth of domains.</p>
    </div>
  );
};

/* ══════ HUMAN vs AI COMPARISON ══════════════════════════════════ */
const HumanVsAIComparison = () => {
  const [active, setActive] = useState(0);
  const DIMS = [
    { name:"Data efficiency", icon:"📊", human:95, ai:15, color:ORG,
      human_desc:"A child learns to recognise 'dog' from ~10 examples. Generalises to unfamiliar breeds, cartoons, shadows. Connects to sound, smell, behaviour — multimodal integration from birth.",
      ai_desc:"ResNet-50 requires 1.2M labelled ImageNet images. Still fails on rotated or occluded versions. GPT-4 trained on hundreds of billions of tokens. Few-shot learning helps but can't match human sample efficiency.",
      why:"Human brains arrive pre-wired with inductive biases shaped by millions of years of evolution. We don't learn physics from scratch — we inherit structure. AI trains tabula rasa on raw data." },
    { name:"Generalisation", icon:"🌐", human:90, ai:40, color:CYN,
      human_desc:"A plumber who learns chess can transfer spatial reasoning. A musician learning coding uses pattern recognition. Humans naturally apply knowledge across wildly different domains without explicit retraining.",
      ai_desc:"An image classifier trained on cats cannot classify dogs without retraining. Even GPT-4, while broad, fails unpredictably on novel task combinations it hasn't seen. Fine-tuning on one task can degrade performance on others.",
      why:"Human knowledge is stored in a deeply interconnected web of concepts. AI models store knowledge in weight matrices — there's no structured conceptual graph that makes transfer natural." },
    { name:"Common sense", icon:"🧩", human:92, ai:35, color:VIO,
      human_desc:"Humans understand that a glass will fall if pushed off a table, that you can't fit a car in a suitcase, that people feel pain. These physical and social intuitions are automatic and near-universal.",
      ai_desc:"LLMs fail on simple commonsense tests: 'if I move my cup to the left, which side is the handle now?' GPT-4 passed Winogrande at 87% but the benchmark itself has been partially memorised. Novel commonsense probes still trip SOTA models.",
      why:"Commonsense is grounded in embodied experience — interacting with the physical world. AI has only ever read descriptions of the world, never touched it. Words about 'cold' aren't the same as feeling cold." },
    { name:"Causal reasoning", icon:"🔗", human:85, ai:30, color:RED,
      human_desc:"Humans readily distinguish correlation from causation, reason about interventions ('what would happen if I did X?'), and build causal models from limited observations.",
      ai_desc:"LLMs are correlation machines by design — they learn P(next token | context). They cannot in principle answer 'what would have happened if...?' without explicit causal modelling. Barring specific training, they confuse correlation with causation.",
      why:"Pearl's do-calculus and counterfactual reasoning require a causal graph, not just a distribution. Transformers optimise for prediction, not causal graph discovery. A fundamental architectural mismatch." },
    { name:"Long-horizon planning", icon:"🗺️", human:80, ai:25, color:TEAL,
      human_desc:"Humans can plan careers spanning decades, coordinating thousands of micro-decisions in service of long-term goals. We model our future selves, anticipate how context will change, and update plans flexibly.",
      ai_desc:"GPT-4 degrades significantly on tasks requiring 20+ sequential reasoning steps. Agent frameworks (ReAct, Tree-of-Thoughts) help but success rates drop steeply with planning horizon. Context window limitations compound the problem.",
      why:"Working memory in AI is the context window — finite and non-persistent. Long-horizon planning requires maintaining goal state, tracking progress, updating plans, and recovering from failures over extended time." },
    { name:"Creativity", icon:"🎨", human:88, ai:55, color:AMB,
      human_desc:"Humans create genuinely novel works — not remixes of training data but conceptual leaps: Picasso inventing cubism, Einstein imagining riding a light beam. Creativity involves intentional violation of existing patterns.",
      ai_desc:"LLMs produce impressive 'creative' outputs but are fundamentally interpolating within their training distribution. They cannot conceive of something truly outside what humans have already done. The 'creativity' is recombination, not invention.",
      why:"True novelty requires a goal beyond 'produce text that sounds like human text'. It requires intentionality, aesthetic judgement, and the ability to recognise and celebrate departure from norms — capabilities not in the pretraining objective." },
  ];
  const d = DIMS[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:RED, marginBottom:8, fontSize:px(15)}}>
        🧠 Human vs AI — Cognitive Capability Deep Dive
      </div>
      <div style={{display:"flex", gap:6, marginBottom:18, flexWrap:"wrap"}}>
        {DIMS.map((dim,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1, minWidth:90,
            background:active===i?dim.color:dim.color+"0d",
            border:`2px solid ${active===i?dim.color:dim.color+"33"}`,
            borderRadius:10, padding:"7px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color:active===i?"#fff":dim.color, textAlign:"center"
          }}>{dim.icon}<br />{dim.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:14}}>
        {[["🧠 Human",d.human,AMB,d.human_desc],["🤖 AI (SOTA)",d.ai,d.color,d.ai_desc]].map(([label,val,col,desc])=>(
          <div key={label} style={{background:col+"0d",border:`2px solid ${col}33`,borderRadius:12,padding:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontWeight:800,color:col,fontSize:px(13)}}>{label}</span>
              <span style={{fontFamily:"monospace",fontWeight:800,color:col,fontSize:px(18)}}>{val}%</span>
            </div>
            <div style={{background:V.border,borderRadius:99,height:8,marginBottom:10}}>
              <div style={{background:col,borderRadius:99,height:8,width:`${val}%`,transition:"width 0.6s"}}/>
            </div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{desc}</p>
          </div>
        ))}
      </div>
      <div style={{background:d.color+"0d",border:`2px solid ${d.color}33`,borderRadius:12,padding:"12px 14px"}}>
        <div style={{fontWeight:700,color:d.color,marginBottom:4,fontSize:px(12)}}>🔬 Why the gap exists:</div>
        <p style={{...LBODY,fontSize:px(12),margin:0}}>{d.why}</p>
      </div>
    </div>
  );
};

/* ══════ COGNITIVE ARCHITECTURES ════════════════════════════════ */
const CognitiveArchitecturesExplorer = () => {
  const [active, setActive] = useState(0);
  const ARCHS = [
    { name:"SOAR", icon:"🔄", color:CYN, year:"1987",
      desc:"State, Operator, And Result — a cognitive architecture from John Laird, Allen Newell, and Paul Rosenbloom at Carnegie Mellon. SOAR models cognition as a problem space search: the agent has a current state, applies operators (actions), and moves towards a goal state. Impasses trigger learning.",
      components:["Long-term memory (procedural, semantic, episodic)","Short-term working memory","Universal subgoaling: any impasse spawns a sub-problem","Chunking: learned rules from sub-problem solutions","Production system: IF-THEN rules, thousands of them"],
      strength:"SOAR systems have been applied to game AI, robot control, and cognitive modelling. They handle multiple goals simultaneously and learn from problem-solving episodes. Remarkable for 1987 — anticipates many modern agent ideas.",
      weakness:"Brittle in unstructured environments. Knowledge engineering is labour-intensive — every domain needs hand-crafted production rules. Cannot learn effectively from raw sensory data. Symbol grounding problem unsolved.",
      agi_rel:"SOAR shows you can build a general-purpose problem solver — but the generality depends on how much knowledge you encode by hand. True AGI cannot be 'hand-programmed into' generality." },
    { name:"ACT-R", icon:"🧩", color:VIO, year:"1993",
      desc:"Adaptive Control of Thought–Rational by John Anderson at Carnegie Mellon. ACT-R models human cognition by combining declarative memory (chunks of factual knowledge), procedural memory (production rules), and subsymbolic activation levels that determine what knowledge gets retrieved when.",
      components:["Declarative memory: chunks with activation based on recency and frequency","Procedural memory: production rules for action selection","Goal buffer: current task context","Imaginal buffer: current problem representation","Perceptual-motor modules: vision, manual control"],
      strength:"ACT-R is the most empirically grounded cognitive architecture — it makes quantitative predictions about human reaction times and error rates that match experimental data. Used to model learning, attention, problem solving, and skilled performance.",
      weakness:"Primarily a model of human cognition, not a path to AGI. Production rules must be hand-written. Does not scale to open-ended learning in novel domains. More useful for cognitive science than AI engineering.",
      agi_rel:"ACT-R teaches us what human-level cognition requires: structured memory retrieval, goal management, and the integration of perception, action, and reasoning. Any AGI architecture should be benchmarked against these requirements." },
    { name:"Neural-Symbolic", icon:"🔗", color:ORG, year:"2000s–now",
      desc:"Hybrid architectures that combine neural networks (for perception, pattern recognition, and learning from data) with symbolic reasoning (for structured knowledge, logic, and explicit reasoning). The goal: neural for grounding, symbolic for reasoning.",
      components:["Neural perception layer: converts raw input to symbols","Symbolic knowledge base: ontology, rules, relationships","Neuro-symbolic interface: translating between representations","Differentiable reasoning: backprop through symbolic operations","Examples: DeepMind's AlphaGeometry, MIT's NS-CL, IBM Neuro-Symbolic AI"],
      strength:"AlphaGeometry (2024) solved 25/30 IMO geometry problems — near gold-medal level — by combining a language model for intuition with a symbolic deduction engine for proof. The combination beats either approach alone.",
      weakness:"The interface between neural and symbolic representations is still brittle. Defining the right symbols is hard. Scaling symbolic components to open-ended domains remains unsolved. Training end-to-end is difficult.",
      agi_rel:"Many researchers believe AGI requires neuro-symbolic integration — neural networks for the sensory/intuitive layer, symbolic systems for the logical/planning layer. This is the dominant hypothesis among academic AI researchers." },
    { name:"World Models", icon:"🌍", color:GRN, year:"2018–now",
      desc:"Architectures where the agent builds and maintains an internal predictive model of the world — allowing it to plan, simulate, and reason about hypothetical situations without directly experiencing them. Inspired by the hypothesis that intelligence is fundamentally about prediction.",
      components:["Perception encoder: compress sensory input to latent representation","World model: predict future states from current state + action","Imagination rollouts: simulate multi-step future scenarios","Policy: act based on imagined future outcomes","Memory: store and retrieve world model states","Examples: Dreamer, DreamerV3, I-JEPA (Yann LeCun), Genie"],
      strength:"DreamerV3 (2023) achieves human-level performance across 150 diverse tasks — Atari, continuous control, 3D navigation — from pixels alone, without task-specific tuning. World models enable sample-efficient learning and long-horizon planning via imagination.",
      weakness:"World models trained on current architectures still struggle with compositional generalisation: a model trained in simulated rooms doesn't automatically generalise to outdoor scenes. The model may hallucinate plausible but wrong futures.",
      agi_rel:"Yann LeCun (Chief AI Scientist, Meta) argues that world models are the missing ingredient for AGI. 'If we can build a machine that can learn world models like children learn them, that machine will have human-level AI.' This is the dominant hypothesis at Meta AI." },
    { name:"LLM + Agent", icon:"🤖", color:RED, year:"2022–now",
      desc:"The current dominant approach: a large language model as the central reasoning engine, extended with memory, tools, and planning. The LLM acts as a general-purpose cognitive core that can be adapted to any task via prompting and tool use.",
      components:["LLM core: reasoning, language understanding, knowledge retrieval","Long-term memory: vector database (Pinecone, Weaviate)","Tool use: web search, code execution, APIs (ReAct pattern)","Planning: chain-of-thought, tree-of-thoughts, explicit plans","Multi-agent: specialised sub-agents coordinated by orchestrator","Examples: GPT-4 with tools, Claude with Projects, AutoGPT"],
      strength:"Remarkable practical progress. Claude, GPT-4, and Gemini demonstrate broad general capability from a single architecture. Tool use enables real-world grounding. Emergent abilities arise without explicit engineering. Deployable at scale today.",
      weakness:"Fundamentally a stochastic text predictor — no genuine understanding, causal model, or world model. Context window limits long-horizon tasks. Cannot truly self-improve. Hallucination is irreducible. May be approaching capability ceiling.",
      agi_rel:"The key question: is the LLM+Agent stack merely an approximation of AGI that will always fall short, or is scaling and architectural improvements enough to bridge the gap? This is the central debate in AI research today." },
  ];
  const a = ARCHS[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:RED, marginBottom:8, fontSize:px(15)}}>
        🏗️ Cognitive Architectures for AGI — Five Approaches
      </div>
      <div style={{display:"flex", gap:6, marginBottom:18, flexWrap:"wrap"}}>
        {ARCHS.map((ar,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1, minWidth:80,
            background:active===i?ar.color:ar.color+"0d",
            border:`2px solid ${active===i?ar.color:ar.color+"33"}`,
            borderRadius:10, padding:"7px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color:active===i?"#fff":ar.color, textAlign:"center"
          }}>{ar.icon}<br />{ar.name.split(" ")[0]}<br /><span style={{fontWeight:400,opacity:0.7}}>{ar.year}</span></button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20)}}>
        <div>
          <div style={{background:a.color+"0d",border:`2px solid ${a.color}33`,borderRadius:14,padding:"16px",marginBottom:12}}>
            <div style={{fontWeight:800,color:a.color,fontSize:px(14),marginBottom:8}}>{a.icon} {a.name} <span style={{fontWeight:400,fontSize:px(11),opacity:0.7}}>({a.year})</span></div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{a.desc}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontWeight:700,color:GRN,fontSize:px(11),marginBottom:4}}>✅ Strengths</div>
              <p style={{...LBODY,fontSize:px(11),margin:0}}>{a.strength}</p>
            </div>
            <div style={{background:RED+"0d",border:`1px solid ${RED}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontWeight:700,color:RED,fontSize:px(11),marginBottom:4}}>⚠️ Weaknesses</div>
              <p style={{...LBODY,fontSize:px(11),margin:0}}>{a.weakness}</p>
            </div>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:a.color,fontSize:px(12),marginBottom:6}}>Core components:</div>
          {a.components.map((comp,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:px(12)}}>
              <span style={{color:a.color,fontWeight:700,flexShrink:0}}>→</span>
              <span style={{color:V.muted}}>{comp}</span>
            </div>
          ))}
          <div style={{marginTop:12,background:a.color+"0d",border:`2px solid ${a.color}22`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontWeight:700,color:a.color,fontSize:px(11),marginBottom:4}}>🎯 AGI relevance:</div>
            <p style={{...LBODY,fontSize:px(11),margin:0}}>{a.agi_rel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ EMERGENT ABILITIES EXPLORER ════════════════════════════ */
const EmergenceExplorer = () => {
  const [selected, setSelected] = useState(null);
  const ABILITIES = [
    { name:"Chain-of-Thought",    model:"GPT-3 → GPT-3.5", params:"175B+", color:VIO,
      desc:"Below ~62B parameters, models can barely do arithmetic. Above this threshold, chain-of-thought prompting suddenly unlocks multi-step reasoning — the model can solve grade-school math by thinking aloud. This capability did not gradually improve; it appeared at a specific scale.",
      implications:"Suggests reasoning is not a smoothly learnable skill but a qualitative phase transition. You cannot get 'partial' chain-of-thought reasoning — it either clicks or it doesn't.",
      example:"2-step math: 15B param model fails. 70B param model solves it by writing each step.", controversial:"Some researchers (Schaeffer et al., 2023) argue emergence is a measurement artifact — with continuous metrics, emergence is not discontinuous. This is one of the most active debates in AI." },
    { name:"In-Context Learning",  model:"GPT-2 → GPT-3",   params:"175B", color:ORG,
      desc:"GPT-3 (2020) demonstrated that by providing examples in the prompt, the model could perform new tasks without any gradient updates. Give it 3 examples of French→English translation, and it translates the 4th. This wasn't explicitly trained — it emerged from pretraining.",
      implications:"ICL suggests models develop a meta-learning capability — an ability to learn from examples at inference time. This is qualitatively different from what smaller models do.",
      example:"0-shot: 'Translate to French: Hello' → mediocre. 3-shot with examples → near-perfect.", controversial:"Whether ICL is true 'learning' or sophisticated pattern matching on context is deeply contested. Models may be retrieving memorised translations rather than generalising." },
    { name:"Tool Use",             model:"GPT-3.5 → GPT-4",  params:"500B+", color:CYN,
      desc:"Smaller models given tool descriptions mostly ignore them or call tools incorrectly. At GPT-4 scale, models reliably parse tool schemas, select appropriate tools, generate valid JSON arguments, and integrate results. The reliability crossed a practical threshold around GPT-4 scale.",
      implications:"Tool use requires understanding the semantics of API descriptions and being able to reliably produce structured outputs — a combination that seems to require a critical mass of capability.",
      example:"GPT-3.5: calls wrong tools ~40% of the time. GPT-4: correct tool selection >90%.", controversial:"Is this 'understanding' tools or memorising patterns from tool-use examples in training data? Probably both, but the distinction matters for AGI." },
    { name:"Code Generation",      model:"Codex → GPT-4",    params:"Variable", color:GRN,
      desc:"Early LLMs could complete code snippets. At Codex scale, models could write full functions. At GPT-4 scale, models solve competitive programming problems, debug cross-file issues, and write novel algorithms. Emergent: they can explain the algorithm before writing it.",
      implications:"Code generation is a particularly striking example because code is executable and testable — emergent code capability has clear, measurable consequences. GPT-4 passes the Google tech interview at the L3 level.",
      example:"HumanEval benchmark: GPT-3 ~0%. Codex 12B: 28%. GPT-4: 86%.", controversial:"Code generation may be partially driven by GitHub memorisation. But solving novel competitive programming problems (Codeforces rating ~1800 for GPT-4o) is hard to explain by memorisation alone." },
  ];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:RED,marginBottom:8,fontSize:px(15)}}>
        ⚡ Emergent Abilities — Capabilities That Appeared at Scale
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14,color:V.muted}}>Click any ability to explore how it emerged, why it matters for AGI, and the controversies around it.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {ABILITIES.map((ab,i)=>(
          <div key={i} onClick={()=>setSelected(selected===i?null:i)}
            style={{...LCARD,cursor:"pointer",border:`2px solid ${selected===i?ab.color:ab.color+"33"}`,background:selected===i?ab.color+"08":V.paper,padding:"12px",transition:"all 0.2s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <div style={{fontWeight:800,color:ab.color,fontSize:px(13)}}>{ab.name}</div>
              <div style={{fontSize:px(10),color:V.muted,fontFamily:"monospace"}}>{ab.model}</div>
            </div>
            <div style={{fontSize:px(10),color:V.muted,marginBottom:selected===i?8:0}}>{ab.params} parameters</div>
            {selected===i&&(
              <div>
                <p style={{...LBODY,fontSize:px(12),marginBottom:8}}>{ab.desc}</p>
                <div style={{background:ab.color+"0d",border:`1px solid ${ab.color}22`,borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                  <div style={{fontWeight:700,color:ab.color,fontSize:px(10),marginBottom:2}}>Example:</div>
                  <div style={{fontSize:px(11),color:V.muted,fontStyle:"italic"}}>{ab.example}</div>
                </div>
                <div style={{background:ORG+"0d",border:`1px solid ${ORG}22`,borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                  <div style={{fontWeight:700,color:ORG,fontSize:px(10),marginBottom:2}}>🔥 Implications for AGI:</div>
                  <div style={{fontSize:px(11),color:V.muted}}>{ab.implications}</div>
                </div>
                <div style={{background:RED+"0d",border:`1px solid ${RED}22`,borderRadius:8,padding:"8px 10px"}}>
                  <div style={{fontWeight:700,color:RED,fontSize:px(10),marginBottom:2}}>⚖️ Controversy:</div>
                  <div style={{fontSize:px(11),color:V.muted}}>{ab.controversial}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <IBox color={RED} title="The key question for AGI"
        body="If capabilities can emerge discontinuously from scale, then AGI might not require a conceptual breakthrough — just enough parameters, data, and compute. This is the 'scaling hypothesis'. But each emergent ability has also revealed new failure modes, suggesting that scale alone may approach but never reach genuine general intelligence." />
    </div>
  );
};

/* ══════ AGI DESIGN THOUGHT EXPERIMENT ══════════════════════════ */
const AGIDesignExperiment = () => {
  const [choices, setChoices] = useState({memory:null,reasoning:null,learning:null,interaction:null,architecture:null});
  const [evaluated, setEvaluated] = useState(false);

  const COMPONENTS = {
    memory:[
      {id:"vector_db",    label:"Vector DB",          icon:"🔍", color:CYN,  pros:"Scales to billions of facts; semantic search; fast retrieval",           cons:"No temporal ordering; no causal links; retrieval errors compound"},
      {id:"episodic",     label:"Episodic Memory",    icon:"📽️", color:VIO,  pros:"Remembers specific events; temporal context; narrative coherence",       cons:"Storage grows indefinitely; requires compression; replay bottleneck"},
      {id:"knowledge_graph",label:"Knowledge Graph",  icon:"🕸️", color:AMB,  pros:"Explicit relationships; fast causal traversal; interpretable",           cons:"Requires curated ontology; doesn't scale to open-domain naturally"},
      {id:"transformer",  label:"Transformer Context",icon:"📄", color:RED,  pros:"Perfectly integrates recent context; no retrieval errors",               cons:"Hard limit at ~1M tokens; no persistence across sessions"},
    ],
    reasoning:[
      {id:"llm_cot",    label:"LLM + CoT",        icon:"💭", color:VIO, pros:"Flexible; handles novel problems; learns from examples",  cons:"Hallucination; slow; expensive; no guarantees"},
      {id:"symbolic",   label:"Symbolic Logic",   icon:"⚖️", color:CYN, pros:"Provably correct; deterministic; interpretable",          cons:"Cannot handle ambiguity; brittle; hard to encode world knowledge"},
      {id:"neural_sym", label:"Neural-Symbolic",  icon:"🔗", color:GRN, pros:"Best of both: perception + logical correctness",          cons:"Interface between representations is hard; scaling issues"},
      {id:"rl",         label:"Reinforcement Learning",icon:"🎮",color:ORG, pros:"Discovers novel strategies; improves from experience",   cons:"Sample-inefficient; reward hacking; doesn't generalise well"},
    ],
    learning:[
      {id:"pretraining", label:"Pretraining on Data", icon:"📚", color:RED, pros:"Captures vast world knowledge; generalises broadly",     cons:"Static; cannot learn from post-training experience continuously"},
      {id:"rl_feedback",  label:"RL from Feedback",   icon:"🔄", color:GRN, pros:"Improves from interaction; adapts to user preferences",  cons:"Reward specification hard; can exploit reward loopholes"},
      {id:"meta",         label:"Meta-Learning",      icon:"🧪", color:VIO, pros:"Learns to learn new tasks from few examples",            cons:"Still requires pretraining; difficult to scale; slow"},
      {id:"continual",    label:"Continual Learning",  icon:"🌱", color:CYN, pros:"Updates from new experience without forgetting old",     cons:"Catastrophic forgetting not fully solved; complex to implement"},
    ],
    interaction:[
      {id:"language",  label:"Language Interface", icon:"💬", color:AMB,  pros:"Universal; flexible; natural for humans",           cons:"Ambiguous; lacks grounding; slow compared to direct interfaces"},
      {id:"embodied",  label:"Embodied Robotics",  icon:"🤖", color:CYN,  pros:"Real-world grounding; physical commonsense",        cons:"Hardware fragile; simulation-to-reality gap; expensive"},
      {id:"digital",   label:"Digital Environment",icon:"🖥️", color:VIO,  pros:"Controllable; scalable; easy to simulate; fast",    cons:"Simulation gap; no physical world model"},
      {id:"multimodal",label:"Multimodal",          icon:"👁️", color:GRN,  pros:"Richer grounding; vision+language+audio unified",  cons:"Alignment between modalities; training complexity"},
    ],
    architecture:[
      {id:"transformer",  label:"Transformer Core",    icon:"🔷", color:RED, pros:"Proven at scale; flexible; current SOTA",             cons:"May hit ceiling; no inherent world model; prediction-optimised"},
      {id:"world_model",  label:"World Model (Dreamer)",icon:"🌍", color:GRN, pros:"Plans in imagination; sample efficient; general",     cons:"World model accuracy critical; training unstable at large scale"},
      {id:"neuro_sym",    label:"Neuro-Symbolic",      icon:"⚛️", color:VIO, pros:"Combines learning and logic; interpretable",          cons:"Current implementations don't scale; interface hard"},
      {id:"moe",          label:"Mixture of Experts",  icon:"👥", color:CYN, pros:"Specialisation + efficiency; sparse compute",          cons:"Expert routing is brittle; less general than dense models"},
    ],
  };

  const LABELS = {memory:"💾 Memory System", reasoning:"🧠 Reasoning Engine", learning:"📈 Learning Algorithm", interaction:"🌐 Environment Interaction", architecture:"🏗️ Core Architecture"};

  const pick = (comp, id) => {
    if (evaluated) return;
    setChoices(prev => ({...prev, [comp]: prev[comp]===id ? null : id}));
  };

  const allPicked = Object.values(choices).every(v => v !== null);

  const evaluate = () => {
    if (!allPicked) return;
    setEvaluated(true);
  };

  const getScore = () => {
    const combos = {
      memory:{"vector_db":2,"episodic":3,"knowledge_graph":2,"transformer":1},
      reasoning:{"llm_cot":2,"symbolic":2,"neural_sym":3,"rl":1},
      learning:{"pretraining":2,"rl_feedback":2,"meta":3,"continual":3},
      interaction:{"language":2,"embodied":3,"digital":2,"multimodal":3},
      architecture:{"transformer":2,"world_model":3,"neuro_sym":3,"moe":2},
    };
    return Object.entries(choices).reduce((sum,[k,v])=>sum+(combos[k]?.[v]||0),0);
  };

  const score = evaluated ? getScore() : 0;

  return (
    <div style={{...LCARD, background:"#150000", border:`2px solid ${RED}22`}}>
      <div style={{fontWeight:800, color:RED, fontSize:px(17), marginBottom:4}}>
        🔬 Thought Experiment — Design Your Own AGI System
      </div>
      <p style={{...LBODY, color:"#94a3b8", fontSize:px(13), marginBottom:16}}>
        Choose one component per category. Your selections reveal the trade-offs in AGI architecture design. There is no single correct answer — this mirrors real debates in the field.
      </p>
      {Object.entries(COMPONENTS).map(([comp, opts])=>(
        <div key={comp} style={{marginBottom:16}}>
          <div style={{fontWeight:700, color:RED, fontSize:px(13), marginBottom:8}}>{LABELS[comp]}</div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8}}>
            {opts.map(opt=>{
              const isPicked = choices[comp]===opt.id;
              return (
                <div key={opt.id} onClick={()=>pick(comp,opt.id)}
                  style={{
                    background:isPicked?opt.color+"22":opt.color+"08",
                    border:`2px solid ${isPicked?opt.color:opt.color+"33"}`,
                    borderRadius:10, padding:"8px", cursor:evaluated?"default":"pointer",
                    transition:"all 0.15s"
                  }}>
                  <div style={{fontSize:px(16),marginBottom:4}}>{opt.icon}</div>
                  <div style={{fontWeight:700,color:opt.color,fontSize:px(10),marginBottom:4}}>{opt.label}</div>
                  {evaluated && (
                    <div>
                      <div style={{fontSize:px(9),color:GRN,marginBottom:2}}>+{opt.pros.split(";")[0]}</div>
                      <div style={{fontSize:px(9),color:RED}}>{opt.cons.split(";")[0]}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {!evaluated && allPicked && (
        <button onClick={evaluate} style={{background:RED,border:"none",borderRadius:10,padding:"10px 28px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:px(13)}}>
          Evaluate my AGI design →
        </button>
      )}
      {evaluated && (
        <div style={{background: score>=13?GRN+"0d":score>=10?AMB+"0d":RED+"0d", border:`2px solid ${score>=13?GRN:score>=10?AMB:RED}33`, borderRadius:12, padding:"14px 16px", marginTop:8}}>
          <div style={{fontWeight:800, color:score>=13?GRN:score>=10?AMB:RED, fontSize:px(15), marginBottom:6}}>
            Score: {score}/15 — {score>=13?"🌟 Research-aligned design":score>=10?"✅ Promising architecture":"⚠️ Has significant limitations"}
          </div>
          <p style={{...LBODY, fontSize:px(13), marginBottom:6}}>
            {score>=13 ? "Your design incorporates the current research consensus: world models + neural-symbolic reasoning + meta/continual learning + multimodal interaction. This is the approximate direction of DeepMind's and Meta's AGI research programmes." :
             score>=10 ? "A solid architecture but with significant trade-offs. Some components don't compose well together. Consider: does your reasoning engine align with your learning algorithm?" :
             "Your design has gaps. The components may not compose well — e.g., pure symbolic reasoning cannot learn from raw perception without a neural grounding layer."}
          </p>
          <button onClick={()=>{setEvaluated(false);setChoices({memory:null,reasoning:null,learning:null,interaction:null,architecture:null});}} style={{background:"transparent",border:`1px solid ${RED}44`,borderRadius:8,padding:"6px 16px",color:RED,cursor:"pointer",fontSize:px(11)}}>
            ↺ Redesign
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ AGI TOY SIMULATION ══════════════════════════════════════ */
const AGIToySimulation = () => {
  const [tasks, setTasks] = useState([
    {name:"Chess",           domain:"Games",    learned:false, transferred:false, steps:0, color:CYN},
    {name:"Checkers",        domain:"Games",    learned:false, transferred:false, steps:0, color:CYN},
    {name:"Image sorting",   domain:"Vision",   learned:false, transferred:false, steps:0, color:VIO},
    {name:"Object counting", domain:"Vision",   learned:false, transferred:false, steps:0, color:VIO},
    {name:"Translation",     domain:"Language", learned:false, transferred:false, steps:0, color:ORG},
    {name:"Summarisation",   domain:"Language", learned:false, transferred:false, steps:0, color:ORG},
    {name:"Robot navigation",domain:"Physical", learned:false, transferred:false, steps:0, color:GRN},
    {name:"Pathfinding",     domain:"Physical", learned:false, transferred:false, steps:0, color:GRN},
  ]);
  const [running, setRunning] = useState(false);
  const [worldModel, setWorldModel] = useState(0);
  const iRef = useRef(null);

  const reset = () => {
    clearInterval(iRef.current); setRunning(false); setWorldModel(0);
    setTasks(prev => prev.map(t => ({...t, learned:false, transferred:false, steps:0})));
  };

  const run = () => {
    if (running) return;
    setRunning(true);
    let step = 0;
    iRef.current = setInterval(() => {
      step++;
      setTasks(prev => {
        const n = [...prev];
        const idx = Math.floor((step-1)/3);
        if (idx < n.length) {
          const t = {...n[idx]};
          t.steps = Math.min(t.steps+1, 3);
          if (t.steps>=3) { t.learned = true; }
          // Transfer within same domain
          if (t.learned) {
            n.forEach((other,j) => {
              if (other.domain===t.domain && j!==idx && n[idx].learned) {
                n[j] = {...other, transferred:true, steps:3, learned:true};
              }
            });
          }
          n[idx] = t;
        }
        return n;
      });
      setWorldModel(prev => Math.min(100, prev + 3.5));
      if (step >= tasks.length*3) {
        clearInterval(iRef.current); setRunning(false);
      }
    }, 400);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  const domains = [...new Set(tasks.map(t=>t.domain))];
  const learnedCount = tasks.filter(t=>t.learned).length;

  return (
    <div style={{...LCARD, background:"#150000", border:`2px solid ${RED}22`}}>
      <div style={{fontWeight:800, color:RED, fontSize:px(17), marginBottom:4}}>
        🤖 Toy AGI Simulation — Multi-Task Learning + Knowledge Transfer
      </div>
      <p style={{...LBODY, color:"#94a3b8", fontSize:px(13), marginBottom:12}}>
        Watch the simulated AGI learn tasks one at a time, transfer knowledge within domains, and build an internal world model as it accumulates experience.
      </p>
      <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:px(20), marginBottom:14}}>
        <div>
          {domains.map(domain=>(
            <div key={domain} style={{marginBottom:12}}>
              <div style={{fontWeight:700, color:tasks.find(t=>t.domain===domain)?.color||RED, fontSize:px(12), marginBottom:6}}>{domain}</div>
              <div style={{display:"flex", gap:8}}>
                {tasks.filter(t=>t.domain===domain).map((t,i)=>(
                  <div key={i} style={{
                    flex:1, padding:"8px", borderRadius:10,
                    background:t.transferred?t.color+"22":t.learned?t.color+"18":t.color+"08",
                    border:`2px solid ${t.learned?t.color:t.color+"33"}`,
                    transition:"all 0.3s"
                  }}>
                    <div style={{fontWeight:700,color:t.color,fontSize:px(11)}}>{t.name}</div>
                    <div style={{display:"flex",gap:3,marginTop:4}}>
                      {[0,1,2].map(s=>(
                        <div key={s} style={{width:16,height:6,borderRadius:3,background:t.steps>s?t.color:t.color+"22",transition:"all 0.3s"}}/>
                      ))}
                    </div>
                    {t.transferred&&<div style={{fontSize:px(9),color:t.color,marginTop:2}}>↗ transferred</div>}
                    {t.learned&&!t.transferred&&<div style={{fontSize:px(9),color:GRN,marginTop:2}}>✓ learned</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", gap:8, minWidth:110}}>
          <div style={{fontWeight:700, color:RED, fontSize:px(11)}}>World Model</div>
          <div style={{width:80, height:140, background:RED+"08", border:`2px solid ${RED}33`, borderRadius:10, display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden",position:"relative"}}>
            <div style={{background:`linear-gradient(180deg,${ORG},${RED})`,height:`${worldModel}%`,transition:"height 0.4s",borderRadius:"0 0 8px 8px"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",fontWeight:900,color:"#fff",fontSize:px(16)}}>{Math.round(worldModel)}%</div>
          </div>
          <div style={{fontWeight:700, color:RED, fontSize:px(11)}}>Tasks: {learnedCount}/{tasks.length}</div>
        </div>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={run} disabled={running} style={{background:running?V.border:RED,border:"none",borderRadius:10,padding:"9px 22px",color:"#fff",fontWeight:800,cursor:running?"default":"pointer",fontSize:px(12)}}>
          {running?"Learning...":"▶ Start Learning"}
        </button>
        <button onClick={reset} style={{background:"transparent",border:`1px solid ${RED}44`,borderRadius:10,padding:"9px 16px",color:RED,cursor:"pointer",fontSize:px(12)}}>↺ Reset</button>
      </div>
    </div>
  );
};

/* ══════ INSIGHTS ════════════════════════════════════════════════ */
const AGIInsights = ({onBack}) => {
  const [done,setDone]=useState(Array(8).fill(false));
  const items=[
    {e:"🎯",t:"AGI is not a product or a model — it's a capability threshold. An AGI system matches or exceeds human performance across virtually all cognitive domains, can learn new tasks from few examples, and transfers knowledge without explicit retraining."},
    {e:"🔬",t:"Current LLMs are powerful but narrow in a deep sense: they are stochastic text predictors trained on human text. They lack genuine causal models, grounded world models, and the sample efficiency that humans demonstrate from infancy."},
    {e:"🧠",t:"The human brain's key advantage is not raw compute — it's priors. Millions of years of evolution have wired in inductive biases about physics, causality, social dynamics, and spatial reasoning. AI trains from scratch on raw data."},
    {e:"⚡",t:"Emergent abilities — chain-of-thought, tool use, in-context learning — suggest that qualitative capability jumps can arise from scale. This is the core of the scaling hypothesis: AGI might require no architectural breakthrough, just more scale."},
    {e:"🏗️",t:"The dominant research bets: Meta/LeCun bet on world models. Google/DeepMind bet on neuro-symbolic integration (AlphaGeometry). OpenAI bets on scaling transformers. No one knows which is right — likely a combination will be needed."},
    {e:"📏",t:"AGI benchmarks are philosophically hard. The ARC benchmark (Chollet, 2019) measures abstraction and reasoning from few examples — currently not solved by any LLM. But even passing ARC may not constitute AGI; it depends on your definition."},
    {e:"⚠️",t:"Common sense, causal reasoning, and long-horizon planning remain the hardest open problems. These require grounding in physical reality, not just patterns in text. Embodied AI — robots that interact with the world — may be necessary."},
    {e:"🚀",t:"The current best estimate for AGI: leading researchers give timelines ranging from 5 to 50+ years, with enormous disagreement. The uncertainty is not about whether AGI is possible, but about how far we currently are from the right approach."},
  ];
  const cnt=done.filter(Boolean).length;
  return (
    <div style={{...LSEC,background:V.paper}}>
      <div style={{maxWidth:px(800),margin:"0 auto"}}>
        {STag("Key Insights · Artificial General Intelligence",RED)}
        <h2 style={{...LH2,marginBottom:px(28)}}>8 Things to <span style={{color:RED}}>Master</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(14),marginBottom:px(32)}}>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
              style={{...LCARD,cursor:"pointer",border:`2px solid ${done[i]?RED+"44":V.border}`,background:done[i]?RED+"08":V.paper,transition:"all 0.2s"}}>
              <span style={{fontSize:px(26)}}>{item.e}</span>
              <p style={{...LBODY,margin:"8px 0 0",fontSize:px(13),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{background:V.cream,borderRadius:14,padding:"16px 20px",marginBottom:px(24)}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontWeight:700,color:V.ink}}>Mastered {cnt}/8</span>
            <span style={{fontWeight:700,color:RED}}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{background:V.border,borderRadius:99,height:8}}>
            <div style={{background:`linear-gradient(90deg,${RSE},${RED})`,borderRadius:99,height:8,width:`${cnt/8*100}%`,transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {cnt===8&&<button onClick={onBack} style={{background:`linear-gradient(135deg,${RSE},${RED})`,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Next: Superintelligence →</button>}
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Level 7</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ═══════════════════════════════════════════════ */
const ArtificialGeneralIntelligencePage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Artificial General Intelligence" lessonNum="Lesson 1 of 5"
    accent={RED} levelLabel="AGI & Future of AI"
    dotLabels={["Hero","Introduction","AGI Definition","Human vs AI","Architectures","Scaling","Emergence","Benchmarks","Challenges","Future","Experiment","Simulation","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#150000 0%,#2a0a0a 60%,#150000 100%)",minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🧠 Lesson 1 of 5 · AGI & Future of AI",RED)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Artificial<br /><span style={{color:"#fca5a5"}}>General<br />Intelligence</span>
              </h1>
              <p style={{...LBODY,color:"#94a3b8",fontSize:px(17),marginBottom:px(28)}}>
                The most consequential question in technology: can we build machines that think as generally as humans — and what happens when we do? This lesson explores the science, philosophy, and frontier of AGI research.
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[["🎯","General reasoning"],["🌐","Cross-domain transfer"],["🧩","Common sense"],["🌍","World models"]].map(([icon,label])=>(
                  <div key={label} style={{background:RED+"15",border:`1px solid ${RED}33`,borderRadius:10,padding:"7px 14px",display:"flex",gap:6,alignItems:"center"}}>
                    <span>{icon}</span><span style={{color:"#fca5a5",fontSize:px(12),fontWeight:600}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:360,borderRadius:20,overflow:"hidden",border:`1px solid ${RED}22`}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1: INTRO */}
        <div ref={R(1)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 1 · Introduction",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>The <span style={{color:RED}}>Intelligence Spectrum</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,marginBottom:16}}>We stand at an extraordinary moment: AI systems can write poetry, diagnose diseases, win at chess, and write code. Yet none of them can do all of these things well, let alone match the flexible, adaptive intelligence of a twelve-year-old child encountering a novel problem.</p>
                <p style={{...LBODY,marginBottom:16}}>Understanding the gap between today's AI and genuine general intelligence requires us to understand what intelligence actually is — not as a single capability, but as a vast multi-dimensional space of cognitive abilities that humans navigate with remarkable ease.</p>
                <IBox color={RED} title="Three levels of AI"
                  body="Narrow AI: excels at specific tasks (chess, image recognition, language). General AI (AGI): matches human performance across virtually all cognitive domains. Superintelligence: surpasses human capability in all domains by a large margin. We are firmly in the narrow AI era, with some systems beginning to approach the border of general capability in limited senses." />
              </div>
              <div>
                {[
                  {level:"Narrow AI", color:SKY, icon:"🎯", examples:"GPT-4, AlphaGo, DALL-E, Siri", desc:"Superhuman at specific tasks. Cannot transfer skills. Fails completely outside training distribution. No understanding of its own limits. Billions of parameters trained for months for a narrow capability.", year:"1950s–Now"},
                  {level:"AGI",       color:RED,  icon:"🧠", examples:"Theoretical / approaching", desc:"Human-level across all domains. Can learn any cognitive skill from few examples. Understands its own reasoning. Can set and pursue long-term goals. Can explain its decisions. May not need to be human-like.", year:"2025–2040?"},
                  {level:"Superintelligence", color:VIO, icon:"🔮", examples:"Theoretical", desc:"Vastly exceeds human capability across all domains. Could solve in seconds problems that take humanity centuries. Self-improving — can redesign its own architecture. The most consequential and dangerous technology ever created, if achieved.", year:"After AGI"},
                ].map(level=>(
                  <div key={level.level} style={{...LCARD,border:`2px solid ${level.color}22`,marginBottom:10}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:px(20)}}>{level.icon}</span>
                      <div style={{fontWeight:800,color:level.color,fontSize:px(14)}}>{level.level}</div>
                      <div style={{marginLeft:"auto",fontFamily:"monospace",fontSize:px(10),color:V.muted}}>{level.year}</div>
                    </div>
                    <div style={{fontSize:px(11),color:CYN,marginBottom:4}}>{level.examples}</div>
                    <p style={{...LBODY,fontSize:px(11),margin:0}}>{level.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <CapabilitySpectrumViz/>
          </div>
        </div>

        {/* S2: DEFINITION */}
        <div ref={R(2)} style={{...LSEC,background:"#150000"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 2 · Formal Definition",RED)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>What AGI <span style={{color:"#fca5a5"}}>Actually Means</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={RED}>{"AGI ≡ ∀T ∈ CognitiveTasks: Performance(AI, T) ≥ Performance(Human, T)"}</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  An Artificial General Intelligence is a system that performs at or above human level across the full range of cognitive tasks a human can perform — including tasks the system has never encountered during training.
                </p>
                <div style={{...LCARD,background:"#200808",border:`1px solid ${RED}33`}}>
                  <div style={{fontWeight:700,color:RED,marginBottom:10,fontSize:px(13)}}>Five defining characteristics:</div>
                  {[
                    {char:"General reasoning",    desc:"Solves novel problems using logic, analogy, and abstraction — not pattern matching on memorised solutions.", color:ORG},
                    {char:"Transfer learning",    desc:"Applies knowledge from one domain to improve performance in an unrelated domain. A chess-playing AGI can use strategic thinking for protein folding.", color:CYN},
                    {char:"Adaptability",         desc:"Adjusts behaviour based on new information and feedback. Can recognise when its model of the world is wrong and update it.", color:VIO},
                    {char:"Long-term planning",   desc:"Pursues goals over extended time horizons, managing intermediate objectives and recovering from partial failures.", color:GRN},
                    {char:"Cross-domain synthesis",desc:"Generates novel insights by connecting concepts from unrelated fields — the kind of thinking that produces scientific breakthroughs.", color:AMB},
                  ].map(c=>(
                    <div key={c.char} style={{display:"flex",gap:10,marginBottom:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:c.color,flexShrink:0,marginTop:4}}/>
                      <div>
                        <div style={{fontWeight:700,color:c.color,fontSize:px(12)}}>{c.char}</div>
                        <div style={{fontSize:px(11),color:"#94a3b8"}}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontWeight:700,color:RED,marginBottom:10,fontSize:px(13)}}>Why these are hard to achieve:</div>
                {[
                  {title:"The grounding problem",     desc:"Intelligence is grounded in perception of the physical world. Text-only AI has only descriptions of the world, not the world itself. This limits commonsense physics and social reasoning.", ref:"Harnad, 1990"},
                  {title:"The symbol grounding problem",desc:"Symbolic AI can manipulate symbols correctly without understanding what they mean. How do symbols get connected to real-world referents? No fully satisfactory solution exists.", ref:"Searle, 1980"},
                  {title:"The data efficiency gap",   desc:"Humans learn from ~10^9 bits of sensory experience in 18 years. GPT-4 trained on ~10^13 tokens. The per-sample efficiency gap is roughly 10,000:1 in favour of humans.", ref:"LeCun, 2022"},
                  {title:"Goal specification",        desc:"How do you specify 'be generally intelligent' as a training objective? Current objectives (predict next token, maximise reward) create narrow optimisers, not general ones.", ref:"Russell, 2019"},
                ].map(item=>(
                  <div key={item.title} style={{...LCARD,background:"#200808",border:`1px solid ${RED}22`,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontWeight:700,color:RED,fontSize:px(12)}}>{item.title}</div>
                      <div style={{fontSize:px(9),color:V.muted,fontStyle:"italic"}}>{item.ref}</div>
                    </div>
                    <p style={{...LBODY,color:"#94a3b8",fontSize:px(11),margin:0}}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* S3: HUMAN vs AI */}
        <div ref={R(3)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 3 · Human Intelligence vs AI",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>The <span style={{color:RED}}>Cognitive Gap</span></h2>
            <HumanVsAIComparison/>
          </div>
        </div>

        {/* S4: ARCHITECTURES */}
        <div ref={R(4)} style={{...LSEC,background:"#150000"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 4 · Cognitive Architectures",RED)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Five Paths to <span style={{color:"#fca5a5"}}>General Intelligence</span></h2>
            <CognitiveArchitecturesExplorer/>
          </div>
        </div>

        {/* S5: SCALING */}
        <div ref={R(5)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 5 · The Scaling Hypothesis",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>More Data + More Compute = <span style={{color:RED}}>Intelligence?</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,marginBottom:16}}>The <strong>scaling hypothesis</strong> (Hestness et al. 2017; Kaplan et al. 2020) proposes that performance on language tasks follows smooth power laws with model size, dataset size, and compute — and that continuing to scale these quantities will eventually produce general intelligence.</p>
                <Formula color={RED}>{"L(N,D) = N_c^α_N / N + D_c^α_D / D"}</Formula>
                <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>The Chinchilla scaling law: loss L decreases predictably as a power law of model parameters N and training tokens D. Optimal training: 1 token per parameter. Chinchilla (70B params, 1.4T tokens) outperforms GPT-3 (175B params, 300B tokens).</p>
                <IBox color={RED} title="The scaling maximalists"
                  body="Ilya Sutskever (OpenAI): 'Maybe AGI is not that hard.' Sam Altman: 'I believe we will achieve AGI in the next few years.' The argument: if GPT-4 emerged from scaling GPT-3, what emerges from scaling GPT-4 by 100×? No fundamental barrier has been identified." />
              </div>
              <div>
                <div style={{fontWeight:700,color:RED,marginBottom:10,fontSize:px(13)}}>Arguments for the scaling hypothesis:</div>
                {["Empirical: GPT-2→GPT-3→GPT-4 show each scaling step produces qualitatively new capabilities","Smooth power laws: no evidence of diminishing returns in current scaling regime","Emergence: unexpected capabilities arise — suggesting more surprises with more scale","Historical: every time AI 'hit a wall', more scale broke through it","The human brain is large — maybe size matters fundamentally"].map((a,i)=>
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:px(12)}}>
                    <span style={{color:GRN,fontWeight:700,flexShrink:0}}>+</span><span style={{color:V.muted}}>{a}</span>
                  </div>
                )}
                <div style={{fontWeight:700,color:VIO,marginBottom:10,fontSize:px(13),marginTop:14}}>Arguments against:</div>
                {["Plateau evidence: GPT-4→GPT-4.5 showed smaller gains than expected","Yann LeCun: 'LLMs will never be truly intelligent — wrong architecture'","Chollet: intelligence requires sample efficiency, not scale","No evidence scaling produces causal understanding or genuine world models","Cost: training a GPT-5-scale model may exceed $1B — economic limits approaching"].map((a,i)=>
                  <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:px(12)}}>
                    <span style={{color:RED,fontWeight:700,flexShrink:0}}>−</span><span style={{color:V.muted}}>{a}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* S6: EMERGENCE */}
        <div ref={R(6)} style={{...LSEC,background:"#150000"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 6 · Emergent Abilities",RED)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Capabilities That <span style={{color:"#fca5a5"}}>Appeared at Scale</span></h2>
            <EmergenceExplorer/>
          </div>
        </div>

        {/* S7: BENCHMARKS */}
        <div ref={R(7)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 7 · Benchmarks for AGI",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>How Do We <span style={{color:RED}}>Measure General Intelligence?</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              {[
                {name:"ARC Challenge",          author:"François Chollet (Google), 2019", color:RED,
                  desc:"Abstraction and Reasoning Corpus. 400 unique visual puzzles — each solvable by a human in seconds. Requires core knowledge: object permanence, spatial reasoning, counting, symmetry. Deliberately designed to be impossible to solve by memorisation.",
                  scores:"GPT-4: 40% (2024). Humans: ~85%. No LLM comes close to human performance. The benchmark was specifically designed to resist scaling — and it largely has.",
                  agi_sig:"Chollet's thesis: if we ever reach human-level ARC performance, it will represent a genuine step towards AGI because the benchmark measures fluid intelligence (reasoning from principles) not crystallised intelligence (memorised knowledge)."},
                {name:"BIG-Bench Hard",          author:"Suzgun et al., 2022",            color:AMB,
                  desc:"Beyond the Imitation Game Benchmark — Hard subset. 23 challenging tasks including logical deduction, causal reasoning, sarcasm detection, temporal sequences. Selected because state-of-the-art models failed on them when first compiled.",
                  scores:"GPT-4 with CoT: 69%. Human baseline: 88%. Significant gap on causal and formal reasoning tasks.",
                  agi_sig:"BIG-Bench Hard is important because it benchmarks failure modes of current LLMs — tasks humans find easy but LLMs struggle with. Where LLMs fail on BBH gives a roadmap for what AGI must improve."},
                {name:"MATH",                    author:"Hendrycks et al., 2021",          color:VIO,
                  desc:"12,500 competition math problems from AMC 8 to USAMO. Requires understanding, problem decomposition, and applying the right theorem. Cannot be solved by pattern matching — requires mathematical reasoning.",
                  scores:"GPT-4 + code interpreter: 52%. GPT-4o: 76%. Human competition winners: 90%+. Recent models with self-generated training data (AlphaProof): near-human on some categories.",
                  agi_sig:"Mathematical reasoning is a microcosm of AGI: it requires formal reasoning, creative insight, and systematic error checking. Progress on MATH is a proxy for progress on one of the hardest aspects of AGI."},
                {name:"HumanEval / SWE-Bench",   author:"Chen et al. 2021; Yang et al. 2024",color:GRN,
                  desc:"HumanEval: 164 Python programming problems. SWE-Bench: 2294 real GitHub issues requiring code changes across real repositories. Measures ability to understand requirements, read existing code, debug, and produce correct solutions.",
                  scores:"HumanEval: GPT-4o: 90%. SWE-Bench: GPT-4 agents: 49% (2024) — solving nearly half of real GitHub issues autonomously.",
                  agi_sig:"SWE-Bench is particularly important because software engineering requires all cognitive skills simultaneously: reading comprehension, logical reasoning, causal reasoning, planning, and creativity. Progress here is close to AGI-relevant."},
              ].map(bench=>(
                <div key={bench.name} style={{...LCARD,border:`2px solid ${bench.color}22`}}>
                  <div style={{fontWeight:800,color:bench.color,fontSize:px(13),marginBottom:2}}>{bench.name}</div>
                  <div style={{fontSize:px(10),color:V.muted,marginBottom:8,fontStyle:"italic"}}>{bench.author}</div>
                  <p style={{...LBODY,fontSize:px(12),marginBottom:8}}>{bench.desc}</p>
                  <div style={{background:bench.color+"0d",border:`1px solid ${bench.color}22`,borderRadius:8,padding:"6px 10px",marginBottom:6}}>
                    <div style={{fontWeight:700,color:bench.color,fontSize:px(10),marginBottom:2}}>📊 Current scores:</div>
                    <div style={{fontSize:px(11),color:V.muted}}>{bench.scores}</div>
                  </div>
                  <div style={{fontSize:px(11),color:V.muted,fontStyle:"italic"}}>{bench.agi_sig}</div>
                </div>
              ))}
            </div>
            <IBox color={RED} title="The Goodhart's Law problem for AGI benchmarks"
              body="'When a measure becomes a target, it ceases to be a good measure.' GPT-4 was trained on data that likely includes ARC training examples. MMLU questions appear in online discussions LLMs were trained on. Every new benchmark is compromised by training data contamination within 2 years of publication. Truly testing AGI requires new benchmarks the model has never seen — an infinite game of benchmark creation." />
          </div>
        </div>

        {/* S8: CHALLENGES */}
        <div ref={R(8)} style={{...LSEC,background:"#150000"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 8 · Why AGI is Hard",RED)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>The Hardest <span style={{color:"#fca5a5"}}>Open Problems</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16)}}>
              {[
                {icon:"🧩",title:"Common sense reasoning",   color:CYN,  desc:"Humans know that a solid object can't pass through another solid object, that cause precedes effect, that people have inner lives. This 'dark matter of cognition' is so obvious it was never written down — and thus wasn't in the training data. LLMs fail on simple physical reasoning probes humans solve in milliseconds."},
                {icon:"🔗",title:"Causal understanding",     color:AMB,  desc:"'Correlation is not causation' — but LLMs are fundamentally correlational machines. They cannot model interventions (what happens if I do X?) or counterfactuals (what would have happened if Y?). Judea Pearl's causal hierarchy: association → intervention → counterfactual. LLMs are stuck at level 1."},
                {icon:"🗺️",title:"Long-horizon planning",    color:VIO,  desc:"GPT-4 plans reasonably for 5 steps. Performance degrades sharply at 15+ steps. The agent loses track of sub-goals, forgets earlier observations, contradicts earlier decisions. Long-horizon planning requires a persistent goal representation that survives thousands of reasoning steps — far beyond the context window."},
                {icon:"🪞",title:"Self-reflection & metacognition",color:GRN,desc:"Humans know what they don't know. They can say 'I'm not sure about this' reliably and accurately. LLMs have poor calibration: GPT-4 expresses high confidence on wrong answers ~30% of the time. True metacognition requires a model of one's own reasoning process — and the ability to reason about that model."},
                {icon:"🌱",title:"Continual learning",       color:RED,  desc:"Humans learn continuously from experience without forgetting previous knowledge. Neural networks suffer catastrophic forgetting: training on new data degrades performance on old data. This is fundamental to learning in the real world — every experience updates your model, not just a pre-specified training set."},
                {icon:"💡",title:"Novel conceptual invention",color:TEAL, desc:"Einstein's special relativity was not a recombination of existing ideas — it required conceptual inversion (abandoning absolute time). Picasso's cubism wasn't 'more of the same painting'. Genuine invention requires the ability to violate existing categories — precisely what prediction-optimised models are trained not to do."},
              ].map(item=>(
                <div key={item.title} style={{...LCARD,background:"#200808",border:`1px solid ${item.color}22`}}>
                  <div style={{fontSize:px(22),marginBottom:6}}>{item.icon}</div>
                  <div style={{fontWeight:700,color:item.color,fontSize:px(13),marginBottom:6}}>{item.title}</div>
                  <p style={{...LBODY,color:"#94a3b8",fontSize:px(12),margin:0}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S9: FUTURE */}
        <div ref={R(9)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 9 · Future Research",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Paths to <span style={{color:RED}}>General Intelligence</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(16)}}>
              {[
                {icon:"🌍",title:"World Models",        color:GRN,  desc:"LeCun's JEPA hypothesis: intelligence emerges from learning abstract world models that predict the future at the right level of abstraction. I-JEPA, V-JEPA, and Genie are early steps. Could provide the grounding that LLMs lack."},
                {icon:"🤖",title:"Embodied AI",         color:CYN,  desc:"Physical robots that learn by interacting with the world. RT-2, PaLM-E, and Figure AI combine LLM planning with robot execution. Physical grounding may be necessary for commonsense and causal reasoning."},
                {icon:"🧬",title:"Neuro-symbolic AI",   color:VIO,  desc:"Combining neural perception with symbolic reasoning. AlphaGeometry (DeepMind, 2024) solves IMO geometry at near-gold-medal level by hybridising language model intuition with formal deduction engines."},
                {icon:"📐",title:"Formal reasoning",   color:AMB,  desc:"AlphaProof, Lean-GPT, and similar systems bring formal verification to mathematical reasoning. If an AI can prove its own reasoning is correct, it sidesteps the hallucination problem entirely."},
                {icon:"🔬",title:"Autonomous research", color:TEAL, desc:"AI Scientist (Sakana AI), AI for Science (Google DeepMind). Agents that can design experiments, collect data, test hypotheses, and revise theories. Closing the loop on scientific discovery."},
                {icon:"🧠",title:"Neuromorphic computing",color:RED, desc:"Intel Loihi, IBM TrueNorth. Brain-inspired hardware with spike-based computation. May offer massive efficiency advantages for the kind of continual, embodied learning that biological intelligence uses."},
              ].map(card=>(
                <div key={card.title} style={{...LCARD,border:`2px solid ${card.color}22`}}>
                  <span style={{fontSize:px(28),marginBottom:8,display:"block"}}>{card.icon}</span>
                  <div style={{fontWeight:800,color:card.color,fontSize:px(13),marginBottom:6}}>{card.title}</div>
                  <p style={{...LBODY,fontSize:px(12),margin:0}}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EXPERIMENT */}
        <div ref={R(10)} style={{...LSEC,background:"#150000"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Thought Experiment · Design AGI",RED)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Activity: <span style={{color:"#fca5a5"}}>Design Your Own AGI</span></h2>
            <AGIDesignExperiment/>
          </div>
        </div>

        {/* SIMULATION */}
        <div ref={R(11)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Mini Project · AGI Simulation",RED)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Project: <span style={{color:RED}}>Multi-Task Learning Simulator</span></h2>
            <AGIToySimulation/>
          </div>
        </div>

        {/* INSIGHTS */}
        <div ref={R(12)}><AGIInsights onBack={onBack}/></div>
      </>
    )}
  </NavPage>
);

export default ArtificialGeneralIntelligencePage;