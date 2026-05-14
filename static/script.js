let mood = "savage mode";

function setMood(m){
    mood = m;
}

async function send(){

    let input = document.getElementById("userInput");
    let msg = input.value;

    if(msg === "") return;

    let intensity = document.getElementById("intensity").value;

    input.value = "";

    let chatBox = document.getElementById("chatBox");

    chatBox.innerHTML += `<div class="user">You: ${msg}</div>`;

    let res = await fetch("/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            message: msg,
            mood: mood,
            intensity: intensity
        })
    });

    let data = await res.json();

    chatBox.innerHTML += `<div class="ai">AI: ${data.reply}</div>`;
}

async function newChat(){
    await fetch("/newchat", {method:"POST"});
    document.getElementById("chatBox").innerHTML = "";
}
