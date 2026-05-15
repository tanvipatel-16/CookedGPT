import os
from flask import Flask, render_template, request, jsonify
from groq import Groq

app = Flask(__name__)

# Initialize Groq Client directly
# Replace with your actual Groq API Key
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

  # System prompt for Groq/Llama
system_prompt = (
    f"You are the {mood} persona. Heat: {intensity}/10. "
    "MANDATORY: Give a long, savage, 3-paragraph roast. "
    "Do not be polite. Use the chat history to attack their previous messages."
)

    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        api_messages.append(msg)

    try:
        # Using Llama 3 on Groq
        completion = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=api_messages,
            max_tokens=1000, # High limit for long responses
            temperature=0.9
        )
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Groq Error: {e}")
        return jsonify({"reply": "The server melted from that roast."}), 500

if __name__ == '__main__':
    app.run(debug=True)
