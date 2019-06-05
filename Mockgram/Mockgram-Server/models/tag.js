const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    quotedCount: {
      type: Number,
      required: true,
      default: 0
    },
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      default: []
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["Tag", "Topic"],
      required: true,
      default: "Tag"
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

TagSchema.statics.updateCount = function(tagId, userId) {
  return this.updateOne(
    { _id: tagId },
    { $addToSet: { participants: userId }, $inc: { quotedCount: 1 } }
  );
};

TagSchema.statics.getHotTopics = function(limit) {
  return this.aggregate([
    {
      $match: {
        type: "Topic"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    { $unwind: "$creator" },
    {
      $project: {
        _id: 1,
        quotedCount: 1,
        participantsCount: {
          $size: "$participants"
        },
        name: 1,
        creator: {
          _id: 1,
          avatar: 1,
          username: 1,
          nickname: 1
        },
        description: 1
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        participantsCount: -1,
        quotedCount: -1,
        createdAt: -1,
        name: -1,
        _id: -1
      }
    }
  ])
    .then(doc => {
      return Promise.resolve(doc);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

TagSchema.statics.getHotTags = function(limit) {
  return this.aggregate([
    {
      $match: {
        type: "Tag"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    { $unwind: "$creator" },
    {
      $project: {
        _id: 1,
        quotedCount: 1,
        participantsCount: {
          $size: "$participants"
        },
        name: 1,
        creator: {
          _id: 1,
          avatar: 1,
          username: 1,
          nickname: 1
        }
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        participantsCount: -1,
        quotedCount: -1,
        createdAt: -1,
        name: -1,
        _id: -1
      }
    }
  ])
    .then(doc => {
      return Promise.resolve(doc);
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

TagSchema.statics.searchTags = function(value, lastQueryDataIds, limit = 20) {
  return this.aggregate([
    {
      $match: {
        name: {
          $regex: `.*${value}.*`,
          $options: "six"
        },
        _id: {
          $nin: lastQueryDataIds
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    { $unwind: "$creator" },
    {
      $project: {
        _id: 1,
        quotedCount: 1,
        participantsCount: {
          $size: "$participants"
        },
        name: 1,
        type: 1,
        creator: {
          _id: 1,
          avatar: 1,
          username: 1,
          nickname: 1
        }
      }
    },
    {
      $limit: limit
    },
    {
      $sort: {
        type: 1,
        participantsCount: -1,
        quotedCount: -1,
        name: -1,
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

module.exports = mongoose.model("Tag", TagSchema);
