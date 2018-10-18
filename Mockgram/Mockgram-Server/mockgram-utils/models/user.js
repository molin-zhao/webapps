const mongoose = require('mongoose');
require('mongoose-type-email');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const auth = require('passport-local-authenticate');

const User = new Schema({
    username: {
        type: String,
        default: ''
    },
    password: String,
    OauthId: String,
    OauthToken: String,
    // nickname for display name
    nickname: {
        type: String,
        default: ''
    },
    admin: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: ''
    },
    counts: {
        followers: {
            type: Number,
            default: 0
        },
        following: {
            type: Number,
            default: 0
        }
    },
    avatar: {
        type: String,
        default: ''
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    gender: {
        type: String
    },
    privacy_settings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPrivacy'
    }
}, {
        timestamps: true
    });

User.methods.getName = function () {
    return (`username: ${this.username} nickname ${this.nickname}`);
};

User.methods.getUser = function () {
    return (`
    user: \n
    \tuserId: ${this._id}\n
    \tusername: ${this.username}\n
    \temail: ${this.email}
    `);
};
User.methods.verifyPassword = function (password, callback) {
    auth.hash(password, this.salt, (err, hashed) => {
        if (err) return callback(err);
        auth.verify(this.hash, hashed, (err, verified) => {
            if (err) return callback(err);
            console.log(this.hash);
            console.log(hashed);
            return callback(null, verified);
        });
    });
}
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);