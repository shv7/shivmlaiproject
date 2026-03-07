import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — CLASSIFICATION
   Level 3 · Machine Learning · Lesson 3 of 7
   Accent: Purple #8b5cf6
══════════════════════════════════════════════════════════════════ */

const PUR  = "#8b5cf6";
const AMB  = "#f59e0b";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const RED  = "#ef4444";
const SKY  = "#0284c7";
const GRN  = "#059669";
const INK  = "#1e293b";

/* ── atoms ─────────────────────────────────────────────────────── */
const Formula = ({children,color=PUR}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=TEAL}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9,marginTop:px(10)}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("//")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — animated classification boundary
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const CLASS0=[
      {x:0.12,y:0.72},{x:0.18,y:0.61},{x:0.22,y:0.80},{x:0.28,y:0.68},
      {x:0.10,y:0.55},{x:0.30,y:0.82},{x:0.25,y:0.52},{x:0.15,y:0.45}
    ];
    const CLASS1=[
      {x:0.68,y:0.28},{x:0.75,y:0.40},{x:0.82,y:0.22},{x:0.72,y:0.52},
      {x:0.88,y:0.38},{x:0.78,y:0.18},{x:0.62,y:0.45},{x:0.84,y:0.55}
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0516";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(139,92,246,0.07)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // animated boundary line
      const bx1=0,by1=0.9+0.05*Math.sin(t*0.3);
      const bx2=1,by2=0.1+0.05*Math.sin(t*0.3+1);
      ctx.beginPath();
      ctx.moveTo(bx1*W,by1*H);ctx.lineTo(bx2*W,by2*H);
      ctx.strokeStyle=PUR;ctx.lineWidth=2.5;
      ctx.shadowColor=PUR;ctx.shadowBlur=16;ctx.stroke();ctx.shadowBlur=0;
      // shaded regions
      ctx.save();
      ctx.globalAlpha=0.06;
      ctx.fillStyle=ROSE;ctx.beginPath();
      ctx.moveTo(0,0);ctx.lineTo(bx2*W,by2*H);ctx.lineTo(bx1*W,by1*H);ctx.closePath();ctx.fill();
      ctx.fillStyle=TEAL;ctx.beginPath();
      ctx.moveTo(W,H);ctx.lineTo(bx2*W,by2*H);ctx.lineTo(bx1*W,by1*H);ctx.closePath();ctx.fill();
      ctx.restore();
      // class 0 dots
      CLASS0.forEach((p,i)=>{
        const cx=p.x*W, cy=p.y*H+4*Math.sin(t*0.5+i);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,16);
        g.addColorStop(0,ROSE+"55");g.addColorStop(1,ROSE+"00");
        ctx.beginPath();ctx.arc(cx,cy,16,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=ROSE;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
      });
      // class 1 dots
      CLASS1.forEach((p,i)=>{
        const cx=p.x*W, cy=p.y*H+4*Math.cos(t*0.5+i);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,16);
        g.addColorStop(0,TEAL+"55");g.addColorStop(1,TEAL+"00");
        ctx.beginPath();ctx.arc(cx,cy,16,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=TEAL;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
      });
      // labels
      ctx.font="bold 12px sans-serif";ctx.textAlign="left";
      [[ROSE,"● Class 0 (Not Spam)"],[TEAL,"● Class 1 (Spam)"],[PUR,"— Decision Boundary"]].forEach(([col,lbl],i)=>{
        ctx.fillStyle=col+"cc";ctx.fillText(lbl,20,20+i*18);
      });
      t+=0.006; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   SIGMOID VISUALIZER
══════════════════════════════════════════════════════════════════ */
const SigmoidViz = () => {
  const canvasRef=useRef();
  const [z,setZ]=useState(0);
  const sig=1/(1+Math.exp(-z));

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=36;
    const toC=(zVal,pVal)=>({
      x:pad+(zVal+6)/(12)*(W-2*pad),
      y:H-pad-pVal*(H-2*pad)
    });
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f8f7ff";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#ede9fe";ctx.lineWidth=1;
    for(let i=-6;i<=6;i++){const{x}=toC(i,0);ctx.beginPath();ctx.moveTo(x,pad/2);ctx.lineTo(x,H-pad);ctx.stroke();}
    for(let p=0;p<=1;p+=0.25){const{y}=toC(0,p);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad/2,y);ctx.stroke();}
    ctx.strokeStyle="#334155";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo((W)/2,pad/2);ctx.lineTo((W)/2,H-pad);ctx.stroke();
    ctx.font="9px monospace";ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    [-6,-4,-2,0,2,4,6].forEach(i=>{const{x}=toC(i,0);ctx.fillText(i,x,H-pad+12);});
    [0,0.25,0.5,0.75,1].forEach(p=>{const{y}=toC(-6.5,p);ctx.fillText(p.toFixed(2),pad-22,y+4);});
    ctx.font="bold 10px sans-serif";ctx.fillStyle="#64748b";
    ctx.fillText("z (linear combination w·x + b)",W/2,H-4);
    // threshold line
    const{y:ty}=toC(0,0.5);
    ctx.beginPath();ctx.moveTo(pad,ty);ctx.lineTo(W-pad/2,ty);
    ctx.strokeStyle=AMB+"88";ctx.lineWidth=1.5;ctx.setLineDash([6,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.font="bold 9px sans-serif";ctx.fillStyle=AMB;ctx.textAlign="left";
    ctx.fillText("threshold = 0.5",pad+4,ty-5);
    // sigmoid curve
    ctx.beginPath();
    for(let zv=-6;zv<=6;zv+=0.05){
      const sv=1/(1+Math.exp(-zv));
      const{x:cx,y:cy}=toC(zv,sv);
      zv===-6?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
    }
    ctx.strokeStyle=PUR;ctx.lineWidth=2.5;
    ctx.shadowColor=PUR;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
    // current z marker
    const{x:mx,y:my}=toC(z,sig);
    ctx.beginPath();ctx.moveTo(mx,H-pad);ctx.lineTo(mx,my);
    ctx.strokeStyle=ROSE+"88";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(pad,my);ctx.lineTo(mx,my);
    ctx.strokeStyle=TEAL+"88";ctx.stroke();ctx.setLineDash([]);
    const g=ctx.createRadialGradient(mx,my,0,mx,my,16);
    g.addColorStop(0,PUR+"88");g.addColorStop(1,PUR+"00");
    ctx.beginPath();ctx.arc(mx,my,16,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();ctx.arc(mx,my,7,0,Math.PI*2);ctx.fillStyle=PUR;ctx.fill();
    ctx.beginPath();ctx.arc(mx,my,7,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    ctx.font="bold 11px monospace";ctx.textAlign=z>0?"right":"left";ctx.fillStyle=PUR;
    ctx.fillText(`σ(${z.toFixed(1)})=${sig.toFixed(3)}`,mx+(z>0?-12:12),my-12);
  },[z,sig]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:PUR,marginBottom:8,fontSize:px(15)}}>
        📐 Interactive Sigmoid Visualizer — σ(z) = 1 / (1 + e⁻ᶻ)
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Drag the slider to change z. Notice how σ(z) is always between 0 and 1 regardless of z.
        For z=0 → σ=0.5. For large positive z → σ approaches 1. For large negative z → σ approaches 0.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
            border:`1px solid ${PUR}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:V.muted}}>z value</span>
              <span style={{fontFamily:"monospace",fontWeight:800,color:PUR}}>{z.toFixed(1)}</span>
            </div>
            <input type="range" min={-6} max={6} step={0.1} value={z}
              onChange={e=>setZ(+e.target.value)} style={{width:"100%",accentColor:PUR}}/>
          </div>
          <div style={{background:"#0d0a2a",borderRadius:12,padding:"16px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(13),lineHeight:2.4}}>
              <div style={{color:"#475569"}}>// Sigmoid calculation:</div>
              <div style={{color:"#94a3b8"}}>z = {z.toFixed(2)}</div>
              <div style={{color:"#94a3b8"}}>e⁻ᶻ = {Math.exp(-z).toFixed(4)}</div>
              <div style={{color:"#94a3b8"}}>1+e⁻ᶻ = {(1+Math.exp(-z)).toFixed(4)}</div>
              <div>σ(z) = <span style={{color:PUR,fontWeight:700}}>{sig.toFixed(4)}</span></div>
              <div style={{color:sig>=0.5?TEAL:ROSE,fontWeight:700}}>
                → Predict: {sig>=0.5?"Class 1 ✓":"Class 0 ✗"}
              </div>
            </div>
          </div>
          {[
            ["-6 (highly negative)","≈0.0025","Almost certainly class 0",ROSE],
            ["-2","0.119","Likely class 0",ROSE],
            ["0 (neutral)","0.500","50/50 — threshold",AMB],
            ["+2","0.881","Likely class 1",TEAL],
            ["+6 (highly positive)","≈0.9975","Almost certainly class 1",TEAL],
          ].map(([zv,sv,label,col])=>(
            <button key={zv} onClick={()=>setZ(parseFloat(zv))}
              style={{background:col+"0d",border:`1px solid ${col}33`,borderRadius:8,
                padding:"7px 12px",cursor:"pointer",textAlign:"left"}}>
              <span style={{fontFamily:"monospace",fontSize:px(11),color:col,fontWeight:700}}>z={zv}</span>
              <span style={{fontSize:px(10),color:V.muted,marginLeft:6}}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   DECISION BOUNDARY VISUALIZER
══════════════════════════════════════════════════════════════════ */
const BoundaryViz = () => {
  const canvasRef=useRef();
  const [threshold,setThreshold]=useState(0.5);

  const DATA=[
    {x:1,y:0,cls:0},{x:2,y:0,cls:0},{x:3,y:1,cls:1},{x:4,y:1,cls:1},
    {x:1.5,y:0,cls:0},{x:2.5,y:0,cls:0},{x:3.5,y:1,cls:1},{x:4.5,y:1,cls:1}
  ];
  const sig=(x)=>1/(1+Math.exp(-(2.5*x-7)));
  const boundary=(-Math.log(1/threshold-1)+7)/2.5;

  const correct=DATA.filter(p=>Number(sig(p.x)>=threshold)===p.cls).length;

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=44;
    const toC=(x,y)=>({x:pad+(x-0)/(5.5-0)*(W-2*pad),y:H-pad-(y-0)/(1-0)*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f9f7ff";ctx.fillRect(0,0,W,H);
    // boundary region
    const{x:bx}=toC(boundary,0);
    ctx.fillStyle=ROSE+"0a";ctx.fillRect(pad,pad/2,bx-pad,H-pad*1.5);
    ctx.fillStyle=TEAL+"0a";ctx.fillRect(bx,pad/2,W-pad/2-bx,H-pad*1.5);
    // sigmoid curve
    ctx.beginPath();
    for(let x=0;x<=5.5;x+=0.05){
      const s=sig(x);
      const{x:cx,y:cy}=toC(x,s);
      x===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
    }
    ctx.strokeStyle=PUR;ctx.lineWidth=2.5;
    ctx.shadowColor=PUR;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
    // threshold line
    const{y:ty}=toC(0,threshold);
    ctx.beginPath();ctx.moveTo(pad,ty);ctx.lineTo(W-pad/2,ty);
    ctx.strokeStyle=AMB;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.font="bold 10px sans-serif";ctx.fillStyle=AMB;ctx.textAlign="left";
    ctx.fillText("threshold="+threshold.toFixed(2),pad+4,ty-5);
    // boundary vertical
    ctx.beginPath();ctx.moveTo(bx,pad/2);ctx.lineTo(bx,H-pad);
    ctx.strokeStyle=PUR;ctx.lineWidth=2;ctx.stroke();
    ctx.font="bold 10px monospace";ctx.fillStyle=PUR;ctx.textAlign="center";
    ctx.fillText("x*="+boundary.toFixed(2),bx,pad/2+10);
    // axes
    ctx.strokeStyle="#334155";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="10px monospace";ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    [0,1,2,3,4,5].forEach(x=>{const{x:cx}=toC(x,0);ctx.fillText(x,cx,H-pad+12);});
    ctx.textAlign="right";
    [0,0.5,1].forEach(y=>{const{y:cy}=toC(0,y);ctx.fillText(y.toFixed(1),pad-4,cy+4);});
    ctx.font="bold 11px sans-serif";ctx.fillStyle="#64748b";ctx.textAlign="center";
    ctx.fillText("Feature x (e.g. word count)",W/2,H-4);
    // data points
    DATA.forEach(p=>{
      const{x:cx,y:cy}=toC(p.x,p.cls===1?0.92:0.08);
      const predicted=Number(sig(p.x)>=threshold);
      const correct2=(predicted===p.cls);
      const col=p.cls===1?TEAL:ROSE;
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,14);
      g.addColorStop(0,col+"55");g.addColorStop(1,col+"00");
      ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);
      ctx.strokeStyle=correct2?"#10b981":RED;ctx.lineWidth=2.5;ctx.stroke();
      if(!correct2){
        ctx.font="bold 12px sans-serif";ctx.fillStyle=RED;ctx.textAlign="center";
        ctx.fillText("✗",cx,cy+4);
      }
    });
  },[threshold,boundary]);

  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:PUR,marginBottom:8,fontSize:px(15)}}>
        🗺️ Decision Boundary Explorer
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Adjust the classification threshold. The vertical purple line is the
        <strong> decision boundary x*</strong>. Points left of it → Class 0 (not spam).
        Right of it → Class 1 (spam). Red ✗ marks misclassified points.
        Accuracy = {correct}/{DATA.length} = {(correct/DATA.length*100).toFixed(0)}%
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
            border:`1px solid ${PUR}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:V.muted}}>Threshold</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:AMB}}>{threshold.toFixed(2)}</span>
            </div>
            <input type="range" min={0.05} max={0.95} step={0.01} value={threshold}
              onChange={e=>setThreshold(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
          </div>
          <div style={{background:"#0d0a2a",borderRadius:12,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),lineHeight:2.2}}>
              <div style={{color:"#475569"}}>// Decision rule:</div>
              <div style={{color:"#94a3b8"}}>if σ(z) ≥ {threshold.toFixed(2)}:</div>
              <div style={{color:TEAL,paddingLeft:16}}>predict class 1</div>
              <div style={{color:"#94a3b8"}}>else:</div>
              <div style={{color:ROSE,paddingLeft:16}}>predict class 0</div>
              <div style={{marginTop:4,color:"#94a3b8"}}>boundary x* = {boundary.toFixed(3)}</div>
              <div style={{color:GRN,fontWeight:700}}>accuracy = {(correct/DATA.length*100).toFixed(0)}%</div>
            </div>
          </div>
          <IBox color={AMB} title="Threshold Trade-off"
            body="Lower threshold → more positives predicted → higher recall, lower precision. Higher threshold → fewer positives → higher precision, lower recall. Choose based on the cost of false positives vs false negatives."/>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   GAME — DRAW THE DECISION BOUNDARY
══════════════════════════════════════════════════════════════════ */
const DrawBoundaryGame = () => {
  const canvasRef=useRef();
  const [bx,setBx]=useState(4.5);
  const [locked,setLocked]=useState(false);
  const [best,setBest]=useState(0);
  const [msg,setMsg]=useState("");

  const SPAM=[{x:1.5,y:5.2},{x:2.2,y:6.1},{x:0.9,y:4.5},{x:2.8,y:5.8},{x:1.2,y:6.8}];
  const HAM =[{x:6.2,y:1.1},{x:7.1,y:2.3},{x:5.8,y:1.8},{x:7.5,y:0.9},{x:6.8,y:2.8}];
  const spamOK=SPAM.filter(p=>p.x<bx).length;
  const hamOK =HAM.filter(p=>p.x>=bx).length;
  const acc=(spamOK+hamOK)/10*100;

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=36;
    const toC=(x,y)=>({x:pad+(x/10)*(W-2*pad),y:H-pad-(y/9)*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0d1117";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(139,92,246,0.1)";ctx.lineWidth=1;
    for(let i=0;i<=10;i++){const{x}=toC(i,0);ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,H-pad);ctx.stroke();}
    for(let i=0;i<=9;i++){const{y}=toC(0,i);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad,y);ctx.stroke();}
    const{x:lbx}=toC(bx,0);
    ctx.fillStyle=ROSE+"0c";ctx.fillRect(pad,pad,lbx-pad,H-2*pad);
    ctx.fillStyle=TEAL+"0c";ctx.fillRect(lbx,pad,W-pad-lbx,H-2*pad);
    if(locked){
      const{x:optX}=toC(4.5,0);
      ctx.beginPath();ctx.moveTo(optX,pad);ctx.lineTo(optX,H-pad);
      ctx.strokeStyle=GRN;ctx.lineWidth=2;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);
      ctx.font="bold 10px sans-serif";ctx.fillStyle=GRN;ctx.textAlign="center";
      ctx.fillText("Optimal (4.5)",optX,pad-4);
    }
    ctx.beginPath();ctx.moveTo(lbx,pad);ctx.lineTo(lbx,H-pad);
    ctx.strokeStyle=PUR;ctx.lineWidth=2.5;
    ctx.shadowColor=PUR;ctx.shadowBlur=14;ctx.stroke();ctx.shadowBlur=0;
    ctx.font="bold 11px monospace";ctx.fillStyle=PUR;ctx.textAlign="center";
    ctx.fillText("x*="+bx.toFixed(1),lbx,pad-4);
    [[SPAM,ROSE],[HAM,TEAL]].forEach(([pts,col])=>{
      pts.forEach(p=>{
        const{x:cx,y:cy}=toC(p.x,p.y);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,14);
        g.addColorStop(0,col+"88");g.addColorStop(1,col+"00");
        ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.strokeStyle="#fff4";ctx.lineWidth=1.5;ctx.stroke();
      });
    });
    ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillStyle="#475569";
    ctx.fillText("Feature x (word frequency) →",W/2,H-4);
  },[bx,locked]);

  useEffect(()=>{redraw();},[redraw]);

  const lockIn=()=>{
    const a=+acc.toFixed(0);
    if(a>best){setBest(a);setMsg(`🏆 New best! Accuracy = ${a}%`);}
    else setMsg(`Accuracy = ${a}% | Best = ${best}%`);
    setLocked(true);
    setTimeout(()=>{setMsg("");setLocked(false);},2500);
  };

  return (
    <div style={{...LCARD,background:"#080d1a",border:`2px solid ${PUR}33`}}>
      <div style={{fontWeight:800,color:"#c4b5fd",fontSize:px(17),marginBottom:8}}>
        🎮 Draw the Decision Boundary
      </div>
      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:16}}>
        Move the boundary to separate <span style={{color:ROSE,fontWeight:700}}>🔴 Spam</span> from{" "}
        <span style={{color:TEAL,fontWeight:700}}>🟢 Ham</span>.
        Aim for 100% accuracy. Lock In to reveal the optimal boundary!
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:290,borderRadius:12,
            border:`1px solid ${PUR}22`,display:"block"}}/>
          {msg&&<div style={{background:GRN+"11",border:`1px solid ${GRN}44`,borderRadius:8,
            padding:"8px 14px",marginTop:8,color:GRN,fontWeight:700,fontSize:px(13)}}>{msg}</div>}
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:"#94a3b8"}}>Boundary x* =</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:PUR}}>{bx.toFixed(1)}</span>
            </div>
            <input type="range" min={0.5} max={9} step={0.1} value={bx}
              onChange={e=>setBx(+e.target.value)} style={{width:"100%",accentColor:PUR}}/>
          </div>
          <div style={{background:"#1e1b4b",borderRadius:12,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#94a3b8",lineHeight:2.2}}>
              <div>Accuracy: <span style={{color:acc===100?GRN:acc>=70?AMB:ROSE,fontWeight:700}}>{acc.toFixed(0)}%</span></div>
              <div>Spam ✓: <span style={{color:ROSE}}>{spamOK}/5</span></div>
              <div>Ham ✓: <span style={{color:TEAL}}>{hamOK}/5</span></div>
              <div>Best: <span style={{color:GRN,fontWeight:700}}>{best}%</span></div>
            </div>
          </div>
          <button onClick={lockIn} disabled={locked}
            style={{background:locked?PUR+"55":PUR,border:"none",borderRadius:10,
              padding:"12px",color:"#fff",fontWeight:800,fontSize:px(14),
              cursor:locked?"not-allowed":"pointer",transition:"all 0.2s"}}>
            🔒 Lock In!
          </button>
          <div style={{background:PUR+"0d",border:`1px solid ${PUR}33`,borderRadius:8,
            padding:"10px",fontSize:px(11),color:"#c4b5fd",lineHeight:1.8}}>
            <strong>Hint:</strong> Optimal boundary ≈ x* = 4.5 (midpoint between the two clusters)
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SPAM CLASSIFIER PROJECT
══════════════════════════════════════════════════════════════════ */
const SpamClassifier = () => {
  const [wordFreq,setWordFreq]=useState(3);
  const [emailLen,setEmailLen]=useState(200);
  const [hasLinks,setHasLinks]=useState(0);
  const [urgent,setUrgent]=useState(0);
  const z=0.8*wordFreq+0.002*emailLen+1.4*hasLinks+2.1*urgent-6.2;
  const prob=1/(1+Math.exp(-z));
  const isSpam=prob>=0.5;
  const conf=prob>=0.9||prob<=0.1?"HIGH":prob>=0.7||prob<=0.3?"MEDIUM":"LOW";

  return (
    <div style={{...LCARD,background:"#fdf5ff",border:`2px solid ${PUR}22`}}>
      <div style={{fontWeight:700,color:PUR,marginBottom:8,fontSize:px(15)}}>
        📧 Mini Project — Live Logistic Regression Spam Classifier
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A logistic regression model with pre-trained weights. Adjust email features
        and watch the <strong>sigmoid probability</strong> update in real time.
        The model uses: z = w₁·word_freq + w₂·email_len + w₃·has_links + w₄·urgent + b
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:12,letterSpacing:"1px"}}>
            EMAIL FEATURES
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              {l:"Spam word frequency",v:wordFreq,s:setWordFreq,min:0,max:10,step:0.5,c:ROSE},
              {l:"Email length (words)",v:emailLen,s:setEmailLen,min:10,max:500,step:10,c:AMB},
            ].map(({l,v,s,min,max,step,c})=>(
              <div key={l}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:px(12),color:V.muted}}>{l}</span>
                  <span style={{fontSize:px(12),fontWeight:700,color:c}}>{v}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={v}
                  onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
              </div>
            ))}
            <div style={{display:"flex",gap:10}}>
              {[["🔗 Contains links",hasLinks,setHasLinks,ROSE],["🚨 Urgent keywords",urgent,setUrgent,AMB]].map(([l,v,s,c])=>(
                <button key={l} onClick={()=>s(v===0?1:0)}
                  style={{flex:1,background:v===1?c+"22":"transparent",
                    border:`2px solid ${v===1?c:V.border}`,borderRadius:10,
                    padding:"10px 6px",cursor:"pointer",fontWeight:700,fontSize:px(11),
                    color:v===1?c:V.muted,transition:"all 0.2s"}}>
                  {l}: <strong>{v===1?"YES":"NO"}</strong>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginTop:16,background:"#0d1117",borderRadius:12,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#94a3b8",lineHeight:1.9}}>
              <div style={{color:"#475569",marginBottom:4}}>// Forward pass:</div>
              <div>z = 0.8×{wordFreq}+0.002×{emailLen}+1.4×{hasLinks}+2.1×{urgent}−6.2</div>
              <div>z = <span style={{color:PUR,fontWeight:700}}>{z.toFixed(3)}</span></div>
              <div>σ(z) = 1/(1+e⁻ᶻ) = <span style={{color:isSpam?ROSE:GRN,fontWeight:700}}>{prob.toFixed(4)}</span></div>
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:isSpam?"#1a0008":"#001a0e",
            border:`3px solid ${isSpam?ROSE:GRN}`,borderRadius:20,padding:"32px",textAlign:"center",flex:1}}>
            <div style={{fontSize:px(60),marginBottom:10}}>{isSpam?"🚨":"✅"}</div>
            <div style={{fontWeight:900,fontSize:px(26),color:isSpam?ROSE:GRN,marginBottom:6}}>
              {isSpam?"SPAM":"NOT SPAM"}
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(17),color:isSpam?ROSE:GRN,marginBottom:8}}>
              {(prob*100).toFixed(1)}% spam probability
            </div>
            <div style={{background:isSpam?ROSE+"22":GRN+"22",borderRadius:8,padding:"6px 14px",
              fontSize:px(12),color:isSpam?ROSE:GRN}}>Confidence: {conf}</div>
          </div>
          <div style={{...LCARD,padding:"16px"}}>
            <div style={{fontWeight:700,color:PUR,fontSize:px(12),marginBottom:10}}>
              LEARNED WEIGHTS (w)
            </div>
            {[
              ["word_frequency","+0.80",ROSE,"High spam words → high score"],
              ["email_length","+0.002",AMB,"Longer emails slightly spammier"],
              ["has_links","+1.40",ROSE,"Links strongly indicate spam"],
              ["urgent_keywords","+2.10",ROSE,"Urgency = strong spam signal"],
              ["bias (b)","-6.20",V.muted,"Baseline — shifts probability"],
            ].map(([f,w,c,note])=>(
              <div key={f} style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",marginBottom:5}}>
                <div>
                  <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted}}>{f}</div>
                  <div style={{fontSize:px(10),color:"#94a3b8"}}>{note}</div>
                </div>
                <span style={{fontFamily:"monospace",fontWeight:800,color:c,fontSize:px(12)}}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   KEY INSIGHTS
══════════════════════════════════════════════════════════════════ */
const ClsTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🏷️",c:PUR, t:"Classification predicts discrete categories (classes). Output: a class label or probability vector. Different from regression which predicts a continuous number."},
    {e:"⚖️",c:ROSE,t:"Binary classification: 2 classes (spam/ham, 0/1). Multi-class: 3+ classes (cat/dog/bird). Multi-label: multiple classes simultaneously (image: has-car AND has-person)."},
    {e:"📐",c:TEAL,t:"Logistic regression uses σ(z) = 1/(1+e⁻ᶻ) to squash z into [0,1] as a probability. z = w·x + b is the linear combination of features and weights."},
    {e:"🗺️",c:AMB, t:"The decision boundary is the surface separating class regions in feature space. Linear models → hyperplane boundary. Neural networks → complex, curved boundaries."},
    {e:"📊",c:SKY, t:"Accuracy alone is misleading with imbalanced classes. Use: Precision = TP/(TP+FP), Recall = TP/(TP+FN), F1 = 2·P·R/(P+R). Choose metric based on the problem's cost structure."},
    {e:"⚡",c:GRN, t:"Loss function for classification: binary cross-entropy = −[y·log(p) + (1−y)·log(1−p)]. This is minimised via gradient descent, just like MSE for regression."},
    {e:"🧠",c:PUR, t:"Neural networks extend classification to millions of classes. The final layer uses softmax (multi-class generalisation of sigmoid) to produce a probability distribution over all classes."},
    {e:"🌍",c:ROSE,t:"Powers: spam filters, credit approval, medical screening, fraud detection, content moderation, image recognition, sentiment analysis, self-driving car object detection."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",PUR)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:PUR}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c+"08":V.card,transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
              border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c:"transparent",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:px(13),color:"#fff",transition:"all 0.2s"}}>{done[i]?"✓":""}</div>
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
            background:`linear-gradient(90deg,${PUR},${TEAL})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:PUR,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Decision Trees →
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
const ClassificationPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Classification" lessonNum="Lesson 3 of 7"
    accent={PUR} levelLabel="Machine Learning"
    dotLabels={["Hero","Explanation","Binary/Multi","Sigmoid","Boundaries","Python","Evaluation","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#150030 60%,#0a001a 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack}
                style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",
                  fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📊 Lesson 3 of 7 · Machine Learning",PUR)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Classification<br/><span style={{color:"#c4b5fd"}}>Models</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:PUR,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                Is this email spam? Is this tumour malignant? Is this transaction fraudulent?
                Classification answers yes/no questions — and much more complex multi-class
                questions. It's the backbone of every AI safety system, medical tool, and
                content filter in existence.
              </p>
              <div style={{background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#c4b5fd",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Learn a decision boundary that divides feature space into regions —
                  one region per class. New data points are classified based on which
                  region they fall into.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(139,92,246,0.06)",
              border:"1px solid rgba(139,92,246,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE EXPLANATION ──────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Explanation",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Predicting <span style={{color:PUR}}>Categories</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Classification assigns an input to one of a fixed set of categories.
                  Unlike regression (which predicts "how much"), classification predicts
                  <strong> "which one"</strong>. The output is always a discrete label
                  from a known set of classes.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:20}}>
                  Internally, most classifiers compute a probability for each class and
                  return the class with the highest probability. The threshold (typically 0.5
                  for binary) determines where the decision boundary lies.
                </p>
                <IBox color={PUR} title="The Sorting Hat Analogy"
                  body="Hogwarts' Sorting Hat looks at a student's attributes (bravery, wit, loyalty, ambition) and assigns them to exactly one of four houses. A classification model does the same: it looks at input features and assigns a class label. The hat's internal logic is the learned decision boundary."/>
              </div>
              <div>
                {[
                  {e:"📬",c:PUR,t:"Email classification",cls:"Spam vs Not Spam",
                    f:"word frequency, sender, links"},
                  {e:"🩺",c:ROSE,t:"Medical diagnosis",cls:"Cancer / Benign / Uncertain",
                    f:"cell shape, size, texture"},
                  {e:"🖼️",c:TEAL,t:"Image recognition",cls:"Cat / Dog / Car / …1000",
                    f:"pixel values (224×224×3)"},
                  {e:"😊",c:AMB,t:"Sentiment analysis",cls:"Positive / Negative / Neutral",
                    f:"word embeddings"},
                  {e:"🌺",c:GRN,t:"Plant species ID",cls:"Setosa / Versicolor / Virginica",
                    f:"sepal/petal length & width"},
                  {e:"💳",c:SKY,t:"Transaction fraud",cls:"Legitimate / Fraudulent",
                    f:"amount, location, time, history"},
                ].map(ex=>(
                  <div key={ex.t} style={{...LCARD,padding:"12px 14px",marginBottom:8,
                    borderLeft:`3px solid ${ex.c}`}}>
                    <div style={{fontWeight:700,color:ex.c,fontSize:px(13)}}>{ex.e} {ex.t}</div>
                    <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                      <span style={{background:ex.c+"0d",border:`1px solid ${ex.c}33`,
                        borderRadius:20,padding:"3px 10px",fontSize:px(11),color:ex.c}}>
                        🏷 {ex.cls}
                      </span>
                      <span style={{fontSize:px(11),color:V.muted}}>X: {ex.f}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 — BINARY VS MULTI-CLASS ───────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Binary vs Multi-class","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Types of <span style={{color:"#c4b5fd"}}>Classification Problems</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              <div style={{background:ROSE+"0d",border:`2px solid ${ROSE}44`,borderRadius:18,padding:"24px"}}>
                <div style={{fontSize:px(40),marginBottom:10}}>⚖️</div>
                <div style={{fontWeight:900,color:ROSE,fontSize:px(18),marginBottom:8}}>Binary</div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  Exactly 2 classes. Output: 0 or 1. Uses sigmoid activation.
                  Loss: binary cross-entropy.
                </p>
                <Formula color={ROSE}>P(y=1|x) = σ(w·x + b)</Formula>
                {["Spam / Not Spam","Fraud / Legitimate","Cancer / Benign","Pass / Fail"].map(ex=>(
                  <div key={ex} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:ROSE}}/>
                    <span style={{fontSize:px(12),color:"#94a3b8"}}>{ex}</span>
                  </div>
                ))}
              </div>
              <div style={{background:TEAL+"0d",border:`2px solid ${TEAL}44`,borderRadius:18,padding:"24px"}}>
                <div style={{fontSize:px(40),marginBottom:10}}>🎯</div>
                <div style={{fontWeight:900,color:TEAL,fontSize:px(18),marginBottom:8}}>Multi-class</div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  3+ mutually exclusive classes. Uses softmax. Output: probability vector over all classes.
                </p>
                <Formula color={TEAL}>P(y=k|x) = softmax(Wx+b)[k]</Formula>
                {["Image: Cat/Dog/Bird/Car","Digit: 0–9","Language: EN/FR/DE/…","Flower: 3 species"].map(ex=>(
                  <div key={ex} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:TEAL}}/>
                    <span style={{fontSize:px(12),color:"#94a3b8"}}>{ex}</span>
                  </div>
                ))}
              </div>
              <div style={{background:PUR+"0d",border:`2px solid ${PUR}44`,borderRadius:18,padding:"24px"}}>
                <div style={{fontSize:px(40),marginBottom:10}}>🏷️</div>
                <div style={{fontWeight:900,color:PUR,fontSize:px(18),marginBottom:8}}>Multi-label</div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  Multiple classes simultaneously. One example can belong to many classes. Each class has its own sigmoid.
                </p>
                <Formula color={PUR}>P(yₖ=1|x) = σ(wₖ·x + bₖ)</Formula>
                {["Movie: Action + Comedy","Image: has-car + has-person","Article: sports + politics","Song: happy + upbeat + 90s"].map(ex=>(
                  <div key={ex} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                    <div style={{width:8,height:8,borderRadius:"50%",background:PUR}}/>
                    <span style={{fontSize:px(12),color:"#94a3b8"}}>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — SIGMOID ──────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · The Sigmoid Function",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              From Score to <span style={{color:PUR}}>Probability</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  A linear model computes a raw score z = w·x + b. This can be any
                  real number. But we need a <strong>probability between 0 and 1</strong>.
                  The sigmoid function is the bridge:
                </p>
                <Formula color={PUR}>σ(z) = 1 / (1 + e⁻ᶻ)</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Key properties: σ(0) = 0.5 (perfectly uncertain), σ(+∞) → 1 (certain class 1),
                  σ(−∞) → 0 (certain class 0). Output is always in (0, 1), making it a valid probability.
                </p>
                <IBox color={PUR} title="Why not just use z directly?"
                  body="z can be 1000 or −500. You can't interpret that as a probability. Sigmoid maps any z to [0,1]. This also creates a smooth, differentiable output — crucial for gradient descent during training. Without sigmoid, gradients would be zero almost everywhere."/>
              </div>
              <div>
                {[
                  {z:"−∞",s:"→ 0",i:"Completely not class 1",c:ROSE},
                  {z:"−3",s:"0.047",i:"5% chance class 1 — very likely class 0",c:ROSE},
                  {z:"−1",s:"0.269",i:"27% chance class 1",c:AMB},
                  {z:"0",s:"0.500",i:"Exactly 50/50 — the decision boundary",c:PUR},
                  {z:"+1",s:"0.731",i:"73% chance class 1",c:TEAL},
                  {z:"+3",s:"0.953",i:"95% chance class 1 — very likely class 1",c:TEAL},
                  {z:"+∞",s:"→ 1",i:"Completely certain class 1",c:TEAL},
                ].map(row=>(
                  <div key={row.z} style={{display:"flex",gap:12,alignItems:"center",
                    marginBottom:8,padding:"8px 12px",background:row.c+"08",
                    border:`1px solid ${row.c}22`,borderRadius:8}}>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:row.c,minWidth:28,
                      fontSize:px(12)}}>{row.z}</span>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:row.c,minWidth:44,
                      fontSize:px(12)}}>{row.s}</span>
                    <span style={{fontSize:px(12),color:V.muted}}>{row.i}</span>
                  </div>
                ))}
              </div>
            </div>
            <SigmoidViz/>
          </div>
        </div>

        {/* ── SECTION 4 — DECISION BOUNDARIES ─────────────────── */}
        <div ref={R(4)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Decision Boundaries","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Drawing the <span style={{color:"#c4b5fd"}}>Class Dividing Line</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(24)}}>
              The decision boundary is where σ(z) = 0.5, which means z = 0, which means
              w·x + b = 0. This is the surface that divides feature space into class regions.
              Adjust the threshold to move the boundary and see the accuracy change in real time.
            </p>
            <BoundaryViz/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",
              gap:px(16),marginTop:px(24)}}>
              {[
                {t:"Linear boundary",c:PUR,d:"Logistic regression: hyperplane (line in 2D, plane in 3D). Works when classes are linearly separable."},
                {t:"Polynomial boundary",c:TEAL,d:"Add polynomial features (x², x·y, …) to create curved boundaries while still using a linear model."},
                {t:"Non-linear boundary",c:AMB,d:"Neural networks, SVMs with RBF kernel, decision trees. Can learn complex, non-convex boundaries."},
                {t:"Soft boundary",c:ROSE,d:"SVM maximises the margin (gap) between classes. Points near the boundary (support vectors) define it."},
              ].map(b=>(
                <div key={b.t} style={{background:b.c+"0d",border:`1px solid ${b.c}33`,
                  borderRadius:12,padding:"16px"}}>
                  <div style={{fontWeight:700,color:b.c,fontSize:px(13),marginBottom:6}}>{b.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — PYTHON EXAMPLE ───────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Python Example",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Code It with <span style={{color:PUR}}>Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#c4b5fd" lines={[
                  "from sklearn.linear_model import LogisticRegression",
                  "from sklearn.metrics import classification_report",
                  "import numpy as np",
                  "",
                  "# Dataset: feature x → binary class (0 or 1)",
                  "X = np.array([[1],[2],[3],[4],[5],[6]])",
                  "y = np.array([0, 0, 0, 1, 1, 1])",
                  "",
                  "# Train logistic regression model",
                  "model = LogisticRegression()",
                  "model.fit(X, y)",
                  "",
                  "# Predict class label",
                  "print(model.predict([[2.5]]))     # → [0]",
                  "print(model.predict([[4.0]]))     # → [1]",
                  "",
                  "# Get probability estimates",
                  "proba = model.predict_proba([[3.5]])",
                  "print(proba)  # [[P(0), P(1)]]",
                  "              # [[0.38, 0.62]] → class 1",
                  "",
                  "# Full evaluation on training data",
                  "y_pred = model.predict(X)",
                  "print(classification_report(y, y_pred))",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"LogisticRegression().fit(X, y)",c:PUR,
                    d:"Trains logistic regression by minimising binary cross-entropy loss via gradient descent. Learns weights w and bias b."},
                  {l:"model.predict([[2.5]]) → [0]",c:ROSE,
                    d:"Predicts class label directly. Internally: compute z=w·x+b, apply sigmoid, return class 0 if σ<0.5, else class 1."},
                  {l:"model.predict_proba()",c:AMB,
                    d:"Returns [P(class=0), P(class=1)] for each sample. More informative than predict — lets you control the classification threshold."},
                  {l:"classification_report()",c:TEAL,
                    d:"Prints precision, recall, F1-score, and support for each class. Use this over accuracy for imbalanced datasets."},
                  {l:"model.coef_[0] → weights",c:GRN,
                    d:"The learned weight vector w. Positive weight for feature i means that feature pushes toward class 1."},
                  {l:"model.intercept_ → bias b",c:SKY,
                    d:"The learned bias/intercept. Together with coef_, fully defines the decision boundary: w·x + b = 0."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:10,padding:"12px 16px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,
                      fontSize:px(11),marginBottom:5}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 6 — EVALUATION ───────────────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Evaluation Metrics","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Measuring <span style={{color:"#c4b5fd"}}>Classification Quality</span>
            </h2>
            <div style={{...LCARD,background:"#1e1b4b",border:`1px solid ${PUR}33`,marginBottom:px(24)}}>
              <div style={{fontWeight:700,color:"#c4b5fd",marginBottom:12,fontSize:px(14)}}>
                🟦 The Confusion Matrix
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:400,margin:"0 auto"}}>
                {[
                  {bg:GRN+"22",border:GRN,label:"True Positive (TP)",desc:"Spam correctly identified as spam"},
                  {bg:ROSE+"22",border:ROSE,label:"False Positive (FP)",desc:"Ham incorrectly called spam (Type I error)"},
                  {bg:AMB+"22",border:AMB,label:"False Negative (FN)",desc:"Spam missed — called ham (Type II error)"},
                  {bg:TEAL+"22",border:TEAL,label:"True Negative (TN)",desc:"Ham correctly identified as ham"},
                ].map(cell=>(
                  <div key={cell.label} style={{background:cell.bg,border:`2px solid ${cell.border}`,
                    borderRadius:12,padding:"14px",textAlign:"center"}}>
                    <div style={{fontWeight:800,color:cell.border,fontSize:px(13),marginBottom:6}}>{cell.label}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{cell.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {m:"Accuracy",f:"(TP+TN)/(TP+TN+FP+FN)",c:PUR,
                  d:"Overall % correct. Misleading when classes are imbalanced (99% negative → predict all negative → 99% accuracy with 0 effort)."},
                {m:"Precision",f:"TP / (TP + FP)",c:ROSE,
                  d:"Of all positives predicted, how many were truly positive? High precision = low false alarm rate. Key when false positives are costly (e.g. wrongly blocking a good email)."},
                {m:"Recall (Sensitivity)",f:"TP / (TP + FN)",c:TEAL,
                  d:"Of all actual positives, how many did we find? High recall = low miss rate. Key when false negatives are costly (e.g. missing a cancer diagnosis)."},
                {m:"F1 Score",f:"2·P·R / (P + R)",c:AMB,
                  d:"Harmonic mean of precision and recall. Balances both. Use F1 when you need both high precision AND high recall — the default for imbalanced classification."},
              ].map(row=>(
                <div key={row.m} style={{background:row.c+"0d",border:`1px solid ${row.c}33`,
                  borderRadius:12,padding:"18px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <span style={{fontWeight:800,color:row.c,fontSize:px(15)}}>{row.m}</span>
                    <span style={{fontFamily:"monospace",background:row.c+"0d",
                      border:`1px solid ${row.c}44`,borderRadius:6,padding:"3px 10px",
                      fontSize:px(11),color:row.c}}>{row.f}</span>
                  </div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{row.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — APPLICATIONS ─────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Real Applications",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Classification <span style={{color:PUR}}>Everywhere</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"💳",c:PUR,t:"Fraud Detection",
                  b:"Banks classify each transaction as legitimate or fraudulent in <50ms. Visa processes 24,000 transactions/second with ML classifiers. False positives (blocking good transactions) and false negatives (missing fraud) both cost money — a careful F1 optimisation problem.",
                  tech:"XGBoost, Neural Net, Isolation Forest"},
                {e:"🩺",c:ROSE,t:"Medical Diagnosis",
                  b:"Classify chest X-rays as pneumonia/normal, classify skin lesions as benign/malignant. False negatives (missing cancer) are catastrophic → optimise for recall. CheXNet achieves radiologist-level performance using CNN trained on 100,000+ labeled X-rays.",
                  tech:"CNN / DenseNet / Vision Transformer"},
                {e:"🖼️",c:TEAL,t:"Image Classification",
                  b:"ImageNet (1,000 classes) models like ResNet, EfficientNet, and ViT classify photos in milliseconds. These form the backbone of face recognition, autonomous driving object detection, and content moderation. ResNet-50 achieves 76% top-1 accuracy on 1.2M images.",
                  tech:"ResNet, EfficientNet, ViT, CLIP"},
              ].map(a=>(
                <div key={a.t} style={{...LCARD,borderTop:`4px solid ${a.c}`}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:12}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:"#f8fafc",borderRadius:8,
                    padding:"8px 12px",fontSize:px(11),color:a.c,borderLeft:`3px solid ${a.c}`}}>
                    {a.tech}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 8 — GAME ─────────────────────────────────── */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Mini Game",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Draw the Decision Boundary</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Position the decision boundary to separate the spam (red) from ham (green) data points.
              This is what logistic regression automatically learns during training.
              The closer your boundary to optimal, the higher your accuracy.
            </p>
            <DrawBoundaryGame/>
          </div>
        </div>

        {/* ── SECTION 9 — MINI PROJECT ─────────────────────────── */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Project",PUR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Live Spam <span style={{color:PUR}}>Classifier</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A logistic regression model with real learned weights. Adjust email features
              to see how the sigmoid transforms z into a spam probability.
              Explore how each feature weight contributes to the final classification.
            </p>
            <SpamClassifier/>
          </div>
        </div>

        {/* ── SECTION 10 — INSIGHTS ────────────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <ClsTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default ClassificationPage;
