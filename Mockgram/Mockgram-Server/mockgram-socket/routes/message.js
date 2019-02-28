const express = require('express');
const router = express.Router();

// models
const User = require('../../mockgram-utils/models/user');

// utils
const { handleError } = require('../../mockgram-utils/utils/handleError');
const response = require('../../mockgram-utils/utils/response');
const { convertStringToObjectId } = require('../../mockgram-utils/utils/converter');

/**
 * get like on post message
 */
router.post('/push', (req, res) => {
    let message = req.body.message;
    let messageDoc = message[0];
    let receiverId = messageDoc.receiver._id;
    let app = req.app;
    return User.findOne({ _id: receiverId }).select('loginStatus.socketId').then(user => {
        if (user && user.loginStatus) {
            let socketId = user.loginStatus.socketId;
            if (socketId) {
                let socket = app.locals.sockets[socketId];
                if (socket) {
                    socket.emit('new-message', message);
                }
            }
        }
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG
        })
    }).catch(err => {
        return handleError(res, err);
    })
});

router.post('/recall', (req, res) => {
    let messageDoc = req.body.message;
    let receiverId = messageDoc.receiver;
    let app = req.app;
    return User.findOne({ _id: receiverId }).select('loginStatus.socketId').then(user => {
        if (user && user.loginStatus) {
            let socketId = user.loginStatus.socketId;
            if (socketId) {
                let socket = app.locals.sockets[socketId];
                if (socket) {
                    socket.emit('recall-message', messageDoc);
                }
            }
        }
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG
        })
    }).catch(err => {
        return handleError(res, err);
    })
})

module.exports = router;