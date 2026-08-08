const mongoose = require("mongoose");
const { env, requireEnv } = require("./env");

async function connectToDatabase() {
  await mongoose.connect(requireEnv("MONGO_URI", env.mongoUri));
  console.log("Connected to MongoDB");
}

module.exports = connectToDatabase;
