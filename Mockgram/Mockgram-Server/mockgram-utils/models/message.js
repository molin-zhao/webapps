const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        enum: ['Comment', 'Post', 'User', 'Reply']
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'messageType'
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('Message', MessageSchema);