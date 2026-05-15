const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("messageInput");
const chatArea = document.getElementById("chatArea");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

/* Mobile Sidebar */

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

/* Send Message */

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    sendMessage();
  }
});

function sendMessage(){

  const message = input.value.trim();

  if(message === "") return;

  /* User Message */

  chatArea.innerHTML += `
    <div class="user-message">
      <div class="bubble">${message}</div>
    </div>
  `;

  input.value = "";

  /* AI Typing */

  chatArea.innerHTML += `
    <div class="ai-message typing">
      <div class="avatar">AI</div>

      <div class="bubble">
        Typing...
      </div>
    </div>
  `;

  chatArea.scrollTop = chatArea.scrollHeight;

  /* API */

  fetch("/chat",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      message:message
    })
  })
  .then(res => res.json())
  .then(data => {

    document.querySelector(".typing").remove();

    chatArea.innerHTML += `
      <div class="ai-message">
        <div class="avatar">AI</div>

        <div class="bubble">
          ${data.reply}
        </div>
      </div>
    `;

    chatArea.scrollTop = chatArea.scrollHeight;

  })
  .catch(err => {

    document.querySelector(".typing").remove();

    chatArea.innerHTML += `
      <div class="ai-message">
        <div class="avatar">AI</div>

        <div class="bubble">
          Error connecting to AI.
        </div>
      </div>
    `;

  });

}
