<<<<<<< HEAD
const mindButton = document.getElementById("mindButton");

if(mindButton){

    mindButton.addEventListener("click", () => {

        localStorage.setItem("mood", "Savage");

        window.location.href = "/chatpage";

    });

}

// CHAT

const sendButton = document.getElementById("sendButton");

if(sendButton){

    const userInput =
        document.getElementById("userInput");

    const chatBox =
        document.getElementById("chatBox");

    const currentMood =
        localStorage.getItem("mood") || "Savage";

    document.getElementById("currentMood")
        .innerText = currentMood;

    async function sendMessage(){

        const message = userInput.value.trim();

        if(message === "") return;

        // USER

        const userDiv =
            document.createElement("div");

        userDiv.className = "user-message";

        userDiv.innerText = message;

        chatBox.appendChild(userDiv);

        userInput.value = "";

        // AI

        const aiDiv =
            document.createElement("div");

        aiDiv.className = "ai-message";

        aiDiv.innerText =
            "Cooking response...";

        chatBox.appendChild(aiDiv);

        chatBox.scrollTop =
            chatBox.scrollHeight;

        const res = await fetch("/chat", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                message: message,
                mood: currentMood,
                intensity: 50

            })

        });

        const data = await res.json();

        aiDiv.innerText = data.reply;

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }

    sendButton.addEventListener(
        "click",
        sendMessage
    );

    userInput.addEventListener(
        "keydown",
        (e) => {

            if(e.key === "Enter"){
                sendMessage();
            }

        }
    );

=======
const mindButton = document.getElementById("mindButton");

if(mindButton){

    mindButton.addEventListener("click", () => {

        localStorage.setItem("mood", "Savage");

        window.location.href = "/chatpage";

    });

}

// CHAT

const sendButton = document.getElementById("sendButton");

if(sendButton){

    const userInput =
        document.getElementById("userInput");

    const chatBox =
        document.getElementById("chatBox");

    const currentMood =
        localStorage.getItem("mood") || "Savage";

    document.getElementById("currentMood")
        .innerText = currentMood;

    async function sendMessage(){

        const message = userInput.value.trim();

        if(message === "") return;

        // USER

        const userDiv =
            document.createElement("div");

        userDiv.className = "user-message";

        userDiv.innerText = message;

        chatBox.appendChild(userDiv);

        userInput.value = "";

        // AI

        const aiDiv =
            document.createElement("div");

        aiDiv.className = "ai-message";

        aiDiv.innerText =
            "Cooking response...";

        chatBox.appendChild(aiDiv);

        chatBox.scrollTop =
            chatBox.scrollHeight;

        const res = await fetch("/chat", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body: JSON.stringify({

                message: message,
                mood: currentMood,
                intensity: 50

            })

        });

        const data = await res.json();

        aiDiv.innerText = data.reply;

        chatBox.scrollTop =
            chatBox.scrollHeight;

    }

    sendButton.addEventListener(
        "click",
        sendMessage
    );

    userInput.addEventListener(
        "keydown",
        (e) => {

            if(e.key === "Enter"){
                sendMessage();
            }

        }
    );

>>>>>>> c9de78b2f9c067d8d336782a361e59b3c0f352dd
}