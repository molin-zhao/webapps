var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserActivity = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // four types of activites
    // commented_or_replied shows all comments and replies related to the user
    // mentioned shows all contents that @ the user
    // posted shows their friends recent post or nearby post
    commented: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
        },
        create_time: {
            type: Date,
            default: Date.now(),
            required: true
        },
        detail: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            required: true
        }
    }],
    replied: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
        },
        create_time: {
            type: Date,
            default: Date.now(),
            required: true
        },
        detail: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Comment'
        },
        index: {
            type: Number,
            required: true
        }
    }],
    mentioned: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
        },
        // mentioned type: comment, reply or post
        type: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        detail: {
            // there is no ref field
            // query the detail information according to the type field
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        create_time: {
            type: Date,
            default: Date.now(),
            required: true
        }
    }],
    posted: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        read: {
            type: Boolean,
            required: true,
            default: false
        },
        create_time: {
            type: Date,
            default: Date.now(),
            required: true
        },
        type: {
            // posted by their friends or neaby people
            type: String,
            required: true
        },
        detail: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post'
        },
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('UserActivity', UserActivity);