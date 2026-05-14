let currentMood = "savage mode";

// 🎭 MOOD SELECTOR
const moodButtons = document.querySelectorAll(".mood-btn");
const currentMoodText = document.getElementById("currentMood");

moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {

        moodButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentMood = btn.dataset.mood;

        if (currentMoodText) {
            currentMoodText.innerText = btn.innerText + " Mode";
        }
    });
});


// 🚀 QUICK MESSAGE
function quickMessage(text) {
    document.getElementById("userInput").value = text;
    sendMessage();
}


// 🤖 SEND MESSAGE
async function sendMessage() {

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const intensity = document.getElementById("intensity");

    if (!input || !chatBox) return;

    const message = input.value.trim();
    if (message === "") return;

    // USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.className = "user-message";
    userDiv.innerText = message;
    chatBox.appendChild(userDiv);

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // LOADING
    const aiDiv = document.createElement("div");
    aiDiv.className = "ai-message";
    aiDiv.innerText = "Cooking response... 🔥";
    chatBox.appendChild(aiDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message,
                mood: currentMood,
                intensity: intensity ? intensity.value : 5
            })
        });

        const data = await res.json();
        aiDiv.innerText = data.reply;

    } catch (error) {
        aiDiv.innerText = "CookedGPT crashed 💀";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


// 📩 EVENTS
document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("sendButton");
    const input = document.getElementById("userInput");

    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    if (input) {
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
});
