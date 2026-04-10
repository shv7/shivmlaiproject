"""
main.py — ShivMLAI Voice Agent API v2
Routes:
  POST /voice-input    — transcript → intent (Gemini)
  POST /explain        — topic → bilingual explanation (Gemini + cache)
  GET  /tts-config     — browser TTS settings
  GET  /lesson-fetch/:key
  GET  /lessons
  GET  /health
"""

import os, logging
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

from services.ai_service     import extract_intent, generate_explanation
from services.voice_service  import get_tts_config
from services.lesson_service import get_lesson, resolve_lesson_from_text, LESSON_META

# ── Logging ───────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("shiv.api")

app = FastAPI(title="ShivMLAI Voice Agent", version="2.0.0")

# Allow all origins in prod (Railway) or specific in dev
_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
if os.getenv("FRONTEND_URL"):
    _origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── MongoDB for analytics + sessions ──────────────────────────────
_mongo = None
def get_db():
    global _mongo
    if _mongo is None:
        _mongo = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
    return _mongo["shivmlai"]

# ── In-memory session store ────────────────────────────────────────
_sessions: dict = {}

def get_session(user_id: str) -> dict:
    if user_id not in _sessions:
        _sessions[user_id] = {
            "current_lesson": "",
            "lang_pref":      "auto",
            "last_topic":     "",
            "last_response":  "",
            "user_level":     "beginner",
            "preferred_lang": "auto",
        }
    return _sessions[user_id]


# ═══════════════════════════════════════════════════════════════════
# ROUTE 1 — /voice-input
# Browser sends transcript → Gemini extracts intent
# ═══════════════════════════════════════════════════════════════════
class VoiceInputRequest(BaseModel):
    transcript: str
    user_id:    str = "guest"

@app.post("/voice-input")
async def voice_input(req: VoiceInputRequest):
    if not req.transcript.strip():
        return {"transcript": "", "intent": None, "error": "Empty transcript"}

    log.info(f"[/voice-input] user={req.user_id} text='{req.transcript[:60]}'")

    intent     = await extract_intent(req.transcript)
    lesson_key = intent.get("lesson_key") or resolve_lesson_from_text(req.transcript)
    if lesson_key:
        intent["lesson_key"] = lesson_key

    session = get_session(req.user_id)
    if lesson_key:
        session["current_lesson"] = lesson_key
    if intent.get("language") not in (None, "auto"):
        session["lang_pref"] = intent["language"]

    # Track analytics
    try:
        await get_db()["analytics"].insert_one({
            "type":       "voice_input",
            "user_id":    req.user_id,
            "transcript": req.transcript,
            "intent":     intent.get("intent"),
            "topic":      intent.get("topic"),
            "language":   intent.get("language"),
            "ts":         datetime.now(timezone.utc),
        })
    except Exception:
        pass

    return {
        "transcript": req.transcript,
        "intent":     intent,
        "lesson_key": lesson_key,
        "session":    session,
    }


# ═══════════════════════════════════════════════════════════════════
# ROUTE 2 — /explain
# Returns full bilingual explanation + sentences + keywords
# ═══════════════════════════════════════════════════════════════════
class ExplainRequest(BaseModel):
    topic:      str
    lesson_key: str  = ""
    lang_pref:  str  = "auto"
    simplify:   bool = False
    user_id:    str  = "guest"

@app.post("/explain")
async def explain(req: ExplainRequest):
    log.info(f"[/explain] user={req.user_id} topic='{req.topic[:50]}'")

    session = get_session(req.user_id)

    # Fetch lesson content
    lesson_content, lesson_title = "", req.topic
    if req.lesson_key:
        lesson = await get_lesson(req.lesson_key)
        if lesson:
            lesson_content = lesson.get("content", "")
            lesson_title   = lesson.get("title", req.topic)
            session["current_lesson"] = req.lesson_key

    # Handle repeat / simplify intents using session
    topic = lesson_title or req.topic
    if req.topic.lower() in ("repeat", "explain again", "phir se", "dobara batao"):
        topic = session.get("last_topic") or topic

    lang = req.lang_pref if req.lang_pref != "auto" else session.get("lang_pref", "auto")

    result = await generate_explanation(
        topic          = topic,
        lesson_content = lesson_content,
        lang_pref      = lang,
        simplify       = req.simplify,
        prev_topic     = session.get("last_topic", ""),
        current_lesson = session.get("current_lesson", ""),
        user_level     = session.get("user_level", "beginner"),
    )

    # Update session memory
    session["last_topic"]    = topic
    session["last_response"] = result.get("english", "")[:300]

    # Track analytics
    try:
        await get_db()["analytics"].insert_one({
            "type":       "explain",
            "user_id":    req.user_id,
            "topic":      topic,
            "language":   lang,
            "simplify":   req.simplify,
            "from_cache": result.get("from_cache", False),
            "ts":         datetime.now(timezone.utc),
        })
    except Exception:
        pass

    return {
        "topic":      topic,
        "lesson_key": req.lesson_key,
        **result,
    }


# ═══════════════════════════════════════════════════════════════════
# ROUTE 3 — /tts-config (browser TTS settings)
# ═══════════════════════════════════════════════════════════════════
@app.get("/tts-config")
async def tts_config(language: str = "english"):
    return get_tts_config(language)


# ═══════════════════════════════════════════════════════════════════
# ROUTE 4 — /lesson-fetch/:key
# ═══════════════════════════════════════════════════════════════════
@app.get("/lesson-fetch/{lesson_key}")
async def lesson_fetch(lesson_key: str):
    lesson = await get_lesson(lesson_key)
    if not lesson:
        raise HTTPException(404, f"Lesson '{lesson_key}' not found")
    return lesson

@app.get("/lessons")
async def all_lessons():
    return [{"key": k, **v} for k, v in LESSON_META.items()]


# ═══════════════════════════════════════════════════════════════════
# ROUTE 5 — /analytics (admin only, no auth for now)
# ═══════════════════════════════════════════════════════════════════
@app.get("/analytics")
async def analytics():
    db = get_db()
    pipeline = [
        {"$group": {"_id": "$topic", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 20},
    ]
    top_topics = await db["analytics"].aggregate(pipeline).to_list(20)

    lang_pipeline = [
        {"$group": {"_id": "$language", "count": {"$sum": 1}}},
    ]
    lang_usage = await db["analytics"].aggregate(lang_pipeline).to_list(10)

    cache_pipeline = [
        {"$group": {"_id": "$from_cache", "count": {"$sum": 1}}},
    ]
    cache_stats = await db["analytics"].aggregate(cache_pipeline).to_list(5)

    return {
        "top_topics": [{"topic": t["_id"], "count": t["count"]} for t in top_topics if t["_id"]],
        "language_usage": {str(l["_id"]): l["count"] for l in lang_usage},
        "cache_stats":    {str(c["_id"]): c["count"] for c in cache_stats},
    }


@app.get("/health")
async def health():
    return {"status": "Shiv is online ✅", "version": "2.0.0", "model": "gemini-1.5-flash (free)"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
