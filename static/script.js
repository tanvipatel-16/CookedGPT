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
  1:'MILD',
  2:'MILD',
  3:'WARM',
  4:'WARM',
  5:'MEDIUM',
  6:'SPICY',
  7:'WELL DONE',
  8:'EXTRA HOT',
  9:'NUCLEAR',
  10:'OBLITERATED'
};

// ─── LANDING PAGE ───────────────────────────────────────────────────
function initLanding() {
  console.log("Landing page loaded");
}

// ─── MOODS PAGE ─────────────────────────────────────────────────────
function initMoods() {

  const cards = document.querySelectorAll('.mood-card');
  const slider = document.getElementById('roast-slider');
  const valDisplay = document.getElementById('intensity-val');
  const levelDisplay = document.getElementById('intensity-level');
  const beginBtn = document.getElementById('begin-btn');

  let selectedMood = 'demonic';
  let intensity = 7;

  function renderDangerBars(moodKey, containerId) {

    const mood = MOODS[moodKey];
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = '';

    const heights = [10, 14, 18, 22, 26];

    for (let i = 0; i < 5; i++) {

      const bar = document.createElement('div');

      if (i < mood.danger) {
        bar.className = 'd-bar';
      } else {
        bar.className = 'd-bar off';
      }

      bar.style.height = heights[i] + 'px';

      container.appendChild(bar);
    }
  }

  function updatePanel(moodKey) {

    const mood = MOODS[moodKey];

    const emoji = document.getElementById('panel-emoji');
    const name = document.getElementById('panel-name');
    const traits = document.getElementById('panel-traits');
    const desc = document.getElementById('panel-desc');
    const quote = document.getElementById('panel-quote');

    if (emoji) emoji.textContent = mood.emoji;
    if (name) name.textContent = mood.name;

    if (traits) {
      traits.innerHTML = mood.traits
        .map(t => `<span class="trait-badge">${t}</span>`)
        .join('');
    }

    if (desc) desc.textContent = mood.desc;
    if (quote) quote.textContent = mood.quote;
  }

  function updateSlider(val) {

    const pct = ((val - 1) / 9) * 100;

    if (slider) {
      slider.style.background =
        `linear-gradient(to right,
        #7c3aed 0%,
        #a855f7 ${pct}%,
        #2d2d3d ${pct}%,
        #2d2d3d 100%)`;
    }

    if (valDisplay) valDisplay.textContent = val;
    if (levelDisplay) levelDisplay.textContent = INTENSITY_LABELS[val];
  }

  function selectMood(moodKey) {

    selectedMood = moodKey;

    cards.forEach(card => {

      card.classList.remove('selected');

      const badge = card.querySelector('.check-badge');

      if (badge) badge.style.display = 'none';
    });

    const selectedCard =
      document.querySelector(`.mood-card[data-mood="${moodKey}"]`);

    if (selectedCard) {

      selectedCard.classList.add('selected');

      const badge = selectedCard.querySelector('.check-badge');

      if (badge) badge.style.display = 'flex';
    }

    updatePanel(moodKey);

    Object.keys(MOODS).forEach(key => {
      renderDangerBars(key, `danger-${key}`);
    });
  }

  cards.forEach(card => {

    card.addEventListener('click', () => {

      const moodKey = card.dataset.mood;

      selectMood(moodKey);
    });
  });

  if (slider) {

    slider.addEventListener('input', () => {

      intensity = parseInt(slider.value);

      updateSlider(intensity);
    });
  }

  if (beginBtn) {

    beginBtn.addEventListener('click', () => {

      window.location.href =
        `/chat?mood=${selectedMood}&intensity=${intensity}`;
    });
  }

  // INIT
  selectMood('demonic');

  if (slider) slider.value = intensity;

  updateSlider(intensity);
}

// ─── CHAT PAGE ──────────────────────────────────────────────────────
function initChat() {

  const urlParams = new URLSearchParams(window.location.search);

  const moodKey =
    urlParams.get('mood') || 'demonic';

  const intensity =
    parseInt(urlParams.get('intensity')) || 7;

  const mood =
    MOODS[moodKey] || MOODS['demonic'];

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

  setEl('sidebar-emoji', mood.emoji);
  setEl('sidebar-persona-name', mood.name);

  document.title = `CookedGPT — ${mood.name}`;

  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const messagesEl = document.getElementById('chat-messages');

  document.querySelectorAll('.quick-btn').forEach(btn => {

    btn.addEventListener('click', () => {

      input.value = btn.textContent;

      input.focus();
    });
  });

  function addMessage(text, isUser = false) {

    const wrap = document.createElement('div');

    wrap.className =
      'message-wrap' + (isUser ? ' justify-end' : '');

    if (isUser) {
      wrap.style.justifyContent = 'flex-end';
    }

    const bubble = document.createElement('div');

    bubble.className =
      'msg-bubble' + (isUser ? ' user-bubble' : '');

    const txt = document.createElement('p');

    txt.className = 'msg-text';

    txt.textContent = text;

    const time = document.createElement('p');

    time.className = 'msg-time';

    time.textContent = 'JUST NOW';

    bubble.appendChild(txt);
    bubble.appendChild(time);

    if (!isUser) {

      const avatar = document.createElement('div');

      avatar.className = 'msg-avatar';

      avatar.textContent = mood.emoji;

      wrap.appendChild(avatar);
    }

    wrap.appendChild(bubble);

    messagesEl.appendChild(wrap);

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {

    const wrap = document.createElement('div');

    wrap.className = 'message-wrap';

    wrap.id = 'typing-indicator';

    const avatar = document.createElement('div');

    avatar.className = 'msg-avatar';

    avatar.textContent = mood.emoji;

    const bubble = document.createElement('div');

    bubble.className = 'msg-bubble';

    bubble.innerHTML =
      '<div class="typing-dots"><span></span><span></span><span></span></div>';

    wrap.appendChild(avatar);

    wrap.appendChild(bubble);

    messagesEl.appendChild(wrap);

    messagesEl.scrollTop = messagesEl.scrollHeight;

    return wrap;
  }

  async function sendMessage() {

    const text = input.value.trim();

    if (!text) return;

    input.value = '';

    addMessage(text, true);

    const typingEl = showTyping();

    sendBtn.disabled = true;

    try {

      const response = await fetch('/chat_message', {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          message: text,
          mood: moodKey,
          intensity: intensity
        })
      });

      const data = await response.json();

      typingEl.remove();

      addMessage(data.reply || "...");
    }

    catch (error) {

      typingEl.remove();

      addMessage(
        "Connection dropped. Even the server couldn't handle you."
      );
    }

    finally {

      sendBtn.disabled = false;

      input.focus();
    }
  }

  if (sendBtn) {

    sendBtn.addEventListener('click', sendMessage);
  }

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

  console.log("Current path:", path);

  if (
    path === '/' ||
    path.includes('landing')
  ) {

    initLanding();
  }

  else if (
    path.includes('moods') ||
    path.includes('index')
  ) {

    initMoods();
  }

  else if (
    path.includes('chat')
  ) {

    initChat();
  }
});
