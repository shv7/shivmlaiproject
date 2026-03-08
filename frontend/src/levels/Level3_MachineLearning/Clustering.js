import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — CLUSTERING
   Level 3 · Machine Learning · Lesson 6 of 7
   Accent: Pink #ec4899
══════════════════════════════════════════════════════════════════ */
const PNK  = "#ec4899";
const CYN  = "#0891b2";
const AMB  = "#f59e0b";
const GRN  = "#059669";
const VIO  = "#7c3aed";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const RED  = "#ef4444";
const INK  = "#1e293b";

const Formula = ({children,color=PNK}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:px(14),
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(16)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=CYN}) => (
  <div style={{fontFamily:"monospace",background:"#0d0a2a",borderRadius:px(10),
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("//")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — k-means animation ════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W,H,raf,t=0,phase=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);

    // 3 clusters of data points (normalized)
    const CLUSTERS = [
      {cx:0.22,cy:0.65,col:PNK, pts:[{x:0.15,y:0.60},{x:0.20,y:0.72},{x:0.28,y:0.58},{x:0.18,y:0.55},{x:0.25,y:0.68},{x:0.14,y:0.70}]},
      {cx:0.65,cy:0.30,col:CYN, pts:[{x:0.60,y:0.24},{x:0.68,y:0.36},{x:0.72,y:0.22},{x:0.58,y:0.34},{x:0.70,y:0.28},{x:0.62,y:0.40}]},
      {cx:0.75,cy:0.72,col:AMB, pts:[{x:0.70,y:0.68},{x:0.78,y:0.80},{x:0.82,y:0.65},{x:0.68,y:0.76},{x:0.80,y:0.72},{x:0.72,y:0.62}]},
    ];
    // Initial centroids start at wrong positions then converge
    const initialCentroids=[{x:0.3,y:0.3},{x:0.5,y:0.7},{x:0.8,y:0.4}];

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#100818"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(236,72,153,0.06)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      const iter=Math.min(1,t*0.4);
      // draw coloured region backgrounds (voronoi approximation)
      if(iter>0.3){
        CLUSTERS.forEach(cl=>{
          const cx2=cl.cx*W, cy2=cl.cy*H;
          const g=ctx.createRadialGradient(cx2,cy2,0,cx2,cy2,W*0.35);
          g.addColorStop(0,cl.col+"15"); g.addColorStop(1,cl.col+"00");
          ctx.beginPath();ctx.arc(cx2,cy2,W*0.35,0,Math.PI*2);
          ctx.fillStyle=g; ctx.fill();
        });
      }
      // draw connection lines from points to centroids
      if(iter>0.5){
        CLUSTERS.forEach(cl=>{
          const ccx=cl.cx*W, ccy=cl.cy*H;
          cl.pts.forEach(p=>{
            ctx.beginPath();ctx.moveTo(p.x*W,p.y*H);ctx.lineTo(ccx,ccy);
            ctx.strokeStyle=cl.col+"30"; ctx.lineWidth=1; ctx.stroke();
          });
        });
      }
      // draw data points
      CLUSTERS.forEach(cl=>{
        cl.pts.forEach(p=>{
          const px2=p.x*W, py2=p.y*H;
          const showColor=iter>0.3;
          const col=showColor?cl.col:"#64748b";
          const g2=ctx.createRadialGradient(px2,py2,0,px2,py2,14);
          g2.addColorStop(0,col+"55"); g2.addColorStop(1,col+"00");
          ctx.beginPath();ctx.arc(px2,py2,14,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
          ctx.beginPath();ctx.arc(px2,py2,5,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
          ctx.beginPath();ctx.arc(px2,py2,5,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
        });
      });
      // draw centroids (converging)
      CLUSTERS.forEach((cl,i)=>{
        const startC=initialCentroids[i];
        const ccx=(startC.x+(cl.cx-startC.x)*Math.min(1,iter*1.5))*W;
        const ccy=(startC.y+(cl.cy-startC.y)*Math.min(1,iter*1.5))*H;
        const g3=ctx.createRadialGradient(ccx,ccy,0,ccx,ccy,22);
        g3.addColorStop(0,cl.col+"88"); g3.addColorStop(1,cl.col+"00");
        ctx.beginPath();ctx.arc(ccx,ccy,22,0,Math.PI*2);ctx.fillStyle=g3;ctx.fill();
        ctx.beginPath();ctx.moveTo(ccx-10,ccy);ctx.lineTo(ccx+10,ccy);
        ctx.moveTo(ccx,ccy-10);ctx.lineTo(ccx,ccy+10);
        ctx.strokeStyle=cl.col; ctx.lineWidth=3;
        ctx.shadowColor=cl.col; ctx.shadowBlur=12; ctx.stroke(); ctx.shadowBlur=0;
        ctx.font="bold 10px sans-serif"; ctx.fillStyle=cl.col+"cc"; ctx.textAlign="center";
        ctx.fillText(`μ${i+1}`,ccx,ccy+24);
      });
      // labels
      ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      [[PNK,"Cluster 1"],[CYN,"Cluster 2"],[AMB,"Cluster 3"],["#64748b","✕ Centroids (μ)"]].forEach(([col,lbl],i)=>{
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

/* ══════ K-MEANS INTERACTIVE CANVAS ════════════════════════════ */
const KMeansCanvas = () => {
  const canvasRef = useRef();
  const [k, setK] = useState(3);
  const [points, setPoints] = useState([
    {x:1.2,y:1.4},{x:1.8,y:1.1},{x:2.1,y:1.7},{x:1.5,y:2.0},{x:0.9,y:1.6},
    {x:6.1,y:1.2},{x:6.8,y:1.8},{x:7.2,y:0.9},{x:6.5,y:2.1},{x:7.0,y:1.5},
    {x:3.8,y:6.2},{x:4.2,y:6.8},{x:4.8,y:5.9},{x:3.5,y:6.5},{x:4.5,y:7.1},
  ]);
  const [centroids, setCentroids] = useState(null);
  const [labels, setLabels] = useState(null);
  const [iter, setIter] = useState(0);
  const [running, setRunning] = useState(false);

  const COLS = [PNK, CYN, AMB, GRN, VIO];
  const MAX_X=9, MAX_Y=9;

  const dist=(p,c)=>Math.sqrt((p.x-c.x)**2+(p.y-c.y)**2);

  const initCentroids=useCallback(()=>{
    // k-means++ initialization
    const n=points.length;
    const first=points[Math.floor(Math.random()*n)];
    const ctrs=[{x:first.x,y:first.y}];
    while(ctrs.length<k){
      const dists=points.map(p=>Math.min(...ctrs.map(c=>dist(p,c)**2)));
      const sum=dists.reduce((a,b)=>a+b,0);
      let r=Math.random()*sum;
      for(let i=0;i<n;i++){
        r-=dists[i];
        if(r<=0){ctrs.push({x:points[i].x,y:points[i].y});break;}
      }
    }
    return ctrs;
  },[points,k]);

  const assign=useCallback((ctrs)=>{
    return points.map(p=>ctrs.reduce((best,c,i)=>dist(p,c)<dist(p,ctrs[best])?i:best,0));
  },[points]);

  const updateCentroids=useCallback((lbls)=>{
    return Array.from({length:k},(_,i)=>{
      const clPts=points.filter((_,j)=>lbls[j]===i);
      if(clPts.length===0)return{x:Math.random()*MAX_X,y:Math.random()*MAX_Y};
      return{x:clPts.reduce((s,p)=>s+p.x,0)/clPts.length,
             y:clPts.reduce((s,p)=>s+p.y,0)/clPts.length};
    });
  },[points,k]);

  const step=useCallback(()=>{
    if(!centroids){
      const c=initCentroids();
      const l=assign(c);
      setCentroids(c);setLabels(l);setIter(1);return;
    }
    const newC=updateCentroids(labels);
    const newL=assign(newC);
    setCentroids(newC);setLabels(newL);setIter(i=>i+1);
  },[centroids,labels,initCentroids,assign,updateCentroids]);

  const reset=()=>{setCentroids(null);setLabels(null);setIter(0);setRunning(false);};

  useEffect(()=>{
    if(running){const id=setTimeout(()=>step(),600);return()=>clearTimeout(id);}
  },[running,step,iter]);

  const redraw=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=40;
    const toC=(x,y)=>({x:pad+(x/MAX_X)*(W-2*pad),y:H-pad-(y/MAX_Y)*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fdf5ff"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#f3e8ff"; ctx.lineWidth=1;
    for(let x=0;x<=9;x++){const{x:cx}=toC(x,0);ctx.beginPath();ctx.moveTo(cx,pad/2);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let y=0;y<=9;y++){const{y:cy}=toC(0,y);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.strokeStyle="#334155"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#64748b"; ctx.textAlign="center";
    ctx.fillText("Feature 1 (e.g. annual spend)",W/2,H-4);
    ctx.save();ctx.translate(12,H/2);ctx.rotate(-Math.PI/2);
    ctx.fillText("Feature 2 (e.g. visit frequency)",0,0);ctx.restore();
    // coloured regions
    if(centroids){
      for(let gx=0;gx<=MAX_X;gx+=0.3){
        for(let gy=0;gy<=MAX_Y;gy+=0.3){
          const cl=centroids.reduce((b,c,i)=>dist({x:gx,y:gy},c)<dist({x:gx,y:gy},centroids[b])?i:b,0);
          const{x:cx,y:cy}=toC(gx,gy);
          ctx.fillStyle=COLS[cl]+"14"; ctx.fillRect(cx,cy,W/30,H/30);
        }
      }
    }
    // connection lines
    if(centroids&&labels){
      points.forEach((p,i)=>{
        const{x:px2,y:py2}=toC(p.x,p.y);
        const{x:cx2,y:cy2}=toC(centroids[labels[i]].x,centroids[labels[i]].y);
        ctx.beginPath();ctx.moveTo(px2,py2);ctx.lineTo(cx2,cy2);
        ctx.strokeStyle=COLS[labels[i]]+"33"; ctx.lineWidth=1; ctx.stroke();
      });
    }
    // points
    points.forEach((p,i)=>{
      const{x:cx,y:cy}=toC(p.x,p.y);
      const col=labels?COLS[labels[i]]:"#94a3b8";
      const gg=ctx.createRadialGradient(cx,cy,0,cx,cy,14);
      gg.addColorStop(0,col+"66"); gg.addColorStop(1,col+"00");
      ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
    });
    // centroids
    if(centroids){
      centroids.forEach((ct,i)=>{
        const{x:cx,y:cy}=toC(ct.x,ct.y);
        const gg=ctx.createRadialGradient(cx,cy,0,cx,cy,20);
        gg.addColorStop(0,COLS[i]+"88"); gg.addColorStop(1,COLS[i]+"00");
        ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx-12,cy);ctx.lineTo(cx+12,cy);
        ctx.moveTo(cx,cy-12);ctx.lineTo(cx,cy+12);
        ctx.strokeStyle=COLS[i]; ctx.lineWidth=3;
        ctx.shadowColor=COLS[i]; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
        ctx.font="bold 11px sans-serif"; ctx.fillStyle=COLS[i];ctx.textAlign="center";
        ctx.fillText(`μ${i+1}(${ct.x.toFixed(1)},${ct.y.toFixed(1)})`,cx,cy-16);
      });
    }
  },[points,centroids,labels,k]);

  useEffect(()=>{redraw();},[redraw]);

  const handleClick=(e)=>{
    const c=canvasRef.current; if(!c||running)return;
    const rect=c.getBoundingClientRect();
    const W=c.offsetWidth,H=c.offsetHeight,pad=40;
    const x=(e.clientX-rect.left-pad)/(W-2*pad)*MAX_X;
    const y=MAX_Y-(e.clientY-rect.top-pad)/(H-2*pad)*MAX_Y;
    if(x<0||x>MAX_X||y<0||y>MAX_Y)return;
    setPoints(ps=>[...ps,{x:+x.toFixed(1),y:+y.toFixed(1)}]);
    setCentroids(null);setLabels(null);setIter(0);
  };

  const inertia=centroids&&labels?points.reduce((s,p,i)=>s+dist(p,centroids[labels[i]])**2,0):null;

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:PNK,marginBottom:8,fontSize:px(15)}}>
        🎯 Interactive K-Means Visualizer — Step through the algorithm
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Watch K-Means converge in real time. Step manually or auto-run.
        Click the canvas to add new data points.
        The coloured regions show the <strong>Voronoi diagram</strong> — every point's nearest centroid.
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef} onClick={handleClick}
            style={{width:"100%",height:300,borderRadius:12,
              border:`1px solid ${PNK}22`,display:"block",cursor:"crosshair"}}/>
          <div style={{fontSize:px(11),color:V.muted,marginTop:6,textAlign:"center"}}>
            💡 Click canvas to add points · Coloured regions = nearest cluster
          </div>
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:px(12),color:V.muted}}>k (clusters)</span>
              <span style={{fontFamily:"monospace",fontWeight:700,color:PNK}}>{k}</span>
            </div>
            <input type="range" min={2} max={5} step={1} value={k}
              onChange={e=>{setK(+e.target.value);reset();}}
              style={{width:"100%",accentColor:PNK}}/>
          </div>
          <div style={{background:"#0d1117",borderRadius:10,padding:"12px",fontFamily:"monospace",fontSize:px(12)}}>
            <div style={{color:"#475569",marginBottom:4}}># Algorithm status:</div>
            <div style={{color:"#94a3b8"}}>k = {k} clusters</div>
            <div style={{color:"#94a3b8"}}>n = {points.length} points</div>
            <div style={{color:"#94a3b8"}}>iteration = {iter}</div>
            {inertia!==null&&<div style={{color:PNK,fontWeight:700}}>inertia = {inertia.toFixed(1)}</div>}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={step}
              style={{flex:1,background:PNK,border:"none",borderRadius:8,
                padding:"10px",color:"#fff",fontWeight:700,fontSize:px(12),cursor:"pointer"}}>
              Step →
            </button>
            <button onClick={()=>setRunning(r=>!r)}
              style={{flex:1,background:running?AMB:CYN,border:"none",borderRadius:8,
                padding:"10px",color:"#fff",fontWeight:700,fontSize:px(12),cursor:"pointer"}}>
              {running?"⏸ Pause":"▶ Run"}
            </button>
          </div>
          <button onClick={reset}
            style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:8,
              padding:"8px",fontSize:px(11),color:V.muted,cursor:"pointer"}}>
            ↺ Reset
          </button>
          {centroids&&(
            <div style={{...LCARD,padding:"10px"}}>
              <div style={{fontWeight:700,color:PNK,fontSize:px(11),marginBottom:6}}>
                CENTROID POSITIONS
              </div>
              {centroids.map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontFamily:"monospace",fontSize:px(11),color:COLS[i]}}>μ{i+1}</span>
                  <span style={{fontFamily:"monospace",fontSize:px(11),color:"#94a3b8"}}>
                    ({c.x.toFixed(1)}, {c.y.toFixed(1)})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ FIND THE CLUSTERS GAME ════════════════════════════════ */
const FindClustersGame = () => {
  const canvasRef=useRef();
  const [centers,setCenters]=useState([{x:4,y:7},{x:7,y:3}]);
  const [locked,setLocked]=useState(false);
  const [score,setScore]=useState(null);
  const [dragging,setDragging]=useState(null);

  const COLS2=[PNK,CYN];
  const OPTIMAL=[{x:2.1,y:7.0},{x:7.2,y:2.8}];
  const DATA=[
    {x:1.4,y:7.2},{x:2.2,y:6.8},{x:1.8,y:7.8},{x:2.8,y:6.5},{x:1.2,y:6.2},{x:2.5,y:7.5},
    {x:7.0,y:2.4},{x:7.8,y:3.2},{x:6.4,y:2.8},{x:7.5,y:1.8},{x:8.0,y:3.0},{x:6.8,y:2.0},
  ];
  const MAX=9;

  const dist2=(a,b)=>Math.sqrt((a.x-b.x)**2+(a.y-b.y)**2);
  const getLabels=useCallback(()=>DATA.map(p=>centers.reduce((b,c,i)=>dist2(p,c)<dist2(p,centers[b])?i:b,0)),[centers]);
  const inertia2=useCallback(()=>{
    const lbls=getLabels();
    return DATA.reduce((s,p,i)=>s+dist2(p,centers[lbls[i]])**2,0);
  },[centers,getLabels]);

  const redraw=useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pad=36;
    const toC=(x,y)=>({x:pad+(x/MAX)*(W-2*pad),y:H-pad-(y/MAX)*(H-2*pad)});
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#fff5fd"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#fce7f3"; ctx.lineWidth=1;
    for(let x=0;x<=9;x++){const{x:cx}=toC(x,0);ctx.beginPath();ctx.moveTo(cx,pad/2);ctx.lineTo(cx,H-pad);ctx.stroke();}
    for(let y=0;y<=9;y++){const{y:cy}=toC(0,y);ctx.beginPath();ctx.moveTo(pad,cy);ctx.lineTo(W-pad/2,cy);ctx.stroke();}
    ctx.strokeStyle="#334155"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad/2,H-pad);ctx.stroke();
    ctx.beginPath();ctx.moveTo(pad,pad/2);ctx.lineTo(pad,H-pad);ctx.stroke();
    const lbls=getLabels();
    // regions
    for(let gx=0;gx<=MAX;gx+=0.4){
      for(let gy=0;gy<=MAX;gy+=0.4){
        const cl=centers.reduce((b,c2,i)=>dist2({x:gx,y:gy},c2)<dist2({x:gx,y:gy},centers[b])?i:b,0);
        const{x:cx,y:cy}=toC(gx,gy);
        ctx.fillStyle=COLS2[cl]+"10"; ctx.fillRect(cx,cy,W/22,H/22);
      }
    }
    // optimal centroids if locked
    if(locked){
      OPTIMAL.forEach((o,i)=>{
        const{x:cx,y:cy}=toC(o.x,o.y);
        ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);
        ctx.strokeStyle=GRN+"88"; ctx.lineWidth=2; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.font="bold 10px sans-serif"; ctx.fillStyle=GRN+"99"; ctx.textAlign="center";
        ctx.fillText("optimal",cx,cy-22);
      });
    }
    // data points
    DATA.forEach((p,i)=>{
      const{x:cx,y:cy}=toC(p.x,p.y);
      const col=COLS2[lbls[i]];
      const gg=ctx.createRadialGradient(cx,cy,0,cx,cy,14);
      gg.addColorStop(0,col+"55"); gg.addColorStop(1,col+"00");
      ctx.beginPath();ctx.arc(cx,cy,14,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.strokeStyle="#fff";ctx.lineWidth=1.5;ctx.stroke();
    });
    // user centroids
    centers.forEach((ct,i)=>{
      const{x:cx,y:cy}=toC(ct.x,ct.y);
      const gg=ctx.createRadialGradient(cx,cy,0,cx,cy,22);
      gg.addColorStop(0,COLS2[i]+"88"); gg.addColorStop(1,COLS2[i]+"00");
      ctx.beginPath();ctx.arc(cx,cy,22,0,Math.PI*2);ctx.fillStyle=gg;ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx-13,cy);ctx.lineTo(cx+13,cy);
      ctx.moveTo(cx,cy-13);ctx.lineTo(cx,cy+13);
      ctx.strokeStyle=COLS2[i]; ctx.lineWidth=3;
      ctx.shadowColor=COLS2[i]; ctx.shadowBlur=10; ctx.stroke(); ctx.shadowBlur=0;
      ctx.font="bold 11px monospace"; ctx.fillStyle=COLS2[i]; ctx.textAlign="center";
      ctx.fillText(`μ${i+1}`,cx,cy-18);
    });
  },[centers,locked,getLabels]);

  useEffect(()=>{redraw();},[redraw]);

  const handleMouseMove=useCallback((e)=>{
    if(dragging===null||locked)return;
    const c=canvasRef.current; if(!c)return;
    const rect=c.getBoundingClientRect();
    const W=c.offsetWidth,H=c.offsetHeight,pad=36;
    const x=((e.clientX-rect.left-pad)/(W-2*pad))*MAX;
    const y=MAX-((e.clientY-rect.top-pad)/(H-2*pad))*MAX;
    if(x<0||x>MAX||y<0||y>MAX)return;
    setCenters(cs=>cs.map((c2,i)=>i===dragging?{x:+x.toFixed(1),y:+y.toFixed(1)}:c2));
  },[dragging,locked]);

  const handleMouseDown=(e)=>{
    if(locked)return;
    const c=canvasRef.current; if(!c)return;
    const rect=c.getBoundingClientRect();
    const W=c.offsetWidth,H=c.offsetHeight,pad=36;
    const mx=((e.clientX-rect.left-pad)/(W-2*pad))*MAX;
    const my=MAX-((e.clientY-rect.top-pad)/(H-2*pad))*MAX;
    const near=centers.findIndex(ct=>dist2({x:mx,y:my},ct)<1.2);
    if(near>=0)setDragging(near);
  };

  const lockIn=()=>{
    const err=inertia2();
    const optInertia=DATA.reduce((s,p,i)=>s+dist2(p,OPTIMAL[i<6?0:1])**2,0);
    const pct=Math.max(0,Math.min(100,100-(err-optInertia)/optInertia*100));
    setScore(Math.round(pct));
    setLocked(true);
  };

  return (
    <div style={{...LCARD,background:"#fff5fd",border:`2px solid ${PNK}33`}}>
      <div style={{fontWeight:800,color:PNK,fontSize:px(17),marginBottom:8}}>
        🎮 Find the Clusters — Drag Centroids to Group the Data
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Drag the <strong style={{color:PNK}}>pink (μ1)</strong> and <strong style={{color:CYN}}>cyan (μ2)</strong> centroids
        to minimise the total distance from points to their nearest centroid.
        Lock In to reveal the optimal positions and see your score!
      </p>
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={()=>setDragging(null)}
            onMouseLeave={()=>setDragging(null)}
            style={{width:"100%",height:290,borderRadius:12,
              border:`1px solid ${PNK}22`,display:"block",
              cursor:locked?"default":dragging!==null?"grabbing":"grab"}}/>
          {score!==null&&(
            <div style={{background:GRN+"11",border:`1px solid ${GRN}44`,borderRadius:8,
              padding:"8px 14px",marginTop:8,fontWeight:700,color:GRN,fontSize:px(13)}}>
              Score: {score}% — {score>=90?"🏆 Optimal!":score>=70?"✅ Great!":score>=50?"⚠️ Close":score>=30?"❌ Keep trying":"❌ Try again"}
            </div>
          )}
        </div>
        <div style={{flex:"1 1 180px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#0d1117",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(12)}}>
            <div style={{color:"#475569",marginBottom:4}}># Current inertia (lower = better):</div>
            <div style={{color:PNK,fontWeight:700,fontSize:px(14)}}>{inertia2().toFixed(1)}</div>
            {centers.map((ct,i)=>(
              <div key={i} style={{color:"#94a3b8",marginTop:4}}>
                μ{i+1} = ({ct.x.toFixed(1)}, {ct.y.toFixed(1)})
              </div>
            ))}
          </div>
          <button onClick={lockIn} disabled={locked}
            style={{background:locked?PNK+"55":PNK,border:"none",borderRadius:10,
              padding:"12px",color:"#fff",fontWeight:800,fontSize:px(14),
              cursor:locked?"not-allowed":"pointer"}}>
            🔒 Lock In!
          </button>
          {!locked&&(
            <button onClick={()=>{setCenters([{x:4,y:7},{x:7,y:3}]);setScore(null);}}
              style={{background:"transparent",border:`1px solid ${V.border}`,borderRadius:8,
                padding:"8px",fontSize:px(11),color:V.muted,cursor:"pointer"}}>
              ↺ Reset
            </button>
          )}
          <IBox color={PNK} title="Hint"
            body="The data has two clear groups — one in the top-left, one in the bottom-right. Place μ1 at the centre of the pink group and μ2 at the centre of the cyan group."/>
        </div>
      </div>
    </div>
  );
};

/* ══════ CUSTOMER SEGMENTATION PROJECT ═════════════════════════ */
const SegmentationProject = () => {
  const [spend,setSpend]=useState(450);
  const [freq,setFreq]=useState(8);
  const [recency,setRecency]=useState(15);

  // Simplified 3-cluster assignment based on RFM scores
  const rfmScore=recency<=7?3:recency<=30?2:1;
  const freqScore=freq>=10?3:freq>=5?2:1;
  const spendScore=spend>=800?3:spend>=300?2:1;
  const total=rfmScore+freqScore+spendScore;

  const segment=total>=8
    ?{name:"Champions",e:"🏆",c:GRN,desc:"Recent, frequent, high-spend. Your VIPs.",action:"Offer loyalty rewards, early access, upsell premium tier."}
    :total>=6
    ?{name:"At Risk",e:"⚠️",c:AMB,desc:"Were good customers, now drifting away.",action:"Send personalised re-engagement campaign. Offer 20% discount."}
    :{name:"New/Dormant",e:"😴",c:VIO,desc:"Low engagement or brand new.",action:"Onboarding email sequence. Low-risk introductory offer."};

  return (
    <div style={{...LCARD,background:"#fff5fd",border:`2px solid ${PNK}22`}}>
      <div style={{fontWeight:700,color:PNK,marginBottom:8,fontSize:px(15)}}>
        🛒 Mini Project — Customer Segmentation (RFM Model)
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        RFM clustering: Recency (days since last purchase), Frequency (monthly orders),
        Monetary (monthly spend). K-Means groups customers into action-based segments.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
        <div>
          <CodeBox color="#f9a8d4" lines={[
            "import numpy as np",
            "import pandas as pd",
            "from sklearn.cluster import KMeans",
            "from sklearn.preprocessing import StandardScaler",
            "",
            "# RFM features (Recency, Frequency, Monetary)",
            "df = pd.DataFrame({",
            "  'recency':   [5,  30, 60, 2, 90, 15],",
            "  'frequency': [12, 8,  3,  15, 1,  6],",
            "  'monetary':  [900,400,150,1200,80,350]",
            "})",
            "",
            "# Always scale for K-Means (distance-based!)",
            "scaler = StandardScaler()",
            "X_scaled = scaler.fit_transform(df)",
            "",
            "# Fit K-Means with k=3 segments",
            "kmeans = KMeans(n_clusters=3,",
            "  init='k-means++',",
            "  n_init=10,",
            "  random_state=42)",
            "kmeans.fit(X_scaled)",
            "",
            "df['segment'] = kmeans.labels_",
            "print(df.groupby('segment').mean())",
            "",
            "# Segment a new customer:",
            "new = scaler.transform([[15, 8, 450]])",
            "pred = kmeans.predict(new)",
            "print('Segment:', pred[0])",
          ]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div>
            <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:14,letterSpacing:"1px"}}>
              CUSTOMER PROFILE (RFM)
            </div>
            {[
              {l:"Days since last purchase (Recency)",v:recency,s:setRecency,min:1,max:90,step:1,c:PNK,fmt:v=>`${v} days`},
              {l:"Monthly order frequency",v:freq,s:setFreq,min:1,max:20,step:1,c:CYN,fmt:v=>`${v}× / mo`},
              {l:"Monthly spend ($)",v:spend,s:setSpend,min:10,max:1500,step:10,c:AMB,fmt:v=>`$${v}`},
            ].map(({l,v,s,min,max,step,c,fmt})=>(
              <div key={l} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:px(11),color:V.muted}}>{l}</span>
                  <span style={{fontFamily:"monospace",fontWeight:700,color:c,fontSize:px(13)}}>{fmt(v)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={v}
                  onChange={e=>s(+e.target.value)} style={{width:"100%",accentColor:c}}/>
              </div>
            ))}
            <div style={{background:"#0d1117",borderRadius:10,padding:"10px 12px",
              fontFamily:"monospace",fontSize:px(12),color:"#94a3b8"}}>
              <div>RFM Score: R={rfmScore} + F={freqScore} + M={spendScore} = <span style={{color:PNK,fontWeight:700}}>{total}/9</span></div>
            </div>
          </div>
          <div style={{background:segment.c+"0d",border:`3px solid ${segment.c}`,
            borderRadius:16,padding:"22px",textAlign:"center"}}>
            <div style={{fontSize:px(48),marginBottom:8}}>{segment.e}</div>
            <div style={{fontWeight:900,fontSize:px(20),color:segment.c,marginBottom:6}}>
              {segment.name}
            </div>
            <p style={{...LBODY,fontSize:px(13),marginBottom:12,color:V.muted}}>{segment.desc}</p>
            <div style={{background:segment.c+"15",border:`1px solid ${segment.c}44`,
              borderRadius:10,padding:"10px 14px",fontSize:px(12),color:segment.c,lineHeight:1.7}}>
              <strong>Recommended Action:</strong><br/>{segment.action}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ══════════════════════════════════════════ */
const ClusterTakeaways = ({onBack}) => {
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🔵",c:PNK, t:"Clustering is unsupervised learning — no labels needed. The algorithm discovers structure purely from the data's geometry. Cannot be wrong because there's no ground truth."},
    {e:"📍",c:CYN, t:"K-Means assigns each point to its nearest centroid. After assignment, recompute centroids as cluster means. Repeat until labels stop changing (convergence)."},
    {e:"📏",c:AMB, t:"Euclidean distance d = √(Σ(xᵢ−yᵢ)²) determines nearest centroid. ALWAYS scale features before K-Means — otherwise features with large values dominate distance."},
    {e:"📉",c:GRN, t:"Inertia = total sum of squared distances from each point to its centroid. K-Means minimises inertia. Lower inertia = tighter, more compact clusters."},
    {e:"📊",c:VIO, t:"The Elbow Method: plot inertia vs k. The 'elbow' — where adding another cluster gives diminishing inertia reduction — is the optimal k. Use Silhouette score for validation."},
    {e:"⚠️",c:ROSE,t:"K-Means limitations: must specify k upfront, assumes spherical clusters, sensitive to outliers and initialization. K-Means++ initialization dramatically improves results."},
    {e:"🔄",c:CYN, t:"Alternatives: DBSCAN (arbitrary shapes, finds outliers, no k needed), Hierarchical Clustering (dendrogram, no k needed), GMM (soft assignments, probabilistic)."},
    {e:"🌍",c:PNK, t:"Used everywhere: customer segmentation (Spotify, Netflix), image compression (colour quantization), anomaly detection, document clustering, gene expression analysis."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",PNK)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:PNK}}>Know</span></h2>
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
            background:`linear-gradient(90deg,${PNK},${CYN})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:PNK,border:"none",borderRadius:10,
            padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Evaluation Metrics →
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
const ClusteringPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="Clustering" lessonNum="Lesson 6 of 7"
    accent={PNK} levelLabel="Machine Learning"
    dotLabels={["Hero","Intuition","Definition","K-Means","Distance","Elbow","Python","Visualization","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#0f0218 0%,#2a0538 60%,#100120 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🔵 Lesson 6 of 7 · Machine Learning",PNK)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Clustering<br/><span style={{color:"#f9a8d4"}}>Algorithms</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:PNK,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                What if the data has no labels at all? No one told you who the customers are,
                what the market segments are, or which genes are related. Clustering discovers
                hidden structure in raw, unlabeled data — grouping similar things together
                without any human supervision. It's intelligence from nothing.
              </p>
              <div style={{background:"rgba(236,72,153,0.12)",border:"1px solid rgba(236,72,153,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#f9a8d4",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>
                  💡 THE CORE IDEA
                </div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Group data points so that points within the same group are as similar as possible,
                  and points in different groups are as different as possible. No labels required —
                  only a distance metric.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(236,72,153,0.06)",
              border:"1px solid rgba(236,72,153,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── S1 — INTUITION ───────────────────────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Intuitive Explanation",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Grouping Without <span style={{color:PNK}}>Labels</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Imagine walking into a room full of people you've never met. Within minutes,
                  you'd naturally notice groups: people chatting about football, a group
                  discussing finance, students in one corner. You didn't need name tags —
                  you used similarity of behaviour and conversation to group them.
                </p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Clustering algorithms do exactly this with data. Given 10,000 customer
                  records with no segment labels, clustering finds that customers naturally
                  fall into 3–5 distinct groups based on their purchase behaviour.
                </p>
                <IBox color={PNK} title="Supervised vs Unsupervised"
                  body="Supervised learning: you have labels (emails marked spam/ham) and learn to predict them. Clustering (unsupervised): no labels exist. You discover natural groupings. The algorithm doesn't know what the groups mean — it only knows which points are similar. Humans interpret the clusters afterwards."/>
              </div>
              <div>
                {[
                  {e:"🛒",c:PNK,t:"Customer segments",x:"Spending, frequency, recency",y:"Champions, At-Risk, New"},
                  {e:"🎵",c:CYN,t:"Music recommendation",x:"BPM, energy, danceability, key",y:"Chill / Party / Workout playlists"},
                  {e:"🧬",c:AMB,t:"Gene expression",x:"Expression levels across conditions",y:"Functional gene groups"},
                  {e:"📰",c:GRN,t:"Document clustering",x:"TF-IDF word vectors",y:"Politics / Sports / Finance topics"},
                  {e:"🌍",c:VIO,t:"Geographic clustering",x:"Latitude, longitude",y:"City planning zones"},
                  {e:"🎨",c:ROSE,t:"Image compression",x:"RGB pixel values (R, G, B)",y:"k representative colours"},
                ].map(ex=>(
                  <div key={ex.t} style={{...LCARD,padding:"11px 14px",marginBottom:8,
                    borderLeft:`3px solid ${ex.c}`,display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontSize:px(22)}}>{ex.e}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:ex.c,fontSize:px(12)}}>{ex.t}</div>
                      <div style={{display:"flex",gap:6,marginTop:3,flexWrap:"wrap"}}>
                        <span style={{fontSize:px(10),color:V.muted}}>X: {ex.x}</span>
                        <span style={{fontSize:px(10),color:ex.c}}>→ {ex.y}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S2 — FORMAL DEFINITION ───────────────────────────── */}
        <div ref={R(2)} style={{background:"#0f0218"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Formal Definition","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Mathematical <span style={{color:"#f9a8d4"}}>Framework</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  Given a dataset X = {"{"}x₁, x₂, …, xₙ{"}"} with xᵢ ∈ ℝᵈ, clustering
                  finds a partition C = {"{"}C₁, C₂, …, Cₖ{"}"} such that:
                </p>
                <Formula color="#f9a8d4">min Σₖ Σₓ∈Cₖ ‖x − μₖ‖²</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  This is the K-Means objective: minimise <strong>within-cluster inertia</strong>
                  — the total squared distance from each point to its cluster centroid μₖ.
                  This is an NP-hard optimisation problem, so K-Means uses a greedy local search.
                </p>
                <IBox color="#f9a8d4" title="Convergence guarantee"
                  body="K-Means always converges (the objective never increases). But it may converge to a local minimum — not the global optimum. Solution: run K-Means multiple times with different random initializations (n_init=10 in Scikit-learn) and keep the best result. K-Means++ initialization dramatically reduces the risk of poor local minima."/>
              </div>
              <div>
                {[
                  {s:"k",c:"#f9a8d4",t:"Number of clusters",
                    d:"Must be specified upfront. The most critical hyperparameter. Choose using: Elbow method (plot inertia vs k), Silhouette score, domain knowledge, or business requirements."},
                  {s:"μₖ",c:AMB,t:"Centroid of cluster k",
                    d:"The mean position of all points assigned to cluster k. μₖ = (1/|Cₖ|) Σₓ∈Cₖ x. Centroids are not necessarily data points — they are computed means."},
                  {s:"Cₖ",c:CYN,t:"The k-th cluster",
                    d:"The set of data points assigned to centroid μₖ. A point belongs to the cluster whose centroid is closest (Voronoi diagram)."},
                  {s:"‖x−μ‖²",c:GRN,t:"Squared Euclidean distance",
                    d:"The cost of assigning point x to centroid μ. K-Means minimises the sum of these costs. Note: this makes K-Means sensitive to feature scale and outliers."},
                  {s:"J(C)",c:VIO,t:"Inertia (objective function)",
                    d:"Total within-cluster sum of squares. J = Σₖ Σₓ∈Cₖ ‖x − μₖ‖². K-Means minimises J. Decreasing J at each iteration guarantees convergence."},
                ].map(item=>(
                  <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                    borderRadius:12,padding:"12px 16px",marginBottom:10,display:"flex",gap:12}}>
                    <div style={{fontFamily:"monospace",fontSize:px(18),fontWeight:900,
                      color:item.c,minWidth:46,textAlign:"center",paddingTop:4}}>{item.s}</div>
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

        {/* ── S3 — K-MEANS ALGORITHM ───────────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · K-Means Algorithm",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Step-by-Step <span style={{color:PNK}}>K-Means</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                {[
                  {n:"1",c:PNK,t:"Initialise",
                    d:"Randomly place k centroids in feature space. K-Means++ (default in Sklearn): place first centroid randomly, then each subsequent centroid with probability proportional to squared distance from existing centroids. Dramatically improves quality.",
                    code:"kmeans = KMeans(n_clusters=k, init='k-means++')"},
                  {n:"2",c:CYN,t:"Assign",
                    d:"For each data point, compute distance to all k centroids. Assign the point to the cluster with the nearest centroid. This creates the Voronoi partition of feature space.",
                    code:"labels = argmin_k ‖xᵢ − μₖ‖²  ∀ xᵢ"},
                  {n:"3",c:AMB,t:"Update",
                    d:"Recompute each centroid as the mean of all points assigned to that cluster: μₖ = (1/|Cₖ|) Σₓ∈Cₖ x. Centroids shift toward the centre of mass of their assigned points.",
                    code:"μₖ = mean(points where label==k)"},
                  {n:"4",c:GRN,t:"Repeat",
                    d:"Go back to step 2. Repeat assign+update until no point changes its cluster assignment (convergence). Objective J is guaranteed to decrease (or stay the same) at every step.",
                    code:"while labels_changed: assign(); update()"},
                  {n:"5",c:VIO,t:"Output",
                    d:"Final cluster labels for all training points + centroid positions. Use predict() for new data — assigns each new point to its nearest centroid O(k·d).",
                    code:"model.labels_  # final cluster IDs"},
                ].map(s=>(
                  <div key={s.n} style={{display:"flex",gap:14,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,
                      background:s.c+"22",border:`2px solid ${s.c}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontWeight:800,fontSize:px(14),color:s.c}}>{s.n}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,color:s.c,fontSize:px(13),marginBottom:4}}>{s.t}</div>
                      <p style={{...LBODY,fontSize:px(13),marginBottom:6}}>{s.d}</p>
                      <div style={{fontFamily:"monospace",background:"#f8fafc",borderRadius:6,
                        padding:"5px 10px",fontSize:px(11),color:s.c,borderLeft:`2px solid ${s.c}`}}>
                        {s.code}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <KMeansCanvas/>
              </div>
            </div>
          </div>
        </div>

        {/* ── S4 — DISTANCE METRICS ────────────────────────────── */}
        <div ref={R(4)} style={{background:"#0f0218"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Distance Metrics","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Measuring <span style={{color:"#f9a8d4"}}>Similarity</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",marginBottom:16}}>
                  K-Means assigns points to their nearest centroid. "Nearest" requires
                  a distance metric. The choice of metric profoundly affects cluster shapes
                  and assignments.
                </p>
                <Formula color="#f9a8d4">d_Euclidean = √ Σᵢ (xᵢ − yᵢ)²</Formula>
                <Formula color={CYN}>d_Manhattan = Σᵢ |xᵢ − yᵢ|</Formula>
                <Formula color={AMB}>d_Cosine = 1 − (x·y) / (‖x‖·‖y‖)</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(14),marginBottom:16}}>
                  <strong style={{color:"#f9a8d4"}}>Critical:</strong> K-Means uses Euclidean distance.
                  If your features have different scales (income: 0–100,000; age: 18–80),
                  income will dominate the distance calculation. <strong>Always use
                  StandardScaler before K-Means.</strong>
                </p>
                <IBox color="#f9a8d4" title="The Scaling Trap"
                  body="Without scaling: income ranges 0–100k, age 18–80. A difference of $1000 in income is 'closer' than a 1-year difference in age, despite both being meaningful. StandardScaler (subtract mean, divide by std) puts all features on an equal footing. Without this step, K-Means clustering is almost always wrong for mixed-unit datasets."/>
              </div>
              <div>
                {[
                  {name:"Euclidean",f:"√Σ(xᵢ−yᵢ)²",c:"#f9a8d4",
                    best:"Continuous numeric features, similar scales. Natural, intuitive 'straight-line' distance.",
                    avoid:"Mixed scales or categorical features — scale first!"},
                  {name:"Manhattan (L1)",f:"Σ|xᵢ−yᵢ|",c:CYN,
                    best:"High-dimensional data. Robust to outliers. Good for grid-like data (city distances).",
                    avoid:"When diagonal distances matter more than axis-aligned movement."},
                  {name:"Cosine",f:"1 − x·y/(‖x‖‖y‖)",c:AMB,
                    best:"Text documents (TF-IDF vectors). Measures angle, not magnitude. Direction matters, not length.",
                    avoid:"When magnitude of features matters (use Euclidean instead)."},
                  {name:"Hamming",f:"Count of differing bits",c:GRN,
                    best:"Binary or categorical features. Number of positions where vectors differ.",
                    avoid:"Continuous numeric features — loses too much information."},
                ].map(d=>(
                  <div key={d.name} style={{...LCARD,padding:"14px 16px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontWeight:800,color:d.c,fontSize:px(14)}}>{d.name}</span>
                      <span style={{fontFamily:"monospace",background:d.c+"0d",
                        border:`1px solid ${d.c}44`,borderRadius:6,padding:"3px 10px",
                        fontSize:px(11),color:d.c}}>{d.f}</span>
                    </div>
                    <div style={{fontSize:px(12),color:GRN,marginBottom:4}}>✅ {d.best}</div>
                    <div style={{fontSize:px(12),color:ROSE}}>⚠️ {d.avoid}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── S5 — ELBOW METHOD ────────────────────────────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Choosing k — The Elbow Method",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              How Many <span style={{color:PNK}}>Clusters?</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Choosing k is the most important and most human step in K-Means.
                  The Elbow Method plots inertia against k: as k increases, inertia drops.
                  The "elbow" — where the curve bends — is typically the optimal k.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:14}}>
                  k=1: all points in one cluster (max inertia). k=n: each point its own
                  cluster (zero inertia, useless). The elbow finds the sweet spot.
                </p>
                <CodeBox color="#f9a8d4" lines={[
                  "from sklearn.cluster import KMeans",
                  "import matplotlib.pyplot as plt",
                  "",
                  "inertias = []",
                  "k_range = range(1, 11)",
                  "for k in k_range:",
                  "    km = KMeans(n_clusters=k,",
                  "               init='k-means++',",
                  "               n_init=10,",
                  "               random_state=42)",
                  "    km.fit(X_scaled)",
                  "    inertias.append(km.inertia_)",
                  "",
                  "plt.plot(k_range, inertias, 'bo-')",
                  "plt.xlabel('Number of clusters k')",
                  "plt.ylabel('Inertia')",
                  "plt.title('The Elbow Method')",
                  "plt.show()",
                  "# Look for the 'elbow' in the curve",
                ]}/>
              </div>
              <div>
                <div style={{...LCARD,background:"#fff5fd",border:`2px solid ${PNK}33`}}>
                  <div style={{fontWeight:700,color:PNK,marginBottom:12,fontSize:px(14)}}>
                    📊 Silhouette Score — Better than Elbow
                  </div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
                    For each point, the silhouette score measures:
                  </p>
                  <Formula color={PNK}>s = (b − a) / max(a, b)</Formula>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
                    a = mean distance to same-cluster points (cohesion).
                    b = mean distance to nearest other-cluster points (separation).
                    s ∈ [−1, 1]. Closer to 1 = well-clustered. Near 0 = on boundary. Negative = misclassified.
                  </p>
                  <CodeBox color="#f9a8d4" lines={[
                    "from sklearn.metrics import silhouette_score",
                    "",
                    "for k in range(2, 11):",
                    "    km = KMeans(n_clusters=k)",
                    "    labels = km.fit_predict(X_scaled)",
                    "    score = silhouette_score(X_scaled, labels)",
                    "    print(f'k={k}: silhouette={score:.3f}')",
                    "# Pick k with highest silhouette score",
                  ]}/>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── S6 — PYTHON EXAMPLE ──────────────────────────────── */}
        <div ref={R(6)} style={{background:"#0f0218"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python Example","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              Code It with <span style={{color:"#f9a8d4"}}>Scikit-learn</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                <CodeBox color="#f9a8d4" lines={[
                  "import numpy as np",
                  "import pandas as pd",
                  "import matplotlib.pyplot as plt",
                  "from sklearn.cluster import KMeans",
                  "from sklearn.preprocessing import StandardScaler",
                  "from sklearn.metrics import silhouette_score",
                  "",
                  "# Customer purchase data",
                  "X = np.array([",
                  "  [1,2],[1,4],[1,0],[2,1],[2,3],   # Cluster A",
                  "  [10,2],[10,4],[10,0],[9,1],[9,3],  # Cluster B",
                  "])",
                  "",
                  "# CRITICAL: scale before clustering",
                  "scaler = StandardScaler()",
                  "X_scaled = scaler.fit_transform(X)",
                  "",
                  "# Fit K-Means with k=2",
                  "kmeans = KMeans(",
                  "  n_clusters=2,",
                  "  init='k-means++',  # better init",
                  "  n_init=10,         # 10 random starts",
                  "  max_iter=300,      # iteration limit",
                  "  random_state=42",
                  ")",
                  "kmeans.fit(X_scaled)",
                  "",
                  "print('Labels:', kmeans.labels_)",
                  "print('Inertia:', kmeans.inertia_)",
                  "print('Centroids:', kmeans.cluster_centers_)",
                  "print('Silhouette:', silhouette_score(X_scaled, kmeans.labels_))",
                  "",
                  "# Predict new points",
                  "new = scaler.transform([[5, 2], [1, 1]])",
                  "print('New labels:', kmeans.predict(new))",
                  "",
                  "# Visualise",
                  "plt.scatter(X[:,0], X[:,1],",
                  "  c=kmeans.labels_, cmap='RdYlBu')",
                  "plt.show()",
                ]}/>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"StandardScaler().fit_transform(X)",c:PNK,
                    d:"ALWAYS scale before K-Means. Subtracts mean, divides by std. Ensures all features contribute equally to Euclidean distance. Without this: large-scale features dominate clustering."},
                  {l:"init='k-means++'",c:AMB,
                    d:"Smarter initialisation: spread initial centroids far apart. Reduces risk of poor local minima by ~3× compared to random init. Default in Scikit-learn since 0.22."},
                  {l:"n_init=10",c:CYN,
                    d:"Run the algorithm 10 times with different random seeds. Keep the result with lowest inertia. Counteracts sensitivity to initialisation. Costs 10× more compute — worth it."},
                  {l:"kmeans.labels_",c:GRN,
                    d:"Cluster ID (0 to k-1) for each training point. Use this to create a new 'segment' column in your DataFrame: df['cluster'] = kmeans.labels_"},
                  {l:"kmeans.inertia_",c:VIO,
                    d:"Total within-cluster sum of squares. Lower = more compact clusters. Use this for the Elbow plot — plot inertia vs k to find the optimal number of clusters."},
                  {l:"silhouette_score()",c:ROSE,
                    d:"Mean silhouette coefficient across all points. 1.0 = perfect separation, 0 = overlapping, -1 = wrong clusters. Maximise this to find optimal k."},
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
            {STag("Section 7 · Visualization",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Seeing the <span style={{color:PNK}}>Clusters</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(24)}}>
              {[
                {e:"🎨",c:PNK,t:"Coloured Scatter Plot",
                  d:"2D scatter with points coloured by cluster. The most intuitive viz. For >2 features, use PCA or t-SNE to project to 2D first. Mark centroids with ✕."},
                {e:"📐",c:CYN,t:"Voronoi Diagram",
                  d:"Shows the decision boundary: every region contains points closest to that centroid. K-Means always produces convex Voronoi cells — it cannot find non-convex cluster shapes."},
                {e:"🌡️",c:AMB,t:"Elbow & Silhouette",
                  d:"Two essential diagnostic plots. Elbow: inertia vs k (find bend). Silhouette: score vs k (find peak). Both plots together give confidence in k choice."},
              ].map(v=>(
                <div key={v.t} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${v.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{v.e}</div>
                  <div style={{fontWeight:800,color:v.c,fontSize:px(14),marginBottom:8}}>{v.t}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0}}>{v.d}</p>
                </div>
              ))}
            </div>
            <IBox color={PNK} title="Dimensionality Reduction for Visualization"
              body="If your data has >3 features, you can't plot clusters directly. Use PCA (Principal Component Analysis) to project to 2D: X_2d = PCA(n_components=2).fit_transform(X_scaled). Then scatter-plot X_2d with cluster colours. Or use t-SNE for nonlinear structure — it preserves local neighbourhoods and often reveals much clearer cluster separation than PCA."/>
          </div>
        </div>

        {/* ── S8 — APPLICATIONS ────────────────────────────────── */}
        <div ref={R(8)} style={{background:"#0f0218"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Real-World Applications","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>
              Clustering <span style={{color:"#f9a8d4"}}>in the Wild</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"👥",c:PNK,t:"Customer Segmentation",
                  b:"Spotify clusters 400M users by listening habits (tempo, energy, instrumentalness, genre vectors). Segments: 'chill indie listeners', 'hip-hop commuters', 'workout metalheads'. Each segment gets different personalised recommendations and playlist features.",
                  tech:"K-Means on audio feature vectors"},
                {e:"🗜️",c:CYN,t:"Image Compression",
                  b:"JPEG-style compression: run K-Means on all pixel RGB values. k=256 → replace each pixel's RGB triplet with the nearest of 256 colours. 24-bit (16M colours) image → 8-bit (256 colours). 3× size reduction with minimal visual quality loss.",
                  tech:"K-Means(n_clusters=256) on pixel RGB"},
                {e:"🌏",c:AMB,t:"Geographic Clustering",
                  b:"Amazon uses clustering to identify optimal fulfilment centre locations. Cluster customers geographically; place a warehouse near each cluster centroid. UberEats clusters orders for batch routing. City planning departments cluster incident reports for resource allocation.",
                  tech:"K-Means on GPS coordinates"},
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
            {STag("Section 9 · Mini Game",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Find the Clusters</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Drag the centroid crosses to minimise the total distance from data points
              to their nearest cluster. This is exactly what K-Means optimises — you're
              doing one manual iteration of the algorithm!
            </p>
            <FindClustersGame/>
          </div>
        </div>

        {/* ── S10 — PROJECT ────────────────────────────────────── */}
        <div ref={R(10)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Project",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Customer <span style={{color:PNK}}>Segmentation</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              A K-Means model using RFM (Recency, Frequency, Monetary) features.
              Adjust the customer profile to see which segment they fall into
              and what marketing action is recommended.
            </p>
            <SegmentationProject/>
          </div>
        </div>

        {/* ── S11 — INSIGHTS ───────────────────────────────────── */}
        <div ref={R(11)} style={{background:V.cream}}>
          <ClusterTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default ClusteringPage;
