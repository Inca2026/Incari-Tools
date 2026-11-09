// Connects directly to the Incari infrastructure 
// Substitute with the exact WebSocket endpoint decoded from your network inspector tab
const INCARI_WS_ENDPOINT = "wss://api.incariclient.org/v1/friends"; 
let socket;
let userAuthToken = localStorage.getItem("incari_token") || "GUEST_TOKEN_DEMO";

function initConnection() {
    socket = new WebSocket(`${INCARI_WS_ENDPOINT}?auth=${userAuthToken}`);

    socket.onopen = () => {
        logToChat("[System]: Secure socket bridge active. Real-time updates online.");
    };

    socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        handleIncomingNetworkPayload(payload);
    };

    socket.onclose = () => {
        logToChat("[System]: Disconnected. Reconnecting in 5s...");
        setTimeout(initConnection, 5000);
    };
}

function handleIncomingNetworkPayload(data) {
    // Structure examples based on typical Eaglercraft/Incari messaging protocols
    switch(data.type) {
        case "FRIEND_STATUS_UPDATE":
            updateFriendUI(data.username, data.online, data.currentServer);
            break;
        case "RECEIVE_CHAT_MESSAGE":
            logToChat(`[${data.sender}]: ${data.text}`);
            break;
    }
}

function sendChatMessage() {
    const input = document.getElementById("message-field");
    if (!input.value.trim()) return;

    const chatPayload = {
        action: "SEND_MESSAGE",
        recipient: "TargetFriend", // Handled by selected user dynamic state later
        text: input.value,
        timestamp: Date.now()
    };

    // Pushes out instantly. If backend syncs sessions, this will bounce right back into your active game client log!
    socket.send(JSON.stringify(chatPayload));
    logToChat(`[You]: ${input.value}`);
    input.value = "";
}

function logToChat(message) {
    const window = document.getElementById("chat-window");
    const msgElement = document.createElement("p");
    msgElement.style.margin = "4px 0";
    msgElement.textContent = message;
    window.appendChild(msgElement);
    window.scrollTop = window.scrollHeight;
}

// Fire up the pipeline immediately upon page load
initConnection();
