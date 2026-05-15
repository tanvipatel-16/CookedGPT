from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get("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")
)

# LANDING PAGE
@app.route("/")
def landing():
    return render_template("landing.html")

# SETUP PAGE
@app.route("/setup")
def setup():
    return render_template("index.html")

# CHAT PAGE
@app.route("/chatpage")
def chatpage():
    return render_template("chat.html")

# AI CHAT API
@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message")
    mood = data.get("mood", "Savage")

    try:

        system_prompt = f"""
        You are CookedGPT.

        Current personality mode: {mood}

        Be funny, modern, Gen-Z styled, entertaining and conversational.
        Keep responses readable and engaging.
        """

        completion = client.chat.completions.create(
            model="llama3-8b-8192",

            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": message
                }
            ],

            temperature=0.9,
            max_tokens=1024
        )

        reply = completion.choices[0].message.content

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print(e)

        return jsonify({
            "reply": "CookedGPT is emotionally unavailable right now."
        })

if __name__ == "__main__":
    app.run(debug=True)
