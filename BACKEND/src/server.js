require("dotenv").config();
const app = require("./app");
const connectToDatabase = require("./config/database");
const { env, validateProductionEnv } = require("./config/env");

if (env.nodeEnv === "production") {
  validateProductionEnv();
}

connectToDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server is running on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
