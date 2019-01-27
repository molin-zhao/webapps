const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    user: {
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


module.exports = mongoose.model('Activity', ActivitySchema);