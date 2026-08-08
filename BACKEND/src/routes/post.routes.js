const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});
const identifyUser = require("../middlewares/post.middleware");
const asyncHandler = require("../utils/asyncHandler");

const postRouter = express.Router();

postRouter.post(
  "/",
  identifyUser,
  upload.single("imgUrl"),
  asyncHandler(postController.createPostController),
);
postRouter.get("/", identifyUser, asyncHandler(postController.getAllPostsController));
postRouter.get("/feed", identifyUser, asyncHandler(postController.getFeedController));
postRouter.get("/:id", identifyUser, asyncHandler(postController.getPostByIdController));
module.exports = postRouter;
