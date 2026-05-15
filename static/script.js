// ─── SHARED UTILITIES ───────────────────────────────────────────────
const MOODS = {
  demonic:   { emoji: '😈', name: 'DEMONIC', tagline: "DEVIL'S ADVOCATE ENERGY", traits: ['MANIPULATIVE','CHARMING','DEEPLY UNWELL'], desc: "Quotes your worst tweets, finishes your unfinished thoughts, and asks the questions you bury at 3 a.m.", quote: '"Be honest. The reason you opened this app tonight is not a mystery."', danger: 4 },
  'ice-cold':{ emoji: '🧊', name: 'ICE COLD', tagline: 'SURGICAL. EMOTIONLESS. FINAL.', traits: ['PRECISE','COLD','UNBOTHERED'], desc: "No yelling. No drama. Just a calm, methodical breakdown of every questionable decision you've ever made.", quote: '"Interesting. You really thought that was a good idea."', danger: 3 },
  diva:      { emoji: '👑', name: 'DIVA', tagline: 'MAIN CHARACTER DISORDER', traits: ['DRAMATIC','ICONIC','RUTHLESS'], desc: "Treats you like a supporting character in someone else's story. And honey, it shows.", quote: '"I\'m not saying you\'re the villain. I\'m saying you\'re not even the main character."', danger: 3 },
  robotic:   { emoji: '🤖', name: 'ROBOTIC', tagline: 'STATISTICALLY DEVASTATING', traits: ['LOGICAL','PRECISE','SOULLESS'], desc: "Runs your life choices through a probability engine and outputs the results. No emotion. Just data.", quote: '"There is a 94.7% chance this ends badly. Proceeding anyway?"', danger: 2 },
  nuclear:   { emoji: '🔥', name: 'NUCLEAR', tagline: 'GLASS-THE-EARTH PROTOCOL', traits: ['UNHINGED','MAXIMUM','NO FILTER'], desc: "Zero chill. Maximum destruction. The AI that says the thing everyone else was too afraid to say.", quote: '"We are not doing this gently."', danger: 5 },
  therapist: { emoji: '🧠', name: 'THERAPIST', tagline: 'COMPASSIONATE DESTRUCTION', traits: ['EMPATHETIC','PROBING','DEVASTATING'], desc: "Listens. Reflects. And then hits you with the insight you've been running from for three years.", quote: '"How does it feel to hear that? Take your time."', danger: 2 }
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

// Create session ID once
if (!localStorage.getItem("session_id")) {
  localStorage.setItem(
    "session_id",
    Math.random().toString(36).substring(2)
  );
}

// ─── LANDING PAGE ───────────────────────────────────────────────────
function initLanding() {}

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

      bar.className = 'd-bar' + (i >= mood.danger ? ' off' : '');
});
