const jwt = require("jsonwebtoken");
async function identifyUser(req, res, next) {
  let decoded;
  const token = req.cookies.token;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
    console.error("Invalid token:", err);
  }

  req.user = decoded;

  next();
}

module.exports = identifyUser;
