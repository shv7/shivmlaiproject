import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — RANDOM FORESTS
   Level 3 · Machine Learning · Lesson 5 of 7
   Accent: Cyan #0891b2
══════════════════════════════════════════════════════════════════ */
const CYN  = "#0891b2";
const AMB  = "#f59e0b";
const GRN  = "#059669";
const VIO  = "#7c3aed";
const ROSE = "#e11d48";
const RED  = "#ef4444";
const SKY  = "#0284c7";
const INK  = "#1e293b";

const Formula = ({children,color=CYN}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=AMB}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("//")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — forest of trees voting ══════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const trees = [
      {x:0.12,votes:[1,1,1,0,1],color:CYN},
      {x:0.27,votes:[1,0,1,1,1],color:GRN},
      {x:0.42,votes:[0,1,1,1,1],color:VIO},
      {x:0.57,votes:[1,1,0,1,1],color:AMB},
      {x:0.72,votes:[1,1,1,1,0],color:ROSE},
    ];
    const drawTree=(cx,cy,h,col,phase)=>{
      // trunk
      ctx.strokeStyle=col+"99"; ctx.lineWidth=3;
      ctx.beginPath();ctx.moveTo(cx,cy+h*0.4);ctx.lineTo(cx,cy);ctx.stroke();
      // canopy layers
      const layers=3;
      for(let i=0;i<layers;i++){
        const ly=cy-(i*h*0.28);
        const lw=(layers-i)*h*0.22;
        const alpha=Math.min(1,(phase-(i*0.15))/0.4);
        if(alpha<=0)continue;
        ctx.globalAlpha=alpha*0.9;
        ctx.beginPath();
        ctx.moveTo(cx,ly-h*0.28);
        ctx.lineTo(cx+lw,ly);
        ctx.lineTo(cx-lw,ly);
        ctx.closePath();
        ctx.fillStyle=col+"33"; ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.stroke();
      }
      ctx.globalAlpha=1;
    };
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#040f14"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(8,145,178,0.06)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const treeH=H*0.38;
      trees.forEach((tr,i)=>{
        const cx=tr.x*W, cy=H*0.65;
        const phase=Math.min(1,(t-i*0.12)/0.5);
        if(phase>0) drawTree(cx,cy,treeH,tr.color,phase);
      });
      // arrows to vote result
      const progress=Math.min(1,(t-0.8)/0.5);
      if(progress>0){
        trees.forEach(tr=>{
          const cx=tr.x*W;
          const vote=tr.votes[Math.floor(t*0.8)%5];
          const destX=W*0.88, destY=H*0.3;
          ctx.globalAlpha=progress*0.6;
          ctx.beginPath();ctx.moveTo(cx,H*0.55);ctx.lineTo(destX,destY);
          ctx.strokeStyle=vote===1?GRN:RED; ctx.lineWidth=1.5;
          ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
          ctx.globalAlpha=1;
          const mx=(cx+destX)/2, my=(H*0.55+destY)/2-16;
          ctx.font="bold 12px sans-serif"; ctx.fillStyle=vote===1?GRN:RED;
          ctx.textAlign="center"; ctx.fillText(vote===1?"✓":"✗",mx,my);
        });
        // result box
        ctx.globalAlpha=progress;
        ctx.fillStyle="#0c2028"; ctx.strokeStyle=CYN+"88";
        ctx.lineWidth=2;
        ctx.beginPath();ctx.roundRect(W*0.78,H*0.18,W*0.18,H*0.24,12);
        ctx.fill();ctx.stroke();
        ctx.font="bold 13px sans-serif"; ctx.fillStyle=CYN; ctx.textAlign="center";
        ctx.fillText("VOTE",W*0.87,H*0.28);
        ctx.font="bold 22px sans-serif"; ctx.fillStyle=GRN;
        ctx.fillText("4/5 → 1",W*0.87,H*0.36);
        ctx.globalAlpha=1;
      }
      // legend
      ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      [[CYN,"Tree 1"],[GRN,"Tree 2"],[VIO,"Tree 3"],[AMB,"Tree 4"],[ROSE,"Tree 5"]].forEach(([col,lbl],i)=>{
        ctx.fillStyle=col+"cc"; ctx.fillRect(16,16+i*18,10,10);
        ctx.fillStyle=col+"bb"; ctx.fillText(lbl,30,25+i*18);
      });
      t+=0.004; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ BAGGING VISUALIZER ════════════════════════════════════ */
const BaggingViz = () => {
  const [selected, setSelected] = useState(null);
  const FULL = ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10"];
  const bags = [
    {id:0,label:"Tree 1",samples:["S2","S5","S1","S7","S2","S9","S3","S5"],features:["Income","Age"],color:CYN,pred:1},
    {id:1,label:"Tree 2",samples:["S4","S1","S8","S3","S6","S1","S10","S4"],features:["Credit","Debt"],color:GRN,pred:1},
    {id:2,label:"Tree 3",samples:["S7","S2","S9","S5","S3","S8","S7","S1"],features:["Income","Debt"],color:VIO,pred:0},
    {id:3,label:"Tree 4",samples:["S6","S4","S10","S2","S1","S6","S8","S3"],features:["Age","Credit"],color:AMB,pred:1},
    {id:4,label:"Tree 5",samples:["S3","S8","S4","S6","S9","S2","S5","S8"],features:["Credit","Income"],color:ROSE,pred:1},
  ];
  const votes = bags.reduce((a,b)=>a+b.pred,0);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🌲 Bootstrap Aggregating (Bagging) — Click a tree to inspect
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Each tree trains on a <strong>random bootstrap sample</strong> (sampling with replacement)
        using a <strong>random subset of features</strong>. This makes trees decorrelated —
        they make different errors, which cancel out when averaged.
      </p>
      <div style={{background:"#0d1117",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
        <div style={{fontWeight:700,color:CYN,fontSize:px(12),marginBottom:8}}>
          ORIGINAL DATASET (10 samples)
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {FULL.map(s=>(
            <span key={s} style={{background:CYN+"22",border:`1px solid ${CYN}44`,
              borderRadius:6,padding:"4px 10px",fontFamily:"monospace",
              fontSize:px(12),color:CYN}}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
        {bags.map(bag=>(
          <div key={bag.id} onClick={()=>setSelected(selected===bag.id?null:bag.id)}
            style={{background:selected===bag.id?bag.color:bag.color+"18",
              border:`2px solid ${bag.color}${selected===bag.id?"":"55"}`,
              borderRadius:12,padding:"12px 16px",cursor:"pointer",
              flex:"1 1 140px",transition:"all 0.2s",minWidth:120}}>
            <div style={{fontWeight:700,color:selected===bag.id?"#fff":bag.color,
              fontSize:px(13),marginBottom:4}}>{bag.label}</div>
            <div style={{fontSize:px(11),color:selected===bag.id?"#ffffffcc":V.muted}}>
              Predicts: <strong>{bag.pred===1?"Approve ✓":"Reject ✗"}</strong>
            </div>
          </div>
        ))}
      </div>
      {selected!==null&&(
        <div style={{background:bags[selected].color+"0d",
          border:`1px solid ${bags[selected].color}44`,borderRadius:12,padding:"16px 20px",marginBottom:16}}>
          <div style={{fontWeight:800,color:bags[selected].color,fontSize:px(14),marginBottom:10}}>
            {bags[selected].label} — Training Details
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,letterSpacing:"1px"}}>
                BOOTSTRAP SAMPLE (with replacement)
              </div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {bags[selected].samples.map((s,i)=>(
                  <span key={i} style={{background:bags[selected].color+"22",
                    border:`1px solid ${bags[selected].color}44`,borderRadius:5,
                    padding:"3px 8px",fontFamily:"monospace",fontSize:px(11),
                    color:bags[selected].color}}>{s}</span>
                ))}
              </div>
              <div style={{fontSize:px(11),color:V.muted,marginTop:6}}>
                Note: some samples appear twice (e.g. {bags[selected].samples.find(
                  (s,i)=>bags[selected].samples.indexOf(s)!==i)||bags[selected].samples[0]
                }), some are absent — that's bootstrap!
              </div>
            </div>
            <div>
              <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,letterSpacing:"1px"}}>
                RANDOM FEATURE SUBSET (√d features)
              </div>
              {bags[selected].features.map(f=>(
                <div key={f} style={{background:"#1e1b4b",borderRadius:8,padding:"6px 12px",
                  marginBottom:6,fontFamily:"monospace",fontSize:px(12),
                  color:bags[selected].color}}>✓ {f}</div>
              ))}
              <div style={{background:"#0d1117",borderRadius:8,padding:"6px 12px",marginTop:8}}>
                <span style={{fontFamily:"monospace",fontSize:px(12),color:"#475569"}}>
                  # Only considers {bags[selected].features.length} of 4 features at each split
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{background:"#0d1117",borderRadius:12,padding:"14px 18px",display:"flex",
        alignItems:"center",gap:20,flexWrap:"wrap"}}>
        <div style={{fontFamily:"monospace",fontSize:px(13),color:"#94a3b8",flex:1}}>
          <span style={{color:CYN,fontWeight:700}}>Majority Vote Result:</span>
          {" "}{votes} trees say Approve, {bags.length-votes} say Reject
          → <span style={{color:votes>2?GRN:RED,fontWeight:800,fontSize:px(15)}}>
            {votes>2?"✅ APPROVED":"❌ REJECTED"}
          </span>
        </div>
        <div style={{background:votes>2?GRN+"22":RED+"22",
          border:`2px solid ${votes>2?GRN:RED}`,borderRadius:10,
          padding:"8px 16px",fontWeight:800,color:votes>2?GRN:RED,fontSize:px(14)}}>
          {votes}/{bags.length} votes
        </div>
      </div>
    </div>
  );
};

/* ══════ FOREST VOTING GAME ════════════════════════════════════ */
const ForestVotingGame = () => {
  const [round, setRound] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const ROUNDS = [
    {
      scenario:"Customer: Age=35, Income=$65k, Credit=720, Tenure=3yr",
      trees:[
        {id:1,col:CYN, vote:1,reason:"Income>50k AND Credit>700 → Approve"},
        {id:2,col:GRN, vote:1,reason:"Credit=720 (good) → Approve"},
        {id:3,col:VIO, vote:0,reason:"Tenure only 3yr → borderline → Reject"},
        {id:4,col:AMB, vote:1,reason:"Income+Credit combination → Approve"},
        {id:5,col:ROSE,vote:1,reason:"Age+Income signal → Approve"},
      ],
      correct:1,
    },
    {
      scenario:"Customer: Age=22, Income=$28k, Credit=580, Tenure=1yr",
      trees:[
        {id:1,col:CYN, vote:0,reason:"Income<30k → high risk → Reject"},
        {id:2,col:GRN, vote:0,reason:"Credit=580 → below threshold → Reject"},
        {id:3,col:VIO, vote:1,reason:"Young customer, long future → Approve"},
        {id:4,col:AMB, vote:0,reason:"Income AND Credit both weak → Reject"},
        {id:5,col:ROSE,vote:0,reason:"Short tenure + low income → Reject"},
      ],
      correct:0,
    },
    {
      scenario:"Customer: Age=48, Income=$95k, Credit=650, Tenure=12yr",
      trees:[
        {id:1,col:CYN, vote:1,reason:"Income=95k (high) → Approve"},
        {id:2,col:GRN, vote:1,reason:"Long tenure=12yr (loyal) → Approve"},
        {id:3,col:VIO, vote:0,reason:"Credit=650 below 700 threshold → Reject"},
        {id:4,col:AMB, vote:1,reason:"Income dominates → Approve"},
        {id:5,col:ROSE,vote:1,reason:"High income + loyal → Approve"},
      ],
      correct:1,
    },
  ];

  const r = ROUNDS[round % ROUNDS.length];
  const votes1 = r.trees.filter(t=>t.vote===1).length;
  const forestPred = votes1 > r.trees.length/2 ? 1 : 0;

  const submit=(v)=>{
    setUserVote(v);
    setShowResult(true);
    setTotal(t=>t+1);
    if(v===forestPred) setScore(s=>s+1);
  };
  const next=()=>{
    setRound(r2=>r2+1);
    setUserVote(null);
    setShowResult(false);
  };

  return (
    <div style={{...LCARD,background:"#f0f9ff",border:`2px solid ${CYN}33`}}>
      <div style={{fontWeight:800,color:CYN,fontSize:px(17),marginBottom:4}}>
        🎮 Forest Voting Game
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        See how 5 independent trees vote. Predict what the <strong>majority vote</strong> will be.
        Score: <span style={{fontWeight:800,color:CYN}}>{score}/{total}</span>
      </p>
      <div style={{background:"#0d1117",borderRadius:10,padding:"12px 16px",
        marginBottom:16,fontFamily:"monospace",fontSize:px(13),color:AMB}}>
        🧑 {r.scenario}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {r.trees.map(tr=>(
          <div key={tr.id} style={{background:tr.col+"0d",border:`1px solid ${tr.col}33`,
            borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:tr.col+"22",
              border:`2px solid ${tr.col}`,display:"flex",alignItems:"center",
              justifyContent:"center",fontWeight:700,fontSize:px(11),color:tr.col,flexShrink:0}}>
              T{tr.id}
            </div>
            <div style={{flex:1}}>
              {showResult?(
                <div>
                  <span style={{fontWeight:700,color:tr.vote===1?GRN:RED,fontSize:px(13)}}>
                    {tr.vote===1?"✓ Approve":"✗ Reject"}
                  </span>
                  <span style={{fontSize:px(12),color:V.muted,marginLeft:8}}>{tr.reason}</span>
                </div>
              ):(
                <div style={{fontWeight:600,color:V.muted,fontSize:px(13)}}>
                  Tree {tr.id} is analyzing...
                </div>
              )}
            </div>
            {showResult&&(
              <span style={{fontFamily:"monospace",fontWeight:800,
                color:tr.vote===1?GRN:RED,fontSize:px(16)}}>
                {tr.vote===1?"1":"0"}
              </span>
            )}
          </div>
        ))}
      </div>
      {!showResult&&(
        <div>
          <p style={{...LBODY,fontWeight:700,marginBottom:10,fontSize:px(14)}}>
            What will the forest predict? (Majority of 5 trees)
          </p>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>submit(1)}
              style={{flex:1,background:GRN,border:"none",borderRadius:10,
                padding:"12px",color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
              ✅ Approve
            </button>
            <button onClick={()=>submit(0)}
              style={{flex:1,background:RED,border:"none",borderRadius:10,
                padding:"12px",color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
              ❌ Reject
            </button>
          </div>
        </div>
      )}
      {showResult&&(
        <div>
          <div style={{background:"#0d1117",borderRadius:12,padding:"14px 18px",marginBottom:12}}>
            <div style={{fontFamily:"monospace",fontSize:px(13),color:"#94a3b8",lineHeight:2}}>
              <div>Votes: {votes1} Approve, {r.trees.length-votes1} Reject</div>
              <div>Forest predicts: <span style={{color:forestPred===1?GRN:RED,fontWeight:700}}>
                {forestPred===1?"✅ Approve":"❌ Reject"}
              </span></div>
              <div>Your answer: <span style={{color:userVote===forestPred?GRN:RED,fontWeight:700}}>
                {userVote===forestPred?"✓ Correct!":"✗ Wrong"}
              </span></div>
            </div>
          </div>
          {round < ROUNDS.length-1?(
            <button onClick={next}
              style={{background:CYN,border:"none",borderRadius:10,padding:"10px 24px",
                color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
              Next Round →
            </button>
          ):(
            <div style={{background:CYN+"0d",border:`1px solid ${CYN}44`,borderRadius:10,
              padding:"12px 16px",fontWeight:700,color:CYN,fontSize:px(14)}}>
              🌲 Complete! Final Score: {score+Number(userVote===forestPred)}/{total+1}
              <button onClick={()=>{setRound(0);setScore(0);setTotal(0);setUserVote(null);setShowResult(false);}}
                style={{marginLeft:12,background:"transparent",border:`1px solid ${CYN}`,
                  borderRadius:8,padding:"4px 12px",color:CYN,cursor:"pointer",fontSize:px(11)}}>
                Play again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ══════ CHURN PROJECT ═════════════════════════════════════════ */
const ChurnProject = () => {
  const [age,setAge]=useState(35);
  const [tenure,setTenure]=useState(24);
  const [usage,setUsage]=useState(60);
  const [complaints,setComplaints]=useState(1);
  const [plan,setPlan]=useState("premium");

  // Simplified Random Forest decision logic (5 trees)
  const t1 = tenure<12 || complaints>=3 ? 1 : (usage<40?1:0);
  const t2 = complaints>=2 && tenure<24 ? 1 : 0;
  const t3 = usage<30 || (age>55&&tenure<6) ? 1 : 0;
  const t4 = complaints>=3 ? 1 : (plan==="basic"&&usage<50?1:0);
  const t5 = tenure<6 || (complaints>=2&&usage<40) ? 1 : 0;
  const votes=[t1,t2,t3,t4,t5];
  const churnVotes=votes.filter(v=>v===1).length;
  const willChurn=churnVotes>=3;
  const prob=Math.round((churnVotes/5)*100);

  return (
    <div style={{...LCARD,background:"#f0faff",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📱 Mini Project — Customer Churn Predictor
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        A Random Forest with 5 trees each trained on different customer subsets
        and features. Adjust the customer profile and watch all 5 trees vote.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:14,letterSpacing:"1px"}}>
            CUSTOMER PROFILE
          </div>
          {[
            {l:"Age",v:age,s:setAge,min:18,max:70,step:1,c:CYN,fmt:v=>`${v} yrs`},
            {l:"Tenure (months)",v:tenure,s:setTenure,min:1,max:60,step:1,c:GRN,fmt:v=>`${v} mo`},
            {l:"Monthly Usage (%)",v:usage,s:setUsage,min:5,max:100,step:5,c:VIO,fmt:v=>`${v}%`},
            {l:"Support Complaints",v:complaints,s:setComplaints,min:0,max:5,step:1,c:ROSE,fmt:v=>v},
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
          <div style={{display:"flex",gap:8}}>
            {["basic","premium","enterprise"].map(p=>(
              <button key={p} onClick={()=>setPlan(p)}
                style={{flex:1,background:plan===p?CYN+"22":"transparent",
                  border:`2px solid ${plan===p?CYN:V.border}`,borderRadius:8,
                  padding:"8px",cursor:"pointer",fontWeight:700,fontSize:px(11),
                  color:plan===p?CYN:V.muted,textTransform:"capitalize"}}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{...LCARD,padding:"12px"}}>
            <div style={{fontWeight:700,color:CYN,fontSize:px(12),marginBottom:10}}>
              🌲 TREE VOTES
            </div>
            {votes.map((v,i)=>{
              const cols=[CYN,GRN,VIO,AMB,ROSE];
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",
                  alignItems:"center",marginBottom:6}}>
                  <span style={{fontFamily:"monospace",fontSize:px(12),color:cols[i]}}>
                    Tree {i+1}
                  </span>
                  <span style={{fontWeight:800,color:v===1?ROSE:GRN,
                    fontFamily:"monospace",fontSize:px(12)}}>
                    {v===1?"Churn":"Stay"}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{background:willChurn?"#1a0008":"#001a0e",
            border:`3px solid ${willChurn?ROSE:GRN}`,borderRadius:16,
            padding:"24px",textAlign:"center"}}>
            <div style={{fontSize:px(44),marginBottom:8}}>{willChurn?"📤":"✅"}</div>
            <div style={{fontWeight:900,fontSize:px(22),
              color:willChurn?ROSE:GRN,marginBottom:6}}>
              {willChurn?"WILL CHURN":"WILL STAY"}
            </div>
            <div style={{fontFamily:"monospace",color:willChurn?ROSE:GRN,fontSize:px(16)}}>
              {prob}% churn probability
            </div>
            <div style={{background:(willChurn?ROSE:GRN)+"22",borderRadius:8,
              padding:"4px 12px",marginTop:8,fontSize:px(12),color:willChurn?ROSE:GRN}}>
              {churnVotes}/5 trees predict churn
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════ */
const RFTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🌲",c:CYN, t:"A single decision tree is unstable — small data changes cause very different trees. Random Forests fix this by averaging hundreds of trees."},
    {e:"📦",c:AMB, t:"Bootstrap aggregating (bagging): each tree trains on a random sample of the data (with replacement). ~63% of data in each bag, ~37% out-of-bag."},
    {e:"🎲",c:VIO, t:"Random feature selection: at each split, only √d (classification) or d/3 (regression) features are considered. This decorrelates trees — they make different errors."},
    {e:"🗳️",c:GRN, t:"Majority vote (classification) or mean (regression) combines tree predictions. Ensemble averaging reduces variance without increasing bias."},
    {e:"🛡️",c:ROSE,t:"Random Forests resist overfitting. More trees never hurts (just costs compute). Contrast with single trees where more depth = more overfitting."},
    {e:"📊",c:SKY, t:"Out-of-bag (OOB) score: each sample is 'out of bag' for ~37% of trees. These trees provide a free, unbiased validation estimate without a test split."},
    {e:"🔢",c:AMB, t:"Feature importance: averaged across all trees. More reliable than single-tree importance because it's less sensitive to noise in any single tree's training data."},
    {e:"🌍",c:CYN, t:"Used everywhere: fraud detection (PayPal), customer churn (Spotify), drug discovery, stock screening, recommendation features, satellite image classification."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",CYN)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:CYN}}>Know</span></h2>
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
            background:`linear-gradient(90deg,${CYN},${GRN})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:CYN,border:"none",borderRadius:10,
            padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Clustering →
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
const RandomForestsPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Random Forests" lessonNum="Lesson 5 of 7"
    accent={CYN} levelLabel="Machine Learning"
    dotLabels={["Hero","Intuition","Definition","Ensemble","Bagging","Randomness","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#020c10 0%,#042030 60%,#010c14 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🌲 Lesson 5 of 7 · Machine Learning",CYN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Random<br/><span style={{color:"#67e8f9"}}>Forests</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:CYN,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The wisdom of crowds, applied to machine learning. One doctor can be wrong.
                A panel of independent specialists rarely all agree on the wrong diagnosis.
                Random Forests apply this principle: build hundreds of diverse trees,
                let them vote, and the ensemble is almost always better than any individual.
              </p>
              <div style={{background:"rgba(8,145,178,0.12)",border:"1px solid rgba(8,145,178,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#67e8f9",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Train N decision trees, each on a different random sample of the data and
                  a random subset of features. For prediction, aggregate all N votes.
                  Diversity + averaging = dramatically reduced variance.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(8,145,178,0.06)",
              border:"1px solid rgba(8,145,178,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — INTUITION ───────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Intuitive Explanation",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Why One Tree <span style={{color:CYN}}>Isn't Enough</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  A single decision tree is fragile: change just a few training examples and
                  you get a completely different tree. This <strong>high variance</strong> means
                  it's unreliable on new data — it overfits to the specific noise in training.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Imagine asking one doctor for a diagnosis. They might be wrong. Ask a panel
                  of 100 independent doctors — each with slightly different training and
                  specialisations — and take the majority vote. The crowd is almost always
                  more accurate than any individual.
                </p>
                <IBox color={CYN} title="The Bias-Variance Tradeoff"
                  body="Deep decision trees have LOW bias (they fit training data well) but HIGH variance (they change dramatically with different training data). Random Forests keep the low bias while dramatically reducing variance by averaging many trees. Result: excellent generalisation."/>
              </div>
              <div>
                <div style={{...LCARD,background:"#f0faff",border:`2px solid ${CYN}33`}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:16,fontSize:px(14)}}>
                    🌲 Single Tree vs 🌳 Random Forest
                  </div>
                  {[
                    {prop:"Stability",t1:"❌ Fragile",rf:"✅ Stable",c:GRN},
                    {prop:"Overfitting",t1:"❌ High risk",rf:"✅ Low risk",c:GRN},
                    {prop:"Interpretability",t1:"✅ Fully readable",rf:"⚠️ Harder",c:AMB},
                    {prop:"Accuracy",t1:"⚠️ Moderate",rf:"✅ High",c:GRN},
                    {prop:"Training speed",t1:"✅ Very fast",rf:"⚠️ Slower (N×)",c:AMB},
                    {prop:"Feature importance",t1:"⚠️ Noisy",rf:"✅ Reliable",c:GRN},
                  ].map(row=>(
                    <div key={row.prop} style={{display:"flex",gap:8,alignItems:"center",
                      marginBottom:8,padding:"6px 10px",background:"#fff",
                      border:`1px solid ${row.c}22`,borderRadius:8}}>
                      <span style={{fontSize:px(12),color:V.muted,width:100,flexShrink:0}}>{row.prop}</span>
                      <span style={{fontSize:px(11),color:V.muted,flex:1}}>{row.t1}</span>
                      <span style={{fontSize:px(11),color:row.c,fontWeight:700,flex:1}}>{row.rf}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — FORMAL DEFINITION ───────────────────────────── */}
        <div ref={R(2)} style={{background:"#040c14"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Formal Definition","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Mathematical <span style={{color:"#67e8f9"}}>Framework</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  A Random Forest is an ensemble of T decision trees
                  {"{"}h₁(x), h₂(x), …, hᵀ(x){"}"}, each trained on a bootstrap
                  sample Dₜ of the original dataset D with a random feature subset.
                </p>
                <Formula color="#67e8f9">
                  H(x) = majority_vote{"{"}h₁(x), …, hᵀ(x){"}"}
                </Formula>
                <Formula color={AMB}>
                  H(x) = (1/T) Σₜ₌₁ᵀ hₜ(x)  [regression]
                </Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  For classification: each tree votes for a class; the majority wins.
                  For regression: predictions are averaged across all T trees.
                  Leo Breiman introduced the Random Forest algorithm in 2001.
                </p>
                <IBox color="#67e8f9" title="Why does averaging reduce error?"
                  body="If each tree has error ε and trees are independent, the ensemble error is ε/T. In practice trees are correlated, but the random feature selection decorrelates them substantially. The theoretical gain is: Var(mean) = σ²/T + ρ(1-1/T)σ², where ρ is average tree correlation. Minimising ρ (via feature randomness) is the key to Random Forests' success."/>
              </div>
              <div>
                {[
                  {s:"T",c:"#67e8f9",t:"Number of trees",
                    d:"Typical: 100–500. More trees = lower variance. Error decreases asymptotically. After ~200 trees, gains are minimal. n_estimators in Scikit-learn."},
                  {s:"Dₜ",c:AMB,t:"Bootstrap sample",
                    d:"Random sample of n training points WITH replacement. Each sample of size n contains ~63.2% unique points (the rest are duplicates). The remaining ~36.8% are 'out-of-bag'."},
                  {s:"mₜ",c:GRN,t:"Feature subset size",
                    d:"At each split: randomly select m features to consider. For classification: m = √d. For regression: m = d/3. This is max_features in Scikit-learn."},
                  {s:"hₜ(x)",c:VIO,t:"Individual tree",
                    d:"A fully grown (or depth-limited) CART decision tree trained on Dₜ using only the mₜ feature subset at each split. No pruning needed — the ensemble handles variance."},
                  {s:"OOB",c:ROSE,t:"Out-of-bag score",
                    d:"Each sample is excluded from ~37% of trees. Use those trees to predict it. Average accuracy = reliable, free validation score without a separate test set."},
                ].map(item=>(
                  <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",gap:12}}>
                    <div style={{fontFamily:"monospace",fontSize:px(20),fontWeight:900,
                      color:item.c,minWidth:36,textAlign:"center",paddingTop:2}}>{item.s}</div>
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

        {/* ── S3 — ENSEMBLE CONCEPT ────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Ensemble Learning",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The <span style={{color:CYN}}>Wisdom of Crowds</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Ensemble learning combines multiple models to produce one better model.
                  The key insight: if individual models make <em>different</em> errors,
                  those errors cancel out when averaged. This is only possible if the
                  models are diverse (not all identical).
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:20}}>
                  Three conditions for ensembles to outperform individuals:
                </p>
                {[
                  {e:"🎲",c:CYN,t:"Diversity",d:"Models must make different mistakes. If all trees are identical, averaging doesn't help. Randomness creates diversity."},
                  {e:"✅",c:GRN,t:"Individual accuracy",d:"Each model must be better than random chance. An ensemble of weak models that all fail in the same way will also fail."},
                  {e:"🗳️",c:AMB,t:"Aggregation rule",d:"Simple majority vote (classification) or mean (regression) works well. More sophisticated: weighted voting based on individual model confidence."},
                ].map(c=>(
                  <div key={c.t} style={{...LCARD,display:"flex",gap:14,alignItems:"flex-start",
                    marginBottom:10,borderLeft:`4px solid ${c.c}`}}>
                    <span style={{fontSize:px(28)}}>{c.e}</span>
                    <div>
                      <div style={{fontWeight:700,color:c.c,fontSize:px(13),marginBottom:4}}>{c.t}</div>
                      <p style={{...LBODY,fontSize:px(13),margin:0}}>{c.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f0faff",border:`2px solid ${CYN}33`}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:12,fontSize:px(14)}}>
                    🏥 Expert Panel Analogy
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {doc:"Cardiologist",vote:"Heart disease",c:CYN,right:true},
                      {doc:"Pulmonologist",vote:"Lung infection",c:GRN,right:false},
                      {doc:"Immunologist",vote:"Heart disease",c:VIO,right:true},
                      {doc:"Internist",vote:"Heart disease",c:AMB,right:true},
                      {doc:"GP",vote:"Heart disease",c:ROSE,right:true},
                    ].map(({doc,vote,c,right})=>(
                      <div key={doc} style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",background:c+"0d",border:`1px solid ${c}22`,
                        borderRadius:8,padding:"8px 12px"}}>
                        <span style={{fontWeight:600,color:V.ink,fontSize:px(12)}}>{doc}</span>
                        <span style={{fontFamily:"monospace",color:c,fontSize:px(11)}}>{vote}</span>
                        <span style={{color:right?GRN:RED,fontWeight:700,fontSize:px(12)}}>{right?"✓":"✗"}</span>
                      </div>
                    ))}
                    <div style={{background:GRN+"0d",border:`2px solid ${GRN}`,borderRadius:10,
                      padding:"10px 14px",textAlign:"center",fontWeight:800,color:GRN}}>
                      Majority: Heart disease (4/5) ✓
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S4 — BAGGING & RANDOMNESS ────────────────────────── */}
        <div ref={R(4)} style={{background:"#040c14"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Bagging & Randomness","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Two Sources of <span style={{color:"#67e8f9"}}>Diversity</span>
            </h2>
            <p style={{...LBODY,color:"#94a3b8",marginBottom:px(24)}}>
              Random Forests inject randomness in two ways to ensure trees are diverse.
              Click a tree in the visualizer to inspect its bootstrap sample and feature subset.
            </p>
            <BaggingViz/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24),marginTop:px(24)}}>
              <div style={{background:CYN+"0d",border:`1px solid ${CYN}44`,borderRadius:16,padding:"22px"}}>
                <div style={{fontSize:px(36),marginBottom:10}}>📦</div>
                <div style={{fontWeight:800,color:CYN,fontSize:px(17),marginBottom:8}}>
                  Bootstrap Sampling
                </div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  Sample n points WITH replacement from n training examples. Each tree
                  trains on a different ~63% of the data. The repeated samples expose
                  different patterns; the omitted samples allow OOB validation.
                </p>
                <Formula color={CYN}>P(sample included) ≈ 1 − (1 − 1/n)ⁿ → 63.2%</Formula>
              </div>
              <div style={{background:AMB+"0d",border:`1px solid ${AMB}44`,borderRadius:16,padding:"22px"}}>
                <div style={{fontSize:px(36),marginBottom:10}}>🎲</div>
                <div style={{fontWeight:800,color:AMB,fontSize:px(17),marginBottom:8}}>
                  Random Feature Selection
                </div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:14}}>
                  At every split, only m randomly chosen features are evaluated (not all d).
                  This is the key innovation over bagging alone — it decorrelates trees by
                  preventing all trees from always using the same dominant features.
                </p>
                <Formula color={AMB}>m = √d (classification)  |  m = d/3 (regression)</Formula>
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — ADVANTAGES ──────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Advantages & Limitations",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Strengths and <span style={{color:CYN}}>Trade-offs</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28)}}>
              <div>
                <div style={{fontWeight:700,color:GRN,marginBottom:14,fontSize:px(14)}}>
                  ✅ STRENGTHS
                </div>
                {[
                  {t:"Rarely overfits",d:"Adding more trees never increases overfitting — it only reduces variance. Safe to go large."},
                  {t:"Handles high dimensions",d:"Efficiently handles thousands of features. Random feature selection provides implicit dimensionality reduction."},
                  {t:"Robust to noise",d:"Outliers and mislabelled examples affect only a fraction of trees. The ensemble smooths over individual errors."},
                  {t:"No feature scaling",d:"Trees use threshold comparisons (>, ≤) — scale-invariant. No need to normalise or standardise features."},
                  {t:"Free OOB validation",d:"~37% of data is out-of-bag per tree. This gives a reliable accuracy estimate without a separate validation set."},
                  {t:"Feature importance",d:"Averaged across all trees, importance scores are much more reliable than single-tree importance."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,padding:"12px 14px",marginBottom:8,
                    borderLeft:`3px solid ${GRN}`,display:"flex",gap:12}}>
                    <span style={{color:GRN,fontWeight:700,fontSize:px(16),flexShrink:0}}>✅</span>
                    <div>
                      <div style={{fontWeight:700,color:V.ink,fontSize:px(13)}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:"4px 0 0"}}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontWeight:700,color:ROSE,marginBottom:14,fontSize:px(14)}}>
                  ⚠️ LIMITATIONS
                </div>
                {[
                  {t:"Not interpretable",d:"You cannot print the rules. 200 trees × 100 nodes each = 20,000 rules. Use SHAP values or feature importance for partial explanations."},
                  {t:"Slower than single tree",d:"Training and prediction time scale linearly with T. For real-time inference on embedded devices, a single tree may be preferred."},
                  {t:"Memory intensive",d:"Storing 500 full trees consumes significant memory. Use n_estimators=100 for most practical cases."},
                  {t:"Extrapolation",d:"Cannot extrapolate beyond training data range. If training data has max price $500k, it cannot predict $1M. Neural networks handle this better."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,padding:"12px 14px",marginBottom:8,
                    borderLeft:`3px solid ${ROSE}`,display:"flex",gap:12}}>
                    <span style={{color:ROSE,fontWeight:700,fontSize:px(16),flexShrink:0}}>⚠️</span>
                    <div>
                      <div style={{fontWeight:700,color:V.ink,fontSize:px(13)}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:"4px 0 0"}}>{item.d}</p>
                    </div>
                  </div>
                ))}
                <IBox color={CYN} title="When to use Random Forest"
                  body="Default first choice for tabular data. Before trying gradient boosting or neural networks, try Random Forest — it often matches their performance with zero tuning. Especially good when: features have nonlinear interactions, data is noisy, you need feature importances, interpretability isn't strictly required."/>
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — PYTHON ──────────────────────────────────────── */}
        <div ref={R(6)} style={{background:"#040c14"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python Example","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code It with <span style={{color:"#67e8f9"}}>Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#67e8f9" lines={[
                  "import numpy as np",
                  "import pandas as pd",
                  "from sklearn.ensemble import RandomForestClassifier",
                  "from sklearn.model_selection import train_test_split",
                  "from sklearn.metrics import classification_report",
                  "",
                  "# Churn dataset",
                  "# Features: [age, tenure_months, monthly_usage, complaints]",
                  "X = np.array([",
                  "  [35,24,80,0],[22, 3,30,3],[48,36,90,1],",
                  "  [28, 6,40,2],[55,48,70,0],[33,12,55,2],",
                  "  [41,30,85,0],[26, 4,25,4],[38,18,65,1],",
                  "  [50,42,75,0]",
                  "])",
                  "y = np.array([0,1,0,1,0,1,0,1,0,0])  # 1=churn",
                  "",
                  "X_tr,X_te,y_tr,y_te = train_test_split(",
                  "  X, y, test_size=0.3, random_state=42)",
                  "",
                  "# Train Random Forest",
                  "rf = RandomForestClassifier(",
                  "  n_estimators=100,    # 100 trees",
                  "  max_features='sqrt', # √d features per split",
                  "  max_depth=5,         # limit each tree",
                  "  oob_score=True,      # free validation",
                  "  random_state=42",
                  ")",
                  "rf.fit(X_tr, y_tr)",
                  "",
                  "print('OOB Score:', rf.oob_score_)",
                  "print('Test Score:', rf.score(X_te, y_te))",
                  "",
                  "# Feature importance",
                  "features = ['age','tenure','usage','complaints']",
                  "for f, imp in zip(features, rf.feature_importances_):",
                  "  print(f'{f}: {imp:.3f}')",
                  "",
                  "# Predict with probability",
                  "proba = rf.predict_proba([[35, 3, 30, 3]])",
                  "print('Churn probability:', proba[0][1])",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"n_estimators=100",c:CYN,
                    d:"Number of trees. 100 is a good default — balances accuracy and speed. More trees = marginally better, but diminishing returns after ~200."},
                  {l:"max_features='sqrt'",c:AMB,
                    d:"At each split, consider only √d features. This is the critical randomness that decorrelates trees. 'sqrt' for classification, 'sqrt' or 1/3 for regression."},
                  {l:"oob_score=True",c:GRN,
                    d:"Use the ~37% out-of-bag samples to estimate generalisation performance — completely free, no test set needed. Reliable for large datasets."},
                  {l:"rf.oob_score_",c:VIO,
                    d:"The OOB accuracy estimate. Should be close to your test score. Large gap (OOB >> test) means overfitting; OOB << test means data leakage."},
                  {l:"rf.feature_importances_",c:ROSE,
                    d:"Mean decrease in impurity for each feature, averaged across all trees and all splits. Sum=1. More reliable than single-tree importance."},
                  {l:"predict_proba()",c:SKY,
                    d:"Returns class probabilities — [P(stay), P(churn)]. Much more useful than predict() for calibrating business decisions (e.g. trigger intervention at >30% churn probability)."},
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
            {STag("Section 7 · Visualization",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Understanding the <span style={{color:CYN}}>Forest</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(24)}}>
              {[
                {e:"📊",c:CYN,t:"Feature Importance Bar",
                  d:"Horizontal bar chart of feature_importances_. Instantly shows which features drive predictions. Sort descending. Use to eliminate useless features."},
                {e:"📉",c:AMB,t:"OOB Error vs N Trees",
                  d:"Plot OOB error as n_estimators increases from 1 to 200. Shows the diminishing returns curve — where to stop adding trees without wasting compute."},
                {e:"🌡️",c:GRN,t:"SHAP Values",
                  d:"SHapley Additive exPlanations: per-prediction feature contributions. 'This prediction is high because income=80k (+0.3) and age=45 (+0.1)'. The best RF interpretability tool."},
              ].map(v=>(
                <div key={v.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${v.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(14),marginBottom:8}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{v.d}</p>
                </div>
              ))}
            </div>
            <IBox color={CYN} title="Partial Dependence Plots (PDP)"
              body="Show the marginal effect of one or two features on the predicted outcome, averaging over all other features. E.g. 'how does churn probability change as tenure increases from 1 to 60 months, holding all other features at their training distribution?' This reveals whether the relationship is linear, monotonic, or has a threshold effect."/>
          </div>
        </div>

        {/* ── S8 — APPLICATIONS ────────────────────────────────── */}
        <div ref={R(8)} style={{background:"#040c14"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Random Forests <span style={{color:"#67e8f9"}}>in the Wild</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"💳",c:CYN,t:"Fraud Detection",
                  b:"Kaggle's landmark fraud detection challenge (284k transactions, 0.17% fraud rate) is dominated by Random Forest and gradient boosting solutions. RF handles the extreme class imbalance well with class_weight='balanced'. PayPal and Stripe use RF-based systems.",
                  tech:"RandomForestClassifier + SMOTE oversampling"},
                {e:"📱",c:AMB,t:"Customer Churn",
                  b:"Telecom, SaaS, and streaming companies use RF to predict which subscribers will cancel within 30 days. Features: usage trends, complaint history, plan type, engagement scores. Proactively offer incentives to at-risk customers.",
                  tech:"RandomForestClassifier with SHAP values"},
                {e:"🌿",c:GRN,t:"Drug Discovery",
                  b:"Predict molecular properties from chemical structure fingerprints. RF was the winning method in Merck's molecular activity challenge (2012 Kaggle). Each bit in a fingerprint is a feature — thousands of features handled efficiently.",
                  tech:"RandomForestRegressor on molecular features"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:px(16),padding:"22px 24px"}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:12,color:"#64748b"}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:"#1e1b4b",borderRadius:8,padding:"8px 12px",fontSize:px(11),color:a.c}}>{a.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9 — GAME ────────────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Forest Voting</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Watch 5 independent trees analyse a customer profile and reveal their votes.
              Predict the majority vote before seeing the result. Understand why the ensemble
              is more reliable than any single tree's reasoning.
            </p>
            <ForestVotingGame/>
          </div>
        </div>

        {/* ── S10 — PROJECT ────────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Customer Churn <span style={{color:CYN}}>Predictor</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A 5-tree Random Forest with pre-trained weights. Adjust customer features
              to see how all trees vote and how the ensemble aggregates their predictions.
            </p>
            <ChurnProject/>
          </div>
        </div>

        {/* ── S11 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.cream}}>
          <RFTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default RandomForestsPage;
