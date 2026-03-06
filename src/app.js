const express = require("express");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Minista Backend API" });
});

module.exports = app;
