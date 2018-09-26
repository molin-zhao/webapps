const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserActivity = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    // list of user's likes
    likes: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    }]
});


module.exports = mongoose.model('UserActivity', UserActivity);