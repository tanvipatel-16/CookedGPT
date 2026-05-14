import os
from flask import Flask, render_template, request, jsonify, session, redirect
from groq import Groq

app = Flask(__name__)

app.secret_key = "cookedgptsecret"

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
users = {}

@app.route("/signup", methods=["POST"])
def signup():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    if email in users:

        return jsonify({
            "success": False,
            "message": "User already exists"
        })

    users[email] = password

    session["user"] = email

    return jsonify({
        "success": True
    })

@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data["email"]
    password = data["password"]

    if email in users and users[email] == password:

        session["user"] = email

        return jsonify({
            "success": True
        })

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    })

@app.route("/logout")
def logout():

    session.pop("user", None)

    return redirect("/")


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
