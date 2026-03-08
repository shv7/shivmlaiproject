import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — MULTI-AGENT SYSTEMS
   Level 6 · Agentic AI · Lesson 4 of 5
   Accent: Rose #e11d48
══════════════════════════════════════════════════════════════════ */
const ROSE = "#e11d48";
const PNK  = "#ec4899";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const ORG  = "#f97316";
const AMB  = "#d97706";
const GRN  = "#059669";
const CYN  = "#0891b2";
const TEAL = "#0d9488";
const EMR  = "#10b981";
const SKY  = "#0284c7";

const Formula = ({ children, color = ROSE }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}44`, borderRadius:14, padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700, textAlign:"center", margin:`${px(14)} 0` }}>{children}</div>
);

/* ══════ HERO CANVAS — multi-agent network ════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const AGENTS = [
      { label:"Coordinator", icon:"🎯", x:0.50, y:0.20, color:ROSE, r:26 },
      { label:"Researcher",  icon:"🔬", x:0.18, y:0.52, color:CYN,  r:20 },
      { label:"Coder",       icon:"💻", x:0.38, y:0.72, color:VIO,  r:20 },
      { label:"Critic",      icon:"🧐", x:0.62, y:0.72, color:AMB,  r:20 },
      { label:"Writer",      icon:"✍️", x:0.82, y:0.52, color:GRN,  r:20 },
      { label:"Memory",      icon:"💾", x:0.50, y:0.88, color:TEAL, r:16 },
    ];
    const EDGES = [[0,1],[0,2],[0,3],[0,4],[1,5],[2,5],[3,5],[4,5],[1,2],[3,4]];
    const particles = [];
    EDGES.forEach(([a,b]) => {
      for (let i = 0; i < 2; i++)
        particles.push({ a, b, p:Math.random(), speed:0.004+Math.random()*0.003, dir:Math.random()>0.5 });
    });

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#120008"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(225,29,72,0.04)"; ctx.lineWidth=1;
      for (let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for (let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      EDGES.forEach(([a,b]) => {
        const na=AGENTS[a],nb=AGENTS[b];
        const g=ctx.createLinearGradient(na.x*W,na.y*H,nb.x*W,nb.y*H);
        g.addColorStop(0,na.color+"44"); g.addColorStop(1,nb.color+"44");
        ctx.beginPath(); ctx.moveTo(na.x*W,na.y*H); ctx.lineTo(nb.x*W,nb.y*H);
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
      });

      particles.forEach(p => {
        const prog = p.dir ? p.p : 1-p.p;
        p.p = (p.p + p.speed) % 1;
        const na=AGENTS[p.a],nb=AGENTS[p.b];
        const px2=na.x*W+(nb.x-na.x)*W*prog, py2=na.y*H+(nb.y-na.y)*H*prog;
        ctx.beginPath(); ctx.arc(px2,py2,2.5,0,Math.PI*2);
        ctx.fillStyle=AGENTS[p.a].color+"cc"; ctx.fill();
      });

      AGENTS.forEach((ag,ni) => {
        const nx=ag.x*W, ny=ag.y*H, pulse=(Math.sin(t*1.5+ni)+1)/2;
        const gr=ctx.createRadialGradient(nx,ny,0,nx,ny,ag.r+10+pulse*6);
        gr.addColorStop(0,ag.color+"44"); gr.addColorStop(1,ag.color+"00");
        ctx.beginPath(); ctx.arc(nx,ny,ag.r+10+pulse*6,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
        ctx.beginPath(); ctx.arc(nx,ny,ag.r,0,Math.PI*2);
        ctx.fillStyle=ag.color+"22"; ctx.strokeStyle=ag.color+"99"; ctx.lineWidth=2;
        ctx.fill(); ctx.stroke();
        ctx.font=`${px(13)} sans-serif`; ctx.textAlign="center"; ctx.fillStyle=ag.color;
        ctx.fillText(ag.icon,nx,ny+5);
        ctx.font=`bold ${px(8)} sans-serif`; ctx.fillStyle=ag.color+"cc";
        ctx.fillText(ag.label,nx,ny+ag.r+12);
      });
      t+=0.02; raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}} />;
};

/* ══════ AGENT COMMUNICATION VIZ ═════════════════════════════════ */
const AgentCommunicationViz = () => {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const SCENARIO = {
    task: "Write a technical blog post about quantum computing",
    steps: [
      { from:"User",        to:"Coordinator", color:AMB,  msg:"Task: write a technical blog post about quantum computing" },
      { from:"Coordinator", to:"Researcher",  color:CYN,  msg:"Sub-task: research quantum computing fundamentals, recent breakthroughs, and key papers" },
      { from:"Coordinator", to:"Planner",     color:VIO,  msg:"Sub-task: create blog post outline with sections, key points per section" },
      { from:"Researcher",  to:"Coordinator", color:CYN,  msg:"Research complete: qubits, superposition, entanglement, IBM/Google progress, error correction" },
      { from:"Planner",     to:"Coordinator", color:VIO,  msg:"Outline: Intro → Qubits → Algorithms → Applications → Future → Conclusion" },
      { from:"Coordinator", to:"Writer",      color:GRN,  msg:"Write full blog post using research + outline. Target: 1200 words, technical but accessible" },
      { from:"Writer",      to:"Coordinator", color:GRN,  msg:"Draft complete: 1247 words covering all sections" },
      { from:"Coordinator", to:"Critic",      color:ROSE, msg:"Review draft: check accuracy, readability, flow, missing concepts" },
      { from:"Critic",      to:"Coordinator", color:ROSE, msg:"Feedback: Grover's algorithm section needs expanding; add Shor's algorithm example" },
      { from:"Coordinator", to:"Writer",      color:GRN,  msg:"Revise: expand Grover's section, add Shor's algorithm with RSA encryption example" },
      { from:"Writer",      to:"Coordinator", color:GRN,  msg:"Revision complete: 1389 words. Shor's algorithm section added with worked example." },
      { from:"Coordinator", to:"User",        color:AMB,  msg:"Final blog post delivered: 1389 words, peer-reviewed by critic agent, all feedback incorporated." },
    ]
  };

  const AGENT_COLORS = { User:AMB, Coordinator:ROSE, Researcher:CYN, Planner:VIO, Writer:GRN, Critic:PNK };

  const run = () => {
    if (running) return;
    setRunning(true); setStep(-1);
    let s = -1;
    iRef.current = setInterval(() => {
      s++;
      setStep(s);
      if (s >= SCENARIO.steps.length-1) { clearInterval(iRef.current); setRunning(false); }
    }, 800);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  return (
    <div style={{...LCARD, background:"#120008", border:`2px solid ${ROSE}22`}}>
      <div style={{fontWeight:700, color:ROSE, marginBottom:4, fontSize:px(15)}}>
        🔄 Multi-Agent Collaboration — Message Passing Trace
      </div>
      <div style={{background:AMB+"0d", border:`2px solid ${AMB}33`, borderRadius:12, padding:"10px 16px", marginBottom:14}}>
        <span style={{fontWeight:700, color:AMB, fontSize:px(12)}}>🎯 Task: </span>
        <span style={{fontSize:px(13), color:"#fff"}}>{SCENARIO.task}</span>
      </div>
      <div style={{display:"flex", gap:6, marginBottom:14, flexWrap:"wrap"}}>
        {Object.entries(AGENT_COLORS).map(([name,col])=>(
          <div key={name} style={{background:col+"15", border:`1px solid ${col}44`, borderRadius:20, padding:"3px 10px", fontSize:px(10), color:col, fontWeight:700}}>{name}</div>
        ))}
      </div>
      <div style={{minHeight:260, maxHeight:320, overflowY:"auto", marginBottom:12}}>
        {step < 0 && <div style={{color:"#475569", textAlign:"center", padding:"32px", fontSize:px(13)}}>Press Run to watch agents collaborate...</div>}
        {SCENARIO.steps.slice(0, step+1).map((s,i)=>(
          <div key={i} style={{display:"flex", gap:10, marginBottom:8, padding:"8px 12px", background:s.color+"0d", border:`1px solid ${s.color}22`, borderRadius:10}}>
            <div style={{display:"flex", gap:6, alignItems:"center", minWidth:200, flexShrink:0}}>
              <span style={{fontWeight:800, color:AGENT_COLORS[s.from]||ROSE, fontSize:px(11)}}>{s.from}</span>
              <span style={{color:"#475569", fontSize:px(11)}}>→</span>
              <span style={{fontWeight:800, color:AGENT_COLORS[s.to]||ROSE, fontSize:px(11)}}>{s.to}</span>
            </div>
            <div style={{fontSize:px(11), color:"#94a3b8", flex:1}}>{s.msg}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <button onClick={run} disabled={running} style={{
          background:`linear-gradient(135deg,${PNK},${ROSE})`, border:"none", borderRadius:10,
          padding:"9px 22px", color:"#fff", fontWeight:800, fontSize:px(12),
          cursor:running?"default":"pointer", opacity:running?0.6:1
        }}>{running ? "Agents collaborating..." : step >= SCENARIO.steps.length-1 ? "▶ Replay" : "▶ Run Multi-Agent Task"}</button>
        <span style={{fontSize:px(11), color:"#475569"}}>Step {Math.max(0,step+1)} / {SCENARIO.steps.length}</span>
      </div>
    </div>
  );
};

/* ══════ AGENT TYPES EXPLORER ════════════════════════════════════ */
const MASTypesExplorer = () => {
  const [active, setActive] = useState(0);
  const TYPES = [
    { name:"Collaborative MAS", icon:"🤝", color:GRN,
      desc:"Agents work together toward a shared goal. Each agent has complementary skills — no agent can solve the task alone. Communication is cooperative: agents share information, delegate sub-tasks, and pool results. The emergent capability exceeds any single agent.",
      examples:["CrewAI research teams (researcher + writer + critic)","Microsoft AutoGen agent groups","AlphaDev (compiler optimisation team)","Robot swarms for search & rescue"],
      protocol:"Agents share a blackboard or message bus. Coordinator reads the goal, decomposes into sub-tasks, assigns by capability. Results are aggregated by the coordinator before delivery.",
      framework:"CrewAI, AutoGen, LangGraph multi-agent",
      arch:"Goal → Coordinator → [Agent₁, Agent₂, Agent₃] → Aggregator → Result" },
    { name:"Competitive MAS", icon:"⚔️", color:ROSE,
      desc:"Agents compete for limited resources or to outperform each other. Competition drives optimisation — each agent is incentivised to improve its own strategy. Game theory governs equilibrium behaviour. Can produce emergent complexity not explicitly programmed.",
      examples:["AlphaGo self-play (two agents compete, both improve)","GAN training (generator vs discriminator)","Multi-agent trading systems","Auction bidding agents"],
      protocol:"Agents act independently and self-interestedly. Environment provides rewards/payoffs. Nash equilibrium emerges from repeated interactions. No shared communication channel.",
      framework:"OpenAI Gym multi-agent, PettingZoo, custom environments",
      arch:"Agent₁ ←[environment/payoffs]→ Agent₂ (zero-sum or mixed-motive)" },
    { name:"Hierarchical MAS", icon:"🏛️", color:VIO,
      desc:"Agents are organised in a tree structure. Top-level agents decompose goals and command lower-level agents. Lower agents handle execution and report results upward. Enables clean separation of planning (high level) from execution (low level). Scales to large, complex tasks.",
      examples:["LangGraph supervisor + sub-agents","Devin (PM agent → developer agent → tester agent)","Military command hierarchy simulation","Corporate process automation"],
      protocol:"Manager agents issue directives; worker agents execute and return results. Each level operates on its own abstraction. High-level plans survive low-level failures via re-delegation.",
      framework:"LangGraph (StateGraph with supervisor node), AutoGen GroupChatManager",
      arch:"CEO Agent → Manager Agents → Worker Agents → Tools/Environment" },
    { name:"Decentralised MAS", icon:"🌐", color:CYN,
      desc:"No central coordinator. Agents make local decisions based on local information and peer communication. Robust to single points of failure — any agent can fail without stopping the system. Consensus emerges from distributed interactions. Inspired by biological swarms.",
      examples:["Particle swarm optimisation","Ant Colony Optimisation for routing","Blockchain smart contract agents","Distributed sensor network agents"],
      protocol:"Agents communicate peer-to-peer via a shared environment or direct message passing. Consensus algorithms (Byzantine fault tolerance) ensure agreement. Stigmergy: agents coordinate via environment modifications.",
      framework:"Mesa (Python), Agents.jl, custom P2P protocols",
      arch:"Agent₁ ↔ Agent₂ ↔ Agent₃ (peer-to-peer, no central authority)" },
  ];
  const a = TYPES[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:ROSE, marginBottom:8, fontSize:px(15)}}>
        🏗️ Four Types of Multi-Agent Systems
      </div>
      <div style={{display:"flex", gap:6, marginBottom:18, flexWrap:"wrap"}}>
        {TYPES.map((t,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1, minWidth:90,
            background:active===i?t.color:t.color+"0d",
            border:`2px solid ${active===i?t.color:t.color+"33"}`,
            borderRadius:10, padding:"8px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color:active===i?"#fff":t.color, textAlign:"center"
          }}>{t.icon}<br />{t.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20)}}>
        <div>
          <div style={{background:a.color+"0d", border:`2px solid ${a.color}33`, borderRadius:14, padding:"16px", marginBottom:12}}>
            <div style={{fontWeight:800, color:a.color, fontSize:px(15), marginBottom:8}}>{a.icon} {a.name}</div>
            <p style={{...LBODY, fontSize:px(13), margin:0}}>{a.desc}</p>
          </div>
          <div style={{fontFamily:"monospace", fontSize:px(11), color:a.color, background:"#120008", borderRadius:8, padding:"8px 12px", marginBottom:10}}>
            {a.arch}
          </div>
          <div style={{fontSize:px(11), color:AMB, fontWeight:700, marginBottom:3}}>Framework:</div>
          <div style={{fontSize:px(11), color:V.muted}}>{a.framework}</div>
        </div>
        <div>
          <div style={{fontWeight:700, color:a.color, fontSize:px(12), marginBottom:6}}>Coordination protocol:</div>
          <div style={{fontSize:px(12), color:V.muted, marginBottom:10, lineHeight:1.7}}>{a.protocol}</div>
          <div style={{fontWeight:700, color:a.color, fontSize:px(12), marginBottom:6}}>Real-world examples:</div>
          {a.examples.map((ex,i)=>(
            <div key={i} style={{display:"flex", gap:8, marginBottom:5, fontSize:px(12)}}>
              <span style={{color:a.color, fontWeight:700}}>→</span>
              <span style={{color:V.muted}}>{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ AGENT TEAM DESIGNER GAME ════════════════════════════════ */
const AgentTeamDesigner = () => {
  const [task, setTask] = useState(0);
  const [team, setTeam] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const TASKS = [
    { name:"🚀 Launch a Startup",
      desc:"A user wants to validate, build, and launch a new SaaS product idea in 90 days.",
      optimal:["market_researcher","product_designer","engineer","legal","finance"],
      pool:[
        {id:"market_researcher", icon:"🔬", label:"Market Researcher", color:CYN,   why:"Essential — validates the idea, sizes the market, analyses competitors. First step before building anything."},
        {id:"product_designer",  icon:"🎨", label:"Product Designer",  color:VIO,   why:"Essential — designs UX/UI. Bad design kills good products. Needed before engineering starts."},
        {id:"engineer",          icon:"💻", label:"Engineer",          color:GRN,   why:"Essential — builds the product. Without this, nothing ships."},
        {id:"legal",             icon:"⚖️", label:"Legal Agent",        color:ROSE,  why:"Important — handles incorporation, terms, privacy policy. Costly to ignore until later."},
        {id:"finance",           icon:"💰", label:"Finance Agent",      color:AMB,   why:"Important — manages runway, pricing strategy, investor pitch prep."},
        {id:"social_media",      icon:"📱", label:"Social Media Agent", color:PNK,   why:"Nice to have — helpful for marketing but not critical in 90-day MVP phase."},
        {id:"hr",                icon:"👥", label:"HR Agent",           color:TEAL,  why:"Premature — hiring strategy is needed later, not in early MVP phase."},
      ]
    },
    { name:"📝 Write a Research Paper",
      desc:"An academic team needs to produce a peer-reviewed paper on AI safety.",
      optimal:["literature_reviewer","experiment_designer","analyst","writer","peer_reviewer"],
      pool:[
        {id:"literature_reviewer", icon:"📚", label:"Literature Reviewer", color:CYN,  why:"Essential — must survey existing work before claiming novelty."},
        {id:"experiment_designer", icon:"🧪", label:"Experiment Designer",  color:VIO,  why:"Essential — designs methodology and experiments to test hypotheses."},
        {id:"analyst",             icon:"📊", label:"Data Analyst",         color:GRN,  why:"Essential — analyses experimental results, creates visualisations."},
        {id:"writer",              icon:"✍️", label:"Technical Writer",     color:ROSE, why:"Essential — synthesises everything into a coherent, well-structured paper."},
        {id:"peer_reviewer",       icon:"🧐", label:"Peer Reviewer",        color:AMB,  why:"Essential — critiques and improves the draft before submission."},
        {id:"social_media",        icon:"📱", label:"Social Media Agent",   color:PNK,  why:"Not needed — social promotion happens after publication, not during writing."},
        {id:"finance",             icon:"💰", label:"Finance Agent",        color:TEAL, why:"Not needed — budget management is not relevant to paper writing."},
      ]
    },
    { name:"🛒 Build an E-commerce Site",
      desc:"A retailer wants a full online store with catalogue, cart, payments, and fulfilment.",
      optimal:["frontend_dev","backend_dev","database_agent","payment_agent","ux_researcher"],
      pool:[
        {id:"frontend_dev",   icon:"🎨", label:"Frontend Dev",     color:VIO,  why:"Essential — builds the user-facing interface and shopping experience."},
        {id:"backend_dev",    icon:"⚙️", label:"Backend Dev",      color:CYN,  why:"Essential — handles APIs, business logic, order processing."},
        {id:"database_agent", icon:"🗄️", label:"Database Agent",   color:GRN,  why:"Essential — designs product catalogue schema, inventory, order DB."},
        {id:"payment_agent",  icon:"💳", label:"Payment Agent",    color:AMB,  why:"Essential — integrates Stripe/PayPal, handles PCI compliance."},
        {id:"ux_researcher",  icon:"🔬", label:"UX Researcher",    color:ROSE, why:"Important — tests checkout flow UX, reduces cart abandonment."},
        {id:"hr",             icon:"👥", label:"HR Agent",          color:PNK,  why:"Not needed at this stage — team is already defined."},
        {id:"legal",          icon:"⚖️", label:"Legal Agent",      color:TEAL, why:"Nice to have — handles T&C and GDPR but can be templated initially."},
      ]
    },
  ];

  const t = TASKS[task];
  const toggleAgent = (id) => {
    if (submitted) return;
    setTeam(prev => prev.includes(id) ? prev.filter(a=>a!==id) : [...prev, id]);
  };
  const submit = () => {
    const correct = t.optimal.filter(a=>team.includes(a)).length;
    const extra = team.filter(a=>!t.optimal.includes(a)).length;
    setScore(Math.max(0, correct*10 - extra*5));
    setSubmitted(true);
  };
  const reset = () => { setTeam([]); setSubmitted(false); setScore(0); };

  return (
    <div style={{...LCARD, background:"#120008", border:`2px solid ${ROSE}22`}}>
      <div style={{fontWeight:800, color:ROSE, fontSize:px(17), marginBottom:8}}>
        🎮 Design the Best Agent Team
      </div>
      <div style={{display:"flex", gap:6, marginBottom:14}}>
        {TASKS.map((tsk,i)=>(
          <button key={i} onClick={()=>{setTask(i);reset();}} style={{
            flex:1, background:task===i?ROSE:ROSE+"0d",
            border:`2px solid ${task===i?ROSE:ROSE+"33"}`,
            borderRadius:8, padding:"6px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color:task===i?"#fff":ROSE
          }}>{tsk.name}</button>
        ))}
      </div>
      <div style={{background:ROSE+"0d", border:`2px solid ${ROSE}33`, borderRadius:12, padding:"10px 16px", marginBottom:14}}>
        <div style={{fontWeight:700, color:ROSE, fontSize:px(12), marginBottom:2}}>{t.name}</div>
        <div style={{fontSize:px(13), color:"#94a3b8"}}>{t.desc}</div>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20)}}>
        <div>
          <div style={{fontWeight:700, color:"#94a3b8", fontSize:px(11), marginBottom:8}}>Available agents (click to add to team):</div>
          {t.pool.map(ag=>{
            const inTeam=team.includes(ag.id);
            const isOptimal=submitted&&t.optimal.includes(ag.id);
            const isExtra=submitted&&!t.optimal.includes(ag.id)&&inTeam;
            return (
              <div key={ag.id} onClick={()=>toggleAgent(ag.id)}
                style={{
                  display:"flex", alignItems:"center", gap:8, marginBottom:6,
                  background:inTeam?ag.color+"22":ag.color+"08",
                  border:`2px solid ${submitted?(isOptimal?ag.color:isExtra?ROSE:ag.color+"33"):(inTeam?ag.color:ag.color+"33")}`,
                  borderRadius:10, padding:"8px 12px", cursor:submitted?"default":"pointer",
                  transition:"all 0.15s"
                }}>
                <span style={{fontSize:px(16)}}>{ag.icon}</span>
                <span style={{fontWeight:700, color:ag.color, fontSize:px(12), flex:1}}>{ag.label}</span>
                {inTeam&&!submitted&&<span style={{color:ag.color, fontWeight:800}}>✓</span>}
                {submitted&&isOptimal&&inTeam&&<span>✅</span>}
                {submitted&&isExtra&&<span>❌</span>}
                {submitted&&isOptimal&&!inTeam&&<span style={{color:ROSE}}>⚠️ missed</span>}
              </div>
            );
          })}
        </div>
        <div>
          <div style={{fontWeight:700, color:ROSE, fontSize:px(11), marginBottom:8}}>
            Your team ({team.length} agents):
          </div>
          {team.length===0 && <div style={{color:"#475569", fontSize:px(12)}}>No agents selected yet...</div>}
          {team.map(id=>{
            const ag=t.pool.find(a=>a.id===id);
            if (!ag) return null;
            return (
              <div key={id} style={{display:"flex", alignItems:"center", gap:8, marginBottom:6, background:ag.color+"15", border:`1px solid ${ag.color}33`, borderRadius:8, padding:"6px 10px"}}>
                <span style={{fontSize:px(14)}}>{ag.icon}</span>
                <span style={{fontWeight:700, color:ag.color, fontSize:px(11)}}>{ag.label}</span>
              </div>
            );
          })}
          {submitted && (
            <div style={{background:score>=40?GRN+"0d":ROSE+"0d", border:`2px solid ${score>=40?GRN:ROSE}33`, borderRadius:12, padding:"12px", marginTop:10}}>
              <div style={{fontWeight:800, color:score>=40?GRN:ROSE, marginBottom:8, fontSize:px(14)}}>
                Score: {score}/50 {score>=40?"🎉 Excellent!":score>=25?"👍 Good team!":"🤔 Review optimal below"}
              </div>
              <div style={{fontWeight:700, color:GRN, fontSize:px(11), marginBottom:4}}>Optimal agents:</div>
              {t.pool.filter(ag=>t.optimal.includes(ag.id)).map(ag=>(
                <div key={ag.id} style={{marginBottom:4}}>
                  <div style={{fontWeight:700, color:ag.color, fontSize:px(11)}}>{ag.icon} {ag.label}</div>
                  <div style={{fontSize:px(10), color:"#94a3b8"}}>{ag.why}</div>
                </div>
              ))}
            </div>
          )}
          {!submitted && team.length >= 2 && (
            <button onClick={submit} style={{background:ROSE, border:"none", borderRadius:10, padding:"9px 22px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:px(12), marginTop:10, width:"100%"}}>
              Submit Team →
            </button>
          )}
          {submitted && (
            <button onClick={reset} style={{background:"transparent", border:`1px solid ${ROSE}44`, borderRadius:10, padding:"8px 16px", color:ROSE, cursor:"pointer", fontSize:px(11), marginTop:8, width:"100%"}}>
              ↺ Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ MULTI-AGENT PROJECT SIMULATOR ═══════════════════════════ */
const MultiAgentResearchProject = () => {
  const [query, setQuery] = useState("");
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const TOPICS = ["AI safety","quantum computing","climate change","CRISPR gene editing","blockchain economics"];

  const runResearch = (topic) => {
    if (running) return;
    const t = topic || query.trim();
    if (!t) return;
    setQuery(""); setLog([]); setRunning(true);
    const steps = [
      {agent:"Coordinator", color:ROSE, icon:"🎯", msg:`Received research task: "${t}". Decomposing into 3 sub-tasks.`},
      {agent:"Search Agent",color:CYN,  icon:"🔍", msg:`Searching academic databases for: "${t}" papers, key researchers, recent breakthroughs...`},
      {agent:"Search Agent",color:CYN,  icon:"🔍", msg:`Found: 847 papers. Top 5 selected by citation count. Key authors identified.`},
      {agent:"Analyst",     color:VIO,  icon:"📊", msg:`Analysing top 5 papers. Extracting key themes, methodologies, open problems...`},
      {agent:"Analyst",     color:VIO,  icon:"📊", msg:`Analysis complete. 3 main themes: (1) ${t} fundamentals, (2) recent advances, (3) open challenges.`},
      {agent:"Fact-Checker",color:AMB,  icon:"✅", msg:`Cross-referencing claims against 3 independent sources. Checking for contradictions...`},
      {agent:"Fact-Checker",color:AMB,  icon:"✅", msg:`Verification complete: 94% of claims confirmed. 2 contested claims flagged for nuance.`},
      {agent:"Summariser",  color:GRN,  icon:"✍️", msg:`Synthesising verified findings into structured summary with citations...`},
      {agent:"Summariser",  color:GRN,  icon:"✍️", msg:`Summary ready: introduction, key findings, open problems, recommended further reading.`},
      {agent:"Coordinator", color:ROSE, icon:"🎯", msg:`Research complete. 4-agent pipeline finished in ${3+Math.floor(Math.random()*4)} steps. Delivering to user.`},
      {agent:"System",      color:EMR,  icon:"📄", msg:`✅ Research report on "${t}" delivered: 847 words, 5 citations, 3 verified key findings.`},
    ];
    let i=0;
    iRef.current = setInterval(()=>{
      if (i<steps.length){setLog(prev=>[...prev,steps[i]]);i++;}
      else{clearInterval(iRef.current);setRunning(false);}
    }, 750);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  return (
    <div style={{...LCARD, background:"#120008", border:`2px solid ${ROSE}22`}}>
      <div style={{fontWeight:800, color:ROSE, fontSize:px(17), marginBottom:4}}>
        🤖 Multi-Agent Research Pipeline
      </div>
      <p style={{...LBODY, fontSize:px(13), marginBottom:12, color:"#94a3b8"}}>
        Watch a 4-agent pipeline (Coordinator → Search → Analyst → Fact-Checker → Summariser) collaborate to research any topic.
      </p>
      <div style={{display:"flex", gap:6, marginBottom:12, flexWrap:"wrap"}}>
        {TOPICS.map(s=>(
          <button key={s} onClick={()=>runResearch(s)} style={{background:ROSE+"0d", border:`1px solid ${ROSE}33`, borderRadius:20, padding:"4px 10px", fontSize:px(11), color:ROSE, cursor:"pointer", fontWeight:600}}>{s}</button>
        ))}
      </div>
      <div style={{background:"#1a000c", borderRadius:14, padding:"14px", minHeight:160, marginBottom:12, maxHeight:300, overflowY:"auto"}}>
        {log.length===0&&<div style={{color:"#475569",textAlign:"center",padding:"24px",fontSize:px(12)}}>Select a topic or type one to run the multi-agent research pipeline...</div>}
        {log.map((entry,i)=>(
          <div key={i} style={{display:"flex", gap:8, marginBottom:7, padding:"7px 10px", background:entry.color+"0d", border:`1px solid ${entry.color}22`, borderRadius:8}}>
            <span style={{fontSize:px(13), flexShrink:0}}>{entry.icon}</span>
            <div>
              <span style={{fontWeight:800, color:entry.color, fontSize:px(10), marginRight:8}}>[{entry.agent}]</span>
              <span style={{fontSize:px(11), color:"#94a3b8"}}>{entry.msg}</span>
            </div>
          </div>
        ))}
        {running&&<div style={{color:ROSE, fontFamily:"monospace", fontSize:px(11)}}>▌ agents working...</div>}
      </div>
      <div style={{display:"flex", gap:8}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runResearch()}
          placeholder="Enter any research topic..."
          style={{flex:1, borderRadius:10, border:`1px solid ${ROSE}33`, padding:"10px 14px", fontSize:px(13), background:"#1a000c", color:"#fff", outline:"none"}}/>
        <button onClick={()=>runResearch()} disabled={running||!query.trim()} style={{background:ROSE, border:"none", borderRadius:10, padding:"10px 20px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:px(13)}}>Research →</button>
      </div>
    </div>
  );
};

/* ══════ INSIGHTS ════════════════════════════════════════════════ */
const MASInsights = ({onBack}) => {
  const [done,setDone]=useState(Array(8).fill(false));
  const items=[
    {e:"🤝",t:"Multi-agent systems unlock capabilities no single agent can achieve — parallelism, specialisation, redundancy, and cross-checking. The key insight: LLMs can both be agents AND coordinate other agents."},
    {e:"🏛️",t:"The coordinator pattern is the workhorse of production MAS: one LLM decomposes the task, assigns sub-tasks to specialists, aggregates results, and handles failure recovery. LangGraph's supervisor node implements this directly."},
    {e:"📨",t:"Message passing is the foundation of agent communication. Agents share a context (blackboard), pass structured messages (JSON), or update a shared state object. LangGraph's StateGraph is a typed shared state that all agents read and write."},
    {e:"⚖️",t:"Collaborative, competitive, hierarchical, and decentralised MAS each suit different problems. Collaborative for knowledge tasks. Competitive for self-improvement (GAN, RLHF self-play). Hierarchical for complex multi-step projects. Decentralised for robustness."},
    {e:"🔍",t:"Specialisation beats generalisation for complex tasks. A dedicated research agent with arxiv and web tools outperforms a single generalist agent. A dedicated code reviewer catches more bugs than the same agent that wrote the code."},
    {e:"⚠️",t:"Coordination overhead is the main cost. Every agent handoff adds latency and tokens. For simple tasks, a single well-prompted agent beats a multi-agent system. Use MAS when task complexity genuinely requires parallel specialised work."},
    {e:"🧪",t:"CrewAI, Microsoft AutoGen, and LangGraph are the three main frameworks. CrewAI: role-based, sequential. AutoGen: conversation-based, flexible. LangGraph: graph-based, typed state, best for complex conditional flows."},
    {e:"🚀",t:"The frontier: self-organising agent societies (no human-specified roles), agent economies (agents trade capabilities), and persistent agent teams that learn and improve their collaboration protocols over time."},
  ];
  const cnt=done.filter(Boolean).length;
  return (
    <div style={{...LSEC, background:V.paper}}>
      <div style={{maxWidth:px(800), margin:"0 auto"}}>
        {STag("Key Insights · Multi-Agent Systems", ROSE)}
        <h2 style={{...LH2, marginBottom:px(28)}}>8 Things to <span style={{color:ROSE}}>Master</span></h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(14), marginBottom:px(32)}}>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
              style={{...LCARD, cursor:"pointer", border:`2px solid ${done[i]?ROSE+"44":V.border}`, background:done[i]?ROSE+"08":V.paper, transition:"all 0.2s"}}>
              <span style={{fontSize:px(26)}}>{item.e}</span>
              <p style={{...LBODY, margin:"8px 0 0", fontSize:px(13), flex:1, color:done[i]?V.ink:V.muted, fontWeight:done[i]?600:400}}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{background:V.cream, borderRadius:14, padding:"16px 20px", marginBottom:px(24)}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
            <span style={{fontWeight:700, color:V.ink}}>Mastered {cnt}/8</span>
            <span style={{fontWeight:700, color:ROSE}}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{background:V.border, borderRadius:99, height:8}}>
            <div style={{background:`linear-gradient(90deg,${PNK},${ROSE})`, borderRadius:99, height:8, width:`${cnt/8*100}%`, transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{display:"flex", gap:12}}>
          {cnt===8&&<button onClick={onBack} style={{background:`linear-gradient(135deg,${PNK},${ROSE})`, border:"none", borderRadius:10, padding:"12px 28px", fontWeight:800, cursor:"pointer", color:"#fff", fontSize:px(14)}}>Next: ReAct Framework →</button>}
          <button onClick={onBack} style={{border:`1px solid ${V.border}`, background:"none", borderRadius:10, padding:"12px 24px", color:V.muted, cursor:"pointer", fontSize:px(13)}}>← Back to Level 6</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ═══════════════════════════════════════════════ */
const MultiAgentSystemsPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Multi-Agent Systems" lessonNum="Lesson 4 of 5"
    accent={ROSE} levelLabel="Agentic AI"
    dotLabels={["Hero","Introduction","Definition","Architecture","MAS Types","Python","Real World","Challenges","Future","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#120008 0%,#2a0016 60%,#120008 100%)", minHeight:"75vh", display:"flex", alignItems:"center", overflow:"hidden"}}>
          <div style={{maxWidth:px(1100), width:"100%", margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(48), alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"7px 16px", color:"#64748b", cursor:"pointer", fontSize:13, marginBottom:24}}>← Back</button>
              {STag("🤝 Lesson 4 of 5 · Agentic AI", ROSE)}
              <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:px(20)}}>
                Multi-Agent<br /><span style={{color:"#fda4af"}}>Systems</span>
              </h1>
              <p style={{...LBODY, color:"#94a3b8", fontSize:px(17), marginBottom:px(28)}}>
                No single agent can do everything well. Multi-agent systems assign specialised roles to dedicated agents — a team of AI collaborators that can tackle problems of unbounded complexity.
              </p>
              <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                {[["🎯","Coordinator pattern"],["🔬","Specialised roles"],["📨","Message passing"],["🏛️","Hierarchical design"]].map(([icon,label])=>(
                  <div key={label} style={{background:ROSE+"15", border:`1px solid ${ROSE}33`, borderRadius:10, padding:"7px 14px", display:"flex", gap:6, alignItems:"center"}}>
                    <span>{icon}</span><span style={{color:"#fda4af", fontSize:px(12), fontWeight:600}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:340, borderRadius:20, overflow:"hidden", border:`1px solid ${ROSE}22`}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1: INTRO */}
        <div ref={R(1)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 1 · Introduction", ROSE)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Why One Agent <span style={{color:ROSE}}>Isn't Enough</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32)}}>
              <div>
                <p style={{...LBODY, marginBottom:16}}>Consider the task: <em>"Research competitors, write a product strategy, code a prototype, and present to investors."</em> This requires four completely different skill sets — market analysis, strategic writing, software engineering, and presentation design. A single generalist agent will produce mediocre results across all four.</p>
                <p style={{...LBODY, marginBottom:16}}>The solution mirrors how humans work: <strong>teams of specialists</strong>. A multi-agent system (MAS) assigns each sub-task to an agent specifically prompted, equipped, and evaluated for that role. The coordinator orchestrates the team, routes information, and synthesises outputs.</p>
                <IBox color={ROSE} title="Why specialisation works"
                  body="An agent's system prompt, tools, and few-shot examples determine its capability. A research agent with web search, arxiv access, and a system prompt trained on literature review patterns will dramatically outperform a generalist agent on that sub-task. Specialisation trades breadth for depth — and in complex tasks, depth wins." />
              </div>
              <div>
                <div style={{fontWeight:700, color:ROSE, marginBottom:12, fontSize:px(13)}}>Single agent vs multi-agent team:</div>
                {[
                  {task:"Research 20 papers",      single:"Sequential, slow, loses context after 10", multi:"Parallel search + summarise agents"},
                  {task:"Write + review code",      single:"Same agent wrote it — misses own bugs",     multi:"Separate coder + reviewer agents"},
                  {task:"Multi-language task",      single:"Quality degrades across languages",           multi:"Language-specialist agents in parallel"},
                  {task:"Cross-check facts",        single:"Confirms its own hallucinations",             multi:"Independent fact-checker agent"},
                  {task:"Long-horizon projects",    single:"Context window overflows",                    multi:"Each agent works on bounded sub-task"},
                  {task:"Redundancy/reliability",   single:"Single point of failure",                     multi:"Multiple agents, majority voting"},
                ].map(row=>(
                  <div key={row.task} style={{...LCARD, padding:"10px 12px", marginBottom:8}}>
                    <div style={{fontWeight:700, color:ROSE, fontSize:px(12), marginBottom:4}}>{row.task}</div>
                    <div style={{fontSize:px(11), color:"#94a3b8", marginBottom:2}}>❌ Single: {row.single}</div>
                    <div style={{fontSize:px(11), color:GRN}}>✅ MAS: {row.multi}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* S2: DEFINITION */}
        <div ref={R(2)} style={{...LSEC, background:"#120008"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 2 · Formal Definition", ROSE)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>The <span style={{color:"#fda4af"}}>Mathematics</span> of Agent Teams</h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32)}}>
              <div>
                <Formula color={ROSE}>{"MAS = (A, E, I, P)"}</Formula>
                <p style={{...LBODY, color:"#94a3b8", fontSize:px(14), marginBottom:14}}>
                  A multi-agent system is a tuple of: <strong>A</strong> = set of agents, <strong>E</strong> = shared environment, <strong>I</strong> = interaction protocol, <strong>P</strong> = performance measure. Each agent aᵢ ∈ A has its own policy πᵢ, observation space Oᵢ, and action space Aᵢ.
                </p>
                <Formula color={PNK}>{"πᵢ* = argmax E[R | πᵢ, π₋ᵢ]"}</Formula>
                <p style={{...LBODY, color:"#94a3b8", fontSize:px(14)}}>
                  Each agent optimises its policy given the policies of all other agents (π₋ᵢ). In cooperative MAS all agents share the same reward function R. In competitive MAS, agents have opposing objectives. In mixed MAS, partial overlap.
                </p>
              </div>
              <div>
                <div style={{...LCARD, background:"#1a000c", border:`1px solid ${ROSE}33`}}>
                  <div style={{fontWeight:700, color:ROSE, marginBottom:10, fontSize:px(13)}}>Three fundamental interaction types:</div>
                  {[
                    {type:"Cooperation",    icon:"🤝", color:GRN,  desc:"Agents share a common goal. Information sharing is incentivised. Agents can delegate tasks they are less capable of. Emergent division of labour."},
                    {type:"Competition",    icon:"⚔️", color:ROSE, desc:"Agents have opposing goals. Each agent acts self-interestedly. Nash equilibrium determines stable strategy profiles. Produces optimisation pressure."},
                    {type:"Co-opetition",  icon:"⚖️", color:AMB,  desc:"Agents cooperate on shared objectives but compete on individual rewards. Common in markets, research groups, federated learning."},
                  ].map(row=>(
                    <div key={row.type} style={{display:"flex", gap:10, marginBottom:10}}>
                      <span style={{fontSize:px(18), flexShrink:0}}>{row.icon}</span>
                      <div>
                        <div style={{fontWeight:700, color:row.color, fontSize:px(12)}}>{row.type}</div>
                        <div style={{fontSize:px(11), color:"#94a3b8"}}>{row.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S3: ARCHITECTURE */}
        <div ref={R(3)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 3 · Architecture", ROSE)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Coordinator <span style={{color:ROSE}}>Pattern</span> — The Industry Standard</h2>
            <AgentCommunicationViz/>
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:px(14), marginTop:px(24)}}>
              {[
                {icon:"📥",title:"Task Ingestion",   color:AMB,  desc:"User request arrives. Coordinator parses intent, identifies required capabilities, estimates complexity."},
                {icon:"✂️",title:"Decomposition",    color:ROSE, desc:"Coordinator breaks task into sub-tasks. Each sub-task has: owner agent, inputs, expected output format, deadline."},
                {icon:"⚡",title:"Parallel Dispatch", color:CYN,  desc:"Independent sub-tasks are dispatched simultaneously to specialist agents. Dependent tasks are queued."},
                {icon:"🔗",title:"Aggregation",       color:GRN,  desc:"Coordinator collects results, checks completeness, handles failures via re-delegation or graceful degradation."},
              ].map(s=>(
                <div key={s.title} style={{...LCARD, border:`2px solid ${s.color}22`}}>
                  <div style={{fontSize:px(24), marginBottom:8}}>{s.icon}</div>
                  <div style={{fontWeight:700, color:s.color, fontSize:px(13), marginBottom:6}}>{s.title}</div>
                  <p style={{...LBODY, fontSize:px(11), margin:0}}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S4: MAS TYPES */}
        <div ref={R(4)} style={{...LSEC, background:"#120008"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 4 · Types of MAS", ROSE)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Four <span style={{color:"#fda4af"}}>Architectures</span></h2>
            <MASTypesExplorer/>
          </div>
        </div>

        {/* S5: PYTHON */}
        <div ref={R(5)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 5 · Python Frameworks", ROSE)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Building MAS in <span style={{color:ROSE}}>Code</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24)}}>
              <div>
                <div style={{fontWeight:700, color:ROSE, marginBottom:8, fontSize:px(13)}}>CrewAI — role-based agent teams:</div>
                <div style={{background:"#1a000c", border:`1px solid ${ROSE}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2}}>
                  {["from crewai import Agent, Task, Crew, Process","from crewai_tools import SerperDevTool","","# 1. Define specialist agents",
                    "researcher = Agent(",
                    "    role='Senior Research Analyst',",
                    "    goal='Find accurate, comprehensive information',",
                    "    backstory='Expert at synthesising research from multiple sources',",
                    "    tools=[SerperDevTool()],",
                    "    llm='gpt-4o',","    verbose=True",")",
                    "","writer = Agent(",
                    "    role='Technical Writer',",
                    "    goal='Write clear, engaging technical content',",
                    "    backstory='Former academic with 10 years writing experience',",
                    "    llm='gpt-4o'",")",
                    "","critic = Agent(",
                    "    role='Editor and Fact-Checker',",
                    "    goal='Ensure accuracy and quality of all content',",
                    "    backstory='Sceptical editor who catches every error',",
                    "    llm='gpt-4o'",")",
                    "","# 2. Define tasks",
                    "research_task = Task(",
                    "    description='Research the impact of LLMs on software engineering',",
                    "    expected_output='3-page research summary with citations',",
                    "    agent=researcher",")",
                    "","write_task = Task(",
                    "    description='Write a blog post based on the research',",
                    "    expected_output='800-word blog post, markdown format',",
                    "    agent=writer, context=[research_task]",")",
                    "","review_task = Task(",
                    "    description='Review the blog post for accuracy and quality',",
                    "    expected_output='Reviewed post with tracked changes',",
                    "    agent=critic, context=[write_task]",")",
                    "","# 3. Assemble and run crew",
                    "crew = Crew(",
                    "    agents=[researcher, writer, critic],",
                    "    tasks=[research_task, write_task, review_task],",
                    "    process=Process.sequential,  # or parallel",
                    "    verbose=True",")",
                    "result = crew.kickoff()",
                  ].map((l,i)=>(
                    <div key={i} style={{color:l.startsWith("from")||l.startsWith("import")?"#475569":l.startsWith("#")?"#475569":ROSE}}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontWeight:700, color:VIO, marginBottom:8, fontSize:px(13)}}>LangGraph — stateful multi-agent graph:</div>
                <div style={{background:"#1a000c", border:`1px solid ${VIO}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2, marginBottom:14}}>
                  {["from langgraph.graph import StateGraph, END","from typing import TypedDict, Annotated","import operator","",
                    "class ResearchState(TypedDict):",
                    "    task: str",
                    "    research: str",
                    "    draft: str",
                    "    review: str",
                    "    iteration: int","",
                    "def researcher_node(state: ResearchState):",
                    "    findings = research_agent.invoke(state['task'])",
                    "    return {'research': findings}","",
                    "def writer_node(state: ResearchState):",
                    "    draft = writer_agent.invoke(",
                    "        {'task': state['task'], 'research': state['research']}",
                    "    )","    return {'draft': draft}","",
                    "def critic_node(state: ResearchState):",
                    "    review = critic_agent.invoke(state['draft'])",
                    "    return {'review': review, 'iteration': state['iteration']+1}","",
                    "def should_revise(state) -> str:",
                    "    if 'APPROVED' in state['review']: return END",
                    "    if state['iteration'] >= 3: return END",
                    "    return 'writer'  # loop back for revision","",
                    "g = StateGraph(ResearchState)",
                    "g.add_node('researcher', researcher_node)",
                    "g.add_node('writer', writer_node)",
                    "g.add_node('critic', critic_node)",
                    "g.set_entry_point('researcher')",
                    "g.add_edge('researcher', 'writer')",
                    "g.add_edge('writer', 'critic')",
                    "g.add_conditional_edges('critic', should_revise)",
                    "app = g.compile()",
                  ].map((l,i)=>(
                    <div key={i} style={{color:l.startsWith("from")||l.startsWith("import")?"#475569":l.startsWith("#")?"#475569":l.startsWith("class ")?"#c4b5fd":VIO}}>{l||"\u00a0"}</div>
                  ))}
                </div>
                <IBox color={GRN} title="Microsoft AutoGen — conversation-based"
                  body="AutoGen models MAS as group chats between agents. Each agent is a ConversableAgent that can send/receive messages, call tools, and decide when to pass the conversation. The GroupChatManager routes messages. Ideal for open-ended collaborative dialogue — researcher and coder literally converse to solve a problem." />
              </div>
            </div>
          </div>
        </div>

        {/* S6: REAL WORLD */}
        <div ref={R(6)} style={{...LSEC, background:"#120008"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 6 · Real-World MAS", ROSE)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Multi-Agent Systems <span style={{color:"#fda4af"}}>in Production</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:px(16)}}>
              {[
                {icon:"💻",title:"AI Software Teams",     color:ROSE, desc:"Devin AI, SWE-agent. A planner agent decomposes a GitHub issue into tasks. A coder agent implements. A tester agent runs unit tests. A reviewer agent checks code quality. All coordinated by a supervisor. Closes real PRs."},
                {icon:"📈",title:"Trading Agent Networks", color:AMB,  desc:"Hedge funds run fleets of specialised agents: macro analyst, sector analyst, risk manager, trade executor, compliance checker. Each runs independently, reports to a portfolio manager agent that aggregates signals and manages position sizes."},
                {icon:"🤖",title:"Robot Swarms",           color:CYN,  desc:"Boston Dynamics, Amazon Robotics. Hundreds of robots coordinate without a central controller. Each robot perceives local environment, communicates with neighbours, and follows emergent swarm rules. Applications: warehouse pick-and-pack, disaster search, agricultural harvesting."},
                {icon:"🔬",title:"AI Research Labs",       color:VIO,  desc:"Sakana AI's 'AI Scientist' uses a multi-agent loop: ideation agent proposes novel research directions, implementation agent writes code, experiment agent runs trials, paper-writing agent synthesises results, review agent evaluates quality."},
                {icon:"🎮",title:"Game AI Societies",      color:GRN,  desc:"Stanford's 'Generative Agents' (2023): 25 LLM agents in a simulated town. Each has memories, plans, and social relationships. Agents form spontaneous collaborations, gossip, fall in love. Emergent social behaviour from simple rules."},
                {icon:"🌐",title:"Distributed AI Infrastructure", color:TEAL, desc:"Federated learning agents: each data silo trains a local model agent, a coordinator agent aggregates gradients without seeing raw data. Enables privacy-preserving training across hospitals, banks, and mobile devices."},
              ].map(card=>(
                <div key={card.title} style={{...LCARD, background:"#1a000c", border:`2px solid ${card.color}22`}}>
                  <span style={{fontSize:px(26), marginBottom:8, display:"block"}}>{card.icon}</span>
                  <div style={{fontWeight:800, color:card.color, fontSize:px(13), marginBottom:6}}>{card.title}</div>
                  <p style={{...LBODY, color:"#94a3b8", fontSize:px(12), margin:0}}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S7: CHALLENGES */}
        <div ref={R(7)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 7 · Challenges", ROSE)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Hard Problems in <span style={{color:ROSE}}>Multi-Agent Design</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(16)}}>
              {[
                {icon:"🔀",title:"Task decomposition quality",  color:ROSE, desc:"If the coordinator decomposes a task incorrectly — wrong boundaries, missing dependencies, or overly granular sub-tasks — the entire pipeline fails. Task decomposition is itself a hard AI problem, not a solved one."},
                {icon:"📡",title:"Communication overhead",        color:AMB,  desc:"Every message between agents consumes tokens and latency. A 5-agent pipeline where each agent reads 2000 tokens of context costs 5× a single-agent solution. Careful context compression between agent handoffs is essential."},
                {icon:"⚔️",title:"Agent conflicts",              color:VIO,  desc:"Two agents may produce contradictory outputs: the researcher says X, the fact-checker says not-X. The coordinator must resolve conflicts — but may not have the domain expertise to judge correctness. Conflict resolution protocols are an active research area."},
                {icon:"🔄",title:"Cascading failures",           color:CYN,  desc:"If agent A's output is wrong, agent B who depends on it will compound the error, and agent C compounds further. Error propagation in serial pipelines is severe. Verification layers and early stopping are critical."},
                {icon:"🔐",title:"Trust between agents",         color:TEAL, desc:"Can agent B trust agent A's output? In the absence of ground truth, agents must estimate reliability. Untrusted agents in a pipeline are a security risk: a compromised agent can inject malicious instructions into downstream agents."},
                {icon:"💰",title:"Cost and latency scaling",     color:GRN,  desc:"N agents = approximately N× the cost of a single-agent solution. For most tasks, a well-prompted single agent with good tools is more cost-effective than an elaborate multi-agent system. MAS overhead is only justified for genuinely complex tasks."},
              ].map(item=>(
                <div key={item.title} style={{...LCARD}}>
                  <div style={{fontSize:px(22), marginBottom:6}}>{item.icon}</div>
                  <div style={{fontWeight:700, color:item.color, fontSize:px(13), marginBottom:6}}>{item.title}</div>
                  <p style={{...LBODY, fontSize:px(12), margin:0}}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S8: FUTURE */}
        <div ref={R(8)} style={{...LSEC, background:"#120008"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 8 · Future Directions", ROSE)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>The Future of <span style={{color:"#fda4af"}}>Agent Societies</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:px(16)}}>
              {[
                {icon:"🧬",title:"Self-organising systems",   color:ROSE, desc:"Agents that discover their own roles, form teams, and restructure based on task demands — no human-specified agent definitions. Inspired by biological swarm intelligence."},
                {icon:"🌆",title:"AI societies",              color:VIO,  desc:"Large-scale simulations of agent populations with economies, governance, and culture. Generative Agents (Stanford, 2023) is the early prototype. Path to studying emergent social dynamics."},
                {icon:"💱",title:"Agent economies",           color:AMB,  desc:"Agents that buy and sell capabilities: a research agent paying a specialised chemistry agent for molecular analysis. Token-based agent marketplaces where specialisation is economically incentivised."},
                {icon:"🧠",title:"Collective intelligence",   color:GRN,  desc:"Agent teams that surpass the intelligence of any individual agent or human expert. Not just parallelism — genuine emergent insight from the interaction of diverse reasoning styles and knowledge bases."},
                {icon:"🔮",title:"Persistent agent teams",    color:CYN,  desc:"Agent teams that persist across tasks, accumulate shared memory, develop institutional knowledge, and improve their collaboration protocols through experience — analogous to a company's institutional culture."},
                {icon:"⚖️",title:"Agent governance",          color:TEAL, desc:"Constitutional rules for agent societies. How do agent teams resolve disputes? What prevents a rogue agent from subverting the group? Formal governance protocols for multi-agent AI systems."},
              ].map(card=>(
                <div key={card.title} style={{...LCARD, background:"#1a000c", border:`2px solid ${card.color}22`}}>
                  <span style={{fontSize:px(26), marginBottom:8, display:"block"}}>{card.icon}</span>
                  <div style={{fontWeight:800, color:card.color, fontSize:px(13), marginBottom:6}}>{card.title}</div>
                  <p style={{...LBODY, color:"#94a3b8", fontSize:px(12), margin:0}}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GAME */}
        <div ref={R(9)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Game · Team Designer", ROSE)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Play: <span style={{color:ROSE}}>Design the Best Team</span></h2>
            <AgentTeamDesigner/>
          </div>
        </div>

        {/* PROJECT */}
        <div ref={R(10)} style={{...LSEC, background:"#120008"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Project · Research Pipeline", ROSE)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Project: <span style={{color:"#fda4af"}}>Multi-Agent Research System</span></h2>
            <MultiAgentResearchProject/>
          </div>
        </div>

        {/* INSIGHTS */}
        <div ref={R(11)}><MASInsights onBack={onBack}/></div>
      </>
    )}
  </NavPage>
);

export default MultiAgentSystemsPage;