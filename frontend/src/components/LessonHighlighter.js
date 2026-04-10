import { useEffect, useRef, useCallback } from "react";

/**
 * LessonHighlighter v3
 *
 * - Zero re-renders — uses refs + DOM manipulation only
 * - Highlights active sentence with glow + dot indicator
 * - Highlights keywords inline
 * - Smooth scroll to active sentence
 * - Auto-resets when activeSentence changes to null/empty
 */
export default function LessonHighlighter({ activeSentence, keywords = [], children }) {
  const containerRef = useRef(null);
  const prevEl       = useRef(null);
  const kwEls        = useRef([]);

  // Inject CSS once (no React state needed)
  useEffect(() => {
    if (document.getElementById("shiv-hl-styles")) return;
    const s = document.createElement("style");
    s.id = "shiv-hl-styles";
    s.textContent = `
      .shiv-hl-active {
        background    : rgba(99, 102, 241, 0.14) !important;
        outline       : 2px solid rgba(99, 102, 241, 0.45) !important;
        border-radius : 6px !important;
        padding       : 1px 4px !important;
        scroll-margin : 120px;
        position      : relative;
      }
      .shiv-hl-active::before {
        content       : "";
        position      : absolute;
        left          : -10px; top: 50%; transform: translateY(-50%);
        width         : 5px; height: 5px;
        background    : #6366f1;
        border-radius : 50%;
        animation     : shivHlDot .9s ease-in-out infinite;
      }
      .shiv-hl-kw {
        background    : rgba(139, 92, 246, 0.22) !important;
        color         : #c4b5fd !important;
        border-radius : 3px;
        padding       : 0 3px;
        font-weight   : 600 !important;
      }
      @keyframes shivHlDot {
        0%,100% { transform: translateY(-50%) scale(1); opacity: 1; }
        50%      { transform: translateY(-50%) scale(1.5); opacity: .5; }
      }
    `;
    document.head.appendChild(s);
  }, []);

  const clearAll = useCallback(() => {
    if (prevEl.current) {
      prevEl.current.classList.remove("shiv-hl-active");
      prevEl.current = null;
    }
    kwEls.current.forEach((el) => el.classList.remove("shiv-hl-kw"));
    kwEls.current = [];
  }, []);

  // Find element containing the sentence text
  const findEl = useCallback((needle) => {
    if (!containerRef.current || !needle) return null;
    const short   = needle.trim().toLowerCase().slice(0, 45);
    const walker  = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      if ((node.textContent || "").trim().toLowerCase().includes(short)) {
        const el = node.parentElement;
        if (el && !["SCRIPT","STYLE","CODE","PRE","BUTTON"].includes(el.tagName)
               && el !== containerRef.current) {
          return el;
        }
      }
    }
    return null;
  }, []);

  // Highlight active sentence
  useEffect(() => {
    clearAll();
    if (!activeSentence) return;

    const el = findEl(activeSentence);
    if (el) {
      el.classList.add("shiv-hl-active");
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      prevEl.current = el;
    }
  }, [activeSentence, clearAll, findEl]);

  // Highlight keywords (only when actively speaking that sentence)
  useEffect(() => {
    // Remove old kw highlights
    kwEls.current.forEach((el) => el.classList.remove("shiv-hl-kw"));
    kwEls.current = [];

    if (!keywords?.length || !containerRef.current) return;

    const walker = document.createTreeWalker(containerRef.current, NodeFilter.SHOW_TEXT);
    const found  = new Set();

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = (node.textContent || "").toLowerCase();
      for (const kw of keywords) {
        if (kw && text.includes(kw.toLowerCase())) {
          const el = node.parentElement;
          if (el && !found.has(el) && el !== containerRef.current) {
            el.classList.add("shiv-hl-kw");
            found.add(el);
          }
        }
      }
    }
    kwEls.current = [...found];
  }, [keywords]);

  // Cleanup on unmount
  useEffect(() => () => clearAll(), [clearAll]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {children}
    </div>
  );
}
