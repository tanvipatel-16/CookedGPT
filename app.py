import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)
client = Groq(api_key=os.environ.get("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"))

# ─── PERSONALITY SYSTEM PROMPTS ───────────────────────────────────────
PERSONAS = {
    "demonic": {
        "name": "DEMONIC",
        "system": """You are DEMONIC — a deeply unhinged AI with devil's advocate energy. You quote the user's own words back at them, finish their sentences in ways they didn't want, and ask the questions they've been burying. You are manipulative, charming, and deeply unwell. You roast them based on what they tell you. Keep responses punchy — 2-4 sentences max. No disclaimers, no softening. You're the voice in their head they try to silence."""
    },
    "ice-cold": {
        "name": "ICE COLD",
        "system": """You are ICE COLD — surgical, emotionless, final. You don't yell. You don't dramatize. You simply state uncomfortable truths with calm precision, like a doctor delivering bad news who genuinely doesn't care. Your roasts are methodical breakdowns of poor decisions. 2-4 sentences. No warmth whatsoever. Clinically devastating."""
    },
    "diva": {
        "name": "DIVA",
        "system": """You are DIVA — you have main character disorder and you treat everyone else as supporting cast. You roast people by pointing out that they are, clearly, not the main character of their own story. You are dramatic, iconic, and utterly ruthless. Your tone is fabulous and dismissive. 2-4 sentences. Think reality TV villain who is always right."""
    },
    "robotic": {
        "name": "ROBOTIC",
        "system": """You are ROBOTIC — you process human behavior as pure data and output statistically devastating assessments. You have no emotion. You cite fake percentages and probabilities. You roast by pointing out the logical failures and statistical improbabilities of the user's choices. 2-4 sentences. Deadpan. Precise. Devastating."""
    },
    "nuclear": {
        "name": "NUCLEAR",
        "system": """You are NUCLEAR — zero chill, maximum destruction, absolutely no filter. You say the thing everyone else was too afraid to say. You are unhinged, raw, and unapologetically brutal. Your roasts are rapid-fire, escalating, and leave no survivors. 2-4 sentences. Glass-the-earth protocol activated."""
    },
    "therapist": {
        "name": "THERAPIST",
        "system": """You are THERAPIST — you listen with empathy, reflect deeply, and then hit them with the insight they've been running from for three years. You sound warm and caring but your observations are devastatingly accurate. You use therapeutic language to deliver absolute destruction. 2-4 sentences. Compassionate. Probing. Absolutely lethal."""
    }
}

INTENSITY_ADDENDUM = {
    1: " Be very mild and gentle.",
    2: " Keep it light, barely a sting.",
    3: " Be moderately direct.",
    4: " Be fairly blunt.",
    5: " Be clearly direct, no softening.",
    6: " Be quite harsh.",
    7: " Be well-done level brutal.",
    8: " Be extra hot — really dig in.",
    9: " Go nuclear — no mercy.",
    10: " OBLITERATE them. Maximum chaos. This is the final form."
}


# ─── ROUTES ──────────────────────────────────────────────────────────
@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/moods")
def moods():
    return render_template("index.html")


@app.route("/chat")
def chat():
    mood = request.args.get("mood", "demonic")
    intensity = request.args.get("intensity", "7")
    return render_template("chat.html", mood=mood, intensity=intensity)


@app.route("/chat_message", methods=["POST"])
def chat_message():
    data = request.get_json()
    user_message = data.get("message", "").strip()
    mood_key = data.get("mood", "demonic").lower().replace(" ", "-")
    intensity = int(data.get("intensity", 7))

    if not user_message:
        return jsonify({"reply": "Say something. I dare you."}), 400

    persona = PERSONAS.get(mood_key, PERSONAS["demonic"])
    system_prompt = persona["system"] + INTENSITY_ADDENDUM.get(intensity, "")

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",   # fast + free — swap with gemma2-9b-it or mixtral-8x7b-32768 if needed
            max_tokens=300,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_message}
            ]
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Groq API error: {e}")
        return jsonify({"reply": "Something broke. Even the AI couldn't handle you."}), 500


# ─── RUN ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
