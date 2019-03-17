const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    content: {
        type: String,
        required: true,
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
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
        timestamps: true
    });

ReplySchema.statics.createReply = function (reply, callback) {
    return this.findOne(reply).exec((err, doc) => {
        if (err) return callback(err, null);
        if (!doc) {
            return this.create(reply).then(replyDoc => {
                return this.aggregate([
                    {
                        $match: {
                            _id: replyDoc._id
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
                            localField: 'from',
                            foreignField: '_id',
                            as: 'from'
                        }
                    },
                    { $unwind: "$from" },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'to',
                            foreignField: '_id',
                            as: 'to'
                        }
                    },
                    { $unwind: "$to" },
                    {
                        $project: {
                            "_id": 1,
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
                            "commentId": 1
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

module.exports = mongoose.model('Reply', ReplySchema);