const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReplySchema = new Schema({
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
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
        timestamps: true
    });


const ComentSchema = new Schema({
    post: {
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