const express = require('express')
const likesController = require("../controllers/likes.controller")
const identifyUser = require("../middlewares/post.middleware")

const likesRouter = express.Router()

/**
 * POST /api/user/likes/:username
 */
likesRouter.post('/:id', identifyUser, likesController.createLikesController)
module.exports = likesRouter