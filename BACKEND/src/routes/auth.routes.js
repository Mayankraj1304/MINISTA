const express = require('express')
const authController = require("../controllers/auth.controller")
const identifyUser = require('../middlewares/post.middleware')
const asyncHandler = require("../utils/asyncHandler")

const authRouter = express.Router()

authRouter.post('/register', asyncHandler(authController.registerController))
authRouter.post("/login", asyncHandler(authController.loginController))
authRouter.post("/getme", identifyUser, asyncHandler(authController.getMeController))
authRouter.post("/logout", asyncHandler(authController.logoutController))

module.exports = authRouter
