import { useState } from "react";
import { T, px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON 5 — AI APPLICATIONS — All Sub-Components + Page
══════════════════════════════════════════════════════════════════ */

const APPS=[
  {
    id:"streaming",emoji:"🎬",title:"Streaming Recommendations",companies:["Netflix","YouTube","Disney+"],color:V.rose,
    tag:"Recommendation Systems",simple:"Every time Netflix suggests a show, that's AI at work. It tracks what you watched, how long you watched it, when you paused, and compares your patterns with millions of similar viewers to predict what you'll love next.",
    analogy:"Imagine a friend who watched every show alongside you and remembered every show you loved or hated — then used that knowledge to pick your next perfect series. That friend is AI.",
    how:["You watch 70% of a crime drama","AI notes: you engage with crime + suspense","It compares you to 50,000 similar viewers","It finds shows they loved that you haven't seen","It ranks those shows by predicted match score","Serves the top picks in your home screen"],
    impact:"Netflix credits AI recommendations with saving $1 billion per year in lost subscriptions. 80% of what people watch on Netflix comes from its recommendation engine.",
  },
  {
    id:"navigation",emoji:"🗺️",title:"Navigation & Traffic",companies:["Google Maps","Waze","Apple Maps"],color:V.blue,
    tag:"Route Optimization",simple:"Google Maps doesn't just show you a map — it predicts traffic 30 minutes from now and finds a route that avoids the jam you haven't hit yet. It does this by processing real-time GPS data from millions of phones on the road.",
    analogy:"Imagine a city planner who can see every car on every road in real time, knows from history when roads get jammed, and instantly calculates the best route for each of the million drivers simultaneously.",
    how:["Collects live GPS from millions of phones","Detects slow-moving traffic patterns","Predicts future traffic using historical data","Calculates fastest route per second","Reroutes you if conditions change","Estimates arrival time within 2 minutes"],
    impact:"Google Maps processes 1 billion km of directions per day. AI routing has reduced average city commute times by 10–20% in major metros.",
  },
  {
    id:"spam",emoji:"📧",title:"Email Spam Detection",companies:["Gmail","Outlook","Yahoo Mail"],color:V.violet,
    tag:"Natural Language Processing",simple:"Gmail's spam filter blocks 99.9% of the 100 billion spam emails sent every day. It reads every email you receive, analyses hundreds of signals — sender, content, links, formatting — and decides in milliseconds whether to show it or block it.",
    analogy:"Imagine having a personal assistant who reads every letter before it reaches your desk, instantly recognises scam letters by subtle patterns, and quietly bins them before you ever see them.",
    how:["Analyses sender reputation score","Scans every word for spam language","Checks all links against known scam databases","Learns from emails YOU mark as spam","Updates models across all Gmail accounts","Improves continuously from billions of signals"],
    impact:"Without AI spam filters, your inbox would be 85% spam. Gmail blocks 15 billion spam messages per day using neural network models.",
  },
  {
    id:"voice",emoji:"🎤",title:"Voice Assistants",companies:["Siri","Alexa","Google Assistant"],color:V.teal,
    tag:"Speech Recognition + NLP",simple:"When you say 'Hey Siri, set a timer for 10 minutes,' at least four AI systems fire in sequence: speech recognition converts audio to text, a language model understands what you want, a task-planning system decides what action to take, and a text-to-speech engine speaks back to you.",
    analogy:"It's like having a telephone operator, a language expert, a personal assistant, and a news anchor — all working together in under a second, every time you speak.",
    how:["Mic captures raw audio waveform","Speech recognition converts audio to words","NLP model parses intent and entities","System routes to correct app or API","Action is executed (timer, search, call)","TTS converts response back to speech"],
    impact:"Voice assistants process over 5 billion queries per day across all platforms. By 2026, over half of all internet searches are expected to be voice-based.",
  },
  {
    id:"medical",emoji:"🏥",title:"Medical AI & Diagnostics",companies:["Google Health","IBM Watson","PathAI"],color:V.green,
    tag:"Computer Vision + Diagnostics",simple:"AI models can scan an X-ray or MRI and detect cancer, diabetic retinopathy, and over 50 other conditions — often with higher accuracy than experienced doctors. They spot patterns in medical images too subtle for the human eye.",
    analogy:"Imagine a radiologist who has seen 10 million X-rays, never gets tired, never misses a small shadow, and can read your scan in 3 seconds. That's what medical AI delivers — as a second opinion that doctors can act on.",
    how:["Doctor uploads X-ray, MRI, or scan","AI model compares to 10M+ labelled images","Detects anomalies below human visual threshold","Highlights regions of concern with probability scores","Doctor reviews AI findings alongside their own","Both opinions inform the treatment decision"],
    impact:"Google's diabetic retinopathy AI matches or exceeds specialist ophthalmologist accuracy. AI detected lung cancer 94.5% accurately vs 88% for radiologists (Nature Medicine, 2019).",
  },
  {
    id:"selfdriving",emoji:"🚗",title:"Self-Driving Cars",companies:["Tesla","Waymo","Cruise"],color:V.amber,
    tag:"Computer Vision + Reinforcement Learning",simple:"A self-driving car processes data from 8+ cameras, radar, and lidar sensors simultaneously — detecting every pedestrian, car, traffic light, and road marking in real time — then makes thousands of micro-decisions per second to drive safely.",
    analogy:"Imagine if you could see in all directions at once, process everything you saw at computer speed, never get distracted, tired, or emotional — and had practiced driving for 10 million virtual miles before touching a real road. That's the AI in a self-driving car.",
    how:["8 cameras capture 360° video at 60fps","Radar + lidar map objects in 3D","Neural nets identify all objects and predict movement","Path planning AI calculates safe trajectories","Control systems steer, accelerate, and brake","All decisions happen in under 100 milliseconds"],
    impact:"Waymo's autonomous vehicles have driven 40+ million miles with a safety record significantly better than human-driven cars. AI-assisted driving features have reduced rear-end accidents by 40% in equipped vehicles.",
  },
];

/* app deep-dive component */
const AppDeepDive=({app})=>(
  <div style={{...LCARD,borderLeft:`5px solid ${app.color}`}}>
    <div style={{display:"flex",alignItems:"flex-start",gap:20,flexWrap:"wrap"}}>
      <div style={{flex:"1 1 340px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:px(16)}}>
          <div style={{fontSize:px(50)}}>{app.emoji}</div>
          <div>
            <div style={{...LTAG(app.color),marginBottom:6}}>{app.tag}</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:px(22),color:V.ink,margin:0}}>{app.title}</h3>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:px(16)}}>
          {app.companies.map(c=><span key={c} style={{background:app.color+"0f",border:`1px solid ${app.color}33`,borderRadius:20,padding:"3px 10px",fontSize:px(12),color:app.color,fontWeight:600}}>{c}</span>)}
        </div>
        <p style={{...LBODY,fontSize:px(15),marginBottom:px(16)}}>{app.simple}</p>
        <div style={{background:app.color+"0d",border:`1px solid ${app.color}33`,borderRadius:12,padding:"14px 18px",marginBottom:px(16)}}>
          <div style={{fontWeight:700,color:app.color,fontSize:px(12),marginBottom:8,letterSpacing:"1px"}}>😄 ANALOGY</div>
          <p style={{fontFamily:"'Lora',serif",color:V.muted,margin:0,fontSize:px(14),fontStyle:"italic"}}>{app.analogy}</p>
        </div>
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"12px 16px"}}>
          <div style={{fontWeight:700,color:"#92400e",fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>📊 REAL IMPACT</div>
          <p style={{...LBODY,fontSize:px(13),margin:0,color:"#78350f"}}>{app.impact}</p>
        </div>
      </div>
      <div style={{flex:"1 1 220px"}}>
        <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:px(14),letterSpacing:"1px"}}>⚙️ HOW IT WORKS — STEP BY STEP</div>
        {app.how.map((step,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:px(12),alignItems:"flex-start"}}>
            <div style={{minWidth:28,height:28,borderRadius:"50%",background:app.color+"22",border:`2px solid ${app.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:px(12),fontWeight:800,color:app.color}}>{i+1}</div>
            <p style={{...LBODY,fontSize:px(14),margin:0,lineHeight:1.6}}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* industry map */
const IndustryMap=()=>{
  const industries=[
    {e:"🏥",label:"Healthcare",apps:"Diagnosis, drug discovery, surgery robots",color:V.green},
    {e:"💰",label:"Finance",apps:"Fraud detection, algorithmic trading, credit scoring",color:V.blue},
    {e:"🎓",label:"Education",apps:"Personalised tutoring, plagiarism detection, grading",color:V.violet},
    {e:"🏭",label:"Manufacturing",apps:"Quality control, predictive maintenance, robotics",color:V.amber},
    {e:"🌾",label:"Agriculture",apps:"Crop monitoring, yield prediction, pest detection",color:V.teal},
    {e:"🛡️",label:"Security",apps:"Face recognition, threat detection, fraud prevention",color:V.rose},
    {e:"🎮",label:"Entertainment",apps:"Game AI, content generation, deepfakes, music",color:"#8b5cf6"},
    {e:"🚚",label:"Logistics",apps:"Route optimisation, demand forecasting, warehouse robots",color:"#f97316"},
  ];
  return(
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:px(14)}}>
      {industries.map((ind,i)=>(
        <div key={i} style={{...LCARD,borderTop:`3px solid ${ind.color}`,textAlign:"center"}}>
          <div style={{fontSize:px(36),marginBottom:8}}>{ind.e}</div>
          <div style={{fontWeight:700,color:ind.color,fontSize:px(15),marginBottom:6}}>{ind.label}</div>
          <p style={{...LBODY,fontSize:px(12),margin:0}}>{ind.apps}</p>
        </div>
      ))}
    </div>
  );
};

/* final checklist */
const AppChecklist=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🎬",t:"AI powers the recommendations you watch on Netflix, YouTube, and Spotify.",c:V.rose},
    {e:"🗺️",t:"Google Maps uses live AI to predict traffic and find your fastest route.",c:V.blue},
    {e:"📧",t:"Gmail's AI blocks 15 billion spam emails every single day.",c:V.violet},
    {e:"🎤",t:"Voice assistants chain multiple AI systems together in under one second.",c:V.teal},
    {e:"🏥",t:"Medical AI matches or beats specialist doctors at reading scans.",c:V.green},
    {e:"🚗",t:"Self-driving cars make thousands of AI decisions per second.",c:V.amber},
    {e:"💡",t:"AI is not the future — it's quietly already running most of the internet.",c:"#7c3aed"},
  ];
  const score=Object.values(done).filter(Boolean).length;
  return(
    <div style={{...LSEC}}>
      {STag("What You've Learned",V.green)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>AI is Already <span style={{color:V.green}}>Everywhere</span></h2>
      <div style={{marginBottom:px(32)}}>
        {items.map((item,i)=>(
          <div key={i} onClick={()=>toggle(i)} style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer",border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c+"08":V.card,transition:"all 0.2s",marginBottom:px(10)}}>
            <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${done[i]?item.c:V.border}`,background:done[i]?item.c:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:px(13),color:"#fff",flexShrink:0}}>{done[i]?"✓":""}</div>
            <span style={{fontSize:px(22)}}>{item.e}</span>
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px"}}>
        <div style={{fontSize:px(56),marginBottom:8}}>{score===7?"🎓":score>=4?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{score}/7 concepts understood</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:px(400),margin:"0 auto 20px"}}>
          <div style={{height:"100%",width:`${(score/7)*100}%`,background:`linear-gradient(90deg,${V.green},#34d399)`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        {score===7&&<p style={{...LBODY,marginBottom:px(20)}}>🎉 You've completed all 5 AI Fundamentals lessons! You now understand what AI is, where it came from, how it's structured, what types exist, and where it lives in the world today.</p>}
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:V.green,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(15)}}>🚀 Continue to Level 2 →</button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(14)}}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

const AIApplicationsPage=({onBack})=>{
  const [selectedApp,setSelectedApp]=useState(0);
  return(
    <NavPage onBack={onBack} crumb="AI Applications" lessonNum="Lesson 5 of 5" accent={V.green}
      dotLabels={["Hero","Everyday AI","Deep Dives","Industries","Wrap Up"]}>
      {R=>(
        <>
          {/* HERO */}
          <div ref={R(0)} style={{background:"linear-gradient(160deg,#020c0a 0%,#042f1e 60%,#0a1020 100%)",minHeight:"70vh",display:"flex",alignItems:"center"}}>
            <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
              <div>
                <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
                {STag("📖 Lesson 5 of 5 · AI Fundamentals",V.green)}
                <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>AI in the<br/><span style={{color:"#34d399"}}>Real World</span></h1>
                <div style={{width:px(56),height:px(4),background:V.green,borderRadius:px(2),marginBottom:px(22)}}/>
                <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>AI isn't coming — it's already here. It recommends your movies, routes your commute, guards your inbox, and helps doctors save lives. You interact with AI dozens of times every single day without realising it.</p>
                <div style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.3)",borderRadius:14,padding:"14px 20px"}}>
                  <div style={{color:"#34d399",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 THE KEY INSIGHT</div>
                  <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>AI's biggest impact isn't dramatic robots or sci-fi scenarios — it's the <strong style={{color:"#fff"}}>invisible layer of intelligence</strong> quietly optimising nearly every digital experience in your life.</p>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(12)}}>
                {APPS.slice(0,6).map((app,i)=>(
                  <div key={i} style={{background:`${app.color}0f`,border:`1px solid ${app.color}33`,borderRadius:14,padding:"16px",textAlign:"center"}}>
                    <div style={{fontSize:px(32),marginBottom:6}}>{app.emoji}</div>
                    <div style={{fontWeight:700,color:app.color,fontSize:px(13)}}>{app.title}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",justifyContent:"center",marginTop:6}}>
                      {app.companies.map(c=><span key={c} style={{fontSize:px(10),color:"#64748b"}}>{c}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EVERYDAY AI */}
          <div ref={R(1)} style={{background:V.paper}}>
            <div style={{...LSEC}}>
              {STag("You Already Use AI",V.green)}
              <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>A Day in Your Life — <span style={{color:V.green}}>Powered by AI</span></h2>
              <p style={{...LBODY,maxWidth:px(660),marginBottom:px(36)}}>From the moment you wake up to when you sleep, AI touches your life more times than you'd imagine. Here's an average day:</p>
              <div style={{position:"relative",maxWidth:px(700),margin:"0 auto"}}>
                <div style={{position:"absolute",left:px(28),top:0,bottom:0,width:2,background:`linear-gradient(180deg,${V.green},${V.blue},${V.violet},${V.amber})`}}/>
                {[
                  {time:"7:00 AM",emoji:"⏰",event:"Alarm wakes you",ai:"Sleep tracking AI optimised your wake time to a light sleep phase.",color:V.green},
                  {time:"7:15 AM",emoji:"📱",event:"Check Instagram",ai:"Recommendation AI picked every photo in your feed based on your 6-month engagement history.",color:V.blue},
                  {time:"8:00 AM",emoji:"📧",event:"Check email",ai:"Spam filter silently blocked 47 spam messages before you opened Gmail.",color:V.violet},
                  {time:"8:30 AM",emoji:"🗺️",event:"Commute to work",ai:"Google Maps rerouted you around an accident that happened 3 minutes ago.",color:V.teal},
                  {time:"12:00 PM",emoji:"🛒",event:"Order lunch",ai:"Delivery AI predicted your order, pre-positioned a courier nearby, and estimated 22 mins.",color:V.amber},
                  {time:"3:00 PM",emoji:"🎵",event:"Spotify session",ai:"Discover Weekly surfaced a song from an artist you've never heard — that you loved.",color:V.rose},
                  {time:"8:00 PM",emoji:"🎬",event:"Netflix time",ai:"Top 3 recommended shows were chosen from 13,000 available titles specifically for you.",color:V.violet},
                  {time:"10:00 PM",emoji:"💳",event:"Online purchase",ai:"Fraud detection AI scored your transaction in 0.3 seconds and approved it.",color:V.green},
                ].map((ev,i)=>(
                  <div key={i} style={{display:"flex",gap:20,marginBottom:px(20),paddingLeft:px(60),position:"relative"}}>
                    <div style={{position:"absolute",left:px(16),top:px(4),width:px(24),height:px(24),borderRadius:"50%",background:ev.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:px(13)}}>{ev.emoji}</div>
                    <div style={{...LCARD,flex:1}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{fontWeight:700,color:V.ink,fontSize:px(14)}}>{ev.event}</div>
                        <div style={{fontFamily:"monospace",fontSize:px(12),color:V.muted}}>{ev.time}</div>
                      </div>
                      <p style={{...LBODY,fontSize:px(13),margin:0,color:ev.color,fontWeight:600}}>🤖 {ev.ai}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DEEP DIVES */}
          <div ref={R(2)} style={{background:"#080d1a"}}>
            <div style={{...LSEC}}>
              {STag("Deep Dives",V.green)}
              <h2 style={{...LH2,color:"#fff",marginBottom:px(8)}}>Explore Each <span style={{color:"#34d399"}}>Application</span></h2>
              <p style={{...LBODY,color:"#64748b",marginBottom:px(28)}}>Select an application to see exactly how it works — step by step.</p>
              {/* app selector */}
              <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:px(24)}}>
                {APPS.map((app,i)=>(
                  <button key={i} onClick={()=>setSelectedApp(i)} style={{background:selectedApp===i?app.color+"22":V.card,border:`2px solid ${selectedApp===i?app.color:V.border}`,borderRadius:px(12),padding:"10px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontSize:px(13),fontWeight:700,color:selectedApp===i?app.color:V.muted,transition:"all 0.2s"}}>
                    <span>{APPS[i].emoji}</span><span style={{whiteSpace:"nowrap"}}>{app.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
              <AppDeepDive app={APPS[selectedApp]}/>
            </div>
          </div>

          {/* INDUSTRIES */}
          <div ref={R(3)} style={{background:V.paper}}>
            <div style={{...LSEC}}>
              {STag("Every Industry",V.green)}
              <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>AI is in <span style={{color:V.green}}>Every Sector</span></h2>
              <p style={{...LBODY,maxWidth:px(640),marginBottom:px(32)}}>It's not just tech companies. Every major industry on Earth is being reshaped by artificial intelligence right now.</p>
              <IndustryMap/>
              <IBox color={V.green} title="Why This Matters for You" body="Whether you're interested in medicine, finance, gaming, agriculture, or art — AI is already transforming your field. Understanding the basics of AI isn't just for programmers anymore. It's the literacy of the 21st century."/>
            </div>
          </div>

          {/* WRAP UP */}
          <div ref={R(4)} style={{background:V.cream}}>
            <AppChecklist onBack={onBack}/>
          </div>
        </>
      )}
    </NavPage>
  );
};

export default AIApplicationsPage;
