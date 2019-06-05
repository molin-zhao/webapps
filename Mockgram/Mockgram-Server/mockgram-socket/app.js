const http = require("http");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const socketIo = require("socket.io");

// routers
const indexRouter = require("./routes/index");
const messageRouter = require("./routes/message");

// utils
const response = require("../utils/response");
const config = require("../config");
const { normalizePort } = require("../utils/tools");

// models
const User = require("../models/user");

/**
 * config app
 */
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));

// set up mongoose connection
let mongoUrl = `mongodb://${config.mongoUrl.host}:${config.mongoUrl.port}/${
  config.mongoUrl.db
}`;
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("connected correctly to mongodb");
  })
  .catch(err => console.log(err));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

// adding a generic JSON and URL-encoded parser as a top-level middleware,
// which will parse the bodies of all incoming requests.
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

// set up routers
app.use("/", indexRouter);
app.use("/message", messageRouter);

// catch 404 and handle response
app.use(function(req, res, next) {
  return res.status(404).json({
    status: response.ERROR.NOT_FOUND.CODE,
    msg: response.ERROR.NOT_FOUND.MSG
  });
});

// catch 500 and handle response
app.use(function(err, req, res, next) {
  return res.status(500).json({
    status: response.ERROR.SERVER_ERROR.CODE,
    msg: response.ERROR.SERVER_ERROR.MSG
  });
});

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = socketIo(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);

app.locals.sockets = {};

io.on("connection", socket => {
  socket.on("establish-connection", clientInfo => {
    let token = clientInfo.token;
    let userId = clientInfo.user._id;
    User.findOne({ _id: userId }).exec(async (err, user) => {
      if (err)
        return socket.emit(
          "establish-connection-failed",
          response.ERROR.SOCKET_CONNECTION_FAILED.MSG
        );
      if (user.loginStatus) {
        let loginToken = user.loginStatus.token;
        let loginSocketId = user.loginStatus.socketId;
        if (loginToken !== token) {
          return socket.emit(
            "establish-connection-failed",
            response.ERROR.SOCKET_CONNECTION_FAILED.MSG
          );
        }
        if (loginSocketId && app.locals.sockets[loginSocketId]) {
          app.locals.sockets[loginSocketId].disconnect();
        }
        let newSocketId = socket.id;
        let updateSocket = await User.updateOne(
          { _id: userId },
          { $set: { "loginStatus.socketId": newSocketId } }
        );
        if (updateSocket.n && updateSocket.nModified) {
          app.locals.sockets[newSocketId] = socket;
          console.log(Object.keys(app.locals.sockets));
          return socket.emit("establish-connection-success", newSocketId);
        } else {
          return socket.emit(
            "establish-connection-failed",
            response.ERROR.SOCKET_CONNECTION_FAILED.MSG
          );
        }
      }
    });
  });
  socket.on("disconnect", async () => {
    let socketId = socket.id;
    if (app.locals.sockets[socketId]) {
      app.locals.sockets[socketId].disconnect();
    }
    delete app.locals.sockets[socketId];
    let removeSocket = await User.updateOne(
      { "loginStatus.socketId": socketId },
      { $set: { "loginStatus.socketId": "" } }
    );
    if (removeSocket.n && removeSocket.nModified) {
      console.log(`socket ${socketId} disconnected`);
      console.log(Object.keys(app.locals.sockets));
    }
  });

  socket.on("received-message", async data => {
    const { userId, messageId } = data;
    let addToReceivedMsg = await User.updateOne(
      { _id: userId },
      { $addToSet: { receivedMessage: messageId } }
    );
    if (addToReceivedMsg.n && addToReceivedMsg.nModified) {
      console.log(`user '${userId}' received message: '${messageId}'`);
    }
  });

  socket.on("recalled-message", async data => {
    const { userId, messageId } = data;
    let recallReceivedMessage = await User.updateOne(
      { _id: userId },
      { $pull: { receivedMessage: messageId } }
    );
    if (recallReceivedMessage.n && recallReceivedMessage.nModified) {
      console.log(`recall message: '${messageId}' from user '${userId}'`);
    }
  });
});
