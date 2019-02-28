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
    User.getUserProfile(clientId, clientId).then(async user => {
        let userProfile = user.shift();
        let postCount = await Post.getUserPostCount(clientId);
        userProfile.postCount = postCount;
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: userProfile
        })
    }).catch(err => {
        return handleError(res, err);
    })
});

// get a user profile info with certain user id
router.post('/', (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let clientId = convertStringToObjectId(req.body.clientId);
    User.getUserProfile(userId, clientId).then(async user => {
        let userProfile = user.shift();
        let postCount = await Post.getUserPostCount(userId);
        userProfile.postCount = postCount;
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: userProfile
        })
    }).catch(err => {
        return handleError(res, err);
    })
});

router.post('/post', (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    let lastItem = req.body.lastQueryDataLastItem;
    let limit = req.body.limit;
    let type = req.body.type;
    Post.getUserPosts(userId, lastQueryDataIds, limit, type).then(posts => {
        let result = arrSeparateByDate(lastItem, posts);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: result
        })
    }).catch(err => {
        return handleError(res, err);
    })
})

module.exports = router;