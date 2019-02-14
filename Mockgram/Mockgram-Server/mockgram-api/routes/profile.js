const express = require('express');
const router = express.Router();
const verify = require('../../mockgram-utils/utils/verify');
const User = require('../../mockgram-utils/models/user');
const Post = require('../../mockgram-utils/models/post').Post;
const handleError = require('../../mockgram-utils/utils/handleError').handleError;
const response = require('../../mockgram-utils/utils/response');
const { convertStringToObjectId, convertStringArrToObjectIdArr, arrSeparateByDate } = require('../../mockgram-utils/utils/converter');

// get personal user profile with provided token
router.get('/', verify.verifyAuthorization, (req, res) => {
    let clientId = convertStringToObjectId(req.user._id);
    let queryOtherUserProfle = false;
    User.getUserProfile(clientId, queryOtherUserProfle).exec(async (err, user) => {
        if (err) return handleError(res, err);
        let postCount = await Post.getUserPostCount(clientId);
        user[0].postCount = postCount;
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: user[0]
        })
    })
});

// get a user profile info using a certain user id
router.get('/:id', (req, res) => {
    let userId = convertStringToObjectId(req.params.id);
    let queryOtherUserProfle = true;
    User.getUserProfile(userId, queryOtherUserProfle).exec(async (err, user) => {
        if (err) return handleError(res, err);
        let postCount = await Post.getUserPostCount(userId);
        user[0].postCount = postCount;
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: user[0]
        })
    })
});

router.post('/post', (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    let lastItem = req.body.lastQueryDataLastItem;
    let limit = req.body.limit;
    let type = req.body.type;
    if (type === 'LIKED') {
        Post.getUserLikedPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
            if (err) return handleError(res, err);
            let result = arrSeparatorByDate(lastItem, posts);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: result
            })
        })
    } else if (type === 'CREATED') {
        Post.getUserCreatedPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
            if (err) return handleError(res, err);
            let result = arrSeparateByDate(lastItem, posts);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: result
            })
        })
    } else if (type === 'MENTIONED') {
        Post.getUserMentionedPosts(userId, lastQueryDataIds, limit).exec((err, posts) => {
            if (err) return handleError(res, err);
            let result = arrSeparateByDate(lastItem, posts);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: result
            })
        })
    } else {
        res.json({
            status: response.ERROR.NOT_FOUND.CODE,
            msg: response.ERROR.NOT_FOUND.MSG
        });
    }
})

module.exports = router;