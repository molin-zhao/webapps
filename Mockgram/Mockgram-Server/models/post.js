const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    image: {
      /**
       * image: {
       *   file: 'https://image.mockgram.molinz.com/post/',
       *   thumbnail: 'https://image.mockgram.molinz.com/thumbnail/'
       * }
       */
      type: [
        {
          file: {
            type: String,
            required: true
          },
          thumbnail: {
            type: String,
            required: true
          }
        }
      ],
      required: true
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag"
        }
      ],
      default: []
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
      $lookup: {
        from: "users",
        localField: "mentioned",
        foreignField: "_id",
        as: "mentioned"
      }
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
      }
    },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location"
      }
    },
    {
      $unwind: {
        path: "$location",
        preserveNullAndEmptyArrays: true
      }
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
        description: 1,
        createdAt: 1,
        creator: 1,
        postUser: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        mentioned: {
          _id: 1,
          username: 1,
          avatar: 1,
          nickname: 1
        },
        tags: {
          _id: 1,
          name: 1,
          type: 1
        },
        location: {
          _id: 1,
          name: 1,
          address: 1,
          meta: 1
        }
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
  followings = []
) {
  let cond = followings.length > 0 ? { $in: followings } : { $nin: followings };
  return this.aggregate([
    {
      $match: {
        _id: { $nin: lastQueryDataIds },
        creator: cond
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "mentioned",
        foreignField: "_id",
        as: "mentioned"
      }
    },
    {
      $lookup: {
        from: "tags",
        localField: "tags",
        foreignField: "_id",
        as: "tags"
      }
    },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location"
      }
    },
    {
      $unwind: "$location"
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
        description: 1,
        createdAt: 1,
        creator: 1,
        postUser: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        mentioned: {
          _id: 1,
          username: 1,
          avatar: 1,
          nickname: 1
        },
        tags: {
          _id: 1,
          name: 1,
          type: 1
        },
        location: {
          _id: 1,
          name: 1,
          address: 1,
          meta: 1
        }
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
  if (type === "LIKED") {
    criteria.likes = userId;
    criteria.creator = { $ne: userId };
  } else if (type === "CREATED") {
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

PostSchema.statics.createPost = function(post) {
  return new Promise((resolve, reject) => {
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
            $lookup: {
              from: "users",
              localField: "mentioned",
              foreignField: "_id",
              as: "mentioned"
            }
          },
          {
            $lookup: {
              from: "tags",
              localField: "tags",
              foreignField: "_id",
              as: "tags"
            }
          },
          {
            $lookup: {
              from: "locations",
              localField: "location",
              foreignField: "_id",
              as: "location"
            }
          },
          {
            $unwind: {
              path: "$location",
              preserveNullAndEmptyArrays: true
            }
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
              description: 1,
              location: 1,
              createdAt: 1,
              creator: 1,
              postUser: {
                _id: 1,
                username: 1,
                avatar: 1
              },
              tags: {
                _id: 1,
                name: 1,
                type: 1
              },
              mentioned: {
                _id: 1,
                avatar: 1,
                username: 1,
                nickname: 1,
                gender: 1
              },
              location: {
                _id: 1,
                name: 1,
                address: 1,
                meta: 1
              }
            }
          }
        ])
          .then(res => {
            return resolve(res);
          })
          .catch(err => {
            return reject(err);
          });
      })
      .catch(err => {
        return reject(err);
      });
  });
};

module.exports = mongoose.model("Post", PostSchema);
