const express = require('express');
const router = express.Router();
const response = require('../../mockgram-utils/utils/response');
const Post = require('../../mockgram-utils/models/post').Post;
const User = require('../../mockgram-utils/models/user');
const CommentModal = require('../../mockgram-utils/models/comment');
const Reply = require('../../mockgram-utils/models/reply');
const handleError = require('../../mockgram-utils/utils/handleError').handleError;
const { convertStringArrToObjectIdArr, convertStringToObjectId } = require('../../mockgram-utils/utils/converter');
const { verifyAuthorization } = require('../../mockgram-utils/utils/verify');

// get posts with limit, say 10~20, query params are included in the request body
// request body contains last query's post id array
router.post('/', async (req, res) => {
    let limit = parseInt(req.body.limit);
    let userId = convertStringToObjectId(req.body.userId);//client id, who sent the request
    let lastQueryDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    // if client is a loggin user, then send back the follower posts.
    // else send back hot posts.
    if (userId) {
        // find client's all following users
        User.findOne({ _id: userId }).select('following').exec((err, user) => {
            let followings = user.following;
            followings.push(userId);
            if (err) return handleError(res, err);
            Post.aggregate([
                {
                    $match: {
                        _id: { $nin: lastQueryDataIds },
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
                            $in: [userId, "$likes"]
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
                    _id: { $nin: lastQueryDataIds },
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
                        $in: [userId, "$likes"]
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
    CommentModal.create({
        content: content,
        postId: postId,
        commentBy: commentBy,
        mentioned: mentioned
    }).then((comment) => {
        Post.updateOne({ _id: comment.postId }, { $addToSet: { comments: comment._id } }).exec((err, post) => {
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
    let userId = req.body.userId;//client id, who sent the request
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
                    },
                    "liked": {
                        $in: [userId, "$comments.likes"]
                    },
                    "disliked": {
                        $in: [userId, "$comments.dislikes"]
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
            let result = await CommentModal.getPostCreatorReply(comment._id, creatorId);
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


router.post('/comment/detail/reply', (req, res) => {
    let commentId = convertStringToObjectId(req.body.commentId);
    let creatorId = convertStringToObjectId(req.body.creatorId);
    let lastDataIds = convertStringArrToObjectIdArr(req.body.lastQueryDataIds);
    let limit = req.body.limit;
    let clientId = req.body.userId;
    CommentModal.aggregate([
        {
            $match: {
                _id: commentId
            }
        },
        {
            $project: {
                "replies": {
                    $setDifference: ["$replies", lastDataIds]
                }
            }
        },
        {
            $lookup: {
                from: "replies",
                localField: "replies",
                foreignField: '_id',
                as: "replies"
            }
        },
        { $unwind: "$replies" },
        {
            $lookup: {
                from: 'users',
                localField: 'replies.mentioned',
                foreignField: '_id',
                as: 'replies.mentioned'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replies.from',
                foreignField: '_id',
                as: 'replies.from'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'replies.to',
                foreignField: '_id',
                as: 'replies.to'
            }
        },
        { $unwind: "$replies.from" },
        { $unwind: "$replies.to" },
        {
            $project: {
                "replies": {
                    "_id": 1,
                    "liked": {
                        $in: [clientId, "$replies.likes"]
                    },
                    "disliked": {
                        $in: [clientId, "$replies.dislikes"]
                    },
                    "likeCount": {
                        $size: "$replies.likes"
                    },
                    "dislikeCount": {
                        $size: "$replies.dislikes"
                    },
                    "mentioned": {
                        "username": 1,
                        "_id": 1,
                        "avatar": 1
                    },
                    "from": {
                        "username": 1,
                        "_id": 1,
                        "avatar": 1
                    },
                    "to": {
                        "username": 1,
                        "_id": 1,
                        "avatar": 1
                    },
                    "createdAt": 1,
                    "content": 1
                }
            }
        },
        {
            $sort: {
                "likeCount": -1,
                "createdAt": -1,
                "_id": -1
            }
        },
        { $limit: limit },
        { $replaceRoot: { newRoot: "$replies" } }
    ]).exec((err, replies) => {
        if (err) return handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
            data: replies
        })
    })
})

// post a reply to the comment
router.put('/comment/reply', verifyAuthorization, (req, res) => {
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
        CommentModal.updateOne({ _id: commentId }, {
            $addToSet: { replies: reply._id }
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

router.put('/liked', verifyAuthorization, (req, res) => {
    let userId = convertStringToObjectId(req.body.userId);
    let postId = req.body.postId;
    let addLike = req.body.addLike;
    let update = addLike ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } };
    Post.updateOne({ _id: postId }, update).exec((err, post) => {
        if (err) handleError(res, err);
        return res.json({
            status: response.SUCCESS.OK.CODE,
            msg: response.SUCCESS.OK.MSG,
        })
    })
})
module.exports = router;