const mongoose = require('mongoose');
require('mongoose-type-email');
const handleError = require('../utils/handleError').handleError;
const authenticate = require('../utils/authenticate');
const response = require('../utils/response');
const { getRemoteIpAddress, getRemoteDeviceType } = require('../utils/tools');
const PolygonSchema = require('../models/post').Polygon;
const LocationSchema = require('../models/post').Location;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_FACTOR = 8;

const PrivacySchema = new Schema({
    // activity_area is used for collecting posts within this area
    activityArea: PolygonSchema,
    // location is used for positioning the user and the user can manually change it 
    location: LocationSchema
}, {
        timestamps: true
    })

const LoginStatusSchema = new Schema({
    token: String,
    socketId: String,
    deviceType: String,
    ipAddress: String,
    lastLoginTime: Date,
    lastLogoutTime: Date
}, {
        timestamps: true
    })


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
        // 'M' for Male and 'F' for Female
        type: String,
        default: 'M'
    },
    followers: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    following: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    privacy: PrivacySchema,
    loginStatus: LoginStatusSchema,
    receivedMessage: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Message'
            }
        ],
        default: []
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

User.statics.login = function (criteria, req, res) {
    let password = req.body.password;
    return this.findOne(criteria).select('password').exec((err, user) => {
        if (err) return handleError(res, err);
        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return handleError(res, err);
                if (isMatch) {
                    /**
                     * decoded token like this
                     * { _id: '5bc9fa9387f14a5d7d10531a',
                     *   iat: 1550762791,
                     *   exp: 1550766391 
                     * }
                     * access user id => req.user._id
                     */
                    let userCreds = {
                        _id: user._id,
                    }
                    let token = authenticate.getToken(userCreds);
                    let ip = getRemoteIpAddress(req);
                    let deviceType = getRemoteDeviceType(req.useragent);
                    let loginStatus = {
                        token: token,
                        ipAddress: ip,
                        deviceType: deviceType,
                        lastLoginTime: Date.now()
                    }
                    this.updateOne({ _id: user._id }, { $set: { 'loginStatus': loginStatus } }).then(() => {
                        return res.json({
                            status: response.SUCCESS.OK.CODE,
                            msg: response.SUCCESS.OK.MSG,
                            token: token,
                            user: userCreds
                        })
                    }).catch(err => {
                        return handleError(res, err);
                    });
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

User.statics.getUserProfile = function (userId, clientId = null) {
    // if a user request a personal account, return privacy settings, second param will be true
    return this.aggregate([
        {
            $match: {
                _id: userId
            }
        },
        {
            $project: {
                "_id": 1,
                "username": 1,
                "nickname": 1,
                "bio": 1,
                "avatar": 1,
                "email": 1,
                "createdAt": 1,
                "followerCount": {
                    $size: "$followers"
                },
                "followingCount": {
                    $size: "$following"
                },
                "privacy": {
                    $cond: {
                        if: { $eq: [userId, clientId] },
                        then: "$privacy",
                        else: "$$REMOVE"
                    }
                },
                "followed": {
                    $in: [clientId, "$followers"]
                }
            }
        }
    ]);
}

User.statics.searchUser = function (searchValue, userId, limit) {
    return this.aggregate([
        {
            $match: {
                $or: [
                    { username: { $regex: '.*' + searchValue + '.*' } },
                    { nickname: { $regex: '.*' + searchValue + '.*' } }
                ]
            }
        },
        {
            $project: {
                '_id': 1,
                'avatar': 1,
                'bio': 1,
                'username': 1,
                'nickname': 1,
                'followed': {
                    $in: [userId, "$followers"]
                },
                'followerCount': {
                    $size: '$followers'
                }

            }
        },
        {
            $limit: limit
        },
        {
            $sort: {
                'follwerCount': -1,
                'createdAt': -1,
                '_id': -1
            }
        }
    ])
}

User.statics.getUserList = function (userId, limit, lastQueryDataIds, type = 'Following') {
    return this.aggregate([
        {
            $match: {
                _id: userId
            }
        },
        {
            $project: {
                "users": {
                    $cond: {
                        if: { $eq: [type, 'Follower'] },
                        then: {
                            $setDifference: ["$followers", lastQueryDataIds]
                        },
                        else: {
                            $setDifference: ["$following", lastQueryDataIds]
                        }
                    }
                },
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: '_id',
                as: "users"
            }
        },
        { $unwind: "$users" },
        {
            $project: {
                'users': {
                    '_id': 1,
                    'avatar': 1,
                    'username': 1,
                    'nickname': 1,
                    'bio': 1,
                    'gender': 1,
                    'followed': {
                        $in: [userId, "$users.followers"]
                    },
                }

            }
        },
        {
            $sort: {
                'users.username': 1
            }
        },
        { $limit: limit },
        { $replaceRoot: { newRoot: "$users" } }
    ])
}

module.exports = mongoose.model('User', User);