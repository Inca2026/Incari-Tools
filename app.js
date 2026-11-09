let wsLink = null;

function attemptAuthenticationPipeline() {
    const user = document.getElementById("user-field").value.trim();
    const token = document.getElementById("auth-field").value.trim();

    if (!user || !token) {
        alert("Please provide both parameters to run authentication handshake.");
        return;
    }

    // Switch container configurations cleanly
    document.getElementById("login-view").style.display = "none";
    document.getElementById("dashboard-view").style.display = "grid";
    document.body.style.display = "block"; // Update layout constraints for dashboard view

    document.getElementById("user-header").textContent = user;
    
    // Fire client data sync
    initializeAuthenticatedStream(user, token);
}

function initializeAuthenticatedStream(user, token) {
    const chatBox = document.getElementById("chat-window");
    chatBox.innerHTML = `<p class="log-system">[System]: Access Token received. Attaching socket listeners to Incari networks...</p>`;

    // Live endpoint structure connecting directly into friend-chat relays
    const TARGET_GATEWAY = "wss://api.incariclient.org/v1/friends";
    
    try {
        wsLink = new WebSocket(`${TARGET_GATEWAY}?user=${user}&auth=${token}`);

        wsLink.onopen = () => {
            chatBox.innerHTML += `<p class="log-system">[System]: Sync complete! Session established for ${user}.</p>`;
            populateSyncedFriends();
        };

        wsLink.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "MESSAGE") {
                appendChatMessage(data.sender, data.text);
            }
        };

        wsLink.onerror = () => {
            chatBox.innerHTML += `<p class="log-system" style="color:#ef4444;">[Network Alert]: Authentication gateway offline. Running local companion sandbox context.</p>`;
            populateSyncedFriends(); // Loads profiles so UI is usable even if network handshake fails
        };

    } catch (e) {
        populateSyncedFriends();
    }
}

function populateSyncedFriends() {
    const list = document.getElementById("friends-list");
    // Standard mock list structures mapping onto user identities
    list.innerHTML = `
        <div class="friend-item">
            <div class="status-dot online"></div>
            <div><strong>PlayerOne</strong><br><small style="color:var(--text-muted)">Playing Asria</small></div>
        </div>
        <div class="friend-item">
            <div class="status-dot"></div>
            <div><strong>PlayerTwo</strong><br><small style="color:var(--text-muted)">Offline</small></div>
        </div>
    `;
}

function transmitPayload() {
    const input = document.getElementById("msg-input");
    const val = input.value.trim();
    if (!val) return;

    appendChatMessage("You", val);

    if (wsLink && wsLink.readyState === WebSocket.OPEN) {
        wsLink.send(JSON.stringify({ action: "SEND", text: val }));
    }

    input.value = "";
}

function appendChatMessage(sender, text) {
    const box = document.getElementById("chat-window");
    const p = document.createElement("p");
    p.style.margin = "6px 0";
    p.innerHTML = `<span class="log-user">[${sender}]:</span> ${text}`;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
}

function disconnectSession() {
    if (wsLink) wsLink.close();
    document.getElementById("dashboard-view").style.display = "none";
    document.getElementById("login-view").style.display = "flex";
    document.body.style.display = "flex";
}
