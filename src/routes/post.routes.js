const express = require('express')
const postController = require("../controllers/post.controller")
const multer  = require('multer')
const upload = multer({ storage: multer.memoryStorage() })

const postRouter = express.Router()

/**
 * POST /api/posts/
 */
postRouter.post('/', upload.single('imgUrl'), postController.createPostController)


module.exports = postRouter