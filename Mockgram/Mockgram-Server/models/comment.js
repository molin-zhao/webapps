const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const CommentSchema = new Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentioned: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    likes: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    replies: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }],
        default: []
    }
}, {
        timestamps: true
    });


CommentSchema.statics.createComment = function (comment, callback) {
    return this.findOne(comment).exec((err, doc) => {
        if (err) return callback(err, null);
        if (!doc) {
            return this.create(comment).then(commentDoc => {
                return this.aggregate([
                    {
                        $match: {
                            _id: commentDoc._id
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'mentioned',
                            foreignField: '_id',
                            as: 'mentioned'
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'commentBy',
                            foreignField: '_id',
                            as: 'commentBy'
                        }
                    },
                    { $unwind: "$commentBy" },
                    {
                        $project: {
                            "_id": 1,
                            "createdAt": 1,
                            "content": 1,
                            "likeCount": {
                                $size: "$likes"
                            },
                            "replyCount": {
                                $size: "$replies"
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
                            "postId": 1
                        }
                    }
                ]).then(resultArray => {
                    return callback(null, resultArray);
                }).catch(err => {
                    return callback(err, null);
                })
            }).catch(err => {
                return callback(err, null);
            })
        } else {
            return callback(null, null);
        }
    })
}

CommentSchema.statics.getPostCreatorReply = function (commentId, postCreatorId, userId) {
    return this.aggregate([
        {
            $match: {
                _id: ObjectId(commentId)
            }
        },
        {
            $lookup: {
                from: 'replies',
                localField: 'replies',
                foreignField: '_id',
                as: 'replies'
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
            $match: {
                "replies.from._id": postCreatorId
            }
        },
        {
            $project: {
                "postId": 1,
                "replies": {
                    "_id": 1,
                    "liked": {
                        $in: [userId, "$likes"]
                    },
                    "likeCount": {
                        $size: "$likes"
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
                    "content": 1,
                    "commentId": 1,
                    "postId": "$postId"
                }
            }
        },
        {
            $sort: {
                "replies.likeCount": -1,
                "replies.createdAt": -1,
                "replies._id": -1
            }
        },
        { $replaceRoot: { newRoot: "$replies" } }
    ]).then(result => {
        return result;
    });
}

CommentSchema.statics.getAllReply = function (commentId, lastDataIds, clientId, limit) {
    return this.aggregate([
        {
            $match: {
                _id: commentId
            }
        },
        {
            $project: {
                "replies": {
                    $setDifference: ["$replies", lastDataIds]
                },
                "postId": 1
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
                    "likeCount": {
                        $size: "$replies.likes"
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
                    "content": 1,
                    "postId": "$postId",
                    "commentId": 1,
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
    ])
}

module.exports = mongoose.model('Comment', CommentSchema);