import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — ACTIVATION FUNCTIONS
   Level 4 · Deep Learning · Lesson 2 of 7
   Accent: Cyan #0891b2
══════════════════════════════════════════════════════════════════ */
const CYN  = "#0891b2";
const VIO  = "#7c3aed";
const GRN  = "#059669";
const AMB  = "#d97706";
const PNK  = "#ec4899";
const ROSE = "#e11d48";
const IND  = "#4f46e5";
const TEAL = "#0d9488";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula = ({children,color=CYN}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=CYN}) => (
  <div style={{fontFamily:"monospace",background:"#06080f",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS ══════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const FNS=[
      {name:"Sigmoid",fn:x=>1/(1+Math.exp(-x)),col:AMB},
      {name:"Tanh",fn:x=>Math.tanh(x),col:VIO},
      {name:"ReLU",fn:x=>Math.max(0,x),col:GRN},
      {name:"Leaky ReLU",fn:x=>x>=0?x:0.1*x,col:PNK},
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#020810"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(8,145,178,0.05)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // axes
      const cx=W/2,cy=H/2;
      ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.strokeStyle="#1e293b";ctx.lineWidth=1;ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
      const wave=Math.sin(t)*0.3;
      FNS.forEach((fn,fi)=>{
        ctx.beginPath();
        const scale=H*0.32, xscale=W/12;
        for(let px2=-6;px2<=6;px2+=0.05){
          const x=cx+px2*xscale;
          const y=cy-fn.fn(px2+wave)*scale;
          px2===-6?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.strokeStyle=fn.col; ctx.lineWidth=2.5;
        ctx.shadowColor=fn.col; ctx.shadowBlur=8; ctx.stroke(); ctx.shadowBlur=0;
        // label
        const lx=cx+5.5*xscale;
        const ly=cy-fn.fn(5.5+wave)*scale;
        ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle=fn.col+"cc";
        ctx.textAlign="left"; ctx.fillText(fn.name,lx+4,ly);
      });
      t+=0.005; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ ACTIVATION FUNCTION PLOTTER ════════════════════════════= */
const FunctionPlotter = () => {
  const canvasRef=useRef();
  const [selected,setSelected]=useState("relu");
  const [inputX,setInputX]=useState(1.5);

  const FUNCS={
    sigmoid:{
      name:"Sigmoid",fn:x=>1/(1+Math.exp(-x)),
      deriv:x=>{const s=1/(1+Math.exp(-x));return s*(1-s);},
      col:AMB,formula:"σ(x) = 1 / (1 + e⁻ˣ)",
      range:"(0, 1)",grad:"σ'(x) = σ(x)·(1−σ(x))",
      maxGrad:0.25,
      pro:"Probability output, smooth gradient",
      con:"Vanishing gradient for |x|>3, not zero-centred",
    },
    tanh:{
      name:"Tanh",fn:x=>Math.tanh(x),
      deriv:x=>1-Math.tanh(x)**2,
      col:VIO,formula:"tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)",
      range:"(-1, 1)",grad:"tanh'(x) = 1 − tanh²(x)",
      maxGrad:1.0,
      pro:"Zero-centred, stronger gradient than sigmoid",
      con:"Still vanishing gradient for large |x|",
    },
    relu:{
      name:"ReLU",fn:x=>Math.max(0,x),
      deriv:x=>x>0?1:0,
      col:GRN,formula:"ReLU(x) = max(0, x)",
      range:"[0, ∞)",grad:"ReLU'(x) = 1 if x>0, else 0",
      maxGrad:1.0,
      pro:"No vanishing gradient (x>0), sparse, fast",
      con:"Dying ReLU: neurons stuck at 0 if weights go negative",
    },
    leaky:{
      name:"Leaky ReLU",fn:x=>x>=0?x:0.01*x,
      deriv:x=>x>=0?1:0.01,
      col:TEAL,formula:"f(x) = x if x≥0, else 0.01x",
      range:"(-∞, ∞)",grad:"f'(x) = 1 if x>0, else 0.01",
      maxGrad:1.0,
      pro:"Fixes dying ReLU — small gradient for negative x",
      con:"α=0.01 is a hyperparameter; PReLU learns it",
    },
    elu:{
      name:"ELU",fn:x=>x>=0?x:(Math.exp(x)-1),
      deriv:x=>x>=0?1:Math.exp(x),
      col:SKY,formula:"ELU(x) = x if x≥0, else α(eˣ−1)",
      range:"(-α, ∞)",grad:"ELU'(x) = 1 if x>0, else ELU(x)+α",
      maxGrad:1.0,
      pro:"Smooth negative saturation, zero-centred outputs",
      con:"Slower to compute than ReLU; less commonly used",
    },
    softmax:{
      name:"Softmax",fn:x=>1/(1+Math.exp(-x)),// approximate single-input view
      deriv:x=>{const s=1/(1+Math.exp(-x));return s*(1-s);},
      col:PNK,formula:"Softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ",
      range:"(0,1), Σ=1",grad:"Jacobian matrix (not scalar)",
      maxGrad:null,
      pro:"Converts logits to probability distribution",
      con:"Numerically unstable without log-sum-exp trick",
    },
  };

  const f=FUNCS[selected];
  const outY=f.fn(inputX);
  const grad=f.deriv(inputX);

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f0fdff"; ctx.fillRect(0,0,W,H);
    // grid
    ctx.strokeStyle="#e0f7fa"; ctx.lineWidth=1;
    for(let x=0;x<W;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    const cx=W/2,cy=H/2,scale=H*0.36,xscale=W/10;
    // axes
    ctx.strokeStyle="#94a3b8"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(20,cy);ctx.lineTo(W-20,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,10);ctx.lineTo(cx,H-10);ctx.stroke();
    // labels
    ctx.font="10px monospace"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
    [-4,-2,0,2,4].forEach(v=>{ctx.fillText(v,cx+v*xscale/2,cy+14);});
    ctx.textAlign="right";
    [-1,0,1].forEach(v=>{ctx.fillText(v,cx-6,cy-v*scale+4);});
    // function curve
    ctx.beginPath();
    for(let px2=-5;px2<=5;px2+=0.03){
      const x=cx+px2*xscale/2;
      const y=cy-Math.max(-2,Math.min(2,f.fn(px2)))*scale;
      px2===-5?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=f.col; ctx.lineWidth=3;
    ctx.shadowColor=f.col; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
    // gradient line at inputX
    const px3=cx+inputX*xscale/2;
    const py3=cy-Math.max(-2,Math.min(2,f.fn(inputX)))*scale;
    const tangentLen=80;
    ctx.beginPath();
    ctx.moveTo(px3-tangentLen,py3+grad*tangentLen*scale/xscale*2);
    ctx.lineTo(px3+tangentLen,py3-grad*tangentLen*scale/xscale*2);
    ctx.strokeStyle=CYN+"99"; ctx.lineWidth=1.5; ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
    // point
    const g2=ctx.createRadialGradient(px3,py3,0,px3,py3,16);
    g2.addColorStop(0,f.col+"88"); g2.addColorStop(1,f.col+"00");
    ctx.beginPath();ctx.arc(px3,py3,16,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
    ctx.beginPath();ctx.arc(px3,py3,7,0,Math.PI*2);ctx.fillStyle=f.col;ctx.fill();
    ctx.beginPath();ctx.arc(px3,py3,7,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke();
    // dotted drop to x-axis
    ctx.beginPath();ctx.moveTo(px3,py3);ctx.lineTo(px3,cy);
    ctx.strokeStyle=f.col+"44"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
  },[selected,inputX,f]);
  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📉 Interactive Function Plotter — See every activation curve live
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {Object.entries(FUNCS).map(([k,fn])=>(
          <button key={k} onClick={()=>setSelected(k)}
            style={{background:selected===k?fn.col:fn.col+"0d",
              border:`2px solid ${selected===k?fn.col:fn.col+"33"}`,borderRadius:10,
              padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:px(11),
              color:selected===k?"#fff":fn.col,transition:"all 0.2s"}}>
            {fn.name}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
            border:`1px solid ${f.col}33`,display:"block"}}/>
          <div style={{marginTop:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>Input x</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:f.col,fontSize:px(14)}}>{inputX.toFixed(2)}</span>
            </div>
            <input type="range" min={-5} max={5} step={0.05} value={inputX}
              onChange={e=>setInputX(+e.target.value)} style={{width:"100%",accentColor:f.col}}/>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#06080f",borderRadius:12,padding:"16px",fontFamily:"monospace",fontSize:px(12),lineHeight:2}}>
            <div style={{color:"#475569"}}># {f.name}</div>
            <div style={{color:"#94a3b8"}}>{f.formula}</div>
            <div style={{color:"#475569",marginTop:4}}># At x = {inputX.toFixed(2)}:</div>
            <div>f(x) = <span style={{color:f.col,fontWeight:700}}>{outY.toFixed(5)}</span></div>
            <div>f'(x) = <span style={{color:CYN,fontWeight:700}}>{isFinite(grad)?grad.toFixed(5):"Jacobian"}</span></div>
            <div style={{color:"#475569",marginTop:4}}># Range: {f.range}</div>
          </div>
          <div style={{background:f.col+"08",border:`2px solid ${f.col}33`,borderRadius:12,padding:"14px 16px"}}>
            <div style={{fontWeight:700,color:f.col,marginBottom:8,fontSize:px(13)}}>Gradient: {f.grad}</div>
            {f.maxGrad&&(
              <div style={{marginBottom:8}}>
                <div style={{fontSize:px(11),color:V.muted,marginBottom:4}}>Max gradient magnitude</div>
                <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${f.maxGrad*100}%`,background:f.col,borderRadius:6}}/>
                </div>
                <div style={{fontFamily:"monospace",fontSize:px(11),color:f.col,marginTop:2}}>{f.maxGrad}</div>
              </div>
            )}
          </div>
          <div style={{background:GRN+"08",border:`1px solid ${GRN}33`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontWeight:700,color:GRN,fontSize:px(11),marginBottom:4}}>✅ Pros</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{f.pro}</p>
          </div>
          <div style={{background:ROSE+"08",border:`1px solid ${ROSE}33`,borderRadius:10,padding:"10px 14px"}}>
            <div style={{fontWeight:700,color:ROSE,fontSize:px(11),marginBottom:4}}>⚠️ Cons</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{f.con}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ VANISHING GRADIENT VISUALIZER ═══════════════════════════ */
const VanishingGradViz = () => {
  const [fn,setFn]=useState("sigmoid");
  const LAYERS=6;
  const gradPerLayer={
    sigmoid:0.22,// max gradient of sigmoid
    tanh:0.50,
    relu:1.0,
    leaky:1.0,
  };
  const BASE=gradPerLayer[fn]||0.22;
  const grads=Array.from({length:LAYERS},(_,i)=>Math.pow(BASE,LAYERS-i));
  const colors={sigmoid:AMB,tanh:VIO,relu:GRN,leaky:TEAL};
  const col=colors[fn]||CYN;

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📉 Vanishing Gradient — How gradient magnitude changes across layers
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        When gradients flow backward through many layers, they get multiplied together.
        If each layer's gradient is {"<"}1, the product approaches zero exponentially.
        The first layers learn almost nothing — this is the <strong>vanishing gradient problem</strong>.
      </p>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {Object.entries(gradPerLayer).map(([k,v])=>(
          <button key={k} onClick={()=>setFn(k)}
            style={{background:fn===k?colors[k]:colors[k]+"0d",
              border:`2px solid ${fn===k?colors[k]:colors[k]+"33"}`,borderRadius:8,
              padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:px(11),
              color:fn===k?"#fff":colors[k]}}>
            {k} (max grad={v})
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,alignItems:"flex-end",height:140,marginBottom:12}}>
        {grads.map((g,i)=>(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{fontFamily:"monospace",fontSize:px(9),color:g<0.01?ROSE:col}}>
              {g.toFixed(3)}
            </div>
            <div style={{width:"100%",borderRadius:6,
              background:g<0.01?ROSE:col,
              height:`${Math.max(4,g*130)}px`,
              opacity:Math.max(0.15,g),
              transition:"all 0.4s"}}>
            </div>
            <div style={{fontSize:px(9),color:V.muted}}>L{i+1}</div>
          </div>
        ))}
      </div>
      <div style={{background:grads[0]<0.01?ROSE+"0d":GRN+"0d",
        border:`1px solid ${grads[0]<0.01?ROSE:GRN}33`,borderRadius:10,padding:"10px 14px"}}>
        <p style={{...LBODY,fontSize:px(13),margin:0}}>
          {fn==="relu"||fn==="leaky"
            ? `✅ ${fn==="relu"?"ReLU":"Leaky ReLU"} maintains gradient = 1 for positive activations — no vanishing! This is why ReLU revolutionised deep learning.`
            : `⚠️ With ${fn}, the gradient at layer 1 is ${grads[0].toFixed(5)} — ${grads[0]<0.001?"effectively zero! Early layers learn nothing.":"very small. Deep networks train very slowly."}`}
        </p>
      </div>
    </div>
  );
};

/* ══════ SOFTMAX EXPLORER ════════════════════════════════════════ */
const SoftmaxExplorer = () => {
  const [logits,setLogits]=useState([2.5,1.0,-0.5,0.8,1.8]);
  const classes=["Cat 🐱","Dog 🐶","Bird 🐦","Fish 🐠","Rabbit 🐰"];
  const expVals=logits.map(v=>Math.exp(v));
  const sumExp=expVals.reduce((a,b)=>a+b,0);
  const probs=expVals.map(e=>e/sumExp);
  const predicted=probs.indexOf(Math.max(...probs));

  return (
    <div style={{...LCARD,background:"#f0fdff",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🎯 Softmax Explorer — From raw logits to probabilities
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The output layer of a classifier produces raw <strong>logits</strong> — unnormalized scores.
        Softmax converts them to probabilities that sum to 1. Adjust the logits below.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:10,letterSpacing:"1px"}}>
            RAW LOGITS (network output)
          </div>
          {logits.map((v,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:px(12),color:V.muted}}>{classes[i]}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,
                  color:i===predicted?CYN:V.muted,fontSize:px(13)}}>{v.toFixed(1)}</span>
              </div>
              <input type="range" min={-4} max={6} step={0.1} value={v}
                onChange={e=>{const l=[...logits];l[i]=+e.target.value;setLogits(l);}}
                style={{width:"100%",accentColor:i===predicted?CYN:V.border}}/>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:10,letterSpacing:"1px"}}>
            SOFTMAX PROBABILITIES
          </div>
          {probs.map((p,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:px(12),fontWeight:i===predicted?700:400,
                  color:i===predicted?CYN:V.muted}}>
                  {classes[i]} {i===predicted?"← predicted":""}
                </span>
                <span style={{fontFamily:"monospace",fontWeight:800,
                  color:i===predicted?CYN:V.muted,fontSize:px(13)}}>
                  {(p*100).toFixed(1)}%
                </span>
              </div>
              <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${p*100}%`,borderRadius:6,
                  background:i===predicted?CYN:V.border,transition:"width 0.3s"}}/>
              </div>
            </div>
          ))}
          <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted,marginTop:8}}>
            Sum: {probs.reduce((a,b)=>a+b,0).toFixed(6)} ✓
          </div>
        </div>
      </div>
      <div style={{background:"#06080f",borderRadius:10,padding:"12px",marginTop:14,
        fontFamily:"monospace",fontSize:px(12),lineHeight:1.9}}>
        <div style={{color:"#475569"}}># Softmax computation:</div>
        <div style={{color:CYN}}>exp_logits = [{expVals.map(v=>v.toFixed(2)).join(", ")}]</div>
        <div style={{color:"#94a3b8"}}>sum_exp = {sumExp.toFixed(3)}</div>
        <div style={{color:AMB,fontWeight:700}}>
          probs = [{probs.map(v=>(v*100).toFixed(1)+"%").join(", ")}]
        </div>
      </div>
    </div>
  );
};

/* ══════ CHOOSE THE ACTIVATION GAME ═════════════════════════════ */
const ChooseActivationGame = () => {
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const [total,setTotal]=useState(0);

  const SCENARIOS=[
    {
      s:"Binary classifier — output layer (predicting spam/not spam)",
      ans:"sigmoid",correct:"sigmoid",
      why:"Sigmoid outputs a value in (0,1) interpreted as the probability of being spam. Threshold at 0.5 gives binary decision.",
      wrong:{relu:"ReLU is unbounded — cannot represent a probability. You'd get outputs like 7.3 which mean nothing for classification.",tanh:"Tanh outputs (-1,1). While possible with adjustment, sigmoid is standard and directly interpretable as probability.",softmax:"Softmax is for multi-class — it needs multiple class logits. Binary classification only has one output logit.",leaky:"Leaky ReLU is for hidden layers — unbounded output has no probabilistic meaning."},
    },
    {
      s:"Multi-class image classifier — output layer (10 categories)",
      ans:"softmax",correct:"softmax",
      why:"Softmax converts 10 logits into 10 probabilities that sum to 1. The argmax gives the predicted class, and cross-entropy loss works directly with the probabilities.",
      wrong:{sigmoid:"Sigmoid on each output independently — outputs won't sum to 1, so they're not a proper probability distribution over classes.",relu:"ReLU outputs can be 0 or positive but don't sum to 1 — cannot represent class probabilities.",tanh:"Tanh outputs can be negative and don't sum to 1 — meaningless for multi-class classification.",leaky:"Same problem as ReLU — no probability constraint."},
    },
    {
      s:"Deep network hidden layers (5 layers) — avoid vanishing gradients",
      ans:"relu",correct:"relu",
      why:"ReLU has gradient = 1 for all positive inputs, completely preventing vanishing gradients. It's also computationally cheap: max(0,x) is a single comparison. Default choice for hidden layers since 2012.",
      wrong:{sigmoid:"Sigmoid gradient saturates at 0 for large |x|. In a 5-layer network, gradients multiply together — effectively reaching 0 before reaching early layers.",tanh:"Better than sigmoid but still saturates. For 5+ layers, vanishing gradients slow training significantly.",softmax:"Softmax is for output layers only — applying it to hidden layers destroys useful representations.",leaky:"Leaky ReLU is a valid alternative (fixes dying ReLU) but ReLU is simpler and usually sufficient."},
    },
    {
      s:"RNN hidden state — needs zero-centred activations for stable training",
      ans:"tanh",correct:"tanh",
      why:"Tanh is zero-centred: outputs range from -1 to 1 with mean ≈ 0. This keeps gradients balanced in RNNs, preventing the mean shift issue that sigmoid causes. LSTM and GRU gates historically use tanh.",
      wrong:{sigmoid:"Sigmoid outputs are always positive (0.25–0.75 in practice), causing non-zero-centred activations that create gradient zigzagging and slow training.",relu:"ReLU can cause exploding outputs in RNNs since it's unbounded. Recurrent connections amplify large activations across time steps.",softmax:"Softmax is for probability outputs, not hidden states.",leaky:"Valid but not standard. tanh is the traditional and empirically validated choice for RNN hidden states."},
    },
  ];

  const sc=SCENARIOS[step%SCENARIOS.length];
  const opts=["sigmoid","tanh","relu","softmax","leaky"];

  const choose=(opt)=>{
    if(chosen)return;
    setChosen(opt);
    setTotal(t=>t+1);
    if(opt===sc.correct)setScore(s=>s+1);
  };
  const next=()=>{setChosen(null);setStep(s=>s+1);};

  const colMap={sigmoid:AMB,tanh:VIO,relu:GRN,softmax:CYN,leaky:TEAL};

  return (
    <div style={{...LCARD,background:"#f0fdff",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:800,color:CYN,fontSize:px(17),marginBottom:8}}>
        🎮 Choose the Activation — Pick the right function for each scenario
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Each layer and task requires a specific activation function. Choose wisely —
        the wrong choice leads to vanishing gradients, non-converging training, or meaningless outputs.
        Score: <strong style={{color:CYN}}>{score}/{total}</strong>
      </p>
      <div style={{background:CYN+"0d",border:`2px solid ${CYN}33`,borderRadius:14,
        padding:"16px 20px",marginBottom:20}}>
        <div style={{fontWeight:700,color:CYN,fontSize:px(14),marginBottom:6}}>
          📋 Scenario {step%4+1}/4:
        </div>
        <p style={{...LBODY,fontSize:px(15),margin:0,fontWeight:600,color:V.ink}}>{sc.s}</p>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
        {opts.map(opt=>{
          const isCorrect=opt===sc.correct;
          const isChosen=opt===chosen;
          const show=!!chosen;
          let bg="transparent",border=`2px solid ${colMap[opt]}33`,col=colMap[opt];
          if(show&&isCorrect){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChosen&&!isCorrect){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          else if(isChosen){bg=colMap[opt]+"22";border=`2px solid ${colMap[opt]}`;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{flex:1,minWidth:100,background:bg,border,borderRadius:10,
                padding:"12px 8px",cursor:chosen?"not-allowed":"pointer",
                fontWeight:700,fontSize:px(12),color:col,textTransform:"uppercase",
                transition:"all 0.2s"}}>
              {isCorrect&&show?"✅ ":isChosen&&show&&!isCorrect?"❌ ":""}{opt}
            </button>
          );
        })}
      </div>
      {chosen&&(
        <div>
          <div style={{background:chosen===sc.correct?GRN+"0d":ROSE+"0d",
            border:`2px solid ${chosen===sc.correct?GRN:ROSE}`,borderRadius:12,
            padding:"16px 20px",marginBottom:12}}>
            <div style={{fontWeight:800,color:chosen===sc.correct?GRN:ROSE,fontSize:px(15),marginBottom:6}}>
              {chosen===sc.correct?"✅ Correct!":"❌ "+chosen+" is wrong here"}
            </div>
            <p style={{...LBODY,fontSize:px(13),margin:0,color:V.ink}}>
              {chosen===sc.correct?sc.why:sc.wrong[chosen]}
            </p>
            {chosen!==sc.correct&&(
              <p style={{...LBODY,fontSize:px(13),marginTop:8,marginBottom:0,color:GRN,fontWeight:600}}>
                ✅ Correct answer: {sc.correct} — {sc.why}
              </p>
            )}
          </div>
          <button onClick={next}
            style={{background:CYN,border:"none",borderRadius:10,padding:"10px 24px",
              color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
            {step%4<3?"Next Scenario →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ KEY INSIGHTS ════════════════════════════════════════════ */
const AFTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🔑",c:CYN,t:"Without activation functions, stacking layers collapses to a single linear transformation. Non-linearity is what makes neural networks capable of approximating any function."},
    {e:"📈",c:AMB,t:"Sigmoid: outputs (0,1), perfect for binary classification output layers. Max gradient = 0.25 — vanishes in deep networks. Use only in output layers, never in hidden layers of deep nets."},
    {e:"⚡",c:VIO,t:"Tanh: outputs (-1,1), zero-centred. 4× larger max gradient than sigmoid. Preferred over sigmoid for hidden layers in RNNs. Still saturates — dying gradient for |x|>2."},
    {e:"🚀",c:GRN,t:"ReLU: max(0,x). Gradient = 1 for x>0 — completely solves vanishing gradient. Sparse activation (50% neurons at zero). Default for hidden layers since AlexNet (2012). Watch for dying ReLU neurons."},
    {e:"🌊",c:TEAL,t:"Leaky ReLU / ELU: fixes dying ReLU by allowing small negative gradient. ELU is smooth, differentiable at 0. SELU is self-normalising. PReLU learns the slope. Use when standard ReLU causes dead neurons."},
    {e:"🎯",c:PNK,t:"Softmax: converts K logits to K probabilities summing to 1. Only for multi-class output layers. Use log-softmax + NLLLoss or CrossEntropyLoss (numerically stable). Never use in hidden layers."},
    {e:"⚠️",c:ROSE,t:"Vanishing gradient: sigmoid/tanh gradients shrink exponentially with depth. Each sigmoid layer multiplies gradient by ≤0.25. A 10-layer sigmoid network passes gradients 0.25^10 ≈ 0.0000001× to the first layer."},
    {e:"🔧",c:IND,t:"Modern defaults: ReLU for hidden layers, Softmax for multi-class output, Sigmoid for binary output, GELU/Swish in Transformers (smooth, non-monotonic, empirically better for attention). Always check gradient flow."},
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
              display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:px(13)}}>
              {done[i]?"✓":""}
            </div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(56),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{cnt}/8 mastered</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${CYN},${VIO})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:CYN,border:"none",borderRadius:10,
            padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Backpropagation →
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
const ActivationFunctionsPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Activation Functions" lessonNum="Lesson 2 of 7"
    accent={CYN} levelLabel="Deep Learning"
    dotLabels={["Hero","Why Activations","Sigmoid","Tanh","ReLU","Softmax","Python","Visualization","Game","Applications","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#020810 0%,#061825 60%,#030c14 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("⚡ Lesson 2 of 7 · Deep Learning",CYN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Activation<br/><span style={{color:"#67e8f9"}}>Functions</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:CYN,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The secret ingredient that makes neural networks powerful.
                Without them, no matter how many layers you stack, the network
                can only fit a straight line. Activation functions introduce
                non-linearity — letting networks model curves, spirals, faces,
                and language. Choosing the right one is the difference between
                a network that trains beautifully and one that never learns.
              </p>
              <div style={{background:"rgba(8,145,178,0.12)",border:"1px solid rgba(8,145,178,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#67e8f9",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  After each linear transformation z = Wx + b, apply a non-linear
                  function a = f(z). This single operation, repeated across millions
                  of neurons, enables the network to approximate any function.
                  The choice of f determines whether gradients survive backward pass.
                </p>
              </div>
            </div>
            <div style={{height:px(420),background:"rgba(8,145,178,0.06)",
              border:"1px solid rgba(8,145,178,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — WHY ─────────────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why Activation Functions Exist",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The <span style={{color:CYN}}>Non-Linearity Problem</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Imagine stacking two linear operations. Layer 1 computes y = W₁x + b₁.
                  Layer 2 computes z = W₂y + b₂ = W₂(W₁x + b₁) + b₂ = (W₂W₁)x + (W₂b₁ + b₂).
                  This is just another linear operation — all the layers collapsed into one.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  You could have 1000 linear layers and it would be mathematically equivalent to
                  one linear layer. The network cannot model any non-linear relationship —
                  it can only fit straight hyperplanes through data.
                </p>
                <div style={{background:"#0891b20d",border:`2px solid ${CYN}22`,borderRadius:14,padding:"16px 20px",marginBottom:16}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:10,fontSize:px(13)}}>🔬 The Proof</div>
                  <div style={{fontFamily:"monospace",fontSize:px(12),lineHeight:2,color:V.muted}}>
                    <div>Layer 1: z₁ = W₁x + b₁</div>
                    <div>Layer 2: z₂ = W₂z₁ + b₂</div>
                    <div>       = W₂(W₁x + b₁) + b₂</div>
                    <div style={{color:CYN,fontWeight:700}}>       = (W₂W₁)x + (W₂b₁+b₂)</div>
                    <div style={{color:ROSE}}>       = W'x + b'  ← just ONE layer!</div>
                  </div>
                </div>
                <p style={{...LBODY,fontSize:px(14)}}>
                  Adding a non-linear activation after each layer breaks this collapse.
                  The Universal Approximation Theorem proves that a network with even
                  one non-linear hidden layer can approximate any continuous function
                  to arbitrary precision — given enough neurons.
                </p>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:14}}>
                  <div style={{fontWeight:700,color:V.ink,marginBottom:10,fontSize:px(14)}}>
                    📊 Linear vs Non-linear capability
                  </div>
                  {[
                    {task:"Classify points on a line",lin:"✅",nonlin:"✅"},
                    {task:"Separate two circles (XOR-like)",lin:"❌",nonlin:"✅"},
                    {task:"Recognise handwritten digits",lin:"❌",nonlin:"✅"},
                    {task:"Detect objects in images",lin:"❌",nonlin:"✅"},
                    {task:"Generate human language",lin:"❌",nonlin:"✅"},
                    {task:"Predict stock trends (linear)",lin:"✅",nonlin:"✅"},
                  ].map(row=>(
                    <div key={row.task} style={{display:"grid",gridTemplateColumns:"2fr 0.5fr 0.5fr",
                      gap:6,marginBottom:6,padding:"5px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(12),color:V.ink}}>{row.task}</span>
                      <span style={{textAlign:"center",fontSize:px(13)}}>{row.lin}</span>
                      <span style={{textAlign:"center",fontSize:px(13)}}>{row.nonlin}</span>
                    </div>
                  ))}
                </div>
                <IBox color={CYN} title="XOR — the definitive test"
                  body="XOR cannot be solved by any linear model. Points (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0 require a curved decision boundary. A 2-layer network with just 2 hidden ReLU neurons can learn XOR perfectly. This single example demonstrates why non-linearity is non-negotiable for general intelligence."/>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — SIGMOID ─────────────────────────────────────── */}
        <div ref={R(2)} style={{background:"#020810"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Sigmoid","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              The Original <span style={{color:"#67e8f9"}}>Probability Gate</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={AMB}>σ(x) = 1 / (1 + e⁻ˣ)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Sigmoid was the dominant activation function from 1986 to ~2012.
                  It squashes any real number into the range (0, 1) — making it
                  naturally interpretable as a probability. The S-shaped curve is
                  smooth and differentiable everywhere.
                </p>
                {[
                  {x:"x → −∞",out:"σ → 0.000",note:"Fully OFF"},
                  {x:"x = −3",out:"σ = 0.047",note:"Nearly off"},
                  {x:"x = 0",out:"σ = 0.500",note:"Inflection point"},
                  {x:"x = 3",out:"σ = 0.953",note:"Nearly on"},
                  {x:"x → +∞",out:"σ → 1.000",note:"Fully ON"},
                ].map(row=>(
                  <div key={row.x} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
                    gap:4,marginBottom:6,padding:"6px 10px",background:"#0d1117",borderRadius:8,
                    fontFamily:"monospace",fontSize:px(12)}}>
                    <span style={{color:AMB}}>{row.x}</span>
                    <span style={{color:"#94a3b8"}}>{row.out}</span>
                    <span style={{color:"#475569"}}>{row.note}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{background:"#0d1a1f",border:`1px solid ${AMB}33`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:AMB,marginBottom:10,fontSize:px(13)}}>🔢 Derivative</div>
                  <Formula color={AMB}>σ'(x) = σ(x) · (1 − σ(x))</Formula>
                  <p style={{...LBODY,color:"#64748b",fontSize:px(13),margin:0}}>
                    Maximum gradient is 0.25 at x=0. For |x|{">"}3, gradient {`<`} 0.005.
                    This is the <strong style={{color:ROSE}}>vanishing gradient problem</strong>:
                    in a 6-layer sigmoid network, the gradient reaching layer 1 is
                    at most 0.25⁶ ≈ 0.0002.
                  </p>
                </div>
                {[
                  {t:"✅ Use sigmoid",items:["Binary classification output layer","Logistic regression","LSTM/GRU gates (with careful initialization)","When you need probability interpretation"]},
                  {t:"❌ Don't use sigmoid",items:["Hidden layers of deep networks (vanishing gradient)","Multi-class classification (use softmax)","Regression tasks (output is not bounded)","Any network deeper than 3-4 layers"]},
                ].map(section=>(
                  <div key={section.t} style={{...LCARD,marginBottom:10,padding:"14px"}}>
                    <div style={{fontWeight:700,fontSize:px(12),marginBottom:8,
                      color:section.t.startsWith("✅")?GRN:ROSE}}>{section.t}</div>
                    {section.items.map(i=>(
                      <div key={i} style={{display:"flex",gap:6,marginBottom:4,alignItems:"flex-start"}}>
                        <span style={{color:section.t.startsWith("✅")?GRN:ROSE,flexShrink:0}}>
                          {section.t.startsWith("✅")?"✓":"✗"}
                        </span>
                        <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{i}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S3 — TANH ────────────────────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Tanh",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Zero-Centred <span style={{color:VIO}}>Smoothness</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={VIO}>tanh(x) = (eˣ − e⁻ˣ) / (eˣ + e⁻ˣ)</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Tanh is essentially a scaled and shifted sigmoid:
                  tanh(x) = 2σ(2x) − 1. It outputs values in (−1, +1) and is
                  <strong> zero-centred</strong> — the mean output across neurons
                  is approximately zero for symmetric weight distributions.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Zero-centred activations are important for gradient descent efficiency.
                  If all activations are positive (like sigmoid), gradients in the
                  previous layer are all the same sign — causing zig-zagging in
                  gradient descent and slower convergence.
                </p>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`,padding:"14px"}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(13)}}>
                    Tanh vs Sigmoid at a glance:
                  </div>
                  {[
                    ["Output range","(0, 1)","(−1, 1)"],
                    ["Zero-centred","❌ No","✅ Yes"],
                    ["Max gradient","0.25","1.0"],
                    ["Vanishing gradient","⚠️ Severe","⚠️ Less severe"],
                    ["Computation","e⁻ˣ only","eˣ and e⁻ˣ"],
                  ].map(([p,s,t],i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
                      gap:6,marginBottom:5,padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(11),color:V.muted}}>{p}</span>
                      <span style={{fontSize:px(11),textAlign:"center",color:AMB}}>{s}</span>
                      <span style={{fontSize:px(11),textAlign:"center",color:VIO,fontWeight:700}}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <IBox color={VIO} title="Why tanh trains faster than sigmoid"
                  body="Gradient descent converges in the direction of steepest descent. If activations are always positive (sigmoid: 0 to 1), the weight gradients ∂L/∂W in a layer are all positive or all negative simultaneously — constrained to a quadrant. This forces the optimizer to zig-zag toward the minimum instead of going straight. Tanh outputs can be negative or positive, allowing unrestricted gradient directions."/>
                <div style={{...LCARD,marginTop:14,padding:"14px"}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:10,fontSize:px(13)}}>Where tanh is used</div>
                  {[
                    {c:VIO,t:"LSTM cell state",d:"Long Short-Term Memory units use tanh for the cell state and output gate — modelling values in (-1,1) range balances memory updates"},
                    {c:CYN,t:"GRU hidden state",d:"Gated Recurrent Units use tanh for the candidate hidden state — prevents unbounded growth of recurrent values"},
                    {c:AMB,t:"Normalising outputs",d:"When you need outputs centered around zero, tanh naturally achieves this without adding a batch normalization layer"},
                  ].map(item=>(
                    <div key={item.t} style={{borderLeft:`3px solid ${item.c}`,paddingLeft:12,marginBottom:10}}>
                      <div style={{fontWeight:700,color:item.c,fontSize:px(12),marginBottom:3}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S4 — RELU ────────────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#020810"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · ReLU — The Revolution","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              The Activation That Changed <span style={{color:"#67e8f9"}}>Deep Learning</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={GRN}>ReLU(x) = max(0, x)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Rectified Linear Unit looks deceptively simple. For positive inputs,
                  it passes them through unchanged. For negative inputs, it outputs zero.
                  That's it. Yet this simple function solved the training problems that
                  had stalled deep learning for 15 years.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  The 2012 ImageNet breakthrough (AlexNet) used ReLU throughout its 5
                  convolutional layers. Training was 6× faster than equivalent tanh networks.
                  Within two years, ReLU became the universal default for hidden layers.
                </p>
                <VanishingGradViz/>
              </div>
              <div>
                <div style={{background:"#0d1a0d",border:`1px solid ${GRN}33`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:GRN,marginBottom:10,fontSize:px(13)}}>Why ReLU works</div>
                  {[
                    {icon:"🚫",t:"No vanishing gradient",d:"For x>0, gradient = 1 exactly. No matter how many layers, the gradient from a ReLU neuron isn't shrunk."},
                    {icon:"⚡",t:"Computationally free",d:"max(0,x) is a single comparison — no exponentials. 10× faster than sigmoid/tanh per neuron."},
                    {icon:"🎯",t:"Sparse representations",d:"~50% of neurons output exactly 0. Sparse activations are efficient and often improve generalisation."},
                    {icon:"🔓",t:"Unbounded output",d:"Unlike sigmoid/tanh, ReLU doesn't saturate for large positive inputs — gradients always flow cleanly."},
                  ].map(item=>(
                    <div key={item.t} style={{display:"flex",gap:10,marginBottom:8}}>
                      <span style={{fontSize:px(20)}}>{item.icon}</span>
                      <div>
                        <span style={{fontWeight:700,color:GRN,fontSize:px(13)}}>{item.t}: </span>
                        <span style={{fontSize:px(12),color:"#64748b"}}>{item.d}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{background:"#1a0d0d",border:`1px solid ${ROSE}33`,borderRadius:14,padding:"16px"}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:10,fontSize:px(13)}}>⚠️ Dying ReLU Problem</div>
                  <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:10}}>
                    If a neuron's input consistently goes negative (e.g., due to a large negative
                    weight update), its output is always 0. Gradient is 0. The weight never updates.
                    The neuron is permanently "dead" — contributing nothing to the network.
                  </p>
                  <div style={{fontFamily:"monospace",background:"#0d0404",borderRadius:8,padding:"10px",fontSize:px(12),color:ROSE}}>
                    x = -5.0 → ReLU = 0 → grad = 0 → ΔW = 0{"\n"}
                    x = -3.0 → ReLU = 0 → grad = 0 → ΔW = 0{"\n"}
                    ... neuron permanently dead
                  </div>
                  <p style={{...LBODY,color:"#64748b",fontSize:px(12),marginTop:10,marginBottom:0}}>
                    Fix: Use Leaky ReLU (small negative slope 0.01), ELU, or careful initialisation.
                    Batch normalisation also prevents inputs from staying negative.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — SOFTMAX ─────────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Softmax",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Multi-class <span style={{color:CYN}}>Probability Distribution</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(24)}}>
              Softmax is not used in hidden layers — it belongs exclusively in the output layer
              of multi-class classifiers. It transforms K arbitrary real numbers (logits) into
              K probabilities that sum to exactly 1.
            </p>
            <Formula color={CYN}>Softmax(xᵢ) = eˣⁱ / Σⱼ eˣʲ</Formula>
            <SoftmaxExplorer/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),marginTop:px(20)}}>
              <IBox color={CYN} title="Why exponentiation?"
                body="exp() achieves two goals: (1) makes all values positive (no negative probabilities), (2) amplifies differences — the highest logit gets disproportionately high probability (winner-takes-more). This makes decision boundaries sharp. Temperature τ scales logits: Softmax(x/τ). τ→0 gives argmax (hard decision); τ→∞ gives uniform distribution."/>
              <IBox color={ROSE} title="Numerical stability trick"
                body="Computing exp(large number) overflows to infinity. Solution: subtract the maximum logit first. Softmax(x) = Softmax(x − max(x)) — mathematically equivalent but numerically stable. PyTorch's F.softmax() and TensorFlow's tf.nn.softmax() apply this automatically. In practice, use log_softmax + NLLLoss or CrossEntropyLoss which combine both operations."/>
            </div>
          </div>
        </div>

        {/* ── S6 — PYTHON ──────────────────────────────────────── */}
        <div ref={R(6)} style={{background:"#020810"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python with PyTorch","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              All Functions in <span style={{color:"#67e8f9"}}>PyTorch</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={CYN} lines={[
                "import torch",
                "import torch.nn as nn",
                "import torch.nn.functional as F",
                "",
                "x = torch.tensor([-3., -1., 0., 1., 3.])",
                "",
                "# ── SIGMOID ────────────────────────────",
                "print(torch.sigmoid(x))",
                "# tensor([0.0474, 0.2689, 0.5000, 0.7311, 0.9526])",
                "",
                "# ── TANH ───────────────────────────────",
                "print(torch.tanh(x))",
                "# tensor([-0.9951, -0.7616, 0., 0.7616, 0.9951])",
                "",
                "# ── RELU ───────────────────────────────",
                "print(F.relu(x))",
                "# tensor([0., 0., 0., 1., 3.])",
                "",
                "# ── LEAKY RELU ─────────────────────────",
                "print(F.leaky_relu(x, negative_slope=0.01))",
                "# tensor([-0.0300, -0.0100, 0., 1., 3.])",
                "",
                "# ── ELU ────────────────────────────────",
                "print(F.elu(x))",
                "# tensor([-0.9502, -0.6321, 0., 1., 3.])",
                "",
                "# ── SOFTMAX (needs 2D input) ────────────",
                "logits = torch.tensor([[2.5, 1.0, 0.3]])",
                "print(F.softmax(logits, dim=1))",
                "# tensor([[0.7054, 0.1552, 0.1394]])",
                "",
                "# ── GELU (used in Transformers) ─────────",
                "print(F.gelu(x))",
                "# tensor([-0.0036, -0.1587, 0., 0.8413, 3.])",
                "",
                "# ── In a model ──────────────────────────",
                "model = nn.Sequential(",
                "    nn.Linear(784, 256),",
                "    nn.ReLU(),",
                "    nn.Dropout(0.3),",
                "    nn.Linear(256, 128),",
                "    nn.ReLU(),",
                "    nn.Linear(128, 10),",
                "    # No softmax — CrossEntropyLoss applies it!",
                ")",
                "# CrossEntropyLoss = log_softmax + NLLLoss",
                "criterion = nn.CrossEntropyLoss()",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"torch.sigmoid / F.sigmoid",c:AMB,d:"Applies σ(x) element-wise. For binary output layer. Deprecated in some versions — use torch.sigmoid() or nn.Sigmoid() in model."},
                  {l:"torch.tanh",c:VIO,d:"Applies tanh element-wise. Use nn.Tanh() in Sequential models. Default for LSTM/GRU internal gates in torch.nn.LSTM."},
                  {l:"F.relu(x)",c:GRN,d:"Most common. Use nn.ReLU() in Sequential. F.relu(x, inplace=True) saves memory by modifying tensor in-place — useful when memory is tight."},
                  {l:"F.softmax(x, dim=1)",c:CYN,d:"dim=1 means softmax across the class dimension. NEVER use before CrossEntropyLoss — it double-applies the log and causes NaN gradients."},
                  {l:"F.gelu(x)",c:IND,d:"Gaussian Error Linear Unit. Used in BERT, GPT-2/3/4, ViT. Smooth approximation: x·Φ(x). Empirically outperforms ReLU in Transformers."},
                  {l:"nn.CrossEntropyLoss()",c:ROSE,d:"= nn.LogSoftmax() + nn.NLLLoss(). Numerically stable combined operation. Expects raw logits, not softmax outputs. Most common for classification."},
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

        {/* ── S7 — VISUALIZATION ───────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Visualization",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              See Every <span style={{color:CYN}}>Function</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(24)}}>
              Select any activation function. Drag the input slider to move along the curve.
              The dashed tangent line shows the gradient at that point — this is what
              backpropagation uses to update weights.
            </p>
            <FunctionPlotter/>
          </div>
        </div>

        {/* ── S8 — GAME ────────────────────────────────────────── */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Interactive Game",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Choose the Activation</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Four real-world scenarios. Each requires a specific activation function to work
              correctly. Wrong choices lead to vanishing gradients, non-converging training,
              or meaningless outputs. Do you know which function fits each case?
            </p>
            <ChooseActivationGame/>
          </div>
        </div>

        {/* ── S9 — APPLICATIONS ────────────────────────────────── */}
        <div ref={R(9)} style={{background:"#020810"}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Real Applications","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Activation Functions <span style={{color:"#67e8f9"}}>in the Wild</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🔐",c:AMB,fn:"Sigmoid",t:"Binary Classification",
                  d:"Logistic regression, spam detection, click-through rate prediction. Every binary output neuron uses sigmoid. Facebook's ad system processes billions of sigmoid activations daily."},
                {e:"🖼️",c:GRN,fn:"ReLU",t:"Image Classification",
                  d:"AlexNet (2012), VGG, ResNet, EfficientNet — all use ReLU in convolutional layers. ResNet-50 applies ReLU ~50 times per forward pass. Modern CNNs would be untrainable without it."},
                {e:"💬",c:IND,fn:"GELU / Softmax",t:"Language Modeling",
                  d:"GPT-4, BERT, LLaMA use GELU in feed-forward layers. Softmax in attention mechanism computes attention weights. Final softmax over vocabulary (50,000+ tokens) produces word probabilities."},
                {e:"🔄",c:VIO,fn:"Tanh / Sigmoid",t:"Recurrent Networks",
                  d:"LSTM: input/forget/output gates use sigmoid; cell state uses tanh. GRU: update/reset gates use sigmoid; candidate hidden state uses tanh. This combination enables gradient flow over 1000+ time steps."},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"20px 22px"}}>
                  <div style={{fontSize:px(32),marginBottom:8}}>{a.e}</div>
                  <div style={{fontFamily:"monospace",background:a.c+"22",borderRadius:8,
                    padding:"4px 10px",display:"inline-block",fontSize:px(11),color:a.c,marginBottom:8}}>{a.fn}</div>
                  <div style={{fontWeight:800,color:"#e2e8f0",fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#64748b"}}>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S10 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <AFTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default ActivationFunctionsPage;
