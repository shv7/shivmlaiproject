import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — DECISION TREES
   Level 3 · Machine Learning · Lesson 4 of 7
   Accent: Emerald #059669
══════════════════════════════════════════════════════════════════ */
const GRN  = "#059669";
const AMB  = "#f59e0b";
const VIO  = "#7c3aed";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const RED  = "#ef4444";
const SKY  = "#0284c7";
const INK  = "#1e293b";

const Formula = ({children,color=GRN}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=TEAL}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("//")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — animated decision tree building ══════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const nodes=[
      {x:0.5,y:0.12,label:"Income > 50k?",color:GRN,r:42,depth:0},
      {x:0.22,y:0.38,label:"Credit > 700?",color:AMB,r:36,depth:1},
      {x:0.78,y:0.38,label:"Debt < 30%?",color:AMB,r:36,depth:1},
      {x:0.10,y:0.65,label:"✗ Reject",color:RED,r:30,depth:2},
      {x:0.34,y:0.65,label:"✓ Approve",color:GRN,r:30,depth:2},
      {x:0.66,y:0.65,label:"✓ Approve",color:GRN,r:30,depth:2},
      {x:0.90,y:0.65,label:"✗ Reject",color:RED,r:30,depth:2},
    ];
    const edges=[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
    const edgeLabels=["Yes","No","No","Yes","Yes","No"];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#08120a"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(5,150,105,0.07)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const progress=Math.min(1,t*0.6);
      // edges
      edges.forEach(([pi,ci],idx)=>{
        const p=nodes[pi], ch=nodes[ci];
        const ep=Math.min(1,(progress-ch.depth*0.25)/0.25);
        if(ep<=0)return;
        const x1=p.x*W,y1=p.y*H,x2=ch.x*W,y2=ch.y*H;
        ctx.beginPath();ctx.moveTo(x1,y1+p.r*0.7);
        ctx.lineTo(x1+(x2-x1)*ep,y1+(y2-y1-ch.r*0.7)*ep+ch.r*0.7*ep);
        ctx.strokeStyle=GRN+"88"; ctx.lineWidth=2; ctx.stroke();
        if(ep>0.8){
          const mx=(x1+x2)/2, my=(y1+y2)/2-8;
          ctx.font="bold 11px sans-serif"; ctx.fillStyle=AMB+"cc";
          ctx.textAlign="center"; ctx.fillText(edgeLabels[idx],mx,my);
        }
      });
      // nodes
      nodes.forEach(n=>{
        const ep=Math.min(1,(progress-n.depth*0.25)/0.3);
        if(ep<=0)return;
        const cx=n.x*W, cy=n.y*H, r=n.r*ep;
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2);
        g.addColorStop(0,n.color+"33"); g.addColorStop(1,n.color+"00");
        ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.fillStyle="#1a2e1c"; ctx.fill();
        ctx.strokeStyle=n.color; ctx.lineWidth=2; ctx.stroke();
        ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle=n.color;
        ctx.textAlign="center"; ctx.fillText(n.label,cx,cy+4);
      });
      t+=0.005; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ TREE VISUALIZER — interactive entropy/IG demo ══════════ */
const EntropyViz = () => {
  const [p, setP] = useState(0.5);
  const entropy = p===0||p===1 ? 0 : -(p*Math.log2(p)+(1-p)*Math.log2(1-p));
  const canvasRef = useRef();

  const redraw = useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    const pad=36;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f8fff9"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#e0f0e8"; ctx.lineWidth=1;
    for(let x=0;x<=10;x++){const cx=pad+(x/10)*(W-2*pad);ctx.beginPath();ctx.moveTo(cx,pad/2);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let y=0;y<=10;y++){const cy=pad/2+(y/10)*(H-pad*1.5);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.strokeStyle="#334155"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="10px monospace"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
    [0,0.25,0.5,0.75,1].forEach(v=>{const cx=pad+v*(W-2*pad);ctx.fillText(v.toFixed(2),cx,H-pad+13);});
    ctx.textAlign="right";
    [0,0.5,1].forEach(v=>{const cy=(H-pad)-(v)*(H-pad*1.5);ctx.fillText(v.toFixed(1),pad-4,cy+4);});
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#64748b"; ctx.textAlign="center";
    ctx.fillText("P(positive class)",W/2,H-4);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);
    ctx.fillText("Entropy (bits)",0,0);ctx.restore();
    // entropy curve
    ctx.beginPath();
    for(let pv=0.001;pv<1;pv+=0.005){
      const H2=-(pv*Math.log2(pv)+(1-pv)*Math.log2(1-pv));
      const cx=pad+pv*(W-2*pad), cy=(H-pad)-H2*(H-pad*1.5);
      pv<0.01?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
    }
    ctx.strokeStyle=GRN; ctx.lineWidth=2.5;
    ctx.shadowColor=GRN; ctx.shadowBlur=8; ctx.stroke(); ctx.shadowBlur=0;
    // current point
    const cx2=pad+p*(W-2*pad), cy2=(H-pad)-entropy*(H-pad*1.5);
    ctx.beginPath();ctx.moveTo(cx2,H-pad);ctx.lineTo(cx2,cy2);
    ctx.strokeStyle=AMB+"88"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(pad,cy2);ctx.lineTo(cx2,cy2);
    ctx.strokeStyle=ROSE+"88"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    const gg=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,16);
    gg.addColorStop(0,GRN+"88"); gg.addColorStop(1,GRN+"00");
    ctx.beginPath();ctx.arc(cx2,cy2,16,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
    ctx.beginPath();ctx.arc(cx2,cy2,7,0,Math.PI*2);ctx.fillStyle=GRN;ctx.fill();
    ctx.beginPath();ctx.arc(cx2,cy2,7,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
    ctx.font="bold 11px monospace"; ctx.fillStyle=GRN; ctx.textAlign=p>0.5?"right":"left";
    ctx.fillText(`H=${entropy.toFixed(3)}`,cx2+(p>0.5?-12:12),cy2-12);
  },[p,entropy]);

  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        📊 Entropy Visualizer — H(p) = −p·log₂(p) − (1−p)·log₂(1−p)
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Drag the slider to change the proportion of positive examples.
        Entropy peaks at 0.5 (maximum uncertainty) and hits 0 at pure splits (all one class).
        Decision trees always split to <strong>minimise entropy</strong>.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
            border:`1px solid ${GRN}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:V.muted}}>P(positive)</span>
              <span style={{fontFamily:"monospace",fontWeight:800,color:GRN}}>{p.toFixed(2)}</span>
            </div>
            <input type="range" min={0.01} max={0.99} step={0.01} value={p}
              onChange={e=>setP(+e.target.value)} style={{width:"100%",accentColor:GRN}}/>
          </div>
          <div style={{background:"#0d1117",borderRadius:12,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),lineHeight:2.2}}>
              <div style={{color:"#475569"}}># Entropy calculation:</div>
              <div style={{color:"#94a3b8"}}>P(+) = {p.toFixed(2)}</div>
              <div style={{color:"#94a3b8"}}>P(−) = {(1-p).toFixed(2)}</div>
              <div>H = <span style={{color:GRN,fontWeight:700}}>{entropy.toFixed(4)}</span> bits</div>
              <div style={{color:entropy<0.3?GRN:entropy>0.95?RED:AMB,fontWeight:700}}>
                {entropy<0.1?"✅ Pure node!":entropy<0.5?"✓ Fairly pure":"⚠️ High impurity"}
              </div>
            </div>
          </div>
          {[[0.0,"Pure (all negative)",GRN],[0.5,"Maximum uncertainty",RED],[1.0,"Pure (all positive)",GRN],
            [0.3,"30% positive — lower entropy",AMB],[0.8,"80% positive — fairly pure",TEAL]
          ].map(([v,lbl,col])=>(
            <button key={v} onClick={()=>setP(v===0?0.01:v===1?0.99:v)}
              style={{background:col+"0d",border:`1px solid ${col}33`,borderRadius:8,
                padding:"7px 12px",cursor:"pointer",textAlign:"left",
                fontSize:px(11),color:col,fontWeight:600}}>
              p={v.toFixed(1)} — {lbl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ TREE DIAGRAM — interactive visual tree structure ═══════ */
const TreeDiagram = () => {
  const [active,setActive] = useState(null);
  const nodes = [
    {id:0,label:"Root Node",sub:"Income > 50k?",x:50,y:6,c:GRN,
      info:"The first split. Chosen because it has the highest Information Gain — it reduces entropy the most across the entire training dataset.",
      type:"Root Node"},
    {id:1,label:"Internal Node",sub:"Credit > 700?",x:22,y:36,c:AMB,
      info:"An intermediate split. Only reached when Income ≤ 50k. Further partitions data using the next most informative feature.",
      type:"Internal Node"},
    {id:2,label:"Internal Node",sub:"Debt < 30%?",x:78,y:36,c:AMB,
      info:"An intermediate split. Only reached when Income > 50k. Checks the debt-to-income ratio for this sub-group.",
      type:"Internal Node"},
    {id:3,label:"Leaf Node",sub:"✗ Reject",x:10,y:66,c:RED,
      info:"A terminal node — no more splits. Low income + bad credit → Reject. This leaf contains mostly rejected samples from training.",
      type:"Leaf Node (Reject)"},
    {id:4,label:"Leaf Node",sub:"✓ Approve",x:34,y:66,c:GRN,
      info:"Terminal node. Low income but good credit score → Approve. The model learned that credit score can compensate for lower income.",
      type:"Leaf Node (Approve)"},
    {id:5,label:"Leaf Node",sub:"✓ Approve",x:66,y:66,c:GRN,
      info:"Terminal node. High income + manageable debt → Approve. The ideal loan candidate.",
      type:"Leaf Node (Approve)"},
    {id:6,label:"Leaf Node",sub:"✗ Reject",x:90,y:66,c:RED,
      info:"Terminal node. High income but excessive debt burden → Reject. Even high earners can be over-leveraged.",
      type:"Leaf Node (Reject)"},
  ];
  const edges=[[0,1,"No"],[0,2,"Yes"],[1,3,"No"],[1,4,"Yes"],[2,5,"Yes"],[2,6,"No"]];

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        🌳 Interactive Tree Diagram — click any node to learn what it does
      </div>
      <div style={{position:"relative",width:"100%",height:240,marginBottom:16}}>
        <svg width="100%" height="100%" style={{position:"absolute",top:0,left:0}}>
          {edges.map(([pi,ci,lbl])=>{
            const p=nodes[pi],ch=nodes[ci];
            const x1=`${p.x}%`,y1=`${p.y+7}%`,x2=`${ch.x}%`,y2=`${ch.y-7}%`;
            const mx=`${(p.x+ch.x)/2}%`,my=`${(p.y+ch.y)/2}%`;
            return (
              <g key={`${pi}-${ci}`}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRN+"88"} strokeWidth="2"/>
                <text x={mx} y={my} fill={AMB+"cc"} fontSize="11" textAnchor="middle" fontWeight="700">{lbl}</text>
              </g>
            );
          })}
        </svg>
        {nodes.map(n=>(
          <div key={n.id} onClick={()=>setActive(active===n.id?null:n.id)}
            style={{position:"absolute",left:`${n.x}%`,top:`${n.y}%`,
              transform:"translate(-50%,-50%)",
              background:active===n.id?n.c:"#fff",
              border:`2px solid ${n.c}`,borderRadius:12,
              padding:"6px 10px",cursor:"pointer",textAlign:"center",
              minWidth:80,transition:"all 0.2s",zIndex:1,
              boxShadow:active===n.id?`0 0 16px ${n.c}66`:"none"}}>
            <div style={{fontWeight:700,fontSize:px(9),color:active===n.id?"#fff":n.c}}>{n.type.split(" ")[0]}</div>
            <div style={{fontWeight:800,fontSize:px(11),color:active===n.id?"#fff":V.ink}}>{n.sub}</div>
          </div>
        ))}
      </div>
      {active!==null&&(
        <div style={{background:nodes[active].c+"0d",border:`1px solid ${nodes[active].c}44`,
          borderRadius:12,padding:"14px 18px"}}>
          <div style={{fontWeight:800,color:nodes[active].c,fontSize:px(14),marginBottom:6}}>
            {nodes[active].type} — "{nodes[active].sub}"
          </div>
          <p style={{...LBODY,fontSize:px(14),margin:0}}>{nodes[active].info}</p>
        </div>
      )}
    </div>
  );
};

/* ══════ GAME — "BUILD THE TREE" entropy game ═══════════════════ */
const BuildTreeGame = () => {
  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState([]);
  const [scored, setScored] = useState(false);

  const STEPS = [
    {
      question:"You have 10 loan applications: 5 approved, 5 rejected. Which feature gives the BEST first split?",
      data:"10 samples: 5✓ 5✗ | Current entropy = 1.0 bits",
      options:[
        {f:"Income > 50k",ig:0.40,e_after:0.72,reason:"Splits into [3✓,1✗] and [2✓,4✗]. Good separation!"},
        {f:"Has savings account",ig:0.12,e_after:0.94,reason:"Almost no separation — savings weakly predicts approval."},
        {f:"Age > 35",ig:0.06,e_after:0.98,reason:"Age barely matters here — near-random split."},
        {f:"First name starts with A",ig:0.00,e_after:1.00,reason:"Completely useless feature — no predictive power."},
      ]
    },
    {
      question:"Left branch (Income ≤ 50k): 3 approved, 4 rejected. Best next split?",
      data:"7 samples: 3✓ 4✗ | Entropy = 0.985 bits",
      options:[
        {f:"Credit score > 700",ig:0.59,e_after:0.52,reason:"Perfectly separates! [0✓,4✗] and [3✓,0✗]. Best possible split."},
        {f:"Loan amount < 10k",ig:0.18,e_after:0.81,reason:"Some signal but far from pure leaves."},
        {f:"Age > 40",ig:0.09,e_after:0.90,reason:"Weak feature for this subgroup."},
        {f:"Owns a car",ig:0.02,e_after:0.97,reason:"Near-random — no useful information here."},
      ]
    },
  ];

  const s = STEPS[step];
  const best = s.options.reduce((a,b)=>a.ig>b.ig?a:b);

  const pick=(opt)=>{
    setChoices(c=>[...c,{step,opt}]);
    setScored(true);
  };
  const next=()=>{
    if(step<STEPS.length-1){setStep(s=>s+1);setScored(false);}
  };
  const reset=()=>{setStep(0);setChoices([]);setScored(false);};
  const lastChoice = choices.find(c=>c.step===step);

  return (
    <div style={{...LCARD,background:"#f0fdf4",border:`2px solid ${GRN}33`}}>
      <div style={{fontWeight:800,color:GRN,fontSize:px(17),marginBottom:4}}>🎮 Build the Tree</div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Choose the best feature to split at each step. The best split
        gives the highest <strong>Information Gain</strong> (biggest entropy reduction).
        Score: {choices.filter(c=>c.opt.ig===STEPS[c.step].options.reduce((a,b)=>a.ig>b.ig?a:b).ig).length}/{choices.length||"-"} optimal choices
      </p>
      <div style={{background:"#0d1117",borderRadius:10,padding:"12px 16px",
        marginBottom:16,fontFamily:"monospace",fontSize:px(13),color:AMB}}>
        📊 {s.data}
      </div>
      <p style={{...LBODY,fontWeight:700,color:V.ink,marginBottom:16,fontSize:px(14)}}>{s.question}</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        {s.options.map((opt,i)=>{
          const picked = lastChoice?.opt===opt;
          const isOptimal = opt===best;
          const showResult = scored && picked;
          return (
            <button key={i} onClick={()=>!scored&&pick(opt)}
              style={{background:showResult?(isOptimal?GRN+"22":RED+"22"):opt===lastChoice?.opt?"#f8f9fa":"#fff",
                border:`2px solid ${showResult?(isOptimal?GRN:RED):scored&&isOptimal?GRN:V.border}`,
                borderRadius:12,padding:"12px 16px",cursor:scored?"default":"pointer",
                textAlign:"left",transition:"all 0.2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontWeight:700,color:V.ink,fontSize:px(13)}}>{opt.f}</span>
                {scored&&(
                  <span style={{fontFamily:"monospace",fontWeight:700,
                    color:isOptimal?GRN:V.muted,fontSize:px(12)}}>
                    IG = {opt.ig.toFixed(2)} {isOptimal?"⭐":""}
                  </span>
                )}
              </div>
              {showResult&&(
                <p style={{...LBODY,fontSize:px(12),margin:"6px 0 0",color:isOptimal?GRN:ROSE}}>
                  {isOptimal?"✅":"❌"} {opt.reason}
                </p>
              )}
            </button>
          );
        })}
      </div>
      {scored&&step<STEPS.length-1&&(
        <button onClick={next}
          style={{background:GRN,border:"none",borderRadius:10,padding:"10px 24px",
            color:"#fff",fontWeight:800,cursor:"pointer",fontSize:px(13)}}>
          Next Split →
        </button>
      )}
      {scored&&step===STEPS.length-1&&(
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{background:GRN+"0d",border:`1px solid ${GRN}44`,borderRadius:10,
            padding:"10px 16px",fontWeight:700,color:GRN,fontSize:px(13)}}>
            🌳 Tree complete! Score: {choices.filter(c=>c.opt.ig===STEPS[c.step].options.reduce((a,b)=>a.ig>b.ig?a:b).ig).length+
            (lastChoice?.opt===best?1:0)}/{STEPS.length}
          </div>
          <button onClick={reset}
            style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
              padding:"10px 20px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>↺ Try again</button>
        </div>
      )}
    </div>
  );
};

/* ══════ LOAN APPROVAL PROJECT ══════════════════════════════════ */
const LoanProject = () => {
  const [income,setIncome]=useState(55000);
  const [credit,setCredit]=useState(680);
  const [debt,setDebt]=useState(25);
  const [loan,setLoan]=useState(15000);

  // Simple decision tree logic
  const decide=()=>{
    if(income>70000){return debt<35?{r:"✅ APPROVED",p:92,c:GRN}:{r:"❌ REJECTED",p:15,c:RED};}
    if(income>50000&&credit>700){return {r:"✅ APPROVED",p:84,c:GRN};}
    if(income>50000&&debt<20){return {r:"✅ APPROVED",p:76,c:GRN};}
    if(credit>750&&debt<30){return {r:"✅ APPROVED",p:71,c:GRN};}
    if(credit>700){return {r:"✅ APPROVED",p:58,c:AMB};}
    if(credit>650&&income>45000){return {r:"⚠️ REVIEW",p:45,c:AMB};}
    return {r:"❌ REJECTED",p:12,c:RED};
  };
  const result=decide();

  return (
    <div style={{...LCARD,background:"#f0fdf4",border:`2px solid ${GRN}22`}}>
      <div style={{fontWeight:700,color:GRN,marginBottom:8,fontSize:px(15)}}>
        🏦 Mini Project — Loan Approval Decision Tree
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A pre-trained decision tree classifier. Adjust applicant features and watch
        the tree traverse its nodes to make a real-time approval decision.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:12,letterSpacing:"1px"}}>
            APPLICANT FEATURES
          </div>
          {[
            {l:"Annual Income ($)",v:income,s:setIncome,min:20000,max:120000,step:1000,c:GRN,
              fmt:v=>`$${v.toLocaleString()}`},
            {l:"Credit Score",v:credit,s:setCredit,min:500,max:850,step:5,c:AMB,
              fmt:v=>v},
            {l:"Debt-to-Income Ratio (%)",v:debt,s:setDebt,min:5,max:60,step:1,c:ROSE,
              fmt:v=>`${v}%`},
            {l:"Loan Amount ($)",v:loan,s:setLoan,min:5000,max:100000,step:1000,c:VIO,
              fmt:v=>`$${v.toLocaleString()}`},
          ].map(({l,v,s,min,max,step,c,fmt})=>(
            <div key={l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(12),color:V.muted}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{fmt(v)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v}
                onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
            </div>
          ))}
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",fontFamily:"monospace",fontSize:px(12),color:"#94a3b8",lineHeight:1.9}}>
            <div style={{color:"#475569",marginBottom:4}}># Decision tree traversal:</div>
            <div>Income > 70k? {income>70000?"→ Yes":"→ No"}</div>
            {income>70000&&<div style={{paddingLeft:16}}>Debt {"<"} 35%? {debt<35?"→ Yes (Approve)":"→ No (Reject)"}</div>}
            {income<=70000&&income>50000&&<div>Income > 50k? → Yes</div>}
            {income<=70000&&income>50000&&<div style={{paddingLeft:16}}>Credit > 700? {credit>700?"→ Yes (Approve)":"→ No"}</div>}
            {income<=50000&&<div>Credit > 700? {credit>700?"→ Yes":"→ No"}</div>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:result.c==="❌ REJECTED"?"#1a0008":result.c===AMB?"#1a1400":"#001a0e",
            border:`3px solid ${result.c}`,borderRadius:20,padding:"32px",textAlign:"center",flex:1}}>
            <div style={{fontSize:px(52),marginBottom:10}}>
              {result.r.startsWith("✅")?"🎉":result.r.startsWith("⚠️")?"🔍":"💳"}
            </div>
            <div style={{fontWeight:900,fontSize:px(24),color:result.c,marginBottom:8}}>
              {result.r}
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(18),color:result.c,marginBottom:8}}>
              {result.p}% confidence
            </div>
            <div style={{background:result.c+"22",borderRadius:8,padding:"6px 16px",
              fontSize:px(12),color:result.c}}>
              Decision Tree depth 3
            </div>
          </div>
          <div style={{...LCARD,padding:"14px"}}>
            <div style={{fontWeight:700,color:GRN,fontSize:px(12),marginBottom:8}}>MODEL STATS</div>
            {[["Algorithm","CART Decision Tree",GRN],["Max Depth","4 levels",AMB],
              ["Training Accuracy","94.2%",TEAL],["Features used","4",VIO]
            ].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:px(11),color:V.muted}}>{k}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(11)}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═══════════════════════════════════════════ */
const DTTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🌳",c:GRN, t:"Decision trees split data using a tree structure: root → internal nodes → leaf nodes. Each internal node tests one feature; each leaf predicts a class."},
    {e:"📐",c:AMB, t:"Entropy H = −Σ p(x)log₂p(x) measures node impurity. Ranges 0 (pure) to 1 (50/50). Trees always split to reduce entropy."},
    {e:"📊",c:TEAL,t:"Information Gain = entropy(parent) − weighted entropy(children). The feature with highest IG is chosen as the split at each node."},
    {e:"🌿",c:GRN, t:"Gini impurity (alternative to entropy): Gini = 1 − Σ pᵢ². Slightly cheaper to compute; both work well in practice."},
    {e:"⚠️",c:ROSE,t:"Decision trees easily overfit — deep trees memorise training data. Fix with max_depth, min_samples_split, or post-training pruning."},
    {e:"👁️",c:VIO, t:"Decision trees are the most interpretable ML model. You can print the exact rules: 'if income>50k AND credit>700 → APPROVE'. Perfect for regulated industries."},
    {e:"🔢",c:SKY, t:"Feature importance: after training, each feature gets a score based on how much it reduced impurity across all splits. Use model.feature_importances_."},
    {e:"🌍",c:GRN, t:"Used in: medical diagnosis (rule-based), credit scoring, customer churn, fraud detection. Foundation of Random Forests and Gradient Boosting (XGBoost, LightGBM)."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",GRN)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:GRN}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c+"08":V.card,transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
              border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",
              color:"#fff",fontSize:px(13)}}>{done[i]?"✓":""}</div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,
              color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(56),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>
          {cnt}/8 concepts mastered
        </div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${GRN},${TEAL})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:GRN,border:"none",borderRadius:10,
            padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Random Forests →
          </button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",
            borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
            ← Back to Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════ */
const DecisionTreesPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Decision Trees" lessonNum="Lesson 4 of 7"
    accent={GRN} levelLabel="Machine Learning"
    dotLabels={["Hero","Intuition","Definition","Structure","Entropy","Overfitting","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#020f05 0%,#0a2410 60%,#060f08 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🌳 Lesson 4 of 7 · Machine Learning",GRN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Decision<br/><span style={{color:"#6ee7b7"}}>Trees</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:GRN,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The most interpretable machine learning algorithm in existence. A series of
                yes/no questions that a computer learns automatically from data. Every bank
                loan, every medical triage, every fraud alert — all can be explained as a
                decision tree traversal.
              </p>
              <div style={{background:"rgba(5,150,105,0.12)",border:"1px solid rgba(5,150,105,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#6ee7b7",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Build a tree of questions: each internal node asks "is feature X greater than threshold T?"
                  Navigate yes/no branches until you reach a leaf — your prediction. The tree learns
                  which questions and thresholds minimise prediction error.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(5,150,105,0.06)",
              border:"1px solid rgba(5,150,105,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — INTUITION ───────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Intuitive Explanation",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Like a Game of <span style={{color:GRN}}>20 Questions</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  A decision tree makes predictions by asking a series of yes/no questions about
                  the input features. Each question narrows the possibilities until you reach a
                  definitive answer. You already use this logic daily — you just don't call it ML.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  The key insight is that the <strong>machine learns which questions to ask</strong>
                  and in which order — from the training data. It finds the questions that
                  most effectively separate the classes.
                </p>
                <IBox color={GRN} title="The Loan Approval Example"
                  body="A bank has 10,000 historical loan decisions. The model analyses all features (income, credit score, debt ratio, employment) and learns: 'Income > 50k?' is the most powerful first question because it correctly separates approvals and rejections better than any other single feature. Then it learns the best second question for each branch, and so on."/>
              </div>
              <div style={{...LCARD,background:"#f0fdf4",border:`2px solid ${GRN}33`}}>
                <div style={{fontWeight:700,color:GRN,marginBottom:16,fontSize:px(14)}}>
                  🏦 Loan Approval Decision Logic
                </div>
                {[
                  {q:"Income > $50,000?",yes:"→ Check debt ratio",no:"→ Check credit score",c:GRN},
                  {q:"Debt ratio < 30%?",yes:"→ ✅ APPROVE",no:"→ ❌ REJECT",c:AMB},
                  {q:"Credit score > 700?",yes:"→ ✅ APPROVE",no:"→ ❌ REJECT",c:TEAL},
                ].map(row=>(
                  <div key={row.q} style={{background:"#fff",border:`1px solid ${row.c}33`,
                    borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                    <div style={{fontWeight:700,color:row.c,fontSize:px(13),marginBottom:6}}>
                      ❓ {row.q}
                    </div>
                    <div style={{display:"flex",gap:10}}>
                      <span style={{background:GRN+"0d",border:`1px solid ${GRN}44`,borderRadius:6,
                        padding:"4px 10px",fontSize:px(12),color:GRN}}>Yes {row.yes}</span>
                      <span style={{background:RED+"0d",border:`1px solid ${RED}44`,borderRadius:6,
                        padding:"4px 10px",fontSize:px(12),color:RED}}>No {row.no}</span>
                    </div>
                  </div>
                ))}
                <p style={{...LBODY,fontSize:px(12),margin:"10px 0 0",color:V.muted}}>
                  The machine learns these rules automatically from historical approvals/rejections.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — FORMAL DEFINITION ───────────────────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Formal Definition","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Mathematical <span style={{color:"#6ee7b7"}}>Framework</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  A decision tree is a function f: ℝⁿ → 𝒴 defined by a rooted binary tree T
                  where each internal node partitions the feature space with a threshold rule,
                  and each leaf assigns a class label or value.
                </p>
                <Formula color="#6ee7b7">f(x) = Σₗ yₗ · 𝟙[x ∈ Rₗ]</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  Each region Rₗ is defined by the conjunction of all split conditions on the
                  path from root to leaf l. The prediction for x is the value yₗ associated
                  with the leaf region that contains x.
                </p>
                <IBox color="#6ee7b7" title="CART — Classification and Regression Trees"
                  body="The most common algorithm (used by Scikit-learn) is CART. For classification: minimise Gini impurity at each split. For regression: minimise MSE. CART always makes binary splits (exactly two children per node) and grows the tree greedily — optimal local split at each step, not globally optimal."/>
              </div>
              <div>
                {[
                  {s:"Binary split",c:"#6ee7b7",
                    d:"At each node: 'xⱼ ≤ t?' splits data into two subsets. Scikit-learn uses binary splits exclusively (CART). Left child: xⱼ ≤ t. Right child: xⱼ > t."},
                  {s:"Greedy search",c:AMB,
                    d:"At each node, try all features and all threshold values. Pick the (feature, threshold) pair that maximises information gain. No backtracking — greedy but fast."},
                  {s:"Recursive partitioning",c:TEAL,
                    d:"After a split, recursively apply the same procedure to each child node. Stop when: max_depth reached, node is pure, or min_samples_split not met."},
                  {s:"Leaf prediction",c:ROSE,
                    d:"Classification: majority class in leaf. Regression: mean of target values in leaf. The model literally stores training data statistics in leaves."},
                  {s:"O(n·d·log n)",c:VIO,
                    d:"Training complexity: n samples, d features. Sorting each feature takes O(n log n). Checking all d features at each of O(n) possible split points."},
                ].map(item=>(
                  <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",gap:12}}>
                    <div style={{fontFamily:"monospace",fontSize:px(12),fontWeight:800,
                      color:item.c,minWidth:90,paddingTop:2}}>{item.s}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S3 — TREE STRUCTURE ──────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Tree Structure",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Anatomy of a <span style={{color:GRN}}>Decision Tree</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(24)}}>
              Click each node in the diagram to understand its role. Every prediction
              follows a unique path from root to leaf.
            </p>
            <TreeDiagram/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:px(16),marginTop:px(20)}}>
              {[
                {t:"Root Node",e:"🌱",c:GRN,d:"The very first split. Chosen to give the highest overall information gain. Only one per tree."},
                {t:"Internal Node",e:"🔀",c:AMB,d:"Any non-leaf split. Tests one feature against a threshold. Can have 2 children (CART)."},
                {t:"Leaf Node",e:"🍃",c:TEAL,d:"Terminal — no more splits. Holds the class label (classification) or mean value (regression)."},
                {t:"Branch",e:"➡️",c:VIO,d:"The edge connecting parent to child. Labelled 'Yes/No' or 'True/False' for the split condition."},
              ].map(item=>(
                <div key={item.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${item.c}`}}>
                  <div style={{fontSize:px(32),marginBottom:8}}>{item.e}</div>
                  <div style={{fontWeight:800,color:item.c,fontSize:px(13),marginBottom:6}}>{item.t}</div>
                  <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S4 — ENTROPY & IG ────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Splitting Criteria","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Entropy &amp; <span style={{color:"#6ee7b7"}}>Information Gain</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(24)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  Before the tree can split, it needs to measure how "impure" or "mixed" a
                  node is. Entropy (borrowed from information theory) quantifies this:
                </p>
                <Formula color="#6ee7b7">H = − Σ p(x) · log₂ p(x)</Formula>
                <Formula color={AMB}>IG = H(parent) − Σ wᵢ · H(childᵢ)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  H=0: pure node (all one class). H=1: maximally impure (50/50 binary).
                  Information Gain = how much entropy dropped after the split. Higher IG = better split.
                </p>
                <div style={{background:"#1e1b4b",borderRadius:12,padding:"16px"}}>
                  <div style={{fontWeight:700,color:"#6ee7b7",marginBottom:10,fontSize:px(13)}}>
                    📋 Worked Example
                  </div>
                  {[
                    {l:"Parent node",d:"5 approved, 5 rejected → H = 1.0 bit",c:"#6ee7b7"},
                    {l:"Split on Income>50k",d:"Left: [4✗,1✓] → H=0.72 | Right: [4✓,1✗] → H=0.72",c:AMB},
                    {l:"Weighted avg",d:"(5/10)×0.72 + (5/10)×0.72 = 0.72 bits",c:TEAL},
                    {l:"Information Gain",d:"IG = 1.0 − 0.72 = 0.28 bits",c:GRN},
                  ].map(row=>(
                    <div key={row.l} style={{marginBottom:8,paddingLeft:8,
                      borderLeft:`2px solid ${row.c}`}}>
                      <div style={{fontWeight:700,color:row.c,fontSize:px(12)}}>{row.l}</div>
                      <div style={{fontFamily:"monospace",color:"#94a3b8",fontSize:px(12)}}>{row.d}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <EntropyViz/>
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — OVERFITTING ─────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Overfitting & Pruning",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Danger of <span style={{color:GRN}}>Deep Trees</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28),marginBottom:px(24)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:14}}>
                  A decision tree can grow until every leaf contains exactly one training
                  sample — 100% training accuracy. But this tree has memorised the training
                  data, including its noise. On new data, it fails badly.
                </p>
                <IBox color={ROSE} title="The Overfitting Problem"
                  body="With 1,000 training samples, a fully grown tree might have 1,000 leaves — one per sample. Training accuracy: 100%. Test accuracy: perhaps 60%. The tree 'memorised' rather than 'learned'. It's too specific to be useful."/>
                <p style={{...LBODY,fontSize:px(14),marginTop:16}}>
                  <strong>Pruning</strong> is the process of removing branches that provide
                  little predictive power. Two strategies:
                </p>
              </div>
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {t:"Pre-pruning (Early Stopping)",c:GRN,
                      params:["max_depth=5","min_samples_split=20","min_samples_leaf=10","max_features='sqrt'"],
                      d:"Stop growing before the tree gets too deep. Set hard limits during training. Fast and simple — the most common approach in practice.",
                      code:"DecisionTreeClassifier(max_depth=5, min_samples_split=20)"},
                    {t:"Post-pruning (Cost-Complexity)",c:AMB,
                      params:["ccp_alpha=0.01"],
                      d:"Grow the full tree, then prune back branches where the cost (complexity penalty) outweighs the accuracy gain. More thorough but slower.",
                      code:"DecisionTreeClassifier(ccp_alpha=0.01)"},
                    {t:"Cross-Validation",c:TEAL,
                      params:["cv=5"],
                      d:"Try multiple max_depth values (1 to 20). Pick the depth with lowest validation error. The plot of train-vs-test error vs depth shows the 'sweet spot'.",
                      code:"GridSearchCV(dt, {'max_depth':range(1,20)}, cv=5)"},
                  ].map(item=>(
                    <div key={item.t} style={{...LCARD,borderLeft:`4px solid ${item.c}`}}>
                      <div style={{fontWeight:800,color:item.c,fontSize:px(13),marginBottom:8}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(13),marginBottom:8}}>{item.d}</p>
                      <div style={{fontFamily:"monospace",background:"#f8fafc",borderRadius:8,
                        padding:"8px 12px",fontSize:px(11),color:item.c}}>{item.code}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — PYTHON ──────────────────────────────────────── */}
        <div ref={R(6)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python Example","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code It with <span style={{color:"#6ee7b7"}}>Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#6ee7b7" lines={[
                  "import numpy as np",
                  "import pandas as pd",
                  "from sklearn.tree import DecisionTreeClassifier, export_text",
                  "from sklearn.model_selection import train_test_split",
                  "from sklearn.metrics import classification_report",
                  "",
                  "# Loan approval dataset",
                  "# Features: [income_k, credit_score, debt_ratio]",
                  "X = np.array([",
                  "  [35, 620, 45], [45, 680, 30], [65, 720, 25],",
                  "  [80, 750, 20], [25, 580, 60], [55, 700, 35],",
                  "  [70, 740, 18], [30, 610, 50], [90, 780, 15],",
                  "  [40, 650, 40]",
                  "])",
                  "y = np.array([0,0,1,1,0,1,1,0,1,0])  # 0=reject,1=approve",
                  "",
                  "X_tr,X_te,y_tr,y_te = train_test_split(",
                  "  X, y, test_size=0.3, random_state=42)",
                  "",
                  "# Train with max depth to prevent overfitting",
                  "dt = DecisionTreeClassifier(max_depth=3, random_state=42)",
                  "dt.fit(X_tr, y_tr)",
                  "",
                  "# Print the actual learned rules",
                  "rules = export_text(dt,",
                  "  feature_names=['income','credit','debt'])",
                  "print(rules)",
                  "",
                  "# Predict and evaluate",
                  "y_pred = dt.predict(X_te)",
                  "print(classification_report(y_te, y_pred))",
                  "",
                  "# Feature importance",
                  "for f,imp in zip(['income','credit','debt'],",
                  "                 dt.feature_importances_):",
                  "  print(f'{f}: {imp:.3f}')",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"DecisionTreeClassifier(max_depth=3)",c:GRN,
                    d:"max_depth=3 means at most 3 questions from root to leaf. Prevents overfitting on small datasets. Default is None (unlimited)."},
                  {l:"dt.fit(X_tr, y_tr)",c:AMB,
                    d:"CART algorithm: for each node, try all features × all threshold values, pick the split maximising Gini impurity reduction. O(n·d·log n)."},
                  {l:"export_text(dt, feature_names=...)",c:TEAL,
                    d:"Prints the human-readable decision rules. You can literally read: 'if income ≤ 52.5 and credit ≤ 690 then REJECT'. No other ML model gives this."},
                  {l:"dt.feature_importances_",c:ROSE,
                    d:"Each feature gets a score 0–1 summing to 1.0. Measures how much that feature reduced impurity across all nodes it was used in. Great for feature selection."},
                  {l:"predict([[75, 730, 22]])",c:VIO,
                    d:"Follows the learned rules: income=75k → right branch; credit=730 → right branch; debt=22% → leaf: APPROVE. Fast O(depth) prediction."},
                  {l:"classification_report()",c:SKY,
                    d:"Shows precision, recall, F1 per class. For loan approval: recall for class 0 (rejects) is critical — missing a risky borrower is expensive."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:10,padding:"12px 16px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(11),marginBottom:5}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S7 — VISUALIZATION ───────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Visualization",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Seeing the <span style={{color:GRN}}>Decision Rules</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(24)}}>
              {[
                {e:"🌳",c:GRN,t:"Tree Diagram",
                  d:"sklearn.tree.plot_tree() renders the full tree. Each node shows: feature, threshold, samples, impurity, predicted class. Export as PNG for stakeholder presentations."},
                {e:"🗺️",c:AMB,t:"Decision Boundary",
                  d:"For 2-feature problems: colour the 2D feature space by predicted class. Shows how the tree partitions space into rectangles. Very distinctive — trees always produce rectangular regions."},
                {e:"📊",c:TEAL,t:"Feature Importance Bar",
                  d:"Plot feature_importances_ as a horizontal bar chart. The most important features immediately stand out. Use this to identify which features drive predictions most."},
              ].map(v=>(
                <div key={v.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${v.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(14),marginBottom:8}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{v.d}</p>
                </div>
              ))}
            </div>
            <IBox color={GRN} title="Visualising the Decision Boundary (2D)"
              body="If your data has 2 features, you can plot the decision boundary: create a meshgrid of (x1, x2) values covering the feature space, predict each point's class, colour by class. Decision trees always create rectangular partitions — horizontal and vertical lines. This is visually distinctive versus SVMs (smooth curves) or neural networks (complex boundaries)."/>
          </div>
        </div>

        {/* ── S8 — APPLICATIONS ────────────────────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Where Decision Trees <span style={{color:"#6ee7b7"}}>Shine</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"🩺",c:GRN,t:"Medical Diagnosis",
                  b:"Decision trees produce auditable, explainable rules. A hospital can print: 'if temperature>38.5 AND white_blood_cells>11 → possible infection'. Doctors can review and override. Required by medical regulations — black-box models often disallowed.",
                  tech:"CART, C4.5, CHAID"},
                {e:"💳",c:AMB,t:"Credit Risk Analysis",
                  b:"Basel III banking regulations require interpretable credit models. A printed decision tree rule set serves as legal documentation for loan decisions. Banks use decision trees with 10–20 nodes for consumer credit, gradient boosting for institutional.",
                  tech:"CART with compliance constraints"},
                {e:"🛡️",c:ROSE,t:"Fraud Detection (Rules)",
                  b:"Decision trees generate rule sets that fraud analysts can review, adjust, and override. A simple tree might catch 80% of fraud with just 5 rules: 'amount > 1000 AND foreign_country AND night_time → flag'. Fast and interpretable.",
                  tech:"Shallow CART, Rule extraction"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:px(16),padding:"22px 24px"}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:12,color:"#64748b"}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:"#1e1b4b",borderRadius:8,
                    padding:"8px 12px",fontSize:px(11),color:a.c}}>{a.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9 — GAME ────────────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Build the Tree</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Choose which feature to split on at each node. The algorithm always picks
              the feature with the highest Information Gain. Can you make the same choices
              a decision tree algorithm would make?
            </p>
            <BuildTreeGame/>
          </div>
        </div>

        {/* ── S10 — MINI PROJECT ───────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Live Loan <span style={{color:GRN}}>Approval Predictor</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A pre-trained decision tree model for loan approvals. Adjust applicant
              features and watch the tree traverse its nodes in real time.
              The console panel shows exactly which decision path was taken.
            </p>
            <LoanProject/>
          </div>
        </div>

        {/* ── S11 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.paper}}>
          <DTTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default DecisionTreesPage;
