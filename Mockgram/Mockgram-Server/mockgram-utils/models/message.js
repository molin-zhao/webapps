const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// utils 
const { convertStringToObjectId } = require('../utils/converter')

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageType: {
        type: String,
        required: true,
        enum: ['CommentPost', 'ReplyReply', 'ReplyComment', 'LikeReply', 'LikeComment', 'LikePost', 'Follow']
    },
    commentReference: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    postReference: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    replyReference: {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
    }
}, {
        timestamps: true
    });

MessageSchema.statics.createMessage = function (message, callback) {
    return this.findOne(message).exec((err, doc) => {
        if (err) return callback(err, null);
        if (!doc) {
            return this.create(message).then(doc => {
                return this.aggregate([
                    {
                        $match: {
                            _id: doc._id
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
                        $unwind: "$sender"
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
                        $unwind: "$receiver"
                    },
                    {
                        $lookup: {
                            from: 'posts',
                            localField: 'postReference',
                            foreignField: '_id',
                            as: 'postReference'
                        }
                    },
                    {
                        $unwind: {
                            path: '$postReference',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            localField: 'commentReference',
                            foreignField: '_id',
                            as: 'commentReference'
                        }
                    },
                    {
                        $unwind: {
                            path: '$commentReference',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: 'replies',
                            localField: 'replyReference',
                            foreignField: '_id',
                            as: 'replyReference'
                        }
                    },
                    {
                        $unwind: {
                            path: '$replyReference',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            '_id': 1,
                            'messageType': 1,
                            'sender': {
                                '_id': 1,
                                'username': 1,
                                'avatar': 1
                            },
                            'receiver': {
                                '_id': 1,
                                'username': 1,
                                'avatar': 1
                            },
                            'postReference': {
                                '_id': 1,
                                'image': 1,
                            },
                            'commentReference': {
                                '_id': 1,
                                'content': 1,
                            },
                            'replyReference': {
                                '_id': 1,
                                'content': 1
                            }
                        }
                    }
                ])
                    .then(msg => {
                        return callback(null, msg.shift());
                    })
                    .catch(err => {
                        return callback(err, null);
                    })
            }).catch(err => {
                return callback(err, null);
            })
        }
        return callback(null, null);
    })
}

module.exports = mongoose.model('Message', MessageSchema);