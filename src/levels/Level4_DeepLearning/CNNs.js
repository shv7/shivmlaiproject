import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — CONVOLUTIONAL NEURAL NETWORKS
   Level 4 · Deep Learning · Lesson 4 of 7
   Accent: Amber #d97706
══════════════════════════════════════════════════════════════════ */
const AMB  = "#d97706";
const ORG  = "#ea580c";
const VIO  = "#7c3aed";
const GRN  = "#059669";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const IND  = "#4f46e5";
const PNK  = "#ec4899";
const TEAL = "#0d9488";
const SKY  = "#0284c7";

const Formula = ({children,color=AMB})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=AMB})=>(
  <div style={{fontFamily:"monospace",background:"#0c0700",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — CNN scanning animation ══════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current; if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);
    const GRID=7;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0a0500"; ctx.fillRect(0,0,W,H);
      const cellW=Math.min(W*0.28,120)/GRID;
      const ox=W*0.12, oy=(H-cellW*GRID)/2;
      // draw input grid (fake image)
      for(let r=0;r<GRID;r++){
        for(let cc2=0;cc2<GRID;cc2++){
          const v=Math.sin(r*0.8+cc2*0.9+1.5)*0.5+0.5;
          ctx.fillStyle=`rgb(${Math.round(v*220)},${Math.round(v*100)},${Math.round(20)})`;
          ctx.fillRect(ox+cc2*cellW,oy+r*cellW,cellW-1,cellW-1);
        }
      }
      // sliding filter position
      const fSize=3;
      const maxPos=GRID-fSize;
      const pos=Math.floor(((t*0.15)%(maxPos*2+1)));
      const fc=pos>maxPos?2*(maxPos)-pos:pos;
      const fr=Math.floor(fc/(maxPos+1));
      const fc2=fc%(maxPos+1);
      const fx=ox+fc2*cellW, fy=oy+fr*cellW;
      // filter box
      ctx.strokeStyle=AMB; ctx.lineWidth=2.5;
      ctx.shadowColor=AMB; ctx.shadowBlur=12;
      ctx.strokeRect(fx,fy,cellW*fSize,cellW*fSize); ctx.shadowBlur=0;
      // filter fill
      ctx.fillStyle=AMB+"15"; ctx.fillRect(fx,fy,cellW*fSize,cellW*fSize);
      // arrow to feature map
      const fmOx=W*0.5, fmSize=4;
      const fmCellW=Math.min(W*0.18,80)/fmSize;
      const fmOy=(H-fmCellW*fmSize)/2;
      // feature map
      ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle="#64748b"; ctx.textAlign="center";
      ctx.fillText("Feature Map",fmOx+fmCellW*fmSize/2,fmOy-10);
      for(let r=0;r<fmSize;r++){
        for(let c2=0;c2<fmSize;c2++){
          const v2=Math.sin(r*1.1+c2*0.9+t*0.08)*0.5+0.5;
          ctx.fillStyle=`rgba(217,119,6,${v2*0.8+0.1})`;
          ctx.fillRect(fmOx+c2*fmCellW,fmOy+r*fmCellW,fmCellW-1,fmCellW-1);
        }
      }
      // second feature map
      const fm2Ox=W*0.68;
      ctx.fillText("Pooled Map",fm2Ox+fmCellW,fmOy-10);
      for(let r=0;r<2;r++){
        for(let c2=0;c2<2;c2++){
          const v3=Math.sin(r*2+c2*1.5+t*0.08)*0.5+0.5;
          ctx.fillStyle=`rgba(5,150,105,${v3*0.8+0.1})`;
          ctx.fillRect(fm2Ox+c2*fmCellW*2,fmOy+r*fmCellW*2,fmCellW*2-2,fmCellW*2-2);
        }
      }
      // arrow
      ctx.beginPath();ctx.moveTo(ox+GRID*cellW+6,H/2);ctx.lineTo(fmOx-8,H/2);
      ctx.strokeStyle=AMB+"88"; ctx.lineWidth=1.5;
      ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(fmOx+fmCellW*fmSize+6,H/2);ctx.lineTo(fm2Ox-8,H/2);
      ctx.strokeStyle=GRN+"88"; ctx.lineWidth=1.5;
      ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle=AMB; ctx.textAlign="center";
      ctx.fillText("Conv2D",ox+GRID*cellW/2,oy-12);
      ctx.fillStyle=GRN;
      ctx.fillText("MaxPool",fm2Ox+fmCellW,oy-12);
      t+=0.5; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ CONVOLUTION EXPLORER ══════════════════════════════════════ */
const ConvolutionExplorer=()=>{
  const [filterType,setFilterType]=useState("edge_h");
  const [pos,setPos]=useState({r:0,c:0});
  const canvasRef=useRef();

  const INPUT=[
    [1,0,1,0,1,0,1],
    [0,1,0,1,0,1,0],
    [1,0,1,0,1,0,1],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [0,1,0,0,0,1,0],
    [1,0,0,0,0,0,1],
  ];

  const FILTERS={
    edge_h:{name:"Horizontal Edge",k:[[-1,-1,-1],[0,0,0],[1,1,1]],c:ROSE},
    edge_v:{name:"Vertical Edge",k:[[-1,0,1],[-1,0,1],[-1,0,1]],c:VIO},
    sharpen:{name:"Sharpen",k:[[0,-1,0],[-1,5,-1],[0,-1,0]],c:CYN},
    blur:{name:"Blur",k:[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],c:GRN},
  };
  const f=FILTERS[filterType];
  const K=f.k;
  const ROWS=5,COLS=5;

  // compute output at (pos.r, pos.c)
  const convolve=(r,c)=>{
    let sum=0;
    for(let dr=0;dr<3;dr++)for(let dc=0;dc<3;dc++)sum+=INPUT[r+dr][c+dc]*K[dr][dc];
    return sum;
  };
  const outVal=convolve(pos.r,pos.c);

  const redraw=useCallback(()=>{
    const cv=canvasRef.current; if(!cv)return;
    const ctx=cv.getContext("2d");
    const W=cv.width=cv.offsetWidth,H=cv.height=cv.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fafaf0"; ctx.fillRect(0,0,W,H);
    const cell=38,pad=20;
    // input grid
    INPUT.forEach((row,r)=>row.forEach((v,c2)=>{
      const x=pad+c2*cell,y=pad+r*cell;
      ctx.fillStyle=v?AMB+"aa":"#e5e7eb";
      ctx.fillRect(x,y,cell-2,cell-2);
      ctx.font=`bold ${px(12)} monospace`; ctx.fillStyle="#1e293b"; ctx.textAlign="center";
      ctx.fillText(v,x+cell/2-1,y+cell/2+4);
    }));
    // filter overlay
    const fr=pos.r,fc2=pos.c;
    for(let dr=0;dr<3;dr++)for(let dc=0;dc<3;dc++){
      ctx.fillStyle=f.c+"22";
      ctx.fillRect(pad+(fc2+dc)*cell,pad+(fr+dr)*cell,cell-2,cell-2);
    }
    ctx.strokeStyle=f.c; ctx.lineWidth=3;
    ctx.shadowColor=f.c; ctx.shadowBlur=8;
    ctx.strokeRect(pad+fc2*cell,pad+fr*cell,cell*3,cell*3); ctx.shadowBlur=0;
    // kernel display
    const kx=W*0.5,ky=20,kcell=36;
    ctx.font=`bold ${px(10)} sans-serif`; ctx.fillStyle=f.c; ctx.textAlign="center";
    ctx.fillText(`${f.name} Kernel`,kx+kcell*1.5,ky-4);
    K.forEach((row,r)=>row.forEach((v,c2)=>{
      const x=kx+c2*kcell,y=ky+r*kcell;
      ctx.fillStyle=v>0?f.c+"33":v<0?"#fecaca":"#f0f0f0";
      ctx.fillRect(x,y,kcell-2,kcell-2);
      ctx.font=`bold ${px(11)} monospace`; ctx.fillStyle=f.c; ctx.textAlign="center";
      ctx.fillText(v%1===0?v:v.toFixed(2),x+kcell/2-1,y+kcell/2+4);
    }));
    // output label
    ctx.font=`bold ${px(14)} monospace`; ctx.textAlign="center";
    const col=outVal>0?GRN:outVal<0?ROSE:"#94a3b8";
    ctx.fillStyle=col;
    ctx.fillText(`Output: ${outVal.toFixed(2)}`,kx+kcell*1.5,ky+kcell*3+28);
    ctx.font=`${px(10)} sans-serif`; ctx.fillStyle="#94a3b8";
    ctx.fillText("(dot product of patch × kernel)",kx+kcell*1.5,ky+kcell*3+44);
    // labels
    ctx.font=`bold ${px(11)} sans-serif`; ctx.fillStyle=AMB; ctx.textAlign="center";
    ctx.fillText("Input (7×7)",pad+7*cell/2,H-8);
  },[pos,filterType,f,K,outVal]);
  useEffect(()=>{redraw();},[redraw]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        🔍 Convolution Explorer — Slide a filter across the input
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Click a cell in the input grid to position the filter window there.
        Watch the dot product (output value) update — this is one convolution step.
        Try different filter types to see edge detection, sharpening, and blurring.
      </p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {Object.entries(FILTERS).map(([k,fn])=>(
          <button key={k} onClick={()=>setFilterType(k)}
            style={{background:filterType===k?fn.c:fn.c+"0d",
              border:`2px solid ${filterType===k?fn.c:fn.c+"33"}`,borderRadius:10,
              padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:px(11),
              color:filterType===k?"#fff":fn.c}}>
            {fn.name}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:300,borderRadius:12,
            border:`1px solid ${AMB}22`,display:"block",cursor:"crosshair"}}
            onClick={e=>{
              const cv=canvasRef.current; if(!cv)return;
              const r2=cv.getBoundingClientRect();
              const x=(e.clientX-r2.left)*(cv.width/r2.width);
              const y=(e.clientY-r2.top)*(cv.height/r2.height);
              const c2=Math.floor((x-20)/38), r3=Math.floor((y-20)/38);
              if(r3>=0&&r3<=4&&c2>=0&&c2<=4)setPos({r:r3,c:c2});
            }}/>
          <p style={{...LBODY,fontSize:px(11),color:V.muted,marginTop:4,textAlign:"center"}}>
            Click on the input grid to move the filter window
          </p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#0c0700",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(12),lineHeight:2}}>
            <div style={{color:"#475569"}}># Convolution computation:</div>
            <div style={{color:"#94a3b8"}}>filter at row={pos.r}, col={pos.c}</div>
            <div style={{color:AMB,fontWeight:700}}>Output(i,j) = Σ Σ Input[i+m][j+n] × K[m][n]</div>
            <div style={{color:"#475569",marginTop:4}}># Patch × Kernel element-wise:</div>
            {K.map((row,r)=>(
              <div key={r} style={{color:"#64748b"}}>
                [{row.map((kv,c2)=>`${INPUT[pos.r+r][pos.c+c2]}×${kv%1===0?kv:kv.toFixed(2)}`).join("+")}]
              </div>
            ))}
            <div style={{color:outVal>0?GRN:ROSE,fontWeight:900,fontSize:px(15),marginTop:4}}>
              = {outVal.toFixed(4)}
            </div>
          </div>
          <IBox color={AMB} title="Why convolution works"
            body="The filter slides over every position in the image. At each position, it computes a dot product between the filter weights and the local image patch. If the patch matches the filter pattern (e.g., a horizontal edge), the output is large. If not, it's near zero. The network learns which filters to use — not us!"/>
          <div style={{...LCARD,background:"#fffbeb",border:`2px solid ${AMB}22`,padding:"12px"}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(12),marginBottom:8}}>
              KEY CONVOLUTION PROPERTIES
            </div>
            {[
              {t:"Translation invariance",d:"The same filter detects an edge anywhere in the image — top-left or bottom-right"},
              {t:"Parameter sharing",d:"One 3×3 filter (9 weights) is applied everywhere — vs. full FC which needs W×H×W×H weights"},
              {t:"Local connectivity",d:"Each output neuron only sees a 3×3 patch, not the full image — respects spatial structure"},
            ].map(item=>(
              <div key={item.t} style={{marginBottom:6}}>
                <span style={{fontWeight:700,color:AMB,fontSize:px(11)}}>{item.t}: </span>
                <span style={{fontSize:px(11),color:V.muted}}>{item.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ POOLING DEMO ══════════════════════════════════════════════ */
const PoolingDemo=()=>{
  const [poolType,setPoolType]=useState("max");
  const INPUT2=[
    [3,7,2,1],[5,9,4,3],[1,2,8,6],[0,4,5,2]
  ];
  const pool=(r,c)=>{
    const patch=[INPUT2[r][c],INPUT2[r][c+1],INPUT2[r+1][c],INPUT2[r+1][c+1]];
    return poolType==="max"?Math.max(...patch):Math.round(patch.reduce((a,b)=>a+b)/patch.length*10)/10;
  };
  const out=[[pool(0,0),pool(0,2)],[pool(2,0),pool(2,2)]];
  return (
    <div style={{...LCARD,background:"#fffbeb",border:`2px solid ${AMB}22`}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        📉 Pooling Layer — Spatial downsampling
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <button onClick={()=>setPoolType("max")}
          style={{background:poolType==="max"?AMB:AMB+"0d",border:`2px solid ${AMB}`,
            borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,
            fontSize:px(12),color:poolType==="max"?"#fff":AMB}}>Max Pooling</button>
        <button onClick={()=>setPoolType("avg")}
          style={{background:poolType==="avg"?GRN:GRN+"0d",border:`2px solid ${GRN}`,
            borderRadius:8,padding:"7px 16px",cursor:"pointer",fontWeight:700,
            fontSize:px(12),color:poolType==="avg"?"#fff":GRN}}>Average Pooling</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:px(24),alignItems:"center"}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,textAlign:"center"}}>
            INPUT (4×4)
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3}}>
            {INPUT2.flat().map((v,i)=>(
              <div key={i} style={{background:AMB+"0d",border:`1px solid ${AMB}33`,borderRadius:6,
                padding:"8px",textAlign:"center",fontFamily:"monospace",fontWeight:700,
                color:AMB,fontSize:px(14)}}>{v}</div>
            ))}
          </div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:px(28)}}>→</div>
          <div style={{fontSize:px(11),color:V.muted,fontFamily:"monospace"}}>
            2×2 pool<br/>stride=2
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,textAlign:"center"}}>
            OUTPUT (2×2) — {poolType==="max"?"Max":"Avg"} pooled
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:3,maxWidth:160,margin:"0 auto"}}>
            {out.flat().map((v,i)=>(
              <div key={i} style={{background:GRN+"15",border:`2px solid ${GRN}`,borderRadius:8,
                padding:"14px",textAlign:"center",fontFamily:"monospace",fontWeight:900,
                color:GRN,fontSize:px(20)}}>{v}</div>
            ))}
          </div>
          <p style={{...LBODY,fontSize:px(11),color:V.muted,textAlign:"center",marginTop:8}}>
            4×4 → 2×2 (75% fewer values)
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════ CIFAR PROJECT ═════════════════════════════════════════════ */
const CIFARProject=()=>{
  const [arch,setArch]=useState("simple");
  const [epochs,setEpochs]=useState(0);
  const [training,setTraining]=useState(false);
  const iRef=useRef(null);

  const ARCHS={
    simple:{label:"Simple CNN (2 Conv)",acc:65,params:"120K",code:[
      "model = tf.keras.Sequential([",
      "  layers.Conv2D(32,(3,3),activation='relu',",
      "                input_shape=(32,32,3)),",
      "  layers.MaxPooling2D(),",
      "  layers.Conv2D(64,(3,3),activation='relu'),",
      "  layers.MaxPooling2D(),",
      "  layers.Flatten(),",
      "  layers.Dense(64,activation='relu'),",
      "  layers.Dense(10,activation='softmax')",
      "])",
    ]},
    deep:{label:"Deep CNN (4 Conv)",acc:78,params:"890K",code:[
      "model = tf.keras.Sequential([",
      "  layers.Conv2D(32,(3,3),padding='same',",
      "    activation='relu',input_shape=(32,32,3)),",
      "  layers.Conv2D(32,(3,3),activation='relu'),",
      "  layers.MaxPooling2D(), layers.Dropout(0.25),",
      "  layers.Conv2D(64,(3,3),padding='same',",
      "    activation='relu'),",
      "  layers.Conv2D(64,(3,3),activation='relu'),",
      "  layers.MaxPooling2D(), layers.Dropout(0.25),",
      "  layers.Flatten(),",
      "  layers.Dense(512,activation='relu'),",
      "  layers.Dropout(0.5),",
      "  layers.Dense(10,activation='softmax')",
      "])",
    ]},
    bn:{label:"BatchNorm CNN",acc:86,params:"1.2M",code:[
      "def conv_block(filters, x):",
      "  x = layers.Conv2D(filters,(3,3),",
      "        padding='same')(x)",
      "  x = layers.BatchNormalization()(x)",
      "  x = layers.Activation('relu')(x)",
      "  x = layers.MaxPooling2D()(x)",
      "  return x",
      "",
      "inputs = keras.Input(shape=(32,32,3))",
      "x = conv_block(32, inputs)",
      "x = conv_block(64, x)",
      "x = conv_block(128, x)",
      "x = layers.Flatten()(x)",
      "x = layers.Dense(256,activation='relu')(x)",
      "outputs = layers.Dense(10,",
      "  activation='softmax')(x)",
    ]},
  };
  const a=ARCHS[arch];
  const lossAt=e=>Math.max(0.05,2.3*Math.exp(-e*0.04)+0.1*(1-e/50));

  const startTrain=()=>{
    setTraining(true);setEpochs(0);
    iRef.current=setInterval(()=>setEpochs(e=>{
      if(e>=50){clearInterval(iRef.current);setTraining(false);}
      return e+1;
    }),120);
  };
  const reset=()=>{setEpochs(0);setTraining(false);clearInterval(iRef.current);};
  useEffect(()=>()=>clearInterval(iRef.current),[]);
  const curAcc=Math.round((a.acc-10)*(epochs/50)+10);
  const curLoss=lossAt(epochs);

  return (
    <div style={{...LCARD,background:"#fffbeb",border:`2px solid ${AMB}22`}}>
      <div style={{fontWeight:700,color:AMB,marginBottom:8,fontSize:px(15)}}>
        🖼️ Mini Project — CIFAR-10 Image Classifier
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        CIFAR-10 has 60,000 colour images (32×32) in 10 classes: airplane, automobile,
        bird, cat, deer, dog, frog, horse, ship, truck. Choose an architecture and train.
      </p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        {Object.entries(ARCHS).map(([k,v])=>(
          <button key={k} onClick={()=>{setArch(k);reset();}}
            style={{background:arch===k?AMB:AMB+"0d",border:`2px solid ${arch===k?AMB:AMB+"33"}`,
              borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,
              fontSize:px(12),color:arch===k?"#fff":AMB}}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <CodeBox color={AMB} lines={["import tensorflow as tf",
            "from tensorflow import keras",
            "from tensorflow.keras import layers","",
            ...a.code,"",
            "# Compile",
            "model.compile(",
            "  optimizer='adam',",
            "  loss='sparse_categorical_crossentropy',",
            "  metrics=['accuracy']",
            ")","",
            "# Load CIFAR-10",
            "(X_tr,y_tr),(X_te,y_te)=keras.datasets.cifar10.load_data()",
            "X_tr,X_te=X_tr/255.0,X_te/255.0","",
            "# Train",
            "model.fit(X_tr,y_tr,epochs=50,",
            "  batch_size=64,validation_split=0.1)",
          ]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:AMB+"0d",border:`2px solid ${AMB}`,borderRadius:12,
              padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:px(11),color:V.muted}}>Parameters</div>
              <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(20),color:AMB}}>{a.params}</div>
            </div>
            <div style={{background:GRN+"0d",border:`2px solid ${GRN}`,borderRadius:12,
              padding:"14px",textAlign:"center"}}>
              <div style={{fontSize:px(11),color:V.muted}}>Target Accuracy</div>
              <div style={{fontFamily:"monospace",fontWeight:900,fontSize:px(20),color:GRN}}>{a.acc}%</div>
            </div>
          </div>
          <div style={{marginBottom:6}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:px(12)}}>
              <span style={{color:V.muted}}>Training ({epochs}/50 epochs)</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:AMB}}>{curAcc}%</span>
            </div>
            <div style={{background:V.cream,borderRadius:6,height:8,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(epochs/50)*100}%`,
                background:`linear-gradient(90deg,${AMB},${GRN})`,borderRadius:6,transition:"width 0.1s"}}/>
            </div>
          </div>
          <div style={{background:"#0c0700",borderRadius:10,padding:"12px",
            fontFamily:"monospace",fontSize:px(11),lineHeight:1.9}}>
            <div style={{color:"#475569"}}>Epoch {epochs}/50</div>
            <div>accuracy: <span style={{color:GRN,fontWeight:700}}>{curAcc}%</span></div>
            <div>val_loss: <span style={{color:AMB,fontWeight:700}}>{curLoss.toFixed(4)}</span></div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={training?()=>{}:startTrain} disabled={training||epochs>=50}
              style={{flex:1,background:epochs>=50?GRN:AMB,border:"none",borderRadius:10,
                padding:"10px",color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                opacity:training?0.6:1}}>
              {training?"Training...":epochs>=50?"✅ Done!":"▶ Train"}
            </button>
            <button onClick={reset}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:10,
                padding:"10px 14px",color:V.muted,fontSize:px(11),cursor:"pointer"}}>↺</button>
          </div>
          {epochs>=50&&(
            <div style={{background:GRN+"0d",border:`2px solid ${GRN}`,borderRadius:12,padding:"12px",textAlign:"center"}}>
              <div style={{fontWeight:800,fontSize:px(18),color:GRN}}>{a.acc}% Test Accuracy</div>
              <div style={{fontSize:px(11),color:V.muted,marginTop:4}}>
                {a.acc>=85?"🏆 Research-grade CNN":a.acc>=75?"✅ Strong baseline":"💪 Good start — try deeper"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ FIND THE FEATURE GAME ═════════════════════════════════════ */
const FindFeatureGame=()=>{
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const [total,setTotal]=useState(0);

  const QS=[
    {img:"5×5 grid with a horizontal bright band across row 2",
     q:"Which filter would most activate here?",
     ans:"Horizontal edge detector",
     opts:["Vertical edge detector","Horizontal edge detector","Blur filter","Sharpening filter"],
     why:"A horizontal edge filter ([-1,-1,-1],[0,0,0],[1,1,1]) responds maximally to transitions between dark and light rows — exactly a horizontal bright band.",
     c:AMB},
    {img:"3×3 bright diagonal from top-left to bottom-right",
     q:"A 45° diagonal line. Which CNN layer feature is detected?",
     ans:"Diagonal edge filter",
     opts:["Max pooling","Diagonal edge filter","Flatten layer","Softmax output"],
     why:"Convolutional filters can detect any orientation. Diagonal filters ([1,0,0],[0,1,0],[0,0,1]) respond to diagonal structure — learned automatically during training.",
     c:VIO},
    {img:"Feature map with 4 bright regions at corners",
     q:"After max pooling 8×8→4×4, output has bright spots only where?",
     ans:"Wherever the maximum value was in each 2×2 block",
     opts:["Centre of image","Wherever the maximum value was in each 2×2 block","Random positions","Along all edges"],
     why:"Max pooling takes the maximum value from each non-overlapping window. It preserves the strongest activations while discarding exact position — giving translation invariance.",
     c:GRN},
    {img:"A photo of a cat face going through 5 conv layers",
     q:"What features are typically learned at different depths?",
     ans:"Layer 1: edges; Layer 3: textures; Layer 5: object parts",
     opts:["Same edges at all layers","Layer 1: whole objects; Layer 5: pixels","Layer 1: edges; Layer 3: textures; Layer 5: object parts","Colour gradients only"],
     why:"Deep CNNs build hierarchical representations. Early layers detect low-level edges, mid layers detect textures/patterns, deep layers detect semantic object parts and whole objects. This is the key power of depth.",
     c:CYN},
  ];
  const q=QS[step%QS.length];
  const choose=(opt)=>{
    if(chosen)return;
    setChosen(opt);
    setTotal(t=>t+1);
    if(opt===q.ans)setScore(s=>s+1);
  };

  return (
    <div style={{...LCARD,background:"#fffbeb",border:`2px solid ${AMB}22`}}>
      <div style={{fontWeight:800,color:AMB,fontSize:px(17),marginBottom:8}}>
        🎮 Find the Feature — CNN knowledge challenge
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Four scenarios from real CNN architectures. Score: <strong style={{color:AMB}}>{score}/{total}</strong>
      </p>
      <div style={{background:AMB+"0d",border:`2px solid ${AMB}33`,borderRadius:14,
        padding:"16px",marginBottom:18}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
          <div style={{background:AMB+"22",borderRadius:10,padding:"12px",
            fontFamily:"monospace",fontSize:px(11),color:AMB,minWidth:140,lineHeight:1.8}}>
            🖼️ Image scene:<br/>{q.img}
          </div>
          <div>
            <div style={{fontWeight:700,color:AMB,fontSize:px(13),marginBottom:6}}>
              Q{step%4+1}/4: {q.q}
            </div>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {q.opts.map(opt=>{
          const isCorrect=opt===q.ans,isChosen=opt===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isCorrect){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChosen&&!isCorrect){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          else if(isChosen){bg=AMB+"22";border=`2px solid ${AMB}`;col=AMB;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"10px 12px",
                cursor:chosen?"default":"pointer",fontWeight:600,fontSize:px(12),
                color:col,textAlign:"left",transition:"all 0.2s"}}>
              {show&&isCorrect?"✅ ":show&&isChosen&&!isCorrect?"❌ ":""}{opt}
            </button>
          );
        })}
      </div>
      {chosen&&(
        <div>
          <div style={{background:chosen===q.ans?GRN+"0d":ROSE+"0d",
            border:`2px solid ${chosen===q.ans?GRN:ROSE}`,borderRadius:12,
            padding:"14px",marginBottom:10}}>
            <div style={{fontWeight:800,color:chosen===q.ans?GRN:ROSE,fontSize:px(14),marginBottom:4}}>
              {chosen===q.ans?"✅ Correct!":"❌ Not quite — ✅ Answer: "+q.ans}
            </div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{q.why}</p>
          </div>
          <button onClick={()=>{setChosen(null);setStep(s=>s+1);}}
            style={{background:AMB,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%4<3?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════════ */
const CNNTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🖼️",c:AMB,t:"CNNs exploit spatial structure. A 224×224 RGB image has 150,528 inputs — a fully-connected layer would need billions of weights. CNNs use local filters (e.g., 3×3=9 weights) slid across the image, sharing parameters spatially."},
    {e:"🔍",c:VIO,t:"Convolution: Output(i,j) = ΣΣ Input(i+m, j+n) × Kernel(m,n). One filter produces one feature map. 32 filters = 32 feature maps. Padding='same' keeps spatial dimensions; padding='valid' reduces them by kernel_size−1."},
    {e:"📉",c:GRN,t:"Max pooling reduces spatial size (e.g., 28×28→14×14 with 2×2 pool). Discards exact position, retains presence — translation invariance. Also reduces computation and parameters in subsequent layers by 4× per pooling step."},
    {e:"🔬",c:CYN,t:"Hierarchical features: Layer 1 learns edges (Gabor-like), Layer 2 learns textures and corners, Layer 3 learns object parts, deep layers learn semantic concepts. This is why transfer learning works — early features are universal."},
    {e:"⚡",c:ORG,t:"Parameter sharing is the key efficiency: a 3×3 filter applied to a 224×224 image uses only 9 weights regardless of image size. The same 9 weights detect the same feature everywhere — unlike FC which needs separate weights per position."},
    {e:"🏗️",c:IND,t:"Famous architectures: LeNet-5 (1998, 5 layers), AlexNet (2012, 8 layers, ReLU), VGG-16 (2014, 16 layers, 3×3 only), ResNet-50 (2015, skip connections), EfficientNet (2019, compound scaling). Each era brought deeper, more accurate networks."},
    {e:"⚠️",c:ROSE,t:"Pitfall: CNNs are not invariant to rotation or large scale changes. A cat turned upside down may not be recognised. Data augmentation (random flips, rotations, crops) during training reduces this. Vision Transformers (ViT) partially address it."},
    {e:"🚀",c:TEAL,t:"Modern twist: depthwise separable convolutions (MobileNet) reduce computation 8-9×. Dilated convolutions expand receptive field without adding parameters. Attention mechanisms in CNNs (CBAM) weight which channels/positions to focus on."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",AMB)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:AMB}}>Know</span></h2>
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
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${AMB},${GRN})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:AMB,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Next: RNNs →</button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ═════════════════════════════════════════════════ */
const CNNsPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Convolutional Neural Networks" lessonNum="Lesson 4 of 7"
    accent={AMB} levelLabel="Deep Learning"
    dotLabels={["Hero","Why CNNs","Intuition","Convolution Math","Architecture","Pooling","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#0a0500 0%,#291a00 60%,#0c0800 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🖼️ Lesson 4 of 7 · Deep Learning",AMB)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Convolutional<br/><span style={{color:"#fcd34d"}}>Neural Networks</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:AMB,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The architecture that gave machines eyes. CNNs power every face-recognition
                system, medical imaging tool, autonomous vehicle, and photo search engine.
                By sliding learned filters across images, they discover edges, textures, and
                objects — without being told what to look for.
              </p>
              <div style={{background:"rgba(217,119,6,0.12)",border:"1px solid rgba(217,119,6,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#fcd34d",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE IDEA</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Instead of connecting every pixel to every neuron, CNN filters scan locally.
                  Each filter learns to detect one pattern (edge, colour blob, texture) everywhere
                  in the image. Stack enough layers and the network sees the whole picture.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(217,119,6,0.06)",border:"1px solid rgba(217,119,6,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 WHY CNNs */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why CNNs Were Invented",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The Problem with <span style={{color:AMB}}>Pixels</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  A standard 224×224 RGB image has 224×224×3 = <strong>150,528 input values</strong>.
                  If the first hidden layer has 1,024 neurons, a fully-connected layer requires
                  150,528 × 1,024 = <strong>154 million weights</strong> — just for one layer.
                  A full ImageNet-class network would need billions of parameters.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  Beyond the parameter explosion, FC layers ignore spatial structure entirely.
                  A cat in the top-left corner and a cat in the bottom-right look completely
                  different to an FC layer — it has no concept of "nearby pixels are related."
                </p>
                {[
                  {p:"Parameters (FC, 1st layer)",fc:"154M",cnn:"9K (3×3×32 filters)",w:"cnn"},
                  {p:"Spatial awareness",fc:"❌ None",cnn:"✅ Local receptive fields",w:"cnn"},
                  {p:"Translation invariance",fc:"❌ None — position-sensitive",cnn:"✅ Filter slides everywhere",w:"cnn"},
                  {p:"Scalable to large images",fc:"❌ Explodes with size",cnn:"✅ Same filters, any size",w:"cnn"},
                  {p:"Hierarchical features",fc:"❌ Single linear transform",cnn:"✅ Edges→Textures→Objects",w:"cnn"},
                ].map(row=>(
                  <div key={row.p} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:6,
                    marginBottom:5,padding:"5px 0",borderBottom:`1px solid ${V.border}`}}>
                    <span style={{fontSize:px(11),color:V.ink}}>{row.p}</span>
                    <span style={{fontSize:px(11),color:row.w==="fc"?GRN:V.muted,textAlign:"center"}}>{row.fc}</span>
                    <span style={{fontSize:px(11),color:row.w==="cnn"?AMB:V.muted,fontWeight:row.w==="cnn"?700:400,textAlign:"center"}}>{row.cnn}</span>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={AMB} title="Yann LeCun's insight (1989)"
                  body="LeNet, the first practical CNN, solved handwritten digit recognition with 60K parameters — vs millions needed by FC approaches. The key insight: nearby pixels are correlated. Exploit this by connecting each neuron only to a small local patch. Reuse the same filter everywhere (weight sharing). This reduces parameters by 1000× while preserving spatial reasoning."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:AMB,marginBottom:10,fontSize:px(13)}}>CNN's Three Inductive Biases</div>
                  {[
                    {icon:"📍",t:"Local connectivity",d:"Each neuron looks at a small patch (receptive field), not the whole image. Nearby pixels are more relevant to each other."},
                    {icon:"🔄",t:"Weight sharing",d:"The same filter weights are used at every position. Detects the same pattern regardless of where it appears."},
                    {icon:"📊",t:"Hierarchical pooling",d:"Progressively reduce spatial resolution, increase depth (channels). Each layer sees a wider view of the image."},
                  ].map(item=>(
                    <div key={item.t} style={{display:"flex",gap:10,marginBottom:10}}>
                      <span style={{fontSize:px(22)}}>{item.icon}</span>
                      <div><span style={{fontWeight:700,color:AMB,fontSize:px(13)}}>{item.t}: </span>
                      <span style={{fontSize:px(13),color:V.muted}}>{item.d}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 INTUITION */}
        <div ref={R(2)} style={{background:"#0a0500"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · The Flashlight Analogy","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>A Filter is a <span style={{color:"#fcd34d"}}>Pattern Detector</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Imagine you're reading a painting in a dark room with a flashlight.
                  You shine it at each small patch of the canvas in sequence — left to right,
                  top to bottom. At each position, you ask one question: "Is there a horizontal
                  edge here?" Your flashlight is a convolutional filter.
                </p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  In practice, a network uses 32, 64, or 128 different flashlights
                  simultaneously — each searching for a different pattern. One filter finds
                  horizontal edges. Another finds vertical edges. Another finds blue-to-red
                  colour gradients. The network learns which flashlights to build from data.
                </p>
                {[
                  {layer:"Layer 1 filters",examples:"Edges (↔ ↕ ↗ ↘), Colour blobs, Gabor patterns",c:AMB},
                  {layer:"Layer 2 filters",examples:"Corners, T-junctions, simple curves, grid textures",c:VIO},
                  {layer:"Layer 3 filters",examples:"Object parts: eyes, wheels, windows, fur patches",c:CYN},
                  {layer:"Layer 4+ filters",examples:"Semantic concepts: face, car, text, sky regions",c:GRN},
                ].map(row=>(
                  <div key={row.layer} style={{borderLeft:`3px solid ${row.c}`,paddingLeft:12,marginBottom:10}}>
                    <div style={{fontWeight:700,color:row.c,fontSize:px(12)}}>{row.layer}</div>
                    <div style={{fontSize:px(12),color:"#64748b"}}>{row.examples}</div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color="#fcd34d" title="Visualised CNN filters (Zeiler & Fergus 2014)"
                  body="The first paper to visualise what CNN filters actually learn (DeconvNet) showed Layer 1 of AlexNet learned Gabor-like edge detectors — almost identical to neurons in the human visual cortex (V1). This wasn't programmed — it emerged from training on 1.2 million images. The CNN rediscovered the same feature detectors evolution took millions of years to develop."/>
                <div style={{...LCARD,marginTop:14,background:"#1a1000",border:`1px solid ${AMB}33`}}>
                  <div style={{fontWeight:700,color:"#fcd34d",marginBottom:10,fontSize:px(13)}}>🔬 How features grow richer</div>
                  {[
                    {icon:"→",from:"Pixel (0-255 intensity)",to:"Edge presence score",c:AMB},
                    {icon:"→",from:"Edge map",to:"Corner/junction map",c:VIO},
                    {icon:"→",from:"Junction map",to:"Object part map",c:CYN},
                    {icon:"→",from:"Part map",to:"Class probability (cat=0.97)",c:GRN},
                  ].map((row,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"center"}}>
                      <span style={{color:row.c,fontWeight:700,fontSize:px(18)}}>{row.icon}</span>
                      <div style={{fontSize:px(12)}}>
                        <span style={{color:"#64748b"}}>{row.from}</span>
                        <span style={{color:row.c,fontWeight:700}}> → {row.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S3 CONVOLUTION MATH */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Convolution Operation",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The <span style={{color:AMB}}>Mathematics</span></h2>
            <Formula color={AMB}>Output(i,j) = Σₘ Σₙ Input(i+m, j+n) × Kernel(m, n) + bias</Formula>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(24)}}>
              Drag your cursor over the input below to position the filter and see the exact computation.
              Each output pixel is the weighted sum of a local patch — called a "dot product."
            </p>
            <ConvolutionExplorer/>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(16),marginTop:px(24)}}>
              {[
                {t:"Stride",c:AMB,d:"How many pixels the filter moves each step. Stride=1: output same as input (with padding). Stride=2: output half size. Larger stride → faster, less spatial detail."},
                {t:"Padding",c:VIO,d:"Padding='same': zero-pad input to keep output same spatial size. Padding='valid': no padding, output shrinks by kernel_size-1 per side. Both are valid choices."},
                {t:"Channels",c:GRN,d:"RGB image: 3 input channels. A 3×3 filter for RGB is actually 3×3×3=27 numbers. 64 such filters = 27×64=1728 weights + 64 biases. Output has 64 feature channels."},
              ].map(item=>(
                <div key={item.t} style={{...LCARD,borderTop:`4px solid ${item.c}`}}>
                  <div style={{fontWeight:800,color:item.c,fontSize:px(15),marginBottom:6}}>{item.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S4 ARCHITECTURE */}
        <div ref={R(4)} style={{background:"#0a0500"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · CNN Architecture","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Layer by <span style={{color:"#fcd34d"}}>Layer</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {l:"Conv2D",icon:"🔍",c:AMB,
                    d:"Applies F learned filters, each of size K×K×C_in. Produces F feature maps. The core computation: learnable spatial pattern detectors. Typical: 3×3, 32-512 filters."},
                  {l:"BatchNormalization",icon:"📊",c:VIO,
                    d:"Normalises each feature map to mean=0, var=1. Stabilises training, allows higher learning rates, reduces dependence on initialisation. Placed after Conv2D, before activation."},
                  {l:"Activation (ReLU)",icon:"⚡",c:GRN,
                    d:"Applied element-wise after each conv. Introduces non-linearity. ReLU(x)=max(0,x). Without activation, conv layers collapse to one linear operation."},
                  {l:"MaxPooling2D",icon:"📉",c:CYN,
                    d:"Typically 2×2 with stride 2. Reduces spatial size by 2× in each dimension. Provides translation invariance and reduces computation. Alternative: use stride-2 convolutions."},
                  {l:"Flatten",icon:"→",c:IND,
                    d:"Converts the 3D feature tensor (H×W×C) to a 1D vector for the FC classifier. For a 7×7×512 tensor: 7×7×512=25,088 values."},
                  {l:"Dense (FC)",icon:"🎯",c:PNK,
                    d:"Standard fully-connected layer. Learns which combination of features predicts which class. Usually 1-2 FC layers before the final softmax. Often paired with Dropout(0.5)."},
                ].map(item=>(
                  <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",gap:12}}>
                    <span style={{fontSize:px(22)}}>{item.icon}</span>
                    <div>
                      <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(13),marginBottom:4}}>{item.l}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0,color:"#94a3b8"}}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{background:"#1a1000",border:`1px solid ${AMB}33`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#fcd34d",marginBottom:10,fontSize:px(13)}}>
                    📐 Feature Map Dimensions
                  </div>
                  <div style={{fontFamily:"monospace",fontSize:px(11),lineHeight:2.2,color:"#94a3b8"}}>
                    <div style={{color:AMB}}>Input: (32, 32, 3)  ← H×W×Channels</div>
                    <div>Conv2D(32, 3×3, same): (32, 32, 32)</div>
                    <div>MaxPool(2×2): (16, 16, 32)</div>
                    <div>Conv2D(64, 3×3, same): (16, 16, 64)</div>
                    <div>MaxPool(2×2): (8, 8, 64)</div>
                    <div>Conv2D(128, 3×3, same): (8, 8, 128)</div>
                    <div>MaxPool(2×2): (4, 4, 128)</div>
                    <div>Flatten: (2048,)</div>
                    <div>Dense(256): (256,)</div>
                    <div style={{color:GRN}}>Dense(10, softmax): (10,) ← logits</div>
                  </div>
                </div>
                <IBox color="#fcd34d" title="Receptive field"
                  body="Each neuron in Layer 3 'sees' a region of the original image called its receptive field. With 3×3 filters: Layer 1 sees 3×3 pixels; Layer 2 sees 5×5; Layer 3 sees 7×7. With max pooling, this doubles: after 2 pooling layers, a 3×3 neuron sees 24×24 of the original image. Deep networks with pooling develop very large receptive fields."/>
              </div>
            </div>
          </div>
        </div>

        {/* S5 POOLING */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Pooling Layers",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>Spatial <span style={{color:AMB}}>Downsampling</span></h2>
            <PoolingDemo/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <IBox color={AMB} title="Why Max Pooling works"
                body="Max pooling keeps the strongest activation in each region. If a feature detector fires strongly anywhere in a 2×2 patch, the pooled value is high — regardless of exact position. This gives approximate translation invariance: moving a feature 1-2 pixels doesn't change the network's response. This is crucial for recognising objects in varying positions."/>
              <IBox color={GRN} title="Modern alternatives to pooling"
                body="Stride-2 convolutions replace max pooling in many modern architectures (e.g., ResNet v2, EfficientNet). The convolution learns how to downsample rather than using a fixed rule. Global Average Pooling (GAP) replaces Flatten+FC in the final layer — averages each feature map to a single value, dramatically reducing parameters and overfitting."/>
            </div>
          </div>
        </div>

        {/* S6 PYTHON */}
        <div ref={R(6)} style={{background:"#0a0500"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python with TensorFlow/Keras","#fcd34d")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Building a <span style={{color:"#fcd34d"}}>CNN in Keras</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={AMB} lines={[
                "import tensorflow as tf",
                "from tensorflow.keras import layers, models",
                "","# ── VGG-style CNN ─────────────────────",
                "model = models.Sequential([",
                "  # Block 1",
                "  layers.Conv2D(32, (3,3), padding='same',",
                "    activation='relu',",
                "    input_shape=(32, 32, 3)),",
                "  layers.Conv2D(32, (3,3), activation='relu'),",
                "  layers.MaxPooling2D(2, 2),",
                "  layers.Dropout(0.25),",
                "  # Block 2",
                "  layers.Conv2D(64, (3,3), padding='same',",
                "    activation='relu'),",
                "  layers.Conv2D(64, (3,3), activation='relu'),",
                "  layers.MaxPooling2D(2, 2),",
                "  layers.Dropout(0.25),",
                "  # Classifier",
                "  layers.Flatten(),",
                "  layers.Dense(512, activation='relu'),",
                "  layers.Dropout(0.5),",
                "  layers.Dense(10, activation='softmax')",
                "])","",
                "model.compile(",
                "  optimizer=tf.keras.optimizers.Adam(1e-3),",
                "  loss='sparse_categorical_crossentropy',",
                "  metrics=['accuracy']",
                ")","","# Data augmentation — crucial for CNNs",
                "datagen = tf.keras.preprocessing.image.ImageDataGenerator(",
                "  rotation_range=15,",
                "  width_shift_range=0.1,",
                "  height_shift_range=0.1,",
                "  horizontal_flip=True",
                ")","","# Transfer learning with ResNet50",
                "base = tf.keras.applications.ResNet50(",
                "  weights='imagenet', include_top=False,",
                "  input_shape=(224,224,3))",
                "base.trainable = False   # freeze base",
                "x = base.output",
                "x = layers.GlobalAveragePooling2D()(x)",
                "x = layers.Dense(256, activation='relu')(x)",
                "out = layers.Dense(10, activation='softmax')(x)",
                "model = tf.keras.Model(base.input, out)",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"Conv2D(32,(3,3),padding='same')",c:AMB,d:"32 filters, 3×3 kernel, zero-padding to maintain spatial size. Total params: 3×3×input_channels×32 + 32 biases."},
                  {l:"MaxPooling2D(2,2)",c:GRN,d:"2×2 window, stride=2 by default. Halves H and W. No learned parameters — a fixed operation."},
                  {l:"Dropout(0.25/0.5)",c:VIO,d:"25% in conv blocks, 50% before final FC. Randomly zeros neurons during training — prevents co-adaptation and overfitting."},
                  {l:"ImageDataGenerator",c:CYN,d:"Real-time data augmentation: random crops, flips, colour jitter. The single most effective regularisation for CNNs. Always use on training data."},
                  {l:"ResNet50(weights='imagenet')",c:IND,d:"Transfer learning: use weights pre-trained on 1.2M ImageNet images. Freeze base layers, train only new classifier head. Achieves 90%+ on new datasets with <1000 samples."},
                  {l:"GlobalAveragePooling2D()",c:PNK,d:"Reduces H×W×C to 1×1×C by averaging each feature map. Replaces Flatten + large Dense layer. Reduces overfitting and parameters dramatically."},
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

        {/* S7 APPLICATIONS */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Real-World Applications",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>CNNs <span style={{color:AMB}}>Power the World</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🏥",c:ROSE,t:"Medical Imaging",b:"CheXNet (Stanford) detects pneumonia from chest X-rays better than radiologists. Google's CNN detects diabetic retinopathy from eye scans. Pathology slide analysis, MRI segmentation, skin cancer detection. FDA-approved medical imaging AI uses CNNs.",arch:"Dense121, U-Net, ResNet"},
                {e:"🚗",c:AMB,t:"Autonomous Vehicles",b:"Tesla's vision-only FSD processes 8 cameras at 36fps. Object detection (YOLO, SSD) identifies pedestrians, vehicles, signs in real time. Lane detection, depth estimation, semantic segmentation — all CNN-based.",arch:"YOLO, EfficientDet, BEVNet"},
                {e:"📱",c:VIO,t:"Face Recognition",b:"DeepFace (Meta) achieves 97.35% accuracy on LFW benchmark — surpassing human recognition (97.53%). iPhone Face ID uses 3D-sensing CNN. WeChat Pay authenticates 1 billion users via face.",arch:"FaceNet, ArcFace, DeepFace"},
                {e:"🔬",c:GRN,t:"Scientific Discovery",b:"AlphaFold 2 uses CNN + attention to predict protein 3D structure from sequence — solved the 50-year protein folding problem. Materials science: predicting crystal properties. Astronomy: classifying galaxy morphologies from telescope images.",arch:"CNN + Transformer hybrids"},
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

        {/* S8 GAME */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Mini Game",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Find the Feature</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Test your understanding of CNN feature detection. Four challenges covering
              filters, pooling, and the hierarchy of learned representations.
            </p>
            <FindFeatureGame/>
          </div>
        </div>

        {/* S9 PROJECT */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Project",AMB)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🖼️ CIFAR-10 <span style={{color:AMB}}>Image Classifier</span></h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Three architectures, same dataset. Choose your CNN complexity, train,
              and compare accuracy scores. Deeper architectures with batch norm achieve
              significantly better results — but need more training time.
            </p>
            <CIFARProject/>
          </div>
        </div>

        {/* S10 INSIGHTS */}
        <div ref={R(10)} style={{background:V.cream}}>
          <CNNTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default CNNsPage;
