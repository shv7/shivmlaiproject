import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — PROBABILITY FOR AI
   Level 2 · Math for AI · Lesson 4 of 5
   Accent: Emerald #059669
══════════════════════════════════════════════════════════════════ */
const EMR  = "#059669";
const VIO  = "#7c3aed";
const CYN  = "#0891b2";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const GRN  = "#10b981";

const Formula = ({ children, color = EMR }) => (
  <div style={{ background:color+"0d", border:`1px solid ${color}44`, borderRadius:px(14),
    padding:"18px 24px", fontFamily:"monospace", fontSize:px(15), color, fontWeight:700,
    textAlign:"center", margin:`${px(16)} 0` }}>{children}</div>
);
const Step = ({ n, label, children, color = EMR }) => (
  <div style={{ display:"flex", gap:16, marginBottom:px(20) }}>
    <div style={{ width:36, height:36, borderRadius:"50%", background:color+"22",
      border:`2px solid ${color}`, display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:px(14), fontWeight:800, color, flexShrink:0 }}>{n}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontWeight:700, color:V.ink, marginBottom:4, fontSize:px(14) }}>{label}</div>
      <div style={{ ...LBODY, fontSize:px(14) }}>{children}</div>
    </div>
  </div>
);
const CodeBox = ({ lines, color = EMR }) => (
  <div style={{ fontFamily:"monospace", background:"#0d0a2a", borderRadius:px(10),
    padding:"14px 18px", fontSize:px(13), lineHeight:1.9, marginTop:px(10) }}>
    {lines.map((l,i)=>(
      <div key={i} style={{ color:l.startsWith("#")||l.startsWith("//")?"#475569":color }}>{l}</div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HERO CANVAS — dice rolling with probability bars
══════════════════════════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d");
    let W,H,raf,t=0;
    const counts = [0,0,0,0,0,0];
    let total = 0;
    const resize=()=>{ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; };
    resize(); window.addEventListener("resize",resize);
    const draw=()=>{
      // simulate roll every ~30 frames
      if(Math.floor(t)%2===0 && Math.floor(t)!==Math.floor(t-0.025)){
        const roll = Math.floor(Math.random()*6);
        counts[roll]++; total++;
      }
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#080d1a"; ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(5,150,105,0.07)"; ctx.lineWidth=1;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // probability bars
      const barW = Math.min(56, (W-60)/6 - 8);
      const maxH = H * 0.55;
      const startX = (W - (barW+8)*6) / 2;
      counts.forEach((cnt,i)=>{
        const prob = total>0 ? cnt/total : 1/6;
        const ideal = 1/6;
        const bx = startX + i*(barW+8);
        const bh = prob*maxH*3;
        const idealH = ideal*maxH*3;
        // ideal line
        ctx.strokeStyle = EMR+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
        ctx.beginPath(); ctx.moveTo(bx,H-60-idealH); ctx.lineTo(bx+barW,H-60-idealH); ctx.stroke();
        ctx.setLineDash([]);
        // actual bar
        const grad = ctx.createLinearGradient(bx,H-60,bx,H-60-bh);
        grad.addColorStop(0,EMR); grad.addColorStop(1,GRN+"88");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.roundRect(bx,H-60-bh,barW,bh,4); ctx.fill();
        // face label
        ctx.font="bold 14px sans-serif"; ctx.fillStyle="#94a3b8"; ctx.textAlign="center";
        ctx.fillText(i+1, bx+barW/2, H-40);
        // prob label
        ctx.font="bold 10px monospace"; ctx.fillStyle=GRN;
        ctx.fillText((prob*100).toFixed(0)+"%", bx+barW/2, H-60-bh-6);
      });
      // title
      ctx.font="bold 12px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.4)"; ctx.textAlign="center";
      ctx.fillText(`Rolling a fair die — ${total} rolls`, W/2, 22);
      ctx.fillStyle=EMR+"88"; ctx.font="10px sans-serif";
      ctx.fillText("Dashed line = theoretical P = 1/6 ≈ 16.7%",W/2,38);
      t+=0.025; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 5 — Conditional Probability Interactive
══════════════════════════════════════════════════════════════════ */
const ConditionalDemo = () => {
  const [pA,  setPa]  = useState(0.4);
  const [pB,  setPb]  = useState(0.5);
  const [pAB, setPab] = useState(0.2);
  const canvasRef = useRef();

  const pAgivenB = pB>0 ? pAB/pB : 0;
  const pBgivenA = pA>0 ? pAB/pA : 0;
  const valid = pAB <= Math.min(pA,pB);

  useEffect(()=>{
    const c = canvasRef.current; if(!c) return;
    const ctx = c.getContext("2d");
    const W = c.width=c.offsetWidth, H = c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#f0fdf4"; ctx.fillRect(0,0,W,H);
    // sample space rect
    ctx.fillStyle="#d1fae5"; ctx.beginPath(); ctx.roundRect(20,20,W-40,H-40,12); ctx.fill();
    ctx.strokeStyle=EMR+"66"; ctx.lineWidth=1.5; ctx.stroke();
    ctx.font="bold 10px sans-serif"; ctx.fillStyle="#374151"; ctx.textAlign="left";
    ctx.fillText("Sample Space Ω",28,38);
    const cx=W/2, cy=H/2;
    const rA = Math.sqrt(pA) * Math.min(W,H)*0.28;
    const rB = Math.sqrt(pB) * Math.min(W,H)*0.28;
    const overlap = Math.max(0, rA+rB - Math.sqrt(pAB)*Math.min(W,H)*0.5)*0.6;
    const dA=cx-overlap*0.5, dB=cx+overlap*0.5;
    ctx.globalAlpha=0.45;
    ctx.fillStyle=EMR; ctx.beginPath(); ctx.arc(dA,cy,rA,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=CYN; ctx.beginPath(); ctx.arc(dB,cy,rB,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.strokeStyle=EMR; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(dA,cy,rA,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle=CYN; ctx.beginPath(); ctx.arc(dB,cy,rB,0,Math.PI*2); ctx.stroke();
    ctx.font="bold 13px sans-serif"; ctx.fillStyle=EMR; ctx.textAlign="center";
    ctx.fillText("A",dA-rA*0.6,cy+4);
    ctx.fillStyle=CYN; ctx.fillText("B",dB+rB*0.6,cy+4);
    ctx.fillStyle="#374151"; ctx.font="bold 11px sans-serif";
    ctx.fillText("A∩B",cx,cy+4);
    ctx.font="10px monospace"; ctx.fillStyle="#6b7280";
    ctx.fillText(`P(A)=${pA.toFixed(2)}`,dA-rA*0.6,cy+rA*0.7);
    ctx.fillText(`P(B)=${pB.toFixed(2)}`,dB+rB*0.4,cy+rB*0.7);
  },[pA,pB,pAB]);

  const Ctrl=({label,val,set,color})=>(
    <div style={{marginBottom:8}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <span style={{fontSize:px(12),color:V.muted}}>{label}</span>
        <span style={{fontSize:px(12),fontWeight:800,color}}>{val.toFixed(2)}</span>
      </div>
      <input type="range" min={0.01} max={0.99} step={0.01} value={val}
        onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:color}}/>
    </div>
  );

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:EMR,marginBottom:8,fontSize:px(15)}}>
        🔢 Conditional Probability Explorer — Venn Diagram
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Adjust the probabilities. The Venn diagram updates live. The formulas show
        conditional probability calculated from your inputs.
      </p>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 280px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:260,borderRadius:12,
            border:`1px solid ${EMR}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 200px"}}>
          <Ctrl label="P(A)" val={pA} set={setPa} color={EMR}/>
          <Ctrl label="P(B)" val={pB} set={setPb} color={CYN}/>
          <Ctrl label="P(A∩B)" val={Math.min(pAB,Math.min(pA,pB))} set={setPab} color={AMB}/>
          {!valid&&<div style={{color:ROSE,fontSize:px(11),marginBottom:8}}>⚠ P(A∩B) can't exceed min(P(A),P(B))</div>}
          <div style={{background:"#f0fdf4",border:`1px solid ${EMR}33`,borderRadius:10,padding:"14px"}}>
            <div style={{fontFamily:"monospace",fontSize:px(13),lineHeight:2.2}}>
              <div>P(A∩B): <strong style={{color:AMB}}>{Math.min(pAB,Math.min(pA,pB)).toFixed(3)}</strong></div>
              <div>P(A|B): <strong style={{color:EMR}}>{pAgivenB.toFixed(3)}</strong></div>
              <div>P(B|A): <strong style={{color:CYN}}>{pBgivenA.toFixed(3)}</strong></div>
            </div>
          </div>
          <div style={{background:EMR+"0d",border:`1px solid ${EMR}33`,borderRadius:8,padding:"10px",marginTop:8,fontSize:px(11),color:EMR,lineHeight:1.7}}>
            <strong>Read as:</strong> P(A|B) = "probability of A <em>given</em> B has happened"
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 7 — Distribution Visualizer
══════════════════════════════════════════════════════════════════ */
const DistributionViz = () => {
  const [distType, setDistType] = useState("normal");
  const [mu,  setMu]  = useState(0);
  const [sig, setSig] = useState(1);
  const [p,   setP]   = useState(0.5);
  const [n,   setN]   = useState(10);
  const canvasRef = useRef();

  const drawNormal=useCallback((ctx,W,H)=>{
    const cx=W/2, baseY=H-40, scaleX=W/(sig*8), scaleY=H*0.65;
    ctx.fillStyle="#f0fdf4"; ctx.fillRect(0,0,W,H);
    ctx.strokeStyle="#d1fae5"; ctx.lineWidth=1;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    ctx.strokeStyle=EMR+"55"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(0,baseY);ctx.lineTo(W,baseY);ctx.stroke();
    ctx.beginPath();
    for(let px2=0;px2<=W;px2++){
      const x=(px2-cx)/scaleX+mu;
      const y=(1/(sig*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mu)/sig)**2);
      const canY=baseY-y*scaleY;
      px2===0?ctx.moveTo(px2,canY):ctx.lineTo(px2,canY);
    }
    ctx.strokeStyle=EMR; ctx.lineWidth=2.5; ctx.stroke();
    // fill under curve
    ctx.beginPath();
    for(let px2=0;px2<=W;px2++){
      const x=(px2-cx)/scaleX+mu;
      const y=(1/(sig*Math.sqrt(2*Math.PI)))*Math.exp(-0.5*((x-mu)/sig)**2);
      px2===0?ctx.moveTo(px2,baseY-y*scaleY):ctx.lineTo(px2,baseY-y*scaleY);
    }
    ctx.lineTo(W,baseY); ctx.lineTo(0,baseY); ctx.closePath();
    ctx.fillStyle=EMR+"22"; ctx.fill();
    // μ line
    ctx.strokeStyle=VIO+"aa"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(cx,baseY); ctx.lineTo(cx,30); ctx.stroke(); ctx.setLineDash([]);
    ctx.font="bold 11px sans-serif"; ctx.fillStyle=VIO; ctx.textAlign="center";
    ctx.fillText(`μ=${mu}`,cx,22);
    // sigma spans
    [[-1,1],[-2,2]].forEach(([a,b],idx)=>{
      const x1=cx+(a*sig)*scaleX, x2=cx+(b*sig)*scaleX;
      const yy=baseY+16+idx*14;
      ctx.strokeStyle=idx===0?CYN:AMB; ctx.lineWidth=1.5; ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1,yy); ctx.lineTo(x2,yy); ctx.stroke();
      ctx.font="9px sans-serif"; ctx.fillStyle=idx===0?CYN:AMB; ctx.textAlign="center";
      ctx.fillText(idx===0?"68%":"95%",cx,yy+10);
    });
  },[mu,sig]);

  const drawBinomial=useCallback((ctx,W,H)=>{
    ctx.fillStyle="#fff7ed"; ctx.fillRect(0,0,W,H);
    const baseY=H-50, maxH=H*0.62;
    const C=(n2,k)=>{
      let r=1;
      for(let i=0;i<k;i++) r=r*(n2-i)/(i+1);
      return r;
    };
    const probs=[];
    for(let k=0;k<=n;k++) probs.push(C(n,k)*Math.pow(p,k)*Math.pow(1-p,n-k));
    const maxP=Math.max(...probs);
    const barW=Math.min(32,(W-40)/(n+1)-4);
    const startX=(W-(barW+4)*(n+1))/2;
    probs.forEach((prob,k)=>{
      const bh=(prob/maxP)*maxH;
      const bx=startX+k*(barW+4);
      const grad=ctx.createLinearGradient(bx,baseY,bx,baseY-bh);
      grad.addColorStop(0,AMB); grad.addColorStop(1,AMB+"66");
      ctx.fillStyle=grad;
      ctx.beginPath(); ctx.roundRect(bx,baseY-bh,barW,bh,3); ctx.fill();
      ctx.font="9px sans-serif"; ctx.fillStyle="#64748b"; ctx.textAlign="center";
      ctx.fillText(k,bx+barW/2,baseY+12);
      if(prob>0.03){
        ctx.font="8px monospace"; ctx.fillStyle=AMB;
        ctx.fillText((prob*100).toFixed(0)+"%",bx+barW/2,baseY-bh-5);
      }
    });
    ctx.font="bold 11px sans-serif"; ctx.fillStyle="#374151"; ctx.textAlign="center";
    ctx.fillText(`Binomial(n=${n}, p=${p}) — mean=${(n*p).toFixed(1)}`,W/2,22);
  },[n,p]);

  const drawBernoulli=useCallback((ctx,W,H)=>{
    ctx.fillStyle="#faf5ff"; ctx.fillRect(0,0,W,H);
    const baseY=H-50, maxH=H*0.55;
    [[0,1-p,VIO],[1,p,EMR]].forEach(([k,prob,color])=>{
      const bw=120, bx=(k===0?W/2-140:W/2+20);
      const bh=prob*maxH;
      const grad=ctx.createLinearGradient(bx,baseY,bx,baseY-bh);
      grad.addColorStop(0,color); grad.addColorStop(1,color+"66");
      ctx.fillStyle=grad;
      ctx.beginPath(); ctx.roundRect(bx,baseY-bh,bw,bh,8); ctx.fill();
      ctx.font="bold 13px sans-serif"; ctx.fillStyle=color; ctx.textAlign="center";
      ctx.fillText(k===0?"0 (Failure)":"1 (Success)",bx+60,baseY-bh-12);
      ctx.font="bold 14px monospace"; ctx.fillStyle=color;
      ctx.fillText((prob*100).toFixed(1)+"%",bx+60,baseY-bh/2+5);
    });
    ctx.font="bold 11px sans-serif"; ctx.fillStyle="#374151"; ctx.textAlign="center";
    ctx.fillText(`Bernoulli(p=${p}) — success probability`,W/2,22);
    ctx.beginPath(); ctx.moveTo(20,baseY); ctx.lineTo(W-20,baseY);
    ctx.strokeStyle="#e2e8f0"; ctx.lineWidth=1.5; ctx.stroke();
  },[p]);

  useEffect(()=>{
    const c=canvasRef.current; if(!c) return;
    const ctx=c.getContext("2d");
    const W=c.width=c.offsetWidth, H=c.height=c.offsetHeight;
    ctx.clearRect(0,0,W,H);
    if(distType==="normal") drawNormal(ctx,W,H);
    else if(distType==="binomial") drawBinomial(ctx,W,H);
    else drawBernoulli(ctx,W,H);
  },[distType,drawNormal,drawBinomial,drawBernoulli]);

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:EMR,marginBottom:12,fontSize:px(15)}}>
        📊 Distribution Explorer
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[["normal","Normal"],["binomial","Binomial"],["bernoulli","Bernoulli"]].map(([k,l])=>(
          <button key={k} onClick={()=>setDistType(k)}
            style={{background:distType===k?EMR:"transparent",
              border:`1px solid ${distType===k?EMR:V.border}`,
              borderRadius:20,padding:"5px 14px",fontSize:px(12),fontWeight:700,
              color:distType===k?"#fff":V.muted,cursor:"pointer",transition:"all 0.2s"}}>
            {l}
          </button>
        ))}
      </div>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 300px"}}>
          <canvas ref={canvasRef} style={{width:"100%",height:280,borderRadius:12,
            border:`1px solid ${EMR}22`,display:"block"}}/>
        </div>
        <div style={{flex:"1 1 200px"}}>
          {distType==="normal"&&(
            <>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:px(12),color:V.muted}}>Mean (μ)</span>
                  <span style={{fontSize:px(12),fontWeight:800,color:VIO}}>{mu}</span>
                </div>
                <input type="range" min={-3} max={3} step={0.1} value={mu}
                  onChange={e=>setMu(+e.target.value)} style={{width:"100%",accentColor:VIO}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:px(12),color:V.muted}}>Std Dev (σ)</span>
                  <span style={{fontSize:px(12),fontWeight:800,color:EMR}}>{sig.toFixed(1)}</span>
                </div>
                <input type="range" min={0.3} max={3} step={0.1} value={sig}
                  onChange={e=>setSig(+e.target.value)} style={{width:"100%",accentColor:EMR}}/>
              </div>
              <div style={{background:"#f0fdf4",border:`1px solid ${EMR}33`,borderRadius:10,padding:"12px"}}>
                <div style={{fontFamily:"monospace",fontSize:px(12),color:"#334155",lineHeight:2}}>
                  <div>μ = {mu}, σ = {sig.toFixed(1)}</div>
                  <div>68% of data: [{(mu-sig).toFixed(1)}, {(mu+sig).toFixed(1)}]</div>
                  <div>95% of data: [{(mu-2*sig).toFixed(1)}, {(mu+2*sig).toFixed(1)}]</div>
                  <div>99.7%: [{(mu-3*sig).toFixed(1)}, {(mu+3*sig).toFixed(1)}]</div>
                </div>
              </div>
            </>
          )}
          {(distType==="binomial"||distType==="bernoulli")&&(
            <>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:px(12),color:V.muted}}>Success prob (p)</span>
                  <span style={{fontSize:px(12),fontWeight:800,color:EMR}}>{p.toFixed(2)}</span>
                </div>
                <input type="range" min={0.01} max={0.99} step={0.01} value={p}
                  onChange={e=>setP(+e.target.value)} style={{width:"100%",accentColor:EMR}}/>
              </div>
              {distType==="binomial"&&(
                <div style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:px(12),color:V.muted}}>Trials (n)</span>
                    <span style={{fontSize:px(12),fontWeight:800,color:AMB}}>{n}</span>
                  </div>
                  <input type="range" min={2} max={20} step={1} value={n}
                    onChange={e=>setN(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
                </div>
              )}
              <div style={{background:"#fff7ed",border:`1px solid ${AMB}33`,borderRadius:10,padding:"12px"}}>
                <div style={{fontFamily:"monospace",fontSize:px(12),color:"#334155",lineHeight:2}}>
                  {distType==="binomial"?(
                    <>
                      <div>n={n}, p={p.toFixed(2)}</div>
                      <div>Mean = np = {(n*p).toFixed(2)}</div>
                      <div>Var = np(1-p) = {(n*p*(1-p)).toFixed(2)}</div>
                    </>
                  ):(
                    <>
                      <div>P(1) = {p.toFixed(3)}</div>
                      <div>P(0) = {(1-p).toFixed(3)}</div>
                      <div>Mean = {p.toFixed(3)}</div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   SECTION 9 — Spam Detection Demo
══════════════════════════════════════════════════════════════════ */
const SpamDemo = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const SPAM_WORDS = ["free","win","prize","click","urgent","offer","cash","deal","limited","exclusive","guaranteed","lottery","congratulations","selected"];
  const HAM_WORDS  = ["meeting","report","schedule","project","team","review","update","attached","regards","thanks","invoice","feedback"];

  const classify = () => {
    const words = email.toLowerCase().split(/\s+/);
    let spamScore=0, hamScore=0;
    words.forEach(w=>{
      if(SPAM_WORDS.includes(w)) spamScore++;
      if(HAM_WORDS.includes(w))  hamScore++;
    });
    const total = words.length||1;
    const pSpam = 0.4 + spamScore*0.12 - hamScore*0.08;
    const prob = Math.max(0.02,Math.min(0.98,pSpam));
    const matched_spam = words.filter(w=>SPAM_WORDS.includes(w));
    const matched_ham  = words.filter(w=>HAM_WORDS.includes(w));
    setResult({prob,matched_spam,matched_ham});
  };

  const EXAMPLES = [
    {l:"Spam",    t:"FREE prize! You WIN! Click now for exclusive cash offer. LIMITED time deal!"},
    {l:"Legit",   t:"Hi team, please review the attached project report for our meeting tomorrow. Thanks!"},
    {l:"Neutral", t:"Hello, I wanted to follow up on the schedule update from last week regarding the team project."},
  ];

  return (
    <div style={{...LCARD,background:"#f0fdf4",border:`2px solid ${EMR}22`}}>
      <div style={{fontWeight:700,color:EMR,marginBottom:8,fontSize:px(15)}}>
        📧 Naive Bayes Spam Classifier Demo
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
        Type an email or pick an example. The classifier uses word frequency probabilities
        (Naive Bayes) to estimate the probability it's spam.
      </p>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {EXAMPLES.map(ex=>(
          <button key={ex.l} onClick={()=>{setEmail(ex.t);setResult(null);}}
            style={{background:ex.l==="Spam"?ROSE+"12":ex.l==="Legit"?EMR+"12":CYN+"12",
              border:`1px solid ${ex.l==="Spam"?ROSE:ex.l==="Legit"?EMR:CYN}44`,
              borderRadius:8,padding:"5px 12px",fontSize:px(11),cursor:"pointer",
              color:ex.l==="Spam"?ROSE:ex.l==="Legit"?EMR:CYN,fontWeight:600}}>
            {ex.l} example
          </button>
        ))}
      </div>
      <textarea value={email} onChange={e=>{setEmail(e.target.value);setResult(null);}}
        placeholder="Type an email message here..."
        style={{width:"100%",height:72,borderRadius:10,border:`1px solid ${EMR}44`,
          padding:"10px 14px",fontSize:px(13),resize:"none",
          background:"white",outline:"none",boxSizing:"border-box",
          fontFamily:"'DM Sans',sans-serif"}}/>
      <button onClick={classify}
        style={{background:EMR,border:"none",borderRadius:9,padding:"10px 24px",
          color:"#fff",fontWeight:700,fontSize:px(13),cursor:"pointer",marginTop:10}}>
        🔍 Classify
      </button>
      {result&&(
        <div style={{marginTop:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{fontSize:px(36)}}>{result.prob>0.6?"🚨":result.prob<0.4?"✅":"⚠️"}</div>
            <div>
              <div style={{fontWeight:800,fontSize:px(16),
                color:result.prob>0.6?ROSE:result.prob<0.4?EMR:AMB}}>
                {result.prob>0.6?"SPAM DETECTED":result.prob<0.4?"LEGITIMATE":"UNCERTAIN"}
              </div>
              <div style={{fontFamily:"monospace",fontSize:px(13),color:V.muted}}>
                P(spam | email) = {(result.prob*100).toFixed(1)}%
              </div>
            </div>
            <div style={{flex:1}}>
              <div style={{background:"#e2e8f0",borderRadius:6,height:12,overflow:"hidden",marginTop:4}}>
                <div style={{height:"100%",borderRadius:6,
                  width:`${result.prob*100}%`,
                  background:result.prob>0.6?ROSE:result.prob<0.4?EMR:AMB,
                  transition:"width 0.5s"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                <span style={{fontSize:px(10),color:EMR}}>0% Ham</span>
                <span style={{fontSize:px(10),color:ROSE}}>100% Spam</span>
              </div>
            </div>
          </div>
          {(result.matched_spam.length>0||result.matched_ham.length>0)&&(
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {result.matched_spam.map(w=>(
                <span key={w} style={{background:ROSE+"12",border:`1px solid ${ROSE}44`,
                  borderRadius:20,padding:"3px 10px",fontSize:px(11),color:ROSE,fontWeight:600}}>
                  🚩 {w}
                </span>
              ))}
              {result.matched_ham.map(w=>(
                <span key={w} style={{background:EMR+"12",border:`1px solid ${EMR}44`,
                  borderRadius:20,padding:"3px 10px",fontSize:px(11),color:EMR,fontWeight:600}}>
                  ✓ {w}
                </span>
              ))}
            </div>
          )}
          <div style={{background:"white",border:`1px solid ${EMR}33`,borderRadius:10,
            padding:"12px 16px",marginTop:12}}>
            <div style={{fontWeight:700,color:EMR,fontSize:px(13),marginBottom:8}}>
              🧮 Bayes Calculation
            </div>
            <div style={{fontFamily:"monospace",fontSize:px(12),color:"#475569",lineHeight:1.9}}>
              <div>P(spam) = 0.40 <span style={{color:"#94a3b8"}}>(prior — 40% of emails are spam)</span></div>
              <div>P(words|spam) ∝ spam signal words found: {result.matched_spam.length}</div>
              <div>P(words|ham)  ∝ legitimate words found: {result.matched_ham.length}</div>
              <div style={{color:result.prob>0.6?ROSE:EMR,fontWeight:700}}>
                P(spam|words) = {(result.prob*100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   KEY INSIGHTS
══════════════════════════════════════════════════════════════════ */
const ProbTakeaways = ({ onBack }) => {
  const [done, setDone] = useState({});
  const toggle = i => setDone(d=>({...d,[i]:!d[i]}));
  const items = [
    {e:"🎲",c:EMR,  t:"P(A) = favourable outcomes / total outcomes. Ranges from 0 (impossible) to 1 (certain)."},
    {e:"🔗",c:CYN,  t:"Conditional probability: P(A|B) = P(A∩B)/P(B). Probability of A given B has already occurred."},
    {e:"🧮",c:VIO,  t:"Bayes' Theorem: P(A|B) = P(B|A)·P(A)/P(B). Updates belief with new evidence. Core of ML."},
    {e:"📊",c:AMB,  t:"Bernoulli: one trial, two outcomes. Binomial: n trials, count successes. Normal: continuous bell curve."},
    {e:"⚖",c:EMR,  t:"Frequentist = probability as long-run frequency. Bayesian = probability as degree of belief. AI uses both."},
    {e:"🤖",c:CYN,  t:"Every ML model output is a probability. Softmax outputs P(class|input). Logistic regression outputs P(y=1|x)."},
    {e:"📧",c:VIO,  t:"Naive Bayes spam filter: P(spam|words) ∝ P(words|spam)·P(spam). Joint probability = product of conditionals."},
    {e:"📈",c:AMB,  t:"The Normal distribution N(μ,σ²) appears everywhere: weight initialisation, noise modelling, hypothesis testing."},
  ];
  const cnt = Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 11",EMR)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:EMR}}>Know</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)}
            style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c+"08":V.card,
              transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",
              border:`2px solid ${done[i]?item.c:V.border}`,
              background:done[i]?item.c:"transparent",flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:px(13),color:"#fff",transition:"all 0.2s"}}>
              {done[i]?"✓":""}
            </div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,
              color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>
          {cnt}/8 concepts understood
        </div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,
            background:`linear-gradient(90deg,${EMR},${CYN})`,
            transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack}
            style={{background:EMR,border:"none",borderRadius:10,padding:"12px 28px",
              fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next: Statistics →
          </button>
          <button onClick={onBack}
            style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,
              padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>
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
const ProbabilityPage = ({ onBack }) => (
  <NavPage onBack={onBack} crumb="Probability" lessonNum="Lesson 4 of 5"
    accent={EMR} levelLabel="Math for AI"
    dotLabels={["Hero","Simple","Math Def","Concepts","Types","Conditional",
                "Bayes","Distributions","AI Uses","Spam Demo","Visual","Insights"]}>
    {R=>(
      <>
        {/* ── HERO ───────────────────────────────────────────── */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#06040f 0%,#042f2e 60%,#0a1f1e 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",
                border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",
                color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📐 Lesson 4 of 5 · Math for AI",EMR)}
              <h1 style={{fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",
                lineHeight:1.1,marginBottom:px(20)}}>
                Probability<br/><span style={{color:"#6ee7b7"}}>for AI</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:EMR,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                Every AI prediction is a probability. When GPT says "Paris", it's outputting
                P("Paris" | context) = 0.73. When your spam filter works, it's computing
                P(spam | this email). Probability is the language AI thinks in.
              </p>
              <div style={{background:"rgba(5,150,105,0.12)",border:"1px solid rgba(5,150,105,0.35)",
                borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#6ee7b7",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 ONE LINE SUMMARY</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Probability is a number between 0 and 1 that measures how likely
                  something is to happen. AI models are, at their core, probability machines.
                </p>
              </div>
            </div>
            <div style={{height:px(380),background:"rgba(5,150,105,0.06)",
              border:"1px solid rgba(5,150,105,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* ── SECTION 1 — SIMPLE DEFINITION ─────────────────── */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Simple Definition",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              What is Probability —{" "}
              <span style={{color:EMR}}>Plain English</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"🎲",c:EMR,t:"A Number Between 0 and 1",
                  b:"Probability is a number that tells you how likely something is. 0 = impossible. 1 = certain. 0.5 = fifty-fifty. Every AI prediction is ultimately a probability."},
                {e:"📊",c:CYN,t:"Likelihood of Events",
                  b:"Before you flip a coin, what's the chance it lands heads? That's probability. Before your spam filter labels an email, it estimates the probability it's spam."},
                {e:"🔄",c:VIO,t:"Uncertainty Made Rigorous",
                  b:"Probability turns vague ideas like 'likely' or 'unlikely' into precise numbers with mathematical rules. AI uses these rules to make decisions under uncertainty."},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:10}}>{c.e}</div>
                  <h3 style={{fontWeight:800,color:c.c,fontSize:px(16),marginBottom:10}}>{c.t}</h3>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>{c.b}</p>
                </div>
              ))}
            </div>
            <IBox color={EMR} title="Real-World Probability Examples"
              body="Coin flip: P(heads)=0.5. Weather: P(rain tomorrow)=0.7. Medical: P(disease|positive test)=0.03. AI output: P('cat'|this image)=0.94." />
          </div>
        </div>

        {/* ── SECTION 2 — MATH DEFINITION ───────────────────── */}
        <div ref={R(2)} style={{background:"#0d0a2a"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Mathematical Definition","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Formal <span style={{color:"#6ee7b7"}}>Formula</span>
            </h2>
            <Formula color="#6ee7b7">P(A) = (Number of favorable outcomes) / (Total possible outcomes)</Formula>
            <Formula color={CYN}>0 ≤ P(A) ≤ 1 &nbsp;&nbsp;&nbsp;&nbsp; P(Ω) = 1 &nbsp;&nbsp;&nbsp;&nbsp; P(∅) = 0</Formula>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:px(16),marginTop:px(24)}}>
              {[
                {s:"P(A)",  c:EMR,  d:"Probability of event A occurring. Always a number between 0 and 1."},
                {s:"Ω",     c:CYN,  d:"Sample space — the set of ALL possible outcomes. P(Ω)=1 always."},
                {s:"∅",     c:ROSE, d:"Empty set — impossible event. P(∅)=0 always."},
                {s:"P(Aᶜ)", c:VIO,  d:"Complement: P(NOT A) = 1 − P(A). If P(rain)=0.7, P(no rain)=0.3."},
                {s:"P(A∪B)",c:AMB,  d:"Union: P(A or B) = P(A)+P(B)−P(A∩B). At least one of A, B occurs."},
                {s:"P(A∩B)",c:GRN,  d:"Intersection: P(A and B). Both A and B occur simultaneously."},
              ].map(item=>(
                <div key={item.s} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,
                  borderRadius:12,padding:"16px"}}>
                  <div style={{fontFamily:"monospace",fontSize:px(22),fontWeight:900,
                    color:item.c,marginBottom:6}}>{item.s}</div>
                  <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 — BASIC CONCEPTS ─────────────────────── */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Basic Concepts",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Events, Sample Spaces &amp; <span style={{color:EMR}}>Random Variables</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(20),marginBottom:px(28)}}>
              {[
                {e:"🎯",c:EMR,t:"Event",
                  def:"Any outcome or set of outcomes we care about.",
                  ex:["Rolling a 6 on a die","Getting heads on a coin","Email being spam","Model predicting 'cat'"],
                  formal:"An event A is a subset of the sample space Ω."},
                {e:"🌐",c:CYN,t:"Sample Space",
                  def:"The complete set of all possible outcomes.",
                  ex:["Die: Ω = {1,2,3,4,5,6}","Coin: Ω = {H,T}","Spam: Ω = {spam, ham}","Image class: Ω = {cat,dog,bird,…}"],
                  formal:"Ω is the universal set. All probabilities sum to 1 over Ω."},
                {e:"📐",c:VIO,t:"Random Variable",
                  def:"A variable that takes values based on a random process.",
                  ex:["X = outcome of die roll","X = 1 if spam, 0 if ham","X = model confidence score","X = house price prediction"],
                  formal:"X: Ω → ℝ. Maps outcomes to numbers. Can be discrete or continuous."},
              ].map(c=>(
                <div key={c.t} style={{...LCARD,borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{c.e}</div>
                  <h3 style={{fontWeight:800,color:c.c,fontSize:px(15),marginBottom:6}}>{c.t}</h3>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10}}>{c.def}</p>
                  <div style={{background:c.c+"0d",border:`1px solid ${c.c}22`,borderRadius:8,padding:"8px 12px",marginBottom:10}}>
                    {c.ex.map(e=><div key={e} style={{fontSize:px(12),color:"#475569",marginBottom:2}}>• {e}</div>)}
                  </div>
                  <div style={{fontFamily:"monospace",fontSize:px(11),color:c.c}}>{c.formal}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4 — TYPES OF PROBABILITY ──────────────── */}
        <div ref={R(4)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Types of Probability","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              Three Schools of <span style={{color:"#6ee7b7"}}>Thought</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20)}}>
              {[
                {t:"Classical",e:"📚",c:EMR,
                  def:"Assumes all outcomes are equally likely.",
                  how:"Count favourable outcomes, divide by total.",
                  ex:"P(rolling 3) = 1/6. All 6 faces equally likely.",
                  ai:"Used in simple models, uniform priors, shuffle algorithms.",
                  limit:"Only works when all outcomes are truly equal — not always realistic."},
                {t:"Frequentist",e:"🔁",c:CYN,
                  def:"Probability = long-run relative frequency of an event.",
                  how:"Run many experiments, observe how often event occurs.",
                  ex:"Flip coin 10,000 times → P(heads) ≈ 0.5001.",
                  ai:"Training accuracy, precision/recall, confidence intervals, A/B testing.",
                  limit:"Can't assign probability to one-time events (e.g. 'P(it rains tomorrow)')."},
                {t:"Bayesian",e:"🧠",c:VIO,
                  def:"Probability = degree of belief, updated with evidence.",
                  how:"Start with prior P(A), update with data to get posterior P(A|data).",
                  ex:"Doctor updates cancer probability as test results come in.",
                  ai:"Bayesian neural nets, uncertainty estimation, Naive Bayes, RAG scoring.",
                  limit:"Choosing the prior is subjective and can bias results."},
              ].map(type=>(
                <div key={type.t} style={{background:type.c+"0d",border:`1px solid ${type.c}33`,
                  borderRadius:px(16),padding:"22px 20px"}}>
                  <div style={{fontSize:px(36),marginBottom:10}}>{type.e}</div>
                  <h3 style={{fontWeight:800,color:type.c,fontSize:px(16),marginBottom:8}}>{type.t}</h3>
                  <p style={{...LBODY,fontSize:px(13),color:"#94a3b8",marginBottom:10}}>{type.def}</p>
                  {[["How",type.how,type.c],["Example",type.ex,AMB],["In AI",type.ai,EMR],["Limitation",type.limit,"#64748b"]].map(([l,v,col])=>(
                    <div key={l} style={{marginBottom:8}}>
                      <div style={{fontSize:px(10),fontWeight:700,color:col,marginBottom:2,letterSpacing:"1px"}}>{l}</div>
                      <div style={{...LBODY,fontSize:px(12),color:"#94a3b8"}}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5 — CONDITIONAL PROBABILITY ───────────── */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Conditional Probability",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Probability with <span style={{color:EMR}}>Context</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:px(32),marginBottom:px(28)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Conditional probability asks: <em>"Given that B has already happened,
                  what is the probability of A?"</em> New information changes the probability.
                </p>
                <Formula color={EMR}>P(A | B) = P(A ∩ B) / P(B)</Formula>
                <Step n="1" label="P(A|B) — read as 'probability of A given B'" color={EMR}>
                  The vertical bar "|" means "given" or "conditioned on". We restrict
                  our sample space to only cases where B has occurred.
                </Step>
                <Step n="2" label="Medical Example" color={CYN}>
                  P(disease) = 0.01. P(positive test | disease) = 0.95.
                  P(positive test | no disease) = 0.05.
                  What is P(disease | positive test)? → Need Bayes' Theorem!
                </Step>
                <Step n="3" label="AI Example — Language Models" color={VIO}>
                  P("Paris" | "The capital of France is ___") is high because
                  the context "given" changes everything. GPT computes millions of
                  conditional probabilities like this per token.
                </Step>
              </div>
              <div>
                <ConditionalDemo/>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 6 — BAYES THEOREM ──────────────────────── */}
        <div ref={R(6)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Bayes' Theorem","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(24)}}>
              The Most Important Formula <span style={{color:"#6ee7b7"}}>in AI</span>
            </h2>
            <Formula color="#6ee7b7">P(A | B) = [ P(B | A) × P(A) ] / P(B)</Formula>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <div>
                {[
                  {s:"P(A|B)",  c:"#6ee7b7",t:"Posterior",   d:"Updated probability of A after seeing evidence B. What we want to find."},
                  {s:"P(B|A)",  c:EMR,      t:"Likelihood",  d:"How likely is evidence B if A is true? P(positive test | disease)."},
                  {s:"P(A)",    c:CYN,      t:"Prior",        d:"Initial belief about A before seeing evidence. P(disease) = 0.01."},
                  {s:"P(B)",    c:AMB,      t:"Evidence",     d:"Total probability of evidence B occurring. Normalisation constant."},
                ].map(t=>(
                  <div key={t.s} style={{display:"flex",gap:12,marginBottom:px(16),alignItems:"flex-start"}}>
                    <div style={{background:t.c+"22",border:`1px solid ${t.c}44`,borderRadius:8,
                      padding:"6px 12px",fontFamily:"monospace",fontWeight:900,color:t.c,
                      fontSize:px(14),minWidth:80,textAlign:"center",flexShrink:0}}>{t.s}</div>
                    <div>
                      <div style={{fontWeight:700,color:"#e2e8f0",fontSize:px(13),marginBottom:3}}>{t.t}</div>
                      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),margin:0}}>{t.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{background:"#1e1b4b",border:`1px solid ${EMR}44`,borderRadius:14,padding:"20px 24px",marginBottom:px(16)}}>
                  <div style={{fontWeight:700,color:"#6ee7b7",marginBottom:12,fontSize:px(14)}}>🏥 Medical Diagnosis Walk-Through</div>
                  {[
                    {n:1,t:"Given",         v:"P(disease)=0.01, P(+|disease)=0.95, P(+|no disease)=0.05",c:"#6ee7b7"},
                    {n:2,t:"Compute P(+)",  v:"P(+) = 0.95×0.01 + 0.05×0.99 = 0.0095+0.0495 = 0.059",c:CYN},
                    {n:3,t:"Apply Bayes",   v:"P(disease|+) = (0.95×0.01)/0.059 = 0.0095/0.059",c:AMB},
                    {n:4,t:"Result",        v:"P(disease | positive test) ≈ 0.161 = only 16%! 🤯",c:ROSE},
                  ].map(s=>(
                    <div key={s.n} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}>
                      <div style={{width:22,height:22,borderRadius:"50%",background:s.c+"33",
                        border:`1px solid ${s.c}`,display:"flex",alignItems:"center",
                        justifyContent:"center",fontSize:px(11),fontWeight:800,color:s.c,flexShrink:0}}>{s.n}</div>
                      <div>
                        <div style={{fontSize:px(11),fontWeight:700,color:s.c}}>{s.t}</div>
                        <div style={{fontFamily:"monospace",fontSize:px(11),color:"#94a3b8"}}>{s.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <IBox color={EMR} title="Why This Blows People's Minds"
                  body="Even with a 95% accurate test, a positive result only means 16% chance of disease if the disease is rare (1%). This is the base rate fallacy. Bayes forces you to account for the prior." />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 7 — DISTRIBUTIONS ──────────────────────── */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · Probability Distributions",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>
              Shapes of <span style={{color:EMR}}>Randomness</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24),marginBottom:px(24)}}>
              <div>
                <h3 style={{fontWeight:800,color:CYN,marginBottom:10,fontSize:px(16)}}>Discrete Distributions</h3>
                <p style={{...LBODY,fontSize:px(14),marginBottom:12}}>Take countable values (0, 1, 2, …). Each value has a specific probability mass.</p>
                {[
                  {t:"Bernoulli",  f:"P(X=1)=p, P(X=0)=1−p",   c:VIO,
                    d:"One trial, two outcomes. Coin flip. Spam/ham. Click/no-click."},
                  {t:"Binomial",   f:"P(X=k) = C(n,k)pᵏ(1-p)ⁿ⁻ᵏ", c:AMB,
                    d:"n independent Bernoulli trials. 'How many heads in 10 flips?'"},
                  {t:"Poisson",    f:"P(X=k) = λᵏe⁻λ/k!",      c:CYN,
                    d:"Events in fixed time/space. Emails per hour. Server requests/minute."},
                ].map(d=>(
                  <div key={d.t} style={{...LCARD,marginBottom:px(12)}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                      <span style={{fontWeight:800,color:d.c,fontSize:px(14)}}>{d.t}</span>
                      <code style={{background:d.c+"12",borderRadius:6,padding:"2px 8px",fontSize:px(11),color:d.c}}>{d.f}</code>
                    </div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{d.d}</p>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{fontWeight:800,color:EMR,marginBottom:10,fontSize:px(16)}}>Continuous Distributions</h3>
                <p style={{...LBODY,fontSize:px(14),marginBottom:12}}>Take any value in a range. Probability is area under PDF curve.</p>
                {[
                  {t:"Normal (Gaussian)",f:"f(x) = (1/σ√2π) e^(−(x−μ)²/2σ²)",c:EMR,
                    d:"The bell curve. Weight, height, errors. Central Limit Theorem: sums converge to Normal."},
                  {t:"Uniform",   f:"f(x) = 1/(b−a)  x∈[a,b]",  c:CYN,
                    d:"Equal probability everywhere. Random number generation. Initialising random seeds."},
                  {t:"Exponential",f:"f(x) = λe^(−λx)  x≥0",    c:VIO,
                    d:"Time between events. User session lengths. Server wait times. Always positive."},
                ].map(d=>(
                  <div key={d.t} style={{...LCARD,marginBottom:px(12)}}>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontWeight:800,color:d.c,fontSize:px(14)}}>{d.t}</span>
                      <code style={{background:d.c+"12",borderRadius:6,padding:"2px 8px",fontSize:px(10),color:d.c}}>{d.f}</code>
                    </div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{d.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <DistributionViz/>
          </div>
        </div>

        {/* ── SECTION 8 — PROBABILITY IN AI ──────────────────── */}
        <div ref={R(8)} style={{background:"#06040f"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Probability in AI","#6ee7b7")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>
              How AI <span style={{color:"#6ee7b7"}}>Uses Probability Every Day</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(20)}}>
              {[
                {e:"🤖",t:"ML Predictions",c:EMR,
                  b:"Every classifier outputs a probability distribution over classes. Softmax converts raw logits to probabilities. P(cat|image)=0.94 means 94% confident it's a cat.",
                  code:["probs = softmax(logits)","# [0.94, 0.04, 0.02] for cat/dog/bird"]},
                {e:"📧",t:"Spam Filtering",c:CYN,
                  b:"Naive Bayes: P(spam|words) ∝ P(words|spam)·P(spam). Gmail processes billions of emails per day using probability-based classifiers. Naive Bayes is still competitive.",
                  code:["P(spam|words) = P(words|spam)*P(spam)","                / P(words)"]},
                {e:"🎬",t:"Recommendation Systems",c:VIO,
                  b:"P(user likes item) estimated from collaborative filtering. Probabilistic matrix factorization. Netflix uses probabilistic models to estimate P(watch|user, movie).",
                  code:["# Estimate P(user u likes item i)","score = dot(user_embed, item_embed)"]},
                {e:"❓",t:"Uncertainty Modelling",c:AMB,
                  b:"Bayesian neural networks output distributions, not point predictions. Instead of 'price = $450', they give P(price) ~ N(450, 30²). Critical for safety-critical AI.",
                  code:["# Bayesian prediction","mean, std = bayesian_model(x)","# Output: 450 ± 30"]},
                {e:"🗣",t:"Language Models",c:ROSE,
                  b:"LLMs are probability distributions over tokens: P(next token | all previous tokens). GPT-4 training maximises log-likelihood of the training corpus — pure probability.",
                  code:["# Autoregressive generation","next = sample(P(token | context))"]},
                {e:"🔎",t:"Anomaly Detection",c:GRN,
                  b:"P(this transaction | normal user behaviour) < threshold → flag as fraud. Fraud detection, network intrusion, medical anomalies all use probability thresholds.",
                  code:["if P(event | normal) < 0.001:","    flag_as_anomaly(event)"]},
              ].map(c=>(
                <div key={c.t} style={{background:c.c+"0d",border:`1px solid ${c.c}33`,
                  borderRadius:px(16),padding:"22px 24px"}}>
                  <div style={{fontSize:px(34),marginBottom:10}}>{c.e}</div>
                  <div style={{fontWeight:800,color:c.c,fontSize:px(15),marginBottom:8}}>{c.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:"#475569"}}>{c.b}</p>
                  <CodeBox color={c.c} lines={c.code}/>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 9 — SPAM DEMO ──────────────────────────── */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Real Example",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>
              Spam Detection with <span style={{color:EMR}}>Bayes</span>
            </h2>
            <SpamDemo/>
          </div>
        </div>

        {/* ── SECTION 10 — VISUALIZATION ─────────────────────── */}
        <div ref={R(10)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Visualization",EMR)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>
              Explore <span style={{color:EMR}}>Distributions Live</span>
            </h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Select a distribution and drag the sliders. For Normal: see how μ shifts the centre
              and σ controls spread. For Binomial: n=trials, p=success probability.
              The 68-95-99.7 rule is shown on the Normal curve.
            </p>
            <DistributionViz/>
          </div>
        </div>

        {/* ── SECTION 11 — KEY INSIGHTS ──────────────────────── */}
        <div ref={R(11)} style={{background:V.paper}}>
          <ProbTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);

export default ProbabilityPage;
