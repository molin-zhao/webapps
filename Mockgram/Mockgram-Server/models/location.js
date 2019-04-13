const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// location should be a name with longitude and latitude
const LocationSchema = new Schema({
  name: {
    type: String
  },
  country: {
    type: String
  },
  city: {
    type: String
  },
  region: {
    type: String
  },
  postalCode: {
    type: String
  },
  isoCountryCode: {
    type: String
  },
  street: {
    type: String
  },
  coordinates: {
    type: {
      //Point
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  }
});

module.exports = mongoose.model("Location", LocationSchema);
