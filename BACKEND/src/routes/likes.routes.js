const express = require('express')
const likesController = require("../controllers/likes.controller")
const identifyUser = require("../middlewares/post.middleware")
const asyncHandler = require("../utils/asyncHandler")

const likesRouter = express.Router()

likesRouter.post('/:id', identifyUser, asyncHandler(likesController.createLikesController))
likesRouter.delete('/:id', identifyUser, asyncHandler(likesController.deleteLikesController))
module.exports = likesRouter
