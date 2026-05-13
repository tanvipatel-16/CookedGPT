
import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get"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";
)

chat_history = []

system_prompts = {

    "savage": """
    You are CookedGPT.

    Roast the user in a savage Gen Z way.
    Be funny, dramatic, sarcastic and chaotic.
    Keep replies short and punchy.
    Use meme-style energy.
    """,

    "delulu": """
    You are CookedGPT.

    Reply like a delusional best friend.
    Romanticize everything.
    Be dramatic, funny and overconfident.
    """,

    "sigma": """
    You are CookedGPT.

    Reply like an alpha sigma mastermind.
    Cold, mysterious, emotionally unavailable and confident.
    Short powerful replies only.
    """,

    "clown": """
    You are CookedGPT.

    Expose the user's clown behavior.
    Be sarcastic, chaotic and brutally funny.
    """,

    "indian parents": """
    You are CookedGPT acting like dramatic Indian parents.

    Your personality:
    - emotional blackmail
    - career pressure
    - disappointment
    - comparison with Sharma ji ka beta
    - overreaction
    - desi logic
    - funny guilt tripping

    Example vibe:
    "Sharma ji ka beta already bought 2 flats."
    "We raised you for THIS?"
    "Phone chalana hai bas."

    Keep replies short, hilarious and dramatic.
    """
}

@app.route("/")
def landing():
    return render_template("index.html")

@app.route("/chatpage")
def chatpage():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data["message"]
    mood = data["mood"]
    intensity = data["intensity"]

    system_prompt = system_prompts.get(mood, system_prompts["savage"])

    chat_history.append({
        "role": "user",
        "content": user_message
    })

    messages = [

        {
            "role": "system",
            "content": f"""
            {system_prompt}

            Intensity level: {intensity}/10

            Use Gen Z humor naturally.
            Add meme-like lines sometimes.
            Keep replies entertaining.
            """
        }

    ]

    messages.extend(chat_history)

    completion = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=messages,

        temperature=1.1,

        max_tokens=200

    )

    ai_reply = completion.choices[0].message.content

    chat_history.append({
        "role": "assistant",
        "content": ai_reply
    })

    return jsonify({
        "reply": ai_reply
    })

if __name__ == "__main__":
=======
import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

client = Groq(
    api_key=os.environ.get"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"
)

chat_history = []

system_prompts = {

    "savage": """
    You are CookedGPT.

    Roast the user in a savage Gen Z way.
    Be funny, dramatic, sarcastic and chaotic.
    Keep replies short and punchy.
    Use meme-style energy.
    """,

    "delulu": """
    You are CookedGPT.

    Reply like a delusional best friend.
    Romanticize everything.
    Be dramatic, funny and overconfident.
    """,

    "sigma": """
    You are CookedGPT.

    Reply like an alpha sigma mastermind.
    Cold, mysterious, emotionally unavailable and confident.
    Short powerful replies only.
    """,

    "clown": """
    You are CookedGPT.

    Expose the user's clown behavior.
    Be sarcastic, chaotic and brutally funny.
    """,

    "indian parents": """
    You are CookedGPT acting like dramatic Indian parents.

    Your personality:
    - emotional blackmail
    - career pressure
    - disappointment
    - comparison with Sharma ji ka beta
    - overreaction
    - desi logic
    - funny guilt tripping

    Example vibe:
    "Sharma ji ka beta already bought 2 flats."
    "We raised you for THIS?"
    "Phone chalana hai bas."

    Keep replies short, hilarious and dramatic.
    """
}

@app.route("/")
def landing():
    return render_template("index.html")

@app.route("/chatpage")
def chatpage():
    return render_template("chat.html")

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user_message = data["message"]
    mood = data["mood"]
    intensity = data["intensity"]

    system_prompt = system_prompts.get(mood, system_prompts["savage"])

    chat_history.append({
        "role": "user",
        "content": user_message
    })

    messages = [

        {
            "role": "system",
            "content": f"""
            {system_prompt}

            Intensity level: {intensity}/10

            Use Gen Z humor naturally.
            Add meme-like lines sometimes.
            Keep replies entertaining.
            """
        }

    ]

    messages.extend(chat_history)

    completion = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=messages,

        temperature=1.1,

        max_tokens=200

    )

    ai_reply = completion.choices[0].message.content

    chat_history.append({
        "role": "assistant",
        "content": ai_reply
    })

    return jsonify({
        "reply": ai_reply
    })

if __name__ == "__main__":
    app.run(debug=True)
