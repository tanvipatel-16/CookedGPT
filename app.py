import os
from flask import Flask, render_template, request, jsonify
from openai import OpenAI # Groq uses the OpenAI client library

app = Flask(__name__)

# Initialize Groq Client
# Replace 'YOUR_GROQ_API_KEY' with your actual key
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key="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"
)

@app.route('/')
def landing(): return render_template('landing.html')

@app.route('/moods')
def moods(): return render_template('index.html')

@app.route('/chat')
def chat(): return render_template('chat.html')

@app.route('/chat_message', methods=['POST'])
def chat_message():
    data = request.json
    history = data.get('messages', [])
    mood = data.get('mood', 'demonic')
    intensity = data.get('intensity', 7)

    # Force long, detailed, savage responses
    system_prompt = (
        f"You are the {mood} AI persona from CookedGPT. Intensity: {intensity}/10. "
        "STRICT RULE: Never give a short or one-sentence reply. "
        "You must provide a long, savage, and detailed roast with multiple paragraphs. "
        "Be creative, relentless, and use the history to stay relevant."
    )

    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in history:
        api_messages.append(msg)

    try:
        # Using Llama 3 70B on Groq for the best roasts
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile", 
            messages=api_messages,
            max_tokens=800,
            temperature=0.9
        )
        reply = response.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        print(f"Groq Error: {e}")
        return jsonify({"reply": "The server melted from that roast. Try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)
