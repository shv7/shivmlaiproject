import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — BACKPROPAGATION
   Level 4 · Deep Learning · Lesson 3 of 7
   Accent: Rose #e11d48
══════════════════════════════════════════════════════════════════ */
const ROSE = "#e11d48";
const VIO  = "#7c3aed";
const GRN  = "#059669";
const AMB  = "#d97706";
const CYN  = "#0891b2";
const PNK  = "#ec4899";
const IND  = "#4f46e5";
const TEAL = "#0d9488";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula = ({children,color=ROSE}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=ROSE}) => (
  <div style={{fontFamily:"monospace",background:"#0f0408",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — gradient flow animation ════════════════════ */
const HeroCanvas = () => {
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const LAYERS=[
      {x:0.12,nodes:3,col:AMB,label:"Input"},
      {x:0.35,nodes:4,col:VIO,label:"Hidden 1"},
      {x:0.58,nodes:4,col:IND,label:"Hidden 2"},
      {x:0.80,nodes:2,col:GRN,label:"Output"},
    ];
    const getY=(l,i)=>H/(l.nodes+1)*(i+1);
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#100008"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(225,29,72,0.04)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // forward connections
      LAYERS.forEach((layer,li)=>{
        if(li===LAYERS.length-1)return;
        const next=LAYERS[li+1];
        for(let i=0;i<layer.nodes;i++){
          for(let j=0;j<next.nodes;j++){
            ctx.beginPath();ctx.moveTo(layer.x*W,getY(layer,i));ctx.lineTo(next.x*W,getY(next,j));
            ctx.strokeStyle="rgba(100,116,139,0.12)"; ctx.lineWidth=0.8; ctx.stroke();
          }
        }
      });
      // backward gradient pulses (right to left, red)
      const backP=(1-((t*0.4)%1));
      for(let li=LAYERS.length-2;li>=0;li--){
        const layer=LAYERS[li],next=LAYERS[li+1];
        const delay=(LAYERS.length-2-li)*0.18;
        const p=Math.max(0,Math.min(1,(t*0.4+delay)%1));
        const bp=1-p;
        for(let i=0;i<Math.min(2,layer.nodes);i++){
          const j=i%next.nodes;
          const x1=layer.x*W,y1=getY(layer,i);
          const x2=next.x*W,y2=getY(next,j);
          const px2=x2+(x1-x2)*bp,py2=y2+(y1-y2)*bp;
          const g=ctx.createRadialGradient(px2,py2,0,px2,py2,10);
          g.addColorStop(0,ROSE+"ee"); g.addColorStop(1,ROSE+"00");
          ctx.beginPath();ctx.arc(px2,py2,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        }
      }
      // forward pass label
      ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle="#1e293b"; ctx.textAlign="center";
      ctx.fillText("→ Forward pass →",W/2,H*0.08);
      ctx.fillStyle=ROSE; ctx.fillText("← Backward pass (gradients) ←",W/2,H*0.92);
      // nodes
      LAYERS.forEach((layer,li)=>{
        for(let i=0;i<layer.nodes;i++){
          const cx=layer.x*W,cy=getY(layer,i);
          const g=ctx.createRadialGradient(cx,cy,0,cx,cy,20);
          g.addColorStop(0,layer.col+"44"); g.addColorStop(1,layer.col+"00");
          ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
          ctx.beginPath();ctx.arc(cx,cy,10,0,Math.PI*2);
          ctx.fillStyle="#1a0810"; ctx.fill();
          ctx.strokeStyle=layer.col; ctx.lineWidth=2;
          ctx.shadowColor=layer.col; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
        }
        ctx.font=`bold ${px(9)} sans-serif`; ctx.fillStyle=layer.col+"88";
        ctx.textAlign="center"; ctx.fillText(layer.label,layer.x*W,H-14);
      });
      t+=0.006; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ LOSS LANDSCAPE VISUALIZER ═══════════════════════════════ */
const LossLandscape = () => {
  const canvasRef=useRef();
  const [w,setW]=useState(2.5);
  const [lr,setLr]=useState(0.1);
  const [steps,setSteps]=useState([]);
  const [running,setRunning]=useState(false);
  const intervalRef=useRef(null);

  // Simple loss function: L(w) = (w-1)^2 + 0.3*sin(3w)
  const loss=useCallback(v=>Math.pow(v-1,2)+0.3*Math.sin(3*v),[]);
  const grad=useCallback(v=>2*(v-1)+0.9*Math.cos(3*v),[]);

  const redraw=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W2=c.width=c.offsetWidth,H2=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W2,H2);
    ctx.fillStyle="#fff8fa"; ctx.fillRect(0,0,W2,H2);
    ctx.strokeStyle="#fce4ec"; ctx.lineWidth=1;
    for(let x=0;x<W2;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H2);ctx.stroke();}
    for(let y=0;y<H2;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W2,y);ctx.stroke();}
    const pad=44;
    const xRange=[-2,4],yRange=[-0.2,3];
    const toX=v=>(v-xRange[0])/(xRange[1]-xRange[0])*(W2-2*pad)+pad;
    const toY=v=>H2-pad-(v-yRange[0])/(yRange[1]-yRange[0])*(H2-2*pad);
    // axes
    ctx.strokeStyle="#475569"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H2-pad);ctx.lineTo(W2-pad/2,H2-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,10);ctx.lineTo(pad,H2-pad);ctx.stroke();
    ctx.font="10px sans-serif"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
    [-2,-1,0,1,2,3,4].forEach(v=>{ctx.fillText(v,toX(v),H2-pad+14);});
    ctx.textAlign="right";
    [0,1,2,3].forEach(v=>{ctx.fillText(v,pad-4,toY(v)+4);});
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#94a3b8";
    ctx.fillText("w (weight)",toX(3),H2-8);
    ctx.save();ctx.translate(12,H2/2);ctx.rotate(-Math.PI/2);ctx.fillText("Loss L(w)",0,0);ctx.restore();
    // loss curve
    ctx.beginPath();
    for(let v=-2;v<=4;v+=0.02){
      const x=toX(v),y=toY(loss(v));
      v===-2?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=ROSE; ctx.lineWidth=2.5;
    ctx.shadowColor=ROSE; ctx.shadowBlur=6; ctx.stroke(); ctx.shadowBlur=0;
    // gradient descent path
    if(steps.length>1){
      ctx.beginPath();
      steps.forEach((s,i)=>{i===0?ctx.moveTo(toX(s.w),toY(s.l)):ctx.lineTo(toX(s.w),toY(s.l));});
      ctx.strokeStyle=AMB; ctx.lineWidth=2; ctx.stroke();
      steps.forEach((s,i)=>{
        ctx.beginPath();ctx.arc(toX(s.w),toY(s.l),4,0,Math.PI*2);
        ctx.fillStyle=i===steps.length-1?GRN:AMB; ctx.fill();
      });
    }
    // current position
    const cx2=toX(w),cy2=toY(loss(w));
    const g2=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,20);
    g2.addColorStop(0,ROSE+"88"); g2.addColorStop(1,ROSE+"00");
    ctx.beginPath();ctx.arc(cx2,cy2,20,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
    ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.fillStyle=ROSE;ctx.fill();
    ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    // gradient arrow
    const g3=grad(w);
    const arrowLen=40;
    ctx.beginPath();ctx.moveTo(cx2,cy2);ctx.lineTo(cx2-g3*arrowLen,cy2);
    ctx.strokeStyle=VIO; ctx.lineWidth=2; ctx.stroke();
    ctx.font="bold 10px monospace"; ctx.fillStyle=VIO; ctx.textAlign="center";
    ctx.fillText(`∂L/∂w=${g3.toFixed(2)}`,cx2-g3*arrowLen/2,cy2-10);
    // loss value
    ctx.font="bold 11px monospace"; ctx.fillStyle=ROSE; ctx.textAlign="right";
    ctx.fillText(`L(w=${w.toFixed(2)}) = ${loss(w).toFixed(3)}`,W2-10,20);
  },[w,steps,loss,grad]);

  useEffect(()=>{redraw();},[redraw]);

  const step=useCallback(()=>{
    setW(prev=>{
      const g=grad(prev);
      const newW=prev-lr*g;
      setSteps(s=>[...s.slice(-30),{w:prev,l:loss(prev)}]);
      return newW;
    });
  },[grad,loss,lr]);

  const startGD=()=>{
    setSteps([]);setRunning(true);
    intervalRef.current=setInterval(step,200);
  };
  const stopGD=()=>{
    setRunning(false);
    clearInterval(intervalRef.current);
  };
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:ROSE,marginBottom:8,fontSize:px(15)}}>
        🏔️ Loss Landscape — Watch gradient descent find the minimum
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The loss function L(w) = (w−1)² + 0.3·sin(3w) has local minima.
        The gradient ∂L/∂w (purple arrow) tells us which way to move.
        Watch how learning rate affects convergence.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
            border:`1px solid ${ROSE}22`,display:"block"}}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Weight w (drag to explore)</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:ROSE,fontSize:px(14)}}>{w.toFixed(3)}</span>
            </div>
            <input type="range" min={-2} max={4} step={0.05} value={w}
              onChange={e=>{setW(+e.target.value);setSteps([]);}}
              style={{width:"100%",accentColor:ROSE}}/>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Learning rate α</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:AMB,fontSize:px(14)}}>{lr.toFixed(3)}</span>
            </div>
            <input type="range" min={0.005} max={0.5} step={0.005} value={lr}
              onChange={e=>setLr(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
          </div>
          <div style={{background:"#0f0408",borderRadius:10,padding:"12px",fontFamily:"monospace",fontSize:px(12),lineHeight:1.9}}>
            <div style={{color:"#475569"}}># Gradient descent update:</div>
            <div style={{color:"#94a3b8"}}>∂L/∂w = {grad(w).toFixed(4)}</div>
            <div style={{color:ROSE,fontWeight:700}}>w_new = {w.toFixed(3)} − {lr}×{grad(w).toFixed(3)}</div>
            <div style={{color:GRN,fontWeight:700}}>     = {(w-lr*grad(w)).toFixed(4)}</div>
            <div style={{color:"#475569",marginTop:4}}>L(w) = {loss(w).toFixed(5)}</div>
            {steps.length>0&&<div style={{color:AMB}}>Steps taken: {steps.length}</div>}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={running?stopGD:startGD}
              style={{flex:1,background:running?ROSE:GRN,border:"none",borderRadius:10,
                padding:"10px",color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
              {running?"⏹ Stop":"▶ Run Gradient Descent"}
            </button>
            <button onClick={()=>{setW(2.5);setSteps([]);setRunning(false);clearInterval(intervalRef.current);}}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
                padding:"10px 16px",color:V.muted,fontSize:px(11),cursor:"pointer"}}>↺</button>
          </div>
          {lr>0.3&&(
            <div style={{background:ORG+"0d",border:`1px solid ${ORG}33`,borderRadius:8,padding:"10px 12px"}}>
              <p style={{...LBODY,fontSize:px(12),margin:0,color:ORG}}>
                ⚠️ Large learning rate! The update step may overshoot the minimum and diverge.
                Try α {"<"} 0.15 for stable convergence.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ CHAIN RULE VISUALIZER ═══════════════════════════════════ */
const ChainRuleViz = () => {
  const [x,setX]=useState(1.0);
  const w1=0.8,w2=0.6,b1=0.1,b2=0.05;
  const relu=v=>Math.max(0,v);
  const reluGrad=v=>v>0?1:0;
  const sigmoid=v=>1/(1+Math.exp(-v));
  const sigmoidGrad=v=>{const s=sigmoid(v);return s*(1-s);};
  // Forward
  const z1=w1*x+b1;
  const a1=relu(z1);
  const z2=w2*a1+b2;
  const yhat=sigmoid(z2);
  const ytrue=1;
  const L=0.5*Math.pow(ytrue-yhat,2);
  // Backward
  const dL_dyhat=-(ytrue-yhat);
  const dyhat_dz2=sigmoidGrad(z2);
  const dL_dz2=dL_dyhat*dyhat_dz2;
  const dz2_dw2=a1;
  const dL_dw2=dL_dz2*dz2_dw2;
  const dz2_da1=w2;
  const da1_dz1=reluGrad(z1);
  const dz1_dw1=x;
  const dL_dw1=dL_dz2*dz2_da1*da1_dz1*dz1_dw1;

  const STEPS=[
    {label:"∂L/∂ŷ",val:dL_dyhat,formula:"−(y − ŷ)",c:ROSE,note:"Derivative of MSE loss"},
    {label:"∂ŷ/∂z₂",val:dyhat_dz2,formula:"σ(z₂)·(1−σ(z₂))",c:PNK,note:"Sigmoid gradient"},
    {label:"∂L/∂z₂",val:dL_dz2,formula:"∂L/∂ŷ · ∂ŷ/∂z₂",c:AMB,note:"Chain rule at output"},
    {label:"∂L/∂w₂",val:dL_dw2,formula:"∂L/∂z₂ · a₁",c:VIO,note:"Gradient for w₂"},
    {label:"∂a₁/∂z₁",val:da1_dz1,formula:"1 if z₁>0 else 0",c:IND,note:"ReLU gradient"},
    {label:"∂L/∂w₁",val:dL_dw1,formula:"∂L/∂z₂ · w₂ · ∂a₁/∂z₁ · x",c:CYN,note:"Gradient for w₁"},
  ];

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:ROSE,marginBottom:8,fontSize:px(15)}}>
        🔗 Chain Rule Step-by-Step — See how gradients propagate backward
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        A 2-layer network: x → [w₁,b₁] → ReLU → [w₂,b₂] → Sigmoid → ŷ.
        Drag the input to see how every gradient changes.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Input x</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:ROSE,fontSize:px(14)}}>{x.toFixed(2)}</span>
            </div>
            <input type="range" min={-3} max={3} step={0.05} value={x}
              onChange={e=>setX(+e.target.value)} style={{width:"100%",accentColor:ROSE}}/>
          </div>
          <div style={{background:"#0f0408",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
            <div style={{color:"#475569"}}>— FORWARD PASS —</div>
            <div>z₁ = {w1}×{x.toFixed(2)}+{b1} = <span style={{color:AMB}}>{z1.toFixed(4)}</span></div>
            <div>a₁ = ReLU({z1.toFixed(3)}) = <span style={{color:GRN}}>{a1.toFixed(4)}</span></div>
            <div>z₂ = {w2}×{a1.toFixed(3)}+{b2} = <span style={{color:AMB}}>{z2.toFixed(4)}</span></div>
            <div>ŷ = σ({z2.toFixed(3)}) = <span style={{color:CYN}}>{yhat.toFixed(4)}</span></div>
            <div>L = ½(1−{yhat.toFixed(3)})² = <span style={{color:ROSE,fontWeight:700}}>{L.toFixed(5)}</span></div>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,letterSpacing:"1px"}}>
            ← BACKWARD PASS (chain rule)
          </div>
          {STEPS.map((s,i)=>(
            <div key={i} style={{background:s.c+"08",border:`1px solid ${s.c}22`,borderRadius:8,
              padding:"8px 12px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"monospace",fontWeight:700,color:s.c,fontSize:px(12)}}>{s.label}</div>
                <div style={{fontFamily:"monospace",fontSize:px(10),color:V.muted}}>{s.formula}</div>
                <div style={{fontSize:px(10),color:V.muted}}>{s.note}</div>
              </div>
              <div style={{fontFamily:"monospace",fontWeight:900,color:s.c,fontSize:px(14),minWidth:80,textAlign:"right"}}>
                {s.val.toFixed(5)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ FIX THE NETWORK GAME ═════════════════════════════════════ */
const FixNetworkGame = () => {
  const [w1,setW1]=useState(2.0);
  const [w2,setW2]=useState(-1.5);
  const [b,setB]=useState(0.5);
  const [locked,setLocked]=useState(false);
  const [score,setScore]=useState(null);

  // Dataset: simple linear-ish with some noise
  const DATA=[
    {x:1,y:2.1},{x:2,y:3.8},{x:3,y:6.2},{x:4,y:7.9},{x:5,y:10.1},
    {x:-1,y:-2.3},{x:0,y:0.1},{x:1.5,y:3.0},{x:2.5,y:5.1},{x:3.5,y:6.9},
  ];
  const predict=x=>w1*x+w2*Math.pow(x,0.5<x?0:1)+b;
  const safePred=x=>{try{return predict(x);}catch{return 0;}};
  const mse=DATA.reduce((s,d)=>s+Math.pow(d.y-safePred(d.x),2),0)/DATA.length;
  const OPTIMAL_MSE=0.15;

  const canvasRef=useRef();
  const redraw=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fff8fa"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#fce4ec"; ctx.lineWidth=1;
    for(let x2=0;x2<W;x2+=30){ctx.beginPath();ctx.moveTo(x2,0);ctx.lineTo(x2,H);ctx.stroke();}
    for(let y2=0;y2<H;y2+=30){ctx.beginPath();ctx.moveTo(0,y2);ctx.lineTo(W,y2);ctx.stroke();}
    const pad=36;
    const toX=v=>(v+2)/(8)*( W-2*pad)+pad;
    const toY=v=>H-pad-(v+4)/(16)*(H-2*pad);
    ctx.strokeStyle="#94a3b8"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,10);ctx.lineTo(pad,H-pad);ctx.stroke();
    // data points
    DATA.forEach(d=>{
      const px2=toX(d.x),py2=toY(d.y);
      ctx.beginPath();ctx.arc(px2,py2,6,0,Math.PI*2);
      ctx.fillStyle=ROSE+"cc"; ctx.fill();
      const pred=safePred(d.x);
      const ppx=toX(d.x),ppy=toY(pred);
      ctx.beginPath();ctx.moveTo(ppx,py2);ctx.lineTo(ppx,ppy);
      ctx.strokeStyle=AMB+"88"; ctx.lineWidth=1.5; ctx.stroke();
      ctx.beginPath();ctx.arc(ppx,ppy,4,0,Math.PI*2);
      ctx.fillStyle=VIO+"aa"; ctx.fill();
    });
    // prediction line
    ctx.beginPath();
    for(let v=-2;v<=6;v+=0.1){
      const x2=toX(v),y2=toY(safePred(v));
      v===-2?ctx.moveTo(x2,y2):ctx.lineTo(x2,y2);
    }
    ctx.strokeStyle=VIO; ctx.lineWidth=2.5;
    ctx.shadowColor=VIO; ctx.shadowBlur=6; ctx.stroke(); ctx.shadowBlur=0;
    // MSE label
    const mseCol=mse<0.5?GRN:mse<2?AMB:ROSE;
    ctx.font=`bold ${px(11)} monospace`; ctx.fillStyle=mseCol; ctx.textAlign="right";
    ctx.fillText(`MSE = ${mse.toFixed(3)}`,W-10,20);
  },[w1,w2,b,DATA,mse,safePred]);
  useEffect(()=>{redraw();},[redraw]);

  const lockIn=()=>{
    const pct=Math.max(0,Math.round((1-mse/5)*100));
    setScore(pct); setLocked(true);
  };

  return (
    <div style={{...LCARD,background:"#fff8fa",border:`2px solid ${ROSE}22`}}>
      <div style={{fontWeight:800,color:ROSE,fontSize:px(17),marginBottom:8}}>
        🎮 Fix the Network — Manually minimise the loss
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Adjust the weights w₁, w₂, and bias b manually.
        Red dots = true data points. Purple dots = predictions. Orange lines = errors.
        Minimise the MSE loss — this is exactly what backpropagation does automatically!
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:250,borderRadius:12,
            border:`1px solid ${ROSE}22`,display:"block",marginBottom:12}}/>
          <div style={{textAlign:"center",padding:"12px",borderRadius:10,
            background:mse<0.5?GRN+"0d":mse<2?AMB+"0d":ROSE+"0d",
            border:`2px solid ${mse<0.5?GRN:mse<2?AMB:ROSE}`}}>
            <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(22),
              color:mse<0.5?GRN:mse<2?AMB:ROSE}}>
              MSE = {mse.toFixed(4)}
            </div>
            <div style={{fontSize:px(11),color:V.muted,marginTop:2}}>
              {mse<0.3?"🏆 Excellent fit!":mse<1?"✅ Good — keep tuning":mse<3?"⚠️ Getting there...":"❌ Far from optimal"}
            </div>
          </div>
        </div>
        <div>
          {[
            {l:"Weight w₁",v:w1,s:setW1,min:-4,max:4,step:0.05,c:VIO},
            {l:"Weight w₂",v:w2,s:setW2,min:-4,max:4,step:0.05,c:IND},
            {l:"Bias b",v:b,s:setB,min:-4,max:4,step:0.05,c:AMB},
          ].map(({l,v,s,min,max,step,c})=>(
            <div key={l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{v.toFixed(2)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v}
                onChange={e=>!locked&&s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
            </div>
          ))}
          <div style={{background:"#0f0408",borderRadius:10,padding:"12px",
            fontFamily:"monospace",fontSize:px(11),lineHeight:1.9,marginBottom:12}}>
            <div style={{color:"#475569"}}># Your model: y = w₁x + w₂x' + b</div>
            <div style={{color:VIO}}>y = {w1.toFixed(2)}x + {w2.toFixed(2)}x' + {b.toFixed(2)}</div>
            <div style={{color:"#475569",marginTop:4}}># Target: MSE &lt; {OPTIMAL_MSE}</div>
            <div style={{color:mse<OPTIMAL_MSE?GRN:ROSE,fontWeight:700}}>
              Current MSE: {mse.toFixed(4)} {mse<OPTIMAL_MSE?"✅":"❌"}
            </div>
          </div>
          {!locked?(
            <button onClick={lockIn}
              style={{width:"100%",background:ROSE,border:"none",borderRadius:10,padding:"12px",
                color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
              🔒 Lock In My Weights
            </button>
          ):(
            <div style={{background:score>=70?GRN+"0d":ROSE+"0d",
              border:`2px solid ${score>=70?GRN:ROSE}`,borderRadius:10,padding:"12px",textAlign:"center"}}>
              <div style={{fontWeight:900,fontSize:px(18),color:score>=70?GRN:ROSE}}>
                {score>=90?"🏆 Perfect tuning!":score>=70?"✅ Well done!":"❌ Keep minimising"}
              </div>
              <div style={{fontFamily:"monospace",color:V.muted,fontSize:px(11),marginTop:4}}>
                Score: {score}% — MSE={mse.toFixed(4)}
              </div>
              <button onClick={()=>{setLocked(false);setScore(null);}}
                style={{marginTop:8,background:"transparent",border:`1px solid ${V.border}`,
                  borderRadius:8,padding:"5px 12px",fontSize:px(10),color:V.muted,cursor:"pointer"}}>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ HOUSE PRICE PROJECT ══════════════════════════════════════ */
const HousePriceProject = () => {
  const [size,setSize]=useState(1800);
  const [beds,setBeds]=useState(3);
  const [age,setAge]=useState(15);
  const [loc,setLoc]=useState(7);
  const [epochs,setEpochs]=useState(0);
  const [training,setTraining]=useState(false);
  const lossRef=useRef([]);
  const intervalRef=useRef(null);

  // Simulated neural network prediction
  const rawPred=size*0.08+beds*12+loc*15-age*0.5+120;
  const noiseScale=Math.max(0,1-epochs/100);
  const pred=Math.round(rawPred*(1+noiseScale*(Math.random()*0.4-0.2)/5));
  const loss=Math.max(0.01,0.8*Math.exp(-epochs*0.03));

  const startTrain=()=>{
    if(training)return;
    setTraining(true);
    lossRef.current=[];
    intervalRef.current=setInterval(()=>{
      setEpochs(e=>{
        const next=e+1;
        if(next>=100){clearInterval(intervalRef.current);setTraining(false);}
        return next;
      });
    },80);
  };
  const reset=()=>{setEpochs(0);setTraining(false);lossRef.current=[];clearInterval(intervalRef.current);};
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  return (
    <div style={{...LCARD,background:"#fff8fa",border:`2px solid ${ROSE}22`}}>
      <div style={{fontWeight:700,color:ROSE,marginBottom:8,fontSize:px(15)}}>
        🏠 Mini Project — Neural Network House Price Predictor
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A neural network trained on housing data using backpropagation.
        Adjust features, train the network, and watch the loss curve fall as weights improve.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:12,letterSpacing:"1px"}}>
            HOUSE FEATURES
          </div>
          {[
            {l:"Size (sq ft)",v:size,s:setSize,min:600,max:5000,step:50,c:AMB,fmt:v=>`${v} sq ft`},
            {l:"Bedrooms",v:beds,s:setBeds,min:1,max:7,step:1,c:VIO,fmt:v=>`${v} beds`},
            {l:"Age (years)",v:age,s:setAge,min:0,max:80,step:1,c:CYN,fmt:v=>`${v} yrs`},
            {l:"Location score",v:loc,s:setLoc,min:1,max:10,step:0.5,c:GRN,fmt:v=>`${v}/10`},
          ].map(({l,v,s,min,max,step,c,fmt})=>(
            <div key={l} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(12),color:V.muted}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{fmt(v)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v}
                onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
            </div>
          ))}
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Training Progress</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:ROSE,fontSize:px(13)}}>
                {epochs}/100 epochs
              </span>
            </div>
            <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${epochs}%`,
                background:`linear-gradient(90deg,${ROSE},${AMB})`,borderRadius:6,transition:"width 0.1s"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={startTrain} disabled={training||epochs>=100}
              style={{flex:1,background:ROSE,border:"none",borderRadius:10,padding:"10px",
                color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                opacity:training||epochs>=100?0.6:1}}>
              {training?"Training...":epochs>=100?"✅ Trained!":"▶ Train Network"}
            </button>
            <button onClick={reset}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
                padding:"10px 14px",color:V.muted,fontSize:px(11),cursor:"pointer"}}>↺</button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#0f0408",border:`2px solid ${ROSE}`,borderRadius:16,
            padding:"24px",textAlign:"center"}}>
            <div style={{fontSize:px(14),color:"#94a3b8",marginBottom:6}}>🏠 Predicted Price</div>
            <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(36),
              color:epochs>=50?GRN:ROSE,letterSpacing:-1}}>
              ${(pred/1000).toFixed(0)}k
            </div>
            {epochs>0&&(
              <div style={{fontSize:px(12),color:"#64748b",marginTop:4}}>
                Confidence: {Math.round(epochs)}% (after {epochs} epochs)
              </div>
            )}
          </div>
          <div style={{...LCARD,padding:"14px"}}>
            <div style={{fontWeight:700,color:ROSE,fontSize:px(12),marginBottom:10}}>
              📉 TRAINING LOSS
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(22),fontWeight:900,
              color:loss<0.1?GRN:ROSE,marginBottom:6}}>
              L = {loss.toFixed(4)}
            </div>
            <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${(1-loss)*100}%`,
                background:`linear-gradient(90deg,${ROSE},${GRN})`,borderRadius:6,transition:"width 0.1s"}}/>
            </div>
            <p style={{...LBODY,fontSize:px(12),margin:0,color:V.muted}}>
              Each epoch: forward pass → compute loss → backprop → update all weights via gradient descent
            </p>
          </div>
          <CodeBox color={ROSE} lines={[
            "import torch",
            "import torch.nn as nn",
            "",
            "model = nn.Sequential(",
            "    nn.Linear(4, 64), nn.ReLU(),",
            "    nn.Linear(64, 32), nn.ReLU(),",
            "    nn.Linear(32, 1)",
            ")",
            "optimiser = torch.optim.Adam(",
            "    model.parameters(), lr=0.001",
            ")",
            "criterion = nn.MSELoss()",
            "",
            "for epoch in range(100):",
            "    ŷ = model(X_train)",
            "    loss = criterion(ŷ, y_train)",
            "    optimiser.zero_grad()",
            "    loss.backward()    # backprop!",
            "    optimiser.step()   # update weights",
          ]}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ════════════════════════════════════════════ */
const BPTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🎯",c:ROSE,t:"Backpropagation is the algorithm that enables neural networks to learn. It computes how much each weight contributed to the error and adjusts them all simultaneously. Without it, training deep networks would be computationally impossible."},
    {e:"📉",c:AMB,t:"The loss function measures how wrong the network is. MSE for regression: L = (1/n)Σ(y−ŷ)². Cross-entropy for classification: L = −Σy·log(ŷ). The goal of training is to minimise L over all training examples."},
    {e:"⛰️",c:VIO,t:"Gradient descent walks downhill on the loss landscape. The gradient ∂L/∂w tells the direction of steepest ascent — we go the opposite way. With millions of weights, we need backprop to compute all gradients efficiently in one backward pass."},
    {e:"🔗",c:IND,t:"The chain rule is the mathematical foundation: ∂L/∂w₁ = (∂L/∂ŷ)·(∂ŷ/∂z₂)·(∂z₂/∂a₁)·(∂a₁/∂z₁)·(∂z₁/∂w₁). Each factor is a local gradient at one operation. The backward pass multiplies them in reverse order."},
    {e:"⚡",c:CYN,t:"Learning rate α controls step size: w ← w − α·∂L/∂w. Too large: overshoots minimum, diverges. Too small: takes millions of steps, gets stuck. Adam optimizer adapts α per-parameter — far more robust than fixed learning rate."},
    {e:"🔄",c:GRN,t:"One training loop: (1) Forward pass → compute ŷ; (2) Compute loss L; (3) loss.backward() computes all ∂L/∂w; (4) optimizer.step() updates all weights; (5) optimizer.zero_grad() clears old gradients. Repeat for all batches × all epochs."},
    {e:"⚠️",c:ORG,t:"Exploding gradients: gradient magnitudes grow exponentially in deep networks. Fix: gradient clipping (clip gradients to max norm). Vanishing gradients: gradients shrink to zero. Fix: ReLU activations, batch normalisation, residual connections."},
    {e:"🚀",c:PNK,t:"Modern autograd (PyTorch, JAX) builds a computational graph dynamically. Every tensor operation is recorded. .backward() traverses the graph in reverse, applying chain rule automatically. No manual gradient derivation needed for any architecture."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 9",ROSE)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:ROSE}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c+"08":V.card,transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
              border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:px(13)}}>
              {done[i]?"✓":""}
            </div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px",
        background:"linear-gradient(135deg,#fff8fa,#f5f3ff)"}}>
        <div style={{fontSize:px(56),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>
          {cnt}/8 mastered
        </div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${ROSE},${AMB})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <p style={{...LBODY,maxWidth:px(500),margin:"0 auto 24px",fontSize:px(14)}}>
          You now understand the full deep learning training loop: forward pass, loss,
          backpropagation, and weight updates. The foundation for CNNs, RNNs, and Transformers.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:`linear-gradient(135deg,${ROSE},${AMB})`,
            border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",
            color:"#fff",fontSize:px(14)}}>
            Continue: CNNs →
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
const BackpropagationPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Backpropagation" lessonNum="Lesson 3 of 7"
    accent={ROSE} levelLabel="Deep Learning"
    dotLabels={["Hero","How NNs Learn","Loss Functions","Gradients","Chain Rule","Weight Updates","PyTorch Autograd","Loss Landscape","Chain Viz","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#100008 0%,#3a0020 60%,#0e0008 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🔥 Lesson 3 of 7 · Deep Learning",ROSE)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Back-<br/><span style={{color:"#fda4af"}}>propagation</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:ROSE,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The algorithm that gave neural networks the ability to learn from mistakes.
                Without backpropagation, adjusting millions of weights to improve a model
                would be computationally impossible. With it, a network trains itself from
                raw data through gradient descent — the engine behind every AI system
                from image recognisers to language models.
              </p>
              <div style={{background:"rgba(225,29,72,0.12)",border:"1px solid rgba(225,29,72,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fda4af",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Make a prediction. Compute the error. Propagate the error backward through
                  every layer using the chain rule of calculus. Each weight receives a gradient
                  telling it exactly how to change to reduce the error. Repeat millions of times.
                </p>
              </div>
            </div>
            <div style={{height:px(420),background:"rgba(225,29,72,0.06)",
              border:"1px solid rgba(225,29,72,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — LEARNING ────────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · How Neural Networks Learn",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Learning = Adjusting <span style={{color:ROSE}}>Weights</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  When a neural network is first created, its weights are initialised randomly
                  — usually from a small Gaussian distribution. Its predictions are essentially
                  random. Training is the process of systematically improving those weights
                  until the predictions become accurate.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  The learning loop repeats millions of times:
                </p>
                {[
                  {n:"1",t:"Make a prediction",d:"Run a training example through the network (forward pass). Compute ŷ.",c:AMB},
                  {n:"2",t:"Measure the error",d:"Compare ŷ to the true label y using a loss function. Compute L.",c:VIO},
                  {n:"3",t:"Compute gradients",d:"Backpropagate: use chain rule to find ∂L/∂w for every weight w.",c:ROSE},
                  {n:"4",t:"Update weights",d:"Gradient descent: w ← w − α·∂L/∂w. Move every weight to reduce loss.",c:GRN},
                  {n:"5",t:"Repeat",d:"Next batch of examples. After enough repetitions (epochs), the network converges.",c:CYN},
                ].map(s=>(
                  <div key={s.n} style={{...LCARD,display:"flex",gap:14,marginBottom:8,padding:"12px 16px",borderLeft:`4px solid ${s.c}`}}>
                    <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                      background:s.c+"22",border:`2px solid ${s.c}`,display:"flex",
                      alignItems:"center",justifyContent:"center",fontWeight:800,color:s.c,fontSize:px(13)}}>
                      {s.n}
                    </div>
                    <div>
                      <span style={{fontWeight:700,color:s.c,fontSize:px(14)}}>{s.t}: </span>
                      <span style={{fontSize:px(13),color:V.muted}}>{s.d}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={ROSE} title="The key insight"
                  body="The entire power of backpropagation comes from computing ∂L/∂w for every single weight in the network in ONE backward pass — the same time as a forward pass. Without this, computing gradients for a million-parameter network would require a million separate forward passes (finite differences). Backprop makes deep learning computationally feasible."/>
                <div style={{...LCARD,marginTop:14,background:"#fff8fa",border:`2px solid ${ROSE}22`}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:12,fontSize:px(13)}}>
                    📊 Before vs After Training
                  </div>
                  {[
                    {m:"Weights",before:"Random ~N(0,0.01)",after:"Learned, task-specific",c:AMB},
                    {m:"Predictions",before:"Random (50% accuracy)",after:"Near-optimal (97%+)",c:GRN},
                    {m:"Loss",before:"High (~2.3 for 10-class)",after:"Low (~0.08)",c:ROSE},
                    {m:"Feature detectors",before:"Random noise",after:"Edges, textures, objects",c:VIO},
                  ].map(row=>(
                    <div key={row.m} style={{marginBottom:8,padding:"6px 0",borderBottom:`1px solid ${V.border}`}}>
                      <div style={{fontWeight:700,color:row.c,fontSize:px(12),marginBottom:3}}>{row.m}</div>
                      <div style={{display:"flex",gap:10,fontSize:px(11)}}>
                        <span style={{color:V.muted}}>Before: {row.before}</span>
                        <span style={{color:GRN,fontWeight:600}}>After: {row.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — LOSS FUNCTIONS ──────────────────────────────── */}
        <div ref={R(2)} style={{background:"#100008"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Loss Functions","#fda4af")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Measuring the <span style={{color:"#fda4af"}}>Mistake</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  A loss function (also called cost function or objective function) assigns
                  a scalar value to how wrong the network's prediction is.
                  Lower loss = better prediction. The goal of training is to find weights
                  W that minimise the expected loss over the training distribution.
                </p>
                <Formula color={AMB}>MSE = (1/n) Σᵢ (yᵢ − ŷᵢ)²</Formula>
                <Formula color={ROSE}>CE = −(1/n) Σᵢ Σₖ yᵢₖ · log(ŷᵢₖ)</Formula>
                <Formula color={VIO}>L* = argmin_W E[L(y, f_W(x))]</Formula>
                {[
                  {fn:"MSE",full:"Mean Squared Error",c:AMB,
                    d:"For regression. Penalises large errors heavily (squared). Gradient: ∂MSE/∂ŷ = 2(ŷ−y)/n. Sensitive to outliers — large errors dominate.",use:"House prices, stock prediction, any continuous output"},
                  {fn:"MAE",full:"Mean Absolute Error",c:CYN,
                    d:"More robust to outliers than MSE. Gradient is constant ±1/n. Non-differentiable at zero — use Huber loss in practice.",use:"Robust regression, when outliers are expected"},
                  {fn:"Binary CE",full:"Binary Cross-Entropy",c:PNK,
                    d:"For binary classification: L = −[y·log(ŷ) + (1−y)·log(1−ŷ)]. Penalises confident wrong predictions logarithmically. Used with sigmoid output.",use:"Spam detection, medical diagnosis, sentiment"},
                  {fn:"Sparse CE",full:"Sparse Categorical Cross-Entropy",c:VIO,
                    d:"Multi-class: integer labels. L = −log(ŷ_true_class). Used with softmax output. nn.CrossEntropyLoss in PyTorch combines softmax + CE for numerical stability.",use:"Image classification, NLP, any multi-class task"},
                ].map(item=>(
                  <div key={item.fn} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontFamily:"monospace",fontWeight:800,color:item.c,fontSize:px(13)}}>{item.fn}</span>
                      <span style={{fontSize:px(12),color:"#64748b"}}>— {item.full}</span>
                    </div>
                    <p style={{...LBODY,fontSize:px(12),marginBottom:4,color:"#94a3b8"}}>{item.d}</p>
                    <div style={{fontSize:px(11),color:item.c}}>✅ Use for: {item.use}</div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={ROSE} title="Why not just use accuracy as the loss?"
                  body="Accuracy is non-differentiable: it's 0 or 1 per example, with no gradient to guide weight updates. Loss functions must be continuous and differentiable everywhere to enable gradient computation. Cross-entropy is a smooth surrogate for accuracy — minimising it implicitly maximises accuracy, while providing meaningful gradients at every weight value."/>
                <div style={{background:"#1a0010",border:`1px solid ${ROSE}33`,borderRadius:14,padding:"16px",marginTop:14}}>
                  <div style={{fontWeight:700,color:"#fda4af",marginBottom:10,fontSize:px(13)}}>Loss Function Intuition</div>
                  <CodeBox color={ROSE} lines={[
                    "# Perfect prediction: low loss",
                    "y_true = 1.0",
                    "y_pred = 0.95",
                    "# BCE = -log(0.95) = 0.051 ← small",
                    "",
                    "# Confident wrong: high loss",
                    "y_pred_wrong = 0.05",
                    "# BCE = -log(0.05) = 2.996 ← huge",
                    "",
                    "# Uncertain: medium loss",
                    "y_pred_unsure = 0.5",
                    "# BCE = -log(0.5) = 0.693 ← medium",
                    "",
                    "# Lesson: BCE heavily penalises",
                    "# confident-but-wrong predictions",
                  ]}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S3 — GRADIENTS ───────────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Gradients",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Slope of the <span style={{color:ROSE}}>Error</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  A gradient is the generalisation of a derivative to multi-dimensional functions.
                  For a scalar function L with many parameters W = {"{w₁, w₂, ..., wₙ}"},
                  the gradient ∇L is the vector of all partial derivatives:
                </p>
                <Formula color={ROSE}>∇L = [∂L/∂w₁, ∂L/∂w₂, ..., ∂L/∂wₙ]ᵀ</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Each component ∂L/∂wᵢ answers: "If I increase wᵢ by a tiny amount ε,
                  how much does the loss change?" A large positive gradient means increasing
                  wᵢ increases loss — so we should decrease it. A negative gradient means
                  we should increase the weight.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  The gradient vector always points in the direction of steepest ascent
                  on the loss surface. Gradient descent moves in the opposite direction:
                </p>
                <Formula color={AMB}>w ← w − α · ∂L/∂w</Formula>
                <IBox color={ROSE} title="Intuition: hiking analogy"
                  body="Imagine you're lost in foggy mountains and want to reach the lowest valley (minimum loss). At each step, you feel the slope of the ground under your feet (gradient). You step in the direction opposite to uphill — and repeat. Small steps (small α): slow but safe. Large steps (large α): fast but might jump over the valley. This is gradient descent."/>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:14}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:10,fontSize:px(13)}}>
                    Gradient interpretation guide
                  </div>
                  {[
                    {g:"∂L/∂w = +5.0",c:ROSE,msg:"Large positive → w is too high. Decrease w significantly"},
                    {g:"∂L/∂w = +0.1",c:AMB,msg:"Small positive → w slightly too high. Small decrease"},
                    {g:"∂L/∂w = 0.0",c:GRN,msg:"Zero gradient → at a minimum (or saddle point)"},
                    {g:"∂L/∂w = −0.1",c:AMB,msg:"Small negative → w slightly too low. Small increase"},
                    {g:"∂L/∂w = −5.0",c:VIO,msg:"Large negative → w is too low. Increase w significantly"},
                  ].map(row=>(
                    <div key={row.g} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:row.c,fontSize:px(12),minWidth:120,flexShrink:0}}>{row.g}</span>
                      <span style={{fontSize:px(12),color:V.muted}}>{row.msg}</span>
                    </div>
                  ))}
                </div>
                <div style={{...LCARD,background:"#fff8fa",border:`2px solid ${ROSE}22`}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:10,fontSize:px(13)}}>
                    Types of Gradient Descent
                  </div>
                  {[
                    {t:"Batch GD",d:"Use all N training examples to compute one gradient update. Stable but slow for large datasets."},
                    {t:"Stochastic GD (SGD)",d:"Use 1 example per update. Fast and noisy — noise helps escape local minima."},
                    {t:"Mini-Batch GD",d:"Use B=32/64/256 examples. Balance of speed and stability. Standard in practice."},
                    {t:"Adam",d:"Adaptive learning rates. Maintains momentum and RMSprop. Converges faster. Default choice."},
                  ].map(item=>(
                    <div key={item.t} style={{marginBottom:8}}>
                      <span style={{fontWeight:700,color:ROSE,fontSize:px(12)}}>{item.t}: </span>
                      <span style={{fontSize:px(12),color:V.muted}}>{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S4 — CHAIN RULE ──────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#100008"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · The Chain Rule","#fda4af")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Propagating Gradients <span style={{color:"#fda4af"}}>Backward</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  The chain rule from calculus is the mathematical engine of backpropagation.
                  If y depends on u which depends on x, then:
                </p>
                <Formula color={"#fda4af"}>dy/dx = (dy/du) · (du/dx)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  In a neural network, the loss L depends on the output ŷ, which depends on
                  the last layer's activations, which depend on the previous layer, all the way
                  back to the weights in the first layer. The chain rule links them all:
                </p>
                <Formula color={ROSE}>∂L/∂w₁ = ∂L/∂ŷ · ∂ŷ/∂a₂ · ∂a₂/∂z₂ · ∂z₂/∂a₁ · ∂a₁/∂z₁ · ∂z₁/∂w₁</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  Each factor is the local gradient at one operation. During the forward pass,
                  these intermediate values (z₁, a₁, z₂, etc.) are cached. During the backward
                  pass, they're retrieved in reverse order and multiplied together.
                </p>
                <IBox color={"#fda4af"} title="Why 'backward' propagation?"
                  body="We could compute gradients from the input forward (forward-mode differentiation). But with many inputs (millions of weights) and one scalar output (loss), reverse-mode differentiation is O(parameters) times faster. One backward pass computes all gradients simultaneously. This is the core computational insight behind modern deep learning."/>
              </div>
              <div>
                <div style={{background:"#1a0010",border:`1px solid ${ROSE}33`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#fda4af",marginBottom:10,fontSize:px(13)}}>🔗 Step-by-step chain rule</div>
                  {[
                    {l:"Forward",ops:[
                      "z₁ = w₁x + b₁",
                      "a₁ = ReLU(z₁)",
                      "z₂ = w₂a₁ + b₂",
                      "ŷ = σ(z₂)",
                      "L = MSE(y, ŷ)",
                    ],c:AMB},
                    {l:"Backward (chain rule)",ops:[
                      "∂L/∂ŷ = −(y − ŷ)/n",
                      "∂ŷ/∂z₂ = σ(z₂)·(1−σ(z₂))",
                      "∂z₂/∂w₂ = a₁",
                      "∂z₂/∂a₁ = w₂",
                      "∂a₁/∂z₁ = 𝟙[z₁>0]  ← ReLU grad",
                      "∂z₁/∂w₁ = x",
                    ],c:ROSE},
                  ].map(section=>(
                    <div key={section.l} style={{marginBottom:12}}>
                      <div style={{fontWeight:700,color:section.c,fontSize:px(12),marginBottom:6}}>{section.l}</div>
                      {section.ops.map((op,i)=>(
                        <div key={i} style={{fontFamily:"monospace",fontSize:px(11),
                          color:"#94a3b8",padding:"2px 0"}}>{op}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — WEIGHT UPDATE ───────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Weight Update Rule",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The <span style={{color:ROSE}}>Update Equation</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={ROSE}>w ← w − α · ∂L/∂w</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  This single equation, applied to every weight in the network after computing
                  gradients via backpropagation, is how all neural networks learn.
                  Applied millions of times, it transforms random weights into an expert model.
                </p>
                <div style={{...LCARD,background:"#fff8fa",border:`2px solid ${ROSE}22`,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:10,fontSize:px(13)}}>Learning Rate α — Critical Choices</div>
                  {[
                    {α:"α = 10.0",res:"Diverges — loss explodes",c:ROSE,bar:95},
                    {α:"α = 0.1",res:"Overshoots — oscillates",c:ORG,bar:60},
                    {α:"α = 0.01",res:"Good convergence",c:GRN,bar:30},
                    {α:"α = 0.001",res:"Slow but stable (Adam default)",c:AMB,bar:15},
                    {α:"α = 0.0001",res:"Very slow — may need more epochs",c:CYN,bar:5},
                  ].map(row=>(
                    <div key={row.α} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,fontSize:px(12)}}>
                        <span style={{fontFamily:"monospace",color:row.c,fontWeight:700}}>{row.α}</span>
                        <span style={{color:V.muted}}>{row.res}</span>
                      </div>
                      <div style={{background:V.cream,borderRadius:4,height:6,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${row.bar}%`,background:row.c,borderRadius:4}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:14}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:10,fontSize:px(13)}}>
                    Advanced Optimisers
                  </div>
                  {[
                    {name:"SGD + Momentum",formula:"v = βv − α∇L;  w = w + v",c:AMB,
                      d:"Accumulates gradient history. Escapes local minima better than vanilla SGD. β=0.9 typical."},
                    {name:"RMSprop",formula:"G = βG + (1-β)∇L²;  w = w − (α/√G)·∇L",c:VIO,
                      d:"Adaptive learning rate per parameter. Divides by RMS of recent gradients. Good for RNNs."},
                    {name:"Adam",formula:"m = β₁m+(1-β₁)∇L;  v = β₂v+(1-β₂)∇L²",c:GRN,
                      d:"Combines momentum + RMSprop + bias correction. β₁=0.9, β₂=0.999, α=0.001. Universal default."},
                    {name:"AdamW",formula:"Adam + L₂ weight decay",c:CYN,
                      d:"Fixes weight decay in Adam (decoupled regularisation). Preferred for Transformers. Used in GPT, BERT."},
                  ].map(item=>(
                    <div key={item.name} style={{borderLeft:`3px solid ${item.c}`,paddingLeft:12,marginBottom:12}}>
                      <div style={{fontWeight:800,color:item.c,fontSize:px(13),marginBottom:2}}>{item.name}</div>
                      <div style={{fontFamily:"monospace",fontSize:px(10),color:V.muted,marginBottom:4}}>{item.formula}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — PYTORCH AUTOGRAD ────────────────────────────── */}
        <div ref={R(6)} style={{background:"#100008"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · PyTorch Autograd","#fda4af")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Automatic <span style={{color:"#fda4af"}}>Differentiation</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={ROSE} lines={[
                "import torch",
                "import torch.nn as nn",
                "",
                "# ── AUTOGRAD BASICS ──────────────────────",
                "x = torch.tensor(2.0, requires_grad=True)",
                "y = x**2",
                "y.backward()           # compute dy/dx",
                "print(x.grad)          # tensor(4.)  ← 2x=4",
                "",
                "# ── MULTI-VARIABLE ──────────────────────",
                "x = torch.tensor([1.,2.,3.], requires_grad=True)",
                "L = (x**2).sum()       # L = 1+4+9 = 14",
                "L.backward()",
                "print(x.grad)          # [2., 4., 6.]  ← 2x",
                "",
                "# ── FULL TRAINING LOOP ───────────────────",
                "model = nn.Linear(1, 1)    # y = wx + b",
                "optimiser = torch.optim.SGD(model.parameters(), lr=0.01)",
                "criterion = nn.MSELoss()",
                "",
                "X = torch.tensor([[1.],[2.],[3.],[4.]])",
                "y = torch.tensor([[2.],[4.],[6.],[8.]])",
                "",
                "for epoch in range(200):",
                "    # 1. Forward pass",
                "    y_pred = model(X)",
                "",
                "    # 2. Compute loss",
                "    loss = criterion(y_pred, y)",
                "",
                "    # 3. Zero gradients (crucial!)",
                "    optimiser.zero_grad()",
                "",
                "    # 4. Backpropagation",
                "    loss.backward()",
                "",
                "    # 5. Update weights",
                "    optimiser.step()",
                "",
                "    if epoch % 50 == 0:",
                "        print(f'Epoch {epoch}: loss={loss.item():.4f}')",
                "",
                "# Final weights should be ~w=2, b=0",
                "print(model.weight, model.bias)",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"requires_grad=True",c:ROSE,d:"Tells PyTorch to track all operations on this tensor. Every operation creates a node in the computational graph."},
                  {l:".backward()",c:AMB,d:"Triggers reverse-mode automatic differentiation. Traverses the computational graph backward, computing gradients for all requires_grad tensors."},
                  {l:"optimiser.zero_grad()",c:VIO,d:"CRITICAL: gradients accumulate by default (+=). Must zero them before each backward pass or gradients from previous batches contaminate current batch."},
                  {l:"loss.backward()",c:CYN,d:"Computes ∂loss/∂w for every parameter in the model. After this call, param.grad contains the gradient."},
                  {l:"optimiser.step()",c:GRN,d:"Applies the weight update rule: w ← w − α·∂L/∂w for all parameters. The optimiser applies its specific algorithm (SGD, Adam, etc.)."},
                  {l:"torch.no_grad()",c:PNK,d:"Context manager for inference — disables gradient tracking. Reduces memory by 30-50% and speeds up by 2×. Always use during validation and testing."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(11),marginBottom:4}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S7 — LOSS LANDSCAPE ──────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Loss Landscape Visualization",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Walking Downhill on the <span style={{color:ROSE}}>Error Surface</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              This visualiser shows gradient descent on a 1D loss function.
              Drag the weight slider to explore the landscape. Use different learning rates
              to see convergence behaviour — and watch how large learning rates diverge.
            </p>
            <LossLandscape/>
          </div>
        </div>

        {/* ── S8 — CHAIN RULE VIZ ──────────────────────────────── */}
        <div ref={R(8)} style={{background:"#100008"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Chain Rule Live","#fda4af")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Every Gradient, <span style={{color:"#fda4af"}}>Step by Step</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",maxWidth:px(680),marginBottom:px(28)}}>
              A 2-layer network in real time. Drag the input slider to see how every
              intermediate gradient in the chain rule updates. This is exactly what
              loss.backward() computes internally.
            </p>
            <ChainRuleViz/>
          </div>
        </div>

        {/* ── S9 — GAME ────────────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Fix the Network</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Manually adjust weights to minimise the MSE loss on a regression dataset.
              This is what gradient descent does automatically — but doing it manually
              builds intuition for why learning rate and gradient direction matter.
            </p>
            <FixNetworkGame/>
          </div>
        </div>

        {/* ── S10 — PROJECT ────────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",ROSE)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              🏠 House Price <span style={{color:ROSE}}>Neural Network</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A full training loop on a house price regression task.
              Press Train to watch backpropagation reduce the loss over 100 epochs.
              Adjust house features to test the trained model.
            </p>
            <HousePriceProject/>
          </div>
        </div>

        {/* ── S11 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.cream}}>
          <BPTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default BackpropagationPage;
