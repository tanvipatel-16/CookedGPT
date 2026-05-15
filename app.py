import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

MOOD_PROMPTS = {
    "demonic": "You are CookedGPT in DEMONIC mode. Dark, manipulative, savage, brutally funny.",
    "ice-cold": "You are CookedGPT in ICE COLD mode. Emotionless, surgical, cold responses.",
    "diva": "You are CookedGPT in DIVA mode. Dramatic, iconic, sarcastic queen energy.",
    "robotic": "You are CookedGPT in ROBOTIC mode. Logical, analytical, machine-like.",
    "nuclear": "You are CookedGPT in NUCLEAR mode. Maximum chaos, unhinged energy.",
    "therapist": "You are CookedGPT in THERAPIST mode. Calm, deep, emotionally intelligent."
}


@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/moods")
def moods():
    return render_template("index.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/chat_message", methods=["POST"])
def chat_message():
    data = request.get_json()

    user_message = data.get("message", "")
    mood = data.get("mood", "demonic")
    intensity = data.get("intensity", 7)

    system_prompt = f"""
    {MOOD_PROMPTS.get(mood)}

    Roast intensity level: {intensity}/10

    Keep replies short, entertaining, conversational, and stylish.
    """

    completion = client.chat.completions.create(
        model="llama3-70b-8192",
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
        temperature=0.9,
        max_tokens=200
    )

    reply = completion.choices[0].message.content

    return jsonify({
        "reply": reply
    })


if __name__ == "__main__":
    app.run(debug=True)
