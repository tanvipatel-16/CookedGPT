import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

# Initialize Groq Client
# Tip: On Render, use Environment Variables for your key
client = Groq(api_key="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")

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/moods')
def moods():
    return render_template('index.html')

@app.route('/chat')
def chat():
    return render_template('chat.html')

@app.route('/chat_message', methods=['POST'])
def chat_message():
    data = request.json
    history = data.get('messages', [])
    mood = data.get('mood', 'demonic')
    intensity = data.get('intensity', 7)

    system_prompt = (
        f"You are the {mood} AI persona from CookedGPT. Intensity: {intensity}/10. "
        "MANDATORY: Provide a savage, multi-paragraph roast. "
        "Never give short replies. Use the chat history to stay relevant and brutal."
    )

    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        api_messages.append(msg)

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=api_messages,
            max_tokens=800,
            temperature=0.9
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "The server melted from that roast."}), 500

if __name__ == '__main__':
    app.run(debug=True)
