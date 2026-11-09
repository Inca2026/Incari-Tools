// Application State Controller
function handleAuthSubmit() {
    const nameInput = document.getElementById("username-input");
    const username = nameInput.value.trim();

    if (!username) {
        alert("Please provide a username to run the simulator framework.");
        return;
    }

    // Switch View Layout States
    document.getElementById("auth-screen").style.display = "none";
    document.getElementById("app-screen").style.display = "grid";
    document.body.style.display = "grid"; // Changes container body context to match the layout dashboard

    // Update Player Display Data
    document.getElementById("display-profile-name").textContent = username;

    // Load Safe Simulated Messaging Engine
    startSimulatedSession(username);
}

function startSimulatedSession(username) {
    logToChat(`[System]: Secure mock bridge initialized for user: ${username}`);
    logToChat("[System]: Standing by for native Incari Client telemetry inputs...");
}

function sendChatMessage() {
    const input = document.getElementById("message-field");
    if (!input.value.trim()) return;

    logToChat(`[You]: ${input.value}`);
    
    // UI Echo Pipeline Tracker
    const userText = input.value.toLowerCase();
    setTimeout(() => {
        if (userText.includes("hello") || userText.includes("hi")) {
            logToChat("[System Bot]: Live UI interaction verified! Your sandbox framework is fully ready for deployment pipeline mapping.");
        }
    }, 500);

    input.value = "";
}

function logToChat(message) {
    const window = document.getElementById("chat-window");
    const msgElement = document.createElement("p");
    
    if (message.startsWith("[System")) {
        msgElement.style.color = "#64748b";
        msgElement.style.fontSize = "0.85rem";
    } else {
        msgElement.style.color = "#e2e8f0";
    }
    
    msgElement.style.margin = "6px 0";
    msgElement.textContent = message;
    window.appendChild(msgElement);
    window.scrollTop = window.scrollHeight;
}

function logOut() {
    // Reset view visibility configurations
    document.getElementById("app-screen").style.display = "none";
    document.getElementById("auth-screen").style.display = "block";
    document.body.style.display = "flex";
    document.getElementById("chat-window").innerHTML = "";
    document.getElementById("username-input").value = "";
}
