let mood = "savage mode";

let currentChat = [];

let allChats = [];

function setMood(m, btn){

    mood = m;

    document.querySelectorAll(".moods button")
    .forEach(b => b.classList.remove("activeMood"));

    btn.classList.add("activeMood");

}

function openChat(){

    const intensity =
    document.getElementById("intensity").value;

    document.getElementById("selectedMood")
    .innerText =
    "🔥 " + mood.toUpperCase();

    document.getElementById("chatIntensity")
    .value = intensity;

    document.getElementById("intensityValue")
    .innerText =
    "Intensity: " + intensity;

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

}

function syncIntensity(value){

    document.getElementById("intensityValue")
    .innerText =
    "Intensity: " + value;

}


function saveConversationSummary(){

    if(currentChat.length === 0) return;

    const firstUserMessage =
    currentChat.find(m => m.role === "user");

    if(!firstUserMessage) return;

    const summary =
    firstUserMessage.content.slice(0,40) + "...";

    const fullChat =
    [...currentChat];

    allChats.unshift({

        summary,
        fullChat

    });

    renderHistory();

}

function renderHistory(){

    const historyList =
    document.getElementById("historyList");

    historyList.innerHTML = "";

    allChats.forEach(chat => {

        const div =
        document.createElement("div");

        div.className =
        "history-item";

        div.innerText =
        chat.summary;

        div.onclick = () => {

            const chatBox =
            document.getElementById("chatBox");

            chatBox.innerHTML = "";

            chat.fullChat.forEach(msg => {

                const d =
                document.createElement("div");

                d.className =
                msg.role === "user"
                ? "user"
                : "ai";

                d.innerHTML =
                msg.content;

                chatBox.appendChild(d);

            });

        };

        historyList.appendChild(div);

    });

}

async function send(customMessage = null){

    const input =
    document.getElementById("userInput");

    const message =
    customMessage || input.value.trim();

    if(message === "") return;

    const intensity =
    document.getElementById("chatIntensity").value;

    if(!customMessage){
        input.value = "";
    }

    const chatBox =
    document.getElementById("chatBox");

    const userDiv =
    document.createElement("div");

    userDiv.className = "user";

    userDiv.innerHTML = `
        ${message}
        <button class="edit-btn"
        onclick="editMessage(this)">
        ✏
        </button>
    `;

    chatBox.appendChild(userDiv);

    currentChat.push({

        role:"user",
        content:userDiv.innerHTML

    });

    const aiDiv =
    document.createElement("div");

    aiDiv.className = "ai";

    aiDiv.innerText =
    "Cooking response... 🔥";

    chatBox.appendChild(aiDiv);

    chatBox.scrollTop =
    chatBox.scrollHeight;

    try{

        const res =
        await fetch("/chat", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                message: message,
                mood: mood,
                intensity: intensity

            })

        });

        const data =
        await res.json();

        aiDiv.innerText =
        data.reply;

        currentChat.push({

            role:"assistant",
            content:data.reply

        });

    }

    catch{

        aiDiv.innerText =
        "CookedGPT broke emotionally 💀";

    }

    chatBox.scrollTop =
    chatBox.scrollHeight;

}

async function newChat(){

    saveConversationSummary();

    currentChat = [];

    document.getElementById("chatBox")
    .innerHTML = "";

    try{

        await fetch("/newchat", {

            method:"POST"

        });

    }

    catch{}

}

function editMessage(button){

    const parent =
    button.parentElement;

    const oldText =
    parent.childNodes[0].textContent.trim();

    const newText =
    prompt("Edit your message", oldText);

    if(!newText) return;

    parent.childNodes[0].textContent =
    newText + " ";

    send(newText);

}

document
.getElementById("userInput")
.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        send();

    }

});
async function openAuth(){

    const email =
    prompt("Enter Email");

    if(!email) return;

    const password =
    prompt("Enter Password");

    if(!password) return;

    const choice =
    confirm("Press OK for Signup\nPress Cancel for Login");

    let endpoint = "/login";

    if(choice){
        endpoint = "/signup";
    }

    const res = await fetch(endpoint, {

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            email,
            password

        })

    });

    const data = await res.json();

    if(data.success){

        document.getElementById("userCircle")
        .innerText =
        email[0].toUpperCase();

        alert("Welcome 🚀");

    }

    else{

        alert(data.message);

    }

}

function logoutUser(){

    window.location.href = "/logout";

}
