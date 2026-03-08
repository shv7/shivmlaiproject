import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — RECURRENT NEURAL NETWORKS
   Level 4 · Deep Learning · Lesson 5 of 7
   Accent: Teal #0d9488
══════════════════════════════════════════════════════════════════ */
const TEAL = "#0d9488";
const GRN  = "#059669";
const VIO  = "#7c3aed";
const AMB  = "#d97706";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const IND  = "#4f46e5";
const PNK  = "#ec4899";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula=({children,color=TEAL})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox=({lines,color=TEAL})=>(
  <div style={{fontFamily:"monospace",background:"#020c0a",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — sequence processing ══════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize();window.addEventListener("resize",resize);
    const WORDS=["The","cat","sat","on","the","mat"];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#020d0a";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(13,148,136,0.04)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const n=WORDS.length;
      const step=W/(n+1);
      const cy=H*0.55;
      const active=Math.floor(t*0.6)%n;
      // hidden state flow lines
      for(let i=0;i<n-1;i++){
        const x1=(i+1)*step,x2=(i+2)*step;
        ctx.beginPath();ctx.moveTo(x1,cy-40);ctx.lineTo(x2,cy-40);
        ctx.strokeStyle=TEAL+"33";ctx.lineWidth=2;ctx.stroke();
        const mx=(x1+x2)/2, pulse=i===active?1:0.2;
        const g=ctx.createRadialGradient(mx,cy-40,0,mx,cy-40,10);
        g.addColorStop(0,TEAL+Math.round(pulse*200).toString(16).padStart(2,"0"));
        g.addColorStop(1,TEAL+"00");
        ctx.beginPath();ctx.arc(mx,cy-40,10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.moveTo(x2-8,cy-44);ctx.lineTo(x2,cy-40);ctx.lineTo(x2-8,cy-36);
        ctx.strokeStyle=TEAL+"66";ctx.lineWidth=1.5;ctx.stroke();
      }
      // RNN cells and words
      WORDS.forEach((w,i)=>{
        const x=(i+1)*step;
        const isActive=i===active;
        const pulse=(Math.sin(t*2+i*0.8)+1)/2;
        const r=isActive?28:22;
        const g=ctx.createRadialGradient(x,cy,0,x,cy,r*2);
        g.addColorStop(0,TEAL+(isActive?"44":"22"));
        g.addColorStop(1,TEAL+"00");
        ctx.beginPath();ctx.arc(x,cy,r*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(x,cy,r,0,Math.PI*2);
        ctx.fillStyle="#031410";ctx.fill();
        ctx.strokeStyle=isActive?TEAL:TEAL+"55";ctx.lineWidth=isActive?2.5:1.5;
        ctx.shadowColor=TEAL;ctx.shadowBlur=isActive?14:4;ctx.stroke();ctx.shadowBlur=0;
        ctx.font=`bold ${px(11)} sans-serif`;
        ctx.fillStyle=isActive?"#fff":TEAL+"88";
        ctx.textAlign="center";ctx.fillText("h",x,cy+4);
        // word label
        ctx.font=`${px(13)} sans-serif`;
        ctx.fillStyle=isActive?TEAL+"ff":"#475569";
        ctx.fillText(w,x,cy+r+18);
        // output arrow
        if(i===n-1||i===active){
          ctx.beginPath();ctx.moveTo(x,cy-r-4);ctx.lineTo(x,cy-r-24);
          ctx.strokeStyle=GRN+"88";ctx.lineWidth=1.5;ctx.stroke();
          ctx.font=`${px(9)} sans-serif`;ctx.fillStyle=GRN+"88";
          ctx.fillText("out",x,cy-r-28);
        }
        // input arrow
        ctx.beginPath();ctx.moveTo(x,cy+r+4+18+4);ctx.lineTo(x,cy+r+4);
        ctx.strokeStyle=AMB+"55";ctx.lineWidth=1;ctx.stroke();
      });
      ctx.font=`bold ${px(10)} sans-serif`;ctx.fillStyle="#1e3a36";ctx.textAlign="center";
      ctx.fillText("Input sequence",W/2,H-10);
      ctx.fillStyle=TEAL+"66";ctx.fillText("Hidden state h_t flows →",W/2,cy-60);
      t+=0.04;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ HIDDEN STATE DEMO ══════════════════════════════════════ */
const HiddenStateDemo=()=>{
  const [seq,setSeq]=useState("I love deep learning");
  const [step,setStep]=useState(0);
  const [h,setH]=useState([0,0,0,0]);
  const words=seq.trim().split(/\s+/).filter(Boolean);
  const N=4;

  const reset=()=>{setStep(0);setH([0,0,0,0]);};
  const forward=()=>{
    if(step>=words.length)return;
    const w=words[step];
    // simulate hidden state update with word hash
    const hash=(s)=>s.split("").reduce((a,c)=>(a*31+c.charCodeAt(0))%1000/1000,0);
    const wv=hash(w);
    setH(prev=>{
      const decay=0.7;
      return prev.map((v,i)=>Math.round((v*decay+wv*(i%2===0?0.3:-0.2))*1000)/1000);
    });
    setStep(s=>s+1);
  };

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:TEAL,marginBottom:8,fontSize:px(15)}}>
        🔄 Hidden State Demo — Watch h_t evolve as words arrive
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The hidden state h_t is the RNN's "memory" — it accumulates information from all previous tokens.
        Press Forward to process one word at a time and watch how h changes.
      </p>
      <div style={{marginBottom:12}}>
        <label style={{fontSize:px(11),color:V.muted,marginBottom:4,display:"block"}}>Input sentence:</label>
        <input value={seq} onChange={e=>{setSeq(e.target.value);reset();}}
          style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1px solid ${TEAL}44`,
            background:"#f0fdfa",fontFamily:"monospace",fontSize:px(13),boxSizing:"border-box"}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{background:"#020c0a",borderRadius:12,padding:"14px",marginBottom:12,fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
            <div style={{color:"#475569"}}># RNN forward step:</div>
            <div style={{color:TEAL}}>h_t = tanh(W_h × h_prev + W_x × x_t + b)</div>
            {step>0&&(
              <>
                <div style={{color:"#475569",marginTop:4}}>Current word: <span style={{color:AMB,fontWeight:700}}>"{words[step-1]}"</span></div>
                <div style={{color:TEAL}}>h = [{h.map(v=>v.toFixed(3)).join(", ")}]</div>
              </>
            )}
            {step===0&&<div style={{color:"#475569"}}>h_0 = [0.000, 0.000, 0.000, 0.000]</div>}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <button onClick={forward} disabled={step>=words.length}
              style={{flex:1,background:step>=words.length?GRN:TEAL,border:"none",borderRadius:10,
                padding:"10px",color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                opacity:step>=words.length?0.7:1}}>
              {step>=words.length?"✅ Sequence complete":"→ Process next word"}
            </button>
            <button onClick={reset}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
                padding:"10px 14px",color:V.muted,fontSize:px(11),cursor:"pointer"}}>↺</button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {words.map((w,i)=>(
              <div key={i} style={{background:i<step?TEAL+"22":V.cream,
                border:`2px solid ${i<step?TEAL:V.border}`,borderRadius:8,
                padding:"5px 10px",fontFamily:"monospace",fontSize:px(12),
                color:i<step?TEAL:V.muted,fontWeight:i===step-1?700:400,
                transition:"all 0.3s"}}>
                {i===step-1?"▶ ":i<step?"✓ ":""}{w}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8}}>
            HIDDEN STATE DIMENSIONS ({N}D, simplified)
          </div>
          {h.map((v,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontFamily:"monospace",fontSize:px(12),color:TEAL}}>h[{i}]</span>
                <span style={{fontFamily:"monospace",fontWeight:700,
                  color:v>0?GRN:v<0?ROSE:V.muted,fontSize:px(13)}}>{v.toFixed(3)}</span>
              </div>
              <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",left:"50%",top:0,width:1,height:"100%",background:V.border}}/>
                <div style={{height:"100%",
                  width:`${Math.min(50,Math.abs(v)*50)}%`,
                  background:v>0?GRN:ROSE,borderRadius:6,
                  marginLeft:v>0?"50%":`calc(50% - ${Math.min(50,Math.abs(v)*50)}%)`,
                  transition:"all 0.3s"}}/>
              </div>
            </div>
          ))}
          <IBox color={TEAL} title="Hidden state as memory"
            body="In reality, hidden states are 128-512 dimensional vectors. Each dimension learns to track a different aspect of the sequence — tense, subject, sentiment, clause depth. After 'The cat sat', the hidden state encodes that we're talking about a cat doing something past tense — this context informs what comes next."/>
        </div>
      </div>
    </div>
  );
};

/* ══════ LSTM CELL VISUALIZER ═══════════════════════════════════ */
const LSTMViz=()=>{
  const [cellState,setCellState]=useState([0.5,-0.3,0.8,-0.1]);
  const [inputV,setInputV]=useState(0.7);
  const [fgate,setFgate]=useState(0.8);
  const [igate,setIgate]=useState(0.6);
  const [ogate,setOgate]=useState(0.7);
  const sigmoid=v=>1/(1+Math.exp(-v));
  const tanh=v=>Math.tanh(v);

  const sf=sigmoid(fgate*3-1);
  const si=sigmoid(igate*3-1);
  const so=sigmoid(ogate*3-1);
  const g=tanh(inputV*3-1.5);
  const newCell=cellState.map(c=>c*sf+si*g);
  const hOut=newCell.map(c=>so*tanh(c));

  const COLORS=[TEAL,GRN,AMB,VIO];

  return (
    <div style={{...LCARD,background:"#f0fdfa",border:`2px solid ${TEAL}22`}}>
      <div style={{fontWeight:700,color:TEAL,marginBottom:8,fontSize:px(15)}}>
        🧬 LSTM Cell — Interactive gate control
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        LSTM solves vanishing gradients with 3 gates and a cell state that carries information
        over long sequences. Adjust the gates to see how memory is updated.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          {[
            {label:"Forget gate f_t",v:fgate,s:setFgate,c:ROSE,
              note:`σ=${sf.toFixed(3)} — keeps ${Math.round(sf*100)}% of old memory`},
            {label:"Input gate i_t",v:igate,s:setIgate,c:GRN,
              note:`σ=${si.toFixed(3)} — writes ${Math.round(si*100)}% of new info`},
            {label:"Output gate o_t",v:ogate,s:setOgate,c:AMB,
              note:`σ=${so.toFixed(3)} — exposes ${Math.round(so*100)}% of cell`},
            {label:"Input value x_t",v:inputV,s:setInputV,c:TEAL,
              note:`tanh=${g.toFixed(3)} — candidate content`},
          ].map(({label,v,s,c,note})=>(
            <div key={label} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(12)}}>{label}</span>
                <span style={{fontFamily:"monospace",fontSize:px(11),color:V.muted}}>{note}</span>
              </div>
              <input type="range" min={0} max={1} step={0.02} value={v}
                onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#020c0a",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
            <div style={{color:"#475569"}}>— LSTM update —</div>
            <div style={{color:ROSE}}>f_t = σ({fgate.toFixed(2)}) = {sf.toFixed(3)}</div>
            <div style={{color:GRN}}>i_t = σ({igate.toFixed(2)}) = {si.toFixed(3)}</div>
            <div style={{color:TEAL}}>g = tanh({(inputV*3-1.5).toFixed(2)}) = {g.toFixed(3)}</div>
            <div style={{color:AMB}}>c_t = f×c_prev + i×g</div>
            <div style={{color:"#94a3b8"}}>c_t = [{newCell.map(v2=>v2.toFixed(2)).join(", ")}]</div>
            <div style={{color:AMB}}>o_t = σ({ogate.toFixed(2)}) = {so.toFixed(3)}</div>
            <div style={{color:TEAL,fontWeight:700}}>h_t = o×tanh(c_t)</div>
            <div style={{color:TEAL}}>h_t = [{hOut.map(v2=>v2.toFixed(3)).join(", ")}]</div>
          </div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:4}}>
            CELL STATE (long-term memory)
          </div>
          {newCell.map((v2,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:px(11),color:COLORS[i],minWidth:40}}>c[{i}]</span>
              <div style={{flex:1,background:V.cream,borderRadius:4,height:10,overflow:"hidden",position:"relative"}}>
                <div style={{position:"absolute",left:"50%",top:0,width:1,height:"100%",background:V.border}}/>
                <div style={{height:"100%",width:`${Math.min(50,Math.abs(v2)*30)}%`,
                  background:v2>0?TEAL:ROSE,borderRadius:4,
                  marginLeft:v2>0?"50%":`calc(50% - ${Math.min(50,Math.abs(v2)*30)}%)`,
                  transition:"all 0.3s"}}/>
              </div>
              <span style={{fontFamily:"monospace",fontSize:px(11),color:v2>0?TEAL:ROSE,fontWeight:700,minWidth:50}}>{v2.toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ NEXT WORD GAME ═════════════════════════════════════════ */
const NextWordGame=()=>{
  const SEQS=[
    {context:"The cat sat on the",opts:["mat","sky","table","flew"],ans:"mat",why:"'The cat sat on the ___' is a classic English rhyme. An RNN trained on English text learns that 'sat on the' is followed by 'mat' with high probability."},
    {context:"2, 4, 6, 8,",opts:["10","9","7","11"],ans:"10",why:"Even number sequence: +2 pattern. A sequence model learns the recurrent structure of arithmetic progressions. Each new number depends on the one before."},
    {context:"I think therefore I",opts:["am","was","do","think"],ans:"am",why:"Descartes' cogito: 'I think therefore I am.' Language models encode common philosophical phrases in their weights after training on large text corpora."},
    {context:"if x > 0:\n  return",opts:["x","-x","True","None"],ans:"x",why:"A code-trained RNN/LM learns that positive-branch returns of absolute value functions typically return the input variable directly."},
    {context:"BCDECDEFDEFG",opts:["EFGH","HIJK","DEFG","ABCD"],ans:"EFGH",why:"The pattern is overlapping alphabetic runs: BCD, CDE, DEF, EFG, _FGH. This is a sequence pattern — position memory is needed to predict the continuation."},
  ];
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const q=SEQS[step%SEQS.length];

  const choose=opt=>{
    if(chosen)return;
    setChosen(opt);
    if(opt===q.ans)setScore(s=>s+1);
  };

  return (
    <div style={{...LCARD,background:"#f0fdfa",border:`2px solid ${TEAL}22`}}>
      <div style={{fontWeight:800,color:TEAL,fontSize:px(17),marginBottom:8}}>
        🎮 Predict the Next Token — Think like an RNN
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Given a sequence context, predict what comes next. This is exactly what sequence models
        do — maximise P(next_token | all_previous_tokens). Score: <strong style={{color:TEAL}}>{score}/{step%5===0&&step>0?5:step%5}</strong>
      </p>
      <div style={{background:TEAL+"0d",border:`2px solid ${TEAL}33`,borderRadius:14,
        padding:"18px",marginBottom:18,fontFamily:"monospace"}}>
        <div style={{fontSize:px(11),color:V.muted,marginBottom:6}}>Context:</div>
        <div style={{fontSize:px(18),fontWeight:700,color:TEAL,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{q.context} <span style={{color:V.border}}>___</span></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {q.opts.map(opt=>{
          const isCorrect=opt===q.ans,isChosen=opt===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isCorrect){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChosen&&!isCorrect){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"12px",cursor:chosen?"default":"pointer",
                fontFamily:"monospace",fontWeight:700,fontSize:px(15),color:col,transition:"all 0.2s"}}>
              {show&&isCorrect?"✅ ":show&&isChosen&&!isCorrect?"❌ ":""}{opt}
            </button>
          );
        })}
      </div>
      {chosen&&(
        <div>
          <div style={{background:chosen===q.ans?GRN+"0d":ROSE+"0d",
            border:`2px solid ${chosen===q.ans?GRN:ROSE}`,borderRadius:12,padding:"12px",marginBottom:10}}>
            <div style={{fontWeight:800,color:chosen===q.ans?GRN:ROSE,marginBottom:4,fontSize:px(14)}}>
              {chosen===q.ans?"✅ Correct!":"❌ Answer: "+q.ans}
            </div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{q.why}</p>
          </div>
          <button onClick={()=>{setChosen(null);setStep(s=>s+1);}}
            style={{background:TEAL,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%5<4?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ TEXT SEQUENCE PROJECT ══════════════════════════════════ */
const TextSequenceProject=()=>{
  const [text,setText]=useState("hello");
  const [epoch,setEpoch]=useState(0);
  const [training,setTraining]=useState(false);
  const [generated,setGenerated]=useState("");
  const iRef=useRef(null);

  const startTrain=()=>{
    setTraining(true);setEpoch(0);setGenerated("");
    iRef.current=setInterval(()=>setEpoch(e=>{
      if(e>=30){clearInterval(iRef.current);setTraining(false);
        // generate mock output
        const chars=text.split("");
        let out=text;
        for(let i=0;i<20;i++){out+=chars[Math.floor(Math.random()*chars.length)];}
        setGenerated(out);
      }
      return e+1;
    }),100);
  };
  const reset=()=>{setEpoch(0);setTraining(false);setGenerated("");clearInterval(iRef.current);};
  useEffect(()=>()=>clearInterval(iRef.current),[]);
  const loss=Math.max(0.01,2.5*Math.exp(-epoch*0.12));

  return (
    <div style={{...LCARD,background:"#f0fdfa",border:`2px solid ${TEAL}22`}}>
      <div style={{fontWeight:700,color:TEAL,marginBottom:8,fontSize:px(15)}}>
        📝 Mini Project — Character-Level RNN Text Generator
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        A character-level RNN trains on input text and learns to predict the next character.
        After training, it can generate new text in the same style. Type a seed and watch it learn.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:px(11),color:V.muted,marginBottom:4,display:"block"}}>Training text (seed):</label>
            <textarea value={text} onChange={e=>{setText(e.target.value);reset();}}
              style={{width:"100%",padding:"10px",borderRadius:8,border:`1px solid ${TEAL}44`,
                background:"#f0fdfa",fontFamily:"monospace",fontSize:px(13),
                resize:"none",height:80,boxSizing:"border-box"}}/>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:px(12),marginBottom:4}}>
              <span style={{color:V.muted}}>Training ({epoch}/30 epochs)</span>
              <span style={{fontFamily:"monospace",color:TEAL,fontWeight:700}}>loss={loss.toFixed(3)}</span>
            </div>
            <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(epoch/30)*100}%`,
                background:`linear-gradient(90deg,${TEAL},${GRN})`,borderRadius:6,transition:"width 0.1s"}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={training?()=>{}:startTrain} disabled={training||epoch>=30||!text.trim()}
              style={{flex:1,background:epoch>=30?GRN:TEAL,border:"none",borderRadius:10,
                padding:"10px",color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                opacity:training?0.6:1}}>
              {training?"Training...":epoch>=30?"✅ Done!":"▶ Train RNN"}
            </button>
            <button onClick={reset}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
                padding:"10px 14px",color:V.muted,fontSize:px(11),cursor:"pointer"}}>↺</button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#020c0a",borderRadius:12,padding:"14px",fontFamily:"monospace",
            fontSize:px(12),lineHeight:2,minHeight:100}}>
            <div style={{color:"#475569"}}># Generated text:</div>
            {generated?(
              <div style={{color:TEAL,wordBreak:"break-all"}}>{generated}</div>
            ):(
              <div style={{color:"#1e3a36"}}>Train first to generate...</div>
            )}
          </div>
          <CodeBox color={TEAL} lines={[
            "import torch, torch.nn as nn",
            "",
            "class CharRNN(nn.Module):",
            "  def __init__(self,vocab,hidden):",
            "    super().__init__()",
            "    self.embed=nn.Embedding(vocab,64)",
            "    self.lstm=nn.LSTM(64,hidden,",
            "      num_layers=2,dropout=0.3)",
            "    self.fc=nn.Linear(hidden,vocab)",
            "  def forward(self,x,h=None):",
            "    e=self.embed(x)",
            "    out,h=self.lstm(e,h)",
            "    return self.fc(out),h",
            "",
            "# Train: predict next char from all",
            "# previous chars in sequence",
            "# Loss: cross-entropy on characters",
            "# After training: sample autoregressively",
          ]}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═══════════════════════════════════════════ */
const RNNTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🔄",c:TEAL,t:"RNNs process sequences by maintaining a hidden state: h_t = tanh(W_h×h_{t-1} + W_x×x_t + b). The hidden state is the 'memory' — it accumulates information from all previous tokens. The same weights W_h, W_x are reused at every time step (weight sharing across time)."},
    {e:"📝",c:AMB,t:"Applications where order matters: language modelling (next word prediction), machine translation, speech recognition, time series forecasting, music generation, code completion. Any problem where the past affects the present needs a sequential model."},
    {e:"⚠️",c:ROSE,t:"Vanishing gradient through time: backpropagation through time (BPTT) multiplies gradients at every step. With tanh activation, after 100 steps: gradient ≈ 0.9^100 ≈ 0.00003. The RNN cannot learn dependencies longer than ~10-20 steps."},
    {e:"🧬",c:VIO,t:"LSTM solution: a separate cell state C_t flows nearly unchanged through time (only gated additions), providing a gradient highway. Three gates: forget (what to erase), input (what to write), output (what to expose as h_t). Can learn dependencies over 1000+ steps."},
    {e:"⚡",c:CYN,t:"GRU (2014): simplified LSTM with 2 gates (reset and update). 25% fewer parameters, often same accuracy. Reset gate controls how much past to forget; update gate controls how much new vs old. Preferred for smaller datasets."},
    {e:"🏗️",c:GRN,t:"Bidirectional RNN: process sequence left-to-right AND right-to-left, concatenate hidden states. Useful when future context matters (e.g., 'The bank can guarantee [deposits / will remain stable]' — meaning depends on what follows). BERT uses bidirectional encoding."},
    {e:"🚀",c:IND,t:"Stacked RNNs: multi-layer RNNs (depth=2-4) learn hierarchical temporal features. Layer 1 learns short-term patterns; deeper layers learn longer-range structure. nn.LSTM(input, hidden, num_layers=2) in PyTorch stacks them automatically."},
    {e:"📉",c:ORG,t:"RNNs vs Transformers: RNNs process tokens sequentially (O(n) time, hard to parallelise). Transformers process all tokens in parallel with attention. For most NLP tasks as of 2024, Transformers outperform RNNs. But RNNs remain competitive for streaming inference and very long sequences."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",TEAL)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:TEAL}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c+"08":V.card,
              transition:"all 0.2s",marginBottom:px(10)}}>
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
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{cnt}/8 mastered</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${TEAL},${GRN})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:TEAL,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Next: Transformers →</button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const RNNsPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Recurrent Neural Networks" lessonNum="Lesson 5 of 7"
    accent={TEAL} levelLabel="Deep Learning"
    dotLabels={["Hero","Why Sequences","RNN Concept","Math","Architecture","LSTM/GRU","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#020d0a 0%,#042e28 60%,#020e0b 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🔄 Lesson 5 of 7 · Deep Learning",TEAL)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Recurrent<br/><span style={{color:"#5eead4"}}>Neural Networks</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:TEAL,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The first neural architectures with memory. RNNs process sequences one step
                at a time, maintaining a hidden state that accumulates context — allowing
                them to understand that "bank" in "I sat by the river bank" means something
                completely different from "bank" in "I deposited money at the bank."
              </p>
              <div style={{background:"rgba(13,148,136,0.12)",border:"1px solid rgba(13,148,136,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#5eead4",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE IDEA</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  At each time step t, combine the new input x_t with the previous hidden state h_{"{t-1}"}.
                  The hidden state is the network's running summary of everything it has seen.
                  Repeat for every token in the sequence.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(13,148,136,0.06)",border:"1px solid rgba(13,148,136,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 WHY SEQUENTIAL */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why Sequential Models Are Needed",TEAL)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Order <span style={{color:TEAL}}>Matters</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  "Dog bites man" and "Man bites dog" contain identical words.
                  A bag-of-words model (or a dense layer applied to raw token counts)
                  gives them the same representation — completely missing their opposite meanings.
                  Sequence models preserve and exploit order.
                </p>
                {[
                  {e:"📝",c:TEAL,t:"Text",d:"'The cat that the dog chased ran away' — requires tracking nested clauses over 10+ tokens. The subject of 'ran' is 'cat', not 'dog' — needs long-range dependency."},
                  {e:"🎵",c:AMB,t:"Music/Audio",d:"Audio is a sequence of pressure values at 44,100 Hz. Each sample depends on the preceding milliseconds. Music structure spans seconds to minutes."},
                  {e:"📈",c:VIO,t:"Time Series",d:"Stock price at t depends on prices at t-1, t-7, t-30. Weather prediction requires recalling seasonal patterns from months ago."},
                  {e:"🧬",c:GRN,t:"DNA/Protein",d:"Gene sequences encode function through combinations of nucleotides spanning thousands of positions. Distant mutations interact with local ones."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,display:"flex",gap:12,marginBottom:10,borderLeft:`4px solid ${item.c}`,padding:"12px 16px"}}>
                    <span style={{fontSize:px(26)}}>{item.e}</span>
                    <div><div style={{fontWeight:700,color:item.c,fontSize:px(14),marginBottom:2}}>{item.t}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p></div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={TEAL} title="Why standard NNs fail on sequences"
                  body="Standard dense networks have fixed input size — they can't handle variable-length sequences. They also have no mechanism to share what they learn across positions: a pattern learned at position 1 must be re-learned at position 100. And they have no temporal order awareness — feeding a sequence as a flat vector destroys position information."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:TEAL,marginBottom:10,fontSize:px(13)}}>What a sequential model needs:</div>
                  {[
                    {icon:"📏",t:"Variable-length input",d:"Process any number of tokens — 10 words or 10,000"},
                    {icon:"🔗",t:"Position awareness",d:"Token at position 3 'knows' it follows position 2"},
                    {icon:"💾",t:"Persistent memory",d:"Remember information from 100 steps ago"},
                    {icon:"🔄",t:"Parameter sharing",d:"Same weights used at every position — generalises to new lengths"},
                  ].map(item=>(
                    <div key={item.t} style={{display:"flex",gap:10,marginBottom:8}}>
                      <span style={{fontSize:px(20)}}>{item.icon}</span>
                      <div><span style={{fontWeight:700,color:TEAL,fontSize:px(13)}}>{item.t}: </span>
                      <span style={{fontSize:px(13),color:V.muted}}>{item.d}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 RNN CONCEPT */}
        <div ref={R(2)} style={{background:"#020d0a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · RNN Concept","#5eead4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>The <span style={{color:"#5eead4"}}>Recurrence Formula</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={TEAL}>h_t = tanh( W_h · h_{"{t-1}"} + W_x · x_t + b )</Formula>
                <Formula color={GRN}>ŷ_t = softmax( W_y · h_t + b_y )</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  At every time step t, the RNN computes a new hidden state h_t.
                  It takes two inputs: the current token x_t and the previous hidden state h_{"{t-1}"}.
                  Both are linearly combined and squashed through tanh — the result is
                  a compressed summary of everything seen up to time t.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  The same weight matrices W_h, W_x (and biases b) are used at every time step.
                  This is the key difference from CNNs: weight sharing across time rather
                  than across space. A 256-unit RNN has only 256×256 + 256×input_size parameters
                  regardless of sequence length.
                </p>
                <IBox color={TEAL} title="Unrolled through time"
                  body="Conceptually, you can 'unroll' an RNN into a very deep feedforward network — one layer per time step. Backpropagation Through Time (BPTT) is just standard backprop on this unrolled network, with the constraint that weights are tied (identical) across layers. This is why vanishing gradients are severe: the effective depth equals the sequence length."/>
              </div>
              <div>
                <HiddenStateDemo/>
              </div>
            </div>
          </div>
        </div>

        {/* S3 VANISHING + LSTM */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · LSTM — Solving the Vanishing Gradient",TEAL)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Long-Term <span style={{color:TEAL}}>Memory</span></h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(24)}}>
              LSTM (Long Short-Term Memory, Hochreiter & Schmidhuber 1997) adds a separate
              <strong> cell state</strong> C_t — a conveyor belt that runs straight through the sequence
              with only minor, gated modifications. Gradients flow through C_t without vanishing.
            </p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24),marginBottom:px(24)}}>
              <div>
                {[
                  {g:"Forget gate",f:"f_t = σ(W_f·[h_{t-1},x_t]+b_f)",c:ROSE,d:"Decides what to erase from the cell state. σ near 0 = forget everything; σ near 1 = keep everything. The network learns when to reset memory (e.g., end of sentence)."},
                  {g:"Input gate",f:"i_t = σ(...) · tanh(...)",c:GRN,d:"Decides what new information to write. Two-part: input gate controls what to update; candidate cell g_t provides new values. Selective writing protects important memories."},
                  {g:"Output gate",f:"o_t = σ(...), h_t = o_t·tanh(C_t)",c:AMB,d:"Decides what of the cell state to expose as the hidden state. h_t is the visible output; C_t is internal memory. Allows storing information without using it immediately."},
                ].map(item=>(
                  <div key={item.g} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:12,padding:"12px 16px",marginBottom:10}}>
                    <div style={{fontWeight:700,color:item.c,fontSize:px(13),marginBottom:4}}>{item.g}</div>
                    <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted,marginBottom:4}}>{item.f}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                  </div>
                ))}
              </div>
              <LSTMViz/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16)}}>
              <IBox color={TEAL} title="GRU: Simplified LSTM"
                body="Gated Recurrent Unit (Cho et al. 2014) merges cell state and hidden state into one. Has 2 gates instead of 3 (reset and update). Reset gate determines how much past to forget; update gate controls how much of the new candidate to blend in. 25% fewer parameters, often comparable accuracy to LSTM. Preferred when data is limited."/>
              <IBox color={ORG} title="Transformer vs LSTM (2024 perspective)"
                body="For most NLP tasks, Transformers outperform LSTMs because self-attention directly connects any two positions in O(1) steps (vs O(n) for RNNs). LSTMs remain competitive for: streaming inference (process one token, no quadratic attention cost), very long sequences (Mamba/RWKV are LSTM-inspired), and embedded systems with memory constraints."/>
            </div>
          </div>
        </div>

        {/* S4 PYTHON */}
        <div ref={R(4)} style={{background:"#020d0a"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Python with PyTorch","#5eead4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>RNNs, LSTMs, GRUs <span style={{color:"#5eead4"}}>in PyTorch</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={TEAL} lines={[
                "import torch, torch.nn as nn",
                "",
                "# ── VANILLA RNN ──────────────────────",
                "rnn = nn.RNN(",
                "  input_size=10,   # embedding dim",
                "  hidden_size=64,  # memory size",
                "  num_layers=2,    # stacked",
                "  dropout=0.2,",
                "  batch_first=True # (batch,seq,feat)",
                ")",
                "x = torch.randn(32, 20, 10)  # batch,seq,feat",
                "out, h_n = rnn(x)",
                "# out: (32,20,64) — all hidden states",
                "# h_n: (2,32,64)  — final hidden state",
                "",
                "# ── LSTM ─────────────────────────────",
                "lstm = nn.LSTM(",
                "  input_size=64, hidden_size=256,",
                "  num_layers=2, dropout=0.3,",
                "  bidirectional=True, batch_first=True",
                ")",
                "out, (h_n, c_n) = lstm(embedded)",
                "# out: (batch, seq, 512)  ← 2×256 bidirectional",
                "# h_n, c_n: (4, batch, 256)",
                "",
                "# ── GRU ──────────────────────────────",
                "gru = nn.GRU(",
                "  input_size=64, hidden_size=128,",
                "  num_layers=1, batch_first=True",
                ")",
                "out, h_n = gru(embedded)",
                "",
                "# ── FULL SEQUENCE CLASSIFIER ─────────",
                "class SentimentRNN(nn.Module):",
                "  def __init__(self,vocab_size):",
                "    super().__init__()",
                "    self.embed=nn.Embedding(vocab_size,64)",
                "    self.lstm=nn.LSTM(64,128,",
                "      num_layers=2,batch_first=True,",
                "      dropout=0.3,bidirectional=True)",
                "    self.fc=nn.Linear(256,2)  # pos/neg",
                "  def forward(self,x):",
                "    e=self.embed(x)",
                "    out,_=self.lstm(e)",
                "    # use final hidden state",
                "    return self.fc(out[:,-1,:])",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"nn.RNN / nn.LSTM / nn.GRU",c:TEAL,d:"PyTorch's built-in modules. LSTM returns (output, (h_n, c_n)); RNN/GRU return (output, h_n). output contains hidden states at every timestep; h_n is the final hidden state."},
                  {l:"batch_first=True",c:AMB,d:"Makes input shape (batch, seq, features) instead of (seq, batch, features). Always use True — it matches PyTorch Dataset/DataLoader conventions."},
                  {l:"bidirectional=True",c:VIO,d:"Runs two RNNs: one left-to-right, one right-to-left. Concatenates their outputs. Doubles hidden_size in output. Useful when future context helps (classification, NER) but impossible for generation."},
                  {l:"nn.Embedding(vocab_size, dim)",c:GRN,d:"Lookup table mapping integer token IDs to dense vectors. E.g., word 'cat' → index 1042 → 64-dim vector. Trained jointly with the RNN. Can be initialized with pretrained GloVe/Word2Vec vectors."},
                  {l:"out[:, -1, :]",c:CYN,d:"Takes the hidden state at the last time step — the summary of the entire sequence. Used for classification. Alternatively, use out.mean(dim=1) (mean pooling) which is often more robust."},
                  {l:"PackedSequence",c:IND,d:"When sequences in a batch have different lengths, use nn.utils.rnn.pack_padded_sequence() to avoid computing over padding tokens. Speeds training and improves accuracy. Use with pad_packed_sequence() after LSTM."},
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

        {/* S5 APPLICATIONS */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Real-World Applications",TEAL)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>Where RNNs <span style={{color:TEAL}}>Shaped the World</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🎙️",c:TEAL,t:"Speech Recognition",b:"Google's first neural ASR (2015) used deep bidirectional LSTMs, reducing error rate by 30%. Apple's Siri used LSTMs for acoustic modelling. Modern systems like Whisper still use RNN-inspired attention pooling for audio encoding.",arch:"Deep BiLSTM, CTC loss"},
                {e:"🌍",c:AMB,t:"Machine Translation",b:"Google Neural Machine Translation (GNMT, 2016) used 8-layer stacked LSTMs with attention — reducing translation errors by 60% over phrase-based systems. Seq2seq: encoder LSTM reads source language; decoder LSTM generates target.",arch:"LSTM Encoder-Decoder + Attention"},
                {e:"📊",c:VIO,t:"Stock/Financial Prediction",b:"JP Morgan, Renaissance Technologies use LSTM networks to model temporal patterns in financial time series. Key advantage: LSTMs can learn that events from 3 months ago may affect today's price.",arch:"LSTM + Temporal Attention"},
                {e:"🎵",c:GRN,t:"Music Generation",b:"Google Magenta (Melody RNN) generates musically coherent melodies by learning note sequences. MuseNet generates multi-instrument compositions. Training data: MIDI files of classical and jazz.",arch:"LSTM + Hierarchical RNN"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"20px 22px"}}>
                  <div style={{fontSize:px(36),marginBottom:8}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:V.muted}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:V.cream,borderRadius:8,padding:"5px 10px",fontSize:px(11),color:a.c}}>{a.arch}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S6 GAME */}
        <div ref={R(6)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Mini Game",TEAL)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Predict the Next Token</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Five sequence prediction challenges: language, numbers, code, and patterns.
              Think like an RNN — use all previous context to predict what comes next.
            </p>
            <NextWordGame/>
          </div>
        </div>

        {/* S7 PROJECT */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Mini Project",TEAL)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>📝 Character-Level <span style={{color:TEAL}}>Text Generator</span></h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              The classic demonstration of RNNs: train on a small text corpus character by character.
              After training, sample from the learned distribution autoregressively — each output
              character is fed back as the next input.
            </p>
            <TextSequenceProject/>
          </div>
        </div>

        {/* S8 INSIGHTS */}
        <div ref={R(8)} style={{background:V.cream}}>
          <RNNTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default RNNsPage;
