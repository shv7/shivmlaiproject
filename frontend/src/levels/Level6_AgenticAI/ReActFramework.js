import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — REACT FRAMEWORK
   Level 6 · Agentic AI · Lesson 5 of 5
   Accent: Emerald #059669
══════════════════════════════════════════════════════════════════ */
const GRN  = "#059669";
const EMR  = "#10b981";
const TEAL = "#0d9488";
const CYN  = "#0891b2";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const ORG  = "#f97316";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const SKY  = "#0284c7";

const Formula = ({ children, color = GRN }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}44`, borderRadius:14, padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700, textAlign:"center", margin:`${px(14)} 0` }}>{children}</div>
);

/* ══════ HERO CANVAS — ReAct loop ════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize(); window.addEventListener("resize", resize);

    const CYCLE = [
      { label:"Thought",      icon:"💭", x:0.50, y:0.15, color:VIO },
      { label:"Action",       icon:"⚡", x:0.80, y:0.50, color:ORG },
      { label:"Observation",  icon:"🔭", x:0.50, y:0.82, color:CYN },
      { label:"New Thought",  icon:"🧠", x:0.20, y:0.50, color:GRN },
    ];
    const CENTER = { x:0.50, y:0.50 };

    const particles = [];
    for (let i = 0; i < 4; i++) {
      particles.push({ seg:i, p:i*0.25, speed:0.003+Math.random()*0.002 });
    }

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#001508"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(5,150,105,0.04)"; ctx.lineWidth=1;
      for (let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for (let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      // draw the cycle ring
      const edges = [[0,1],[1,2],[2,3],[3,0]];
      edges.forEach(([a,b]) => {
        const na=CYCLE[a], nb=CYCLE[b];
        const g=ctx.createLinearGradient(na.x*W,na.y*H,nb.x*W,nb.y*H);
        g.addColorStop(0,na.color+"66"); g.addColorStop(1,nb.color+"66");
        ctx.beginPath(); ctx.moveTo(na.x*W,na.y*H); ctx.lineTo(nb.x*W,nb.y*H);
        ctx.strokeStyle=g; ctx.lineWidth=2; ctx.stroke();
      });

      // particles around the cycle
      particles.forEach(p => {
        p.p = (p.p + p.speed) % 4;
        const seg = Math.floor(p.p);
        const frac = p.p - seg;
        const a=CYCLE[seg%4], b=CYCLE[(seg+1)%4];
        const px2=a.x*W+(b.x-a.x)*W*frac, py2=a.y*H+(b.y-a.y)*H*frac;
        ctx.beginPath(); ctx.arc(px2,py2,3,0,Math.PI*2);
        ctx.fillStyle=a.color+"ee"; ctx.fill();
      });

      // center LLM
      const pulse2=(Math.sin(t*1.5)+1)/2;
      const cg=ctx.createRadialGradient(CENTER.x*W,CENTER.y*H,0,CENTER.x*W,CENTER.y*H,28+pulse2*6);
      cg.addColorStop(0,GRN+"44"); cg.addColorStop(1,GRN+"00");
      ctx.beginPath(); ctx.arc(CENTER.x*W,CENTER.y*H,28+pulse2*6,0,Math.PI*2); ctx.fillStyle=cg; ctx.fill();
      ctx.beginPath(); ctx.arc(CENTER.x*W,CENTER.y*H,22,0,Math.PI*2);
      ctx.fillStyle=GRN+"22"; ctx.strokeStyle=GRN+"88"; ctx.lineWidth=2; ctx.fill(); ctx.stroke();
      ctx.font=`bold ${px(8)} sans-serif`; ctx.textAlign="center"; ctx.fillStyle=GRN;
      ctx.fillText("🧠 LLM",CENTER.x*W,CENTER.y*H+4);

      // nodes
      CYCLE.forEach((n,ni) => {
        const nx=n.x*W, ny=n.y*H, pulse=(Math.sin(t*2+ni*Math.PI/2)+1)/2;
        const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,24+pulse*6);
        ng.addColorStop(0,n.color+"44"); ng.addColorStop(1,n.color+"00");
        ctx.beginPath(); ctx.arc(nx,ny,24+pulse*6,0,Math.PI*2); ctx.fillStyle=ng; ctx.fill();
        ctx.beginPath(); ctx.arc(nx,ny,18,0,Math.PI*2);
        ctx.fillStyle=n.color+"22"; ctx.strokeStyle=n.color+"99"; ctx.lineWidth=2; ctx.fill(); ctx.stroke();
        ctx.font=`${px(12)} sans-serif`; ctx.textAlign="center"; ctx.fillStyle=n.color;
        ctx.fillText(n.icon,nx,ny+4);
        ctx.font=`bold ${px(8)} sans-serif`; ctx.fillStyle=n.color+"cc";
        ctx.fillText(n.label,nx,ny+28);
      });

      t+=0.02; raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}} />;
};

/* ══════ REACT TRACE EXPLORER ════════════════════════════════════ */
const ReActTraceExplorer = () => {
  const [selected, setSelected] = useState(0);
  const [step, setStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const PROBLEMS = [
    {
      q:"Find the capital of the country where Tesla Motors was founded.",
      steps:[
        {type:"thought", text:"I need to find where Tesla Motors was founded. I know Tesla is an American EV company, but let me verify the exact city/state to be precise rather than guessing."},
        {type:"action",  tool:"web_search", args:"Tesla Motors founded location", result:"Tesla Motors was founded in 2003 in San Carlos, California, United States. Co-founders: Martin Eberhard and Marc Tarpenning (later joined by Elon Musk)."},
        {type:"thought", text:"Tesla was founded in California, USA. Now I need the capital of the United States."},
        {type:"action",  tool:"web_search", args:"capital of United States", result:"The capital of the United States is Washington, D.C. (District of Columbia). It has been the federal capital since 1800."},
        {type:"thought", text:"I now have both pieces: Tesla was founded in California (USA), and the capital of the USA is Washington, D.C. I can give a complete, grounded answer."},
        {type:"answer",  text:"Tesla Motors was founded in San Carlos, California, USA in 2003. The capital of the United States is Washington, D.C."},
      ]
    },
    {
      q:"What is the square root of the number of bones in the human body?",
      steps:[
        {type:"thought", text:"This question has two parts: (1) how many bones are in the human body? (2) what is the square root of that number? I know the rough number but should verify."},
        {type:"action",  tool:"web_search", args:"how many bones in human adult body", result:"An adult human body has 206 bones. Babies are born with around 270–300 bones, which fuse over time to reach 206 in adulthood."},
        {type:"thought", text:"The answer is 206 bones. Now I need to calculate sqrt(206). I should use the calculator tool for an exact answer rather than estimating."},
        {type:"action",  tool:"calculator", args:"206 ** 0.5", result:"206 ** 0.5 = 14.352700094407323"},
        {type:"thought", text:"Got both results: 206 bones, sqrt(206) ≈ 14.35. I can now give a complete, precise answer citing both sources."},
        {type:"answer",  text:"An adult human body has 206 bones. The square root of 206 is approximately 14.35 (exact: 14.3527)."},
      ]
    },
    {
      q:"Is GPT-4 better than Claude 3 Opus on the MMLU benchmark?",
      steps:[
        {type:"thought", text:"This is a factual comparison requiring benchmark scores. My training data may be outdated, so I should search for current MMLU benchmark results for both models."},
        {type:"action",  tool:"web_search", args:"GPT-4 MMLU benchmark score 2024", result:"GPT-4 scores 86.4% on MMLU (5-shot). GPT-4o scores 88.7% on MMLU. Source: OpenAI technical report."},
        {type:"thought", text:"Got GPT-4's MMLU score. Now I need Claude 3 Opus's MMLU score for comparison."},
        {type:"action",  tool:"web_search", args:"Claude 3 Opus MMLU benchmark score", result:"Claude 3 Opus scores 86.8% on MMLU (5-shot). Source: Anthropic model card, March 2024."},
        {type:"thought", text:"Now I have both scores: GPT-4: 86.4%, Claude 3 Opus: 86.8%. Claude 3 Opus slightly outperforms GPT-4 on MMLU. GPT-4o (88.7%) outperforms both. I should present all three for full context."},
        {type:"answer",  text:"On MMLU (5-shot), Claude 3 Opus (86.8%) slightly outperforms GPT-4 (86.4%). However, GPT-4o (88.7%) outperforms both. Benchmark performance varies by task — neither model dominates across all evaluations."},
      ]
    },
  ];

  const TYPE_COLORS = { thought:VIO, action:ORG, answer:GRN };
  const TYPE_ICONS  = { thought:"💭", action:"⚡", answer:"✅" };
  const TOOL_COLORS = { web_search:CYN, calculator:AMB };

  const prob = PROBLEMS[selected];

  const run = () => {
    if (running) return;
    setRunning(true); setStep(-1);
    let s=-1;
    iRef.current=setInterval(()=>{
      s++;
      setStep(s);
      if(s>=prob.steps.length-1){clearInterval(iRef.current);setRunning(false);}
    },900);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  const changeProb = (i) => {
    clearInterval(iRef.current); setRunning(false); setStep(-1); setSelected(i);
  };

  return (
    <div style={{...LCARD, background:"#001508", border:`2px solid ${GRN}22`}}>
      <div style={{fontWeight:700, color:GRN, marginBottom:8, fontSize:px(15)}}>
        🔄 ReAct Trace Explorer — Watch the Thought-Action-Observation Loop
      </div>
      <div style={{display:"flex", gap:6, marginBottom:14}}>
        {PROBLEMS.map((p,i)=>(
          <button key={i} onClick={()=>changeProb(i)} style={{
            flex:1, background:selected===i?GRN:GRN+"0d",
            border:`2px solid ${selected===i?GRN:GRN+"33"}`,
            borderRadius:8, padding:"6px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(9), color:selected===i?"#fff":GRN, textAlign:"center"
          }}>Problem {i+1}</button>
        ))}
      </div>
      <div style={{background:AMB+"0d", border:`2px solid ${AMB}33`, borderRadius:12, padding:"10px 16px", marginBottom:14}}>
        <span style={{fontWeight:700, color:AMB, fontSize:px(12)}}>❓ </span>
        <span style={{fontSize:px(13), color:"#fff", fontWeight:600}}>{prob.q}</span>
      </div>
      <div style={{minHeight:220, maxHeight:360, overflowY:"auto", marginBottom:12}}>
        {step<0&&<div style={{color:"#475569",textAlign:"center",padding:"32px",fontSize:px(13)}}>Press Run to watch the ReAct loop step-by-step...</div>}
        {prob.steps.slice(0,step+1).map((s,i)=>(
          <div key={i} style={{marginBottom:10, padding:"10px 14px", background:TYPE_COLORS[s.type]+"0d", border:`1px solid ${TYPE_COLORS[s.type]}33`, borderRadius:10}}>
            <div style={{display:"flex", gap:6, alignItems:"center", marginBottom:s.type==="action"?6:4}}>
              <span style={{fontSize:px(14)}}>{TYPE_ICONS[s.type]}</span>
              <span style={{fontWeight:800, color:TYPE_COLORS[s.type], fontSize:px(12), textTransform:"uppercase", letterSpacing:1}}>{s.type}</span>
              {s.type==="action"&&<span style={{fontFamily:"monospace", fontSize:px(10), color:TOOL_COLORS[s.tool]||CYN, background:(TOOL_COLORS[s.tool]||CYN)+"15", borderRadius:6, padding:"1px 6px"}}>{s.tool}({`"${s.args}"`})</span>}
            </div>
            <div style={{fontSize:px(12), color:"#94a3b8", lineHeight:1.7}}>{s.type==="thought"?`"${s.text}"`:s.text}</div>
            {s.type==="action"&&s.result&&(
              <div style={{marginTop:6, padding:"6px 10px", background:CYN+"0d", border:`1px solid ${CYN}22`, borderRadius:8}}>
                <span style={{fontWeight:700, color:CYN, fontSize:px(10)}}>Observation: </span>
                <span style={{fontSize:px(11), color:"#94a3b8"}}>{s.result}</span>
              </div>
            )}
          </div>
        ))}
        {running&&<div style={{color:GRN,fontFamily:"monospace",fontSize:px(11)}}>▌ reasoning...</div>}
      </div>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <button onClick={run} disabled={running} style={{
          background:`linear-gradient(135deg,${TEAL},${GRN})`, border:"none", borderRadius:10,
          padding:"9px 22px", color:"#fff", fontWeight:800, fontSize:px(12),
          cursor:running?"default":"pointer", opacity:running?0.6:1
        }}>{running?"Reasoning...":step>=prob.steps.length-1?"▶ Replay":"▶ Run ReAct"}</button>
        <span style={{fontSize:px(11),color:"#475569"}}>Step {Math.max(0,step+1)} / {prob.steps.length}</span>
      </div>
    </div>
  );
};

/* ══════ REACT VS COT COMPARISON ═════════════════════════════════ */
const ReActVsCoT = () => {
  const [mode, setMode] = useState("react");
  const Q = "What is the GDP per capita of the world's most populous country?";
  const COT_STEPS = [
    {color:VIO, label:"Step 1", text:"The most populous country is China with about 1.4 billion people."},
    {color:VIO, label:"Step 2", text:"China's GDP is approximately $18 trillion (my training knowledge)."},
    {color:VIO, label:"Step 3", text:"GDP per capita = GDP / Population = $18T / 1.4B ≈ $12,857."},
    {color:ROSE,label:"Risk",   text:"⚠️ These figures are from training data and may be outdated. GDP changes year-over-year. A 2024 query using 2022 data could be significantly wrong.", warn:true},
    {color:AMB, label:"Answer", text:"China's GDP per capita is approximately $12,857. [Note: based on training data, may be outdated]"},
  ];
  const REACT_STEPS = [
    {type:"thought",   text:"I need the world's most populous country and its current GDP per capita. Population rankings change — I should verify rather than assume China."},
    {type:"action",    tool:"web_search", args:"most populous country 2024", obs:"China: 1.409 billion (2024). India: 1.441 billion (2024). India surpassed China in 2023."},
    {type:"thought",   text:"Interesting — India is now the most populous country, having surpassed China in 2023. I need India's GDP per capita, not China's."},
    {type:"action",    tool:"web_search", args:"India GDP per capita 2024 USD", obs:"India GDP per capita: $2,731 USD (2024, World Bank). Total GDP: $3.73 trillion."},
    {type:"thought",   text:"Now I have both pieces: India is the most populous country (1.441B), GDP per capita is $2,731 (2024). I can give a complete, current, grounded answer."},
    {type:"answer",    text:"As of 2024, India (1.441 billion people) is the world's most populous country, having surpassed China in 2023. India's GDP per capita is $2,731 USD (World Bank, 2024)."},
  ];
  const TYPE_COLORS = {thought:VIO, action:ORG, answer:GRN};

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:GRN, marginBottom:8, fontSize:px(15)}}>
        ⚔️ ReAct vs Chain-of-Thought — Side-by-Side Comparison
      </div>
      <div style={{background:AMB+"0d", border:`2px solid ${AMB}33`, borderRadius:12, padding:"10px 16px", marginBottom:14}}>
        <span style={{fontWeight:700, color:AMB}}>❓ </span>
        <span style={{fontWeight:600, color:V.ink}}>{Q}</span>
      </div>
      <div style={{display:"flex", gap:6, marginBottom:16}}>
        {[["react","ReAct (Reasoning + Acting)",GRN],["cot","Chain-of-Thought only",VIO]].map(([k,label,col])=>(
          <button key={k} onClick={()=>setMode(k)} style={{
            flex:1, background:mode===k?col:col+"0d",
            border:`2px solid ${mode===k?col:col+"33"}`,
            borderRadius:10, padding:"8px", cursor:"pointer", fontWeight:700,
            fontSize:px(11), color:mode===k?"#fff":col
          }}>{label}</button>
        ))}
      </div>
      {mode==="react" ? (
        <div>
          {REACT_STEPS.map((s,i)=>(
            <div key={i} style={{marginBottom:8, padding:"10px 14px", background:TYPE_COLORS[s.type]+"0d", border:`1px solid ${TYPE_COLORS[s.type]}33`, borderRadius:10}}>
              <div style={{fontWeight:800, color:TYPE_COLORS[s.type], fontSize:px(11), marginBottom:4, textTransform:"uppercase"}}>
                {s.type==="thought"?"💭 Thought":s.type==="action"?`⚡ Action: ${s.tool}("${s.args}")`:s.type==="answer"?"✅ Final Answer":""}
              </div>
              <div style={{fontSize:px(12), color:V.muted, lineHeight:1.7}}>{s.type==="thought"?`"${s.text}"`:s.text}</div>
              {s.obs&&<div style={{marginTop:5, padding:"5px 10px", background:CYN+"0d", border:`1px solid ${CYN}22`, borderRadius:6, fontSize:px(11), color:CYN+"cc"}}><strong>Obs:</strong> {s.obs}</div>}
            </div>
          ))}
          <div style={{background:GRN+"0d", border:`2px solid ${GRN}33`, borderRadius:12, padding:"12px 14px", marginTop:8}}>
            <div style={{fontWeight:700, color:GRN, marginBottom:4}}>✅ Why ReAct wins here:</div>
            <p style={{...LBODY, fontSize:px(12), margin:0}}>ReAct discovered that India surpassed China as the most populous country in 2023 — a fact impossible to know from stale training data. The final answer is grounded in verified 2024 data. Pure CoT would have given a confidently wrong answer about China.</p>
          </div>
        </div>
      ) : (
        <div>
          {COT_STEPS.map((s,i)=>(
            <div key={i} style={{marginBottom:8, padding:"10px 14px", background:s.warn?ROSE+"0d":s.color+"0d", border:`1px solid ${s.warn?ROSE:s.color}33`, borderRadius:10}}>
              <div style={{fontWeight:800, color:s.warn?ROSE:s.color, fontSize:px(11), marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:px(12), color:V.muted}}>{s.text}</div>
            </div>
          ))}
          <div style={{background:ROSE+"0d", border:`2px solid ${ROSE}33`, borderRadius:12, padding:"12px 14px", marginTop:8}}>
            <div style={{fontWeight:700, color:ROSE, marginBottom:4}}>❌ Why CoT fails here:</div>
            <p style={{...LBODY, fontSize:px(12), margin:0}}>CoT reasons entirely from training weights. It would confidently answer "China" when India has actually been the most populous country since 2023. No tool call = no way to catch this stale-data error. The confident wrong answer is worse than saying "I'm not sure."</p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════ REACT STEP GUESSER GAME ═════════════════════════════════ */
const ReActStepGuesser = () => {
  const [gameIdx, setGameIdx] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [score, setScore] = useState(0);

  const GAMES = [
    { q:"How many countries are in Africa, and what is the square root of that number?",
      steps:[
        { q:"What type of step should come first?", options:["Search for facts","Calculate immediately","Answer directly","Ask for clarification"], correct:0, explain:"First, we need the actual count of African countries. Our training data might be off by a few (it's 54 or 55 depending on recognition). Always verify factual claims before calculating."},
        { q:"After finding '54 countries in Africa', what next?", options:["Answer with sqrt(54)","Use calculator tool for precision","Search for more info","Stop and respond"], correct:1, explain:"We know the count (54). Now we should use the calculator tool: sqrt(54) = 7.3484... Guessing 'about 7.3' risks imprecision — the calculator gives exact results the LLM cannot reliably compute."},
        { q:"After calculator returns 7.3484..., what's the correct next step?", options:["Search again to verify","Think about whether we have all needed info","Call the calculator again","Generate final answer"], correct:1, explain:"We have: (1) verified fact: 54 countries in Africa, (2) precise calculation: sqrt(54) ≈ 7.348. Both pieces confirmed. Think: is this complete? Yes. Now generate the final answer."},
      ]
    },
    { q:"What programming language was created by the creator of Linux?",
      steps:[
        { q:"Can the LLM answer this without tools?", options:["Yes — it's a well-known historical fact","No — always use tools","Maybe — but verify to be sure","The LLM can't answer questions about people"], correct:2, explain:"The LLM likely knows Linus Torvalds created Linux, and may know about Git (C language). But 'created by' is ambiguous — Torvalds created Linux (C) and Git (also C, which he didn't create). Better to verify the specific claim."},
        { q:"Search returns 'Linus Torvalds created Linux (written in C) and Git'. What next?", options:["Answer: C","Think: did he create C? Need to check","Search for more facts about C","Calculate something"], correct:1, explain:"The search says Linux is written in C, but Linus didn't create C — Dennis Ritchie did (1972). The question asks what language 'the creator of Linux created' — that's Git. We need to search specifically for programming languages created BY Torvalds."},
        { q:"Search returns 'Linus Torvalds created Git (in C) but not a new language'. What now?", options:["Answer: Git","Think: Git is a tool, not a language. Need final answer","Search again","Call calculator"], correct:1, explain:"Key insight: Git is a version control system, not a programming language. The search result clarifies Torvalds didn't create a new programming language — he created Linux (an OS) and Git (a tool), both using existing languages. The honest answer is that Torvalds didn't create a programming language."},
      ]
    },
  ];

  const game = GAMES[gameIdx];
  const currentStep = answered.length;
  const isDone = currentStep >= game.steps.length;

  const answer = (optIdx) => {
    if (answered.includes(currentStep)) return;
    const step = game.steps[currentStep];
    const isCorrect = optIdx === step.correct;
    setAnswered(prev => [...prev, currentStep]);
    if (isCorrect) setScore(s => s+1);
  };

  const reset = (newGame) => {
    setGameIdx(newGame ?? gameIdx);
    setAnswered([]); setScore(0);
  };

  const totalSteps = game.steps.length;
  const pct = Math.round((score / (gameIdx * totalSteps + answered.length || 1)) * 100);

  return (
    <div style={{...LCARD, background:"#001508", border:`2px solid ${GRN}22`}}>
      <div style={{fontWeight:800, color:GRN, fontSize:px(17), marginBottom:8}}>
        🎮 Simulate the Agent — Guess the Next Step
      </div>
      <div style={{display:"flex", gap:6, marginBottom:14}}>
        {GAMES.map((g,i)=>(
          <button key={i} onClick={()=>reset(i)} style={{
            flex:1, background:gameIdx===i?GRN:GRN+"0d",
            border:`2px solid ${gameIdx===i?GRN:GRN+"33"}`,
            borderRadius:8, padding:"6px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color:gameIdx===i?"#fff":GRN
          }}>Puzzle {i+1}</button>
        ))}
        <div style={{display:"flex", alignItems:"center", padding:"0 12px", fontFamily:"monospace", color:GRN, fontWeight:700, fontSize:px(12)}}>{score} pts</div>
      </div>
      <div style={{background:AMB+"0d", border:`2px solid ${AMB}33`, borderRadius:12, padding:"10px 16px", marginBottom:14}}>
        <span style={{fontWeight:700, color:AMB, fontSize:px(12)}}>❓ Task: </span>
        <span style={{fontSize:px(13), color:"#94a3b8"}}>{game.q}</span>
      </div>

      {/* Completed steps */}
      {game.steps.slice(0, currentStep).map((s,i)=>(
        <div key={i} style={{marginBottom:8, padding:"8px 12px", background:GRN+"0d", border:`1px solid ${GRN}33`, borderRadius:10}}>
          <div style={{fontWeight:700, color:GRN, fontSize:px(11), marginBottom:2}}>✅ Step {i+1}: {game.steps[i].options[game.steps[i].correct]}</div>
          <div style={{fontSize:px(11), color:"#94a3b8"}}>{s.explain}</div>
        </div>
      ))}

      {/* Current step */}
      {!isDone && (
        <div style={{background:VIO+"0d", border:`2px solid ${VIO}33`, borderRadius:12, padding:"14px", marginBottom:12}}>
          <div style={{fontWeight:700, color:VIO, marginBottom:10, fontSize:px(13)}}>
            Step {currentStep+1}: {game.steps[currentStep].q}
          </div>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
            {game.steps[currentStep].options.map((opt,i)=>{
              const isAns = answered.includes(currentStep);
              const isCorrect2 = i===game.steps[currentStep].correct;
              return (
                <button key={i} onClick={()=>answer(i)}
                  style={{
                    background: isAns?(isCorrect2?GRN+"22":ROSE+"0d"):GRN+"08",
                    border:`2px solid ${isAns?(isCorrect2?GRN:ROSE):GRN+"33"}`,
                    borderRadius:10, padding:"10px", cursor:isAns?"default":"pointer",
                    fontWeight:600, fontSize:px(12), color:isAns?(isCorrect2?GRN:ROSE):GRN+"cc",
                    textAlign:"left"
                  }}>
                  {isAns&&<span style={{marginRight:4}}>{isCorrect2?"✅":"❌"}</span>}
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isDone && (
        <div style={{background:GRN+"0d", border:`2px solid ${GRN}33`, borderRadius:12, padding:"12px 16px", marginBottom:12}}>
          <div style={{fontWeight:800, color:GRN, fontSize:px(14), marginBottom:4}}>
            🎉 Puzzle complete! Score: {score}/{totalSteps}
          </div>
          <p style={{...LBODY, fontSize:px(12), margin:0}}>
            {score===totalSteps ? "Perfect — you think like a ReAct agent!" : "Good work! Review the explanations above to reinforce the patterns."}
          </p>
        </div>
      )}
      {isDone && (
        <button onClick={()=>reset()} style={{background:GRN, border:"none", borderRadius:10, padding:"9px 20px", color:"#fff", fontWeight:800, cursor:"pointer", fontSize:px(12)}}>
          ↺ Try Again
        </button>
      )}
    </div>
  );
};

/* ══════ REACT RESEARCH AGENT PROJECT ════════════════════════════ */
const ReActResearchAgent = () => {
  const [query, setQuery] = useState("");
  const [trace, setTrace] = useState([]);
  const [running, setRunning] = useState(false);
  const iRef = useRef(null);

  const TOPICS = ["the history of the internet","CRISPR gene editing","the Turing test","transformer neural networks","the Fermi paradox"];

  const buildTrace = (topic) => {
    const t = topic.trim();
    return [
      {type:"thought", text:`I need to answer a research question about "${t}". I should gather information from multiple sources and verify key facts before synthesising.`},
      {type:"action",  tool:"web_search", args:`${t} overview history`, obs:`Found: Wikipedia article on ${t}, 3 academic papers, 2 news articles from major publications.`},
      {type:"thought", text:`Got an overview. I need more depth — specifically the most recent developments and any contested claims about "${t}".`},
      {type:"action",  tool:"web_search", args:`${t} recent developments 2024`, obs:`2024 advances in ${t}: [1] new research from major university, [2] industry application by tech company, [3] policy discussion paper.`},
      {type:"thought", text:`Good. Now I have historical context and recent developments. Let me check for any key statistics or metrics I should include.`},
      {type:"action",  tool:"web_search", args:`${t} key statistics data`, obs:`Key figures: major adoption metrics, research output data, economic impact estimates from authoritative sources.`},
      {type:"thought", text:`I have comprehensive information: history, recent developments, and supporting data. I can now synthesise a well-structured research summary with proper attribution.`},
      {type:"answer",  text:`📄 Research Summary: "${t}"\n\nOverview: [Based on verified sources] A comprehensive area of study with significant historical foundations and active current research.\n\nKey developments (2024): Multiple advances across academic and industry settings, with growing policy attention.\n\nData highlights: Quantitative metrics indicate strong growth and adoption trends.\n\nFurther reading: Wikipedia, Google Scholar, major academic journals in this domain.`},
    ];
  };

  const run = (topic) => {
    const t = topic || query.trim();
    if (!t || running) return;
    setQuery(""); setTrace([]); setRunning(true);
    const steps = buildTrace(t);
    let i=0;
    iRef.current=setInterval(()=>{
      if(i<steps.length){setTrace(prev=>[...prev,steps[i]]);i++;}
      else{clearInterval(iRef.current);setRunning(false);}
    },700);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  const TYPE_C={thought:VIO,action:ORG,answer:GRN};
  const TYPE_I={thought:"💭",action:"⚡",answer:"📄"};

  return (
    <div style={{...LCARD, background:"#001508", border:`2px solid ${GRN}22`}}>
      <div style={{fontWeight:800, color:GRN, fontSize:px(17), marginBottom:4}}>
        🔬 ReAct Research Agent — Full Thought-Search-Synthesise Loop
      </div>
      <p style={{...LBODY, fontSize:px(13), color:"#94a3b8", marginBottom:12}}>
        Watch a complete 3-search ReAct loop: each thought identifies what's missing, the action retrieves it, the observation informs the next thought.
      </p>
      <div style={{display:"flex", gap:6, marginBottom:12, flexWrap:"wrap"}}>
        {TOPICS.map(s=>(
          <button key={s} onClick={()=>run(s)} style={{background:GRN+"0d",border:`1px solid ${GRN}33`,borderRadius:20,padding:"4px 10px",fontSize:px(11),color:GRN,cursor:"pointer",fontWeight:600}}>{s}</button>
        ))}
      </div>
      <div style={{background:"#001008", borderRadius:14, padding:"14px", minHeight:160, marginBottom:12, maxHeight:360, overflowY:"auto"}}>
        {trace.length===0&&<div style={{color:"#475569",textAlign:"center",padding:"24px",fontSize:px(12)}}>Choose a topic or type one to watch the full ReAct research loop...</div>}
        {trace.map((s,i)=>(
          <div key={i} style={{marginBottom:10, padding:"10px 14px", background:TYPE_C[s.type]+"0d", border:`1px solid ${TYPE_C[s.type]}33`, borderRadius:10}}>
            <div style={{display:"flex", gap:6, alignItems:"center", marginBottom:4}}>
              <span style={{fontSize:px(13)}}>{TYPE_I[s.type]}</span>
              <span style={{fontWeight:800, color:TYPE_C[s.type], fontSize:px(11), textTransform:"uppercase"}}>
                {s.type}{s.tool?`: ${s.tool}("${s.args}")`:""} 
              </span>
            </div>
            <div style={{fontSize:px(11), color:"#94a3b8", lineHeight:1.7, whiteSpace:"pre-line"}}>{s.type==="thought"?`"${s.text}"`:s.text}</div>
            {s.obs&&<div style={{marginTop:5,padding:"5px 10px",background:CYN+"0d",border:`1px solid ${CYN}22`,borderRadius:6,fontSize:px(10),color:CYN+"cc"}}><strong>Observation:</strong> {s.obs}</div>}
          </div>
        ))}
        {running&&<div style={{color:GRN,fontFamily:"monospace",fontSize:px(11)}}>▌ thinking...</div>}
      </div>
      <div style={{display:"flex",gap:8}}>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&run()}
          placeholder="Enter any research topic..."
          style={{flex:1,borderRadius:10,border:`1px solid ${GRN}33`,padding:"10px 14px",fontSize:px(13),background:"#001008",color:"#fff",outline:"none"}}/>
        <button onClick={()=>run()} disabled={running||!query.trim()} style={{background:GRN,border:"none",borderRadius:10,padding:"10px 20px",color:"#fff",fontWeight:800,cursor:"pointer",fontSize:px(13)}}>Research →</button>
      </div>
    </div>
  );
};

/* ══════ ADVANCED FRAMEWORKS EXPLORER ═══════════════════════════ */
const AdvancedFrameworksExplorer = () => {
  const [active, setActive] = useState(0);
  const FRAMEWORKS = [
    { name:"Reflexion", icon:"🪞", color:VIO,
      desc:"An agent framework that adds a self-reflection step after each episode. The agent evaluates its own performance, identifies what went wrong, stores this as verbal reinforcement in long-term memory, and uses it to improve on the next attempt. Learns from failure without gradient descent.",
      how:"Episode ends → Evaluator scores outcome → Reflector writes critique → Memory stores: 'Do not X, instead do Y' → Next episode starts with reflection in context.",
      code:["# Reflexion pseudo-code",
            "for attempt in range(max_attempts):",
            "    trace = run_agent(task, memory=reflections)",
            "    score = evaluator.score(trace, task.ground_truth)",
            "    if score >= threshold: break",
            "    # Self-reflection",
            "    reflection = llm.reflect(",
            "        f'Task: {task}\\nTrace: {trace}\\nScore: {score}\\n",
            "         What went wrong? How to improve?'",
            "    )",
            "    reflections.append(reflection)",
            "    # Next attempt uses stored reflections"],
      result:"Reflexion agents achieve 91% on HumanEval (code) vs 67% for baseline ReAct. Verbal reinforcement is surprisingly effective without any model weight updates." },
    { name:"Tree of Thoughts", icon:"🌳", color:AMB,
      desc:"Extends chain-of-thought to a tree structure. Instead of one linear reasoning chain, the LLM explores multiple reasoning branches simultaneously. A value function scores each branch. Beam search selects the most promising paths. Dramatically improves on multi-step reasoning puzzles.",
      how:"Problem → Generate k thoughts → Score each → Expand top-b → Score again → ... → Select best leaf → Final answer. Like MCTS applied to LLM reasoning.",
      code:["# Tree of Thoughts (simplified)",
            "def tot_solve(problem, k=3, b=2, depth=4):",
            "    thoughts = generate_thoughts(problem, k=k)",
            "    tree = {t: score_thought(t) for t in thoughts}",
            "    ",
            "    for step in range(depth):",
            "        # Expand top-b nodes",
            "        frontier = sorted(tree, key=tree.get)[-b:]",
            "        new_nodes = {}",
            "        for node in frontier:",
            "            children = generate_thoughts(node, k=k)",
            "            for child in children:",
            "                new_nodes[child] = score_thought(child)",
            "        tree.update(new_nodes)",
            "    ",
            "    return max(tree, key=tree.get)"],
      result:"ToT achieves 74% on Game of 24 (logical puzzle) vs 4% for standard CoT and 20% for ReAct. The tree search is key — most paths fail but the best path succeeds." },
    { name:"Reflexion + ReAct (Fusion)", icon:"⚗️", color:GRN,
      desc:"The most capable production setup: ReAct for real-time tool use combined with Reflexion for episode-level learning. The agent both searches for information mid-task AND learns from task failures across attempts. Combines reactive grounding with reflective improvement.",
      how:"ReAct loop within each attempt + Reflexion between attempts. Short-term: tool calls ground facts. Long-term: verbal reflections improve strategy. The agent becomes progressively better at the same class of tasks.",
      code:["# ReAct + Reflexion (production pattern)",
            "class ReActReflexionAgent:",
            "    def __init__(self):",
            "        self.reflections = []  # long-term verbal memory",
            "    ",
            "    def solve(self, task, max_attempts=3):",
            "        for attempt in range(max_attempts):",
            "            # ReAct: tool-augmented reasoning",
            "            context = self.build_context(",
            "                task, self.reflections",
            "            )",
            "            trace = react_loop(context, tools)",
            "            ",
            "            # Evaluate outcome",
            "            if evaluator.is_correct(trace, task):",
            "                return trace.final_answer",
            "            ",
            "            # Reflexion: learn from failure",
            "            reflection = reflect(task, trace)",
            "            self.reflections.append(reflection)",
            "        return 'Max attempts reached'"],
      result:"On HotpotQA (multi-hop QA), ReAct+Reflexion achieves 67% vs 54% for ReAct alone and 52% for CoT. The combination is the current SOTA for autonomous agent benchmark tasks." },
    { name:"AutoGPT / AgentGPT Pattern", icon:"🤖", color:ROSE,
      desc:"Long-horizon autonomous agents with a persistent task queue. The agent plans the entire task upfront, breaks it into subtasks, pushes them to a queue, and executes them in a loop. New subtasks are generated dynamically as needed. Memory persists across the entire session.",
      how:"Goal → Plan (generate task list) → Execute task 1 → Reflect → Generate new tasks → Execute → ... → Report completion. Self-directed, no human checkpoints.",
      code:["# AutoGPT-style architecture",
            "class AutonomousAgent:",
            "    def __init__(self, goal):",
            "        self.goal = goal",
            "        self.task_queue = deque()",
            "        self.completed = []",
            "        self.memory = VectorMemory()",
            "    ",
            "    def run(self):",
            "        # Initial planning",
            "        initial_tasks = planner_llm.plan(self.goal)",
            "        self.task_queue.extend(initial_tasks)",
            "        ",
            "        while self.task_queue:",
            "            task = self.task_queue.popleft()",
            "            context = self.memory.search(task)",
            "            result = execute(task, context, tools)",
            "            self.memory.store(task, result)",
            "            self.completed.append((task, result))",
            "            ",
            "            # Generate new tasks from result",
            "            new_tasks = task_creator_llm.create(",
            "                self.goal, self.completed, result",
            "            )",
            "            self.task_queue.extend(new_tasks)"],
      result:"AutoGPT demonstrated end-to-end autonomous task execution but is prone to loops, hallucinations, and goal drift. BabyAGI simplified the pattern. Modern versions (AutoGPT Platform) add human-in-the-loop checkpoints." },
  ];
  const a = FRAMEWORKS[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700, color:GRN, marginBottom:8, fontSize:px(15)}}>
        🚀 Advanced ReAct-Based Frameworks — The Frontier
      </div>
      <div style={{display:"flex", gap:6, marginBottom:18, flexWrap:"wrap"}}>
        {FRAMEWORKS.map((f,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1, minWidth:100,
            background:active===i?f.color:f.color+"0d",
            border:`2px solid ${active===i?f.color:f.color+"33"}`,
            borderRadius:10, padding:"8px 4px", cursor:"pointer", fontWeight:700,
            fontSize:px(10), color:active===i?"#fff":f.color, textAlign:"center"
          }}>{f.icon}<br />{f.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(20)}}>
        <div>
          <div style={{background:a.color+"0d", border:`2px solid ${a.color}33`, borderRadius:14, padding:"16px", marginBottom:12}}>
            <div style={{fontWeight:800, color:a.color, fontSize:px(15), marginBottom:8}}>{a.icon} {a.name}</div>
            <p style={{...LBODY, fontSize:px(13), margin:0}}>{a.desc}</p>
          </div>
          <div style={{fontSize:px(12), color:V.muted, lineHeight:1.7, marginBottom:10}}>
            <strong style={{color:a.color}}>How it works:</strong> {a.how}
          </div>
          <div style={{background:a.color+"0d", border:`2px solid ${a.color}22`, borderRadius:10, padding:"10px 12px", fontSize:px(12), color:a.color}}>
            <strong>📊 Results:</strong> <span style={{color:V.muted}}>{a.result}</span>
          </div>
        </div>
        <div style={{background:"#001508", borderRadius:12, padding:"14px", fontFamily:"monospace", fontSize:px(11), lineHeight:2}}>
          {a.code.map((line,i)=>(
            <div key={i} style={{color:line.startsWith("#")?"#475569":line.startsWith("class ")||line.startsWith("def ")?"#6ee7b7":line.trim()===""?"transparent":GRN+"cc"}}>{line||"\u00a0"}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ INSIGHTS ════════════════════════════════════════════════ */
const ReActInsights = ({onBack}) => {
  const [done,setDone]=useState(Array(8).fill(false));
  const items=[
    {e:"🔄",t:"ReAct = Reasoning + Acting, interleaved. Thought traces guide which action to take; observations ground the next thought in reality. This loop prevents hallucination by anchoring reasoning to retrieved facts."},
    {e:"💭",t:"The Thought step is the key innovation over pure tool-calling agents. Making the LLM reason explicitly before acting — writing down its plan — dramatically improves correctness on multi-step tasks. The trace is both output and input."},
    {e:"🔭",t:"Observations are the grounding mechanism. Every tool result becomes an Observation in the context. The LLM cannot ignore what it retrieved — it must reason about the actual result, not its prior beliefs."},
    {e:"⚔️",t:"ReAct vs Chain-of-Thought: CoT is smarter reasoning from static knowledge. ReAct is grounded reasoning from live retrieved data. Use CoT when knowledge is stable. Use ReAct when facts may have changed or need verification."},
    {e:"🪞",t:"Reflexion extends ReAct with episode-level learning. After each failed attempt, the agent writes a verbal self-critique and stores it in long-term memory. The critique informs the next attempt — learning without gradient descent."},
    {e:"🌳",t:"Tree of Thoughts extends ReAct's single reasoning chain into a branching tree. Multiple thoughts are generated, scored, and the best branch selected — like MCTS applied to language. Particularly powerful for creative and logical tasks."},
    {e:"⚠️",t:"ReAct failure modes: reasoning chains that grow too long (context overflow), hallucinated tool arguments, circular reasoning (thought→action→same thought→same action), and error propagation when early observations are wrong."},
    {e:"🚀",t:"The frontier: combining ReAct + Reflexion + ToT gives state-of-the-art performance on complex agent benchmarks. Add multi-agent coordination and you have the architecture foundation of near-term AGI systems."},
  ];
  const cnt=done.filter(Boolean).length;
  return (
    <div style={{...LSEC, background:V.paper}}>
      <div style={{maxWidth:px(800), margin:"0 auto"}}>
        {STag("Key Insights · ReAct Framework", GRN)}
        <h2 style={{...LH2, marginBottom:px(28)}}>8 Things to <span style={{color:GRN}}>Master</span></h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(14), marginBottom:px(32)}}>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
              style={{...LCARD, cursor:"pointer", border:`2px solid ${done[i]?GRN+"44":V.border}`, background:done[i]?GRN+"08":V.paper, transition:"all 0.2s"}}>
              <span style={{fontSize:px(26)}}>{item.e}</span>
              <p style={{...LBODY, margin:"8px 0 0", fontSize:px(13), flex:1, color:done[i]?V.ink:V.muted, fontWeight:done[i]?600:400}}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{background:V.cream, borderRadius:14, padding:"16px 20px", marginBottom:px(24)}}>
          <div style={{display:"flex", justifyContent:"space-between", marginBottom:6}}>
            <span style={{fontWeight:700, color:V.ink}}>Mastered {cnt}/8 — Level 6 complete!</span>
            <span style={{fontWeight:700, color:GRN}}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{background:V.border, borderRadius:99, height:8}}>
            <div style={{background:`linear-gradient(90deg,${TEAL},${GRN})`, borderRadius:99, height:8, width:`${cnt/8*100}%`, transition:"width 0.4s"}}/>
          </div>
        </div>
        {cnt===8&&(
          <div style={{background:GRN+"0d", border:`2px solid ${GRN}33`, borderRadius:14, padding:"16px 20px", marginBottom:px(24), textAlign:"center"}}>
            <div style={{fontSize:px(32), marginBottom:8}}>🎉</div>
            <div style={{fontWeight:800, color:GRN, fontSize:px(18), marginBottom:4}}>Level 6 Complete!</div>
            <p style={{...LBODY, color:V.muted, fontSize:px(14), margin:0}}>You've mastered Agentic AI — from agent fundamentals through tool use, multi-agent systems, and the ReAct framework. You now understand how modern autonomous AI systems are built.</p>
          </div>
        )}
        <div style={{display:"flex", gap:12}}>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`, background:"none", borderRadius:10, padding:"12px 24px", color:V.muted, cursor:"pointer", fontSize:px(13)}}>← Back to Level 6</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ═══════════════════════════════════════════════ */
const ReActFrameworkPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="ReAct Framework" lessonNum="Lesson 5 of 5"
    accent={GRN} levelLabel="Agentic AI"
    dotLabels={["Hero","Introduction","Core Concept","Architecture","Walkthrough","vs CoT","Python","Limitations","Advanced","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#001508 0%,#002a16 60%,#001508 100%)", minHeight:"75vh", display:"flex", alignItems:"center", overflow:"hidden"}}>
          <div style={{maxWidth:px(1100), width:"100%", margin:"0 auto", padding:"80px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(48), alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, padding:"7px 16px", color:"#64748b", cursor:"pointer", fontSize:13, marginBottom:24}}>← Back</button>
              {STag("🔄 Lesson 5 of 5 · Agentic AI", GRN)}
              <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:px(20)}}>
                ReAct<br /><span style={{color:"#6ee7b7"}}>Framework</span>
              </h1>
              <p style={{...LBODY, color:"#94a3b8", fontSize:px(17), marginBottom:px(28)}}>
                ReAct — Reasoning + Acting — is the dominant paradigm for AI agents. By interleaving thinking traces with tool calls, agents ground their reasoning in verified reality and solve problems impossible for pure language models.
              </p>
              <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                {[["💭","Thought traces"],["⚡","Tool actions"],["🔭","Grounded observations"],["🪞","Reflexion & ToT"]].map(([icon,label])=>(
                  <div key={label} style={{background:GRN+"15", border:`1px solid ${GRN}33`, borderRadius:10, padding:"7px 14px", display:"flex", gap:6, alignItems:"center"}}>
                    <span>{icon}</span><span style={{color:"#6ee7b7", fontSize:px(12), fontWeight:600}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:340, borderRadius:20, overflow:"hidden", border:`1px solid ${GRN}22`}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1: INTRO */}
        <div ref={R(1)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 1 · Introduction", GRN)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Why Agents Must <span style={{color:GRN}}>Reason Before Acting</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32)}}>
              <div>
                <p style={{...LBODY, marginBottom:16}}>A naive approach to AI agents: receive a query → call a tool → return the result. This breaks immediately on multi-step problems. Without explicit reasoning about <em>why</em> to call a tool, <em>what</em> to do with the result, and <em>whether</em> the task is complete, agents act blindly.</p>
                <p style={{...LBODY, marginBottom:16}}><strong>ReAct</strong> (Yao et al., 2022, Princeton) formalised the insight that language models should produce explicit reasoning traces alongside actions. The pattern — <strong>Thought → Action → Observation</strong> — creates a closed loop that grounds reasoning in retrieved reality and guides tool selection through explicit intent.</p>
                <IBox color={GRN} title="The original ReAct paper"
                  body="'ReAct: Synergizing Reasoning and Acting in Language Models' (Yao et al., 2022) showed that interleaving reasoning traces with actions dramatically outperforms both pure reasoning (CoT) and pure acting (tool-only) approaches. On HotpotQA, ReAct reduced hallucination by 34% vs CoT and improved tool use efficiency vs pure action agents." />
              </div>
              <div>
                <div style={{fontWeight:700, color:GRN, marginBottom:10, fontSize:px(13)}}>What goes wrong without reasoning traces:</div>
                {[
                  {prob:"Blind tool calls",   ex:"Agent calls web_search('weather') even though the question is about math",       fix:"Thought: 'This is arithmetic. I should call calculator, not search.'"},
                  {prob:"Result ignorance",   ex:"Gets observation but doesn't use it — repeats same tool call in a loop",           fix:"Thought: 'Observation shows X. This changes my plan — I should now call Y.'"},
                  {prob:"No completion check",ex:"Keeps searching even when the answer has been retrieved",                           fix:"Thought: 'I now have all the pieces. I can answer without further tool calls.'"},
                  {prob:"Context loss",       ex:"Forgets earlier observations by the 5th tool call",                                fix:"Thought trace in context forces LLM to integrate all prior observations."},
                ].map(row=>(
                  <div key={row.prob} style={{...LCARD, padding:"10px 12px", marginBottom:8}}>
                    <div style={{fontWeight:700, color:GRN, fontSize:px(12), marginBottom:3}}>{row.prob}</div>
                    <div style={{fontSize:px(11), color:"#94a3b8", marginBottom:3}}>❌ Without: {row.ex}</div>
                    <div style={{fontSize:px(11), color:GRN}}>✅ With ReAct: {row.fix}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* S2: CORE */}
        <div ref={R(2)} style={{...LSEC, background:"#001508"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 2 · Core Concept", GRN)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>The <span style={{color:"#6ee7b7"}}>Thought-Action-Observation</span> Loop</h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(32)}}>
              <div>
                <Formula color={GRN}>{"(Thought → Action → Observation)ⁿ → Answer"}</Formula>
                <p style={{...LBODY, color:"#94a3b8", fontSize:px(14), marginBottom:14}}>The agent iterates the TAO loop n times until it has sufficient information to produce a final answer. Each iteration grounds the next thought in real retrieved data, progressively closing in on a verified answer.</p>
                <div style={{...LCARD, background:"#0a2016", border:`1px solid ${GRN}33`}}>
                  {[
                    {step:"💭 Thought",      color:VIO, desc:"Internal reasoning trace. The LLM writes down its current understanding, what it needs to find out, and which tool to call next. This is not sent to any API — it stays in the context window as a reasoning scaffold."},
                    {step:"⚡ Action",       color:ORG, desc:"The tool call selected by the Thought. Formatted as: Action: tool_name[argument]. Common actions: Search[query], Calculator[expression], Lookup[page], Finish[answer]. The executor runs the selected tool."},
                    {step:"🔭 Observation",  color:CYN, desc:"The tool's return value, injected back into context as Observation: [result]. The LLM must read this and incorporate it into the next Thought. Observations are the grounding mechanism — facts, not guesses."},
                    {step:"🔁 Repeat",       color:TEAL,desc:"The next Thought reads the Observation and decides: do I have enough to answer, or do I need another tool call? The loop continues until the LLM outputs 'Finish[answer]' or max iterations reached."},
                  ].map(s=>(
                    <div key={s.step} style={{display:"flex", gap:10, marginBottom:10}}>
                      <div style={{fontWeight:800, color:s.color, fontSize:px(12), minWidth:110}}>{s.step}</div>
                      <div style={{fontSize:px(11), color:"#94a3b8"}}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontWeight:700, color:GRN, marginBottom:8, fontSize:px(13)}}>ReAct prompt format (the exact text structure):</div>
                <div style={{background:"#0a2016", borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2}}>
                  {["Question: What is the elevation range for",
                    "the area where the HARV formula was invented?","",
                    "Thought 1: I need to find where the HARV formula",
                    "was invented, then find the elevation range.",
                    "Action 1: Search[HARV formula origin location]","",
                    "Observation 1: The HARV (High Alpha Research Vehicle)",
                    "was developed at NASA Dryden, Edwards AFB, California.",
                    "",
                    "Thought 2: NASA Dryden is at Edwards AFB. Now I",
                    "need the elevation range of Edwards AFB area.",
                    "Action 2: Search[Edwards Air Force Base elevation]","",
                    "Observation 2: Edwards AFB elevation: 2,300 ft (701 m).",
                    "Nearby Mojave Desert ranges from 1,800 to 4,000 ft.",
                    "",
                    "Thought 3: I have the elevation data. The area",
                    "ranges from about 1,800 to 4,000 ft above sea level.",
                    "Action 3: Finish[The HARV formula area (Edwards AFB,",
                    "CA) has elevations ranging from 1,800 to 4,000 feet.]",
                  ].map((l,i)=>(
                    <div key={i} style={{
                      color: l.startsWith("Thought")? VIO :
                             l.startsWith("Action")? ORG :
                             l.startsWith("Observation")? CYN :
                             l.startsWith("Question")? AMB : "#94a3b8"
                    }}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S3: ARCHITECTURE */}
        <div ref={R(3)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 3 · Architecture", GRN)}
            <h2 style={{...LH2, marginBottom:px(20)}}>ReAct <span style={{color:GRN}}>System Architecture</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:px(10), marginBottom:px(24)}}>
              {[
                {n:"1",label:"Question",  icon:"❓",color:AMB,  desc:"User's question enters the ReAct agent. Appended to system prompt with tool descriptions and few-shot ReAct examples."},
                {n:"2",label:"Thought",   icon:"💭",color:VIO,  desc:"LLM generates a Thought: reasoning about what's needed, what tool to use, and why."},
                {n:"3",label:"Action",    icon:"⚡",color:ORG,  desc:"LLM outputs a structured Action: tool_name[arg]. The executor parses and runs this."},
                {n:"4",label:"Observation",icon:"🔭",color:CYN,  desc:"Tool result injected as Observation. Added to context. LLM reads on next forward pass."},
                {n:"5",label:"Loop / End",icon:"🔄",color:TEAL, desc:"If task complete: output Finish[answer]. Else: generate next Thought and repeat."},
                {n:"6",label:"Answer",    icon:"✅",color:GRN,  desc:"Final grounded answer, citing observations that support it. No hallucination — every claim is traceable."},
              ].map(s=>(
                <div key={s.n} style={{...LCARD, border:`2px solid ${s.color}22`, textAlign:"center"}}>
                  <div style={{width:24,height:24,borderRadius:"50%",background:s.color+"22",border:`2px solid ${s.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:s.color,fontSize:px(11),margin:"0 auto 6px"}}>{s.n}</div>
                  <div style={{fontSize:px(18),marginBottom:4}}>{s.icon}</div>
                  <div style={{fontWeight:700,color:s.color,fontSize:px(10),marginBottom:4}}>{s.label}</div>
                  <p style={{...LBODY,fontSize:px(10),margin:0}}>{s.desc}</p>
                </div>
              ))}
            </div>
            <ReActTraceExplorer/>
          </div>
        </div>

        {/* S4: WALKTHROUGH */}
        <div ref={R(4)} style={{...LSEC, background:"#001508"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 4 · Detailed Walkthrough", GRN)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Step-by-Step <span style={{color:"#6ee7b7"}}>Worked Example</span></h2>
            <div style={{...LCARD, background:"#0a2016", border:`1px solid ${GRN}33`}}>
              <div style={{fontWeight:700, color:AMB, marginBottom:12, fontSize:px(14)}}>
                ❓ Problem: "Find the capital of the country where Tesla Motors was founded."
              </div>
              {[
                {step:"Thought 1", color:VIO, icon:"💭",
                  text:"I need to find where Tesla Motors was founded. I know it's American, but I should verify the exact details rather than assume — countries like Cayman Islands or Delaware incorporation could be relevant.",
                  note:"Key: the agent questions its own assumption before acting. This prevents confident wrong answers."},
                {step:"Action 1", color:ORG, icon:"⚡",
                  text:'Search["Tesla Motors founded location"]',
                  note:"Precise query. Not 'tell me about Tesla' — targeted for the specific fact needed."},
                {step:"Observation 1", color:CYN, icon:"🔭",
                  text:"Tesla, Inc. was founded in 2003 in San Carlos, California, United States, by Martin Eberhard and Marc Tarpenning. Elon Musk joined as chairman in 2004.",
                  note:"The tool returns the ground truth. Note: this may differ from the agent's prior belief (it might have guessed Palo Alto)."},
                {step:"Thought 2", color:VIO, icon:"💭",
                  text:"Tesla was founded in California, USA. Now I need the capital of the United States. I know this is Washington, D.C. but for maximum reliability I should confirm rather than output from memory alone.",
                  note:"The agent decides whether to trust its training data (stable fact) or verify. Here it correctly reasons this fact is stable enough."},
                {step:"Action 2", color:ORG, icon:"⚡",
                  text:'Finish["Tesla Motors was founded in San Carlos, California, USA. The capital of the USA is Washington, D.C."]',
                  note:"Agent correctly judges it has enough verified information and terminates the loop."},
              ].map((s,i)=>(
                <div key={i} style={{display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:12, marginBottom:12, padding:"12px", background:s.color+"0d", border:`1px solid ${s.color}22`, borderRadius:12}}>
                  <div>
                    <div style={{fontWeight:800, color:s.color, fontSize:px(12), marginBottom:4}}>{s.icon} {s.step}</div>
                    <div style={{fontFamily:"monospace", fontSize:px(11), color:s.color+"cc", lineHeight:1.7}}>{s.text}</div>
                  </div>
                  <div style={{fontSize:px(11), color:"#94a3b8", lineHeight:1.7, fontStyle:"italic"}}>💡 {s.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S5: ReAct vs CoT */}
        <div ref={R(5)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 5 · ReAct vs Chain-of-Thought", GRN)}
            <h2 style={{...LH2, marginBottom:px(20)}}>When to Use <span style={{color:GRN}}>Each Approach</span></h2>
            <ReActVsCoT/>
          </div>
        </div>

        {/* S6: PYTHON */}
        <div ref={R(6)} style={{...LSEC, background:"#001508"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 6 · Python Implementation", GRN)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Building ReAct in <span style={{color:"#6ee7b7"}}>Code</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(24)}}>
              <div>
                <div style={{fontWeight:700, color:GRN, marginBottom:8, fontSize:px(13)}}>LangChain ReAct agent (modern API):</div>
                <div style={{background:"#0a2016", border:`1px solid ${GRN}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2}}>
                  {["from langchain.agents import create_react_agent, AgentExecutor",
                    "from langchain_openai import ChatOpenAI",
                    "from langchain.tools import tool",
                    "from langchain import hub","",
                    "# 1. Define tools",
                    "@tool","def search(query: str) -> str:",
                    "    '''Search the web for current info.",
                    "    Use when facts may have changed since training.'''",
                    "    return duckduckgo_search(query)","",
                    "@tool","def calculator(expression: str) -> str:",
                    "    '''Evaluate a mathematical expression.",
                    "    ALWAYS use for arithmetic, never guess.'''",
                    "    return str(eval(expression))","",
                    "@tool","def wikipedia(topic: str) -> str:",
                    "    '''Look up a topic on Wikipedia.",
                    "    Use for encyclopaedic definitions.'''",
                    "    return wiki_api.search(topic)[:500]","",
                    "tools = [search, calculator, wikipedia]","",
                    "# 2. Load ReAct prompt (includes Thought/Action/Obs format)",
                    "prompt = hub.pull('hwchase17/react')",
                    "llm = ChatOpenAI(model='gpt-4o', temperature=0)","",
                    "# 3. Create and run agent",
                    "agent = create_react_agent(llm, tools, prompt)",
                    "executor = AgentExecutor(",
                    "    agent=agent,",
                    "    tools=tools,",
                    "    verbose=True,        # prints Thought/Action/Obs",
                    "    max_iterations=10,   # prevent infinite loops",
                    "    handle_parsing_errors=True",
                    ")","",
                    "result = executor.invoke({",
                    "    'input': 'What is the square root of the population of Japan?'",
                    "})",
                    "print(result['output'])",
                  ].map((l,i)=>(
                    <div key={i} style={{color:l.startsWith("from")||l.startsWith("import")?"#475569":l.startsWith("#")||l.startsWith("    #")||l.startsWith("    '''")?"#475569":l.startsWith("@")?"#6ee7b7":GRN}}>{l||"\u00a0"}</div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{fontWeight:700, color:TEAL, marginBottom:8, fontSize:px(13)}}>LangGraph ReAct (custom state machine):</div>
                <div style={{background:"#0a2016", border:`1px solid ${TEAL}22`, borderRadius:12, padding:"16px", fontFamily:"monospace", fontSize:px(11), lineHeight:2, marginBottom:14}}>
                  {["from langgraph.prebuilt import create_react_agent",
                    "from langchain_openai import ChatOpenAI","",
                    "# LangGraph's prebuilt ReAct is a StateGraph",
                    "# with built-in Thought-Action-Observation loop",
                    "llm = ChatOpenAI(model='gpt-4o', temperature=0)",
                    "tools = [search, calculator, wikipedia]","",
                    "# Creates the full ReAct graph automatically",
                    "agent = create_react_agent(llm, tools)","",
                    "# Stream events for real-time output",
                    "for event in agent.stream(",
                    "    {'messages': [('user', 'Your question here')]},",
                    "    stream_mode='values'",
                    "):",
                    "    event['messages'][-1].pretty_print()","",
                    "# Custom: add memory to ReAct",
                    "from langgraph.checkpoint.memory import MemorySaver",
                    "memory = MemorySaver()",
                    "agent_with_memory = create_react_agent(",
                    "    llm, tools, checkpointer=memory",
                    ")","",
                    "# Now agent remembers across invocations!",
                    "config = {'configurable': {'thread_id': 'user-123'}}",
                    "agent_with_memory.invoke(",
                    "    {'messages': [('user', 'Remember, I live in Tokyo')]},",
                    "    config=config",
                    ")","",
                    "# Next call remembers Tokyo",
                    "agent_with_memory.invoke(",
                    "    {'messages': [('user', \"What's my local weather?\")]},",
                    "    config=config  # same thread_id",
                    ")",
                  ].map((l,i)=>(
                    <div key={i} style={{color:l.startsWith("from")||l.startsWith("import")?"#475569":l.startsWith("#")?"#475569":TEAL}}>{l||"\u00a0"}</div>
                  ))}
                </div>
                <IBox color={GRN} title="Key parameter: max_iterations"
                  body="Always set max_iterations (typically 8-15). Without it, a stuck agent will loop forever, burning API tokens. If the agent exceeds the limit, return whatever partial answer exists rather than failing silently. Set handle_parsing_errors=True to recover from malformed tool calls gracefully." />
              </div>
            </div>
          </div>
        </div>

        {/* S7: LIMITATIONS */}
        <div ref={R(7)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 7 · Limitations", GRN)}
            <h2 style={{...LH2, marginBottom:px(20)}}>ReAct's <span style={{color:GRN}}>Known Failure Modes</span></h2>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:px(16)}}>
              {[
                {icon:"📏",title:"Long reasoning chains",       color:ROSE, desc:"Each Thought-Action-Observation cycle adds ~500-1000 tokens. A 10-step ReAct trace consumes 5000-10000 tokens of context — expensive and risks overflow. The agent may lose track of early observations by step 8-10."},
                {icon:"💰",title:"Cost per query",              color:AMB,  desc:"A typical ReAct agent call costs 3-10× a single LLM call due to the iterative loop and tool results in context. GPT-4 at $10/M tokens × 10,000 tokens per ReAct call = $0.10/query at scale becomes significant."},
                {icon:"🔄",title:"Circular reasoning loops",    color:VIO,  desc:"The agent calls Search[X], gets a result, Thinks it needs more, calls Search[X] again with the same query. Without explicit loop detection or the max_iterations guard, this repeats indefinitely."},
                {icon:"☠️",title:"Error propagation",           color:ROSE, desc:"If Observation 1 is wrong (incorrect tool result, stale data), Thought 2 is built on false premises, and the error compounds. Verification loops (check the result independently) add robustness but cost."},
                {icon:"🌫️",title:"Hallucinated tool arguments", color:CYN,  desc:"The LLM sometimes generates Action: Search[a query that sounds plausible but is subtly wrong] — asking about the wrong entity, misspelling a key term, or combining two different concepts into one query."},
                {icon:"🎯",title:"Premature termination",       color:TEAL, desc:"The agent may call Finish[] before fully answering the question — satisfied with a partial result. Or it may over-run — continuing to search after having sufficient information, adding latency and cost."},
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

        {/* S8: ADVANCED */}
        <div ref={R(8)} style={{...LSEC, background:"#001508"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Section 8 · Advanced Frameworks", GRN)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Beyond ReAct: <span style={{color:"#6ee7b7"}}>The Frontier</span></h2>
            <AdvancedFrameworksExplorer/>
          </div>
        </div>

        {/* GAME */}
        <div ref={R(9)} style={{...LSEC, background:V.paper}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Game · Simulate the Agent", GRN)}
            <h2 style={{...LH2, marginBottom:px(20)}}>Play: <span style={{color:GRN}}>Guess the Next Step</span></h2>
            <ReActStepGuesser/>
          </div>
        </div>

        {/* PROJECT */}
        <div ref={R(10)} style={{...LSEC, background:"#001508"}}>
          <div style={{maxWidth:px(1000), margin:"0 auto"}}>
            {STag("Project · ReAct Research Agent", GRN)}
            <h2 style={{...LH2, color:"#fff", marginBottom:px(20)}}>Project: <span style={{color:"#6ee7b7"}}>Full ReAct Loop</span></h2>
            <ReActResearchAgent/>
          </div>
        </div>

        {/* INSIGHTS */}
        <div ref={R(11)}><ReActInsights onBack={onBack}/></div>
      </>
    )}
  </NavPage>
);

export default ReActFrameworkPage;