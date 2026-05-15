// ─── SHARED UTILITIES ───────────────────────────────────────────────
const MOODS = {
  demonic: {
    emoji: '😈',
    name: 'DEMONIC',
    tagline: "DEVIL'S ADVOCATE ENERGY",
    traits: ['MANIPULATIVE','CHARMING','DEEPLY UNWELL'],
    desc: "Quotes your worst tweets, finishes your unfinished thoughts, and asks the questions you bury at 3 a.m.",
    quote: '"Be honest. The reason you opened this app tonight is not a mystery."',
    danger: 4
  },
  'ice-cold': {
    emoji: '🧊',
    name: 'ICE COLD',
    tagline: 'SURGICAL. EMOTIONLESS. FINAL.',
    traits: ['PRECISE','COLD','UNBOTHERED'],
    desc: "No yelling. No drama. Just a calm, methodical breakdown of every questionable decision you've ever made.",
    quote: '"Interesting. You really thought that was a good idea."',
    danger: 3
  },
  diva: {
    emoji: '👑',
    name: 'DIVA',
    tagline: 'MAIN CHARACTER DISORDER',
    traits: ['DRAMATIC','ICONIC','RUTHLESS'],
    desc: "Treats you like a supporting character in someone else's story. And honey, it shows.",
    quote: `"I'm not saying you're the villain. I'm saying you're not even the main character."`,
    danger: 3
  },
  robotic: {
    emoji: '🤖',
    name: 'ROBOTIC',
    tagline: 'STATISTICALLY DEVASTATING',
    traits: ['LOGICAL','PRECISE','SOULLESS'],
    desc: "Runs your life choices through a probability engine and outputs the results. No emotion. Just data.",
    quote: '"There is a 94.7% chance this ends badly. Proceeding anyway?"',
    danger: 2
  },
  nuclear: {
    emoji: '🔥',
    name: 'NUCLEAR',
    tagline: 'GLASS-THE-EARTH PROTOCOL',
    traits: ['UNHINGED','MAXIMUM','NO FILTER'],
    desc: "Zero chill. Maximum destruction. The AI that says the thing everyone else was too afraid to say.",
    quote: '"We are not doing this gently."',
    danger: 5
  },
  therapist: {
    emoji: '🧠',
    name: 'THERAPIST',
    tagline: 'COMPASSIONATE DESTRUCTION',
    traits: ['EMPATHETIC','PROBING','DEVASTATING'],
    desc: "Listens. Reflects. And then hits you with the insight you've been running from for three years.",
    quote: '"How does it feel to hear that? Take your time."',
    danger: 2
  }
};

const INTENSITY_LABELS = {
  1:'MILD', 2:'MILD', 3:'WARM', 4:'WARM', 5:'MEDIUM',
  6:'SPICY', 7:'WELL DONE', 8:'EXTRA HOT', 9:'NUCLEAR', 10:'OBLITERATED'
};

// ─── MOODS PAGE LOGIC ───────────────────────────────────────────────
function initMoods() {
  const cards = document.querySelectorAll('.mood-card');
  const slider = document.getElementById('roast-slider');
  const valDisplay = document.getElementById('intensity-val');
  const levelDisplay = document.getElementById('intensity-level');
  const beginBtn = document.getElementById('begin-btn');

  let selectedMood = 'demonic';
  let intensity = 7;

  function updatePanel(moodKey) {
    const mood = MOODS[moodKey];
    document.getElementById('panel-emoji').textContent = mood.emoji;
    document.getElementById('panel-name').textContent = mood.name;
    document.getElementById('panel-desc').textContent = mood.desc;
    document.getElementById('panel-quote').textContent = mood.quote;
    
    const traitsContainer = document.getElementById('panel-traits');
    traitsContainer.innerHTML = mood.traits.map(t => `<span class="trait-badge">${t}</span>`).join('');
  }

  function updateSlider(val) {
    if (valDisplay) valDisplay.textContent = val;
    if (levelDisplay) levelDisplay.textContent = INTENSITY_LABELS[val];
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedMood = card.dataset.mood;
      updatePanel(selectedMood);
    });
  });

  if (slider) {
    slider.addEventListener('input', (e) => {
      intensity = e.target.value;
      updateSlider(intensity);
    });
  }

  if (beginBtn) {
    beginBtn.addEventListener('click', () => {
      window.location.href = `/chat?mood=${selectedMood}&intensity=${intensity}`;
    });
  }
}

// ─── CHAT PAGE LOGIC (PAGE 3) ───────────────────────────────────────
function initChat() {
  const urlParams = new URLSearchParams(window.location.search);
  const moodKey = urlParams.get('mood') || 'demonic';
  const intensity = parseInt(urlParams.get('intensity')) || 7;
  const mood = MOODS[moodKey];

  let chatHistory = []; // Local memory to prevent repetition

  // Setup UI elements
  document.getElementById('active-emoji').textContent = mood.emoji;
  document.getElementById('active-name').textContent = mood.name;
  document.getElementById('active-heat').textContent = `🔥 ${intensity}/10`;

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
    
    // Push user message to history
    chatHistory.push({ role: "user", content: text });

    sendBtn.disabled = true;

    try {
      // Sends to your Java /chat_message endpoint
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
      const replyText = data.reply || "Even my silence is a burn.";
      
      addMessage(replyText);
      
      // Push AI reply to history so it remembers
      chatHistory.push({ role: "assistant", content: replyText });

    } catch (error) {
        addMessage("Connection dropped. Your roasting was too weak for the server.");
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

// ─── ROUTER ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('moods') || path.includes('index')) {
    initMoods();
  } else if (path.includes('chat')) {
    initChat();
  }
});
