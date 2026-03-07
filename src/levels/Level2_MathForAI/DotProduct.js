import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — DOT PRODUCT
   Level 2 · Math for AI · Lesson 2 of 5
   Accent: Violet #7c3aed
══════════════════════════════════════════════════════════════════ */

const VIO  = "#7c3aed";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const AMB  = "#d97706";
const SKY  = "#0284c7";
const GRN  = "#059669";

/* ── shared atoms ─────────────────────────────────────────────── */
const Formula = ({ children, color = VIO }) => (
  <div style={{ background: color + "0d", border: `1px solid ${color}44`,
    borderRadius: px(14), padding: "18px 24px", fontFamily: "monospace",
    fontSize: px(15), color, fontWeight: 700, textAlign: "center",
    margin: `${px(16)} 0` }}>{children}</div>
);
const Step = ({ n, label, children, color = VIO }) => (
  <div style={{ display: "flex", gap: 16, marginBottom: px(20) }}>
    <div style={{ width: 36, height: 36, borderRadius: "50%", background: color + "22",
      border: `2px solid ${color}`, display: "flex", alignItems: "center",
      justifyContent: "center", fontSize: px(14), fontWeight: 800, color, flexShrink: 0 }}>{n}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 700, color: V.ink, marginBottom: 4, fontSize: px(14) }}>{label}</div>
      <div style={{ ...LBODY, fontSize: px(14) }}>{children}</div>
    </div>
  </div>
);
const CodeBox = ({ lines, color = TEAL }) => (
  <div style={{ fontFamily: "monospace", background: "#0d0a2a", borderRadius: px(10),
    padding: "14px 18px", fontSize: px(13), lineHeight: 1.9, marginTop: px(10) }}>
    {lines.map((l, i) => (
      <div key={i} style={{ color: l.startsWith("#") ? "#475569" : color }}>{l}</div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — two animated vectors with live dot-product readout
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W, H, raf, t = 0;
    const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const arrowHead = (x2, y2, ang, col) => {
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 14 * Math.cos(ang - 0.4), y2 - 14 * Math.sin(ang - 0.4));
      ctx.lineTo(x2 - 14 * Math.cos(ang + 0.4), y2 - 14 * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    };
    const arrow = (x1, y1, x2, y2, col, lw = 2.5) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.stroke();
      arrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1), col);
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#080d1a"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(124,58,237,0.07)"; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(124,58,237,0.22)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,H/2); ctx.lineTo(W,H/2); ctx.stroke();
      const cx = W/2, cy = H/2, len = Math.min(W,H)*0.3;
      const a1 = t*0.28, a2 = t*0.43+1.1;
      const ax = cx+Math.cos(a1)*len, ay = cy+Math.sin(a1)*len;
      const bx = cx+Math.cos(a2)*len, by = cy+Math.sin(a2)*len;
      const dp = Math.cos(a1)*Math.cos(a2)+Math.sin(a1)*Math.sin(a2);
      const proj = dp*len;
      const px2 = cx+Math.cos(a1)*proj, py2 = cy+Math.sin(a1)*proj;
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(px2,py2);
      ctx.strokeStyle = AMB+"66"; ctx.lineWidth=1.5; ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(px2,py2,5,0,Math.PI*2); ctx.fillStyle=AMB+"cc"; ctx.fill();
      ctx.beginPath(); ctx.arc(cx,cy,40,Math.min(a1,a2),Math.max(a1,a2));
      ctx.strokeStyle=TEAL+"88"; ctx.lineWidth=2; ctx.stroke();
      arrow(cx,cy,ax,ay,VIO,3); arrow(cx,cy,bx,by,TEAL,3);
      [[ax,ay,VIO],[bx,by,TEAL]].forEach(([x,y,col])=>{
        const g=ctx.createRadialGradient(x,y,0,x,y,20);
        g.addColorStop(0,col+"66"); g.addColorStop(1,col+"00");
        ctx.beginPath(); ctx.arc(x,y,20,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fillStyle=col; ctx.fill();
      });
      ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillStyle=VIO;  ctx.fillText("a",ax+14*Math.cos(a1),ay+14*Math.sin(a1));
      ctx.fillStyle=TEAL; ctx.fillText("b",bx+14*Math.cos(a2),by+14*Math.sin(a2));
      ctx.fillStyle=TEAL+"cc"; ctx.font="11px sans-serif";
      ctx.fillText("θ",cx+54*Math.cos((a1+a2)/2),cy+54*Math.sin((a1+a2)/2));
      ctx.font="bold 12px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.45)"; ctx.textAlign="center";
      ctx.fillText("a · b = "+dp.toFixed(3),W/2,H-18);
      t+=0.005; raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, []);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}} />;
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 3 — Interactive Geometric Visualizer
══════════════════════════════════════════════════════════════════ */
const GeometricViz = () => {
  const canvasRef = useRef();
  const [aAngle, setAAngle] = useState(30);
  const [bAngle, setBAngle] = useState(75);
  const [aLen,   setALen]   = useState(5);
  const [bLen,   setBLen]   = useState(4);

  const redraw = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.offsetWidth, H = c.height = c.offsetHeight;
    const cx = W/2, cy = H/2, scale = Math.min(W,H)/14;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f8f7ff"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#ede9fe"; ctx.lineWidth=1;
    for(let x=cx%scale;x<W;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=cy%scale;y<H;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle=VIO+"44"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    ctx.font="10px sans-serif"; ctx.fillStyle=VIO+"66"; ctx.textAlign="center";
    for(let i=-6;i<=6;i++){if(i!==0)ctx.fillText(i,cx+i*scale,cy+13);}
    const aR=aAngle*Math.PI/180, bR=bAngle*Math.PI/180;
    const ax=Math.cos(aR)*aLen, ay=Math.sin(aR)*aLen;
    const bx=Math.cos(bR)*bLen, by=Math.sin(bR)*bLen;
    const dp=ax*bx+ay*by, cosT=dp/(aLen*bLen);
    const theta=Math.acos(Math.max(-1,Math.min(1,cosT)));
    const projLen=dp/aLen;
    const projX=cx+(ax/aLen)*projLen*scale, projY=cy-(ay/aLen)*projLen*scale;
    ctx.beginPath(); ctx.moveTo(cx+bx*scale,cy-by*scale); ctx.lineTo(projX,projY);
    ctx.strokeStyle=AMB+"99"; ctx.lineWidth=1.5; ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(projX,projY,5,0,Math.PI*2); ctx.fillStyle=AMB+"cc"; ctx.fill();
    ctx.font="bold 11px sans-serif"; ctx.fillStyle=AMB; ctx.textAlign="left";
    ctx.fillText("proj = "+projLen.toFixed(2),projX+8,projY-5);
    const arcA=-bR, arcB=-aR;
    ctx.beginPath(); ctx.arc(cx,cy,38,Math.min(arcA,arcB),Math.max(arcA,arcB));
    ctx.strokeStyle=TEAL+"99"; ctx.lineWidth=2; ctx.stroke();
    ctx.font="11px sans-serif"; ctx.fillStyle=TEAL; ctx.textAlign="center";
    ctx.fillText("θ",cx+52*Math.cos(-(aR+bR)/2),cy+52*Math.sin(-(aR+bR)/2));
    const arrow=(x1,y1,x2,y2,col,lw=2.5)=>{
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
      ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();
      const ang=Math.atan2(y2-y1,x2-x1);
      ctx.beginPath();ctx.moveTo(x2,y2);
      ctx.lineTo(x2-11*Math.cos(ang-0.4),y2-11*Math.sin(ang-0.4));
      ctx.lineTo(x2-11*Math.cos(ang+0.4),y2-11*Math.sin(ang+0.4));
      ctx.closePath();ctx.fillStyle=col;ctx.fill();
    };
    arrow(cx,cy,cx+ax*scale,cy-ay*scale,VIO,3);
    arrow(cx,cy,cx+bx*scale,cy-by*scale,TEAL,3);
    ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle=VIO+"aa";ctx.fill();
    ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
    ctx.fillStyle=VIO;  ctx.fillText("a",cx+ax*scale+14*Math.cos(aR),cy-ay*scale-14*Math.sin(aR));
    ctx.fillStyle=TEAL; ctx.fillText("b",cx+bx*scale+14*Math.cos(bR),cy-by*scale-14*Math.sin(bR));
    const dpColor=dp>0.01?GRN:dp<-0.01?ROSE:"#64748b";
    ctx.fillStyle="#ffffffee";
    ctx.beginPath();ctx.roundRect(10,10,200,104,10);ctx.fill();
    ctx.strokeStyle=VIO+"33";ctx.lineWidth=1;ctx.stroke();
    ctx.font="bold 12px monospace";ctx.textAlign="left";
    ctx.fillStyle=VIO;  ctx.fillText("a · b = "+dp.toFixed(3),20,34);
    ctx.fillStyle=TEAL; ctx.fillText("θ = "+(theta*180/Math.PI).toFixed(1)+"°",20,54);
    ctx.fillStyle=AMB;  ctx.fillText("cos θ = "+cosT.toFixed(3),20,74);
    ctx.fillStyle=dpColor;
    ctx.fillText(dp>0.01?"▲ Similar direction":dp<-0.01?"▼ Opposite":"⊥ Orthogonal!",20,94);
  },[aAngle,bAngle,aLen,bLen]);

  useEffect(()=>{redraw();},[redraw]);

  const Ctrl=({label,val,set,min,max,step=1,color})=>(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:px(12),color:V.muted}}>{label}</span>
        <span style={{fontSize:px(12),fontWeight:700,color}}>{val}{label.includes("angle")?"°":""}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:color}}/>
    </div>
  );

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(15)}}>
        🎨 Interactive Dot Product Visualizer
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Drag sliders to change vector angles and magnitudes. The dashed line shows
        the <strong>projection of b onto a</strong>. The panel updates live.
      </p>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef}
            style={{width:"100%",height:320,borderRadius:12,
              border:`1px solid ${VIO}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 200px"}}>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:px(12),fontWeight:700,color:VIO,marginBottom:8}}>VECTOR a</div>
            <Ctrl label="a angle (degrees)" val={aAngle} set={setAAngle} min={-180} max={180} color={VIO}/>
            <Ctrl label="a magnitude" val={aLen} set={setALen} min={1} max={6} step={0.5} color={VIO}/>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:px(12),fontWeight:700,color:TEAL,marginBottom:8}}>VECTOR b</div>
            <Ctrl label="b angle (degrees)" val={bAngle} set={setBAngle} min={-180} max={180} color={TEAL}/>
            <Ctrl label="b magnitude" val={bLen} set={setBLen} min={1} max={6} step={0.5} color={TEAL}/>
          </div>
          <div style={{fontSize:px(11),fontWeight:700,color:V.muted,marginBottom:6,letterSpacing:"1px"}}>QUICK PRESETS</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[["Parallel (0°)",0,0,"max similarity"],["45° apart",0,45,"partial"],
              ["Orthogonal (90°)",0,90,"dot product = 0"],["Opposite (180°)",0,180,"minimum, negative"]
            ].map(([l,a,b,h])=>(
              <button key={l} onClick={()=>{setAAngle(a);setBAngle(b);}}
                style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:7,
                  padding:"6px 10px",fontSize:px(11),cursor:"pointer",
                  color:VIO,fontWeight:600,textAlign:"left"}}>
                {l} <span style={{color:V.muted,fontWeight:400}}>— {h}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 4 — Animated Step-by-Step Calculator
══════════════════════════════════════════════════════════════════ */
const StepCalc = () => {
  const [aVec, setAVec] = useState([2,3]);
  const [bVec, setBVec] = useState([4,5]);
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(false);
  const TOTAL = 5;
  const products = aVec.map((v,i)=>v*bVec[i]);
  const result   = products.reduce((s,v)=>s+v,0);

  useEffect(()=>{
    if(!auto)return;
    if(step>=TOTAL){setAuto(false);return;}
    const id=setTimeout(()=>setStep(s=>s+1),900);
    return()=>clearTimeout(id);
  },[auto,step]);

  const reset=()=>{setStep(0);setAuto(false);};

  const CellEdit=({label,vec,setVec,color})=>(
    <div>
      <div style={{fontSize:px(12),fontWeight:700,color,marginBottom:6}}>{label}</div>
      <div style={{display:"flex",gap:6}}>
        {vec.map((v,i)=>(
          <input key={i} type="number" value={v}
            onChange={e=>{const n=[...vec];n[i]=isNaN(+e.target.value)?0:+e.target.value;setVec(n);reset();}}
            style={{width:48,height:44,borderRadius:8,border:`1px solid ${color}44`,
              background:color+"0d",textAlign:"center",fontFamily:"monospace",
              fontSize:px(16),fontWeight:700,color,outline:"none"}}/>
        ))}
      </div>
    </div>
  );

  const STEPS=[
    {label:"Write the formula",
     content:<span style={{fontFamily:"monospace",fontSize:px(16),color:VIO}}>a · b = a₁×b₁ + a₂×b₂</span>},
    {label:"Substitute values",
     content:<span style={{fontFamily:"monospace",fontSize:px(16),color:VIO}}>a · b = {aVec[0]}×{bVec[0]} + {aVec[1]}×{bVec[1]}</span>},
    {label:"Multiply each pair",
     content:(
       <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
         {products.map((p,i)=>(
           <div key={i} style={{background:AMB+"0d",border:`1px solid ${AMB}44`,
             borderRadius:8,padding:"6px 14px",fontFamily:"monospace",
             fontSize:px(15),color:AMB,fontWeight:700}}>
             {aVec[i]} × {bVec[i]} = <strong>{p}</strong>
           </div>
         ))}
       </div>
     )},
    {label:"Sum all products",
     content:<span style={{fontFamily:"monospace",fontSize:px(16),color:VIO}}>{products.join(" + ")} = {result}</span>},
    {label:"Final answer",
     content:(
       <div style={{background:VIO+"0d",border:`2px solid ${VIO}66`,borderRadius:12,
         padding:"12px 20px",display:"inline-flex",alignItems:"center",gap:10}}>
         <span style={{fontSize:px(28)}}>🎯</span>
         <span style={{fontFamily:"monospace",fontSize:px(22),fontWeight:900,color:VIO}}>a · b = {result}</span>
       </div>
     )},
  ];

  return (
    <div style={{...LCARD,background:"#faf8ff",border:`2px solid ${VIO}22`}}>
      <div style={{fontWeight:800,color:VIO,fontSize:px(16),marginBottom:4}}>
        🔢 Step-by-Step Calculator — edit any value
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Change <strong>a</strong> and <strong>b</strong> to any numbers, then step through the calculation.
      </p>
      <div style={{display:"flex",gap:24,marginBottom:24,flexWrap:"wrap"}}>
        <CellEdit label="a = [  ]" vec={aVec} setVec={setAVec} color={VIO}/>
        <CellEdit label="b = [  ]" vec={bVec} setVec={setBVec} color={TEAL}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:24}}>
        {STEPS.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",
            opacity:step>i?1:0.18,transition:"opacity 0.4s,transform 0.4s",
            transform:step>i?"translateY(0)":"translateY(8px)"}}>
            <div style={{width:30,height:30,borderRadius:"50%",flexShrink:0,
              background:step>i?VIO:"#e2e8f0",border:`2px solid ${step>i?VIO:"#cbd5e1"}`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:px(12),fontWeight:800,color:step>i?"#fff":"#94a3b8",
              transition:"all 0.4s"}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,color:V.ink,fontSize:px(13),marginBottom:6}}>
                Step {i+1}: {s.label}
              </div>
              {s.content}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <button onClick={()=>setStep(s=>Math.min(s+1,TOTAL))} disabled={step>=TOTAL}
          style={{background:VIO,border:"none",borderRadius:9,padding:"9px 22px",
            color:"#fff",fontWeight:700,fontSize:px(13),
            cursor:step>=TOTAL?"not-allowed":"pointer",opacity:step>=TOTAL?0.45:1}}>
          Next Step →
        </button>
        <button onClick={()=>{reset();setTimeout(()=>setAuto(true),100);}}
          style={{background:TEAL+"22",border:`1px solid ${TEAL}44`,borderRadius:9,
            padding:"9px 22px",color:TEAL,fontWeight:700,fontSize:px(13),cursor:"pointer"}}>
          ▶ Auto Play
        </button>
        <button onClick={reset}
          style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:9,
            padding:"9px 22px",color:V.muted,fontWeight:600,fontSize:px(13),cursor:"pointer"}}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 8 — Vector Similarity Game
══════════════════════════════════════════════════════════════════ */
const SimilarityGame = () => {
  const canvasRef = useRef();
  const [angle,  setAngle]  = useState(45);
  const [score,  setScore]  = useState(0);
  const [best,   setBest]   = useState(0);
  const [locked, setLocked] = useState(false);
  const [msg,    setMsg]    = useState("");
  const FIXED_LEN=5, MOV_LEN=4;
  const dp    = Math.cos(angle*Math.PI/180)*FIXED_LEN*MOV_LEN;
  const maxDp = FIXED_LEN*MOV_LEN;
  const simPct= (((dp/maxDp)+1)/2*100).toFixed(1);

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const cx=W/2,cy=H/2,scale=Math.min(W,H)/14;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0d0a2a";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="rgba(124,58,237,0.1)";ctx.lineWidth=1;
    for(let x=cx%scale;x<W;x+=scale){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=cy%scale;y<H;y+=scale){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle="rgba(124,58,237,0.3)";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    const arrow=(ex,ey,col,lw=3)=>{
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);
      ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();
      const ang=Math.atan2(ey-cy,ex-cx);
      ctx.beginPath();ctx.moveTo(ex,ey);
      ctx.lineTo(ex-12*Math.cos(ang-0.4),ey-12*Math.sin(ang-0.4));
      ctx.lineTo(ex-12*Math.cos(ang+0.4),ey-12*Math.sin(ang+0.4));
      ctx.closePath();ctx.fillStyle=col;ctx.fill();
    };
    arrow(cx+FIXED_LEN*scale,cy,VIO);
    ctx.font="bold 13px sans-serif";ctx.fillStyle=VIO;ctx.textAlign="center";
    ctx.fillText("a (fixed)",cx+FIXED_LEN*scale+26,cy-14);
    const bRad=angle*Math.PI/180;
    const bex=cx+Math.cos(bRad)*MOV_LEN*scale, bey=cy-Math.sin(bRad)*MOV_LEN*scale;
    const bCol=dp>maxDp*0.8?"#10b981":dp>0?TEAL:dp>-maxDp*0.5?AMB:ROSE;
    arrow(bex,bey,bCol);
    ctx.fillStyle=bCol;
    ctx.fillText("b (yours)",bex+14*Math.cos(bRad),bey-14*Math.sin(bRad));
    const barW=160,barH=14,barX=W/2-barW/2,barY=H-36;
    ctx.fillStyle="#1e1b4b";ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,7);ctx.fill();
    const fill=Math.max(0,(dp/maxDp)*barW);
    if(fill>0){ctx.fillStyle=dp>0?"#10b981":ROSE;ctx.beginPath();ctx.roundRect(barX,barY,fill,barH,7);ctx.fill();}
    ctx.font="bold 11px sans-serif";ctx.fillStyle="rgba(255,255,255,0.6)";ctx.textAlign="center";
    ctx.fillText("a · b = "+dp.toFixed(2)+"  /  max = "+maxDp,W/2,barY-6);
  },[angle,dp]);

  useEffect(()=>{redraw();},[redraw]);

  const lockIn=()=>{
    const s=+dp.toFixed(2);
    if(s>best){setBest(s);setScore(sc=>sc+Math.round(s*10));setMsg("🎉 New best! "+s.toFixed(2));}
    else setMsg("Scored "+s.toFixed(2)+" (best: "+best.toFixed(2)+")");
    setLocked(true);
    setTimeout(()=>{setMsg("");setLocked(false);},2200);
  };

  return (
    <div style={{...LCARD,background:"#080d1a",border:`2px solid ${VIO}33`}}>
      <div style={{fontWeight:800,color:"#c4b5fd",fontSize:px(17),marginBottom:8}}>
        🎮 Vector Similarity Game
      </div>
      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:16}}>
        Rotate <strong style={{color:TEAL}}>b</strong> to maximise its dot product
        with the fixed vector <strong style={{color:VIO}}>a</strong>.
        Parallel = max score. Press <strong style={{color:"#c4b5fd"}}>Lock In!</strong> to bank your score.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef}
            style={{width:"100%",height:290,borderRadius:12,border:`1px solid ${VIO}22`,display:"block"}}/>
          {msg&&<div style={{background:dp>0?"#05966911":ROSE+"11",
            border:`1px solid ${dp>0?"#059669":ROSE}44`,
            borderRadius:8,padding:"8px 14px",marginTop:8,
            color:dp>0?"#059669":ROSE,fontWeight:700,fontSize:px(13)}}>{msg}</div>}
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:"#94a3b8"}}>b angle: <strong style={{color:TEAL}}>{angle}°</strong></span>
            </div>
            <input type="range" min={-180} max={180} value={angle}
              onChange={e=>setAngle(+e.target.value)} style={{width:"100%",accentColor:TEAL}}/>
          </div>
          <div style={{background:"#1e1b4b",borderRadius:10,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#94a3b8",lineHeight:2.1}}>
              <div>θ: <span style={{color:TEAL}}>{angle}°</span></div>
              <div>cos θ: <span style={{color:AMB}}>{Math.cos(angle*Math.PI/180).toFixed(3)}</span></div>
              <div>a · b: <span style={{color:dp>0?"#10b981":ROSE,fontWeight:700}}>{dp.toFixed(3)}</span></div>
              <div>Similarity: <span style={{color:"#c4b5fd",fontWeight:700}}>{simPct}%</span></div>
            </div>
          </div>
          <button onClick={lockIn} disabled={locked}
            style={{background:locked?VIO+"55":VIO,border:"none",borderRadius:10,
              padding:"12px",color:"#fff",fontWeight:800,fontSize:px(14),
              cursor:locked?"not-allowed":"pointer",transition:"all 0.2s"}}>
            🔒 Lock In!
          </button>
          <div style={{background:"#1e1b4b",borderRadius:10,padding:"12px"}}>
            <div style={{fontSize:px(11),color:"#64748b",fontWeight:700,marginBottom:4}}>SESSION</div>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#94a3b8"}}>
              <div>Best: <span style={{color:"#10b981",fontWeight:700}}>{best.toFixed(2)}</span></div>
              <div>Points: <span style={{color:"#c4b5fd",fontWeight:700}}>{score}</span></div>
            </div>
          </div>
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:8,
            padding:"10px 12px",fontSize:px(11),color:"#c4b5fd",lineHeight:1.7}}>
            <strong>Key:</strong> θ=0° → max. θ=90° → zero. θ=180° → minimum (negative).
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 9 — Properties Explorer
══════════════════════════════════════════════════════════════════ */
const PropertiesSection = () => {
  const [active, setActive] = useState(0);
  const PROPS = [
    { t:"Commutative", c:VIO,
      f:"a · b = b · a",
      ex:"[2,3]·[4,5] = 8+15 = 23\n[4,5]·[2,3] = 8+15 = 23 ✓",
      desc:"Order of the two vectors doesn't matter. You can swap them and the result is identical. Unlike matrix multiplication, which is NOT commutative.",
      ai:"This is why similarity(doc_A, query) = similarity(query, doc_A) in vector search — order of comparison doesn't change the score." },
    { t:"Distributive", c:TEAL,
      f:"a · (b + c) = a·b + a·c",
      ex:"a·([1,2]+[3,4]) = a·[4,6]\n= a·[1,2] + a·[3,4]",
      desc:"Dot product distributes over vector addition. This allows you to expand and simplify expressions involving sums of vectors.",
      ai:"Critical for deriving backpropagation equations. When computing ∂Loss/∂w, the distributive property lets you split the gradient sum." },
    { t:"Scalar Multiplication", c:AMB,
      f:"(ca) · b = c(a · b)",
      ex:"(2·[1,2])·[3,4]\n= [2,4]·[3,4] = 6+16 = 22\n= 2×(1×3 + 2×4) = 2×11 = 22 ✓",
      desc:"A scalar multiplier can be pulled out from either vector. Scaling one vector scales the dot product by the same factor.",
      ai:"Used in attention scaling in transformers: QKᵀ / √d_k. Dividing by √d pulls the scalar out of the dot product to control gradient magnitude." },
    { t:"Self Dot Product", c:ROSE,
      f:"a · a = ||a||²",
      ex:"[3,4]·[3,4] = 9+16 = 25\n= 5² = ||[3,4]||² ✓",
      desc:"A vector dotted with itself equals the square of its magnitude. This is how L2 norm is defined via dot product.",
      ai:"L2 regularisation (weight decay): loss += λ·(w·w). Penalising large weights is literally adding the self-dot-product to the loss function." },
    { t:"Zero Vector", c:GRN,
      f:"a · 0 = 0",
      ex:"[3,4]·[0,0] = 0+0 = 0",
      desc:"Any vector dotted with the zero vector gives 0. The zero vector is orthogonal to every vector in the space.",
      ai:"After a ReLU activation, neurons that fire 0 have no contribution to the dot product in the next layer. Dead neurons literally produce zero dot products." },
    { t:"NOT Associative", c:"#f97316",
      f:"(a · b) · c is UNDEFINED",
      ex:"a·b gives a scalar — you\ncannot dot a scalar with c.",
      desc:"The dot product collapses two vectors into one number. You cannot chain dot products the way you chain scalar multiplication.",
      ai:"A very common bug in ML code: shape mismatch errors often come from accidentally trying to dot a scalar result with a vector. Always check your tensor shapes." },
  ];
  const p = PROPS[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:12,fontSize:px(15)}}>⚙️ Dot Product Properties Explorer</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        {PROPS.map((pr,i)=>(
          <button key={i} onClick={()=>setActive(i)}
            style={{background:i===active?pr.c:V.cream,border:`1px solid ${i===active?pr.c:V.border}`,
              borderRadius:20,padding:"5px 14px",fontSize:px(12),fontWeight:700,
              color:i===active?"#fff":V.muted,cursor:"pointer",transition:"all 0.2s"}}>
            {pr.t}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),flexWrap:"wrap"}}>
        <div>
          <Formula color={p.c}>{p.f}</Formula>
          <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",
            fontFamily:"monospace",fontSize:px(13),color:"#334155",
            whiteSpace:"pre-line",lineHeight:1.8,marginBottom:12}}>{p.ex}</div>
          <p style={{...LBODY,fontSize:px(14)}}>{p.desc}</p>
        </div>
        <div style={{background:p.c+"0d",border:`1px solid ${p.c}33`,borderRadius:12,padding:"20px"}}>
          <div style={{fontWeight:700,color:p.c,fontSize:px(12),marginBottom:10,letterSpacing:"1px"}}>
            🤖 WHY AI CARES ABOUT THIS
          </div>
          <p style={{...LBODY,fontSize:px(14),margin:0}}>{p.ai}</p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 10 — Key Insights Checklist
══════════════════════════════════════════════════════════════════ */
const DotTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d=>({...d,[i]:!d[i]}));
  const items = [
    {e:"🤝",c:VIO,  t:"a·b = a₁b₁ + a₂b₂ + … + aₙbₙ. Multiply matching pairs, add everything up. Result is ONE scalar number."},
    {e:"📐",c:TEAL, t:"Geometrically: a·b = |a||b|cosθ. The dot product encodes the angle between two vectors."},
    {e:"⊥", c:ROSE, t:"If a·b = 0, the vectors are orthogonal (perpendicular). Zero shared direction."},
    {e:"↑", c:AMB,  t:"Maximum dot product at θ=0° (parallel). Minimum (most negative) at θ=180° (opposite)."},
    {e:"🧠",c:VIO,  t:"Every neuron computes one dot product: output = w·x + b. Neural networks are stacks of dot products."},
    {e:"🔍",c:TEAL, t:"Cosine similarity = a·b / (|a||b|). Normalises to [−1,1]. Used in search, RAG, and recommendations."},
    {e:"🔀",c:ROSE, t:"Transformer attention = softmax(QKᵀ/√d)·V. The QKᵀ term is a matrix of dot products between every query and key."},
    {e:"✅",c:AMB,  t:"Commutative: a·b = b·a. Distributive: a·(b+c) = a·b + a·c. Scalar: (ca)·b = c(a·b)."},
  ];
  const cnt = Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",VIO)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
        What You Now <span style={{color:VIO}}>Know</span>
      </h2>
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
        <div style={{fontSize:px(56),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),
          color:V.ink,marginBottom:16}}>{cnt}/8 concepts understood</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",
          maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${VIO},${TEAL})`,
            transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:VIO,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Gradient Descent →
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
   MAIN PAGE EXPORT
══════════════════════════════════════════════════════════════════ */
const DotProductPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Dot Product" lessonNum="Lesson 2 of 5"
    accent={VIO} levelLabel="Math for AI"
    dotLabels={["Hero","Simple","Math Def","Geometry","Step Calc",
                "Visual","AI Uses","Real Example","Game","Properties","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ───────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#150d30 60%,#0d0a2a 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden",position:"relative"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center",
            position:"relative",zIndex:1}}>
            <div>
              <button onClick={onBack}
                style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",
                  fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📐 Lesson 2 of 5 · Math for AI",VIO)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                The<br/><span style={{color:"#c4b5fd"}}>Dot Product</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:VIO,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                The dot product is the single most-used mathematical operation in all of AI.
                Every forward pass through a neural network, every attention score in a
                transformer, every semantic search query — all of them are dot products at their core.
              </p>
              <div style={{background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#c4b5fd",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 ONE LINE SUMMARY
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Multiply matching pairs of numbers from two vectors, sum them all up.
                  The result is one number that measures how much they point the same way.
                </p>
              </div>
            </div>
            <div style={{height:px(380),background:"rgba(124,58,237,0.06)",
              border:"1px solid rgba(124,58,237,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE DEFINITION ─────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Definition",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              What is the Dot Product —{" "}
              <span style={{color:VIO}}>Plain English</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"🤝",c:VIO,t:"A Similarity Score",
                  b:"Give it two vectors — it returns a single number measuring how much they point in the same direction. High positive → same way. Zero → perpendicular. Negative → opposite ways."},
                {e:"🎯",c:TEAL,t:"Multiply Then Sum",
                  b:"Take two lists of numbers. Multiply matching positions together. Add all results up. Two vectors in, one number out. That's literally everything it does."},
                {e:"📐",c:ROSE,t:"The Angle in Disguise",
                  b:"The result secretly encodes the cosine of the angle θ between the vectors: a·b = |a||b|cosθ. The angle is baked into the output number."},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{c.e}</div>
                  <h3 style={{fontWeight:800,color:c.c,fontSize:px(16),marginBottom:10}}>{c.t}</h3>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>{c.b}</p>
                </div>
              ))}
            </div>
            <IBox color={VIO} title="The Walking Analogy"
              body='Two people walking. The dot product of their velocity vectors measures how much they "move together". Same direction → large positive. Walking toward each other → negative. Perpendicular → zero.' />
          </div>
        </div>

        {/* ── SECTION 2 — MATHEMATICAL DEFINITION ───────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Mathematical Definition","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Formal <span style={{color:"#c4b5fd"}}>Formula</span>
            </h2>
            <Formula color="#c4b5fd">a · b = a₁b₁ + a₂b₂ + a₃b₃ + … + aₙbₙ</Formula>
            <Formula color={TEAL}>a · b = Σᵢ₌₁ⁿ aᵢbᵢ &nbsp;&nbsp;(compact summation form)</Formula>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
              gap:px(16),marginTop:px(28)}}>
              {[
                {s:"a, b",    c:VIO,  d:"Two input vectors. Must have identical dimension n — same number of elements."},
                {s:"aᵢ, bᵢ", c:TEAL, d:"The i-th element of each vector. Multiply the pair at position i together."},
                {s:"Σ",       c:AMB,  d:"Summation — add all n products a₁b₁, a₂b₂, …, aₙbₙ together."},
                {s:"n",       c:ROSE, d:"Dimension. The number of elements per vector. Both vectors must share the same n."},
                {s:"Result",  c:GRN,  d:"A scalar — one number. Not a vector. The entire information collapses to a single value."},
                {s:"Rule",    c:"#c4b5fd",d:"Dimensions must match. [1,2,3]·[4,5,6] ✓ &nbsp; [1,2,3]·[4,5] ✗ → shape error in code."},
              ].map(item=>(
                <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                  borderRadius:12,padding:"16px"}}>
                  <div style={{fontFamily:"monospace",fontSize:px(22),fontWeight:900,
                    color:item.c,marginBottom:6}}>{item.s}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — GEOMETRIC INTERPRETATION ──────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Geometric Interpretation",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Angles &amp; <span style={{color:VIO}}>Geometry</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  The dot product has a second form using the
                  <strong style={{color:V.ink}}> angle θ</strong> between the vectors:
                </p>
                <Formula color={VIO}>a · b = |a| × |b| × cos θ</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:20}}>
                  |a| and |b| are the magnitudes. θ is the angle between them at the origin.
                </p>
                <Step n="1" label="Parallel vectors — θ = 0°, cos θ = 1" color={VIO}>
                  Dot product = |a||b|. Maximum possible. Both arrows point identically.
                </Step>
                <Step n="2" label="Orthogonal vectors — θ = 90°, cos θ = 0" color={TEAL}>
                  Dot product = 0. The vectors are perpendicular — zero shared direction.
                </Step>
                <Step n="3" label="Opposite vectors — θ = 180°, cos θ = −1" color={ROSE}>
                  Dot product = −|a||b|. Minimum. Arrows point in exactly opposite directions.
                </Step>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:px(16)}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:12,fontSize:px(14)}}>
                    🎯 The Cosine Scale
                  </div>
                  {[["θ = 0°",  "+1.0","🟢 Identical direction — maximum",GRN],
                    ["θ = 45°", "+0.71","🟡 Partial similarity",           AMB],
                    ["θ = 90°", " 0.0", "⬜ Orthogonal — no relation",     "#64748b"],
                    ["θ = 135°","−0.71","🟠 Mostly opposite",              "#f97316"],
                    ["θ = 180°","−1.0", "🔴 Perfectly opposite — minimum", ROSE],
                  ].map(([ang,cos,label,col])=>(
                    <div key={ang} style={{display:"flex",alignItems:"center",gap:10,
                      padding:"8px 12px",background:col+"0d",border:`1px solid ${col}33`,
                      borderRadius:8,marginBottom:6}}>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:col,
                        minWidth:52,fontSize:px(12)}}>{ang}</span>
                      <span style={{fontFamily:"monospace",color:col,minWidth:48,fontSize:px(12)}}>{cos}</span>
                      <span style={{fontSize:px(12),color:V.muted}}>{label}</span>
                    </div>
                  ))}
                </div>
                <IBox color={TEAL} title="Projection Insight"
                  body="Geometrically, the dot product equals the length of the projection of b onto â (the unit direction of a), times |b|. This is why it appears in shadow calculations, lighting engines, and transformer attention — it measures 'how much of b falls along a'." />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — STEP-BY-STEP ───────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Step-by-Step Calculation","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Calculate It <span style={{color:"#c4b5fd"}}>One Step at a Time</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(28)}}>
              Default: a = [2, 3] and b = [4, 5]. Edit any cell to try your own numbers,
              then step through at your own pace.
            </p>
            <StepCalc/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),marginTop:px(24)}}>
              <div style={{background:"#1e1b4b",border:`1px solid ${VIO}44`,
                borderRadius:14,padding:"20px 24px"}}>
                <div style={{fontWeight:700,color:"#c4b5fd",marginBottom:10}}>🧩 Practice</div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:10}}>
                  Compute a·b: a = [1, 0, −1], b = [3, 4, 5]
                </p>
                <p style={{...LBODY,color:"#64748b",fontSize:px(13)}}>
                  (1×3)+(0×4)+(−1×5) = 3+0−5 = <strong style={{color:"#c4b5fd"}}>−2</strong>
                </p>
              </div>
              <div style={{background:"#1e1b4b",border:`1px solid ${TEAL}44`,
                borderRadius:14,padding:"20px 24px"}}>
                <div style={{fontWeight:700,color:TEAL,marginBottom:10}}>💻 Code</div>
                <CodeBox color="#67e8f9" lines={[
                  "# NumPy","import numpy as np",
                  "a = np.array([2, 3])","b = np.array([4, 5])",
                  "np.dot(a, b)  # → 23","","# PyTorch","import torch",
                  "torch.dot(torch.tensor([2.,3.]),","        torch.tensor([4.,5.]))  # → 23",
                ]}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — VISUALIZATION ──────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Visualization",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              See It <span style={{color:VIO}}>Live</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              The dashed line shows the <strong>projection of b onto a</strong>.
              The panel top-left shows a·b, θ, cos θ, and direction relationship in real time.
              Use quick presets to jump to the key special cases.
            </p>
            <GeometricViz/>
          </div>
        </div>

        {/* ── SECTION 6 — DOT PRODUCT IN AI ─────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Dot Product in AI","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Where AI <span style={{color:"#c4b5fd"}}>Uses It Every Day</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"🧠",t:"Neural Network Neurons",c:VIO,
                  b:"Every neuron computes output = w·x + b. The weight vector w is dotted with input x. A 512-neuron layer runs 512 dot products simultaneously — billions per second at inference.",
                  code:["# One neuron","output = dot(weights, inputs) + bias"]},
                {e:"📏",t:"Cosine Similarity",c:TEAL,
                  b:"Cosine_sim(a,b) = a·b / (|a||b|). Normalises to [−1,1] regardless of vector length. Powers semantic search engines, RAG retrieval, and document deduplication.",
                  code:["sim = dot(a,b) / (norm(a) * norm(b))"]},
                {e:"🎬",t:"Recommendation Systems",c:AMB,
                  b:"Each user = vector. Each item = vector. Recommendation score = dot(user, item). Highest dot products → top recommendations for that user. Netflix, Spotify, Amazon all use this.",
                  code:["score = dot(user_vec, movie_vec)"]},
                {e:"💬",t:"Word & Text Embeddings",c:ROSE,
                  b:'"King" and "Queen" have high dot products in embedding space. Word2Vec, GloVe, and sentence transformers all rely on dot products to measure semantic similarity between tokens.',
                  code:["dot(embed('king'), embed('queen'))","# → high similarity score"]},
                {e:"🔀",t:"Transformer Attention",c:SKY,
                  b:"The entire attention mechanism is: softmax(QKᵀ/√d)·V. QKᵀ = matrix of dot products between every query and every key — deciding what each token should look at.",
                  code:["# Self-attention core","scores = Q @ K.T / sqrt(d_model)","attn = softmax(scores) @ V"]},
                {e:"🔍",t:"Vector Database Search",c:GRN,
                  b:"Semantic search in Pinecone, Weaviate, or Chroma = find stored vectors with highest dot product to your query vector. Every search = millions of dot products per millisecond.",
                  code:["results = topk(dot(query, all_stored))"]},
              ].map(c=>(
                <div key={c.t} style={{background:c.c+"0d",border:`1px solid ${c.c}33`,
                  borderRadius:px(16),padding:"22px 24px"}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{c.e}</div>
                  <div style={{fontWeight:800,color:c.c,fontSize:px(15),marginBottom:8}}>{c.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:"#475569"}}>{c.b}</p>
                  <CodeBox color={c.c} lines={c.code}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — REAL EXAMPLE ───────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Real AI Example",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Sentence Similarity with <span style={{color:VIO}}>Embeddings</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24),marginBottom:px(24)}}>
              <div style={{...LCARD,borderTop:`4px solid ${VIO}`}}>
                <div style={{...LTAG(VIO),marginBottom:14}}>💬 High Similarity</div>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Two semantically similar sentences have embedding vectors that point
                  in similar directions — high dot product / cosine similarity.
                </p>
                <div style={{background:"#f5f3ff",borderRadius:10,padding:"12px 16px",
                  marginBottom:12,fontFamily:"monospace",fontSize:px(13),color:VIO,lineHeight:1.8}}>
                  s₁ = "The cat sat on the mat"<br/>
                  s₂ = "A cat is sitting on a mat"
                </div>
                {[["embed(s₁)",0.92,VIO],["embed(s₂)",0.88,"#818cf8"]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:c,
                      minWidth:90,fontSize:px(12)}}>{l}</span>
                    <div style={{flex:1,height:22,borderRadius:4,background:c+"22",
                      position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",left:0,top:0,bottom:0,
                        width:`${v*100}%`,background:c+"aa"}}/>
                    </div>
                    <span style={{fontFamily:"monospace",fontSize:px(11),color:"#64748b",minWidth:32}}>{v}</span>
                  </div>
                ))}
                <div style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:10,
                  padding:"12px",marginTop:12,fontFamily:"monospace",fontSize:px(14),
                  color:VIO,textAlign:"center",fontWeight:700}}>
                  cosine_sim(s₁, s₂) ≈ 0.94 🟢
                </div>
              </div>
              <div style={{...LCARD,borderTop:`4px solid ${ROSE}`}}>
                <div style={{...LTAG(ROSE),marginBottom:14}}>💬 Low Similarity</div>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Two sentences on completely different topics have embeddings pointing
                  in different directions — low dot product / cosine similarity.
                </p>
                <div style={{background:"#fff1f2",borderRadius:10,padding:"12px 16px",
                  marginBottom:12,fontFamily:"monospace",fontSize:px(13),color:ROSE,lineHeight:1.8}}>
                  s₁ = "The cat sat on the mat"<br/>
                  s₃ = "Quantum computers use qubits"
                </div>
                {[["embed(s₁)",0.92,VIO],["embed(s₃)",0.31,ROSE]].map(([l,v,c])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:c,
                      minWidth:90,fontSize:px(12)}}>{l}</span>
                    <div style={{flex:1,height:22,borderRadius:4,background:c+"22",
                      position:"relative",overflow:"hidden"}}>
                      <div style={{position:"absolute",left:0,top:0,bottom:0,
                        width:`${v*100}%`,background:c+"aa"}}/>
                    </div>
                    <span style={{fontFamily:"monospace",fontSize:px(11),color:"#64748b",minWidth:32}}>{v}</span>
                  </div>
                ))}
                <div style={{background:ROSE+"0d",border:`1px solid ${ROSE}33`,borderRadius:10,
                  padding:"12px",marginTop:12,fontFamily:"monospace",fontSize:px(14),
                  color:ROSE,textAlign:"center",fontWeight:700}}>
                  cosine_sim(s₁, s₃) ≈ 0.11 🔴
                </div>
              </div>
            </div>
            <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}33`}}>
              <div style={{fontWeight:700,color:VIO,fontSize:px(15),marginBottom:10}}>
                🔎 End-to-End RAG Search Pipeline
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",marginBottom:12}}>
                {["User query","→ Embedding model","→ Query vector",
                  "→ dot(query, all docs)","→ Top-k results","→ LLM generates answer"
                ].map(s=>(
                  <span key={s} style={{background:VIO+"12",border:`1px solid ${VIO}33`,
                    borderRadius:20,padding:"6px 14px",fontSize:px(13),fontWeight:700,color:VIO}}>
                    {s}
                  </span>
                ))}
              </div>
              <p style={{...LBODY,fontSize:px(13),margin:0}}>
                Every retrieval step is a dot product comparison. Semantic search literally means
                "find vectors with highest dot product to query vector." The entire $10B vector
                database industry is built on this one operation.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 8 — MINI GAME ──────────────────────────── */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Mini Game",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Vector Similarity <span style={{color:VIO}}>Game</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(660),marginBottom:px(28)}}>
              Rotate <strong>b</strong> to maximise its dot product with the fixed vector <strong>a</strong>.
              Maximum similarity happens when both vectors are parallel (θ=0°) — exactly how
              recommendation systems, search engines, and attention mechanisms work.
            </p>
            <SimilarityGame/>
          </div>
        </div>

        {/* ── SECTION 9 — PROPERTIES ─────────────────────────── */}
        <div ref={R(9)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Important Properties","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Mathematical <span style={{color:"#c4b5fd"}}>Properties</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(24)}}>
              Click each property to see the formula, worked example, and why
              it matters specifically in AI systems.
            </p>
            <PropertiesSection/>
          </div>
        </div>

        {/* ── SECTION 10 — KEY INSIGHTS ──────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <DotTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default DotProductPage;
