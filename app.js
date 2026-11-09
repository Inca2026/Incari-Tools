// Active Socket State Storage Matrix
let socket = null;

function toggleNetworkConnection() {
    const connectBtn = document.getElementById("connect-btn");
    const disconnectBtn = document.getElementById("disconnect-btn");
    const statusLabel = document.getElementById("network-status");
    const wsUrl = document.getElementById("ws-url").value.trim();
    const token = document.getElementById("auth-token").value.trim();

    if (!socket) {
        // Validation check before executing live pipeline
        if (!wsUrl) {
            logToConsole("[Console Error]: Transmission aborted. Endpoint Gateway input required.");
            return;
        }

        logToConsole(`[Connecting]: Initializing handshake sequence to: ${wsUrl}`);
        
        try {
            // Instantiate real, working native web socket connection strings
            socket = new WebSocket(`${wsUrl}?auth=${token}`);

            socket.onopen = (event) => {
                statusLabel.textContent = "Online";
                statusLabel.className = "connected";
                connectBtn.style.display = "none";
                disconnectBtn.style.display = "block";
                logToConsole("[System Connected]: Handshake accepted. Tunnel active. Simultaneous client streaming ready.");
            };

            socket.onmessage = (event) => {
                try {
                    const incomingPayload = JSON.parse(event.data);
                    logToConsole(`[Incoming Frame]: ${JSON.stringify(incomingPayload)}`);
                } catch(e) {
                    logToConsole(`[Incoming Raw Stream]: ${event.data}`);
                }
            };

            socket.onerror = (error) => {
                logToConsole("[Network Error]: Server node unreachable or blocked by CORS network boundaries.");
            };

            socket.onclose = () => {
                logToConsole("[System Disconnected]: Stream pipeline closed cleanly.");
                resetSocketUIState();
            };

        } catch (error) {
            logToConsole(`[Connection Fault]: Invalid address scheme configuration: ${error.message}`);
            resetSocketUIState();
        }
    } else {
        // Cleanly close connection if requested by user
        socket.close();
    }
}

function sendLivePayload() {
    const input = document.getElementById("chat-message");
    const payloadText = input.value.trim();

    if (!payloadText) return;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        logToConsole("[Transmission Failed]: No active live tunnel socket. Establish network link first.");
        return;
    }

    const standardPayload = {
        action: "CHAT_BROADCAST",
        message: payloadText,
        timestamp: Date.now()
    };

    // Pushes real string payloads directly over the data tunnel
    socket.send(JSON.stringify(standardPayload));
    
    // Log output visualization frame layout
    const window = document.getElementById("chat-window");
    const msg = document.createElement("p");
    msg.className = "log-msg";
    msg.innerHTML = `<span class="log-user">[You]:</span> ${payloadText}`;
    window.appendChild(msg);
    window.scrollTop = window.scrollHeight;

    input.value = "";
}

function resetSocketUIState() {
    socket = null;
    document.getElementById("connect-btn").style.display = "block";
    document.getElementById("disconnect-btn").style.display = "none";
    const statusLabel = document.getElementById("network-status");
    statusLabel.textContent = "Offline";
    statusLabel.className = "";
}

function logToConsole(text) {
    const window = document.getElementById("chat-window");
    const msg = document.createElement("p");
    msg.className = "log-msg log-system";
    msg.textContent = text;
    window.appendChild(msg);
    window.scrollTop = window.scrollHeight;
}
