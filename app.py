import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(api_key=os.environ.get("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"))

chat_history = []

def reset_history_if_needed():
    global chat_history
    if len(chat_history) > 30:
        chat_history = chat_history[-30:]


system_prompts = {
    "savage mode": "You are a savage Gen Z roast AI. Funny, brutal, short replies.",
    "delulu": "You are a delusional best friend who romanticizes everything.",
    "sigma": "You are cold sigma mindset AI. Minimal powerful replies.",
    "clowncheck": "You roast clown behavior in a funny sarcastic way.",
    "indian parents": "You are strict funny Indian parents with emotional drama."
}


@app.route("/")
def landing():
    return render_template("landing.html")


@app.route("/chatpage")
def chatpage():
    return render_template("chat.html")


@app.route("/chat", methods=["POST"])
def chat():
    reset_history_if_needed()

    data = request.get_json()

    message = data["message"]
    mood = data["mood"]
    intensity = data["intensity"]

    system_prompt = system_prompts.get(mood, system_prompts["savage mode"])

    chat_history.append({"role": "user", "content": message})

    messages = [
        {
            "role": "system",
            "content": f"{system_prompt}\nIntensity: {intensity}/10"
        }
    ]

    messages.extend(chat_history)

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=1.1,
        max_tokens=200
    )

    reply = response.choices[0].message.content

    chat_history.append({"role": "assistant", "content": reply})

    return jsonify({"reply": reply})


@app.route("/newchat", methods=["POST"])
def newchat():
    global chat_history
    chat_history = []
    return jsonify({"status": "cleared"})


if __name__ == "__main__":
    app.run(debug=True)
