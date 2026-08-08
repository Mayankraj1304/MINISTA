const express = require('express')
const followController = require("../controllers/follow.controller")
const identifyUser = require("../middlewares/post.middleware")

const followRouter = express.Router()

/**
 * GET /api/user/follows/users
 */
followRouter.get('/users', identifyUser, followController.listUsersController)

/**
 * GET /api/user/follows/requests
 */
followRouter.get('/requests', identifyUser, followController.listFollowRequestsController)

/**
 * PATCH /api/user/follows/requests/:requestId/:action
 */
followRouter.patch('/requests/:requestId/:action', identifyUser, followController.updateAuthenticatedFollowRequestController)

/**
 * POST /api/user/follows/:username
 */
followRouter.post('/:username', identifyUser, followController.createFollowController)

/**
 * GET /api/user/follows/:requestId/:action
 */
followRouter.get('/:requestId/:action', followController.updateFollowRequestController)

module.exports = followRouter
