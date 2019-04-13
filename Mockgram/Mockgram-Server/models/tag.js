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
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tag", TagSchema);
