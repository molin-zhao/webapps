var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ReplySchema = new Schema({
    // index field is used for querying within comment -> reply[] array
    index: {
        type: Number,
        required: true
    },
    root_comment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Comment'
    },
    content: {
        type: String,
        required: true
    },
    mentioned: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    reply_from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reply_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});


var ComentSchema = new Schema({
    root_post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reply: [ReplySchema],
    mentioned: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', ComentSchema);