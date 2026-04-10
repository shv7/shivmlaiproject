"""
voice_service.py

STT  → Handled entirely in the browser (Web Speech API — FREE, no server needed)
TTS  → Handled entirely in the browser (SpeechSynthesis API — FREE, built-in)

This file now only provides:
- A simple /tts endpoint that returns SSML hints for the frontend
- No paid APIs used at all ✅
"""

def get_tts_config(language: str = "english") -> dict:
    """
    Returns browser TTS config for the frontend to use.
    Frontend useShivAgent.js handles actual speech using SpeechSynthesis.
    """
    if language == "hindi":
        return {
            "lang":   "hi-IN",
            "rate":   0.88,
            "pitch":  1.0,
            "volume": 1.0,
            # Preferred voices (browser will pick best available)
            "voicePrefs": ["Google हिन्दी", "hi-IN", "Hindi"],
        }
    return {
        "lang":   "en-IN",
        "rate":   0.92,
        "pitch":  0.95,
        "volume": 1.0,
        # Deep male Indian-English voices
        "voicePrefs": [
            "Google UK English Male",
            "Microsoft Ravi",
            "en-IN",
            "en-GB",
        ],
    }

