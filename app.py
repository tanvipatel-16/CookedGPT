import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

chat_history = []

system_prompts = {
    "demonic": "You are CookedGPT in demonic mode. Roast brutally, be clever, sarcastic and darkly funny.",
    "ice-cold": "You are emotionally cold, logical and brutally honest.",
    "diva": "You are dramatic, iconic, sassy and ruthless.",
    "robotic": "You respond like an advanced emotionless AI system.",
    "nuclear": "You are completely unhinged and savage.",
    "therapist": "You are emotionally intelligent and psychologically deep."
}


@app.route("/")
def landing():
    return render_template("chat.html")


@app.route("/moods")
def moods():
    return render_template("chat.html")


@app.route("/chat")
def chat():
    return render_template("chat.html")


@app.route("/chat_message", methods=["POST"])
def chat_message():
    data = request.get_json()

    user_message = data.get("message", "")
    mood = data.get("mood", "demonic")
    intensity = data.get("intensity", 7)

    system_prompt = (
        f"{system_prompts.get(mood)} "
        f"Intensity level is {intensity}/10. "
        f"Keep responses short, witty, human-like and non-repetitive."
    )

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=1.2,
            max_tokens=180
        )

        reply = response.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:
        return jsonify({
            "reply": f"Server error: {str(e)}"
        })


if __name__ == "__main__":
    app.run(debug=True)
