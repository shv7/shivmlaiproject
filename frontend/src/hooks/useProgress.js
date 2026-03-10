import { useState, useCallback } from "react";

const STORAGE_KEY = "shivmlaiProgress";

/* ── All lessons grouped by level ───────────────────────────────── */
export const LEVEL_MAP = {
  1: ["what-is-ai","history-of-ai","ai-vs-ml-dl","types-of-ai","ai-applications"],
  2: ["vectors-matrices","dot-product","gradient-descent","probability","statistics"],
  3: ["supervised-learning","regression","classification","decision-trees","random-forests","clustering","evaluation-metrics","libraries-and-project"],
  4: ["neural-networks","activation-functions","backpropagation","cnns","rnns","lstm","transformers"],
  5: ["large-language-models","embeddings","vector-databases","rag-systems","diffusion-models"],
  6: ["ai-agents","planning-memory","tool-usage","multi-agent-systems","react-framework"],
  7: ["artificial-general-intelligence","superintelligence","ai-alignment","safety-ethics","future-of-ai"],
};

export const LESSON_NAMES = {
  "what-is-ai":                     "What is AI",
  "history-of-ai":                  "History of AI",
  "ai-vs-ml-dl":                    "AI vs ML vs DL",
  "types-of-ai":                    "Types of AI",
  "ai-applications":                "AI Applications",
  "vectors-matrices":               "Vectors & Matrices",
  "dot-product":                    "Dot Product",
  "gradient-descent":               "Gradient Descent",
  "probability":                    "Probability",
  "statistics":                     "Statistics",
  "supervised-learning":            "Supervised Learning",
  "regression":                     "Regression",
  "classification":                 "Classification",
  "decision-trees":                 "Decision Trees",
  "random-forests":                 "Random Forests",
  "clustering":                     "Clustering",
  "evaluation-metrics":             "Evaluation Metrics",
  "libraries-and-project":          "ML Libraries & Project",
  "neural-networks":                "Neural Networks",
  "activation-functions":           "Activation Functions",
  "backpropagation":                "Backpropagation",
  "cnns":                           "CNNs",
  "rnns":                           "RNNs",
  "lstm":                           "LSTM",
  "transformers":                   "Transformers",
  "large-language-models":          "Large Language Models",
  "embeddings":                     "Embeddings",
  "vector-databases":               "Vector Databases",
  "rag-systems":                    "RAG Systems",
  "diffusion-models":               "Diffusion Models",
  "ai-agents":                      "AI Agents",
  "planning-memory":                "Planning & Memory",
  "tool-usage":                     "Tool Usage",
  "multi-agent-systems":            "Multi-Agent Systems",
  "react-framework":                "ReAct Framework",
  "artificial-general-intelligence":"Artificial General Intelligence",
  "superintelligence":              "Superintelligence",
  "ai-alignment":                   "AI Alignment",
  "safety-ethics":                  "Safety & Ethics",
  "future-of-ai":                   "Future of AI",
};

export const LEVEL_COLORS = {
  1:"#10b981", 2:"#4f46e5", 3:"#f59e0b",
  4:"#7c3aed", 5:"#ec4899", 6:"#f97316", 7:"#ef4444",
};
export const LEVEL_TITLES = {
  1:"AI Fundamentals", 2:"Math for AI", 3:"Machine Learning",
  4:"Deep Learning", 5:"Modern AI Systems", 6:"Agentic AI", 7:"AGI & Future",
};

/* Flat ordered lesson list used for Prev/Next navigation */
export const LESSON_SEQUENCE = Object.values(LEVEL_MAP).flat();

/** Given a lesson key, return its level number (1-7) */
export function getLevelForLesson(key) {
  for (const [lvl, lessons] of Object.entries(LEVEL_MAP)) {
    if (lessons.includes(key)) return Number(lvl);
  }
  return null;
}

/* ── Hook ────────────────────────────────────────────────────────── */
function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return new Set(Array.isArray(data.completedLessons) ? data.completedLessons : []);
  } catch { return new Set(); }
}

function saveCompleted(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedLessons: [...set] }));
}

export function useProgress() {
  const [completed, setCompleted] = useState(loadCompleted);

  const markComplete = useCallback((lessonKey) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.add(lessonKey);
      saveCompleted(next);
      return next;
    });
  }, []);

  const isComplete = useCallback((lessonKey) => completed.has(lessonKey), [completed]);

  /** Returns { done, total, pct } for a given level number */
  const getLevelProgress = useCallback((levelNum) => {
    const lessons = LEVEL_MAP[levelNum] || [];
    const done = lessons.filter(k => completed.has(k)).length;
    return { done, total: lessons.length, pct: lessons.length ? Math.round(done / lessons.length * 100) : 0 };
  }, [completed]);

  /** Returns { done, total, pct } across all levels */
  const getOverallProgress = useCallback(() => {
    const allLessons = LESSON_SEQUENCE;
    const done = allLessons.filter(k => completed.has(k)).length;
    return { done, total: allLessons.length, pct: Math.round(done / allLessons.length * 100) };
  }, [completed]);

  /** How many full levels are complete */
  const completedLevels = Object.keys(LEVEL_MAP).filter(lvl => {
    const { pct } = getLevelProgress(Number(lvl));
    return pct === 100;
  }).length;

  return { completed, markComplete, isComplete, getLevelProgress, getOverallProgress, completedLevels };
}
