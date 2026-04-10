import { useState, useEffect, useRef } from "react";
import { useShivAgent } from "../hooks/useShivAgent";

/* ── Status config ───────────────────────────────────────────── */
const S_CFG = {
  idle:      { label: 'Ask Shiv',          color: "#6366f1", pulse: false, icon: "✦",  ring: false },
  listening: { label: "Listening...",       color: "#10b981", pulse: true,  icon: "◉",  ring: true  },
  thinking:  { label: "Thinking...",        color: "#f59e0b", pulse: true,  icon: "◌",  ring: false },
  speaking:  { label: "Speaking...",        color: "#8b5cf6", pulse: true,  icon: "▶",  ring: true  },
};

export default function ShivAgent({ onNavigate, userId = "guest" }) {
  const [open,      setOpen]      = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const bodyRef = useRef(null);

  const {
    status, transcript, response,
    activeSentIdx, typingText,
    error, isActive,
    activateShiv, stopRecording, stopSpeaking,
    explainTopic,
  } = useShivAgent({
    userId,
    onNavigate,
    onClose: () => setOpen(false),
  });

  const cfg = S_CFG[status] || S_CFG.idle;

  // Auto-open panel when activated
  useEffect(() => { if (isActive) setOpen(true); }, [isActive]);

  // Scroll to bottom when new response
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [response, typingText]);

  // ── Keyword highlighter ───────────────────────────────────────
  const hlKeywords = (text, kws = []) => {
    if (!kws.length) return text;
    const rx = new RegExp(`\\b(${kws.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");
    return text.split(rx).map((p, i) =>
      rx.test(p)
        ? <mark key={i} style={{ background: "rgba(99,102,241,0.28)", color: "#c7d2fe", borderRadius: 3, padding: "0 2px", fontWeight: 600 }}>{p}</mark>
        : p
    );
  };

  const isSpeaking  = status === "speaking";
  const isListening = status === "listening";
  const isThinking  = status === "thinking";

  /* ════════════════════════════════════════════════════════════
     STYLES
  ═════════════════════════════════════════════════════════════ */
  const css = `
    @keyframes shivPulse   { 0%,100%{transform:scale(1);opacity:1}  50%{transform:scale(1.12);opacity:.75} }
    @keyframes shivFloat   { 0%,100%{transform:translateY(0)}        50%{transform:translateY(-3px)} }
    @keyframes shivRing    { 0%{box-shadow:0 0 0 0 var(--rc)80}      70%{box-shadow:0 0 0 14px transparent} 100%{box-shadow:0 0 0 0 transparent} }
    @keyframes shivBlink   { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes shivSlideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    @keyframes shivSpin    { to{transform:rotate(360deg)} }
    @keyframes shivGlow    { 0%,100%{box-shadow:0 0 12px var(--rc)66} 50%{box-shadow:0 0 28px var(--rc)aa} }

    .shiv-panel      { animation: shivSlideUp .25s cubic-bezier(.4,0,.2,1); }
    .shiv-pill:hover { filter: brightness(1.15); transform: translateY(-1px); }
    .shiv-pill       { transition: all .2s ease; }
    .shiv-tab-active { border-bottom: 2px solid var(--rc) !important; color: var(--rc) !important; }
    .shiv-sentence-active {
      background: rgba(99,102,241,.2) !important;
      color: #e2e8f0 !important;
      border-radius: 4px;
      padding: 1px 4px;
      font-weight: 600;
      transition: all .25s ease;
    }
  `;

  const rc = cfg.color;   // reactive color

  /* ════════════════════════════════════════════════════════════
     RENDER
  ═════════════════════════════════════════════════════════════ */
  return (
    <>
      <style>{css}</style>

      {/* ── Fixed container — always bottom-right ── */}
      <div style={{
        position: "fixed", bottom: 22, right: 22,
        zIndex: 10000,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10,
        fontFamily: "'Inter', 'IBM Plex Sans', sans-serif",
      }}>

        {/* ── Expandable panel ── */}
        {open && (
          <div className="shiv-panel" style={{
            width: 420, maxHeight: "75vh",
            background: "#0d1117",
            border: `1px solid ${rc}44`,
            borderRadius: 20,
            display: "flex", flexDirection: "column",
            boxShadow: `0 24px 64px rgba(0,0,0,.7), 0 0 0 1px ${rc}22`,
            overflow: "hidden",
            "--rc": rc,
          }}>

            {/* Header */}
            <div style={{
              background: "#161b22",
              padding: "13px 18px",
              borderBottom: `1px solid ${rc}33`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: `linear-gradient(135deg, ${rc}cc, #8b5cf6)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
                boxShadow: cfg.ring ? `0 0 0 0 ${rc}80` : "none",
                animation: cfg.ring ? `shivRing 1.4s infinite, shivGlow 2s infinite` : "none",
                "--rc": rc,
              }}>
                {cfg.icon}
              </div>

              {/* Name + status */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#f0f6fc" }}>Shiv</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 1 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: rc,
                    display: "inline-block",
                    animation: cfg.pulse ? "shivPulse 1.2s ease-in-out infinite" : "none",
                  }} />
                  <span style={{ fontSize: 12, color: rc, fontWeight: 500 }}>{cfg.label}</span>
                  {response?.from_cache && (
                    <span style={{ fontSize: 10, color: "#10b981", marginLeft: 2 }}>⚡ instant</span>
                  )}
                </div>
              </div>

              {/* Close */}
              <button onClick={() => { setOpen(false); stopSpeaking(); }}
                style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: 18, padding: "2px 6px", borderRadius: 6, lineHeight: 1 }}>
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: "#161b22", borderBottom: `1px solid ${rc}22`, "--rc": rc }}>
              {["chat", "transcript"].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={activeTab === t ? "shiv-tab-active" : ""}
                  style={{
                    flex: 1, padding: "8px 0", border: "none", borderBottom: "2px solid transparent",
                    background: "transparent", cursor: "pointer",
                    fontSize: 12, fontWeight: 600,
                    color: activeTab === t ? rc : "#4b5563",
                    transition: "all .2s", "--rc": rc,
                  }}>
                  {{ chat: "💬 Response", transcript: "🎙️ You said" }[t]}
                </button>
              ))}
            </div>

            {/* Body */}
            <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Error */}
              {error && (
                <div style={{ background: "#ef444418", color: "#f87171", borderRadius: 10, padding: "8px 14px", fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}

              {/* Transcript tab */}
              {activeTab === "transcript" && (
                <div style={{
                  background: "#161b22", borderRadius: 10, padding: "12px 14px",
                  fontSize: 13, color: "#9ca3af", fontStyle: "italic",
                  borderLeft: `3px solid ${rc}`, lineHeight: 1.7,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", marginBottom: 6, letterSpacing: "0.08em" }}>YOU SAID</div>
                  {transcript || <span style={{ color: "#374151" }}>Nothing yet — try speaking!</span>}
                </div>
              )}

              {/* Chat tab */}
              {activeTab === "chat" && (
                <>
                  {/* Typing while thinking */}
                  {isThinking && typingText && (
                    <div style={{ fontSize: 14, lineHeight: 1.8, color: "#d1d5db" }}>
                      {typingText}
                      <span style={{
                        display: "inline-block", width: 2, height: "1em",
                        background: rc, marginLeft: 2, verticalAlign: "text-bottom",
                        animation: "shivBlink 1s step-end infinite",
                      }} />
                    </div>
                  )}

                  {/* Thinking spinner */}
                  {isThinking && !typingText && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#f59e0b", fontSize: 13 }}>
                      <span style={{ width: 16, height: 16, border: "2px solid #f59e0b44", borderTopColor: "#f59e0b", borderRadius: "50%", display: "inline-block", animation: "shivSpin 0.8s linear infinite" }} />
                      Shiv is thinking...
                    </div>
                  )}

                  {/* Response */}
                  {response && !response.blocked && !isThinking && (
                    <>
                      {/* Difficulty badge */}
                      {response.difficulty && (
                        <span style={{
                          display: "inline-block", fontSize: 10, fontWeight: 700,
                          padding: "2px 10px", borderRadius: 999, letterSpacing: "0.06em",
                          background: response.difficulty === "beginner" ? "#10b98122" : "#f59e0b22",
                          color:      response.difficulty === "beginner" ? "#10b981"   : "#f59e0b",
                        }}>
                          {response.difficulty === "beginner" ? "🟢" : "🟡"} {response.difficulty}
                        </span>
                      )}

                      {/* English */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", marginBottom: 8, letterSpacing: "0.08em" }}>🇬🇧 ENGLISH</div>
                        <div style={{ fontSize: 14, lineHeight: 1.85, color: "#d1d5db" }}>
                          {(response.sentences_en || []).map((s, i) => (
                            <span key={i} className={activeSentIdx === i ? "shiv-sentence-active" : ""}
                              style={{ display: "inline", color: "#9ca3af", transition: "all .25s" }}>
                              {activeSentIdx === i ? hlKeywords(s, response.keywords) : s}{" "}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hindi/Hinglish */}
                      {response.hindi && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", marginBottom: 8, letterSpacing: "0.08em" }}>🇮🇳 HINDI / HINGLISH</div>
                          <div style={{ fontSize: 14, lineHeight: 1.9, color: "#d1d5db" }}>
                            {(response.sentences_hi || []).map((s, i) => {
                              const gi = (response.sentences_en || []).length + i;
                              return (
                                <span key={i} className={activeSentIdx === gi ? "shiv-sentence-active" : ""}
                                  style={{ display: "inline", color: "#9ca3af", transition: "all .25s" }}>
                                  {s}{" "}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Keywords */}
                      {response.keywords?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", marginBottom: 6, letterSpacing: "0.08em" }}>KEY CONCEPTS</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {response.keywords.map((kw, i) => (
                              <span key={i} style={{ background: "rgba(99,102,241,.12)", color: "#818cf8", borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 600 }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {response?.blocked && (
                    <div style={{ color: "#f59e0b", fontSize: 14 }}>🔒 {response.english}</div>
                  )}

                  {/* Empty state */}
                  {!response && !isThinking && (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ fontSize: 48, marginBottom: 10 }}>🎙️</div>
                      <div style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.7 }}>
                        Say <strong style={{ color: rc }}>"Hey Shiv"</strong> or tap the mic below
                      </div>
                      <div style={{ marginTop: 10, color: "#374151", fontSize: 12, lineHeight: 1.8 }}>
                        💬 "Explain neural networks"<br />
                        🇮🇳 "Backpropagation kya hota hai?"<br />
                        🔀 "Lesson 4 simple karo yaar"
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer buttons */}
            <div style={{ padding: "12px 18px", borderTop: `1px solid ${rc}22`, display: "flex", gap: 8, background: "#0d1117" }}>
              {isSpeaking ? (
                <button onClick={stopSpeaking} style={btnStyle("#ef4444")}>⏹ Stop</button>
              ) : isListening ? (
                <button onClick={stopRecording} style={btnStyle("#10b981")}>✅ Done</button>
              ) : (
                <>
                  <button onClick={activateShiv} style={btnStyle(rc)}>🎙️ Ask Shiv</button>
                  {response && (
                    <>
                      <button onClick={() => explainTopic({ topic: response.topic, langPref: "hindi", simplify: false })}
                        style={btnStyle("#f59e0b", true)}>🇮🇳 Hindi</button>
                      <button onClick={() => explainTopic({ topic: response.topic, simplify: true })}
                        style={btnStyle("#64748b", true)}>🔽 Simpler</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            "Ask Shiv" pill button — always visible on every screen
        ═══════════════════════════════════════════════════════ */}
        <button
          className="shiv-pill"
          onClick={() => {
            if (open) { setOpen(false); stopSpeaking(); }
            else { setOpen(true); if (!isActive) activateShiv(); }
          }}
          style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "10px 20px 10px 14px",
            background: open
              ? `linear-gradient(135deg, ${rc}cc, #8b5cf6)`
              : `linear-gradient(135deg, ${rc}22, #8b5cf622)`,
            border: `1.5px solid ${rc}${open ? "ff" : "77"}`,
            borderRadius: 999,
            cursor: "pointer",
            color: open ? "#fff" : rc,
            fontWeight: 700,
            fontSize: 14,
            boxShadow: cfg.pulse
              ? `0 0 20px ${rc}66, 0 4px 20px rgba(0,0,0,.4)`
              : `0 4px 20px rgba(0,0,0,.35)`,
            animation: cfg.pulse ? "shivFloat 2s ease-in-out infinite" : "none",
            backdropFilter: "blur(12px)",
            userSelect: "none",
            "--rc": rc,
          }}
        >
          {/* Orb icon */}
          <span style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, ${rc}, ${rc}44)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
            boxShadow: cfg.ring ? `0 0 0 0 ${rc}80` : "none",
            animation: cfg.ring ? "shivRing 1.4s infinite" : "none",
            "--rc": rc,
          }}>
            {cfg.icon}
          </span>

          {/* Label — changes with status */}
          <span>{
            status === "listening" ? "Listening..." :
            status === "thinking"  ? "Thinking..." :
            status === "speaking"  ? "Speaking..." :
            open                   ? "Close Shiv" :
                                     "Ask Shiv"
          }</span>

          {/* Live pulse dot when active */}
          {isActive && (
            <span style={{
              width: 7, height: 7, borderRadius: "50%", background: rc,
              animation: "shivPulse 1s ease-in-out infinite",
            }} />
          )}
        </button>
      </div>
    </>
  );
}

const btnStyle = (color, outline = false) => ({
  flex: 1, padding: "9px 0", borderRadius: 10,
  fontSize: 13, fontWeight: 600, cursor: "pointer",
  transition: "all .2s",
  background: outline ? "transparent" : color,
  color:      outline ? color : "#fff",
  border:     `1.5px solid ${color}`,
});
