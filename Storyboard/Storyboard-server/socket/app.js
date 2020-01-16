const http2 = require("http");
const express = require("express");
const socketIo = require("socket.io");
const { normalizePort } = require("../utils");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = normalizePort(process.env.PORT || "3030");
app.set("port", port);

const server = http2.createServer(app);
const io = socketIo(server);
server.listen(port);
console.log("listening...");

io.on("connection", socket => {
  console.log("oh yes");
  socket.on("establish-connection", () => {
    console.log("hello");
  });
  socket.on("disconnect", () => {
    console.log("bye");
  });
});
