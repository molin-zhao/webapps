const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HotPostsSchema = new Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    rank: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('HotPosts', HotPostsSchema);