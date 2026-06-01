const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required to like"],
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
      required: [true, "Post is required"],
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index(
  {
    likedBy: 1,
    post: 1,
  },
  {
    unique: true,
  }
);

const likesModel = mongoose.model("likes", likeSchema);

module.exports = likesModel;