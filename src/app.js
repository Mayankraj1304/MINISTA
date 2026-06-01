const express = require('express');
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const followRouter = require("./routes/follow.routes")
const likesRouter = require("./routes/likes.routes")

const app = express();
app.use(express.json());
app.use(cookieParser())


app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/user/follows", followRouter)
app.use("/api/user/likes", likesRouter)
module.exports = app;