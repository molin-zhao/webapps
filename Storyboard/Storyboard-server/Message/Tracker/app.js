const http = require("http");
const express = require("express");
const socketIo = require("socket.io");

let port = 3000
const app = express();
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = socketIo(server);

server.listen(port, ()=>console.log("tracker server listening on port 3000"));

io.on("connection", socket => {
    console.log("socket connected");
    socket.on("disconnect", async () => {
        console.log("socket disconnected");
    });
  });

