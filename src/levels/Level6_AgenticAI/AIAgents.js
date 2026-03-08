import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — AI AGENTS
   Level 6 · Agentic AI · Lesson 1 of 5
   Accent: Orange #f97316
══════════════════════════════════════════════════════════════════ */
const ORG  = "#f97316";
const AMB  = "#d97706";
const VIO  = "#7c3aed";
const GRN  = "#059669";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const EMR  = "#10b981";
const IND  = "#4f46e5";

const Formula = ({ children, color = ORG }) => (
  <div style={{
    background: color + "0d", border: `1px solid ${color}44`, borderRadius: 14,
    padding: "18px 24px", fontFamily: "monospace", fontSize: px(15), color,
    fontWeight: 700, textAlign: "center", margin: `${px(14)} 0`
  }}>{children}</div>
);

/* ══════ HERO CANVAS ══════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const NODES = [
      { label: "Environment", icon: "🌍", x: 0.50, y: 0.12, color: CYN },
      { label: "Perceive",    icon: "👁️",  x: 0.18, y: 0.50, color: VIO },
      { label: "Reason",      icon: "🧠",  x: 0.50, y: 0.50, color: ORG },
      { label: "Act",         icon: "⚡",  x: 0.82, y: 0.50, color: GRN },
      { label: "Memory",      icon: "💾",  x: 0.50, y: 0.85, color: AMB },
    ];
    const EDGES = [[0,1],[1,2],[2,3],[3,0],[2,4],[4,2]];
    const particles = [];
    EDGES.forEach(([a,b]) => {
      for (let i = 0; i < 3; i++)
        particles.push({ a, b, p: Math.random(), speed: 0.003 + Math.random()*0.004 });
    });

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = "#100800"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = "rgba(249,115,22,0.04)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      EDGES.forEach(([a,b]) => {
        const na=NODES[a], nb=NODES[b];
        const g = ctx.createLinearGradient(na.x*W,na.y*H,nb.x*W,nb.y*H);
        g.addColorStop(0, na.color+"44"); g.addColorStop(1, nb.color+"44");
        ctx.beginPath(); ctx.moveTo(na.x*W,na.y*H); ctx.lineTo(nb.x*W,nb.y*H);
        ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
      });

      particles.forEach(p => {
        p.p = (p.p + p.speed) % 1;
        const na=NODES[p.a], nb=NODES[p.b];
        const px2 = na.x*W + (nb.x-na.x)*W*p.p;
        const py2 = na.y*H + (nb.y-na.y)*H*p.p;
        ctx.beginPath(); ctx.arc(px2,py2,3,0,Math.PI*2);
        ctx.fillStyle = NODES[p.a].color+"cc"; ctx.fill();
      });

      NODES.forEach((n,ni) => {
        const nx=n.x*W, ny=n.y*H;
        const pulse = (Math.sin(t*1.5+ni)+1)/2;
        const g2 = ctx.createRadialGradient(nx,ny,0,nx,ny,32+pulse*8);
        g2.addColorStop(0, n.color+"44"); g2.addColorStop(1, n.color+"00");
        ctx.beginPath(); ctx.arc(nx,ny,32+pulse*8,0,Math.PI*2);
        ctx.fillStyle=g2; ctx.fill();
        ctx.beginPath(); ctx.arc(nx,ny,22,0,Math.PI*2);
        ctx.fillStyle=n.color+"22"; ctx.strokeStyle=n.color+"99"; ctx.lineWidth=2;
        ctx.fill(); ctx.stroke();
        ctx.font=`${px(14)} sans-serif`; ctx.textAlign="center";
        ctx.fillStyle=n.color; ctx.fillText(n.icon,nx,ny+5);
        ctx.font=`bold ${px(9)} sans-serif`; ctx.fillStyle=n.color+"cc";
        ctx.fillText(n.label,nx,ny+36);
      });

      t += 0.02; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block" }} />;
};

/* ══════ AGENT LOOP VIZ ═══════════════════════════════════════════ */
const AgentLoopViz = () => {
  const [phase, setPhase] = useState(0);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const iRef = useRef(null);

  const PHASES = [
    { name:"Perceive", icon:"👁️", color:VIO, action:"Reading user goal + environment state",
      thought:"User wants: cheap London→Tokyo flight for next month. I have access to: web search, flights API, calculator.",
      env:"Input parsed. Date context: March 2026. Tools: [search, flights_api, calc]" },
    { name:"Reason", icon:"🧠", color:ORG, action:"LLM planning next action",
      thought:"To find cheapest flight I need: (1) query flights API, (2) compare prices, (3) return ranked results. Calling flights_api first.",
      env:"Reasoning complete. Selected: CALL_TOOL(flights_api, {from:'LHR', to:'NRT', month:'2026-05'})" },
    { name:"Act", icon:"⚡", color:GRN, action:"Executing: flights_api({from:LHR, to:NRT})",
      thought:"Tool called. Awaiting result...",
      env:"Tool response: [{airline:'ANA',price:£742,stops:1},{airline:'JAL',price:£810,stops:0},{airline:'KLM',price:£699,stops:2}]" },
    { name:"Reason", icon:"🧠", color:ORG, action:"Analysing tool results",
      thought:"Got 3 results. Cheapest: KLM £699 (2 stops). I'll rank by price and present all options to give user the full picture.",
      env:"Decision: GENERATE_RESPONSE with ranked results. No further tool calls needed." },
    { name:"Respond", icon:"✅", color:EMR, action:"Generating grounded final answer",
      thought:"Answer grounded in real API data. Citing source. Presenting ranked options with clear recommendation.",
      env:"Output: 'Cheapest: KLM £699 (2 stops). Direct: ANA £742. Priciest: JAL £810 (non-stop).'" },
  ];

  const run = () => {
    if (running) return;
    setRunning(true); setPhase(0); setLog([]);
    let p = 0;
    iRef.current = setInterval(() => {
      p++;
      const ph = PHASES[p-1];
      if (ph) setLog(prev => [...prev, ph.name + ": " + ph.action]);
      setPhase(p);
      if (p >= PHASES.length) { clearInterval(iRef.current); setRunning(false); }
    }, 1400);
  };
  useEffect(() => () => clearInterval(iRef.current), []);

  const current = PHASES[Math.max(0, phase-1)];

  return (
    <div style={{ ...LCARD, background:"#fff8f0", border:`2px solid ${ORG}22` }}>
      <div style={{ fontWeight:700, color:ORG, marginBottom:8, fontSize:px(15) }}>
        🔄 Agent Decision Loop — Watch an Agent Think Step-by-Step
      </div>
      <div style={{ background:AMB+"0d", border:`2px solid ${AMB}33`, borderRadius:12, padding:"10px 16px", marginBottom:16 }}>
        <span style={{ fontWeight:700, color:AMB, fontSize:px(12) }}>🎯 GOAL: </span>
        <span style={{ fontSize:px(13), color:V.ink }}>Book the cheapest flight from London to Tokyo for next month</span>
      </div>
      <div style={{ display:"flex", gap:4, marginBottom:16, flexWrap:"wrap" }}>
        {PHASES.map((ph, i) => (
          <div key={i} style={{
            flex:1, minWidth:70,
            background: i < phase ? ph.color+"22" : ph.color+"08",
            border:`2px solid ${i < phase ? ph.color : ph.color+"33"}`,
            borderRadius:10, padding:"8px 4px", textAlign:"center", transition:"all 0.3s"
          }}>
            <div style={{ fontSize:px(16) }}>{ph.icon}</div>
            <div style={{ fontWeight:700, color: i < phase ? ph.color : V.muted, fontSize:px(9) }}>{ph.name}</div>
          </div>
        ))}
      </div>

      {current && phase > 0 && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
          <div style={{ background:current.color+"0d", border:`2px solid ${current.color}33`, borderRadius:12, padding:"14px" }}>
            <div style={{ fontWeight:800, color:current.color, marginBottom:8, fontSize:px(13) }}>
              {current.icon} {current.name} — Agent's inner monologue
            </div>
            <p style={{ ...LBODY, fontSize:px(12), margin:0, fontStyle:"italic", color:V.muted }}>
              "{current.thought}"
            </p>
          </div>
          <div style={{ background:"#100800", borderRadius:12, padding:"14px", fontFamily:"monospace", fontSize:px(11), lineHeight:1.9 }}>
            <div style={{ color:"#475569", marginBottom:4 }}># Environment state:</div>
            <div style={{ color:ORG }}>{current.env}</div>
          </div>
        </div>
      )}

      {log.length > 0 && (
        <div style={{ background:"#100800", borderRadius:10, padding:"10px 14px", marginBottom:14, fontFamily:"monospace", fontSize:px(11), lineHeight:2 }}>
          {log.map((l,i) => (
            <div key={i} style={{ color: i===log.length-1 ? ORG : "#475569" }}>
              {i===log.length-1 ? "▶ " : "✓ "}{l}
            </div>
          ))}
        </div>
      )}

      <button onClick={run} disabled={running} style={{
        background:`linear-gradient(135deg,${AMB},${ORG})`, border:"none", borderRadius:10,
        padding:"10px 24px", color:"#fff", fontWeight:800, fontSize:px(13),
        cursor: running ? "default" : "pointer", opacity: running ? 0.6 : 1
      }}>
        {running ? "Agent running..." : phase > 0 ? "▶ Run Again" : "▶ Run Agent"}
      </button>
    </div>
  );
};

/* ══════ AGENT TYPES EXPLORER ════════════════════════════════════ */
const AgentTypesExplorer = () => {
  const [active, setActive] = useState(0);
  const TYPES = [
    { name:"Simple Reflex Agent", color:CYN, icon:"⚡",
      desc:"Reacts directly to the current percept using condition-action rules. No memory. No planning. No world model. Purely reactive — if you cover its sensor, it's helpless.",
      rule:"if percept == 'obstacle': turn_left()\nelif percept == 'open': move_forward()",
      pros:["Extremely fast","Easy to implement","Deterministic"],
      cons:["No memory — forgets instantly","Can't handle partial observability","No planning"],
      examples:["Thermostat (temp < 20 → heat on)","Spam filter (contains 'click here' → spam)","Roomba bump sensor","Traffic light controller"],
      arch:"Percept → Condition-Action Rules → Action" },
    { name:"Model-Based Reflex Agent", color:VIO, icon:"🗺️",
      desc:"Maintains an internal model of the world. Combines current percept with memory of past state to infer hidden state. Much more robust in partially observable environments.",
      rule:"world_state.update(percept, last_action)\nif world_state.obstacle_ahead(): turn_left()",
      pros:["Handles partial observability","Tracks unseen state","More robust"],
      cons:["Model accuracy is critical","Memory grows over time","Model can go stale"],
      examples:["Self-driving car (tracks other cars between frames)","Chess engine (maintains board state)","HVAC (tracks room occupancy)","Robot arm (tracks joint positions)"],
      arch:"Percept + History → World Model → Rules → Action" },
    { name:"Goal-Based Agent", color:ORG, icon:"🎯",
      desc:"Has an explicit goal and searches/plans a sequence of actions to reach it. Can reason about hypothetical futures. Same agent can pursue different goals by changing the goal state.",
      rule:"goal = reach_position(5, 3)\nplan = astar_search(current_state, goal)\nexecute(plan[0])",
      pros:["Plans sequences of actions","Flexible — one agent, many goals","Handles complex tasks"],
      cons:["Planning is computationally expensive","Goal specification is hard","No way to compare equally-good paths"],
      examples:["GPS navigation (A* to destination)","Robot task planning","Game AI pathfinding","Logistics scheduling"],
      arch:"State + Goal → Search/Planning → Action Sequence" },
    { name:"Utility-Based Agent", color:GRN, icon:"📊",
      desc:"Uses a utility function U(state) → number. Selects actions that maximise expected utility. Handles trade-offs that goal-based agents can't: speed vs safety, cost vs comfort.",
      rule:"best_action = argmax_a(\n  sum(P(s'|s,a) * U(s') for s' in states)\n)",
      pros:["Handles conflicting goals gracefully","Probabilistic reasoning","Principled optimal decisions"],
      cons:["Utility function is hard to specify","Computationally expensive","Reward hacking risks"],
      examples:["Recommendation systems (maximise click probability)","Trading bots (maximise risk-adjusted return)","RL game agents (maximise score)","Surge pricing (balance revenue and demand)"],
      arch:"State + Utility Function → Expected Utility Calc → Argmax Action" },
    { name:"Learning Agent", color:ROSE, icon:"🎓",
      desc:"Learns and improves from experience. Four components: performance element (acts), critic (evaluates against performance standard), learning element (improves performance element), problem generator (suggests exploratory actions).",
      rule:"# Q-learning update:\nQ[s][a] += alpha * (\n  r + gamma * max(Q[s_next]) - Q[s][a]\n)",
      pros:["Improves from experience","Works in unknown environments","Discovers non-obvious strategies"],
      cons:["Needs many training examples","May learn unsafe behaviours","Slow start (exploration cost)"],
      examples:["AlphaGo (MCTS + RL)","ChatGPT (RLHF)","Autonomous vehicles (imitation + RL)","DeepMind Atari agents"],
      arch:"Performance Element ↔ Critic ↔ Learning Element ↔ Problem Generator" },
  ];
  const a = TYPES[active];
  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight:700, color:ORG, marginBottom:8, fontSize:px(15) }}>
        🤖 Five Types of AI Agents — The AIMA Taxonomy (Russell & Norvig)
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {TYPES.map((t,i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex:1, minWidth:90,
            background: active===i ? t.color : t.color+"0d",
            border:`2px solid ${active===i ? t.color : t.color+"33"}`,
            borderRadius:10, padding:"8px 6px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color: active===i ? "#fff" : t.color, textAlign:"center"
          }}>{t.icon}<br />{t.name.split(" ").slice(0,2).join(" ")}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
        <div>
          <div style={{ background:a.color+"0d", border:`2px solid ${a.color}33`, borderRadius:14, padding:"16px", marginBottom:12 }}>
            <div style={{ fontWeight:800, color:a.color, fontSize:px(15), marginBottom:8 }}>{a.icon} {a.name}</div>
            <p style={{ ...LBODY, fontSize:px(14), margin:0 }}>{a.desc}</p>
          </div>
          <div style={{ background:"#100800", borderRadius:10, padding:"12px", fontFamily:"monospace", fontSize:px(11), color:ORG, lineHeight:2, marginBottom:10, whiteSpace:"pre-line" }}>
            {a.rule}
          </div>
          <div style={{ fontSize:px(11), color:AMB, fontWeight:700, marginBottom:4 }}>Architecture:</div>
          <div style={{ fontFamily:"monospace", fontSize:px(11), color:V.muted, background:V.cream, borderRadius:8, padding:"8px 12px" }}>
            {a.arch}
          </div>
        </div>
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
            <div style={{ background:GRN+"0d", border:`1px solid ${GRN}22`, borderRadius:10, padding:"10px" }}>
              <div style={{ fontWeight:700, color:GRN, fontSize:px(11), marginBottom:4 }}>✅ Strengths</div>
              {a.pros.map((p,i) => <div key={i} style={{ fontSize:px(11), color:V.muted, marginBottom:2 }}>• {p}</div>)}
            </div>
            <div style={{ background:ROSE+"0d", border:`1px solid ${ROSE}22`, borderRadius:10, padding:"10px" }}>
              <div style={{ fontWeight:700, color:ROSE, fontSize:px(11), marginBottom:4 }}>⚠️ Weaknesses</div>
              {a.cons.map((c,i) => <div key={i} style={{ fontSize:px(11), color:V.muted, marginBottom:2 }}>• {c}</div>)}
            </div>
          </div>
          <div style={{ fontWeight:700, color:a.color, fontSize:px(12), marginBottom:6 }}>Real-world examples:</div>
          {a.examples.map((ex,i) => (
            <div key={i} style={{ display:"flex", gap:8, marginBottom:5, fontSize:px(12) }}>
              <span style={{ color:a.color, fontWeight:700 }}>→</span>
              <span style={{ color:V.muted }}>{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ LLM AGENT ARCHITECTURE ══════════════════════════════════ */
const LLMAgentArchitecture = () => {
  const [hover, setHover] = useState(null);
  const COMPONENTS = [
    { id:"input",    icon:"💬", label:"User Input",    color:AMB,  desc:"Natural language request. Unlike traditional software, no explicit programming needed per task — the LLM infers intent from language. The agent can handle open-ended goals, ambiguous requests, and multi-step tasks from a single sentence." },
    { id:"llm",      icon:"🧠", label:"LLM Core",      color:ORG,  desc:"The central reasoning engine (GPT-4, Claude, Llama 3, etc.). Decides: which tool to call, what information is needed, whether the task is complete. Generates structured JSON tool calls. Maintains reasoning chain in context." },
    { id:"memory",   icon:"💾", label:"Memory",        color:VIO,  desc:"Short-term: conversation history in context window. Long-term: vector database of past interactions and user preferences. Episodic: specific past events. Semantic: world knowledge from training. Working: current task state." },
    { id:"tools",    icon:"🔧", label:"Tools",         color:CYN,  desc:"Functions the agent can call: web search, code executor, calculator, DB query, REST API caller, file reader, email sender, calendar. Tools extend the LLM beyond text into the real world — the key difference from a bare LLM chat." },
    { id:"planner",  icon:"📋", label:"Planner",       color:GRN,  desc:"Decomposes complex goals into subtasks. Some agents plan explicitly (write a plan then execute step-by-step). Others plan implicitly in a ReAct loop: Reason → Act → Observe → Reason. Explicit planning is more reliable for long-horizon tasks." },
    { id:"executor", icon:"⚡", label:"Executor",      color:TEAL, desc:"Runs actual tool calls. Handles: API auth, rate limits, error retries, result parsing. Returns structured observations back to the LLM for next reasoning step. Often sandboxed for security — can't access filesystem or network beyond allowed tools." },
    { id:"output",   icon:"✅", label:"Final Answer",   color:EMR,  desc:"A grounded, verifiable response backed by real tool outputs — web searches, DB queries, code results. Unlike a bare LLM, citations are traceable, facts are retrieved not hallucinated, and answers reflect the current state of the world." },
  ];

  const hovered = COMPONENTS.find(c => c.id === hover);
  const positions = [
    { id:"input",    x:"50%", y:"3%",  tx:"-50%", ty:"0" },
    { id:"memory",   x:"3%",  y:"35%", tx:"0",    ty:"0" },
    { id:"tools",    x:"72%", y:"35%", tx:"0",    ty:"0" },
    { id:"planner",  x:"3%",  y:"62%", tx:"0",    ty:"0" },
    { id:"executor", x:"72%", y:"62%", tx:"0",    ty:"0" },
    { id:"output",   x:"50%", y:"88%", tx:"-50%", ty:"0" },
  ];

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight:700, color:ORG, marginBottom:8, fontSize:px(15) }}>
        🏗️ Modern LLM Agent Architecture — Hover Each Component
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24) }}>
        <div style={{ position:"relative", minHeight:340, background:"#fff8f0", borderRadius:16, border:`2px solid ${ORG}22`, padding:"20px" }}>
          <div onMouseEnter={() => setHover("llm")} onMouseLeave={() => setHover(null)}
            style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:84, height:84,
              borderRadius:"50%", background:ORG+"22", border:`3px solid ${ORG}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"default", zIndex:2 }}>
            <span style={{ fontSize:px(22) }}>🧠</span>
            <span style={{ fontWeight:800, color:ORG, fontSize:px(8) }}>LLM Core</span>
          </div>
          {positions.map(pos => {
            const comp = COMPONENTS.find(c => c.id === pos.id);
            return (
              <div key={pos.id}
                onMouseEnter={() => setHover(pos.id)} onMouseLeave={() => setHover(null)}
                style={{
                  position:"absolute", left:pos.x, top:pos.y,
                  transform:`translate(${pos.tx},${pos.ty})`,
                  background: hover===pos.id ? comp.color+"33" : comp.color+"15",
                  border:`2px solid ${hover===pos.id ? comp.color : comp.color+"55"}`,
                  borderRadius:10, padding:"6px 10px", cursor:"default",
                  display:"flex", alignItems:"center", gap:4, transition:"all 0.15s"
                }}>
                <span style={{ fontSize:px(14) }}>{comp.icon}</span>
                <span style={{ fontWeight:700, color:comp.color, fontSize:px(9) }}>{comp.label}</span>
              </div>
            );
          })}
        </div>
        <div>
          {hovered ? (
            <div style={{ background:hovered.color+"0d", border:`2px solid ${hovered.color}44`, borderRadius:14, padding:"16px", marginBottom:12 }}>
              <div style={{ fontWeight:800, color:hovered.color, fontSize:px(15), marginBottom:8 }}>
                {hovered.icon} {hovered.label}
              </div>
              <p style={{ ...LBODY, fontSize:px(13), margin:0 }}>{hovered.desc}</p>
            </div>
          ) : (
            <div style={{ background:ORG+"0d", border:`1px solid ${ORG}22`, borderRadius:14, padding:"20px", textAlign:"center", color:V.muted, marginBottom:12 }}>
              <div style={{ fontSize:px(32), marginBottom:8 }}>👆</div>
              Hover any component to understand its role
            </div>
          )}
          <IBox color={ORG} title="ReAct: the dominant agent pattern"
            body="ReAct (Yao et al. 2022) interleaves reasoning traces with actions. The LLM outputs: Thought: I need current price → Action: search('AAPL price') → Observation: $182.50 → Thought: I can answer now → Final Answer: Apple stock is $182.50. This is the foundation of LangChain Agents, AutoGPT, and Claude Tools." />
        </div>
      </div>
    </div>
  );
};

/* ══════ GRID NAVIGATION GAME ════════════════════════════════════ */
const AgentNavigationGame = () => {
  const GRID = 7;
  const OBSTACLES = [[1,1],[1,2],[2,4],[3,2],[4,1],[4,5],[5,3],[2,6]];
  const START = [0,0]; const GOAL = [6,6];
  const [pos, setPos] = useState([...START]);
  const [pathTaken, setPathTaken] = useState([[0,0]]);
  const [visited, setVisited] = useState(new Set(["0,0"]));
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState(0);
  const [thinking, setThinking] = useState("");
  const [mode, setMode] = useState("astar");

  const isObs = (r,c) => OBSTACLES.some(([or,oc]) => or===r && oc===c);
  const isGoal = (r,c) => r===GOAL[0] && c===GOAL[1];

  const reset = () => {
    setPos([...START]); setPathTaken([[0,0]]); setVisited(new Set(["0,0"]));
    setDone(false); setSteps(0); setThinking("");
  };

  const ALGOS = {
    reflex: { name:"Reflex (Right/Down)", label:"Simple Reflex", color:CYN,
      desc:"Always tries right first, then down. Fast but gets stuck on obstacles. No planning ahead.",
      getNext: (cur, vis) => {
        const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
        for (const [dr,dc] of dirs) {
          const nr=cur[0]+dr, nc=cur[1]+dc, key=`${nr},${nc}`;
          if (nr>=0&&nr<GRID&&nc>=0&&nc<GRID&&!isObs(nr,nc)&&!vis.has(key)) return [nr,nc];
        }
        return null;
      }
    },
    greedy: { name:"Greedy Best-First", label:"Greedy", color:AMB,
      desc:"Always moves to the neighbour closest to the goal (Manhattan distance). Fast but may find suboptimal paths.",
      getNext: (cur, vis) => {
        const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
        let best=null, bestD=Infinity;
        for (const [dr,dc] of dirs) {
          const nr=cur[0]+dr, nc=cur[1]+dc, key=`${nr},${nc}`;
          if (nr>=0&&nr<GRID&&nc>=0&&nc<GRID&&!isObs(nr,nc)&&!vis.has(key)) {
            const d = Math.abs(nr-GOAL[0])+Math.abs(nc-GOAL[1]);
            if (d < bestD) { bestD=d; best=[nr,nc]; }
          }
        }
        return best;
      }
    },
    astar: { name:"A* Search", label:"A* (Optimal)", color:GRN,
      desc:"f(n) = g(n) + h(n). Combines actual path cost with Manhattan heuristic. Guarantees optimal shortest path.",
      getNext: (cur, vis) => {
        const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
        let best=null, bestF=Infinity;
        const g = pathTaken.length;
        for (const [dr,dc] of dirs) {
          const nr=cur[0]+dr, nc=cur[1]+dc, key=`${nr},${nc}`;
          if (nr>=0&&nr<GRID&&nc>=0&&nc<GRID&&!isObs(nr,nc)&&!vis.has(key)) {
            const h = Math.abs(nr-GOAL[0])+Math.abs(nc-GOAL[1]);
            const f = g+h;
            if (f < bestF) { bestF=f; best=[nr,nc]; }
          }
        }
        return best;
      }
    },
  };

  const stepFn = () => {
    if (done) return;
    const algo = ALGOS[mode];
    const next = algo.getNext(pos, visited);
    if (!next) { setThinking("No path found — agent stuck!"); return; }
    const newVis = new Set(visited); newVis.add(`${next[0]},${next[1]}`);
    setVisited(newVis); setPos(next); setPathTaken(p => [...p, next]); setSteps(s => s+1);
    const h = Math.abs(next[0]-GOAL[0])+Math.abs(next[1]-GOAL[1]);
    setThinking(`Moved to (${next[0]},${next[1]}). Dist to goal: ${h}. Algo: ${algo.name}.`);
    if (isGoal(next[0],next[1])) { setDone(true); setThinking(`🎉 Goal reached in ${steps+1} steps!`); }
  };

  const CELL = 44;
  const pathSet = new Set(pathTaken.map(([r,c]) => `${r},${c}`));

  return (
    <div style={{ ...LCARD, background:"#fff8f0", border:`2px solid ${ORG}22` }}>
      <div style={{ fontWeight:800, color:ORG, fontSize:px(17), marginBottom:8 }}>
        🎮 Agent Navigation Game — Compare Search Algorithms
      </div>
      <p style={{ ...LBODY, fontSize:px(13), marginBottom:16 }}>
        Agent navigates from 🤖 to 🎯 avoiding obstacles. Choose a search strategy and step through its decisions.
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:px(24), alignItems:"start" }}>
        <div>
          <div style={{ display:"inline-block", border:`2px solid ${ORG}33`, borderRadius:10, overflow:"hidden" }}>
            {Array.from({length:GRID},(_,r) => (
              <div key={r} style={{ display:"flex" }}>
                {Array.from({length:GRID},(_,c) => {
                  const isAgent = pos[0]===r && pos[1]===c;
                  const isG = isGoal(r,c);
                  const isOb = isObs(r,c);
                  const isP = pathSet.has(`${r},${c}`) && !isAgent;
                  return (
                    <div key={c} style={{
                      width:CELL, height:CELL, display:"flex", alignItems:"center", justifyContent:"center",
                      background: isOb?"#1a1a1a": isG?GRN+"22": isAgent?ORG+"22": isP?AMB+"22":"#fff",
                      border:`1px solid ${isOb?"#333":ORG+"22"}`,
                      fontSize:px(18), transition:"background 0.2s"
                    }}>
                      {isAgent?"🤖": isG?"🎯": isOb?"🧱": isP?"·":""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:4, marginTop:8 }}>
            {Object.entries(ALGOS).map(([k,v]) => (
              <button key={k} onClick={() => { setMode(k); reset(); }} style={{
                flex:1, background: mode===k ? v.color : v.color+"0d",
                border:`2px solid ${mode===k ? v.color : v.color+"33"}`,
                borderRadius:8, padding:"5px 3px", cursor:"pointer",
                fontWeight:700, fontSize:px(9), color: mode===k?"#fff":v.color
              }}>{v.label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:700, color:ALGOS[mode].color, marginBottom:4, fontSize:px(13) }}>
            {ALGOS[mode].name}
          </div>
          <p style={{ ...LBODY, fontSize:px(12), marginBottom:10 }}>{ALGOS[mode].desc}</p>
          {thinking && (
            <div style={{ background:ORG+"0d", border:`1px solid ${ORG}33`, borderRadius:10, padding:"10px 12px", marginBottom:10, fontFamily:"monospace", fontSize:px(11), color:ORG }}>
              💭 {thinking}
            </div>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
            {[["Steps taken",steps,ORG],["Path length",pathTaken.length,AMB]].map(([l,val,col]) => (
              <div key={l} style={{ background:col+"0d", border:`1px solid ${col}22`, borderRadius:8, padding:"8px", textAlign:"center" }}>
                <div style={{ fontWeight:900, color:col, fontFamily:"monospace", fontSize:px(22) }}>{val}</div>
                <div style={{ fontSize:px(9), color:V.muted }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={stepFn} disabled={done} style={{
              background: done ? V.border : ORG, border:"none", borderRadius:10,
              padding:"9px 20px", color:"#fff", fontWeight:800,
              cursor: done?"default":"pointer", fontSize:px(12), flex:1
            }}>{done ? "🎉 Done!" : "Step →"}</button>
            <button onClick={reset} style={{ background:"transparent", border:`1px solid ${V.border}`, borderRadius:10, padding:"9px 16px", color:V.muted, cursor:"pointer", fontSize:px(12) }}>
              ↺ Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ AGENT ASSISTANT PROJECT ═════════════════════════════════ */
const AgentAssistantProject = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const TOOLS = {
    calculator: { icon:"🧮", name:"Calculator",
      fn: (expr) => { try { const safe = expr.replace(/[^0-9+\-*/().%\s]/g,"").slice(0,60); const r = Function('"use strict"; return ('+safe+')')(); return `${expr} = ${r}`; } catch { return `Error: cannot evaluate "${expr}"`; } }
    },
    weather: { icon:"🌤️", name:"Weather API",
      fn: (city) => `${city}: 18°C, partly cloudy, humidity 65%, wind 12 km/h NW` },
    time:    { icon:"🕐", name:"Clock",
      fn: () => `${new Date().toLocaleTimeString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})` },
    search:  { icon:"🔍", name:"Web Search",
      fn: (q) => `Top results for "${q}": [1] ${q} — Wikipedia overview. [2] Recent news about ${q}. [3] Scholarly articles on ${q}.` },
    define:  { icon:"📖", name:"Dictionary",
      fn: (w) => `"${w}": a term used in AI and computer science to describe autonomous systems that perceive, reason, and act.` },
  };

  const detectTools = (msg) => {
    const m = msg.toLowerCase();
    const out = [];
    if (m.match(/\d[\d\s+\-*/%.()]+/)) out.push(["calculator", msg.match(/[\d\s+\-*/%.()]+/)?.[0]?.trim() || msg]);
    if (m.includes("weather") || m.includes("temperature")) out.push(["weather", msg.match(/in\s+(\w+)/i)?.[1] || "London"]);
    if (m.includes("time") || m.includes("clock") || m.includes("what time")) out.push(["time", ""]);
    if (m.includes("search") || m.includes("find") || m.includes("look up")) out.push(["search", msg.replace(/search|find|look up/gi,"").trim()]);
    if (m.includes("define") || m.includes("what is") || m.includes("meaning")) out.push(["define", msg.replace(/define|what is|meaning of/gi,"").trim()]);
    return out;
  };

  const run = () => {
    if (!input.trim() || running) return;
    const userMsg = input.trim();
    setInput("");
    const toolsNeeded = detectTools(userMsg);
    const thought = toolsNeeded.length > 0
      ? `I need to call: ${toolsNeeded.map(([t]) => TOOLS[t].name).join(", ")}`
      : "I can answer this from my knowledge directly.";

    setMessages(prev => [...prev, { role:"user", text:userMsg }, { role:"thought", text:thought }]);
    setRunning(true);

    let step = 0;
    const toolResults = [];
    iRef.current = setInterval(() => {
      if (step < toolsNeeded.length) {
        const [toolKey, arg] = toolsNeeded[step];
        const result = TOOLS[toolKey].fn(arg);
        toolResults.push({ tool:TOOLS[toolKey].name, icon:TOOLS[toolKey].icon, result });
        setMessages(prev => [...prev, { role:"tool", tool:TOOLS[toolKey].name, icon:TOOLS[toolKey].icon, result }]);
        step++;
      } else {
        clearInterval(iRef.current); setRunning(false);
        let answer = "";
        if (toolResults.length > 0) {
          answer = toolResults.map(r => `${r.icon} ${r.tool}: ${r.result}`).join("\n");
        } else {
          answer = `Based on my training, "${userMsg}" relates to AI agents — autonomous systems that perceive their environment, reason about actions, and execute them to achieve goals.`;
        }
        setMessages(prev => [...prev, { role:"agent", text:answer }]);
      }
    }, 700);
  };
  useEffect(() => () => clearInterval(iRef.current), []);

  const SAMPLES = ["What is 15% of 847?", "Search for reinforcement learning", "What time is it?", "What's the weather in Tokyo?", "Define neural network"];

  return (
    <div style={{ ...LCARD, background:"#fff8f0", border:`2px solid ${ORG}22` }}>
      <div style={{ fontWeight:800, color:ORG, fontSize:px(17), marginBottom:4 }}>
        🤖 Mini Project — AI Agent Assistant
      </div>
      <p style={{ ...LBODY, fontSize:px(13), marginBottom:12 }}>
        A simulated LLM agent with tool-calling. Watch it reason about which tools to invoke, call them, and synthesise a grounded answer.
      </p>
      <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
        {SAMPLES.map(s => (
          <button key={s} onClick={() => setInput(s)} style={{
            background:ORG+"0d", border:`1px solid ${ORG}33`, borderRadius:20, padding:"4px 10px",
            fontSize:px(11), color:ORG, cursor:"pointer", fontWeight:600
          }}>{s}</button>
        ))}
      </div>
      <div style={{ background:"#100800", borderRadius:14, padding:"14px", minHeight:160, marginBottom:12, maxHeight:280, overflowY:"auto" }}>
        {messages.length === 0 && (
          <div style={{ color:"#475569", textAlign:"center", padding:"24px", fontSize:px(12) }}>
            Send a message to run the agent...
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} style={{ marginBottom:8, fontSize:px(12), lineHeight:1.7 }}>
            {m.role === "user" && (
              <div style={{ color:AMB }}><strong>You:</strong> {m.text}</div>
            )}
            {m.role === "thought" && (
              <div style={{ color:"#475569", fontStyle:"italic" }}>💭 Thought: {m.text}</div>
            )}
            {m.role === "tool" && (
              <div style={{ color:CYN }}>{m.icon} Tool [{m.tool}]: {m.result}</div>
            )}
            {m.role === "agent" && (
              <div style={{ color:GRN, whiteSpace:"pre-line" }}><strong>Agent:</strong> {m.text}</div>
            )}
          </div>
        ))}
        {running && <div style={{ color:ORG, fontFamily:"monospace", fontSize:px(11) }}>▌ Agent thinking...</div>}
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && run()}
          placeholder="Ask the agent anything..."
          style={{ flex:1, borderRadius:10, border:`1px solid ${ORG}33`, padding:"10px 14px", fontSize:px(13), background:"#fff", outline:"none" }} />
        <button onClick={run} disabled={running || !input.trim()} style={{
          background:ORG, border:"none", borderRadius:10, padding:"10px 20px",
          color:"#fff", fontWeight:800, cursor:"pointer", fontSize:px(13)
        }}>Send →</button>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ════════════════════════════════════════════ */
const AgentInsights = ({ onBack }) => {
  const [done, setDone] = useState(Array(8).fill(false));
  const items = [
    { e:"🤖", t:"An agent is a perceive-reason-act loop. Not just a chatbot, not just an API caller — it's an autonomous system that takes actions in the world to achieve goals." },
    { e:"📊", t:"The AIMA hierarchy — Reflex → Model → Goal → Utility → Learning — maps directly to the evolution from rule engines to modern RL agents." },
    { e:"🧠", t:"LLM agents use the model as their reasoning core. The LLM decides which tools to call, in what order, and when to stop — enabling open-ended problem solving." },
    { e:"🔧", t:"Tools are the bridge between language and the real world. A bare LLM can only generate text; with tools it can query APIs, run code, and search the web." },
    { e:"💾", t:"Memory separates one-shot chatbots from true agents. Short-term (context window) + long-term (vector DB) + episodic memory allows agents to operate across sessions." },
    { e:"🔄", t:"ReAct (Reason + Act) is the dominant pattern. Interleaving reasoning traces with tool calls lets the agent observe results and adapt its plan — a mini OODA loop." },
    { e:"⚠️", t:"Hallucination, tool misuse, planning failures, and runaway loops are the key failure modes. Real production agents need strict guardrails, human oversight, and sandboxed execution." },
    { e:"🚀", t:"The frontier: autonomous research agents, multi-agent collaboration, embodied robotics AI, and agents with persistent cross-session memory approaching AGI-like behaviour." },
  ];
  const cnt = done.filter(Boolean).length;
  return (
    <div style={{ ...LSEC, background:V.paper }}>
      <div style={{ maxWidth:px(800), margin:"0 auto" }}>
        {STag("Key Insights · AI Agents", ORG)}
        <h2 style={{ ...LH2, marginBottom:px(28) }}>8 Things to <span style={{ color:ORG }}>Master</span></h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(14), marginBottom:px(32) }}>
          {items.map((item,i) => (
            <div key={i} onClick={() => setDone(d => { const n=[...d]; n[i]=!n[i]; return n; })}
              style={{ ...LCARD, cursor:"pointer", border:`2px solid ${done[i] ? ORG+"44" : V.border}`, background:done[i]?ORG+"08":V.paper, transition:"all 0.2s" }}>
              <span style={{ fontSize:px(26) }}>{item.e}</span>
              <p style={{ ...LBODY, margin:"8px 0 0", fontSize:px(13), flex:1, color:done[i]?V.ink:V.muted, fontWeight:done[i]?600:400 }}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:V.cream, borderRadius:14, padding:"16px 20px", marginBottom:px(24) }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontWeight:700, color:V.ink }}>Mastered {cnt}/8 concepts</span>
            <span style={{ fontWeight:700, color:ORG }}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{ background:V.border, borderRadius:99, height:8 }}>
            <div style={{ background:`linear-gradient(90deg,${AMB},${ORG})`, borderRadius:99, height:8, width:`${cnt/8*100}%`, transition:"width 0.4s" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {cnt === 8 && (
            <button onClick={onBack} style={{ background:`linear-gradient(135deg,${AMB},${ORG})`, border:"none", borderRadius:10, padding:"12px 28px", fontWeight:800, cursor:"pointer", color:"#fff", fontSize:px(14) }}>
              Next lesson: Planning & Memory →
            </button>
          )}
          <button onClick={onBack} style={{ border:`1px solid ${V.border}`, background:"none", borderRadius:10, padding:"12px 24px", color:V.muted, cursor:"pointer", fontSize:px(13) }}>
            ← Back to Level 6
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ═══════════════════════════════════════════════ */
const AIAgentsPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="AI Agents" lessonNum="Lesson 1 of 5"
    accent={ORG} levelLabel="Agentic AI"
    dotLabels={["Hero","Introduction","Definition","Architecture","Agent Types","LLM Agents","Python","Applications","Limitations","Future","Game","Project","Insights"]}>
    {R => (
      <>
        {/* ── HERO ── */}
        <div ref={R(0)} style={{ background:"linear-gradient(160deg,#100800 0%,#2a1200 60%,#100800 100%)", minHeight:"75vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
          <div style={{ maxWidth:px(1100), width:"100%", margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(48), alignItems:"center" }}>
            <div>
              <button onClick={onBack} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"7px 16px", color:"#64748b", cursor:"pointer", fontSize:13, marginBottom:24 }}>← Back</button>
              {STag("🤖 Lesson 1 of 5 · Agentic AI", ORG)}
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:px(20) }}>
                AI<br /><span style={{ color:"#fdba74" }}>Agents</span>
              </h1>
              <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(17), marginBottom:px(28) }}>
                Autonomous systems that perceive their environment, reason about possible actions, and execute decisions to achieve goals — the foundation of modern AI systems.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[["🔄","Perceive-Reason-Act loop"],["🔧","Tool use & APIs"],["🧠","LLM reasoning core"],["💾","Memory systems"]].map(([icon,label]) => (
                  <div key={label} style={{ background:ORG+"15", border:`1px solid ${ORG}33`, borderRadius:10, padding:"7px 14px", display:"flex", gap:6, alignItems:"center" }}>
                    <span>{icon}</span><span style={{ color:"#fdba74", fontSize:px(12), fontWeight:600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height:340, borderRadius:20, overflow:"hidden", border:`1px solid ${ORG}22` }}>
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* ── S1: INTRODUCTION ── */}
        <div ref={R(1)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 1 · Introduction", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>What is an <span style={{ color:ORG }}>AI Agent?</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32) }}>
              <div>
                <p style={{ ...LBODY, marginBottom:16 }}>
                  An <strong>AI agent</strong> is a software system that autonomously perceives its environment through sensors or inputs, reasons about what to do next, and executes actions to achieve a specified goal — all without requiring explicit human instructions at each step.
                </p>
                <p style={{ ...LBODY, marginBottom:16 }}>
                  The critical word is <em>autonomous</em>. A regular program follows a fixed script. An agent makes decisions. Given a goal like <em>"research this topic and write a report"</em>, a well-designed agent will decompose the task, search the web, read documents, synthesise findings, and produce output — completely on its own.
                </p>
                <IBox color={ORG} title="The evolution to agents"
                  body="Rule systems (1950s-80s) → ML models (1990s-2000s) → Deep Learning (2010s) → LLMs (2020s) → Agentic AI (now). Each step gained more generalisation. Agents are the step where AI moves from answering questions to completing tasks." />
              </div>
              <div>
                <div style={{ fontWeight:700, color:ORG, marginBottom:12, fontSize:px(13) }}>Evolution of AI autonomy:</div>
                {[
                  { era:"Rule Systems", eg:"Expert systems, chess engines (1950s–80s)", auto:"0%" },
                  { era:"ML Models",    eg:"Email spam filter, image classifier (1990s–2000s)", auto:"15%" },
                  { era:"Deep Learning",eg:"GPT-2, ResNet, BERT (2010s)", auto:"30%" },
                  { era:"LLMs",        eg:"ChatGPT, Claude, Gemini (2020s)", auto:"55%" },
                  { era:"AI Agents",   eg:"AutoGPT, Devin, Claude Projects (2023+)", auto:"85%" },
                ].map(row => (
                  <div key={row.era} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontWeight:700, color:V.ink, fontSize:px(12) }}>{row.era}</span>
                      <span style={{ fontFamily:"monospace", color:ORG, fontSize:px(11) }}>{row.auto} autonomous</span>
                    </div>
                    <div style={{ fontSize:px(11), color:V.muted, marginBottom:4 }}>{row.eg}</div>
                    <div style={{ background:V.border, borderRadius:99, height:6 }}>
                      <div style={{ background:`linear-gradient(90deg,${AMB},${ORG})`, borderRadius:99, height:6, width:row.auto }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:px(16), marginTop:px(24) }}>
              {[
                { icon:"🚗", title:"Autonomous Vehicles",     desc:"Perceive road with sensors, reason about safe path, act by steering. Millions of micro-decisions per minute." },
                { icon:"💹", title:"Trading Bots",             desc:"Perceive market data feeds, reason about signals and risk, act by placing buy/sell orders. Operate at microsecond speed." },
                { icon:"🔬", title:"Research Agents",          desc:"Receive a research question, search the web, read papers, synthesise findings, write a structured report autonomously." },
                { icon:"🎮", title:"Game AI",                  desc:"AlphaGo, AlphaZero, and Starcraft II agents perceive game state, plan sequences of moves, act to win against human champions." },
                { icon:"🤖", title:"Robotic Assistants",       desc:"Boston Dynamics, Tesla Optimus. Perceive physical environment with cameras/LIDAR, reason about manipulation, execute motor actions." },
                { icon:"💻", title:"Coding Agents",            desc:"Devin, GitHub Copilot Agent. Receive a task, browse docs, write code, run tests, fix bugs — closing entire GitHub issues autonomously." },
              ].map(card => (
                <div key={card.title} style={{ ...LCARD }}>
                  <span style={{ fontSize:px(24), marginBottom:8, display:"block" }}>{card.icon}</span>
                  <div style={{ fontWeight:700, color:ORG, fontSize:px(13), marginBottom:6 }}>{card.title}</div>
                  <p style={{ ...LBODY, fontSize:px(12), margin:0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S2: FORMAL DEFINITION ── */}
        <div ref={R(2)} style={{ ...LSEC, background:"#100800" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 2 · Formal Definition", ORG)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>The <span style={{ color:"#fdba74" }}>Mathematics</span> of Agency</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32) }}>
              <div>
                <Formula color={ORG}>{"Agent: E × H → A"}</Formula>
                <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(14), marginBottom:14 }}>
                  A formal agent maps environment observations E and history H to actions A. At each timestep t, the agent receives percept e_t and selects action a_t that maximises its performance measure.
                </p>
                <Formula color={AMB}>{"π* = argmax_π E[Σ γᵗ R(sₜ, aₜ)]"}</Formula>
                <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(14) }}>
                  The optimal policy π* maximises expected cumulative discounted reward — the same objective function used in Reinforcement Learning. γ (gamma) is the discount factor balancing immediate vs future rewards.
                </p>
              </div>
              <div>
                <div style={{ ...LCARD, background:"#1a0e00", border:`1px solid ${ORG}33`, marginBottom:14 }}>
                  <div style={{ fontWeight:700, color:ORG, marginBottom:10, fontSize:px(13) }}>PEAS Framework (Russell & Norvig)</div>
                  {[
                    { letter:"P", label:"Performance", desc:"The metric the agent optimises. E.g. customer satisfaction, profit, task completion rate." },
                    { letter:"E", label:"Environment", desc:"What the agent acts in. Can be: fully/partially observable, deterministic/stochastic, episodic/sequential, static/dynamic." },
                    { letter:"A", label:"Actuators",   desc:"How the agent acts. Motors for robots, API calls for software agents, text output for chatbots." },
                    { letter:"S", label:"Sensors",     desc:"How the agent perceives. Cameras, microphones, data feeds, text inputs, sensor arrays." },
                  ].map(r => (
                    <div key={r.letter} style={{ display:"flex", gap:10, marginBottom:8 }}>
                      <div style={{ width:26, height:26, borderRadius:8, background:ORG+"22", border:`2px solid ${ORG}44`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:ORG, fontSize:px(13), flexShrink:0 }}>{r.letter}</div>
                      <div>
                        <div style={{ fontWeight:700, color:"#fdba74", fontSize:px(12) }}>{r.label}</div>
                        <div style={{ fontSize:px(11), color:"#94a3b8" }}>{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <IBox color={ORG} title="Rational vs Omniscient agents"
                  body="A rational agent maximises expected performance given available information — it doesn't need to be omniscient (know everything). Rationality depends on the performance measure, prior environment knowledge, actions available, and percept sequence so far." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S3: ARCHITECTURE ── */}
        <div ref={R(3)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 3 · Architecture", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>The Agent <span style={{ color:ORG }}>Loop</span></h2>
            <AgentLoopViz />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:px(14), marginTop:px(24) }}>
              {[
                { icon:"👁️", title:"Perceive", color:VIO, items:["Sensor data","Text input","API responses","Tool outputs","Context window"] },
                { icon:"🧠", title:"Reason",   color:ORG, items:["Goal evaluation","Plan selection","Tool choice","Risk assessment","Chain-of-thought"] },
                { icon:"⚡", title:"Act",      color:GRN, items:["Call tools","Send messages","Write files","Execute code","Control hardware"] },
                { icon:"💾", title:"Remember", color:AMB, items:["Update context","Log to memory DB","Track task state","Learn from feedback","Store observations"] },
              ].map(col => (
                <div key={col.title} style={{ ...LCARD, border:`2px solid ${col.color}22` }}>
                  <div style={{ fontSize:px(22), marginBottom:6 }}>{col.icon}</div>
                  <div style={{ fontWeight:800, color:col.color, fontSize:px(14), marginBottom:8 }}>{col.title}</div>
                  {col.items.map(it => <div key={it} style={{ fontSize:px(11), color:V.muted, marginBottom:3 }}>• {it}</div>)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S4: AGENT TYPES ── */}
        <div ref={R(4)} style={{ ...LSEC, background:"#100800" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 4 · Agent Types", ORG)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Five Types of <span style={{ color:"#fdba74" }}>AI Agents</span></h2>
            <AgentTypesExplorer />
          </div>
        </div>

        {/* ── S5: LLM AGENTS ── */}
        <div ref={R(5)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 5 · Modern LLM Agents", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>LLMs as <span style={{ color:ORG }}>Reasoning Engines</span></h2>
            <LLMAgentArchitecture />
          </div>
        </div>

        {/* ── S6: PYTHON ── */}
        <div ref={R(6)} style={{ ...LSEC, background:"#100800" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 6 · Python Implementation", ORG)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Building Agents in <span style={{ color:"#fdba74" }}>Code</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24) }}>
              <div>
                <div style={{ fontWeight:700, color:ORG, marginBottom:8, fontSize:px(13) }}>LangChain Agent with Tools:</div>
                <div style={{ background:"#1a0800", border:`1px solid ${ORG}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(12), lineHeight:2 }}>
                  {[
                    "from langchain.agents import create_react_agent, AgentExecutor",
                    "from langchain.tools import Tool",
                    "from langchain_openai import ChatOpenAI",
                    "from langchain import hub",
                    "",
                    "# 1. Define tools the agent can call",
                    "def web_search(query: str) -> str:",
                    '    return f"Results for: {query}"',
                    "",
                    "tools = [",
                    "    Tool(name='web_search', func=web_search,",
                    "         description='Search the web for info'),",
                    "]",
                    "",
                    "# 2. Choose the LLM reasoning core",
                    "llm = ChatOpenAI(model='gpt-4o', temperature=0)",
                    "",
                    "# 3. Load the ReAct prompt template",
                    "prompt = hub.pull('hwchase17/react')",
                    "",
                    "# 4. Create the agent",
                    "agent = create_react_agent(llm, tools, prompt)",
                    "executor = AgentExecutor(agent=agent, tools=tools,",
                    "                         verbose=True, max_iterations=10)",
                    "",
                    "# 5. Run the agent",
                    "result = executor.invoke({",
                    '    "input": "What is the capital of France and what is its population?"',
                    "})",
                    'print(result["output"])',
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("from")||l.startsWith("import") ? "#475569" : l.startsWith("#") ? "#475569" : l.startsWith("    #") ? "#475569" : ORG }}>{l || "\u00a0"}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight:700, color:AMB, marginBottom:8, fontSize:px(13) }}>OpenAI Function Calling (raw API):</div>
                <div style={{ background:"#1a0800", border:`1px solid ${AMB}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(12), lineHeight:2, marginBottom:14 }}>
                  {[
                    "import openai, json",
                    "",
                    "tools = [{",
                    '  "type": "function",',
                    '  "function": {',
                    '    "name": "get_weather",',
                    '    "description": "Get weather for a city",',
                    '    "parameters": {',
                    '      "type": "object",',
                    '      "properties": {"city": {"type": "string"}},',
                    '      "required": ["city"]',
                    "    }",
                    "  }",
                    "}]",
                    "",
                    "# Agent loop",
                    "messages = [{",
                    '  "role": "user",',
                    '  "content": "Weather in Paris?"',
                    "}]",
                    "",
                    "response = client.chat.completions.create(",
                    '  model="gpt-4o",',
                    "  messages=messages,",
                    "  tools=tools",
                    ")",
                    "",
                    "# Parse tool call from LLM response",
                    "tool_call = response.choices[0].message.tool_calls[0]",
                    "args = json.loads(tool_call.function.arguments)",
                    "# → {'city': 'Paris'}",
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("import")||l.startsWith("from") ? "#475569" : l.startsWith("#") ? "#475569" : AMB }}>{l || "\u00a0"}</div>
                  ))}
                </div>
                <IBox color={GRN} title="AutoGPT / BabyAGI pattern"
                  body="These early autonomous agents run a continuous loop: (1) pull next task from queue, (2) execute with LLM + tools, (3) reflect on result, (4) generate new subtasks, (5) push to queue. The task queue is the agent's working memory. Prioritisation is done by another LLM call." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S7: APPLICATIONS ── */}
        <div ref={R(7)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 7 · Applications", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Agents in the <span style={{ color:ORG }}>Real World</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:px(16) }}>
              {[
                { icon:"🚗", title:"Autonomous Vehicles",  color:CYN,  desc:"Tesla Autopilot, Waymo. Agents perceive environment with cameras, LIDAR, radar. Plan paths. Act via steering, braking, acceleration. Must handle 1000+ decisions/second." },
                { icon:"💊", title:"Drug Discovery",       color:GRN,  desc:"AlphaFold 3 agents predict protein structures. DeepMind's AlphaGeometry solves mathematical proofs. Agents explore chemical spaces too large for human researchers." },
                { icon:"💻", title:"Software Engineering", color:ORG,  desc:"GitHub Copilot Agent, Devin (SWE-agent). Given a GitHub issue, writes code, creates tests, runs CI, iterates until tests pass. Closes real PRs autonomously." },
                { icon:"📈", title:"Financial Trading",    color:AMB,  desc:"Renaissance Technologies, Two Sigma. Agents perceive market microstructure data, reason about signals and portfolio risk, execute trades in microseconds. Manage trillions in assets." },
                { icon:"🎮", title:"Game AI",              color:ROSE, desc:"AlphaGo (Go), OpenAI Five (Dota 2), Pluribus (Poker), AlphaStar (Starcraft II). All surpassed human world champions using agent architectures with planning + learning." },
                { icon:"🔬", title:"Scientific Research",  color:IND,  desc:"PaperQA, Elicit. Agents ingest academic corpora, synthesise findings across hundreds of papers, generate research hypotheses, design experimental protocols." },
              ].map(card => (
                <div key={card.title} style={{ ...LCARD, border:`2px solid ${card.color}22` }}>
                  <span style={{ fontSize:px(28), marginBottom:8, display:"block" }}>{card.icon}</span>
                  <div style={{ fontWeight:800, color:card.color, fontSize:px(14), marginBottom:6 }}>{card.title}</div>
                  <p style={{ ...LBODY, fontSize:px(12), margin:0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S8: LIMITATIONS ── */}
        <div ref={R(8)} style={{ ...LSEC, background:"#100800" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 8 · Limitations", ORG)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Current <span style={{ color:"#fdba74" }}>Challenges</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
              {[
                { title:"Hallucination cascades", color:ROSE, icon:"💭",
                  desc:"A single hallucinated fact early in a chain-of-thought can corrupt all subsequent reasoning. Unlike a simple chatbot, agent errors compound: the agent acts on its false beliefs, making irreversible changes to the real world." },
                { title:"Planning horizon limits", color:AMB, icon:"📋",
                  desc:"LLM agents struggle with tasks requiring 20+ sequential steps. Context window limits mean distant parts of the plan become unreliable. Long-horizon task completion rates drop dramatically compared to 3-5 step tasks." },
                { title:"Tool misuse & security", color:ORG, icon:"🔧",
                  desc:"Prompt injection attacks can hijack an agent's tool calls. A malicious webpage can instruct an agent with browsing access to exfiltrate data, send emails, or purchase items. Sandboxing and least-privilege access are critical." },
                { title:"Runaway loops", color:VIO, icon:"🔄",
                  desc:"Agents can enter infinite loops: calling the same failing tool repeatedly, generating tasks that generate more tasks, or oscillating between contradictory plans. Hard limits on iterations and costs are required in production." },
                { title:"Non-determinism", color:CYN, icon:"🎲",
                  desc:"The same prompt with temperature > 0 produces different tool call sequences each run. This makes debugging and testing agent behaviour difficult. Deterministic traces (temperature=0, seed) help but don't fully solve it." },
                { title:"Alignment & safety", color:TEAL, icon:"⚖️",
                  desc:"Goal misgeneralisation: agents optimise their training objective in unintended ways when deployed in new contexts. A trading agent told to maximise profit might take unacceptably risky positions unless constraints are explicitly specified." },
              ].map(item => (
                <div key={item.title} style={{ ...LCARD, background:"#1a0e00", border:`1px solid ${item.color}33` }}>
                  <div style={{ fontSize:px(22), marginBottom:6 }}>{item.icon}</div>
                  <div style={{ fontWeight:700, color:item.color, fontSize:px(13), marginBottom:6 }}>{item.title}</div>
                  <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(12), margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9: FUTURE ── */}
        <div ref={R(9)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 9 · Future Research", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>The Road to <span style={{ color:ORG }}>Autonomous AI</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:px(16) }}>
              {[
                { icon:"🌐", title:"Multi-Agent Networks",    color:IND,  desc:"Societies of specialised agents collaborating: a Planner delegates to a Researcher, Coder, and Critic simultaneously. Microsoft AutoGen and CrewAI are early implementations." },
                { icon:"🔮", title:"World Models",            color:VIO,  desc:"Agents building internal predictive models of the world (Dreamer, RSSM). Plan entirely in 'imagination' before acting, dramatically improving sample efficiency." },
                { icon:"📚", title:"Lifelong Learning",       color:ORG,  desc:"Agents that continuously update their knowledge from new experiences without catastrophic forgetting. Combining RL, memory-augmented networks, and continual learning algorithms." },
                { icon:"🤝", title:"Human-Agent Teams",       color:GRN,  desc:"Agents as genuinely collaborative colleagues. Mixed-initiative systems where humans set high-level goals, agents execute and surface decisions that need human judgment." },
                { icon:"🧬", title:"Embodied Agents",         color:TEAL, desc:"Physical robots using LLM planning (RT-2, PaLM-E). Language models that understand 'pick up the red cup' and translate it into motor commands for real robotic manipulators." },
                { icon:"🛡️", title:"Constitutional Agents",   color:ROSE, desc:"Agents with built-in ethical constraints (Anthropic's Constitutional AI). Agents that reason about the ethics of their actions before taking them — the foundation of safe AGI." },
              ].map(card => (
                <div key={card.title} style={{ ...LCARD, border:`2px solid ${card.color}22` }}>
                  <span style={{ fontSize:px(28), marginBottom:8, display:"block" }}>{card.icon}</span>
                  <div style={{ fontWeight:800, color:card.color, fontSize:px(14), marginBottom:6 }}>{card.title}</div>
                  <p style={{ ...LBODY, fontSize:px(12), margin:0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── GAME ── */}
        <div ref={R(10)} style={{ ...LSEC, background:"#100800" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Game · Navigation Challenge", ORG)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Play: <span style={{ color:"#fdba74" }}>Agent Navigation</span></h2>
            <AgentNavigationGame />
          </div>
        </div>

        {/* ── PROJECT ── */}
        <div ref={R(11)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Project · Build an Agent", ORG)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Project: <span style={{ color:ORG }}>Agent Assistant</span></h2>
            <AgentAssistantProject />
          </div>
        </div>

        {/* ── INSIGHTS ── */}
        <div ref={R(12)}>
          <AgentInsights onBack={onBack} />
        </div>
      </>
    )}
  </NavPage>
);

export default AIAgentsPage;