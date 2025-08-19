const dotenv = require("dotenv");

dotenv.config({ path: "mbm.env" });

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 4000,
  mongoose: {
    url:
      process.env.MONGODB_URI || "mongodb://localhost:27017/mern-backend-api",
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET || "thisisasamplesecret",
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION || "15m",
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION || "7d",
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
    from: process.env.EMAIL_FROM,
  },
};
