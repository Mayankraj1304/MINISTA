const multer = require("multer");
const upload = multer();
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");
const jwt = require("jsonwebtoken");
const postModel = require("../models/post.model");

// For uploading an image file to ImageKit using multer memory storage.
async function createPostController(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_KEY,
  });

  const uploadResult = await imagekit.files.upload({
    file: await toFile(req.file.buffer, req.file.originalname),
    fileName: req.file.originalname,
  });

  res.status(201).json({
    message: "File uploaded",
    url: uploadResult.url,
  });

  postModel.create({
    caption: req.body.caption,
    imgUrl: uploadResult.url,
    user: req.user.id,
  });
}

async function getAllPostsController(req, res) {
  const posts = await postModel.find({ user: req.user.id });
  res.status(200).json({ posts });
}

async function getPostByIdController(req, res) {
  const post = await postModel.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json({ post });
}

module.exports = {
  createPostController,
  getAllPostsController,
  getPostByIdController,
};
