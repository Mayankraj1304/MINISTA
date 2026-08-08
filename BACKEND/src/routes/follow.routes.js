const express = require('express')
const followController = require("../controllers/follow.controller")
const identifyUser = require("../middlewares/post.middleware")
const asyncHandler = require("../utils/asyncHandler")

const followRouter = express.Router()

followRouter.get('/users', identifyUser, asyncHandler(followController.listUsersController))
followRouter.get('/requests', identifyUser, asyncHandler(followController.listFollowRequestsController))
followRouter.patch('/requests/:requestId/:action', identifyUser, asyncHandler(followController.updateAuthenticatedFollowRequestController))
followRouter.post('/:username', identifyUser, asyncHandler(followController.createFollowController))
followRouter.get('/:requestId/:action', asyncHandler(followController.updateFollowRequestController))

module.exports = followRouter
