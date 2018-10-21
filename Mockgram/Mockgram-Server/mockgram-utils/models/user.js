const mongoose = require('mongoose');
require('mongoose-type-email');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_FACTOR = 8;

const User = new Schema({
    username: {
        type: String,
        default: '',
        unique: true
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
        },
        posts: {
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
        required: true,
        unique: true
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


User.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        })
    })
});

User.methods.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    })
}

module.exports = mongoose.model('User', User);