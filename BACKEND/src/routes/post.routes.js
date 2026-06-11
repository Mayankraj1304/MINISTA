const express = require('express')
const postController = require("../controllers/post.controller")
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const identifyUser = require("../middlewares/post.middleware")

const postRouter = express.Router()

/**
 * POST /api/posts/
 */
postRouter.post('/', identifyUser, upload.single('imgUrl'), postController.createPostController)
postRouter.get('/', identifyUser, postController.getAllPostsController)
postRouter.get('/feed', identifyUser, postController.getFeedController)
postRouter.get('/:id', identifyUser, postController.getPostByIdController)
module.exports = postRouter