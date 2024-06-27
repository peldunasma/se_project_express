const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const unauthorizedError = require("../utils/errors");


const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(new unauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new unauthorizedError("Authorization Required"));
  }

  req.user = payload;

  return next();
};

module.exports = {handleAuthorization};