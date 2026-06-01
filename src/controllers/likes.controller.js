const userModel = require("../models/User.model");
const likesModel = require("../models/likes.model");

async function createLikesController(req, res) {
  try {
    const { id: postId } = req.params;

    const currentUser = await userModel.findById(req.user.id);

    if (!currentUser) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    const existingLike = await likesModel.findOne({
      likedBy: currentUser._id,
      post: postId,
    });

    if (existingLike) {
      return res.status(409).json({
        message: "You have already liked this post",
      });
    }

    const like = await likesModel.create({
      likedBy: currentUser._id,
      post: postId,
    });

    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
      like,
    });
  } catch (error) {
    console.error("Like Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createLikesController,
};