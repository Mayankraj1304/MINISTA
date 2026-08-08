const multer = require("multer");
const upload = multer();
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");
const likesModel = require("../models/likes.model");
const followModel = require("../models/follow.model");
const { env, requireEnv } = require("../config/env");

// For uploading an image file to ImageKit using multer memory storage.
async function createPostController(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagekit = new ImageKit({
    privateKey: requireEnv("IMAGEKIT_KEY", env.imagekitKey),
  });

  const uploadResult = await imagekit.files.upload({
    file: await toFile(req.file.buffer, req.file.originalname),
    fileName: req.file.originalname,
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgUrl: uploadResult.url,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created",
    post,
  });
}

async function getAllPostsController(req, res) {
  const posts = await postModel.find({ user: req.user.id });
  res.status(200).json({ posts });
}

async function getPostByIdController(req, res) {
  const post = await postModel.findById(req.params.id).lean();
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const canView =
    post.user.toString() === req.user.id.toString() ||
    (await followModel.exists({
      follower: req.user.id,
      followee: post.user,
      status: "accepted",
    }));

  if (!canView) {
    return res
      .status(403)
      .json({ message: "You can only view posts from people you follow" });
  }

  res.status(200).json({ post });
}

async function getFeedController(req, res) {
  const acceptedFollows = await followModel
    .find({ follower: req.user.id, status: "accepted" })
    .select("followee")
    .lean();
  const visibleUserIds = [
    req.user.id,
    ...acceptedFollows.map((follow) => follow.followee),
  ];

  const posts = await postModel
    .find({ user: { $in: visibleUserIds } })
    .populate("user", "username profileImage")
    .sort({ createdAt: -1 })
    .lean();

  const postIds = posts.map((post) => post._id);
  const likes = await likesModel.find({ post: { $in: postIds } }).lean();
  const currentUserId = req.user.id.toString();

  const postsWithLikes = posts.map((post) => {
    const postLikes = likes.filter(
      (like) => like.post.toString() === post._id.toString(),
    );

    return {
      ...post,
      likesCount: postLikes.length,
      likedByMe: postLikes.some(
        (like) => like.likedBy.toString() === currentUserId,
      ),
    };
  });

  res.status(200).json({ posts: postsWithLikes });
}

module.exports = {
  createPostController,
  getAllPostsController,
  getPostByIdController,
  getFeedController,
};



