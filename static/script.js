/* CLEAR OLD BROKEN STORAGE ONCE */

if(localStorage.getItem("brokenFix") !== "done"){

  localStorage.removeItem("cookedChats");

  localStorage.setItem("brokenFix","done");

}

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

let lastUserMessage = "";

/* LOAD SAVED CHATS */

window.onload = () => {

  const saved =
    localStorage.getItem("cookedChats");

  if(saved && messages){

    messages.innerHTML = saved;

  }

};

/* HISTORY */

function addHistory(title){

  if(!history) return;

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerText = title;

  history.prepend(item);

}

/* MAIN SEND */

function sendMessage(customMessage = null){

  if(!messages) return;

  const text = customMessage || input.value.trim();

  if(text === "") return;

  lastUserMessage = text;

  document.querySelector(".welcome-chat")?.remove();

  /* USER MESSAGE */

  if(!customMessage){

    const userDiv = document.createElement("div");

    userDiv.className = "msg user-msg";

    userDiv.innerHTML = `
      <div class="bubble">
        ${text}
      </div>
    `;

    messages.appendChild(userDiv);

    chats.push(text);

    if(chats.length === 1){
      addHistory(text.substring(0,25));
    }

  }

  if(input){
    input.value = "";
  }

  /* THINKING */

  const typing = document.createElement("div");

  typing.className = "msg ai-msg";

  typing.innerHTML = `
    <div class="bubble">
      Thinking...
    </div>
  `;

  messages.appendChild(typing);

  messages.scrollTop = messages.scrollHeight;

  /* API */

  fetch("/chat", {

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      message:text,
      mood:localStorage.getItem("mood"),
      intensity:localstorage.getItem("intensity")||5
    })

  })

  .then(res => res.json())

  .then(data => {

    typing.remove();

    const aiDiv = document.createElement("div");

    aiDiv.className = "msg ai-msg";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    aiDiv.appendChild(bubble);

    messages.appendChild(aiDiv);

    let aiText = data.reply;

    let index = 0;

    /* TYPING EFFECT */

    function typeEffect(){

      if(index < aiText.length){

        if(typeof marked !== "undefined"){

          bubble.innerHTML = marked.parse(
            aiText.substring(0,index)
          );

        }

        else{

          bubble.innerHTML =
            aiText.substring(0,index);

        }

        index++;

        messages.scrollTop = messages.scrollHeight;

        setTimeout(typeEffect, 8);

      }

      else{

        /* REGENERATE BUTTON */

        bubble.innerHTML += `
          <button class="regen-btn">
            ↻ Regenerate
          </button>
        `;

        const regenBtn =
          bubble.querySelector(".regen-btn");

        regenBtn.addEventListener("click", () => {

          aiDiv.remove();

          sendMessage(lastUserMessage);

        });

        /* SAVE CHAT */

        localStorage.setItem(
          "cookedChats",
          messages.innerHTML
        );

      }

    }

    typeEffect();

  })

  .catch(error => {

    typing.remove();

    const errorDiv = document.createElement("div");

    errorDiv.className = "msg ai-msg";

    errorDiv.innerHTML = `
      <div class="bubble">
        Error connecting to AI.
      </div>
    `;

    messages.appendChild(errorDiv);

  });

}

/* SEND BUTTON */

if(sendBtn){

  sendBtn.addEventListener("click", sendMessage);

}

/* ENTER KEY */

if(input){

  input.addEventListener("keypress", function(e){

   if(e.key === "Enter"){
   e.preventDefault();
   sendMessage();
}

  });

}

/* NEW CHAT */

const newChat = document.getElementById("newChat");

if(newChat){

  newChat.addEventListener("click", () => {

    localStorage.removeItem("cookedChats");

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
const intensity = document.getElementById("intensity");
const intensityText = document.getElementById("intensityText");

if(intensity){

intensity.addEventListener("input",()=>{

const val = intensity.value;

if(val <= 3){
intensityText.innerText = "Light Roast ☕";
}
else if(val <= 7){
intensityText.innerText = "Medium Chaos 🌶️";
}
else{
intensityText.innerText = "Emotional Damage ☠️";
}

localStorage.setItem("intensity",val);

});

}

