let mood = "savage mode";

let currentChat = [];

const historyList =
document.getElementById("historyList");

function setMood(m, btn){

    mood = m;

    document.querySelectorAll(".moods button")
    .forEach(b => b.classList.remove("activeMood"));

    btn.classList.add("activeMood");

}

function openChat(){

    document.getElementById("moodPage")
    .classList.add("page-exit");

    setTimeout(() => {

        document.getElementById("moodPage")
        .style.display = "none";

        document.getElementById("chatPage")
        .classList.remove("hidden");

        document.getElementById("chatPage")
        .classList.add("page-enter");

    }, 700);

    document.getElementById("selectedMood")
    .innerText =
    "🔥 " + mood.toUpperCase();

    const intensity =
    document.getElementById("intensity").value;

    document.getElementById("chatIntensity")
    .value = intensity;

    document.getElementById("intensityValue")
    .innerText =
    "Intensity: " + intensity;

}

function syncIntensity(value){

    document.getElementById("intensityValue")
    .innerText =
    "Intensity: " + value;

}

function fakeLogin(){

    alert("Login system coming soon 🚀");

}

function saveConversationSummary(){

    if(currentChat.length === 0) return;

    const firstMessage =
    currentChat[0];

    const div =
    document.createElement("div");

    div.className = "history-item";

    div.innerText =
    firstMessage.slice(0, 35) + "...";

    div.onclick = () => {

        let chatBox =
        document.getElementById("chatBox");

        chatBox.innerHTML = "";

        currentChat.forEach(msg => {

            let d =
            document.createElement("div");

            d.className =
            msg.type;

            d.innerHTML =
            msg.text;

            chatBox.appendChild(d);

        });

    };

    historyList.prepend(div);

}

async function send(){

    let input =
    document.getElementById("userInput");

    let msg =
    input.value.trim();

    if(msg === "") return;

    const intensity =
    document.getElementById("chatIntensity").value;

    input.value = "";

    let chatBox =
    document.getElementById("chatBox");

    let userDiv =
    document.createElement("div");

    userDiv.className = "user";

    userDiv.innerHTML =
    `
    ${msg}

    <button class="edit-btn"
    onclick="editMessage(this)">
    ✏
    </button>
    `;

    chatBox.appendChild(userDiv);

    currentChat.push({
        type:"user",
        text:userDiv.innerHTML
    });

    let aiDiv =
    document.createElement("div");

    aiDiv.className = "ai";

    aiDiv.innerText =
    "Cooking response... 🔥";

    chatBox.appendChild(aiDiv);

    chatBox.scrollTop =
    chatBox.scrollHeight;

    const res = await fetch("/chat", {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            message: msg,
            mood: mood,
            intensity: intensity

        })

    });

    const data =
    await res.json();

    aiDiv.innerText =
    data.reply;

    currentChat.push({
        type:"ai",
        text:data.reply
    });

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

function editMessage(button){

    const parent =
    button.parentElement;

    const oldText =
    parent.childNodes[0].textContent;

    const newText =
    prompt("Edit message", oldText);

    if(newText){

        parent.childNodes[0].textContent =
        newText;

    }

}

async function newChat(){

    saveConversationSummary();

    currentChat = [];

    await fetch("/newchat", {
        method:"POST"
    });

    document.getElementById("chatBox")
    .innerHTML = "";

}

document
.getElementById("userInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        send();

    }

});
