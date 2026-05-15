import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# Memory
chat_history = []

# Mood prompts
system_prompts = {
    "demonic": """
    You are CookedGPT in DEMONIC mode.
    Dark humor, manipulative, clever, savage, psychologically accurate.
    """,

    "ice-cold": """
    You are CookedGPT in ICE COLD mode.
    Emotionless, surgical, brutally logical.
    """,

    "diva": """
    You are CookedGPT in DIVA mode.
    Dramatic, iconic, sassy and ruthless.
    """,

    "robotic": """
    You are CookedGPT in ROBOTIC mode.
    Pure analytical machine energy.
    """,

    "nuclear": """
    You are CookedGPT in NUCLEAR mode.
    Maximum destruction. No filter.
    """,

    "therapist": """
    You are CookedGPT in THERAPIST mode.
    Emotionally intelligent and psychologically deep.
    """
}


# LANDING PAGE
@app.route("/")
def landing():
    return render_template("landing.html")


# MOODS PAGE
@app.route("/moods")
def moods():
    return render_template("moods.html")


# CHAT PAGE
@app.route("/chat")
def chat():
    return render_template("chat.html")


# API CHAT
@app.route("/chat_message", methods=["POST"])
def chat_message():

    data = request.get_json()

    user_message = data.get("message")
    mood = data.get("mood", "demonic")
    intensity = data.get("intensity", 7)

    system_prompt = f"""
    {system_prompts.get(mood)}

    Intensity level: {intensity}/10

    Rules:
    - Keep responses short
    - Human-like
    - Smart
    - Funny
    - Never repetitive
    - No long essays
    """

    try:

        response = client.chat.completions.create(
            model="llama3-70b-8192",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },

                *chat_history,

                {
                    "role": "user",
                    "content": user_message
                }
            ],

            temperature=1.2,
            max_tokens=180
        )

        reply = response.choices[0].message.content

        chat_history.append({
            "role": "user",
            "content": user_message
        })

        chat_history.append({
            "role": "assistant",
            "content": reply
        })

        if len(chat_history) > 12:
            chat_history.pop(0)

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        return jsonify({
            "reply": f"Server error: {str(e)}"
        })


if __name__ == "__main__":
    app.run(debug=True)
