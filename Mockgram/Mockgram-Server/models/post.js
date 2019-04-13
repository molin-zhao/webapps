const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    image: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location"
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    comments: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Comment"
        }
      ],
      default: []
    },
    shared: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    mentioned: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

PostSchema.statics.getPostDetail = function(postId, userId = null) {
  return this.aggregate([
    {
      $match: {
        _id: postId
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "postUser"
      }
    },
    {
      $unwind: "$postUser"
    },
    {
      $project: {
        _id: 1,
        liked: {
          $in: [userId, "$likes"]
        },
        likeCount: {
          $size: "$likes"
        },
        commentCount: {
          $size: "$comments"
        },
        sharedCount: {
          $size: "$shared"
        },
        image: 1,
        label: 1,
        description: 1,
        location: 1,
        createdAt: 1,
        creator: 1,
        "postUser.username": 1,
        "postUser.avatar": 1
      }
    }
  ]);
};

PostSchema.statics.getRecommendUserPost = function(userId, limit) {
  return new Promise((resolve, reject) => {
    this.aggregate([
      {
        $match: {
          creator: userId
        }
      },
      {
        $project: {
          image: 1,
          createdAt: 1
        }
      },
      {
        $sort: {
          createdAt: -1,
          _id: -1
        }
      },
      {
        $limit: limit
      }
    ])
      .then(res => {
        return resolve({
          err: null,
          data: res
        });
      })
      .catch(err => {
        return reject({
          err: err,
          data: null
        });
      });
  });
};

PostSchema.statics.getPosts = function(
  userId,
  lastQueryDataIds,
  limit,
  followings = null
) {
  if (followings) {
    return this.aggregate([
      {
        $match: {
          _id: { $nin: lastQueryDataIds },
          creator: { $in: followings }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "creator",
          foreignField: "_id",
          as: "postUser"
        }
      },
      {
        $unwind: "$postUser"
      },
      {
        $project: {
          liked: {
            $in: [userId, "$likes"]
          },
          likeCount: {
            $size: "$likes"
          },
          commentCount: {
            $size: "$comments"
          },
          sharedCount: {
            $size: "$shared"
          },
          image: 1,
          label: 1,
          description: 1,
          location: 1,
          createdAt: 1,
          creator: 1,
          "postUser.username": 1,
          "postUser.avatar": 1,
          "postUser._id": 1
        }
      },
      {
        $sort: { createdAt: -1, _id: -1 }
      },
      {
        $limit: limit
      }
    ]);
  }
  return this.aggregate([
    {
      $match: {
        _id: { $nin: lastQueryDataIds }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "postUser"
      }
    },
    {
      $unwind: "$postUser"
    },
    {
      $project: {
        liked: {
          $in: [userId, "$likes"]
        },
        likeCount: {
          $size: "$likes"
        },
        commentCount: {
          $size: "$comments"
        },
        sharedCount: {
          $size: "$shared"
        },
        image: 1,
        label: 1,
        description: 1,
        location: 1,
        createdAt: 1,
        creator: 1,
        "postUser.username": 1,
        "postUser.avatar": 1
      }
    },
    {
      $sort: { createdAt: -1, _id: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

PostSchema.statics.getUserPostCount = function(userId) {
  return this.countDocuments({ creator: userId });
};

PostSchema.statics.getUserPosts = function(
  userId,
  lastQueryDataIds,
  limit,
  type
) {
  let criteria = {
    _id: { $nin: lastQueryDataIds }
  };
  if (type === "Liked") {
    criteria.likes = userId;
    criteria.creator = { $ne: userId };
  } else if (type === "Created") {
    criteria.creator = userId;
  } else {
    // 'MENTIONED'
    criteria.mentioned = userId;
  }

  return this.aggregate([
    {
      $match: criteria
    },
    {
      $project: {
        _id: 1,
        image: 1,
        likeCount: {
          $size: "$likes"
        },
        commentCount: {
          $size: "$comments"
        },
        createdAt: 1
      }
    },
    {
      $sort: { createdAt: -1, _id: -1 }
    },
    {
      $limit: limit
    }
  ]);
};

PostSchema.statics.getAllComment = function(
  postId,
  lastComments,
  userId,
  limit
) {
  return this.aggregate([
    {
      $match: {
        _id: postId
      }
    },
    {
      $project: {
        creator: 1,
        comments: {
          $setDifference: ["$comments", lastComments]
        }
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "comments",
        foreignField: "_id",
        as: "comments"
      }
    },
    { $unwind: "$comments" },
    {
      $lookup: {
        from: "replies",
        localField: "comments.replies",
        foreignField: "_id",
        as: "comments.replies"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "mentioned",
        foreignField: "_id",
        as: "comments.mentioned"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "comments.commentBy",
        foreignField: "_id",
        as: "comments.commentBy"
      }
    },
    { $unwind: "$comments.commentBy" },
    {
      $project: {
        "comments.commentByPostCreator": {
          $eq: ["$comments.commentBy._id", "$creator"]
        },
        comments: {
          _id: 1,
          createdAt: 1,
          content: 1,
          likeCount: {
            $size: "$comments.likes"
          },
          replyCount: {
            $size: "$comments.replies"
          },
          commentBy: {
            username: 1,
            avatar: 1,
            _id: 1
          },
          mentioned: {
            _id: 1,
            username: 1,
            avatar: 1
          },
          liked: {
            $in: [userId, "$comments.likes"]
          },
          postId: 1
        }
      }
    },
    {
      $sort: {
        "comments.comentByPostCreator": -1,
        "comments.likeCount": -1,
        "comments.replyCount": -1,
        "comments.createdAt": -1,
        "comments._id": -1
      }
    },
    { $limit: limit },
    { $replaceRoot: { newRoot: "$comments" } }
  ]);
};

PostSchema.statics.createPost = function(post, callback) {
  return this.findOne(post).exec((err, doc) => {
    if (err) return callback(err, null);
    if (doc) return callback(null, null);
    return this.create(post)
      .then(doc => {
        let postId = doc._id;
        return this.aggregate([
          {
            $match: {
              _id: postId
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "creator",
              foreignField: "_id",
              as: "postUser"
            }
          },
          {
            $unwind: "$postUser"
          },
          {
            $project: {
              liked: {
                $in: ["$creator", "$likes"]
              },
              likeCount: {
                $size: "$likes"
              },
              commentCount: {
                $size: "$comments"
              },
              sharedCount: {
                $size: "$shared"
              },
              image: 1,
              label: 1,
              description: 1,
              location: 1,
              createdAt: 1,
              creator: 1,
              "postUser.username": 1,
              "postUser.avatar": 1,
              "postUser._id": 1
            }
          }
        ])
          .then(res => {
            return callback(null, res);
          })
          .catch(err => {
            return callback(err, null);
          });
      })
      .catch(err => {
        return callback(err, null);
      });
  });
};

module.exports = mongoose.model("Post", PostSchema);
