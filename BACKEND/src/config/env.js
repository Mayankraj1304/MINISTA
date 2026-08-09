const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  imagekitKey: process.env.IMAGEKIT_KEY,
  apiPublicUrl: process.env.API_PUBLIC_URL,
  gmailUser: process.env.GMAIL_USER,
  gmailAppPassword: process.env.GMAIL_APP_PASSWORD,
  emailFrom: process.env.EMAIL_FROM,
  jsonBodyLimit: process.env.JSON_BODY_LIMIT || "1mb",
  trustProxy: process.env.TRUST_PROXY || "1",
};

requireEnv("MONGO_URI", env.mongoUri);
requireEnv("JWT_SECRET", env.jwtSecret);
requireEnv("FRONTEND_URL", env.frontendUrl);
requireEnv("IMAGEKIT_KEY", env.imagekitKey);
requireEnv("API_PUBLIC_URL", env.apiPublicUrl);
requireEnv("GMAIL_USER", env.gmailUser);
requireEnv("GMAIL_APP_PASSWORD", env.gmailAppPassword);
requireEnv("EMAIL_FROM", env.emailFrom);

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function validateProductionEnv() {
  const required = [
    ["MONGO_URI", env.mongoUri],
    ["JWT_SECRET", env.jwtSecret],
    ["FRONTEND_URL", env.frontendUrl],
    ["API_PUBLIC_URL", env.apiPublicUrl],
    ["IMAGEKIT_KEY", env.imagekitKey],
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing production environment variables: ${missing.join(", ")}`,
    );
  }

  if (env.jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
}

module.exports = {
  env,
  requireEnv,
  validateProductionEnv,
};
