const jwt = require("jsonwebtoken");
const userModel = require("../models/User.model");
const { env, requireEnv } = require("../config/env");

async function identifyUser(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, requireEnv("JWT_SECRET", env.jwtSecret));
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(401).json({ message: "Invalid token" });
  }

  const user = await userModel.findById(decoded.id);

  if (!user) {
    res.clearCookie("token");
    return res.status(401).json({ message: "Invalid user" });
  }

  req.user = { id: user._id };
  next();
}

module.exports = identifyUser;

