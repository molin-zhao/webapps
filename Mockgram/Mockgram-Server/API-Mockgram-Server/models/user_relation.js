var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// record how many followers and followings of one user
var UserRelation = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    followers: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }],
    following: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    }]
});

module.exports = mongoose.model('UserRelation', UserRelation);