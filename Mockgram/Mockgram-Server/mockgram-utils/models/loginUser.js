const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LoginUserSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('LoginUser', LoginUserSchema);