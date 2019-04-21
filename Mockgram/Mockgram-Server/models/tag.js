const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["Tag", "Activity"],
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

TagSchema.statics.getHotActivites = function(limit) {
  return this.aggregate([
    {
      $match: {
        type: "Activity"
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
      return Promise.resolve({
        err: null,
        data: doc
      });
    })
    .catch(err => {
      return Promise.reject({
        err: err,
        data: null
      });
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
      return Promise.resolve({
        err: null,
        data: doc
      });
    })
    .catch(err => {
      return Promise.reject({
        err: err,
        data: null
      });
    });
};

module.exports = mongoose.model("Tag", TagSchema);
