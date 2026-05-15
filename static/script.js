/* MOODS */

let selectedMood = "Savage";

const moodCards = document.querySelectorAll(".mood-card");

moodCards.forEach(card => {

  card.addEventListener("click", () => {

    moodCards.forEach(c => c.classList.remove("active"));

    card.classList.add("active");

    selectedMood = card.dataset.mood;

  });

});

/* START */

const startBtn = document.getElementById("startCooking");

if(startBtn){

  startBtn.addEventListener("click", () => {

    localStorage.setItem("mood", selectedMood);

    window.location.href = "/chatpage";

  });

}

/* MOBILE SIDEBAR */

const menuBtn = document.getElementById("menuBtn");

const sidebar = document.getElementById("sidebar");

if(menuBtn){

  menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("show");

  });

}

/* CHAT */

const sendBtn = document.getElementById("sendBtn");

const input = document.getElementById("messageInput");

const messages = document.getElementById("messages");

const history = document.getElementById("chatHistory");

let chats = [];

function addHistory(title){

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerText = title;

  history.prepend(item);

}

function sendMessage(){

  const text = input.value.trim();

  if(text === "") return;

  document.querySelector(".welcome-chat")?.remove();

  const userDiv = document.createElement("div");

  userDiv.className = "msg user-msg";

  userDiv.innerHTML = `
    <div class="bubble">
      ${text}
      <button class="edit-btn">✏️</button>
    </div>
  `;

  messages.appendChild(userDiv);

  chats.push(text);

  if(chats.length === 1){
    addHistory(text.substring(0,25));
  }

  input.value = "";

  const typing = document.createElement("div");

  typing.className = "msg ai-msg";

  typing.innerHTML = `
    <div class="bubble">
      Thinking...
    </div>
  `;

  messages.appendChild(typing);

  messages.scrollTop = messages.scrollHeight;

  fetch("/chat", {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      message:text,
      mood:localStorage.getItem("mood")
    })

  })

  .then(res => res.json())

  .then(data => {

    typing.remove();

    const aiDiv = document.createElement("div");

    aiDiv.className = "msg ai-msg";

    aiDiv.innerHTML = `
      <div class="bubble">
        marked.parse(data.reply)
      </div>
    `;

    messages.appendChild(aiDiv);

    messages.scrollTop = messages.scrollHeight;

  });

}

if(sendBtn){

  sendBtn.addEventListener("click", sendMessage);

}

if(input){

  input.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
      sendMessage();
    }

  });

}

/* NEW CHAT */

const newChat = document.getElementById("newChat");

if(newChat){

  newChat.addEventListener("click", () => {

    messages.innerHTML = `
      <div class="welcome-chat">

        <h1>CookedGPT</h1>

        <p>
          emotionally unstable AI assistant
        </p>

      </div>
    `;

  });

}
