import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — ML LIBRARIES & FINAL PROJECT
   Level 3 · Machine Learning · Lesson 8 of 8 (Capstone)
   Accent: Indigo #4f46e5
══════════════════════════════════════════════════════════════════ */
const IND  = "#4f46e5";
const AMB  = "#d97706";
const GRN  = "#059669";
const CYN  = "#0891b2";
const PNK  = "#ec4899";
const VIO  = "#7c3aed";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const ORG  = "#ea580c";
const RED  = "#dc2626";

const Formula = ({children,color=IND}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=CYN}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — ML pipeline flow ════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const LIBS=[
      {label:"NumPy",sub:"Math",e:"🔢",col:AMB,x:0.1},
      {label:"Pandas",sub:"Data",e:"🐼",col:GRN,x:0.27},
      {label:"Matplotlib",sub:"Viz",e:"📊",col:CYN,x:0.44},
      {label:"Sklearn",sub:"Models",e:"🤖",col:IND,x:0.61},
      {label:"OpenCV",sub:"Vision",e:"👁️",col:PNK,x:0.78},
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#06040f"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(79,70,229,0.05)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const cy=H*0.5, R=Math.min(W,H)*0.12;
      const progress=Math.min(1,t*0.5);
      // flow arrows between libs
      LIBS.forEach((lib,i)=>{
        if(i>=LIBS.length-1)return;
        const x1=lib.x*W+R*0.7, x2=LIBS[i+1].x*W-R*0.7;
        const ep=Math.min(1,(progress-i*0.15)/0.25);
        if(ep<=0)return;
        const ex=x1+(x2-x1)*ep;
        ctx.beginPath();ctx.moveTo(x1,cy);ctx.lineTo(ex,cy);
        ctx.strokeStyle=IND+"66"; ctx.lineWidth=2; ctx.stroke();
        // arrowhead
        if(ep>0.9){
          ctx.beginPath();ctx.moveTo(ex,cy);ctx.lineTo(ex-12,cy-7);ctx.lineTo(ex-12,cy+7);ctx.closePath();
          ctx.fillStyle=IND+"88"; ctx.fill();
        }
      });
      // library circles
      LIBS.forEach((lib,i)=>{
        const cx=lib.x*W;
        const ep=Math.min(1,(progress-i*0.1)/0.3);
        if(ep<=0)return;
        const r=R*ep;
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2);
        g.addColorStop(0,lib.col+"22"); g.addColorStop(1,lib.col+"00");
        ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.fillStyle="#1a1630"; ctx.fill();
        ctx.strokeStyle=lib.col; ctx.lineWidth=2.5;
        ctx.shadowColor=lib.col; ctx.shadowBlur=16; ctx.stroke(); ctx.shadowBlur=0;
        ctx.font=`${px(20)} sans-serif`; ctx.textAlign="center"; ctx.fillText(lib.e,cx,cy+6);
        ctx.font=`bold ${px(12)} sans-serif`; ctx.fillStyle=lib.col; ctx.fillText(lib.label,cx,cy+r+16);
        ctx.font=`${px(9)} sans-serif`; ctx.fillStyle=lib.col+"88"; ctx.fillText(lib.sub,cx,cy+r+28);
      });
      // pipeline label
      if(progress>0.8){
        ctx.font=`bold ${px(11)} sans-serif`; ctx.fillStyle=IND+"88"; ctx.textAlign="center";
        ctx.fillText("← The ML Pipeline →",W/2,H*0.15);
      }
      t+=0.004; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ LIBRARY CARD COMPONENT ════════════════════════════════ */
const LibCard = ({name,version,icon,color,tagline,purpose,code,annotations,facts}) => {
  const [open,setOpen]=useState(false);
  return (
    <div style={{...LCARD,border:`2px solid ${color}33`,cursor:"pointer",
      background:open?color+"06":V.card,transition:"all 0.2s"}}
      onClick={()=>setOpen(o=>!o)}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:open?16:0}}>
        <div style={{width:52,height:52,borderRadius:14,background:color+"15",
          border:`2px solid ${color}44`,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:px(26),flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontWeight:900,color,fontSize:px(18)}}>{name}</span>
            <span style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:6,
              padding:"2px 8px",fontFamily:"monospace",fontSize:px(10),color}}>{version}</span>
          </div>
          <div style={{fontWeight:600,color:V.muted,fontSize:px(13)}}>{tagline}</div>
        </div>
        <div style={{color:V.muted,fontSize:px(18)}}>{open?"▲":"▼"}</div>
      </div>
      {open&&(
        <div>
          <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>{purpose}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginBottom:16}}>
            <CodeBox lines={code} color={color}/>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {annotations.map((a,i)=>(
                <div key={i} style={{background:color+"0d",border:`1px solid ${color}22`,
                  borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontFamily:"monospace",fontWeight:700,color,fontSize:px(11),marginBottom:4}}>{a.l}</div>
                  <p style={{...LBODY,fontSize:px(12),margin:0,color:V.muted}}>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {facts.map((f,i)=>(
              <span key={i} style={{background:color+"0d",border:`1px solid ${color}33`,
                borderRadius:8,padding:"4px 12px",fontSize:px(11),color,fontWeight:600}}>{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════ TITANIC PIPELINE — interactive project ════════════════ */
const TitanicProject = () => {
  const [pclass,setPclass]=useState(2);
  const [age,setAge]=useState(28);
  const [sex,setSex]=useState("female");
  const [sibsp,setSibsp]=useState(0);
  const [fare,setFare]=useState(15);
  const [embark,setEmbark]=useState("S");
  const [step,setStep]=useState(0);

  // Simplified survival probability based on known Titanic statistics
  const genderBonus = sex==="female" ? 0.48 : 0;
  const classBonus  = pclass===1 ? 0.25 : pclass===2 ? 0.12 : 0;
  const ageBonus    = age<=10 ? 0.15 : age>60 ? -0.05 : 0;
  const fareBonus   = fare>50 ? 0.08 : fare<8 ? -0.05 : 0;
  const embarkBonus = embark==="C" ? 0.07 : embark==="Q" ? 0.02 : 0;
  const familyBonus = sibsp===1||sibsp===2 ? 0.04 : sibsp>3 ? -0.08 : 0;
  const rawProb     = 0.18 + genderBonus + classBonus + ageBonus + fareBonus + embarkBonus + familyBonus;
  const prob        = Math.min(0.97, Math.max(0.03, rawProb));
  const survived    = prob >= 0.5;

  const STEPS=[
    {title:"📥 Load & Explore",color:GRN,
     code:["import pandas as pd","","df = pd.read_csv('titanic.csv')","print(df.shape)       # (891, 12)","print(df.head())","print(df.info())","","# Check missing values","print(df.isnull().sum())","# Age: 177 missing","# Cabin: 687 missing","# Embarked: 2 missing"],
     insight:"The raw Titanic dataset has 891 rows and 12 columns. Key columns: Survived (target), Pclass, Sex, Age, SibSp, Parch, Fare, Embarked. Missing values must be handled before training."},
    {title:"🔧 Preprocess",color:AMB,
     code:["# Fill missing values","df['Age'].fillna(df['Age'].median(), inplace=True)","df['Embarked'].fillna('S', inplace=True)","df.drop('Cabin', axis=1, inplace=True)","","# Encode categorical variables","df['Sex'] = df['Sex'].map({'male':0,'female':1})","df['Embarked'] = df['Embarked'].map({'S':0,'C':1,'Q':2})","","# Select features","features = ['Pclass','Sex','Age','SibSp','Fare','Embarked']","X = df[features]","y = df['Survived']"],
     insight:"Preprocessing: impute missing Age with median (robust to outliers), fill missing Embarked with mode 'S'. Drop Cabin (too many missing). Encode Sex and Embarked as integers — sklearn needs numeric input."},
    {title:"🤖 Train Model",color:IND,
     code:["from sklearn.model_selection import train_test_split","from sklearn.ensemble import RandomForestClassifier","","X_train, X_test, y_train, y_test = train_test_split(","  X, y, test_size=0.2, random_state=42","# test_size=0.2: 80% train, 20% test","","rf = RandomForestClassifier(","  n_estimators=100,   # 100 decision trees","  max_depth=6,        # prevent overfitting","  random_state=42",")",  "rf.fit(X_train, y_train)","print('Training done! Trees:', rf.n_estimators)"],
     insight:"Split 80/20 for train/test. Random Forest with 100 trees and max_depth=6. The depth limit prevents overfitting on this relatively small dataset (712 training samples)."},
    {title:"📊 Evaluate",color:ORG,
     code:["from sklearn.metrics import (","  accuracy_score, classification_report,","  confusion_matrix",")",  "","y_pred = rf.predict(X_test)","y_prob = rf.predict_proba(X_test)[:,1]","","print('Accuracy:', accuracy_score(y_test, y_pred))", "# → 0.832 (83.2% accuracy)","","print(classification_report(y_test, y_pred,","  target_names=['Died','Survived'])","# Precision/Recall/F1 per class","","# Feature importance","for f,imp in zip(features, rf.feature_importances_):","  print(f'{f:12s}: {imp:.3f}')","# Sex:        0.312  ← most important!","# Fare:       0.228","# Age:        0.224"],
     insight:"~83% accuracy — well above the 62% baseline (always predict 'died'). Feature importance reveals Sex is the most predictive feature, followed by Fare and Age. This matches historical accounts: 'women and children first'."},
  ];

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
      <div style={{fontWeight:700,color:IND,marginBottom:8,fontSize:px(15)}}>
        🚢 Final Project — Titanic Survival Prediction
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        The classic ML benchmark. Walk through the complete pipeline: load → preprocess
        → train → evaluate. Then test the trained model with a live passenger predictor.
      </p>
      {/* Pipeline Steps */}
      <div style={{display:"flex",gap:0,marginBottom:20,overflowX:"auto"}}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)}
            style={{flex:1,minWidth:140,background:step===i?s.color:"transparent",
              border:`2px solid ${step===i?s.color:V.border}`,
              borderRadius:i===0?"10px 0 0 10px":i===STEPS.length-1?"0 10px 10px 0":"0",
              padding:"10px 8px",cursor:"pointer",
              fontWeight:700,fontSize:px(12),
              color:step===i?"#fff":V.muted,transition:"all 0.2s",
              borderRight:i<STEPS.length-1?"none":"2px solid"}}>
            {s.title}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),marginBottom:24}}>
        <div>
          <div style={{fontWeight:700,color:STEPS[step].color,marginBottom:10,fontSize:px(14)}}>
            Step {step+1}: {STEPS[step].title}
          </div>
          <CodeBox lines={STEPS[step].code} color={STEPS[step].color}/>
        </div>
        <div style={{background:STEPS[step].color+"0d",border:`1px solid ${STEPS[step].color}33`,
          borderRadius:14,padding:"18px"}}>
          <div style={{fontWeight:700,color:STEPS[step].color,marginBottom:10,fontSize:px(13)}}>
            💡 What's Happening
          </div>
          <p style={{...LBODY,fontSize:px(14),lineHeight:1.8}}>{STEPS[step].insight}</p>
        </div>
      </div>
      {/* Live Predictor */}
      <div style={{...LCARD,border:`2px solid ${IND}33`,background:"#fff"}}>
        <div style={{fontWeight:700,color:IND,marginBottom:14,fontSize:px(14)}}>
          🎯 Live Passenger Predictor — Test the Model
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
          <div>
            <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:12,letterSpacing:"1px"}}>
              PASSENGER FEATURES
            </div>
            {/* Sex */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:px(12),color:V.muted,marginBottom:6}}>Sex</div>
              <div style={{display:"flex",gap:8}}>
                {["male","female"].map(s=>(
                  <button key={s} onClick={()=>setSex(s)}
                    style={{flex:1,background:sex===s?IND+"22":"transparent",
                      border:`2px solid ${sex===s?IND:V.border}`,borderRadius:8,
                      padding:"8px",cursor:"pointer",fontWeight:700,
                      fontSize:px(12),color:sex===s?IND:V.muted,textTransform:"capitalize"}}>
                    {s==="male"?"👨 Male":"👩 Female"}
                  </button>
                ))}
              </div>
            </div>
            {/* Pclass */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:px(12),color:V.muted,marginBottom:6}}>Passenger Class</div>
              <div style={{display:"flex",gap:8}}>
                {[1,2,3].map(c=>(
                  <button key={c} onClick={()=>setPclass(c)}
                    style={{flex:1,background:pclass===c?IND+"22":"transparent",
                      border:`2px solid ${pclass===c?IND:V.border}`,borderRadius:8,
                      padding:"8px",cursor:"pointer",fontWeight:700,
                      fontSize:px(12),color:pclass===c?IND:V.muted}}>
                    {c===1?"1st 🏅":c===2?"2nd":"3rd"}
                  </button>
                ))}
              </div>
            </div>
            {[
              {l:"Age",v:age,s:setAge,min:1,max:80,step:1,c:AMB,fmt:v=>`${v} yrs`},
              {l:"Siblings/Spouse",v:sibsp,s:setSibsp,min:0,max:8,step:1,c:GRN,fmt:v=>v},
              {l:"Fare (£)",v:fare,s:setFare,min:3,max:300,step:1,c:CYN,fmt:v=>`£${v}`},
            ].map(({l,v,s,min,max,step:st,c,fmt})=>(
              <div key={l} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:px(12),color:V.muted}}>{l}</span>
                  <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{fmt(v)}</span>
                </div>
                <input type="range" min={min} max={max} step={st} value={v}
                  onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
              </div>
            ))}
            {/* Embark */}
            <div>
              <div style={{fontSize:px(12),color:V.muted,marginBottom:6}}>Port of Embarkation</div>
              <div style={{display:"flex",gap:6}}>
                {[["S","Southampton"],["C","Cherbourg"],["Q","Queenstown"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setEmbark(v)}
                    style={{flex:1,background:embark===v?VIO+"22":"transparent",
                      border:`2px solid ${embark===v?VIO:V.border}`,borderRadius:8,
                      padding:"6px 4px",cursor:"pointer",fontWeight:700,
                      fontSize:px(10),color:embark===v?VIO:V.muted}}>
                    {v} · {l.slice(0,5)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:survived?"#001a0e":"#1a0008",
              border:`3px solid ${survived?GRN:RED}`,borderRadius:20,
              padding:"28px",textAlign:"center",flex:1}}>
              <div style={{fontSize:px(56),marginBottom:10}}>{survived?"⛵":"🌊"}</div>
              <div style={{fontWeight:900,fontSize:px(26),
                color:survived?GRN:RED,marginBottom:6}}>
                {survived?"SURVIVED":"DID NOT SURVIVE"}
              </div>
              <div style={{fontFamily:"monospace",fontSize:px(18),color:survived?GRN:RED}}>
                {(prob*100).toFixed(0)}% survival probability
              </div>
              <div style={{background:(survived?GRN:RED)+"22",borderRadius:8,
                padding:"6px 16px",marginTop:10,fontSize:px(12),color:survived?GRN:RED}}>
                Random Forest Prediction
              </div>
            </div>
            <div style={{...LCARD,padding:"12px",background:"#f5f3ff"}}>
              <div style={{fontWeight:700,color:IND,fontSize:px(11),marginBottom:8}}>
                FEATURE CONTRIBUTIONS
              </div>
              {[
                {f:"Sex",v:genderBonus,base:sex==="female"?"female (high survival)":"male (low survival)"},
                {f:"Class",v:classBonus,base:`${pclass}${pclass===1?"st":pclass===2?"nd":"rd"} class`},
                {f:"Age",v:ageBonus,base:`${age} years old`},
                {f:"Fare",v:fareBonus,base:`£${fare}`},
              ].map(row=>(
                <div key={row.f} style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:6}}>
                  <div>
                    <span style={{fontSize:px(11),fontWeight:700,color:V.ink}}>{row.f}</span>
                    <span style={{fontSize:px(10),color:V.muted,marginLeft:6}}>{row.base}</span>
                  </div>
                  <span style={{fontFamily:"monospace",fontWeight:700,fontSize:px(11),
                    color:row.v>0?GRN:row.v<0?RED:V.muted}}>
                    {row.v>0?"+":""}
                    {(row.v*100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ TRAIN THE MODEL GAME ══════════════════════════════════ */
const TrainModelGame = () => {
  const [nEst,setNEst]=useState(10);
  const [maxDepth,setMaxDepth]=useState(3);
  const [trainSize,setTrainSize]=useState(80);
  const [locked,setLocked]=useState(false);
  const [score,setScore]=useState(null);

  // Simulate model performance based on hyperparameters
  const baseAcc=0.75;
  const estBonus=Math.min(0.08,(nEst-1)*0.002);
  const depthBonus=Math.min(0.06,(maxDepth-1)*0.015);
  const overfit=maxDepth>8?((maxDepth-8)*0.015):0;
  const dataBonus=(trainSize-50)*0.001;
  const testAcc=Math.min(0.95,Math.max(0.50,baseAcc+estBonus+depthBonus-overfit+dataBonus));
  const trainAcc=Math.min(0.99,testAcc+overfit+0.03);

  const lockIn=()=>{
    const scorePct=Math.round(testAcc*100);
    setScore(scorePct);setLocked(true);
  };
  const reset=()=>{setNEst(10);setMaxDepth(3);setTrainSize(80);setLocked(false);setScore(null);};

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}33`}}>
      <div style={{fontWeight:800,color:IND,fontSize:px(17),marginBottom:8}}>
        🎮 Train the Model — Tune Hyperparameters for Best Performance
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Adjust the Random Forest hyperparameters on the Titanic dataset.
        Watch training vs test accuracy live. Find the sweet spot that prevents overfitting.
        Try to achieve the highest test accuracy!
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          {[
            {l:"Number of Trees (n_estimators)",v:nEst,s:setNEst,min:1,max:200,step:1,c:IND,fmt:v=>v},
            {l:"Max Tree Depth (max_depth)",v:maxDepth,s:setMaxDepth,min:1,max:15,step:1,c:AMB,fmt:v=>v},
            {l:"Training Set Size (%)",v:trainSize,s:setTrainSize,min:30,max:95,step:5,c:GRN,fmt:v=>`${v}%`},
          ].map(({l,v,s,min,max,step,c,fmt})=>(
            <div key={l} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(12),color:V.muted}}>{l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(14)}}>{fmt(v)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={v}
                onChange={e=>!locked&&s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
            </div>
          ))}
          <div style={{background:"#0d1117",borderRadius:10,padding:"14px",fontFamily:"monospace",fontSize:px(12),lineHeight:1.9}}>
            <div style={{color:"#475569"}}># Training your model...</div>
            <div style={{color:IND}}>RandomForestClassifier(</div>
            <div style={{paddingLeft:16,color:"#94a3b8"}}>n_estimators={nEst},</div>
            <div style={{paddingLeft:16,color:"#94a3b8"}}>max_depth={maxDepth},</div>
            <div style={{paddingLeft:16,color:"#94a3b8"}}>random_state=42</div>
            <div style={{color:IND}}>).fit(X_train, y_train)</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...LCARD,padding:"16px"}}>
            <div style={{fontWeight:700,color:IND,fontSize:px(13),marginBottom:12}}>
              📊 PERFORMANCE METRICS
            </div>
            {[
              {l:"Train Accuracy",v:trainAcc,c:GRN,note:"On training data"},
              {l:"Test Accuracy",v:testAcc,c:IND,note:"On held-out test set"},
              {l:"Gap (Overfit)",v:trainAcc-testAcc,c:trainAcc-testAcc>0.1?ROSE:AMB,
                note:trainAcc-testAcc>0.1?"⚠️ Overfitting!":"✅ Good fit"},
            ].map(row=>(
              <div key={row.l} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div>
                    <span style={{fontWeight:700,color:row.c,fontSize:px(13)}}>{row.l}</span>
                    <span style={{fontSize:px(11),color:V.muted,marginLeft:8}}>{row.note}</span>
                  </div>
                  <span style={{fontFamily:"monospace",fontWeight:900,color:row.c,fontSize:px(16)}}>
                    {(row.v*100).toFixed(1)}%
                  </span>
                </div>
                <div style={{background:V.cream,borderRadius:4,height:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.abs(row.v)*100}%`,
                    background:row.c,borderRadius:4,transition:"width 0.3s"}}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{...LCARD,padding:"14px",background:"#f5f3ff"}}>
            <div style={{fontWeight:700,color:IND,fontSize:px(12),marginBottom:8}}>
              💡 TIPS
            </div>
            {[
              maxDepth>10&&{t:"⚠️ Deep trees overfit",d:"Try max_depth=5–8",c:ROSE},
              nEst<20&&{t:"📈 More trees help",d:"Try n_estimators≥100",c:AMB},
              trainSize<60&&{t:"📉 Too little data",d:"Use at least 70% training",c:ORG},
              trainAcc-testAcc>0.1&&{t:"🔧 Overfitting detected",d:"Reduce max_depth or increase data",c:ROSE},
              testAcc>0.85&&{t:"🏆 Excellent model!",d:`Test accuracy: ${(testAcc*100).toFixed(1)}%`,c:GRN},
            ].filter(Boolean).slice(0,3).map((tip,i)=>(
              <div key={i} style={{background:tip.c+"0d",border:`1px solid ${tip.c}33`,
                borderRadius:8,padding:"6px 10px",marginBottom:6}}>
                <div style={{fontWeight:700,color:tip.c,fontSize:px(12)}}>{tip.t}</div>
                <div style={{fontSize:px(11),color:V.muted}}>{tip.d}</div>
              </div>
            ))}
          </div>
          {!locked?(
            <button onClick={lockIn}
              style={{background:IND,border:"none",borderRadius:10,padding:"12px",
                color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
              🚀 Submit Score: {(testAcc*100).toFixed(1)}%
            </button>
          ):(
            <div style={{background:score>=83?GRN+"0d":score>=75?AMB+"0d":ROSE+"0d",
              border:`2px solid ${score>=83?GRN:score>=75?AMB:ROSE}`,borderRadius:12,
              padding:"14px 18px"}}>
              <div style={{fontWeight:900,color:score>=83?GRN:score>=75?AMB:ROSE,fontSize:px(16)}}>
                {score>=83?"🏆 ML Engineer level!":score>=78?"✅ Well tuned!":score>=72?"⚠️ Keep optimising":"❌ Check for overfitting"}
              </div>
              <div style={{fontFamily:"monospace",color:V.muted,fontSize:px(12),marginTop:4}}>
                Test accuracy: {score}% | Optimal: ~83-85%
              </div>
              <button onClick={reset}
                style={{marginTop:8,background:"transparent",border:`1px solid ${V.border}`,
                  borderRadius:8,padding:"6px 14px",fontSize:px(11),color:V.muted,cursor:"pointer"}}>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════ */
const LibTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🔢",c:AMB, t:"NumPy: foundation of all numerical ML. Arrays, matrix operations, broadcasting, linear algebra. Every other ML library (Pandas, Sklearn, PyTorch) runs on NumPy arrays internally."},
    {e:"🐼",c:GRN, t:"Pandas: the spreadsheet of ML. DataFrames for structured data — read CSVs, handle missing values, filter rows, groupby, merge datasets. Every ML project starts with Pandas."},
    {e:"📊",c:CYN, t:"Matplotlib (+ Seaborn): data visualisation. Scatter plots, histograms, confusion matrix heatmaps, ROC curves. 'A picture is worth a thousand rows of data.'"},
    {e:"🤖",c:IND, t:"Scikit-learn: the ML Swiss Army knife. Unified API: fit(), predict(), score(). Algorithms (RF, SVM, Linear Regression), preprocessing, metrics, cross-validation — all in one library."},
    {e:"👁️",c:PNK, t:"OpenCV: computer vision. Read/write/display images, apply filters, detect edges, face recognition, object tracking. The backbone of autonomous vehicles and medical imaging."},
    {e:"🔄",c:VIO, t:"The ML Pipeline: Load (Pandas) → Explore (Pandas/Matplotlib) → Clean (Pandas) → Train (Sklearn) → Evaluate (Sklearn metrics) → Visualise (Matplotlib/Seaborn)."},
    {e:"🚢",c:ORG, t:"The Titanic benchmark: load CSV, handle missing values, encode categoricals, train Random Forest, evaluate with classification_report. This exact workflow applies to 90% of real ML projects."},
    {e:"🌍",c:GRN, t:"Level 3 complete! You now know: supervised learning, regression, classification, decision trees, random forests, clustering, evaluation metrics, and the full ML library stack. Ready for deep learning."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Final Capstone",IND)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
        Level 3 Complete — You're a <span style={{color:IND}}>Machine Learning Engineer</span>
      </h2>
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
      <div style={{...LCARD,textAlign:"center",padding:"48px",
        background:"linear-gradient(135deg,#f5f3ff,#ecfdf5)"}}>
        <div style={{fontSize:px(72),marginBottom:12}}>{cnt===8?"🎓":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(28),color:V.ink,marginBottom:8}}>
          {cnt}/8 concepts mastered
        </div>
        {cnt===8&&(
          <div style={{background:IND+"0d",border:`2px solid ${IND}`,borderRadius:12,
            padding:"16px 24px",marginBottom:24,maxWidth:500,margin:"0 auto 24px"}}>
            <div style={{fontWeight:800,color:IND,fontSize:px(16),marginBottom:6}}>
              🏅 Level 3: Machine Learning — COMPLETE
            </div>
            <p style={{...LBODY,margin:0,fontSize:px(14),color:V.muted}}>
              You've covered 8 comprehensive lessons: supervised learning through
              neural network readiness. You're ready for Level 4 — Deep Learning.
            </p>
          </div>
        )}
        <div style={{background:V.cream,borderRadius:8,height:12,overflow:"hidden",maxWidth:500,margin:"0 auto 28px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${IND},${CYN},${GRN})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:`linear-gradient(135deg,${IND},${VIO})`,
            border:"none",borderRadius:10,padding:"14px 32px",fontWeight:800,
            cursor:"pointer",color:"#fff",fontSize:px(15)}}>
            🚀 Enter Level 4: Deep Learning →
          </button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",
            borderRadius:10,padding:"14px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
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
const LibrariesAndProjectPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="ML Libraries & Final Project" lessonNum="Lesson 8 of 8 · Capstone"
    accent={IND} levelLabel="Machine Learning"
    dotLabels={["Hero","Tool Stack","NumPy","Pandas","Matplotlib","Sklearn","OpenCV","Final Project","Visualization","Game","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#12105a 60%,#080614 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🎓 Lesson 8 of 8 · Capstone · Machine Learning",IND)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                ML Libraries<br/><span style={{color:"#a5b4fc"}}>&amp; Final Project</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:IND,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                You know the algorithms. Now master the tools that every professional ML engineer
                uses daily — NumPy, Pandas, Matplotlib, Scikit-learn, and OpenCV. Then bring
                it all together in the classic ML benchmark: Titanic survival prediction.
                This is your Level 3 capstone.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
                {[["🔢","NumPy",AMB],["🐼","Pandas",GRN],["📊","Matplotlib",CYN],["🤖","Sklearn",IND],["👁️","OpenCV",PNK]].map(([e,l,c])=>(
                  <div key={l} style={{background:c+"22",border:`1px solid ${c}55`,borderRadius:10,
                    padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:px(16)}}>{e}</span>
                    <span style={{fontWeight:700,color:"#fff",fontSize:px(12)}}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(79,70,229,0.06)",
              border:"1px solid rgba(79,70,229,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — TOOL STACK ──────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · The ML Tool Stack",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Five Libraries, <span style={{color:IND}}>One Pipeline</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(24)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Professional ML is not about knowing one algorithm — it's about orchestrating
                  five specialised libraries into a seamless workflow. Each library is the
                  best-in-class tool for its role.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  The standard ML workflow flows through all five in sequence:
                </p>
                {[
                  {n:"1",l:"Load & Manipulate",lib:"Pandas",c:GRN,e:"🐼",d:"Read raw data, handle missing values, feature engineering"},
                  {n:"2",l:"Numerical Compute",lib:"NumPy",c:AMB,e:"🔢",d:"Array operations, matrix math, statistics on clean data"},
                  {n:"3",l:"Visualise",lib:"Matplotlib",c:CYN,e:"📊",d:"Explore distributions, plot correlations, inspect outliers"},
                  {n:"4",l:"Train Models",lib:"Scikit-learn",c:IND,e:"🤖",d:"fit(), predict(), evaluate with metrics and cross-validation"},
                  {n:"5",l:"Deploy (Vision)",lib:"OpenCV",c:PNK,e:"👁️",d:"Process images, run inference on video streams"},
                ].map(step=>(
                  <div key={step.n} style={{display:"flex",gap:12,marginBottom:10,alignItems:"center"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                      background:step.c+"22",border:`2px solid ${step.c}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontWeight:800,fontSize:px(12),color:step.c}}>{step.n}</div>
                    <span style={{fontSize:px(20)}}>{step.e}</span>
                    <div style={{flex:1}}>
                      <span style={{fontWeight:700,color:step.c,fontSize:px(13)}}>{step.lib}</span>
                      <span style={{fontSize:px(12),color:V.muted,marginLeft:8}}>— {step.d}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={IND} title="The Python ML Ecosystem"
                  body="These 5 libraries form the core of the Python ML ecosystem. Below them: the Python standard library + C/Fortran compiled extensions (NumPy's speed comes from BLAS). Above them: higher-level frameworks (PyTorch, TensorFlow, Keras, XGBoost, LightGBM) that all depend on NumPy and Sklearn. Learning these 5 libraries gives you the foundation to use everything else."/>
                <div style={{...LCARD,marginTop:16,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
                  <div style={{fontWeight:700,color:IND,marginBottom:10,fontSize:px(13)}}>
                    📦 Installation
                  </div>
                  <CodeBox color={IND} lines={[
                    "# Install all at once:",
                    "pip install numpy pandas matplotlib",
                    "pip install scikit-learn opencv-python",
                    "",
                    "# Or use conda (recommended):",
                    "conda install numpy pandas matplotlib",
                    "conda install scikit-learn",
                    "pip install opencv-python",
                    "",
                    "# Google Colab: all pre-installed!",
                    "# Just import and go.",
                  ]}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — NUMPY ───────────────────────────────────────── */}
        <div ref={R(2)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · NumPy — Numerical Computing","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              The <span style={{color:"#a5b4fc"}}>Math Foundation</span>
            </h2>
            <LibCard
              name="NumPy" version="v1.26.x" icon="🔢" color={AMB}
              tagline="Numerical Python — the backbone of all scientific computing"
              purpose="NumPy provides the ndarray (N-dimensional array) — a C-compiled data structure that performs mathematical operations 100-200× faster than native Python lists. Every ML library (Pandas, Sklearn, PyTorch, TensorFlow) is built on NumPy arrays. When you call model.predict(), the output is a NumPy array."
              code={[
                "import numpy as np",
                "",
                "# Create arrays",
                "a = np.array([1, 2, 3, 4, 5])",
                "b = np.array([10, 20, 30, 40, 50])",
                "",
                "# Vectorised operations (no loops!)",
                "print(a + b)      # [11, 22, 33, 44, 55]",
                "print(a * b)      # element-wise product",
                "print(np.dot(a,b))  # dot product = 550",
                "",
                "# 2D arrays (matrices)",
                "X = np.array([[1,2],[3,4],[5,6]])",
                "print(X.shape)    # (3, 2) → 3 rows, 2 cols",
                "print(X.T)        # transpose",
                "print(X.mean(axis=0))  # per-column mean",
                "",
                "# Broadcasting (auto-expand dims)",
                "print(X * 2)      # multiply all by 2",
                "print(X - X.mean(axis=0))  # normalise",
              ]}
              annotations={[
                {l:"np.array()",d:"Create a NumPy array from a Python list. Fast, fixed-type, memory-efficient."},
                {l:"np.dot(a,b)",d:"Vector dot product: Σ aᵢbᵢ. The foundation of neural network forward passes."},
                {l:"X.shape",d:"Returns dimensions as tuple. Critical to verify before any matrix operation."},
                {l:"Broadcasting",d:"Auto-expands arrays of different shapes for element-wise ops — no manual looping."},
              ]}
              facts={["50× faster than Python lists","Used by PyTorch, TensorFlow, Sklearn","BLAS/LAPACK C backend","Released 2005, still #1"]}
            />
          </div>
        </div>

        {/* ── S3 — PANDAS ──────────────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Pandas — Data Engineering",GRN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The <span style={{color:GRN}}>Data Scientist's Spreadsheet</span>
            </h2>
            <LibCard
              name="Pandas" version="v2.1.x" icon="🐼" color={GRN}
              tagline="Panel Data — tabular data manipulation and analysis"
              purpose="Pandas provides the DataFrame — a 2D labelled data structure like an Excel spreadsheet but powered by NumPy. It handles the messy, real-world part of ML: loading CSV/JSON/SQL data, dealing with missing values, feature engineering, filtering, grouping, and merging. 80% of ML work is data preprocessing — Pandas is where you spend that time."
              code={[
                "import pandas as pd",
                "",
                "# Load dataset from CSV",
                "df = pd.read_csv('titanic.csv')",
                "",
                "# Explore the data",
                "print(df.shape)          # (891, 12)",
                "print(df.head(3))        # first 3 rows",
                "print(df.describe())     # statistics",
                "print(df.isnull().sum()) # missing values",
                "",
                "# Filter rows",
                "survivors = df[df['Survived'] == 1]",
                "first_class = df[df['Pclass'] == 1]",
                "",
                "# Feature engineering",
                "df['FamilySize'] = df['SibSp'] + df['Parch']",
                "df['IsAlone'] = (df['FamilySize'] == 0).astype(int)",
                "",
                "# Handle missing values",
                "df['Age'].fillna(df['Age'].median(), inplace=True)",
                "",
                "# Group statistics",
                "print(df.groupby('Sex')['Survived'].mean())",
                "# female: 0.74   male: 0.19",
              ]}
              annotations={[
                {l:"pd.read_csv()",d:"Reads CSV into DataFrame. Supports URLs, handles encoding, parses dates automatically."},
                {l:"df.isnull().sum()",d:"Essential first step — know your missing data before any analysis."},
                {l:"df[condition]",d:"Boolean indexing: filter rows where condition is True. The most common Pandas operation."},
                {l:"df.groupby()",d:"Split-apply-combine: group by category, apply function, combine results. Like SQL GROUP BY."},
              ]}
              facts={["#1 data analysis library","28M monthly downloads","Excel, CSV, SQL, JSON support","Used in every ML project"]}
            />
          </div>
        </div>

        {/* ── S4 — MATPLOTLIB ──────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Matplotlib — Data Visualization","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              See Your <span style={{color:"#a5b4fc"}}>Data</span>
            </h2>
            <LibCard
              name="Matplotlib" version="v3.8.x" icon="📊" color={CYN}
              tagline="The standard Python plotting library — used in 90% of ML papers"
              purpose="Matplotlib creates static, animated, and interactive visualisations in Python. In ML, it's essential for: exploring data distributions before training, visualising decision boundaries, plotting training curves (loss vs epoch), drawing confusion matrix heatmaps, and creating ROC curves for publications. Seaborn (built on Matplotlib) provides beautiful statistical plots with one line of code."
              code={[
                "import matplotlib.pyplot as plt",
                "import numpy as np",
                "",
                "# Scatter plot (relationships between features)",
                "plt.figure(figsize=(10, 4))",
                "",
                "plt.subplot(1, 3, 1)",
                "plt.scatter(df['Age'], df['Fare'],",
                "  c=df['Survived'], cmap='RdYlGn', alpha=0.6)",
                "plt.xlabel('Age'); plt.ylabel('Fare')",
                "plt.title('Age vs Fare (coloured by survival)')",
                "",
                "# Histogram (distributions)",
                "plt.subplot(1, 3, 2)",
                "plt.hist(df[df['Survived']==1]['Age'],",
                "  bins=30, alpha=0.7, label='Survived', color='green')",
                "plt.hist(df[df['Survived']==0]['Age'],",
                "  bins=30, alpha=0.7, label='Died', color='red')",
                "plt.legend(); plt.title('Age Distribution')",
                "",
                "# Bar chart (feature importance)",
                "plt.subplot(1, 3, 3)",
                "plt.barh(features, importances, color='steelblue')",
                "plt.title('Feature Importance')",
                "",
                "plt.tight_layout()",
                "plt.savefig('analysis.png', dpi=150)",
                "plt.show()",
              ]}
              annotations={[
                {l:"plt.scatter(x,y,c=...)",d:"Scatter plot. c= colours points by a third variable — great for visualising classes."},
                {l:"plt.hist()",d:"Histogram of a single feature. Compare distributions between classes to find separability."},
                {l:"plt.subplot(1,3,N)",d:"Create multiple plots in a grid. Essential for side-by-side comparison."},
                {l:"plt.savefig()",d:"Export to PNG/PDF/SVG. Use dpi=150+ for publication-quality figures."},
              ]}
              facts={["Released 2003","Default Jupyter viz library","Publication-quality figures","Base of Seaborn, Plotly"]}
            />
          </div>
        </div>

        {/* ── S5 — SKLEARN ─────────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Scikit-learn — Machine Learning",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The <span style={{color:IND}}>ML Swiss Army Knife</span>
            </h2>
            <LibCard
              name="Scikit-learn" version="v1.4.x" icon="🤖" color={IND}
              tagline="The ML library for Python — consistent API for 50+ algorithms"
              purpose="Scikit-learn (sklearn) implements virtually every classical ML algorithm with a single unified API: fit(X, y) to train, predict(X) to infer, score(X, y) to evaluate. It includes preprocessing (StandardScaler, LabelEncoder), model selection (train_test_split, GridSearchCV, cross_val_score), metrics (accuracy_score, classification_report, roc_auc_score), and pipelines. Every algorithm covered in Level 3 lives here."
              code={[
                "from sklearn.ensemble import RandomForestClassifier",
                "from sklearn.model_selection import train_test_split, GridSearchCV",
                "from sklearn.preprocessing import StandardScaler",
                "from sklearn.pipeline import Pipeline",
                "from sklearn.metrics import classification_report",
                "",
                "# THE UNIFIED API:",
                "# 1. Split data",
                "X_tr, X_te, y_tr, y_te = train_test_split(",
                "  X, y, test_size=0.2, random_state=42)",
                "",
                "# 2. Build pipeline (scale → model)",
                "pipe = Pipeline([",
                "  ('scaler', StandardScaler()),",
                "  ('model', RandomForestClassifier())",
                "])",
                "",
                "# 3. Hyperparameter search",
                "grid = {'model__n_estimators': [50,100,200],",
                "        'model__max_depth': [3,5,8]}",
                "cv = GridSearchCV(pipe, grid, cv=5, scoring='f1')",
                "cv.fit(X_tr, y_tr)",
                "",
                "# 4. Evaluate best model",
                "print('Best params:', cv.best_params_)",
                "print(classification_report(y_te, cv.predict(X_te)))",
              ]}
              annotations={[
                {l:"Pipeline()",d:"Chain preprocessing + model into one object. Prevents data leakage — scaler is fit only on training data."},
                {l:"GridSearchCV()",d:"Try all hyperparameter combinations with k-fold cross-validation. Returns best_params_ and best_score_."},
                {l:"cv=5",d:"5-fold cross-validation: train on 80%, validate on 20%, repeat 5× with different splits. More reliable than a single split."},
                {l:"scoring='f1'",d:"Optimise for F1 instead of accuracy during grid search. Critical for imbalanced datasets."},
              ]}
              facts={["50+ algorithms","Consistent fit/predict API","Free, open source, BSD","Used by Google, Facebook, NASA"]}
            />
          </div>
        </div>

        {/* ── S6 — OPENCV ──────────────────────────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · OpenCV — Computer Vision","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Teaching Computers to <span style={{color:"#a5b4fc"}}>See</span>
            </h2>
            <LibCard
              name="OpenCV" version="v4.9.x" icon="👁️" color={PNK}
              tagline="Open Source Computer Vision — the backbone of visual AI"
              purpose="OpenCV (cv2) is the world's most widely used computer vision library. It processes images and video: reading files, applying filters, detecting edges and faces, tracking objects, drawing annotations. In ML, it's used to preprocess image datasets before feeding into neural networks. OpenCV is also used in production: autonomous vehicles, medical imaging, security cameras, augmented reality."
              code={[
                "import cv2",
                "import numpy as np",
                "",
                "# Read and display image",
                "img = cv2.imread('photo.jpg')",
                "print(img.shape)  # (480, 640, 3) → H×W×RGB",
                "",
                "# Convert to grayscale",
                "gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)",
                "",
                "# Apply Gaussian blur (noise reduction)",
                "blurred = cv2.GaussianBlur(gray, (5,5), 0)",
                "",
                "# Detect edges (Canny algorithm)",
                "edges = cv2.Canny(blurred, 50, 150)",
                "",
                "# Resize for ML model input",
                "resized = cv2.resize(img, (224, 224))",
                "",
                "# Face detection (Haar Cascade)",
                "face_cascade = cv2.CascadeClassifier(",
                "  cv2.data.haarcascades +",
                "  'haarcascade_frontalface_default.xml'",
                ")",
                "faces = face_cascade.detectMultiScale(gray)",
                "",
                "cv2.imshow('Edges', edges)",
                "cv2.waitKey(0)",
                "cv2.destroyAllWindows()",
              ]}
              annotations={[
                {l:"img.shape = (H,W,3)",d:"Image is a NumPy array! H×W×3 channels (BGR in OpenCV, not RGB). Every pixel is 0–255."},
                {l:"cv2.Canny()",d:"Edge detection: finds boundaries between objects. Used in autonomous vehicles for lane detection."},
                {l:"cv2.resize((224,224))",d:"Resize image to fit ML model input. ImageNet models (ResNet, VGG) expect 224×224 input."},
                {l:"detectMultiScale()",d:"Sliding window detector. Scans image at multiple scales to find faces regardless of size."},
              ]}
              facts={["20M+ downloads/month","Supports Python, C++, Java","Runs on CPU and GPU","Used in Tesla, Netflix, NASA"]}
            />
          </div>
        </div>

        {/* ── S7 — FINAL PROJECT ───────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Final Project — End-to-End ML Pipeline",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              🚢 Titanic: <span style={{color:IND}}>The ML Benchmark</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(720),marginBottom:px(28)}}>
              The Titanic dataset is the world's most famous ML benchmark. Walk through
              every step of a professional ML pipeline, then test the trained model with
              a live passenger configurator. Click each pipeline stage to see the code.
            </p>
            <TitanicProject/>
          </div>
        </div>

        {/* ── S8 — VISUALIZATION IDEAS ─────────────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Visualization Ideas","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Seeing is <span style={{color:"#a5b4fc"}}>Understanding</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🔍",c:GRN,t:"Dataset Explorer",
                  d:"Pandas + Matplotlib: scatter matrix (pd.plotting.scatter_matrix) of all feature pairs. Reveals correlations and class separability before training."},
                {e:"📊",c:IND,t:"Prediction Dashboard",
                  d:"Slider UI for each feature → real-time model.predict_proba() → probability bar chart. Test how each feature influences the prediction."},
                {e:"🌡️",c:CYN,t:"Confusion Matrix Heatmap",
                  d:"seaborn.heatmap(confusion_matrix(y_test, y_pred), annot=True). Coloured by count or normalised rate."},
                {e:"📈",c:ORG,t:"Training Curve",
                  d:"Plot training accuracy and test accuracy vs training set size (learning curve). Diagnoses overfitting vs underfitting visually."},
                {e:"🔢",c:AMB,t:"Feature Importance Bar",
                  d:"plt.barh(features, rf.feature_importances_). Shows which features drive predictions most — essential for domain understanding."},
                {e:"🎯",c:PNK,t:"ROC & PR Curves",
                  d:"RocCurveDisplay + PrecisionRecallDisplay from sklearn.metrics. Compare multiple models on same axes — AUC tells the whole story."},
              ].map(v=>(
                <div key={v.t} style={{background:v.c+"0d",border:`1px solid ${v.c}33`,
                  borderRadius:16,padding:"20px"}}>
                  <div style={{fontSize:px(36),marginBottom:8}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(14),marginBottom:6}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{v.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9 — GAME ────────────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Train the Model</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Tune the Random Forest hyperparameters on the Titanic dataset. Watch training
              vs test accuracy respond in real time. Find the hyperparameter settings that
              achieve the best generalisation without overfitting.
            </p>
            <TrainModelGame/>
          </div>
        </div>

        {/* ── S10 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <LibTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default LibrariesAndProjectPage;
