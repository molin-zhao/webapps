const express = require('express');
const router = express.Router();
const { verifyAuthorization } = require('../../mockgram-utils/utils/verify');
const response = require('../../mockgram-utils/utils/response');
const { convertStringToObjectId, convertStringArrToObjectIdArr } = require('../../mockgram-utils/utils/converter');
const { handleError } = require('../../mockgram-utils/utils/handleError');
const User = require('../../mockgram-utils/models/user');
const Message = require('../../mockgram-utils/models/message');

router.post('/following', verifyAuthorization, (req, res) => {
    let userId = req.user._id;
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    let limit = req.body.limit;
})

/**
 * fetching new messages without paging
 * all unread messages return to client at once
 */
router.get('/new', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.user._id);
    User.findOne({ _id: userId }).select('receivedMessage').exec((err, user) => {
        if (err) return handleError(res, err);
        let receivedMessage = user.receivedMessage;
        Message.getNewMessage(userId, receivedMessage).then(messages => {
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.CODE,
                data: messages
            })
        }).catch(err => {
            return handleError(res, err);
        })
    })

})

router.post('/history', verifyAuthorization, (req, res) => {
    let userId = req.user._id;
    let limit = req.body.limit;
    User.findOne({ _id: userId }).select('receivedMessage').exec((err, user) => {
        if (err) return handleError(res, err);
        let receivedMessages = user.receivedMessage;
        Message.getHistoryMessage(userId, receivedMessages, limit).then(messages => {
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.CODE,
                data: messages
            })
        }).catch(err => {
            return handleError(res, err);
        })
    })
})

module.exports = router;