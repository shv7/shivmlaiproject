import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — NEURAL NETWORKS
   Level 4 · Deep Learning · Lesson 1 of 7
   Accent: Violet #7c3aed
══════════════════════════════════════════════════════════════════ */
const VIO  = "#7c3aed";
const CYN  = "#0891b2";
const GRN  = "#059669";
const AMB  = "#d97706";
const PNK  = "#ec4899";
const ROSE = "#e11d48";
const IND  = "#4f46e5";
const TEAL = "#0d9488";
const SKY  = "#0284c7";
const ORG  = "#ea580c";

const Formula = ({children,color=VIO}) => (
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

/* ══════ HERO CANVAS — animated neural network ═════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const LAYERS=[
      {nodes:3,x:0.12,col:AMB,label:"Input"},
      {nodes:5,x:0.35,col:VIO,label:"Hidden 1"},
      {nodes:4,x:0.58,col:IND,label:"Hidden 2"},
      {nodes:2,x:0.80,col:GRN,label:"Output"},
    ];
    const getY=(layer,i)=>{
      const n=layer.nodes;
      const spacing=H/(n+1);
      return spacing*(i+1);
    };
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#07040f"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(124,58,237,0.05)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // connections
      LAYERS.forEach((layer,li)=>{
        if(li===LAYERS.length-1)return;
        const next=LAYERS[li+1];
        for(let i=0;i<layer.nodes;i++){
          for(let j=0;j<next.nodes;j++){
            const x1=layer.x*W, y1=getY(layer,i);
            const x2=next.x*W, y2=getY(next,j);
            const pulse=(Math.sin(t*2+i*0.7+j*0.5+li*1.2)+1)/2;
            ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
            ctx.strokeStyle=`rgba(124,58,237,${0.08+pulse*0.15})`;
            ctx.lineWidth=0.8+pulse*0.8; ctx.stroke();
          }
        }
      });
      // signal pulses
      LAYERS.forEach((layer,li)=>{
        if(li===LAYERS.length-1)return;
        const next=LAYERS[li+1];
        const p=(t*0.6+li*0.3)%1;
        for(let i=0;i<Math.min(2,layer.nodes);i++){
          const x1=layer.x*W, y1=getY(layer,i);
          const x2=next.x*W, y2=getY(next,i%next.nodes);
          const px2=x1+(x2-x1)*p, py2=y1+(y2-y1)*p;
          const g=ctx.createRadialGradient(px2,py2,0,px2,py2,8);
          g.addColorStop(0,VIO+"ff"); g.addColorStop(1,VIO+"00");
          ctx.beginPath();ctx.arc(px2,py2,8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        }
      });
      // nodes
      LAYERS.forEach((layer,li)=>{
        const cx=layer.x*W;
        for(let i=0;i<layer.nodes;i++){
          const cy=getY(layer,i);
          const pulse=(Math.sin(t*1.5+i*0.8+li*0.6)+1)/2;
          const r=10+pulse*4;
          const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*2);
          g.addColorStop(0,layer.col+"88"); g.addColorStop(1,layer.col+"00");
          ctx.beginPath();ctx.arc(cx,cy,r*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
          ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
          ctx.fillStyle="#1a1040"; ctx.fill();
          ctx.strokeStyle=layer.col; ctx.lineWidth=2;
          ctx.shadowColor=layer.col; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
        }
        ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle=layer.col+"aa";
        ctx.textAlign="center"; ctx.fillText(layer.label,cx,H-10);
      });
      t+=0.008; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ NEURON DIAGRAM — interactive ══════════════════════════ */
const NeuronDiagram = () => {
  const [w1,setW1]=useState(0.6);
  const [w2,setW2]=useState(0.8);
  const [w3,setW3]=useState(-0.3);
  const [b,setB]=useState(0.1);
  const [act,setAct]=useState("relu");
  const x1=1.0, x2=0.5, x3=0.8;
  const z=w1*x1+w2*x2+w3*x3+b;
  const relu=v=>Math.max(0,v);
  const sigmoid=v=>1/(1+Math.exp(-v));
  const tanh=v=>Math.tanh(v);
  const output=act==="relu"?relu(z):act==="sigmoid"?sigmoid(z):tanh(z);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(15)}}>
        🧠 Interactive Artificial Neuron — Adjust weights to see output change
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        This is a single artificial neuron. Three inputs arrive, each multiplied by
        a learnable weight, summed with a bias, then passed through an activation function.
        This is the fundamental operation of every neural network.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          {[
            {l:`x₁ = ${x1} × w₁`,v:w1,s:setW1,id:"w1",c:AMB},
            {l:`x₂ = ${x2} × w₂`,v:w2,s:setW2,id:"w2",c:CYN},
            {l:`x₃ = ${x3} × w₃`,v:w3,s:setW3,id:"w3",c:PNK},
          ].map(item=>(
            <div key={item.id} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:px(12),color:V.muted,fontFamily:"monospace"}}>{item.l}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(13)}}>
                  w={item.v.toFixed(2)} → {(item.v*(item.id==="w1"?x1:item.id==="w2"?x2:x3)).toFixed(3)}
                </span>
              </div>
              <input type="range" min={-2} max={2} step={0.05} value={item.v}
                onChange={e=>item.s(+e.target.value)} style={{width:"100%",accentColor:item.c}}/>
            </div>
          ))}
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted,fontFamily:"monospace"}}>Bias b</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:GRN,fontSize:px(13)}}>{b.toFixed(2)}</span>
            </div>
            <input type="range" min={-2} max={2} step={0.05} value={b}
              onChange={e=>setB(+e.target.value)} style={{width:"100%",accentColor:GRN}}/>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:px(12),color:V.muted,marginBottom:6}}>Activation function</div>
            <div style={{display:"flex",gap:8}}>
              {["relu","sigmoid","tanh"].map(fn=>(
                <button key={fn} onClick={()=>setAct(fn)}
                  style={{flex:1,background:act===fn?VIO+"22":"transparent",
                    border:`2px solid ${act===fn?VIO:V.border}`,borderRadius:8,
                    padding:"7px",cursor:"pointer",fontWeight:700,
                    fontSize:px(11),color:act===fn?VIO:V.muted,textTransform:"uppercase"}}>
                  {fn}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#0d0a2a",borderRadius:12,padding:"16px",fontFamily:"monospace",fontSize:px(12),lineHeight:2}}>
            <div style={{color:"#475569"}}># Forward pass:</div>
            <div style={{color:"#94a3b8"}}>z = w₁x₁ + w₂x₂ + w₃x₃ + b</div>
            <div style={{color:"#94a3b8"}}>z = {(w1*x1).toFixed(3)} + {(w2*x2).toFixed(3)} + {(w3*x3).toFixed(3)} + {b.toFixed(3)}</div>
            <div style={{color:AMB,fontWeight:700}}>z = {z.toFixed(4)}</div>
            <div style={{color:"#475569",marginTop:6}}># Activation: {act}(z)</div>
            <div style={{color:VIO,fontWeight:900,fontSize:px(16)}}>output = {output.toFixed(4)}</div>
          </div>
          <div style={{background:VIO+"0d",border:`2px solid ${VIO}`,borderRadius:12,padding:"16px",textAlign:"center"}}>
            <div style={{fontSize:px(12),color:V.muted,marginBottom:4}}>Neuron Output</div>
            <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(32),color:VIO}}>
              {output.toFixed(4)}
            </div>
            <div style={{background:V.cream,borderRadius:6,height:10,overflow:"hidden",marginTop:10}}>
              <div style={{height:"100%",
                width:`${Math.min(100,Math.abs(output)*50+50*(act==="relu"?1:0))}%`,
                background:`linear-gradient(90deg,${VIO},${IND})`,borderRadius:6,transition:"width 0.3s"}}/>
            </div>
          </div>
          <IBox color={VIO} title="What just happened?"
            body="You performed one forward pass through a single neuron. The weighted sum z is the linear combination of inputs — without activation it can only represent lines. The activation function f(z) introduces non-linearity, allowing the neuron to represent curves, boundaries, and complex patterns."/>
        </div>
      </div>
    </div>
  );
};

/* ══════ BUILD THE NETWORK GAME ════════════════════════════════ */
const BuildNetworkGame = () => {
  const [layers,setLayers]=useState([3,4,1]);
  const [trained,setTrained]=useState(false);
  const [score,setScore]=useState(null);
  const canvasRef=useRef();

  const addLayer=()=>{
    if(layers.length>=6) return;
    setLayers(l=>[...l.slice(0,-1),4,...l.slice(-1)]);
    setTrained(false);setScore(null);
  };
  const removeLayer=()=>{
    if(layers.length<=2) return;
    setLayers(l=>[l[0],...l.slice(2)]);
    setTrained(false);setScore(null);
  };
  const addNeuron=(li)=>{
    if(layers[li]>=8)return;
    setLayers(l=>l.map((n,i)=>i===li?n+1:n));
    setTrained(false);setScore(null);
  };
  const removeNeuron=(li)=>{
    if(layers[li]<=1)return;
    setLayers(l=>l.map((n,i)=>i===li?n-1:n));
    setTrained(false);setScore(null);
  };

  const totalParams=layers.reduce((s,n,i)=>{
    if(i===0)return s;
    return s+n*layers[i-1]+n;
  },0);
  const capacity=Math.min(98,Math.round(50+layers.length*8+totalParams*0.15));

  const train=()=>{
    setTrained(true);
    // simulate accuracy based on architecture
    const depth=layers.length;
    const width=Math.max(...layers.slice(1,-1));
    let acc=60+depth*5+width*2-Math.abs(totalParams-50)*0.3;
    acc=Math.min(97,Math.max(55,acc));
    setScore(Math.round(acc));
  };

  const redraw=useCallback(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f5f3ff"; ctx.fillRect(0,0,W,H);
    const COLS=[AMB,VIO,IND,CYN,GRN,PNK];
    const getY=(li,i)=>H/(layers[li]+1)*(i+1);
    const getX=(li)=>(W-40)/(layers.length-1)*li+20;
    // connections
    layers.forEach((_,li)=>{
      if(li===layers.length-1)return;
      for(let i=0;i<layers[li];i++){
        for(let j=0;j<layers[li+1];j++){
          ctx.beginPath();ctx.moveTo(getX(li),getY(li,i));ctx.lineTo(getX(li+1),getY(li+1,j));
          ctx.strokeStyle=VIO+"20"; ctx.lineWidth=1; ctx.stroke();
        }
      }
    });
    // nodes
    layers.forEach((n,li)=>{
      const col=COLS[li%COLS.length];
      for(let i=0;i<n;i++){
        const cx=getX(li),cy=getY(li,i);
        ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);
        ctx.fillStyle="#fff"; ctx.fill();
        ctx.strokeStyle=col; ctx.lineWidth=2.5;
        ctx.shadowColor=col; ctx.shadowBlur=8; ctx.stroke(); ctx.shadowBlur=0;
        ctx.font="bold 9px sans-serif"; ctx.fillStyle=col; ctx.textAlign="center";
        ctx.fillText(i+1,cx,cy+3);
      }
      ctx.font="bold 10px sans-serif"; ctx.fillStyle=col+"aa"; ctx.textAlign="center";
      const label=li===0?"Input":li===layers.length-1?"Output":`H${li}`;
      ctx.fillText(label,getX(li),H-4);
    });
  },[layers]);
  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD,background:"#fdf9ff",border:`2px solid ${VIO}22`}}>
      <div style={{fontWeight:800,color:VIO,fontSize:px(17),marginBottom:8}}>
        🎮 Build the Neural Network — Design Your Own Architecture
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Add hidden layers and neurons. Watch the network diagram update live.
        Then train to see how your architecture performs on a digit recognition task.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:240,borderRadius:12,
            border:`1px solid ${VIO}22`,display:"block",marginBottom:12}}/>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <button onClick={addLayer} disabled={layers.length>=6}
              style={{background:VIO,border:"none",borderRadius:8,padding:"8px 14px",
                color:"#fff",fontWeight:700,fontSize:px(11),cursor:"pointer",
                opacity:layers.length>=6?0.4:1}}>
              + Add Layer
            </button>
            <button onClick={removeLayer} disabled={layers.length<=2}
              style={{background:"transparent",border:`1px solid ${VIO}`,borderRadius:8,
                padding:"8px 14px",color:VIO,fontWeight:700,fontSize:px(11),cursor:"pointer",
                opacity:layers.length<=2?0.4:1}}>
              − Remove Layer
            </button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {layers.map((n,li)=>(
              li>0&&li<layers.length-1&&(
                <div key={li} style={{background:VIO+"0d",border:`1px solid ${VIO}33`,
                  borderRadius:8,padding:"6px 10px",textAlign:"center"}}>
                  <div style={{fontSize:px(10),color:V.muted,marginBottom:4}}>H{li} ({n})</div>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>addNeuron(li)} disabled={n>=8}
                      style={{background:VIO,border:"none",borderRadius:4,width:20,height:20,
                        color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                        opacity:n>=8?0.4:1}}>+</button>
                    <button onClick={()=>removeNeuron(li)} disabled={n<=1}
                      style={{background:"transparent",border:`1px solid ${VIO}`,borderRadius:4,
                        width:20,height:20,color:VIO,fontWeight:800,fontSize:px(12),cursor:"pointer",
                        opacity:n<=1?0.4:1}}>−</button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#0d0a2a",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(12),lineHeight:1.9}}>
            <div style={{color:"#475569"}}># Architecture summary:</div>
            <div style={{color:"#94a3b8"}}>Layers: {layers.length} ({layers.join(" → ")})</div>
            <div style={{color:"#94a3b8"}}>Total parameters: {totalParams}</div>
            <div style={{color:VIO}}>Model capacity: {capacity}%</div>
            {totalParams>200&&<div style={{color:ROSE,fontSize:px(11)}}>⚠️ Large model — risk of overfitting</div>}
            {layers.length<3&&<div style={{color:AMB,fontSize:px(11)}}>⚠️ Shallow network — may underfit</div>}
          </div>
          {!trained?(
            <button onClick={train}
              style={{background:VIO,border:"none",borderRadius:10,padding:"14px",
                color:"#fff",fontWeight:800,fontSize:px(14),cursor:"pointer"}}>
              🚀 Train on MNIST Digit Data
            </button>
          ):(
            <div style={{background:score>=85?GRN+"0d":score>=70?AMB+"0d":ROSE+"0d",
              border:`2px solid ${score>=85?GRN:score>=70?AMB:ROSE}`,borderRadius:12,
              padding:"18px",textAlign:"center"}}>
              <div style={{fontSize:px(40),marginBottom:6}}>{score>=90?"🏆":score>=80?"✅":score>=70?"⚠️":"❌"}</div>
              <div style={{fontWeight:900,fontSize:px(22),
                color:score>=85?GRN:score>=70?AMB:ROSE}}>
                {score}% accuracy
              </div>
              <div style={{fontSize:px(12),color:V.muted,marginTop:4}}>
                {score>=90?"Outstanding architecture!":score>=80?"Solid network design!":score>=70?"Decent — try more neurons":score>=60?"Add hidden layers":"Network too shallow"}
              </div>
              <button onClick={()=>{setTrained(false);setScore(null);}}
                style={{marginTop:10,background:"transparent",border:`1px solid ${V.border}`,
                  borderRadius:8,padding:"6px 14px",fontSize:px(11),color:V.muted,cursor:"pointer"}}>
                Try different architecture
              </button>
            </div>
          )}
          <div style={{...LCARD,padding:"12px",background:"#f5f3ff"}}>
            <div style={{fontWeight:700,color:VIO,fontSize:px(11),marginBottom:8}}>ARCHITECTURE TIPS</div>
            {[
              layers.length<3&&{t:"Add 1-2 hidden layers",d:"Depth allows learning complex features",c:AMB},
              layers.length>5&&{t:"Deep networks need careful tuning",d:"Use batch norm and dropout",c:ORG},
              Math.max(...layers.slice(1,-1))<4&&{t:"Try wider hidden layers",d:"More neurons = more capacity",c:VIO},
              totalParams<20&&{t:"Very small network",d:"May struggle on complex tasks",c:CYN},
            ].filter(Boolean).map((tip,i)=>(
              <div key={i} style={{fontSize:px(11),color:tip.c,marginBottom:4,fontWeight:600}}>
                💡 {tip.t}: <span style={{color:V.muted,fontWeight:400}}>{tip.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ DIGIT RECOGNITION PROJECT ════════════════════════════ */
const DigitProject = () => {
  const canvasRef=useRef();
  const [drawing,setDrawing]=useState(false);
  const [predicted,setPredicted]=useState(null);
  const [confidence,setConfidence]=useState(null);

  const startDraw=(e)=>{
    setDrawing(true);
    const c=canvasRef.current;
    const ctx=c.getContext("2d");
    const r=c.getBoundingClientRect();
    ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);
  };
  const draw=(e)=>{
    if(!drawing)return;
    const c=canvasRef.current;
    const ctx=c.getContext("2d");
    const r=c.getBoundingClientRect();
    ctx.lineTo(e.clientX-r.left,e.clientY-r.top);
    ctx.strokeStyle="#a78bfa"; ctx.lineWidth=16; ctx.lineCap="round";
    ctx.shadowColor=VIO; ctx.shadowBlur=8;
    ctx.stroke();
  };
  const endDraw=()=>{
    setDrawing(false);
    // simulate prediction
    const digits=[0,1,2,3,4,5,6,7,8,9];
    const p=digits[Math.floor(Math.random()*digits.length)];
    setPredicted(p);
    setConfidence(Math.round(70+Math.random()*28));
  };
  const clear=()=>{
    const c=canvasRef.current;
    const ctx=c.getContext("2d");
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="#0d0a2a"; ctx.fillRect(0,0,c.width,c.height);
    setPredicted(null);setConfidence(null);
  };

  useEffect(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    ctx.fillStyle="#0d0a2a"; ctx.fillRect(0,0,c.width,c.height);
    ctx.font="bold 11px sans-serif"; ctx.fillStyle="#2d2060"; ctx.textAlign="center";
    ctx.fillText("Draw a digit here",c.width/2,c.height/2);
  },[]);

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(15)}}>
        ✏️ Mini Project — Digit Recognition Neural Network
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Draw a digit (0-9) on the canvas. A neural network processes the pixel values
        through its layers and outputs the predicted class. This is exactly what
        MNIST-trained networks do — the world's most famous ML benchmark.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <canvas ref={canvasRef} width={200} height={200}
            onMouseDown={startDraw} onMouseMove={draw}
            onMouseUp={endDraw} onMouseLeave={endDraw}
            style={{width:"100%",height:200,borderRadius:12,
              border:`2px solid ${VIO}44`,cursor:"crosshair",display:"block"}}/>
          <button onClick={clear}
            style={{marginTop:8,width:"100%",background:"transparent",
              border:`1px solid ${V.border}`,borderRadius:8,padding:"8px",
              color:V.muted,fontSize:px(11),cursor:"pointer"}}>
            ↺ Clear Canvas
          </button>
          <CodeBox lines={[
            "# MNIST neural network in Keras",
            "import tensorflow as tf",
            "",
            "model = tf.keras.Sequential([",
            "  # Flatten 28×28 → 784 inputs",
            "  tf.keras.layers.Flatten(input_shape=(28,28)),",
            "  # Hidden layer 1: 128 neurons, ReLU",
            "  tf.keras.layers.Dense(128, activation='relu'),",
            "  tf.keras.layers.Dropout(0.2),",
            "  # Hidden layer 2: 64 neurons, ReLU",
            "  tf.keras.layers.Dense(64, activation='relu'),",
            "  # Output: 10 classes (digits 0-9)",
            "  tf.keras.layers.Dense(10, activation='softmax')",
            "])",
            "",
            "model.compile(",
            "  optimizer='adam',",
            "  loss='sparse_categorical_crossentropy',",
            "  metrics=['accuracy']",
            ")",
            "",
            "# Load and train on MNIST",
            "(X_train, y_train), (X_test, y_test) = \\",
            "  tf.keras.datasets.mnist.load_data()",
            "X_train, X_test = X_train/255.0, X_test/255.0",
            "",
            "model.fit(X_train, y_train, epochs=5)",
            "model.evaluate(X_test, y_test)",
            "# → Test accuracy: 0.9821 (98.2%!)",
          ]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {predicted!==null?(
            <div style={{background:"#0d0a2a",border:`2px solid ${VIO}`,borderRadius:16,
              padding:"24px",textAlign:"center"}}>
              <div style={{fontSize:px(16),color:"#94a3b8",marginBottom:8}}>Neural Network Predicts:</div>
              <div style={{fontFamily:"monospace",fontSize:px(80),fontWeight:900,
                color:VIO,lineHeight:1,marginBottom:8}}>{predicted}</div>
              <div style={{fontFamily:"monospace",fontSize:px(16),color:AMB}}>
                {confidence}% confidence
              </div>
              <div style={{background:VIO+"22",borderRadius:8,height:8,overflow:"hidden",marginTop:10}}>
                <div style={{height:"100%",width:`${confidence}%`,
                  background:`linear-gradient(90deg,${VIO},${IND})`,borderRadius:8}}/>
              </div>
            </div>
          ):(
            <div style={{background:"#0d0a2a",border:`2px solid ${VIO}22`,borderRadius:16,
              padding:"24px",textAlign:"center"}}>
              <div style={{fontSize:px(40),marginBottom:8}}>✏️</div>
              <div style={{color:"#475569",fontSize:px(13)}}>Draw a digit to get a prediction</div>
            </div>
          )}
          <div style={{...LCARD,padding:"14px"}}>
            <div style={{fontWeight:700,color:VIO,fontSize:px(12),marginBottom:10}}>
              🔢 HOW MNIST WORKS
            </div>
            {[
              {s:"1",t:"Input",d:"28×28 pixel image → 784 input neurons. Each pixel value 0-255 normalized to 0-1."},
              {s:"2",t:"Hidden layers",d:"Learn increasingly abstract features: edges → curves → loops → digit shapes."},
              {s:"3",t:"Output",d:"10 neurons, one per digit. Softmax converts to probabilities. Argmax = prediction."},
              {s:"4",t:"Training",d:"60,000 labelled images. Backpropagation adjusts 100,000+ weights over 5 epochs."},
            ].map(row=>(
              <div key={row.s} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,
                  background:VIO+"22",border:`2px solid ${VIO}`,display:"flex",
                  alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:px(10),color:VIO}}>
                  {row.s}
                </div>
                <div>
                  <span style={{fontWeight:700,color:VIO,fontSize:px(12)}}>{row.t}: </span>
                  <span style={{fontSize:px(12),color:V.muted}}>{row.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════ */
const NNTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🧠",c:VIO,t:"A neural network is a stack of layers, each containing neurons that compute a weighted sum of their inputs plus a bias, then apply a non-linear activation function. This is f(Wx + b)."},
    {e:"📡",c:AMB,t:"Biological inspiration: dendrites = inputs, cell body = weighted sum, axon = output, synapse = weight. The brain has ~86 billion neurons; we simulate thousands to millions."},
    {e:"🔗",c:CYN,t:"Layers: Input (no computation), Hidden (feature extraction), Output (final prediction). 'Deep' learning = 2+ hidden layers. More layers = more abstract representations."},
    {e:"➡️",c:GRN,t:"Forward propagation: data flows left-to-right. At each layer: z = Wx + b, then a = f(z). Matrix multiplication enables batch processing of thousands of examples simultaneously."},
    {e:"📐",c:IND,t:"Without non-linear activations, stacking layers collapses to a single linear transformation — useless for images, speech, language. Non-linearity is what makes depth powerful."},
    {e:"🔧",c:PNK,t:"Parameters = weights + biases. A network with layers [784, 128, 64, 10] has 784×128+128 + 128×64+64 + 64×10+10 = 109,386 parameters, all learned by backpropagation."},
    {e:"📊",c:TEAL,t:"Universal approximation theorem: a neural network with a single hidden layer and enough neurons can approximate any continuous function. More layers find the same approximation with exponentially fewer neurons."},
    {e:"⚠️",c:ROSE,t:"Common pitfall: more parameters ≠ better performance. Overfitting happens when the network memorises training data. Use Dropout, regularisation, and early stopping as defences."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",VIO)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:VIO}}>Know</span></h2>
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
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${VIO},${IND})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:VIO,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Activation Functions →
          </button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
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
const NeuralNetworksPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Neural Networks" lessonNum="Lesson 1 of 7"
    accent={VIO} levelLabel="Deep Learning"
    dotLabels={["Hero","Why NN","Biology","Neuron Model","Architecture","Forward Prop","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#07040f 0%,#1a0a40 60%,#0a0520 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🧠 Lesson 1 of 7 · Deep Learning",VIO)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Neural<br/><span style={{color:"#c4b5fd"}}>Networks</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:VIO,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The technology that enabled machines to read handwriting, understand speech,
                recognise faces, beat the world chess champion, and write essays.
                Neural networks didn't follow new rules — they learned the rules themselves
                from examples. This is the architecture that started the deep learning revolution.
              </p>
              <div style={{background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#c4b5fd",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Stack layers of simple mathematical units (neurons). Each neuron multiplies
                  its inputs by learned weights, adds a bias, and passes the result through
                  a non-linear function. Millions of such operations, learned from data,
                  produce intelligence.
                </p>
              </div>
            </div>
            <div style={{height:px(420),background:"rgba(124,58,237,0.06)",
              border:"1px solid rgba(124,58,237,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — WHY NEURAL NETWORKS ─────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why Neural Networks?",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              The Limits of Traditional <span style={{color:VIO}}>ML</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(24)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Classical machine learning — linear regression, decision trees, SVMs —
                  requires humans to manually engineer features. To classify cat photos,
                  someone must define what "cat-ness" means: pointed ears, whiskers, fur texture.
                  This <strong>feature engineering</strong> is expensive, brittle, and scales poorly.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Neural networks eliminate this bottleneck. Given raw pixels, audio waveforms,
                  or text tokens, they learn their own feature representations automatically —
                  discovering patterns humans never explicitly programmed.
                </p>
                {[
                  {e:"🖼️",c:VIO,t:"Images",
                    d:"A 224×224 colour image = 150,528 raw pixel numbers. Traditional ML cannot handle this input dimensionality — it needs hand-crafted features (edges, HOG descriptors). Neural networks learn directly from pixels: edges → textures → parts → objects."},
                  {e:"🎙️",c:CYN,t:"Speech",
                    d:"Audio = millions of samples per second. Traditional systems needed mel-cepstral coefficients, formant extraction. Neural networks learn end-to-end: raw audio → phonemes → words → meaning, matching human transcription accuracy."},
                  {e:"📝",c:AMB,t:"Natural Language",
                    d:"Text has ambiguity, context, sarcasm, idioms. Traditional NLP needed parse trees, grammar rules, WordNet lookups. Neural networks learn word representations (embeddings) that capture semantic similarity automatically."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,display:"flex",gap:14,marginBottom:10,borderLeft:`4px solid ${item.c}`}}>
                    <span style={{fontSize:px(28)}}>{item.e}</span>
                    <div>
                      <div style={{fontWeight:800,color:item.c,fontSize:px(14),marginBottom:4}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:12,fontSize:px(14)}}>
                    📊 Traditional ML vs Neural Networks
                  </div>
                  {[
                    {p:"Feature Engineering",ml:"Manual, domain expert",nn:"Automatic, learned from data",w:"nn"},
                    {p:"Scalability to raw data",ml:"Poor (curse of dim.)",nn:"Excellent (raw pixels/audio)",w:"nn"},
                    {p:"Interpretability",ml:"✅ Usually clear",nn:"⚠️ Black box",w:"ml"},
                    {p:"Small data performance",ml:"✅ Often better",nn:"⚠️ Needs more data",w:"ml"},
                    {p:"Image/Speech/NLP",ml:"❌ Requires features",nn:"✅ State of the art",w:"nn"},
                    {p:"Training speed",ml:"✅ Fast",nn:"⚠️ Needs GPU hours",w:"ml"},
                    {p:"SOTA accuracy",ml:"Competitive (tabular)",nn:"Dominant (all domains)",w:"nn"},
                  ].map(row=>(
                    <div key={row.p} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",
                      gap:4,marginBottom:6,padding:"6px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(11),fontWeight:600,color:V.ink}}>{row.p}</span>
                      <span style={{fontSize:px(11),color:row.w==="ml"?GRN:V.muted}}>{row.ml}</span>
                      <span style={{fontSize:px(11),color:row.w==="nn"?VIO:V.muted,fontWeight:row.w==="nn"?700:400}}>{row.nn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — BIOLOGICAL INSPIRATION ──────────────────────── */}
        <div ref={R(2)} style={{background:"#07040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Biological Inspiration","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              How the Brain <span style={{color:"#c4b5fd"}}>Computes</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  The human brain contains approximately 86 billion neurons, each connected
                  to thousands of others via synapses — forming roughly 100 trillion connections.
                  This massive network of simple units gives rise to every thought, memory, and movement.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:20}}>
                  In 1943, McCulloch and Pitts created the first mathematical model of a neuron.
                  In 1957, Rosenblatt built the Perceptron — a physical machine that learned
                  to classify images. The analogy to biology inspired the entire field.
                </p>
                {[
                  {bio:"Dendrites",art:"Input connections",c:AMB,d:"Receive signals from other neurons (input values x₁, x₂, …, xₙ)"},
                  {bio:"Synapse strength",art:"Weights (W)",c:VIO,d:"How strongly one neuron influences another. Learned during training"},
                  {bio:"Cell body (soma)",art:"Weighted sum + bias",c:CYN,d:"Aggregates all incoming signals: z = Σ wᵢxᵢ + b"},
                  {bio:"Action potential",art:"Activation function",c:GRN,d:"Fires only if input exceeds threshold — non-linear decision"},
                  {bio:"Axon → terminal",art:"Output",c:PNK,d:"Passes signal forward to next layer of neurons"},
                ].map(row=>(
                  <div key={row.bio} style={{background:row.c+"0d",border:`1px solid ${row.c}33`,
                    borderRadius:10,padding:"10px 14px",marginBottom:8,display:"grid",
                    gridTemplateColumns:"1fr 1fr",gap:8,alignItems:"center"}}>
                    <div>
                      <div style={{fontWeight:700,color:row.c,fontSize:px(12)}}>{row.bio}</div>
                      <div style={{fontSize:px(11),color:"#94a3b8"}}>Biological</div>
                    </div>
                    <div>
                      <div style={{fontWeight:700,color:"#fff",fontSize:px(12)}}>{row.art}</div>
                      <div style={{fontSize:px(11),color:"#64748b"}}>{row.d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color="#c4b5fd" title="The crucial difference"
                  body="Biological neurons are vastly more complex than artificial ones — they have hundreds of different neurotransmitters, complex temporal dynamics, axon delays, glial cells supporting them, and plasticity mechanisms we don't fully understand. Artificial neurons are a mathematical simplification, not a biological simulation. But the abstraction is powerful enough to match and exceed human performance on many specific tasks."/>
                <div style={{background:"#1a0a40",border:"1px solid rgba(124,58,237,0.3)",
                  borderRadius:14,padding:"20px",marginTop:16}}>
                  <div style={{fontWeight:700,color:"#c4b5fd",marginBottom:10,fontSize:px(13)}}>
                    🔬 Key Numbers
                  </div>
                  {[
                    {label:"Human brain neurons",val:"~86 billion",c:VIO},
                    {label:"Brain synapses",val:"~100 trillion",c:AMB},
                    {label:"GPT-4 parameters",val:"~1.8 trillion",c:GRN},
                    {label:"Firing rate (biological)",val:"~200 Hz",c:CYN},
                    {label:"GPU ops per second",val:"~300 TFLOPS",c:PNK},
                  ].map(row=>(
                    <div key={row.label} style={{display:"flex",justifyContent:"space-between",
                      marginBottom:8,padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <span style={{fontSize:px(12),color:"#94a3b8"}}>{row.label}</span>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:row.c,fontSize:px(12)}}>{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S3 — ARTIFICIAL NEURON ───────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · The Artificial Neuron",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              One Unit of <span style={{color:VIO}}>Intelligence</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(24)}}>
              Every neural network is built from copies of this single operation.
              Adjust the weights and bias below to see how a single neuron produces its output.
            </p>
            <Formula color={VIO}>z = w₁x₁ + w₂x₂ + ⋯ + wₙxₙ + b = Σᵢ wᵢxᵢ + b</Formula>
            <NeuronDiagram/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(16),marginTop:px(24)}}>
              {[
                {s:"x (inputs)",c:AMB,d:"Feature values: pixel intensities, word embeddings, sensor readings. Fixed for each training example. The raw data fed into the network."},
                {s:"w (weights)",c:VIO,d:"Learnable parameters. Control how much each input contributes. Initialised randomly, then refined by backpropagation over thousands of training steps."},
                {s:"b (bias)",c:GRN,d:"A learnable offset. Allows the activation to shift left or right. Without bias, all decision boundaries must pass through the origin — severely limiting."},
              ].map(item=>(
                <div key={item.s} style={{...LCARD,borderTop:`4px solid ${item.c}`}}>
                  <div style={{fontFamily:"monospace",fontWeight:800,color:item.c,fontSize:px(18),marginBottom:6}}>{item.s}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S4 — ACTIVATION ──────────────────────────────────── */}
        <div ref={R(4)} style={{background:"#07040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Activation Functions","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Introducing <span style={{color:"#c4b5fd"}}>Non-Linearity</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color="#c4b5fd">a = f(z)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  After computing the weighted sum z, every neuron passes it through
                  a non-linear <strong>activation function f</strong>. This single step
                  is what makes neural networks powerful.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  Without non-linearity, any stack of layers reduces to a single matrix
                  multiplication — a linear model. You could have 1,000 layers and it
                  would be equivalent to a one-layer model. Non-linearity enables
                  arbitrary function approximation.
                </p>
                <IBox color="#c4b5fd" title="Why non-linearity matters"
                  body="XOR cannot be solved by a linear model — it requires a curved decision boundary. A single hidden layer with a non-linear activation can solve XOR. This was the breakthrough that ended the first AI winter in 1986 — proving that multi-layer networks with non-linearities could solve problems that single-layer perceptrons could not."/>
              </div>
              <div>
                {[
                  {fn:"σ(z) = 1/(1+e⁻ᶻ)",name:"Sigmoid",range:"(0, 1)",c:CYN,use:"Output layer of binary classifiers"},
                  {fn:"tanh(z) = (eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ)",name:"Tanh",range:"(-1, 1)",c:AMB,use:"Hidden layers, RNNs"},
                  {fn:"ReLU(z) = max(0, z)",name:"ReLU",range:"[0, ∞)",c:GRN,use:"Hidden layers (default)"},
                  {fn:"Softmax(zᵢ) = eᶻⁱ / Σeᶻʲ",name:"Softmax",range:"(0, 1), Σ=1",c:VIO,use:"Output of multi-class classifiers"},
                ].map(fn=>(
                  <div key={fn.name} style={{background:fn.c+"0d",border:`1px solid ${fn.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontWeight:800,color:fn.c,fontSize:px(14)}}>{fn.name}</span>
                      <span style={{fontFamily:"monospace",background:"#1a1040",borderRadius:6,
                        padding:"3px 10px",fontSize:px(11),color:fn.c}}>{fn.range}</span>
                    </div>
                    <div style={{fontFamily:"monospace",color:"#94a3b8",fontSize:px(12),marginBottom:4}}>{fn.fn}</div>
                    <div style={{fontSize:px(12),color:"#64748b"}}>✅ Use: {fn.use}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — ARCHITECTURE ────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Network Architecture",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Layers, Depth, and <span style={{color:VIO}}>Width</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {layer:"Input Layer",n:1,c:AMB,icon:"📥",
                    d:"Receives raw data. No computation — just passes values forward. Number of neurons = number of features (784 for 28×28 image, 512 for word embeddings, 13 for Titanic features)."},
                  {layer:"Hidden Layers",n:"1 to 100s",c:VIO,icon:"🔮",
                    d:"Where feature learning happens. Early layers learn low-level features (edges, phonemes). Deep layers learn high-level concepts (faces, words, intent). Deeper = more abstract representations."},
                  {layer:"Output Layer",n:"Depends on task",c:GRN,icon:"📤",
                    d:"Produces the final prediction. Binary classification: 1 neuron, sigmoid. Multi-class: k neurons, softmax. Regression: 1 neuron, linear. Object detection: hundreds of neurons."},
                ].map(item=>(
                  <div key={item.layer} style={{...LCARD,marginBottom:12,borderLeft:`4px solid ${item.c}`}}>
                    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:px(30)}}>{item.icon}</span>
                      <div>
                        <div style={{fontWeight:800,color:item.c,fontSize:px(15),marginBottom:2}}>{item.layer}</div>
                        <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted,marginBottom:6}}>Neurons: {item.n}</div>
                        <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:12,fontSize:px(14)}}>
                    📐 Architecture Notation
                  </div>
                  <Formula color={VIO}>[784 → 256 → 128 → 10]</Formula>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:12}}>
                    This notation means: 784 inputs, two hidden layers (256 and 128 neurons),
                    10 output classes. Used for MNIST digit classification.
                  </p>
                  {[
                    {t:"Dense/Fully Connected",d:"Every neuron in layer l connects to every neuron in l+1. Most general. Expensive: O(n²) connections per layer pair."},
                    {t:"Depth (# layers)",d:"Controls abstraction level. ResNet-152 has 152 layers. GPT-4 has 96 transformer layers. Depth > Width for complex patterns."},
                    {t:"Width (# neurons/layer)",d:"Controls representation capacity per layer. More neurons = more possible patterns. Bottleneck layers (narrow then wide) compress information."},
                  ].map(item=>(
                    <div key={item.t} style={{marginBottom:10,padding:"10px",background:VIO+"08",borderRadius:8}}>
                      <div style={{fontWeight:700,color:VIO,fontSize:px(12),marginBottom:4}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — FORWARD PROPAGATION ─────────────────────────── */}
        <div ref={R(6)} style={{background:"#07040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Forward Propagation","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Data Flows <span style={{color:"#c4b5fd"}}>Forward</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Forward propagation is the process of computing a prediction from input to output.
                  At each layer, two operations happen: a linear transformation, then a non-linear activation.
                </p>
                <Formula color="#c4b5fd">Z⁽ˡ⁾ = W⁽ˡ⁾ A⁽ˡ⁻¹⁾ + b⁽ˡ⁾</Formula>
                <Formula color={AMB}>A⁽ˡ⁾ = f(Z⁽ˡ⁾)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  In matrix form, a single forward pass processes an entire batch of examples
                  simultaneously — this is why GPUs are essential. Batch size of 256 means
                  256 examples processed in one matrix multiply.
                </p>
                {[
                  {s:"①",t:"Load batch",d:"Select B training examples: X ∈ ℝᴮˣᵈ (B samples, d features)"},
                  {s:"②",t:"Layer 1",d:"Z¹ = X·W¹ᵀ + b¹ → A¹ = ReLU(Z¹)"},
                  {s:"③",t:"Layer L",d:"Repeat for each hidden layer: Zˡ = Aˡ⁻¹·Wˡᵀ + bˡ → Aˡ = f(Zˡ)"},
                  {s:"④",t:"Output",d:"ŷ = softmax(Z^L) → probabilities for each class"},
                  {s:"⑤",t:"Compute loss",d:"L = CrossEntropy(y, ŷ) → scalar error signal"},
                ].map(s=>(
                  <div key={s.s} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                    <span style={{color:"#c4b5fd",fontWeight:800,fontSize:px(18),flexShrink:0}}>{s.s}</span>
                    <div>
                      <span style={{fontWeight:700,color:"#e2e8f0",fontSize:px(13)}}>{s.t}: </span>
                      <span style={{fontFamily:"monospace",color:"#64748b",fontSize:px(12)}}>{s.d}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <CodeBox color="#c4b5fd" lines={[
                  "import numpy as np",
                  "",
                  "# Manual forward pass (educational)",
                  "def relu(z): return np.maximum(0, z)",
                  "def softmax(z):",
                  "    e = np.exp(z - z.max())",
                  "    return e / e.sum()",
                  "",
                  "# Network: [3 → 4 → 2]",
                  "np.random.seed(42)",
                  "W1 = np.random.randn(4, 3) * 0.1",
                  "b1 = np.zeros(4)",
                  "W2 = np.random.randn(2, 4) * 0.1",
                  "b2 = np.zeros(2)",
                  "",
                  "# Input: one example with 3 features",
                  "x = np.array([1.0, 0.5, -0.3])",
                  "",
                  "# Layer 1: linear → activation",
                  "z1 = W1 @ x + b1      # shape: (4,)",
                  "a1 = relu(z1)          # ReLU activation",
                  "",
                  "# Layer 2: linear → softmax",
                  "z2 = W2 @ a1 + b2     # shape: (2,)",
                  "output = softmax(z2)   # probabilities",
                  "",
                  "print('z1:', z1.round(4))",
                  "print('a1:', a1.round(4))",
                  "print('output:', output.round(4))",
                  "# output: [0.4821, 0.5179] ← class probs",
                ]}/>
              </div>
            </div>
          </div>
        </div>

        {/* ── S7 — PYTHON KERAS ────────────────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Python with TensorFlow/Keras",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Building Networks with <span style={{color:VIO}}>Keras</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color={VIO} lines={[
                  "import tensorflow as tf",
                  "import numpy as np",
                  "",
                  "# ── BUILD THE MODEL ────────────────────",
                  "model = tf.keras.Sequential([",
                  "    # Input layer: expects 784 features",
                  "    tf.keras.layers.Input(shape=(784,)),",
                  "",
                  "    # Hidden layer 1: 256 neurons, ReLU",
                  "    tf.keras.layers.Dense(256, activation='relu'),",
                  "    tf.keras.layers.Dropout(0.3),  # regularise",
                  "",
                  "    # Hidden layer 2: 128 neurons, ReLU",
                  "    tf.keras.layers.Dense(128, activation='relu'),",
                  "    tf.keras.layers.Dropout(0.3),",
                  "",
                  "    # Output: 10 classes → softmax probs",
                  "    tf.keras.layers.Dense(10, activation='softmax')",
                  "])",
                  "",
                  "# ── COMPILE ────────────────────────────",
                  "model.compile(",
                  "    optimizer=tf.keras.optimizers.Adam(lr=0.001),",
                  "    loss='sparse_categorical_crossentropy',",
                  "    metrics=['accuracy']",
                  ")",
                  "",
                  "# ── INSPECT ────────────────────────────",
                  "model.summary()",
                  "# Total params: 235,146",
                  "# Trainable params: 235,146",
                  "",
                  "# ── TRAIN ──────────────────────────────",
                  "(X_tr, y_tr), (X_te, y_te) = \\",
                  "    tf.keras.datasets.mnist.load_data()",
                  "X_tr = X_tr.reshape(-1, 784) / 255.0",
                  "X_te = X_te.reshape(-1, 784) / 255.0",
                  "",
                  "history = model.fit(",
                  "    X_tr, y_tr,",
                  "    validation_split=0.1,",
                  "    epochs=10, batch_size=256",
                  ")",
                  "",
                  "# ── EVALUATE ───────────────────────────",
                  "loss, acc = model.evaluate(X_te, y_te)",
                  "print(f'Test accuracy: {acc:.4f}')  # ~0.982",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"tf.keras.Sequential",c:VIO,
                    d:"Builds a model as a linear stack of layers. Add layers in order from input to output. For branching architectures (ResNet), use the Functional API instead."},
                  {l:"Dense(256, activation='relu')",c:AMB,
                    d:"A fully-connected layer with 256 neurons and ReLU activation. Dense(n) means every input connects to every neuron — hence n_in × n_out + n_out parameters."},
                  {l:"Dropout(0.3)",c:CYN,
                    d:"Randomly zeros 30% of neurons during training. Forces the network to learn redundant representations — dramatically reduces overfitting. Disabled during inference."},
                  {l:"optimizer='adam'",c:GRN,
                    d:"Adaptive Moment Estimation: combines momentum and RMSprop. Automatically adapts learning rate per parameter. The default choice for most tasks."},
                  {l:"sparse_categorical_crossentropy",c:PNK,
                    d:"Loss for integer class labels (0, 1, 2…). Use categorical_crossentropy if labels are one-hot encoded. Lower loss = better predictions."},
                  {l:"model.summary()",c:IND,
                    d:"Prints layer names, output shapes, and parameter counts. Always inspect before training — catches shape mismatches immediately."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(11),marginBottom:4}}>{item.l}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S8 — APPLICATIONS ────────────────────────────────── */}
        <div ref={R(8)} style={{background:"#07040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Neural Networks <span style={{color:"#c4b5fd"}}>Power the World</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🖼️",c:VIO,t:"Image Recognition",b:"CNNs classify 1.2M ImageNet images into 1000 categories. ResNet-50 achieves 76% top-1 accuracy — better than many humans on fine-grained categories. Used in: Google Photos, Instagram filters, medical imaging (tumour detection), autonomous vehicles.",tech:"ResNet, EfficientNet, ViT"},
                {e:"🎙️",c:CYN,t:"Speech Recognition",b:"Whisper (OpenAI) achieves near-human transcription across 99 languages with zero-shot capability. Deep LSTM + attention networks process audio spectrograms. Used in: Siri, Alexa, Google Assistant, real-time translation.",tech:"Wav2Vec2, Whisper, DeepSpeech"},
                {e:"🚗",c:AMB,t:"Autonomous Vehicles",b:"Tesla's Full Self-Driving uses a vision-only neural network processing 8 cameras at 36fps to detect lanes, objects, depth, and predict trajectories. 70+ GB/s of sensor data processed per second in real time.",tech:"Multi-task CNNs + Transformer"},
                {e:"💊",c:GRN,t:"Drug Discovery",b:"AlphaFold 2 (DeepMind) solved protein structure prediction — a 50-year grand challenge — in 2020. Now used to discover new antibiotics. Neural networks predict molecular properties for drug candidates 1000× faster than wet lab experiments.",tech:"AlphaFold, Graph Neural Networks"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"20px 22px"}}>
                  <div style={{fontSize:px(36),marginBottom:8}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:"#64748b"}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:"#1a1040",borderRadius:8,padding:"6px 10px",fontSize:px(11),color:a.c}}>{a.tech}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── S9 — GAME ────────────────────────────────────────── */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Game",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Build the Neural Network</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Design a neural network architecture for digit recognition. Add layers,
              adjust neuron counts, and train to see your accuracy score. Learn how
              depth and width affect model performance.
            </p>
            <BuildNetworkGame/>
          </div>
        </div>

        {/* ── S10 — PROJECT ────────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              ✏️ Digit <span style={{color:VIO}}>Recognition</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Draw any digit on the canvas. A pre-trained neural network (simulated)
              runs forward propagation through its layers and outputs the predicted class.
              This is the Hello World of deep learning.
            </p>
            <DigitProject/>
          </div>
        </div>

        {/* ── S11 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.cream}}>
          <NNTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default NeuralNetworksPage;
