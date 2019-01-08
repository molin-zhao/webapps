const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const ComentSchema = new Schema({
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
    dislikes: {
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

ComentSchema.statics.getPostCreatorReply = function (commentId, postCreatorId) {
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
                "replies": {
                    "likeCount": {
                        $size: "$likes"
                    },
                    "dislikeCount": {
                        $size: "$dislikes"
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
    ]).then(function (result) {
        return result;
    });
}

module.exports = mongoose.model('Comment', ComentSchema);