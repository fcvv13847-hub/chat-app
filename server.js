const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {

    console.log("user connected");

    // пользователь зашел
    socket.on("join", (username) => {

        users[socket.id] = username;

        io.emit("message", {
            system: true,
            text: username + " joined the chat"
        });

        io.emit("users", Object.values(users));
    });

    // сообщения
    socket.on("message", (data) => {

        io.emit("message", {
            username: users[socket.id],
            text: data
        });

    });

    // выход
    socket.on("disconnect", () => {

        const username = users[socket.id];

        delete users[socket.id];

        io.emit("users", Object.values(users));

        if(username){

            io.emit("message", {
                system: true,
                text: username + " left the chat"
            });

        }

    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});