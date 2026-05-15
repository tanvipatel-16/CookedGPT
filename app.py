import os
from flask import Flask, render_template, request, jsonify
import openai

app = Flask(__name__)

# Use your actual API key
openai.api_key = "YOUR_OPENAI_API_KEY"

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

    # System prompt to force longer, more detailed roasts
    system_prompt = (
        f"You are the {mood} AI persona. Intensity: {intensity}/10. "
        "CRITICAL: Never give short or one-sentence replies. "
        "Write 3-4 long, savage, and detailed paragraphs. "
        "Analyze the user's life choices with surgical precision and maximum heat."
    )

    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        api_messages.append(msg)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=api_messages,
            max_tokens=800,
            temperature=0.9
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "The server couldn't handle that much heat."}), 500

if __name__ == '__main__':
    app.run(debug=True)
