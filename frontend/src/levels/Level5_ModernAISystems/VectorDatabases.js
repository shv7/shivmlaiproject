import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — VECTOR DATABASES
   Level 5 · Modern AI Systems · Lesson 3 of 5
   Accent: Cyan #0891b2
══════════════════════════════════════════════════════════════════ */
const CYN  = "#0891b2";
const TEAL = "#0d9488";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const GRN  = "#059669";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const PNK  = "#ec4899";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula = ({children,color=CYN})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=CYN})=>(
  <div style={{fontFamily:"monospace",background:"#00080f",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — vector search viz ════════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize();window.addEventListener("resize",resize);
    const DOCS=[];
    for(let i=0;i<40;i++){
      DOCS.push({x:Math.random(),y:Math.random(),
        c:["#22d3ee","#34d399","#a78bfa","#fbbf24","#f9a8d4"][i%5]});
    }
    const QUERY={x:0.5,y:0.5};
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#00080f";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(8,145,178,0.04)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // search radius
      const r=(0.22+Math.sin(t*0.5)*0.04)*Math.min(W,H);
      const g=ctx.createRadialGradient(QUERY.x*W,QUERY.y*H,0,QUERY.x*W,QUERY.y*H,r);
      g.addColorStop(0,CYN+"22");g.addColorStop(1,CYN+"00");
      ctx.beginPath();ctx.arc(QUERY.x*W,QUERY.y*H,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      ctx.beginPath();ctx.arc(QUERY.x*W,QUERY.y*H,r,0,Math.PI*2);
      ctx.strokeStyle=CYN+"44";ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
      // docs
      DOCS.forEach(({x,y,c})=>{
        const dx=(x-QUERY.x)*W,dy=(y-QUERY.y)*H;
        const dist=Math.sqrt(dx*dx+dy*dy);
        const inRange=dist<r;
        if(inRange){
          ctx.beginPath();ctx.moveTo(QUERY.x*W,QUERY.y*H);ctx.lineTo(x*W,y*H);
          ctx.strokeStyle=CYN+"33";ctx.lineWidth=1;ctx.stroke();
        }
        ctx.beginPath();ctx.arc(x*W,y*H,inRange?7:4,0,Math.PI*2);
        ctx.fillStyle=inRange?c:"#1e3a4a";ctx.fill();
        if(inRange){
          ctx.strokeStyle=c;ctx.lineWidth=1.5;
          ctx.shadowColor=c;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
        }
      });
      // query point
      const qg=ctx.createRadialGradient(QUERY.x*W,QUERY.y*H,0,QUERY.x*W,QUERY.y*H,14);
      qg.addColorStop(0,CYN+"88");qg.addColorStop(1,CYN+"00");
      ctx.beginPath();ctx.arc(QUERY.x*W,QUERY.y*H,14,0,Math.PI*2);ctx.fillStyle=qg;ctx.fill();
      ctx.beginPath();ctx.arc(QUERY.x*W,QUERY.y*H,8,0,Math.PI*2);ctx.fillStyle=CYN;ctx.fill();
      ctx.font=`bold ${px(9)} sans-serif`;ctx.fillStyle=CYN;ctx.textAlign="center";
      ctx.fillText("QUERY",QUERY.x*W,QUERY.y*H-20);
      ctx.font=`${px(9)} sans-serif`;ctx.fillStyle="#0e3a4a";ctx.textAlign="left";
      ctx.fillText("k-NN search: find k nearest vectors",10,H-10);
      t+=0.03;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ SIMILARITY METRICS DEMO ════════════════════════════════ */
const SimilarityDemo=()=>{
  const [vA,setVA]=useState([0.8,0.6]);
  const [vB,setVB]=useState([0.6,0.8]);

  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1];
  const norm=(v)=>Math.sqrt(v[0]**2+v[1]**2);
  const cosine=(a,b)=>dot(a,b)/(norm(a)*norm(b)||1);
  const euclidean=(a,b)=>Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
  const manhattan=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
  const dotProd=dot(vA,vB);
  const cosSim=cosine(vA,vB);
  const eucDist=euclidean(vA,vB);
  const manDist=manhattan(vA,vB);
  const canvasRef=useRef();

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const CX=W/2,CY=H/2,SCALE=Math.min(W,H)*0.38;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f0f9ff";ctx.fillRect(0,0,W,H);
    // axes
    ctx.strokeStyle="#e0f2fe";ctx.lineWidth=1;
    for(let x=0;x<W;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle="#0ea5e9";ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,CY);ctx.lineTo(W,CY);ctx.stroke();
    ctx.beginPath();ctx.moveTo(CX,0);ctx.lineTo(CX,H);ctx.stroke();
    // angle arc
    const aA=Math.atan2(vA[1],vA[0]),aB=Math.atan2(vB[1],vB[0]);
    const negAA=Math.atan2(-vA[1],vA[0]),negAB=Math.atan2(-vB[1],vB[0]);
    ctx.beginPath();ctx.arc(CX,CY,40,-aA,-aB,aA>aB);
    ctx.strokeStyle=AMB+"88";ctx.lineWidth=2;ctx.stroke();
    ctx.font=`${px(9)} sans-serif`;ctx.fillStyle=AMB;ctx.textAlign="center";
    const midA=(aA+aB)/2;
    ctx.fillText(`θ=${((Math.abs(aA-aB))*180/Math.PI).toFixed(0)}°`,
      CX+55*Math.cos(-midA),CY-55*Math.sin(-midA));
    // euclidean line
    ctx.beginPath();
    ctx.moveTo(CX+vA[0]*SCALE,CY-vA[1]*SCALE);
    ctx.lineTo(CX+vB[0]*SCALE,CY-vB[1]*SCALE);
    ctx.strokeStyle=GRN+"77";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    // vectors
    [[vA,CYN,"A"],[vB,VIO,"B"]].forEach(([v,col,label])=>{
      const vx=CX+v[0]*SCALE,vy=CY-v[1]*SCALE;
      ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(vx,vy);
      ctx.strokeStyle=col;ctx.lineWidth=2.5;
      ctx.shadowColor=col;ctx.shadowBlur=6;ctx.stroke();ctx.shadowBlur=0;
      // arrowhead
      const angle=Math.atan2(-(vy-CY),vx-CX);
      ctx.beginPath();
      ctx.moveTo(vx,vy);
      ctx.lineTo(vx-12*Math.cos(angle-0.3),vy+12*Math.sin(angle-0.3));
      ctx.lineTo(vx-12*Math.cos(angle+0.3),vy+12*Math.sin(angle+0.3));
      ctx.fillStyle=col;ctx.fill();
      ctx.font=`bold ${px(12)} sans-serif`;ctx.fillStyle=col;ctx.textAlign="center";
      ctx.fillText(label,vx+16*Math.cos(angle+0.4),vy-16*Math.sin(angle+0.4));
      ctx.font=`${px(9)} monospace`;ctx.fillStyle=col;
      ctx.fillText(`[${v[0].toFixed(2)},${v[1].toFixed(2)}]`,vx+20*Math.cos(angle),vy-20*Math.sin(angle)-14);
    });
  },[vA,vB]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📐 Similarity Metrics Explorer — Adjust vectors and compare metrics
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Drag the sliders to change vectors A and B. Watch how cosine similarity,
        Euclidean distance, and dot product respond differently.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
            display:"block",border:`1px solid ${CYN}22`,marginBottom:10}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["A[0]",vA[0],v=>setVA([+v,vA[1]])],["A[1]",vA[1],v=>setVA([vA[0],+v])],
              ["B[0]",vB[0],v=>setVB([+v,vB[1]])],["B[1]",vB[1],v=>setVB([vB[0],+v])]].map(([label,val,setter])=>(
              <div key={label}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:px(11),marginBottom:2}}>
                  <span style={{color:label.startsWith("A")?CYN:VIO,fontFamily:"monospace",fontWeight:700}}>{label}</span>
                  <span style={{color:V.muted,fontFamily:"monospace"}}>{val.toFixed(2)}</span>
                </div>
                <input type="range" min={-1} max={1} step={0.01} value={val}
                  onChange={e=>setter(e.target.value)}
                  style={{width:"100%",accentColor:label.startsWith("A")?CYN:VIO}}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {name:"Cosine Similarity",val:cosSim,fmt:v=>v.toFixed(4),c:CYN,
              note:`cos(θ) = (A·B)/(||A||·||B||) = ${cosSim.toFixed(4)}. Range [-1,1]. Direction only.`},
            {name:"Dot Product",val:dotProd/2,fmt:v=>(v*2).toFixed(4),c:AMB,
              note:`A·B = ${dotProd.toFixed(4)}. Magnitude-sensitive. Faster than cosine (no normalisation).`},
            {name:"Euclidean Distance",val:1-eucDist/2,fmt:v=>(eucDist).toFixed(4),c:GRN,
              note:`||A-B||₂ = ${eucDist.toFixed(4)}. Position-sensitive. Affected by vector length.`},
            {name:"Manhattan Distance",val:1-manDist/2,fmt:v=>(manDist).toFixed(4),c:VIO,
              note:`|A₁-B₁|+|A₂-B₂| = ${manDist.toFixed(4)}. L1 norm. Robust to outliers.`},
          ].map(item=>(
            <div key={item.name} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontWeight:700,color:item.c,fontSize:px(12)}}>{item.name}</span>
                <span style={{fontFamily:"monospace",fontWeight:900,color:item.c,fontSize:px(14)}}>
                  {item.fmt(item.val)}
                </span>
              </div>
              <div style={{background:V.cream,borderRadius:4,height:6,overflow:"hidden",marginBottom:4}}>
                <div style={{height:"100%",width:`${Math.max(0,item.val)*100}%`,
                  background:item.c,borderRadius:4,transition:"width 0.1s"}}/>
              </div>
              <p style={{...LBODY,fontSize:px(11),margin:0,color:V.muted}}>{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ ANN / HNSW DEMO ═════════════════════════════════════════ */
const ANNDemo=()=>{
  const [mode,setMode]=useState("brute");
  const [k,setK]=useState(3);
  const [nDocs,setNDocs]=useState(20);
  const canvasRef=useRef();
  const [query]=useState({x:0.5,y:0.5});
  const [docs]=useState(()=>{
    const d=[];
    for(let i=0;i<50;i++){
      d.push({x:Math.random(),y:Math.random(),
        c:["#22d3ee","#34d399","#a78bfa","#fbbf24","#f9a8d4"][i%5],
        id:i});
    }
    return d;
  });

  const getKNN=(q,pts,kk)=>{
    return pts.slice(0,nDocs)
      .map(p=>({...p,dist:Math.sqrt((p.x-q.x)**2+(p.y-q.y)**2)}))
      .sort((a,b)=>a.dist-b.dist).slice(0,kk);
  };
  const knn=getKNN(query,docs,k);
  const knnIds=new Set(knn.map(p=>p.id));

  const OPS={brute:nDocs,hnsw:Math.ceil(Math.log2(nDocs)*8),ivf:Math.ceil(Math.sqrt(nDocs)*k)};

  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f0f9ff";ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#e0f2fe";ctx.lineWidth=1;
    for(let x=0;x<W;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<H;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    if(mode==="ivf"){
      // Show IVF partitions
      [[0.25,0.25],[0.75,0.25],[0.25,0.75],[0.75,0.75],[0.5,0.5]].forEach(([cx,cy])=>{
        ctx.beginPath();ctx.arc(cx*W,cy*H,70,0,Math.PI*2);
        ctx.strokeStyle="#0ea5e922";ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle="#0ea5e905";ctx.fill();
      });
    }
    if(mode==="hnsw"){
      // Show HNSW graph edges (approximate)
      docs.slice(0,nDocs).forEach((d,i)=>{
        const nb=docs.slice(0,nDocs).filter((d2,j)=>j!==i&&Math.sqrt((d.x-d2.x)**2+(d.y-d2.y)**2)<0.25).slice(0,2);
        nb.forEach(n=>{
          ctx.beginPath();ctx.moveTo(d.x*W,d.y*H);ctx.lineTo(n.x*W,n.y*H);
          ctx.strokeStyle="#0ea5e911";ctx.lineWidth=1;ctx.stroke();
        });
      });
    }
    // connection lines to k-NN
    knn.forEach(p=>{
      ctx.beginPath();ctx.moveTo(query.x*W,query.y*H);ctx.lineTo(p.x*W,p.y*H);
      ctx.strokeStyle=CYN+"44";ctx.lineWidth=1.5;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    });
    // docs
    docs.slice(0,nDocs).forEach(p=>{
      const isKNN=knnIds.has(p.id);
      ctx.beginPath();ctx.arc(p.x*W,p.y*H,isKNN?8:4,0,Math.PI*2);
      ctx.fillStyle=isKNN?p.c:"#94a3b8";ctx.fill();
      if(isKNN){ctx.strokeStyle=p.c;ctx.lineWidth=2;ctx.shadowColor=p.c;ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;}
      if(isKNN){
        const rank=knn.findIndex(q2=>q2.id===p.id)+1;
        ctx.font=`bold ${px(9)} sans-serif`;ctx.fillStyle=p.c;ctx.textAlign="center";
        ctx.fillText(`#${rank}`,p.x*W,p.y*H-14);
      }
    });
    // query
    ctx.beginPath();ctx.arc(query.x*W,query.y*H,10,0,Math.PI*2);ctx.fillStyle=CYN;ctx.fill();
    ctx.font=`bold ${px(9)} sans-serif`;ctx.fillStyle=CYN;ctx.textAlign="center";
    ctx.fillText("QUERY",query.x*W,query.y*H-16);
  },[mode,k,nDocs,knn,knnIds]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        ⚡ ANN Search Comparison — Brute Force vs HNSW vs IVF
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
        Brute force search computes distance to every vector — O(n·d). For 1B vectors it's
        impossibly slow. Approximate Nearest Neighbour algorithms trade a small accuracy loss
        for orders-of-magnitude speedup.
      </p>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        {[["brute","Brute Force"],["hnsw","HNSW"],["ivf","IVF"]].map(([k2,l])=>(
          <button key={k2} onClick={()=>setMode(k2)}
            style={{background:mode===k2?CYN:CYN+"0d",border:`2px solid ${mode===k2?CYN:CYN+"22"}`,
              borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:700,
              fontSize:px(11),color:mode===k2?"#fff":CYN}}>
            {l}
          </button>
        ))}
        <div style={{display:"flex",gap:6,alignItems:"center",marginLeft:"auto"}}>
          <span style={{fontSize:px(11),color:V.muted}}>k={k}</span>
          <input type="range" min={1} max={8} step={1} value={k} onChange={e=>setK(+e.target.value)}
            style={{accentColor:CYN,width:60}}/>
          <span style={{fontSize:px(11),color:V.muted}}>docs={nDocs}</span>
          <input type="range" min={5} max={50} step={5} value={nDocs} onChange={e=>setNDocs(+e.target.value)}
            style={{accentColor:CYN,width:60}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:px(16)}}>
        <canvas ref={canvasRef} style={{width:"100%",height:300,borderRadius:14,display:"block",
          border:`2px solid ${CYN}22`,cursor:"default"}}/>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:CYN+"0d",border:`2px solid ${CYN}33`,borderRadius:12,padding:"14px"}}>
            <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(12)}}>Operations needed:</div>
            {[["Brute Force",OPS.brute,ROSE],["HNSW",OPS.hnsw,GRN],["IVF",OPS.ivf,AMB]].map(([name,ops,c])=>(
              <div key={name} style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:px(11),marginBottom:2}}>
                  <span style={{color:c,fontWeight:700}}>{name}</span>
                  <span style={{fontFamily:"monospace",color:c,fontWeight:700}}>{ops} ops</span>
                </div>
                <div style={{background:V.cream,borderRadius:4,height:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(ops/OPS.brute)*100}%`,background:c,borderRadius:4}}/>
                </div>
              </div>
            ))}
          </div>
          <IBox color={CYN} title={mode==="brute"?"Brute Force — exact but slow":mode==="hnsw"?"HNSW — hierarchical graph":"IVF — partition-based"}
            body={mode==="brute"?"Computes distance to every stored vector. Guaranteed to find the true k-NN. O(n·d) per query. Practical for n<100K vectors. FAISS IndexFlatL2.":
              mode==="hnsw"?"Hierarchical Navigable Small World graph. Navigate a multi-layer proximity graph to find near neighbours. O(log n) per query. 99%+ recall at 10x speedup. Used in Chroma, Weaviate, Qdrant.":
              "Inverted File Index: cluster vectors into groups (Voronoi cells). Search only nearby clusters. IVF1024: search 64/1024 clusters = ~6% of data. O(√n·d). Trade recall for speed. Used in Pinecone, FAISS IVFFlat."}/>
          <div style={{background:"#00080f",borderRadius:10,padding:"10px",fontFamily:"monospace",fontSize:px(10),lineHeight:1.9,color:"#94a3b8"}}>
            <div style={{color:"#475569"}}># FAISS index types</div>
            <div style={{color:ROSE}}>IndexFlatL2      # exact, small datasets</div>
            <div style={{color:AMB}}>IndexIVFFlat     # fast, medium datasets</div>
            <div style={{color:GRN}}>IndexHNSW        # very fast, large</div>
            <div style={{color:CYN}}>IndexIVFPQ       # memory-efficient, huge</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ FIND CLOSEST VECTOR GAME ════════════════════════════════ */
const FindClosestGame=()=>{
  const ROUNDS=[
    {q:"vec = [0.9, 0.1, 0.0]",
     docs:[{id:"A",v:[0.88,0.12,0.05]},{id:"B",v:[0.1,0.9,0.0]},{id:"C",v:[0.5,0.5,0.5]},{id:"D",v:[0.0,0.0,1.0]}],
     ans:"A",metric:"cosine",
     why:"Cosine similarity to A: ~0.995 (nearly identical direction). B points in a completely different direction (high dim 2). C and D diverge further."},
    {q:"query = 'I love eating pizza'",
     docs:[{id:"A",v:null,text:"The best pizza recipe"},{id:"B",v:null,text:"Dog training techniques"},
           {id:"C",v:null,text:"How to cook Italian food"},{id:"D",v:null,text:"Stock market analysis"}],
     ans:"A",metric:"semantic",
     why:"'I love eating pizza' is most semantically similar to 'The best pizza recipe' — both concern pizza. 'How to cook Italian food' (C) is second closest — related food domain but less specific."},
    {q:"query = [0.3, 0.4]  (2D)",
     docs:[{id:"A",v:[0.6,0.8]},{id:"B",v:[0.9,0.1]},{id:"C",v:[0.3,0.95]},{id:"D",v:[0.29,0.41]}],
     ans:"D",metric:"euclidean",
     why:"Euclidean distance to D: √((0.3-0.29)²+(0.4-0.41)²) = 0.014. To A: 0.36. To B: 0.61. To C: 0.55. D is by far the closest in L2 space."},
    {q:"vec = [1, 0, 0, 0, 1]  (5D binary)",
     docs:[{id:"A",v:[1,0,0,0,1]},{id:"B",v:[1,1,0,0,0]},{id:"C",v:[0,0,1,0,1]},{id:"D",v:[0,1,0,1,0]}],
     ans:"A",metric:"cosine",
     why:"Cosine similarity to A: (1+0+0+0+1)/(√2·√2) = 2/2 = 1.0 — perfect match! B shares only dim 1; C shares only dim 5; D shares no dimensions."},
    {q:"query = 'machine learning model'",
     docs:[{id:"A",v:null,text:"Deep neural network training"},{id:"B",v:null,text:"SQL database queries"},
           {id:"C",v:null,text:"Gradient descent optimisation"},{id:"D",v:null,text:"Cooking pasta recipes"}],
     ans:"A",metric:"semantic",
     why:"'Machine learning model' is closest to 'Deep neural network training' — both describe ML model training. 'Gradient descent optimisation' (C) is second — a core ML concept, but more specific to the algorithm."},
  ];
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const q=ROUNDS[step%ROUNDS.length];

  const choose=opt=>{if(chosen)return;setChosen(opt);if(opt===q.ans)setScore(s=>s+1);};

  return (
    <div style={{...LCARD,background:"#f0f9ff",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:800,color:CYN,fontSize:px(17),marginBottom:8}}>
        🎮 Find the Closest Vector — k-NN Challenge
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Given a query vector or text, find which document has the highest similarity.
        Metric: <strong style={{color:CYN}}>{q.metric}</strong>. Score: <strong style={{color:CYN}}>{score}/{step%5===0&&step>0?5:step%5}</strong>
      </p>
      <div style={{background:CYN+"0d",border:`2px solid ${CYN}33`,borderRadius:14,
        padding:"16px",marginBottom:18,fontFamily:"monospace"}}>
        <div style={{fontSize:px(11),color:V.muted,marginBottom:4}}>QUERY</div>
        <div style={{fontSize:px(14),fontWeight:700,color:CYN}}>{q.q}</div>
        <div style={{fontSize:px(10),color:V.muted,marginTop:4}}>Metric: {q.metric} similarity</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {q.docs.map(doc=>{
          const isAns=doc.id===q.ans,isChos=doc.id===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isAns){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChos&&!isAns){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          return (
            <button key={doc.id} onClick={()=>choose(doc.id)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"12px",cursor:chosen?"default":"pointer",
                textAlign:"left",transition:"all 0.2s"}}>
              <div style={{fontWeight:800,color:col,fontSize:px(14),marginBottom:4}}>
                {show&&isAns?"✅ ":show&&isChos&&!isAns?"❌ ":" "}{doc.id}
              </div>
              {doc.v?(
                <div style={{fontFamily:"monospace",fontSize:px(11),color:V.muted}}>
                  [{doc.v.join(", ")}]
                </div>
              ):(
                <div style={{fontSize:px(12),color:V.muted}}>{doc.text}</div>
              )}
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
            style={{background:CYN,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%5<4?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ DOCUMENT RETRIEVAL PROJECT ══════════════════════════════ */
const DocumentRetrievalProject=()=>{
  const DOCS=[
    {id:0,title:"Transformers in NLP",content:"The transformer architecture revolutionised NLP with self-attention mechanisms.",tags:["NLP","transformers"]},
    {id:1,title:"CNN Image Recognition",content:"Convolutional networks learn spatial hierarchies for visual pattern recognition.",tags:["CV","CNN"]},
    {id:2,title:"Reinforcement Learning Basics",content:"RL agents learn by interacting with environments and receiving reward signals.",tags:["RL"]},
    {id:3,title:"BERT Pretraining",content:"BERT uses masked language modelling and next sentence prediction for pretraining.",tags:["BERT","NLP"]},
    {id:4,title:"Vector Similarity Search",content:"Cosine similarity measures angle between high-dimensional embedding vectors.",tags:["vectors","search"]},
    {id:5,title:"Gradient Descent Optimisation",content:"Gradient descent follows the negative gradient of loss to find model minima.",tags:["optimisation"]},
    {id:6,title:"RAG Systems",content:"Retrieval-augmented generation combines vector search with language model generation.",tags:["RAG","LLM"]},
    {id:7,title:"Diffusion Models",content:"Diffusion models learn to reverse a Gaussian noise process to generate images.",tags:["generative","images"]},
    {id:8,title:"RLHF for LLMs",content:"Reinforcement learning from human feedback aligns LLMs with human preferences.",tags:["LLM","RL"]},
    {id:9,title:"Embedding Models",content:"Sentence transformers encode text into dense vectors for semantic similarity.",tags:["embeddings","NLP"]},
  ];
  const [query,setQuery]=useState("");
  const [k,setK]=useState(3);
  const [metric,setMetric]=useState("cosine");
  const [results,setResults]=useState([]);
  const [step,setStep]=useState(null);

  const PIPELINE=[
    "1. Tokenise query",
    "2. Forward pass through embedding model",
    "3. L2-normalise output vector",
    "4. Compute similarity to all doc vectors",
    "5. Sort & return top-k",
  ];

  const search=()=>{
    if(!query.trim())return;
    setStep(0);
    const interval=setInterval(()=>{
      setStep(s=>{
        if(s>=4){
          clearInterval(interval);
          // compute mock results
          const q2=query.toLowerCase();
          const scored=DOCS.map(doc=>{
            let sim=Math.sin(doc.id*7+q2.charCodeAt(0))*0.15+0.45;
            q2.split(/\s+/).forEach(w=>{
              if(doc.content.toLowerCase().includes(w)||doc.title.toLowerCase().includes(w))sim+=0.25;
              doc.tags.forEach(t=>{if(t.toLowerCase().includes(w)||w.includes(t))sim+=0.2;});
            });
            return {...doc,sim:Math.min(0.99,sim)};
          });
          setResults(scored.sort((a,b)=>b.sim-a.sim).slice(0,k));
          setStep(null);
        }
        return s+1;
      });
    },300);
  };

  return (
    <div style={{...LCARD,background:"#f0f9ff",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📚 Mini Project — Document Retrieval System
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        A full vector database retrieval pipeline: embed documents, build index, embed query, search.
        10 AI/ML documents pre-indexed. Try: "attention mechanisms", "image generation", "LLM alignment"
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            <input value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&search()}
              placeholder="Enter search query..."
              style={{flex:1,padding:"10px 14px",borderRadius:10,
                border:`2px solid ${CYN}44`,fontFamily:"monospace",fontSize:px(13),background:"#e0f2fe"}}/>
            <button onClick={search} disabled={!!step&&step<5}
              style={{background:CYN,border:"none",borderRadius:10,padding:"10px 18px",
                color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer",
                opacity:step!==null&&step<5?0.6:1}}>
              🔍
            </button>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{fontSize:px(11),color:V.muted}}>k=</span>
              <input type="range" min={1} max={8} step={1} value={k}
                onChange={e=>setK(+e.target.value)} style={{width:60,accentColor:CYN}}/>
              <span style={{fontFamily:"monospace",fontSize:px(11),color:CYN,fontWeight:700}}>{k}</span>
            </div>
            {["cosine","euclidean","dot"].map(m=>(
              <button key={m} onClick={()=>setMetric(m)}
                style={{background:metric===m?CYN:CYN+"0d",border:`1px solid ${CYN}`,
                  borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:px(10),
                  color:metric===m?"#fff":CYN,fontWeight:700}}>
                {m}
              </button>
            ))}
          </div>
          {step!==null&&step<5&&(
            <div style={{background:CYN+"0d",border:`1px solid ${CYN}33`,borderRadius:10,padding:"10px",marginBottom:10}}>
              {PIPELINE.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,fontSize:px(11)}}>
                  <div style={{width:14,height:14,borderRadius:"50%",flexShrink:0,
                    background:i<=step?CYN:V.border,display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:px(8),color:"#fff"}}>{i<=step?"✓":""}</div>
                  <span style={{color:i<=step?CYN:V.muted,fontWeight:i===step?700:400}}>{p}</span>
                </div>
              ))}
            </div>
          )}
          {results.length>0&&(
            <div>
              <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(12)}}>
                Top-{k} Results ({metric} similarity):
              </div>
              {results.map((doc,i)=>(
                <div key={doc.id} style={{...LCARD,padding:"10px 14px",marginBottom:6,
                  border:`2px solid ${i===0?CYN:CYN+"22"}`,background:i===0?CYN+"08":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontWeight:700,color:CYN,fontSize:px(12)}}>{doc.title}</span>
                    <span style={{fontFamily:"monospace",fontWeight:700,color:CYN,fontSize:px(12)}}>
                      {(doc.sim*100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{background:V.cream,borderRadius:3,height:5,overflow:"hidden",marginBottom:4}}>
                    <div style={{height:"100%",width:`${doc.sim*100}%`,background:CYN,borderRadius:3}}/>
                  </div>
                  <p style={{...LBODY,fontSize:px(11),margin:0,color:V.muted}}>{doc.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <CodeBox color={CYN} lines={[
            "import faiss, numpy as np",
            "from sentence_transformers import SentenceTransformer",
            "",
            "# ── Step 1: Index documents ──────────────",
            "model = SentenceTransformer('all-MiniLM-L6-v2')",
            "docs = [",
            "  'The transformer uses self-attention...',",
            "  'CNN learns spatial features...',",
            "  # ... 10 documents",
            "]",
            "doc_embs = model.encode(docs,",
            "  normalize_embeddings=True)  # L2 normalise",
            "# shape: (10, 384)",
            "",
            "# ── Step 2: Build FAISS index ─────────────",
            "d = 384  # embedding dimension",
            "",
            "# Exact search (small datasets):",
            "index_flat = faiss.IndexFlatIP(d)  # dot product",
            "index_flat.add(doc_embs)",
            "",
            "# Approximate (large datasets):",
            "nlist = 4  # number of clusters",
            "quantiser = faiss.IndexFlatIP(d)",
            "index_ivf = faiss.IndexIVFFlat(quantiser,d,nlist)",
            "index_ivf.train(doc_embs)",
            "index_ivf.add(doc_embs)",
            "index_ivf.nprobe = 2  # clusters to search",
            "",
            "# ── Step 3: Query ─────────────────────────",
            "query = 'attention mechanism'",
            "q_emb = model.encode([query],",
            "  normalize_embeddings=True)  # (1, 384)",
            "",
            "k = 3",
            "D, I = index_flat.search(q_emb, k)",
            "# D: similarity scores, I: doc indices",
            "",
            "for rank, (score, idx) in enumerate(zip(D[0], I[0])):",
            "  print(f'#{rank+1} ({score:.3f}): {docs[idx][:40]}')",
            "",
            "# ── Pinecone cloud vector DB ──────────────",
            "import pinecone",
            "pc = pinecone.Pinecone(api_key='YOUR_KEY')",
            "index = pc.Index('my-index')",
            "",
            "# Upsert (store)",
            "index.upsert(vectors=[",
            "  ('id-0', doc_embs[0].tolist(), {'text':docs[0]}),",
            "])",
            "",
            "# Query",
            "results = index.query(",
            "  vector=q_emb[0].tolist(), top_k=3,",
            "  include_metadata=True)",
          ]}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═════════════════════════════════════════════ */
const VectorDBTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"💾",c:CYN,t:"SQL databases use exact-match indexing (B-trees, hash indexes) — they can find rows WHERE id=5 in O(log n), but can't answer 'find the 5 most similar vectors to this query'. That requires computing distances across potentially billions of vectors — a fundamentally different problem."},
    {e:"📐",c:AMB,t:"Cosine similarity: cos(θ) = (A·B)/(||A||·||B||). The standard metric for text similarity. Range [-1,1]. If you L2-normalise all vectors first (||v||=1), cosine similarity = dot product — enabling faster computation. Euclidean distance measures actual position; cosine measures angular direction."},
    {e:"⚡",c:GRN,t:"Brute-force k-NN: O(n·d) per query. For n=1B vectors of d=1536 dims: 1.5 trillion operations per query = 10+ seconds. HNSW reduces this to O(log n) with 99%+ recall — navigating a multi-layer graph of proximity connections. The key innovation behind production vector databases."},
    {e:"🏗️",c:VIO,t:"FAISS (Meta): IndexFlatL2 (exact), IndexIVFFlat (partitioned), IndexHNSWFlat (graph), IndexIVFPQ (quantised). PQ (Product Quantisation) compresses 128×float32 (512 bytes) to 64 bytes — 8× compression enabling billion-scale search on a single machine."},
    {e:"☁️",c:IND,t:"Cloud vector databases: Pinecone (managed), Weaviate (hybrid search), Qdrant (Rust, fast), Chroma (local-first), Milvus (open-source scale). All support HNSW indexing, metadata filtering, and batch upsert/query. Pinecone processes 10B+ vectors across all customers."},
    {e:"🔍",c:TEAL,t:"Hybrid search: combine dense vector search (semantic) with sparse BM25 keyword search. Reciprocal Rank Fusion merges the two rankings. Beats either approach alone for most retrieval tasks. Weaviate and Elasticsearch both support this. Critical for production search systems."},
    {e:"🤖",c:PNK,t:"RAG (Retrieval-Augmented Generation) is the main consumer of vector databases in AI systems: embed user query → search vector DB for top-k relevant documents → pass docs + query to LLM → generate grounded answer. Powers Perplexity, Bing AI, and enterprise knowledge assistants."},
    {e:"⚠️",c:ROSE,t:"Pitfalls: (1) Index stale — if new documents are added, reindex or use live updates. (2) Embedding model mismatch — query and documents must use the same model. (3) Curse of dimensionality — cosine becomes less discriminative at very high dimensions (>1000). (4) Filtering before vs. after ANN search — pre-filtering reduces recall."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights",CYN)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:CYN}}>Know</span></h2>
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
      <div style={{...LCARD,textAlign:"center",padding:"36px",background:"linear-gradient(135deg,#f0f9ff,#ecfdf5)"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{cnt}/8 mastered</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${CYN},${TEAL})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <p style={{...LBODY,maxWidth:px(500),margin:"0 auto 24px",fontSize:px(14)}}>
          You've completed the core infrastructure stack: LLMs generate text, Embeddings represent meaning,
          and Vector Databases enable fast semantic retrieval. The next lesson puts it all together in RAG Systems.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:`linear-gradient(135deg,${CYN},${TEAL})`,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: RAG Systems →
          </button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
            ← Back to Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const VectorDatabasesPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Vector Databases" lessonNum="Lesson 3 of 5"
    accent={CYN} levelLabel="Modern AI Systems"
    dotLabels={["Hero","SQL Problem","Vector Storage","Similarity Metrics","ANN Search","Architecture","FAISS Code","Cloud DBs","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#00080f 0%,#003a50 60%,#001520 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🗄️ Lesson 3 of 5 · Modern AI Systems",CYN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Vector<br/><span style={{color:"#67e8f9"}}>Databases</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:CYN,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                ChatGPT knows things from after its training cutoff. Perplexity cites current web sources.
                Enterprise copilots answer questions about internal documents. All of these need the same infrastructure:
                a database that stores millions of embedding vectors and can instantly find the most
                semantically similar ones to any query.
              </p>
              <div style={{background:"rgba(8,145,178,0.12)",border:"1px solid rgba(8,145,178,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#67e8f9",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE INSIGHT</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  SQL: "WHERE document CONTAINS 'machine learning'" → exact text match.
                  Vector DB: "find documents whose meaning is closest to this query" → semantic search.
                  The second is 10× more useful. The trick is fast approximate nearest-neighbour search in billion-vector spaces.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(8,145,178,0.06)",border:"1px solid rgba(8,145,178,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 SQL PROBLEM */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · The Problem with SQL",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Why Traditional Databases <span style={{color:CYN}}>Can't Help</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  SQL databases are exceptionally good at one thing: finding rows that exactly match a condition.
                  <code style={{background:"#f1f5f9",padding:"2px 6px",borderRadius:4,fontFamily:"monospace",fontSize:px(13)}}>WHERE title = 'machine learning'</code>
                  runs in microseconds via B-tree indexes.
                  But semantic queries are fundamentally different.
                </p>
                <div style={{background:"#fff",border:`2px solid ${ROSE}33`,borderRadius:12,padding:"14px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:ROSE,marginBottom:8,fontSize:px(13)}}>❌ What SQL can't do</div>
                  <div style={{fontFamily:"monospace",fontSize:px(12),lineHeight:2,background:"#fef2f2",borderRadius:8,padding:"10px"}}>
                    <div style={{color:"#475569"}}>{`-- You want: "find documents about AI learning"`}</div>
                    <div style={{color:ROSE}}>{`-- But doc says: "neural network training"`}</div>
                    <div style={{color:"#94a3b8"}}>{`-- SQL LIKE: WHERE content LIKE '%AI%'`}</div>
                    <div style={{color:"#94a3b8"}}>{`-- Result: 0 rows ← MISSES THE DOCUMENT`}</div>
                    <div style={{color:"#94a3b8",marginTop:8}}>{`-- Even FULL TEXT SEARCH fails:`}</div>
                    <div style={{color:ROSE}}>{`-- "machine learning" ≠ "AI training" lexically`}</div>
                  </div>
                </div>
                {[
                  {q:"SQL strength",a:"Exact match, range queries, joins, aggregations — millisecond performance at any scale"},
                  {q:"SQL weakness",a:"No semantic understanding, no fuzzy matching on meaning, no nearest-neighbour in high-D space"},
                  {q:"Vector DB strength",a:"Find k semantically similar items to any query vector — regardless of exact wording"},
                  {q:"Vector DB weakness",a:"Cannot do exact lookups, aggregations, or complex joins efficiently"},
                ].map(row=>(
                  <div key={row.q} style={{display:"flex",gap:10,marginBottom:8,padding:"6px 0",borderBottom:`1px solid ${V.border}`}}>
                    <span style={{fontWeight:700,fontSize:px(12),color:CYN,minWidth:120}}>{row.q}:</span>
                    <span style={{fontSize:px(12),color:V.muted}}>{row.a}</span>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={CYN} title="Hybrid databases — the modern approach"
                  body="PostgreSQL + pgvector: add a vector column to your SQL table. Run vector similarity search alongside regular SQL filters. Weaviate, Qdrant, and MongoDB Atlas all support hybrid search: combine semantic vector matching with exact metadata filters. The future is not 'SQL vs vector' but both together."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:10,fontSize:px(13)}}>
                    Scale problem: why indexing is essential
                  </div>
                  {[
                    {n:"1K docs",t:"~1ms",method:"Brute force fine"},
                    {n:"100K docs",t:"~100ms",method:"Brute force borderline"},
                    {n:"1M docs",t:"~1 second",method:"Needs ANN index"},
                    {n:"100M docs",t:"~100s",method:"Must use HNSW/IVF"},
                    {n:"1B docs",t:"~1000s",method:"Distributed + PQ compression"},
                  ].map(row=>(
                    <div key={row.n} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.5fr",gap:6,
                      marginBottom:4,padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontFamily:"monospace",fontSize:px(11),color:CYN}}>{row.n}</span>
                      <span style={{fontFamily:"monospace",fontSize:px(11),color:ROSE}}>{row.t}</span>
                      <span style={{fontSize:px(10),color:V.muted}}>{row.method}</span>
                    </div>
                  ))}
                  <p style={{...LBODY,fontSize:px(11),marginTop:8,marginBottom:0,color:V.muted}}>
                    Brute-force on 768-dim vectors, modern GPU. At 1B vectors HNSW achieves 1ms/query.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 VECTOR STORAGE */}
        <div ref={R(2)} style={{background:"#00080f"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Storing Vectors","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Documents as <span style={{color:"#67e8f9"}}>High-Dimensional Points</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Every document, image, audio clip, or code snippet gets converted to a fixed-size
                  dense vector (the embedding). These vectors are stored in the database alongside
                  the original content and any metadata (creation date, author, category, etc.)
                </p>
                <div style={{background:"#00131f",border:`1px solid ${CYN}33`,borderRadius:14,padding:"16px",marginBottom:16,fontFamily:"monospace",fontSize:px(11),lineHeight:2.2}}>
                  <div style={{color:"#475569"}}># Vector database record:</div>
                  {[
                    {id:"doc_001",text:"The transformer uses self-attention",vec:"[0.34, 0.12, 0.89, -0.23, ...]",dim:384},
                    {id:"doc_002",text:"CNN learns spatial features",vec:"[0.89, 0.76, -0.12, 0.45, ...]",dim:384},
                    {id:"doc_003",text:"RL agents maximise reward",vec:"[-0.12, 0.34, 0.67, 0.89, ...]",dim:384},
                  ].map(doc=>(
                    <div key={doc.id} style={{borderBottom:"1px solid #0a2030",paddingBottom:6,marginBottom:6}}>
                      <div><span style={{color:CYN}}>id: </span><span style={{color:"#94a3b8"}}>{doc.id}</span></div>
                      <div><span style={{color:CYN}}>text: </span><span style={{color:"#94a3b8"}}>"{doc.text}"</span></div>
                      <div><span style={{color:CYN}}>vector: </span><span style={{color:"#67e8f9"}}>{doc.vec} ({doc.dim}d)</span></div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <IBox color="#67e8f9" title="What gets stored"
                  body="Three components: (1) The embedding vector (float32 array, 384-4096 dimensions). (2) The original content (text, image path, etc.). (3) Metadata (date, author, category, source URL). Metadata filters let you narrow vector search: 'find similar documents from 2024 with category=finance'."/>
                <div style={{background:"#00131f",border:`1px solid ${CYN}33`,borderRadius:12,padding:"14px",marginTop:14}}>
                  <div style={{fontWeight:700,color:"#67e8f9",marginBottom:10,fontSize:px(13)}}>
                    Memory footprint per vector
                  </div>
                  {[
                    {dim:"384 (MiniLM)",size:"1.5KB",docs1M:"1.5 GB"},
                    {dim:"768 (BERT)",size:"3 KB",docs1M:"3 GB"},
                    {dim:"1536 (Ada-002)",size:"6 KB",docs1M:"6 GB"},
                    {dim:"3072 (text-3-large)",size:"12 KB",docs1M:"12 GB"},
                    {dim:"384 + PQ compression",size:"~64B",docs1M:"64 MB"},
                  ].map(row=>(
                    <div key={row.dim} style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 1fr",gap:4,
                      marginBottom:4,padding:"3px 0",borderBottom:"1px solid #0a2030"}}>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:CYN}}>{row.dim}</span>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:AMB}}>{row.size}</span>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:GRN}}>{row.docs1M}</span>
                    </div>
                  ))}
                  <p style={{...LBODY,fontSize:px(10),color:"#1e4a5a",marginTop:4,marginBottom:0}}>
                    float32. PQ = Product Quantisation (lossy compression).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S3 SIMILARITY METRICS */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Similarity Metrics",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>Measuring <span style={{color:CYN}}>Closeness</span></h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(24)}}>
              Different distance metrics capture different notions of "similarity."
              Choosing the right metric for your embedding model is critical — using the wrong
              one can dramatically reduce retrieval quality.
            </p>
            <SimilarityDemo/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <div style={{background:CYN+"0d",border:`2px solid ${CYN}22`,borderRadius:12,padding:"16px"}}>
                <div style={{fontWeight:800,color:CYN,fontSize:px(14),marginBottom:8}}>Cosine Similarity</div>
                <Formula color={CYN}>cos(θ) = A·B / (||A||·||B||)</Formula>
                <p style={{...LBODY,fontSize:px(12),margin:0}}>
                  Measures angle between vectors. Range [-1,1]. Ignores vector magnitude —
                  "cat" and "cats cats cats cats" are identical. <strong>Best for text</strong>.
                  With L2-normalised vectors, equals dot product.
                </p>
              </div>
              <div style={{background:GRN+"0d",border:`2px solid ${GRN}22`,borderRadius:12,padding:"16px"}}>
                <div style={{fontWeight:800,color:GRN,fontSize:px(14),marginBottom:8}}>Euclidean Distance (L2)</div>
                <Formula color={GRN}>d = √Σ(Aᵢ−Bᵢ)²</Formula>
                <p style={{...LBODY,fontSize:px(12),margin:0}}>
                  Straight-line distance. Range [0, ∞). Sensitive to vector magnitude.
                  <strong>Best for image features</strong> and situations where magnitude carries meaning.
                  FAISS IndexFlatL2 uses this.
                </p>
              </div>
              <div style={{background:AMB+"0d",border:`2px solid ${AMB}22`,borderRadius:12,padding:"16px"}}>
                <div style={{fontWeight:800,color:AMB,fontSize:px(14),marginBottom:8}}>Dot Product (Inner Product)</div>
                <Formula color={AMB}>s = A · B = ΣAᵢBᵢ</Formula>
                <p style={{...LBODY,fontSize:px(12),margin:0}}>
                  Fastest to compute — no division. Magnitude-sensitive: longer vectors score higher.
                  <strong>Best for recommendation</strong> (user × item) where popularity encoded in magnitude.
                  FAISS IndexFlatIP.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* S4 ANN */}
        <div ref={R(4)} style={{background:"#00080f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Approximate Nearest Neighbour Search","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Fast Search at <span style={{color:"#67e8f9"}}>Billion Scale</span></h2>
            <p style={{...LBODY,color:"#94a3b8",maxWidth:px(700),marginBottom:px(24)}}>
              Finding the exact k nearest neighbours requires scanning every vector — O(n·d) per query.
              Approximate algorithms trade a small recall reduction for massive speedup.
              At 1B vectors, HNSW achieves 1ms/query with 99% recall — the exact answer takes 10 minutes.
            </p>
            <ANNDemo/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <div style={{background:"#00131f",border:`1px solid ${CYN}33`,borderRadius:14,padding:"16px"}}>
                <div style={{fontWeight:700,color:"#67e8f9",marginBottom:10,fontSize:px(13)}}>HNSW — Hierarchical Navigable Small World</div>
                <p style={{...LBODY,fontSize:px(13),color:"#94a3b8",marginBottom:10}}>
                  Builds a multi-layer proximity graph. Layer 0: dense connections. Higher layers: sparse long-range.
                  Search starts at top layer (few nodes, coarse navigation) and descends.
                  O(log n) per query. M=16 connections per node typical.
                </p>
                <div style={{fontFamily:"monospace",fontSize:px(11),color:CYN,background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"8px",lineHeight:2}}>
                  import faiss<br/>
                  d = 128; M = 16; ef = 64<br/>
                  index = faiss.IndexHNSWFlat(d, M)<br/>
                  index.hnsw.efSearch = ef<br/>
                  index.add(vectors)
                </div>
              </div>
              <div style={{background:"#00131f",border:`1px solid ${CYN}33`,borderRadius:14,padding:"16px"}}>
                <div style={{fontWeight:700,color:"#67e8f9",marginBottom:10,fontSize:px(13)}}>IVF — Inverted File Index (IVF)</div>
                <p style={{...LBODY,fontSize:px(13),color:"#94a3b8",marginBottom:10}}>
                  Cluster vectors into nlist Voronoi cells using k-means. At query time, only search nprobe nearest clusters.
                  Trade recall for speed: nprobe=8/1024 = 0.8% of data searched.
                  Memory-efficient. Better for very large n (&gt;100M).
                </p>
                <div style={{fontFamily:"monospace",fontSize:px(11),color:CYN,background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"8px",lineHeight:2}}>
                  nlist = 1024; nprobe = 8<br/>
                  q = faiss.IndexFlatL2(d)<br/>
                  index = faiss.IndexIVFFlat(q,d,nlist)<br/>
                  index.train(vectors)<br/>
                  index.nprobe = nprobe
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S5 ARCHITECTURE */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Vector Database Architecture",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Inside a <span style={{color:CYN}}>Vector DB</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {l:"Embedding Service",c:AMB,
                    d:"Takes raw content (text, images) and calls an embedding model API (sentence-transformers, OpenAI, Cohere). Manages batching, retries, caching. Some vector DBs (Weaviate) have built-in vectorisation modules."},
                  {l:"Vector Index",c:CYN,
                    d:"HNSW, IVF, or flat index storing all vectors. Lives in memory (HNSW) or on disk (IVF+SSD). The index is the core data structure enabling fast k-NN queries. Must be rebuilt when index type changes."},
                  {l:"Metadata Store",c:VIO,
                    d:"SQL or document database storing vector IDs, original content, and filterable metadata (date, category, author). Enables pre-filtering: 'find similar documents from category=finance AND year=2024'."},
                  {l:"Query Engine",c:GRN,
                    d:"Orchestrates the query: (1) embed the query, (2) apply pre-filter on metadata, (3) ANN search in filtered subset, (4) re-rank results, (5) return top-k with metadata and scores."},
                  {l:"Replication & Sharding",c:IND,
                    d:"Production vector DBs shard data across nodes (horizontal scaling) and replicate for fault tolerance. Pinecone abstracts this completely. Milvus uses etcd for coordination. Important for billion-scale deployments."},
                ].map(item=>(
                  <div key={item.l} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                    <div style={{width:10,height:10,borderRadius:2,flexShrink:0,background:item.c,marginTop:5}}/>
                    <div><span style={{fontWeight:700,color:item.c,fontSize:px(13)}}>{item.l}: </span>
                    <span style={{fontSize:px(13),color:V.muted}}>{item.d}</span></div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f0f9ff",border:`2px solid ${CYN}22`,marginBottom:14}}>
                  <div style={{fontWeight:700,color:CYN,marginBottom:10,fontSize:px(13)}}>Vector DB Ecosystem (2024)</div>
                  {[
                    {name:"Pinecone",type:"Managed cloud",scale:"1B+",note:"Easiest to start, proprietary"},
                    {name:"Weaviate",type:"Open source",scale:"100M+",note:"Hybrid search, modules"},
                    {name:"Qdrant",type:"Open source (Rust)",scale:"100M+",note:"Fast, rich filtering"},
                    {name:"Chroma",type:"Local / cloud",scale:"10M+",note:"LangChain native"},
                    {name:"Milvus",type:"Open source",scale:"1B+",note:"Production-grade, complex"},
                    {name:"pgvector",type:"PostgreSQL ext.",scale:"10M",note:"SQL + vectors, simple"},
                    {name:"FAISS",type:"Library",scale:"1B+",note:"Meta research, no server"},
                    {name:"Elasticsearch",type:"Search + vectors",scale:"100M+",note:"Hybrid, mature ops"},
                  ].map(row=>(
                    <div key={row.name} style={{display:"grid",gridTemplateColumns:"1fr 1fr 0.8fr 1.2fr",gap:4,
                      marginBottom:4,padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontWeight:700,color:CYN,fontSize:px(11)}}>{row.name}</span>
                      <span style={{fontSize:px(10),color:V.muted}}>{row.type}</span>
                      <span style={{fontFamily:"monospace",fontSize:px(10),color:GRN}}>{row.scale}</span>
                      <span style={{fontSize:px(10),color:V.muted}}>{row.note}</span>
                    </div>
                  ))}
                </div>
                <IBox color={CYN} title="Two-stage retrieval"
                  body="Production search systems use two stages: (1) ANN retrieval — fast approximate search returning top-100 candidates in <5ms. (2) Re-ranking — a more expensive cross-encoder model (BERT) re-scores the top-100 with full pairwise attention between query and document. Final top-10 has dramatically better quality. Used in Bing, Google, and all production search systems."/>
              </div>
            </div>
          </div>
        </div>

        {/* S6 FAISS CODE */}
        <div ref={R(6)} style={{background:"#00080f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · FAISS & Cloud APIs","#67e8f9")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Vector Search <span style={{color:"#67e8f9"}}>in Code</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={CYN} lines={[
                "import faiss",
                "import numpy as np",
                "from sentence_transformers import SentenceTransformer",
                "",
                "# ── FAISS exact search ───────────────",
                "d = 128  # embedding dimension",
                "n = 1000  # number of vectors",
                "",
                "vectors = np.random.random((n,d)).astype('float32')",
                "",
                "# L2 (Euclidean) index",
                "index_l2 = faiss.IndexFlatL2(d)",
                "index_l2.add(vectors)",
                "print(f'Index size: {index_l2.ntotal}')  # 1000",
                "",
                "# Inner product (cosine with normalised vecs)",
                "faiss.normalize_L2(vectors)  # in-place L2 norm",
                "index_ip = faiss.IndexFlatIP(d)",
                "index_ip.add(vectors)",
                "",
                "# Query: find 5 nearest to query vector",
                "query = np.random.random((1, d)).astype('float32')",
                "faiss.normalize_L2(query)",
                "D, I = index_ip.search(query, k=5)",
                "print('Distances:', D)  # cosine similarities",
                "print('Indices:',   I)  # doc indices",
                "",
                "# ── FAISS HNSW (fast, large-scale) ──",
                "M = 16  # connections per layer",
                "index_hnsw = faiss.IndexHNSWFlat(d, M)",
                "index_hnsw.hnsw.efConstruction = 40",
                "index_hnsw.hnsw.efSearch = 64",
                "index_hnsw.add(vectors)",
                "",
                "# ── Semantic search with SentTransformers ─",
                "model = SentenceTransformer('all-MiniLM-L6-v2')",
                "docs = ['ML is transforming AI', 'Dog training tips',",
                "        'Python programming guide', 'Deep learning basics']",
                "",
                "doc_embs = model.encode(docs, normalize_embeddings=True)",
                "index = faiss.IndexFlatIP(384)",
                "index.add(doc_embs.astype('float32'))",
                "",
                "query = 'artificial intelligence training'",
                "q_emb = model.encode([query], normalize_embeddings=True)",
                "D, I = index.search(q_emb.astype('float32'), k=2)",
                "for i, (d2, idx) in enumerate(zip(D[0], I[0])):",
                "  print(f'#{i+1} sim={d2:.3f}: {docs[idx]}')",
                "# #1 sim=0.891: ML is transforming AI",
                "# #2 sim=0.762: Deep learning basics",
                "",
                "# ── Weaviate cloud vector DB ─────────",
                "import weaviate",
                "client = weaviate.connect_to_wcs(",
                "  cluster_url='YOUR_CLUSTER_URL',",
                "  auth_credentials=weaviate.auth.ApiKey('key'))",
                "",
                "collection = client.collections.get('Documents')",
                "response = collection.query.near_text(",
                "  query='machine learning training',",
                "  limit=5,",
                "  return_metadata=MetadataQuery(distance=True))",
                "for obj in response.objects:",
                "  print(obj.properties, obj.metadata.distance)",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"faiss.IndexFlatL2(d)",c:CYN,d:"Exact L2 search. O(n·d) per query. Use for n<100K or when 100% accuracy is required. Gold standard for benchmarking other indices."},
                  {l:"faiss.IndexFlatIP(d)",c:AMB,d:"Exact inner product. Equivalent to cosine similarity when vectors are L2-normalised. Always normalise with faiss.normalize_L2() before adding and querying."},
                  {l:"faiss.IndexHNSWFlat",c:GRN,d:"HNSW graph index. Fast search (O(log n)), high recall (99%+). Best for medium datasets (1M-100M). M=16-64 controls graph connectivity vs memory. efSearch=64 balances recall/speed."},
                  {l:"index.search(query, k)",c:VIO,d:"Returns (D, I): D=distances/similarities (shape k), I=indices of nearest neighbours (shape k). For IVF indices, first call index.train(vectors) then index.add(vectors)."},
                  {l:"normalize_embeddings=True",c:IND,d:"L2-normalise output embeddings. Makes cosine similarity = dot product. Always do this if using IndexFlatIP. sentence-transformers returns float32 arrays directly ready for FAISS."},
                  {l:"Weaviate near_text",c:TEAL,d:"Cloud-managed vector DB with built-in vectorisation. near_text embeds the query automatically using the configured model. Supports hybrid search, metadata filtering, batch imports."},
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
            {STag("Section 7 · Real-World Applications",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>Vector DBs <span style={{color:CYN}}>Powering AI Systems</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🤖",c:CYN,t:"RAG — Retrieval-Augmented Generation",
                  b:"The most important application. User asks a question → embed query → vector search over knowledge base → pass top-k documents to LLM → generate grounded answer. Powers Perplexity, Bing AI, Notion AI, and every enterprise knowledge assistant.",
                  ex:"ChatGPT with memory, Bing AI, Perplexity"},
                {e:"🛍️",c:AMB,t:"Recommendation Systems",
                  b:"Embed user history and items. Find items whose vectors are nearest to the user's preference vector. Pinterest: billions of pin embeddings. Spotify: song and playlist embeddings. Netflix: movie embeddings. Real-time k-NN lookup in <10ms.",
                  ex:"Netflix, Spotify, Pinterest, Amazon"},
                {e:"🔒",c:ROSE,t:"Fraud & Anomaly Detection",
                  b:"Embed transaction patterns. Flag transactions whose vectors are far from a user's historical cluster — anomalies in embedding space are suspicious behaviours. Works across different fraud patterns without explicit rules.",
                  ex:"Stripe, PayPal, bank fraud systems"},
                {e:"💊",c:GRN,t:"Drug Discovery",
                  b:"Embed molecular structures and protein sequences. Search for molecules similar to known drugs. Identify proteins similar to known drug targets. AlphaFold + vector search accelerates hit identification from weeks to hours.",
                  ex:"Schrödinger, BenevolentAI, Insilico"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"18px 20px"}}>
                  <div style={{fontSize:px(32),marginBottom:8}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(14),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(12),marginBottom:10,color:V.muted}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:V.cream,borderRadius:6,padding:"4px 8px",fontSize:px(10),color:a.c}}>{a.ex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S8 GAME */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Mini Game",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Find the Closest Vector</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Given a query (vector or text), find the most similar document.
              Tests your understanding of cosine similarity, Euclidean distance, and semantic search.
            </p>
            <FindClosestGame/>
          </div>
        </div>

        {/* S9 PROJECT */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Project",CYN)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>📚 Document Retrieval System</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A complete retrieval pipeline: 10 pre-indexed AI/ML documents.
              Enter any query, watch the pipeline execute, see ranked results with similarity scores.
            </p>
            <DocumentRetrievalProject/>
          </div>
        </div>

        {/* S10 INSIGHTS */}
        <div ref={R(10)} style={{background:V.cream}}>
          <VectorDBTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default VectorDatabasesPage;