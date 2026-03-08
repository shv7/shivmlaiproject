import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — LARGE LANGUAGE MODELS
   Level 5 · Modern AI Systems · Lesson 1 of 5
   Accent: Pink #ec4899
══════════════════════════════════════════════════════════════════ */
const PNK  = "#ec4899";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const GRN  = "#059669";
const AMB  = "#d97706";
const CYN  = "#0891b2";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula = ({children,color=PNK})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox = ({lines,color=PNK})=>(
  <div style={{fontFamily:"monospace",background:"#0f0009",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — token stream ═══════════════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize();window.addEventListener("resize",resize);
    const TOKENS=["The","future","of","AI","is","here","→","LLMs","understand","language"];
    const particles=[];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#0f0009";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(236,72,153,0.03)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      // token wave
      TOKENS.forEach((tok,i)=>{
        const x=(i/(TOKENS.length-1))*(W*0.8)+W*0.1;
        const y=H/2+Math.sin(t*0.7+i*0.6)*28;
        const alpha=(Math.sin(t*0.5+i*0.4)+1)/2;
        ctx.fillStyle=`rgba(236,72,153,${0.3+alpha*0.7})`;
        ctx.font=`bold ${px(11)} monospace`;
        ctx.textAlign="center";ctx.fillText(tok,x,y);
        // connection lines
        if(i<TOKENS.length-1){
          const nx=(( i+1)/(TOKENS.length-1))*(W*0.8)+W*0.1;
          const ny=H/2+Math.sin(t*0.7+(i+1)*0.6)*28;
          ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(nx,ny);
          ctx.strokeStyle=`rgba(236,72,153,${0.1+alpha*0.15})`;
          ctx.lineWidth=1;ctx.stroke();
        }
        // glow
        const g=ctx.createRadialGradient(x,y,0,x,y,20);
        g.addColorStop(0,PNK+Math.round(alpha*80).toString(16).padStart(2,"0"));
        g.addColorStop(1,PNK+"00");
        ctx.beginPath();ctx.arc(x,y,20,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      });
      // probability bars
      const barY=H*0.8;
      ["apple","the","world","how","AI"].forEach((w,i)=>{
        const bx=W*0.12+i*(W*0.16);
        const h2=(Math.sin(t+i*1.3)+1)/2*40+8;
        const col=i===2?PNK:PNK+"55";
        ctx.fillStyle=col;ctx.fillRect(bx,barY-h2,28,h2);
        ctx.font=`${px(9)} monospace`;ctx.fillStyle="#475569";ctx.textAlign="center";
        ctx.fillText(w,bx+14,barY+12);
      });
      ctx.font=`${px(9)} sans-serif`;ctx.fillStyle="#1e0a16";ctx.textAlign="center";
      ctx.fillText("P(next token | context)",W/2,barY+24);
      t+=0.03;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ TOKENIZER DEMO ═══════════════════════════════════════════ */
const TokenizerDemo=()=>{
  const [text,setText]=useState("Artificial Intelligence is remarkably powerful");
  const [mode,setMode]=useState("bpe");

  const BPE_VOCAB={"Artificial":1437,"▁Intelligence":8425,"▁is":318,"▁remarkably":24647,
    "▁powerful":5789,"un":593,"##known":4007,"tokenize":1,"##d":1012,"Hello":7592,"world":1362};

  const tokenize=(t,m)=>{
    if(m==="word") return t.trim().split(/\s+/).map((w,i)=>({text:w,id:1000+i*37}));
    if(m==="char") return t.slice(0,20).split("").map((c,i)=>({text:c===" "?"·":c,id:c.charCodeAt(0)}));
    // BPE mock
    const COLORS=[PNK,VIO,AMB,GRN,CYN,ROSE,IND,TEAL];
    const words=t.trim().split(/\s+/);
    const toks=[];
    words.forEach(w=>{
      if(w.length>7){
        toks.push({text:w.slice(0,5),id:Math.abs(w.charCodeAt(0)*31+w.charCodeAt(1))%50000});
        toks.push({text:"##"+w.slice(5),id:Math.abs(w.charCodeAt(3)*17)%50000});
      } else {
        toks.push({text:w,id:BPE_VOCAB["▁"+w]||BPE_VOCAB[w]||(Math.abs(w.charCodeAt(0)*43+w.length*7)%50000)});
      }
    });
    return toks;
  };

  const tokens=tokenize(text,mode);
  const COLORS=[PNK,VIO,AMB,GRN,CYN,ROSE,IND,TEAL,ORG,SKY];

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:PNK,marginBottom:8,fontSize:px(15)}}>
        🔤 Tokenizer Demo — See how LLMs break text into tokens
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:14}}>
        Before an LLM processes text, it converts it into tokens — the atomic units the model operates on.
        GPT-4 uses ~100K token vocabulary; BERT uses ~30K WordPiece tokens.
      </p>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[["bpe","BPE / WordPiece"],["word","Word"],["char","Character"]].map(([k,l])=>(
          <button key={k} onClick={()=>setMode(k)}
            style={{background:mode===k?PNK:PNK+"0d",border:`2px solid ${mode===k?PNK:PNK+"33"}`,
              borderRadius:8,padding:"6px 14px",cursor:"pointer",fontWeight:700,
              fontSize:px(11),color:mode===k?"#fff":PNK}}>
            {l}
          </button>
        ))}
      </div>
      <input value={text} onChange={e=>setText(e.target.value)}
        style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${PNK}33`,
          fontFamily:"monospace",fontSize:px(14),marginBottom:14,
          background:"#fff8fc",boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16,
        background:"#fff8fc",borderRadius:12,padding:"12px",border:`1px solid ${PNK}22`}}>
        {tokens.map((tok,i)=>(
          <div key={i} style={{background:COLORS[i%COLORS.length]+"22",
            border:`2px solid ${COLORS[i%COLORS.length]}55`,borderRadius:8,
            padding:"4px 10px",cursor:"default"}}>
            <div style={{fontFamily:"monospace",fontWeight:700,fontSize:px(13),
              color:COLORS[i%COLORS.length]}}>{tok.text}</div>
            <div style={{fontFamily:"monospace",fontSize:px(9),color:V.muted,textAlign:"center"}}>{tok.id}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:px(12)}}>
        <div style={{background:PNK+"0d",border:`1px solid ${PNK}22`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontFamily:"monospace",fontWeight:900,color:PNK,fontSize:px(22)}}>{tokens.length}</div>
          <div style={{fontSize:px(11),color:V.muted}}>tokens</div>
        </div>
        <div style={{background:VIO+"0d",border:`1px solid ${VIO}22`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontFamily:"monospace",fontWeight:900,color:VIO,fontSize:px(22)}}>{text.length}</div>
          <div style={{fontSize:px(11),color:V.muted}}>characters</div>
        </div>
        <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
          <div style={{fontFamily:"monospace",fontWeight:900,color:GRN,fontSize:px(22)}}>
            {(text.length/tokens.length).toFixed(1)}
          </div>
          <div style={{fontSize:px(11),color:V.muted}}>chars/token</div>
        </div>
      </div>
    </div>
  );
};

/* ══════ RLHF DIAGRAM ═════════════════════════════════════════════ */
const RLHFDiagram=()=>{
  const [step,setStep]=useState(0);
  const STEPS=[
    {title:"Step 1 — Supervised Fine-Tuning (SFT)",
     desc:"Human labellers write ideal responses to prompts. The base LLM is fine-tuned on these (prompt, ideal-response) pairs with standard cross-entropy loss. This teaches the model the format and style of helpful responses.",
     c:AMB,icon:"📝"},
    {title:"Step 2 — Reward Model Training",
     desc:"For each prompt, the model generates multiple responses. Human labellers rank them (A > B > C). A separate neural network (the Reward Model) is trained to predict the human ranking score. RM outputs a scalar reward r for any (prompt, response) pair.",
     c:VIO,icon:"🏆"},
    {title:"Step 3 — PPO Reinforcement Learning",
     desc:"The SFT model is optimised using PPO (Proximal Policy Optimisation) — a RL algorithm. The LLM generates responses; the Reward Model scores them; PPO updates the LLM to generate higher-scoring responses. A KL penalty prevents straying too far from the SFT model.",
     c:PNK,icon:"🔄"},
    {title:"Step 4 — Constitutional AI / DPO (Modern)",
     desc:"Direct Preference Optimisation (DPO) skips the reward model entirely — directly optimises the LLM on human preference data pairs using a clever reformulation. Constitutional AI (Claude's approach) uses AI-generated critiques to scale feedback beyond human annotation.",
     c:GRN,icon:"⚡"},
  ];
  const s=STEPS[step];
  return (
    <div style={{...LCARD,background:"#fff8fc",border:`2px solid ${PNK}22`}}>
      <div style={{fontWeight:700,color:PNK,marginBottom:8,fontSize:px(15)}}>
        🎯 RLHF Pipeline — How LLMs Learn to be Helpful and Harmless
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {STEPS.map((st,i)=>(
          <button key={i} onClick={()=>setStep(i)}
            style={{flex:1,minWidth:80,background:step===i?st.c:st.c+"0d",
              border:`2px solid ${step===i?st.c:st.c+"33"}`,borderRadius:10,
              padding:"8px 4px",cursor:"pointer",fontWeight:700,fontSize:px(10),
              color:step===i?"#fff":st.c,textAlign:"center"}}>
            {st.icon} Step {i+1}
          </button>
        ))}
      </div>
      <div style={{background:s.c+"0d",border:`2px solid ${s.c}44`,borderRadius:14,padding:"20px"}}>
        <div style={{fontWeight:800,color:s.c,fontSize:px(16),marginBottom:8}}>{s.title}</div>
        <p style={{...LBODY,fontSize:px(14),margin:0}}>{s.desc}</p>
      </div>
      <div style={{marginTop:12,fontFamily:"monospace",background:"#0f0009",borderRadius:10,
        padding:"12px",fontSize:px(11),lineHeight:1.9}}>
        {step===0&&<>
          <div style={{color:"#475569"}}># SFT Loss:</div>
          <div style={{color:AMB}}>L_SFT = -E[log π_θ(y | x)]  ← cross-entropy on (prompt, response) pairs</div>
        </>}
        {step===1&&<>
          <div style={{color:"#475569"}}># Reward Model:</div>
          <div style={{color:VIO}}>L_RM = -E[log σ(r(x,y_w) - r(x,y_l))]  ← Bradley-Terry preference model</div>
          <div style={{color:"#475569"}}># y_w = preferred response, y_l = less preferred</div>
        </>}
        {step===2&&<>
          <div style={{color:"#475569"}}># PPO objective:</div>
          <div style={{color:PNK}}>L_PPO = E[r(x,y)] - β·KL[π_θ || π_SFT]</div>
          <div style={{color:"#475569"}}># KL term prevents model from 'hacking' the reward model</div>
        </>}
        {step===3&&<>
          <div style={{color:"#475569"}}># DPO Loss (no RM needed):</div>
          <div style={{color:GRN}}>L_DPO = -E[log σ(β log(π_θ(y_w|x)/π_ref(y_w|x))</div>
          <div style={{color:GRN}}>              - β log(π_θ(y_l|x)/π_ref(y_l|x)))]</div>
        </>}
      </div>
    </div>
  );
};

/* ══════ NEXT TOKEN GAME ══════════════════════════════════════════ */
const NextTokenGame=()=>{
  const ROUNDS=[
    {ctx:"The Eiffel Tower is located in",opts:["Paris","London","Berlin","Rome"],ans:"Paris",
     probs:[0.94,0.03,0.02,0.01],why:"Nearly certain — 'Eiffel Tower' is one of the strongest factual associations in any text corpus. P(Paris) ≈ 0.94."},
    {ctx:"Two plus two equals",opts:["four","five","three","six"],ans:"four",
     probs:[0.91,0.04,0.03,0.02],why:"Arithmetic facts are memorised during pretraining. LLMs can perform basic arithmetic reliably."},
    {ctx:"The capital of Australia is",opts:["Canberra","Sydney","Melbourne","Brisbane"],ans:"Canberra",
     probs:[0.72,0.22,0.05,0.01],why:"Common mistake! Sydney is Australia's largest and most famous city. LLMs sometimes predict Sydney (0.22) due to its cultural prominence in training data."},
    {ctx:"To be or not to be, that is the",opts:["question","answer","point","problem"],ans:"question",
     probs:[0.97,0.015,0.01,0.005],why:"Shakespeare's Hamlet Act 3 is one of the most-quoted texts in English literature. Extremely high certainty."},
    {ctx:"In Python, to print to console you use the",opts:["print()","console.log()","System.out","cout"],ans:"print()",
     probs:[0.93,0.04,0.02,0.01],why:"Code-trained LLMs know Python syntax precisely. Other options are from JavaScript, Java, and C++."},
  ];
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);
  const q=ROUNDS[step%ROUNDS.length];
  const choose=opt=>{if(chosen)return;setChosen(opt);if(opt===q.ans)setScore(s=>s+1);};

  return (
    <div style={{...LCARD,background:"#fff8fc",border:`2px solid ${PNK}22`}}>
      <div style={{fontWeight:800,color:PNK,fontSize:px(17),marginBottom:8}}>
        🎮 Next Token Prediction — Think Like an LLM
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Given the context, predict which token the model assigns the highest probability.
        Score: <strong style={{color:PNK}}>{score}/{step%5===0&&step>0?5:step%5}</strong>
      </p>
      <div style={{background:PNK+"0d",border:`2px solid ${PNK}33`,borderRadius:14,padding:"16px",marginBottom:18}}>
        <div style={{fontSize:px(11),color:V.muted,marginBottom:6,letterSpacing:"1px"}}>CONTEXT</div>
        <div style={{fontFamily:"'Lora',serif",fontSize:px(18),fontWeight:600,color:V.ink}}>
          "{q.ctx} <span style={{color:PNK}}>___</span>"
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {q.opts.map((opt,i)=>{
          const isAns=opt===q.ans,isChos=opt===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isAns){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChos&&!isAns){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"12px",cursor:chosen?"default":"pointer",
                fontWeight:700,fontSize:px(14),color:col,transition:"all 0.2s"}}>
              {show&&isAns?"✅ ":show&&isChos&&!isAns?"❌ ":""}{opt}
              {show&&(
                <div style={{fontFamily:"monospace",fontSize:px(10),marginTop:4,
                  color:isAns?GRN:V.muted,fontWeight:400}}>
                  P = {(q.probs[q.opts.indexOf(opt)]*100).toFixed(1)}%
                </div>
              )}
            </button>
          );
        })}
      </div>
      {chosen&&(
        <div>
          {show=>(
            <>
              <div style={{background:chosen===q.ans?GRN+"0d":ROSE+"0d",
                border:`2px solid ${chosen===q.ans?GRN:ROSE}`,borderRadius:12,
                padding:"12px",marginBottom:10}}>
                <div style={{fontWeight:800,color:chosen===q.ans?GRN:ROSE,marginBottom:4}}>
                  {chosen===q.ans?"✅ Correct!":"❌ Answer: "+q.ans}
                </div>
                <p style={{...LBODY,fontSize:px(13),margin:0}}>{q.why}</p>
              </div>
              <div style={{marginBottom:10}}>
                {q.opts.map((opt,i)=>(
                  <div key={opt} style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontFamily:"monospace",minWidth:100,fontSize:px(11),
                      color:opt===q.ans?GRN:V.muted}}>{opt}</span>
                    <div style={{flex:1,background:V.cream,borderRadius:4,height:6,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${q.probs[i]*100}%`,
                        background:opt===q.ans?GRN:PNK+"44",borderRadius:4}}/>
                    </div>
                    <span style={{fontFamily:"monospace",fontSize:px(11),minWidth:36,
                      color:opt===q.ans?GRN:V.muted}}>{(q.probs[i]*100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <button onClick={()=>{setChosen(null);setStep(s=>s+1);}}
            style={{background:PNK,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%5<4?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ TEXT GENERATOR PROJECT ═══════════════════════════════════ */
const TextGeneratorProject=()=>{
  const MODELS=[
    {name:"GPT-2 Small",params:"124M",qual:"Basic coherence",speed:"Fast"},
    {name:"GPT-2 XL",params:"1.5B",qual:"Good coherence",speed:"Medium"},
    {name:"GPT-3.5",params:"175B",qual:"Excellent",speed:"API"},
    {name:"GPT-4",params:"~1.8T",qual:"State-of-the-art",speed:"API"},
  ];
  const PROMPTS=[
    {p:"Artificial intelligence will change the world because",
     out:"Artificial intelligence will change the world because it fundamentally shifts the relationship between human capability and machine assistance. For the first time in history, cognitive labour — writing, reasoning, coding, diagnosis — can be partially automated at scale. This democratises expertise: a farmer in rural Kenya can access medical knowledge; a student in rural India can have a personalised tutor."},
    {p:"The key challenge in building AGI is",
     out:"The key challenge in building AGI is not raw computational power, but the synthesis of common sense reasoning with generalisation. Current systems excel at pattern matching within their training distribution but fail at genuine out-of-distribution reasoning — the kind a five-year-old performs effortlessly when encountering a new situation."},
    {p:"import torch\n# Build a simple neural network",
     out:"import torch\nimport torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self, input_dim, hidden_dim, output_dim):\n        super().__init__()\n        self.layers = nn.Sequential(\n            nn.Linear(input_dim, hidden_dim),\n            nn.ReLU(),\n            nn.Linear(hidden_dim, output_dim)\n        )\n    def forward(self, x):\n        return self.layers(x)"},
  ];
  const [prompt,setPrompt]=useState(0);
  const [model,setModel]=useState(0);
  const [temp,setTemp]=useState(0.7);
  const [topk,setTopk]=useState(50);
  const [output,setOutput]=useState("");
  const [gen,setGen]=useState(false);
  const iRef=useRef(null);

  const generate=()=>{
    setGen(true);setOutput("");
    const target=PROMPTS[prompt].out;
    let i=PROMPTS[prompt].p.length;
    iRef.current=setInterval(()=>{
      i++;setOutput(target.slice(0,i));
      if(i>=target.length){clearInterval(iRef.current);setGen(false);}
    },18);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  return (
    <div style={{...LCARD,background:"#fff8fc",border:`2px solid ${PNK}22`}}>
      <div style={{fontWeight:700,color:PNK,marginBottom:8,fontSize:px(15)}}>
        🤖 Mini Project — LLM Text Generator
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:px(11),color:V.muted,marginBottom:6,fontWeight:700}}>MODEL</div>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {MODELS.map((m,i)=>(
                <button key={i} onClick={()=>setModel(i)}
                  style={{background:model===i?PNK:PNK+"0d",border:`1px solid ${model===i?PNK:PNK+"22"}`,
                    borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:700,
                    fontSize:px(11),color:model===i?"#fff":PNK,textAlign:"left",
                    display:"flex",justifyContent:"space-between"}}>
                  <span>{m.name}</span>
                  <span style={{fontWeight:400,opacity:0.8}}>{m.params}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:px(11)}}>
              <span style={{color:V.muted,fontWeight:700}}>Temperature</span>
              <span style={{fontFamily:"monospace",color:AMB,fontWeight:700}}>{temp.toFixed(1)}</span>
            </div>
            <input type="range" min={0.1} max={2} step={0.1} value={temp}
              onChange={e=>setTemp(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:px(9),color:V.muted}}>
              <span>deterministic</span><span>creative</span>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:px(11)}}>
              <span style={{color:V.muted,fontWeight:700}}>Top-K</span>
              <span style={{fontFamily:"monospace",color:VIO,fontWeight:700}}>{topk}</span>
            </div>
            <input type="range" min={1} max={100} step={1} value={topk}
              onChange={e=>setTopk(+e.target.value)} style={{width:"100%",accentColor:VIO}}/>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:px(11),color:V.muted,marginBottom:6,fontWeight:700}}>PROMPT</div>
            {PROMPTS.map((p,i)=>(
              <button key={i} onClick={()=>{setPrompt(i);setOutput("");}}
                style={{display:"block",width:"100%",background:prompt===i?PNK+"15":"transparent",
                  border:`1px solid ${prompt===i?PNK:V.border}`,borderRadius:8,
                  padding:"6px 10px",cursor:"pointer",fontSize:px(11),marginBottom:4,
                  color:prompt===i?PNK:V.muted,textAlign:"left"}}>
                {p.p.slice(0,36)}...
              </button>
            ))}
          </div>
          <button onClick={gen?()=>{}:generate} disabled={gen}
            style={{width:"100%",background:PNK,border:"none",borderRadius:10,padding:"12px",
              color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer",opacity:gen?0.6:1}}>
            {gen?"Generating...":"✨ Generate"}
          </button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#0f0009",borderRadius:12,padding:"14px",flex:1,
            fontFamily:"monospace",fontSize:px(12),lineHeight:1.8,minHeight:200}}>
            <span style={{color:AMB,fontWeight:700}}>{PROMPTS[prompt].p}</span>
            {output&&<span style={{color:"#f9a8d4"}}>{output.slice(PROMPTS[prompt].p.length)}</span>}
            {gen&&<span style={{color:PNK}}>▊</span>}
          </div>
          <CodeBox color={PNK} lines={[
            "from transformers import pipeline, set_seed",
            "",
            "generator = pipeline('text-generation',",
            "  model='gpt2-xl')",
            "set_seed(42)",
            "",
            "output = generator(",
            `  '${PROMPTS[prompt].p.slice(0,30)}...',`,
            `  max_new_tokens=150,`,
            `  temperature=${temp.toFixed(1)},`,
            `  top_k=${topk},`,
            "  top_p=0.95,",
            "  do_sample=True,",
            "  num_return_sequences=1",
            ")",
            "print(output[0]['generated_text'])",
          ]}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═════════════════════════════════════════════ */
const LLMTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🧠",c:PNK,t:"LLMs are trained on next-token prediction: P(w_t | w_1,...,w_{t-1}). Despite this simple objective, models with enough parameters and data develop emergent capabilities — reasoning, translation, coding — that weren't explicitly trained."},
    {e:"🔤",c:AMB,t:"Tokenisation converts raw text into integer IDs. BPE and WordPiece build subword vocabularies (~30K-100K tokens) that balance granularity and vocabulary size. 'unrecognisable' might be 4 tokens: 'un', '##recog', '##nis', '##able'."},
    {e:"📈",c:GRN,t:"Scaling laws (Kaplan et al. 2020): loss follows a power law of compute, parameters, and data. Doubling compute budget → predictable improvement. This drove the race to trillion-parameter models. Chinchilla (Hoffmann 2022) showed optimal N∝D: parameters and tokens should scale together."},
    {e:"🎯",c:VIO,t:"Pretraining learns the world from text. Fine-tuning (SFT + RLHF/DPO) teaches the model to be a helpful assistant. RLHF was the key breakthrough that made ChatGPT usable — without it, base LLMs are unpredictable and often harmful."},
    {e:"⚠️",c:ROSE,t:"Hallucination: LLMs generate false information confidently because they optimise token probability, not factual accuracy. Mitigation: retrieval-augmented generation (RAG), tool use, self-consistency sampling, fine-tuning on factual datasets."},
    {e:"💰",c:ORG,t:"Inference cost: running GPT-4 for one query costs ~$0.01-0.06. Training GPT-3 cost ~$4.6M. These costs drive interest in smaller efficient models (Mistral 7B, Phi-3) and quantisation (4-bit models run on consumer GPUs)."},
    {e:"🔒",c:CYN,t:"Safety alignment: Constitutional AI (Anthropic) uses AI-generated critiques to scale oversight. RLHF with red-teaming catches harmful outputs. Jailbreaks exploit the gap between RL-learned policy and safe base model. An active research frontier."},
    {e:"🚀",c:TEAL,t:"Frontier: GPT-4o (multimodal, real-time voice), Gemini 1.5 Pro (1M context), Claude 3.5 Sonnet (coding). Mixture-of-Experts (MoE) architectures like Mixtral activate only a fraction of parameters per token — 7B active params with 47B total."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights",PNK)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:PNK}}>Know</span></h2>
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
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${PNK},${VIO})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:PNK,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Next: Embeddings →</button>
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Roadmap</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const LargeLanguageModelsPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Large Language Models" lessonNum="Lesson 1 of 5"
    accent={PNK} levelLabel="Modern AI Systems"
    dotLabels={["Hero","Big Picture","History","Language Modeling","Tokenisation","Architecture","Training","RLHF","Python","Applications","Limitations","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#0f0009 0%,#2d0520 60%,#0a0010 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🤖 Lesson 1 of 5 · Modern AI Systems",PNK)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Large Language<br/><span style={{color:"#f9a8d4"}}>Models</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:PNK,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                ChatGPT. Claude. Gemini. Copilot. These systems share a common foundation:
                transformer-based large language models trained on trillions of tokens of human text.
                They predict the next token — and in doing so, they learn to reason, code, translate,
                and converse. Understanding LLMs is understanding the present and future of AI.
              </p>
              <div style={{background:"rgba(236,72,153,0.12)",border:"1px solid rgba(236,72,153,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#f9a8d4",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE INSIGHT</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  "Given all text ever written by humans as training data, and a model large enough to
                  compress it, you get a system that understands language, encodes world knowledge,
                  and can reason about almost anything." — the LLM thesis.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(236,72,153,0.06)",border:"1px solid rgba(236,72,153,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 BIG PICTURE */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Big Picture",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The <span style={{color:PNK}}>Intelligence Shift</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Before 2020, building a capable AI system for a new task required a dedicated
                  research team, task-specific datasets, custom architectures, and months of engineering.
                  After GPT-3, you could write a sentence describing a new task and the model
                  could perform it immediately — zero-shot, with no retraining.
                </p>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  This was the paradigm shift: from <strong>task-specific models</strong> to
                  <strong> foundation models</strong> — single, massive, general-purpose systems
                  that can be prompted or lightly fine-tuned for virtually any language task.
                </p>
                {[
                  {era:"2015",system:"DeepSpeech",note:"One model, one task: speech recognition"},
                  {era:"2018",system:"BERT",note:"One model, fine-tune per task (~12M params/task)"},
                  {era:"2020",system:"GPT-3 (175B)",note:"One model, zero-shot everything"},
                  {era:"2022",system:"ChatGPT",note:"GPT-3.5 + RLHF = conversational assistant"},
                  {era:"2023",system:"GPT-4/Claude/Gemini",note:"Multimodal, long context, reasoning"},
                  {era:"2024",system:"o1/Claude 3.5",note:"Extended reasoning, agentic workflows"},
                ].map(row=>(
                  <div key={row.era} style={{display:"grid",gridTemplateColumns:"50px 1fr 2fr",gap:8,
                    marginBottom:6,padding:"5px 0",borderBottom:`1px solid ${V.border}`}}>
                    <span style={{fontFamily:"monospace",fontSize:px(11),color:PNK,fontWeight:700}}>{row.era}</span>
                    <span style={{fontWeight:700,fontSize:px(12),color:V.ink}}>{row.system}</span>
                    <span style={{fontSize:px(11),color:V.muted}}>{row.note}</span>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={PNK} title="What makes an LLM 'Large'?"
                  body="Three dimensions: (1) Parameters — the number of trainable weights (GPT-3: 175B, GPT-4: ~1.8T). (2) Training data — text tokens seen during training (GPT-3: 300B tokens, LLaMA 3: 15T tokens). (3) Compute — FLOPs used for training (GPT-3: 3.1×10²³ FLOPs). Scaling any of these generally improves performance, following power-law scaling laws."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:PNK,marginBottom:10,fontSize:px(13)}}>Modern LLM Applications</div>
                  {[
                    {icon:"💬",t:"Chatbots & Assistants",ex:"ChatGPT, Claude, Gemini, Copilot"},
                    {icon:"💻",t:"Code Generation",ex:"GitHub Copilot, Cursor, Codex, Devin"},
                    {icon:"🌍",t:"Translation",ex:"DeepL, Google Translate (neural)"},
                    {icon:"📄",t:"Document Summarisation",ex:"NotionAI, Otter.ai, Perplexity"},
                    {icon:"🔍",t:"AI-Powered Search",ex:"Perplexity, Bing AI, Google AI Overview"},
                    {icon:"🎨",t:"Creative Writing",ex:"Jasper, Copy.ai, Sudowrite"},
                  ].map(item=>(
                    <div key={item.t} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{fontSize:px(20)}}>{item.icon}</span>
                      <div>
                        <span style={{fontWeight:700,color:PNK,fontSize:px(13)}}>{item.t}: </span>
                        <span style={{fontSize:px(12),color:V.muted}}>{item.ex}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 HISTORY */}
        <div ref={R(2)} style={{background:"#0f0009"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Historical Evolution","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(28)}}>From Rules to <span style={{color:"#f9a8d4"}}>Scale</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              {[
                {era:"1950s–1980s",c:V.muted,title:"Rule-Based NLP",
                  d:"Hand-crafted grammar rules and dictionaries. ELIZA (1966) mimicked therapy through pattern matching. Brittle: one unhandled pattern = system failure. Could not generalise beyond programmed rules.",
                  ex:"if 'I feel' in input: return 'Why do you feel ' + rest"},
                {era:"1990s–2000s",c:AMB,title:"Statistical Language Models",
                  d:"N-gram models: P(word | previous N-1 words). Count co-occurrences in large corpora. Better generalisation but vocabulary explosion and data sparsity. Maximum Likelihood Estimation on 5-grams with Kneser-Ney smoothing.",
                  ex:"P('the dog') = C('the dog') / C('the')"},
                {era:"2010–2017",c:VIO,title:"Neural Language Models",
                  d:"Word2Vec (2013): dense word embeddings. RNN/LSTM language models (2011+): hidden state carries sequence context. Word embedding arithmetic: king - man + woman ≈ queen. First models to capture semantic relationships.",
                  ex:"h_t = tanh(W_h · h_{t-1} + W_x · x_t)"},
                {era:"2017–present",c:PNK,title:"Transformer LLMs",
                  d:"Attention Is All You Need (2017). BERT (2018): bidirectional, 340M. GPT-2 (2019): 1.5B. T5 (2020): text-to-text. GPT-3 (2020): 175B — emergent few-shot learning. ChatGPT (2022): RLHF alignment. GPT-4, Claude, Gemini (2023): multimodal.",
                  ex:"Attention(Q,K,V) = softmax(QKᵀ/√d)·V"},
              ].map(item=>(
                <div key={item.era} style={{background:item.c==="#f9a8d4"||item.c===PNK?PNK+"0d":item.c+"0d",
                  border:`1px solid ${item.c}33`,borderRadius:14,padding:"18px 20px"}}>
                  <div style={{fontFamily:"monospace",fontSize:px(10),color:item.c,marginBottom:6,
                    fontWeight:700,letterSpacing:"1px"}}>{item.era}</div>
                  <div style={{fontWeight:800,color:item.c==="#f9a8d4"?"#f9a8d4":item.c,fontSize:px(15),marginBottom:8}}>{item.title}</div>
                  <p style={{...LBODY,fontSize:px(12),color:"#94a3b8",marginBottom:10}}>{item.d}</p>
                  <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"8px 12px",
                    fontFamily:"monospace",fontSize:px(10),color:item.c==="#f9a8d4"?"#f9a8d4":item.c}}>
                    {item.ex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S3 LANGUAGE MODELING */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Language Modeling Objective",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Predicting the <span style={{color:PNK}}>Next Token</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color={PNK}>P(w_t | w_1, w_2, ..., w_{"{t-1}"})</Formula>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Given all previous tokens, predict the probability distribution over the vocabulary
                  for the next token. During training, the model sees billions of examples of this
                  task. The training objective is to minimise the cross-entropy loss:
                </p>
                <Formula color={VIO}>L = -Σ log P(w_t | w_{"<t"})</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  This seemingly simple objective drives the model to learn everything needed
                  to predict text well: grammar, facts, reasoning chains, code syntax,
                  mathematical patterns, and even common sense — because all of these affect
                  which token is most likely next.
                </p>
                <IBox color={PNK} title="Why next-token prediction → general intelligence?"
                  body="Predicting text well requires understanding the world. To predict 'Paris' after 'The Eiffel Tower is in', the model needs geography. To predict 'def' after '# Python function', it needs code syntax. To predict the correct answer in a logical argument, it needs reasoning. The objective is simple; what it demands is comprehensive world modelling."/>
              </div>
              <div>
                <div style={{...LCARD,marginBottom:14}}>
                  <div style={{fontWeight:700,color:PNK,marginBottom:10,fontSize:px(13)}}>Chain Rule Decomposition</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10}}>
                    Probability of a full sentence decomposes as a product:
                  </p>
                  <div style={{background:"#fff8fc",borderRadius:10,padding:"12px",
                    fontFamily:"monospace",fontSize:px(12),lineHeight:2,color:V.muted}}>
                    <div>P("The cat sat") =</div>
                    <div style={{color:PNK}}>  P("The") ×</div>
                    <div style={{color:VIO}}>  P("cat" | "The") ×</div>
                    <div style={{color:AMB}}>  P("sat" | "The cat")</div>
                  </div>
                  <p style={{...LBODY,fontSize:px(12),marginTop:8,marginBottom:0}}>
                    Training maximises log-probability of all tokens in the corpus simultaneously.
                    Each forward pass through the Transformer computes probabilities for all positions in parallel via causal masking.
                  </p>
                </div>
                <div style={{...LCARD,background:"#fff8fc",border:`2px solid ${PNK}22`}}>
                  <div style={{fontWeight:700,color:PNK,marginBottom:10,fontSize:px(13)}}>Emergent Capabilities vs Scale</div>
                  {[
                    {cap:"Few-shot learning",scale:"≥13B params"},
                    {cap:"Chain-of-thought reasoning",scale:"≥60B params"},
                    {cap:"Arithmetic (3-digit)",scale:"≥100B params"},
                    {cap:"Code completion",scale:"≥7B params"},
                    {cap:"Instruction following",scale:"≥7B + RLHF"},
                    {cap:"Multi-step planning",scale:"≥70B params"},
                  ].map(row=>(
                    <div key={row.cap} style={{display:"flex",justifyContent:"space-between",
                      marginBottom:5,padding:"3px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(12),color:V.muted}}>{row.cap}</span>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:PNK,fontSize:px(11)}}>{row.scale}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S4 TOKENISATION */}
        <div ref={R(4)} style={{background:"#0f0009"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Tokenisation","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Breaking Text into <span style={{color:"#f9a8d4"}}>Atoms</span></h2>
            <p style={{...LBODY,color:"#94a3b8",maxWidth:px(700),marginBottom:px(24)}}>
              LLMs don't see characters or words — they see token IDs. Tokenisation is the
              preprocessing step that converts raw text into integer sequences the model can process.
              The tokeniser is trained separately from the model and is fixed at inference time.
            </p>
            <TokenizerDemo/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <div style={{background:"#1a0010",border:`1px solid ${PNK}33`,borderRadius:14,padding:"16px"}}>
                <div style={{fontWeight:700,color:"#f9a8d4",marginBottom:10,fontSize:px(13)}}>BPE Algorithm (Byte-Pair Encoding)</div>
                <div style={{fontFamily:"monospace",fontSize:px(11),lineHeight:2,color:"#94a3b8"}}>
                  <div style={{color:"#475569"}}># Start with character vocabulary</div>
                  <div>vocab = {`{`}"a","b","c",...,"z"{`}`}</div>
                  <div style={{color:"#475569"}}># Merge most frequent pairs</div>
                  <div>Step 1: "t","h" → "th" (most common pair)</div>
                  <div>Step 2: "th","e" → "the" (next most common)</div>
                  <div>Step 3: "i","n" → "in"</div>
                  <div>... repeat 50,000 times ...</div>
                  <div style={{color:PNK,fontWeight:700}}>Result: vocabulary of ~50K subwords</div>
                </div>
              </div>
              <IBox color="#f9a8d4" title="Why subword tokenisation?"
                body="Word-level: 'running' and 'runs' are unrelated. Character-level: 'a','r','u','n' loses meaning. Subword (BPE/WordPiece) splits: 'running' → ['run','##ning'] — the root 'run' is shared across all forms. Unknown words decompose gracefully: 'ChatGPT' → ['Chat','G','PT']. Multilingual models like mBERT share subword pieces across 100+ languages."/>
            </div>
          </div>
        </div>

        {/* S5 ARCHITECTURE */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Transformer Architecture for LLMs",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The <span style={{color:PNK}}>GPT Stack</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {l:"Token Embedding",c:AMB,d:"Each of the ~100K vocabulary tokens maps to a d_model-dimensional vector. GPT-4: d_model≈12,288. The embedding matrix has vocab_size × d_model parameters — often 30%+ of total model size."},
                  {l:"Positional Encoding",c:VIO,d:"Position information added to embeddings. GPT uses learned positional embeddings; LLaMA uses Rotary Position Embedding (RoPE) which generalises better to long contexts."},
                  {l:"Causal Self-Attention",c:PNK,d:"Multi-head self-attention with causal (lower-triangular) mask — each token can only attend to previous tokens. This enables parallel training while preserving autoregressive property. GPT-4 uses ~96 heads."},
                  {l:"Feed-Forward Network",c:GRN,d:"Per-position MLP: Linear(d→4d) → GELU → Linear(4d→d). Stores factual knowledge — ablation studies show specific facts stored in specific FFN layers. Largest parameter block in each layer."},
                  {l:"Layer Norm",c:CYN,d:"Pre-LayerNorm (applied before attention/FFN, not after) is the modern standard — more stable training. RMSNorm (LLaMA) removes mean-centring for efficiency."},
                  {l:"Output Projection",c:IND,d:"Linear layer mapping d_model → vocab_size, then softmax → probability distribution over next token. Temperature τ scales logits: logits/τ. Weight-tied with embedding matrix in many models."},
                ].map(item=>(
                  <div key={item.l} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
                    <div style={{width:8,height:8,borderRadius:"50%",flexShrink:0,background:item.c,marginTop:6}}/>
                    <div><span style={{fontWeight:700,color:item.c,fontSize:px(13)}}>{item.l}: </span>
                    <span style={{fontSize:px(13),color:V.muted}}>{item.d}</span></div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{background:"#fff8fc",border:`2px solid ${PNK}22`,borderRadius:14,padding:"16px",marginBottom:14}}>
                  <div style={{fontWeight:700,color:PNK,marginBottom:10,fontSize:px(13)}}>GPT vs BERT — Two Training Paradigms</div>
                  {[
                    ["Architecture","Decoder-only","Encoder-only"],
                    ["Objective","Next token prediction","Masked token prediction"],
                    ["Attention","Causal (unidirectional)","Bidirectional"],
                    ["Generation","✅ Native","❌ Not designed for"],
                    ["Understanding","✅ Good","✅ Excellent (both directions)"],
                    ["Best for","ChatGPT, code gen","Classification, NER, QA"],
                    ["Examples","GPT-4, LLaMA, Claude","BERT, RoBERTa, DeBERTa"],
                  ].map((row,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1.2fr 1fr 1fr",gap:6,
                      marginBottom:4,padding:"4px 0",borderBottom:`1px solid ${V.border}`,
                      background:i===0?"#fff8fc":"transparent"}}>
                      {row.map((cell,j)=>(
                        <span key={j} style={{fontSize:px(11),fontWeight:i===0||j===0?700:400,
                          color:j===1&&i>0?PNK:j===2&&i>0?VIO:V.muted}}>{cell}</span>
                      ))}
                    </div>
                  ))}
                </div>
                <IBox color={PNK} title="KV-Cache: the inference trick"
                  body="During autoregressive generation, the attention keys and values for all previous tokens are identical to previous steps. KV-cache stores these, avoiding recomputation. For a 40-layer GPT-3 generating 1000 tokens: saves ~99.9% of attention computation. Memory cost: 2 × n_layers × n_heads × head_dim × seq_len per token."/>
              </div>
            </div>
          </div>
        </div>

        {/* S6 TRAINING */}
        <div ref={R(6)} style={{background:"#0f0009"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Training LLMs","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>From Raw Text to <span style={{color:"#f9a8d4"}}>Intelligence</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {n:1,t:"Data Collection",c:AMB,
                    d:"Crawl and filter the web (Common Crawl, C4), books (Books3), code (GitHub), academic papers (arXiv), Wikipedia. GPT-3 used ~570GB of filtered text. LLaMA 3 used 15T tokens from curated sources. Quality filtering: deduplicate, remove toxic content, language ID."},
                  {n:2,t:"Tokenisation & Shuffling",c:VIO,
                    d:"Convert all text to BPE token sequences. Shuffle documents (not sentences — preserve document context). Pack into fixed-length sequences (~2048-128K tokens). Training data is not seen in order — important for generalisation."},
                  {n:3,t:"Distributed Training",c:PNK,
                    d:"Training GPT-3 required 10,000 A100 GPUs for ~34 days. Techniques: Data Parallelism (same model, different data shards), Tensor Parallelism (split matrix ops across GPUs), Pipeline Parallelism (split layers across GPUs). Megatron-LM, DeepSpeed are key frameworks."},
                  {n:4,t:"Fine-Tuning (SFT)",c:GRN,
                    d:"Fine-tune on curated (instruction, response) pairs — typically 10K-1M examples. Teaches the model to follow instructions, maintain conversation format, and refuse harmful requests at a basic level. FLAN, Alpaca, OpenHermes are open fine-tuning datasets."},
                  {n:5,t:"Alignment (RLHF/DPO)",c:CYN,
                    d:"Human labellers rank model outputs. RLHF trains a reward model on rankings, then uses PPO to optimise the LLM. DPO (2023) skips the reward model entirely. This step creates the helpful, harmless assistant from a raw completion model."},
                ].map(item=>(
                  <div key={item.n} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                      background:item.c+"22",border:`2px solid ${item.c}`,display:"flex",
                      alignItems:"center",justifyContent:"center",fontWeight:800,
                      color:item.c,fontSize:px(12)}}>{item.n}</div>
                    <div>
                      <div style={{fontWeight:700,color:item.c,fontSize:px(13),marginBottom:3}}>{item.t}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0,color:"#64748b"}}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <CodeBox color={PNK} lines={[
                  "# Simplified LLM training loop",
                  "import torch",
                  "from transformers import GPT2LMHeadModel",
                  "from torch.optim import AdamW",
                  "",
                  "model = GPT2LMHeadModel.from_pretrained('gpt2')",
                  "optimizer = AdamW(model.parameters(), lr=3e-4)",
                  "scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(",
                  "  optimizer, T_max=total_steps)",
                  "",
                  "for batch in dataloader:",
                  "  input_ids = batch['input_ids']  # (B, T)",
                  "  # Causal LM: predict token t+1 from tokens 0..t",
                  "  outputs = model(input_ids, labels=input_ids)",
                  "  loss = outputs.loss  # cross-entropy",
                  "",
                  "  optimizer.zero_grad()",
                  "  loss.backward()",
                  "  # Gradient clipping — essential for LLMs",
                  "  torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)",
                  "  optimizer.step()",
                  "  scheduler.step()",
                  "",
                  "  if step % 100 == 0:",
                  "    ppl = torch.exp(loss)  # perplexity",
                  "    print(f'loss={loss:.3f}, ppl={ppl:.1f}')",
                  "",
                  "# Key hyperparameters for LLM training:",
                  "# lr: 1e-4 to 3e-4 (cosine decay to 0)",
                  "# batch_size: 0.5M - 4M tokens (gradient accum)",
                  "# weight_decay: 0.1, adam_beta2: 0.95",
                  "# bf16 mixed precision (not fp16 for stability)",
                ]}/>
              </div>
            </div>
          </div>
        </div>

        {/* S7 RLHF */}
        <div ref={R(7)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 7 · RLHF — Learning from Humans",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>Aligning AI with <span style={{color:PNK}}>Human Values</span></h2>
            <p style={{...LBODY,maxWidth:px(700),marginBottom:px(24)}}>
              A base language model trained on raw internet text learns to complete text in
              any style — including harmful, biased, or unhelpful styles. RLHF (Reinforcement
              Learning from Human Feedback) is the process that transforms a raw model into
              a helpful, harmless, and honest assistant.
            </p>
            <RLHFDiagram/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16),marginTop:px(20)}}>
              <IBox color={PNK} title="Constitutional AI (Anthropic)"
                body="Instead of human labellers for every critique, Anthropic's Claude uses a 'constitution' — a set of principles about being helpful, harmless, and honest. The model critiques its own outputs against these principles (AI-generated critiques), then revises. This scales feedback without proportional human annotation costs. Claude 2 and 3 are trained with CAI."/>
              <IBox color={VIO} title="DPO: The RLHF simplification"
                body="Direct Preference Optimisation (Rafailov et al. 2023) shows RLHF is equivalent to a single classification problem on preference pairs. Instead of training a reward model then running PPO (complex, unstable), DPO directly fine-tunes the LLM to assign higher probability to preferred responses vs. rejected ones. 2x simpler, often better results."/>
            </div>
          </div>
        </div>

        {/* S8 PYTHON */}
        <div ref={R(8)} style={{background:"#0f0009"}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Python Demo","#f9a8d4")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>LLMs in <span style={{color:"#f9a8d4"}}>Code</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={PNK} lines={[
                "from transformers import pipeline",
                "from anthropic import Anthropic",
                "from openai import OpenAI",
                "",
                "# ── Hugging Face pipeline (local) ────",
                "generator = pipeline(",
                "  'text-generation', model='gpt2',",
                "  device=0  # GPU",
                ")",
                "out = generator('Artificial intelligence will',",
                "  max_new_tokens=100,",
                "  temperature=0.8,",
                "  do_sample=True)",
                "print(out[0]['generated_text'])",
                "",
                "# ── OpenAI API ────────────────────────",
                "client = OpenAI()",
                "response = client.chat.completions.create(",
                "  model='gpt-4o',",
                "  messages=[",
                "    {'role':'system','content':'You are a helpful assistant.'},",
                "    {'role':'user','content':'Explain quantum entanglement'}",
                "  ],",
                "  temperature=0.7,",
                "  max_tokens=500",
                ")",
                "print(response.choices[0].message.content)",
                "",
                "# ── Anthropic API ─────────────────────",
                "client = Anthropic()",
                "message = client.messages.create(",
                "  model='claude-3-5-sonnet-20241022',",
                "  max_tokens=1024,",
                "  messages=[",
                "    {'role':'user','content':'Write a haiku about AI'}",
                "  ]",
                ")",
                "print(message.content[0].text)",
                "",
                "# ── Streaming generation ──────────────",
                "with client.messages.stream(",
                "  model='claude-3-5-sonnet-20241022',",
                "  max_tokens=500,",
                "  messages=[{'role':'user','content':'Tell me a story'}]",
                ") as stream:",
                "  for text in stream.text_stream:",
                "    print(text, end='', flush=True)",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"pipeline('text-generation')",c:PNK,d:"Hugging Face's high-level API. Handles tokenisation, model forward pass, and decoding. Best for local experimentation. 50K+ models on Hugging Face Hub."},
                  {l:"temperature",c:AMB,d:"Divides logits before softmax. τ<1: sharper (more deterministic, fewer hallucinations). τ>1: flatter (more creative, more diverse). τ=0 = greedy decoding (always pick argmax)."},
                  {l:"top_k / top_p",c:VIO,d:"top_k: only sample from top-k probability tokens. top_p (nucleus): sample from smallest set of tokens summing to probability p (≥0.9). Prevent low-quality low-probability tokens."},
                  {l:"max_tokens",c:GRN,d:"Maximum tokens to generate. Each token is ~4 chars in English. 1000 tokens ≈ 750 words ≈ 3 pages. Context window = input + output must fit within model's max sequence length."},
                  {l:"chat.completions.create()",c:CYN,d:"Chat format: array of {role, content} messages. Roles: 'system' (instructions), 'user' (human turn), 'assistant' (model turn). System prompt critically affects model behaviour."},
                  {l:"Streaming",c:IND,d:"stream=True returns tokens as they're generated (no waiting for full response). Essential for chat UIs. Server-Sent Events (SSE) protocol from server to browser."},
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

        {/* S9 LIMITATIONS */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Limitations & Pitfalls",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What LLMs <span style={{color:PNK}}>Cannot Do (Yet)</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:px(16)}}>
              {[
                {e:"🌀",c:ROSE,t:"Hallucination",
                  d:"LLMs generate plausible-sounding but false information confidently. When uncertain, the model still picks the highest-probability token — which may be incorrect. Mitigation: RAG, citations, self-consistency (sample multiple outputs, take majority), tool use.",
                  severity:"Critical"},
                {e:"⚖️",c:ORG,t:"Bias & Fairness",
                  d:"Training data encodes societal biases. Models associate certain professions with genders, certain names with sentiments. RLHF can amplify biases if labeller pool is non-representative. Bias audits, diverse labeller pools, and debiasing fine-tuning are mitigations.",
                  severity:"High"},
                {e:"💰",c:AMB,t:"Computational Cost",
                  d:"GPT-4 inference: ~$0.01-0.06 per query. GPT-4 training: estimated $100M+. This limits access and creates environmental impact (training GPT-3 ≈ 552 tonnes CO2). Quantisation (4-bit), distillation, and efficient architectures (Mamba) are active areas.",
                  severity:"High"},
                {e:"📏",c:VIO,t:"Context Window Limits",
                  d:"Even 1M-token models can't process entire codebases or book series in one call. Models show 'lost in the middle' — facts at the start and end of context are better recalled than middle. Hierarchical processing and RAG are workarounds.",
                  severity:"Medium"},
                {e:"🔢",c:CYN,t:"Mathematical Reasoning",
                  d:"LLMs struggle with multi-step arithmetic without tool use (calculators, code interpreters). They're pattern-matchers, not symbolic reasoners. GPT-4 with Code Interpreter solves this for computation, but pure language math is unreliable.",
                  severity:"Medium"},
                {e:"📅",c:TEAL,t:"Knowledge Cutoff",
                  d:"Training data has a cutoff date — the model doesn't know about events after training. Retrieval-augmented generation (RAG) injects current information. GPT-4's cutoff is April 2023; Claude 3.5's is April 2024. Always specify cutoff in prompts.",
                  severity:"Low-Medium"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:14,padding:"18px"}}>
                  <div style={{fontSize:px(30),marginBottom:6}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(14),marginBottom:6}}>{a.t}</div>
                  <div style={{fontFamily:"monospace",fontSize:px(9),background:a.c+"15",
                    borderRadius:4,padding:"2px 8px",display:"inline-block",color:a.c,
                    marginBottom:8,fontWeight:700}}>SEVERITY: {a.severity}</div>
                  <p style={{...LBODY,fontSize:px(12),margin:0,color:V.muted}}>{a.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S10 GAME */}
        <div ref={R(10)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 10 · Mini Game",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Next Token Prediction</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Think like a language model. Given the context, predict which token has the highest
              probability. After answering, see the actual probability distribution.
            </p>
            <NextTokenGame/>
          </div>
        </div>

        {/* S11 PROJECT */}
        <div ref={R(11)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 11 · Mini Project",PNK)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🤖 LLM Text Generator</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Explore how temperature and top-k sampling affect generation quality.
              Lower temperature: deterministic and focused. Higher temperature: creative but risky.
            </p>
            <TextGeneratorProject/>
          </div>
        </div>

        {/* S12 INSIGHTS */}
        <div ref={R(12)} style={{background:V.cream}}>
          <LLMTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default LargeLanguageModelsPage;
