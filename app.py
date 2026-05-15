from flask import Flask, render_template, request, jsonify
from groq import Groq
import os

app = Flask(__name__)

# GROQ API KEY
client = Groq(
    api_key=os.environ.get("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")
)

# Home Page
@app.route("/")
def home():
    return render_template("chat.html")

# Chat API
@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data.get("message")

    try:

        completion = client.chat.completions.create(
            model="llama3-8b-8192",

            messages=[
                {
                    "role": "system",
                    "content": "You are CookedGPT, a smart futuristic AI assistant."
                },

                {
                    "role": "user",
                    "content": user_message
                }
            ],

            temperature=0.7,
            max_tokens=1024
        )

        ai_reply = completion.choices[0].message.content

        return jsonify({
            "reply": ai_reply
        })

    except Exception as e:

        print(e)

        return jsonify({
            "reply": "Error connecting to AI."
        })

# Run App
if __name__ == "__main__":
    app.run(debug=True)
