import { useState, useEffect, useRef } from "react";

/* ─── Lesson palette (used by WhatIsAI & HistoryOfAI) ──────────── */
const T = {
  ink: "#0f1117", paper: "#faf7f2", cream: "#f0ead8", card: "#ffffff",
  amber: "#f59e0b", amber2: "#d97706", teal: "#0d9488", rose: "#e11d48",
  violet: "#7c3aed", sky: "#0284c7", muted: "#6b7280", border: "#e5e0d5",
  dark: "#1e293b",
};

// ── Lesson utilities ──────────────────────────────────────────────
const px = (n) => `${n}px`;
const lFlex = (dir = "row", align = "center", justify = "flex-start", gap = 0) => ({
  display: "flex", flexDirection: dir, alignItems: align, justifyContent: justify, gap: px(gap),
});

// ── Lesson shared styles ──────────────────────────────────────────
const LCARD = { background: T.card, borderRadius: px(20), border: `1px solid ${T.border}`, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", padding: px(28) };
const LTAG = (color = T.amber) => ({ display: "inline-block", background: color + "18", border: `1px solid ${color}55`, borderRadius: px(20), padding: "3px 14px", fontSize: px(11), fontWeight: 700, color, letterSpacing: "1.5px", textTransform: "uppercase" });
const LH2 = { fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.7rem, 4vw, 2.5rem)", fontWeight: 900, color: T.ink, lineHeight: 1.2, margin: 0 };
const LBODY = { fontFamily: "'Lora', Georgia, serif", fontSize: px(16), color: T.muted, lineHeight: 1.8 };
const LSEC = { maxWidth: px(1100), margin: "0 auto", padding: "80px 24px" };
const LBTN = (bg = T.amber) => ({ background: bg, border: "none", borderRadius: px(10), padding: "12px 24px", color: bg === T.amber ? T.ink : "#fff", fontWeight: 700, fontSize: px(14), cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "transform 0.15s" });

/* ─── Lessons 3-5 shared palette and nav wrapper ───────────────── */
const V = {
  violet:"#7c3aed", blue:"#0284c7", teal:"#0d9488", amber:"#f59e0b",
  rose:"#e11d48", green:"#10b981", sky:"#38bdf8", ink:T.ink,
  paper:T.paper, cream:T.cream, card:T.card, border:T.border, muted:T.muted,
};

/* ── shared reusable atoms ─────────────────────────────────────── */
const STag = (label,color)=>(
  <div style={{display:"inline-block",background:color+"18",border:`1px solid ${color}55`,borderRadius:px(20),padding:"3px 14px",fontSize:px(11),fontWeight:700,color,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:px(16)}}>{label}</div>
);
const IBox=({color="#f59e0b",title,body})=>(
  <div style={{background:color+"0d",border:`2px solid ${color}44`,borderRadius:px(16),padding:"22px 26px",display:"flex",gap:16,alignItems:"flex-start",marginTop:px(32)}}>
    <span style={{fontSize:px(28),flexShrink:0}}>💡</span>
    <div><div style={{fontWeight:800,color,fontSize:px(15),marginBottom:px(8)}}>{title}</div>
    <p style={{...LBODY,margin:0,fontSize:px(15)}}>{body}</p></div>
  </div>
);
const LN = ({label,color="#7c3aed"})=>(
  <div style={{background:color+"18",border:`1px solid ${color}44`,borderRadius:px(20),padding:"2px 12px",display:"inline-block",fontSize:px(11),fontWeight:700,color,letterSpacing:"1px",textTransform:"uppercase"}}>{label}</div>
);

/* shared floating-dot nav wrapper — used by all lessons */
const NavPage=({children,onBack,crumb,lessonNum,dotLabels,accent="#7c3aed",levelLabel="AI Fundamentals"})=>{
  const [active,setActive]=useState(0);
  const refs=useRef([]);
  useEffect(()=>{
    const obs=new IntersectionObserver(
      e=>e.forEach(en=>{if(en.isIntersecting){const i=refs.current.indexOf(en.target);if(i>=0)setActive(i);}}),
      {threshold:0.25}
    );
    refs.current.forEach(r=>r&&obs.observe(r));
    return()=>obs.disconnect();
  },[]);
  const R=i=>el=>{refs.current[i]=el;};
  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:V.paper,color:V.ink}}>
      {/* dot nav */}
      <div style={{position:"fixed",right:20,top:"50%",transform:"translateY(-50%)",zIndex:200,display:"flex",flexDirection:"column",gap:7}}>
        {dotLabels.map((s,i)=><div key={i} title={s} style={{width:i===active?10:7,height:i===active?10:7,borderRadius:"50%",background:i===active?accent:"rgba(100,116,139,0.35)",transition:"all 0.2s",boxShadow:i===active?`0 0 8px ${accent}`:""}}/>)}
      </div>
      {/* breadcrumb */}
      <div style={{background:V.ink,padding:"10px 24px",display:"flex",alignItems:"center",gap:8}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:13,padding:0}}>ShivMLAI</button>
        <span style={{color:"#334155"}}>›</span><span style={{color:"#475569",fontSize:13}}>{levelLabel}</span>
        <span style={{color:"#334155"}}>›</span><span style={{color:accent,fontSize:13,fontWeight:600}}>{crumb}</span>
        <div style={{marginLeft:"auto",background:accent+"18",border:`1px solid ${accent}55`,borderRadius:px(20),padding:"2px 12px",fontSize:px(10),fontWeight:700,color:accent,letterSpacing:"1.5px",textTransform:"uppercase"}}>{lessonNum}</div>
      </div>
      {children(R)}
      <footer style={{background:V.ink,padding:"32px 24px",textAlign:"center",borderTop:"1px solid #1e293b"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(20),color:"#fff",marginBottom:px(6)}}>ShivML<span style={{color:accent}}>AI</span>.com</div>
        <p style={{color:"#475569",fontSize:px(13)}}>Learn Artificial Intelligence Visually · Created by <span style={{color:accent}}>Shivesh Mishra</span></p>
      </footer>
    </div>
  );
};

export { T, px, lFlex, LCARD, LTAG, LH2, LBODY, LSEC, LBTN, V, STag, IBox, LN, NavPage };
