// --- KEEP YOUR MOODS AND INTENSITY_LABELS AT THE TOP ---

function initChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const moodKey = urlParams.get('mood') || 'demonic';
  const intensity = parseInt(urlParams.get('intensity')) || 7;
  const mood = MOODS[moodKey] || MOODS['demonic'];

  let chatHistory = [];

  function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  setEl('active-emoji', mood.emoji);
  setEl('active-name', mood.name);
  setEl('active-heat', `🔥 ${intensity}/10`);
  setEl('active-sub', mood.tagline.toLowerCase());
  setEl('session-emoji', mood.emoji);
  setEl('session-name', mood.name);
  setEl('session-heat', `${intensity}/10`);

  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesEl = document.getElementById('chat-messages');

  function addMessage(text, isUser = false) {
    const wrap = document.createElement('div');
    wrap.className = 'message-wrap' + (isUser ? ' justify-end' : '');
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble' + (isUser ? ' user-bubble' : '');
    const txt = document.createElement('p');
    txt.className = 'msg-text';
    txt.textContent = text;
    bubble.appendChild(txt);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage(text, true);
    chatHistory.push({ role: "user", content: text });

    sendBtn.disabled = true;

    try {
      const response = await fetch('/chat_message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          mood: moodKey,
          intensity: intensity
        })
      });

      const data = await response.json();
      const replyText = data.reply || "...";
      
      addMessage(replyText);
      chatHistory.push({ role: "assistant", content: replyText });

    } catch (error) {
      addMessage("Connection dropped.");
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

// --- KEEP YOUR DOMCONTENTLOADED ROUTER AT THE BOTTOM ---
