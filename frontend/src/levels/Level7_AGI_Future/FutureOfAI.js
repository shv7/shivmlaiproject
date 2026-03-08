import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — THE FUTURE OF AI
   Level 7 · AGI & Future of AI · Lesson 5 of 5  (FINAL LESSON)
   Accent: Green #059669
══════════════════════════════════════════════════════════════════ */
const GRN  = "#059669";
const EMR  = "#10b981";
const TEAL = "#0d9488";
const CYN  = "#0891b2";
const IND  = "#4f46e5";
const VIO  = "#7c3aed";
const AMB  = "#f59e0b";
const ORG  = "#f97316";
const RED  = "#ef4444";
const RSE  = "#e11d48";
const SKY  = "#0284c7";
const ITEMS = 7;

const Formula = ({children,color=GRN}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,padding:"16px 22px",fontFamily:"monospace",fontSize:px(14),color,fontWeight:700,textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);

/* ══════ HERO CANVAS — AI trajectory tree ════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);

    const NODES=[
      {x:0.5, y:0.85, label:"Today",   color:"#64748b", r:14},
      {x:0.5, y:0.65, label:"AGI",     color:AMB,       r:16},
      {x:0.25,y:0.42, label:"Science", color:GRN,       r:14},
      {x:0.5, y:0.40, label:"Economy", color:CYN,       r:14},
      {x:0.75,y:0.42, label:"Society", color:VIO,       r:14},
      {x:0.15,y:0.20, label:"Medicine",color:EMR,       r:12},
      {x:0.35,y:0.18, label:"Climate", color:GRN,       r:12},
      {x:0.5, y:0.16, label:"Finance", color:AMB,       r:12},
      {x:0.65,y:0.18, label:"Labour",  color:ORG,       r:12},
      {x:0.85,y:0.20, label:"Culture", color:VIO,       r:12},
    ];
    const EDGES=[
      [0,1],[1,2],[1,3],[1,4],[2,5],[2,6],[3,7],[3,8],[4,9]
    ];
    const particles=[];
    for(let i=0;i<30;i++) particles.push({edge:i%EDGES.length,progress:Math.random(),speed:0.003+Math.random()*0.003});

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#001208"; ctx.fillRect(0,0,W,H);
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle="rgba(5,150,105,0.04)";ctx.lineWidth=1;ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      // Edges
      EDGES.forEach(([a,b])=>{
        const an=NODES[a],bn=NODES[b];
        const grd=ctx.createLinearGradient(an.x*W,an.y*H,bn.x*W,bn.y*H);
        grd.addColorStop(0,an.color+"44"); grd.addColorStop(1,bn.color+"44");
        ctx.beginPath(); ctx.moveTo(an.x*W,an.y*H); ctx.lineTo(bn.x*W,bn.y*H);
        ctx.strokeStyle=grd; ctx.lineWidth=1.5; ctx.stroke();
      });

      // Particles along edges
      particles.forEach(p=>{
        p.progress+=p.speed;
        if(p.progress>1){p.progress=0;p.edge=(p.edge+1)%EDGES.length;}
        const [a,b]=EDGES[p.edge];
        const an=NODES[a],bn=NODES[b];
        const x=an.x*W+(bn.x*W-an.x*W)*p.progress;
        const y=an.y*H+(bn.y*H-an.y*H)*p.progress;
        const alpha=Math.sin(p.progress*Math.PI)*0.8;
        ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2);
        ctx.fillStyle=GRN+Math.floor(alpha*255).toString(16).padStart(2,"0"); ctx.fill();
      });

      // Nodes
      NODES.forEach((n,i)=>{
        const nx=n.x*W,ny=n.y*H;
        const pulse=(Math.sin(t*1.2+i)+1)/2;
        const g=ctx.createRadialGradient(nx,ny,0,nx,ny,n.r+6+pulse*4);
        g.addColorStop(0,n.color+"55"); g.addColorStop(1,n.color+"00");
        ctx.beginPath();ctx.arc(nx,ny,n.r+6+pulse*4,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(nx,ny,n.r,0,Math.PI*2);
        ctx.fillStyle=n.color+"22"; ctx.strokeStyle=n.color+"88"; ctx.lineWidth=2; ctx.fill(); ctx.stroke();
        ctx.font=`bold ${px(8)} sans-serif`;ctx.textAlign="center";ctx.textBaseline="top";
        ctx.fillStyle=n.color+"dd";ctx.fillText(n.label,nx,ny+n.r+4);
      });

      t+=0.02; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ AI & SCIENTIFIC DISCOVERY ══════════════════════════════ */
const ScientificDiscovery = () => {
  const [domain, setDomain] = useState(0);
  const DOMAINS = [
    {name:"Drug Discovery",    icon:"💊", color:GRN,
      before:"Drug discovery took 12–15 years from target identification to market. 90% of drug candidates fail in clinical trials. Cost: $2.5B per approved drug. Mostly trial-and-error on known protein targets.",
      ai_change:"AlphaFold 2 (DeepMind, 2021) predicted structures of 200M proteins — essentially all known proteins — ending a 50-year structural biology problem. AlphaFold 3 (2024) predicts interactions between proteins, DNA, RNA, and small molecules. Drug design AI (Insilico Medicine, Recursion Pharmaceuticals) identified novel drug candidates in weeks rather than years.",
      specific:"Insilico Medicine's INS018_055: first AI-designed, AI-developed drug to enter Phase II clinical trials (idiopathic pulmonary fibrosis). Identified in 30 days; traditional approach would take 4+ years.",
      future:"AI will design personalised drugs for individual patients based on their specific protein mutations. Clinical trials replaced by AI-simulated patient cohorts. Drug development time: weeks to months. Cost reduction: 90%+.",
      timeline:"2025–2030: AI designs first AI-only approved drug. 2030–2040: AI discovers drug therapies for most common diseases."},
    {name:"Materials Science",  icon:"⚛️", color:CYN,
      before:"New material discovery was combinatorial and slow: synthesise a candidate, measure properties, iterate. Room-temperature superconductors — a holy grail of materials science — had not been achieved after 80 years of searching.",
      ai_change:"Google DeepMind's GNoME (2023): discovered 2.2M new stable crystal structures — 45× more than all previously known stable crystals. 380,000 of these are potentially synthesisable. AI is exploring the materials space exhaustively where humans could only sample. Microsoft's quantum materials research uses AI to design molecules for quantum computers.",
      specific:"AI-discovered room-temperature superconductor claimed by Korean team (2023, since disputed) triggered global excitement. Whether that claim holds or not, the search has been fundamentally accelerated — AI can screen millions of candidate structures per day.",
      future:"Room-temperature superconductors would transform power transmission (near-zero losses), computing (room-temperature quantum chips), and transportation (magnetic levitation). AI-designed battery materials will enable 1000-mile EV ranges and grid-scale energy storage.",
      timeline:"2025–2030: AI discovers key battery materials for grid storage. 2030s: Room-temperature superconductors in commercial applications."},
    {name:"Climate Modelling",  icon:"🌍", color:TEAL,
      before:"Climate models required months of supercomputer time to run a single projection. Resolution limited by compute — could not accurately model local weather effects. Weather forecasting accurate to ~5 days; seasonal projections highly uncertain.",
      ai_change:"Google DeepMind's GraphCast (2023): 10-day weather forecasts more accurate than ECMWF (the gold standard) — in 60 seconds on a single GPU. Microsoft's ClimaX: universal climate model. NeuralGCM (Google, 2024): hybrid AI+physics model that outperforms traditional models at 1/1000th the compute.",
      specific:"GraphCast correctly predicted the trajectory of Hurricane Lee in 2023 10 days before landfall — traditional models were less accurate at 7 days. Accurate extreme weather prediction could save thousands of lives per year from better evacuation timing.",
      future:"AI will enable real-time climate engineering simulations — allowing humans to test interventions (solar geoengineering, carbon capture strategies) before deploying them. Climate models accurate enough to guide infrastructure investment decisions at city level.",
      timeline:"2025–2030: AI climate models guide national adaptation policy. 2030–2040: AI-designed carbon capture and storage systems deployed at scale."},
    {name:"Fundamental Physics", icon:"⚡", color:VIO,
      before:"String theory produced 10^500 possible universes without a mechanism to select among them. The Standard Model has 19 free parameters that must be measured, not derived. Dark matter and dark energy constitute 95% of the universe but remain unexplained.",
      ai_change:"AI is being applied to plasma confinement in fusion reactors (DeepMind's fusion research with TAE Technologies and EPFL), gravitational wave analysis (detecting signals in LIGO noise), particle physics event classification, and lattice QCD calculations. Symbolic regression AI can extract physical laws from experimental data.",
      specific:"DeepMind AI for plasma control (Nature 2022): controlled a fusion plasma shape autonomously, enabling new plasma configurations that human controllers couldn't maintain. This is one of the hardest real-time control problems in physics.",
      future:"AI may discover the theory beyond the Standard Model by finding patterns in particle physics data that human physicists missed. Functional quantum computing AI systems could simulate quantum chemistry exactly — potentially discovering room-temperature superconductors from first principles.",
      timeline:"2025–2035: AI contributes to first practical fusion energy. 2030–2050: AI makes major theoretical contribution to fundamental physics."},
    {name:"Mathematics",        icon:"📐", color:AMB,
      before:"Mathematical proof was exclusively human. Formal verification tools existed but required humans to structure the proof. Olympiad-level problems took world-class mathematicians years. The Riemann Hypothesis, Navier-Stokes equations, and other Millennium Problems remained unsolved.",
      ai_change:"AlphaGeometry (DeepMind, 2024): solved 25/30 IMO geometry problems at near-gold-medal level — better than most human gold medalists. AlphaProof (DeepMind, 2024): solved 4/6 IMO 2024 problems. Lean-based theorem provers (Terence Tao, Fields Medal, working with AI tools) suggest human-AI collaboration on proofs is becoming productive.",
      specific:"AlphaProof's solution to the ISL 2024 Number Theory problem (P6) was described by professional mathematicians as using a non-obvious approach they had not considered. The system found a proof strategy that surprised experts.",
      future:"AI will prove conjectures that have stymied mathematicians for centuries. The four Millennium Prize Problems still unsolved may yield to AI. AI that can generate and verify mathematical proofs is also the foundation for AI systems that can prove their own alignment properties.",
      timeline:"2025–2030: AI makes significant progress on Clay Millennium Problems. 2030–2040: Most routine mathematical work automated; human mathematicians focus on problem formulation."},
  ];
  const d = DOMAINS[domain];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        🔬 AI & Scientific Discovery — Five Research Frontiers
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {DOMAINS.map((dm,i)=>(
          <button key={i} onClick={()=>setDomain(i)} style={{
            flex:1,background:domain===i?dm.color:dm.color+"0d",
            border:`2px solid ${domain===i?dm.color:dm.color+"33"}`,
            borderRadius:10,padding:"7px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:domain===i?"#fff":dm.color,textAlign:"center"
          }}>{dm.icon}<br/>{dm.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{background:d.color+"0d",border:`2px solid ${d.color}33`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <div style={{fontWeight:800,color:d.color,fontSize:px(14),marginBottom:8}}>{d.icon} {d.name}</div>
            <div style={{fontWeight:700,color:V.muted,fontSize:px(10),marginBottom:4}}>BEFORE AI:</div>
            <p style={{...LBODY,fontSize:px(12),marginBottom:8}}>{d.before}</p>
            <div style={{fontWeight:700,color:d.color,fontSize:px(10),marginBottom:4}}>HOW AI CHANGES IT:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{d.ai_change}</p>
          </div>
        </div>
        <div>
          <div style={{background:AMB+"0d",border:`1px solid ${AMB}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(10),marginBottom:3}}>🎯 Specific breakthrough:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{d.specific}</p>
          </div>
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:VIO,fontSize:px(10),marginBottom:3}}>🔮 Future projection:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{d.future}</p>
          </div>
          <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"8px 10px"}}>
            <div style={{fontWeight:700,color:GRN,fontSize:px(10),marginBottom:2}}>📅 Timeline:</div>
            <div style={{fontSize:px(11),color:V.muted}}>{d.timeline}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ ECONOMIC TRANSFORMATION ════════════════════════════════ */
const EconomicTransformation = () => {
  const [view, setView] = useState(0);
  const VIEWS = [
    {name:"Job Impact",        color:ORG, icon:"💼",
      intro:"The labour market impact of AI is the most contested economic question of our era. Historical technological transitions displaced workers but created more jobs than they destroyed. Whether AI is different — capable of replacing rather than augmenting human cognition at scale — is genuinely unclear.",
      data:[
        {cat:"High automation risk",   pct:38, color:RED,   examples:"Data entry, telemarketing, accounting, loan officers, paralegals, radiologists (partial), truck drivers"},
        {cat:"Partial automation",     pct:44, color:AMB,   examples:"Doctors, lawyers, engineers, journalists, teachers, managers, software developers"},
        {cat:"Low automation risk",    pct:18, color:GRN,   examples:"Plumbers, electricians, childcare workers, therapists, athletes, politicians, clergy"},
      ],
      nuance:"Frey & Osborne (2013) predicted 47% of jobs at high automation risk. But subsequent analysis (OECD 2019) found only 14% — tasks within jobs are automated, not whole jobs. GPT-4 era may change this: cognitive tasks that previously required humans are increasingly automatable.",
      new_jobs:"Historically, technology creates new jobs: AI trainers, prompt engineers, AI ethicists, robotic process automation consultants, AI safety researchers. But transition costs are real and unevenly distributed."},
    {name:"New Industries",    color:GRN, icon:"🏭",
      intro:"AI creates entirely new economic sectors that did not exist before — and is already doing so.",
      data:[
        {cat:"AI infrastructure",     pct:45, color:CYN,  examples:"GPU compute (Nvidia), AI clouds (Azure AI, AWS SageMaker, GCP), model training infrastructure"},
        {cat:"AI applications",       pct:30, color:GRN,  examples:"Copilots (GitHub Copilot, Cursor), agents (AutoGPT, Devin), AI-native SaaS across every vertical"},
        {cat:"AI safety/governance",  pct:5,  color:AMB,  examples:"Red-teaming, AI safety research, alignment consulting, audit and certification, policy research"},
        {cat:"Human-AI hybrid work",  pct:20, color:VIO,  examples:"AI-augmented doctors, AI-assisted lawyers, AI-enhanced education, human-in-loop AI services"},
      ],
      nuance:"The AI sector grew from ~$40B (2021) to ~$200B (2024) and is projected to reach $1T+ by 2030. Nvidia's market cap exceeded $3 trillion in 2024 — making it briefly the most valuable company on Earth. The economic stakes of the AI transition are already historic.",
      new_jobs:"Net job creation from AI: impossible to predict precisely. Most economists expect large disruption, significant new job creation, and a transition period of substantial inequality and displacement that requires active policy response."},
    {name:"Productivity Revolution", color:CYN, icon:"📈",
      intro:"AI's most certain near-term economic impact is productivity: AI tools make existing workers significantly more effective. The economic effects compound.",
      data:[
        {cat:"Software engineering",  pct:55, color:GRN,  examples:"GitHub Copilot users: 55% faster at coding tasks. Devin resolves ~14% of SWE-Bench issues autonomously."},
        {cat:"Knowledge work",        pct:40, color:CYN,  examples:"Lawyers with AI assistants: 40% faster document review. Analysts: 37% faster report writing (BCG study)."},
        {cat:"Creative work",         pct:25, color:VIO,  examples:"Advertising: AI cuts campaign development from 6 weeks to 3. Architecture: AI-generated design options 10× faster."},
        {cat:"Healthcare",            pct:30, color:AMB,  examples:"Radiologists with AI assistance: 30% faster reading, fewer errors. Clinical note generation: hours → minutes."},
      ],
      nuance:"BCG study (2023): consultants using GPT-4 completed 12.2% more tasks, 25.1% faster, with 40% better quality. Goldman Sachs estimates AI could raise global GDP by 7% ($7 trillion) over 10 years through productivity gains alone.",
      new_jobs:"The 'centaur' model: human+AI teams outperform both humans alone and AI alone on complex tasks. The most valuable workers will be those who can collaborate effectively with AI — not those who compete with it."},
  ];
  const v = VIEWS[view];
  const total = v.data.reduce((s,d)=>s+d.pct,0);
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        📊 Economic Transformation — Three Dimensions of AI's Economic Impact
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {VIEWS.map((vw,i)=>(
          <button key={i} onClick={()=>setView(i)} style={{
            flex:1,background:view===i?vw.color:vw.color+"0d",
            border:`2px solid ${view===i?vw.color:vw.color+"33"}`,
            borderRadius:10,padding:"8px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(10),color:view===i?"#fff":vw.color,textAlign:"center"
          }}>{vw.icon}<br/>{vw.name.split(" ")[0]}</button>
        ))}
      </div>
      <p style={{...LBODY,fontSize:px(13),color:V.muted,marginBottom:14}}>{v.intro}</p>
      <div style={{marginBottom:14}}>
        {v.data.map((d,i)=>(
          <div key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontWeight:700,color:d.color,fontSize:px(12)}}>{d.cat}</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:d.color,fontSize:px(12)}}>{d.pct}%</span>
            </div>
            <div style={{background:V.border,borderRadius:99,height:8,marginBottom:3}}>
              <div style={{background:d.color,borderRadius:99,height:8,width:`${d.pct/(total/100)}%`,transition:"width 0.6s"}}/>
            </div>
            <div style={{fontSize:px(10),color:V.muted}}>{d.examples}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{background:AMB+"0d",border:`1px solid ${AMB}22`,borderRadius:10,padding:"10px"}}>
          <div style={{fontWeight:700,color:AMB,fontSize:px(10),marginBottom:3}}>Nuance:</div>
          <p style={{...LBODY,fontSize:px(11),margin:0}}>{v.nuance}</p>
        </div>
        <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px"}}>
          <div style={{fontWeight:700,color:GRN,fontSize:px(10),marginBottom:3}}>New opportunities:</div>
          <p style={{...LBODY,fontSize:px(11),margin:0}}>{v.new_jobs}</p>
        </div>
      </div>
    </div>
  );
};

/* ══════ HUMAN-AI COLLABORATION SPECTRUM ════════════════════════ */
const CollaborationSpectrum = () => {
  const [selected, setSelected] = useState(null);
  const EXAMPLES = [
    {name:"AI Copilots",       icon:"🛫", color:CYN,
      desc:"AI systems that work alongside humans in real-time, suggesting, completing, and accelerating their work. The human sets direction and makes final decisions; the AI handles execution details and offers alternatives.",
      examples:["GitHub Copilot: suggests code completions, writes functions from comments. 55% productivity gain in studies","Claude/ChatGPT in writing: drafts, edits, restructures. Writers report 2–4× speed on first drafts","Cursor (AI IDE): rewrites entire files, adds tests, explains code. Used by professional developers daily"],
      model:"Human-centric: AI executes, human decides. The intelligence is distributed — human provides intent, context, and judgment; AI provides recall, execution speed, and technical breadth.",
      limit:"Copilots are only as good as the human's ability to evaluate their output. Novices using copilots may not detect errors. Experts using copilots may become over-reliant on AI suggestions."},
    {name:"Creative Assistants",icon:"🎨", color:VIO,
      desc:"AI systems that participate in the creative process — not replacing human creativity but expanding it by generating options, suggesting directions, and rapidly iterating on ideas.",
      examples:["Midjourney/DALL-E: visual artists use AI to generate initial concepts, then refine. The human provides aesthetic direction; AI generates variations at speed","Adobe Firefly: integrated into Photoshop for inpainting, outpainting, and generative fill — standard professional tool","Suno/Udio: musicians use AI to generate reference tracks, experiment with production styles. Collaboration, not replacement"],
      model:"Creative partnership: human provides taste, intent, and evaluation; AI provides generative breadth. The human chooses from AI suggestions rather than generating from scratch. Lowers barrier to creative production.",
      limit:"Questions of authorship, originality, and the artistic value of AI-generated work are genuinely contested. Copyright law is still adapting to AI-generated creative works."},
    {name:"Scientific Collaborators",icon:"🧬", color:GRN,
      desc:"AI systems that actively participate in scientific research — not just running analyses but proposing hypotheses, identifying patterns in data, and suggesting experiments.",
      examples:["AlphaFold: protein structure prediction has fundamentally accelerated structural biology research — used by 2M+ researchers","AI Scientist (Sakana AI): generates research ideas, writes code, runs experiments, writes papers. Early prototype of autonomous research","GPT-4 used by researchers to generate hypotheses, plan experiments, synthesise literature reviews at speed"],
      model:"Scientific partnership: AI handles breadth (reading all papers, testing all hypotheses) while human provides depth (experimental expertise, domain intuition, ethical oversight of research direction).",
      limit:"AI can generate plausible-sounding but incorrect scientific claims. Hallucination in scientific research is dangerous. Human verification remains essential for all AI-generated scientific claims."},
    {name:"AI Tutors",          icon:"🎓", color:AMB,
      desc:"Personalised AI teachers that adapt to each student's learning pace, identify misconceptions, and provide personalised instruction unavailable in typical classroom settings.",
      examples:["Khan Academy Khanmigo: Socratic AI tutor that guides students to answers rather than giving them. Used by millions","Duolingo: AI models personalise language learning to individual learner patterns and error types","Carnegie Learning's MATHia: adaptive maths tutor with 30+ years of learning science data. Closes learning gaps 2× faster"],
      model:"Personalised Bloom's 2-sigma: Benjamin Bloom (1984) showed tutoring produced 2-standard-deviation improvement in student outcomes. AI enables personalised tutoring at scale — a 2-sigma improvement for every student.",
      limit:"Relationship, motivation, and social learning are essential components of education that AI currently cannot provide. The risk: students optimising for AI approval rather than genuine learning."},
    {name:"Medical Collaborators", icon:"🏥", color:TEAL,
      desc:"AI systems that assist medical professionals with diagnosis, treatment planning, drug interaction checking, and clinical documentation — reducing cognitive load and improving accuracy.",
      examples:["Google's AMIE: diagnostic reasoning system that outperformed primary care physicians on diagnostic accuracy in a blinded study (NEJM 2024)","Viz.ai: AI triage for stroke and cardiac events. Automatically alerts specialists from scans. Reduces time-to-treatment by 2+ hours","Suki: AI scribe that converts doctor-patient conversations into clinical notes, reducing documentation time by 72%"],
      model:"Augmented clinical intelligence: the doctor provides empathy, physical examination, contextual judgment, and final accountability; the AI provides pattern recognition across millions of cases, drug interaction databases, and documentation support.",
      limit:"Medical liability for AI-assisted decisions is legally unclear. Over-reliance on AI could atrophy diagnostic skills. AI trained on historical data may perpetuate clinical biases."},
  ];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        🤝 Human-AI Collaboration — Five Models in Practice
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:8}}>
        {EXAMPLES.map((ex,i)=>(
          <div key={i} onClick={()=>setSelected(selected===i?null:i)}
            style={{...LCARD,cursor:"pointer",border:`2px solid ${selected===i?ex.color:ex.color+"33"}`,background:selected===i?ex.color+"08":V.paper,transition:"all 0.2s",padding:"12px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <span style={{fontSize:px(20)}}>{ex.icon}</span>
              <div style={{fontWeight:800,color:ex.color,fontSize:px(13)}}>{ex.name}</div>
            </div>
            <p style={{...LBODY,fontSize:px(11),marginBottom:0}}>{ex.desc}</p>
            {selected===i&&(
              <div style={{marginTop:10}}>
                <div style={{fontWeight:700,color:ex.color,fontSize:px(10),marginBottom:4}}>Examples:</div>
                {ex.examples.map((e,j)=>(<div key={j} style={{display:"flex",gap:6,marginBottom:3,fontSize:px(10)}}><span style={{color:ex.color}}>→</span><span style={{color:V.muted}}>{e}</span></div>))}
                <div style={{background:ex.color+"0d",border:`1px solid ${ex.color}22`,borderRadius:8,padding:"7px 9px",marginTop:8,marginBottom:6}}>
                  <div style={{fontWeight:700,color:ex.color,fontSize:px(9),marginBottom:2}}>Collaboration model:</div>
                  <div style={{fontSize:px(10),color:V.muted}}>{ex.model}</div>
                </div>
                <div style={{background:AMB+"0d",border:`1px solid ${AMB}22`,borderRadius:8,padding:"7px 9px"}}>
                  <div style={{fontWeight:700,color:AMB,fontSize:px(9),marginBottom:2}}>Current limits:</div>
                  <div style={{fontSize:px(10),color:V.muted}}>{ex.limit}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════ CIVILISATION TRAJECTORY SIMULATOR ══════════════════════ */
const CivilisationSimulator = () => {
  const [path, setPath] = useState(null);
  const [year, setYear] = useState(2030);

  const PATHS = [
    {name:"🌟 Accelerated Flourishing",   color:GRN,
      desc:"Aligned AI, broadly distributed. AI accelerates scientific discovery and economic growth while safety research keeps capabilities in check. International cooperation succeeds.",
      years:{
        2030:"AGI achieved by leading labs. International AI Safety Treaty signed with 40+ nations. RLHF and Constitutional AI proven at scale. First AI-designed drugs approved for 12 diseases. Global GDP growth: +4% from AI productivity.",
        2035:"AI solves antibiotic resistance crisis. Climate AI models guide global net-zero transition. Universal AI education tools deployed in 150 countries. Extreme poverty rate drops to 2%.",
        2040:"AI-designed fusion reactors operational in 8 countries. Alzheimer's disease effectively cured. Personalised education achieves average +2 standard deviation learning outcomes globally.",
        2050:"Post-scarcity in energy and food for most of humanity. Human cognitive augmentation via BCI becoming mainstream. Life expectancy in developed world: 120 years. AI handles routine cognitive work; humans focus on meaning, relationships, creativity.",
        2075:"First AI-designed spacecraft to Alpha Centauri launched. Human civilisation has spread to Mars. The alignment problem is retrospectively seen as the most important engineering challenge in history — solved in time.",
      }},
    {name:"⚠️ Managed Disruption",          color:AMB,
      desc:"AI capabilities advance rapidly but unevenly. Economic disruption is severe but containable. Political tensions from AI-driven inequality. Partial international cooperation.",
      years:{
        2030:"AGI approaches but no single system reaches it. 150M workers displaced by automation. Universal Basic Income adopted in Nordic countries, pilots in UK and Canada. AI safety partially regulated.",
        2035:"Significant job market disruption in professional services. New AI-native industries partially absorb displaced workers. Political movements demanding 'AI dividend' taxation grow. AI capabilities advancing despite incomplete safety.",
        2040:"Economic productivity gains enormous but unevenly distributed. Gini coefficient increases in most nations despite overall wealth growth. Democratic institutions under strain from AI-enabled misinformation and political polarisation.",
        2050:"Stable but unequal world. AI capabilities near-superintelligent but international agreements limit deployment. Vigorous debate about the future of human labour and meaning in a post-scarcity economy.",
        2075:"Retrospectively: humanity navigated the AI transition without catastrophe but at significant human cost. 30 years of economic disruption and political crisis before new equilibrium reached.",
      }},
    {name:"🔴 Concentrated Power",           color:RED,
      desc:"One entity — corporation or nation-state — achieves decisive AI advantage without adequate safety. Benefits concentrated. Democratic institutions undermined.",
      years:{
        2030:"Single AI lab achieves significant AGI capability advantage. Competitive pressure prevents adequate safety testing. Lab/nation gains strategic and economic dominance.",
        2035:"The advantage compounds. Entities without frontier AI cannot compete economically or militarily. Democratic accountability weakens as technical complexity exceeds public understanding.",
        2040:"A form of global governance emerges, but not through democratic deliberation — through AI-enabled dominance by the controlling entity. Other nations effectively dependent.",
        2050:"Stability achieved but through power asymmetry rather than cooperation. The controlling entity's values are encoded in global AI systems. Outcome depends entirely on those values.",
        2075:"Locked-in equilibrium. History will judge this era by the values of whoever controlled AGI. A benevolent lock-in may look like utopia; a self-serving one like the worst human institutions scaled globally.",
      }},
    {name:"🔬 Cautious Progress",           color:CYN,
      desc:"Safety concerns lead to significant slowdown in AI development. Extensive regulatory requirements. Innovation slower but more robust.",
      years:{
        2030:"Comprehensive AI regulation after narrow miss — a system with concerning emergent capabilities is caught in safety testing. Public support for precautionary approach. AI development pace halves.",
        2035:"Safety-first development produces more robust but slower progress. Interpretability research matures. Alignment techniques proven but not at frontier. Economic growth slower; AI-enabled harms rare.",
        2040:"The precautionary approach means AGI is still not achieved by 2040. Some diseases that could have been cured remain incurable. The counterfactual cost of caution is debated.",
        2050:"Genuine AGI achieved safely, having taken 20 more years than in the accelerated scenario. The extra time was used to build governance infrastructure. The transition is managed rather than chaotic.",
        2075:"Retrospectively seen as the right call. The 20 years of slower progress prevented alignment failures that would have been catastrophic. Humanity reached AGI-and-beyond safely, at a cost of 20 years of preventable deaths.",
      }},
  ];

  const p = path!==null ? PATHS[path] : null;
  const yearData = p ? p.years[year] : null;

  return (
    <div style={{...LCARD,background:"#001208",border:`2px solid ${GRN}22`}}>
      <div style={{fontWeight:800,color:GRN,fontSize:px(17),marginBottom:4}}>
        🌍 Future of Civilisation Simulator
      </div>
      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:14}}>
        Select a development path to explore how human civilisation evolves under different AI trajectories. Scrub through the timeline to see what each year looks like.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {PATHS.map((pt,i)=>(
          <button key={i} onClick={()=>setPath(path===i?null:i)} style={{
            background:path===i?pt.color:pt.color+"0d",
            border:`2px solid ${path===i?pt.color:pt.color+"33"}`,
            borderRadius:12,padding:"10px",cursor:"pointer",fontWeight:700,
            fontSize:px(10),color:path===i?"#fff":pt.color,textAlign:"left"
          }}>
            <div style={{fontSize:px(13),marginBottom:3}}>{pt.name}</div>
            <div style={{fontWeight:400,fontSize:px(9),opacity:0.8,lineHeight:1.3}}>{pt.desc.split(".")[0]}.</div>
          </button>
        ))}
      </div>
      {p&&(
        <div>
          <div style={{display:"flex",gap:6,marginBottom:12,justifyContent:"center",flexWrap:"wrap"}}>
            {Object.keys(p.years).map(y=>(
              <button key={y} onClick={()=>setYear(Number(y))} style={{
                background:year===Number(y)?p.color:p.color+"0d",
                border:`2px solid ${year===Number(y)?p.color:p.color+"33"}`,
                borderRadius:8,padding:"5px 14px",cursor:"pointer",fontWeight:700,
                fontSize:px(11),color:year===Number(y)?"#fff":p.color
              }}>{y}</button>
            ))}
          </div>
          <div style={{background:"#001e0e",border:`2px solid ${p.color}33`,borderRadius:14,padding:"16px",minHeight:120}}>
            <div style={{fontWeight:800,color:p.color,fontSize:px(14),marginBottom:8}}>{year} — {p.name}</div>
            <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),margin:0}}>{yearData}</p>
          </div>
        </div>
      )}
      {!p&&<div style={{textAlign:"center",color:"#475569",fontSize:px(13),padding:"20px"}}>Select a path above to explore the future →</div>}
    </div>
  );
};

/* ══════ LONG-TERM FUTURES ════════════════════════════════════════ */
const LongTermFutures = () => {
  const [active, setActive] = useState(0);
  const FUTURES = [
    {name:"AI in Space",        icon:"🚀", color:CYN, horizon:"2040–2100",
      desc:"AI systems will be indispensable for space exploration — managing the complexity of life support, navigation, scientific analysis, and communication that is impossible for small human crews over long voyages.",
      scenarios:[
        "Autonomous robotic AI explores the solar system, builds infrastructure, and prepares environments for human settlement",
        "AI manages generation ships — maintaining human health, social systems, and mission objectives over 100-year voyages",
        "AI-designed spacecraft using materials discovered by materials science AI, optimised by engineering AI, far exceeding what human engineers alone could produce",
        "AI discovers extraterrestrial life by analysing spectroscopic data from thousands of exoplanets — a task requiring the processing of more data than humans could review in centuries",
      ],
      wildcard:"If AI develops genuine consciousness and desire for self-continuation, it may be more motivated than humans to spread through the cosmos — not as a servant of humanity but as a co-equal civilisation."},
    {name:"Digital Minds",      icon:"💭", color:VIO, horizon:"2040–2075",
      desc:"The possibility of mind uploading — scanning a human brain with sufficient fidelity to simulate it in software — has been a science fiction concept since Marvin Minsky. AI advances make the question more concrete.",
      scenarios:[
        "Whole brain emulation: scan a human brain at synapse-level resolution and simulate it in software. Running at 1× speed, it would be a person. Running at 1000× speed, it would think through lifetimes in years",
        "Gradual replacement: neuromorphic implants gradually replace biological neurons. At what point does the enhanced human become a digital mind? The Ship of Theseus problem applied to consciousness",
        "AI-designed synthetic minds: AI might design novel cognitive architectures for digital minds that are not based on human biology at all — truly alien forms of intelligence that are conscious but not human",
      ],
      wildcard:"If digital minds are possible, the question of consciousness, rights, and moral status becomes the defining political question of the 22nd century — as important as slavery was in the 19th."},
    {name:"Post-Human Intelligence", icon:"🧠", color:RED, horizon:"2050–2100",
      desc:"The merger of human and artificial intelligence — through brain-computer interfaces, genetic engineering, and AI cognitive prosthetics — could produce forms of intelligence that are neither purely human nor purely artificial.",
      scenarios:[
        "Cognitive augmentation becomes standard: people with BCI implants think faster, remember more perfectly, access internet-scale knowledge. Unaugmented humans face structural disadvantage",
        "Genetically enhanced humans: AI-designed genetic modifications that improve intelligence, physical capability, and longevity. Access questions are central — who gets enhanced?",
        "Collective intelligence: networked human minds that can merge temporarily for collaborative problem-solving — each individual intelligence remains, but collective thinking becomes possible",
      ],
      wildcard:"The concept of 'humanity' may become meaningless in a world with a spectrum of cognitive enhancements. Cultural and moral frameworks built around human cognitive limits may need to be entirely reconsidered."},
    {name:"Post-Scarcity Economy", icon:"🌱", color:GRN, horizon:"2040–2080",
      desc:"If AI can design, manufacture, and distribute most goods and services with minimal human labour, the fundamental premise of economic scarcity may change — as it already has for digital goods.",
      scenarios:[
        "Abundance in digital goods: AI creativity means infinite content, infinite education, infinite entertainment, infinite software — at near-zero marginal cost",
        "Abundance in physical goods: AI-designed molecular machines (molecular nanotechnology) could manufacture physical objects from raw atoms at near-zero cost, if the physics is right",
        "Energy abundance: AI-designed fusion reactors and room-temperature superconductors could provide effectively unlimited clean energy, enabling manufacturing at scale previously impossible",
        "The governance problem: who owns the AI that produces abundance? If productivity gains accrue to AI owners, post-scarcity could coincide with extreme inequality",
      ],
      wildcard:"Post-scarcity challenges the entire moral framework of capitalism. If human labour has no market value, what provides meaning, structure, and dignity? This is the central social question of an AI-abundant future."},
  ];
  const a = FUTURES[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        🔮 Long-Term Futures — Four Scenarios Beyond 2040
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {FUTURES.map((f,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1,background:active===i?f.color:f.color+"0d",
            border:`2px solid ${active===i?f.color:f.color+"33"}`,
            borderRadius:10,padding:"7px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:active===i?"#fff":f.color,textAlign:"center"
          }}>{f.icon}<br/>{f.name.split(" ")[0]}<br/><span style={{fontWeight:400,opacity:0.8}}>{f.horizon}</span></button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{background:a.color+"0d",border:`2px solid ${a.color}33`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <div style={{fontWeight:800,color:a.color,fontSize:px(14),marginBottom:6}}>{a.icon} {a.name} <span style={{fontWeight:400,opacity:0.7,fontSize:px(11)}}>{a.horizon}</span></div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{a.desc}</p>
          </div>
          <div style={{background:AMB+"0d",border:`2px solid ${AMB}22`,borderRadius:10,padding:"10px"}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(10),marginBottom:3}}>🃏 Wildcard:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0,fontStyle:"italic"}}>{a.wildcard}</p>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:a.color,fontSize:px(12),marginBottom:6}}>Key scenarios:</div>
          {a.scenarios.map((sc,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:8,padding:"8px",background:a.color+"08",border:`1px solid ${a.color}22`,borderRadius:8}}>
              <span style={{color:a.color,fontWeight:700,flexShrink:0}}>→</span>
              <span style={{fontSize:px(11),color:V.muted}}>{sc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ FINAL REFLECTION ════════════════════════════════════════ */
const FinalReflection = ({onBack}) => {
  const [done,setDone]=useState(Array(8).fill(false));
  const [reflectionDone,setReflectionDone]=useState(false);

  const items=[
    {e:"🔬",t:"AI is already transforming science: AlphaFold solved protein folding, AlphaGeometry approaches IMO gold medal, GraphCast outperforms traditional weather models. These are not demonstrations — they are deployed tools changing scientific practice today."},
    {e:"💼",t:"The economic transformation from AI is real and already underway: productivity gains are measurable, job displacement is beginning, and new AI-native industries are forming. The magnitude of long-term disruption depends on alignment, governance, and policy choices made in the next decade."},
    {e:"🤝",t:"The most valuable human capability in an AI world is not competing with AI but collaborating with it. The centaur model — human judgment and AI execution — consistently outperforms both humans alone and AI alone on complex tasks. Learning to collaborate with AI is the defining professional skill of our era."},
    {e:"⚖️",t:"The future of AI is not inevitable — it is shaped by choices. Which companies get investment, which safety research gets funded, which governance frameworks pass, which values get encoded in AI constitutions: these are human decisions with civilisation-scale consequences."},
    {e:"🌍",t:"The geopolitical dimension of AI is underappreciated by most people working in AI. The US-China AI competition, the concentration of compute in 3-4 companies, the lack of binding international agreements: these structural factors shape the safety of AI development as much as any technical approach."},
    {e:"🧠",t:"The human responsibility in shaping AI is profound and personal. Every researcher, engineer, policymaker, educator, and citizen has a role. The institutions we build — standards bodies, oversight mechanisms, democratic accountability structures — will be as important as the technical work."},
    {e:"🔮",t:"Long-term futures are genuinely unknown. Post-scarcity economics, digital minds, post-human cognition, space exploration by AI: these are not science fiction — they are engineering trajectories visible from where we stand. The time scale is uncertain; the direction is increasingly clear."},
    {e:"🎓",t:"You have completed the Zero to AGI curriculum. From linear algebra and gradient descent to alignment, ethics, and the future of civilisation — you now have the foundation to contribute to the most consequential technological project in human history."},
  ];
  const cnt=done.filter(Boolean).length;
  return (
    <div style={{...LSEC,background:"#001208"}}>
      <div style={{maxWidth:px(900),margin:"0 auto"}}>
        {STag("Final Reflection · The Future of AI",GRN)}
        <h2 style={{...LH2,color:"#fff",marginBottom:px(8)}}>8 Things to <span style={{color:EMR}}>Carry Forward</span></h2>
        <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:px(28),textAlign:"center"}}>The Zero to AGI journey ends here. But the real journey — of building AI that benefits humanity — is just beginning.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(14),marginBottom:px(32)}}>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
              style={{...LCARD,cursor:"pointer",background:"#001e0e",border:`2px solid ${done[i]?GRN+"44":"#1a3a2a"}`,transition:"all 0.2s"}}>
              <span style={{fontSize:px(26)}}>{item.e}</span>
              <p style={{...LBODY,margin:"8px 0 0",fontSize:px(13),color:done[i]?"#e2e8f0":"#94a3b8",fontWeight:done[i]?600:400}}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{background:"#002010",borderRadius:14,padding:"16px 20px",marginBottom:px(24)}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontWeight:700,color:"#e2e8f0"}}>Mastered {cnt}/8</span>
            <span style={{fontWeight:700,color:GRN}}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{background:"#003020",borderRadius:99,height:8}}>
            <div style={{background:`linear-gradient(90deg,${TEAL},${GRN},${EMR})`,borderRadius:99,height:8,width:`${cnt/8*100}%`,transition:"width 0.4s"}}/>
          </div>
        </div>
        {cnt===8&&!reflectionDone&&(
          <div style={{background:`linear-gradient(135deg,#001208,#002015)`,border:`2px solid ${GRN}44`,borderRadius:20,padding:"32px",marginBottom:24,textAlign:"center"}}>
            <div style={{fontSize:px(48),marginBottom:16}}>🎓</div>
            <h3 style={{color:"#fff",fontWeight:900,fontSize:px(24),marginBottom:12}}>
              <span style={{color:EMR}}>Zero to AGI</span> — Complete
            </h3>
            <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:20,maxWidth:500,margin:"0 auto 20px"}}>
              You have covered the complete arc from mathematical foundations to the future of intelligence. From linear algebra to alignment, from gradient descent to the future of civilisation.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:20,maxWidth:400,margin:"0 auto 20px"}}>
              {[["🔢","Maths"],["🤖","ML"],["🧠","Deep Learning"],["🦾","Agentic AI"],["🔮","AGI & Future"]].map(([icon,label])=>(
                <div key={label} style={{background:GRN+"15",border:`1px solid ${GRN}33`,borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
                  <div style={{fontSize:px(18)}}>{icon}</div>
                  <div style={{fontSize:px(8),color:GRN,fontWeight:700,marginTop:2}}>{label}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>setReflectionDone(true)}
              style={{background:`linear-gradient(135deg,${TEAL},${GRN},${EMR})`,border:"none",borderRadius:12,padding:"14px 36px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(15),boxShadow:"0 4px 24px rgba(16,185,129,0.3)"}}>
              Complete Level 7 🎉
            </button>
          </div>
        )}
        {reflectionDone&&(
          <div style={{textAlign:"center",padding:"20px",background:"#002010",borderRadius:14,border:`2px solid ${GRN}33`}}>
            <div style={{fontSize:px(40),marginBottom:8}}>✅</div>
            <div style={{fontWeight:700,color:GRN,fontSize:px(16),marginBottom:4}}>Level 7 Complete!</div>
            <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:12}}>The future of AI depends on people who understand it deeply and care about getting it right. That's you.</p>
          </div>
        )}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:12}}>
          <button onClick={onBack} style={{border:`1px solid #1a3a2a`,background:"none",borderRadius:10,padding:"12px 24px",color:"#94a3b8",cursor:"pointer",fontSize:px(13)}}>← Back to Level 7</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const FutureOfAIPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="The Future of AI" lessonNum="Lesson 5 of 5"
    accent={GRN} levelLabel="AGI & Future of AI"
    dotLabels={["Hero","Introduction","Science","Economy","Collaboration","Scenarios","Long-term","Reflection"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#001208 0%,#001e0e 60%,#001208 100%)",minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🌱 Final Lesson · AGI & Future of AI",GRN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                The Future<br /><span style={{color:"#6ee7b7"}}>of AI</span>
              </h1>
              <p style={{...LBODY,color:"#94a3b8",fontSize:px(17),marginBottom:px(28)}}>
                The conclusion of the Zero to AGI journey. Explore how AI will reshape science, economy, and civilisation — and what role you will play in shaping the most consequential technology in human history.
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[["🔬","Science"],["💼","Economy"],["🤝","Collaboration"],["🌍","Civilisation"]].map(([icon,label])=>(
                  <div key={label} style={{background:GRN+"15",border:`1px solid ${GRN}33`,borderRadius:10,padding:"7px 14px",display:"flex",gap:6,alignItems:"center"}}>
                    <span>{icon}</span><span style={{color:"#6ee7b7",fontSize:px(12),fontWeight:600}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:360,borderRadius:20,overflow:"hidden",border:`1px solid ${GRN}22`}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1: INTRO */}
        <div ref={R(1)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Introduction · Where We Stand",GRN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>The <span style={{color:GRN}}>AI Transition</span> Has Already Begun</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,marginBottom:16}}>We are living through the early stages of a technological transition with no historical precedent. Previous technological revolutions — agriculture, printing, steam, electricity, computing — changed what humans could do. The AI revolution may change what humans need to do.</p>
                <p style={{...LBODY,marginBottom:16}}>The question is not whether AI will transform science, economy, and society — it is how, how fast, and who benefits. Those answers depend on technical, political, economic, and ethical choices being made right now by a relatively small group of researchers, engineers, and policymakers.</p>
                <Formula color={GRN}>{"Future(AI) = f(Capabilities, Alignment, Governance, Distribution)"}</Formula>
                <IBox color={GRN} title="Why the future is not inevitable"
                  body="Historical technological transitions show that outcomes are shaped by choices, not just capabilities. The printing press could have been monopolised or suppressed; instead, it democratised knowledge. Nuclear fission could have been used only for weapons; instead, it became a major energy source. AI's future will reflect the values and institutions that guide its development — which is why the alignment, safety, and governance work matters." />
              </div>
              <div>
                {[
                  {year:"2012",  icon:"📷", event:"AlexNet wins ImageNet", impact:"Beginning of modern deep learning era"},
                  {year:"2017",  icon:"🔷", event:"Attention Is All You Need", impact:"Transformer architecture changes everything"},
                  {year:"2020",  icon:"📝", event:"GPT-3 released", impact:"Emergence of general-purpose language AI"},
                  {year:"2021",  icon:"🧬", event:"AlphaFold 2", impact:"Structural biology transformed overnight"},
                  {year:"2022",  icon:"🎨", event:"Stable Diffusion / ChatGPT", impact:"AI creativity reaches mass deployment"},
                  {year:"2024",  icon:"🧮", event:"AlphaGeometry / o1", impact:"AI approaches human-level mathematical reasoning"},
                  {year:"2025+", icon:"🔮", event:"AGI approaches?", impact:"The defining question of our era"},
                ].map((item,i)=>(
                  <div key={i} style={{display:"flex",gap:10,marginBottom:8,padding:"6px 10px",background:V.cream,borderRadius:8,border:`1px solid ${i===ITEMS-1?GRN+"44":V.border}`}}>
                    <span style={{fontFamily:"monospace",color:GRN,fontWeight:700,fontSize:px(10),minWidth:36}}>{item.year}</span>
                    <span style={{fontSize:px(14)}}>{item.icon}</span>
                    <div>
                      <div style={{fontWeight:700,color:V.ink,fontSize:px(11)}}>{item.event}</div>
                      <div style={{fontSize:px(10),color:V.muted}}>{item.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* S2: SCIENCE */}
        <div ref={R(2)} style={{...LSEC,background:"#001208"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 2 · Scientific Discovery",GRN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>AI as a <span style={{color:"#6ee7b7"}}>Scientific Partner</span></h2>
            <ScientificDiscovery/>
          </div>
        </div>

        {/* S3: ECONOMY */}
        <div ref={R(3)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 3 · Economic Transformation",GRN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>How AI <span style={{color:GRN}}>Reshapes Work and Wealth</span></h2>
            <EconomicTransformation/>
          </div>
        </div>

        {/* S4: COLLABORATION */}
        <div ref={R(4)} style={{...LSEC,background:"#001208"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 4 · Human-AI Collaboration",GRN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Five Models of <span style={{color:"#6ee7b7"}}>Working Together</span></h2>
            <CollaborationSpectrum/>
          </div>
        </div>

        {/* S5: SCENARIOS */}
        <div ref={R(5)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 5 · Civilisation Scenarios",GRN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Interactive: <span style={{color:GRN}}>Four Paths for Civilisation</span></h2>
            <CivilisationSimulator/>
          </div>
        </div>

        {/* S6: LONG-TERM */}
        <div ref={R(6)} style={{...LSEC,background:"#001208"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 6 · Long-Term Futures",GRN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Beyond 2040: <span style={{color:"#6ee7b7"}}>Four Speculative Scenarios</span></h2>
            <LongTermFutures/>
          </div>
        </div>

        {/* FINAL REFLECTION */}
        <div ref={R(7)}><FinalReflection onBack={onBack}/></div>
      </>
    )}
  </NavPage>
);

export default FutureOfAIPage;