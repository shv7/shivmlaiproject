import { useEffect, useRef, useState } from "react";
import { IBox, LBODY, LCARD, LH2, LSEC, NavPage, px, STag, V } from "../../shared/lessonStyles";

/* ══════════════════════════════════════════════════════════════════
   LESSON — AI SAFETY & ETHICS
   Level 7 · AGI & Future of AI · Lesson 4 of 5
   Accent: Cyan #0891b2
══════════════════════════════════════════════════════════════════ */
const CYN  = "#0891b2";
const SKY  = "#0284c7";
const TEAL = "#0d9488";
const GRN  = "#059669";
const EMR  = "#10b981";
const AMB  = "#f59e0b";
const ORG  = "#f97316";
const RED  = "#ef4444";
const VIO  = "#7c3aed";
const IND  = "#4f46e5";
const RSE  = "#e11d48";

const Formula = ({children,color=CYN}) => (
  <div style={{background:color+"0d",border:`1px solid ${color}44`,borderRadius:14,padding:"16px 22px",fontFamily:"monospace",fontSize:px(14),color,fontWeight:700,textAlign:"center",margin:`${px(14)} 0`}}>{children}</div>
);

/* ══════ HERO CANVAS ══════════════════════════════════════════════ */
const HeroCanvas = () => {
  const ref = useRef();
  useEffect(()=>{
    const c=ref.current; if(!c) return;
    const ctx=c.getContext("2d");
    let W,H,raf,t=0;
    const resize=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    resize(); window.addEventListener("resize",resize);

    const PILLARS=[
      {label:"Fairness",    angle:0,          color:GRN},
      {label:"Transparency",angle:Math.PI/3,  color:CYN},
      {label:"Safety",      angle:2*Math.PI/3,color:AMB},
      {label:"Privacy",     angle:Math.PI,    color:VIO},
      {label:"Accountability",angle:4*Math.PI/3,color:ORG},
      {label:"Oversight",   angle:5*Math.PI/3,color:RED},
    ];

    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle="#00121a"; ctx.fillRect(0,0,W,H);
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle="rgba(8,145,178,0.04)";ctx.lineWidth=1;ctx.stroke();}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

      const cx=W/2,cy=H/2,R=Math.min(W,H)*0.35;

      // Hexagon grid rings
      [0.33,0.66,1].forEach(r=>{
        ctx.beginPath();
        PILLARS.forEach((p,i)=>{const x=cx+Math.cos(p.angle)*R*r,y=cy+Math.sin(p.angle)*R*r;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
        ctx.closePath(); ctx.strokeStyle=CYN+"22"; ctx.lineWidth=0.8; ctx.stroke();
      });

      // Spokes
      PILLARS.forEach(p=>{
        ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(p.angle)*R,cy+Math.sin(p.angle)*R);
        ctx.strokeStyle=p.color+"33";ctx.lineWidth=1;ctx.stroke();
      });

      // Pulsing filled area
      const pulse=(Math.sin(t*0.8)+1)/2*0.15+0.7;
      ctx.beginPath();
      PILLARS.forEach((p,i)=>{
        const r=R*pulse,x=cx+Math.cos(p.angle)*r,y=cy+Math.sin(p.angle)*r;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.closePath();
      const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
      g.addColorStop(0,CYN+"44"); g.addColorStop(1,CYN+"00");
      ctx.fillStyle=g; ctx.fill();
      ctx.strokeStyle=CYN+"66"; ctx.lineWidth=2; ctx.stroke();

      // Node circles at each pillar
      PILLARS.forEach((p,i)=>{
        const nx=cx+Math.cos(p.angle)*R,ny=cy+Math.sin(p.angle)*R;
        const pulse2=(Math.sin(t*1.5+i)+1)/2;
        const ng=ctx.createRadialGradient(nx,ny,0,nx,ny,12+pulse2*6);
        ng.addColorStop(0,p.color+"cc"); ng.addColorStop(1,p.color+"00");
        ctx.beginPath();ctx.arc(nx,ny,12+pulse2*6,0,Math.PI*2);ctx.fillStyle=ng;ctx.fill();
        ctx.font=`bold ${px(8)} sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillStyle=p.color+"dd";ctx.fillText(p.label,nx,ny+22);
      });

      // Central "Responsible AI" node
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,28);
      cg.addColorStop(0,CYN+"88");cg.addColorStop(1,CYN+"11");
      ctx.beginPath();ctx.arc(cx,cy,22,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
      ctx.strokeStyle=CYN+"66";ctx.lineWidth=2;ctx.stroke();
      ctx.font=`bold ${px(7)} sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillStyle="#fff";ctx.fillText("Responsible",cx,cy-4);ctx.fillText("AI",cx,cy+7);

      t+=0.02; raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} style={{width:"100%",height:"100%",display:"block"}}/>;
};

/* ══════ ETHICS PRINCIPLES EXPLORER ══════════════════════════════ */
const EthicsPrinciplesExplorer = () => {
  const [active, setActive] = useState(0);
  const PRINCIPLES = [
    {name:"Fairness",      icon:"⚖️", color:GRN,
      def:"AI systems should not produce unjust, discriminatory, or prejudiced outcomes. Benefits and burdens should be distributed equitably across groups defined by race, gender, age, disability, or other protected characteristics.",
      tension:"Different definitions of fairness are mathematically incompatible. Calibration (equal accuracy across groups), demographic parity (equal positive rates), and equalised odds (equal error rates) cannot all be satisfied simultaneously when base rates differ across groups (Chouldechova 2017).",
      example:"COMPAS recidivism algorithm: calibrated across racial groups but had unequal false positive rates (Black defendants predicted high-risk but did not reoffend at higher rates than predicted). Northpointe argued it was fair; ProPublica argued it wasn't. Both were right by different definitions.",
      practice:"Requires: demographic analysis of training data and outputs, fairness audits, diverse development teams, stakeholder consultation, regular bias testing in deployment.",
      hard_case:"College admissions AI: does fairness mean equal rates of acceptance per applicant (demographic parity) or equal accuracy of prediction of academic success (equalised odds)? These produce different outcomes."},
    {name:"Transparency",  icon:"🔍", color:CYN,
      def:"AI systems should be explainable: users should be able to understand how decisions affecting them were made. Organisations should be open about AI's role in decision-making processes.",
      tension:"Transparency and capability often trade off. The most capable models (deep neural networks) are the least interpretable. A simpler, more transparent model may produce worse predictions. Regulatory requirements for explanation may perversely incentivise worse outcomes.",
      example:"GDPR 'right to explanation': EU citizens have the right to an explanation for automated decisions affecting them. But GPT-4's decision process is not interpretable even to its creators. Current 'explanations' are often post-hoc rationalisations, not actual reasoning traces.",
      practice:"Tiered transparency: explain what the system does (purpose transparency) even when how it works cannot be fully explained. Regulation-compatible explanations. Model cards, system cards, and AI Impact Assessments.",
      hard_case:"Medical AI diagnosing cancer: a 97% accurate deep learning model may give uninterpretable decisions. A 91% accurate logistic regression gives a clear explanation. Do patients have a right to the less accurate but explainable model?"},
    {name:"Accountability", icon:"🏛️", color:AMB,
      def:"Clear lines of responsibility for AI decisions and harms. When an AI system causes harm, there should be a human or organisation who is answerable and who can provide remedy.",
      tension:"The distributed nature of AI development creates accountability gaps. Who is responsible when an AI causes harm: the data labellers, the model trainers, the deployer, the regulator, or the user? Current legal frameworks were not designed for autonomous AI.",
      example:"Tesla Autopilot fatality: when a driver died using Autopilot, Tesla argued the driver was responsible; the driver's family sued Tesla. No clear legal framework determined responsibility. Regulatory investigations took years and produced no definitive accountability.",
      practice:"Accountability chains: every deployed AI system needs a responsible human/organisation at each stage. Liability insurance for AI harms. Incident reporting and investigation requirements analogous to aviation safety.",
      hard_case:"An AI used to allocate welfare benefits denies a claim incorrectly. The government says the vendor is responsible; the vendor says they implemented the government's specification. The person denied benefits has no clear recourse."},
    {name:"Privacy",       icon:"🔒", color:VIO,
      def:"AI systems should not use personal data beyond its intended purpose, should minimise data collection, and should protect individuals from surveillance, profiling, and data misuse.",
      tension:"AI capability and privacy often conflict: better AI requires more data, personalisation requires profiling, and safety systems may require surveillance. Differential privacy, federated learning, and other technical approaches provide partial solutions.",
      example:"Clearview AI scraped 20B+ photos from the internet to build a facial recognition database. Used by 3,000+ law enforcement agencies without individuals' consent. Raises profound questions about the privacy of public faces and the legitimacy of surveillance.",
      practice:"Privacy-by-design: minimise data collection, anonymise where possible, use differential privacy for statistical queries, audit data usage, comply with GDPR/CCPA, get meaningful consent for sensitive uses.",
      hard_case:"Medical AI trained on patient records could save lives by predicting disease earlier. Patients have a right to privacy; society benefits from the predictions. How do we balance individual privacy against collective health benefits?"},
    {name:"Human Oversight",icon:"👁️",color:ORG,
      def:"Humans should remain meaningfully in control of consequential AI decisions. AI should assist human judgment, not replace it in high-stakes domains where error has severe consequences.",
      tension:"Human oversight is a bottleneck: it slows down AI systems, introduces human error and bias, and creates inconsistency. Automated systems are often more consistent and cheaper. The 'human in the loop' may provide only an illusion of oversight without meaningful review.",
      example:"Autonomous weapons: AI targeting systems can identify and engage targets faster than humans can review and approve. The US 'meaningful human control' policy is ambiguous about what 'meaningful' means — a human with 2 seconds to approve a targeting decision may not provide genuine oversight.",
      practice:"Tiered oversight: routine low-stakes decisions can be automated; high-stakes or novel decisions require human review. Genuine rather than nominal oversight — humans must have sufficient information, time, and authority to actually influence decisions.",
      hard_case:"AI medical diagnosis at scale: requiring doctor review of every AI diagnosis creates bottleneck that prevents deployment in understaffed hospitals. Removing oversight allows faster care but risks undetected errors. The right threshold is genuinely unclear."},
    {name:"Beneficence",   icon:"🌱", color:TEAL,
      def:"AI systems should actively promote human wellbeing — not merely avoid harm, but create positive value. This includes access, inclusion, and ensuring that benefits of AI are broadly distributed rather than concentrated.",
      tension:"Commercial AI development is driven by profit, not beneficence. The organisations best positioned to develop beneficial AI are the ones with the most to gain from potentially harmful applications. Incentive structures may systematically underinvest in beneficial but unprofitable applications.",
      example:"Medical AI in resource-limited settings: AI tools for diagnosing tuberculosis, malaria, and skin cancer could save millions of lives in low-income countries. But they require investment with no commercial return. Most AI medical development targets wealthy markets.",
      practice:"Open-access AI for public benefit. AI for SDGs (Sustainable Development Goals). Compute donations to non-profit AI safety and beneficial AI research. Inclusive design: test AI systems on diverse populations before deployment.",
      hard_case:"Gene-editing AI: a system that can design targeted gene therapies could cure hereditary diseases. Deployed commercially, only wealthy patients benefit. Deployed openly, it might be misused for enhancement or biological weapons. No clearly right answer."},
  ];
  const a = PRINCIPLES[active];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🏛️ Six Pillars of AI Ethics — Deep Exploration
      </div>
      <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
        {PRINCIPLES.map((p,i)=>(
          <button key={i} onClick={()=>setActive(i)} style={{
            flex:1,background:active===i?p.color:p.color+"0d",
            border:`2px solid ${active===i?p.color:p.color+"33"}`,
            borderRadius:10,padding:"7px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:active===i?"#fff":p.color,textAlign:"center"
          }}>{p.icon}<br/>{p.name}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{background:a.color+"0d",border:`2px solid ${a.color}33`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <div style={{fontWeight:800,color:a.color,fontSize:px(14),marginBottom:6}}>{a.icon} {a.name}</div>
            <p style={{...LBODY,fontSize:px(13),margin:0}}>{a.def}</p>
          </div>
          <div style={{background:AMB+"0d",border:`1px solid ${AMB}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(10),marginBottom:3}}>⚖️ Core tension:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{a.tension}</p>
          </div>
          <div style={{background:RED+"0d",border:`1px solid ${RED}22`,borderRadius:10,padding:"10px"}}>
            <div style={{fontWeight:700,color:RED,fontSize:px(10),marginBottom:3}}>🤔 Hard case:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{a.hard_case}</p>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:a.color,fontSize:px(12),marginBottom:6}}>Real-world example:</div>
          <div style={{background:a.color+"0d",border:`1px solid ${a.color}22`,borderRadius:10,padding:"10px",marginBottom:10}}>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{a.example}</p>
          </div>
          <div style={{fontWeight:700,color:GRN,fontSize:px(12),marginBottom:6}}>In practice:</div>
          <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px"}}>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{a.practice}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ BIAS IN AI CASE STUDIES ═════════════════════════════════ */
const BiasInAI = () => {
  const [tab, setTab] = useState(0);
  const CASES = [
    {name:"COMPAS Algorithm",    icon:"⚖️", color:RED, domain:"Criminal Justice",
      what:"COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) is a commercial risk assessment tool used in US courts to predict recidivism (reoffending) likelihood. Used by judges in bail and sentencing decisions.",
      bias:"ProPublica analysis (2016): Black defendants were nearly twice as likely as white defendants to be falsely classified as high-risk. White defendants falsely classified as low-risk at higher rates. The company Northpointe argued the tool was calibrated (equal accuracy across groups) — technically true but concealing the unequal error distribution.",
      source:"Training data: historical incarceration and recidivism data reflecting decades of racially biased policing and prosecution.",
      impact:"Used in hundreds of thousands of bail and sentencing decisions. People denied bail or given longer sentences based partly on algorithmic prediction. The bias amplifies existing systemic racial inequity.",
      lesson:"Bias in data leads to bias in predictions. Statistical measures of 'fairness' can satisfy one definition while violating another. Who decides which definition of fairness to use in criminal justice has profound ethical implications."},
    {name:"Facial Recognition",  icon:"👤", color:AMB, domain:"Law Enforcement + Commerce",
      what:"Facial recognition systems identify individuals from photos or video. Deployed by police departments for suspect identification, at airports for border control, by retailers for shoplifting prevention, and on phones for authentication.",
      bias:"MIT Media Lab audit (Buolamwini & Gebru 2018): commercial facial recognition systems from IBM, Microsoft, and Face++ had error rates of 0.8% for lighter-skinned men vs 34.7% for darker-skinned women. Gender classification failed 44× more often for dark-skinned women than light-skinned men.",
      source:"Training data dominated by lighter-skinned faces (common in internet photo datasets). Evaluation primarily on similar data, hiding performance gaps.",
      impact:"Robert Williams (Detroit, 2020): wrongfully arrested based on facial recognition match that was incorrect. Black men consistently falsely identified. Police departments using these systems in investigative processes have caused documented harm.",
      lesson:"Benchmark performance does not equal real-world equity. Systems should be evaluated on diverse populations before deployment in high-stakes settings. Data diversity must be actively engineered, not assumed."},
    {name:"Hiring AI Screening",  icon:"💼", color:VIO, domain:"Employment",
      what:"AI systems that screen CVs, rank candidates, and make initial hiring recommendations. Deployed by 99% of Fortune 500 companies. Trained on historical hiring data — often successful hires from past years.",
      bias:"Amazon (2018, leaked): An AI hiring tool trained on 10 years of resumes learned to penalise resumes containing 'women's' (as in 'women's chess club') and downgraded graduates of all-women's colleges. The bias reflected historical male-dominated hiring patterns.",
      source:"Training data: historical successful hires (majority male in technical roles). System learned correlation between male-associated terms and successful hires.",
      impact:"Amazon shut down the system when the bias was discovered. But the same architectural problem (training on historical data that reflects historical discrimination) applies to every hiring AI trained on historical data.",
      lesson:"Historical data encodes historical discrimination. An AI that perfectly predicts who would have been hired in the past will perpetuate past patterns. Hiring AI is being deployed at scale with inadequate bias testing."},
    {name:"Healthcare Allocation", icon:"🏥", color:GRN, domain:"Healthcare",
      what:"AI systems allocating healthcare resources: predicting patient risk scores used to identify who qualifies for care coordination programmes, which patients receive follow-up, and how medical resources are distributed.",
      bias:"Obermeyer et al. (Science 2019): A widely deployed healthcare risk score trained on healthcare costs had significant racial bias. Black patients were predicted as lower-risk than white patients with equivalent health — because the model used costs as a proxy for health needs, and Black patients had historically received less healthcare (lower costs despite higher needs).",
      source:"Proxy variable problem: the model used healthcare costs as a proxy for health need. This proxy reflected historical access disparities, not actual medical need.",
      impact:"Deployed across health systems serving millions of patients. Black patients systematically undertreated relative to their actual medical need. The study estimated that correcting the bias would increase the percentage of Black patients receiving additional care by 26.3%."},
    {name:"LLM Gender Bias",     icon:"🤖", color:CYN, domain:"Language Models",
      what:"Large language models completing prompts about professions, completing sentences with gendered pronouns, and generating fictional characters exhibit statistical biases reflecting patterns in training data.",
      bias:"'The doctor walked in. He...' vs 'The nurse walked in. She...' — LLMs reinforce occupational gender stereotypes from training data. GPT models are more likely to associate STEM careers with men, care professions with women. Translation systems assign gendered pronouns based on occupational stereotypes.",
      source:"Training data: internet text reflects societal gender biases. More descriptions of male doctors, female nurses, male engineers, female teachers.",
      impact:"At scale, billions of interactions shape cultural norms. LLMs deployed in education recommend different careers to students based on gender. Legal documents generated by AI may contain gendered language. Google Translate's gender-neutral language has been documented to add gender based on stereotypes.",
      lesson:"LLMs are cultural mirrors — they reflect, and then amplify, the biases in the text they learned from. Debiasing requires careful data curation, output auditing, and targeted fine-tuning — and even then, biases can be reintroduced through user interactions."},
  ];
  const cs = CASES[tab];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🔍 Bias in AI Systems — Five Case Studies
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {CASES.map((c,i)=>(
          <button key={i} onClick={()=>setTab(i)} style={{
            flex:1,background:tab===i?c.color:c.color+"0d",
            border:`2px solid ${tab===i?c.color:c.color+"33"}`,
            borderRadius:10,padding:"7px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:tab===i?"#fff":c.color,textAlign:"center"
          }}>{c.icon}<br/>{c.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
            <div style={{fontWeight:800,color:cs.color,fontSize:px(14)}}>{cs.icon} {cs.name}</div>
            <div style={{background:cs.color+"15",border:`1px solid ${cs.color}33`,borderRadius:6,padding:"2px 7px",fontSize:px(9),color:cs.color,fontWeight:700,flexShrink:0}}>{cs.domain}</div>
          </div>
          <div style={{background:cs.color+"0d",border:`1px solid ${cs.color}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:cs.color,fontSize:px(10),marginBottom:2}}>System:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{cs.what}</p>
          </div>
          <div style={{background:RED+"0d",border:`2px solid ${RED}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:RED,fontSize:px(10),marginBottom:2}}>The bias:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{cs.bias}</p>
          </div>
        </div>
        <div>
          <div style={{background:AMB+"0d",border:`1px solid ${AMB}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(10),marginBottom:2}}>Source of bias:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{cs.source}</p>
          </div>
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}22`,borderRadius:10,padding:"10px",marginBottom:8}}>
            <div style={{fontWeight:700,color:VIO,fontSize:px(10),marginBottom:2}}>Real-world impact:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{cs.impact}</p>
          </div>
          {cs.lesson&&(
            <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontWeight:700,color:GRN,fontSize:px(10),marginBottom:2}}>Lesson:</div>
              <p style={{...LBODY,fontSize:px(12),margin:0}}>{cs.lesson}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════ GOVERNANCE LANDSCAPE ════════════════════════════════════ */
const GovernanceLandscape = () => {
  const [region, setRegion] = useState(0);
  const REGIONS = [
    {name:"European Union",  icon:"🇪🇺", color:IND,
      framework:"EU AI Act (2024)",
      approach:"Risk-based regulation: different requirements for different risk levels. Prohibited AI (unacceptable risk), High-risk AI (strict requirements), Limited-risk AI (transparency obligations), Minimal-risk AI (no regulation).",
      prohibited:["Real-time remote biometric ID in public spaces (with exceptions)","Social scoring systems by governments","AI that exploits vulnerable groups","Manipulation of subconscious behaviour"],
      high_risk:["Critical infrastructure","Education (grading, admissions)","Employment (screening, performance)","Essential services (creditworthiness, insurance)","Law enforcement","Border management","Administration of justice"],
      strengths:"Most comprehensive binding AI regulation globally. Addresses AI across entire lifecycle. Extra-territorial effect (applies to any AI affecting EU residents).",
      weaknesses:"Risk classification is complex and may be gamed. High compliance burden may disadvantage smaller companies. May slow innovation. Difficult to enforce globally.",
      timeline:"Adopted February 2024. Full application August 2026 for high-risk. Prohibited practices applicable from February 2025."},
    {name:"United States",   icon:"🇺🇸", color:RED,
      framework:"Executive Order on AI (October 2023) + Sector-specific regulation",
      approach:"Non-binding guidance rather than comprehensive legislation. Sector regulators (FDA, FTC, CFPB, EEOC) apply existing laws to AI. Two AI Safety Institutes (NIST + AISI). Voluntary commitments from major AI labs.",
      prohibited:["Limited binding prohibitions — primarily through existing laws (discrimination law, consumer protection)","Voluntary commitments from OpenAI, Google, Anthropic, Meta, Microsoft (2023) on safety testing, watermarking, sharing safety information"],
      high_risk:["Nuclear and biological weapons applications — strict NIST guidelines","Healthcare AI — FDA clearance process","Financial services AI — CFPB guidance"],
      strengths:"Flexible, innovation-friendly. Allows sector expertise to govern AI in context. Voluntary commitments engage industry. US AI Safety Institute produces globally important research.",
      weaknesses:"No comprehensive binding legislation. Voluntary commitments are unenforceable. Patchwork regulation creates compliance confusion. Executive orders can be reversed.",
      timeline:"Executive Order October 2023. AI Safety Institute established January 2024. Congressional AI legislation under discussion but not passed."},
    {name:"China",           icon:"🇨🇳", color:RED,
      framework:"Generative AI Regulations (2023) + Algorithm Recommendation Regulation (2022) + Deep Synthesis Regulation (2022)",
      approach:"Targeted regulation of specific AI applications rather than comprehensive framework. Focus on content safety (preventing AI that threatens CCP authority), labelling AI-generated content, algorithmic transparency for platforms.",
      prohibited:["AI-generated content that subverts national power or socialism","Deepfakes without consent labelling","AI recommendation that 'spreads illegal information'"],
      high_risk:["Generative AI requiring security assessment before release","Algorithmic recommendation systems require registration and labelling","Real-name verification for users of generative AI services"],
      strengths:"Specific, enforceable requirements for specific harms. Deep synthesis (deepfake) regulation is world-leading. Fast regulatory development cycle.",
      weaknesses:"Primary focus on political stability and content control, not safety or ethics in the Western sense. Does not address bias, explainability, or accountability in Western liberal terms. Surveillance AI extensively used by government — regulation does not apply to state actors.",
      timeline:"Algorithm Recommendation Regulation effective March 2022. Deep Synthesis Regulation effective January 2023. Generative AI Regulation effective August 2023."},
    {name:"United Kingdom",  icon:"🇬🇧", color:CYN,
      framework:"AI Safety Institute (AISI) + Pro-innovation AI White Paper (2023) + Bletchley Declaration",
      approach:"Principles-based rather than rules-based. Existing sector regulators apply their frameworks to AI. No new AI-specific legislation. But world-leading on frontier AI safety: first dedicated AI Safety Institute, first international AI safety summit (Bletchley Park, November 2023).",
      prohibited:["No binding prohibitions in primary legislation","NCSC guidance against AI in critical national infrastructure without risk assessment"],
      high_risk:["NHS AI governance guidelines for healthcare AI","FCA principles for AI in financial services","ICO guidance for AI and data protection"],
      strengths:"Light regulatory touch enables innovation. AISI produces world-class frontier AI safety research. Bletchley Declaration (endorsed by 28 countries including US and China) was historic — first international agreement on AI safety.",
      weaknesses:"Non-binding approach provides limited protection. No comprehensive binding legislation. Post-Brexit, lacks EU-level regulatory weight.",
      timeline:"White Paper March 2023. AISI launched November 2023 alongside Bletchley Summit. Updated AISI mandate under 2024 UK elections."},
    {name:"International",   icon:"🌍", color:GRN,
      framework:"Bletchley Declaration + G7 Hiroshima AI Process + OECD AI Principles + UNESCO Recommendation on AI Ethics",
      approach:"No binding international treaty yet. Building blocks: OECD AI Principles (2019, endorsed by 46 countries), UNESCO Recommendation (endorsed by 193 states), G7 AI Code of Conduct (voluntary), Bletchley Declaration on frontier AI risks.",
      prohibited:["No binding international prohibitions on AI","Nuclear Weapons Convention as model for potential future AI weapons prohibition treaties"],
      high_risk:["UN resolution on safe and trustworthy AI (March 2024) — non-binding","IAEA-style international agency for AI safety proposed by multiple researchers"],
      strengths:"Bletchley Declaration brought US and China to same table on AI safety — unprecedented given geopolitical tensions. OECD principles provide common vocabulary. Growing momentum for international governance.",
      weaknesses:"All current international agreements are non-binding. No verification mechanism. No enforcement. Geopolitical competition creates strong incentives against cooperation. No organisation with mandate to regulate frontier AI.",
      timeline:"OECD Principles 2019. UNESCO Recommendation 2021. Bletchley Declaration November 2023. Seoul AI Safety Summit May 2024. Ongoing G7 discussions."},
  ];
  const reg = REGIONS[region];
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        🏛️ Global AI Governance Landscape — Five Approaches
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {REGIONS.map((r,i)=>(
          <button key={i} onClick={()=>setRegion(i)} style={{
            flex:1,background:region===i?r.color:r.color+"0d",
            border:`2px solid ${region===i?r.color:r.color+"33"}`,
            borderRadius:10,padding:"7px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:region===i?"#fff":r.color,textAlign:"center"
          }}>{r.icon}<br/>{r.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(20)}}>
        <div>
          <div style={{background:reg.color+"0d",border:`2px solid ${reg.color}33`,borderRadius:14,padding:"14px",marginBottom:12}}>
            <div style={{fontWeight:800,color:reg.color,fontSize:px(14),marginBottom:4}}>{reg.icon} {reg.name}</div>
            <div style={{fontSize:px(11),color:V.muted,marginBottom:8,fontStyle:"italic"}}>{reg.framework}</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{reg.approach}</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontWeight:700,color:GRN,fontSize:px(10),marginBottom:4}}>✅ Strengths</div>
              <p style={{...LBODY,fontSize:px(11),margin:0}}>{reg.strengths}</p>
            </div>
            <div style={{background:RED+"0d",border:`1px solid ${RED}22`,borderRadius:10,padding:"10px"}}>
              <div style={{fontWeight:700,color:RED,fontSize:px(10),marginBottom:4}}>⚠️ Weaknesses</div>
              <p style={{...LBODY,fontSize:px(11),margin:0}}>{reg.weaknesses}</p>
            </div>
          </div>
        </div>
        <div>
          <div style={{fontWeight:700,color:RED,fontSize:px(12),marginBottom:6}}>🚫 Prohibited:</div>
          {reg.prohibited.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:6,marginBottom:4,fontSize:px(11)}}>
              <span style={{color:RED,fontWeight:700}}>×</span><span style={{color:V.muted}}>{p}</span>
            </div>
          ))}
          <div style={{fontWeight:700,color:AMB,fontSize:px(12),marginBottom:6,marginTop:10}}>⚠️ High-risk requirements:</div>
          {reg.high_risk.map((p,i)=>(
            <div key={i} style={{display:"flex",gap:6,marginBottom:4,fontSize:px(11)}}>
              <span style={{color:AMB,fontWeight:700}}>!</span><span style={{color:V.muted}}>{p}</span>
            </div>
          ))}
          <div style={{background:CYN+"0d",border:`1px solid ${CYN}22`,borderRadius:8,padding:"8px 10px",marginTop:10}}>
            <div style={{fontWeight:700,color:CYN,fontSize:px(10),marginBottom:2}}>Timeline:</div>
            <div style={{fontSize:px(11),color:V.muted}}>{reg.timeline}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════ ETHICAL DEBATE SIMULATOR ════════════════════════════════ */
const EthicalDebate = () => {
  const [scenario, setScenario] = useState(0);
  const [vote, setVote] = useState(null);

  const SCENARIOS = [
    {name:"Autonomous Weapons", icon:"🎯", color:RED,
      setup:"An autonomous weapons system can identify and engage targets 100× faster than a human operator, significantly reducing collateral civilian casualties per engagement. But no human is 'in the loop' — the AI decides whether to kill.",
      pro_label:"Allow with strict protocols",
      pro_args:["Lower civilian casualties in practice than human-operated systems","Faster response reduces attacker advantage","Not subject to human emotional biases, fatigue, or panic","Already deployed by major military powers — unilateral restraint disadvantages democracies"],
      con_label:"Require meaningful human control",
      con_args:["Violates core principle of human accountability for lethal force — no person responsible for deaths","Cannot meaningfully consent to being targeted by an algorithm","Arms race dynamics: everyone deploys, oversight deteriorates globally","Technical failures could trigger unintended escalation with no human able to intervene"],
      expert_view:"International Committee of the Red Cross (ICRC) recommends prohibition on weapons that select and attack targets without human authorisation. US policy: 'appropriate levels of human judgment'. Russia and China oppose binding restrictions. UN discussions ongoing.",
      unresolved:"What constitutes 'meaningful' human control? Is 5 seconds to review and override enough? Is post-hoc audit meaningful oversight? International law has no agreed answers."},
    {name:"AI Mass Surveillance",icon:"👁️", color:AMB,
      setup:"A city deploys AI surveillance across its 10,000 CCTV cameras, integrating facial recognition, gait analysis, and behaviour prediction. Crime rates drop 40% in 18 months. But every resident's movements are tracked and analysed.",
      pro_label:"Justified for public safety",
      pro_args:["40% crime reduction — thousands of crimes prevented, victims protected","Consented to by democratic process (city council approved)","Data encrypted and only accessible with warrant (in theory)","Similar to existing CCTV — AI just makes existing surveillance more effective"],
      con_label:"Fundamentally incompatible with rights",
      con_args:["Chilling effect on free assembly, protest, and political dissent","Mission creep inevitable — security infrastructure gets repurposed","False positive rate × city population = thousands of wrongful targets","Normalises surveillance that authoritarian governments will adopt without democratic accountability"],
      expert_view:"EU AI Act prohibits 'real-time' biometric identification in public spaces except for serious crimes (terrorism, serious crime). China deploys exactly this system at scale. Academic consensus: surveillance AI creates 'panopticon effects' that alter human behaviour beyond crime deterrence.",
      unresolved:"Does surveillance AI prevent crime or merely displace it? Can democratic oversight prevent mission creep? Does a 40% crime reduction justify population-wide monitoring? No consensus."},
    {name:"Predictive Policing", icon:"🚔", color:VIO,
      setup:"Police department deploys AI that predicts which individuals (based on prior convictions, social network, location patterns) are most likely to commit crimes in the next 12 months. Officers make preventive contact with high-risk individuals.",
      pro_label:"Effective crime prevention",
      pro_args:["Directs limited police resources toward highest-risk situations","Pre-crime intervention can divert individuals from crime before harm occurs","Data-driven vs officer intuition — potentially more consistent","Chicago 'heat list' showed preliminary evidence of effectiveness"],
      con_label:"Unconstitutional pre-crime targeting",
      con_args:["Punishes people for crimes they haven't committed — violation of presumption of innocence","Training data reflects racially biased historical policing — algorithmic bias becomes official policy","Self-fulfilling prophecy: more contact → more arrests → higher 'risk score'","Chilling effect: people on list face police contact, employment difficulties, and social stigma"],
      expert_view:"ShotSpotter (predictive gunshot detection) and PredPol (geographic prediction) have been adopted and then dropped by multiple US cities after evidence of racial bias and questionable effectiveness. Chicago dismantled its 'heat list' after widespread criticism.",
      unresolved:"Is prediction of future behaviour ever legitimate? If a system can genuinely identify who will commit a serious crime with high probability, does the state have a right — or obligation — to intervene pre-emptively?"},
  ];
  const sc = SCENARIOS[scenario];
  return (
    <div style={{...LCARD,background:"#00121a",border:`2px solid ${CYN}22`}}>
      <div style={{fontWeight:800,color:CYN,fontSize:px(17),marginBottom:4}}>
        ⚖️ Ethical AI Debate — Three Controversial Scenarios
      </div>
      <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),marginBottom:14}}>Engage with the hardest ethical questions in AI. There are no clean answers — only trade-offs and values in tension.</p>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {SCENARIOS.map((s,i)=>(
          <button key={i} onClick={()=>{setScenario(i);setVote(null);}} style={{
            flex:1,background:scenario===i?s.color:s.color+"0d",
            border:`2px solid ${scenario===i?s.color:s.color+"33"}`,
            borderRadius:10,padding:"8px 4px",cursor:"pointer",fontWeight:700,
            fontSize:px(9),color:scenario===i?"#fff":s.color,textAlign:"center"
          }}>{s.icon}<br/>{s.name.split(" ")[0]}</button>
        ))}
      </div>
      <div style={{background:sc.color+"0d",border:`2px solid ${sc.color}33`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
        <div style={{fontWeight:700,color:sc.color,fontSize:px(13),marginBottom:6}}>{sc.icon} {sc.name}</div>
        <p style={{...LBODY,color:"#94a3b8",fontSize:px(13),margin:0}}>{sc.setup}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
        {[[sc.pro_label,sc.pro_args,GRN,true],[sc.con_label,sc.con_args,RED,false]].map(([label,args,col,isFor])=>(
          <div key={label} onClick={()=>setVote(isFor?1:0)}
            style={{background:vote===(isFor?1:0)?col+"18":col+"0d",border:`2px solid ${vote===(isFor?1:0)?col:col+"33"}`,borderRadius:12,padding:"12px",cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{fontWeight:800,color:col,fontSize:px(12),marginBottom:8}}>{isFor?"✅":"❌"} {label}</div>
            {args.map((a,i)=>(
              <div key={i} style={{display:"flex",gap:6,marginBottom:4,fontSize:px(11)}}>
                <span style={{color:col,fontWeight:700,flexShrink:0}}>{isFor?"+":"−"}</span>
                <span style={{color:"#94a3b8"}}>{a}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {vote!==null&&(
        <div>
          <div style={{background:AMB+"0d",border:`2px solid ${AMB}33`,borderRadius:12,padding:"12px 14px",marginBottom:8}}>
            <div style={{fontWeight:700,color:AMB,fontSize:px(12),marginBottom:4}}>👨‍⚖️ Expert view:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{sc.expert_view}</p>
          </div>
          <div style={{background:VIO+"0d",border:`1px solid ${VIO}22`,borderRadius:10,padding:"10px 12px"}}>
            <div style={{fontWeight:700,color:VIO,fontSize:px(11),marginBottom:4}}>🔍 What remains unresolved:</div>
            <p style={{...LBODY,fontSize:px(12),margin:0}}>{sc.unresolved}</p>
          </div>
        </div>
      )}
      {vote===null&&<p style={{...LBODY,fontSize:px(12),color:"#64748b",textAlign:"center"}}>Click a position to see the expert view →</p>}
    </div>
  );
};

/* ══════ RESPONSIBLE AI FRAMEWORK BUILDER ════════════════════════ */
const ResponsibleAIBuilder = () => {
  const [system, setSystem] = useState("");
  const [checks, setChecks] = useState(Array(10).fill(false));
  const CHECKLIST = [
    {phase:"Design",     color:CYN, items:[
      "Define purpose and scope: what problem does this system solve and for whom?",
      "Identify affected populations: who are all the people this system will affect (directly and indirectly)?",
      "Map potential harms: what could go wrong, and how severe/likely are different failure modes?",
    ]},
    {phase:"Data",       color:VIO, items:[
      "Audit training data for representation gaps and historical biases.",
      "Document data provenance: where did it come from, how was it collected, who consented?",
    ]},
    {phase:"Development",color:AMB, items:[
      "Conduct bias testing across demographic groups before deployment.",
      "Build in explainability mechanisms appropriate to the stakes of decisions.",
    ]},
    {phase:"Deployment", color:GRN, items:[
      "Establish human oversight protocols with genuine authority to review and override.",
      "Create incident reporting and response procedures for when things go wrong.",
      "Plan for model updates and retraining as the system encounters new situations.",
    ]},
  ];
  let idx=0;
  const allItems = CHECKLIST.flatMap(p=>p.items.map(item=>({item,phase:p.phase,color:p.color,idx:idx++})));
  const cnt = checks.filter(Boolean).length;
  return (
    <div style={{...LCARD}}>
      <div style={{fontWeight:700,color:CYN,marginBottom:8,fontSize:px(15)}}>
        📋 Responsible AI Development Checklist
      </div>
      <p style={{...LBODY,fontSize:px(13),color:V.muted,marginBottom:14}}>
        Name your AI system and work through the responsible development checklist. This mirrors practices at leading AI labs and is increasingly required by regulators.
      </p>
      <input value={system} onChange={e=>setSystem(e.target.value)}
        placeholder="AI system name (e.g. 'medical diagnosis assistant')..."
        style={{width:"100%",background:V.cream,border:`1px solid ${CYN}33`,borderRadius:10,padding:"10px 14px",fontSize:px(13),marginBottom:16,boxSizing:"border-box",outline:"none"}}/>
      {CHECKLIST.map((phase,pi)=>(
        <div key={pi} style={{marginBottom:12}}>
          <div style={{fontWeight:700,color:phase.color,fontSize:px(12),marginBottom:6}}>{phase.phase} phase:</div>
          {phase.items.map((item,ii)=>{
            const globalIdx = CHECKLIST.slice(0,pi).reduce((sum,p)=>sum+p.items.length,0)+ii;
            return (
              <div key={ii} onClick={()=>setChecks(prev=>{const n=[...prev];n[globalIdx]=!n[globalIdx];return n;})}
                style={{display:"flex",gap:10,padding:"8px 12px",borderRadius:10,cursor:"pointer",marginBottom:4,
                  background:checks[globalIdx]?phase.color+"0d":V.cream,
                  border:`1px solid ${checks[globalIdx]?phase.color+"44":V.border}`,transition:"all 0.2s"}}>
                <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${phase.color}66`,background:checks[globalIdx]?phase.color:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                  {checks[globalIdx]&&<span style={{color:"#fff",fontSize:px(11),fontWeight:900}}>✓</span>}
                </div>
                <span style={{fontSize:px(12),color:checks[globalIdx]?V.ink:V.muted}}>{item}</span>
              </div>
            );
          })}
        </div>
      ))}
      <div style={{background:V.cream,borderRadius:10,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontWeight:700,fontSize:px(12)}}>{system||"Your AI system"}: {cnt}/10 checks complete</span>
          <span style={{fontWeight:700,color:cnt>=8?GRN:cnt>=5?AMB:RED,fontSize:px(12)}}>{cnt>=8?"Ready for deployment":"Needs more work"}</span>
        </div>
        <div style={{background:V.border,borderRadius:99,height:6}}>
          <div style={{background:cnt>=8?GRN:cnt>=5?AMB:RED,borderRadius:99,height:6,width:`${cnt/10*100}%`,transition:"width 0.4s"}}/>
        </div>
      </div>
    </div>
  );
};

/* ══════ INSIGHTS ════════════════════════════════════════════════ */
const SafetyEthicsInsights = ({onBack}) => {
  const [done,setDone]=useState(Array(8).fill(false));
  const items=[
    {e:"⚖️",t:"AI ethics is not a constraint on AI development — it is the engineering discipline of ensuring AI works for people. Fairness, transparency, accountability, and privacy are not optional nice-to-haves; they are requirements for AI systems that operate in high-stakes domains."},
    {e:"🔍",t:"Bias in AI is not an accident — it is a predictable consequence of training on biased data. The COMPAS, facial recognition, and hiring algorithm cases show that systems can be technically accurate while perpetuating systemic discrimination. Bias testing must be part of standard engineering practice."},
    {e:"⚖️",t:"The mathematical incompatibility of fairness definitions (Chouldechova 2017) is not a problem to be solved — it is a value choice to be made. Deciding which definition of fairness applies in a given context is a political and ethical decision, not a technical one. Engineers must recognise when they are making these choices."},
    {e:"🏛️",t:"The EU AI Act is the world's most comprehensive binding AI regulation. Its risk-based framework — prohibited, high-risk, limited-risk, minimal-risk — will set the global standard, just as GDPR set the global standard for data protection. Understanding it is essential for anyone building AI systems."},
    {e:"🌍",t:"International governance of AI is still nascent. The Bletchley Declaration (2023) brought the US and China to agree on frontier AI risks — an extraordinary diplomatic achievement. But no binding international agreements exist. This is the most important governance gap: AI developed anywhere affects everyone."},
    {e:"🔒",t:"Privacy and AI capability are in fundamental tension. The most useful AI systems are trained on vast personal data, personalised to individual profiles, and optimised for engagement. Building privacy-preserving AI (differential privacy, federated learning) is both technically hard and commercially disincentivised."},
    {e:"👁️",t:"The hardest ethical debates — autonomous weapons, mass surveillance, predictive policing — do not have correct answers derivable from first principles. They involve genuine conflicts between competing values (safety vs liberty, security vs privacy). Democratic deliberation, not technical optimisation, is the appropriate mechanism for resolving them."},
    {e:"📋",t:"Responsible AI development requires institutional structures: ethics review boards, bias auditing procedures, incident reporting systems, and accountability chains. These are analogous to safety engineering in aviation or clinical trials in medicine. The industry is still building these institutions."},
  ];
  const cnt=done.filter(Boolean).length;
  return (
    <div style={{...LSEC,background:V.paper}}>
      <div style={{maxWidth:px(800),margin:"0 auto"}}>
        {STag("Key Insights · AI Safety & Ethics",CYN)}
        <h2 style={{...LH2,marginBottom:px(28)}}>8 Things to <span style={{color:CYN}}>Master</span></h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(14),marginBottom:px(32)}}>
          {items.map((item,i)=>(
            <div key={i} onClick={()=>setDone(d=>{const n=[...d];n[i]=!n[i];return n;})}
              style={{...LCARD,cursor:"pointer",border:`2px solid ${done[i]?CYN+"44":V.border}`,background:done[i]?CYN+"08":V.paper,transition:"all 0.2s"}}>
              <span style={{fontSize:px(26)}}>{item.e}</span>
              <p style={{...LBODY,margin:"8px 0 0",fontSize:px(13),color:done[i]?V.ink:V.muted,fontWeight:done[i]?600:400}}>{item.t}</p>
            </div>
          ))}
        </div>
        <div style={{background:V.cream,borderRadius:14,padding:"16px 20px",marginBottom:px(24)}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontWeight:700,color:V.ink}}>Mastered {cnt}/8</span>
            <span style={{fontWeight:700,color:CYN}}>{Math.round(cnt/8*100)}%</span>
          </div>
          <div style={{background:V.border,borderRadius:99,height:8}}>
            <div style={{background:`linear-gradient(90deg,${TEAL},${CYN})`,borderRadius:99,height:8,width:`${cnt/8*100}%`,transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          {cnt===8&&<button onClick={onBack} style={{background:`linear-gradient(135deg,${TEAL},${CYN})`,border:"none",borderRadius:10,padding:"12px 28px",fontWeight:800,cursor:"pointer",color:"#fff",fontSize:px(14)}}>Final Lesson: Future of AI →</button>}
          <button onClick={onBack} style={{border:`1px solid ${V.border}`,background:"none",borderRadius:10,padding:"12px 24px",color:V.muted,cursor:"pointer",fontSize:px(13)}}>← Back to Level 7</button>
        </div>
      </div>
    </div>
  );
};

/* ══════ MAIN PAGE ════════════════════════════════════════════════ */
const SafetyEthicsPage = ({onBack}) => (
  <NavPage onBack={onBack} crumb="AI Safety & Ethics" lessonNum="Lesson 4 of 5"
    accent={CYN} levelLabel="AGI & Future of AI"
    dotLabels={["Hero","Introduction","Ethics Principles","Bias","Safety Risks","Governance","Debate","Checklist","Insights"]}>
    {R=>(
      <>
        {/* HERO */}
        <div ref={R(0)} style={{background:"linear-gradient(160deg,#00121a 0%,#001e2d 60%,#00121a 100%)",minHeight:"75vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
          <div style={{maxWidth:px(1100),width:"100%",margin:"0 auto",padding:"80px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(48),alignItems:"center"}}>
            <div>
              <button onClick={onBack} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"7px 16px",color:"#64748b",cursor:"pointer",fontSize:13,marginBottom:24}}>← Back</button>
              {STag("🛡️ Lesson 4 of 5 · AGI & Future of AI",CYN)}
              <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2rem,5vw,3.2rem)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:px(20)}}>
                AI Safety <span style={{color:"#7dd3fc"}}>&</span> Ethics
              </h1>
              <p style={{...LBODY,color:"#94a3b8",fontSize:px(17),marginBottom:px(28)}}>
                Advanced AI systems shape economies, justice systems, and democratic institutions. Ensuring these systems are fair, transparent, accountable, and safe is not optional — it is the defining engineering challenge of our era.
              </p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                {[["⚖️","Fairness"],["🔍","Transparency"],["🏛️","Governance"],["🛡️","Safety"]].map(([icon,label])=>(
                  <div key={label} style={{background:CYN+"15",border:`1px solid ${CYN}33`,borderRadius:10,padding:"7px 14px",display:"flex",gap:6,alignItems:"center"}}>
                    <span>{icon}</span><span style={{color:"#7dd3fc",fontSize:px(12),fontWeight:600}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{height:360,borderRadius:20,overflow:"hidden",border:`1px solid ${CYN}22`}}>
              <HeroCanvas/>
            </div>
          </div>
        </div>

        {/* S1: INTRO */}
        <div ref={R(1)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 1 · Introduction",CYN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Why <span style={{color:CYN}}>AI Ethics is Engineering</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(32)}}>
              <div>
                <p style={{...LBODY,marginBottom:16}}>When an AI system makes a lending decision, a sentencing recommendation, a medical diagnosis, or a hiring choice, it is making decisions with profound consequences for real people. These are not abstract technical choices — they are value-laden judgements that determine who gets loans, who goes to prison, who gets healthcare, and who gets a job.</p>
                <p style={{...LBODY,marginBottom:16}}>AI ethics is the discipline of ensuring these systems embody the right values — and the practice of building institutional structures that enforce those values when market incentives do not.</p>
                <IBox color={CYN} title="The scope of AI impact"
                  body="AI systems currently affect: 2.5B Facebook users (content recommendation), 100% of US Fortune 500 hiring pipelines, credit decisions for 200M Americans, criminal justice decisions in 46+ US states, medical diagnosis in 190+ countries. At this scale, bias, opacity, and unaccountability are not engineering oversights — they are systemic harms." />
              </div>
              <div>
                {[
                  {domain:"Criminal justice",  color:RED,  icon:"⚖️", examples:"Risk assessment tools (COMPAS, PSA), predictive policing, facial recognition for suspect ID, parole decision support"},
                  {domain:"Healthcare",        color:GRN,  icon:"🏥", examples:"Disease diagnosis, treatment recommendation, resource allocation, drug discovery, clinical trial eligibility"},
                  {domain:"Employment",        color:AMB,  icon:"💼", examples:"CV screening, interview assessment, performance evaluation, workforce scheduling, salary benchmarking"},
                  {domain:"Financial services",color:CYN,  icon:"🏦", examples:"Credit scoring, fraud detection, insurance pricing, investment recommendation, loan approval"},
                  {domain:"Education",         color:VIO,  icon:"🎓", examples:"Admissions, personalised learning, grade prediction, cheating detection, teacher evaluation"},
                  {domain:"Governance",        color:TEAL, icon:"🏛️", examples:"Benefits eligibility, tax risk scoring, border control, content moderation at scale, electoral systems"},
                ].map(d=>(
                  <div key={d.domain} style={{...LCARD,border:`1px solid ${d.color}22`,marginBottom:6,display:"flex",gap:8,padding:"8px 12px"}}>
                    <span style={{fontSize:px(14),flexShrink:0}}>{d.icon}</span>
                    <div><span style={{fontWeight:700,color:d.color,fontSize:px(11)}}>{d.domain}: </span><span style={{fontSize:px(11),color:V.muted}}>{d.examples}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* S2: ETHICS */}
        <div ref={R(2)} style={{...LSEC,background:"#00121a"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 2 · Ethical Principles",CYN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Six Pillars of <span style={{color:"#7dd3fc"}}>Responsible AI</span></h2>
            <EthicsPrinciplesExplorer/>
          </div>
        </div>

        {/* S3: BIAS */}
        <div ref={R(3)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 3 · Bias in AI",CYN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Five <span style={{color:CYN}}>Case Studies in AI Bias</span></h2>
            <BiasInAI/>
          </div>
        </div>

        {/* S4: SAFETY RISKS */}
        <div ref={R(4)} style={{...LSEC,background:"#00121a"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 4 · Safety Risks",CYN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Where <span style={{color:"#7dd3fc"}}>AI Can Cause Harm</span></h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:px(16)}}>
              {[
                {icon:"🤖",title:"Autonomous weapons",        color:RED,
                  desc:"AI systems that can identify and engage targets without real-time human authorisation. Already deployed by Turkey (Kargu-2), Israel (Harop), and others. Raises fundamental questions about accountability for lethal force and the risk of algorithmic warfare escalation.",
                  risk:"Accountability vacuum, arms race dynamics, lowered threshold for armed conflict, potential for autonomous escalation without human override",
                  mitigation:"Meaningful human control requirements (US DoD Directive 3000.09), international negotiations for prohibition treaties (Campaign to Stop Killer Robots), robust safety interlocks"},
                {icon:"📰",title:"AI-generated misinformation", color:AMB,
                  desc:"Large language models and diffusion models can generate convincing fake news articles, deepfake videos, synthetic social media personas at industrial scale. Deployed in information warfare by state actors and used by commercial click farms.",
                  risk:"Electoral manipulation, erosion of epistemic commons, manufactured social crises, targeted harassment via synthetic media, undermining trust in genuine evidence",
                  mitigation:"C2PA content provenance standards, AI watermarking (proposed in US EO), platform detection systems, media literacy education, provenance verification infrastructure"},
                {icon:"💼",title:"Economic disruption",       color:VIO,
                  desc:"AI automation of cognitive tasks could eliminate entire job categories. Goldman Sachs (2023) estimates 300M full-time jobs could be partially automated. Historical technological transitions were gradual; AI may transition entire economic sectors in years.",
                  risk:"Structural unemployment, widened inequality, concentration of economic power in AI-owning entities, social instability from displaced workers",
                  mitigation:"Universal basic income pilots, education retraining programmes, AI dividend proposals (distributing returns from AI to displaced workers), progressive AI taxation"},
                {icon:"🔒",title:"AI-enabled surveillance",   color:TEAL,
                  desc:"AI dramatically lowers the cost of mass surveillance: face recognition, social graph analysis, behaviour prediction, sentiment analysis at scale. Deployed by authoritarian governments (China's Social Credit System) and increasingly by democratic governments and corporations.",
                  risk:"Chilling effect on dissent and assembly, creation of panopticon societies, normalisation of surveillance infrastructure that authoritarian actors will use",
                  mitigation:"Regulatory prohibition on high-risk surveillance uses (EU AI Act), audit requirements for law enforcement AI, civil society oversight, privacy-preserving AI techniques"},
                {icon:"🧬",title:"Biotechnology acceleration",color:GRN,
                  desc:"AI protein structure prediction (AlphaFold), drug design, and synthetic biology planning tools lower the barrier to bioweapon design. Academic research that previously required years of expertise can be partially automated.",
                  risk:"Biosecurity risk: easier development of enhanced pathogens, lowered barrier for state and non-state bioweapons programmes",
                  mitigation:"Biosecurity review requirements for AI-assisted biology research, dual-use research oversight, international coordination on biosecurity AI, restricting access to most dangerous design tools"},
                {icon:"⚡",title:"Critical infrastructure risk", color:ORG,
                  desc:"AI systems controlling power grids, water treatment, financial infrastructure, and transportation are vulnerable to adversarial attacks, autonomous failures, and coordinated manipulation. A misaligned AI managing electrical grid balancing could cause cascading failures.",
                  risk:"Physical harm from infrastructure failures, economic damage from financial system instability, public health risks from utility failures",
                  mitigation:"Human oversight requirements for critical decisions, adversarial robustness testing, fail-safe defaults, air-gapping sensitive systems, sector-specific safety standards"},
              ].map(item=>(
                <div key={item.title} style={{...LCARD,background:"#001a26",border:`2px solid ${item.color}22`}}>
                  <div style={{fontSize:px(22),marginBottom:6}}>{item.icon}</div>
                  <div style={{fontWeight:700,color:item.color,fontSize:px(13),marginBottom:6}}>{item.title}</div>
                  <p style={{...LBODY,color:"#94a3b8",fontSize:px(12),marginBottom:8}}>{item.desc}</p>
                  <div style={{background:RED+"0d",border:`1px solid ${RED}22`,borderRadius:8,padding:"6px 8px",marginBottom:6}}>
                    <div style={{fontWeight:700,color:RED,fontSize:px(9),marginBottom:2}}>RISKS:</div>
                    <div style={{fontSize:px(10),color:"#94a3b8"}}>{item.risk}</div>
                  </div>
                  <div style={{background:GRN+"0d",border:`1px solid ${GRN}22`,borderRadius:8,padding:"6px 8px"}}>
                    <div style={{fontWeight:700,color:GRN,fontSize:px(9),marginBottom:2}}>MITIGATION:</div>
                    <div style={{fontSize:px(10),color:"#94a3b8"}}>{item.mitigation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* S5: GOVERNANCE */}
        <div ref={R(5)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 5 · Governance & Regulation",CYN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Global <span style={{color:CYN}}>AI Governance Landscape</span></h2>
            <GovernanceLandscape/>
          </div>
        </div>

        {/* S6: ETHICAL DEBATE */}
        <div ref={R(6)} style={{...LSEC,background:"#00121a"}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 6 · Ethical Debate",CYN)}
            <h2 style={{...LH2,color:"#fff",marginBottom:px(20)}}>Three <span style={{color:"#7dd3fc"}}>Controversial Scenarios</span></h2>
            <EthicalDebate/>
          </div>
        </div>

        {/* S7: CHECKLIST */}
        <div ref={R(7)} style={{...LSEC,background:V.paper}}>
          <div style={{maxWidth:px(1000),margin:"0 auto"}}>
            {STag("Section 7 · Responsible AI Development",CYN)}
            <h2 style={{...LH2,marginBottom:px(20)}}>Project: <span style={{color:CYN}}>Build an Ethical AI Framework</span></h2>
            <ResponsibleAIBuilder/>
          </div>
        </div>

        {/* INSIGHTS */}
        <div ref={R(8)}><SafetyEthicsInsights onBack={onBack}/></div>
      </>
    )}
  </NavPage>
);

export default SafetyEthicsPage;