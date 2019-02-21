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
router.post('/you/new', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.user._id);
    User.findOne({ _id: userId }).select('receivedMessage').exec((err, user) => {
        if (err) return handleError(res, err);
        let receivedMessage = user.receivedMessage;
        Message.aggregate([
            {
                $match: {
                    _id: {
                        $nin: receivedMessage
                    },
                    receiver: userId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiver',
                    foreignField: '_id',
                    as: 'receiver'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender'
                }
            },
            {
                $project: {
                    'sender': {
                        'username': 1,
                        '_id': 1,
                        'avatar': 1
                    },
                    'receiver': {
                        'username': 1,
                        '_id': 1,
                        'avatar': 1
                    }
                }
            },
            {
                $sort: {
                    'createdAt': -1,
                    '_id': -1
                }
            }
        ]).exec((err, messages) => {
            if (err) return handleError(res, err);
            return res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.CODE,
                data: messages
            })
        })
    })

})

router.post('/you/old', verifyAuthorization, (req, res) => {
    let userId = req.user._id;
    let limit = req.body.limit;
    User.findOne({ _id: userId }).select('receivedMessage').exec((err, user) => {
        let receivedMessage = user.receivedMessage;
    })

})

module.exports = router;