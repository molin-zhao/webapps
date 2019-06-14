const express = require("express");
const router = express.Router();

// models
const User = require("../../models/user");

// utils
const { handleError } = require("../../utils/handleError");
const response = require("../../utils/response");

/**
 * get like on post message
 */
router.post("/push", (req, res) => {
  let message = req.body.message;
  if (message.length > 0) {
    let messageDoc = message[0];
    let receiverId = messageDoc.receiver._id;
    let senderId = messageDoc.sender._id;
    if (receiverId !== senderId) {
      let app = req.app;
      return User.findOne({ _id: receiverId })
        .select("loginStatus.socketId")
        .then(user => {
          if (user && user.loginStatus) {
            let socketId = user.loginStatus.socketId;
            if (socketId) {
              let socket = app.locals.sockets[socketId];
              if (socket) {
                socket.emit("new-message", message);
              }
            }
          }
          return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG
          });
        })
        .catch(err => {
          return handleError(res, err);
        });
    } else {
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG
      });
    }
  } else {
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG
    });
  }
});

router.post("/push/batch", async (req, res) => {
  let messages = req.body.messages;
  if (messages && Array.isArray(messages) && messages.length > 0) {
    try {
      let result = await Promise.all(
        messages.map(message => {
          let receiver = message.receiver._id;
          let sender = message.sender._id;
          if (receiver !== sender) {
            User.findOne({ _id: receiver })
              .select("loginStatus.socketId")
              .then(user => {
                if (user && user.loginStatus && user.loginStatus.socketId);
                let socket = req.app.locals.sockets[user.loginStatus.socketId];
                if (socket) {
                  socket.emit("new-message", message);
                  return Promise.resolve(message._id);
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
      );
      console.log(result);
      return res.json({
        status: response.SUCCESS.OK.CODE,
        msg: response.SUCCESS.OK.MSG
      });
    } catch (err) {
      return handleError(res, err);
    }
  }
});

router.post("/recall", (req, res) => {
  let messageDoc = req.body.message;
  if (messageDoc) {
    let receiverId = messageDoc.receiver;
    let app = req.app;
    return User.findOne({ _id: receiverId })
      .select("loginStatus.socketId")
      .then(user => {
        if (user && user.loginStatus) {
          let socketId = user.loginStatus.socketId;
          if (socketId) {
            let socket = app.locals.sockets[socketId];
            if (socket) {
              socket.emit("recall-message", [messageDoc._id]);
            }
          }
        }
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG
        });
      })
      .catch(err => {
        return handleError(res, err);
      });
  } else {
    return res.json({
      status: response.SUCCESS.OK.CODE,
      msg: response.SUCCESS.OK.MSG
    });
  }
});

module.exports = router;
