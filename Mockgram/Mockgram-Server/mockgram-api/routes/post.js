const express = require('express');
const router = express.Router();
const response = require('../../mockgram-utils/utils/response');
const Post = require('../../mockgram-utils/models/post').Post;
const Comment = require('../../mockgram-utils/models/comment');
const Reply = require('../../mockgram-utils/models/reply');
const handleError = require('../../mockgram-utils/utils/handleError').handleError;
const { convertStringArrToObjectIdArr, convertStringToObjectId } = require('../../mockgram-utils/utils/converter');
const { verifyAuthorization } = require('../../mockgram-utils/utils/verify');

// get posts with limit, say 10~20, query params are included in the request body
// request body contains last query's post id array
router.post('/', async (req, res) => {
    let limit = parseInt(req.body.limit);
    let userId = req.body.userId;//client id, who sent the request
    let lastPosts = convertStringArrToObjectIdArr(req.body.lastPosts);
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
                        creator: { $in: followings }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'creator',
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
                        "creator": 1,
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
                        localField: 'creator',
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
                    localField: 'creator',
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
                    "creator": 1,
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
});

// get a post with a certain post id
router.get('/:id', (req, res) => {
    Post.find({ _id: req.params.id }).populate('creator').exec((err, post) => {
        if (err) return handleError(res, err);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: post
        })
    })
});



// TODO add verifyAuthorization
// upload a comment
router.put('/comment', /*verifyAuthorization,*/(req, res) => {
    let content = req.body.content;
    let postId = req.body.postId;
    let commentBy = req.body.commentBy;
    let mentioned = req.body.mentioned;
    Comment.create({
        content: content,
        postId: postId,
        commentBy: commentBy,
        mentioned: mentioned
    }).then((comment) => {
        Post.findOneAndUpdate({ _id: comment.postId }, { $push: { comments: comment._id } }).exec((err, post) => {
            if (err) return handleError(res, err);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: comment
            });
        })
    })

})

// get comments
router.post('/comment', (req, res) => {
    let postId = convertStringToObjectId(req.body.postId);
    let creatorId = convertStringToObjectId(req.body.creatorId);
    let limit = req.body.limit;
    let lastComments = convertStringArrToObjectIdArr(req.body.lastComments);

    Post.aggregate([
        {
            $match: {
                _id: postId
            }
        },
        {
            $project: {
                "creator": 1,
                "comments": {
                    $setDifference: ["$comments", lastComments]
                }
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "comments",
                foreignField: '_id',
                as: "comments"
            }
        },
        { $unwind: "$comments" },
        {
            $lookup: {
                from: 'replies',
                localField: 'comments.replies',
                foreignField: '_id',
                as: 'comments.replies'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'mentioned',
                foreignField: '_id',
                as: 'comments.mentioned'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'comments.commentBy',
                foreignField: '_id',
                as: 'comments.commentBy'
            }
        },
        { $unwind: "$comments.commentBy" },
        {
            $project: {
                "comments.commentByPostCreator": {
                    $eq: ["$comments.commentBy._id", "$creator"]
                },
                "comments": {
                    "_id": 1,
                    "createdAt": 1,
                    "content": 1,
                    "likeCount": {
                        $size: "$comments.likes"
                    },
                    "dislikeCount": {
                        $size: "$comments.dislikes"
                    },
                    "replyCount": {
                        $size: "$comments.replies"
                    },
                    "commentBy": {
                        "username": 1,
                        "avatar": 1,
                        "_id": 1,
                    },
                    "mentioned": {
                        "_id": 1,
                        "username": 1,
                        "avatar": 1
                    }
                }
            }
        },
        {
            $sort: {
                "comments.comentByPostCreator": -1,
                "comments.likeCount": -1,
                "comments.replyCount": -1,
                "comments.createdAt": -1,
                "comments._id": -1,
            }
        },
        { $limit: limit },
        { $replaceRoot: { newRoot: "$comments" } }
    ]).exec(async (err, comments) => {
        if (err) return handleError(res, err);
        const promises = comments.map(async (comment) => {
            let result = await Comment.getPostCreatorReply(comment._id, creatorId);
            comment.replyByPostCreator = result.shift();
            return comment;
        });
        const data = await Promise.all(promises);
        res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: data
        });
    });
})

router.put('/comment/reply', (req, res) => {
    let commentId = req.body.commentId;
    let content = req.body.content;
    let from = req.body.from;
    let to = req.body.to;
    let mentioned = req.body.mentioned;
    Reply.create({
        commentId: commentId,
        content: content,
        from: from,
        to: to,
        mentioned: mentioned
    }).then((reply) => {
        Comment.findByIdAndUpdate({ _id: commentId }, {
            $push: { replies: reply._id }
        }).exec((err, comment) => {
            if (err) return handleError(res, err);
            res.json({
                status: response.SUCCESS.OK.CODE,
                msg: response.SUCCESS.OK.MSG,
                data: reply
            });
        })
    })

})

module.exports = router;