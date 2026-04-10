import os
from motor.motor_asyncio import AsyncIOMotorClient

_client = None
_db     = None

def get_db():
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        _db     = _client["shivmlai"]
    return _db

# ── Static lesson metadata (mirrors your React LESSON_SEQUENCE) ───
LESSON_META = {
    "what-is-ai":          {"title": "What is AI?",                "level": 1, "chapter": 1},
    "history-of-ai":       {"title": "History of AI",              "level": 1, "chapter": 2},
    "ai-vs-ml":            {"title": "AI vs ML vs DL",             "level": 1, "chapter": 3},
    "types-of-ai":         {"title": "Types of AI",                "level": 1, "chapter": 4},
    "ai-applications":     {"title": "AI Applications",            "level": 1, "chapter": 5},
    "vectors-matrices":    {"title": "Vectors & Matrices",         "level": 2, "chapter": 1},
    "dot-product":         {"title": "Dot Product",                "level": 2, "chapter": 2},
    "gradient-descent":    {"title": "Gradient Descent",           "level": 2, "chapter": 3},
    "probability":         {"title": "Probability",                "level": 2, "chapter": 4},
    "statistics":          {"title": "Statistics",                 "level": 2, "chapter": 5},
    "supervised-learning": {"title": "Supervised Learning",        "level": 3, "chapter": 1},
    "regression":          {"title": "Regression",                 "level": 3, "chapter": 2},
    "classification":      {"title": "Classification",             "level": 3, "chapter": 3},
    "decision-trees":      {"title": "Decision Trees",             "level": 3, "chapter": 4},
    "random-forests":      {"title": "Random Forests",             "level": 3, "chapter": 5},
    "clustering":          {"title": "Clustering",                 "level": 3, "chapter": 6},
    "evaluation-metrics":  {"title": "Evaluation Metrics",         "level": 3, "chapter": 7},
    "neural-networks":     {"title": "Neural Networks",            "level": 4, "chapter": 1},
    "activation-functions":{"title": "Activation Functions",       "level": 4, "chapter": 2},
    "backpropagation":     {"title": "Backpropagation",            "level": 4, "chapter": 3},
    "cnns":                {"title": "CNNs",                       "level": 4, "chapter": 4},
    "rnns":                {"title": "RNNs",                       "level": 4, "chapter": 5},
    "lstm":                {"title": "LSTM",                       "level": 4, "chapter": 6},
    "transformers":        {"title": "Transformers",               "level": 4, "chapter": 7},
    "llms":                {"title": "Large Language Models",      "level": 5, "chapter": 1},
    "embeddings":          {"title": "Embeddings",                 "level": 5, "chapter": 2},
    "vector-databases":    {"title": "Vector Databases",           "level": 5, "chapter": 3},
    "rag-systems":         {"title": "RAG Systems",                "level": 5, "chapter": 4},
    "diffusion-models":    {"title": "Diffusion Models",           "level": 5, "chapter": 5},
    "ai-agents":           {"title": "AI Agents",                  "level": 6, "chapter": 1},
    "planning-memory":     {"title": "Planning & Memory",          "level": 6, "chapter": 2},
    "tool-usage":          {"title": "Tool Usage",                 "level": 6, "chapter": 3},
    "multi-agent-systems": {"title": "Multi-Agent Systems",        "level": 6, "chapter": 4},
    "react-framework":     {"title": "ReAct Framework",            "level": 6, "chapter": 5},
    "agi":                 {"title": "Artificial General Intel.",  "level": 7, "chapter": 1},
    "superintelligence":   {"title": "Superintelligence",          "level": 7, "chapter": 2},
    "ai-alignment":        {"title": "AI Alignment",               "level": 7, "chapter": 3},
    "safety-ethics":       {"title": "Safety & Ethics",            "level": 7, "chapter": 4},
    "future-of-ai":        {"title": "Future of AI",               "level": 7, "chapter": 5},
}

async def get_lesson(lesson_key: str) -> dict:
    """
    Try MongoDB first, fall back to static metadata.
    When you add lesson content to DB later, it will auto-use it.
    """
    db = get_db()
    doc = await db["lessons"].find_one({"key": lesson_key})
    if doc:
        return {
            "key":     lesson_key,
            "title":   doc.get("title", ""),
            "content": doc.get("content", ""),
            "level":   doc.get("level", 0),
            "chapter": doc.get("chapter", 0),
        }

    # Fallback to static map
    meta = LESSON_META.get(lesson_key)
    if meta:
        return {
            "key":     lesson_key,
            "title":   meta["title"],
            "content": f"Lesson: {meta['title']} — Level {meta['level']}, Chapter {meta['chapter']}",
            "level":   meta["level"],
            "chapter": meta["chapter"],
        }
    return None


def resolve_lesson_from_text(text: str) -> str | None:
    """
    Try to match 'Lesson 1 Chapter 1' style text to a lesson key.
    Also handles direct topic names.
    """
    text_lower = text.lower()

    # Direct key match
    for key in LESSON_META:
        if key in text_lower or LESSON_META[key]["title"].lower() in text_lower:
            return key

    # Level + Chapter pattern: "lesson 1 chapter 2" → history-of-ai
    import re
    m = re.search(r"lesson\s*(\d+)\s*(?:chapter|ch)?\s*(\d+)?", text_lower)
    if m:
        level   = int(m.group(1))
        chapter = int(m.group(2)) if m.group(2) else 1
        for key, meta in LESSON_META.items():
            if meta["level"] == level and meta["chapter"] == chapter:
                return key

    return None
