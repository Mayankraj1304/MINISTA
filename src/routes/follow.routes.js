const express = require('express')
const followController = require("../controllers/follow.controller")
const identifyUser = require("../middlewares/post.middleware")

const followRouter = express.Router()

/**
 * POST /api/user/follows/:username
 */
followRouter.post('/:username', identifyUser, followController.createFollowController)
module.exports = followRouter