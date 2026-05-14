let mood = "savage mode";

const historyList =
document.getElementById("historyList");

function setMood(m){

    mood = m;

}

function saveHistory(text){

    const div =
    document.createElement("div");

    div.className = "history-item";

    div.innerText = text;

    historyList.prepend(div);

}

async function send(){

    let input =
    document.getElementById("userInput");

    let msg = input.value;

    if(msg === "") return;

    let intensity =
    document.getElementById("intensity").value;

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

    const data = await res.json();

    aiDiv.innerText = data.reply;

    saveHistory(msg);

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
