import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — GRADIENT DESCENT
   Level 2 · Math for AI · Lesson 3 of 5
   Accent: Cyan #0891b2
══════════════════════════════════════════════════════════════════ */
const CYN  = "#0891b2";
const VIO  = "#7c3aed";
const EMR  = "#059669";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const SKY  = "#38bdf8";

const Formula = ({ children, color = CYN }) => (
  <div style={{ background: color+"0d", border:`1px solid ${color}44`, borderRadius:px(14),
    padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700,
    textAlign:"center", margin:`${px(16)} 0` }}>{children}</div>
);
const Step = ({ n, label, children, color = CYN }) => (
  <div style={{ display:"flex", gap:16, marginBottom:px(20) }}>
    <div style={{ width:36, height:36, borderRadius:"50%", background:color+"22",
      border:`2px solid ${color}`, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:px(14), fontWeight:800, color, flexShrink:0 }}>{n}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontWeight:700, color:V.ink, marginBottom:4, fontSize:px(14) }}>{label}</div>
      <div style={{ ...LBODY, fontSize:px(14) }}>{children}</div>
    </div>
  </div>
);
const CodeBox = ({ lines, color = CYN }) => (
  <div style={{ fontFamily:"monospace", background:"#0d0a2a", borderRadius:px(10),
    padding:"14px 18px", fontSize:px(13), lineHeight:1.9, marginTop:px(10) }}>
    {lines.map((l,i)=>(
      <div key={i} style={{ color: l.startsWith("#") || l.startsWith("//") ? "#475569" : color }}>{l}</div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — 3-D bowl animated, ball rolling to minimum
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#080d1a"; ctx.fillRect(0,0,W,H);
      // grid
      ctx.strokeStyle="rgba(8,145,178,0.07)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const cx=W/2, baseY=H*0.78, bowlW=W*0.38, bowlH=H*0.38;
      // bowl curve
      ctx.beginPath();
      for(let i=0;i<=200;i++){
        const u=(i/200)*2-1;
        const bx=cx+u*bowlW, by=baseY-bowlH*(1-u*u);
        i===0?ctx.moveTo(bx,by):ctx.lineTo(bx,by);
      }
      ctx.strokeStyle=CYN+"66"; ctx.lineWidth=2; ctx.stroke();
      // gradient arrows along bowl
      for(let i=-3;i<=3;i++){
        if(i===0)continue;
        const u=i/3.5;
        const bx=cx+u*bowlW*0.9, by=baseY-bowlH*(1-u*u*0.81);
        const slope=-2*u; // derivative
        const len=35*Math.abs(slope);
        const dx=-Math.sign(slope)*len/Math.sqrt(1+slope*slope);
        const dy=-Math.abs(slope)*len/Math.sqrt(1+slope*slope);
        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+dx,by+dy);
        ctx.strokeStyle=ROSE+"88"; ctx.lineWidth=1.5; ctx.stroke();
        const ang=Math.atan2(dy,dx);
        ctx.beginPath(); ctx.moveTo(bx+dx,by+dy);
        ctx.lineTo(bx+dx-8*Math.cos(ang-0.4),by+dy-8*Math.sin(ang-0.4));
        ctx.lineTo(bx+dx-8*Math.cos(ang+0.4),by+dy-8*Math.sin(ang+0.4));
        ctx.closePath(); ctx.fillStyle=ROSE+"88"; ctx.fill();
      }
      // ball position — oscillate with decay toward minimum
      const decay=Math.exp(-t*0.15);
      const ballU=Math.cos(t*1.2)*decay*0.85;
      const bx=cx+ballU*bowlW, by=baseY-bowlH*(1-ballU*ballU);
      // trail
      ctx.beginPath(); ctx.arc(bx,by,22,0,Math.PI*2);
      const g=ctx.createRadialGradient(bx,by,0,bx,by,22);
      g.addColorStop(0,CYN+"55"); g.addColorStop(1,CYN+"00");
      ctx.fillStyle=g; ctx.fill();
      ctx.beginPath(); ctx.arc(bx,by,9,0,Math.PI*2);
      ctx.fillStyle=CYN; ctx.fill();
      // minimum star
      ctx.beginPath(); ctx.arc(cx,baseY,5,0,Math.PI*2);
      ctx.fillStyle=EMR; ctx.fill();
      ctx.font="bold 11px sans-serif"; ctx.fillStyle=EMR; ctx.textAlign="center";
      ctx.fillText("minimum",cx,baseY+16);
      // labels
      ctx.font="bold 12px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.textAlign="center";
      ctx.fillText("J(θ) — Cost function",W/2,24);
      ctx.fillStyle=ROSE+"cc"; ctx.font="10px sans-serif";
      ctx.fillText("← gradient direction →",W/2,H*0.32);
      // theta label
      ctx.fillStyle=CYN+"cc"; ctx.font="bold 11px monospace";
      ctx.fillText("θ = "+ballU.toFixed(3),bx,by-16);
      t+=0.025; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 5 — Interactive Gradient Descent Visualizer
══════════════════════════════════════════════════════════════════ */
const GDVisualizer = () => {
  const canvasRef = useRef();
  const [lr, setLr] = useState(0.15);
  const [steps, setSteps] = useState([]);
  const [running, setRunning] = useState(false);
  const [theta, setTheta] = useState(3.0);
  const [iteration, setIteration] = useState(0);
  const intervalRef = useRef(null);

  // Cost function: J(θ) = θ²  → gradient = 2θ
  const J = t => t*t;
  const grad = t => 2*t;

  const reset = useCallback((startTheta=3.0) => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTheta(startTheta);
    setIteration(0);
    setSteps([{theta:startTheta,cost:J(startTheta)}]);
  },[]);

  useEffect(()=>{ reset(3.0); },[reset]);

  const runStep = useCallback(()=>{
    setTheta(prev=>{
      const g = grad(prev);
      const next = prev - lr*g;
      setSteps(s=>[...s,{theta:next,cost:J(next)}]);
      setIteration(i=>i+1);
      if(Math.abs(next)<0.001){ clearInterval(intervalRef.current); setRunning(false); }
      return next;
    });
  },[lr]);

  const startRun = () => {
    clearInterval(intervalRef.current);
    setRunning(true);
    intervalRef.current = setInterval(runStep, 300);
  };
  const pause = () => { clearInterval(intervalRef.current); setRunning(false); };

  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  // draw
  useEffect(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d");
    const W = c.width=c.offsetWidth, H = c.height=c.offsetHeight;
    const cx=W/2, cy=H/2, scaleX=W/8.5, scaleY=H/12;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f0f9ff"; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle="#bae6fd"; ctx.lineWidth=1;
    for(let x=0;x<=W;x+=scaleX*0.5){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=scaleY*0.5){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // axes
    ctx.strokeStyle=CYN+"77"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,H-30);ctx.lineTo(W,H-30);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.font="10px sans-serif"; ctx.fillStyle=CYN+"99"; ctx.textAlign="center";
    for(let i=-4;i<=4;i++){if(i!==0){ctx.fillText(i,cx+i*scaleX,H-18);ctx.fillText(i*i,cx-12,H-30-i*i*scaleY+4);}}
    // curve J=θ²
    ctx.beginPath();
    for(let i=0;i<=300;i++){
      const t=-4+i*8/300;
      const x=cx+t*scaleX, y=H-30-J(t)*scaleY;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=CYN; ctx.lineWidth=2.5; ctx.stroke();
    // path of steps
    if(steps.length>1){
      for(let i=1;i<steps.length;i++){
        const s1=steps[i-1],s2=steps[i];
        ctx.beginPath();
        ctx.moveTo(cx+s1.theta*scaleX, H-30-J(s1.theta)*scaleY);
        ctx.lineTo(cx+s2.theta*scaleX, H-30-J(s2.theta)*scaleY);
        ctx.strokeStyle=AMB+"cc"; ctx.lineWidth=1.5; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]);
      }
    }
    // current point
    const px2=cx+theta*scaleX, py2=H-30-J(theta)*scaleY;
    ctx.beginPath(); ctx.arc(px2,py2,7,0,Math.PI*2);
    ctx.fillStyle=ROSE; ctx.fill();
    ctx.beginPath(); ctx.arc(px2,py2,13,0,Math.PI*2);
    ctx.strokeStyle=ROSE+"66"; ctx.lineWidth=2; ctx.stroke();
    // gradient arrow
    const g=grad(theta), arrLen=40;
    const ang=Math.atan2(-g*scaleY,scaleX);
    const gdx=-Math.cos(ang)*arrLen, gdy=-Math.sin(ang)*arrLen;
    ctx.beginPath(); ctx.moveTo(px2,py2); ctx.lineTo(px2+gdx,py2+gdy);
    ctx.strokeStyle=ROSE; ctx.lineWidth=2; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px2+gdx,py2+gdy);
    const a2=Math.atan2(gdy,gdx);
    ctx.lineTo(px2+gdx-8*Math.cos(a2-0.4),py2+gdy-8*Math.sin(a2-0.4));
    ctx.lineTo(px2+gdx-8*Math.cos(a2+0.4),py2+gdy-8*Math.sin(a2+0.4));
    ctx.closePath(); ctx.fillStyle=ROSE; ctx.fill();
    ctx.font="bold 10px monospace"; ctx.fillStyle=ROSE; ctx.textAlign="left";
    ctx.fillText(`∇J = ${g.toFixed(3)}`,px2+gdx+5,py2+gdy);
    // minimum marker
    ctx.beginPath(); ctx.arc(cx,H-30,5,0,Math.PI*2); ctx.fillStyle=EMR; ctx.fill();
    ctx.font="bold 10px sans-serif"; ctx.fillStyle=EMR; ctx.textAlign="center"; ctx.fillText("min",cx,H-18);
    // labels
    ctx.font="bold 10px sans-serif"; ctx.fillStyle=CYN; ctx.textAlign="right";
    ctx.fillText("J(θ) = θ²",W-8,24);
  },[theta,steps]);

  const costNow = J(theta).toFixed(5);
  const converged = Math.abs(theta)<0.001;

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🎯 Interactive Gradient Descent — J(θ) = θ²
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Adjust learning rate α, click Run to watch the algorithm descend to the minimum.
        The red dot is the current θ, the arrow shows gradient direction.
      </p>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:300,borderRadius:12,
            border:`1px solid ${CYN}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 200px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Learning Rate α</span>
              <span style={{fontSize:px(13),fontWeight:800,color:CYN}}>{lr}</span>
            </div>
            <input type="range" min={0.01} max={1.9} step={0.01} value={lr}
              onChange={e=>{setLr(+e.target.value);reset(theta);}}
              style={{width:"100%",accentColor:CYN}}/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
              <span style={{fontSize:px(10),color:EMR}}>Too slow</span>
              <span style={{fontSize:px(10),color:AMB}}>Sweet spot ~0.1</span>
              <span style={{fontSize:px(10),color:ROSE}}>Diverges</span>
            </div>
          </div>
          <div style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:10,padding:"12px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#334155",lineHeight:2}}>
              <div>θ: <strong style={{color:CYN}}>{theta.toFixed(5)}</strong></div>
              <div>J(θ): <strong style={{color:AMB}}>{costNow}</strong></div>
              <div>∇J: <strong style={{color:ROSE}}>{(2*theta).toFixed(5)}</strong></div>
              <div>Steps: <strong style={{color:VIO}}>{iteration}</strong></div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {!running?
              <button onClick={startRun} disabled={converged}
                style={{flex:1,background:CYN,border:"none",borderRadius:9,padding:"10px",
                  color:"#fff",fontWeight:700,fontSize:px(13),
                  cursor:converged?"not-allowed":"pointer",opacity:converged?0.5:1}}>
                ▶ Run
              </button>
              :
              <button onClick={pause}
                style={{flex:1,background:AMB,border:"none",borderRadius:9,padding:"10px",
                  color:"#fff",fontWeight:700,fontSize:px(13),cursor:"pointer"}}>
                ⏸ Pause
              </button>
            }
            <button onClick={()=>reset(3.0)}
              style={{flex:1,background:"transparent",border:`1px solid ${V.border}`,
                borderRadius:9,padding:"10px",color:V.muted,fontWeight:600,
                fontSize:px(13),cursor:"pointer"}}>
              ↺ Reset
            </button>
          </div>
          {converged&&(
            <div style={{background:EMR+"0d",border:`1px solid ${EMR}44`,borderRadius:8,
              padding:"10px 12px",color:EMR,fontWeight:700,fontSize:px(13)}}>
              ✅ Converged in {iteration} steps!
            </div>
          )}
          {lr>1.0&&(
            <div style={{background:ROSE+"0d",border:`1px solid ${ROSE}44`,borderRadius:8,
              padding:"10px 12px",color:ROSE,fontWeight:600,fontSize:px(12)}}>
              ⚠️ Learning rate too high — may diverge or oscillate!
            </div>
          )}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {[[0.05,"Tiny (slow)"],[0.1,"Optimal"],[0.5,"Fast"],[1.0,"Risky"],[1.5,"Diverge!"]].map(([v,l])=>(
              <button key={v} onClick={()=>{setLr(v);reset(3.0);}}
                style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:7,
                  padding:"4px 8px",fontSize:px(10),cursor:"pointer",color:CYN,fontWeight:600}}>
                α={v}<br/><span style={{color:V.muted,fontWeight:400}}>{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 10 — Learning Rate Game
══════════════════════════════════════════════════════════════════ */
const LRGame = () => {
  const [lr, setLr] = useState(0.1);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState(0);
  const [history, setHistory] = useState([]);
  const [theta, setTheta] = useState(5.0);
  const [score, setScore] = useState(null);
  const intervalRef = useRef(null);

  const J = t => t*t;
  const grad = t => 2*t;

  const run = useCallback(()=>{
    let t=5.0, s=0, h=[{t:5.0,j:J(5.0)}];
    clearInterval(intervalRef.current);
    setDone(false); setSteps(0); setTheta(5.0); setScore(null);
    setHistory([{t:5.0,j:J(5.0)}]);
    intervalRef.current = setInterval(()=>{
      const g=grad(t); const next=t-lr*g; t=next; s++;
      h=[...h,{t:next,j:J(next)}];
      setTheta(next); setSteps(s); setHistory([...h]);
      if(Math.abs(next)<0.05||s>=200||Math.abs(next)>50){
        clearInterval(intervalRef.current);
        setDone(true);
        const sc = Math.abs(next)<0.05 ? Math.max(0,500-s*2) : 0;
        setScore(sc);
      }
    },120);
  },[lr]);

  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  const maxJ = 25;
  const barH = 5;

  return (
    <div style={{...LCARD,background:"#080d1a",border:`2px solid ${CYN}33`}}>
      <div style={{fontWeight:800,color:SKY,fontSize:px(17),marginBottom:8}}>
        🎮 Learning Rate Game — Find the Optimal α
      </div>
      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:16}}>
        Choose a learning rate and press <strong style={{color:SKY}}>Run!</strong> to minimise J(θ)=θ².
        Too small = slow. Too large = diverges. Find the sweet spot for the best score!
      </p>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          {/* Loss curve bar chart */}
          <div style={{background:"#111827",borderRadius:12,padding:"16px",height:240,
            display:"flex",flexDirection:"column",justifyContent:"flex-end",overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:1,height:"100%",
              justifyContent:"flex-start",overflowX:"auto"}}>
              {history.slice(-60).map((h,i)=>{
                const pct=Math.min(1,h.j/maxJ);
                const col=h.j<0.01?EMR:h.j<1?CYN:h.j<5?AMB:ROSE;
                return(
                  <div key={i} style={{flex:"0 0 4px",background:col,
                    height:`${pct*100}%`,borderRadius:"2px 2px 0 0",opacity:0.85}}/>
                );
              })}
            </div>
            <div style={{marginTop:8,fontFamily:"monospace",fontSize:px(11),color:"#64748b"}}>
              Loss over time (last 60 steps)
            </div>
          </div>
        </div>
        <div style={{flex:"1 1 200px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:"#94a3b8"}}>Learning Rate α =</span>
              <span style={{fontSize:px(14),fontWeight:800,color:CYN}}>{lr}</span>
            </div>
            <input type="range" min={0.01} max={1.95} step={0.01} value={lr}
              onChange={e=>setLr(+e.target.value)}
              style={{width:"100%",accentColor:CYN}}/>
          </div>
          <div style={{background:"#1e1b4b",borderRadius:10,padding:"12px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#94a3b8",lineHeight:2}}>
              <div>θ: <span style={{color:CYN}}>{theta.toFixed(4)}</span></div>
              <div>J(θ): <span style={{color:AMB}}>{J(theta).toFixed(4)}</span></div>
              <div>Steps: <span style={{color:VIO}}>{steps}</span></div>
            </div>
          </div>
          <button onClick={run}
            style={{background:CYN,border:"none",borderRadius:10,padding:"12px",
              color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
            ▶ Run!
          </button>
          {done&&score!==null&&(
            <div style={{background:score>0?"#05966911":ROSE+"11",
              border:`1px solid ${score>0?"#059669":ROSE}44`,
              borderRadius:10,padding:"12px",textAlign:"center"}}>
              {score>0?(
                <>
                  <div style={{fontSize:px(28)}}>🎉</div>
                  <div style={{color:EMR,fontWeight:800,fontSize:px(14)}}>Score: {score}</div>
                  <div style={{color:"#64748b",fontSize:px(12)}}>{steps} steps to converge</div>
                </>
              ):(
                <>
                  <div style={{fontSize:px(28)}}>💥</div>
                  <div style={{color:ROSE,fontWeight:800,fontSize:px(14)}}>Diverged!</div>
                  <div style={{color:"#64748b",fontSize:px(12)}}>Try a smaller α</div>
                </>
              )}
            </div>
          )}
          <div style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:8,
            padding:"10px 12px",fontSize:px(11),color:SKY,lineHeight:1.7}}>
            <strong>Hint:</strong> α ≈ 0.1 is usually optimal for this function. α = 1.0 exactly oscillates. α &gt; 1.0 diverges!
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   KEY INSIGHTS
══════════════════════════════════════════════════════════════════ */
const GDTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d=>({...d,[i]:!d[i]}));
  const items = [
    {e:"⛰",c:CYN,  t:"Gradient Descent finds function minima by repeatedly taking steps in the direction of steepest descent."},
    {e:"📐",c:VIO,  t:"Update rule: θ = θ − α∇J(θ). Subtract a fraction of the gradient from current parameters each step."},
    {e:"🎯",c:EMR,  t:"The cost function J(θ) measures how wrong the model is. Gradient descent minimizes it."},
    {e:"⚡",c:AMB,  t:"Learning rate α controls step size. Too small = slow convergence. Too large = divergence."},
    {e:"📦",c:CYN,  t:"Batch GD uses all data (stable). SGD uses 1 sample (noisy but fast). Mini-batch uses small batches (best of both)."},
    {e:"🧠",c:VIO,  t:"Neural network training IS gradient descent. Backpropagation computes ∇J(θ), then GD updates every weight."},
    {e:"🔁",c:EMR,  t:"Convergence = parameters stop changing significantly. Convergence doesn't guarantee global minimum — only local."},
    {e:"📈",c:AMB,  t:"Adam, RMSProp, and Momentum are improved variants. They adapt the learning rate per parameter automatically."},
  ];
  const cnt = Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",CYN)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:CYN}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c+"08":V.card,
              transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c:"transparent",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:px(13),color:"#fff",transition:"all 0.2s"}}>
              {done[i]?"✓":""}
            </div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,
              color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>
          {cnt}/8 concepts understood
        </div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${CYN},${VIO})`,
            transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:CYN,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Probability →
          </button>
          <button onClick={onBack}
            style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,
              padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
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
const GradientDescentPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Gradient Descent" lessonNum="Lesson 3 of 5"
    accent={CYN} levelLabel="Math for AI"
    dotLabels={["Hero","Simple","Math Def","Cost Fn","How It Works",
                "Visual","Types","Learning Rate","AI Uses","Real Example","Game","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ───────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#071a2e 60%,#0c1a2e 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📐 Lesson 3 of 5 · Math for AI",CYN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Gradient<br/><span style={{color:SKY}}>Descent</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:CYN,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                Gradient Descent is how every AI model learns. It is the engine behind
                neural network training, from a simple linear regression to GPT-4.
                Master this and you understand the core of machine learning.
              </p>
              <div style={{background:"rgba(8,145,178,0.12)",border:"1px solid rgba(8,145,178,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:SKY,fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 ONE LINE SUMMARY</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Roll a ball downhill, always in the steepest direction, until it
                  settles at the bottom. That is gradient descent.
                </p>
              </div>
            </div>
            <div style={{height:px(380),background:"rgba(8,145,178,0.06)",
              border:"1px solid rgba(8,145,178,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE DEFINITION ─────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Definition",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              What is Gradient Descent —{" "}
              <span style={{color:CYN}}>Plain English</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"⛰",c:CYN,t:"Imagine a Hilly Landscape",
                  b:"Picture yourself blindfolded on a hilly landscape. Your goal is to reach the lowest valley. You feel the slope under your feet and take a step downhill. Repeat until you can't go lower."},
                {e:"🎯",c:VIO,t:"Finding the Minimum",
                  b:"The 'landscape' is your cost function — it measures how wrong your model is. Gradient Descent systematically moves toward the minimum, where the model is least wrong."},
                {e:"🔄",c:EMR,t:"Iterative Refinement",
                  b:"It's not a one-shot calculation. It improves slowly, step by step. Each step makes the model slightly better. After thousands of steps, the model becomes excellent."},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{c.e}</div>
                  <h3 style={{fontWeight:800,color:c.c,fontSize:px(16),marginBottom:10}}>{c.t}</h3>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>{c.b}</p>
                </div>
              ))}
            </div>
            <IBox color={CYN} title="The Key Intuition"
              body="The gradient tells you which direction is 'uphill'. To go downhill, you move in the opposite direction of the gradient. The learning rate controls how big each step is." />
          </div>
        </div>

        {/* ── SECTION 2 — MATHEMATICAL DEFINITION ───────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Mathematical Definition","#7dd3fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Formal <span style={{color:SKY}}>Update Rule</span>
            </h2>
            <Formula color={SKY}>θ = θ − α · ∇J(θ)</Formula>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
              gap:px(16),marginTop:px(24)}}>
              {[
                {s:"θ",       c:CYN,  d:"Model parameters — the weights and biases being learned. Everything the model adjusts during training."},
                {s:"α",       c:AMB,  d:"Learning rate — controls step size. A small positive number, typically 0.001 to 0.1."},
                {s:"∇J(θ)",  c:ROSE, d:"Gradient of the cost function — a vector pointing in the direction of steepest increase."},
                {s:"−",       c:EMR,  d:"Minus sign — we move OPPOSITE to gradient direction (downhill, not uphill)."},
                {s:"J(θ)",   c:VIO,  d:"Cost/Loss function — measures how wrong the model is. We want to minimise this."},
                {s:"←",       c:SKY,  d:"Assignment — we replace old θ with the updated θ. This repeats every iteration."},
              ].map(item=>(
                <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                  borderRadius:12,padding:"16px"}}>
                  <div style={{fontFamily:"monospace",fontSize:px(24),fontWeight:900,
                    color:item.c,marginBottom:6}}>{item.s}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — COST FUNCTION ──────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Cost Function",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              What Are We <span style={{color:CYN}}>Minimizing?</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  The <strong style={{color:V.ink}}>cost function</strong> (also called loss function)
                  measures the difference between what the model predicts
                  and what the correct answer actually is.
                  Gradient descent minimises this difference.
                </p>
                <Formula color={CYN}>MSE = (1/n) Σᵢ (yᵢ − ŷᵢ)²</Formula>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
                  {[
                    {s:"n",  c:CYN,  d:"Number of training examples"},
                    {s:"yᵢ", c:EMR,  d:"True / actual label"},
                    {s:"ŷᵢ", c:AMB,  d:"Model's predicted value"},
                    {s:"²",  c:VIO,  d:"Squared to penalise large errors more"},
                  ].map(t=>(
                    <div key={t.s} style={{background:t.c+"0d",border:`1px solid ${t.c}33`,
                      borderRadius:8,padding:"10px 12px",display:"flex",gap:10,alignItems:"flex-start"}}>
                      <span style={{fontFamily:"monospace",fontWeight:900,color:t.c,fontSize:px(18)}}>{t.s}</span>
                      <span style={{...LBODY,fontSize:px(12),margin:0}}>{t.d}</span>
                    </div>
                  ))}
                </div>
                <Step n="1" label="Why squared?" color={CYN}>Squaring makes all errors positive and punishes large mistakes more heavily than small ones. A prediction off by 10 gets penalized 100x more than one off by 1.</Step>
                <Step n="2" label="Why minimise?" color={VIO}>When MSE = 0, predictions are perfect. Lower MSE = better model. Gradient descent drives it toward zero.</Step>
              </div>
              <div>
                {[
                  {t:"MSE (Regression)",   f:"(1/n)Σ(y−ŷ)²",  c:CYN,  u:"Predicting house prices, temperatures"},
                  {t:"Cross-Entropy",      f:"−Σ y·log(ŷ)",    c:VIO,  u:"Classification, language models"},
                  {t:"Binary Cross-Entropy",f:"−[y·log(ŷ)+(1−y)·log(1−ŷ)]",c:EMR,u:"Binary classifiers, logistic regression"},
                  {t:"Huber Loss",         f:"piecewise MSE/MAE",c:AMB, u:"Robust to outliers, object detection"},
                ].map(l=>(
                  <div key={l.t} style={{...LCARD,marginBottom:px(12)}}>
                    <div style={{fontWeight:700,color:l.c,fontSize:px(13),marginBottom:6}}>{l.t}</div>
                    <div style={{fontFamily:"monospace",background:l.c+"0d",borderRadius:7,
                      padding:"5px 12px",fontSize:px(12),color:l.c,fontWeight:700,marginBottom:6}}>
                      {l.f}
                    </div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{l.u}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — HOW IT WORKS ───────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · How Gradient Descent Works","#7dd3fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Step-by-Step <span style={{color:SKY}}>Algorithm</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                {[
                  {n:1,t:"Initialize Parameters",c:CYN,
                    d:"Set θ to random values (or zeros). This is the starting position on the cost landscape. A common technique is Xavier/He initialization for neural networks."},
                  {n:2,t:"Forward Pass — Compute Cost",c:AMB,
                    d:"Feed data through the model to get predictions ŷ. Compute J(θ) = cost(y, ŷ). This tells you how wrong the current parameters are."},
                  {n:3,t:"Backward Pass — Compute Gradient",c:ROSE,
                    d:"Compute ∇J(θ) — how much each parameter contributed to the error. In neural networks this is backpropagation using the chain rule."},
                  {n:4,t:"Update Parameters",c:VIO,
                    d:"Apply the update rule: θ = θ − α∇J(θ). Move each parameter a small step in the direction that reduces cost."},
                  {n:5,t:"Repeat Until Convergence",c:EMR,
                    d:"Go back to step 2. Repeat for thousands or millions of iterations. Stop when cost stops decreasing (converged) or a max iterations limit is hit."},
                ].map(s=>(
                  <div key={s.n} style={{display:"flex",gap:14,marginBottom:px(18)}}>
                    <div style={{width:38,height:38,borderRadius:"50%",background:s.c+"22",
                      border:`2px solid ${s.c}`,display:"flex",alignItems:"center",
                      justifyContent:"center",fontSize:px(16),fontWeight:900,color:s.c,flexShrink:0}}>{s.n}</div>
                    <div>
                      <div style={{fontWeight:700,color:"#e2e8f0",fontSize:px(14),marginBottom:4}}>{s.t}</div>
                      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),margin:0}}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{background:"#1e1b4b",border:`1px solid ${CYN}44`,borderRadius:14,padding:"20px 24px",marginBottom:px(20)}}>
                  <div style={{fontWeight:700,color:SKY,marginBottom:12,fontSize:px(14)}}>💻 Pseudocode</div>
                  <CodeBox color="#67e8f9" lines={[
                    "# Initialize","θ = random_values()",
                    "α = 0.01  # learning rate","","# Training loop",
                    "for epoch in range(max_iters):",
                    "    ŷ = model.forward(X, θ)",
                    "    J = loss(y, ŷ)",
                    "    grad = compute_gradient(J, θ)",
                    "    θ = θ - α * grad",
                    "    if converged(J): break",
                  ]}/>
                </div>
                <IBox color={CYN} title="Key Terminology"
                  body="Epoch = one full pass through the dataset. Iteration = one parameter update. Convergence = when the loss stops improving meaningfully." />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — VISUALIZATION ──────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Visualization",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Watch It <span style={{color:CYN}}>Descend Live</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              The curve shows J(θ)=θ². The red dot is the current parameter θ.
              The arrow shows gradient direction. The orange path shows where θ has been.
              Try different learning rates to see how convergence changes.
            </p>
            <GDVisualizer/>
          </div>
        </div>

        {/* ── SECTION 6 — TYPES ──────────────────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Types of Gradient Descent","#7dd3fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Three Flavours <span style={{color:SKY}}>Compared</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20)}}>
              {[
                {t:"Batch GD",e:"📦",c:CYN,
                  def:"Uses the ENTIRE dataset to compute one gradient update.",
                  pros:["Stable, smooth convergence","Exact gradient","Reproducible results"],
                  cons:["Very slow for large datasets","Requires all data in memory","Impractical for big data"],
                  use:"Small datasets, when exact gradients matter"},
                {t:"Stochastic GD",e:"⚡",c:ROSE,
                  def:"Uses ONE random sample to compute each gradient update.",
                  pros:["Very fast — updates every sample","Escapes local minima (noisy)","Works with huge datasets"],
                  cons:["Noisy — zig-zag path","May not converge precisely","Sensitive to learning rate"],
                  use:"Online learning, very large datasets"},
                {t:"Mini-Batch GD",e:"🎯",c:EMR,
                  def:"Uses a small batch (32–512 samples) per gradient update.",
                  pros:["Best of both worlds","GPU-efficient with batches","Relatively stable convergence"],
                  cons:["Batch size is a hyperparameter","Slightly noisy path","Memory depends on batch size"],
                  use:"Standard practice for all deep learning"},
              ].map(type=>(
                <div key={type.t} style={{background:type.c+"0d",border:`1px solid ${type.c}33`,
                  borderRadius:px(16),padding:"22px 20px"}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{type.e}</div>
                  <div style={{...LTAG(type.c),marginBottom:10}}>Most common for: {type.use}</div>
                  <h3 style={{fontWeight:800,color:type.c,fontSize:px(16),marginBottom:10}}>{type.t}</h3>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:14,color:"#64748b"}}>{type.def}</p>
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:px(12),fontWeight:700,color:EMR,marginBottom:4}}>✓ PROS</div>
                    {type.pros.map(p=><div key={p} style={{fontSize:px(12),color:"#94a3b8",marginBottom:3}}>• {p}</div>)}
                  </div>
                  <div>
                    <div style={{fontSize:px(12),fontWeight:700,color:ROSE,marginBottom:4}}>✗ CONS</div>
                    {type.cons.map(p=><div key={p} style={{fontSize:px(12),color:"#94a3b8",marginBottom:3}}>• {p}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — LEARNING RATE ──────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Learning Rate",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Most Important <span style={{color:CYN}}>Hyperparameter</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(28)}}>
              {[
                {t:"Too Small (α < 0.001)",e:"🐢",c:CYN,
                  prob:"Training takes forever. You'll run out of compute budget before reaching the minimum. The model technically improves but painfully slowly.",
                  fix:"Increase α or use adaptive methods (Adam)"},
                {t:"Too Large (α > 1.0)",e:"💥",c:ROSE,
                  prob:"Overshoots the minimum every step. Loss oscillates or explodes to infinity (NaN). The model never converges — it keeps bouncing around.",
                  fix:"Decrease α. Use learning rate scheduling."},
                {t:"Just Right (α ≈ 0.01-0.1)",e:"🎯",c:EMR,
                  prob:"Smooth, steady convergence. Loss decreases monotonically. The model finds the minimum in a reasonable number of steps.",
                  fix:"Use LR finder, start at 0.001 for Adam"},
              ].map(lr=>(
                <div key={lr.t} style={{...LCARD,borderTop:`4px solid ${lr.c}`}}>
                  <div style={{fontSize:px(44),marginBottom:10}}>{lr.e}</div>
                  <h3 style={{fontWeight:800,color:lr.c,fontSize:px(15),marginBottom:8}}>{lr.t}</h3>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10}}>{lr.prob}</p>
                  <div style={{background:lr.c+"0d",border:`1px solid ${lr.c}33`,borderRadius:8,
                    padding:"8px 12px",fontSize:px(12),color:lr.c,fontWeight:600}}>
                    💡 {lr.fix}
                  </div>
                </div>
              ))}
            </div>
            <div style={{...LCARD,background:"#f0fdf4",border:`2px solid ${EMR}33`}}>
              <div style={{fontWeight:700,color:EMR,marginBottom:10,fontSize:px(15)}}>
                ⚙️ Learning Rate Scheduling
              </div>
              <p style={{...LBODY,fontSize:px(14),marginBottom:10}}>
                Modern training uses a <strong>learning rate schedule</strong> — start large for fast initial progress, then reduce as training approaches the minimum.
              </p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
                {[["Step Decay","Halve α every N epochs",CYN],["Cosine Annealing","Smooth cosine curve",VIO],
                  ["Warmup + Decay","Used in transformers",EMR],["ReduceLROnPlateau","Auto-reduce on stall",AMB]
                ].map(([l,d,c])=>(
                  <div key={l} style={{background:c+"0d",border:`1px solid ${c}33`,borderRadius:8,padding:"10px"}}>
                    <div style={{fontWeight:700,color:c,fontSize:px(12),marginBottom:4}}>{l}</div>
                    <div style={{...LBODY,fontSize:px(12)}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8 — AI USES ────────────────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Gradient Descent in AI","#7dd3fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              The Engine Behind <span style={{color:SKY}}>All AI Training</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"🧠",t:"Neural Network Training",c:CYN,
                  b:"Every weight in every neural network is updated via gradient descent. Backpropagation computes ∇J and GD updates every weight. GPT-4 has 1.76T parameters all updated this way.",
                  code:["optimizer.zero_grad()","loss.backward()  # compute ∇J","optimizer.step()   # θ = θ - α·∇J"]},
                {e:"📊",t:"Logistic Regression",c:VIO,
                  b:"Binary classifiers use gradient descent to find optimal decision boundary weights. The cross-entropy gradient has a clean closed form: ∇J = Xᵀ(σ(Xθ)−y)/n.",
                  code:["# sklearn uses L-BFGS (GD variant)","model = LogisticRegression()","model.fit(X_train, y_train)"]},
                {e:"🎬",t:"Recommender Systems",c:AMB,
                  b:"Matrix factorization for collaborative filtering uses GD to learn user and item embeddings. Netflix Prize was won with SGD on matrix factorization.",
                  code:["# Update user/item vectors","u_i -= α * grad_u","v_j -= α * grad_v"]},
                {e:"🔀",t:"Transformers / LLMs",c:ROSE,
                  b:"Training GPT, BERT, and all LLMs uses Adam (adaptive GD). With trillion-parameter models, efficient gradient computation and memory management is its own research field.",
                  code:["optimizer = Adam(params, lr=1e-4)","for batch in data: train_step(batch)"]},
                {e:"🖼",t:"Image Recognition",c:EMR,
                  b:"CNNs trained via backprop + GD on ImageNet. Mini-batch SGD with momentum was used to train the breakthrough AlexNet in 2012, launching the deep learning revolution.",
                  code:["# SGD + momentum (classic)","opt = SGD(lr=0.01, momentum=0.9)"]},
                {e:"🎮",t:"Reinforcement Learning",c:SKY,
                  b:"Policy gradient methods use GD to maximise expected reward. PPO, SAC, and all modern RL algorithms are gradient-based optimisers applied to reward maximisation.",
                  code:["loss = -log_prob * advantage","loss.backward(); optimizer.step()"]},
              ].map(c=>(
                <div key={c.t} style={{background:c.c+"0d",border:`1px solid ${c.c}33`,
                  borderRadius:px(16),padding:"22px 24px"}}>
                  <div style={{fontSize:px(34),marginBottom:10}}>{c.e}</div>
                  <div style={{fontWeight:800,color:c.c,fontSize:px(15),marginBottom:8}}>{c.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:"#475569"}}>{c.b}</p>
                  <CodeBox color={c.c} lines={c.code}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 9 — REAL EXAMPLE ───────────────────────── */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Real Example",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Linear Regression with <span style={{color:CYN}}>Gradient Descent</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  We want to fit a line y = θ₀ + θ₁x to data. Gradient Descent
                  finds the optimal θ₀ and θ₁ by minimising MSE.
                </p>
                <Formula color={CYN}>J(θ) = (1/2n) Σ (y − θ₀ − θ₁x)²</Formula>
                <div style={{marginTop:16}}>
                  {[
                    {n:1,t:"Gradients",f:"∂J/∂θ₀ = (1/n) Σ(ŷ−y)   ∂J/∂θ₁ = (1/n) Σ(ŷ−y)xᵢ",c:CYN},
                    {n:2,t:"Update",  f:"θ₀ = θ₀ − α·∂J/∂θ₀   θ₁ = θ₁ − α·∂J/∂θ₁",c:AMB},
                  ].map(s=>(
                    <div key={s.n} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:s.c+"22",
                        border:`2px solid ${s.c}`,display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:px(12),fontWeight:800,color:s.c,flexShrink:0}}>{s.n}</div>
                      <div>
                        <div style={{fontWeight:700,color:V.ink,fontSize:px(13),marginBottom:4}}>{s.t}</div>
                        <div style={{fontFamily:"monospace",background:s.c+"0d",borderRadius:8,
                          padding:"6px 12px",fontSize:px(12),color:s.c,fontWeight:700}}>{s.f}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:px(16)}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:10,fontSize:px(14)}}>
                    🔁 Training Loop (Python)
                  </div>
                  <CodeBox color="#67e8f9" lines={[
                    "import numpy as np","",
                    "X = np.array([1,2,3,4,5])",
                    "y = np.array([2,4,5,4,5])",
                    "θ0, θ1, α = 0, 0, 0.01","",
                    "for _ in range(1000):",
                    "    ŷ = θ0 + θ1 * X",
                    "    err = ŷ - y",
                    "    θ0 -= α * err.mean()",
                    "    θ1 -= α * (err * X).mean()",
                    "","print(f'θ0={θ0:.3f}, θ1={θ1:.3f}')",
                  ]}/>
                </div>
                <div style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:12,padding:"16px"}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(14)}}>
                    📊 What Happens During Training
                  </div>
                  {[["Iter 0","θ=(0,0), J=13.5"],["Iter 100","θ=(0.8,0.6), J=1.2"],
                    ["Iter 500","θ=(1.8,0.72), J=0.44"],["Iter 1000","θ=(2.0,0.6), J=0.40"]
                  ].map(([it,v])=>(
                    <div key={it} style={{display:"flex",justifyContent:"space-between",
                      borderBottom:`1px solid ${CYN}22`,padding:"6px 0",
                      fontFamily:"monospace",fontSize:px(12)}}>
                      <span style={{color:"#64748b"}}>{it}</span>
                      <span style={{color:CYN}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 10 — GAME ──────────────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Game",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Learning Rate <span style={{color:CYN}}>Challenge</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(660),marginBottom:px(28)}}>
              Pick a learning rate and hit Run. The bar chart shows the loss over time.
              Minimize J(θ) in the fewest steps for maximum score. Can you find the optimal α?
            </p>
            <LRGame/>
          </div>
        </div>

        {/* ── SECTION 11 — KEY INSIGHTS ──────────────────────── */}
        <div ref={R(11)} style={{background:V.paper}}>
          <GDTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default GradientDescentPage;
