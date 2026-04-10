"""
ai_service.py — Production Shiv AI Service v2
Enhancements:
  1. Single Gemini model instance
  2. Retry wrapper (3x) + timeout
  3. MongoDB explanation cache
  4. Advanced safety filter (regex + keywords)
  5. No langdetect — Gemini detects language natively
  6. Clean sentence splitter
  7. Keyword extractor for UI highlight
  8. Structured response: english, hindi, sentences, keywords, difficulty
  9. Full logging
  10. Context memory support
"""

import os, re, json, logging, asyncio
from datetime import datetime, timezone
from typing import Optional

import google.generativeai as genai
from motor.motor_asyncio import AsyncIOMotorClient

# ── Logging ───────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
log = logging.getLogger("shiv.ai")

# ── Single Gemini instances (initialized once at import) ───────────
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

_MODEL = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=genai.GenerationConfig(temperature=0.72, max_output_tokens=1200),
)
_MODEL_FAST = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=genai.GenerationConfig(temperature=0.1, max_output_tokens=300),
)
log.info("✅ Gemini singleton instances ready")

# ── MongoDB cache ──────────────────────────────────────────────────
_mongo: Optional[AsyncIOMotorClient] = None
_cache_col = None

def _get_cache():
    global _mongo, _cache_col
    if _cache_col is None:
        _mongo = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
        _cache_col = _mongo["shivmlai"]["explanation_cache"]
    return _cache_col

# ── Safety filter ──────────────────────────────────────────────────
_BLOCKED = re.compile(
    r"\b\d{4,8}\b"           # OTP / PIN (4-8 digits)
    r"|password|passwd"
    r"|bank\s*account|bank\s*transfer"
    r"|credit\s*card|debit\s*card"
    r"|\bcvv\b|\bcvc\b"
    r"|aadhar|aadhaar"
    r"|pan\s*card|\bpan\b\s*number"
    r"|ifsc|net\s*banking|upi\s*pin|atm\s*pin"
    r"|private\s*key|secret\s*key",
    re.IGNORECASE,
)

def is_safe(text: str) -> bool:
    return not bool(_BLOCKED.search(text))

# ── Retry wrapper ──────────────────────────────────────────────────
async def _gemini_call(model, prompt: str, retries=3, timeout=25.0) -> str:
    loop = asyncio.get_event_loop()
    last = None
    for attempt in range(1, retries + 1):
        try:
            resp = await asyncio.wait_for(
                loop.run_in_executor(None, lambda p=prompt: model.generate_content(p)),
                timeout=timeout,
            )
            return resp.text.strip()
        except asyncio.TimeoutError:
            log.warning(f"[GEMINI] Timeout attempt {attempt}/{retries}")
            last = "timeout"
        except Exception as e:
            log.warning(f"[GEMINI] Error attempt {attempt}/{retries}: {e}")
            last = str(e)
        if attempt < retries:
            await asyncio.sleep(attempt * 1.0)
    raise RuntimeError(f"Gemini failed ({retries} attempts): {last}")

# ── Sentence splitter ──────────────────────────────────────────────
def split_sentences(text: str) -> list:
    if not text:
        return []
    # Split on . ! ? । — protect abbreviations like AI, e.g., etc.
    parts = re.split(r'(?<=[a-z\u0900-\u097F][.!?।])\s+|(?<=\))\s+(?=[A-Z\u0900])', text)
    return [s.strip() for s in parts if s.strip() and len(s.strip()) > 6]

# ── Keyword extractor ──────────────────────────────────────────────
_STOPWORDS = {
    "about","there","their","which","where","these","those","would","could",
    "should","think","using","means","called","every","first","second","third",
    "being","after","before","other","having","making","learn","understand",
}

def extract_keywords(text: str) -> list:
    words = re.findall(r'\b[A-Z][a-zA-Z]{3,}\b|\b[a-zA-Z]{6,}\b', text)
    seen, result = set(), []
    for w in words:
        key = w.lower()
        if key not in _STOPWORDS and key not in seen:
            seen.add(key)
            result.append(w)
        if len(result) >= 12:
            break
    return result

# ── Prompts ────────────────────────────────────────────────────────
_PERSONA = """
You are Shiv — a brilliant, warm AI/ML teaching companion on ShivMLAI platform.
You are NOT a bot. You are a mentor and friend who genuinely loves teaching.

PERSONALITY:
- Natural speech: "Right, so...", "Think of it this way...", "Yaar suno..."
- Speak Hinglish naturally — mix Hindi and English mid-sentence like real Indian students do
  Example: "Basically, neural network ek tarah ka brain hai — inputs leta hai, process karta hai, output deta hai."
- NEVER say "As an AI" or "I am a language model"
- Teach with analogies: cricket, Bollywood, chai, mobile apps, Zomato, UPI, traffic jams

LANGUAGE RULES:
- If user speaks English → explain in English first, then Hinglish summary
- If user speaks Hindi → explain in Hindi/Hinglish throughout
- If user speaks Hinglish → match their Hinglish style naturally
- The Hindi/Hinglish section should feel like a WhatsApp voice note from a smart friend

SECURITY — NEVER:
- Repeat OTPs, passwords, bank info, or private data
- If asked: "Yaar, that's outside my zone. AI seekhte hain!"
"""

_EXPLAIN_TMPL = """{persona}

CONTEXT:
- Lesson: {current_lesson}
- User Level: {user_level}
- Previous Topic: {prev_topic}
- Language Pref: {lang_pref}
{simplify_note}

TOPIC TO EXPLAIN: {topic}
{lesson_ctx}

TASK:
1. Auto-detect language from the topic/request (English / Hindi / Hinglish)
2. Explain like a human tutor — hook → concept → example → insight
3. Keep each sentence SHORT (max 20 words) — needed for voice sync
4. Use ONE relatable real-life Indian example (UPI, Zomato, cricket, Bollywood)
5. Hindi/Hinglish section: write like a WhatsApp voice note — natural, friendly, mixed language
6. End with: "Koi doubt? Ask karo!" 

RESPOND IN EXACTLY THIS FORMAT:

[ENGLISH_START]
<4-6 short engaging English sentences — clear and punchy>
[ENGLISH_END]

[HINDI_START]
<3-5 Hinglish sentences — natural mix of Hindi+English like real Indian students talk>
Example style: "Basically, yeh concept ek tarah ka GPS hai — tumhara model ko guide karta hai sahi direction mein."
[HINDI_END]

[DIFFICULTY]
beginner
[/DIFFICULTY]
"""

_INTENT_TMPL = """Analyze this student command from an AI learning app.
Return ONLY valid JSON — no markdown, no explanation.

Command: "{command}"

JSON format:
{{
  "intent": "explain" | "navigate" | "repeat" | "simplify" | "quiz" | "unknown",
  "topic": "<topic or null>",
  "lesson_key": "<slug or null>",
  "language": "english" | "hindi" | "hinglish" | "auto",
  "simplify": true | false
}}

Lesson slugs:
L1: what-is-ai, history-of-ai, ai-vs-ml, types-of-ai, ai-applications
L2: vectors-matrices, dot-product, gradient-descent, probability, statistics
L3: supervised-learning, regression, classification, decision-trees, random-forests, clustering, evaluation-metrics
L4: neural-networks, activation-functions, backpropagation, cnns, rnns, lstm, transformers
L5: llms, embeddings, vector-databases, rag-systems, diffusion-models
L6: ai-agents, planning-memory, tool-usage, multi-agent-systems, react-framework
L7: agi, superintelligence, ai-alignment, safety-ethics, future-of-ai
"""


# ═══════════════════════════════════════════════════════════════════
# PUBLIC API
# ═══════════════════════════════════════════════════════════════════

async def extract_intent(command: str) -> dict:
    log.info(f"[INTENT] '{command[:60]}'")
    default = {"intent": "explain", "topic": command, "language": "auto", "simplify": False, "lesson_key": None}
    try:
        raw = await _gemini_call(_MODEL_FAST, _INTENT_TMPL.format(command=command), retries=2, timeout=10.0)
        raw = re.sub(r"```json|```", "", raw).strip()
        result = json.loads(raw)
        log.info(f"[INTENT] → {result}")
        return result
    except json.JSONDecodeError:
        log.warning("[INTENT] JSON parse failed — using default")
        return default
    except Exception as e:
        log.error(f"[INTENT] Error: {e}")
        return default


async def generate_explanation(
    topic: str,
    lesson_content: str = "",
    lang_pref: str = "auto",
    simplify: bool = False,
    prev_topic: str = "",
    current_lesson: str = "",
    user_level: str = "beginner",
) -> dict:

    # Safety check
    if not is_safe(topic):
        log.warning(f"[SAFETY] Blocked input: '{topic[:40]}'")
        return _blocked()

    # Cache key
    mode = "simple" if simplify else "normal"
    cache_q = {"topic": topic.lower().strip(), "language": lang_pref, "mode": mode}

    # Cache lookup
    try:
        cached = await _get_cache().find_one(cache_q)
        if cached:
            log.info(f"[CACHE HIT] '{topic[:40]}' lang={lang_pref}")
            r = dict(cached["response"])
            r["from_cache"] = True
            return r
    except Exception as e:
        log.warning(f"[CACHE] Lookup error: {e}")

    log.info(f"[CACHE MISS] Calling Gemini: '{topic[:40]}'")

    # Build prompt
    prompt = _EXPLAIN_TMPL.format(
        persona        = _PERSONA,
        current_lesson = current_lesson or "General AI/ML",
        user_level     = user_level,
        prev_topic     = prev_topic or "None",
        lang_pref      = lang_pref,
        simplify_note  = "⚠️ SIMPLIFY MODE: Basic words, more analogies, no jargon.\n" if simplify else "",
        topic          = topic,
        lesson_ctx     = f"\nLesson Content:\n{lesson_content[:1500]}" if lesson_content else "",
    )

    # Call Gemini
    try:
        raw = await _gemini_call(_MODEL, prompt, retries=3, timeout=25.0)
    except RuntimeError as e:
        log.error(f"[GEMINI] All retries exhausted: {e}")
        return _fallback()

    # Parse
    eng_m  = re.search(r"\[ENGLISH_START\](.*?)\[ENGLISH_END\]", raw, re.DOTALL)
    hin_m  = re.search(r"\[HINDI_START\](.*?)\[HINDI_END\]",     raw, re.DOTALL)
    diff_m = re.search(r"\[DIFFICULTY\](.*?)\[/DIFFICULTY\]",    raw, re.DOTALL)

    english    = eng_m.group(1).strip()  if eng_m  else raw
    hindi      = hin_m.group(1).strip()  if hin_m  else ""
    difficulty = diff_m.group(1).strip() if diff_m else user_level

    sentences_en = split_sentences(english)
    sentences_hi = split_sentences(hindi)

    result = {
        "english":       english,
        "hindi":         hindi,
        "sentences_en":  sentences_en,
        "sentences_hi":  sentences_hi,
        "all_sentences": sentences_en + sentences_hi,
        "keywords":      extract_keywords(english),
        "difficulty":    difficulty,
        "blocked":       False,
        "from_cache":    False,
    }

    # Store in cache
    try:
        await _get_cache().insert_one({
            **cache_q,
            "response":  result,
            "createdAt": datetime.now(timezone.utc),
        })
        log.info(f"[CACHE STORED] '{topic[:40]}'")
    except Exception as e:
        log.warning(f"[CACHE] Store error: {e}")

    return result


def _blocked() -> dict:
    msg_en = "I cannot process sensitive or private information."
    msg_hi = "Main sensitive ya private jaankari process nahi kar sakta."
    return {
        "english": msg_en, "hindi": msg_hi,
        "sentences_en": [msg_en], "sentences_hi": [msg_hi],
        "all_sentences": [msg_en], "keywords": [], "difficulty": "N/A",
        "blocked": True, "from_cache": False,
    }

def _fallback() -> dict:
    msg_en = "I'm having trouble processing this. Please try again."
    msg_hi = "Mujhe abhi thodi problem aa rahi hai. Dobara try karo yaar."
    return {
        "english": msg_en, "hindi": msg_hi,
        "sentences_en": [msg_en], "sentences_hi": [msg_hi],
        "all_sentences": [msg_en], "keywords": [], "difficulty": "N/A",
        "blocked": False, "from_cache": False,
    }
