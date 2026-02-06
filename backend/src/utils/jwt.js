const jwt = require("jsonwebtoken");
const config = require("../config/config");

const generateToken = (
  payload,
  expiresIn = config.jwt.accessExpirationMinutes
) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const accessToken = generateToken({ sub: user._id, type: "access" });

  const refreshTokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const refreshToken = generateToken(
    { sub: user._id, type: "refresh" },
    config.jwt.refreshExpirationDays
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
