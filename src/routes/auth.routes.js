const express = require('express')
const authController = require("../controllers/auth.controller")
const identifyUser = require('../middlewares/post.middleware')


const authRouter = express.Router()

/**
 * POST /api/auth/register
 */
authRouter.post('/register', authController.registerController)


/**
 * POST /api/auth/login
 */
authRouter.post("/login", authController.loginController)


/**
 * POST /api/auth/getme
 */
authRouter.post("/getme",identifyUser, authController.getMeController)
module.exports = authRouter