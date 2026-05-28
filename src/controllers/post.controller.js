const userModel = require("../models/post.model");
const multer = require("multer");
const upload = multer();
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_KEY,
});

// For uploading an image file to ImageKit using multer memory storage.
async function createPostController(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadResult = await imagekit.files.upload({
    file: await toFile(req.file.buffer, req.file.originalname),
    fileName: req.file.originalname,
  });

  res.status(201).json({
    message: "File uploaded",
    url: uploadResult.url,
  });
}

module.exports = {
  createPostController,
};
