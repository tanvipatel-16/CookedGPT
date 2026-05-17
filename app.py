from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

app = Flask(__name__)

# GROQ API

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = Groq(
    api_key=GROQ_API_KEY
)

# PAGE 1

@app.route("/")
def landing():
    return render_template("landing.html")

# PAGE 2

@app.route("/moods")
def moods():
    return render_template("index.html")

# PAGE 3

@app.route("/chatpage")
def chatpage():
    return render_template("chat.html")

# CHAT API

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message")

    mood = data.get("mood", "Savage")

    try:

        completion = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[

                {
                    "role": "system",
                    "content": f"""
                    You are CookedGPT.

                    Your personality mood is:
                    {mood}

                    Be funny, emotional,
                    chaotic, savage,
                    dramatic and entertaining.

                    Keep replies short-medium.
                    """
                },

                {
                    "role": "user",
                    "content": user_message
                }

            ]

        )

        reply = completion.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        return jsonify({
            "reply": f"Error: {str(e)}"
        })

# RUN

if __name__ == "__main__":
    app.run(debug=True)
