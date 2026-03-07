import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — STATISTICS FOR AI
   Level 2 · Math for AI · Lesson 5 of 5
   Accent: Amber #d97706
══════════════════════════════════════════════════════════════════ */
const AMB  = "#d97706";
const VIO  = "#7c3aed";
const EMR  = "#059669";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const GLD  = "#f59e0b";

/* ── shared atoms ─────────────────────────────────────────────── */
const Formula = ({ children, color = AMB }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}44`, borderRadius:px(14),
    padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700,
    textAlign:"center", margin:`${px(16)} 0` }}>{children}</div>
);
const Step = ({ n, label, children, color = AMB }) => (
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
const CodeBox = ({ lines, color = AMB }) => (
  <div style={{ fontFamily:"monospace", background:"#0d0a2a", borderRadius:px(10),
    padding:"14px 18px", fontSize:px(13), lineHeight:1.9, marginTop:px(10) }}>
    {lines.map((l,i)=>(
      <div key={i} style={{ color:l.startsWith("#")||l.startsWith("//")?"#475569":color }}>{l}</div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — animated dataset with mean/std lines
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    resize(); window.addEventListener("resize",resize);

    // Generate a fixed dataset that oscillates slightly
    const BASE = [2,5,7,3,8,6,4,9,5,7,3,6,8,4,7,5,9,3,6,8];

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#080d1a"; ctx.fillRect(0,0,W,H);

      // grid
      ctx.strokeStyle="rgba(217,119,6,0.07)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      // animated data points
      const data = BASE.map((v,i)=> v + Math.sin(t*0.8+i*0.6)*0.9);
      const n = data.length;
      const mean = data.reduce((s,v)=>s+v,0)/n;
      const variance = data.reduce((s,v)=>s+(v-mean)**2,0)/n;
      const std = Math.sqrt(variance);

      const barW = Math.min(28,(W-80)/n-4);
      const maxV = 12, baseY = H-50, scaleY = (H-100)/maxV;
      const startX = (W-(barW+4)*n)/2;

      // bars
      data.forEach((v,i)=>{
        const bx = startX+i*(barW+4);
        const bh = v*scaleY;
        const grad = ctx.createLinearGradient(bx,baseY,bx,baseY-bh);
        const col = v > mean+std ? ROSE : v < mean-std ? CYN : AMB;
        grad.addColorStop(0,col); grad.addColorStop(1,col+"44");
        ctx.fillStyle=grad;
        ctx.beginPath(); ctx.roundRect(bx,baseY-bh,barW,bh,3); ctx.fill();
      });

      // mean line
      const meanY = baseY - mean*scaleY;
      ctx.beginPath(); ctx.moveTo(startX,meanY); ctx.lineTo(startX+(barW+4)*n,meanY);
      ctx.strokeStyle=EMR; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.font="bold 11px sans-serif"; ctx.fillStyle=EMR; ctx.textAlign="left";
      ctx.fillText(`μ = ${mean.toFixed(2)}`,startX+(barW+4)*n+6,meanY+4);

      // std band
      const stdY1 = baseY-(mean+std)*scaleY;
      const stdY2 = baseY-(mean-std)*scaleY;
      ctx.fillStyle="rgba(217,119,6,0.08)";
      ctx.fillRect(startX,stdY1,n*(barW+4),stdY2-stdY1);
      ctx.strokeStyle=AMB+"55"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(startX,stdY1); ctx.lineTo(startX+(barW+4)*n,stdY1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(startX,stdY2); ctx.lineTo(startX+(barW+4)*n,stdY2); ctx.stroke();
      ctx.font="9px sans-serif"; ctx.fillStyle=AMB+"aa"; ctx.textAlign="left";
      ctx.fillText(`+1σ`,startX+(barW+4)*n+6,stdY1+4);
      ctx.fillText(`−1σ`,startX+(barW+4)*n+6,stdY2+4);

      // title
      ctx.font="bold 12px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.textAlign="center";
      ctx.fillText(`Live Data — μ=${mean.toFixed(2)}, σ=${std.toFixed(2)}, σ²=${variance.toFixed(2)}`,W/2,22);
      ctx.font="10px sans-serif"; ctx.fillStyle=ROSE+"aa";
      ctx.fillText("🔴 above +1σ  ",W/2-40,H-20);
      ctx.fillStyle=CYN+"aa";
      ctx.fillText("  🔵 below -1σ",W/2+20,H-20);

      t+=0.018; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 4 — Central Tendency Interactive Calculator
══════════════════════════════════════════════════════════════════ */
const CentralTendencyCalc = () => {
  const [raw, setRaw] = useState("4 7 2 9 3 7 5 7 1 8");
  const [highlight, setHighlight] = useState("mean");

  const parse = str => str.trim().split(/[\s,]+/).map(Number).filter(v=>!isNaN(v));
  const data = parse(raw);
  const n = data.length;

  const mean   = n>0 ? data.reduce((s,v)=>s+v,0)/n : 0;
  const sorted = [...data].sort((a,b)=>a-b);
  const median = n>0 ? (n%2===0?(sorted[n/2-1]+sorted[n/2])/2 : sorted[Math.floor(n/2)]) : 0;
  const freq   = data.reduce((acc,v)=>({...acc,[v]:(acc[v]||0)+1}),{});
  const maxF   = Math.max(...Object.values(freq));
  const modes  = Object.entries(freq).filter(([,f])=>f===maxF).map(([v])=>+v);

  const STATS = [
    {key:"mean",   label:"Mean", color:AMB, formula:"μ = (Σx) / n",
     result:mean.toFixed(3), desc:"Sum all values, divide by count. The 'centre of gravity'."},
    {key:"median", label:"Median", color:VIO, formula:"Middle value of sorted data",
     result:median.toFixed(3), desc:"Sort data, pick the middle value. Robust to outliers."},
    {key:"mode",   label:"Mode", color:EMR, formula:"Most frequent value",
     result:modes.join(", "), desc:"The value(s) that appear most often. Can have multiple."},
  ];

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        📊 Central Tendency Explorer — Edit the dataset
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
        Edit the numbers below (space or comma separated). Mean, median, and mode update live.
        Click a statistic to highlight it.
      </p>
      <textarea value={raw} onChange={e=>setRaw(e.target.value)}
        style={{width:"100%",height:48,borderRadius:10,border:`2px solid ${AMB}44`,
          padding:"10px 14px",fontSize:px(14),fontFamily:"monospace",
          resize:"none",background:"#fefce8",outline:"none",
          boxSizing:"border-box",color:"#1c1917"}}/>
      {n===0&&<div style={{color:ROSE,fontSize:px(12),marginTop:4}}>⚠ No valid numbers found</div>}

      {/* Dot plot */}
      {n>0&&(
        <div style={{background:"#fefce8",borderRadius:10,padding:"16px 14px",margin:"14px 0",
          border:`1px solid ${AMB}33`,overflowX:"auto"}}>
          <div style={{fontSize:px(11),color:V.muted,marginBottom:8,fontWeight:700}}>DOT PLOT</div>
          <div style={{display:"flex",gap:3,alignItems:"flex-end",minHeight:60}}>
            {[...new Set(sorted)].map(v=>{
              const cnt = freq[v]||0;
              const col = highlight==="mean"&&Math.abs(v-mean)<0.3?AMB:
                          highlight==="median"&&v===median?VIO:
                          highlight==="mode"&&modes.includes(v)?EMR:"#94a3b8";
              return(
                <div key={v} style={{display:"flex",flexDirection:"column-reverse",
                  alignItems:"center",gap:2,minWidth:24}}>
                  {Array.from({length:cnt}).map((_,i)=>(
                    <div key={i} style={{width:16,height:16,borderRadius:"50%",
                      background:col,opacity:0.85}}/>
                  ))}
                  <div style={{fontSize:px(10),color:"#64748b",marginTop:3}}>{v}</div>
                </div>
              );
            })}
          </div>
          {/* markers */}
          <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
            {highlight==="mean"&&<div style={{fontSize:px(11),color:AMB,fontWeight:700}}>▲ Mean = {mean.toFixed(2)}</div>}
            {highlight==="median"&&<div style={{fontSize:px(11),color:VIO,fontWeight:700}}>▲ Median = {median.toFixed(2)}</div>}
            {highlight==="mode"&&<div style={{fontSize:px(11),color:EMR,fontWeight:700}}>▲ Mode = {modes.join(", ")}</div>}
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(12)}}>
        {STATS.map(s=>(
          <div key={s.key} onClick={()=>setHighlight(s.key)}
            style={{background:highlight===s.key?s.color+"12":V.cream,
              border:`2px solid ${highlight===s.key?s.color:V.border}`,
              borderRadius:12,padding:"14px 16px",cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{fontWeight:800,color:s.color,fontSize:px(14),marginBottom:6}}>{s.label}</div>
            <div style={{fontFamily:"monospace",fontSize:px(11),color:"#64748b",
              marginBottom:8,background:s.color+"0d",borderRadius:6,padding:"4px 8px"}}>{s.formula}</div>
            <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(20),color:s.color,
              marginBottom:6}}>{s.result}</div>
            <p style={{...LBODY,fontSize:px(11),margin:0}}>{s.desc}</p>
          </div>
        ))}
      </div>
      <div style={{background:"#fefce8",border:`1px solid ${AMB}33`,borderRadius:10,
        padding:"12px 16px",marginTop:12}}>
        <div style={{fontWeight:700,color:AMB,marginBottom:6,fontSize:px(13)}}>
          🧪 Try these datasets — see how statistics change:
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[
            {l:"Symmetric",  d:"3 5 5 6 7 8 8 9 10"},
            {l:"Skewed",     d:"1 1 1 2 3 4 20 25 100"},
            {l:"Bimodal",    d:"2 2 2 5 5 8 8 8 11"},
            {l:"All Same",   d:"5 5 5 5 5 5 5"},
            {l:"Outlier",    d:"10 11 12 10 11 10 99"},
          ].map(ex=>(
            <button key={ex.l} onClick={()=>setRaw(ex.d)}
              style={{background:AMB+"0d",border:`1px solid ${AMB}33`,borderRadius:8,
                padding:"5px 12px",fontSize:px(11),cursor:"pointer",color:AMB,fontWeight:600}}>
              {ex.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 5 — Spread Calculator (Variance / Std Dev)
══════════════════════════════════════════════════════════════════ */
const SpreadViz = () => {
  const [raw, setRaw] = useState("2 4 4 4 5 5 7 9");
  const parse = str => str.trim().split(/[\s,]+/).map(Number).filter(v=>!isNaN(v)&&isFinite(v));
  const data = parse(raw);
  const n = data.length;
  const mean   = n>0 ? data.reduce((s,v)=>s+v,0)/n : 0;
  const variance = n>0 ? data.reduce((s,v)=>s+(v-mean)**2,0)/n : 0;
  const std    = Math.sqrt(variance);
  const canvasRef = useRef();

  const redraw = useCallback(()=>{
    const c = canvasRef.current; if(!c||n===0) return;
    const ctx = c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fffbeb"; ctx.fillRect(0,0,W,H);

    const margin=50, innerW=W-2*margin, innerH=H-80;
    const minV=Math.min(...data)-1, maxV=Math.max(...data)+1;
    const toX = v=>margin+(v-minV)/(maxV-minV)*innerW;
    const baseY=H-50, dotY=baseY-30;

    // axis
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(margin,baseY); ctx.lineTo(W-margin,baseY); ctx.stroke();
    for(let v=Math.ceil(minV);v<=Math.floor(maxV);v++){
      const x=toX(v);
      ctx.beginPath(); ctx.moveTo(x,baseY); ctx.lineTo(x,baseY+5); ctx.stroke();
      ctx.font="10px sans-serif"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
      ctx.fillText(v,x,baseY+16);
    }

    // std band
    const sx1=toX(mean-std), sx2=toX(mean+std);
    ctx.fillStyle=AMB+"18"; ctx.fillRect(sx1,20,sx2-sx1,dotY-20);
    ctx.strokeStyle=AMB+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath();ctx.moveTo(sx1,20);ctx.lineTo(sx1,dotY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(sx2,20);ctx.lineTo(sx2,dotY);ctx.stroke();
    ctx.setLineDash([]);
    ctx.font="9px sans-serif"; ctx.fillStyle=AMB; ctx.textAlign="center";
    ctx.fillText("−σ",sx1,16); ctx.fillText("+σ",sx2,16);

    // deviation lines + data points
    data.forEach((v,i)=>{
      const x=toX(v), mx=toX(mean);
      const dev=v-mean;
      const col=dev>0?ROSE:dev<0?CYN:EMR;
      ctx.beginPath();ctx.moveTo(mx,dotY);ctx.lineTo(x,dotY);
      ctx.strokeStyle=col+"88";ctx.lineWidth=1.5;ctx.stroke();
      ctx.beginPath();ctx.arc(x,dotY,6,0,Math.PI*2);
      ctx.fillStyle=col;ctx.fill();
      if(Math.abs(dev)>0.1){
        ctx.font="8px monospace"; ctx.fillStyle=col; ctx.textAlign="center";
        ctx.fillText((dev>0?"+":"")+dev.toFixed(1),x,dotY-12);
      }
    });

    // mean line
    const mx=toX(mean);
    ctx.beginPath();ctx.moveTo(mx,20);ctx.lineTo(mx,baseY);
    ctx.strokeStyle=EMR;ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.font="bold 10px sans-serif";ctx.fillStyle=EMR;ctx.textAlign="center";
    ctx.fillText(`μ=${mean.toFixed(2)}`,mx,15);
  },[data,mean,std,n]);

  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        📏 Variance &amp; Std Deviation Visualizer
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:12}}>
        Each line shows a data point's deviation from the mean (μ). Variance is the
        average of <em>squared</em> deviations. Standard deviation = √variance.
      </p>
      <input value={raw} onChange={e=>setRaw(e.target.value)}
        style={{width:"100%",borderRadius:8,border:`1px solid ${AMB}44`,padding:"8px 12px",
          fontFamily:"monospace",fontSize:px(13),background:"#fefce8",
          outline:"none",boxSizing:"border-box",marginBottom:12}}/>
      <canvas ref={canvasRef} style={{width:"100%",height:200,borderRadius:10,
        border:`1px solid ${AMB}22`,display:"block",marginBottom:12}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(10)}}>
        {[
          {l:"Variance σ²",    v:variance.toFixed(4), c:AMB, f:"Σ(x−μ)² / n"},
          {l:"Std Dev σ",      v:std.toFixed(4),      c:ROSE,f:"√σ²"},
          {l:"Mean μ",         v:mean.toFixed(4),     c:EMR, f:"Σx / n"},
        ].map(s=>(
          <div key={s.l} style={{background:s.c+"0d",border:`1px solid ${s.c}33`,
            borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
            <div style={{fontSize:px(10),color:V.muted,fontWeight:700,marginBottom:4}}>{s.f}</div>
            <div style={{fontWeight:800,color:s.c,fontFamily:"monospace",fontSize:px(18)}}>{s.v}</div>
            <div style={{fontSize:px(11),color:V.muted,marginTop:4}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 6 — Distribution Shape Explorer
══════════════════════════════════════════════════════════════════ */
const DistributionShape = () => {
  const canvasRef = useRef();
  const [shape, setShape] = useState("normal");
  const [skew,  setSkew]  = useState(0);

  const redraw = useCallback(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fffbeb"; ctx.fillRect(0,0,W,H);

    const baseY=H-40, curveH=H*0.62;

    const normal=(x,mu,sig)=>(1/(sig*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mu)/sig)**2);
    const skewnormal=(x,mu,sig,a)=>{
      const t=(x-mu)/sig;
      const phi=(1/Math.sqrt(2*Math.PI))*Math.exp(-t*t/2);
      const Phi=0.5*(1+erf(a*t/Math.sqrt(2)));
      return 2*phi*Phi/sig;
    };
    const erf=z=>{
      const sign=z>=0?1:-1; const x=Math.abs(z);
      const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
      const t2=1/(1+p*x);
      const poly=((((a5*t2+a4)*t2+a3)*t2+a2)*t2+a1)*t2;
      return sign*(1-poly*Math.exp(-x*x));
    };

    const pts=[];
    for(let i=0;i<=300;i++){
      const u=i/300; const x=-4+u*8;
      let y;
      if(shape==="normal")         y=normal(x,0,1);
      else if(shape==="right")     y=skewnormal(x,-1,1.5,skew>0?skew:3);
      else if(shape==="left")      y=skewnormal(x,1,1.5,-(skew>0?skew:3));
      else if(shape==="bimodal")   y=normal(x,-2,0.8)*0.5+normal(x,2,0.8)*0.5;
      else                         y=normal(x,0,2)*0.6;
      pts.push({x,y,u});
    }
    const maxY=Math.max(...pts.map(p=>p.y));
    const scaleY=curveH/maxY;
    const scaleX=W/8;

    // fill
    ctx.beginPath();
    pts.forEach((p,i)=>{
      const cx=p.u*W, cy=baseY-p.y*scaleY;
      i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
    });
    ctx.lineTo(W,baseY); ctx.lineTo(0,baseY); ctx.closePath();
    const g=ctx.createLinearGradient(0,baseY-curveH,0,baseY);
    g.addColorStop(0,AMB+"44"); g.addColorStop(1,AMB+"08");
    ctx.fillStyle=g; ctx.fill();

    // curve
    ctx.beginPath();
    pts.forEach((p,i)=>{ const cx=p.u*W, cy=baseY-p.y*scaleY; i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy); });
    ctx.strokeStyle=AMB; ctx.lineWidth=2.5; ctx.stroke();

    // axis
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,baseY);ctx.lineTo(W,baseY);ctx.stroke();

    // labels
    const labels={
      normal:  ["🔔 Normal / Gaussian — symmetric bell curve","Mean = Median = Mode"],
      right:   ["📈 Right-skewed (positive) — long tail to right","Mean > Median > Mode"],
      left:    ["📉 Left-skewed (negative) — long tail to left","Mean < Median < Mode"],
      bimodal: ["🏔 Bimodal — two peaks, two subgroups","Mean ≠ Median ≠ Mode"],
      wide:    ["🌊 Wide / High variance — spread out","Larger σ, more uncertainty"],
    };
    const [l1,l2]=labels[shape]||["",""];
    ctx.font="bold 12px sans-serif"; ctx.fillStyle="#374151"; ctx.textAlign="center";
    ctx.fillText(l1,W/2,22);
    ctx.font="10px sans-serif"; ctx.fillStyle=AMB+"cc";
    ctx.fillText(l2,W/2,38);
  },[shape,skew]);

  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:12,fontSize:px(15)}}>
        🔔 Distribution Shape Explorer
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {[["normal","Normal 🔔"],["right","Right-Skewed →"],["left","← Left-Skewed"],
          ["bimodal","Bimodal 🏔"],["wide","High Variance 🌊"]
        ].map(([k,l])=>(
          <button key={k} onClick={()=>setShape(k)}
            style={{background:shape===k?AMB:"transparent",
              border:`1px solid ${shape===k?AMB:V.border}`,
              borderRadius:20,padding:"5px 14px",fontSize:px(11),fontWeight:700,
              color:shape===k?"#fff":V.muted,cursor:"pointer",transition:"all 0.2s"}}>
            {l}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} style={{width:"100%",height:220,borderRadius:12,
        border:`1px solid ${AMB}22`,display:"block",marginBottom:14}}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(10)}}>
        {[
          {shape:"normal", fact:"68-95-99.7 rule: 68% of data within ±1σ. Most natural phenomena follow this.",col:AMB},
          {shape:"right",  fact:"Income, house prices — most values are small, a few are very large.",col:ROSE},
          {shape:"left",   fact:"Age at retirement, exam scores where most score high, a few fail.",col:CYN},
        ].map(f=>(
          <div key={f.shape} style={{background:f.col+"0d",border:`1px solid ${f.col}33`,
            borderRadius:8,padding:"10px 12px"}}>
            <p style={{...LBODY,fontSize:px(12),margin:0,color:"#475569"}}>{f.fact}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 7 — Correlation Scatter Plot
══════════════════════════════════════════════════════════════════ */
const CorrelationViz = () => {
  const [corrType, setCorrType] = useState("positive");
  const canvasRef = useRef();

  const genData = useCallback((type)=>{
    const pts=[];
    for(let i=0;i<40;i++){
      const x=Math.random()*8-4;
      let y;
      if(type==="positive")  y=1.2*x+Math.random()*2-1;
      else if(type==="negative") y=-1.2*x+Math.random()*2-1;
      else if(type==="zero") y=Math.random()*8-4;
      else if(type==="strong") y=1.8*x+Math.random()*0.4-0.2;
      else y=1.2*x+Math.random()*3-1.5;
      pts.push({x,y});
    }
    return pts;
  },[]);

  const [pts, setPts] = useState(()=>genData("positive"));

  const pearson = useCallback((data)=>{
    const n=data.length;
    if(n===0)return 0;
    const mx=data.reduce((s,p)=>s+p.x,0)/n, my=data.reduce((s,p)=>s+p.y,0)/n;
    const num=data.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0);
    const dx=Math.sqrt(data.reduce((s,p)=>s+(p.x-mx)**2,0));
    const dy=Math.sqrt(data.reduce((s,p)=>s+(p.y-my)**2,0));
    return (dx*dy===0)?0:num/(dx*dy);
  },[]);

  const r = pearson(pts);

  const redraw = useCallback(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fffbeb"; ctx.fillRect(0,0,W,H);

    const mg=44;
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(mg,mg);ctx.lineTo(mg,H-mg);ctx.lineTo(W-mg,H-mg);ctx.stroke();
    ctx.font="10px sans-serif";ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    ctx.fillText("Variable X →",W/2,H-8);
    ctx.save();ctx.translate(14,H/2);ctx.rotate(-Math.PI/2);
    ctx.fillText("Variable Y →",0,0);ctx.restore();

    const toX=v=>(mg + (v+5)/10*(W-2*mg));
    const toY=v=>(H-mg - (v+5)/10*(H-2*mg));

    // regression line
    if(pts.length>1){
      const n2=pts.length, mx=pts.reduce((s,p)=>s+p.x,0)/n2, my=pts.reduce((s,p)=>s+p.y,0)/n2;
      const slope=pts.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/pts.reduce((s,p)=>s+(p.x-mx)**2,0);
      const intercept=my-slope*mx;
      const col=r>0.3?EMR:r<-0.3?ROSE:CYN;
      ctx.beginPath();
      ctx.moveTo(toX(-4),toY(slope*-4+intercept));
      ctx.lineTo(toX(4),toY(slope*4+intercept));
      ctx.strokeStyle=col+"aa"; ctx.lineWidth=2; ctx.setLineDash([5,4]);
      ctx.stroke(); ctx.setLineDash([]);
    }

    // scatter points
    pts.forEach(p=>{
      ctx.beginPath(); ctx.arc(toX(p.x),toY(p.y),5,0,Math.PI*2);
      ctx.fillStyle=AMB+"cc"; ctx.fill();
      ctx.strokeStyle=AMB+"33"; ctx.lineWidth=1.5; ctx.stroke();
    });

    // r value box
    const col=r>0.7?EMR:r>0.3?AMB:r<-0.7?ROSE:r<-0.3?CYN:"#64748b";
    ctx.fillStyle="#ffffffee";
    ctx.beginPath();ctx.roundRect(W-120,10,110,46,8);ctx.fill();
    ctx.strokeStyle=col+"55";ctx.lineWidth=1;ctx.stroke();
    ctx.font="bold 11px monospace";ctx.fillStyle=col;ctx.textAlign="center";
    ctx.fillText("r = "+r.toFixed(3),W-65,30);
    ctx.font="9px sans-serif";ctx.fillStyle=col;
    ctx.fillText(r>0.7?"Strong +":(r>0.3?"Moderate +":(r<-0.7?"Strong -":(r<-0.3?"Moderate -":"Weak/None"))),W-65,44);
  },[pts,r]);

  useEffect(()=>{redraw();},[redraw]);

  const pick=(k)=>{setCorrType(k);setPts(genData(k));};

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:12,fontSize:px(15)}}>
        🔗 Correlation Explorer — Pearson's r
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
        {[["positive","Positive ↗"],["negative","Negative ↘"],["zero","No Correlation"],
          ["strong","Strong +"],["weak","Weak"]
        ].map(([k,l])=>(
          <button key={k} onClick={()=>pick(k)}
            style={{background:corrType===k?AMB:"transparent",
              border:`1px solid ${corrType===k?AMB:V.border}`,
              borderRadius:20,padding:"5px 14px",fontSize:px(11),fontWeight:700,
              color:corrType===k?"#fff":V.muted,cursor:"pointer",transition:"all 0.2s"}}>
            {l}
          </button>
        ))}
        <button onClick={()=>setPts(genData(corrType))}
          style={{background:"transparent",border:`1px solid ${V.border}`,
            borderRadius:20,padding:"5px 12px",fontSize:px(11),
            color:V.muted,cursor:"pointer"}}>
          ↺ Reshuffle
        </button>
      </div>
      <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
        border:`1px solid ${AMB}22`,display:"block",marginBottom:14}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(10)}}>
        {[
          {r:"r ≈ +1",  desc:"Perfect positive — as X rises, Y rises proportionally.",col:EMR},
          {r:"r ≈ 0",   desc:"No linear relationship — X tells us nothing about Y.",col:"#64748b"},
          {r:"r ≈ −1",  desc:"Perfect negative — as X rises, Y falls proportionally.",col:ROSE},
        ].map(s=>(
          <div key={s.r} style={{background:s.col+"0d",border:`1px solid ${s.col}33`,
            borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontFamily:"monospace",fontWeight:800,color:s.col,marginBottom:4}}>{s.r}</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 9 — Recommendation System Real Example
══════════════════════════════════════════════════════════════════ */
const RecommendDemo = () => {
  const USERS = [
    {name:"Alice",   age:28, purchases:45, rating:4.2, sessions:12, churn:0.1},
    {name:"Bob",     age:35, purchases:12, rating:3.1, sessions:5,  churn:0.6},
    {name:"Carol",   age:22, purchases:88, rating:4.8, sessions:30, churn:0.05},
    {name:"Dave",    age:41, purchases:5,  rating:2.4, sessions:2,  churn:0.8},
    {name:"Eve",     age:30, purchases:60, rating:4.5, sessions:20, churn:0.08},
    {name:"Frank",   age:55, purchases:20, rating:3.8, sessions:8,  churn:0.35},
  ];
  const [selected, setSelected] = useState(0);
  const user = USERS[selected];
  const allPurchases = USERS.map(u=>u.purchases);
  const meanP = allPurchases.reduce((s,v)=>s+v,0)/USERS.length;
  const stdP  = Math.sqrt(allPurchases.reduce((s,v)=>s+(v-meanP)**2,0)/USERS.length);
  const zScore = (user.purchases-meanP)/stdP;
  const percentile = Math.round((USERS.filter(u=>u.purchases<=user.purchases).length/USERS.length)*100);

  const allAges = USERS.map(u=>u.age);
  const meanAge = allAges.reduce((s,v)=>s+v,0)/USERS.length;
  const corrN = USERS.reduce((s,u)=>(s+(u.age-meanAge)*(u.purchases-meanP)),0);
  const corrD = Math.sqrt(USERS.reduce((s,u)=>s+(u.age-meanAge)**2,0))*Math.sqrt(USERS.reduce((s,u)=>s+(u.purchases-meanP)**2,0));
  const ageCorr = corrD===0?0:corrN/corrD;

  return (
    <div style={{...LCARD,background:"#fffbeb",border:`2px solid ${AMB}22`}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        🎬 User Analytics Dashboard — Recommendation Engine
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        A real-world example: using statistics to analyse user behaviour data and
        personalise recommendations. Select a user to see their statistical profile.
      </p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {USERS.map((u,i)=>(
          <button key={u.name} onClick={()=>setSelected(i)}
            style={{background:i===selected?AMB:"transparent",
              border:`2px solid ${i===selected?AMB:V.border}`,
              borderRadius:10,padding:"7px 14px",fontSize:px(12),
              fontWeight:700,color:i===selected?"#fff":V.muted,
              cursor:"pointer",transition:"all 0.2s"}}>
            {u.name}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{...LCARD,background:"white",marginBottom:px(12)}}>
            <div style={{fontWeight:700,color:AMB,marginBottom:10,fontSize:px(14)}}>{user.name}'s Profile</div>
            {[
              ["Age",          user.age,          "#64748b"],
              ["Purchases",    user.purchases,     AMB],
              ["Avg Rating",   user.rating,        VIO],
              ["Sessions",     user.sessions,      CYN],
              ["Churn Risk",   (user.churn*100).toFixed(0)+"%", user.churn>0.5?ROSE:EMR],
            ].map(([l,v,col])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",
                padding:"7px 0",borderBottom:`1px solid ${AMB}14`}}>
                <span style={{fontSize:px(13),color:V.muted}}>{l}</span>
                <span style={{fontWeight:700,color:col,fontFamily:"monospace"}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:AMB+"0d",border:`1px solid ${AMB}33`,borderRadius:10,padding:"14px"}}>
            <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(13)}}>📊 Statistical Measures</div>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#334155",lineHeight:2.1}}>
              <div>Pop. mean (μ): <strong style={{color:AMB}}>{meanP.toFixed(1)} purchases</strong></div>
              <div>Pop. std (σ):  <strong style={{color:AMB}}>{stdP.toFixed(1)}</strong></div>
              <div>Z-score:       <strong style={{color:zScore>0?EMR:ROSE}}>{zScore.toFixed(2)}</strong></div>
              <div>Percentile:    <strong style={{color:VIO}}>{percentile}th</strong></div>
            </div>
          </div>
        </div>
        <div>
          <div style={{...LCARD,background:"white",marginBottom:px(12)}}>
            <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(13)}}>
              🔗 Age vs Purchases Correlation
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(13),color:ageCorr<0?ROSE:EMR,fontWeight:700,marginBottom:8}}>
              r = {ageCorr.toFixed(3)} — {Math.abs(ageCorr)>0.6?"Strong":"Moderate"} {ageCorr<0?"negative":"positive"}
            </div>
            <p style={{...LBODY,fontSize:px(13),marginBottom:10}}>
              {ageCorr<-0.3?"Younger users purchase more — target marketing at age 20–30."
               :"Older users purchase slightly more — value-oriented campaigns may work better."}
            </p>
            <div style={{display:"flex",gap:4,alignItems:"flex-end",height:80}}>
              {USERS.map((u,i)=>(
                <div key={u.name} style={{flex:1,display:"flex",flexDirection:"column",
                  alignItems:"center",gap:2}}>
                  <div style={{width:"100%",background:i===selected?AMB:AMB+"44",
                    height:`${(u.purchases/88)*70}px`,borderRadius:"3px 3px 0 0"}}/>
                  <div style={{fontSize:"8px",color:"#94a3b8"}}>{u.name[0]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:user.churn>0.5?ROSE+"0d":EMR+"0d",
            border:`1px solid ${user.churn>0.5?ROSE:EMR}33`,borderRadius:10,padding:"14px"}}>
            <div style={{fontWeight:700,color:user.churn>0.5?ROSE:EMR,marginBottom:6,fontSize:px(13)}}>
              {user.churn>0.5?"⚠️ High Churn Risk":"✅ Low Churn Risk"} — Action Plan
            </div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>
              {user.churn>0.5
                ? `${user.name} has Z-score ${zScore.toFixed(2)} on purchases and only ${user.sessions} sessions. Statistical analysis flags high churn probability. Send re-engagement email.`
                : `${user.name} has ${user.purchases} purchases (${percentile}th percentile) and ${user.sessions} sessions — high engagement. Recommend premium tier upgrade.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 10 — Histogram / Bell Curve Visualizer
══════════════════════════════════════════════════════════════════ */
const HistogramViz = () => {
  const [n,    setN]    = useState(200);
  const [bins, setBins] = useState(12);
  const [vizType, setVizType] = useState("histogram");
  const canvasRef = useRef();

  // Box-Muller normal samples
  const genNormal = useCallback((count)=>{
    const out=[];
    for(let i=0;i<count;i+=2){
      const u1=Math.random(), u2=Math.random();
      const z0=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
      const z1=Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);
      out.push(z0); if(out.length<count) out.push(z1);
    }
    return out;
  },[]);

  const [data, setData] = useState(()=>genNormal(200));
  useEffect(()=>setData(genNormal(n)),[n]);

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fffbeb"; ctx.fillRect(0,0,W,H);

    const mn=Math.min(...data), mx2=Math.max(...data);
    const range=mx2-mn;
    const mg=44, innerW=W-2*mg, innerH=H-2*mg;
    const toX=v=>mg+(v-mn)/range*innerW;
    const baseY=H-mg;

    // Histogram
    if(vizType==="histogram"||vizType==="both"){
      const binEdges=[];
      for(let i=0;i<=bins;i++) binEdges.push(mn+i*(range/bins));
      const counts=new Array(bins).fill(0);
      data.forEach(v=>{
        let b=Math.floor((v-mn)/range*bins);
        if(b>=bins) b=bins-1;
        counts[b]++;
      });
      const maxC=Math.max(...counts);
      const bw=innerW/bins;
      counts.forEach((cnt,i)=>{
        const bh=(cnt/maxC)*innerH*0.88;
        const bx=mg+i*bw;
        ctx.fillStyle=AMB+"55";
        ctx.fillRect(bx+1,baseY-bh,bw-2,bh);
        ctx.strokeStyle=AMB+"aa"; ctx.lineWidth=0.5;
        ctx.strokeRect(bx+1,baseY-bh,bw-2,bh);
      });
    }

    // Normal curve overlay
    if(vizType==="curve"||vizType==="both"){
      const mean=data.reduce((s,v)=>s+v,0)/data.length;
      const std=Math.sqrt(data.reduce((s,v)=>s+(v-mean)**2,0)/data.length);
      const normal=(x)=>(1/(std*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mean)/std)**2);
      const peakN=normal(mean);
      const scale=(vizType==="both")?(innerH*0.88/peakN):(innerH*0.88/peakN*0.85);
      ctx.beginPath();
      for(let i=0;i<=300;i++){
        const x=mn+i/300*range;
        const y=normal(x)*scale;
        const cx=toX(x), cy=baseY-y;
        i===0?ctx.moveTo(cx,cy):ctx.lineTo(cx,cy);
      }
      ctx.strokeStyle=ROSE; ctx.lineWidth=2.5; ctx.stroke();
      // ±1σ, ±2σ markers
      const mean2=data.reduce((s,v)=>s+v,0)/data.length;
      const std2=Math.sqrt(data.reduce((s,v)=>s+(v-mean2)**2,0)/data.length);
      [[1,CYN],[2,VIO]].forEach(([k,col])=>{
        const x1=toX(mean2-k*std2), x2=toX(mean2+k*std2);
        const y=normal(mean2-k*std2)*scale;
        ctx.strokeStyle=col+"66"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
        ctx.beginPath();ctx.moveTo(x1,baseY);ctx.lineTo(x1,baseY-y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x2,baseY);ctx.lineTo(x2,baseY-y);ctx.stroke();
        ctx.setLineDash([]);
        ctx.font="9px sans-serif";ctx.fillStyle=col;ctx.textAlign="center";
        ctx.fillText((k===1?"68":"95")+"%",toX(mean2),baseY-y-8);
      });
    }

    // axis
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(mg,baseY);ctx.lineTo(W-mg,baseY);ctx.stroke();
    ctx.font="bold 12px sans-serif";ctx.fillStyle="#374151";ctx.textAlign="center";
    ctx.fillText(`n=${data.length} samples — Normal(0,1)`,W/2,22);
  },[data,bins,vizType]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:12,fontSize:px(15)}}>
        📊 Histogram + Bell Curve Visualizer
      </div>
      <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:14,alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:px(11),fontWeight:700,color:V.muted,marginBottom:4}}>VIEW</div>
          <div style={{display:"flex",gap:6}}>
            {[["histogram","Histogram"],["curve","Curve"],["both","Both"]].map(([k,l])=>(
              <button key={k} onClick={()=>setVizType(k)}
                style={{background:vizType===k?AMB:"transparent",
                  border:`1px solid ${vizType===k?AMB:V.border}`,
                  borderRadius:8,padding:"4px 10px",fontSize:px(11),fontWeight:700,
                  color:vizType===k?"#fff":V.muted,cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontSize:px(11),fontWeight:700,color:V.muted,marginBottom:4}}>
            Samples: {n}
          </div>
          <input type="range" min={30} max={1000} step={10} value={n}
            onChange={e=>setN(+e.target.value)} style={{accentColor:AMB,width:120}}/>
        </div>
        <div>
          <div style={{fontSize:px(11),fontWeight:700,color:V.muted,marginBottom:4}}>
            Bins: {bins}
          </div>
          <input type="range" min={5} max={30} step={1} value={bins}
            onChange={e=>setBins(+e.target.value)} style={{accentColor:VIO,width:100}}/>
        </div>
      </div>
      <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
        border:`1px solid ${AMB}22`,display:"block"}}/>
      <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(10)}}>
        {[["📊 Histogram","Shows frequency distribution — how many samples fall in each bin.",AMB],
          ["🔔 Bell Curve","Normal distribution curve N(0,1) — predicted shape.",ROSE],
          ["📏 68-95-99.7","With more samples, histogram converges to the bell curve.",CYN]
        ].map(([l,d,col])=>(
          <div key={l} style={{background:col+"0d",border:`1px solid ${col}33`,borderRadius:8,padding:"10px"}}>
            <div style={{fontWeight:700,color:col,fontSize:px(12),marginBottom:4}}>{l}</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   KEY INSIGHTS
══════════════════════════════════════════════════════════════════ */
const StatTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d=>({...d,[i]:!d[i]}));
  const items = [
    {e:"📊",c:AMB,  t:"Descriptive statistics summarise data (mean, median, mode, std). Inferential statistics generalise from samples to populations."},
    {e:"⚖",c:VIO,  t:"Mean = sum/n. Sensitive to outliers. Median = middle value. Robust. Mode = most frequent. Use the right one for your data."},
    {e:"📏",c:CYN,  t:"Variance σ² = Σ(x−μ)²/n. Std Dev σ = √σ². Measures spread. High σ = data is widely spread. Low σ = data is clustered."},
    {e:"🔔",c:AMB,  t:"Normal distribution N(μ,σ²): 68% within ±1σ, 95% within ±2σ, 99.7% within ±3σ. The most important distribution in all of statistics."},
    {e:"🔗",c:ROSE, t:"Pearson's r ∈ [−1,1] measures linear correlation. r=+1 perfect positive, r=0 no relationship, r=−1 perfect negative. Correlation ≠ causation."},
    {e:"🎯",c:EMR,  t:"Z-score = (x−μ)/σ. How many standard deviations from the mean. Used for normalisation before feeding data to ML models."},
    {e:"🤖",c:VIO,  t:"Feature scaling (standardisation) uses μ and σ. Gradient descent converges faster when features are on the same scale."},
    {e:"📈",c:CYN,  t:"Model evaluation uses statistics: accuracy, precision, recall, F1, AUC — all computed from statistical distributions of predictions."},
  ];
  const cnt = Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",AMB)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:AMB}}>Know</span></h2>
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
      <div style={{...LCARD,textAlign:"center",padding:"40px 36px"}}>
        <div style={{fontSize:px(58),marginBottom:10}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(26),
          color:V.ink,fontWeight:900,marginBottom:8}}>
          {cnt}/8 concepts understood
        </div>
        <p style={{...LBODY,marginBottom:20,fontSize:px(15)}}>
          {cnt===8
            ? "🎉 Level 2 complete! You have mastered the mathematical foundations of AI."
            : "Click each insight above to mark it as understood."}
        </p>
        <div style={{background:V.cream,borderRadius:10,height:12,overflow:"hidden",
          maxWidth:440,margin:"0 auto 28px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${AMB},${VIO},${EMR})`,
            transition:"width 0.5s",borderRadius:10}}/>
        </div>
        {cnt===8&&(
          <div style={{background:"linear-gradient(135deg,#fef3c7,#d1fae5)",
            border:`2px solid ${AMB}66`,borderRadius:16,padding:"20px",marginBottom:24,
            maxWidth:480,margin:"0 auto 24px"}}>
            <div style={{fontSize:px(18),fontWeight:800,color:"#92400e",marginBottom:8}}>
              🏆 Level 2 — Math for AI — Complete!
            </div>
            <p style={{...LBODY,color:"#78350f",margin:0,fontSize:px(14)}}>
              You've covered Vectors & Matrices, Dot Product, Gradient Descent,
              Probability, and Statistics — the full mathematical toolkit for AI.
              Level 3: Machine Learning awaits.
            </p>
          </div>
        )}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:`linear-gradient(135deg,${AMB},${VIO})`,
              border:"none",borderRadius:12,padding:"14px 32px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(15),
              boxShadow:`0 4px 20px ${AMB}44`}}>
            🚀 Level 3: Machine Learning →
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
const StatisticsPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Statistics" lessonNum="Lesson 5 of 5"
    accent={AMB} levelLabel="Math for AI"
    dotLabels={["Hero","Simple","Math Def","Types","Central","Spread",
                "Distributions","Correlation","AI Uses","Real Example","Visualization","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ───────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#1c1003 60%,#14100a 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📐 Lesson 5 of 5 · Math for AI",AMB)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Statistics<br/><span style={{color:"#fcd34d"}}>for AI</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:AMB,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                Statistics is how AI understands data. Before a model trains, data must be
                cleaned, normalised, and understood statistically. After training, model
                performance is measured with statistical metrics. Statistics is the language of data.
              </p>
              <div style={{background:"rgba(217,119,6,0.12)",border:"1px solid rgba(217,119,6,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fcd34d",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 ONE LINE SUMMARY
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Statistics turns raw numbers into understanding.
                  It tells you what your data looks like, how spread out it is,
                  and what patterns it contains — before a single model is trained.
                </p>
              </div>
            </div>
            <div style={{height:px(380),background:"rgba(217,119,6,0.06)",
              border:"1px solid rgba(217,119,6,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE DEFINITION ─────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Definition",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              What is Statistics —{" "}
              <span style={{color:AMB}}>Plain English</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"🔍",c:AMB,t:"Understanding Data Patterns",
                  b:"Statistics is the art of extracting meaning from numbers. Given 10,000 user ratings, statistics tells you what the typical rating is, how much they vary, and whether users are satisfied."},
                {e:"📐",c:VIO,t:"Making Sense of Uncertainty",
                  b:"The world is noisy. Statistics gives us tools to tell signal from noise — is a model improvement real, or just random luck? Without statistics, you cannot know."},
                {e:"🤖",c:EMR,t:"The Foundation of ML",
                  b:"Machine learning is applied statistics. Feature engineering, model evaluation, A/B testing, hyperparameter tuning — every step uses statistical thinking and formulas."},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{c.e}</div>
                  <h3 style={{fontWeight:800,color:c.c,fontSize:px(16),marginBottom:10}}>{c.t}</h3>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>{c.b}</p>
                </div>
              ))}
            </div>
            <IBox color={AMB} title="Statistics in One Sentence"
              body="Statistics is the science of collecting, organising, analysing, interpreting, and presenting data — turning raw numbers into insights that drive decisions." />
          </div>
        </div>

        {/* ── SECTION 2 — MATH DEFINITION ───────────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Mathematical Definition","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Formal <span style={{color:"#fcd34d"}}>Definition</span>
            </h2>
            <div style={{background:"#1e1b4b",border:`1px solid ${AMB}44`,borderRadius:16,padding:"28px 32px",marginBottom:px(28)}}>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(18),color:"#e2e8f0",lineHeight:1.8,margin:0,textAlign:"center"}}>
                Statistics is the science of <span style={{color:"#fcd34d"}}>collecting</span>,{" "}
                <span style={{color:CYN}}>organising</span>,{" "}
                <span style={{color:EMR}}>analysing</span>,{" "}
                <span style={{color:ROSE}}>interpreting</span>,{" "}and{" "}
                <span style={{color:VIO}}>presenting</span> data.
              </p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:px(12)}}>
              {[
                {s:"Collect",  c:"#fcd34d",d:"Surveys, sensors, experiments, web scraping, logs. Getting the raw data."},
                {s:"Organise", c:CYN,      d:"Clean, sort, and structure data into usable form. Remove duplicates and errors."},
                {s:"Analyse",  c:EMR,      d:"Apply statistical formulas: mean, variance, correlation, hypothesis tests."},
                {s:"Interpret",c:ROSE,     d:"What does it mean? Is the pattern real? Is the difference significant?"},
                {s:"Present",  c:VIO,      d:"Visualise with charts, graphs, dashboards. Communicate findings clearly."},
              ].map(item=>(
                <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                  borderRadius:12,padding:"16px 12px",textAlign:"center"}}>
                  <div style={{fontWeight:900,color:item.c,fontSize:px(15),marginBottom:8}}>{item.s}</div>
                  <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — TYPES ──────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Types of Statistics",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Two Major <span style={{color:AMB}}>Branches</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28)}}>
              {[
                {t:"Descriptive Statistics",e:"📋",c:AMB,
                  def:"Describes and summarises the data you have. Tells you what happened.",
                  tools:["Mean, Median, Mode","Variance, Standard Deviation","Histograms, Box Plots","Correlation coefficients","Frequency tables"],
                  ex:"You have ratings for 10,000 movies. Mean rating=3.8, std=1.2, most popular genre=drama.",
                  ai:"EDA (Exploratory Data Analysis) before training. Feature statistics, class distribution, null value counts."},
                {t:"Inferential Statistics",e:"🔮",c:VIO,
                  def:"Draws conclusions about a population from a sample. Makes predictions.",
                  tools:["Hypothesis testing","Confidence intervals","p-values, t-tests","ANOVA, Chi-square","Regression analysis"],
                  ex:"You sampled 1,000 users. With 95% confidence, average app rating is between 4.1 and 4.3 for all users.",
                  ai:"Model evaluation (is improvement real?), A/B testing, cross-validation, statistical significance of results."},
              ].map(type=>(
                <div key={type.t} style={{...LCARD,borderLeft:`4px solid ${type.c}`}}>
                  <div style={{fontSize:px(44),marginBottom:10}}>{type.e}</div>
                  <h3 style={{fontWeight:800,color:type.c,fontSize:px(17),marginBottom:8}}>{type.t}</h3>
                  <p style={{...LBODY,fontSize:px(14),marginBottom:14,fontStyle:"italic"}}>{type.def}</p>
                  <div style={{marginBottom:14}}>
                    <div style={{fontSize:px(11),fontWeight:700,color:type.c,marginBottom:6,letterSpacing:"1px"}}>KEY TOOLS</div>
                    {type.tools.map(t2=>(
                      <div key={t2} style={{fontSize:px(12),color:"#475569",marginBottom:3}}>→ {t2}</div>
                    ))}
                  </div>
                  <div style={{background:type.c+"0d",border:`1px solid ${type.c}22`,borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                    <div style={{fontSize:px(10),fontWeight:700,color:type.c,marginBottom:4}}>EXAMPLE</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{type.ex}</p>
                  </div>
                  <div style={{background:"#f0fdf4",border:"1px solid #d1fae5",borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:px(10),fontWeight:700,color:EMR,marginBottom:4}}>IN AI</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{type.ai}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — CENTRAL TENDENCY ──────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Measures of Central Tendency","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Where is the <span style={{color:"#fcd34d"}}>Centre</span>?
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(24)}}>
              Central tendency tells you what a "typical" value looks like.
              Three measures — mean, median, mode — each tell a different story.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(28)}}>
              {[
                {t:"Mean", sym:"μ", c:AMB,
                  f:"μ = (Σ xᵢ) / n",
                  calc:"Sum all values, divide by count.",
                  when:"Symmetric data, no extreme outliers.",
                  caution:"A single extreme value (outlier) can pull the mean far from 'typical'.",
                  ai:"Feature normalisation, weight updates, gradient averages, batch statistics."},
                {t:"Median", sym:"M", c:VIO,
                  f:"Sort data → take middle value",
                  calc:"Sort data ascending. Middle value if n is odd; average of two middle values if n is even.",
                  when:"Skewed data, presence of outliers.",
                  caution:"Ignores how extreme outliers are — only their rank matters.",
                  ai:"Robust normalisation (MedianAbsoluteDeviation), salary data, house price prediction."},
                {t:"Mode", sym:"Mo", c:EMR,
                  f:"Value with highest frequency",
                  calc:"Count occurrences of each value. Return the most frequent.",
                  when:"Categorical data, discrete distributions.",
                  caution:"Can have multiple modes (bimodal, multimodal). May not be the 'centre' at all.",
                  ai:"Most common class in imbalanced datasets, imputing missing categorical values."},
              ].map(m=>(
                <div key={m.t} style={{background:m.c+"0d",border:`1px solid ${m.c}33`,
                  borderRadius:px(16),padding:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <h3 style={{fontWeight:900,color:m.c,fontSize:px(18),margin:0}}>{m.t}</h3>
                    <div style={{fontFamily:"monospace",fontSize:px(32),fontWeight:900,
                      color:m.c+"44",lineHeight:1}}>{m.sym}</div>
                  </div>
                  <div style={{fontFamily:"monospace",background:m.c+"18",borderRadius:8,
                    padding:"8px 12px",fontSize:px(13),color:m.c,fontWeight:700,marginBottom:12}}>{m.f}</div>
                  {[["How",m.calc,m.c],["Use when",m.when,CYN],["Caution ⚠",m.caution,ROSE],["In AI",m.ai,EMR]].map(([l,d,col])=>(
                    <div key={l} style={{marginBottom:8}}>
                      <div style={{fontSize:px(9),fontWeight:700,color:col,marginBottom:2,letterSpacing:"1px"}}>{l}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{d}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <CentralTendencyCalc/>
          </div>
        </div>

        {/* ── SECTION 5 — MEASURES OF SPREAD ────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Measures of Spread",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              How Spread Out <span style={{color:AMB}}>is the Data?</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Two datasets can have the same mean but very different spreads.
                  Variance and standard deviation measure how far values are from the mean on average.
                </p>
                <Formula color={AMB}>σ² = (1/n) Σᵢ (xᵢ − μ)²</Formula>
                <Formula color={ROSE}>σ = √σ² = √[ (1/n) Σ (xᵢ − μ)² ]</Formula>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:16}}>
                  {[
                    {s:"(xᵢ − μ)",c:AMB, d:"Deviation of each point from mean. Positive above mean, negative below."},
                    {s:"(xᵢ − μ)²",c:VIO,d:"Squared deviation. Makes all deviations positive and amplifies large ones."},
                    {s:"σ²",       c:CYN, d:"Variance — average squared deviation. Units are squared (e.g. cm²)."},
                    {s:"σ",        c:ROSE,d:"Standard deviation — same units as data. Most interpretable spread measure."},
                  ].map(t=>(
                    <div key={t.s} style={{background:t.c+"0d",border:`1px solid ${t.c}33`,
                      borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontFamily:"monospace",fontWeight:900,color:t.c,fontSize:px(16),marginBottom:4}}>{t.s}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{t.d}</p>
                    </div>
                  ))}
                </div>
                <IBox color={AMB} title="Why Square the Deviations?"
                  body="Without squaring, positive and negative deviations cancel out and sum to zero. Squaring prevents cancellation and penalises large deviations more heavily. This is also why MSE (squared loss) penalises big errors." />
              </div>
              <div>
                <SpreadViz/>
                <div style={{...LCARD,marginTop:px(16)}}>
                  <div style={{fontWeight:700,color:AMB,marginBottom:10,fontSize:px(13)}}>
                    📐 Other Spread Metrics Used in AI
                  </div>
                  {[
                    {t:"IQR",     f:"Q3 − Q1",             c:VIO, d:"Interquartile range. Robust to outliers. Used in box plots and outlier detection."},
                    {t:"MAD",     f:"median(|x−μ|)",        c:CYN, d:"Median Absolute Deviation. Most robust spread measure. Used in anomaly detection."},
                    {t:"Range",   f:"max(x) − min(x)",      c:AMB, d:"Simplest spread measure. Very sensitive to outliers."},
                    {t:"CV",      f:"σ/μ × 100%",           c:EMR, d:"Coefficient of Variation. Normalised spread measure. Useful when comparing different scales."},
                  ].map(m=>(
                    <div key={m.t} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{background:m.c+"18",border:`1px solid ${m.c}33`,borderRadius:7,
                        padding:"4px 10px",fontFamily:"monospace",fontSize:px(11),color:m.c,
                        fontWeight:700,minWidth:48,textAlign:"center",flexShrink:0}}>{m.t}</div>
                      <div>
                        <code style={{fontSize:px(11),color:m.c,fontFamily:"monospace"}}>{m.f}</code>
                        <p style={{...LBODY,fontSize:px(12),margin:"2px 0 0"}}>{m.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 6 — DATA DISTRIBUTIONS ────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Data Distributions","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              The Shape of <span style={{color:"#fcd34d"}}>Your Data</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Before training any model, understanding the shape of your data distributions
                  is critical. Different shapes require different preprocessing, models, and metrics.
                </p>
                {[
                  {t:"Normal (Gaussian)",c:AMB,
                    f:"f(x) = (1/σ√2π) e^(−(x−μ)²/2σ²)",
                    rule:"68-95-99.7 rule: 68% within ±1σ, 95% within ±2σ.",
                    ai:"Weight initialisation, noise in SGD, Central Limit Theorem for large n.",
                    d:"Symmetric bell curve. Mean=Median=Mode. Most natural phenomena."},
                  {t:"Right-Skewed (Positive)",c:ROSE,
                    f:"Long tail extends to the RIGHT",
                    rule:"Mean > Median > Mode. Median is more robust centre here.",
                    ai:"Income, house prices, word frequencies (Zipf's law), social media engagement.",
                    d:"Most values small, a few very large. Log-transform to normalise."},
                  {t:"Left-Skewed (Negative)",c:CYN,
                    f:"Long tail extends to the LEFT",
                    rule:"Mean < Median < Mode. Tail pulls mean down.",
                    ai:"Time-to-failure, age at death, exam scores when most students pass.",
                    d:"Most values high, a few very low. Reflect and apply log, or use robust stats."},
                ].map(d=>(
                  <div key={d.t} style={{...LCARD,marginBottom:px(12)}}>
                    <div style={{fontWeight:700,color:d.c,fontSize:px(14),marginBottom:6}}>{d.t}</div>
                    <code style={{display:"block",background:d.c+"0d",borderRadius:7,
                      padding:"5px 10px",fontSize:px(11),color:d.c,marginBottom:8}}>{d.f}</code>
                    <p style={{...LBODY,fontSize:px(13),marginBottom:6}}>{d.d}</p>
                    <div style={{fontSize:px(12),color:"#64748b",marginBottom:4}}><strong style={{color:d.c}}>68-95 rule:</strong> {d.rule}</div>
                    <div style={{fontSize:px(12),color:EMR}}><strong>AI:</strong> {d.ai}</div>
                  </div>
                ))}
              </div>
              <div>
                <DistributionShape/>
                <div style={{...LCARD,marginTop:px(16),background:"#f0fdf4",border:`2px solid ${EMR}33`}}>
                  <div style={{fontWeight:700,color:EMR,marginBottom:10,fontSize:px(14)}}>
                    🛠 Handling Non-Normal Data in AI
                  </div>
                  {[
                    ["Log Transform","x → log(x). Compresses right-skewed distributions. Used for income, prices."],
                    ["Standardisation","x → (x−μ)/σ. Makes μ=0, σ=1. Needed for gradient descent."],
                    ["MinMax Scaling","x → (x−min)/(max−min). Maps to [0,1]. Useful for neural nets."],
                    ["Box-Cox","Power transform to make distribution more normal. Parametric."],
                  ].map(([t2,d])=>(
                    <div key={t2} style={{display:"flex",gap:10,marginBottom:8}}>
                      <div style={{background:EMR+"18",borderRadius:6,padding:"3px 10px",
                        fontSize:px(10),fontWeight:700,color:EMR,flexShrink:0,height:"fit-content"}}>{t2}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — CORRELATION ────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Correlation",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              How Variables <span style={{color:AMB}}>Relate</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Correlation measures the strength and direction of a linear relationship
                  between two variables. The Pearson correlation coefficient <em>r</em> is
                  the most common measure.
                </p>
                <Formula color={AMB}>r = Σ[(xᵢ−x̄)(yᵢ−ȳ)] / (n·σₓ·σᵧ)</Formula>
                <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
                  r ∈ [−1, +1]. Closer to ±1 = stronger relationship. Closer to 0 = weaker.
                </p>
                {[
                  {t:"Positive Correlation (r > 0)",c:EMR,
                    e:"Study hours ↑ → Exam score ↑. Temperature ↑ → Ice cream sales ↑.",
                    ai:"Correlated features in regression. Positively correlated inputs can cause multicollinearity."},
                  {t:"Negative Correlation (r < 0)",c:ROSE,
                    e:"Price ↑ → Demand ↓. Training loss ↑ → Accuracy ↓.",
                    ai:"Early stopping: if validation loss starts rising (negative correlation with improvement), stop."},
                  {t:"Zero Correlation (r ≈ 0)",c:CYN,
                    e:"Shoe size vs. IQ. Birth month vs. programming skill.",
                    ai:"Low-correlation features may not add predictive value — feature selection removes them."},
                ].map(c=>(
                  <div key={c.t} style={{...LCARD,marginBottom:px(12),borderLeft:`4px solid ${c.c}`}}>
                    <div style={{fontWeight:700,color:c.c,fontSize:px(13),marginBottom:6}}>{c.t}</div>
                    <p style={{...LBODY,fontSize:px(13),marginBottom:6}}>{c.e}</p>
                    <div style={{background:EMR+"0d",borderRadius:7,padding:"6px 10px",fontSize:px(12),color:EMR}}>
                      <strong>AI:</strong> {c.ai}
                    </div>
                  </div>
                ))}
                <div style={{background:"#fef3c7",border:`1px solid ${AMB}66`,borderRadius:12,padding:"14px 16px",marginTop:px(16)}}>
                  <div style={{fontWeight:800,color:"#92400e",marginBottom:6,fontSize:px(13)}}>
                    ⚠️ Correlation ≠ Causation
                  </div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#78350f"}}>
                    Ice cream sales and drowning deaths are correlated (r ≈ 0.85).
                    Does ice cream cause drowning? No — both are caused by summer heat.
                    Correlation only shows association, not cause and effect.
                    <strong> AI models can learn spurious correlations from training data.</strong>
                  </p>
                </div>
              </div>
              <div>
                <CorrelationViz/>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 8 — STATISTICS IN AI ───────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Statistics in AI","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Where AI <span style={{color:"#fcd34d"}}>Relies on Statistics</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"🏗",t:"Data Preprocessing",c:AMB,
                  b:"Before any ML: check means, distributions, null values. Standardise features with μ and σ. Detect outliers using IQR or Z-score. Skewed features need log transform.",
                  code:["# StandardScaler uses μ and σ","from sklearn.preprocessing import StandardScaler","X_scaled = (X - X.mean()) / X.std()"]},
                {e:"🎯",t:"Feature Selection",c:VIO,
                  b:"Pearson correlation identifies redundant features. ANOVA tests whether a feature differs significantly across classes. Mutual Information quantifies statistical dependence.",
                  code:["import pandas as pd","corr_matrix = df.corr()","# Drop features with |r| > 0.9 (redundant)"]},
                {e:"📊",t:"Model Evaluation",c:CYN,
                  b:"All evaluation metrics are statistics: Accuracy = mean of correct predictions. Precision, recall, F1 = ratios. AUC = probability a random positive ranks above a random negative.",
                  code:["from sklearn.metrics import classification_report","print(classification_report(y_true, y_pred))"]},
                {e:"🧪",t:"Hypothesis Testing",c:EMR,
                  b:"A/B testing a model change: t-test checks if improvement is statistically significant (p < 0.05). Chi-square tests categorical feature independence. Critical for production deployment.",
                  code:["from scipy.stats import ttest_ind","stat, p = ttest_ind(model_a_scores, model_b_scores)","print('Significant' if p < 0.05 else 'Not significant')"]},
                {e:"🎲",t:"Regularisation & Priors",c:ROSE,
                  b:"L2 regularisation (ridge) = Gaussian prior on weights. L1 regularisation (lasso) = Laplace prior. Dropout = approximate Bayesian inference. Statistics governs how models avoid overfitting.",
                  code:["# L2 = assuming weights ~ Normal(0, 1/λ)","loss = MSE(y, ŷ) + λ * sum(w**2)"]},
                {e:"📈",t:"Training Diagnostics",c:GLD,
                  b:"Learning curves show mean training/validation loss over time. Variance between runs shows stability. Confidence intervals on metrics show reliability. All statistics.",
                  code:["# Track mean ± std over 5 folds","for fold in cross_val_score(model, X, y):","    losses.append(fold)","print(f'CV: {np.mean(losses):.3f} ± {np.std(losses):.3f}')"]},
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
            {STag("Section 9 · Real Example",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              User Analytics for <span style={{color:AMB}}>Recommendations</span>
            </h2>
            <RecommendDemo/>
          </div>
        </div>

        {/* ── SECTION 10 — VISUALIZATION ─────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Visualization",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Histograms &amp; Bell Curves <span style={{color:AMB}}>Live</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(720),marginBottom:px(28)}}>
              Generate random samples from a Normal distribution. Increase the sample count
              and watch the histogram converge to the bell curve — the <strong>Central Limit Theorem</strong> in action.
              Adjust bin count to see how it affects the histogram's resolution.
            </p>
            <HistogramViz/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),marginTop:px(24)}}>
              <IBox color={AMB} title="The Central Limit Theorem"
                body="Sample means of ANY distribution converge to Normal as sample size grows. This is why Normal distribution is everywhere in statistics and why gradient descent with many parameters behaves predictably." />
              <IBox color={VIO} title="Law of Large Numbers"
                body="As n → ∞, sample mean → true population mean. This is why more training data always helps: statistical estimates become more accurate and the model generalises better." />
            </div>
          </div>
        </div>

        {/* ── SECTION 11 — KEY INSIGHTS ──────────────────────── */}
        <div ref={R(11)} style={{background:V.paper}}>
          <StatTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default StatisticsPage;
