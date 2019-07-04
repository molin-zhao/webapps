const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// utils
const { convertStringToObjectId } = require("../utils/converter");

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    messageType: {
      type: String,
      required: true,
      enum: [
        "CommentPost",
        "ReplyComment",
        "LikeReply",
        "LikeComment",
        "LikePost",
        "Follow",
        "SharePost",
        "PostMentioned"
      ]
    },
    commentReference: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    postReference: {
      type: Schema.Types.ObjectId,
      ref: "Post"
    },
    replyReference: {
      type: Schema.Types.ObjectId,
      ref: "Reply"
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.statics.createMessage = function(message) {
  return new Promise((resolve, reject) => {
    return this.create(message)
      .then(msg => {
        return this.aggregate([
          {
            $match: {
              _id: msg._id
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "sender",
              foreignField: "_id",
              as: "sender"
            }
          },
          {
            $unwind: "$sender"
          },
          {
            $lookup: {
              from: "users",
              localField: "receiver",
              foreignField: "_id",
              as: "receiver"
            }
          },
          {
            $unwind: "$receiver"
          },
          {
            $lookup: {
              from: "posts",
              localField: "postReference",
              foreignField: "_id",
              as: "postReference"
            }
          },
          {
            $unwind: {
              path: "$postReference",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "comments",
              localField: "commentReference",
              foreignField: "_id",
              as: "commentReference"
            }
          },
          {
            $unwind: {
              path: "$commentReference",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: "replies",
              localField: "replyReference",
              foreignField: "_id",
              as: "replyReference"
            }
          },
          {
            $unwind: {
              path: "$replyReference",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              messageType: 1,
              createdAt: 1,
              sender: {
                _id: 1,
                username: 1,
                avatar: 1
              },
              receiver: {
                _id: 1,
                username: 1,
                avatar: 1
              },
              postReference: {
                _id: 1,
                image: 1
              },
              commentReference: {
                _id: 1,
                content: 1
              },
              replyReference: {
                _id: 1,
                content: 1
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

MessageSchema.statics.createMessages = function(messages) {
  return new Promise((resolve, reject) => {
    return this.insertMany(messages, (err, docs) => {
      if (err) return reject(err);
      let docIds = docs.map(doc => doc._id);
      return this.aggregate([
        {
          $match: {
            _id: { $in: docIds }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "sender"
          }
        },
        {
          $unwind: "$sender"
        },
        {
          $lookup: {
            from: "users",
            localField: "receiver",
            foreignField: "_id",
            as: "receiver"
          }
        },
        {
          $unwind: "$receiver"
        },
        {
          $lookup: {
            from: "posts",
            localField: "postReference",
            foreignField: "_id",
            as: "postReference"
          }
        },
        {
          $unwind: {
            path: "$postReference",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "comments",
            localField: "commentReference",
            foreignField: "_id",
            as: "commentReference"
          }
        },
        {
          $unwind: {
            path: "$commentReference",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "replies",
            localField: "replyReference",
            foreignField: "_id",
            as: "replyReference"
          }
        },
        {
          $unwind: {
            path: "$replyReference",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            messageType: 1,
            createdAt: 1,
            sender: {
              _id: 1,
              username: 1,
              avatar: 1
            },
            receiver: {
              _id: 1,
              username: 1,
              avatar: 1
            },
            postReference: {
              _id: 1,
              image: 1
            },
            commentReference: {
              _id: 1,
              content: 1
            },
            replyReference: {
              _id: 1,
              content: 1
            }
          }
        }
      ])
        .then(msgs => resolve(msgs))
        .catch(err => reject(err));
    });
  });
};

MessageSchema.statics.deleteMessage = function(message) {
  return new Promise((resolve, reject) => {
    return this.findOne(message)
      .then(msg => {
        return this.deleteOne(msg)
          .then(result => {
            return resolve(result);
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

MessageSchema.statics.getNewMessage = function(receiver, receivedMessages) {
  return this.aggregate([
    {
      $match: {
        _id: {
          $nin: receivedMessages
        },
        receiver: receiver
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender"
      }
    },
    {
      $unwind: "$sender"
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver"
      }
    },
    {
      $unwind: "$receiver"
    },
    {
      $lookup: {
        from: "posts",
        localField: "postReference",
        foreignField: "_id",
        as: "postReference"
      }
    },
    {
      $unwind: {
        path: "$postReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "commentReference",
        foreignField: "_id",
        as: "commentReference"
      }
    },
    {
      $unwind: {
        path: "$commentReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "replies",
        localField: "replyReference",
        foreignField: "_id",
        as: "replyReference"
      }
    },
    {
      $unwind: {
        path: "$replyReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        messageType: 1,
        createdAt: 1,
        sender: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        receiver: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        postReference: {
          _id: 1,
          image: 1,
          description: 1
        },
        commentReference: {
          _id: 1,
          content: 1
        },
        replyReference: {
          _id: 1,
          content: 1
        }
      }
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

MessageSchema.statics.getHistoryMessage = function(
  receiver,
  receivedMessages,
  limit
) {
  return this.aggregate([
    {
      $match: {
        _id: {
          $in: receivedMessages
        },
        receiver: receiver
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender"
      }
    },
    {
      $unwind: "$sender"
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver"
      }
    },
    {
      $unwind: "$receiver"
    },
    {
      $lookup: {
        from: "posts",
        localField: "postReference",
        foreignField: "_id",
        as: "postReference"
      }
    },
    {
      $unwind: {
        path: "$postReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "commentReference",
        foreignField: "_id",
        as: "commentReference"
      }
    },
    {
      $unwind: {
        path: "$commentReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "replies",
        localField: "replyReference",
        foreignField: "_id",
        as: "replyReference"
      }
    },
    {
      $unwind: {
        path: "$replyReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        messageType: 1,
        createdAt: 1,
        sender: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        receiver: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        postReference: {
          _id: 1,
          image: 1,
          description: 1
        },
        commentReference: {
          _id: 1,
          content: 1
        },
        replyReference: {
          _id: 1,
          content: 1
        }
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
  ]);
};

MessageSchema.statics.getFollowingMessage = function(
  sender,
  lastQueryDataids,
  limit
) {
  return this.aggregate([
    {
      $match: {
        sender: sender,
        _id: {
          $nin: lastQueryDataids
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender"
      }
    },
    {
      $unwind: "$sender"
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver"
      }
    },
    {
      $unwind: "$receiver"
    },
    {
      $lookup: {
        from: "posts",
        localField: "postReference",
        foreignField: "_id",
        as: "postReference"
      }
    },
    {
      $unwind: {
        path: "$postReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "commentReference",
        foreignField: "_id",
        as: "commentReference"
      }
    },
    {
      $unwind: {
        path: "$commentReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "replies",
        localField: "replyReference",
        foreignField: "_id",
        as: "replyReference"
      }
    },
    {
      $unwind: {
        path: "$replyReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        messageType: 1,
        createdAt: 1,
        sender: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        receiver: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        postReference: {
          _id: 1,
          image: 1,
          description: 1
        },
        commentReference: {
          _id: 1,
          content: 1
        },
        replyReference: {
          _id: 1,
          content: 1
        }
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

MessageSchema.statics.getRecentMessage = function(sender, limit = 1) {
  return this.aggregate([
    {
      $match: {
        sender: sender
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender"
      }
    },
    {
      $unwind: "$sender"
    },
    {
      $lookup: {
        from: "users",
        localField: "receiver",
        foreignField: "_id",
        as: "receiver"
      }
    },
    {
      $unwind: "$receiver"
    },
    {
      $lookup: {
        from: "posts",
        localField: "postReference",
        foreignField: "_id",
        as: "postReference"
      }
    },
    {
      $unwind: {
        path: "$postReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "commentReference",
        foreignField: "_id",
        as: "commentReference"
      }
    },
    {
      $unwind: {
        path: "$commentReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "replies",
        localField: "replyReference",
        foreignField: "_id",
        as: "replyReference"
      }
    },
    {
      $unwind: {
        path: "$replyReference",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        messageType: 1,
        createdAt: 1,
        sender: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        receiver: {
          _id: 1,
          username: 1,
          avatar: 1
        },
        postReference: {
          _id: 1,
          image: 1,
          description: 1
        },
        commentReference: {
          _id: 1,
          content: 1
        },
        replyReference: {
          _id: 1,
          content: 1
        }
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

module.exports = mongoose.model("Message", MessageSchema);
