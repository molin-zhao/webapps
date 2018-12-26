const express = require('express');
const router = express.Router();
const response = require('../../mockgram-utils/utils/response');
const Post = require('../../mockgram-utils/models/post').Post;
const handleError = require('../../mockgram-utils/utils/handleError').handleError;
const convertStringIdArrToObjectIdArr = require('../../mockgram-utils/utils/converter').convertStringArrToObjectIdArr;

router.get('/', (req, res) => {

    let query = Post.find({}).populate('postBy').sort({ createdAt: -1 });
    query.exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
})

// get a post with a certain post id
router.get('/:id', (req, res) => {
    Post.find({ _id: req.params.id }).populate('postBy').exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
})


// get posts with limit, say 10~20, query params are included in the request body
// request body contains last query's post id array
router.post('/:limit', async (req, res) => {
    let limit = parseInt(req.params.limit);
    let userId = req.body.userId;//client id, who sent the request
    let lastPosts = convertStringIdArrToObjectIdArr(req.body.lastPosts);
    // if client is a loggin user, then send back the follower posts.
    // else send back hot posts.
    if (userId) {
        // find client's all following users
        User.find({ user: userId }).select('followings').exec(async (err, followings) => {
            if (err) return handleError(res, err);
            Post.aggregate([
                {
                    $match: {
                        _id: { $nin: lastPosts },
                        postBy: { $in: followings }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postBy',
                        foreignField: '_id',
                        as: 'postUser'
                    }
                },
                {
                    $unwind: "$postUser"
                },
                {
                    $project: {
                        "liked": {
                            $in: [userId, "$comments"]
                        },
                        "likeCount": {
                            $size: "$likes"
                        },
                        "commentCount": {
                            $size: "$comments"
                        },
                        "sharedCount": {
                            $size: "$shared"
                        },
                        "image": 1,
                        "label": 1,
                        "description": 1,
                        "location": 1,
                        "createdAt": 1,
                        "postBy": 1,
                        "postUser.username": 1,
                        "postUser.avatar": 1,
                    }
                },
                {
                    $sort: { "createdAt": -1, "_id": -1 }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'postBy',
                        foreignField: '_id',
                        as: 'postUser'
                    }
                }
            ]).exec((err, posts) => {
                if (err) return handleError(res, err);
                res.json({
                    status: response.SUCCESS.OK.CODE,
                    msg: response.SUCCESS.OK.MSG,
                    data: posts
                })
            })
        })
    } else {
        // client is not a loggin user, then send back hot posts
        Post.aggregate([
            {
                $match: {
                    _id: { $nin: lastPosts },
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'postBy',
                    foreignField: '_id',
                    as: 'postUser'
                }
            },
            {
                $unwind: "$postUser"
            },
            {
                $project: {
                    "likeCount": {
                        $size: "$likes"
                    },
                    "commentCount": {
                        $size: "$comments"
                    },
                    "sharedCount": {
                        $size: "$shared"
                    },
                    "image": 1,
                    "label": 1,
                    "description": 1,
                    "location": 1,
                    "createdAt": 1,
                    "postBy": 1,
                    "postUser.username": 1,
                    "postUser.avatar": 1
                }
            },
            {
                $sort: { "likeCount": -1, "createdAt": -1, "_id": -1 }
            },
            {
                $limit: limit
            }
        ]).exec((err, posts) => {
            if (err) return handleError(res, err);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: posts
            })
        })
    }
})


module.exports = router;