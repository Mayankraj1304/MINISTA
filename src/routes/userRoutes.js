const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

// Routes
router.get("/", getUsers);

module.exports = router;
