const userModel = require("../models/User.model");
const likesModel = require("../models/likes.model");
const postModel = require("../models/post.model");
const followModel = require("../models/follow.model");

async function canUserViewPost(userId, post) {
  return (
    post.user.toString() === userId.toString() ||
    Boolean(
      await followModel.exists({
        follower: userId,
        followee: post.user,
        status: "accepted",
      }),
    )
  );
}

async function createLikesController(req, res) {
  try {
    const { id: postId } = req.params;

    const [currentUser, post] = await Promise.all([
      userModel.findById(req.user.id),
      postModel.findById(postId),
    ]);

    if (!currentUser) {
      return res.status(401).json({
        message: "Authenticated user not found",
      });
    }

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!(await canUserViewPost(currentUser._id, post))) {
      return res.status(403).json({
        message: "You can only like posts from people you follow",
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

async function deleteLikesController(req, res) {
  try {
    const { id: postId } = req.params;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!(await canUserViewPost(req.user.id, post))) {
      return res.status(403).json({
        message: "You can only unlike posts from people you follow",
      });
    }

    const deletedLike = await likesModel.findOneAndDelete({
      likedBy: req.user.id,
      post: postId,
    });

    if (!deletedLike) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post unliked successfully",
    });
  } catch (error) {
    console.error("Unlike Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  createLikesController,
  deleteLikesController,
};
