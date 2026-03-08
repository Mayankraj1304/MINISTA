const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// Routes
// Public route
router.get("/", getUsers);

// Protected route example - only authorized users can access
router.get("/profile", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.id}, this is a protected route` });
});

module.exports = router;
