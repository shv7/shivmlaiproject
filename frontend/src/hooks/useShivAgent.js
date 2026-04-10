import { useState, useEffect, useRef, useCallback } from "react";

const API           = process.env.REACT_APP_SHIV_API || "http://localhost:8000";
const INACTIVITY_MS = 10000;

export function useShivAgent({ userId = "guest", onNavigate, onClose } = {}) {

  const [status,        setStatus]        = useState("idle");
  const [transcript,    setTranscript]    = useState("");
  const [response,      setResponse]      = useState(null);
  const [activeSentIdx, setActiveSentIdx] = useState(-1);
  const [typingText,    setTypingText]    = useState("");
  const [error,         setError]         = useState("");
  const [isActive,      setIsActive]      = useState(false);
  const [currentLesson, setCurrentLesson] = useState("");

  const cmdRef        = useRef(null);
  const timersRef     = useRef([]);
  const inactivityRef = useRef(null);
  const isFetchingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const historyRef    = useRef([]);
  const sessionRef    = useRef({ lastTopic: "", langPref: "auto" });
  const statusRef     = useRef("idle");

  // Keep statusRef in sync
  useEffect(() => { statusRef.current = status; }, [status]);

  // ── Speech Recognition (defined once) ─────────────────────────
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  // ── clearTimers ────────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // ── resetInactivity ────────────────────────────────────────────
  const resetInactivity = useCallback(() => {
    clearTimeout(inactivityRef.current);
    inactivityRef.current = setTimeout(() => {
      stopSpeaking();
      setIsActive(false);
      setStatus("idle");
      onClose?.();
    }, INACTIVITY_MS);
  }, []); // eslint-disable-line

  // ── stopAll — cancel everything ────────────────────────────────
  const stopAll = useCallback(() => {
    window.speechSynthesis?.cancel();
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    clearTimeout(inactivityRef.current);
    try { cmdRef.current?.stop(); } catch (_) {}
    isSpeakingRef.current = false;
    setStatus("idle");
    setIsActive(false);
    setActiveSentIdx(-1);
  }, []); // eslint-disable-line

  // ── finishSpeaking ─────────────────────────────────────────────
  const finishSpeaking = useCallback(() => {
    isSpeakingRef.current = false;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setStatus("idle");
    setIsActive(false);
    setActiveSentIdx(-1);
  }, []);

  // ── stopSpeaking ───────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    finishSpeaking();
  }, [finishSpeaking]);

  // ── stopRecording ──────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    try { cmdRef.current?.stop(); } catch (_) {}
  }, []);

  // ── playChime ──────────────────────────────────────────────────
  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(), g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(); osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }, []);

  // ── speakBilingual ─────────────────────────────────────────────
  const speakBilingual = useCallback((data) => {
    setStatus("speaking");
    isSpeakingRef.current = true;
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    window.speechSynthesis.cancel();

    const enSents = data.sentences_en || [];
    const hiSents = data.sentences_hi || [];

    const pickVoice = (lang) => {
      const voices = window.speechSynthesis.getVoices();
      if (lang === "en-US") {
        return (
          voices.find((v) => v.name.includes("Google UK English Male")) ||
          voices.find((v) => v.name.includes("Microsoft David"))        ||
          voices.find((v) => v.name.includes("Microsoft Mark"))         ||
          voices.find((v) => v.lang === "en-US") || null
        );
      }
      return (
        voices.find((v) => v.lang === "hi-IN") ||
        voices.find((v) => v.name.toLowerCase().includes("hindi")) || null
      );
    };

    const uttEn = new SpeechSynthesisUtterance(data.english || "");
    uttEn.lang = "en-US"; uttEn.rate = 0.93; uttEn.pitch = 0.9;
    const vEn = pickVoice("en-US");
    if (vEn) uttEn.voice = vEn;

    let elapsed = 0;
    enSents.forEach((s, i) => {
      const dur = Math.max(1200, (s.length / 3.6) * 1000);
      timersRef.current.push(setTimeout(() => setActiveSentIdx(i), elapsed));
      elapsed += dur;
    });

    uttEn.onend = () => {
      if (!data.hindi) { finishSpeaking(); return; }
      const uttHi = new SpeechSynthesisUtterance(data.hindi);
      uttHi.lang = "hi-IN"; uttHi.rate = 0.88;
      const vHi = pickVoice("hi-IN");
      if (vHi) uttHi.voice = vHi;

      let hiElapsed = 0;
      hiSents.forEach((s, i) => {
        const dur = Math.max(1200, (s.length / 3.0) * 1000);
        timersRef.current.push(
          setTimeout(() => setActiveSentIdx(enSents.length + i), hiElapsed)
        );
        hiElapsed += dur;
      });
      uttHi.onend = uttHi.onerror = finishSpeaking;
      window.speechSynthesis.speak(uttHi);
    };
    uttEn.onerror = finishSpeaking;
    window.speechSynthesis.speak(uttEn);
    resetInactivity();
  }, [finishSpeaking, resetInactivity]);

  // ── startTypingEffect ──────────────────────────────────────────
  const startTypingEffect = useCallback((text, onDone) => {
    setTypingText("");
    const chars = text.split("");
    const speed = Math.max(10, Math.min(25, 1800 / chars.length));
    let i = 0;
    const tick = () => {
      if (i < chars.length) {
        setTypingText((p) => p + chars[i++]);
        timersRef.current.push(setTimeout(tick, speed));
      } else { onDone?.(); }
    };
    tick();
  }, []);

  // ── explainTopic ───────────────────────────────────────────────
  const explainTopic = useCallback(async ({
    topic, lessonKey = "", langPref = "auto", simplify = false
  }) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setStatus("thinking");
    setResponse(null);
    setTypingText("");

    try {
      const res = await fetchWithTimeout(`${API}/explain`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          topic, lesson_key: lessonKey,
          lang_pref: langPref, simplify, user_id: userId,
        }),
      }, 20000);
      const data = await res.json();
      setResponse(data);
      sessionRef.current.lastTopic = topic;
      historyRef.current.push({ topic, response: data.english?.slice(0, 200) });
      if (historyRef.current.length > 3) historyRef.current.shift();
      startTypingEffect(data.english || "", () => speakBilingual(data));
    } catch {
      setError("⚠️ Backend offline. Run: uvicorn main:app --reload --port 8000");
      setStatus("idle");
      setIsActive(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [userId, startTypingEffect, speakBilingual]); // eslint-disable-line

  // ── processTranscript ──────────────────────────────────────────
  const processTranscript = useCallback(async (text) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setStatus("thinking");

    // Repeat command
    if (["repeat","explain again","phir se","dobara"].some(k =>
      text.toLowerCase().includes(k)
    )) {
      const last = sessionRef.current.lastTopic;
      if (last) {
        isFetchingRef.current = false;
        await explainTopic({ topic: last, lessonKey: currentLesson });
        return;
      }
    }

    try {
      const res = await fetchWithTimeout(`${API}/voice-input`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ transcript: text, user_id: userId }),
      }, 8000);

      const data = await res.json();
      const intent = data.intent || {};

      if (intent.lesson_key && onNavigate) {
        onNavigate(intent.lesson_key);
        setCurrentLesson(intent.lesson_key);
      }

      await explainTopic({
        topic:     intent.topic || text,
        lessonKey: intent.lesson_key || currentLesson,
        langPref:  data.session?.lang_pref || "auto",
        simplify:  intent.intent === "simplify" || !!intent.simplify,
      });
    } catch {
      // Backend offline fallback
      const offMsg = {
        english: `I heard: "${text}". Backend is offline — run: uvicorn main:app --reload --port 8000`,
        hindi:   `Maine suna: "${text}". Backend start karo: uvicorn main:app --reload --port 8000`,
        sentences_en: [`I heard: "${text}".`, "Backend is offline.", "Run: uvicorn main:app --reload --port 8000"],
        sentences_hi: [`Maine suna: "${text}".`, "Backend start karo yaar.", "uvicorn main:app --reload --port 8000"],
        all_sentences: [],
        keywords: [],
        difficulty: "info",
        blocked: false,
        from_cache: false,
      };
      offMsg.all_sentences = [...offMsg.sentences_en, ...offMsg.sentences_hi];
      setResponse(offMsg);
      speakBilingual(offMsg);
    } finally {
      isFetchingRef.current = false;
    }
  }, [userId, currentLesson, onNavigate, explainTopic, speakBilingual]); // eslint-disable-line

  // ── listenForCommand ───────────────────────────────────────────
  const listenForCommand = useCallback(() => {
    if (!SpeechRec) {
      setError("Use Chrome for voice support.");
      setIsActive(false);
      return;
    }
    const rec = new SpeechRec();
    rec.continuous      = false;
    rec.lang            = "en-US";
    rec.interimResults  = false;
    rec.maxAlternatives = 1;

    setStatus("listening");

    rec.onresult = async (e) => {
      const said = e.results[0][0].transcript;
      setTranscript(said);
      rec.stop();
      resetInactivity();
      await processTranscript(said);
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed") {
        setError("Mic blocked — allow microphone in browser address bar.");
      } else if (e.error !== "no-speech" && e.error !== "aborted") {
        setError(`Mic error: ${e.error}`);
      }
      setStatus("idle");
      setIsActive(false);
    };

    rec.onend = () => {
      if (statusRef.current === "listening") {
        setStatus("idle");
        setIsActive(false);
      }
    };

    const autoStop = setTimeout(() => { try { rec.stop(); } catch (_) {} }, 10000);
    timersRef.current.push(autoStop);
    cmdRef.current = rec;

    try {
      rec.start();
    } catch {
      setError("Cannot start mic. Check permissions.");
      setStatus("idle");
      setIsActive(false);
    }
  }, [SpeechRec, resetInactivity, processTranscript]);

  // ── activateShiv ───────────────────────────────────────────────
  const activateShiv = useCallback(() => {
    if (isFetchingRef.current) return;
    stopAll();
    setIsActive(true);
    setError("");
    resetInactivity();
    playChime();
    setTimeout(() => listenForCommand(), 250);
  }, [stopAll, resetInactivity, playChime, listenForCommand]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
      clearTimeout(inactivityRef.current);
    };
  }, []); // eslint-disable-line

  return {
    status, transcript, response,
    activeSentIdx, typingText,
    error, isActive, currentLesson,
    activateShiv, stopRecording, stopSpeaking, stopAll,
    explainTopic, setCurrentLesson,
  };
}

async function fetchWithTimeout(url, options, ms = 15000) {
  const ctrl = new AbortController();
  const id   = setTimeout(() => ctrl.abort(), ms);
  try { return await fetch(url, { ...options, signal: ctrl.signal }); }
  finally { clearTimeout(id); }
}
