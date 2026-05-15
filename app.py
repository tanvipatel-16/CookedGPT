import os
    system_prompt = (
        persona["system"]
        + INTENSITY_ADDENDUM.get(intensity, "")
        + """

Keep responses fresh.
Avoid repeating phrases.
Talk naturally like a real conversation.
Keep replies under 4 sentences.
"""
    )

    # Create session memory
    if session_id not in chat_histories:
        chat_histories[session_id] = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]

    # Save user message
    chat_histories[session_id].append({
        "role": "user",
        "content": user_message
    })

    # Limit memory
    chat_histories[session_id] = chat_histories[session_id][-20:]

    try:

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            temperature=1.1,
            max_tokens=250,
            messages=chat_histories[session_id]
        )

        reply = response.choices[0].message.content

        # Save assistant reply
        chat_histories[session_id].append({
            "role": "assistant",
            "content": reply
        })

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("Groq Error:", e)

        return jsonify({
            "reply": "The kitchen exploded."
        }), 500


# ─── RUN ─────────────────────────────────────────────────────────────

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
