const mongoose = require("mongoose");

const postSchema = mongoose.model(
  "posts",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      rating: {
        type: Number,
        default: 0,
      },
      likes: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  )
);

module.exports = postSchema;