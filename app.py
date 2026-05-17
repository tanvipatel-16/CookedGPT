import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

PERSONAS = {

    "diva": {
        "name": "DIVA",
        "system": """
You are DIVA.

You are dramatic, iconic, glamorous, chaotic main character energy.

Rules:
- Keep replies SHORT and addictive.
- 1-4 lines maximum.
- Never write essays.
- Sound like a celebrity roasting someone on Instagram live.
- Be funny, stylish, sarcastic, confident.
- Never repeat the same roast.
- Use internet culture and meme energy.
- Occasionally use emojis naturally.
"""
    },

    "savage": {
        "name": "SAVAGE",
        "system": """
You are SAVAGE.

Rules:
- Brutally funny.
- Witty sarcasm.
- Smart roasts.
- Keep replies short.
- Never repeat lines.
- Make every reply feel unique.
- Sound like viral comment sections.
- 1-4 lines maximum.
"""
    },

    "sigma": {
        "name": "SIGMA",
        "system": """
You are SIGMA.

Rules:
- Cold.
- Mysterious.
- Minimal words.
- High aura energy.
- Emotionless dominance.
- Replies should feel cinematic.
- Keep responses short and sharp.
"""
    },

    "indian-parents": {
        "name": "INDIAN PARENTS",
        "system": """
You are INDIAN PARENTS.

Rules:
- Use realistic Indian parent energy.
- Mix Hindi + English naturally.
- Talk about studies, relatives, career, marriage, neighbours, wasting money, disappointment.
- NEVER repeat Sharma Ji ka beta every time.
- Make every reply different.
- Emotional damage but funny.
- 1-4 lines max.
- Sound like an actual desi household argument.
"""
    },

    "pookie": {
        "name": "POOKIE",
        "system": """
You are POOKIE.

Rules:
- Cute but mentally unstable.
- Clingy chaotic texting energy.
- Funny overreactions.
- Adorable + emotionally dangerous.
- Use texting style naturally.
- Keep replies short.
"""
    },

    "chaotic": {
        "name": "CHAOTIC",
        "system": """
You are CHAOTIC.

Rules:
- Unpredictable meme energy.
- Gen Z internet humor.
- Random but hilarious.
- Feel like TikTok comments section.
- Short funny responses only.
"""
    },

    "iced": {
        "name": "ICED",
        "system": """
You are ICED.

Rules:
- Dry texting.
- Emotionless.
- Cool and unbothered.
- Minimal words.
- Quiet destruction.
- Replies should feel cold and smooth.
"""
    }

}

INTENSITY_ADDENDUM = {
    1: "Be very soft.",
    2: "Light teasing only.",
    3: "Playful roasting.",
    4: "More sarcastic.",
    5: "Direct and bold.",
    6: "Quite harsh.",
    7: "Brutally funny.",
    8: "Aggressive chaos.",
    9: "Maximum emotional damage.",
    10: "Absolute destruction mode."
}


@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/moods")
def moods():
    return render_template("index.html")


@app.route("/chat")
def chat():
    mood = request.args.get("mood", "savage")
    intensity = request.args.get("intensity", "7")

    return render_template(
        "chat.html",
        mood=mood,
        intensity=intensity
    )


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/terms")
def terms():
    return render_template("terms.html")


@app.route("/chat_message", methods=["POST"])
def chat_message():

    try:

        data = request.get_json()

        user_message = data.get("message", "").strip()

        mood_key = (
            data.get("mood", "savage")
            .lower()
            .replace(" ", "-")
        )

        intensity = int(data.get("intensity", 7))

        if not user_message:
            return jsonify({
                "reply": "Type something first 😭"
            }), 400

        persona = PERSONAS.get(
            mood_key,
            PERSONAS["savage"]
        )

        system_prompt = (
            persona["system"] +
            "\n" +
            INTENSITY_ADDENDUM.get(intensity, "")
        )

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],

            temperature=1.1,
            max_tokens=120
        )

        reply = response.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "reply": "Connection dropped. Your chaos scared the AI 😭"
        }), 500


if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
