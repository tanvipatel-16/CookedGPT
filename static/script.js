let chatHistory = [];
const urlParams = new URLSearchParams(window.location.search);
const mood = urlParams.get('mood') || 'demonic';
const intensity = urlParams.get('intensity') || 7;

// Fix for Chat Functionality
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    appendMessage(text, true);
    chatHistory.push({ role: "user", content: text });

    try {
        const response = await fetch('/chat_message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: chatHistory,
                mood: mood,
                intensity: intensity
            })
        });

        const data = await response.json();
        if (data.reply) {
            appendMessage(data.reply, false);
            chatHistory.push({ role: "assistant", content: data.reply });
        }
    } catch (e) {
        appendMessage("Connection error. Groq is offline.", false);
    }
}

function appendMessage(text, isUser) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg-bubble ${isUser ? 'user-bubble' : ''}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
// Add this at the very end of your script.js to make the buttons work
document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chat-input');

    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});
