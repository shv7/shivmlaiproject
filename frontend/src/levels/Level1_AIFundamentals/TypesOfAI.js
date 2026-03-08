import { useState } from "react";
import { T, px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON 4 — TYPES OF AI — All Sub-Components + Page
══════════════════════════════════════════════════════════════════ */

const CapabilityMeter=({label,value,color,max=100})=>(
  <div style={{marginBottom:px(14)}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
      <span style={{fontSize:px(13),color:V.muted,fontWeight:600}}>{label}</span>
      <span style={{fontSize:px(13),fontWeight:800,color}}>{value}/{max}</span>
    </div>
    <div style={{background:"#f1f5f9",borderRadius:8,height:10,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(value/max)*100}%`,background:color,borderRadius:8,transition:"width 1s ease"}}/>
    </div>
  </div>
);

/* ANI examples grid */
const ANIExamples=()=>{
  const [hov,setHov]=useState(null);
  const apps=[
    {e:"🎬",t:"Netflix AI",d:"Analyses your watch history, ratings, even pauses — to suggest the next perfect show.",c:V.teal},
    {e:"🗺️",t:"Google Maps",d:"Processes live traffic from millions of phones to find the fastest route to your destination.",c:V.blue},
    {e:"📧",t:"Spam Filter",d:"Scans every word, sender, and link in your email and blocks 99.9% of spam before you see it.",c:V.violet},
    {e:"🎵",t:"Spotify",d:"Groups listeners with similar tastes and builds Discover Weekly — a playlist of songs you've never heard but will love.",c:V.green},
    {e:"🛒",t:"Amazon",d:"Tracks your clicks, cart, and purchases to recommend what you'd likely buy next.",c:V.amber},
    {e:"🤖",t:"Siri / Alexa",d:"Converts audio to text, parses intent, queries databases, and speaks back — all within 1 second.",c:V.rose},
    {e:"🔐",t:"Face ID",d:"Maps 30,000 invisible dots onto your face and matches the geometry against your stored face map.",c:V.violet},
    {e:"🚗",t:"Tesla Autopilot",d:"Processes 8 cameras + radar simultaneously to keep you in lane, adjust speed, and avoid obstacles.",c:V.teal},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:px(16)}}>
      {apps.map((a,i)=>(
        <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
          style={{...LCARD,cursor:"default",borderLeft:`4px solid ${a.c}`,transition:"all 0.2s",transform:hov===i?"translateY(-4px)":"none",boxShadow:hov===i?`0 12px 32px ${a.c}22`:"0 4px 24px rgba(0,0,0,0.07)"}}>
          <div style={{fontSize:px(36),marginBottom:8}}>{a.e}</div>
          <div style={{fontWeight:700,color:a.c,fontSize:px(14),marginBottom:6}}>{a.t}</div>
          <p style={{...LBODY,fontSize:px(13),margin:0}}>{a.d}</p>
        </div>
      ))}
    </div>
  );
};

/* type selector card */
const TypeCard=({type,active,onClick})=>(
  <button onClick={onClick} style={{background:active?type.color+"22":V.card,border:`2px solid ${active?type.color:V.border}`,borderRadius:px(16),padding:"18px 20px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",flex:1}}>
    <div style={{fontSize:px(36),marginBottom:8}}>{type.emoji}</div>
    <div style={{fontWeight:800,color:active?type.color:V.ink,fontSize:px(16),marginBottom:4}}>{type.short}</div>
    <div style={{fontSize:px(12),color:V.muted,fontWeight:600}}>{type.exists}</div>
  </button>
);

const TYPES_DATA=[
  {
    key:"ani",emoji:"🎯",short:"Narrow AI (ANI)",exists:"✅ Exists Today",color:V.green,
    full:"Artificial Narrow Intelligence",status:"The only real AI we have",
    tagline:"Incredibly good at ONE thing — nothing else.",
    simple:"Every AI system that exists today — no matter how impressive — is Narrow AI. ChatGPT? Narrow AI. Tesla Autopilot? Narrow AI. AlphaGo? Narrow AI. They are extraordinarily powerful at their specific tasks. But they can't do anything outside their training.",
    analogy:"Imagine a chess grandmaster who is literally unable to do anything else. Can't cook. Can't drive. Can't have a conversation. Just chess — but at superhuman level. That's ANI.",
    capabilities:[{l:"Task performance",v:99},{l:"Domain breadth",v:8},{l:"Self-awareness",v:0},{l:"Common sense",v:15},{l:"Generalisation",v:12}],
    examples:["Netflix recommends shows","Spam filters block emails","Siri answers questions","AlphaGo plays board games","DALL-E generates images","GPT-4 writes text"],
    note:"Even GPT-4 — which seems incredibly general — is technically ANI. It cannot drive a car, move a robot arm, or truly understand the physical world.",
  },
  {
    key:"agi",emoji:"🧠",short:"General AI (AGI)",exists:"🔬 Research Goal",color:V.blue,
    full:"Artificial General Intelligence",status:"The holy grail — not yet achieved",
    tagline:"Human-level intelligence across any task.",
    simple:"AGI would be a system that can learn and perform any intellectual task a human can do — with the same flexibility, common sense, and adaptability. Ask it to write a poem, then debug code, then design a bridge, then advise on relationships. It handles all of them.",
    analogy:"Instead of a chess grandmaster who can only play chess, AGI is like a brilliant person who just learned chess last week — and can tomorrow learn anything else, from surgery to music composition.",
    capabilities:[{l:"Task performance",v:90},{l:"Domain breadth",v:85},{l:"Self-awareness",v:70},{l:"Common sense",v:88},{l:"Generalisation",v:90}],
    examples:["Diagnose any disease","Write any type of content","Learn any skill from scratch","Reason about new problems","Plan complex multi-step tasks","Understand social nuance"],
    note:"Experts disagree on when (or if) AGI will arrive. Estimates range from 5 years to 'never.' Anthropic, OpenAI, and DeepMind all have AGI as their stated long-term goal.",
  },
  {
    key:"asi",emoji:"🚀",short:"Super AI (ASI)",exists:"💭 Theoretical",color:V.rose,
    full:"Artificial Superintelligence",status:"Beyond human — currently hypothetical",
    tagline:"Smarter than all of humanity — in every domain.",
    simple:"ASI would surpass human intelligence in every single domain simultaneously — science, creativity, emotional understanding, strategy, invention. It wouldn't just match Einstein's physics — it would outperform every human physicist who ever lived, combined.",
    analogy:"Imagine if you suddenly became 1,000x smarter in every way — better at creativity, science, relationships, sports strategy, and every other domain at once. Now imagine a machine that surpasses even that. That's the idea of ASI.",
    capabilities:[{l:"Task performance",v:100},{l:"Domain breadth",v:100},{l:"Self-awareness",v:95},{l:"Common sense",v:100},{l:"Generalisation",v:100}],
    examples:["Cure all diseases in months","Solve climate change","Design new physics","Invent technologies we can't imagine","Understand consciousness","Create at superhuman levels"],
    note:"ASI raises profound questions: Would it be safe? Could we control it? Would it have goals aligned with human values? This is why AI safety research — done by Anthropic and others — matters enormously right now.",
  },
];

const TypesOfAIPage=({onBack})=>{
  const [active,setActive]=useState(0);
  const t=TYPES_DATA[active];
  return(
    <NavPage onBack={onBack} crumb="Types of AI" lessonNum="Lesson 4 of 5" accent={V.blue}
      dotLabels={["Hero","Overview","Type Detail","Comparison","Key Insight"]}>
      {R=>(
        <>
          {/* HERO */}
          <div ref={R(0)} style={{background:"linear-gradient(160deg,#020817 0%,#0c1a3a 60%,#0a1020 100%)",minHeight:"72vh",display:"flex",alignItems:"center"}}>
            <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
              <div>
                <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
                {STag("📖 Lesson 4 of 5 · AI Fundamentals",V.blue)}
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>Types of<br/><span style={{color:"#60a5fa"}}>Artificial Intelligence</span></h1>
                <div style={{width:px(56),height:px(4),background:V.blue,borderRadius:px(2),marginBottom:px(22)}}/>
                <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>Not all AI is the same. Scientists group AI systems by what they can do — and what they can't. The spectrum runs from the narrow tools of today to the theoretical superintelligence of the future.</p>
                <div style={{background:"rgba(2,132,199,0.1)",border:"1px solid rgba(2,132,199,0.3)",borderRadius:14,padding:"14px 20px"}}>
                  <div style={{color:"#38bdf8",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 ONE THING TO KNOW FIRST</div>
                  <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>Every AI that exists today — no matter how impressive — is <strong style={{color:"#fff"}}>Narrow AI</strong>. ChatGPT, Tesla Autopilot, AlphaGo — all Narrow AI. The other types are goals, not realities.</p>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:px(14)}}>
                {TYPES_DATA.map((type,i)=>(
                  <div key={i} style={{background:`${type.color}0f`,border:`1px solid ${type.color}44`,borderRadius:px(18),padding:"18px 22px",display:"flex",alignItems:"center",gap:18}}>
                    <div style={{fontSize:px(40)}}>{type.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,color:type.color,fontSize:px(16)}}>{type.full}</div>
                      <div style={{color:"#64748b",fontSize:px(13),marginTop:3}}>{type.tagline}</div>
                    </div>
                    <div style={{background:type.color+"22",border:`1px solid ${type.color}55`,borderRadius:px(20),padding:"3px 12px",fontSize:px(11),fontWeight:700,color:type.color,whiteSpace:"nowrap"}}>{type.exists}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OVERVIEW */}
          <div ref={R(1)} style={{background:V.paper}}>
            <div style={{...LSEC}}>
              {STag("The Three Types",V.blue)}
              <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>How AI is <span style={{color:V.blue}}>Categorised</span></h2>
              <p style={{...LBODY,maxWidth:px(660),marginBottom:px(32)}}>Scientists group AI by capability level — from hyper-specialised tools to hypothetical systems that could surpass all of human intelligence combined.</p>
              <div style={{display:"flex",gap:px(14),marginBottom:px(8),flexWrap:"wrap"}}>
                {TYPES_DATA.map((type,i)=><TypeCard key={i} type={type} active={active===i} onClick={()=>setActive(i)}/>)}
              </div>
              <div style={{...LCARD,borderLeft:`5px solid ${t.color}`,background:t.color+"05",marginTop:px(20)}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:20,flexWrap:"wrap"}}>
                  <div style={{flex:"1 1 320px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:px(14)}}>
                      <span style={{fontSize:px(40)}}>{t.emoji}</span>
                      <div>
                        <div style={{fontWeight:800,color:t.color,fontSize:px(18)}}>{t.full}</div>
                        <div style={{color:V.muted,fontSize:px(13)}}>{t.status}</div>
                      </div>
                    </div>
                    <p style={{...LBODY,fontSize:px(15),marginBottom:px(14)}}>{t.simple}</p>
                    <div style={{background:t.color+"0f",border:`1px solid ${t.color}33`,borderRadius:12,padding:"14px 18px",marginBottom:px(14)}}>
                      <div style={{fontWeight:700,color:t.color,fontSize:px(12),marginBottom:8,letterSpacing:"1px"}}>😄 ANALOGY</div>
                      <p style={{fontFamily:"'Lora',serif",color:V.muted,margin:0,fontSize:px(14),fontStyle:"italic"}}>{t.analogy}</p>
                    </div>
                    <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px"}}>
                      <div style={{fontWeight:700,color:"#92400e",fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>📌 IMPORTANT NOTE</div>
                      <p style={{...LBODY,fontSize:px(13),margin:0,color:"#78350f"}}>{t.note}</p>
                    </div>
                  </div>
                  <div style={{flex:"1 1 240px"}}>
                    <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:14,letterSpacing:"1px"}}>CAPABILITY PROFILE</div>
                    {t.capabilities.map((cap,i)=><CapabilityMeter key={i} label={cap.l} value={cap.v} color={t.color}/>)}
                    <div style={{marginTop:px(18)}}>
                      <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:10,letterSpacing:"1px"}}>REAL EXAMPLES</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {t.examples.map((ex,i)=><span key={i} style={{background:t.color+"12",border:`1px solid ${t.color}33`,borderRadius:20,padding:"3px 12px",fontSize:px(12),color:t.color,fontWeight:600}}>{ex}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ANI Detail */}
          <div ref={R(2)} style={{background:"#0d1525"}}>
            <div style={{...LSEC}}>
              {STag("Narrow AI — The World We Live In",V.green)}
              <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Today's AI — <span style={{color:"#34d399"}}>All Narrow</span></h2>
              <p style={{...LBODY,color:"#94a3b8",maxWidth:px(680),marginBottom:px(32)}}>Every single AI system that exists and is deployed in the real world today is Narrow AI. It does one type of thing extraordinarily well — and nothing else. Here's where you encounter it every day.</p>
              <ANIExamples/>
              <div style={{marginTop:px(32),background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:16,padding:"20px 24px"}}>
                <div style={{fontWeight:700,color:"#34d399",marginBottom:8,fontSize:px(14)}}>🤔 But wait — isn't ChatGPT pretty general?</div>
                <p style={{...LBODY,color:"#94a3b8",margin:0,fontSize:px(14)}}>ChatGPT can write code, poems, essays, and answer questions across many topics — so it <em>feels</em> general. But it's still Narrow AI. It can't operate a robot body, it can't learn new things after training, it has no real-world awareness, and it can't form new goals. True AGI would do all of this and more.</p>
              </div>
            </div>
          </div>

          {/* COMPARISON */}
          <div ref={R(3)} style={{background:V.paper}}>
            <div style={{...LSEC}}>
              {STag("Comparison",V.blue)}
              <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>ANI vs AGI vs ASI — <span style={{color:V.blue}}>Side by Side</span></h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(32)}}>
                {TYPES_DATA.map((type,i)=>(
                  <div key={i} style={{...LCARD,borderTop:`5px solid ${type.color}`}}>
                    <div style={{fontSize:px(44),marginBottom:px(10)}}>{type.emoji}</div>
                    <div style={{fontWeight:800,color:type.color,fontSize:px(16),marginBottom:4}}>{type.short}</div>
                    <div style={{background:type.color+"12",border:`1px solid ${type.color}33`,borderRadius:20,padding:"2px 12px",display:"inline-block",fontSize:px(11),fontWeight:700,color:type.color,marginBottom:px(16)}}>{type.exists}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:px(8)}}>
                      {[["Intelligence","Specialised","Human-level","Superhuman"],["Goal","Do one task well","Do any task","Exceed all humans"],["Today?","✅ Yes","❌ Not yet","❌ Theoretical"],["Risk level","Low","Medium","Very High Debate"]][i>0?0:0].map&&
                      [["Intelligence",["Specialised","Human-level","Superhuman"],[V.green,V.blue,V.rose]],["Goal",["One task well","Any task","Exceed all humans"],[V.green,V.blue,V.rose]],["Today?",["✅ Real","❌ Not yet","❌ Theoretical"],[V.green,V.blue,V.rose]]].map(([label,vals,cols])=>(
                        <div key={label} style={{display:"flex",justifyContent:"space-between",borderBottom:`1px solid ${V.border}`,paddingBottom:6}}>
                          <span style={{fontSize:px(13),color:V.muted}}>{label}</span>
                          <span style={{fontSize:px(13),fontWeight:700,color:type.color}}>{vals[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <IBox color={V.blue} title="The Key Insight About AI Types" body="Don't let sci-fi movies confuse you. Today's AI — no matter how impressive — is still Narrow AI. We've built spectacular tools. But AGI (human-level) and ASI (superhuman) remain goals, not realities. The journey from ANI to AGI may be the most important — and most difficult — challenge in human history."/>
            </div>
          </div>

          {/* KEY INSIGHT */}
          <div ref={R(4)} style={{background:"#020817"}}>
            <div style={{...LSEC,textAlign:"center"}}>
              {STag("Summary",V.blue)}
              <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>The Spectrum of <span style={{color:"#60a5fa"}}>Intelligence</span></h2>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,flexWrap:"wrap",marginBottom:px(40)}}>
                {TYPES_DATA.map((type,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center"}}>
                    <div style={{background:`${type.color}18`,border:`2px solid ${type.color}`,borderRadius:16,padding:"20px 24px",textAlign:"center",minWidth:px(170)}}>
                      <div style={{fontSize:px(40),marginBottom:8}}>{type.emoji}</div>
                      <div style={{fontWeight:800,color:type.color,fontSize:px(15),marginBottom:4}}>{type.short.split("(")[0].trim()}</div>
                      <div style={{fontSize:px(12),color:"#64748b"}}>{i===0?"Specialised":i===1?"Human-level":"Beyond Human"}</div>
                    </div>
                    {i<2&&<div style={{fontSize:px(28),color:"#334155",margin:"0 8px"}}>→</div>}
                  </div>
                ))}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20),maxWidth:px(700),margin:"0 auto 32px"}}>
                <div style={{...LCARD}} onClick={onBack}><span style={{fontSize:px(20)}}>←</span><div style={{marginLeft:12}}><div style={{fontSize:px(12),color:V.muted}}>Previous</div><div style={{fontWeight:700,color:V.ink}}>AI vs ML vs DL</div></div></div>
                <div style={{...LCARD,border:`2px solid ${V.blue}`}}><div style={{flex:1,textAlign:"right"}}><div style={{fontSize:px(12),color:V.muted}}>Next Lesson</div><div style={{fontWeight:700,color:V.ink}}>AI Applications →</div></div><span style={{fontSize:px(20),marginLeft:12}}>→</span></div>
              </div>
            </div>
          </div>
        </>
      )}
    </NavPage>
  );
};

export default TypesOfAIPage;
