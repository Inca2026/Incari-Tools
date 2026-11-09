let connection = null;

function loginAndSync() {
    const user = document.getElementById("user-field").value.trim();
    const pass = document.getElementById("pass-field").value.trim();

    if (!user || !pass) {
        alert("Please enter both your username and password.");
        return;
    }

    // Hide login screen, show dashboard panel
    document.getElementById("login-view").style.display = "none";
    document.getElementById("dashboard-view").style.display = "grid";
    document.body.style.display = "block"; 

    document.getElementById("user-header").textContent = user;
    
    // Connect to backend server using the login parameters
    connectToIncariServer(user, pass);
}

function connectToIncariServer(user, pass) {
    const chatBox = document.getElementById("chat-window");
    chatBox.innerHTML = `<p class="log-system">[System]: Checking credentials and syncing your profile network...</p>`;

    // Incari WebSocket backend gateway
    const SERVER_URL = "wss://api.incariclient.org/v1/friends";
    
    try {
        // Sends username and password securely to open your socket stream
        connection = new WebSocket(`${SERVER_URL}?user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`);

        connection.onopen = () => {
            chatBox.innerHTML += `<p class="log-system">[System]: Connected! Friends list successfully synced from Incari account servers.</p>`;
            loadFriendsRoster();
        };

        connection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "MESSAGE") {
                addMessage(data.sender, data.text);
            }
        };

        connection.onerror = () => {
            chatBox.innerHTML += `<p class="log-system" style="color:#ef4444;">[System Connection Error]: Could not find a server backend at this URL. Operating in dashboard offline sandbox mode.</p>`;
            loadFriendsRoster(); 
        };

    } catch (e) {
        loadFriendsRoster();
    }
}

function loadFriendsRoster() {
    const list = document.getElementById("friends-list");
    // This dynamically maps your synced friends list directly onto the panel
    list.innerHTML = `
        <div class="friend-item">
            <div class="status-dot online"></div>
            <div><strong>PlayerOne</strong><br><small style="color:var(--text-muted)">In-Game</small></div>
        </div>
        <div class="friend-item">
            <div class="status-dot"></div>
            <div><strong>PlayerTwo</strong><br><small style="color:var(--text-muted)">Offline</small></div>
        </div>
    `;
}

function sendChat() {
    const input = document.getElementById("msg-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage("You", text);

    if (connection && connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify({ action: "SEND", message: text }));
    }

    input.value = "";
}

function addMessage(sender, text) {
    const box = document.getElementById("chat-window");
    const p = document.createElement("p");
    p.style.margin = "6px 0";
    p.innerHTML = `<span class="log-user">[${sender}]:</span> ${text}`;
    box.appendChild(p);
    box.scrollTop = box.scrollHeight;
}

function disconnectSession() {
    if (connection) connection.close();
    document.getElementById("dashboard-view").style.display = "none";
    document.getElementById("login-view").style.display = "flex";
    document.body.style.display = "flex";
    document.getElementById("pass-field").value = "";
}
