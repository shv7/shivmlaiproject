import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — SUPERVISED LEARNING
   Level 3 · Machine Learning · Lesson 1 of 7
   Accent: Amber #f59e0b
══════════════════════════════════════════════════════════════════ */

const AMB  = "#f59e0b";
const VIO  = "#7c3aed";
const TEAL = "#0d9488";
const ROSE = "#e11d48";
const SKY  = "#0284c7";
const GRN  = "#059669";
const INK  = "#1e293b";

/* ── shared atoms ──────────────────────────────────────────────── */
const Formula = ({children, color=AMB}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines, color=TEAL}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9,marginTop:px(10)}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("//")?"#475569":color}}>{l}</div>
    ))}
  </div>
);
const Tag = ({label, color}) => (
  <span style={{...LTAG(color)}}>{label}</span>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — animated data points + function curve
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const pts=[
      {x:0.1,y:0.18},{x:0.18,y:0.22},{x:0.28,y:0.31},{x:0.38,y:0.40},
      {x:0.48,y:0.52},{x:0.58,y:0.60},{x:0.68,y:0.70},{x:0.78,y:0.77},{x:0.88,y:0.85}
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#08060f"; ctx.fillRect(0,0,W,H);
      // grid
      ctx.strokeStyle="rgba(245,158,11,0.06)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // axes
      const pad=48;
      ctx.strokeStyle="rgba(245,158,11,0.3)"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
      ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
      // labels
      ctx.font="11px sans-serif"; ctx.fillStyle="rgba(245,158,11,0.5)"; ctx.textAlign="center";
      ctx.fillText("X (input features)",W/2,H-10);
      ctx.save();ctx.translate(14,H/2);ctx.rotate(-Math.PI/2);
      ctx.fillText("Y (output / label)",0,0);ctx.restore();
      // animated regression line
      const progress=Math.min(1,(Math.sin(t*0.5)+1)/2);
      ctx.beginPath();
      ctx.moveTo(pad,(H-pad)*(1-0.05*progress));
      ctx.lineTo(W-pad/2,(H-pad)*(1-0.88*progress));
      ctx.strokeStyle=AMB; ctx.lineWidth=2.5;
      ctx.shadowColor=AMB; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
      // data points
      pts.forEach((p,i)=>{
        const cx=pad+p.x*(W-pad*1.5), cy=(H-pad)-(p.y+0.04*Math.sin(t*0.8+i))*(H-pad*1.5);
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,16);
        g.addColorStop(0,VIO+"66"); g.addColorStop(1,VIO+"00");
        ctx.beginPath();ctx.arc(cx,cy,16,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=VIO;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
        // error dashes
        const predY=(H-pad)-(0.9*p.x+0.05)*progress*(H-pad*1.5);
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,predY);
        ctx.strokeStyle=ROSE+"66"; ctx.lineWidth=1.2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      });
      // legend
      ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      [[VIO,"Training data (X, Y)"],[AMB,"Learned function f(X)"],[ROSE,"Prediction errors"]].forEach(([col,lbl],i)=>{
        ctx.fillStyle=col; ctx.fillRect(pad,12+i*18,12,12);
        ctx.fillStyle=col+"cc"; ctx.fillText(lbl,pad+16,22+i*18);
      });
      t+=0.008; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   PIPELINE VISUALIZER — clickable stages
══════════════════════════════════════════════════════════════════ */
const PipelineViz = () => {
  const [active, setActive] = useState(null);
  const steps = [
    {id:0,e:"📦",t:"Data Collection",c:AMB,
      desc:"Gather raw labeled data from databases, APIs, sensors, or human annotation. The quality of labels directly caps model performance. Bad labels → bad model, no matter how sophisticated the algorithm.",
      example:"1,200 house photos + verified sale prices from MLS database",
      code:"df = pd.read_csv('houses.csv')  # 1200 rows, 8 features"},
    {id:1,e:"🧹",t:"Preprocessing",c:VIO,
      desc:"Clean nulls, normalize features to similar scales (StandardScaler), encode categoricals (one-hot), remove outliers. Raw data is almost never model-ready. ~80% of an ML engineer's time is here.",
      example:"Normalize sq_ft to [0,1]. One-hot encode 'city'. Fill missing bedrooms with median.",
      code:"X = StandardScaler().fit_transform(X_raw)"},
    {id:2,e:"✂️",t:"Train/Test Split",c:TEAL,
      desc:"Split data 80/20. The test set simulates 'future unseen data'. Never train on test data — that's data leakage. Always shuffle before splitting for unbiased evaluation.",
      example:"960 houses → training. 240 houses → held-out test set. Model never sees test data.",
      code:"X_tr,X_te,y_tr,y_te = train_test_split(X,y,test_size=0.2)"},
    {id:3,e:"🧠",t:"Model Training",c:ROSE,
      desc:"Feed (X_train, y_train) pairs into the learning algorithm. Parameters are updated via gradient descent to minimise the cost function J(θ). This is where 'learning' happens.",
      example:"Linear regression solves for slope/intercept minimising MSE across all 960 training houses.",
      code:"model.fit(X_train, y_train)  # minimise MSE"},
    {id:4,e:"🎯",t:"Prediction",c:SKY,
      desc:"Apply learned function f to new, unseen X: Ŷ = f(X_test). The model has never seen these inputs during training. This is the ultimate test of generalisation.",
      example:"model.predict([[2000,3,2]])  # 2000sqft, 3bd, 2ba → predicts $427,000",
      code:"y_pred = model.predict(X_test)"},
    {id:5,e:"📊",t:"Evaluation",c:GRN,
      desc:"Measure quality with metrics: MSE, MAE, R² for regression; accuracy, precision, recall, F1 for classification. Compare to baseline (e.g. always predict mean). Iterate if unsatisfied.",
      example:"R² = 0.94 → model explains 94% of price variance. Good! Below 0.7 → go back to step 1.",
      code:"print(r2_score(y_test, y_pred))  # → 0.94"},
  ];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:12,fontSize:px(15)}}>
        🔄 The ML Pipeline — Click each stage to expand
      </div>
      <div style={{display:"flex",gap:0,overflowX:"auto",marginBottom:20}}>
        {steps.map((s,i)=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",flexShrink:0}}>
            <div onClick={()=>setActive(active===s.id?null:s.id)}
              style={{background:active===s.id?s.c:s.c+"18",
                border:`2px solid ${s.c}${active===s.id?"":"55"}`,
                borderRadius:12,padding:"14px 16px",cursor:"pointer",textAlign:"center",
                minWidth:92,transition:"all 0.2s"}}>
              <div style={{fontSize:px(26),marginBottom:4}}>{s.e}</div>
              <div style={{fontSize:px(10),fontWeight:700,
                color:active===s.id?"#fff":s.c,lineHeight:1.3}}>{s.t}</div>
            </div>
            {i<steps.length-1&&(
              <div style={{padding:"0 4px",color:AMB+"88",fontSize:px(18),fontWeight:900}}>→</div>
            )}
          </div>
        ))}
      </div>
      {active!==null&&(
        <div style={{background:steps[active].c+"0d",border:`1px solid ${steps[active].c}44`,
          borderRadius:12,padding:"18px 22px"}}>
          <div style={{fontWeight:800,color:steps[active].c,marginBottom:8,fontSize:px(15)}}>
            {steps[active].e} {steps[active].t}
          </div>
          <p style={{...LBODY,fontSize:px(14),marginBottom:10}}>{steps[active].desc}</p>
          <div style={{background:"#f8f9fa",borderRadius:8,padding:"10px 14px",
            fontFamily:"monospace",fontSize:px(12),color:"#334155",marginBottom:10,
            borderLeft:`3px solid ${steps[active].c}`}}>
            📋 {steps[active].example}
          </div>
          <CodeBox color={steps[active].c} lines={[steps[active].code]}/>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   GAME — "TRAIN THE AI" — manual slope/intercept fitting
══════════════════════════════════════════════════════════════════ */
const TrainAIGame = () => {
  const canvasRef = useRef();
  const [slope,  setSlope]  = useState(0.5);
  const [interc, setInterc] = useState(1.0);
  const [score,  setScore]  = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [best, setBest] = useState(null);

  const DATA = [
    {x:1,y:1.1,label:"House A"},{x:2,y:2.0,label:"House B"},{x:3,y:3.1,label:"House C"},
    {x:4,y:4.0,label:"House D"},{x:5,y:5.2,label:"House E"},{x:6,y:5.9,label:"House F"},
    {x:7,y:7.1,label:"House G"}
  ];

  const mse = useCallback(()=>{
    return DATA.reduce((s,p)=>{
      const pred=slope*p.x+interc; return s+(p.y-pred)**2;
    },0)/DATA.length;
  },[slope,interc]);

  const redraw = useCallback(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    const pad=44;
    const toC=(x,y)=>({x:pad+(x-0)/(8-0)*(W-2*pad), y:H-pad-(y-0)/(9-0)*(H-2*pad)});

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fefdf8"; ctx.fillRect(0,0,W,H);

    // grid
    ctx.strokeStyle="#f3ede0"; ctx.lineWidth=1;
    for(let i=0;i<=8;i++){const{x}=toC(i,0);ctx.beginPath();ctx.moveTo(x,pad/2);ctx.lineTo(x,H-pad);ctx.stroke();}
    for(let i=0;i<=9;i++){const{y}=toC(0,i);ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-pad/2,y);ctx.stroke();}

    // axes
    ctx.strokeStyle="#334155"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="10px monospace"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
    for(let i=0;i<=8;i++){const{x}=toC(i,0);ctx.fillText(i,x,H-pad+14);}
    for(let i=0;i<=9;i++){const{y}=toC(0,i);ctx.fillText(i,pad-14,y+4);}
    ctx.fillStyle="#64748b"; ctx.font="bold 11px sans-serif";
    ctx.fillText("Size (×100 sqft)",W/2,H-4);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);
    ctx.fillText("Price (×$100k)",0,0);ctx.restore();

    // ideal line (faded)
    const il0=toC(0,0.05),il1=toC(8,8.05);
    ctx.beginPath();ctx.moveTo(il0.x,il0.y);ctx.lineTo(il1.x,il1.y);
    ctx.strokeStyle=GRN+"44"; ctx.lineWidth=1.5; ctx.setLineDash([8,6]); ctx.stroke(); ctx.setLineDash([]);

    // user line
    const l0=toC(0,interc), l8=toC(8,slope*8+interc);
    ctx.beginPath();ctx.moveTo(l0.x,l0.y);ctx.lineTo(l8.x,l8.y);
    ctx.strokeStyle=AMB; ctx.lineWidth=3;
    ctx.shadowColor=AMB; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;

    // error lines + points
    const err=mse();
    DATA.forEach(p=>{
      const dp=toC(p.x,p.y), pred=slope*p.x+interc, pp=toC(p.x,pred);
      ctx.beginPath();ctx.moveTo(dp.x,dp.y);ctx.lineTo(pp.x,pp.y);
      ctx.strokeStyle=ROSE+"99"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      const g=ctx.createRadialGradient(dp.x,dp.y,0,dp.x,dp.y,14);
      g.addColorStop(0,VIO+"55"); g.addColorStop(1,VIO+"00");
      ctx.beginPath();ctx.arc(dp.x,dp.y,14,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(dp.x,dp.y,6,0,Math.PI*2);ctx.fillStyle=VIO;ctx.fill();
      ctx.beginPath();ctx.arc(dp.x,dp.y,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
    });

    // MSE indicator
    const barW=W-2*pad, barH=6;
    ctx.fillStyle="#e2e8f0"; ctx.beginPath();ctx.roundRect(pad,H-16,barW,barH,3);ctx.fill();
    const maxErr=5, fillW=Math.min(barW,barW*(err/maxErr));
    const barCol=err<0.1?"#10b981":err<0.5?AMB:ROSE;
    ctx.fillStyle=barCol; ctx.beginPath();ctx.roundRect(pad,H-16,fillW,barH,3);ctx.fill();
    ctx.font="bold 10px sans-serif"; ctx.fillStyle=barCol; ctx.textAlign="right";
    ctx.fillText("MSE: "+err.toFixed(3),W-pad/2,H-18);
  },[slope,interc,mse]);

  useEffect(()=>{redraw();},[redraw]);

  const check=()=>{
    const err=mse();
    setAttempts(a=>a+1);
    const grade=err<0.05?"🏆 Perfect!":err<0.15?"🥇 Excellent!":err<0.4?"🥈 Good":err<1?"⚠️ Getting there":"❌ Keep trying";
    if(best===null||err<best)setBest(err);
    setScore(grade+" MSE="+err.toFixed(3));
  };

  return (
    <div style={{...LCARD,background:"#fefdf8",border:`2px solid ${AMB}33`}}>
      <div style={{fontWeight:800,color:AMB,fontSize:px(17),marginBottom:4}}>
        🎮 Train the AI — Manually Fit the Model
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Each purple dot is a <strong>labeled training example</strong> (house size → price).
        Adjust slope and intercept to draw the best-fit line through all points.
        The red dashes show prediction errors. This is exactly what gradient descent automates!
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:300,display:"block",
            borderRadius:12,border:`1px solid ${AMB}22`}}/>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <span style={{fontSize:px(11),color:VIO}}>● Training data</span>
            <span style={{fontSize:px(11),color:AMB}}>— Your model line</span>
            <span style={{fontSize:px(11),color:GRN+"99"}}>-- Optimal line</span>
            <span style={{fontSize:px(11),color:ROSE}}>- - Errors</span>
          </div>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          {[["Slope (m) — steepness",slope,setSlope,-1,3,0.05,AMB],
            ["Intercept (b) — y-offset",interc,setInterc,-2,4,0.05,VIO]
          ].map(([l,v,s,mn,mx,st,col])=>(
            <div key={l}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(11),color:V.muted}}>{l}</span>
                <span style={{fontSize:px(12),fontWeight:800,color:col}}>{v.toFixed(2)}</span>
              </div>
              <input type="range" min={mn} max={mx} step={st} value={v}
                onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:col}}/>
            </div>
          ))}
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",fontFamily:"monospace",fontSize:px(13)}}>
            <div style={{color:"#475569",marginBottom:4}}># Your model equation:</div>
            <div>y = <span style={{color:AMB,fontWeight:700}}>{slope.toFixed(2)}</span>x
              {" "}+ <span style={{color:VIO,fontWeight:700}}>{interc.toFixed(2)}</span></div>
            <div style={{marginTop:6}}>MSE: <span style={{
              color:mse()<0.1?"#10b981":mse()<0.5?AMB:ROSE,fontWeight:700}}>{mse().toFixed(4)}</span></div>
          </div>
          <button onClick={check}
            style={{background:AMB,border:"none",borderRadius:10,padding:"12px",
              color:INK,fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
            📊 Evaluate My Model
          </button>
          {score&&(
            <div style={{background:AMB+"15",border:`1px solid ${AMB}44`,borderRadius:10,
              padding:"12px",textAlign:"center",fontWeight:700,color:AMB,fontSize:px(13)}}>
              {score}
              {best!==null&&<div style={{fontSize:px(11),color:GRN,marginTop:4}}>
                Best so far: {best.toFixed(4)}
              </div>}
            </div>
          )}
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:10,
            padding:"12px",fontSize:px(11),color:VIO,lineHeight:1.8}}>
            <strong>🎯 Target:</strong><br/>
            slope ≈ 1.0, intercept ≈ 0.0<br/>
            Attempts: {attempts}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   KEY INSIGHTS CHECKLIST
══════════════════════════════════════════════════════════════════ */
const SLTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"📚",c:AMB, t:"Supervised learning trains on labeled (X, Y) pairs. The labels are the 'correct answers' that guide learning. No labels = no supervised learning."},
    {e:"🗺️",c:VIO, t:"Goal: learn f: X → Y — a mapping from input features to output — that generalises to unseen data, not one that just memorises training examples."},
    {e:"🔢",c:TEAL,t:"Two major types: Regression (predict continuous numbers like prices) and Classification (predict discrete categories like spam/not-spam)."},
    {e:"📉",c:ROSE,t:"Training minimises a cost function J(θ). Lower cost = smaller prediction errors. Gradient descent finds the parameters θ that minimise J(θ)."},
    {e:"🧪",c:SKY, t:"Always split into train/test sets. Test performance = real-world generalisation. A model that scores 100% on training but 60% on test is overfitting."},
    {e:"🔄",c:GRN, t:"The ML pipeline: Data → Preprocess → Split → Train → Predict → Evaluate → Iterate. ~80% of real ML work is in data collection and preprocessing."},
    {e:"⚠️",c:AMB, t:"Overfitting: memorises training data, fails on new. Underfitting: too simple. The sweet spot is a model that generalises — not too complex, not too simple."},
    {e:"🌍",c:VIO, t:"Supervised ML powers: Gmail spam filter, credit card fraud detection, medical imaging diagnosis, Netflix recommendations, language translation, and more."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",AMB)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:AMB}}>Know</span></h2>
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
            background:`linear-gradient(90deg,${AMB},${TEAL})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:AMB,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:INK,fontSize:px(14)}}>
            Next: Regression →
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
const SupervisedLearningPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Supervised Learning" lessonNum="Lesson 1 of 7"
    accent={AMB} levelLabel="Machine Learning"
    dotLabels={["Hero","Intuition","Definition","Components","Types","Pipeline","Python","Visualization","Applications","Game","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#08060f 0%,#1c1003 60%,#14100a 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden",position:"relative"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center",
            position:"relative",zIndex:1}}>
            <div>
              <button onClick={onBack}
                style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
                  borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",
                  fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📊 Lesson 1 of 7 · Machine Learning",AMB)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Supervised<br/><span style={{color:"#fcd34d"}}>Learning</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:AMB,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",
                lineHeight:1.8,marginBottom:px(20)}}>
                The most widely deployed form of machine learning. Every spam filter, medical
                diagnosis assistant, loan approval system, and recommendation engine is powered
                by supervised learning. You give it examples with correct answers — it learns the pattern.
              </p>
              <div style={{background:"rgba(245,158,11,0.12)",border:"1px solid rgba(245,158,11,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fcd34d",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Show the model thousands of (input → correct output) pairs. It learns to map
                  inputs to outputs. Then it can predict the correct output for inputs it has never seen.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(245,158,11,0.06)",
              border:"1px solid rgba(245,158,11,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — INTUITIVE INTRODUCTION ─────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Intuitive Introduction",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Teacher &amp; Student <span style={{color:AMB}}>Analogy</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Imagine a student learning maths. A teacher shows them hundreds of practice problems
                  with worked solutions: "if the question is X, the correct answer is Y." After enough
                  examples, the student internalises the <em>pattern</em> — they can now solve new
                  problems they have never seen before.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  <strong>Supervised learning works identically.</strong> The "teacher" is the
                  labeled training dataset. The "student" is the model. The "practice problems" are
                  input features X. The "worked solutions" are output labels Y. The "pattern" is the
                  learned function f.
                </p>
                <IBox color={AMB} title="Why 'Supervised'?"
                  body="The word supervised refers to the fact that a human (or automated process) has provided supervision — correct labels for every training example. The model is explicitly told what the right answer is during training. Contrast with unsupervised learning, where no labels exist." />
              </div>
              <div>
                {[
                  {e:"📬",c:AMB,t:"Email classification",x:"Email text features",y:"Spam / Not Spam"},
                  {e:"🏠",c:VIO,t:"House price prediction",x:"Size, location, rooms",y:"Sale price ($)"},
                  {e:"🩺",c:TEAL,t:"Medical diagnosis",x:"X-ray pixel values",y:"Pneumonia / Normal"},
                  {e:"🎬",c:ROSE,t:"Movie rating prediction",x:"User history, movie features",y:"Rating 1–5"},
                ].map(ex=>(
                  <div key={ex.t} style={{...LCARD,padding:"14px 18px",marginBottom:10,
                    borderLeft:`4px solid ${ex.c}`}}>
                    <div style={{fontWeight:700,color:ex.c,fontSize:px(13),marginBottom:8}}>{ex.e} {ex.t}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span style={{background:ex.c+"0d",border:`1px solid ${ex.c}44`,
                        borderRadius:6,padding:"4px 10px",fontSize:px(12),color:ex.c,fontFamily:"monospace"}}>
                        X: {ex.x}
                      </span>
                      <span style={{color:V.muted,fontSize:px(14)}}>→</span>
                      <span style={{background:"#0d1117",borderRadius:6,padding:"4px 10px",
                        fontSize:px(12),color:"#10b981",fontFamily:"monospace"}}>
                        Y: {ex.y}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...LCARD,background:"#fef9e7",border:`2px solid ${AMB}33`}}>
              <div style={{fontWeight:700,color:AMB,marginBottom:10,fontSize:px(14)}}>
                🌍 Why Supervised Learning Dominates Industry
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {[
                  ["Clear success metric","Labeled data tells you exactly how well you're doing at every step."],
                  ["Wide applicability","Almost every prediction problem can be framed as supervised ML."],
                  ["Mature tooling","Scikit-learn, PyTorch, TensorFlow make it accessible in hours."],
                  ["Explainable","You can trace predictions back to specific training examples."],
                ].map(([t,d])=>(
                  <div key={t} style={{background:"#fff",borderRadius:10,padding:"12px 14px",
                    border:`1px solid ${AMB}22`}}>
                    <div style={{fontWeight:700,color:AMB,fontSize:px(12),marginBottom:4}}>{t}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 — FORMAL DEFINITION ───────────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Formal Definition","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Mathematical <span style={{color:"#fcd34d"}}>Framework</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  Formally, supervised learning is the task of learning a function f that maps
                  input X to output Y, given a training dataset of labeled examples.
                </p>
                <Formula color="#fcd34d">Y = f(X)</Formula>
                <Formula color={TEAL}>f* = argmin_f E[L(Y, f(X))]</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  The second formula says: find the function f* that minimises the expected
                  loss L between true labels Y and predictions f(X). This is the formal
                  objective every supervised learning algorithm optimises.
                </p>
                <IBox color="#fcd34d" title="Generalisation — the real goal"
                  body="The model is trained on a finite dataset D_train. The true goal is good performance on D_test — data never seen during training. A model that achieves low training loss but high test loss has overfit. Good generalisation = the model has learned the underlying pattern, not the noise."/>
              </div>
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  {[
                    {s:"X ∈ ℝⁿ",c:"#fcd34d",
                      t:"Input Features",
                      d:"A vector (or matrix for multiple samples) of measurable properties. Examples: [sq_footage, bedrooms, bathrooms, location_score]. Each dimension is one feature."},
                    {s:"Y",c:VIO,
                      t:"Output Labels",
                      d:"The ground-truth target. Continuous scalar for regression (house price = $425,000). Discrete category for classification (email = 'spam'). Must be available during training."},
                    {s:"f: X → Y",c:TEAL,
                      t:"Learned Mapping",
                      d:"The function the model approximates. Could be linear (y=mx+b), polynomial, a decision tree, or a neural network with billions of parameters. All are approximating f."},
                    {s:"θ",c:AMB,
                      t:"Model Parameters",
                      d:"The learnable values inside f — the weights and biases adjusted during training. For linear regression: just m and b. For GPT-4: 1.76 trillion parameters."},
                    {s:"J(θ)",c:ROSE,
                      t:"Cost Function",
                      d:"Measures how wrong the current parameters are. Training = finding θ that minimises J(θ). MSE for regression, cross-entropy for classification."},
                  ].map(item=>(
                    <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                      borderRadius:12,padding:"14px 18px",display:"flex",gap:14}}>
                      <div style={{fontFamily:"monospace",fontSize:px(20),fontWeight:900,
                        color:item.c,minWidth:44,textAlign:"center",paddingTop:4}}>{item.s}</div>
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

        {/* ── SECTION 3 — COMPONENTS ───────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · System Components",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(24)}}>
              Anatomy of a <span style={{color:AMB}}>Supervised Learning System</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"🗄️",c:AMB,t:"Dataset",
                  def:"A collection of N (input, label) pairs: D = {(x₁,y₁), (x₂,y₂), …, (xₙ,yₙ)}. The size and quality of this dataset is the single biggest predictor of model performance.",
                  ex:"1,200 rows of house data: size, location, price"},
                {e:"📊",c:VIO,t:"Features (X)",
                  def:"The measurable properties used as input. Features are columns in your data table. Choosing which features to include is called feature engineering — often the highest-impact step.",
                  ex:"[square_feet=2100, bedrooms=3, distance_to_school=0.4]"},
                {e:"🏷️",c:TEAL,t:"Labels (Y)",
                  def:"The correct output for each training example. In regression: a continuous number. In classification: a category or class index. Labels require human effort or automated collection.",
                  ex:"sale_price = $412,000 or class = 'spam'"},
                {e:"🏋️",c:ROSE,t:"Training Data",
                  def:"The subset of data used to fit model parameters. Typically 70–80% of the full dataset. Model sees and learns from this data during gradient descent updates.",
                  ex:"960 of 1,200 houses → used to learn weights"},
                {e:"🧪",c:SKY,t:"Test Data",
                  def:"The held-out subset never seen during training. Used only once to measure final performance. Simulates model performance on truly new data. Using it during training = cheating.",
                  ex:"240 held-out houses → measure final R²"},
                {e:"🔮",c:GRN,t:"Prediction (Ŷ)",
                  def:"The model's output for an input it has never seen. Ŷ = f(X_new). For regression: a number. For classification: a probability vector over classes.",
                  ex:"model.predict([[3200]]) → [$512,000]"},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{c.e}</div>
                  <div style={{fontWeight:800,color:c.c,fontSize:px(15),marginBottom:8}}>{c.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10}}>{c.def}</p>
                  <div style={{fontFamily:"monospace",background:"#f8fafc",borderRadius:8,
                    padding:"8px 12px",fontSize:px(12),color:c.c,borderLeft:`3px solid ${c.c}`}}>
                    {c.ex}
                  </div>
                </div>
              ))}
            </div>
            <IBox color={VIO} title="Input-Output Mapping Example: House Price"
              body="X = [sq_ft=2100, bedrooms=3, bathrooms=2, school_dist=0.4, city_score=7.2]. These 5 numbers are the feature vector. Y = $412,000 — the sale price label. The model learns: f([2100, 3, 2, 0.4, 7.2]) → $412,000. After training on 960 such pairs, it can predict prices for new houses."/>
          </div>
        </div>

        {/* ── SECTION 4 — TYPES ────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Types of Supervised Learning","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Two Major <span style={{color:"#fcd34d"}}>Categories</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div style={{background:AMB+"0d",border:`2px solid ${AMB}44`,borderRadius:20,padding:"28px"}}>
                <div style={{fontSize:px(48),marginBottom:12}}>📈</div>
                <div style={{fontWeight:900,color:AMB,fontSize:px(22),marginBottom:8}}>Regression</div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  Predicts a <strong style={{color:AMB}}>continuous numerical value</strong>.
                  The output can be any real number. Think of it as drawing the best curve through data points.
                </p>
                <Formula color={AMB}>Ŷ ∈ ℝ  (any real number)</Formula>
                <div style={{marginTop:12}}>
                  {[
                    ["🏠","House price","$350,000 → $1.2M"],
                    ["📈","Stock price","$147.23 tomorrow"],
                    ["🌡️","Temperature","23.7°C on Friday"],
                    ["⚡","Energy usage","142.5 kWh this month"],
                  ].map(([e,t,ex])=>(
                    <div key={t} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                      <span>{e}</span>
                      <span style={{fontWeight:700,color:AMB,minWidth:100,fontSize:px(13)}}>{t}</span>
                      <span style={{fontFamily:"monospace",color:"#94a3b8",fontSize:px(12)}}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:VIO+"0d",border:`2px solid ${VIO}44`,borderRadius:20,padding:"28px"}}>
                <div style={{fontSize:px(48),marginBottom:12}}>🏷️</div>
                <div style={{fontWeight:900,color:VIO,fontSize:px(22),marginBottom:8}}>Classification</div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  Predicts a <strong style={{color:VIO}}>discrete category</strong> from a fixed set
                  of classes. The output is a label (or probability vector over labels).
                </p>
                <Formula color={VIO}>Ŷ ∈ {"{"} class₁, class₂, … {"}"}</Formula>
                <div style={{marginTop:12}}>
                  {[
                    ["📬","Email","Spam / Not spam (binary)"],
                    ["🩺","Diagnosis","Cancer / Benign / Unclear"],
                    ["🐱","Image","Cat / Dog / Bird / Car / …"],
                    ["😊","Sentiment","Positive / Negative / Neutral"],
                  ].map(([e,t,ex])=>(
                    <div key={t} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                      <span>{e}</span>
                      <span style={{fontWeight:700,color:VIO,minWidth:100,fontSize:px(13)}}>{t}</span>
                      <span style={{fontFamily:"monospace",color:"#94a3b8",fontSize:px(12)}}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{...LCARD,background:"#1e1b4b",border:`1px solid ${AMB}33`}}>
              <div style={{fontWeight:700,color:"#fcd34d",marginBottom:10}}>🔑 The Key Distinction</div>
              <p style={{...LBODY,color:"#94a3b8",margin:0,fontSize:px(14)}}>
                The difference lies in the output type. If you're predicting "how much" or "how many" → Regression.
                If you're predicting "which category" or "is this X?" → Classification.
                The same algorithm (e.g. neural network) can do both — just swap the output layer and loss function.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — PIPELINE ─────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Learning Pipeline",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              The Complete <span style={{color:AMB}}>ML Pipeline</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Building a supervised model is a multi-stage process. Each stage has failure modes.
              Click each stage below to understand what happens, why it matters, and the code that runs there.
            </p>
            <PipelineViz/>
          </div>
        </div>

        {/* ── SECTION 6 — PYTHON EXAMPLE ───────────────────────── */}
        <div ref={R(6)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python Example","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code It in <span style={{color:"#fcd34d"}}>Scikit-learn</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(28)}}>
              Below is a complete supervised learning workflow in 18 lines using
              NumPy and Scikit-learn — the gold-standard Python ML library.
              Every line is annotated.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#fcd34d" lines={[
                  "import numpy as np",
                  "from sklearn.linear_model import LinearRegression",
                  "from sklearn.model_selection import train_test_split",
                  "from sklearn.metrics import r2_score, mean_squared_error",
                  "",
                  "# 1. Dataset: hours studied → exam score",
                  "X = np.array([[1],[2],[3],[4],[5],[6],[7],[8]])",
                  "y = np.array([52, 58, 64, 70, 76, 82, 88, 94])",
                  "",
                  "# 2. Split: 80% train, 20% test",
                  "X_tr,X_te,y_tr,y_te = train_test_split(",
                  "    X, y, test_size=0.2, random_state=42)",
                  "",
                  "# 3. Create + train the model",
                  "model = LinearRegression()",
                  "model.fit(X_tr, y_tr)    # learn m and b",
                  "",
                  "# 4. Predict on unseen test data",
                  "y_pred = model.predict(X_te)",
                  "",
                  "# 5. Evaluate",
                  "print('MSE:', mean_squared_error(y_te, y_pred))",
                  "print('R²: ', r2_score(y_te, y_pred))",
                  "print('9hrs:', model.predict([[9]]))",
                  "# Output: R² = 1.0  (perfect linear data)",
                  "#         9hrs → [100]",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"X.shape = (8,1), y.shape = (8,)",c:AMB,
                    d:"X must be 2D: (n_samples, n_features). Scikit-learn always requires this shape. y is 1D: one target per sample."},
                  {l:"train_test_split(test_size=0.2)",c:VIO,
                    d:"Randomly shuffles and splits. 80% → training. 20% → test. random_state=42 ensures reproducibility across runs."},
                  {l:"model.fit(X_tr, y_tr)",c:TEAL,
                    d:"The core learning step. Internally: solves the Normal Equations (θ = (XᵀX)⁻¹Xᵀy) to find optimal slope and intercept."},
                  {l:"model.predict(X_te)",c:ROSE,
                    d:"Applies the learned function f to unseen test data. Model has never seen X_te during training. This simulates real deployment."},
                  {l:"r2_score → 1.0 here",c:SKY,
                    d:"R² = 1.0 on perfectly linear data. In practice, R² > 0.85 is good. R² < 0.5 means the model is barely better than guessing the mean."},
                  {l:"model.predict([[9]]) → [100]",c:GRN,
                    d:"Extrapolation: predict for 9 hours studying. Works well if the linear pattern holds. The model generalised beyond its training range of 1–8 hours."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:10,padding:"12px 16px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,
                      fontSize:px(12),marginBottom:5}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — VISUALIZATION ────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Visualization",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Seeing the <span style={{color:AMB}}>Learning Process</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(24)}}>
              {[
                {e:"🔵",t:"Input Data Points",c:VIO,
                  d:"Each training sample (xᵢ, yᵢ) is plotted as a point. X is the horizontal axis (input feature), Y is vertical (label). The cloud of points reveals the underlying pattern the model must learn."},
                {e:"📉",t:"Training Loss Curve",c:ROSE,
                  d:"Plot J(θ) vs training epoch/iteration. Should decrease monotonically and flatten. Oscillating loss → learning rate too high. Barely decreasing → rate too low or wrong architecture."},
                {e:"🟠",t:"Decision Surface",c:AMB,
                  d:"The learned function visualised over feature space. Regression → best-fit line/curve. Classification → boundary separating class regions. This IS what the model has learned."},
              ].map(v=>(
                <div key={v.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${v.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(15),marginBottom:8}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{v.d}</p>
                </div>
              ))}
            </div>
            <IBox color={VIO} title="Interactive Visualization Ideas"
              body="Build a 2D scatter plot where each click adds a labeled training point. Show the model's line update in real time as data accumulates. Add a loss curve chart below — watch it drop from epoch 1 to epoch 100. Add a confusion matrix for classification tasks. These two visuals — decision surface + loss curve — are the two most important tools for understanding and debugging supervised learning."/>
          </div>
        </div>

        {/* ── SECTION 8 — APPLICATIONS ─────────────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Where It <span style={{color:"#fcd34d"}}>Powers the World</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(20)}}>
              {[
                {e:"📬",c:AMB,t:"Spam Detection",
                  b:"Gmail's spam filter was trained on billions of labeled emails (spam=1, ham=0). Features: keyword frequency, sender reputation, link density, urgency markers. Accuracy exceeds 99.9%. Every email you receive has been classified by a supervised model.",
                  tech:"Naive Bayes → Logistic Reg → Neural Net (evolution)"},
                {e:"💳",c:ROSE,t:"Fraud Detection",
                  b:"Banks label historical transactions: fraudulent=1, legitimate=0. Features: amount, location, time, merchant category, velocity. Models learn subtle fraud fingerprints. Visa processes 24,000 transactions/second using real-time supervised classification.",
                  tech:"Gradient Boosting (XGBoost) / Isolation Forest"},
                {e:"🩺",c:VIO,t:"Medical Diagnosis",
                  b:"Radiologists annotate thousands of X-rays (pneumonia=1, normal=0). Supervised CNNs match radiologist accuracy. Stanford's CheXNet achieved radiologist-level performance on chest X-rays in 2017, using 100,000+ labeled images.",
                  tech:"CNN / ResNet-50 / Vision Transformer"},
                {e:"🎬",c:TEAL,t:"Recommendation Systems",
                  b:"Netflix labels: 'user watched 90% of movie → positive signal'. Model learns: users who liked movie A tend to like movie B. 80% of hours watched on Netflix come from supervised recommendations. Training data: ~200 million user interaction histories.",
                  tech:"Two-Tower Neural Net / Matrix Factorization"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,
                  borderRadius:px(16),padding:"22px 24px"}}>
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

        {/* ── SECTION 9 — GAME ─────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              🎮 Train the <span style={{color:AMB}}>AI</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Each purple dot is a <strong>labeled training example</strong> (house size → sale price).
              Adjust slope and intercept to draw the best-fit line. The red dashes are your errors —
              minimise them. This is exactly what gradient descent does automatically in real ML systems,
              iterating thousands of times per second.
            </p>
            <TrainAIGame/>
          </div>
        </div>

        {/* ── SECTION 10 — INSIGHTS ────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <SLTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default SupervisedLearningPage;
