const mongoose = require('mongoose');
require('mongoose-type-email');
const handleError = require('../utils/handleError').handleError;
const authenticate = require('../utils/authenticate');
const response = require('../utils/response');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_FACTOR = 8;

const User = new Schema({
    username: {
        type: String,
        default: '',
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
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
    privacySettings: {
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

User.statics.login = function (criteria, password, res, ) {
    return this.findOne(criteria).select('password').exec((err, user) => {
        if (err) return handleError(res, err);
        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return handleError(res, err);
                if (isMatch) {
                    let userCreds = {
                        username: user.username,
                        email: user.email,
                        _id: user._id
                    }
                    let token = authenticate.getToken(userCreds);
                    return res.json({
                        status: response.SUCCESS.OK.CODE,
                        msg: response.SUCCESS.OK.MSG,
                        token: token,
                        user: userCreds
                    })
                } else {
                    return res.json({
                        status: response.ERROR.USER_PASSWORD_INCORRECT.CODE,
                        msg: response.ERROR.USER_PASSWORD_INCORRECT.MSG
                    })
                }
            })
        } else {
            return res.json({
                status: response.ERROR.USER_NAME_NOT_FOUND.CODE,
                msg: response.ERROR.USER_NAME_NOT_FOUND.MSG
            })
        }
    })
}

module.exports = mongoose.model('User', User);