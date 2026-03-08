import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — REGRESSION
   Level 3 · Machine Learning · Lesson 2 of 7
   Accent: Red #ef4444
══════════════════════════════════════════════════════════════════ */

const RED  = "#ef4444";
const AMB  = "#f59e0b";
const VIO  = "#7c3aed";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const SKY  = "#0284c7";
const GRN  = "#059669";
const INK  = "#1e293b";

/* ── atoms ─────────────────────────────────────────────────────── */
const Formula = ({children,color=RED}) => (
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
   HERO CANVAS
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const DATA=[
      {x:0.08,y:0.15},{x:0.18,y:0.22},{x:0.28,y:0.31},
      {x:0.40,y:0.43},{x:0.52,y:0.55},{x:0.62,y:0.63},
      {x:0.74,y:0.74},{x:0.84,y:0.84},{x:0.92,y:0.91}
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0505";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(239,68,68,0.06)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const pad=48;
      ctx.strokeStyle="rgba(239,68,68,0.25)";ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
      ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
      ctx.font="11px sans-serif";ctx.fillStyle="rgba(239,68,68,0.5)";
      ctx.textAlign="center";ctx.fillText("X (input)",W/2,H-10);
      ctx.save();ctx.translate(14,H/2);ctx.rotate(-Math.PI/2);
      ctx.fillText("Y (predicted value)",0,0);ctx.restore();
      const progress=Math.min(1,(t*0.4));
      if(progress>0.05){
        ctx.beginPath();
        ctx.moveTo(pad,(H-pad)*(1-0.0*progress));
        ctx.lineTo(W-pad/2,(H-pad)*(1-0.95*progress));
        ctx.strokeStyle=RED;ctx.lineWidth=2.5;
        ctx.shadowColor=RED;ctx.shadowBlur=14;ctx.stroke();ctx.shadowBlur=0;
      }
      DATA.forEach((p,i)=>{
        if(i/(DATA.length-1)>progress)return;
        const cx=pad+p.x*(W-pad*1.5), cy=(H-pad)-p.y*(H-pad*1.5);
        const pred_y=(H-pad)-(p.x*0.96+0.02)*(H-pad*1.5);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,pred_y);
        ctx.strokeStyle=AMB+"88";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,16);
        g.addColorStop(0,RED+"55");g.addColorStop(1,RED+"00");
        ctx.beginPath();ctx.arc(cx,cy,16,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=RED;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
      });
      ctx.font="bold 12px sans-serif";ctx.textAlign="left";
      [[RED,"● Data points"],[AMB,"- - Residuals (errors)"]].forEach(([col,lbl],i)=>{
        ctx.fillStyle=col;ctx.fillRect(pad,12+i*18,12,12);
        ctx.fillStyle=col+"cc";ctx.fillText(lbl,pad+16,22+i*18);
      });
      if(t<1){t+=0.004;} else t=t; // hold at 1
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   INTERACTIVE REGRESSION VISUALIZER — click to add points
══════════════════════════════════════════════════════════════════ */
const RegressionViz = () => {
  const canvasRef=useRef();
  const [points,setPoints]=useState([
    {x:1,y:22},{x:2,y:28},{x:3,y:34},{x:4,y:42},{x:5,y:50},{x:6,y:58},{x:7,y:62}
  ]);

  const {slope,intercept}=useCallback(()=>{
    const n=points.length;
    if(n<2)return{slope:0,intercept:points[0]?.y||0};
    const sx=points.reduce((a,p)=>a+p.x,0)/n;
    const sy=points.reduce((a,p)=>a+p.y,0)/n;
    const num=points.reduce((a,p)=>a+(p.x-sx)*(p.y-sy),0);
    const den=points.reduce((a,p)=>a+(p.x-sx)**2,0);
    const m=den===0?0:num/den;
    return{slope:m,intercept:sy-m*sx};
  },[points])();

  const mse=points.reduce((a,p)=>{const pred=slope*p.x+intercept;return a+(p.y-pred)**2;},0)/points.length;
  const r2=(()=>{
    const mean=points.reduce((a,p)=>a+p.y,0)/points.length;
    const sst=points.reduce((a,p)=>a+(p.y-mean)**2,0);
    const sse=points.reduce((a,p)=>{const pred=slope*p.x+intercept;return a+(p.y-pred)**2;},0);
    return sst===0?1:Math.max(0,1-sse/sst);
  })();

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=44,xMin=0,xMax=9,yMin=0,yMax=80;
    const toC=(x,y)=>({
      x:pad+(x-xMin)/(xMax-xMin)*(W-2*pad),
      y:H-pad-(y-yMin)/(yMax-yMin)*(H-2*pad)
    });
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#faf9f5";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#f0ead8";ctx.lineWidth=1;
    for(let x=0;x<=9;x++){const{x:cx,y:top}=toC(x,yMax);ctx.beginPath();ctx.moveTo(cx,top);const{y:bot}=toC(x,0);ctx.lineTo(cx,bot);ctx.stroke();}
    for(let y=0;y<=80;y+=10){const{y:cy}=toC(0,y);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.font="10px monospace";ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    for(let x=1;x<=8;x++){const{x:cx}=toC(x,0);ctx.fillText(x,cx,H-pad+14);}
    ctx.textAlign="right";
    for(let y=0;y<=80;y+=20){const{y:cy}=toC(0,y);ctx.fillText(y,pad-6,cy+4);}
    ctx.strokeStyle="#334155";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="bold 11px sans-serif";ctx.fillStyle="#64748b";ctx.textAlign="center";
    ctx.fillText("Experience (years)",W/2,H-4);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);
    ctx.fillText("Salary ($k)",0,0);ctx.restore();
    const l0=toC(xMin,slope*xMin+intercept),l1=toC(xMax,slope*xMax+intercept);
    ctx.beginPath();ctx.moveTo(l0.x,l0.y);ctx.lineTo(l1.x,l1.y);
    ctx.strokeStyle=RED;ctx.lineWidth=2.5;
    ctx.shadowColor=RED;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
    points.forEach(p=>{
      const dp=toC(p.x,p.y),pred=slope*p.x+intercept,pp=toC(p.x,pred);
      ctx.beginPath();ctx.moveTo(dp.x,dp.y);ctx.lineTo(pp.x,pp.y);
      ctx.strokeStyle=AMB+"99";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
      const g=ctx.createRadialGradient(dp.x,dp.y,0,dp.x,dp.y,14);
      g.addColorStop(0,RED+"55");g.addColorStop(1,RED+"00");
      ctx.beginPath();ctx.arc(dp.x,dp.y,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(dp.x,dp.y,6,0,Math.PI*2);ctx.fillStyle=RED;ctx.fill();
      ctx.beginPath();ctx.arc(dp.x,dp.y,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
    });
    const px2=7.5,pyPred=slope*px2+intercept;
    if(pyPred>=yMin&&pyPred<=yMax){
      const{x:px3,y:py3}=toC(px2,pyPred);
      ctx.beginPath();ctx.arc(px3,py3,8,0,Math.PI*2);ctx.fillStyle=GRN;ctx.fill();
      ctx.font="bold 10px sans-serif";ctx.fillStyle=GRN;ctx.textAlign="left";
      ctx.fillText(`ŷ(7.5yr)=$${pyPred.toFixed(0)}k`,px3+12,py3+4);
    }
  },[points,slope,intercept]);

  useEffect(()=>{redraw();},[redraw]);

  const handleClick=(e)=>{
    const c=canvasRef.current;if(!c)return;
    const rect=c.getBoundingClientRect();
    const W=c.offsetWidth,H=c.offsetHeight,pad=44;
    const xFrac=(e.clientX-rect.left-pad)/(W-2*pad);
    const yFrac=1-(e.clientY-rect.top-pad)/(H-2*pad);
    const rx=xFrac*9,ry=yFrac*80;
    if(rx<0||rx>9||ry<0||ry>80)return;
    setPoints(pts=>[...pts,{x:+rx.toFixed(1),y:+ry.toFixed(1)}]);
  };

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:RED,marginBottom:8,fontSize:px(15)}}>
        📈 Interactive OLS Regression — Click canvas to add data points
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The red line is the <strong>Ordinary Least Squares best-fit line</strong> —
        recalculated instantly as you add points. Orange dashes show residuals (yᵢ − ŷᵢ).
        Green dot = prediction for 7.5 years experience.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef} onClick={handleClick}
            style={{width:"100%",height:300,borderRadius:12,border:`1px solid ${RED}22`,
              display:"block",cursor:"crosshair"}}/>
          <div style={{fontSize:px(11),color:V.muted,marginTop:6,textAlign:"center"}}>
            💡 Click anywhere on the chart to add a training point
          </div>
        </div>
        <div style={{flex:"1 1 160px",display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#0d1117",borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:px(11),color:"#64748b",fontWeight:700,marginBottom:8,letterSpacing:"1px"}}>LIVE STATS</div>
            {[
              ["Slope m",slope.toFixed(3),RED],
              ["Intercept b",intercept.toFixed(3),VIO],
              ["MSE",mse.toFixed(2),AMB],
              ["R² Score",r2.toFixed(3),GRN],
              ["n points",points.length,TEAL],
            ].map(([l,v,col])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:px(12),color:"#94a3b8"}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:col,fontSize:px(12)}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{background:RED+"0d",border:`1px solid ${RED}33`,borderRadius:10,
            padding:"12px",fontSize:px(12),color:RED,lineHeight:1.7}}>
            <strong>Equation:</strong><br/>
            <span style={{fontFamily:"monospace"}}>
              ŷ = {slope.toFixed(2)}x + {intercept.toFixed(2)}
            </span>
          </div>
          <button onClick={()=>setPoints([{x:1,y:22},{x:2,y:28},{x:3,y:34},{x:4,y:42},{x:5,y:50},{x:6,y:58},{x:7,y:62}])}
            style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:8,
              padding:"8px",fontSize:px(12),color:V.muted,cursor:"pointer"}}>
            ↺ Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   GAME — "FIT THE LINE"
══════════════════════════════════════════════════════════════════ */
const FitLineGame = () => {
  const canvasRef=useRef();
  const [slope,setSlope]=useState(0);
  const [inter,setInter]=useState(40);
  const [best,setBest]=useState(null);
  const [scored,setScored]=useState(null);
  const [attempts,setAttempts]=useState(0);

  const TARGET_DATA=[
    {x:1,y:25},{x:2,y:32},{x:3,y:40},{x:4,y:50},{x:5,y:58},
    {x:6,y:65},{x:7,y:74},{x:8,y:82}
  ];
  const mse=TARGET_DATA.reduce((s,p)=>s+(p.y-(slope*p.x+inter))**2,0)/TARGET_DATA.length;

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=44,xMax=9,yMax=100;
    const toC=(x,y)=>({x:pad+(x/xMax)*(W-2*pad),y:H-pad-(y/yMax)*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fefefe";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#f0f0f0";ctx.lineWidth=1;
    for(let x=0;x<=9;x++){const{x:cx}=toC(x,0);ctx.beginPath();ctx.moveTo(cx,pad/2);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let y=0;y<=100;y+=20){const{y:cy}=toC(0,y);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.font="9px monospace";ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    for(let x=1;x<=8;x++){const{x:cx}=toC(x,0);ctx.fillText(x,cx,H-pad+13);}
    ctx.textAlign="right";
    for(let y=0;y<=100;y+=20){const{y:cy}=toC(0,y);ctx.fillText(y,pad-4,cy+4);}
    ctx.strokeStyle="#334155";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    // user line
    const ul0=toC(0,inter),ul9=toC(9,slope*9+inter);
    ctx.beginPath();ctx.moveTo(ul0.x,ul0.y);ctx.lineTo(ul9.x,ul9.y);
    ctx.strokeStyle=RED;ctx.lineWidth=2.5;
    ctx.shadowColor=RED;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
    // residuals + data
    TARGET_DATA.forEach(p=>{
      const{x:cx,y:cy}=toC(p.x,p.y),pred=slope*p.x+inter,{y:py}=toC(p.x,pred);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,py);
      ctx.strokeStyle=ROSE+"88";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,12);
      g.addColorStop(0,VIO+"66");g.addColorStop(1,VIO+"00");
      ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle=VIO;ctx.fill();
    });
    // MSE bar
    const bW=W-2*pad,bH=5,maxE=400;
    ctx.fillStyle="#e2e8f0";ctx.beginPath();ctx.roundRect(pad,H-8,bW,bH,2);ctx.fill();
    const fW=Math.min(bW,bW*(mse/maxE));
    ctx.fillStyle=mse<10?GRN:mse<50?AMB:RED;ctx.beginPath();ctx.roundRect(pad,H-8,fW,bH,2);ctx.fill();
  },[slope,inter,mse]);

  useEffect(()=>{redraw();},[redraw]);

  const evaluate=()=>{
    setAttempts(a=>a+1);
    const grade=mse<5?"🏆 Perfect!":mse<20?"🥇 Excellent!":mse<60?"🥈 Good":mse<150?"⚠️ Getting there":"❌ Try again";
    if(best===null||mse<best)setBest(mse);
    setScored(grade+" (MSE="+mse.toFixed(1)+")");
  };

  return (
    <div style={{...LCARD,background:"#fefefe",border:`2px solid ${RED}22`}}>
      <div style={{fontWeight:800,color:RED,fontSize:px(17),marginBottom:4}}>🎮 Fit the Line</div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Adjust slope and intercept to fit your line through all 8 data points.
        Red dashes show how wrong each prediction is. Minimise them to win.
        Score = MSE — lower is better!
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
            border:`1px solid ${RED}22`,display:"block"}}/>
          <div style={{display:"flex",gap:8,marginTop:6,fontSize:px(11)}}>
            <span style={{color:VIO}}>● Target data</span>
            <span style={{color:RED}}>— Your line</span>
            <span style={{color:ROSE}}>- - Errors</span>
          </div>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:10}}>
          {[["Slope (m)",slope,setSlope,-5,20,0.5,RED],["Intercept (b)",inter,setInter,0,80,1,VIO]].map(([l,v,s,mn,mx,st,col])=>(
            <div key={l}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(11),color:V.muted}}>{l}</span>
                <span style={{fontSize:px(12),fontWeight:800,color:col}}>{v.toFixed(1)}</span>
              </div>
              <input type="range" min={mn} max={mx} step={st} value={v}
                onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:col}}/>
            </div>
          ))}
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",fontFamily:"monospace",fontSize:px(12)}}>
            <div style={{color:"#475569",marginBottom:4}}>// Your equation:</div>
            <div style={{color:RED}}>ŷ = {slope.toFixed(1)}x + {inter.toFixed(0)}</div>
            <div style={{marginTop:6}}>MSE: <span style={{color:mse<10?GRN:mse<50?AMB:RED,fontWeight:700}}>{mse.toFixed(1)}</span></div>
          </div>
          <button onClick={evaluate}
            style={{background:RED,border:"none",borderRadius:10,padding:"12px",
              color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
            📊 Evaluate Score
          </button>
          {scored&&(
            <div style={{background:RED+"0d",border:`1px solid ${RED}33`,borderRadius:10,
              padding:"12px",textAlign:"center",color:RED,fontWeight:700,fontSize:px(12)}}>
              {scored}
              {best!==null&&<div style={{color:GRN,fontSize:px(11),marginTop:4}}>Best: {best.toFixed(1)}</div>}
            </div>
          )}
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:8,
            padding:"10px",fontSize:px(11),color:VIO,lineHeight:1.8}}>
            🎯 Target: slope≈8.0, intercept≈17<br/>Attempts: {attempts}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SALARY PROJECT
══════════════════════════════════════════════════════════════════ */
const SalaryProject = () => {
  const [exp,setExp]=useState(5);
  const m=8.2, b=40.0;
  const pred=(m*exp+b).toFixed(1);

  return (
    <div style={{...LCARD,background:"#fff9f9",border:`2px solid ${RED}22`}}>
      <div style={{fontWeight:700,color:RED,marginBottom:8,fontSize:px(15)}}>
        💼 Mini Project — Salary Predictor (Live Interactive Demo)
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A linear regression model trained on 200 engineering salaries. The model
        learned the relationship: <strong>salary ≈ 8.2 × years_experience + 40k</strong>.
        Drag the slider to generate predictions.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28)}}>
        <div>
          <CodeBox color="#fca5a5" lines={[
            "import numpy as np",
            "from sklearn.linear_model import LinearRegression",
            "from sklearn.metrics import r2_score",
            "",
            "# Training data (years_experience, salary_k)",
            "X = np.array([[1],[2],[3],[5],[7],[10],[12],[15]])",
            "y = np.array([48, 56, 65, 80, 98, 122, 140, 160])",
            "",
            "model = LinearRegression()",
            "model.fit(X, y)",
            "",
            "# Learned parameters:",
            `# slope     m = ${m}   (8.2k per year)`,
            `# intercept b = ${b}   (starting salary)`,
            "",
            "# Predict for N years experience:",
            "model.predict([[5]])   # → [81.0]",
            "model.predict([[10]])  # → [122.0]",
            "model.predict([[20]])  # → [204.0]",
          ]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontWeight:700,color:V.muted,fontSize:px(13)}}>Years of experience</span>
              <span style={{fontWeight:900,color:RED,fontSize:px(20)}}>{exp} years</span>
            </div>
            <input type="range" min={0} max={25} value={exp}
              onChange={e=>setExp(+e.target.value)} style={{width:"100%",accentColor:RED}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:px(11),color:V.muted,marginTop:4}}>
              <span>0 yrs</span><span>Entry level</span><span>Senior</span><span>25 yrs</span>
            </div>
          </div>
          <div style={{background:"#0d1117",borderRadius:16,padding:"28px",textAlign:"center"}}>
            <div style={{fontSize:px(11),color:"#475569",marginBottom:8,fontWeight:700,letterSpacing:"1px"}}>PREDICTED ANNUAL SALARY</div>
            <div style={{fontFamily:"monospace",fontSize:px(44),fontWeight:900,color:RED}}>
              ${pred}k
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(14),color:"#64748b",marginTop:8}}>
              = {m} × {exp} + {b}
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#475569",marginTop:4}}>
              = {pred}k/year
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              ["Model Equation","ŷ = 8.2x + 40",RED],
              ["R² Score","0.97 (97% variance explained)",GRN],
              ["Training Size","200 salary records",TEAL],
              ["Algorithm","Ordinary Least Squares",AMB],
              ["Feature","Years of experience",VIO],
            ].map(([k,v,col])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",
                background:col+"0d",border:`1px solid ${col}22`,borderRadius:8,padding:"7px 12px"}}>
                <span style={{fontSize:px(11),color:V.muted}}>{k}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:col,fontSize:px(11)}}>{v}</span>
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
const RegTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"📈",c:RED, t:"Regression predicts continuous values (prices, temperatures, scores). Output ∈ ℝ — any real number on the number line."},
    {e:"📐",c:AMB, t:"The linear model: ŷ = mx + b. m = slope (rate of change). b = y-intercept (value when x=0). These two parameters define the line."},
    {e:"📉",c:VIO, t:"MSE = (1/n)Σ(yᵢ−ŷᵢ)². Measures average squared error. Squaring penalises large errors more heavily. The lower the MSE, the better."},
    {e:"⛰️",c:TEAL,t:"Gradient descent minimises MSE by iteratively moving parameters in the direction of steepest descent. Update: θ = θ − α∇J(θ)."},
    {e:"📏",c:ROSE,t:"R² (coefficient of determination) = 1 − SSE/SST. R²=1 → perfect fit. R²=0 → no better than predicting the mean. R²<0 → worse than mean."},
    {e:"🔢",c:SKY, t:"Multiple regression: ŷ = θ₀ + θ₁x₁ + θ₂x₂ + … + θₙxₙ. Add more features to capture more dimensions of the relationship."},
    {e:"⚠️",c:AMB, t:"Overfitting in regression: polynomial of too high degree hugs noise. Regularisation (Ridge=L2, Lasso=L1) penalises large weights to prevent this."},
    {e:"🌍",c:RED, t:"Used everywhere: real estate pricing, stock forecasting, energy demand, drug dosage prediction, economic modelling, climate modelling."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",RED)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:RED}}>Know</span></h2>
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
            background:`linear-gradient(90deg,${RED},${AMB})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:RED,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Classification →
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
const RegressionPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Regression" lessonNum="Lesson 2 of 7"
    accent={RED} levelLabel="Machine Learning"
    dotLabels={["Hero","Explanation","Math","Loss Fn","Gradient","Visualizer","Python","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#1f0707 60%,#0f0505 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack}
                style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",
                  fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📊 Lesson 2 of 7 · Machine Learning",RED)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Regression<br/><span style={{color:"#fca5a5"}}>Models</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:RED,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                Regression is the oldest form of machine learning — and still one of the most used.
                Any time you predict "how much" or "how many", you're doing regression. House prices,
                stock returns, temperature forecasts, insurance premiums — all regression problems.
              </p>
              <div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fca5a5",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Find the mathematical curve (line, polynomial, or more complex) that best fits your data.
                  "Best fit" means minimising the sum of squared vertical distances from data points to the curve.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(239,68,68,0.06)",
              border:"1px solid rgba(239,68,68,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE EXPLANATION ──────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Explanation",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Predicting <span style={{color:RED}}>Numbers</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  When you predict a <strong>continuous numerical value</strong> — not a category, not
                  a yes/no answer, but an actual number — you're doing regression. The output can
                  theoretically be any real number from −∞ to +∞.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:20}}>
                  Regression finds the function that best explains the numerical relationship between
                  your inputs (features X) and your numerical output (target Y). The "best" function
                  is the one that makes the smallest errors on your training data.
                </p>
                <IBox color={RED} title="The Best-Fit Line Idea"
                  body="Imagine plotting 200 houses on a scatter graph: x-axis = square footage, y-axis = sale price. Each house is a dot. There's a clear upward trend but with some scatter. Regression finds the single line that passes as close as possible to all dots simultaneously — minimising the total squared vertical distance from each dot to the line."/>
              </div>
              <div>
                {[
                  {e:"🏠",c:RED,t:"House price",x:"Size, location, rooms",y:"$412,000"},
                  {e:"📈",c:AMB,t:"Stock forecasting",x:"P/E ratio, volume, news",y:"$147.23 (+2.4%)"},
                  {e:"🌡️",c:TEAL,t:"Temperature forecast",x:"Pressure, humidity, wind",y:"23.7°C"},
                  {e:"💊",c:VIO,t:"Drug dosage",x:"Patient weight, age, condition",y:"12.5 mg"},
                  {e:"⚡",c:SKY,t:"Energy consumption",x:"Time, weather, occupancy",y:"142.5 kWh"},
                  {e:"🚗",c:GRN,t:"Car resale value",x:"Age, mileage, condition",y:"$18,400"},
                ].map(ex=>(
                  <div key={ex.t} style={{...LCARD,padding:"12px 16px",marginBottom:8,
                    borderLeft:`3px solid ${ex.c}`,display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontSize:px(24)}}>{ex.e}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:ex.c,fontSize:px(13)}}>{ex.t}</div>
                      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginTop:4}}>
                        <span style={{fontFamily:"monospace",fontSize:px(11),color:V.muted}}>X: {ex.x}</span>
                        <span style={{color:V.border}}>→</span>
                        <span style={{fontFamily:"monospace",fontSize:px(11),color:GRN,fontWeight:700}}>Y: {ex.y}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 — MATHEMATICAL DEFINITION ─────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Mathematical Definition","#fca5a5")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The <span style={{color:"#fca5a5"}}>Linear Regression Equation</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  Simple linear regression (one feature) fits a straight line:
                </p>
                <Formula color="#fca5a5">ŷ = mx + b</Formula>
                <Formula color={TEAL}>ŷ = θ₀ + θ₁x₁ + θ₂x₂ + … + θₙxₙ</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:20}}>
                  The second form is <strong style={{color:"#fca5a5"}}>multiple linear regression</strong>
                  — using n features simultaneously. θ₀ is the bias/intercept, θ₁…θₙ are weights.
                </p>
                <IBox color="#fca5a5" title="The Normal Equations (closed form solution)"
                  body="For linear regression, we can solve for θ analytically: θ = (XᵀX)⁻¹Xᵀy. This gives the exact optimal parameters without iteration. But for large datasets (millions of rows or features), this is computationally expensive — so gradient descent is preferred instead."/>
              </div>
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {s:"ŷ",c:"#fca5a5",
                      t:"Prediction (y-hat)",
                      d:"The model's predicted value for a given input x. ŷ is our best estimate of the true label y. The 'hat' symbol denotes a predicted/estimated quantity."},
                    {s:"m",c:RED,
                      t:"Slope (rate of change)",
                      d:"How much ŷ changes when x increases by 1 unit. Positive slope → y increases with x. Negative → y decreases. Steep slope → strong relationship. Learned from data."},
                    {s:"b",c:AMB,
                      t:"Intercept (bias)",
                      d:"The predicted value when x=0. For salary prediction, it might represent the entry-level starting salary. Also called bias or offset. Always needed to shift the line vertically."},
                    {s:"x",c:TEAL,
                      t:"Input feature",
                      d:"The known input value for which we're making a prediction. Could be square footage, years of experience, temperature, etc. For multiple regression: a vector of features."},
                    {s:"θ",c:VIO,
                      t:"Parameters (weights)",
                      d:"The learnable numbers in the model — slope, intercept, and all feature weights. Training finds the θ that minimises MSE. These are 'what the model has learned'."},
                  ].map(item=>(
                    <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                      borderRadius:12,padding:"14px 18px",display:"flex",gap:14}}>
                      <div style={{fontFamily:"monospace",fontSize:px(22),fontWeight:900,
                        color:item.c,minWidth:36,textAlign:"center",paddingTop:4}}>{item.s}</div>
                      <div>
                        <div style={{fontWeight:700,color:item.c,fontSize:px(13),marginBottom:4}}>{item.t}</div>
                        <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — LOSS FUNCTION ────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Loss Function",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Measuring Prediction <span style={{color:RED}}>Error</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  How do we know if a line fits well? We need to measure the total error.
                  The most common metric for regression is <strong>Mean Squared Error (MSE)</strong>:
                </p>
                <Formula color={RED}>MSE = (1/n) Σᵢ₌₁ⁿ (yᵢ − ŷᵢ)²</Formula>
                <Formula color={AMB}>RMSE = √MSE   (same units as y)</Formula>
                <Formula color={VIO}>MAE = (1/n) Σᵢ₌₁ⁿ |yᵢ − ŷᵢ|</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  For each training example: compute the residual (yᵢ − ŷᵢ), square it,
                  sum all squared residuals, divide by n. This is the average squared error.
                </p>
                <IBox color={RED} title="Why square the errors?"
                  body="(1) Squaring makes all errors positive (no cancellation between +5 and -5). (2) Squaring penalises large errors more — a prediction off by 10 contributes 100, while one off by 1 contributes only 1. (3) The MSE is differentiable and has a clean gradient, making it ideal for gradient descent."/>
              </div>
              <div>
                {[
                  {m:"MSE",f:"(1/n)Σ(y−ŷ)²",c:RED,
                    pro:"Penalises large errors heavily. Differentiable everywhere. Clean gradient.",
                    con:"Same units as y². Sensitive to outliers. Value hard to interpret directly."},
                  {m:"RMSE",f:"√MSE",c:AMB,
                    pro:"Same units as y — directly interpretable. '±$15,000 error' makes intuitive sense.",
                    con:"Still sensitive to outliers. Not as clean a gradient as MSE."},
                  {m:"MAE",f:"(1/n)Σ|y−ŷ|",c:TEAL,
                    pro:"Robust to outliers. Same units as y. Linear penalty — treats all errors equally.",
                    con:"Not differentiable at 0. Gradient is constant — slower convergence near minimum."},
                  {m:"R²",f:"1 − SSE/SST",c:VIO,
                    pro:"Scale-free [0,1]. Measures proportion of variance explained. Comparable across datasets.",
                    con:"Can be negative. Adding useless features always increases R² → use Adjusted R²."},
                ].map(row=>(
                  <div key={row.m} style={{...LCARD,padding:"14px 18px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontWeight:800,color:row.c,fontSize:px(15)}}>{row.m}</span>
                      <span style={{fontFamily:"monospace",background:row.c+"0d",
                        border:`1px solid ${row.c}44`,borderRadius:6,padding:"3px 10px",
                        fontSize:px(12),color:row.c}}>{row.f}</span>
                    </div>
                    <div style={{fontSize:px(12),color:GRN,marginBottom:4}}>✅ {row.pro}</div>
                    <div style={{fontSize:px(12),color:ROSE}}>⚠️ {row.con}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — GRADIENT DESCENT ─────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Gradient Descent Connection","#fca5a5")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              How the Model <span style={{color:"#fca5a5"}}>Learns</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  We need to find the values of m and b (or θ₀, θ₁, …, θₙ) that minimise
                  MSE. Gradient descent is the algorithm that does this iteratively.
                </p>
                <Formula color="#fca5a5">m = m − α · (∂MSE/∂m)</Formula>
                <Formula color={TEAL}>b = b − α · (∂MSE/∂b)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  At each step, we compute how much the MSE would change if we nudged m or b
                  slightly (the gradient), then move m and b in the opposite direction — downhill.
                  Repeat until the MSE stops decreasing significantly (convergence).
                </p>
                <div style={{background:"#1e1b4b",borderRadius:12,padding:"16px 20px"}}>
                  <div style={{fontWeight:700,color:"#fca5a5",marginBottom:10,fontSize:px(13)}}>
                    Gradients for Linear Regression (MSE):
                  </div>
                  <div style={{fontFamily:"monospace",fontSize:px(13),color:"#94a3b8",lineHeight:2.2}}>
                    <div>∂J/∂m = (2/n) Σ (ŷᵢ − yᵢ) · xᵢ</div>
                    <div>∂J/∂b = (2/n) Σ (ŷᵢ − yᵢ)</div>
                  </div>
                </div>
              </div>
              <div>
                {[
                  {n:"1",t:"Initialise",d:"Start with random (or zero) values for m and b. The line will be wrong initially.",c:AMB},
                  {n:"2",t:"Forward pass",d:"For all training points, compute ŷᵢ = m·xᵢ + b. Calculate MSE.",c:RED},
                  {n:"3",t:"Compute gradients",d:"Differentiate MSE with respect to m and b. This tells us which direction increases MSE most.",c:VIO},
                  {n:"4",t:"Update parameters",d:"Move m and b opposite to gradient direction by step size α. m = m − α·∂J/∂m.",c:TEAL},
                  {n:"5",t:"Repeat",d:"Go back to step 2. After thousands of iterations, MSE converges to its minimum value.",c:GRN},
                ].map(s=>(
                  <div key={s.n} style={{display:"flex",gap:14,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{width:32,height:32,borderRadius:"50%",flexShrink:0,
                      background:s.c+"22",border:`2px solid ${s.c}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:px(13),fontWeight:800,color:s.c}}>{s.n}</div>
                    <div>
                      <div style={{fontWeight:700,color:s.c,fontSize:px(13),marginBottom:4}}>{s.t}</div>
                      <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — VISUALIZATION ────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Interactive Visualizer",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              See the <span style={{color:RED}}>Regression Line Update Live</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Click anywhere on the chart to add data points (years experience → salary).
              The red line is the OLS best-fit line — it recalculates instantly.
              Orange dashes show residuals (prediction errors). The green dot shows a live prediction.
            </p>
            <RegressionViz/>
          </div>
        </div>

        {/* ── SECTION 6 — PYTHON EXAMPLE ───────────────────────── */}
        <div ref={R(6)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python Example","#fca5a5")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code it with <span style={{color:"#fca5a5"}}>NumPy + Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#fca5a5" lines={[
                  "import numpy as np",
                  "import matplotlib.pyplot as plt",
                  "from sklearn.linear_model import LinearRegression",
                  "from sklearn.metrics import r2_score, mean_squared_error",
                  "",
                  "# Dataset: house size (100 sqft) → price ($100k)",
                  "X = np.array([[1],[2],[3],[4],[5],[6],[7],[8]])",
                  "y = np.array([2, 4, 5, 4.5, 7, 8, 8.5, 9])",
                  "",
                  "# Fit linear regression",
                  "model = LinearRegression()",
                  "model.fit(X, y)",
                  "",
                  "# Get parameters",
                  "print('Slope m =', model.coef_[0])",
                  "print('Intercept b =', model.intercept_)",
                  "",
                  "# Predict",
                  "pred = model.predict(X)",
                  "print('R²:', r2_score(y, pred))",
                  "print('MSE:', mean_squared_error(y, pred))",
                  "",
                  "# Visualise",
                  "plt.scatter(X, y, color='red', label='Data')",
                  "plt.plot(X, pred, color='blue', label='Fit line')",
                  "plt.xlabel('House size (×100 sqft)')",
                  "plt.ylabel('Price (×$100k)')",
                  "plt.legend(); plt.show()",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"X.shape = (8,1) ← 2D required",c:RED,
                    d:"Scikit-learn requires X to be 2D. Use reshape(-1,1) to convert a 1D array. y stays 1D."},
                  {l:"model.fit(X, y)",c:AMB,
                    d:"Internally solves Normal Equations: θ=(XᵀX)⁻¹Xᵀy for small datasets. For large datasets uses iterative solver."},
                  {l:"model.coef_[0] → slope",c:VIO,
                    d:"The learned slope m. If 1.1, then each 100 sqft adds $110k to the price prediction."},
                  {l:"model.intercept_ → b",c:TEAL,
                    d:"The learned intercept. If 0.8, the model predicts $80k for a house with size=0 (not meaningful here, but mathematically required)."},
                  {l:"plt.scatter(X, y)",c:ROSE,
                    d:"Scatter plot shows raw data. Each point is one house. The cloud's shape reveals whether linear regression is appropriate."},
                  {l:"plt.plot(X, pred)",c:GRN,
                    d:"Draws the best-fit regression line through the scatter cloud. The visual gap between dots and line = residuals."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:10,padding:"12px 16px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,
                      fontSize:px(11),marginBottom:5}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — APPLICATIONS ─────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Real-World Uses",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Regression <span style={{color:RED}}>in the Wild</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"📈",c:RED,t:"Finance & Trading",
                  b:"Regression models predict asset returns, credit risk scores, and options pricing. Black-Scholes option pricing is a regression-like formula. Hedge funds use regularised regression (Ridge/Lasso) on hundreds of market features to predict returns.",
                  tech:"Ridge Regression, Lasso, ElasticNet"},
                {e:"🏪",c:AMB,t:"Sales Forecasting",
                  b:"Retailers predict next quarter sales using regression on past sales, marketing spend, seasonality, and competitor pricing. Accurate forecasting prevents both stockouts and overstock. Walmart's supply chain uses time-series regression models at massive scale.",
                  tech:"Linear Reg, ARIMA, Prophet (time-series)"},
                {e:"⚡",c:TEAL,t:"Energy Demand",
                  b:"Power grids must predict demand minutes to hours ahead to balance supply. Features: temperature, time of day, day of week, holidays. Under/overproduction both have severe consequences. Regression here must be accurate, fast, and interpretable.",
                  tech:"Multiple Linear Reg, Random Forest Reg"},
                {e:"🏥",c:VIO,t:"Clinical Dosage",
                  b:"Drug dosage regression: predict optimal dose from patient weight, age, kidney function, and drug metabolism markers. Too little → ineffective. Too much → toxic. Regression models are FDA-approved tools in pharmacokinetic modelling.",
                  tech:"Nonlinear Regression, Mixed-Effects Models"},
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
            {STag("Section 8 · Mini Game",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Fit the Line</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Adjust slope and intercept until your line fits through all 8 data points.
              Score is based on MSE — the same metric the real algorithm minimises.
              This is what <em>every</em> training step of gradient descent achieves automatically.
            </p>
            <FitLineGame/>
          </div>
        </div>

        {/* ── SECTION 9 — MINI PROJECT ─────────────────────────── */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Project",RED)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Salary <span style={{color:RED}}>Prediction Model</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A real linear regression model trained on salary data. Drag the slider to
              generate live predictions using the learned equation. Examine the code to
              see exactly how it was built in Scikit-learn.
            </p>
            <SalaryProject/>
          </div>
        </div>

        {/* ── SECTION 10 — INSIGHTS ────────────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <RegTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default RegressionPage;
