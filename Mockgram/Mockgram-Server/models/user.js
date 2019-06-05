const mongoose = require("mongoose");
require("mongoose-type-email");
const { handleError } = require("../utils/handleError");
const authenticate = require("../utils/authenticate")();
const response = require("../utils/response");
const { getRemoteIpAddress, getRemoteDeviceType } = require("../utils/tools");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_FACTOR = 8;

const UserSchema = new Schema(
  {
    authMethod: {
      type: String,
      enum: ["Local", "OAuth"],
      required: true
    },
    username: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      select: false
    },
    // nickname for display name
    nickname: {
      type: String,
      default: ""
    },
    bio: {
      type: String,
      default: ""
    },
    avatar: {
      type: String,
      default: ""
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true
    },
    gender: {
      // 'M' for Male and 'F' for Female
      type: String,
      default: "M"
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    following: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    privacy: {
      // activity_area is used for collecting posts within this area
      activityArea: {
        type: {
          type: String,
          enum: ["Polygon"],
          required: true
        },
        coordinates: {
          // rectangular area with four coordinates
          type: [[Number]],
          required: true
        }
      },
      // location is used for positioning the user and the user can manually change it
      location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
      }
    },
    loginStatus: {
      token: String,
      socketId: String,
      deviceType: String,
      ipAddress: String,
      lastLoginTime: Date,
      lastLogoutTime: Date
    },
    receivedMessage: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Message"
        }
      ],
      default: []
    },
    // for OAuth
    facebookOAuth: {
      id: String,
      email: mongoose.SchemaTypes.Email,
      accessToken: String
    },
    googleOAuth: {
      id: String,
      email: mongoose.SchemaTypes.Email,
      accessToken: String
    },
    wechatOAuth: {
      id: String,
      email: mongoose.SchemaTypes.Email,
      accessToken: String
    },
    weiboOAuth: {
      id: String,
      email: mongoose.SchemaTypes.Email,
      accessToken: String
    },
    linkedInOAuth: {
      id: String,
      email: mongoose.SchemaTypes.Email,
      accessToken: String
    }
  },
  {
    timestamps: true
  }
);

UserSchema.pre("save", function(next) {
  if (this.method !== "Local") {
    next();
  } else {
    if (!this.isModified("password")) return next();
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  }
});

UserSchema.statics.loginOAuth = function(user, req, res) {
  /**
   * token format:
   *   _id: '5bc9fa9387f14a5d7d10531a',
   *   iat: 1550762791,
   *   exp: 1550766391
   */
  let redirectUrl = req.query.state;
  let userCreds = {
    _id: user._id
  };
  let token = authenticate.getToken(userCreds);
  let ip = getRemoteIpAddress(req);
  let deviceType = getRemoteDeviceType(req.useragent);
  let loginStatus = {
    token: token,
    ipAddress: ip,
    deviceType: deviceType,
    lastLoginTime: Date.now()
  };
  this.updateOne({ _id: user._id }, { $set: { loginStatus: loginStatus } })
    .then(() => {
      if (redirectUrl) {
        let user_string = {
          token: token,
          user: userCreds
        };
        res.redirect(`${redirectUrl}?user=${JSON.stringify(user_string)}`);
      } else {
        return res.json({
          status: response.SUCCESS.OK.CODE,
          msg: response.SUCCESS.OK.MSG,
          token: token,
          user: userCreds
        });
      }
    })
    .catch(err => {
      return handleError(res, err);
    });
};

UserSchema.statics.login = function(criteria, req, res) {
  let password = req.body.password;
  return this.findOne(criteria)
    .select("password")
    .exec((err, user) => {
      if (err) return handleError(res, err);
      if (user) {
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return handleError(res, err);
          if (isMatch) {
            let userCreds = {
              _id: user._id
            };
            let token = authenticate.getToken(userCreds);
            let ip = getRemoteIpAddress(req);
            let deviceType = getRemoteDeviceType(req.useragent);
            let loginStatus = {
              token: token,
              ipAddress: ip,
              deviceType: deviceType,
              lastLoginTime: Date.now()
            };
            this.updateOne(
              { _id: user._id },
              { $set: { loginStatus: loginStatus } }
            )
              .then(() => {
                return res.json({
                  status: response.SUCCESS.OK.CODE,
                  msg: response.SUCCESS.OK.MSG,
                  token: token,
                  user: userCreds
                });
              })
              .catch(err => {
                return handleError(res, err);
              });
          } else {
            return res.json({
              status: response.ERROR.USER_PASSWORD_INCORRECT.CODE,
              msg: response.ERROR.USER_PASSWORD_INCORRECT.MSG
            });
          }
        });
      } else {
        return res.json({
          status: response.ERROR.USER_NAME_NOT_FOUND.CODE,
          msg: response.ERROR.USER_NAME_NOT_FOUND.MSG
        });
      }
    });
};

UserSchema.statics.getUserProfile = function(userId, clientId = null) {
  // if a user request a personal account, return privacy settings, second param will be true
  return this.aggregate([
    {
      $match: {
        _id: userId
      }
    },
    {
      $project: {
        _id: 1,
        username: 1,
        nickname: 1,
        bio: 1,
        avatar: 1,
        email: 1,
        createdAt: 1,
        followerCount: {
          $size: "$followers"
        },
        followingCount: {
          $size: "$following"
        },
        privacy: {
          $cond: {
            if: { $eq: [userId, clientId] },
            then: "$privacy",
            else: "$$REMOVE"
          }
        },
        followed: {
          $in: [clientId, "$followers"]
        }
      }
    }
  ]);
};

UserSchema.statics.searchUser = function(
  searchValue,
  userId,
  limit,
  lastQueryDataIds
) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { username: { $regex: ".*" + searchValue + ".*" } },
          { nickname: { $regex: ".*" + searchValue + ".*" } }
        ],
        _id: {
          $nin: lastQueryDataIds
        }
      }
    },
    {
      $project: {
        _id: 1,
        avatar: 1,
        bio: 1,
        username: 1,
        nickname: 1,
        followed: {
          $in: [userId, "$followers"]
        },
        followerCount: {
          $size: "$followers"
        }
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        follwerCount: -1,
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

UserSchema.statics.getUserList = function(
  userId,
  limit,
  lastQueryDataIds,
  type = "Following"
) {
  return this.aggregate([
    {
      $match: {
        _id: userId
      }
    },
    {
      $project: {
        users: {
          $cond: {
            if: { $eq: [type, "Follower"] },
            then: {
              $setDifference: ["$followers", lastQueryDataIds]
            },
            else: {
              $setDifference: ["$following", lastQueryDataIds]
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "users",
        foreignField: "_id",
        as: "users"
      }
    },
    { $unwind: "$users" },
    {
      $project: {
        users: {
          _id: 1,
          avatar: 1,
          username: 1,
          nickname: 1,
          bio: 1,
          gender: 1,
          followed: {
            $in: [userId, "$users.followers"]
          }
        }
      }
    },
    {
      $sort: {
        "users.username": 1
      }
    },
    { $limit: limit },
    { $replaceRoot: { newRoot: "$users" } }
  ]);
};

UserSchema.statics.searchFollowingUser = function(
  userId,
  searchValue,
  lastQueryDataIds,
  limit = 20
) {
  return this.findOne({ _id: userId })
    .select("following")
    .then(doc => {
      let following = doc.following;
      return this.aggregate([
        {
          $match: {
            $and: [
              { _id: { $in: following } },
              { _id: { $nin: lastQueryDataIds } }
            ],
            $or: [
              {
                username: {
                  $regex: `.*${searchValue}.*`,
                  $options: "six"
                }
              },
              {
                nickname: {
                  $regex: `.*${searchValue}.*`,
                  $options: "six"
                }
              }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            avatar: 1,
            username: 1,
            nickname: 1
          }
        },
        {
          $limit: limit
        },
        {
          $sort: {
            username: 1,
            nickname: 1,
            _id: -1
          }
        }
      ])
        .then(users => Promise.resolve(users))
        .catch(err => Promise.reject(err));
    })
    .catch(err => Promise.reject(err));
};

module.exports = mongoose.model("User", UserSchema);
