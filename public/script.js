const socket = io();

let user = prompt("Введите имя:");

function sendMessage() {
    const input = document.getElementById("msg");
    const msg = input.value;

    if (!msg) return;

    socket.emit("chat message", {
        text: msg,
        user: user,
        room: "global"
    });

    input.value = "";
}

socket.on("chat message", (data) => {
    const chat = document.getElementById("chat");

    const div = document.createElement("div");
    div.classList.add("message");

    if (data.user === user) {
        div.classList.add("me");
    } else {
        div.classList.add("other");
    }

    div.textContent = data.user + ": " + data.text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
});