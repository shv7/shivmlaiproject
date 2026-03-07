import React from "react";

/* ══════════════════════════════════════════════════════════════════
   MULTI-AGENT SYSTEMS
   Level 6 · Level6 AgenticAI · Lesson 4 of 5
   Status: Placeholder — ready for full lesson development
══════════════════════════════════════════════════════════════════ */

function MultiAgentSystems({ onBack }) {
  const ACC = "#e11d48";

  const wrap  = { minHeight:"100vh", background:`linear-gradient(160deg,${ACC}08 0%,#050810 70%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif", padding:"40px 24px" };
  const card  = { background:"#111827", border:`2px solid ${ACC}33`, borderRadius:24, padding:"60px 48px", maxWidth:640, width:"100%", textAlign:"center" };
  const badge = { display:"inline-block", background:ACC+"18", border:`1px solid ${ACC}44`, borderRadius:20, padding:"4px 16px", fontSize:11, fontWeight:700, color:ACC, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:24 };
  const h1    = { fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,5vw,2.6rem)", fontWeight:900, color:"#e2e8f0", margin:"0 0 16px" };
  const desc  = { color:"#64748b", fontSize:16, lineHeight:1.7, marginBottom:32, fontFamily:"'Lora',serif" };
  const tag   = { background:"#f59e0b18", border:"1px solid #f59e0b44", borderRadius:12, padding:"16px 24px", color:"#f59e0b", fontWeight:700, fontSize:14, marginBottom:32 };
  const btn   = { background:ACC+"22", border:`1px solid ${ACC}44`, borderRadius:10, padding:"12px 28px", color:ACC, fontWeight:700, fontSize:14, cursor:"pointer" };

  return (
    <div style={{wrap}}>
      <div style={{card}}>
        <div style={{badge}}>Lesson 4 of 5 · Level 6</div>
        <div style={{ fontSize:72, marginBottom:20 }}>📖</div>
        <h1 style={{h1}}>Multi-Agent Systems</h1>
        <p style={{desc}}>
          This lesson will cover <strong style={{ color:ACC }}>"Multi-Agent Systems"</strong> with beginner
          explanations, interactive visualizations, formal math definitions,
          real AI examples, and a mini game. Full content coming soon!
        </p>
        <div style={{tag}}>🔨 &nbsp; Under construction — being developed now</div>
        {onBack && <button onClick={{onBack}} style={{btn}}>← Back to Roadmap</button>}
      </div>
    </div>
  );
}

export default MultiAgentSystems;
