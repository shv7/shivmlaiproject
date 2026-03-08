import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — PLANNING & MEMORY
   Level 6 · Agentic AI · Lesson 2 of 5
   Accent: Violet #7c3aed
══════════════════════════════════════════════════════════════════ */
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const ORG  = "#f97316";
const AMB  = "#d97706";
const GRN  = "#059669";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const EMR  = "#10b981";
const SKY  = "#0284c7";

const Formula = ({ children, color = VIO }) => (
  <div style={{
    background: color + "0d", border: `1px solid ${color}44`, borderRadius: 14,
    padding: "18px 24px", fontFamily: "monospace", fontSize: px(15), color,
    fontWeight: 700, textAlign: "center", margin: `${px(14)} 0`
  }}>{children}</div>
);

/* ══════ HERO CANVAS — planning tree ══════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const TREE = [
      { id:0, label:"Goal",         x:0.50, y:0.10, color:VIO,  children:[1,2,3] },
      { id:1, label:"Sub-task A",   x:0.18, y:0.38, color:IND,  children:[4,5] },
      { id:2, label:"Sub-task B",   x:0.50, y:0.38, color:ORG,  children:[6,7] },
      { id:3, label:"Sub-task C",   x:0.82, y:0.38, color:GRN,  children:[8] },
      { id:4, label:"Action 1",     x:0.06, y:0.65, color:CYN,  children:[] },
      { id:5, label:"Action 2",     x:0.24, y:0.65, color:CYN,  children:[] },
      { id:6, label:"Action 3",     x:0.40, y:0.65, color:AMB,  children:[] },
      { id:7, label:"Action 4",     x:0.58, y:0.65, color:AMB,  children:[] },
      { id:8, label:"Action 5",     x:0.82, y:0.65, color:TEAL, children:[] },
    ];

    const particles = [];
    TREE.forEach(node => {
      node.children.forEach(cid => {
        for (let i = 0; i < 2; i++)
          particles.push({ from:node.id, to:cid, p:Math.random(), speed:0.005+Math.random()*0.003 });
      });
    });

    const getNode = (id) => TREE.find(n => n.id === id);

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = "#0a0018"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle = "rgba(124,58,237,0.04)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x+=40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y+=40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // draw edges
      TREE.forEach(node => {
        node.children.forEach(cid => {
          const child = getNode(cid);
          if (!child) return;
          const g = ctx.createLinearGradient(node.x*W,node.y*H,child.x*W,child.y*H);
          g.addColorStop(0, node.color+"55"); g.addColorStop(1, child.color+"55");
          ctx.beginPath(); ctx.moveTo(node.x*W,node.y*H); ctx.lineTo(child.x*W,child.y*H);
          ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
        });
      });

      // particles along edges
      particles.forEach(p => {
        p.p = (p.p + p.speed) % 1;
        const from=getNode(p.from), to=getNode(p.to);
        if (!from||!to) return;
        const px2 = from.x*W+(to.x-from.x)*W*p.p;
        const py2 = from.y*H+(to.y-from.y)*H*p.p;
        ctx.beginPath(); ctx.arc(px2,py2,2.5,0,Math.PI*2);
        ctx.fillStyle=from.color+"cc"; ctx.fill();
      });

      // draw nodes
      TREE.forEach((n,ni) => {
        const nx=n.x*W, ny=n.y*H;
        const pulse=(Math.sin(t*1.5+ni)+1)/2;
        const r = n.children.length>0 ? 20+pulse*4 : 14+pulse*3;
        const gn=ctx.createRadialGradient(nx,ny,0,nx,ny,r+10);
        gn.addColorStop(0,n.color+"44"); gn.addColorStop(1,n.color+"00");
        ctx.beginPath(); ctx.arc(nx,ny,r+10,0,Math.PI*2);
        ctx.fillStyle=gn; ctx.fill();
        ctx.beginPath(); ctx.arc(nx,ny,r,0,Math.PI*2);
        ctx.fillStyle=n.color+"22"; ctx.strokeStyle=n.color+"99"; ctx.lineWidth=2;
        ctx.fill(); ctx.stroke();
        ctx.font=`bold ${px(8)} sans-serif`; ctx.textAlign="center"; ctx.fillStyle=n.color;
        ctx.fillText(n.label,nx,ny+4);
      });

      // memory blocks at bottom
      const MEM_COLS=[VIO,IND,ORG,GRN,AMB];
      MEM_COLS.forEach((col,i) => {
        const bx=0.15*W+i*0.16*W, by=0.88*H;
        const bw=0.12*W, bh=16+Math.sin(t*2+i)*4;
        ctx.fillStyle=col+"33"; ctx.strokeStyle=col+"77"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(bx,by-bh,bw,bh,4); ctx.fill(); ctx.stroke();
      });
      ctx.font=`${px(8)} sans-serif`; ctx.textAlign="center"; ctx.fillStyle="#475569";
      ctx.fillText("Memory Store",0.5*W,0.97*H);

      t += 0.02; raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{ width:"100%", height:"100%", display:"block" }} />;
};

/* ══════ MEMORY TYPES EXPLORER ═══════════════════════════════════ */
const MemoryTypesExplorer = () => {
  const [active, setActive] = useState(0);
  const TYPES = [
    { name:"Sensory / Working Memory", icon:"⚡", color:CYN,
      desc:"The agent's immediate, short-lived buffer. In LLMs this is literally the context window — everything the model can 'see' right now. Extremely fast to access but very limited in size (128K tokens ≈ ~100 pages of text).",
      capacity:"128K–1M tokens (GPT-4, Gemini Ultra)", duration:"Single conversation or task",
      analogy:"Your working memory when solving a math problem in your head — limited slots, fades immediately",
      llm_impl:"Context window. System prompt + conversation history + tool results. Managed by conversation manager.",
      limits:["Context window overflow on long tasks","Recency bias — later content dominates attention","No persistence across sessions — vanishes after context clears"],
      examples:["Current conversation turns","Active tool results","Intermediate reasoning steps","Scratchpad for calculations"],
    },
    { name:"Short-Term / Episodic Memory", icon:"📝", color:VIO,
      desc:"Recent experiences and task history. LLM agents implement this as conversation summaries, rolling memory windows, or a recent-event log stored in a fast key-value store. Persists for hours to days.",
      capacity:"Hundreds to thousands of episodes (compressed)", duration:"Hours to days",
      analogy:"Your memory of what you did this morning — vivid recent detail but fades within days",
      llm_impl:"Conversation summary buffers (LangChain ConversationSummaryMemory). Rolling window of last N messages. Redis or SQLite backed.",
      limits:["Compression loses detail","Temporal ordering can degrade","Summarisation introduces bias"],
      examples:["Previous conversation summaries","Recent tool call history","Task progress logs","User preferences from recent sessions"],
    },
    { name:"Long-Term Semantic Memory", icon:"🗄️", color:ORG,
      desc:"General factual knowledge about the world. In LLMs this is baked into the weights during training. For agents, it's also augmented with external knowledge bases via RAG (Retrieval-Augmented Generation). Extremely large capacity.",
      capacity:"Effectively unlimited (knowledge bases, weights)", duration:"Permanent",
      analogy:"Your general knowledge — you know Paris is the capital of France without needing to recall when you learned it",
      llm_impl:"Model weights (implicit). External: vector DB (Pinecone, Weaviate, Chroma) with semantic search. Retrieved via RAG at query time.",
      limits:["Knowledge cutoff date","Retrieved chunks may be out-of-context","Embedding search isn't perfect — relevant docs can be missed"],
      examples:["Domain knowledge bases","Company documentation","Historical data","Scientific literature"],
    },
    { name:"Procedural Memory", icon:"⚙️", color:GRN,
      desc:"Knowledge of how to do things — skills, procedures, workflows. In agents this is encoded as: prompt templates, tool schemas, chain-of-thought examples, and fine-tuned model behaviour. Governs the agent's capabilities.",
      capacity:"Fixed (model weights + prompt library)", duration:"Permanent until retrained",
      analogy:"Muscle memory — how to ride a bike, type, or drive. Automatic, fast, doesn't require active recall.",
      llm_impl:"System prompts, few-shot examples, fine-tuning (LoRA, RLHF), tool definitions, LangChain runnables.",
      limits:["Hard to update without retraining","Can't easily introspect what it 'knows how to do'","May generalise incorrectly to novel situations"],
      examples:["Tool call patterns","Reasoning templates","Domain-specific skills","Safety guidelines"],
    },
    { name:"External / Shared Memory", icon:"🌐", color:ROSE,
      desc:"Memory accessible to multiple agents or persistent across complete system restarts. Implemented as external databases, file systems, or shared context stores. Critical for multi-agent systems and long-running autonomous agents.",
      capacity:"Unlimited (external DB/filesystem)", duration:"Permanent",
      analogy:"Written notes, shared documents, or a team wiki — persistent and shareable",
      llm_impl:"Vector DBs, relational DBs, file systems, cloud storage. mem0, Zep, MemGPT for agent memory management. Redis for fast key-value.",
      limits:["Read/write latency","Consistency challenges in multi-agent setups","Privacy/security: agents reading each other's memory"],
      examples:["Shared team knowledge base","Cross-session user preferences","Agent coordination state","Long-term project memory"],
    },
  ];
  const a = TYPES[active];
  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(15) }}>
        💾 Five Types of Agent Memory — Click Each Type
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {TYPES.map((t,i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex:1, minWidth:80,
            background: active===i ? t.color : t.color+"0d",
            border:`2px solid ${active===i ? t.color : t.color+"33"}`,
            borderRadius:10, padding:"8px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color: active===i ? "#fff" : t.color, textAlign:"center"
          }}>{t.icon}<br />{t.name.split(" ")[0]}<br />{t.name.split(" ")[1]||""}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
        <div>
          <div style={{ background:a.color+"0d", border:`2px solid ${a.color}33`, borderRadius:14, padding:"16px", marginBottom:12 }}>
            <div style={{ fontWeight:800, color:a.color, fontSize:px(15), marginBottom:8 }}>{a.icon} {a.name}</div>
            <p style={{ ...LBODY, fontSize:px(13), margin:0 }}>{a.desc}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:10 }}>
            {[["⚡ Capacity",a.capacity],[`⏱️ Duration`,a.duration]].map(([k,val]) => (
              <div key={k} style={{ background:a.color+"0d", border:`1px solid ${a.color}22`, borderRadius:8, padding:"8px 10px" }}>
                <div style={{ fontWeight:700, color:a.color, fontSize:px(10), marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:px(11), color:V.muted }}>{val}</div>
              </div>
            ))}
          </div>
          <div style={{ background:V.cream, borderRadius:10, padding:"10px 12px", fontSize:px(12), color:V.muted, fontStyle:"italic", marginBottom:10 }}>
            🧠 Human analogy: {a.analogy}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:700, color:a.color, fontSize:px(12), marginBottom:6 }}>LLM Implementation:</div>
          <div style={{ fontFamily:"monospace", fontSize:px(11), color:a.color, background:"#0a0018", borderRadius:8, padding:"8px 12px", marginBottom:10 }}>
            {a.llm_impl}
          </div>
          <div style={{ fontWeight:700, color:ROSE, fontSize:px(11), marginBottom:4 }}>⚠️ Key limitations:</div>
          {a.limits.map((l,i) => <div key={i} style={{ fontSize:px(11), color:V.muted, marginBottom:3 }}>• {l}</div>)}
          <div style={{ fontWeight:700, color:a.color, fontSize:px(11), marginBottom:4, marginTop:8 }}>Use cases:</div>
          {a.examples.map((ex,i) => <div key={i} style={{ fontSize:px(11), color:V.muted, marginBottom:2 }}>→ {ex}</div>)}
        </div>
      </div>
    </div>
  );
};

/* ══════ TASK DECOMPOSITION DEMO ═════════════════════════════════ */
const TaskDecompositionDemo = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(new Set([0]));

  const TASKS = [
    {
      goal:"Plan a 7-day trip to Japan",
      root:{ id:0, label:"Plan 7-day Japan trip", color:VIO, children:[
        { id:1, label:"🛫 Book flights", color:IND, children:[
          { id:4, label:"Compare LHR→NRT prices", color:CYN, children:[] },
          { id:5, label:"Select cheapest option", color:CYN, children:[] },
          { id:6, label:"Book and confirm seats", color:CYN, children:[] },
        ]},
        { id:2, label:"🏨 Arrange accommodation", color:ORG, children:[
          { id:7, label:"Research Tokyo hotels", color:AMB, children:[] },
          { id:8, label:"Research Kyoto ryokans", color:AMB, children:[] },
          { id:9, label:"Book 3 nights each", color:AMB, children:[] },
        ]},
        { id:3, label:"📍 Plan itinerary", color:GRN, children:[
          { id:10, label:"List must-see places", color:TEAL, children:[] },
          { id:11, label:"Map daily routes", color:TEAL, children:[] },
          { id:12, label:"Reserve popular spots", color:TEAL, children:[] },
        ]},
      ]},
    },
    {
      goal:"Build and deploy a web application",
      root:{ id:0, label:"Build & deploy web app", color:VIO, children:[
        { id:1, label:"⚙️ Backend", color:IND, children:[
          { id:4, label:"Design REST API", color:CYN, children:[] },
          { id:5, label:"Write FastAPI routes", color:CYN, children:[] },
          { id:6, label:"Add auth middleware", color:CYN, children:[] },
        ]},
        { id:2, label:"🎨 Frontend", color:ORG, children:[
          { id:7, label:"Create React components", color:AMB, children:[] },
          { id:8, label:"Connect to API", color:AMB, children:[] },
          { id:9, label:"Add responsive CSS", color:AMB, children:[] },
        ]},
        { id:3, label:"🚀 Deploy", color:GRN, children:[
          { id:10, label:"Dockerise app", color:TEAL, children:[] },
          { id:11, label:"Push to GitHub", color:TEAL, children:[] },
          { id:12, label:"Deploy to Vercel", color:TEAL, children:[] },
        ]},
      ]},
    },
    {
      goal:"Write a research paper on AI safety",
      root:{ id:0, label:"Write AI safety paper", color:VIO, children:[
        { id:1, label:"📚 Literature review", color:IND, children:[
          { id:4, label:"Search arXiv for papers", color:CYN, children:[] },
          { id:5, label:"Read 20 key papers", color:CYN, children:[] },
          { id:6, label:"Synthesise findings", color:CYN, children:[] },
        ]},
        { id:2, label:"✍️ Writing", color:ORG, children:[
          { id:7, label:"Draft introduction", color:AMB, children:[] },
          { id:8, label:"Write core sections", color:AMB, children:[] },
          { id:9, label:"Write conclusion", color:AMB, children:[] },
        ]},
        { id:3, label:"📝 Review", color:GRN, children:[
          { id:10, label:"Check citations", color:TEAL, children:[] },
          { id:11, label:"Proofread & edit", color:TEAL, children:[] },
          { id:12, label:"Submit to arXiv", color:TEAL, children:[] },
        ]},
      ]},
    },
  ];

  const task = TASKS[selected];

  const renderNode = (node, depth=0) => {
    const isExp = expanded.has(node.id);
    const toggle = () => setExpanded(prev => {
      const n=new Set(prev); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n;
    });
    return (
      <div key={node.id} style={{ marginLeft: depth*16 }}>
        <div onClick={node.children.length ? toggle : undefined}
          style={{
            display:"flex", alignItems:"center", gap:8, padding:"7px 12px",
            background:node.color+"0d", border:`1px solid ${node.color}33`,
            borderRadius:8, marginBottom:4, cursor:node.children.length?"pointer":"default",
            transition:"all 0.15s"
          }}>
          {node.children.length > 0 && (
            <span style={{ color:node.color, fontWeight:800, fontSize:px(12), width:12 }}>
              {isExp ? "▾" : "▸"}
            </span>
          )}
          <span style={{ fontWeight:600, color:node.color, fontSize:px(12) }}>{node.label}</span>
          {node.children.length > 0 && (
            <span style={{ fontSize:px(10), color:V.muted, marginLeft:"auto" }}>
              {node.children.length} subtasks
            </span>
          )}
        </div>
        {isExp && node.children.map(child => renderNode(child, depth+1))}
      </div>
    );
  };

  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(15) }}>
        🌳 Task Decomposition — Click Nodes to Expand/Collapse
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18 }}>
        {TASKS.map((t,i) => (
          <button key={i} onClick={() => { setSelected(i); setExpanded(new Set([0])); }} style={{
            flex:1, background: selected===i ? VIO : VIO+"0d",
            border:`2px solid ${selected===i ? VIO : VIO+"33"}`,
            borderRadius:10, padding:"8px 6px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color: selected===i ? "#fff" : VIO, textAlign:"center"
          }}>{t.goal.split(" ").slice(0,4).join(" ")}...</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24) }}>
        <div>
          <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(13) }}>
            🎯 Goal: {task.goal}
          </div>
          {renderNode(task.root)}
          <p style={{ ...LBODY, fontSize:px(12), marginTop:12, color:V.muted }}>
            Click nodes with ▸ to expand subtasks. This is exactly what a planning agent does: hierarchical decomposition until each leaf node is a single executable action.
          </p>
        </div>
        <div>
          <IBox color={VIO} title="Hierarchical Task Networks (HTN)"
            body="HTN planning formalises this: compound tasks are decomposed via 'methods' into primitive tasks (actions). The planner searches for a method sequence that achieves the goal. LLM planners learn decomposition implicitly from training data rather than explicit method libraries." />
          <div style={{ ...LCARD, background:VIO+"0d", border:`1px solid ${VIO}22`, marginTop:10 }}>
            <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(12) }}>LangChain PlanAndExecute:</div>
            <div style={{ fontFamily:"monospace", fontSize:px(11), lineHeight:2, color:VIO, background:"#0a0018", borderRadius:8, padding:"8px 12px" }}>
              <div style={{ color:"#475569" }}>{"# 1. Planner LLM: generate step-by-step plan"}</div>
              <div>{"from langchain_experimental import PlanAndExecute"}</div>
              <div>{"from langchain_experimental.plan_and_execute import"}</div>
              <div>{"    load_agent_executor, load_chat_planner"}</div>
              <div style={{ color:"#475569", marginTop:4 }}>{"# 2. Executor LLM: execute each step"}</div>
              <div>{"planner = load_chat_planner(llm)"}</div>
              <div>{"executor = load_agent_executor(llm, tools)"}</div>
              <div>{"agent = PlanAndExecute(planner, executor)"}</div>
              <div style={{ color:"#475569" }}>{"# Output: plan steps + results per step"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ PLANNING ALGORITHMS VIZ ═════════════════════════════════ */
const PlanningAlgorithmsViz = () => {
  const [active, setActive] = useState(0);
  const ALGOS = [
    { name:"Forward Search", icon:"▶️", color:VIO,
      desc:"Start from current state, apply actions forward until goal is reached. Like reading a recipe step-by-step. Simple but can explore many irrelevant branches.",
      complexity:"O(b^d) — b: branching factor, d: solution depth",
      use:"Short-horizon planning, reflex agents, systems where goal is easy to check",
      code:["def forward_search(state, goal, actions):",
            "    if state == goal: return []",
            "    for action in actions:",
            "        next_s = apply(action, state)",
            "        if is_valid(next_s):",
            "            rest = forward_search(next_s, goal, actions)",
            "            if rest is not None:",
            "                return [action] + rest",
            "    return None  # no plan found"],
    },
    { name:"Backward Search (Regression)", icon:"◀️", color:IND,
      desc:"Start from the goal, work backwards to find what states are needed. Efficient when there are many possible starting states but few paths to the goal. Used in theorem provers and symbolic planners.",
      complexity:"O(b^d) but often much smaller search space",
      use:"Goal-directed planning, theorem proving, symbolic AI, STRIPS planners",
      code:["def backward_search(goal, current, operators):",
            "    if current.satisfies(goal): return []",
            "    for op in operators:",
            "        if op.adds(goal):  # op achieves part of goal",
            "            subgoal = op.preconditions",
            "            rest = backward_search(subgoal, current, operators)",
            "            if rest is not None:",
            "                return rest + [op]",
            "    return None"],
    },
    { name:"Monte Carlo Tree Search", icon:"🎲", color:ORG,
      desc:"Used by AlphaGo. Builds a game tree by: Selection (follow UCB1 policy), Expansion (add new node), Simulation (random rollout to end), Backpropagation (update values). Balances exploitation vs exploration without exhaustive search.",
      complexity:"O(n * simulation_length) — can be tuned with compute budget",
      use:"Game playing, combinatorial optimisation, LLM reasoning trees (Tree-of-Thought)",
      code:["def mcts(root, n_simulations):",
            "    for _ in range(n_simulations):",
            "        # Selection: UCB1 tree policy",
            "        node = tree_policy(root)",
            "        # Expansion: add new child",
            "        child = expand(node)",
            "        # Simulation: random rollout",
            "        reward = simulate(child)",
            "        # Backpropagation: update values",
            "        backprop(child, reward)",
            "    return best_child(root)"],
    },
    { name:"LLM Chain-of-Thought", icon:"🧠", color:GRN,
      desc:"Modern LLM agents implicitly plan via chain-of-thought prompting. The LLM 'thinks aloud' step-by-step before answering. Tree-of-Thoughts extends this to exploring multiple reasoning branches and selecting the best path. No explicit state space needed.",
      complexity:"O(k * context_length) — k parallel branches",
      use:"LLM agents, complex reasoning, multi-step problem solving, ReAct agents",
      code:['system_prompt = """',
            "You are a planning agent. Before answering:",
            "1. Break the problem into steps",
            "2. Reason through each step",
            "3. Identify which tools you need",
            "4. Execute step by step",
            "5. Verify your final answer",
            '"""',
            "",
            "# Tree-of-Thoughts: explore multiple paths",
            "thoughts = [generate_thought(problem) for _ in range(3)]",
            "best = evaluate_thoughts(thoughts)",
            "answer = execute_plan(best)"],
    },
  ];
  const a = ALGOS[active];
  return (
    <div style={{ ...LCARD }}>
      <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(15) }}>
        🔍 Planning Algorithms — From Classical to LLM-Based
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {ALGOS.map((al,i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex:1, minWidth:90,
            background: active===i ? al.color : al.color+"0d",
            border:`2px solid ${active===i ? al.color : al.color+"33"}`,
            borderRadius:10, padding:"8px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color: active===i ? "#fff" : al.color, textAlign:"center"
          }}>{al.icon}<br />{al.name.split(" ").slice(0,2).join(" ")}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
        <div>
          <div style={{ background:a.color+"0d", border:`2px solid ${a.color}33`, borderRadius:14, padding:"16px", marginBottom:12 }}>
            <div style={{ fontWeight:800, color:a.color, fontSize:px(15), marginBottom:8 }}>{a.icon} {a.name}</div>
            <p style={{ ...LBODY, fontSize:px(13), margin:0 }}>{a.desc}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div style={{ background:a.color+"0d", border:`1px solid ${a.color}22`, borderRadius:8, padding:"8px 10px" }}>
              <div style={{ fontWeight:700, color:a.color, fontSize:px(10), marginBottom:2 }}>⏱️ Complexity</div>
              <div style={{ fontFamily:"monospace", fontSize:px(10), color:V.muted }}>{a.complexity}</div>
            </div>
            <div style={{ background:a.color+"0d", border:`1px solid ${a.color}22`, borderRadius:8, padding:"8px 10px" }}>
              <div style={{ fontWeight:700, color:a.color, fontSize:px(10), marginBottom:2 }}>✅ Best for</div>
              <div style={{ fontSize:px(10), color:V.muted }}>{a.use}</div>
            </div>
          </div>
        </div>
        <div style={{ background:"#0a0018", borderRadius:12, padding:"14px", fontFamily:"monospace", fontSize:px(11), lineHeight:2 }}>
          {a.code.map((line,i) => (
            <div key={i} style={{ color: line.startsWith("def ")||line.startsWith("class ")||line.startsWith("for ")||line.startsWith("if ") ? a.color : line.startsWith("#")||line.startsWith("    #") ? "#475569" : line.trim()==="" ? "transparent" : a.color+"cc" }}>
              {line || "\u00a0"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ REACT AGENT TRACE ═══════════════════════════════════════ */
const ReActAgentTrace = () => {
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const TRACE = [
    { type:"input",   label:"User Query", color:AMB,
      content:"What is the square root of the population of France?" },
    { type:"thought", label:"Thought 1",  color:VIO,
      content:"I need to find the current population of France. I should search for this rather than guessing from training data, as it changes." },
    { type:"action",  label:"Action 1",   color:CYN,
      content:"search(query='France population 2025')" },
    { type:"obs",     label:"Observation 1", color:GRN,
      content:"France population (2025): approximately 68,400,000 people." },
    { type:"thought", label:"Thought 2",  color:VIO,
      content:"Good, population is 68,400,000. Now I need to calculate sqrt(68,400,000). I'll use the calculator tool for precision." },
    { type:"action",  label:"Action 2",   color:CYN,
      content:"calculator(expr='68400000 ** 0.5')" },
    { type:"obs",     label:"Observation 2", color:GRN,
      content:"68400000 ** 0.5 = 8270.43" },
    { type:"thought", label:"Thought 3",  color:VIO,
      content:"I have both pieces: population = 68.4 million, square root ≈ 8,270.43. I can now give a complete, grounded answer." },
    { type:"answer",  label:"Final Answer", color:EMR,
      content:"The population of France is approximately 68.4 million people (2025). The square root of 68,400,000 is approximately 8,270.43." },
  ];

  const run = () => {
    if (running) return;
    setRunning(true); setStep(-1);
    let s = -1;
    iRef.current = setInterval(() => {
      s++;
      setStep(s);
      if (s >= TRACE.length - 1) { clearInterval(iRef.current); setRunning(false); }
    }, 900);
  };
  useEffect(() => () => clearInterval(iRef.current), []);

  const ICONS = { input:"💬", thought:"💭", action:"⚡", obs:"🔭", answer:"✅" };

  return (
    <div style={{ ...LCARD, background:"#0a0018", border:`2px solid ${VIO}22` }}>
      <div style={{ fontWeight:700, color:VIO, marginBottom:4, fontSize:px(15) }}>
        🔄 ReAct Agent Trace — Thought → Action → Observation loop
      </div>
      <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(13), marginBottom:16 }}>
        Watch how a planning-aware agent interleaves reasoning with tool calls. Each observation informs the next thought.
      </p>
      <div style={{ minHeight:220, marginBottom:14 }}>
        {TRACE.slice(0, step+1).map((t,i) => (
          <div key={i} style={{
            display:"flex", gap:10, marginBottom:8, padding:"10px 14px",
            background:t.color+"0d", border:`1px solid ${t.color}22`, borderRadius:10
          }}>
            <span style={{ fontSize:px(14), flexShrink:0 }}>{ICONS[t.type]}</span>
            <div>
              <div style={{ fontWeight:700, color:t.color, fontSize:px(11), marginBottom:2 }}>{t.label}</div>
              <div style={{ fontFamily:"monospace", fontSize:px(12), color:"#94a3b8", lineHeight:1.6 }}>{t.content}</div>
            </div>
          </div>
        ))}
        {step === -1 && <div style={{ color:"#475569", textAlign:"center", padding:"24px", fontSize:px(13) }}>Press Run to watch the ReAct loop...</div>}
      </div>
      <button onClick={run} disabled={running} style={{
        background:`linear-gradient(135deg,${IND},${VIO})`, border:"none", borderRadius:10,
        padding:"10px 24px", color:"#fff", fontWeight:800, fontSize:px(13),
        cursor: running?"default":"pointer", opacity: running?0.6:1
      }}>{running ? "Running..." : step >= TRACE.length-1 ? "▶ Replay" : "▶ Run ReAct Agent"}</button>
    </div>
  );
};

/* ══════ TASK PLANNER GAME ═══════════════════════════════════════ */
const TaskPlannerGame = () => {
  const [goalIdx, setGoalIdx] = useState(0);
  const [steps, setSteps] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const GOALS = [
    { goal:"Deploy a new feature to production",
      pool:["Write feature code","Deploy to production","Run tests","Create pull request","Get code review","Merge to main","Monitor post-deploy"],
      correct:["Write feature code","Run tests","Create pull request","Get code review","Merge to main","Deploy to production","Monitor post-deploy"] },
    { goal:"Publish a research paper",
      pool:["Submit to journal","Write abstract","Conduct experiments","Write introduction","Collect results","Peer review","Final edits"],
      correct:["Conduct experiments","Collect results","Write introduction","Write abstract","Final edits","Submit to journal","Peer review"] },
    { goal:"Launch a startup",
      pool:["Build MVP","Validate idea","Raise seed funding","Launch publicly","Find co-founder","Get first users","Incorporate company"],
      correct:["Validate idea","Find co-founder","Incorporate company","Build MVP","Get first users","Raise seed funding","Launch publicly"] },
  ];

  const g = GOALS[goalIdx];
  const poolLeft = g.pool.filter(p => !steps.includes(p));

  const addStep = (s) => setSteps(prev => [...prev, s]);
  const removeStep = (i) => setSteps(prev => prev.filter((_,j) => j !== i));

  const submit = () => {
    let pts = 0;
    steps.forEach((s, i) => { if (s === g.correct[i]) pts++; });
    setScore(pts);
    setSubmitted(true);
    setFeedback(pts >= 5 ? "🎉 Excellent! Your plan matches the optimal sequence." : pts >= 3 ? "👍 Good plan! A few steps could be reordered." : "🤔 Review the optimal sequence — order matters in planning!");
  };

  const reset = () => { setSteps([]); setSubmitted(false); setFeedback(""); setScore(0); };

  return (
    <div style={{ ...LCARD, background:"#f5f0ff", border:`2px solid ${VIO}22` }}>
      <div style={{ fontWeight:800, color:VIO, fontSize:px(17), marginBottom:8 }}>
        🎮 Task Planner Game — Sequence the Steps Correctly
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {GOALS.map((gl,i) => (
          <button key={i} onClick={() => { setGoalIdx(i); reset(); }} style={{
            flex:1, background: goalIdx===i ? VIO : VIO+"0d",
            border:`2px solid ${goalIdx===i ? VIO : VIO+"33"}`,
            borderRadius:8, padding:"6px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color: goalIdx===i?"#fff":VIO
          }}>{gl.goal.split(" ").slice(0,3).join(" ")}...</button>
        ))}
      </div>
      <div style={{ background:VIO+"0d", border:`2px solid ${VIO}33`, borderRadius:12, padding:"10px 16px", marginBottom:14 }}>
        <span style={{ fontWeight:700, color:VIO, fontSize:px(13) }}>🎯 Goal: </span>
        <span style={{ fontSize:px(13), color:V.ink }}>{g.goal}</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
        <div>
          <div style={{ fontWeight:700, color:V.muted, fontSize:px(11), marginBottom:8 }}>Available steps (click to add):</div>
          <div style={{ minHeight:120 }}>
            {poolLeft.map(s => (
              <button key={s} onClick={() => !submitted && addStep(s)}
                onDragStart={() => setDragging(s)} onDragEnd={() => setDragging(null)}
                draggable
                style={{
                  display:"block", width:"100%", textAlign:"left", marginBottom:5,
                  background: dragging===s ? VIO+"33" : VIO+"0d",
                  border:`1px solid ${VIO}33`, borderRadius:8, padding:"7px 10px",
                  cursor: submitted?"default":"pointer", fontSize:px(12), color:VIO, fontWeight:600
                }}>{s}</button>
            ))}
            {poolLeft.length===0 && steps.length===g.pool.length && (
              <div style={{ color:V.muted, fontSize:px(12), textAlign:"center", padding:"12px" }}>All steps added!</div>
            )}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:700, color:VIO, fontSize:px(11), marginBottom:8 }}>Your plan (click step to remove):</div>
          <div style={{ minHeight:120 }}>
            {steps.map((s,i) => {
              const correct2 = submitted && s === g.correct[i];
              const wrong = submitted && s !== g.correct[i];
              return (
                <div key={i} onClick={() => !submitted && removeStep(i)}
                  style={{
                    display:"flex", alignItems:"center", gap:8, marginBottom:5,
                    background: correct2 ? GRN+"22" : wrong ? ROSE+"22" : VIO+"0d",
                    border:`1px solid ${correct2 ? GRN : wrong ? ROSE : VIO}33`,
                    borderRadius:8, padding:"7px 10px", cursor: submitted?"default":"pointer"
                  }}>
                  <span style={{ fontWeight:800, color:VIO+"77", fontSize:px(11), width:16 }}>{i+1}.</span>
                  <span style={{ fontSize:px(12), color: correct2?GRN:wrong?ROSE:VIO, fontWeight:600, flex:1 }}>{s}</span>
                  {submitted && <span>{correct2?"✅":"❌"}</span>}
                </div>
              );
            })}
            {steps.length===0 && <div style={{ color:V.muted, fontSize:px(12), textAlign:"center", padding:"12px" }}>Click steps on the left to build your plan</div>}
          </div>
        </div>
      </div>
      {feedback && (
        <div style={{ background:VIO+"0d", border:`2px solid ${VIO}33`, borderRadius:12, padding:"12px 16px", marginTop:14 }}>
          <div style={{ fontWeight:700, color:VIO, marginBottom:4 }}>{feedback}</div>
          <div style={{ fontSize:px(12), color:V.muted }}>Score: {score}/{g.correct.length} steps in correct order.</div>
          {submitted && (
            <div style={{ marginTop:8 }}>
              <div style={{ fontWeight:700, color:GRN, fontSize:px(11), marginBottom:4 }}>Optimal sequence:</div>
              {g.correct.map((s,i) => <div key={i} style={{ fontSize:px(11), color:V.muted }}>{i+1}. {s}</div>)}
            </div>
          )}
        </div>
      )}
      <div style={{ display:"flex", gap:8, marginTop:14 }}>
        {!submitted ? (
          <button onClick={submit} disabled={steps.length<3} style={{
            background: steps.length<3 ? V.border : VIO, border:"none", borderRadius:10,
            padding:"9px 24px", color:"#fff", fontWeight:800, cursor:steps.length<3?"default":"pointer", fontSize:px(12)
          }}>Submit Plan →</button>
        ) : (
          <button onClick={reset} style={{ background:VIO, border:"none", borderRadius:10, padding:"9px 24px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:px(12) }}>
            ↺ Try Again
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ════════════════════════════════════════════ */
const PlanInsights = ({ onBack }) => {
  const [done, setDone] = useState(Array(8).fill(false));
  const items = [
    { e:"💾", t:"Memory is what separates stateless LLMs from persistent agents. Working memory (context), episodic (summaries), semantic (knowledge base), and external (shared DB) serve distinct roles." },
    { e:"🌳", t:"Planning is hierarchical decomposition: break a goal into subtasks until every leaf is an atomic executable action. HTN planning formalises this; LLM agents learn it from training data." },
    { e:"🔄", t:"ReAct (Reason + Act) is the dominant agent loop. Interleaving reasoning traces with tool calls gives agents the ability to observe, adapt, and error-correct in real time." },
    { e:"🧠", t:"Chain-of-Thought (CoT) and Tree-of-Thoughts (ToT) are implicit planning techniques. Making the LLM 'think aloud' before acting dramatically improves performance on multi-step tasks." },
    { e:"⚡", t:"Short-term memory = context window. The brutal limit: everything the agent can 'see' at once. Managing what goes in and out of the context window is the key engineering challenge in production agents." },
    { e:"🗄️", t:"Long-term memory via vector databases (Pinecone, Weaviate, Chroma). RAG retrieves relevant chunks at query time — the agent effectively has a searchable external brain." },
    { e:"📋", t:"Explicit planning (write plan → execute) vs implicit planning (ReAct loop) trade off between reliability and flexibility. Explicit planning suits well-defined tasks; ReAct handles open-ended ones better." },
    { e:"🚀", t:"The frontier: persistent agent memory across sessions (MemGPT), hierarchical planning with sub-agents, memory graphs for associative recall — the building blocks of AGI-like cognitive architectures." },
  ];
  const cnt = done.filter(Boolean).length;
  return (
    <div style={{ ...LSEC, background:V.paper }}>
      <div style={{ maxWidth:px(800), margin:"0 auto" }}>
        {STag("Key Insights · Planning & Memory", VIO)}
        <h2 style={{ ...LH2, marginBottom:px(28) }}>8 Things to <span style={{ color:VIO }}>Master</span></h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(14), marginBottom:px(32) }}>
          {items.map((item,i) => (
            <div key={i} onClick={() => setDone(d => { const n=[...d]; n[i]=!n[i]; return n; })}
              style={{ ...LCARD, cursor:"pointer", border:`2px solid ${done[i]?VIO+"44":V.border}`, background:done[i]?VIO+"08":V.paper, transition:"all 0.2s" }}>
              <span style={{ fontSize:px(26) }}>{item.e}</span>
              <p style={{ ...LBODY, margin:"8px 0 0", fontSize:px(13), flex:1, color:done[i]?V.ink:V.muted, fontWeight:done[i]?600:400 }}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{ background:V.cream, borderRadius:14, padding:"16px 20px", marginBottom:px(24) }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontWeight:700, color:V.ink }}>Mastered {cnt}/8 concepts</span>
            <span style={{ fontWeight:700, color:VIO }}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{ background:V.border, borderRadius:99, height:8 }}>
            <div style={{ background:`linear-gradient(90deg,${IND},${VIO})`, borderRadius:99, height:8, width:`${cnt/8*100}%`, transition:"width 0.4s" }} />
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {cnt===8 && (
            <button onClick={onBack} style={{ background:`linear-gradient(135deg,${IND},${VIO})`, border:"none", borderRadius:10, padding:"12px 28px", fontWeight:800, cursor:"pointer", color:"#fff", fontSize:px(14) }}>
              Next lesson: Tool Usage →
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
const PlanningMemoryPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Planning & Memory" lessonNum="Lesson 2 of 5"
    accent={VIO} levelLabel="Agentic AI"
    dotLabels={["Hero","Why Memory?","Memory Types","Planning Intro","Task Decomposition","Algorithms","ReAct","Python","Applications","Limitations","Future","Game","Project","Insights"]}>
    {R => (
      <>
        {/* ── HERO ── */}
        <div ref={R(0)} style={{ background:"linear-gradient(160deg,#0a0018 0%,#1a0a3a 60%,#0a0018 100%)", minHeight:"75vh", display:"flex", alignItems:"center", overflow:"hidden" }}>
          <div style={{ maxWidth:px(1100), width:"100%", margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(48), alignItems:"center" }}>
            <div>
              <button onClick={onBack} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"7px 16px", color:"#64748b", cursor:"pointer", fontSize:13, marginBottom:24 }}>← Back</button>
              {STag("🧠 Lesson 2 of 5 · Agentic AI", VIO)}
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:px(20) }}>
                Planning &amp;<br /><span style={{ color:"#c4b5fd" }}>Memory</span>
              </h1>
              <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(17), marginBottom:px(28) }}>
                Without memory, agents forget. Without planning, agents flounder. These two cognitive capacities transform a reactive LLM into a goal-directed autonomous agent.
              </p>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {[["💾","5 memory types"],["🌳","Hierarchical planning"],["🔄","ReAct loop"],["🧮","MCTS & search"]].map(([icon,label]) => (
                  <div key={label} style={{ background:VIO+"15", border:`1px solid ${VIO}33`, borderRadius:10, padding:"7px 14px", display:"flex", gap:6, alignItems:"center" }}>
                    <span>{icon}</span><span style={{ color:"#c4b5fd", fontSize:px(12), fontWeight:600 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height:340, borderRadius:20, overflow:"hidden", border:`1px solid ${VIO}22` }}>
              <HeroCanvas />
            </div>
          </div>
        </div>

        {/* ── S1: WHY MEMORY & PLANNING? ── */}
        <div ref={R(1)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 1 · Why These Abilities Matter", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>The <span style={{ color:VIO }}>Cognitive Gap</span> in LLMs</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32) }}>
              <div>
                <p style={{ ...LBODY, marginBottom:16 }}>
                  A bare LLM is essentially <strong>amnesiac and reactive</strong>. Each call is completely stateless: it sees the context window, produces tokens, and forgets everything the moment the call ends. Ask it to "continue the research you started yesterday" and it has no idea what you mean.
                </p>
                <p style={{ ...LBODY, marginBottom:16 }}>
                  <strong>Memory</strong> solves the continuity problem. <strong>Planning</strong> solves the complexity problem. Together they enable agents to: tackle multi-day projects, recover from partial failures, coordinate with other agents, and decompose goals too complex to solve in a single LLM call.
                </p>
                <IBox color={VIO} title="The planning horizon problem"
                  body="Studies show LLM agents succeed on ~70% of 5-step tasks, ~40% of 10-step tasks, and under 10% of 20-step tasks without explicit memory and planning systems. The agent simply loses track of state, forgets earlier observations, or runs out of context. Memory + planning are the solution." />
              </div>
              <div>
                <div style={{ fontWeight:700, color:VIO, marginBottom:12, fontSize:px(13) }}>Without vs With planning + memory:</div>
                {[
                  { cap:"Single-call task",              without:"✅ Works fine", with_:"✅ Works fine" },
                  { cap:"Multi-step research",           without:"⚠️ Loses track", with_:"✅ Persistent state" },
                  { cap:"Error recovery",                without:"❌ Fails silently", with_:"✅ Re-plans on failure" },
                  { cap:"Cross-session continuity",      without:"❌ Complete reset", with_:"✅ Remembers context" },
                  { cap:"Parallel sub-task execution",   without:"❌ Sequential only", with_:"✅ Delegates sub-agents" },
                  { cap:"Long-horizon goal (weeks)",     without:"❌ Impossible", with_:"✅ Hierarchical plan" },
                ].map(row => (
                  <div key={row.cap} style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr 1fr", gap:6, marginBottom:6, fontSize:px(11) }}>
                    <div style={{ color:V.ink, fontWeight:600 }}>{row.cap}</div>
                    <div style={{ color:ROSE, textAlign:"center" }}>{row.without}</div>
                    <div style={{ color:GRN, textAlign:"center" }}>{row.with_}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S2: MEMORY TYPES ── */}
        <div ref={R(2)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 2 · Memory Architecture", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Five Types of <span style={{ color:"#c4b5fd" }}>Agent Memory</span></h2>
            <MemoryTypesExplorer />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20), marginTop:px(24) }}>
              <div style={{ ...LCARD, background:"#130a2a", border:`1px solid ${VIO}33` }}>
                <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(13) }}>LangChain Memory Types:</div>
                <div style={{ fontFamily:"monospace", fontSize:px(12), lineHeight:2, color:VIO }}>
                  {["from langchain.memory import (",
                    "    ConversationBufferMemory,      # full history",
                    "    ConversationSummaryMemory,     # compressed",
                    "    ConversationBufferWindowMemory,# last N turns",
                    "    VectorStoreRetrieverMemory     # semantic search",
                    ")",
                    "",
                    "# Attach to a chain:",
                    "memory = ConversationSummaryMemory(llm=llm)",
                    "chain = ConversationChain(llm=llm, memory=memory)"
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("from")||l.startsWith("import") ? "#475569" : l.startsWith("#")||l.includes("#") ? "#475569" : VIO }}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
              <div style={{ ...LCARD, background:"#130a2a", border:`1px solid ${IND}33` }}>
                <div style={{ fontWeight:700, color:IND, marginBottom:8, fontSize:px(13) }}>MemGPT — OS-inspired memory:</div>
                <div style={{ fontFamily:"monospace", fontSize:px(12), lineHeight:2, color:IND }}>
                  {["# MemGPT treats memory like an OS:",
                    "# - Main context = RAM (fast, limited)",
                    "# - Archival storage = disk (slow, unlimited)",
                    "",
                    "import memgpt",
                    "agent = memgpt.create_agent(",
                    "    persona='helpful assistant',",
                    "    human='user profile here',",
                    "    archival_storage=PineconeDB()",
                    ")",
                    "",
                    "# Agent auto-manages memory:",
                    "# writes important info to archival,",
                    "# retrieves when needed via semantic search"
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("#") ? "#475569" : IND }}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S3: PLANNING INTRO ── */}
        <div ref={R(3)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 3 · Planning", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Breaking Goals into <span style={{ color:VIO }}>Actions</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32) }}>
              <div>
                <p style={{ ...LBODY, marginBottom:16 }}>
                  <strong>Planning</strong> is the process of finding a sequence of actions that transitions the agent from its current state to a goal state. A plan can be a simple ordered list, a branching tree, a probabilistic policy, or a reactive set of rules.
                </p>
                <Formula color={VIO}>{"Plan = [a₁, a₂, ..., aₙ] such that"}<br />{"exec(aₙ, ..., exec(a₁, s₀)) ⊨ Goal"}</Formula>
                <p style={{ ...LBODY, fontSize:px(14), marginBottom:16 }}>
                  A plan is valid if executing all its actions from the initial state s₀ produces a state that satisfies the goal condition. Planning is NP-hard in general — hence heuristics, learned planners, and LLM-based decomposition.
                </p>
                <IBox color={VIO} title="Classical vs learned planning"
                  body="Classical planners (STRIPS, PDDL) require explicit action schemas with preconditions and effects. They're sound and complete but brittle — break if the world model is wrong. LLM planners learn from data and generalise to novel domains but may hallucinate incorrect plans. Production systems combine both." />
              </div>
              <div>
                {[
                  { title:"Goal specification", icon:"🎯", color:VIO, desc:"Define what success looks like. Hard in practice: 'maximise customer happiness' is hard to formalise. Proxy goals (NPS score) may not fully capture intent. Misspecified goals lead to misaligned plans." },
                  { title:"State representation", icon:"🗺️", color:IND, desc:"What information does the agent track? Full state (hard, expensive) vs partial state (efficient but risks missing key info). LLM agents represent state implicitly in their context window." },
                  { title:"Action space", icon:"⚡", color:ORG, desc:"What can the agent do? Tool calls, API requests, natural language outputs, file operations. Bounded action spaces make planning tractable; open-ended spaces require LLM generalisation." },
                  { title:"Plan execution", icon:"▶️", color:GRN, desc:"Execute the plan step-by-step, observing results at each step. Replan when steps fail. Track progress. Handle partial failures gracefully — a robust executor is as important as a good planner." },
                ].map(item => (
                  <div key={item.title} style={{ display:"flex", gap:10, marginBottom:10, ...LCARD, padding:"12px" }}>
                    <span style={{ fontSize:px(20) }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, color:item.color, fontSize:px(13), marginBottom:3 }}>{item.title}</div>
                      <p style={{ ...LBODY, fontSize:px(12), margin:0 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S4: TASK DECOMPOSITION ── */}
        <div ref={R(4)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 4 · Task Decomposition", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Hierarchical <span style={{ color:"#c4b5fd" }}>Decomposition</span></h2>
            <TaskDecompositionDemo />
          </div>
        </div>

        {/* ── S5: ALGORITHMS ── */}
        <div ref={R(5)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 5 · Planning Algorithms", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>From <span style={{ color:VIO }}>Search to LLMs</span></h2>
            <PlanningAlgorithmsViz />
          </div>
        </div>

        {/* ── S6: REACT ── */}
        <div ref={R(6)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 6 · ReAct Framework", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Reason + Act + <span style={{ color:"#c4b5fd" }}>Observe</span></h2>
            <ReActAgentTrace />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20), marginTop:px(20) }}>
              <IBox color={VIO} title="Why ReAct beats pure reasoning"
                body="Chain-of-Thought alone: the LLM reasons but can't access real-time info, so may hallucinate facts. Action-only agents: act but may lack context for correct decisions. ReAct combines both: reasoning guides which actions to take, observations ground reasoning in reality. Reduces hallucination by 30-40% on knowledge-intensive tasks." />
              <IBox color={IND} title="Tree-of-Thoughts: multi-path planning"
                body="Instead of a single reasoning chain, ToT explores multiple reasoning branches simultaneously (like MCTS). Each node is a 'thought', edges are next thoughts, and a value function (another LLM call) scores branches. Best path is selected and executed. Particularly effective for math, code, and creative tasks." />
            </div>
          </div>
        </div>

        {/* ── S7: PYTHON ── */}
        <div ref={R(7)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 7 · Python Implementation", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Building Planning Agents in <span style={{ color:VIO }}>Code</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24) }}>
              <div>
                <div style={{ fontWeight:700, color:VIO, marginBottom:8, fontSize:px(13) }}>LangGraph — stateful agent graphs:</div>
                <div style={{ background:"#0a0018", border:`1px solid ${VIO}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2 }}>
                  {["from langgraph.graph import StateGraph, END",
                    "from typing import TypedDict, List",
                    "",
                    "class AgentState(TypedDict):",
                    "    messages: List[str]",
                    "    plan: List[str]",
                    "    current_step: int",
                    "    results: List[str]",
                    "",
                    "def planner(state: AgentState) -> AgentState:",
                    "    # LLM generates step-by-step plan",
                    "    plan = llm.invoke(f'Plan: {state[\"messages\"][-1]}')",
                    "    return {**state, 'plan': plan.steps}",
                    "",
                    "def executor(state: AgentState) -> AgentState:",
                    "    # Execute current step in the plan",
                    "    step = state['plan'][state['current_step']]",
                    "    result = run_tool(step)",
                    "    return {**state,",
                    "            'current_step': state['current_step'] + 1,",
                    "            'results': state['results'] + [result]}",
                    "",
                    "def should_continue(state: AgentState) -> str:",
                    "    if state['current_step'] >= len(state['plan']):",
                    "        return END",
                    "    return 'executor'",
                    "",
                    "graph = StateGraph(AgentState)",
                    "graph.add_node('planner', planner)",
                    "graph.add_node('executor', executor)",
                    "graph.set_entry_point('planner')",
                    "graph.add_edge('planner', 'executor')",
                    "graph.add_conditional_edges('executor', should_continue)",
                    "app = graph.compile()"
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("from")||l.startsWith("import") ? "#475569" : l.startsWith("#")||l.includes("#  ") ? "#475569" : l.startsWith("class ")||l.startsWith("def ") ? "#c4b5fd" : VIO }}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontWeight:700, color:IND, marginBottom:8, fontSize:px(13) }}>Vector memory with Chroma:</div>
                <div style={{ background:"#0a0018", border:`1px solid ${IND}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2, marginBottom:14 }}>
                  {["import chromadb",
                    "from langchain_community.vectorstores import Chroma",
                    "from langchain_openai import OpenAIEmbeddings",
                    "",
                    "# Initialise vector memory",
                    "embeddings = OpenAIEmbeddings()",
                    "memory_db = Chroma(",
                    "    collection_name='agent_memory',",
                    "    embedding_function=embeddings,",
                    "    persist_directory='./memory'",
                    ")",
                    "",
                    "# Store a memory",
                    "memory_db.add_texts([",
                    "    'User prefers concise responses',",
                    "    'Task completed: flight booked to Tokyo',",
                    "    'User dislikes overly formal tone'",
                    "])",
                    "",
                    "# Retrieve relevant memories",
                    "docs = memory_db.similarity_search(",
                    "    'How should I respond to this user?',",
                    "    k=3  # top 3 relevant memories",
                    ")",
                    "context = '\\n'.join([d.page_content for d in docs])"
                  ].map((l,i) => (
                    <div key={i} style={{ color: l.startsWith("from")||l.startsWith("import") ? "#475569" : l.startsWith("#") ? "#475569" : IND }}>{l||"\u00a0"}</div>
                  ))}
                </div>
                <IBox color={GRN} title="mem0 — production agent memory"
                  body="mem0 (formerly Zep) provides a drop-in memory layer for AI agents: automatic extraction of facts from conversation, entity tracking, temporal awareness (knows things change over time), and cross-session persistence. Used in production at scale by Perplexity, Cohere, and others." />
              </div>
            </div>
          </div>
        </div>

        {/* ── S8: APPLICATIONS ── */}
        <div ref={R(8)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 8 · Applications", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Planning Agents in the <span style={{ color:"#c4b5fd" }}>Real World</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:px(16) }}>
              {[
                { icon:"🔬", title:"Research Assistants",  color:VIO,  desc:"Elicit, PaperQA, Consensus. Plan a literature search: identify sub-questions, query databases, read papers, synthesise findings, identify gaps, generate hypotheses. Tasks that take humans weeks done in hours." },
                { icon:"✈️", title:"Travel Planning Agents", color:IND, desc:"Google Trips, Airbnb AI. Decompose: flights, hotels, itinerary, local transport, restaurant reservations. Coordinate bookings across services. Handle constraint propagation: flight times affect hotel check-in windows." },
                { icon:"💻", title:"Coding Agents",          color:SKY, desc:"Devin, SWE-Bench agents. Plan: understand requirements, design architecture, write components, run tests, fix failures, integrate, document. Memory of codebase structure enables coherent multi-file changes." },
                { icon:"🤖", title:"Robotic Task Planning",  color:GRN, desc:"RT-2, SayCan. Plan multi-step manipulation: 'make breakfast' → find ingredients, reach for bowl, pour cereal, add milk. Semantic memory of object locations, episodic memory of what steps have been completed." },
                { icon:"📊", title:"Financial Agents",       color:AMB, desc:"Bloomberg GPT agents, JPMorgan LOXM. Plan investment theses: research companies, analyse financials, model scenarios, generate trade ideas. Memory of portfolio state, market history, client constraints." },
                { icon:"🏥", title:"Clinical Decision Support", color:ROSE, desc:"Agents that plan diagnostic workups: order tests, interpret results, consider differentials, update hypothesis, recommend treatment. Episodic memory of patient history critical for continuity of care." },
              ].map(card => (
                <div key={card.title} style={{ ...LCARD, background:"#130a2a", border:`2px solid ${card.color}22` }}>
                  <span style={{ fontSize:px(26), marginBottom:8, display:"block" }}>{card.icon}</span>
                  <div style={{ fontWeight:800, color:card.color, fontSize:px(13), marginBottom:6 }}>{card.title}</div>
                  <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(12), margin:0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9: LIMITATIONS ── */}
        <div ref={R(9)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 9 · Limitations", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Current <span style={{ color:VIO }}>Challenges</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
              {[
                { title:"Context window as memory bottleneck", color:ROSE, icon:"📏",
                  desc:"Everything an agent 'remembers' within a call must fit in the context window. At 128K tokens (~100 pages), complex multi-week projects overflow. Compression loses important details. Retrieval introduces latency." },
                { title:"Plan coherence degrades with depth", color:AMB, icon:"📉",
                  desc:"LLMs produce high-quality 3-5 step plans reliably. At 15-20 steps, plans begin to contradict themselves, repeat steps, or fail to account for dependencies between tasks. Hierarchical planning with sub-agents helps but adds complexity." },
                { title:"Memory staleness and hallucination", color:ORG, icon:"🌫️",
                  desc:"Retrieved memories may be outdated or incorrectly recalled. Vector similarity search can return off-topic chunks. The LLM may confabulate memory — 'remembering' things it was never told. Verification layers are needed in production." },
                { title:"The credit assignment problem", color:VIO, icon:"🎯",
                  desc:"When a long-horizon plan fails, it's hard to determine which step caused the failure. Retrospective analysis and error attribution in multi-step agent traces is an active research area with no clean solution yet." },
              ].map(item => (
                <div key={item.title} style={{ ...LCARD }}>
                  <div style={{ fontSize:px(22), marginBottom:6 }}>{item.icon}</div>
                  <div style={{ fontWeight:700, color:item.color, fontSize:px(13), marginBottom:6 }}>{item.title}</div>
                  <p style={{ ...LBODY, fontSize:px(12), margin:0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S10: FUTURE ── */}
        <div ref={R(10)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Section 10 · Future Research", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>The Frontier of <span style={{ color:"#c4b5fd" }}>Cognitive Agents</span></h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:px(16) }}>
              {[
                { icon:"🧬", title:"Neuromorphic memory",     color:VIO,  desc:"Memory systems inspired by the hippocampus: pattern completion, associative recall, temporal context. Going beyond vector similarity to semantic relationship graphs." },
                { icon:"🌐", title:"Shared agent memory",     color:IND,  desc:"Memory graphs shared across agent teams. Agent A's discoveries instantly available to Agent B. Coordination via shared memory rather than explicit message passing." },
                { icon:"⏳", title:"Temporal reasoning",      color:AMB,  desc:"Agents that understand time: 'the user hasn't used this feature for 3 months', 'this information was true in 2023 but may have changed'. Temporal knowledge graphs." },
                { icon:"📐", title:"Formal plan verification", color:GRN,  desc:"Using SMT solvers or theorem provers to formally verify that an LLM-generated plan is logically consistent before execution — catching errors before they cause harm." },
                { icon:"🔮", title:"World model planning",    color:TEAL, desc:"Agents that build and maintain predictive world models (Dreamer, DreamerV3). Plan in imagination: simulate plan execution before committing to real-world actions." },
                { icon:"🤝", title:"Collaborative planning",  color:ROSE, desc:"Multi-agent planning where specialised agents (planner, critic, executor) collaboratively refine plans through debate. Microsoft AutoGen and CrewAI explore this pattern." },
              ].map(card => (
                <div key={card.title} style={{ ...LCARD, background:"#130a2a", border:`2px solid ${card.color}22` }}>
                  <span style={{ fontSize:px(26), marginBottom:8, display:"block" }}>{card.icon}</span>
                  <div style={{ fontWeight:800, color:card.color, fontSize:px(13), marginBottom:6 }}>{card.title}</div>
                  <p style={{ ...LBODY, color:"#94a3b8", fontSize:px(12), margin:0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── GAME ── */}
        <div ref={R(11)} style={{ ...LSEC, background:V.paper }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Game · Task Planner", VIO)}
            <h2 style={{ ...LH2, marginBottom:px(20) }}>Play: <span style={{ color:VIO }}>Sequence the Plan</span></h2>
            <TaskPlannerGame />
          </div>
        </div>

        {/* ── PROJECT ── */}
        <div ref={R(12)} style={{ ...LSEC, background:"#0a0018" }}>
          <div style={{ maxWidth:px(1000), margin:"0 auto" }}>
            {STag("Project · Planning Agent", VIO)}
            <h2 style={{ ...LH2, color:"#fff", marginBottom:px(20) }}>Project: <span style={{ color:"#c4b5fd" }}>ReAct Trace Analyser</span></h2>
            <ReActAgentTrace />
            <div style={{ ...LCARD, background:"#130a2a", border:`1px solid ${VIO}33`, marginTop:px(20) }}>
              <div style={{ fontWeight:700, color:VIO, marginBottom:10, fontSize:px(14) }}>🛠️ Extend This Project — Build it locally:</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20) }}>
                <div>
                  <div style={{ fontFamily:"monospace", fontSize:px(11), lineHeight:2, color:VIO }}>
                    {["# Full ReAct agent with LangChain",
                      "from langchain.agents import create_react_agent",
                      "from langchain_openai import ChatOpenAI",
                      "from langchain.tools import DuckDuckGoSearchRun",
                      "from langchain.tools import WikipediaQueryRun",
                      "from langchain import hub",
                      "",
                      "tools = [",
                      "    DuckDuckGoSearchRun(name='web_search'),",
                      "    WikipediaQueryRun(name='wikipedia'),",
                      "]",
                      "",
                      "llm = ChatOpenAI(model='gpt-4o-mini', temperature=0)",
                      "prompt = hub.pull('hwchase17/react')",
                      "agent = create_react_agent(llm, tools, prompt)",
                      "",
                      "from langchain.agents import AgentExecutor",
                      "executor = AgentExecutor(",
                      "    agent=agent, tools=tools,",
                      "    verbose=True,  # prints the trace!",
                      "    max_iterations=8",
                      ")",
                      "result = executor.invoke({'input': 'Your question here'})"
                    ].map((l,i) => (
                      <div key={i} style={{ color: l.startsWith("from")||l.startsWith("import") ? "#475569" : l.startsWith("#") ? "#475569" : VIO }}>{l||"\u00a0"}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight:700, color:IND, marginBottom:8, fontSize:px(12) }}>Challenge extensions:</div>
                  {[
                    "Add ConversationSummaryMemory to make the agent remember previous queries",
                    "Implement a custom tool (e.g. calculator, weather API)",
                    "Parse the verbose=True trace and visualise the Thought→Action→Obs chain",
                    "Add a reflection step: after completing, have the LLM critique its own plan",
                    "Implement a simple HTN: planner LLM writes the plan, executor LLM runs each step",
                    "Compare ReAct vs straight CoT on the same question — measure accuracy",
                  ].map((c,i) => (
                    <div key={i} style={{ display:"flex", gap:8, marginBottom:6 }}>
                      <span style={{ color:VIO, fontWeight:700, fontSize:px(11) }}>{i+1}.</span>
                      <span style={{ color:"#94a3b8", fontSize:px(11) }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── INSIGHTS ── */}
        <div ref={R(13)}>
          <PlanInsights onBack={onBack} />
        </div>
      </>
    )}
  </NavPage>
);

export default PlanningMemoryPage;