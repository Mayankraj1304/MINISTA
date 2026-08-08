const express = require('express')
const followController = require("../controllers/follow.controller")
const identifyUser = require("../middlewares/post.middleware")

const followRouter = express.Router()

/**
 * GET /api/user/follows/users
 */
followRouter.get('/users', identifyUser, followController.listUsersController)

/**
 * POST /api/user/follows/:username
 */
followRouter.post('/:username', identifyUser, followController.createFollowController)

/**
 * GET /api/user/follows/:requestId/:action
 */
followRouter.get('/:requestId/:action', followController.updateFollowRequestController)

module.exports = followRouter

