const express = require('express');
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const followRouter = require("./routes/follow.routes")
const likesRouter = require("./routes/likes.routes")
const { env } = require("./config/env")

const app = express();
const allowedOrigins = env.frontendUrl
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/user/follows", followRouter)
app.use("/api/user/likes", likesRouter)
module.exports = app;
