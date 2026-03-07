import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — EMBEDDINGS
   Level 5 · Modern AI Systems · Lesson 2 of 5
   Accent: Violet #8b5cf6
══════════════════════════════════════════════════════════════════ */
const VIO  = "#8b5cf6";
const IND  = "#4f46e5";
const PNK  = "#ec4899";
const GRN  = "#059669";
const AMB  = "#d97706";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula = ({children,color=VIO})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=VIO})=>(
  <div style={{fontFamily:"monospace",background:"#070012",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — vector space ══════════════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize();window.addEventListener("resize",resize);
    // word clusters
    const WORDS=[
      {w:"king",x:0.55,y:0.25,c:"#a78bfa"},{w:"queen",x:0.70,y:0.22,c:"#a78bfa"},
      {w:"man",x:0.50,y:0.40,c:"#6ee7b7"},{w:"woman",x:0.65,y:0.38,c:"#6ee7b7"},
      {w:"dog",x:0.20,y:0.60,c:"#fbbf24"},{w:"cat",x:0.25,y:0.55,c:"#fbbf24"},
      {w:"Paris",x:0.75,y:0.65,c:"#f9a8d4"},{w:"France",x:0.82,y:0.58,c:"#f9a8d4"},
      {w:"Tokyo",x:0.78,y:0.75,c:"#f9a8d4"},{w:"Japan",x:0.85,y:0.70,c:"#f9a8d4"},
      {w:"AI",x:0.35,y:0.30,c:"#93c5fd"},{w:"ML",x:0.42,y:0.28,c:"#93c5fd"},
    ];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#070012";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(139,92,246,0.04)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // cluster halos
      [[0.62,0.23,"#a78bfa"],[0.57,0.38,"#6ee7b7"],[0.22,0.57,"#fbbf24"],[0.80,0.65,"#f9a8d4"],[0.38,0.29,"#93c5fd"]].forEach(([cx,cy,col])=>{
        const g=ctx.createRadialGradient(cx*W,cy*H,0,cx*W,cy*H,55+Math.sin(t+cx)*10);
        g.addColorStop(0,col+"22");g.addColorStop(1,col+"00");
        ctx.beginPath();ctx.arc(cx*W,cy*H,55+Math.sin(t+cx)*10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      });
      // vector arithmetic arrow: king - man + woman → queen
      const k=WORDS[0],q=WORDS[1],m=WORDS[2],wo=WORDS[3];
      ctx.beginPath();ctx.moveTo(k.x*W,k.y*H);ctx.lineTo(q.x*W,q.y*H);
      ctx.strokeStyle="#a78bfa55";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();
      ctx.beginPath();ctx.moveTo(m.x*W,m.y*H);ctx.lineTo(wo.x*W,wo.y*H);
      ctx.strokeStyle="#6ee7b755";ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
      // words
      WORDS.forEach(({w,x,y,c})=>{
        const wx=x*W,wy=y*H;
        const pulse=(Math.sin(t*0.7+x*8)+1)/2;
        ctx.beginPath();ctx.arc(wx,wy,4+pulse*2,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
        ctx.font=`bold ${px(10)} sans-serif`;ctx.fillStyle=c;ctx.textAlign="center";
        ctx.fillText(w,wx,wy-12);
      });
      ctx.font=`${px(9)} sans-serif`;ctx.fillStyle="#312065";ctx.textAlign="left";
      ctx.fillText("king − man + woman ≈ queen",16,H-10);
      t+=0.025;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ VECTOR SPACE CANVAS ══════════════════════════════════════ */
const VectorSpaceCanvas=()=>{
  const ref=useRef();
  const [selected,setSelected]=useState(null);
  const WORDS_MAP={
    king:{x:0.58,y:0.22,c:"#a78bfa",group:"royalty"},
    queen:{x:0.73,y:0.19,c:"#a78bfa",group:"royalty"},
    prince:{x:0.62,y:0.30,c:"#a78bfa",group:"royalty"},
    man:{x:0.52,y:0.40,c:"#6ee7b7",group:"person"},
    woman:{x:0.67,y:0.38,c:"#6ee7b7",group:"person"},
    boy:{x:0.48,y:0.48,c:"#6ee7b7",group:"person"},
    girl:{x:0.64,y:0.46,c:"#6ee7b7",group:"person"},
    dog:{x:0.18,y:0.62,c:"#fbbf24",group:"animal"},
    cat:{x:0.25,y:0.57,c:"#fbbf24",group:"animal"},
    wolf:{x:0.14,y:0.70,c:"#fbbf24",group:"animal"},
    Paris:{x:0.78,y:0.68,c:"#f9a8d4",group:"city"},
    London:{x:0.82,y:0.60,c:"#f9a8d4",group:"city"},
    Tokyo:{x:0.75,y:0.78,c:"#f9a8d4",group:"city"},
    AI:{x:0.32,y:0.28,c:"#93c5fd",group:"tech"},
    ML:{x:0.40,y:0.25,c:"#93c5fd",group:"tech"},
    neural:{x:0.36,y:0.35,c:"#93c5fd",group:"tech"},
  };
  const cos=(a,b)=>{
    const ax=a.x,ay=a.y,bx=b.x,by=b.y;
    const dot=ax*bx+ay*by;
    const na=Math.sqrt(ax*ax+ay*ay);
    const nb=Math.sqrt(bx*bx+by*by);
    return dot/(na*nb||1);
  };
  const dist=(a,b)=>Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);

  const ranked=selected?Object.entries(WORDS_MAP)
    .filter(([w])=>w!==selected)
    .map(([w,d])=>({w,sim:1-dist(WORDS_MAP[selected],d)*2}))
    .sort((a,b)=>b.sim-a.sim).slice(0,5):[];

  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f5f3ff";ctx.fillRect(0,0,W,H);
    // axes
    ctx.strokeStyle="#e5e7eb";ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // similarity lines
    if(selected){
      const s=WORDS_MAP[selected];
      ranked.forEach(({w,sim})=>{
        const t=WORDS_MAP[w];
        ctx.beginPath();ctx.moveTo(s.x*W,s.y*H);ctx.lineTo(t.x*W,t.y*H);
        ctx.strokeStyle=VIO+Math.round(Math.max(0,sim)*200).toString(16).padStart(2,"0");
        ctx.lineWidth=Math.max(0,sim)*4;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
      });
    }
    // points
    Object.entries(WORDS_MAP).forEach(([w,{x,y,c,group}])=>{
      const wx=x*W,wy=y*H;
      const isSel=w===selected;
      const isNear=ranked.some(r=>r.w===w);
      ctx.beginPath();ctx.arc(wx,wy,isSel?10:isNear?7:5,0,Math.PI*2);
      ctx.fillStyle=c;ctx.fill();
      if(isSel){ctx.strokeStyle=VIO;ctx.lineWidth=3;ctx.stroke();}
      ctx.font=`${isSel?"bold ":""}${px(10)} sans-serif`;
      ctx.fillStyle=isSel?VIO:"#374151";ctx.textAlign="center";
      ctx.fillText(w,wx,wy-14);
    });
  },[selected]);

  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:px(16)}}>
      <div>
        <canvas ref={ref} onClick={e=>{
          const c=ref.current;if(!c)return;
          const r=c.getBoundingClientRect();
          const mx=(e.clientX-r.left)*(c.width/r.width)/c.width;
          const my=(e.clientY-r.top)*(c.height/r.height)/c.height;
          let best=null,bd=999;
          Object.entries(WORDS_MAP).forEach(([w,{x,y}])=>{
            const d=Math.sqrt((mx-x)**2+(my-y)**2);
            if(d<bd){bd=d;best=w;}
          });
          if(bd<0.07)setSelected(best===selected?null:best);
        }} style={{width:"100%",height:320,borderRadius:14,display:"block",
          border:`2px solid ${VIO}22`,cursor:"pointer"}}/>
        <p style={{...LBODY,fontSize:px(11),color:V.muted,textAlign:"center",marginTop:4}}>
          Click any word to see its nearest neighbours in vector space
        </p>
      </div>
      <div>
        {selected?(
          <div style={{background:VIO+"0d",border:`2px solid ${VIO}33`,borderRadius:14,padding:"14px"}}>
            <div style={{fontWeight:800,color:VIO,fontSize:px(14),marginBottom:10}}>
              "{selected}" — nearest neighbours
            </div>
            {ranked.map(({w,sim},i)=>(
              <div key={w} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2,fontSize:px(12)}}>
                  <span style={{fontWeight:i===0?700:400,color:i===0?VIO:V.muted}}>{i+1}. {w}</span>
                  <span style={{fontFamily:"monospace",color:VIO,fontWeight:700,fontSize:px(11)}}>
                    {(sim*100).toFixed(0)}%
                  </span>
                </div>
                <div style={{background:V.cream,borderRadius:4,height:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.max(0,sim)*100}%`,
                    background:VIO,borderRadius:4}}/>
                </div>
              </div>
            ))}
            <div style={{marginTop:10,fontSize:px(11),color:V.muted,fontFamily:"monospace",
              background:"#ede9fe",borderRadius:8,padding:"8px"}}>
              Group: <span style={{color:VIO,fontWeight:700}}>
                {WORDS_MAP[selected].group}
              </span>
            </div>
          </div>
        ):(
          <div style={{background:VIO+"0d",border:`2px solid ${VIO}22`,borderRadius:14,
            padding:"14px",textAlign:"center",color:V.muted,fontSize:px(13)}}>
            <div style={{fontSize:px(32),marginBottom:8}}>🖱️</div>
            Click a word to explore its semantic neighbourhood
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════ VECTOR ARITHMETIC DEMO ══════════════════════════════════ */
const VectorArithmeticDemo=()=>{
  const ANALOGIES=[
    {a:"king",b:"man",c:"woman",ans:"queen",explain:"Gender analogy: king is to man as queen is to woman"},
    {a:"Paris",b:"France",c:"Japan",ans:"Tokyo",explain:"Capital city analogy: Paris is the capital of France, Tokyo is the capital of Japan"},
    {a:"bigger",b:"big",c:"small",ans:"smaller",explain:"Comparative form: bigger→big reversed and applied to small → smaller"},
    {a:"walking",b:"walk",c:"swim",ans:"swimming",explain:"Present participle: removing -ing suffix and applying to new base verb"},
    {a:"doctor",b:"hospital",c:"teacher",ans:"school",explain:"Workplace analogy: doctors work in hospitals, teachers work in schools"},
    {a:"cat",b:"kitten",c:"dog",ans:"puppy",explain:"Baby animal: kitten is a baby cat, puppy is a baby dog"},
  ];
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const q=ANALOGIES[step%ANALOGIES.length];
  const OPTS=[q.ans, ...["prince","Berlin","greatest","running","nurse","cub"].filter(w=>w!==q.ans).slice(0,3)].sort(()=>Math.random()-0.5);
  const [shuffled]=useState(()=>OPTS);

  const choose=opt=>{
    if(chosen)return;
    setChosen(opt);
    if(opt===q.ans)setScore(s=>s+1);
  };

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`}}>
      <div style={{fontWeight:800,color:VIO,fontSize:px(16),marginBottom:8}}>
        🧮 Vector Arithmetic — Word Analogy Challenge
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Classic word2vec arithmetic: <strong style={{color:VIO}}>A − B + C = ?</strong>
        Find the word that completes the analogy. Score: <strong style={{color:VIO}}>{score}/{step%6===0&&step>0?6:step%6}</strong>
      </p>
      <div style={{background:VIO+"0d",border:`2px solid ${VIO}33`,borderRadius:14,
        padding:"18px",marginBottom:18,textAlign:"center"}}>
        <div style={{fontFamily:"monospace",fontSize:px(22),color:VIO,fontWeight:900,marginBottom:8}}>
          <span style={{color:AMB}}>{q.a}</span>
          <span style={{color:V.muted}}> − </span>
          <span style={{color:GRN}}>{q.b}</span>
          <span style={{color:V.muted}}> + </span>
          <span style={{color:CYN}}>{q.c}</span>
          <span style={{color:V.muted}}> = </span>
          <span style={{color:chosen?VIO:V.border}}>?</span>
        </div>
        <div style={{fontSize:px(11),color:V.muted}}>
          "{q.a}" is to "{q.b}" as what is to "{q.c}"?
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {OPTS.map(opt=>{
          const isAns=opt===q.ans,isChos=opt===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isAns){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChos&&!isAns){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"12px",cursor:chosen?"default":"pointer",
                fontFamily:"monospace",fontWeight:700,fontSize:px(16),color:col,transition:"all 0.2s"}}>
              {show&&isAns?"✅ ":show&&isChos&&!isAns?"❌ ":""}{opt}
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
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{q.explain}</p>
            <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted,marginTop:6}}>
              In embedding space: vec({q.a}) - vec({q.b}) + vec({q.c}) ≈ vec({q.ans})
            </div>
          </div>
          <button onClick={()=>{setChosen(null);setStep(s=>s+1);}}
            style={{background:VIO,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%6<5?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ EMBEDDING VISUALIZER ════════════════════════════════════ */
const EmbeddingVisualizer=()=>{
  const [method,setMethod]=useState("tsne");
  const [category,setCategory]=useState("all");
  const canvasRef=useRef();

  // Pre-computed 2D projections (mock t-SNE / PCA positions)
  const POINTS={
    // Animals
    dog:{x:0.15,y:0.60,c:"#fbbf24",cat:"animal",label:"dog"},
    cat:{x:0.22,y:0.55,c:"#fbbf24",cat:"animal",label:"cat"},
    wolf:{x:0.10,y:0.68,c:"#fbbf24",cat:"animal",label:"wolf"},
    lion:{x:0.18,y:0.72,c:"#fbbf24",cat:"animal",label:"lion"},
    bird:{x:0.28,y:0.50,c:"#fbbf24",cat:"animal",label:"bird"},
    // Royalty
    king:{x:0.60,y:0.20,c:"#a78bfa",cat:"royalty",label:"king"},
    queen:{x:0.72,y:0.18,c:"#a78bfa",cat:"royalty",label:"queen"},
    prince:{x:0.65,y:0.28,c:"#a78bfa",cat:"royalty",label:"prince"},
    princess:{x:0.75,y:0.25,c:"#a78bfa",cat:"royalty",label:"princess"},
    // Cities
    Paris:{x:0.80,y:0.65,c:"#f9a8d4",cat:"city",label:"Paris"},
    London:{x:0.85,y:0.58,c:"#f9a8d4",cat:"city",label:"London"},
    Tokyo:{x:0.78,y:0.75,c:"#f9a8d4",cat:"city",label:"Tokyo"},
    Berlin:{x:0.88,y:0.68,c:"#f9a8d4",cat:"city",label:"Berlin"},
    // Tech
    AI:{x:0.38,y:0.28,c:"#93c5fd",cat:"tech",label:"AI"},
    ML:{x:0.44,y:0.24,c:"#93c5fd",cat:"tech",label:"ML"},
    neural:{x:0.40,y:0.35,c:"#93c5fd",cat:"tech",label:"neural"},
    data:{x:0.48,y:0.30,c:"#93c5fd",cat:"tech",label:"data"},
    // Food
    pizza:{x:0.20,y:0.25,c:"#6ee7b7",cat:"food",label:"pizza"},
    burger:{x:0.14,y:0.30,c:"#6ee7b7",cat:"food",label:"burger"},
    sushi:{x:0.25,y:0.20,c:"#6ee7b7",cat:"food",label:"sushi"},
    pasta:{x:0.17,y:0.18,c:"#6ee7b7",cat:"food",label:"pasta"},
  };
  const CATS=["all","animal","royalty","city","tech","food"];
  const TSNE_OFFSET={tsne:{x:0,y:0},pca:{x:0.02,y:-0.03}};
  const off=TSNE_OFFSET[method];

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f5f3ff";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#e5e7eb";ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    Object.values(POINTS).forEach(({x,y,c,cat,label})=>{
      const show=category==="all"||category===cat;
      if(!show)return;
      const wx=(x+off.x)*W,wy=(y+off.y)*H;
      const g=ctx.createRadialGradient(wx,wy,0,wx,wy,22);
      g.addColorStop(0,c+"44");g.addColorStop(1,c+"00");
      ctx.beginPath();ctx.arc(wx,wy,22,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(wx,wy,6,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();
      ctx.font=`bold ${px(10)} sans-serif`;ctx.fillStyle="#374151";ctx.textAlign="center";
      ctx.fillText(label,wx,wy-12);
    });
    // axis labels
    ctx.font=`${px(10)} sans-serif`;ctx.fillStyle="#94a3b8";ctx.textAlign="center";
    ctx.fillText(method==="tsne"?"t-SNE dim 1":"PC1",W/2,H-6);
    ctx.save();ctx.rotate(-Math.PI/2);
    ctx.fillText(method==="tsne"?"t-SNE dim 2":"PC2",-H/2,14);
    ctx.restore();
  },[method,category]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(15)}}>
        📊 Embedding Visualizer — 768D vectors reduced to 2D
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
        Real embeddings are 768-3072 dimensional. Dimensionality reduction projects them to 2D for
        visualisation. Similar words cluster together; analogical relationships become geometric offsets.
      </p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
        <div style={{display:"flex",gap:6}}>
          {["tsne","pca"].map(m=>(
            <button key={m} onClick={()=>setMethod(m)}
              style={{background:method===m?VIO:VIO+"0d",border:`2px solid ${method===m?VIO:VIO+"22"}`,
                borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,
                fontSize:px(11),color:method===m?"#fff":VIO}}>
              {m==="tsne"?"t-SNE":"PCA"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {CATS.map(cat=>{
            const COLS={all:VIO,animal:"#fbbf24",royalty:"#a78bfa",city:"#f9a8d4",tech:"#93c5fd",food:"#6ee7b7"};
            return (
              <button key={cat} onClick={()=>setCategory(cat)}
                style={{background:category===cat?COLS[cat]:COLS[cat]+"0d",
                  border:`2px solid ${category===cat?COLS[cat]:COLS[cat]+"33"}`,borderRadius:6,
                  padding:"3px 10px",cursor:"pointer",fontWeight:700,fontSize:px(10),
                  color:category===cat?"#fff":COLS[cat]}}>
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      <canvas ref={canvasRef} style={{width:"100%",height:340,borderRadius:12,display:"block",
        border:`1px solid ${VIO}22`}}/>
    </div>
  );
};

/* ══════ SEMANTIC SEARCH PROJECT ══════════════════════════════════ */
const SemanticSearchProject=()=>{
  const DOCS=[
    {id:1,text:"The transformer architecture uses self-attention mechanisms for NLP tasks.",tags:["ML","NLP","transformers"]},
    {id:2,text:"Convolutional neural networks excel at image recognition and computer vision.",tags:["CV","CNN","images"]},
    {id:3,text:"Reinforcement learning agents learn by maximising cumulative reward signals.",tags:["RL","agents","reward"]},
    {id:4,text:"BERT is a bidirectional transformer pre-trained on masked language modelling.",tags:["BERT","NLP","pretraining"]},
    {id:5,text:"Vector databases store embeddings for fast nearest-neighbour similarity search.",tags:["vector","search","DB"]},
    {id:6,text:"Gradient descent optimises neural network weights by following loss surface gradients.",tags:["optimisation","training","GD"]},
    {id:7,text:"Attention mechanisms allow models to focus on relevant parts of the input sequence.",tags:["attention","NLP","transformers"]},
    {id:8,text:"Large language models are trained on next-token prediction over massive text corpora.",tags:["LLM","training","language"]},
  ];
  const KEYWORD_SIM={
    "transformer":[0,3,6,7],"attention":[0,3,6,7],"NLP":[0,3,6,7],
    "image":[1],"CNN":[1],"vision":[1],
    "reinforcement":[2],"reward":[2],"agent":[2],
    "BERT":[3],"bidirectional":[3],
    "vector":[4],"search":[4],"embedding":[4],
    "gradient":[5],"optimis":[5],"training":[5,7],
    "language":[0,3,7],"LLM":[7],"text":[7],
    "attention":[0,3,6],"model":[0,1,2,3,4,5,6,7],
  };
  const [query,setQuery]=useState("");
  const [results,setResults]=useState([]);

  const search=()=>{
    if(!query.trim()){setResults([]);return;}
    const q=query.toLowerCase();
    // mock semantic search: keyword overlap + fuzzy match
    const scored=DOCS.map(doc=>{
      let score=0;
      const dtext=doc.text.toLowerCase();
      q.split(/\s+/).forEach(w=>{
        if(dtext.includes(w))score+=0.4;
        doc.tags.forEach(t=>{if(t.toLowerCase().includes(w)||w.includes(t.toLowerCase()))score+=0.3;});
        Object.entries(KEYWORD_SIM).forEach(([k,ids])=>{
          if(q.includes(k)&&ids.includes(doc.id-1))score+=0.25;
        });
      });
      // cosine similarity mock (seeded random per doc)
      const base=Math.sin(doc.id*7+q.charCodeAt(0))*0.15+0.3;
      score=Math.min(0.99,score+base);
      return {...doc,score};
    });
    setResults(scored.sort((a,b)=>b.score-a.score));
  };

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`}}>
      <div style={{fontWeight:700,color:VIO,marginBottom:8,fontSize:px(15)}}>
        🔍 Mini Project — Semantic Search Engine
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        A real semantic search pipeline: embed query → compare against document embeddings → rank by cosine similarity.
        Try: "attention mechanism", "image classification", "training neural network", "vector similarity"
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&search()}
              placeholder="Search AI topics..."
              style={{flex:1,padding:"10px 14px",borderRadius:10,
                border:`2px solid ${VIO}44`,fontFamily:"monospace",fontSize:px(13),
                background:"#ede9fe"}}/>
            <button onClick={search}
              style={{background:VIO,border:"none",borderRadius:10,padding:"10px 20px",
                color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer"}}>
              🔍 Search
            </button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {["transformer","image recognition","gradient","BERT embeddings","vector search"].map(q2=>(
              <button key={q2} onClick={()=>{setQuery(q2);}}
                style={{background:VIO+"0d",border:`1px solid ${VIO}33`,borderRadius:6,
                  padding:"4px 10px",cursor:"pointer",fontSize:px(10),color:VIO,fontWeight:600}}>
                {q2}
              </button>
            ))}
          </div>
          {results.length>0&&(
            <div>
              {results.slice(0,5).map((doc,i)=>(
                <div key={doc.id} style={{...LCARD,padding:"10px 14px",marginBottom:8,
                  border:`2px solid ${i===0?VIO:VIO+"22"}`,background:i===0?VIO+"08":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontWeight:700,color:VIO,fontSize:px(11)}}>#{i+1}</span>
                    <div style={{display:"flex",gap:4,alignItems:"center"}}>
                      <div style={{background:V.cream,borderRadius:4,width:60,height:6,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${doc.score*100}%`,background:VIO,borderRadius:4}}/>
                      </div>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:VIO,fontWeight:700}}>
                        {(doc.score*100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <p style={{...LBODY,fontSize:px(12),margin:0,marginBottom:4}}>{doc.text}</p>
                  <div style={{display:"flex",gap:4}}>
                    {doc.tags.map(t=>(
                      <span key={t} style={{background:VIO+"15",color:VIO,borderRadius:4,
                        padding:"1px 6px",fontSize:px(9),fontWeight:700}}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {results.length===0&&query&&(
            <div style={{color:V.muted,fontSize:px(13),textAlign:"center",padding:"20px"}}>
              Click Search to find similar documents
            </div>
          )}
        </div>
        <div>
          <CodeBox color={VIO} lines={[
            "# Full semantic search pipeline",
            "from sentence_transformers import SentenceTransformer",
            "import numpy as np",
            "",
            "# 1. Load embedding model",
            "model = SentenceTransformer('all-MiniLM-L6-v2')",
            "# 384-dim embeddings, 80MB, fast",
            "",
            "# 2. Embed your document corpus",
            "docs = [",
            "  'The transformer uses self-attention...',",
            "  'CNNs excel at image recognition...',",
            "  # ... 8 documents",
            "]",
            "doc_embeddings = model.encode(docs)",
            "# shape: (8, 384)",
            "",
            "# 3. Embed user query",
            "query = 'attention mechanism for NLP'",
            "q_emb = model.encode([query])  # (1, 384)",
            "",
            "# 4. Cosine similarity",
            "from sklearn.metrics.pairwise import cosine_similarity",
            "scores = cosine_similarity(q_emb, doc_embeddings)[0]",
            "",
            "# 5. Rank and return",
            "ranked = sorted(enumerate(scores),",
            "  key=lambda x: x[1], reverse=True)",
            "for idx, score in ranked[:3]:",
            "  print(f'{score:.3f}: {docs[idx][:50]}')",
            "",
            "# Output:",
            "# 0.892: The transformer uses self-attention...",
            "# 0.841: BERT is a bidirectional transformer...",
            "# 0.756: Attention mechanisms allow models...",
          ]}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═════════════════════════════════════════════ */
const EmbeddingTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🔢",c:VIO,t:"Computers can't process text directly — everything must be a number. Embeddings are dense, low-dimensional (64-3072 dim) vectors where each dimension encodes some latent semantic feature. Proximity in vector space = semantic similarity."},
    {e:"🧮",c:AMB,t:"Word2Vec (2013) proved that linear vector arithmetic captures semantic relationships: king − man + woman ≈ queen. This shows embeddings encode structure, not just identity. Trained on a shallow 2-layer network predicting context words."},
    {e:"🌐",c:GRN,t:"Contextual embeddings (BERT, GPT): the word 'bank' near 'river' gets a different vector than 'bank' near 'money'. Unlike Word2Vec (static per word), transformer embeddings depend on the full context — the same token can have 100K+ different vectors."},
    {e:"📐",c:CYN,t:"Cosine similarity: cos(θ) = (A·B)/(||A||||B||). Range [-1, 1]. cos=1: identical direction (same meaning). cos=0: orthogonal (unrelated). cos=-1: opposite. Unlike Euclidean distance, cosine ignores vector magnitude — important for text of different lengths."},
    {e:"🔭",c:IND,t:"Dimensionality reduction (t-SNE, PCA, UMAP) projects high-D embeddings to 2D/3D for visualisation. t-SNE preserves local structure (clusters), PCA preserves global variance. Clusters in the projection reveal semantic categories learned by the model."},
    {e:"🚀",c:TEAL,t:"Sentence & document embeddings (sentence-transformers, text-embedding-ada-002) encode entire passages. Use mean pooling or [CLS] token. 'all-MiniLM-L6-v2' gives 384-dim embeddings, 80MB, 14K sentences/sec on CPU — practical for production."},
    {e:"🖼️",c:PNK,t:"Multimodal embeddings (CLIP, ImageBind): images and text in the same vector space. vec('a photo of a dog') ≈ vec(photo of dog). Enables zero-shot image classification, text-image retrieval, and cross-modal search."},
    {e:"⚠️",c:ROSE,t:"Embedding pitfalls: (1) Domain drift — embeddings trained on Wikipedia may not capture medical jargon well. (2) Polysemy — 'static' word2vec can't distinguish 'bank' meanings. (3) Bias — gender/racial stereotypes encoded in training corpus persist in embeddings."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights",VIO)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:VIO}}>Know</span></h2>
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
            <p style={{...LBODY,margin:0,fontSize:px(14),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{cnt}/8 mastered</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${VIO},${IND})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:VIO,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Next: Vector Databases →</button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const EmbeddingsPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Embeddings" lessonNum="Lesson 2 of 5"
    accent={VIO} levelLabel="Modern AI Systems"
    dotLabels={["Hero","Introduction","Vector Representation","Semantic Space","Types","Models","Python","Visualisation","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#070012 0%,#1e0a40 60%,#050015 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🔢 Lesson 2 of 5 · Modern AI Systems",VIO)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Embed-<br/><span style={{color:"#c4b5fd"}}>dings</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:VIO,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                How does AI understand that "happy" and "joyful" mean the same thing?
                How does a recommendation engine know that if you liked one movie you'll like another?
                Embeddings — dense vector representations of semantic meaning — are the answer.
                Every modern AI system from ChatGPT to Spotify is built on them.
              </p>
              <div style={{background:"rgba(139,92,246,0.12)",border:"1px solid rgba(139,92,246,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#c4b5fd",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE IDEA</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Map every word, sentence, image, and document to a point in a high-dimensional vector space
                  such that semantically similar items land near each other. Meaning becomes geometry.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(139,92,246,0.06)",border:"1px solid rgba(139,92,246,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 INTRODUCTION */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why Embeddings?",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Teaching Computers <span style={{color:VIO}}>Meaning</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Computers are fundamentally mathematical — they can only process numbers.
                  To reason about language, images, or any unstructured data, AI must first
                  convert it into numerical vectors. But not just any numbers: the representation
                  must preserve <strong>semantic relationships</strong>.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  A naive approach: one-hot encoding. With a 50,000-word vocabulary,
                  "dog" = [0,0,...,1,...,0] with a 1 at position 4821. This has two fatal flaws:
                  (1) 50,000 dimensions — huge and sparse; (2) every word is equidistant from
                  every other — "dog" is exactly as far from "cat" as it is from "quantum".
                </p>
                {[
                  {method:"One-hot",dims:"50,000",semantic:"❌ No (all equidistant)",dense:"❌ 0.002% non-zero"},
                  {method:"TF-IDF",dims:"50,000+",semantic:"⚠️ Weak (statistical)",dense:"❌ Sparse"},
                  {method:"Word2Vec",dims:"100-300",semantic:"✅ Strong (linear)",dense:"✅ Dense"},
                  {method:"BERT/GPT",dims:"768-4096",semantic:"✅✅ Contextual",dense:"✅ Dense"},
                ].map(row=>(
                  <div key={row.method} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.5fr 1.5fr",gap:6,
                    marginBottom:5,padding:"5px 0",borderBottom:`1px solid ${V.border}`}}>
                    <span style={{fontWeight:700,fontSize:px(12),color:VIO}}>{row.method}</span>
                    <span style={{fontSize:px(11),color:V.muted,fontFamily:"monospace"}}>{row.dims}</span>
                    <span style={{fontSize:px(11),color:V.muted}}>{row.semantic}</span>
                    <span style={{fontSize:px(11),color:V.muted}}>{row.dense}</span>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={VIO} title="The distributional hypothesis"
                  body='"You shall know a word by the company it keeps" — J.R. Firth (1957). Words that appear in similar contexts have similar meanings. "dog" appears near "pet", "bark", "fetch" — so does "cat". This co-occurrence pattern is the statistical signal Word2Vec and all subsequent embedding models exploit to learn meaning.'/> 
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:10,fontSize:px(13)}}>The embedding promise</div>
                  {[
                    {icon:"📍",t:"Proximity = Similarity",d:"sim('happy','joyful') > sim('happy','sad')"},
                    {icon:"📐",t:"Analogy = Arithmetic",d:"vec(king)-vec(man)+vec(woman) ≈ vec(queen)"},
                    {icon:"🔍",t:"Search = Distance",d:"Find the k vectors nearest to your query"},
                    {icon:"🌐",t:"Cross-modal",d:"vec('dog image') ≈ vec('photo of dog')"},
                  ].map(item=>(
                    <div key={item.t} style={{display:"flex",gap:10,marginBottom:8}}>
                      <span style={{fontSize:px(20)}}>{item.icon}</span>
                      <div><span style={{fontWeight:700,color:VIO,fontSize:px(13)}}>{item.t}: </span>
                      <span style={{fontFamily:"monospace",fontSize:px(12),color:V.muted}}>{item.d}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 VECTOR REPRESENTATION */}
        <div ref={R(2)} style={{background:"#070012"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Vector Representation","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Words as <span style={{color:"#c4b5fd"}}>Points in Space</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  An embedding maps each word to a dense vector — typically 100-3072 floating-point numbers.
                  Each dimension captures some latent feature of meaning. The actual dimensions are not
                  human-interpretable (unlike one-hot), but their relationships encode rich semantics.
                </p>
                <div style={{background:"#14002a",border:`1px solid ${VIO}33`,borderRadius:14,padding:"16px",marginBottom:16,fontFamily:"monospace",fontSize:px(11),lineHeight:2.2}}>
                  <div style={{color:"#475569"}}># 8-dimensional embeddings (real: 768-3072 dim)</div>
                  {[
                    {w:"king",v:[0.23,0.89,-0.12,0.67,0.34,-0.45,0.78,0.21],c:"#a78bfa"},
                    {w:"queen",v:[0.25,0.91,-0.10,0.65,0.33,-0.44,0.80,0.50],c:"#a78bfa"},
                    {w:"man",v:[0.22,0.85,-0.13,0.62,0.30,-0.42,0.75,0.10],c:"#6ee7b7"},
                    {w:"woman",v:[0.24,0.87,-0.11,0.60,0.31,-0.41,0.77,0.40],c:"#6ee7b7"},
                    {w:"dog",v:[0.89,0.12,0.45,-0.23,0.67,0.34,-0.12,0.05],c:"#fbbf24"},
                  ].map(({w,v,c})=>(
                    <div key={w} style={{display:"flex",gap:10,alignItems:"center"}}>
                      <span style={{color:c,minWidth:60,fontWeight:700}}>{w}</span>
                      <span style={{color:"#64748b"}}>→ [{v.slice(0,4).join(", ")}, ...]</span>
                    </div>
                  ))}
                </div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:16}}>
                  Notice: king and queen have very similar vectors — the main difference is in dimension 8
                  (0.21 vs 0.50), which roughly encodes "feminine/masculine". Dog lives in a completely
                  different region of space — high dimension 1, low dimension 2.
                </p>
              </div>
              <div>
                <IBox color="#c4b5fd" title="Word2Vec: How embeddings are learned"
                  body="Mikolov et al. (2013) trained a simple 2-layer neural network on a massive text corpus. Task: given a word, predict its surrounding context words (Skip-Gram) or vice versa (CBOW). The hidden layer weights become the word embeddings. The network never sees meaning explicitly — it discovers it from co-occurrence statistics."/>
                <div style={{background:"#14002a",border:`1px solid ${VIO}33`,borderRadius:12,padding:"14px",marginTop:14,fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
                  <div style={{color:"#475569"}}># Word2Vec Skip-Gram objective:</div>
                  <div style={{color:VIO}}>Maximize: Σ log P(context_word | center_word)</div>
                  <div style={{color:"#475569",marginTop:4}}># P(w_o | w_c) via softmax:</div>
                  <div style={{color:"#a78bfa"}}>P(w_o|w_c) = exp(v_o · v_c) / Σ exp(v_j · v_c)</div>
                  <div style={{color:"#475569",marginTop:4}}># Training: 2 matrices (input & output emb)</div>
                  <div style={{color:"#6ee7b7"}}>W_in: vocab × d   (word embeddings)</div>
                  <div style={{color:"#6ee7b7"}}>W_out: d × vocab  (context embeddings)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S3 SEMANTIC SPACE */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Semantic Vector Space",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Meaning as <span style={{color:VIO}}>Geometry</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={VIO}>king − man + woman ≈ queen</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  The most famous result in embedding research: vector arithmetic on word embeddings
                  produces semantically meaningful results. This works because the embedding space
                  encodes relational structure — the "royalty" direction, the "gender" direction,
                  the "capital city" direction all exist as geometric offsets.
                </p>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`,marginBottom:14}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:10,fontSize:px(13)}}>Analogy as offset:</div>
                  {[
                    {a:"Paris − France + Germany",r:"Berlin",desc:"Capital city offset"},
                    {a:"swimming − swim + run",r:"running",desc:"Present participle offset"},
                    {a:"walking − walk + eat",r:"eating",desc:"Gerund morphology"},
                    {a:"cars − car + computer",r:"computers",desc:"Plural offset"},
                    {a:"better − good + bad",r:"worse",desc:"Comparative form"},
                  ].map(row=>(
                    <div key={row.a} style={{marginBottom:8,paddingBottom:8,borderBottom:`1px solid ${V.border}`}}>
                      <div style={{fontFamily:"monospace",fontSize:px(12),color:VIO}}>{row.a}</div>
                      <div style={{display:"flex",gap:8,marginTop:2}}>
                        <span style={{fontSize:px(11),color:V.muted}}>≈</span>
                        <span style={{fontFamily:"monospace",fontWeight:700,color:GRN,fontSize:px(12)}}>{row.r}</span>
                        <span style={{fontSize:px(10),color:V.muted}}>({row.desc})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div style={{background:"#070012",border:`1px solid ${VIO}33`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:"#c4b5fd",marginBottom:10,fontSize:px(13)}}>Cosine Similarity</div>
                  <Formula color={VIO}>cos(θ) = (A · B) / (||A|| · ||B||)</Formula>
                  <div style={{fontFamily:"monospace",fontSize:px(11),lineHeight:2,color:"#94a3b8"}}>
                    <div style={{color:"#475569"}}># Python: cosine similarity</div>
                    <div>import numpy as np</div>
                    <div>def cosine_sim(a, b):</div>
                    <div>  return np.dot(a,b)/(np.linalg.norm(a)*np.linalg.norm(b))</div>
                    <div style={{color:"#475569",marginTop:4}}># Example results:</div>
                    <div style={{color:GRN}}>cosine_sim(vec('happy'), vec('joyful'))  = 0.92</div>
                    <div style={{color:AMB}}>cosine_sim(vec('happy'), vec('neutral')) = 0.31</div>
                    <div style={{color:ROSE}}>cosine_sim(vec('happy'), vec('sad'))    = -0.15</div>
                  </div>
                </div>
                <IBox color={VIO} title="Why cosine, not Euclidean?"
                  body="Euclidean distance treats 'the the the dog' (long text, many 'the' tokens) as far from 'dog' even though they're semantically similar. Cosine similarity measures the angle between vectors, not their magnitude — so long and short documents representing the same topic have high cosine similarity. Standard practice for text similarity."/>
              </div>
            </div>
          </div>
        </div>

        {/* S4 TYPES */}
        <div ref={R(4)} style={{background:"#070012"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Types of Embeddings","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>Embedding <span style={{color:"#c4b5fd"}}>Everything</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"📝",c:"#a78bfa",t:"Word Embeddings",
                  models:"Word2Vec, GloVe, FastText",
                  dim:"100-300",
                  d:"One vector per word, context-independent. GloVe trains on global co-occurrence matrix. FastText uses character n-grams — handles out-of-vocabulary words ('unhappiness' = 'un'+'happiness'+'iness'). Best for: lexical similarity, quick experiments.",
                  limit:"Single static vector per word — can't distinguish polysemy"},
                {e:"📄",c:"#6ee7b7",t:"Sentence Embeddings",
                  models:"sentence-BERT, InstructorXL, E5",
                  dim:"384-4096",
                  d:"One vector per sentence/paragraph. SBERT fine-tunes BERT with siamese networks on sentence pair tasks. 'all-MiniLM-L6-v2': 80MB, 14K sentences/sec. text-embedding-ada-002 (OpenAI): 1536-dim, strong MTEB benchmark.",
                  limit:"Compresses entire sentence to one vector — may lose detail"},
                {e:"🖼️",c:"#f9a8d4",t:"Multimodal Embeddings",
                  models:"CLIP, ImageBind, Flamingo",
                  dim:"512-1024",
                  d:"Image and text in same vector space. CLIP (OpenAI 2021): trained on 400M image-caption pairs via contrastive loss. vec('photo of a cat') ≈ vec(image of cat). Enables zero-shot image classification, cross-modal search, image generation conditioning.",
                  limit:"Requires both modalities during training"},
                {e:"💻",c:"#93c5fd",t:"Code Embeddings",
                  models:"CodeBERT, StarCoder, CodeLlama",
                  dim:"768-4096",
                  d:"Embed source code preserving semantic relationships across programming languages. 'def add(a,b): return a+b' in Python ≈ 'function add(a,b){return a+b}' in JavaScript. Powers GitHub Copilot's code search, bug finding, documentation retrieval.",
                  limit:"Language-specific idioms may not transfer"},
              ].map(item=>(
                <div key={item.t} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:16,padding:"18px 20px"}}>
                  <div style={{fontSize:px(32),marginBottom:8}}>{item.e}</div>
                  <div style={{fontWeight:800,color:item.c,fontSize:px(14),marginBottom:6}}>{item.t}</div>
                  <div style={{fontFamily:"monospace",background:"rgba(0,0,0,0.3)",borderRadius:6,
                    padding:"4px 8px",fontSize:px(10),color:item.c,marginBottom:8}}>
                    {item.models} · {item.dim}d
                  </div>
                  <p style={{...LBODY,fontSize:px(12),marginBottom:8,color:"#94a3b8"}}>{item.d}</p>
                  <div style={{fontSize:px(10),color:ROSE,borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:6}}>
                    ⚠️ {item.limit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S5 MODELS */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Embedding Models",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>How Transformers <span style={{color:VIO}}>Create Embeddings</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  BERT and its descendants produce <strong>contextual embeddings</strong>:
                  every token gets a different vector depending on its context.
                  The word "bank" in "river bank" and "bank account" produces completely
                  different vectors — because the surrounding context shifts the attention patterns.
                </p>
                {[
                  {stage:"Token → Embedding",c:AMB,d:"Each token ID is looked up in an embedding table: integer → 768-dim vector. Position encodings are added."},
                  {stage:"12× Transformer Block",c:VIO,d:"Self-attention + FFN, applied 12 times (BERT-base). At each layer, each token's representation is updated based on all other tokens via attention."},
                  {stage:"[CLS] Token",c:GRN,d:"BERT adds a special [CLS] token at position 0. Its final hidden state captures a summary of the entire sequence — used as the sentence embedding."},
                  {stage:"Mean Pooling",c:CYN,d:"Alternative: average all token embeddings. Often outperforms [CLS] for semantic similarity tasks. sentence-transformers uses this by default."},
                  {stage:"Normalisation",c:IND,d:"L2-normalise the final vector: v / ||v||. Makes cosine similarity = dot product, enabling fast GPU-accelerated similarity search."},
                ].map(item=>(
                  <div key={item.stage} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:item.c,marginTop:6}}/>
                    <div><span style={{fontWeight:700,color:item.c,fontSize:px(13)}}>{item.stage}: </span>
                    <span style={{fontSize:px(13),color:V.muted}}>{item.d}</span></div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${VIO}22`,marginBottom:14}}>
                  <div style={{fontWeight:700,color:VIO,marginBottom:10,fontSize:px(13)}}>Top Embedding Models (2024)</div>
                  {[
                    {m:"text-embedding-3-large",p:"OpenAI",d:"3072",bench:"64.6 MTEB"},
                    {m:"E5-mistral-7B",p:"Microsoft",d:"4096",bench:"66.6 MTEB"},
                    {m:"all-MiniLM-L6-v2",p:"SBERT",d:"384",bench:"56.3 MTEB"},
                    {m:"bge-large-en-v1.5",p:"BAAI",d:"1024",bench:"64.2 MTEB"},
                    {m:"text-embedding-ada-002",p:"OpenAI",d:"1536",bench:"61.0 MTEB"},
                    {m:"CLIP ViT-L/14",p:"OpenAI",d:"768",bench:"multimodal"},
                  ].map(row=>(
                    <div key={row.m} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 0.8fr 1fr",gap:4,
                      marginBottom:5,padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:VIO,fontWeight:700}}>{row.m}</span>
                      <span style={{fontSize:px(10),color:V.muted}}>{row.p}</span>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:GRN}}>{row.d}d</span>
                      <span style={{fontSize:px(10),color:AMB}}>{row.bench}</span>
                    </div>
                  ))}
                </div>
                <IBox color={VIO} title="Contrastive learning: training embedding models"
                  body="Modern embedding models are trained with contrastive loss: positive pairs (similar sentences) should have high cosine similarity; negative pairs should have low similarity. SimCSE uses dropout as augmentation: same sentence through model twice with different dropout masks = positive pair. Hard negatives (semantically similar but wrong answers) improve quality dramatically."/>
              </div>
            </div>
          </div>
        </div>

        {/* S6 PYTHON */}
        <div ref={R(6)} style={{background:"#070012"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python with Transformers","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Generating <span style={{color:"#c4b5fd"}}>Embeddings</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={VIO} lines={[
                "from transformers import AutoTokenizer, AutoModel",
                "from sentence_transformers import SentenceTransformer",
                "import torch, numpy as np",
                "",
                "# ── BERT contextual embeddings ────────",
                "tokenizer = AutoTokenizer.from_pretrained(",
                "  'bert-base-uncased')",
                "model = AutoModel.from_pretrained(",
                "  'bert-base-uncased')",
                "",
                "text = 'The bank by the river'",
                "inputs = tokenizer(text, return_tensors='pt')",
                "with torch.no_grad():",
                "  outputs = model(**inputs)",
                "",
                "# outputs.last_hidden_state: (1, 6, 768)",
                "# — 768-dim vector per token",
                "",
                "# Sentence embedding via mean pooling",
                "token_embs = outputs.last_hidden_state[0]",
                "sent_emb = token_embs.mean(dim=0)  # (768,)",
                "sent_emb = sent_emb / sent_emb.norm()  # normalise",
                "",
                "# ── sentence-transformers (preferred) ─",
                "model = SentenceTransformer('all-MiniLM-L6-v2')",
                "",
                "sentences = [",
                "  'The cat sat on the mat',",
                "  'A feline rested on a rug',",
                "  'Python is a programming language',",
                "]",
                "embeddings = model.encode(sentences)",
                "# shape: (3, 384)",
                "",
                "# Cosine similarities",
                "from sklearn.metrics.pairwise import cosine_similarity",
                "sims = cosine_similarity(embeddings)",
                "print(sims)",
                "# [[1.00  0.87  0.12]",
                "#  [0.87  1.00  0.13]   ← cat/feline similar!",
                "#  [0.12  0.13  1.00]]",
                "",
                "# ── OpenAI embeddings (API) ───────────",
                "from openai import OpenAI",
                "client = OpenAI()",
                "response = client.embeddings.create(",
                "  model='text-embedding-3-small',",
                "  input='AI is transforming every industry'",
                ")",
                "vec = response.data[0].embedding  # list of 1536",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"outputs.last_hidden_state",c:VIO,d:"BERT's raw output: tensor of shape (batch, seq_len, 768). Each of the 768 dimensions is a learned feature. The final layer (layer 12) gives the most semantically rich representations."},
                  {l:"Mean pooling",c:AMB,d:"Average token embeddings across sequence length dim. Better than [CLS] for most semantic similarity tasks because it captures information from all tokens, not just the first one."},
                  {l:"SentenceTransformer",c:GRN,d:"Optimised for semantic similarity — fine-tuned on NLI and STS datasets with siamese network training. 'all-MiniLM-L6-v2' is the go-to: small, fast, high quality. 80MB, runs on CPU."},
                  {l:"model.encode()",c:CYN,d:"Batch processing with automatic tokenisation, padding, truncation. Returns numpy array. show_progress_bar=True for large batches. batch_size=128 for GPU efficiency."},
                  {l:"cosine_similarity()",c:IND,d:"Computes full similarity matrix between two sets of embeddings. For large-scale search, use FAISS instead — matrix multiply is O(n·m·d) which gets slow for millions of docs."},
                  {l:"text-embedding-3-small",c:PNK,d:"OpenAI's latest embedding model. 1536 dimensions, $0.02 per million tokens. Significantly better than ada-002 on MTEB benchmarks. Rate limit: 1M tokens/min on Tier 1."},
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

        {/* S7 VISUALISATION */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Visualising Embeddings",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>Seeing <span style={{color:VIO}}>Semantic Structure</span></h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(24)}}>
              Real embeddings live in 768+ dimensions — impossible to visualise directly.
              Dimensionality reduction techniques project them to 2D or 3D while preserving
              the neighbourhood structure. Click words in the canvas below to explore.
            </p>
            <EmbeddingVisualizer/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <IBox color={VIO} title="t-SNE — preserving local structure"
                body="t-SNE (van der Maaten & Hinton 2008) converts Euclidean distances to probabilities, then finds a low-D layout where similar distributions match. Preserves local clusters (nearby points stay together) but distorts global structure (cluster distances are not meaningful). Perplexity=30-50 typical for word embeddings. Slow: O(n²)."/>
              <IBox color={IND} title="PCA — maximum variance"
                body="Principal Component Analysis finds the directions of maximum variance. PC1 and PC2 are orthogonal axes capturing the most information. Fast, deterministic, linear — but misses non-linear structure. For word embeddings, PC1 often correlates with word frequency. UMAP (2018) is a fast modern alternative that preserves both local and global structure better than t-SNE."/>
            </div>
          </div>
        </div>

        {/* S8 APPLICATIONS */}
        <div ref={R(8)} style={{background:"#070012"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#c4b5fd")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>Embeddings <span style={{color:"#c4b5fd"}}>Everywhere</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🔍",c:"#a78bfa",t:"Semantic Search",
                  b:"Google, Bing, and Perplexity use dense retrieval: embed query and all documents, return top-k by cosine similarity. Unlike keyword search (exact match), semantic search finds 'automobile' when you search 'car'. Powers every modern search engine.",
                  ex:"query: 'fast cars' → finds 'high-speed automobiles'"},
                {e:"🎬",c:"#6ee7b7",t:"Recommendation Systems",
                  b:"Netflix: embed movies and users in same space. Spotify: embed songs, artists, playlists. If you like song A, recommend songs whose embeddings are nearby. YouTube embeds videos; Facebook embeds people, posts, ads — all in the same engagement-optimised space.",
                  ex:"vec(user) ≈ vec(content they'd enjoy)"},
                {e:"💬",c:"#f9a8d4",t:"Question Answering",
                  b:"RAG (Retrieval-Augmented Generation): embed question, find top-k relevant documents via vector search, pass them to an LLM. Bing AI, Perplexity, and ChatGPT with browsing all use embedding-based retrieval to ground answers in facts.",
                  ex:"Q→embed→search docs→LLM answer"},
                {e:"🧬",c:"#93c5fd",t:"Scientific Discovery",
                  b:"Protein embeddings (ESM-2) place proteins with similar 3D structures nearby — enabling drug discovery by searching for proteins similar to known drug targets. Scientific paper embeddings power Semantic Scholar, enabling concept-level literature search across 200M+ papers.",
                  ex:"embed proteins→find drug targets"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"18px 20px"}}>
                  <div style={{fontSize:px(32),marginBottom:8}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(14),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(12),marginBottom:10,color:"#94a3b8"}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:"rgba(0,0,0,0.3)",borderRadius:6,
                    padding:"5px 10px",fontSize:px(10),color:a.c}}>{a.ex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S9 GAME */}
        <div ref={R(9)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Word Similarity Explorer",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Vector Analogy Game</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Test your intuition for how word embeddings encode semantic relationships.
              Complete the analogy using vector arithmetic: A − B + C = ?
            </p>
            <VectorArithmeticDemo/>
            <div style={{marginTop:px(24)}}>
              <h3 style={{fontWeight:700,color:VIO,fontSize:px(15),marginBottom:px(14)}}>
                🗺️ Explore the Embedding Space
              </h3>
              <VectorSpaceCanvas/>
            </div>
          </div>
        </div>

        {/* S10 PROJECT */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",VIO)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🔍 Semantic Search Engine</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A production semantic search pipeline in ~20 lines of Python.
              Search 8 AI/ML documents by semantic meaning, not keyword matching.
            </p>
            <SemanticSearchProject/>
          </div>
        </div>

        {/* S11 INSIGHTS */}
        <div ref={R(11)} style={{background:V.cream}}>
          <EmbeddingTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default EmbeddingsPage;
