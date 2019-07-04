const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// location should be a name with longitude and latitude
const LocationSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  address: {
    type: String
  },
  meta: {
    country: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipcode: {
      type: String
    },
    isoCountryCode: {
      type: String
    },
    street: {
      type: String
    },
    formattedAddress: {
      type: String
    }
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  loc: {
    type: {
      type: String,
      default: "Point",
      required: true
    },
    // GeoJson format
    // Point [lat, long]
    coordinates: {
      type: [Number],
      required: true
    }
  },
  area: {
    type: {
      type: String,
      enum: ["Polygon"]
    },
    // Polygon [[[lat_1, long_1], [lat_2, long_2], ..]]
    coordinates: {
      type: [[[Number]]]
    }
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
  }
});

LocationSchema.index({ loc: "2dsphere" });

LocationSchema.statics.searchLocationsByCoords = function(
  coords,
  lastQueryDataIds,
  limit = 20,
  maxDistance = 10000
) {
  return this.find({
    loc: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [
            parseFloat(coords.longitude),
            parseFloat(coords.latitude)
          ]
        },
        $maxDistance: maxDistance
      }
    },
    _id: {
      $nin: lastQueryDataIds
    }
  }).limit(limit);
};

LocationSchema.statics.searchLocationsByName = function(
  searchValue,
  lastQueryDataIds,
  limit = 20
) {
  return this.aggregate([
    {
      $match: {
        name: {
          $regex: `.*${searchValue}.*`,
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
        meta: 1,
        loc: 1,
        area: 1,
        name: 1,
        address: 1,
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
        name: -1,
        createdAt: -1,
        _id: -1
      }
    }
  ]);
};

LocationSchema.statics.updateCount = function(location, userId) {
  return new Promise((resolve, reject) => {
    return this.updateOne(
      { _id: location ? location._id : null },
      {
        $addToSet: { participants: userId },
        $inc: { quotedCount: 1 }
      }
    ).exec((err, res) => {
      if (err) return reject(err);
      return resolve(res);
    });
  });
};

module.exports = mongoose.model("Location", LocationSchema);
