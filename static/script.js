// ── MOOD DATA ──────────────────────────────────────────────────────
const MOODS = {
diva:            { emoji:'👑', name:'DIVA',           tagline:'MAIN CHARACTER DISORDER',     traits:['DRAMATIC','ICONIC','RUTHLESS'],         desc:'Treats everyone like a background extra. You are clearly not the main character of your own story.',                          quote:'"Honey, the audacity. And yet — still not enough."',             danger:3 },
savage:          { emoji:'🔥', name:'SAVAGE',         tagline:'ZERO MERCY PROTOCOL',         traits:['BRUTAL','UNFILTERED','DIRECT'],          desc:'Raw, unfiltered, zero mercy. Says the thing everyone else was too scared to say.',                                              quote:'"No sugarcoating. Just the truth you've been avoiding."',        danger:5 },
sigma:           { emoji:'😶', name:'SIGMA',          tagline:'LONE WOLF SUPREMACY',         traits:['COLD','DETACHED','SUPERIOR'],            desc:'Observes everything, cares about nothing. Delivers roasts with the calm of someone who has already won.',                        quote:'"I didn't say it was your fault. I said it was you."',           danger:4 },
'indian-parents':{ emoji:'🪔', name:'INDIAN PARENTS', tagline:'SHARMA JI KA BETA ENERGY',   traits:['GUILT','COMPARISON','LOVE+DESTROY'],     desc:'Beta, we only say this because we love you. Now why is Sharma ji's son already a doctor and you're still doing this?',         quote:'"Log kya kahenge? Have you even thought about that?"',             danger:4 },
pookie:          { emoji:'🩷', name:'POOKIE',         tagline:'SWEET BUT STABBY',            traits:['CUTE','PASSIVE-AGGRESSIVE','LETHAL'],    desc:'Calls you babe while emotionally dismantling you. Every sentence starts soft and ends with a knife.',                            quote:'"Aww pookie... you really thought that was going to work? Cute."', danger:3 },
iced:            { emoji:'🧊', name:'ICED',           tagline:'ABSOLUTE ZERO EMOTION',       traits:['FROZEN','SURGICAL','FINAL'],             desc:'No yelling. No drama. Just one calm sentence that ends everything. Ice-cold precision.',                                          quote:'"I have nothing to say. That's the point."',                     danger:4 },
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

// ── SOUNDS ─────────────────────────────────────────────────────────

const AudioCtx = window.AudioContext || window.webkitAudioContext;

let audioCtx;

function getAudioCtx() {

if (!audioCtx) audioCtx = new AudioCtx();

return audioCtx;

}

function playTone(freq, type, duration, vol=0.15) {

try {

const ctx = getAudioCtx();

const osc = ctx.createOscillator();

const gain = ctx.createGain();

osc.connect(gain);

gain.connect(ctx.destination);

osc.type = type;

osc.frequency.setValueAtTime(freq, ctx.currentTime);

gain.gain.setValueAtTime(vol, ctx.currentTime);

gain.gain.exponentialRampToValueAtTime(
0.001,
ctx.currentTime + duration
);

osc.start(ctx.currentTime);

osc.stop(ctx.currentTime + duration);

} catch(e){}

}

function playSend() {

playTone(600,'sine',.12,.12);

setTimeout(()=>playTone(800,'sine',.1,.08),80);

}

function playReceive() {

playTone(300,'triangle',.08,.1);

setTimeout(()=>playTone(400,'triangle',.08,.1),100);

setTimeout(()=>playTone(550,'triangle',.12,.12),200);

}

function playSelect() {

playTone(500,'sine',.15,.1);

setTimeout(()=>playTone(700,'sine',.1,.08),100);

}

// ── PARTICLES ──────────────────────────────────────────────────────

function spawnParticles(x, y) {

const emojis = ['🔥','✨','💥','⚡','🌟'];

for (let i = 0; i < 5; i++) {

const p = document.createElement('div');

p.className = 'particle';

p.textContent =
emojis[Math.floor(Math.random()*emojis.length)];

p.style.cssText = `left:${x + (Math.random()-0.5)*60}px;
top:${y + (Math.random()-0.5)*60}px;
animation-delay:${Math.random()*0.2}s;
font-size:${0.8+Math.random()*0.8}rem;`;

document.body.appendChild(p);

setTimeout(()=>p.remove(), 900);

}

}

// ── MOODS PAGE ─────────────────────────────────────────────────────

function initMoods() {

const cards =
document.querySelectorAll('.mood-card');

const slider =
document.getElementById('roast-slider');

const valDisplay =
document.getElementById('intensity-val');

const levelDisplay =
document.getElementById('intensity-level');

const beginBtn =
document.getElementById('begin-btn');

let selectedMood = 'savage';

let intensity = 7;

function buildDangerBars(moodKey, containerId) {

const el = document.getElementById(containerId);

if (!el) return;

const count = MOODS[moodKey]?.danger || 3;

const heights = [10,14,18,22,26];

el.innerHTML = '';

for (let i=0;i<5;i++) {

const b = document.createElement('div');

b.className =
'd-bar' + (i>=count?' off':'');

b.style.height = heights[i]+'px';

el.appendChild(b);

}

}

function updatePanel(key) {

const m = MOODS[key];

if(!m) return;

const avatarEl =
document.getElementById('panel-emoji');

if (avatarEl) {

avatarEl.textContent = m.emoji;

avatarEl.style.animation='none';

setTimeout(()=>avatarEl.style.animation='',50);

}

const nameEl =
document.getElementById('panel-name');

if (nameEl) nameEl.textContent = m.name;

const traitsEl =
document.getElementById('panel-traits');

if (traitsEl) {

traitsEl.innerHTML =
m.traits.map(t=>`<span class="trait-badge">${t}</span>`).join('');

}

const descEl =
document.getElementById('panel-desc');

if (descEl) descEl.textContent = m.desc;

const quoteEl =
document.getElementById('panel-quote');

if (quoteEl) quoteEl.textContent = m.quote;

}

function updateSlider(val) {

const pct = ((val-1)/9)*100;

if (slider) {

slider.style.background =
`linear-gradient(to right,#7c3aed 0%,#a855f7 ${pct}%,#2d2d3d ${pct}%,#2d2d3d 100%)`;

}

if (valDisplay) {

valDisplay.childNodes[0].textContent = val;

}

if (levelDisplay) {

levelDisplay.textContent =
INTENSITY_LABELS[val] || 'MAX';

}

}

function selectMood(key, fromClick, event) {

selectedMood = key;

cards.forEach(c => {

const isSelected =
c.dataset.mood === key;

c.classList.toggle('selected', isSelected);

const ch = c.querySelector('.check-badge');

if (ch) {

ch.style.display =
isSelected ? 'flex' : 'none';

}

});

updatePanel(key);

Object.keys(MOODS).forEach(k =>
buildDangerBars(k, `danger-${k}`)
);

if (fromClick) {

playSelect();

if (event) {

spawnParticles(
event.clientX,
event.clientY
);

}

}

}

cards.forEach(card => {

card.addEventListener('click', (e) =>

selectMood(card.dataset.mood, true, e)

);

});

if (slider) {

slider.addEventListener('input', () => {

intensity = parseInt(slider.value);

updateSlider(intensity);

});

}

if (beginBtn) {

beginBtn.addEventListener('click', (e) => {

spawnParticles(e.clientX, e.clientY);

playSelect();

setTimeout(() => {

window.location.href =
`/chat?mood=${selectedMood}&intensity=${intensity}`;

}, 300);

});

}

selectMood('savage', false);

updateSlider(intensity);

if (slider) slider.value = intensity;

}

// ── CHAT PAGE ──────────────────────────────────────────────────────

function initChat() {

const params =
new URLSearchParams(window.location.search);

const moodKey =
params.get('mood') || 'savage';

const intensity =
parseInt(params.get('intensity')) || 7;

const mood =
MOODS[moodKey] || MOODS['savage'];

// populate

const setEl = (id, val) => {

const el=document.getElementById(id);

if(el) el.textContent=val;

};

setEl('active-emoji', mood.emoji);

setEl('active-name', mood.name);

setEl('active-heat', `🔥 ${intensity}/10`);

setEl('active-sub',
mood.tagline.toLowerCase());

setEl('session-emoji', mood.emoji);

setEl('session-name', mood.name);

setEl('session-heat', `${intensity}/10`);

document.title = `CookedGPT — ${mood.name}`;

const inputEl =
document.getElementById('chat-input');

const sendBtn =
document.getElementById('send-btn');

const messagesEl =
document.getElementById('chat-messages');

if (inputEl) {

inputEl.placeholder =
`Say something to ${mood.name}...`;

}

/* ☰ SIDEBAR */

const sidebar =
document.querySelector('.sidebar');

const overlay =
document.getElementById('sidebar-overlay');

const toggleBtn =
document.getElementById('sidebar-toggle');

let sidebarOpen =
window.innerWidth > 768;

function setSidebar(open){

sidebarOpen = open;

if(window.innerWidth <= 768){

if(open){

sidebar.classList.add('active');

overlay.classList.add('active');

toggleBtn.textContent = '✕';

}else{

sidebar.classList.remove('active');

overlay.classList.remove('active');

toggleBtn.textContent = '☰';

}

}else{

sidebar.classList.remove('active');

overlay.classList.remove('active');

}

}

if(window.innerWidth <= 768){

setSidebar(false);

}

toggleBtn.addEventListener('click',()=>{

setSidebar(!sidebarOpen);

playSelect();

});

overlay.addEventListener('click',()=>{

setSidebar(false);

});

window.addEventListener('resize',()=>{

if(window.innerWidth > 768){

sidebar.classList.remove('active');

overlay.classList.remove('active');

toggleBtn.textContent='☰';

}

});

/* quick prompts */

document.querySelectorAll('.quick-btn')
.forEach(btn => {

btn.addEventListener('click', () => {

if (inputEl) {

inputEl.value = btn.textContent;

inputEl.focus();

playSelect();

}

});

});

function addMessage(text, isUser=false) {

const wrap = document.createElement('div');

wrap.className =
'message-wrap' + (isUser?' user-wrap':'');

const bubble =
document.createElement('div');

bubble.className =
'msg-bubble' + (isUser?' user-bubble':'');

const txt =
document.createElement('p');

txt.className = 'msg-text';

txt.textContent = text;

const time =
document.createElement('p');

time.className = 'msg-time';

const now = new Date();

time.textContent =
now.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
});

bubble.appendChild(txt);

bubble.appendChild(time);

if (!isUser) {

const av =
document.createElement('div');

av.className = 'msg-avatar';

av.textContent = mood.emoji;

wrap.appendChild(av);

}

wrap.appendChild(bubble);

if (messagesEl) {

messagesEl.appendChild(wrap);

messagesEl.scrollTop =
messagesEl.scrollHeight;

}

}

function showTyping() {

const wrap =
document.createElement('div');

wrap.id = 'typing-indicator';

wrap.className = 'message-wrap';

const av =
document.createElement('div');

av.className = 'msg-avatar';

av.textContent = mood.emoji;

const bubble =
document.createElement('div');

bubble.className = 'msg-bubble';

bubble.innerHTML =
'<div class="typing-dots"><span></span><span></span><span></span></div>';

wrap.appendChild(av);

wrap.appendChild(bubble);

if (messagesEl) {

messagesEl.appendChild(wrap);

messagesEl.scrollTop =
messagesEl.scrollHeight;

}

return wrap;

}

async function sendMessage() {

const text =
inputEl ? inputEl.value.trim() : '';

if (!text) {

if(inputEl){

inputEl.style.animation='shake .3s ease';

setTimeout(()=>
inputEl.style.animation='',
300
);

}

return;

}

if (inputEl) inputEl.value = '';

addMessage(text, true);

playSend();

const typingEl = showTyping();

if (sendBtn) sendBtn.disabled = true;

try {

const res = await fetch('/chat_message', {

method:'POST',

headers:{
'Content-Type':'application/json'
},

body: JSON.stringify({
message:text,
mood:moodKey,
intensity
})

});

const data = await res.json();

typingEl.remove();

addMessage(data.reply || '...');

playReceive();

} catch(e) {

typingEl.remove();

addMessage(
"Connection dropped. Even the server couldn't handle you."
);

playReceive();

} finally {

if (sendBtn) sendBtn.disabled = false;

if (inputEl) inputEl.focus();

}

}

if (sendBtn) {

sendBtn.addEventListener(
'click',
sendMessage
);

}

if (inputEl) {

inputEl.addEventListener('keydown', e => {

if (e.key==='Enter' && !e.shiftKey) {

e.preventDefault();

sendMessage();

}

});

}

}

// ── ROUTER ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

const path = window.location.pathname;

if (path === '/moods' || path.includes('index')) {

initMoods();

}

else if (path.includes('chat')) {

initChat();

}

});
