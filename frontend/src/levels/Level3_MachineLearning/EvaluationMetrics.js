import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — EVALUATION METRICS
   Level 3 · Machine Learning · Lesson 7 of 7
   Accent: Orange #ea580c
══════════════════════════════════════════════════════════════════ */
const ORG  = "#ea580c";
const GRN  = "#059669";
const RED  = "#dc2626";
const AMB  = "#d97706";
const CYN  = "#0891b2";
const VIO  = "#7c3aed";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const SKY  = "#0284c7";

const Formula = ({children,color=ORG}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=AMB}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — animated metrics dashboard ══════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const metrics=[
      {label:"Precision",val:0.87,col:ORG,x:0.18},
      {label:"Recall",   val:0.73,col:CYN,x:0.38},
      {label:"F1 Score", val:0.79,col:GRN,x:0.58},
      {label:"Accuracy", val:0.91,col:VIO,x:0.78},
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0510"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(234,88,12,0.05)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const animP=Math.min(1,t*0.5);
      const barH=H*0.52, barW=W*0.09, baseY=H*0.82;
      metrics.forEach(m=>{
        const cx=m.x*W, h=barH*m.val*animP;
        // glow
        const g=ctx.createRadialGradient(cx,baseY-h/2,0,cx,baseY-h/2,barW*2);
        g.addColorStop(0,m.col+"22"); g.addColorStop(1,m.col+"00");
        ctx.beginPath();ctx.arc(cx,baseY-h/2,barW*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        // bar
        ctx.beginPath();ctx.roundRect(cx-barW/2,baseY-h,barW,h,6);
        const bg=ctx.createLinearGradient(cx,baseY-h,cx,baseY);
        bg.addColorStop(0,m.col); bg.addColorStop(1,m.col+"44");
        ctx.fillStyle=bg; ctx.fill();
        // value
        if(animP>0.5){
          ctx.font=`bold ${px(16)} monospace`; ctx.fillStyle=m.col;
          ctx.textAlign="center"; ctx.fillText((m.val*100).toFixed(0)+"%",cx,baseY-h-12);
        }
        // label
        ctx.font=`bold ${px(11)} sans-serif`; ctx.fillStyle=m.col+"99";
        ctx.textAlign="center"; ctx.fillText(m.label,cx,baseY+16);
      });
      // ROC curve sketch
      const roc_cx=W*0.5, roc_cy=H*0.35, roc_r=H*0.22;
      ctx.beginPath();
      ctx.moveTo(roc_cx-roc_r,roc_cy+roc_r);
      for(let s=0;s<=1;s+=0.02){
        const fpr=s, tpr=1-Math.exp(-3*s);
        ctx.lineTo(roc_cx-roc_r+fpr*roc_r*2,roc_cy+roc_r-tpr*roc_r*2);
      }
      ctx.strokeStyle=ORG+"55"; ctx.lineWidth=2;
      ctx.shadowColor=ORG; ctx.shadowBlur=6; ctx.stroke(); ctx.shadowBlur=0;
      // diagonal
      ctx.beginPath();ctx.moveTo(roc_cx-roc_r,roc_cy+roc_r);ctx.lineTo(roc_cx+roc_r,roc_cy-roc_r);
      ctx.strokeStyle="#33333388"; ctx.lineWidth=1; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle=ORG+"88"; ctx.textAlign="center";
      ctx.fillText("ROC Curve",roc_cx,roc_cy-roc_r-10);
      t+=0.004; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ CONFUSION MATRIX — interactive ════════════════════════ */
const ConfusionMatrix = () => {
  const [tp,setTp]=useState(85);
  const [fn,setFn]=useState(15);
  const [fp,setFp]=useState(10);
  const [tn,setTn]=useState(90);
  const total=tp+fn+fp+tn;
  const acc=((tp+tn)/total*100).toFixed(1);
  const prec=tp/(tp+fp); const precPct=(prec*100).toFixed(1);
  const rec=tp/(tp+fn); const recPct=(rec*100).toFixed(1);
  const f1=(2*prec*rec/(prec+rec)*100).toFixed(1);
  const [active,setActive]=useState(null);
  const cells=[
    {key:"tp",label:"TP",title:"True Positive",val:tp,set:setTp,
      color:GRN,desc:"Model predicted POSITIVE and was CORRECT. Cancer detected, cancer present. Fraud flagged, fraud real. The good positives."},
    {key:"fn",label:"FN",title:"False Negative",val:fn,set:setFn,
      color:ROSE,desc:"Model predicted NEGATIVE but was WRONG. Cancer present but model said benign. This is the dangerous miss — also called a Type II error."},
    {key:"fp",label:"FP",title:"False Positive",val:fp,set:setFp,
      color:AMB,desc:"Model predicted POSITIVE but was WRONG. Spam flagged but was legitimate email. Innocent person flagged as fraud. Also called Type I error."},
    {key:"tn",label:"TN",title:"True Negative",val:tn,set:setTn,
      color:CYN,desc:"Model predicted NEGATIVE and was CORRECT. No cancer, no cancer detected. No fraud, no alert. The good negatives."},
  ];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:ORG,marginBottom:8,fontSize:px(15)}}>
        🎯 Interactive Confusion Matrix — Adjust counts to see metrics change
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Click a cell to learn what it means. Drag the sliders to change the
        classification results and watch all four metrics update live.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          {/* matrix header */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:4}}>
            <div/>
            <div style={{textAlign:"center",fontWeight:700,color:GRN,fontSize:px(12),padding:"6px"}}>Predicted YES</div>
            <div style={{textAlign:"center",fontWeight:700,color:RED,fontSize:px(12),padding:"6px"}}>Predicted NO</div>
          </div>
          {/* row 1 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",
              paddingRight:8,fontWeight:700,color:GRN,fontSize:px(12)}}>Actual YES</div>
            {[cells[0],cells[1]].map(cell=>(
              <div key={cell.key} onClick={()=>setActive(active===cell.key?null:cell.key)}
                style={{background:active===cell.key?cell.color:cell.color+"15",
                  border:`2px solid ${cell.color}${active===cell.key?"":"55"}`,
                  borderRadius:12,padding:"16px 8px",textAlign:"center",
                  cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{fontFamily:"monospace",fontSize:px(28),fontWeight:900,
                  color:active===cell.key?"#fff":cell.color}}>{cell.val}</div>
                <div style={{fontWeight:800,fontSize:px(14),
                  color:active===cell.key?"#ffffffcc":cell.color}}>{cell.label}</div>
              </div>
            ))}
          </div>
          {/* row 2 */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",
              paddingRight:8,fontWeight:700,color:RED,fontSize:px(12)}}>Actual NO</div>
            {[cells[2],cells[3]].map(cell=>(
              <div key={cell.key} onClick={()=>setActive(active===cell.key?null:cell.key)}
                style={{background:active===cell.key?cell.color:cell.color+"15",
                  border:`2px solid ${cell.color}${active===cell.key?"":"55"}`,
                  borderRadius:12,padding:"16px 8px",textAlign:"center",
                  cursor:"pointer",transition:"all 0.2s"}}>
                <div style={{fontFamily:"monospace",fontSize:px(28),fontWeight:900,
                  color:active===cell.key?"#fff":cell.color}}>{cell.val}</div>
                <div style={{fontWeight:800,fontSize:px(14),
                  color:active===cell.key?"#ffffffcc":cell.color}}>{cell.label}</div>
              </div>
            ))}
          </div>
          {active&&(()=>{const cell=cells.find(c=>c.key===active);return(
            <div style={{background:cell.color+"0d",border:`1px solid ${cell.color}44`,
              borderRadius:12,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontWeight:800,color:cell.color,fontSize:px(14),marginBottom:6}}>
                {cell.label} — {cell.title}
              </div>
              <p style={{...LBODY,fontSize:px(13),margin:0}}>{cell.desc}</p>
            </div>
          );})()}
          {/* sliders */}
          {cells.map(cell=>(
            <div key={cell.key} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:px(11),color:cell.color,fontWeight:700}}>{cell.label}</span>
                <span style={{fontFamily:"monospace",fontSize:px(11),color:cell.color}}>{cell.val}</span>
              </div>
              <input type="range" min={1} max={150} value={cell.val}
                onChange={e=>cell.set(+e.target.value)} style={{width:"100%",accentColor:cell.color}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...LCARD,background:"#fff8f0",border:`2px solid ${ORG}22`}}>
            <div style={{fontWeight:700,color:ORG,marginBottom:12,fontSize:px(14)}}>
              📊 Live Metrics (n={total})
            </div>
            {[
              {l:"Accuracy",f:`(${tp}+${tn})/${total}`,v:acc+"%",c:VIO},
              {l:"Precision",f:`${tp}/(${tp}+${fp})`,v:precPct+"%",c:ORG},
              {l:"Recall (Sensitivity)",f:`${tp}/(${tp}+${fn})`,v:recPct+"%",c:CYN},
              {l:"F1 Score",f:`2×P×R/(P+R)`,v:f1+"%",c:GRN},
              {l:"Specificity",f:`${tn}/(${tn}+${fp})`,v:(tn/(tn+fp)*100).toFixed(1)+"%",c:TEAL},
              {l:"False Positive Rate",f:`${fp}/(${fp}+${tn})`,v:(fp/(fp+tn)*100).toFixed(1)+"%",c:ROSE},
            ].map(row=>(
              <div key={row.l} style={{display:"flex",justifyContent:"space-between",
                alignItems:"center",padding:"7px 0",
                borderBottom:`1px solid ${V.border}`}}>
                <div>
                  <div style={{fontWeight:700,color:V.ink,fontSize:px(12)}}>{row.l}</div>
                  <div style={{fontFamily:"monospace",fontSize:px(10),color:V.muted}}>{row.f}</div>
                </div>
                <div style={{fontFamily:"monospace",fontWeight:900,color:row.c,fontSize:px(16)}}>{row.v}</div>
              </div>
            ))}
          </div>
          <IBox color={ORG} title="Which metric matters most?"
            body="Depends on the cost of each error. Medical diagnosis: minimise FN (missing cancer = catastrophic) → maximise Recall. Spam filter: minimise FP (blocking real email = annoying) → maximise Precision. Use F1 when both matter equally. Use AUC for overall model quality independent of threshold."/>
        </div>
      </div>
    </div>
  );
};

/* ══════ ROC CURVE VISUALIZER ══════════════════════════════════ */
const ROCViz = () => {
  const canvasRef=useRef();
  const [threshold,setThreshold]=useState(0.5);

  // Generate a typical ROC curve
  const rocPoints=[];
  for(let t=0;t<=1;t+=0.01){
    const fpr=t;
    const tpr=1-Math.exp(-4*t); // realistic curve above diagonal
    rocPoints.push({fpr,tpr});
  }
  const auc=rocPoints.reduce((s,p,i)=>{
    if(i===0)return s;
    const prev=rocPoints[i-1];
    return s+(p.fpr-prev.fpr)*(p.tpr+prev.tpr)/2;
  },0);

  // operating point at threshold
  const fprAt=1-threshold*0.8;
  const tprAt=1-Math.exp(-4*fprAt);

  const redraw=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=44;
    const toC=(fpr,tpr)=>({x:pad+fpr*(W-2*pad),y:H-pad-tpr*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fffbf5"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#fef3c7"; ctx.lineWidth=1;
    for(let x=0;x<=10;x++){const{x:cx}=toC(x/10,0);ctx.beginPath();ctx.moveTo(cx,pad/2);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let y=0;y<=10;y++){const{y:cy}=toC(0,y/10);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.strokeStyle="#334155"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="10px sans-serif"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
    ["0","0.5","1"].forEach((v,i)=>{const{x:cx}=toC(i*0.5,0);ctx.fillText(v,cx,H-pad+13);});
    ctx.textAlign="right";
    ["0","0.5","1"].forEach((v,i)=>{const{y:cy}=toC(0,i*0.5);ctx.fillText(v,pad-4,cy+4);});
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#64748b"; ctx.textAlign="center";
    ctx.fillText("False Positive Rate (FPR)",W/2,H-4);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);ctx.fillText("True Positive Rate (TPR)",0,0);ctx.restore();
    // AUC fill
    ctx.beginPath();
    const first=toC(0,0);ctx.moveTo(first.x,first.y);
    rocPoints.forEach(p=>{const{x,y}=toC(p.fpr,p.tpr);ctx.lineTo(x,y);});
    ctx.lineTo(toC(1,0).x,toC(1,0).y);ctx.closePath();
    ctx.fillStyle=ORG+"1a"; ctx.fill();
    // random line
    ctx.beginPath();ctx.moveTo(toC(0,0).x,toC(0,0).y);ctx.lineTo(toC(1,1).x,toC(1,1).y);
    ctx.strokeStyle="#94a3b855"; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#94a3b888"; ctx.textAlign="center";
    ctx.fillText("Random (AUC=0.5)",toC(0.65,0.55).x,toC(0.65,0.55).y-10);
    // ROC curve
    ctx.beginPath();
    rocPoints.forEach((p,i)=>{const{x,y}=toC(p.fpr,p.tpr);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
    ctx.strokeStyle=ORG; ctx.lineWidth=2.5;
    ctx.shadowColor=ORG; ctx.shadowBlur=8; ctx.stroke(); ctx.shadowBlur=0;
    // operating point
    const{x:opx,y:opy}=toC(fprAt,tprAt);
    const gg=ctx.createRadialGradient(opx,opy,0,opx,opy,20);
    gg.addColorStop(0,CYN+"88"); gg.addColorStop(1,CYN+"00");
    ctx.beginPath();ctx.arc(opx,opy,20,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
    ctx.beginPath();ctx.arc(opx,opy,7,0,Math.PI*2);ctx.fillStyle=CYN;ctx.fill();
    ctx.beginPath();ctx.arc(opx,opy,7,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    // dotted lines to axes
    ctx.beginPath();ctx.moveTo(opx,opy);ctx.lineTo(opx,H-pad);
    ctx.strokeStyle=CYN+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(opx,opy);ctx.lineTo(pad,opy);
    ctx.strokeStyle=CYN+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    ctx.font="bold 11px monospace"; ctx.fillStyle=CYN; ctx.textAlign=fprAt>0.5?"right":"left";
    ctx.fillText(`FPR=${fprAt.toFixed(2)}, TPR=${tprAt.toFixed(2)}`,opx+(fprAt>0.5?-12:12),opy-12);
    ctx.font="bold 13px sans-serif"; ctx.fillStyle=ORG; ctx.textAlign="left";
    ctx.fillText(`AUC = ${auc.toFixed(3)}`,toC(0.5,0.18).x,toC(0.5,0.18).y);
  },[threshold,fprAt,tprAt,auc]);

  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:ORG,marginBottom:8,fontSize:px(15)}}>
        📈 ROC Curve — Drag threshold to see operating point shift
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The ROC curve plots TPR (recall) vs FPR at every possible classification threshold.
        Higher threshold → fewer positives predicted → lower FPR but lower TPR too.
        AUC measures the area under this curve: 1.0 = perfect, 0.5 = random, 0 = all wrong.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
            border:`1px solid ${ORG}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 200px",display:"flex",flexDirection:"column",gap:14}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:px(12),color:V.muted}}>Classification Threshold</span>
              <span style={{fontFamily:"monospace",fontWeight:800,color:CYN}}>{threshold.toFixed(2)}</span>
            </div>
            <input type="range" min={0.01} max={0.99} step={0.01} value={threshold}
              onChange={e=>setThreshold(+e.target.value)} style={{width:"100%",accentColor:CYN}}/>
          </div>
          <div style={{background:"#0d1117",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(12),lineHeight:2}}>
            <div style={{color:"#475569"}}># At threshold = {threshold.toFixed(2)}:</div>
            <div>FPR = <span style={{color:ROSE}}>{fprAt.toFixed(3)}</span></div>
            <div>TPR = <span style={{color:GRN}}>{tprAt.toFixed(3)}</span></div>
            <div>AUC = <span style={{color:ORG,fontWeight:700}}>{auc.toFixed(3)}</span></div>
            <div style={{color:auc>0.9?GRN:auc>0.7?AMB:ROSE,fontWeight:700}}>
              {auc>0.9?"🏆 Excellent":auc>0.8?"✅ Good":auc>0.7?"⚠️ Fair":"❌ Poor"}
            </div>
          </div>
          {[
            {v:0.9,l:"High threshold (conservative)"},
            {v:0.5,l:"Default threshold"},
            {v:0.2,l:"Low threshold (aggressive)"},
          ].map(({v,l})=>(
            <button key={v} onClick={()=>setThreshold(v)}
              style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:8,
                padding:"8px 12px",cursor:"pointer",textAlign:"left",
                fontSize:px(11),color:CYN,fontWeight:600}}>
              τ={v} — {l}
            </button>
          ))}
          <IBox color={ORG} title="AUC interpretation"
            body="AUC = probability that model ranks a random positive above a random negative. AUC 0.5 = no skill. 0.7-0.8 = acceptable. 0.8-0.9 = excellent. > 0.9 = outstanding."/>
        </div>
      </div>
    </div>
  );
};

/* ══════ FIX THE MODEL GAME ════════════════════════════════════ */
const FixModelGame = () => {
  const [threshold,setThreshold]=useState(0.5);
  const [target,setTarget]=useState("recall");
  const [locked,setLocked]=useState(false);
  const [score,setScore]=useState(null);
  const [step,setStep]=useState(0);

  const SCENARIOS=[
    {
      name:"Medical: Cancer Detection",
      icon:"🏥",
      color:ROSE,
      goal:"recall",
      goalLabel:"Maximise Recall — missing cancer is catastrophic!",
      optThresh:0.2,
      data:{
        desc:"200 patients: 40 have cancer (positive), 160 do not.",
        hint:"Set threshold LOW so the model flags more patients as positive — catching more true cancers even if some false alarms occur.",
      }
    },
    {
      name:"Finance: Spam Email Filter",
      icon:"📧",
      color:ORG,
      goal:"precision",
      goalLabel:"Maximise Precision — blocking real emails is costly!",
      optThresh:0.8,
      data:{
        desc:"1000 emails: 100 spam, 900 legitimate.",
        hint:"Set threshold HIGH so the model only flags something as spam when it's very confident — fewer false positives.",
      }
    },
    {
      name:"General: Balanced Classification",
      icon:"⚖️",
      color:GRN,
      goal:"f1",
      goalLabel:"Maximise F1 Score — balance both precision and recall",
      optThresh:0.5,
      data:{
        desc:"500 samples, roughly balanced classes.",
        hint:"The default threshold of 0.5 often works best for balanced data.",
      }
    },
  ];
  const sc=SCENARIOS[step%SCENARIOS.length];

  const getMetrics=(t)=>{
    const tp=Math.round(40*(1-Math.pow(t,0.8)));
    const fn=40-tp;
    const fp=Math.round(160*(1-Math.pow(t,1.5)));
    const tn=160-fp;
    const total=tp+fn+fp+tn;
    const prec=tp/(tp+fp+0.001);
    const rec=tp/(tp+fn+0.001);
    const f1=2*prec*rec/(prec+rec+0.001);
    const acc=(tp+tn)/total;
    return {tp,fn,fp,tn,prec,rec,f1,acc};
  };
  const m=getMetrics(threshold);
  const goalVal=sc.goal==="recall"?m.rec:sc.goal==="precision"?m.prec:m.f1;
  const optM=getMetrics(sc.optThresh);
  const optVal=sc.goal==="recall"?optM.rec:sc.goal==="precision"?optM.prec:optM.f1;

  const lockIn=()=>{
    const diff=Math.abs(goalVal-optVal);
    const pct=Math.max(0,Math.round((1-diff/optVal)*100));
    setScore(pct);setLocked(true);
  };
  const next=()=>{setStep(s=>s+1);setThreshold(0.5);setLocked(false);setScore(null);};

  return (
    <div style={{...LCARD,background:"#fff8f0",border:`2px solid ${ORG}33`}}>
      <div style={{fontWeight:800,color:ORG,fontSize:px(17),marginBottom:8}}>
        🎮 Fix the Model — Adjust Threshold to Hit the Target Metric
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Different use cases demand different metric trade-offs. Drag the threshold
        to optimise for the right metric given the business context.
      </p>
      <div style={{background:sc.color+"0d",border:`2px solid ${sc.color}44`,borderRadius:12,
        padding:"14px 18px",marginBottom:16}}>
        <div style={{fontWeight:800,color:sc.color,fontSize:px(15),marginBottom:4}}>
          {sc.icon} Scenario {step%3+1}/3: {sc.name}
        </div>
        <p style={{...LBODY,fontSize:px(13),marginBottom:6}}>{sc.data.desc}</p>
        <div style={{fontWeight:700,color:sc.color,fontSize:px(13)}}>🎯 Goal: {sc.goalLabel}</div>
        {!locked&&<p style={{...LBODY,fontSize:px(12),marginTop:6,color:V.muted}}>{sc.data.hint}</p>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),marginBottom:16}}>
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontWeight:700,color:V.muted,fontSize:px(13)}}>Threshold τ</span>
            <span style={{fontFamily:"monospace",fontWeight:900,color:CYN,fontSize:px(16)}}>{threshold.toFixed(2)}</span>
          </div>
          <input type="range" min={0.05} max={0.95} step={0.01} value={threshold}
            onChange={e=>!locked&&setThreshold(+e.target.value)} style={{width:"100%",accentColor:CYN}}/>
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",marginTop:12,
            fontFamily:"monospace",fontSize:px(12),lineHeight:2}}>
            <div style={{color:"#475569"}}># Confusion matrix:</div>
            <div>TP=<span style={{color:GRN}}>{m.tp}</span>  FN=<span style={{color:ROSE}}>{m.fn}</span></div>
            <div>FP=<span style={{color:AMB}}>{m.fp}</span>  TN=<span style={{color:CYN}}>{m.tn}</span></div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[
            {l:"Accuracy",v:m.acc,c:VIO,bold:sc.goal==="acc"},
            {l:"Precision",v:m.prec,c:ORG,bold:sc.goal==="precision"},
            {l:"Recall",v:m.rec,c:CYN,bold:sc.goal==="recall"},
            {l:"F1 Score",v:m.f1,c:GRN,bold:sc.goal==="f1"},
          ].map(row=>(
            <div key={row.l} style={{background:row.bold?row.c+"15":"#f8fafc",
              border:`2px solid ${row.bold?row.c:V.border}`,borderRadius:10,
              padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontWeight:row.bold?800:600,color:row.bold?row.c:V.muted,fontSize:px(13)}}>
                {row.l} {row.bold?"🎯":""}
              </span>
              <span style={{fontFamily:"monospace",fontWeight:900,color:row.c,fontSize:px(16)}}>
                {(row.v*100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      {!locked?(
        <button onClick={lockIn}
          style={{background:ORG,border:"none",borderRadius:10,padding:"12px 28px",
            color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
          🔒 Lock In My Threshold
        </button>
      ):(
        <div>
          <div style={{background:score>=80?GRN+"0d":score>=60?AMB+"0d":ROSE+"0d",
            border:`2px solid ${score>=80?GRN:score>=60?AMB:ROSE}`,borderRadius:12,
            padding:"14px 18px",marginBottom:12}}>
            <div style={{fontWeight:800,fontSize:px(16),
              color:score>=80?GRN:score>=60?AMB:ROSE,marginBottom:4}}>
              {score>=90?"🏆 Optimal!"
               :score>=70?"✅ Good choice!"
               :score>=50?"⚠️ Not bad, but..."
               :"❌ The optimal was τ="+sc.optThresh}
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(13),color:V.muted}}>
              Your {sc.goal}: {(goalVal*100).toFixed(1)}% | Optimal: {(optVal*100).toFixed(1)}% | Score: {score}%
            </div>
          </div>
          <button onClick={next}
            style={{background:ORG,border:"none",borderRadius:10,padding:"10px 24px",
              color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
            {step%3<2?"Next Scenario →":"🎓 Complete! Play again"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ SPAM CLASSIFIER PROJECT ═══════════════════════════════ */
const SpamProject = () => {
  const [wordFreq,setWordFreq]=useState(0.04);
  const [linkCount,setLinkCount]=useState(3);
  const [urgent,setUrgent]=useState(1);
  const [caps,setCaps]=useState(0.3);
  const [threshold,setThresh]=useState(0.5);

  const z=-3.2+wordFreq*40+linkCount*0.6+urgent*1.8+caps*4.2;
  const prob=1/(1+Math.exp(-z));
  const pred=prob>=threshold?"SPAM":"HAM";

  // Simulated evaluation on 100 examples at this threshold
  const tp=Math.round(prob>=threshold?35*Math.min(1,prob/0.8):10);
  const fn=35-tp;
  const fp=Math.round(prob>=threshold?65*(1-threshold*0.9):5);
  const tn=65-fp;
  const acc=((tp+tn)/100*100).toFixed(1);
  const prec=(tp/(tp+fp+0.001)*100).toFixed(1);
  const rec=(tp/(tp+fn+0.001)*100).toFixed(1);
  const f1=(2*tp/(2*tp+fp+fn)*100).toFixed(1);

  return (
    <div style={{...LCARD,background:"#fff8f0",border:`2px solid ${ORG}22`}}>
      <div style={{fontWeight:700,color:ORG,marginBottom:8,fontSize:px(15)}}>
        📧 Mini Project — Spam Classifier with Live Evaluation Metrics
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A logistic regression spam classifier. Adjust email features and the decision
        threshold. Watch how all four evaluation metrics respond.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:12,letterSpacing:"1px"}}>
            EMAIL FEATURES
          </div>
          {[
            {l:"Word 'free' frequency",v:wordFreq,s:setWordFreq,min:0,max:0.2,step:0.001,c:ORG,fmt:v=>v.toFixed(3)},
            {l:"Hyperlink count",v:linkCount,s:setLinkCount,min:0,max:15,step:1,c:CYN,fmt:v=>v},
            {l:"Urgent keywords",v:urgent,s:setUrgent,min:0,max:5,step:1,c:ROSE,fmt:v=>v},
            {l:"CAPS ratio",v:caps,s:setCaps,min:0,max:1,step:0.05,c:VIO,fmt:v=>(v*100).toFixed(0)+"%"},
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
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Decision Threshold τ</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:AMB,fontSize:px(13)}}>{threshold.toFixed(2)}</span>
            </div>
            <input type="range" min={0.1} max={0.9} step={0.01} value={threshold}
              onChange={e=>setThresh(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
          </div>
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",marginTop:12,
            fontFamily:"monospace",fontSize:px(12),lineHeight:1.9}}>
            <div style={{color:"#475569"}}># Logistic regression output:</div>
            <div>z = {z.toFixed(3)}</div>
            <div>σ(z) = <span style={{color:prob>0.5?ROSE:GRN,fontWeight:700}}>{(prob*100).toFixed(1)}%</span></div>
            <div>threshold = {threshold.toFixed(2)}</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:pred==="SPAM"?"#1a0008":"#001a0e",
            border:`3px solid ${pred==="SPAM"?ROSE:GRN}`,borderRadius:16,
            padding:"24px",textAlign:"center"}}>
            <div style={{fontSize:px(48),marginBottom:8}}>{pred==="SPAM"?"🗑️":"📬"}</div>
            <div style={{fontWeight:900,fontSize:px(26),
              color:pred==="SPAM"?ROSE:GRN,marginBottom:6}}>{pred}</div>
            <div style={{fontFamily:"monospace",fontSize:px(16),color:pred==="SPAM"?ROSE:GRN}}>
              {(prob*100).toFixed(1)}% spam probability
            </div>
          </div>
          <div style={{...LCARD,padding:"14px"}}>
            <div style={{fontWeight:700,color:ORG,fontSize:px(12),marginBottom:10}}>
              📊 EVALUATION METRICS (100-sample dataset)
            </div>
            {[["Accuracy",acc+"%",VIO],["Precision",prec+"%",ORG],["Recall",rec+"%",CYN],["F1 Score",f1+"%",GRN]].map(([k,v,c])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:px(12),color:V.muted}}>{k}</span>
                <span style={{fontFamily:"monospace",fontWeight:800,color:c,fontSize:px(14)}}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{...LCARD,padding:"12px"}}>
            <div style={{fontWeight:700,color:ORG,fontSize:px(11),marginBottom:6}}>CONFUSION MATRIX</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
              {[[tp,"TP",GRN],[fn,"FN",ROSE],[fp,"FP",AMB],[tn,"TN",CYN]].map(([v,l,c])=>(
                <div key={l} style={{background:c+"0d",border:`1px solid ${c}33`,
                  borderRadius:8,padding:"8px",textAlign:"center"}}>
                  <div style={{fontFamily:"monospace",fontWeight:900,color:c,fontSize:px(20)}}>{v}</div>
                  <div style={{fontWeight:700,fontSize:px(11),color:c}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════ */
const EMTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"📊",c:ORG, t:"Never trust training accuracy alone. Always evaluate on a held-out test set. Training accuracy is optimistic — it measures memorisation, not generalisation."},
    {e:"🔲",c:GRN, t:"Confusion matrix: TP (correct positive), TN (correct negative), FP (false alarm, Type I), FN (missed positive, Type II). The foundation of all classification metrics."},
    {e:"🎯",c:VIO, t:"Accuracy = (TP+TN)/total. Misleading for imbalanced data — 99% accuracy on 1% fraud rate by always predicting 'not fraud'. Always check class distribution first."},
    {e:"🔍",c:ORG, t:"Precision = TP/(TP+FP). Of all positive predictions, how many were correct? High precision = few false alarms. Critical for spam filters, recommendation systems."},
    {e:"🏥",c:CYN, t:"Recall = TP/(TP+FN). Of all actual positives, how many did we catch? High recall = few misses. Critical for cancer detection, fraud, anomaly detection."},
    {e:"⚖️",c:GRN, t:"F1 Score = harmonic mean of precision and recall. Use when you need both to be high. Favours balance — a model with P=1.0, R=0 gets F1=0."},
    {e:"📈",c:ROSE,t:"ROC AUC measures model quality across ALL thresholds. AUC=0.5 is random. AUC=1.0 is perfect. Threshold-independent — compare models without choosing a threshold first."},
    {e:"⚙️",c:AMB, t:"Threshold tuning: default τ=0.5 is rarely optimal. For medical diagnosis lower it to maximise recall. For spam filtering raise it to maximise precision. AUC doesn't depend on threshold choice."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",ORG)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:ORG}}>Know</span></h2>
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
            background:`linear-gradient(90deg,${ORG},${AMB})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:ORG,border:"none",borderRadius:10,
            padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Final Lesson: ML Libraries & Project →
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
const EvaluationMetricsPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Evaluation Metrics" lessonNum="Lesson 7 of 7"
    accent={ORG} levelLabel="Machine Learning"
    dotLabels={["Hero","Why Metrics","Confusion Matrix","Accuracy","Precision","Recall","F1","ROC/AUC","Python","Visualization","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#0f0600 0%,#2a0f00 60%,#110800 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📊 Lesson 7 of 7 · Machine Learning",ORG)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Evaluation<br/><span style={{color:"#fed7aa"}}>Metrics</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:ORG,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                Training a model is only half the job. How do you know it actually works?
                Accuracy alone can be catastrophically misleading — a cancer detection model
                that labels everyone as healthy is 99% accurate on healthy people.
                Evaluation metrics reveal the truth that accuracy hides.
              </p>
              <div style={{background:"rgba(234,88,12,0.12)",border:"1px solid rgba(234,88,12,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fed7aa",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Different problems require different metrics. Medical diagnosis prioritises
                  Recall (never miss a case). Spam detection prioritises Precision (never
                  block real mail). F1 balances both. AUC measures model quality independent
                  of any single threshold.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(234,88,12,0.06)",
              border:"1px solid rgba(234,88,12,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — WHY METRICS MATTER ──────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why Evaluation Metrics Matter",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Beyond <span style={{color:ORG}}>Accuracy</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  After training, every ML model needs a rigorous evaluation. Without proper
                  metrics, you might deploy a model that looks good on paper but fails
                  dangerously in production.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Two critical distinctions every ML engineer must understand:
                </p>
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {[
                    {t:"Training Accuracy",c:GRN,
                      d:"Performance on data the model has SEEN. Always optimistic — the model has 'memorised' these examples. A high training accuracy is expected; it tells you nothing."},
                    {t:"Test Accuracy",c:CYN,
                      d:"Performance on data the model has NEVER seen. The true measure of generalisation. This is what determines whether a model is ready to deploy."},
                    {t:"Overfitting",c:ROSE,
                      d:"Training accuracy >> Test accuracy. Model memorised training data including noise. Symptoms: near-100% training, 60-70% test. Fix: regularisation, more data, pruning."},
                    {t:"Underfitting",c:AMB,
                      d:"Both training AND test accuracy are low. Model is too simple — it hasn't learned the underlying pattern. Fix: more complex model, more features, more training."},
                  ].map(item=>(
                    <div key={item.t} style={{...LCARD,borderLeft:`4px solid ${item.c}`,padding:"12px 16px"}}>
                      <div style={{fontWeight:800,color:item.c,fontSize:px(13),marginBottom:4}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <IBox color={ORG} title="The Accuracy Paradox"
                  body="Credit card dataset: 99.8% of transactions are legitimate, 0.2% are fraud. A model that ALWAYS predicts 'not fraud' achieves 99.8% accuracy while catching zero fraud cases. It's useless despite its impressive accuracy. This is why Precision, Recall, and F1 exist."/>
                <div style={{...LCARD,background:"#fff8f0",border:`2px solid ${ORG}22`,marginTop:16}}>
                  <div style={{fontWeight:700,color:ORG,marginBottom:12,fontSize:px(14)}}>
                    🗺️ The Metric Selection Guide
                  </div>
                  {[
                    {s:"Class imbalance?",a:"→ Avoid accuracy. Use F1, AUC, precision/recall.",c:ROSE},
                    {s:"FN is costly (medical)?",a:"→ Maximise Recall",c:CYN},
                    {s:"FP is costly (spam)?",a:"→ Maximise Precision",c:ORG},
                    {s:"Both matter equally?",a:"→ Maximise F1 Score",c:GRN},
                    {s:"Comparing models?",a:"→ Use AUC (threshold-independent)",c:VIO},
                    {s:"Regression problem?",a:"→ Use MAE, RMSE, R²",c:TEAL},
                  ].map(row=>(
                    <div key={row.s} style={{marginBottom:8,padding:"8px 12px",
                      background:row.c+"08",borderRadius:8,
                      borderLeft:`3px solid ${row.c}`}}>
                      <div style={{fontWeight:700,fontSize:px(12),color:V.ink}}>{row.s}</div>
                      <div style={{fontSize:px(12),color:row.c,fontWeight:600}}>{row.a}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — CONFUSION MATRIX ────────────────────────────── */}
        <div ref={R(2)} style={{background:"#0a0510"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Confusion Matrix","#fed7aa")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              The <span style={{color:"#fed7aa"}}>Source of Truth</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",maxWidth:px(680),marginBottom:px(24)}}>
              All four classification metrics derive from the confusion matrix.
              Click a cell to understand its meaning. Drag sliders to explore trade-offs.
            </p>
            <ConfusionMatrix/>
          </div>
        </div>

        {/* ── S3 — ACCURACY ────────────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Accuracy",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Simplest — and Most <span style={{color:ORG}}>Misused</span> — Metric
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={ORG}>Accuracy = (TP + TN) / (TP + TN + FP + FN)</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Accuracy is the proportion of predictions that were correct.
                  Simple, intuitive, and widely understood. Perfect for balanced classes
                  where each type of error carries equal cost.
                </p>
                <IBox color={ORG} title="When accuracy lies"
                  body="Fraud detection: 99.5% of transactions are legitimate. A model always predicting 'not fraud' has 99.5% accuracy. But it catches 0 fraudulent transactions — completely useless. Disease screening: 1% of patients have the disease. Predicting 'healthy' for everyone gives 99% accuracy while missing every sick patient. Always check class balance before trusting accuracy."/>
              </div>
              <div>
                {[
                  {t:"✅ Use accuracy when",items:["Classes are balanced (roughly equal positives/negatives)","All errors are equally costly","Binary or multi-class classification","Quick sanity check on model fit"]},
                  {t:"❌ Don't use accuracy when",items:["Classes are imbalanced (< 10% minority class)","False positives and false negatives have different costs","Detecting rare events (fraud, disease, anomalies)","Comparing models on skewed datasets"]},
                ].map(section=>(
                  <div key={section.t} style={{...LCARD,marginBottom:12}}>
                    <div style={{fontWeight:700,fontSize:px(13),marginBottom:8,
                      color:section.t.startsWith("✅")?GRN:ROSE}}>{section.t}</div>
                    {section.items.map(i=>(
                      <div key={i} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                        <span style={{color:section.t.startsWith("✅")?GRN:ROSE,flexShrink:0,marginTop:2}}>
                          {section.t.startsWith("✅")?"✓":"✗"}
                        </span>
                        <p style={{...LBODY,fontSize:px(13),margin:0}}>{i}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S4 — PRECISION ───────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#0a0510"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Precision","#fed7aa")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              When False Alarms <span style={{color:"#fed7aa"}}>Are Costly</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color="#fed7aa">Precision = TP / (TP + FP)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Precision asks: "Of everything I flagged as positive, how many were
                  actually positive?" High precision means few false alarms.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  A spam filter with <strong style={{color:"#fed7aa"}}>precision = 0.99</strong>
                  means that 99% of emails it marks as spam actually are spam — only 1% are
                  legitimate emails incorrectly blocked. Users trust the filter.
                </p>
                <IBox color="#fed7aa" title="Precision–Recall trade-off"
                  body="Precision and recall are in tension — improving one often hurts the other. A very conservative model (high threshold) makes fewer predictions, all highly confident → high precision, low recall. An aggressive model (low threshold) flags everything → high recall, low precision. F1 balances the two."/>
              </div>
              <div>
                {[
                  {t:"🚫 Spam Detection",c:"#fed7aa",
                    d:"Precision is critical. A false positive blocks a real email — the user misses an important message. Users notice and lose trust. In court cases, courts have ruled email providers liable for blocking legitimate business communication. Target: Precision > 99%."},
                  {t:"📢 Recommendation Systems",c:ORG,
                    d:"Netflix/Spotify/Amazon target high precision: of all recommended items, most should actually be relevant to the user. Irrelevant recommendations waste the user's time and damage trust in the system."},
                  {t:"⚖️ Legal Evidence",c:VIO,
                    d:"'Innocent until proven guilty' is a precision-first framework. The cost of a false positive (imprisoning an innocent person) is deemed worse than a false negative (a guilty person going free). Precision > Recall."},
                ].map(item=>(
                  <div key={item.t} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                    <div style={{fontWeight:800,color:item.c,fontSize:px(14),marginBottom:6}}>{item.t}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — RECALL ──────────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Recall (Sensitivity)",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              When Missing a Case <span style={{color:ORG}}>Is Catastrophic</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={ORG}>Recall = TP / (TP + FN)</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Recall (also called Sensitivity or True Positive Rate) asks:
                  "Of all actual positives that exist, how many did I catch?"
                  High recall means few missed cases.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  A cancer screening model with <strong>recall = 0.98</strong> catches 98%
                  of all cancers. Only 2% are missed (false negatives). The remaining 2%
                  are patients who receive a false 'all clear' — the most dangerous outcome.
                </p>
                <IBox color={CYN} title="Recall in safety-critical systems"
                  body="Any system where a missed detection is worse than a false alarm should optimise recall: cancer screening, COVID testing, nuclear safety, food contamination, fraud detection (catching fraud is more important than occasional false flags). Lower the threshold → higher recall → more false positives, but fewer dangerous misses."/>
              </div>
              <div>
                {[
                  {t:"🏥 Medical Diagnosis",c:CYN,
                    d:"Missing cancer = patient dies untreated. A missed positive is catastrophic, while a false positive only means an unnecessary follow-up scan. Cancer screening targets Recall > 95%. Better to over-refer than under-diagnose."},
                  {t:"🔍 Fraud Detection",c:GRN,
                    d:"Undetected fraud means financial loss. Banks accept some false positives (temporarily frozen legitimate cards) to achieve high recall on actual fraud. Customer service handles false positives; actual fraud causes direct financial damage."},
                  {t:"✈️ Safety Systems",c:ROSE,
                    d:"Turbine fault detection in aircraft: missing a critical fault (FN) is catastrophic. Frequent false alarms (FP) are merely inconvenient. FAA regulations mandate specific recall thresholds for safety-critical sensor systems."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,borderLeft:`4px solid ${item.c}`,marginBottom:10}}>
                    <div style={{fontWeight:800,color:item.c,fontSize:px(14),marginBottom:6}}>{item.t}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — F1 ──────────────────────────────────────────── */}
        <div ref={R(6)} style={{background:"#0a0510"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · F1 Score","#fed7aa")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              The <span style={{color:"#fed7aa"}}>Harmonic Balance</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color="#fed7aa">F1 = 2 × (Precision × Recall) / (Precision + Recall)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  F1 is the harmonic mean of Precision and Recall. Unlike the arithmetic mean,
                  the harmonic mean heavily penalises extreme imbalances — a model with
                  P=1.0 and R=0.0 gets F1 = 0, not 0.5.
                </p>
                <div style={{background:"#1e1b4b",borderRadius:12,padding:"16px",marginBottom:16}}>
                  <div style={{fontWeight:700,color:"#fed7aa",marginBottom:10,fontSize:px(13)}}>
                    📋 Why harmonic mean?
                  </div>
                  {[
                    {l:"P=0.9, R=0.9",f1:"0.9",am:"0.9",note:"Balanced — both equal",c:GRN},
                    {l:"P=1.0, R=0.5",f1:"0.667",am:"0.75",note:"F1 penalises low recall",c:AMB},
                    {l:"P=0.5, R=1.0",f1:"0.667",am:"0.75",note:"F1 penalises low precision",c:AMB},
                    {l:"P=1.0, R=0.0",f1:"0.000",am:"0.50",note:"F1=0 catches useless edge",c:ROSE},
                  ].map(row=>(
                    <div key={row.l} style={{display:"grid",gridTemplateColumns:"1fr 0.5fr 0.5fr 1fr",
                      gap:6,marginBottom:6,alignItems:"center",fontSize:px(11)}}>
                      <span style={{fontFamily:"monospace",color:"#94a3b8"}}>{row.l}</span>
                      <span style={{fontFamily:"monospace",color:row.c,fontWeight:700}}>F1={row.f1}</span>
                      <span style={{fontFamily:"monospace",color:"#475569"}}>AM={row.am}</span>
                      <span style={{color:row.c,fontSize:px(10)}}>{row.note}</span>
                    </div>
                  ))}
                </div>
                <IBox color="#fed7aa" title="F1 extensions"
                  body="Fβ Score generalises F1: Fβ = (1+β²) × (P×R) / (β²×P + R). β>1 weights recall more (β=2 for medical). β<1 weights precision more (β=0.5 for spam). Macro-F1: average F1 across all classes. Weighted-F1: average weighted by class frequency. Use sklearn's classification_report for all of these."/>
              </div>
              <div>
                {[
                  {e:"💰",c:GRN,t:"Credit Scoring (balanced)",
                    d:"Both missed frauds (FN) and blocked good customers (FP) hurt the business. F1 optimises both simultaneously. Run GridSearchCV with F1 as the scoring metric."},
                  {e:"🔐",c:"#fed7aa",t:"Network Intrusion Detection",
                    d:"Both missing attacks (FN) and blocking legitimate traffic (FP) are harmful. Security teams use F1 to set alert thresholds that don't overwhelm analysts with false alarms while still catching real threats."},
                  {e:"📝",c:CYN,t:"Named Entity Recognition (NLP)",
                    d:"In text extraction: missing a company name (FN) and tagging a non-entity as a company (FP) both hurt downstream pipelines. F1 is the standard benchmark metric for NER models (CoNLL, OntoNotes)."},
                ].map(item=>(
                  <div key={item.t} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"14px 16px",marginBottom:10}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:px(24)}}>{item.e}</span>
                      <span style={{fontWeight:800,color:item.c,fontSize:px(14)}}>{item.t}</span>
                    </div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S7 — ROC/AUC ─────────────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · ROC Curve & AUC",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Model Quality <span style={{color:ORG}}>Without a Threshold</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(24)}}>
              Drag the threshold slider to see how the operating point moves along
              the ROC curve. AUC summarises the entire curve in a single number.
            </p>
            <ROCViz/>
          </div>
        </div>

        {/* ── S8 — PYTHON ──────────────────────────────────────── */}
        <div ref={R(8)} style={{background:"#0a0510"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Python Example","#fed7aa")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code It with <span style={{color:"#fed7aa"}}>Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#fed7aa" lines={[
                  "import numpy as np",
                  "from sklearn.metrics import (",
                  "  accuracy_score, precision_score,",
                  "  recall_score, f1_score,",
                  "  roc_auc_score, confusion_matrix,",
                  "  classification_report",
                  ")",
                  "",
                  "# Example predictions",
                  "y_true = [0,1,1,0,1,1,0,0,1,0]",
                  "y_pred = [0,1,0,0,1,1,0,1,1,0]",
                  "y_prob = [0.1,0.9,0.4,0.2,0.8,0.85,0.15,0.6,0.75,0.3]",
                  "",
                  "# Individual metrics",
                  "print('Accuracy:', accuracy_score(y_true, y_pred))",
                  "print('Precision:', precision_score(y_true, y_pred))",
                  "print('Recall:', recall_score(y_true, y_pred))",
                  "print('F1 Score:', f1_score(y_true, y_pred))",
                  "print('AUC:', roc_auc_score(y_true, y_prob))",
                  "",
                  "# Confusion matrix",
                  "cm = confusion_matrix(y_true, y_pred)",
                  "print(cm)  # [[TN, FP], [FN, TP]]",
                  "",
                  "# Full report in one call",
                  "print(classification_report(",
                  "  y_true, y_pred,",
                  "  target_names=['Not Spam', 'Spam']",
                  "))",
                  "",
                  "# Custom threshold (default is 0.5)",
                  "threshold = 0.3",
                  "y_pred_custom = (np.array(y_prob) >= threshold).astype(int)",
                  "print('Recall at τ=0.3:',",
                  "      recall_score(y_true, y_pred_custom))",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"accuracy_score(y_true, y_pred)",c:VIO,
                    d:"(TP+TN)/total. Binary and multiclass. Simple ratio of correct predictions. Use zero_division=0 to handle edge cases."},
                  {l:"precision_score(...)",c:ORG,
                    d:"TP/(TP+FP). By default, binary. For multiclass use average='macro', 'micro', or 'weighted'. Handle zero-division with zero_division=0."},
                  {l:"recall_score(...)",c:CYN,
                    d:"TP/(TP+FN). Also called sensitivity or TPR. For imbalanced datasets, this is usually more informative than accuracy."},
                  {l:"roc_auc_score(y_true, y_prob)",c:GRN,
                    d:"Requires probability scores (predict_proba), not binary predictions. Threshold-independent — always use y_prob, not y_pred, for AUC."},
                  {l:"confusion_matrix()",c:ROSE,
                    d:"Returns [[TN, FP], [FN, TP]] for binary. Plot with seaborn.heatmap() for beautiful visualisation. normalise=True gives proportions."},
                  {l:"classification_report()",c:AMB,
                    d:"One-line summary: precision, recall, F1, support for each class plus macro and weighted averages. Best first look at any classification model."},
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

        {/* ── S9 — VISUALIZATION ───────────────────────────────── */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Visualization",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Seeing the <span style={{color:ORG}}>Metrics</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(24)}}>
              {[
                {e:"🌡️",c:ORG,t:"Confusion Matrix Heatmap",
                  d:"Use seaborn.heatmap(cm, annot=True, fmt='d'). Colour by count or normalised proportion. Instantly reveals which class pairs are confused most often."},
                {e:"📈",c:CYN,t:"ROC Curve",
                  d:"sklearn.metrics.RocCurveDisplay.from_estimator(). Plot multiple models on same axes to compare AUC. The curve above the diagonal is better; the top-left corner is perfect."},
                {e:"🎯",c:GRN,t:"Precision-Recall Curve",
                  d:"For highly imbalanced data, the PR curve is more informative than ROC. PrecisionRecallDisplay.from_estimator(). High area under PR curve = good performance on the minority class."},
              ].map(v=>(
                <div key={v.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${v.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(14),marginBottom:8}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S10 — GAME ───────────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Game",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Fix the Model</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Three real-world scenarios, each requiring a different metric target.
              Drag the classification threshold to maximise the right metric for the situation.
              Learn how the precision–recall trade-off plays out in practice.
            </p>
            <FixModelGame/>
          </div>
        </div>

        {/* ── S11 — PROJECT ────────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 11 · Mini Project",ORG)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Spam Classifier <span style={{color:ORG}}>Evaluation Dashboard</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Adjust email features and the classification threshold. Watch all four
              metrics update live alongside the confusion matrix. This is the evaluation
              workflow you'll run on every ML model you build.
            </p>
            <SpamProject/>
          </div>
        </div>

        {/* ── S12 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(12)} style={{background:V.paper}}>
          <EMTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default EvaluationMetricsPage;
