import { useState, useEffect, useRef } from "react";
import { T, px, LCARD, LTAG, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON 3 — AI vs ML vs DL — All Sub-Components
══════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
   LESSON 3 — AI vs ML vs Deep Learning
══════════════════════════════════════════════════════════════════ */

/* animated concentric-rings canvas */
const ConcentricCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight,t=0;
    const cx=W/2,cy=H/2;
    const rings=[
      {label:"Artificial Intelligence",r:0.44,color:"#7c3aed",sub:"The Big Goal"},
      {label:"Machine Learning",r:0.29,color:"#0284c7",sub:"Learning from Data"},
      {label:"Deep Learning",r:0.17,color:"#0d9488",sub:"Neural Networks"},
      {label:"LLMs",r:0.075,color:"#f59e0b",sub:"GPT, Claude…"},
    ];
    const draw=()=>{
      const R=Math.min(W,H)/2;
      ctx.clearRect(0,0,W,H);ctx.fillStyle="#080d1a";ctx.fillRect(0,0,W,H);
      rings.forEach((ring,i)=>{
        const pulse=(Math.sin(t*0.7+i*0.9)+1)/2;
        const r=ring.r*R*2;
        // glow
        const g=ctx.createRadialGradient(cx,cy,r-10,cx,cy,r+10);
        g.addColorStop(0,ring.color+"44");g.addColorStop(1,ring.color+"00");
        ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle=ring.color+(i===0?"66":"99");ctx.lineWidth=2+pulse*2;ctx.stroke();
        ctx.beginPath();ctx.arc(cx,cy,r+10,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        // fill center for innermost
        if(i===rings.length-1){
          ctx.beginPath();ctx.arc(cx,cy,r*0.7,0,Math.PI*2);ctx.fillStyle=ring.color+"33";ctx.fill();
          ctx.font=`bold 11px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff";ctx.fillText("LLMs",cx,cy);
        }
      });
      // labels
      [{label:"AI",color:"#7c3aed",r:0.44,angle:-0.8},{label:"ML",color:"#0284c7",r:0.29,angle:-0.6},{label:"DL",color:"#0d9488",r:0.17,angle:-0.5}]
        .forEach(({label,color,r,angle})=>{
          const R2=Math.min(W,H)/2;
          ctx.font=`bold 12px sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";
          ctx.fillStyle=color;ctx.fillText(label,cx+(r*R2*2+28)*Math.cos(angle),cy+(r*R2*2+28)*Math.sin(angle));
        });
      t+=0.012;requestAnimationFrame(draw);
    };
    draw();
    const onR=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    window.addEventListener("resize",onR);return()=>window.removeEventListener("resize",onR);
  },[]);
  return<canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* interactive spam demo */
const SpamDemo=()=>{
  const spamW=["FREE","WIN","CLICK","URGENT","PRIZE","OFFER","$$$","CLAIM","DEAL","RISK"];
  const normW=["Meeting","Hello","Invoice","Schedule","Report","Update","Team","Thanks","Week","Review"];
  const [email,setEmail]=useState([]);
  const add=w=>setEmail(e=>[...e.slice(-7),w]);
  const spamCount=email.filter(w=>spamW.includes(w)).length;
  const prob=Math.min(98,spamCount*24+(email.length>2?8:0));
  const isSpam=prob>=50;
  return(
    <div style={{...LCARD,background:V.card}}>
      <div style={{fontWeight:700,color:V.violet,marginBottom:px(8),fontSize:px(15)}}>🔬 Try it: Build an Email — Watch the AI Decide</div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:px(16)}}>Click words to build an email. The ML model scores each word based on patterns it learned from millions of emails.</p>
      <div style={{display:"flex",gap:px(16),flexWrap:"wrap",marginBottom:px(14)}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:px(11),color:V.rose,fontWeight:700,letterSpacing:"1px",marginBottom:6}}>🚨 SPAM WORDS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {spamW.map(w=><button key={w} onClick={()=>add(w)} style={{background:"#fff1f2",border:"1px solid #fca5a5",borderRadius:8,padding:"4px 10px",fontSize:12,color:"#e11d48",cursor:"pointer",fontWeight:700}}>{w}</button>)}
          </div>
        </div>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:px(11),color:V.green,fontWeight:700,letterSpacing:"1px",marginBottom:6}}>✅ NORMAL WORDS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {normW.map(w=><button key={w} onClick={()=>add(w)} style={{background:"#f0fdf4",border:"1px solid #86efac",borderRadius:8,padding:"4px 10px",fontSize:12,color:"#16a34a",cursor:"pointer",fontWeight:600}}>{w}</button>)}
          </div>
        </div>
      </div>
      <div style={{background:V.cream,borderRadius:px(12),padding:"12px 16px",minHeight:px(48),marginBottom:px(14),fontFamily:"monospace",fontSize:px(14),letterSpacing:"0.5px"}}>
        {email.length===0?<span style={{color:V.muted}}>Your email words appear here…</span>:email.map((w,i)=><span key={i} style={{color:spamW.includes(w)?"#e11d48":"#16a34a",marginRight:8,fontWeight:700}}>{w}</span>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:16}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:px(12),color:V.muted}}>Spam probability</span>
            <span style={{fontWeight:800,color:isSpam?"#e11d48":"#16a34a",fontSize:px(15)}}>{prob}%</span>
          </div>
          <div style={{background:"#f1f5f9",borderRadius:8,height:10,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${prob}%`,background:isSpam?"linear-gradient(90deg,#f97316,#e11d48)":"linear-gradient(90deg,#10b981,#34d399)",transition:"width 0.5s",borderRadius:8}}/>
          </div>
        </div>
        <div style={{background:isSpam?"#fff1f2":"#f0fdf4",border:`2px solid ${isSpam?"#e11d48":"#16a34a"}`,borderRadius:12,padding:"8px 14px",fontWeight:800,color:isSpam?"#e11d48":"#16a34a",fontSize:px(14),minWidth:80,textAlign:"center"}}>
          {email.length===0?"?":(isSpam?"🚨 SPAM":"✅ SAFE")}
        </div>
        <button onClick={()=>setEmail([])} style={{background:V.cream,border:`1px solid ${V.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:px(13),color:V.muted}}>Clear</button>
      </div>
    </div>
  );
};

/* neural network layers visualizer */
const NNLayerViz=()=>{
  const [active,setActive]=useState(null);
  const layers=[
    {label:"Input Layer",nodes:4,color:"#7c3aed",desc:"Raw pixels / audio / text tokens enter here. No processing yet."},
    {label:"Hidden Layer 1",nodes:5,color:"#0284c7",desc:"Detects simple features: edges, tones, word stems."},
    {label:"Hidden Layer 2",nodes:5,color:"#0d9488",desc:"Combines simple features into complex patterns: shapes, phonemes, phrases."},
    {label:"Hidden Layer 3",nodes:4,color:"#f59e0b",desc:"Abstracts high-level meaning: 'cat face', 'spoken question', 'positive sentiment'."},
    {label:"Output Layer",nodes:3,color:"#10b981",desc:"Final answer: 'Cat (94%)', 'Play music', 'Positive review'."},
  ];
  return(
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:V.blue,marginBottom:px(8),fontSize:px(15)}}>🧠 Inside a Deep Neural Network — Click a layer</div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:px(20)}}>Deep Learning stacks multiple layers. Each one learns progressively more complex features.</p>
      <div style={{display:"flex",gap:0,alignItems:"center",overflowX:"auto",padding:"0 4px"}}>
        {layers.map((layer,li)=>(
          <div key={li} style={{display:"flex",alignItems:"center"}}>
            <div onClick={()=>setActive(active===li?null:li)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,cursor:"pointer",padding:"0 10px"}}>
              {Array.from({length:layer.nodes}).map((_,ni)=>(
                <div key={ni} style={{width:28,height:28,borderRadius:"50%",background:active===li?layer.color:layer.color+"44",border:`2px solid ${layer.color}`,transition:"all 0.2s",boxShadow:active===li?`0 0 10px ${layer.color}88`:""}}/>
              ))}
              <div style={{fontSize:px(10),color:active===li?layer.color:V.muted,fontWeight:700,textAlign:"center",maxWidth:60,lineHeight:1.3}}>{layer.label}</div>
            </div>
            {li<layers.length-1&&(
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {Array.from({length:3}).map((_,ai)=><div key={ai} style={{width:16,height:1,background:`${layer.color}44`}}/>)}
              </div>
            )}
          </div>
        ))}
      </div>
      {active!==null&&(
        <div style={{marginTop:px(16),background:layers[active].color+"0f",border:`1px solid ${layers[active].color}44`,borderRadius:px(12),padding:"14px 18px"}}>
          <div style={{fontWeight:700,color:layers[active].color,marginBottom:4,fontSize:px(14)}}>{layers[active].label}</div>
          <p style={{...LBODY,margin:0,fontSize:px(14)}}>{layers[active].desc}</p>
        </div>
      )}
    </div>
  );
};

/* comparison table — AI vs ML vs DL */
const CompareTable=()=>{
  const rows=[
    {q:"What is it?",ai:"The broad field of making smart machines",ml:"A method: learn patterns from data",dl:"A technique: deep neural networks"},
    {q:"How does it work?",ai:"Combines many approaches (rules, logic, learning…)",ml:"Trains on data examples, finds patterns",dl:"Multi-layer networks learn hierarchical features"},
    {q:"Needs data?",ai:"Sometimes",ml:"Yes — lots of it",dl:"Yes — very large datasets"},
    {q:"Needs humans to write rules?",ai:"Old AI: yes. Modern AI: less so",ml:"No — it learns rules itself",dl:"No — learns complex rules automatically"},
    {q:"Examples",ai:"Game AI, Expert systems, ChatGPT",ml:"Spam filter, Netflix, Fraud detection",dl:"Face ID, Voice recognition, LLMs"},
    {q:"Compute needed?",ai:"Varies widely",ml:"Medium",dl:"Very high — needs GPUs"},
  ];
  const [hov,setHov]=useState(null);
  return(
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:px(14),fontFamily:"'DM Sans',sans-serif"}}>
        <thead>
          <tr>
            {["",{l:"🤖 AI",c:"#7c3aed"},{l:"📊 ML",c:"#0284c7"},{l:"🧠 DL",c:"#0d9488"}].map((h,i)=>(
              <th key={i} style={{padding:"12px 14px",textAlign:"left",fontWeight:700,fontSize:px(13),color:i===0?V.muted:h.c,background:i===0?"transparent":h.c+"0f",borderBottom:`2px solid ${i===0?V.border:h.c}`}}>{i===0?h:h.l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={{background:hov===i?"#f8f9ff":"transparent",transition:"background 0.2s"}}>
              <td style={{padding:"11px 14px",fontWeight:600,color:V.ink,borderBottom:`1px solid ${V.border}`,fontSize:px(13)}}>{r.q}</td>
              {[r.ai,r.ml,r.dl].map((val,j)=>(
                <td key={j} style={{padding:"11px 14px",color:V.muted,borderBottom:`1px solid ${V.border}`}}>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* main page for lesson 3 */

/* ══════════════════════════════════════════════════════════════════
   AI vs ML vs DL — Page (exported)
══════════════════════════════════════════════════════════════════ */

const AIvsMLPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="AI vs ML vs DL" lessonNum="Lesson 3 of 5" accent={V.violet}
    dotLabels={["Hero","What's Different","AI","Machine Learning","Deep Learning","Hierarchy","Compare","Key Insight"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#0d0a1f 0%,#0f172a 60%,#0a1020 100%)",minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden",position:"relative"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center",position:"relative",zIndex:1}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("📖 Lesson 3 of 5 · AI Fundamentals",V.violet)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.4rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>AI vs ML vs<br/><span style={{color:"#a78bfa"}}>Deep Learning</span></h1>
              <div style={{width:px(56),height:px(4),background:V.violet,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>People use these three terms as if they mean the same thing. They don't. Understanding the difference is your first real step into AI.</p>
              <div style={{background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#a78bfa",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 ANALOGY</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>AI is like <strong style={{color:"#fff"}}>Transportation</strong>. Machine Learning is like <strong style={{color:"#fff"}}>Cars</strong>. Deep Learning is like <strong style={{color:"#fff"}}>Electric Cars</strong>. They're related — but they're not the same thing.</p>
              </div>
            </div>
            <div style={{height:px(380),background:"rgba(124,58,237,0.06)",border:"1px solid rgba(124,58,237,0.2)",borderRadius:24,overflow:"hidden"}}>
              <ConcentricCanvas/>
            </div>
          </div>
        </div>

        {/* WHAT'S DIFFERENT */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("The Core Confusion",V.violet)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>Why people get these wrong</h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(36)}}>Imagine AI is a massive field of research. Within that field, scientists discovered a powerful technique: instead of programming rules, let machines learn from data. That technique is Machine Learning. Then they discovered an even more powerful version of ML that uses neural networks with many layers — that's Deep Learning.</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20)}}>
              {[
                {emoji:"🌍",title:"AI is the Field",color:V.violet,body:"The entire scientific discipline of making machines intelligent. It includes rule-based systems, logic, learning, robotics, and more.",since:"Since 1956"},
                {emoji:"📊",title:"ML is the Method",color:V.blue,body:"A specific approach within AI. Instead of hand-coding rules, you feed a machine data and let it figure out the patterns itself.",since:"Popularized 1990s"},
                {emoji:"🧠",title:"DL is the Technique",color:V.teal,body:"A specific class of ML algorithms that use neural networks with many layers. Extremely powerful for images, audio, and language.",since:"Revolution 2012"},
              ].map((c,i)=>(
                <div key={i} style={{...LCARD,borderTop:`4px solid ${c.color}`,textAlign:"center"}}>
                  <div style={{fontSize:px(44),marginBottom:px(12)}}>{c.emoji}</div>
                  <div style={{...LTAG(c.color),marginBottom:px(10)}}>{c.since}</div>
                  <h3 style={{fontWeight:800,color:c.color,fontSize:px(18),marginBottom:px(10)}}>{c.title}</h3>
                  <p style={{...LBODY,fontSize:px(14)}}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT IS AI */}
        <div ref={R(2)} style={{background:"#0d0a1f"}}>
          <div style={{...LSEC}}>
            {STag("Layer 1",V.violet)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Artificial Intelligence — <span style={{color:"#a78bfa"}}>The Big Goal</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:px(32),alignItems:"start"}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:px(20)}}>AI is the <strong style={{color:"#fff"}}>overarching ambition</strong>: build machines that can do anything requiring human intelligence — reasoning, recognising patterns, making decisions, solving problems, understanding language.</p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:px(20)}}>AI is not one technology. It's a <em>goal</em>. Think of it like the goal of "flight." Biplanes, jets, and rockets are all flying machines — they're wildly different underneath. Similarly, AI includes rule-based systems, neural networks, reinforcement learning, and much more.</p>
                <div style={{background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:14,padding:"16px 20px",marginBottom:px(20)}}>
                  <div style={{fontWeight:700,color:"#a78bfa",marginBottom:8,fontSize:px(13)}}>🔑 SIMPLE DEFINITION</div>
                  <p style={{fontFamily:"'Lora',serif",color:"#e2e8f0",fontSize:px(16),margin:0,fontStyle:"italic"}}>"Any technique that allows a computer to mimic human intelligence."</p>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:px(12)}}>
                {[["🎮","Game Playing","Chess, Go, video game agents"],["🗣️","Natural Language","Understanding and generating text"],["👁️","Computer Vision","Recognising images and video"],["🤔","Reasoning","Logic, planning, problem solving"],["🦾","Robotics","Physical movement and perception"],].map(([e,t,d])=>(
                  <div key={t} style={{background:"rgba(124,58,237,0.08)",border:"1px solid rgba(124,58,237,0.25)",borderRadius:px(12),padding:"12px 16px",display:"flex",alignItems:"center",gap:14}}>
                    <span style={{fontSize:px(24)}}>{e}</span>
                    <div><div style={{fontWeight:700,color:"#a78bfa",fontSize:px(14)}}>{t}</div><div style={{color:"#64748b",fontSize:px(12)}}>{d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MACHINE LEARNING */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Layer 2",V.blue)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Machine Learning — <span style={{color:V.blue}}>Learning From Data</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(28),marginBottom:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:px(16)}}>Traditional programming works like this: a human writes rules, the computer follows them. If you change the situation, you rewrite the rules.</p>
                <p style={{...LBODY,fontSize:px(15),marginBottom:px(16)}}><strong style={{color:V.ink}}>Machine Learning flips this completely.</strong> You give the machine thousands of examples, and it discovers its own rules — patterns too complex for a human to write by hand.</p>
                <div style={{...LCARD,background:"#f0f9ff",border:`1px solid ${V.blue}33`,padding:"18px"}}>
                  <div style={{fontWeight:700,color:V.blue,marginBottom:10,fontSize:px(14)}}>📧 Classic Example: Spam Detection</div>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>You show the model 1 million emails labelled "spam" or "not spam." It learns that emails with "FREE OFFER CLICK NOW" are almost always spam — not because you told it, but because it found the pattern in the data.</p>
                </div>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:px(16)}}>
                  <div style={{fontWeight:700,color:V.muted,fontSize:px(12),marginBottom:12,letterSpacing:"1px"}}>OLD WAY (Programming Rules)</div>
                  <div style={{fontFamily:"monospace",background:"#f8f9fa",borderRadius:8,padding:"12px 14px",fontSize:px(13),lineHeight:1.7,color:"#334155"}}>
                    <div>IF email contains "FREE"</div>
                    <div style={{paddingLeft:16}}>AND contains "CLICK NOW"</div>
                    <div style={{paddingLeft:16}}>AND sender is unknown</div>
                    <div>THEN mark as spam</div>
                    <div style={{color:"#e11d48",marginTop:8}}>// breaks for every new scam 😩</div>
                  </div>
                </div>
                <div style={{...LCARD}}>
                  <div style={{fontWeight:700,color:V.blue,fontSize:px(12),marginBottom:12,letterSpacing:"1px"}}>ML WAY (Learn from Data)</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {["📦 Feed 1M labelled emails","🔄 Model finds patterns itself","✅ Generalises to new scams","📈 Gets smarter over time"].map((s,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:px(14),color:V.muted}}>
                        <div style={{width:20,height:20,borderRadius:"50%",background:V.blue+"22",border:`1px solid ${V.blue}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:V.blue,fontWeight:700,flexShrink:0}}>{i+1}</div>
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <SpamDemo/>
          </div>
        </div>

        {/* DEEP LEARNING */}
        <div ref={R(4)} style={{background:"#080d1a"}}>
          <div style={{...LSEC}}>
            {STag("Layer 3",V.teal)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Deep Learning — <span style={{color:"#2dd4bf"}}>Neural Networks</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32),marginBottom:px(32)}}>
              <div>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:px(16)}}>Deep Learning is ML with many layers of processing. Each layer learns a different level of abstraction — from raw pixels to shapes to faces to identities.</p>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:px(20)}}>The "deep" in Deep Learning refers to the <strong style={{color:"#fff"}}>depth of layers</strong> in the network. A modern image model might have 100+ layers. A language model like GPT-4 has hundreds of billions of parameters across those layers.</p>
                <div style={{background:"rgba(13,148,136,0.1)",border:"1px solid rgba(13,148,136,0.35)",borderRadius:14,padding:"16px 20px",marginBottom:px(16)}}>
                  <div style={{fontWeight:700,color:"#2dd4bf",marginBottom:8,fontSize:px(13),letterSpacing:"1px"}}>😄 ANALOGY</div>
                  <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>Your brain recognises a face in layers: first it sees light/dark edges, then shapes, then features like eyes and a nose, then finally "that's my friend Sarah." Deep networks do exactly this — layer by layer.</p>
                </div>
              </div>
              <div>
                <div style={{display:"flex",flexDirection:"column",gap:px(12)}}>
                  {[["👁️","Computer Vision","Face ID, medical scans, autonomous cars. Pixels → features → meaning.",V.teal],["🗣️","Speech Recognition","Audio → phonemes → words → commands. Alexa, Siri, Whisper.",V.blue],["💬","Language Models","Tokens → patterns → meaning → generation. GPT, Claude, Gemini.",V.violet],["🎨","Generative AI","Noise → structure → art, music, video. Midjourney, Sora.",V.amber],].map(([e,t,d,col])=>(
                    <div key={t} style={{background:`${col}0f`,border:`1px solid ${col}33`,borderRadius:14,padding:"14px 18px",display:"flex",gap:14,alignItems:"flex-start"}}>
                      <span style={{fontSize:px(26)}}>{e}</span>
                      <div><div style={{fontWeight:700,color:col,fontSize:px(14)}}>{t}</div><div style={{...LBODY,fontSize:px(13),marginTop:4}}>{d}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <NNLayerViz/>
          </div>
        </div>

        {/* HIERARCHY */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("The Big Picture",V.violet)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>The Hierarchy — <span style={{color:V.violet}}>Visualised</span></h2>
            <p style={{...LBODY,maxWidth:px(600),marginBottom:px(36)}}>Every layer is a subset of the one above it. Deep Learning is inside Machine Learning, which is inside AI.</p>
            <div style={{display:"flex",flexDirection:"column",gap:0,maxWidth:px(640),margin:"0 auto"}}>
              {[
                {label:"Artificial Intelligence",emoji:"🌍",color:V.violet,indent:0,body:"The full vision: machines that think, reason, learn, and perceive. Includes every approach — rules, logic, learning, robotics."},
                {label:"Machine Learning",emoji:"📊",color:V.blue,indent:40,body:"A subset of AI. Machines learn from data instead of explicit rules. Supervised, unsupervised, reinforcement learning all live here."},
                {label:"Deep Learning",emoji:"🧠",color:V.teal,indent:80,body:"A subset of ML. Uses deep neural networks. Excellent for unstructured data: images, audio, text. Needs lots of data & compute."},
                {label:"Large Language Models",emoji:"💬",color:V.amber,indent:120,body:"A subset of Deep Learning. Transformer-based models trained on massive text. GPT-4, Claude, Gemini, LLaMA all live here."},
              ].map((item,i)=>(
                <div key={i} style={{marginLeft:px(item.indent),marginBottom:i<3?px(-1):0}}>
                  <div style={{background:item.color+"0d",border:`2px solid ${item.color}44`,borderRadius:px(16),padding:"18px 22px",marginBottom:px(12),borderLeft:`5px solid ${item.color}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:px(8)}}>
                      <span style={{fontSize:px(26)}}>{item.emoji}</span>
                      <h3 style={{fontWeight:800,color:item.color,fontSize:px(17),margin:0}}>{item.label}</h3>
                      {i>0&&<div style={{fontSize:px(20),color:V.muted}}>⊂</div>}
                    </div>
                    <p style={{...LBODY,fontSize:px(14),margin:0}}>{item.body}</p>
                  </div>
                  {i<3&&<div style={{marginLeft:px(24),width:2,height:px(8),background:item.color+"44"}}/>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COMPARE TABLE */}
        <div ref={R(6)} style={{background:"#0d0a1f"}}>
          <div style={{...LSEC}}>
            {STag("Side-by-Side",V.blue)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(8)}}>Compare Them <span style={{color:"#60a5fa"}}>Head to Head</span></h2>
            <p style={{...LBODY,color:"#64748b",marginBottom:px(28)}}>Hover any row to highlight it. Use this as your reference guide.</p>
            <div style={{background:V.card,borderRadius:px(20),overflow:"hidden",border:`1px solid ${V.border}`}}>
              <CompareTable/>
            </div>
          </div>
        </div>

        {/* KEY INSIGHT */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Key Insight",V.violet)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>What You Now Know</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:px(20),marginBottom:px(28)}}>
              {[{e:"🌍",t:"AI",b:"The goal. The field. The big ambition. Everything else is a subset.",c:V.violet},{e:"📊",t:"ML",b:"The method. Learning from data instead of hand-written rules.",c:V.blue},{e:"🧠",t:"Deep Learning",b:"The technique. Neural networks that learn layered, complex patterns.",c:V.teal}].map((c,i)=>(
                <div key={i} style={{...LCARD,textAlign:"center",borderTop:`4px solid ${c.c}`}}>
                  <div style={{fontSize:px(40),marginBottom:8}}>{c.e}</div>
                  <div style={{fontWeight:800,color:c.c,fontSize:px(18),marginBottom:8}}>{c.t}</div>
                  <p style={{...LBODY,fontSize:px(14),margin:0}}>{c.b}</p>
                </div>
              ))}
            </div>
            <IBox color={V.violet} title="The One-Sentence Summary" body="AI is the destination. Machine Learning is the vehicle. Deep Learning is the engine inside that vehicle — and right now it's the most powerful engine we've ever built."/>
            <div style={{marginTop:px(28),display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
              <div style={{...LCARD,display:"flex",alignItems:"center",gap:16,cursor:"pointer"}} onClick={onBack}><span style={{fontSize:px(22)}}>←</span><div><div style={{fontSize:px(12),color:V.muted}}>Previous</div><div style={{fontWeight:700,color:V.ink}}>History of AI</div></div></div>
              <div style={{...LCARD,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:16,border:`2px solid ${V.violet}`,cursor:"pointer"}}><div style={{textAlign:"right"}}><div style={{fontSize:px(12),color:V.muted}}>Next Lesson</div><div style={{fontWeight:700,color:V.ink}}>Types of AI →</div></div><span style={{fontSize:px(22)}}>→</span></div>
            </div>
          </div>
        </div>
      </>
    )}
  </NavPage>
);


export default AIvsMLPage;
