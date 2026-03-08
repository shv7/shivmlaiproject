import { useState, useEffect, useRef, useCallback } from "react";
import { px, LCARD, LH2, LBODY, LSEC, V, STag, IBox, NavPage } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — TRANSFORMERS
   Level 4 · Deep Learning · Lesson 6 of 7
   Accent: Indigo #4f46e5
══════════════════════════════════════════════════════════════════ */
const IND  = "#4f46e5";
const VIO  = "#7c3aed";
const CYN  = "#0891b2";
const GRN  = "#059669";
const AMB  = "#d97706";
const ROSE = "#e11d48";
const TEAL = "#0d9488";
const PNK  = "#ec4899";
const ORG  = "#ea580c";
const SKY  = "#0284c7";

const Formula=({children,color=IND})=>(
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,
    padding:"18px 24px",fontFamily:"monospace",fontSize:px(15),color,fontWeight:700,
    textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);
const CodeBox=({lines,color=IND})=>(
  <div style={{fontFamily:"monospace",background:"#04020f",borderRadius:10,
    padding:"14px 18px",fontSize:px(13),lineHeight:1.9}}>
    {lines.map((l,i)=>(
      <div key={i} style={{color:l.startsWith("#")||l.startsWith("from")||l.startsWith("import")?"#475569":color}}>{l}</div>
    ))}
  </div>
);

/* ══════ HERO CANVAS — attention web ════════════════════════════ */
const HeroCanvas=()=>{
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize();window.addEventListener("resize",resize);
    const TOKENS=["The","bank","by","the","river","was","flooded"];
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#04020f";ctx.fillRect(0,0,W,H);
      ctx.strokeStyle="rgba(79,70,229,0.04)";ctx.lineWidth=1;
      for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
      for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
      const n=TOKENS.length;
      const step=W/(n+1);
      const cy=H/2;
      const focused=Math.floor(t*0.4)%n;
      // attention weights from focused token
      const weights=TOKENS.map((_,i)=>
        i===focused?1:Math.exp(-(Math.abs(i-focused)*0.4+Math.random()*0.3*0.1))
      );
      const wsum=weights.reduce((a,b)=>a+b,0);
      const normW=weights.map(w=>w/wsum);
      // draw attention arcs
      TOKENS.forEach((_,src)=>{
        TOKENS.forEach((_2,dst)=>{
          if(src===focused||dst===focused){
            const x1=(src+1)*step,x2=(dst+1)*step;
            const strength=normW[src===focused?dst:src];
            if(strength<0.05)return;
            const cpY=cy-(Math.abs(src-dst)*15+20)*Math.sin(Math.PI*(src+dst)/n*0.3+0.5);
            ctx.beginPath();ctx.moveTo(x1,cy);ctx.quadraticCurveTo((x1+x2)/2,cpY,x2,cy);
            ctx.strokeStyle=`rgba(79,70,229,${strength*0.7})`;
            ctx.lineWidth=strength*4+0.5;ctx.stroke();
          }
        });
      });
      // tokens
      TOKENS.forEach((tok,i)=>{
        const x=(i+1)*step;
        const isFocused=i===focused;
        const attn=normW[i];
        const r=isFocused?24:14+attn*16;
        const g=ctx.createRadialGradient(x,cy,0,x,cy,r*2);
        g.addColorStop(0,IND+(isFocused?"55":"22"));g.addColorStop(1,IND+"00");
        ctx.beginPath();ctx.arc(x,cy,r*2,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        ctx.beginPath();ctx.arc(x,cy,r,0,Math.PI*2);
        ctx.fillStyle="#080418";ctx.fill();
        ctx.strokeStyle=isFocused?IND:IND+(Math.round(attn*200).toString(16).padStart(2,"0"));
        ctx.lineWidth=isFocused?2.5:1.5;
        ctx.shadowColor=IND;ctx.shadowBlur=isFocused?14:attn*10;ctx.stroke();ctx.shadowBlur=0;
        ctx.font=`${isFocused?"bold ":""}${px(11)} sans-serif`;
        ctx.fillStyle=isFocused?"#fff":IND+(Math.round(attn*180+60).toString(16).padStart(2,"0"));
        ctx.textAlign="center";ctx.fillText(tok,x,cy+r+16);
        if(isFocused){
          ctx.font=`bold ${px(9)} sans-serif`;ctx.fillStyle=AMB+"aa";
          ctx.fillText("attending",x,cy-r-8);
        }
      });
      t+=0.035;raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ SELF-ATTENTION EXPLORER ════════════════════════════════ */
const SelfAttentionExplorer=()=>{
  const [query,setQuery]=useState(2);// which token is the query
  const [temp,setTemp]=useState(1.0);

  const SENTENCE="The animal didn't cross the street because it was too tired".split(" ");
  const N=SENTENCE.length;

  // fake key similarity scores based on semantic mock
  const SIM=[
    [1,.1,.1,.1,.1,.1,.1,.1,.1,.1,.1],
    [.1,1,.4,.2,.1,.1,.1,.1,.1,.1,.1],
    [.1,.5,1,.2,.1,.1,.1,.1,.1,.1,.1],
    [.1,.1,.1,1,.1,.1,.1,.1,.1,.1,.1],
    [.1,.1,.1,.1,1,.2,.1,.1,.1,.1,.1],
    [.1,.1,.1,.1,.2,1,.1,.1,.1,.1,.1],
    [.1,.1,.1,.1,.1,.1,1,.1,.1,.1,.1],
    [.3,.4,.1,.2,.1,.1,.1,1,.3,.5,.3],//it
    [.1,.1,.1,.1,.1,.1,.1,.3,1,.2,.1],
    [.1,.1,.1,.1,.1,.1,.1,.5,.2,1,.2],
    [.1,.1,.1,.1,.1,.1,.1,.3,.1,.2,1],
  ];

  const rawScores=SIM[query].map(s=>s*3/temp);
  const expScores=rawScores.map(Math.exp);
  const sumExp=expScores.reduce((a,b)=>a+b,0);
  const attentionWeights=expScores.map(e=>e/sumExp);
  const maxIdx=attentionWeights.indexOf(Math.max(...attentionWeights));

  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:IND,marginBottom:8,fontSize:px(15)}}>
        🔍 Self-Attention Explorer — Watch a token attend to others
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        The pronoun "it" in "The animal didn't cross the street because it was too tired"
        — what does "it" refer to? Self-attention resolves this by computing how much each token
        attends to every other token. Select "it" (index 7) to see it attend strongly to "animal."
      </p>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:px(12)}}>
          <span style={{color:V.muted}}>Query token (select which word is asking)</span>
          <span style={{fontFamily:"monospace",fontWeight:700,color:IND}}>
            "{SENTENCE[query]}" (index {query})
          </span>
        </div>
        <input type="range" min={0} max={N-1} step={1} value={query}
          onChange={e=>setQuery(+e.target.value)} style={{width:"100%",accentColor:IND}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>
          {SENTENCE.map((w,i)=>(
            <button key={i} onClick={()=>setQuery(i)}
              style={{background:i===query?IND:IND+"0d",border:`2px solid ${i===query?IND:IND+"22"}`,
                borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:px(11),
                fontWeight:i===query?700:400,color:i===query?"#fff":IND}}>
              {w}
            </button>
          ))}
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:px(12)}}>
          <span style={{color:V.muted}}>Temperature τ (sharpness of attention)</span>
          <span style={{fontFamily:"monospace",fontWeight:700,color:AMB}}>{temp.toFixed(2)}</span>
        </div>
        <input type="range" min={0.1} max={3} step={0.1} value={temp}
          onChange={e=>setTemp(+e.target.value)} style={{width:"100%",accentColor:AMB}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{fontWeight:700,color:V.muted,fontSize:px(11),marginBottom:8,letterSpacing:"1px"}}>
            ATTENTION WEIGHTS (softmax of Q·Kᵀ/√d)
          </div>
          {SENTENCE.map((w,i)=>(
            <div key={i} style={{marginBottom:6,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontFamily:"monospace",minWidth:100,fontSize:px(11),
                fontWeight:i===maxIdx?700:400,
                color:i===query?AMB:i===maxIdx?GRN:V.muted}}>{w}</span>
              <div style={{flex:1,background:V.cream,borderRadius:4,height:10,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:4,
                  width:`${attentionWeights[i]*100}%`,
                  background:i===query?AMB:i===maxIdx?GRN:IND,
                  transition:"width 0.3s"}}/>
              </div>
              <span style={{fontFamily:"monospace",minWidth:50,textAlign:"right",
                fontWeight:i===maxIdx?700:400,fontSize:px(11),
                color:i===maxIdx?GRN:V.muted}}>
                {(attentionWeights[i]*100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"#04020f",borderRadius:12,padding:"14px",fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
            <div style={{color:"#475569"}}># Self-attention formula:</div>
            <div style={{color:IND}}>Attention(Q,K,V) = softmax(QKᵀ/√d_k) · V</div>
            <div style={{color:"#475569",marginTop:4}}># Query: "{SENTENCE[query]}"</div>
            <div style={{color:AMB}}>Top attended: "{SENTENCE[maxIdx]}" ({(attentionWeights[maxIdx]*100).toFixed(1)}%)</div>
            <div style={{color:"#475569",marginTop:4}}>Temperature: {temp.toFixed(2)}</div>
            <div style={{color:temp>1.5?"#64748b":GRN}}>{temp<0.5?"Very sharp (winner-takes-all)":temp>1.5?"Diffuse (spread evenly)":"Balanced attention"}</div>
          </div>
          <IBox color={IND} title={`"${SENTENCE[query]}" attends to "${SENTENCE[maxIdx]}"`}
            body={query===7?"'it' attends strongly to 'animal' — the transformer correctly resolves the coreference! This is the famous example from 'Attention Is All You Need' that demonstrated attention can capture semantic relationships that span multiple tokens.":
            `The token "${SENTENCE[query]}" attends most strongly to "${SENTENCE[maxIdx]}". Attention captures which other tokens carry the most relevant context for understanding the current token's meaning.`}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ MULTI-HEAD ATTENTION VIZ ═══════════════════════════════ */
const MultiHeadViz=()=>{
  const [activeHead,setActiveHead]=useState(0);
  const HEADS=[
    {name:"Head 1",focus:"Syntactic structure",desc:"Attends to grammatical dependencies — subject↔verb, adjective↔noun",c:IND,pattern:"local+subject"},
    {name:"Head 2",focus:"Coreference resolution",desc:"Attends pronouns to their referents (it → animal, they → students)",c:VIO,pattern:"coreference"},
    {name:"Head 3",focus:"Positional proximity",desc:"Attends to nearby tokens — captures local context and n-gram patterns",c:CYN,pattern:"local"},
    {name:"Head 4",focus:"Semantic similarity",desc:"Attends to semantically related words regardless of position",c:TEAL,pattern:"semantic"},
    {name:"Head 5",focus:"End-of-clause",desc:"Strong attention to sentence boundary markers and conjunctions",c:AMB,pattern:"boundaries"},
    {name:"Head 6",focus:"Rare / named entities",desc:"Attends to proper nouns, domain-specific terms, unusual words",c:PNK,pattern:"entities"},
    {name:"Head 7",focus:"Negation scope",desc:"Tracks 'not', 'never', 'no' and the phrases they modify",c:ROSE,pattern:"negation"},
    {name:"Head 8",focus:"Numeric / temporal",desc:"Attends to numbers, dates, and temporal expressions",c:GRN,pattern:"numbers"},
  ];
  const h=HEADS[activeHead];
  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
      <div style={{fontWeight:700,color:IND,marginBottom:8,fontSize:px(15)}}>
        🎛️ Multi-Head Attention — 8 specialised attention patterns
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        Instead of one attention pattern, Transformers run H attention heads in parallel,
        each with its own Q, K, V projection matrices. Each head learns to focus on
        a different aspect of language. Select a head to see its specialisation.
      </p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {HEADS.map((hd,i)=>(
          <button key={i} onClick={()=>setActiveHead(i)}
            style={{background:activeHead===i?hd.c:hd.c+"0d",border:`2px solid ${activeHead===i?hd.c:hd.c+"22"}`,
              borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,
              fontSize:px(10),color:activeHead===i?"#fff":hd.c}}>
            H{i+1}
          </button>
        ))}
      </div>
      <div style={{background:h.c+"0d",border:`2px solid ${h.c}44`,borderRadius:14,padding:"18px 20px"}}>
        <div style={{fontWeight:800,color:h.c,fontSize:px(16),marginBottom:6}}>{h.name}: {h.focus}</div>
        <p style={{...LBODY,fontSize:px(14),margin:0}}>{h.desc}</p>
      </div>
      <div style={{marginTop:12,fontFamily:"monospace",background:"#04020f",borderRadius:10,padding:"12px",fontSize:px(12),lineHeight:2}}>
        <div style={{color:"#475569"}}># Multi-head attention formula:</div>
        <div style={{color:IND}}>MultiHead(Q,K,V) = Concat(head₁,...,head_H) × W_O</div>
        <div style={{color:"#94a3b8"}}>where head_i = Attention(Q·W_iQ, K·W_iK, V·W_iV)</div>
        <div style={{color:"#475569",marginTop:4}}># Each head_i: d_model/H dimensional</div>
        <div style={{color:AMB}}>H=8, d_model=512 → each head: 64d</div>
        <div style={{color:GRN}}>Total params: 4 × d_model² = 4 × 512² = 1,048,576</div>
      </div>
    </div>
  );
};

/* ══════ ATTENTION EXPLORER GAME ════════════════════════════════ */
const AttentionExplorerGame=()=>{
  const [step,setStep]=useState(0);
  const [chosen,setChosen]=useState(null);
  const [score,setScore]=useState(0);

  const QS=[
    {q:"In 'The trophy didn't fit in the suitcase because IT was too big' — what does IT refer to?",
     opts:["suitcase","trophy","both","neither"],
     ans:"trophy",c:IND,
     why:"IT refers to 'trophy'. Self-attention with the coreference head would show IT attending strongly to 'trophy' because the predicate 'too big' (not too small) resolves the ambiguity — the trophy was big, so it didn't fit."},
    {q:"Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V. Why divide by √d_k?",
     opts:["Random regularisation","Prevent dot products growing large → softmax saturation","Normalise to probability","Match RNN scale"],
     ans:"Prevent dot products growing large → softmax saturation",c:VIO,
     why:"With d_k=64 dimensions, the dot product Q·K has variance proportional to d_k. Without scaling, large values push softmax into saturation where gradients vanish. Dividing by √d_k keeps variance ~1."},
    {q:"What is the time complexity of self-attention for a sequence of length n?",
     opts:["O(n)","O(n log n)","O(n²)","O(n³)"],
     ans:"O(n²)",c:ROSE,
     why:"Every token must attend to every other token: n queries × n keys = n² attention scores. For n=1000 tokens: 1 million operations. For n=100,000 (long documents): 10 billion — why standard transformers struggle with very long contexts."},
    {q:"What is the purpose of positional encoding in Transformers?",
     opts:["Adds colour to embeddings","Injects position information — attention is order-agnostic","Reduces vocabulary size","Prevents overfitting"],
     ans:"Injects position information — attention is order-agnostic",c:TEAL,
     why:"Self-attention treats the input as a set, not a sequence — the order of tokens doesn't affect attention scores. Without positional encoding, 'cat bites dog' = 'dog bites cat'. Sinusoidal or learned positional embeddings are added to token embeddings to inject position."},
    {q:"Which component of a Transformer block processes each token independently (no cross-token interaction)?",
     opts:["Self-attention","Feed-forward network","Layer normalisation","Positional encoding"],
     ans:"Feed-forward network",c:AMB,
     why:"The feed-forward network (FFN) applies identical 2-layer MLP to each token independently: FFN(x) = max(0, xW₁+b₁)W₂+b₂. Tokens don't interact in the FFN — that's self-attention's job. The FFN acts as a key-value memory, storing factual associations."},
  ];
  const q=QS[step%QS.length];
  const choose=opt=>{if(chosen)return;setChosen(opt);if(opt===q.ans)setScore(s=>s+1);};

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
      <div style={{fontWeight:800,color:IND,fontSize:px(17),marginBottom:8}}>
        🎮 Attention Explorer — Deep Transformer knowledge
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:20}}>
        Five challenges on attention mechanisms, complexity, and Transformer architecture.
        Score: <strong style={{color:IND}}>{score}/{step%5===0&&step>0?5:step%5}</strong>
      </p>
      <div style={{background:q.c+"0d",border:`2px solid ${q.c}33`,borderRadius:14,
        padding:"16px",marginBottom:18}}>
        <div style={{fontWeight:700,color:q.c,fontSize:px(14),marginBottom:6}}>Q{step%5+1}/5</div>
        <p style={{...LBODY,fontSize:px(15),margin:0,fontWeight:600,color:V.ink}}>{q.q}</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {q.opts.map(opt=>{
          const isCorrect=opt===q.ans,isChosen=opt===chosen,show=!!chosen;
          let bg="transparent",border=`2px solid ${V.border}`,col=V.muted;
          if(show&&isCorrect){bg=GRN+"15";border=`2px solid ${GRN}`;col=GRN;}
          else if(show&&isChosen&&!isCorrect){bg=ROSE+"15";border=`2px solid ${ROSE}`;col=ROSE;}
          return (
            <button key={opt} onClick={()=>choose(opt)} disabled={!!chosen}
              style={{background:bg,border,borderRadius:10,padding:"12px 16px",cursor:chosen?"default":"pointer",
                fontWeight:600,fontSize:px(13),color:col,textAlign:"left",transition:"all 0.2s"}}>
              {show&&isCorrect?"✅ ":show&&isChosen&&!isCorrect?"❌ ":""}{opt}
            </button>
          );
        })}
      </div>
      {chosen&&(
        <div>
          <div style={{background:chosen===q.ans?GRN+"0d":ROSE+"0d",
            border:`2px solid ${chosen===q.ans?GRN:ROSE}`,borderRadius:12,padding:"12px",marginBottom:10}}>
            <div style={{fontWeight:800,color:chosen===q.ans?GRN:ROSE,marginBottom:4}}>
              {chosen===q.ans?"✅ Correct!":"❌ Answer: "+q.ans}
            </div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{q.why}</p>
          </div>
          <button onClick={()=>{setChosen(null);setStep(s=>s+1);}}
            style={{background:IND,border:"none",borderRadius:10,padding:"9px 20px",
              color:"#fff",fontWeight:800,fontSize:px(12),cursor:"pointer"}}>
            {step%5<4?"Next →":"🎓 Restart"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ══════ TEXT GENERATOR PROJECT ════════════════════════════════= */
const TextGeneratorProject=()=>{
  const PROMPTS=[
    {p:"Once upon a time",out:"Once upon a time, in a kingdom far beyond the mountains, there lived a young inventor who discovered that the stars were not stars at all, but windows into other worlds."},
    {p:"The key insight of backpropagation",out:"The key insight of backpropagation is that gradients can be efficiently computed for any differentiable computation graph using the chain rule, enabling neural networks with millions of parameters to learn from data."},
    {p:"In the future, AI will",out:"In the future, AI will not replace human creativity but amplify it — acting as a collaborative partner that handles routine cognition while humans focus on the tasks that require wisdom, empathy, and meaning."},
    {p:"def fibonacci(n):",out:"def fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b"},
  ];
  const [selected,setSelected]=useState(0);
  const [prompt,setPrompt]=useState(PROMPTS[0].p);
  const [generated,setGenerated]=useState("");
  const [generating,setGenerating]=useState(false);
  const iRef=useRef(null);

  const generate=()=>{
    setGenerating(true);setGenerated("");
    const target=PROMPTS[selected].out;
    let i=0;
    iRef.current=setInterval(()=>{
      i++;setGenerated(target.slice(0,i));
      if(i>=target.length){clearInterval(iRef.current);setGenerating(false);}
    },25);
  };
  useEffect(()=>()=>clearInterval(iRef.current),[]);

  return (
    <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
      <div style={{fontWeight:700,color:IND,marginBottom:8,fontSize:px(15)}}>
        ✍️ Mini Project — Transformer Text Generator
      </div>
      <p style={{...LBODY,fontSize:px(13),marginBottom:16}}>
        GPT-style transformers are autoregressive: they generate one token at a time,
        feeding each output back as input. Select a prompt and watch token-by-token generation.
      </p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {PROMPTS.map((p,i)=>(
          <button key={i} onClick={()=>{setSelected(i);setPrompt(p.p);setGenerated("");}}
            style={{background:selected===i?IND:IND+"0d",border:`2px solid ${selected===i?IND:IND+"22"}`,
              borderRadius:8,padding:"5px 12px",cursor:"pointer",fontWeight:700,
              fontSize:px(11),color:selected===i?"#fff":IND}}>
            {i+1}. {p.p.slice(0,18)}...
          </button>
        ))}
      </div>
      <div style={{background:"#04020f",borderRadius:12,padding:"16px",marginBottom:14,
        fontFamily:"monospace",fontSize:px(14),lineHeight:1.8,minHeight:100}}>
        <span style={{color:AMB,fontWeight:700}}>{prompt}</span>
        {generated&&(
          <span style={{color:"#a78bfa"}}>{generated.slice(prompt.length)}</span>
        )}
        {generating&&<span style={{animation:"blink 0.7s infinite",color:IND}}>|</span>}
        {!generating&&!generated&&(
          <span style={{color:"#1e1040"}}> ←click generate</span>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <button onClick={generating?()=>{}:generate} disabled={generating}
            style={{width:"100%",background:IND,border:"none",borderRadius:10,padding:"12px",
              color:"#fff",fontWeight:800,fontSize:px(13),cursor:"pointer",
              opacity:generating?0.6:1,marginBottom:12}}>
            {generating?"Generating...":"✨ Generate"}
          </button>
          <CodeBox color={IND} lines={[
            "# Minimal GPT in PyTorch",
            "import torch, torch.nn as nn, math",
            "",
            "class SelfAttention(nn.Module):",
            "  def __init__(self,d,h):",
            "    super().__init__()",
            "    self.h=h; self.d=d",
            "    self.qkv=nn.Linear(d,3*d)",
            "    self.out=nn.Linear(d,d)",
            "  def forward(self,x):",
            "    B,T,C=x.shape",
            "    q,k,v=self.qkv(x).chunk(3,-1)",
            "    # Scaled dot-product attention",
            "    a=q@k.transpose(-2,-1)/math.sqrt(C//self.h)",
            "    # Causal mask (autoregressive)",
            "    mask=torch.tril(torch.ones(T,T))",
            "    a=a.masked_fill(mask==0,-1e9)",
            "    a=torch.softmax(a,-1)",
            "    return self.out(a@v)",
            "",
            "class TransformerBlock(nn.Module):",
            "  def __init__(self,d,h):",
            "    super().__init__()",
            "    self.attn=SelfAttention(d,h)",
            "    self.ff=nn.Sequential(",
            "      nn.Linear(d,4*d),nn.GELU(),",
            "      nn.Linear(4*d,d))",
            "    self.n1=nn.LayerNorm(d)",
            "    self.n2=nn.LayerNorm(d)",
            "  def forward(self,x):",
            "    # Pre-norm residual connections",
            "    x=x+self.attn(self.n1(x))",
            "    x=x+self.ff(self.n2(x))",
            "    return x",
          ]}/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {l:"Autoregressive generation",c:IND,
              d:"At each step, predict the next token given all previous. Append prediction to sequence. Repeat until EOS token or max_length. O(n²) time for n tokens."},
            {l:"Causal masking",c:AMB,
              d:"Future tokens are masked to -∞ before softmax → 0 attention weight. Ensures position t can only attend to positions ≤t. Essential for left-to-right generation."},
            {l:"Residual connections",c:GRN,
              d:"x = x + sublayer(x) around each attention and FFN block. Allows gradients to flow directly from output to input — enables training networks 100+ layers deep."},
            {l:"Layer normalisation",c:VIO,
              d:"Normalise activations across the feature dimension. Applied before attention and FFN (Pre-LN) in modern Transformers (GPT-2+). More stable training than Post-LN."},
            {l:"Temperature sampling",c:TEAL,
              d:"Divide logits by τ before softmax. τ=1: default distribution. τ<1: sharper, more deterministic. τ>1: flatter, more diverse/creative. Top-k and nucleus (top-p) sampling also used."},
          ].map(item=>(
            <div key={item.l} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(11),marginBottom:4}}>{item.l}</div>
              <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════ KEY INSIGHTS ═══════════════════════════════════════════ */
const TransformerTakeaways=({onBack})=>{
  const [done,setDone]=useState({});
  const toggle=i=>setDone(d=>({...d,[i]:!d[i]}));
  const items=[
    {e:"🎯",c:IND,t:"Self-attention: Attention(Q,K,V) = softmax(QKᵀ/√d_k)·V. Every token computes a query vector Q (what am I looking for?), key K (what do I contain?), and value V (what do I output?). Attention weights = how much each token's value contributes to the current token's output."},
    {e:"🔀",c:VIO,t:"Multi-head attention runs H attention operations in parallel, each with different learned projections (W_Q, W_K, W_V). Different heads capture different relationships: syntax, coreference, semantics, position. Outputs are concatenated and projected: Concat(h₁,...,h_H)·W_O."},
    {e:"📡",c:AMB,t:"Positional encoding: unlike RNNs, Transformers are permutation-invariant — no inherent position awareness. Sinusoidal PE: PE(pos,2i)=sin(pos/10000^(2i/d_model)). Or learned positional embeddings (GPT). Added to token embeddings before the first layer."},
    {e:"🏗️",c:GRN,t:"Transformer block: LayerNorm → MultiHeadAttention → residual + LayerNorm → FFN → residual. FFN = two linear layers with GELU: FFN(x)=GELU(xW₁+b₁)W₂+b₂. Residual connections (x+sublayer(x)) enable gradient flow in 100+ layer models."},
    {e:"⚡",c:CYN,t:"O(n²) attention: every token attends to every other — n² dot products. For n=512: 262K; for n=32K (Claude's context): 1 billion. Solutions: FlashAttention (faster exact), sparse attention (Longformer), linear attention approximations, sliding window (Mistral)."},
    {e:"🌍",c:TEAL,t:"Pre-training + fine-tuning: train on massive unlabelled text (next-token prediction or masked LM). Store world knowledge in FFN weights. Fine-tune on task-specific data. BERT: bidirectional MLM. GPT: causal LM. T5: text-to-text. CLIP: text+image."},
    {e:"🚀",c:PNK,t:"Scale laws (Hoffmann et al. 2022, Chinchilla): both model size N and training tokens D matter equally. Optimal: N ∝ D. For 70B params, train on ~1.4T tokens. GPT-4 estimated at 1.8T params, 13T tokens. Perplexity drops as power law of compute."},
    {e:"⚠️",c:ROSE,t:"Hallucination: LLMs confidently generate false facts because they learn correlations, not ground truth. RLHF (Reinforcement Learning from Human Feedback) and RAG (Retrieval-Augmented Generation) partially mitigate this. Always verify important LLM outputs with authoritative sources."},
  ];
  const cnt=Object.values(done).filter(Boolean).length;
  return (
    <div style={{...LSEC}}>
      {STag("Key Insights · Section 10",IND)}
      <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>What You Now <span style={{color:IND}}>Know</span></h2>
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
            <p style={{...LBODY,margin:0,fontSize:px(15),flex:1,color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
          </div>
        ))}
      </div>
      <div style={{...LCARD,textAlign:"center",padding:"36px",background:"linear-gradient(135deg,#f5f3ff,#eff6ff)"}}>
        <div style={{fontSize:px(52),marginBottom:8}}>{cnt===8?"🎓":cnt>=5?"💪":"📖"}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:px(24),color:V.ink,marginBottom:16}}>{cnt}/8 mastered</div>
        <div style={{background:V.cream,borderRadius:8,height:10,overflow:"hidden",maxWidth:400,margin:"0 auto 24px"}}>
          <div style={{height:"100%",width:`${(cnt/8)*100}%`,background:`linear-gradient(90deg,${IND},${VIO})`,transition:"width 0.5s",borderRadius:8}}/>
        </div>
        <p style={{...LBODY,maxWidth:px(500),margin:"0 auto 24px",fontSize:px(14)}}>
          You've completed the core of Level 4. You now understand the full arc from
          perceptrons to Transformers — the architecture powering GPT-4, Gemini, and Claude.
          Level 5 awaits: MLOps, training at scale, and real deployment.
        </p>
        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onBack} style={{background:`linear-gradient(135deg,${IND},${VIO})`,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>
            Next Lesson →
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
const TransformersPage=({onBack})=>(
  <NavPage onBack={onBack} crumb="Transformers" lessonNum="Lesson 6 of 7"
    accent={IND} levelLabel="Deep Learning"
    dotLabels={["Hero","RNN Limits","Attention Concept","Self-Attention","Architecture","Multi-Head","Positional Enc","Python","Applications","Game","Project","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#04020f 0%,#15104a 60%,#080420 100%)",
          minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",
            display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🔮 Lesson 6 of 7 · Deep Learning",IND)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                Trans-<br/><span style={{color:"#a5b4fc"}}>formers</span>
              </h1>
              <div style={{width:px(56),height:px(4),background:IND,borderRadius:px(2),marginBottom:px(22)}}/>
              <p style={{fontFamily:"'Lora',serif",fontSize:px(17),color:"#cbd5e1",lineHeight:1.8,marginBottom:px(20)}}>
                The architecture that enabled GPT-4, Gemini, and Claude.
                "Attention Is All You Need" (Vaswani et al., 2017) replaced recurrent processing
                with pure attention: every token can directly attend to every other token,
                in parallel, regardless of distance. This single change unlocked the entire
                modern era of large language models.
              </p>
              <div style={{background:"rgba(79,70,229,0.12)",border:"1px solid rgba(79,70,229,0.35)",borderRadius:14,padding:"14px 20px"}}>
                <div style={{color:"#a5b4fc",fontWeight:700,fontSize:px(12),marginBottom:6,letterSpacing:"1px"}}>💡 CORE IDEA</div>
                <p style={{fontFamily:"'Lora',serif",color:"#cbd5e1",margin:0,fontSize:px(14),lineHeight:1.7}}>
                  Every token computes a query Q, key K, and value V. Attention weights =
                  softmax(QKᵀ/√d). The output is the value-weighted sum. Run this in parallel
                  across all tokens simultaneously — no recurrence needed.
                </p>
              </div>
            </div>
            <div style={{height:px(400),background:"rgba(79,70,229,0.06)",border:"1px solid rgba(79,70,229,0.2)",borderRadius:24,overflow:"hidden"}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1 RNN LIMITATIONS */}
        <div ref={R(1)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 1 · Why RNNs Weren't Enough",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The <span style={{color:IND}}>Sequential Bottleneck</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  By 2016, LSTMs were the gold standard for NLP. But they had a fundamental
                  limitation: they processed tokens one at a time, left to right.
                  This sequential dependency made training slow and limited how well they
                  could model long-range relationships.
                </p>
                {[
                  {icon:"⏳",c:ROSE,t:"Sequential processing",d:"To compute h_t, you need h_{t-1}. No parallelisation possible — the entire sequence is a chain. Training a 100-step sequence = 100 serial matrix multiplications."},
                  {icon:"📏",c:ORG,t:"Long-range dependency limit",d:"In 'The trophy that the committee awarded to the athlete who won the gold medal was too large for her to carry home' — LSTM must maintain 'trophy' across 15+ tokens. Cell state capacity is finite."},
                  {icon:"🐢",c:AMB,t:"Training speed ceiling",d:"Modern GPUs have thousands of cores — ideal for parallelism. RNNs can't utilise this fully. Training GPT-3 on LSTMs instead of Transformers would have taken ~5× longer."},
                  {icon:"💾",c:VIO,t:"Information bottleneck",d:"Seq2seq LSTMs compress the entire source sentence into one hidden vector h_n. For long sentences, this vector can't store everything — early information gets overwritten."},
                ].map(item=>(
                  <div key={item.t} style={{...LCARD,display:"flex",gap:12,marginBottom:10,borderLeft:`4px solid ${item.c}`,padding:"12px 16px"}}>
                    <span style={{fontSize:px(24)}}>{item.icon}</span>
                    <div><div style={{fontWeight:700,color:item.c,fontSize:px(13),marginBottom:2}}>{item.t}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0}}>{item.d}</p></div>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={IND} title="The Attention breakthrough (2015)"
                  body="Bahdanau et al. (2015) added attention to seq2seq LSTMs: instead of compressing source to one vector, let the decoder directly attend to all encoder hidden states at each decoding step. Dramatically improved translation quality. This was the seed of the idea — but the LSTM was still sequential."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:IND,marginBottom:10,fontSize:px(13)}}>RNN vs Transformer comparison:</div>
                  {[
                    ["Metric","LSTM","Transformer"],
                    ["Parallelism","❌ Sequential","✅ Full parallel"],
                    ["Max token distance","O(n) hops","O(1) direct"],
                    ["Training on modern GPUs","20% utilisation","80%+ utilisation"],
                    ["Long-range recall","⚠️ Degrades","✅ Constant cost"],
                    ["Training data scaling","Saturates","Continues improving"],
                    ["2024 SOTA NLP","❌ Superseded","✅ Dominant"],
                  ].map((row,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr",gap:6,
                      marginBottom:5,padding:"5px 0",borderBottom:`1px solid ${V.border}`,
                      background:i===0?"#f5f3ff":"transparent"}}>
                      {row.map((cell,j)=>(
                        <span key={j} style={{fontSize:px(11),fontWeight:i===0||j===0?700:400,
                          color:j===2&&i>0?IND:V.muted}}>{cell}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S2 SELF-ATTENTION */}
        <div ref={R(2)} style={{background:"#04020f"}}>
          <div style={{...LSEC}}>
            {STag("Section 2 · Self-Attention Mechanism","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>
              Every Token Talks to <span style={{color:"#a5b4fc"}}>Every Other Token</span>
            </h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <Formula color="#a5b4fc">Attention(Q,K,V) = softmax(QKᵀ / √d_k) · V</Formula>
                <p style={{...LBODY,color:"#94a3b8",fontSize:px(15),marginBottom:16}}>
                  For a sequence of n tokens, each token produces three vectors via learned projections
                  (multiply the embedding by three weight matrices W_Q, W_K, W_V):
                </p>
                {[
                  {vec:"Q (Query)",c:ROSE,d:"What information am I looking for? — 'I am the word bank, what context resolves my meaning: financial or geographical?'"},
                  {vec:"K (Key)",c:GRN,d:"What information do I contain? — 'I am river, I contain geographic/water context.' Keys and Queries are compared via dot product."},
                  {vec:"V (Value)",c:AMB,d:"What information do I output when attended to? — 'If you attend to me strongly, I'll contribute my semantic content to your new representation.'"},
                ].map(item=>(
                  <div key={item.vec} style={{background:item.c+"0d",border:`1px solid ${item.c}33`,borderRadius:12,padding:"12px 16px",marginBottom:10}}>
                    <div style={{fontFamily:"monospace",fontWeight:700,color:item.c,fontSize:px(14),marginBottom:4}}>{item.vec}</div>
                    <p style={{...LBODY,fontSize:px(13),margin:0,color:"#94a3b8"}}>{item.d}</p>
                  </div>
                ))}
                <IBox color="#a5b4fc" title="Intuition: soft information retrieval"
                  body="Think of attention as a fuzzy database lookup. Keys = database entries. Query = your search query. Values = the actual data. The dot product Q·K measures how well your query matches each key. Softmax normalises to weights. The result is a weighted sum of values — a soft retrieval of the most relevant information."/>
              </div>
              <div>
                <SelfAttentionExplorer/>
              </div>
            </div>
          </div>
        </div>

        {/* S3 ARCHITECTURE */}
        <div ref={R(3)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 3 · Transformer Architecture",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>The Full <span style={{color:IND}}>Stack</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                {[
                  {l:"Token Embedding",icon:"📖",c:AMB,d:"Each token (word or subword) is looked up in an embedding table: integer ID → d_model-dimensional vector. GPT-4 uses d_model≈12,288. The embedding is shared with the output projection (weight tying)."},
                  {l:"Positional Encoding",icon:"📍",c:VIO,d:"Added to embeddings before input to layer 1. Original Transformer: sin/cos frequencies. GPT-2+: learned positional embedding. RoPE (LLaMA): rotary position encoding, better for long contexts."},
                  {l:"Layer Norm",icon:"📊",c:CYN,d:"Normalise activations to zero mean and unit variance. Applied before attention and FFN (Pre-LN in GPT-2 and later) for more stable training. Has learnable scale γ and shift β."},
                  {l:"Multi-Head Self-Attention",icon:"🎯",c:IND,d:"The core operation. H parallel attention heads, each projecting to d_k=d_model/H dimensions. Captures multiple relationship types simultaneously. Outputs concatenated and projected: Concat(h₁,...,h_H)·W_O."},
                  {l:"Feed-Forward Network",icon:"⚡",c:GRN,d:"Applied to each token independently: FFN(x)=GELU(xW₁+b₁)W₂+b₂. W₁: d_model→4×d_model; W₂: 4×d_model→d_model. Stores factual knowledge, acts as associative memory. Largest parameter block."},
                  {l:"Residual Connections",icon:"➕",c:ROSE,d:"x = x + sublayer(x) around every attention and FFN block. Allows gradients to bypass layers entirely → trains networks 100+ layers deep without gradient vanishing. Used in every modern transformer."},
                ].map(item=>(
                  <div key={item.l} style={{display:"flex",gap:12,marginBottom:12,alignItems:"flex-start"}}>
                    <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
                      background:item.c+"15",border:`2px solid ${item.c}33`,
                      display:"flex",alignItems:"center",justifyContent:"center",fontSize:px(18)}}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{fontWeight:700,color:item.c,fontSize:px(13),marginBottom:3}}>{item.l}</div>
                      <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{...LCARD,background:"#f5f3ff",border:`2px solid ${IND}22`}}>
                  <div style={{fontWeight:700,color:IND,marginBottom:12,fontSize:px(13)}}>
                    🏗️ GPT-4 Scale Estimates
                  </div>
                  {[
                    {param:"Architecture",val:"Transformer decoder"},
                    {param:"Est. parameters",val:"~1.8 trillion"},
                    {param:"d_model",val:"~12,288"},
                    {param:"Attention heads H",val:"~96"},
                    {param:"Layers",val:"~96"},
                    {param:"Context window",val:"128K tokens"},
                    {param:"Training tokens",val:"~13 trillion"},
                    {param:"Training compute",val:"~10²⁵ FLOPs"},
                    {param:"Training hardware",val:"~25K A100 GPUs"},
                    {param:"Vocab size",val:"100,277 tokens"},
                  ].map(row=>(
                    <div key={row.param} style={{display:"flex",justifyContent:"space-between",
                      marginBottom:6,padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(12),color:V.muted}}>{row.param}</span>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:IND,fontSize:px(12)}}>{row.val}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:"#04020f",borderRadius:12,padding:"14px",marginTop:14,fontFamily:"monospace",fontSize:px(11),lineHeight:2}}>
                  <div style={{color:"#475569"}}># One Transformer block:</div>
                  <div style={{color:IND}}>def block(x):</div>
                  <div style={{color:"#94a3b8"}}>  # 1. Multi-head self-attention + residual</div>
                  <div style={{color:CYN}}>  x = x + MHA(LayerNorm(x))</div>
                  <div style={{color:"#94a3b8"}}>  # 2. Feed-forward network + residual</div>
                  <div style={{color:GRN}}>  x = x + FFN(LayerNorm(x))</div>
                  <div style={{color:"#94a3b8"}}>  return x  # same shape as input</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S4 MULTI-HEAD */}
        <div ref={R(4)} style={{background:"#04020f"}}>
          <div style={{...LSEC}}>
            {STag("Section 4 · Multi-Head Attention","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Eight Ways to <span style={{color:"#a5b4fc"}}>See the Sequence</span></h2>
            <p style={{...LBODY,color:"#94a3b8",maxWidth:px(700),marginBottom:px(24)}}>
              Single-head attention captures one type of relationship per layer.
              Multi-head attention runs H heads in parallel — each specialising in a
              different linguistic or semantic relationship. Click each head to see its specialisation.
            </p>
            <MultiHeadViz/>
          </div>
        </div>

        {/* S5 POSITIONAL ENCODING */}
        <div ref={R(5)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 5 · Positional Encoding",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(20)}}>Teaching Transformers <span style={{color:IND}}>Position</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,fontSize:px(15),marginBottom:16}}>
                  Self-attention computes pairwise token interactions via dot products —
                  a permutation-invariant operation. "cat bites dog" and "dog bites cat"
                  would produce identical attention patterns without positional information.
                </p>
                <Formula color={IND}>PE(pos, 2i)   = sin(pos / 10000^(2i/d))</Formula>
                <Formula color={VIO}>PE(pos, 2i+1) = cos(pos / 10000^(2i/d))</Formula>
                <p style={{...LBODY,fontSize:px(14),marginBottom:16}}>
                  The original Transformer uses sinusoidal functions at different frequencies.
                  Each dimension i encodes position at a different wavelength — from 2π (fine-grained)
                  to 20000π (coarse). This produces a unique fingerprint for each position that
                  also allows the model to generalise to sequences longer than those seen in training.
                </p>
                {[
                  {t:"Sinusoidal PE",c:IND,d:"Fixed, not learned. Can generalise to longer sequences. Used in original 'Attention Is All You Need'."},
                  {t:"Learned PE",c:VIO,d:"Each position has a trainable embedding. Used in BERT, GPT-1/2. Can't extrapolate beyond training length."},
                  {t:"Relative PE (T5, ALiBi)",c:TEAL,d:"Encodes relative distance rather than absolute position. Better for long contexts and generalisation."},
                  {t:"RoPE (LLaMA, GPT-NeoX)",c:AMB,d:"Rotary Position Embedding: rotates Q and K vectors proportional to position. Strong extrapolation, used in most modern open models."},
                ].map(item=>(
                  <div key={item.t} style={{borderLeft:`3px solid ${item.c}`,paddingLeft:12,marginBottom:10}}>
                    <div style={{fontWeight:700,color:item.c,fontSize:px(12)}}>{item.t}</div>
                    <p style={{...LBODY,fontSize:px(12),margin:0}}>{item.d}</p>
                  </div>
                ))}
              </div>
              <div>
                <IBox color={IND} title="Why sinusoids encode relative position"
                  body="PE(pos+k) can be expressed as a linear function of PE(pos) for any offset k — this means the model can learn to attend to 'the token 3 positions ago' by learning to recognise the linear relationship between position encodings. Relative position is baked into the representation algebraically, without needing to see every absolute position during training."/>
                <div style={{...LCARD,marginTop:14}}>
                  <div style={{fontWeight:700,color:IND,marginBottom:10,fontSize:px(13)}}>
                    Context window evolution
                  </div>
                  {[
                    {m:"GPT-1 (2018)",n:"512 tokens",c:V.muted},
                    {m:"BERT (2019)",n:"512 tokens",c:V.muted},
                    {m:"GPT-2 (2019)",n:"1,024 tokens",c:VIO},
                    {m:"GPT-3 (2020)",n:"2,048 tokens",c:IND},
                    {m:"Claude 1 (2023)",n:"9K tokens",c:AMB},
                    {m:"GPT-4 (2023)",n:"128K tokens",c:GRN},
                    {m:"Claude 3.5 (2024)",n:"200K tokens",c:TEAL},
                    {m:"Gemini 1.5 (2024)",n:"1M tokens",c:PNK},
                  ].map(row=>(
                    <div key={row.m} style={{display:"flex",justifyContent:"space-between",marginBottom:5,
                      padding:"4px 0",borderBottom:`1px solid ${V.border}`}}>
                      <span style={{fontSize:px(12),color:V.muted}}>{row.m}</span>
                      <span style={{fontFamily:"monospace",fontWeight:700,color:row.c,fontSize:px(12)}}>{row.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* S6 PYTHON */}
        <div ref={R(6)} style={{background:"#04020f"}}>
          <div style={{...LSEC}}>
            {STag("Section 6 · Python with PyTorch","#a5b4fc")}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(16)}}>Transformers <span style={{color:"#a5b4fc"}}>in Code</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(24)}}>
              <CodeBox color={IND} lines={[
                "import torch, torch.nn as nn",
                "from transformers import (",
                "  AutoModel, AutoTokenizer,",
                "  pipeline",
                ")","",
                "# ── PyTorch built-in Transformer ─────",
                "model = nn.Transformer(",
                "  d_model=512,",
                "  nhead=8,             # attention heads",
                "  num_encoder_layers=6,",
                "  num_decoder_layers=6,",
                "  dim_feedforward=2048,",
                "  dropout=0.1",
                ")","",
                "# ── Just the encoder (BERT-style) ────",
                "encoder_layer = nn.TransformerEncoderLayer(",
                "  d_model=512, nhead=8, batch_first=True",
                ")",
                "encoder = nn.TransformerEncoder(",
                "  encoder_layer, num_layers=6",
                ")","",
                "# ── Hugging Face BERT ─────────────────",
                "tokenizer = AutoTokenizer.from_pretrained(",
                "  'bert-base-uncased')",
                "model = AutoModel.from_pretrained(",
                "  'bert-base-uncased')",
                "",
                "text = 'The bank by the river'",
                "inputs = tokenizer(text, return_tensors='pt')",
                "outputs = model(**inputs)",
                "# outputs.last_hidden_state: (1, 6, 768)",
                "# — contextual embeddings for each token","",
                "# ── Zero-shot sentiment pipeline ──────",
                "classifier = pipeline(",
                "  'sentiment-analysis',",
                "  model='distilbert-base-uncased-finetuned-sst-2-english'",
                ")",
                "result = classifier('I love transformers!')",
                "# [{'label': 'POSITIVE', 'score': 0.9998}]","",
                "# ── GPT-2 text generation ─────────────",
                "generator = pipeline('text-generation',",
                "  model='gpt2')",
                "out = generator('The key to AGI is',",
                "  max_length=50, num_return_sequences=1)",
              ]}/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[
                  {l:"nn.Transformer",c:IND,d:"Full encoder-decoder. Used for seq2seq tasks: translation, summarisation. Encoder processes source sequence; decoder autoregressively generates target."},
                  {l:"nn.MultiheadAttention",c:VIO,d:"The core operation. forward(query, key, value, attn_mask=...). Returns (output, attn_weights). Use attn_mask for causal (autoregressive) masking."},
                  {l:"AutoTokenizer",c:AMB,d:"Hugging Face tokenizer: converts raw text to token IDs. BERT uses WordPiece (30,522 vocab); GPT uses BPE (50,257). add_special_tokens=[CLS], [SEP] for BERT."},
                  {l:"AutoModel.from_pretrained()",c:GRN,d:"Loads pretrained transformer weights. Over 200,000 models on Hugging Face Hub. Fine-tune with 100-1000 examples for most downstream tasks."},
                  {l:"pipeline()",c:TEAL,d:"High-level inference API. Tasks: 'sentiment-analysis', 'text-generation', 'question-answering', 'summarization', 'translation', 'fill-mask', 'ner'. Best for quick prototyping."},
                  {l:"FlashAttention",c:PNK,d:"Memory-efficient exact attention (Dao et al. 2022). Fuses Q, K, V operations to avoid materialising full n×n attention matrix. 2-4× faster, O(n) memory. Essential for training large models."},
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
            {STag("Section 7 · Real-World Applications",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(28)}}>Transformers <span style={{color:IND}}>Reshape Everything</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:px(16)}}>
              {[
                {e:"🤖",c:IND,t:"Large Language Models",b:"GPT-4, Gemini, Claude, LLaMA — transformer decoders trained on trillions of text tokens. Emergent capabilities: reasoning, coding, translation, summarisation, question answering. Scaling laws predict continued improvement with more compute.",arch:"GPT, PaLM, LLaMA, Mistral"},
                {e:"🎨",c:PNK,t:"Image Generation",b:"Stable Diffusion uses a Transformer (U-Net + attention) in its diffusion process. DALL·E 3 conditions on CLIP text encodings. ViT (Vision Transformer) applies Transformers to image patches — achieves better ImageNet accuracy than CNNs at scale.",arch:"DALL·E, Stable Diffusion, ViT"},
                {e:"🧬",c:GRN,t:"Protein Structure",b:"AlphaFold 2 uses Evoformer — a stack of Transformer-like pair representation blocks — to predict protein 3D structure from sequence. 200M+ protein structures predicted and deposited in public database. Drug discovery revolution.",arch:"Evoformer, ESM-2"},
                {e:"🎵",c:AMB,t:"Multimodal AI",b:"GPT-4V, Gemini, and Claude can see images because a vision encoder (ViT or CLIP) maps images to the same embedding space as text. The language model then attends to both text and image tokens identically.",arch:"CLIP, Flamingo, LLaVA"},
              ].map(a=>(
                <div key={a.t} style={{background:a.c+"0d",border:`1px solid ${a.c}33`,borderRadius:16,padding:"20px 22px"}}>
                  <div style={{fontSize:px(36),marginBottom:8}}>{a.e}</div>
                  <div style={{fontWeight:800,color:a.c,fontSize:px(15),marginBottom:8}}>{a.t}</div>
                  <p style={{...LBODY,fontSize:px(13),marginBottom:10,color:V.muted}}>{a.b}</p>
                  <div style={{fontFamily:"monospace",background:V.cream,borderRadius:8,padding:"5px 10px",fontSize:px(11),color:a.c}}>{a.arch}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S8 GAME */}
        <div ref={R(8)} style={{background:V.cream}}>
          <div style={{...LSEC}}>
            {STag("Section 8 · Interactive Game",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>🎮 Attention Explorer</h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              Five deep questions on self-attention, complexity, coreference resolution,
              and Transformer architecture. These are real interview questions at top AI labs.
            </p>
            <AttentionExplorerGame/>
          </div>
        </div>

        {/* S9 PROJECT */}
        <div ref={R(9)} style={{background:V.paper}}>
          <div style={{...LSEC}}>
            {STag("Section 9 · Mini Project",IND)}
            <h2 style={{...LH2,color:V.ink,marginBottom:px(16)}}>✍️ Transformer <span style={{color:IND}}>Text Generator</span></h2>
            <p style={{...LBODY,maxWidth:px(680),marginBottom:px(28)}}>
              GPT-style autoregressive generation: each token is predicted from all previous tokens.
              Watch the model generate token-by-token. Below is a minimal GPT implementation in PyTorch.
            </p>
            <TextGeneratorProject/>
          </div>
        </div>

        {/* S10 INSIGHTS */}
        <div ref={R(10)} style={{background:V.cream}}>
          <TransformerTakeaways onBack={onBack}/>
        </div>
      </>
    )}
  </NavPage>
);
export default TransformersPage;
