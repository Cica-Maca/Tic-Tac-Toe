const User = require('../models/User');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new UnauthorizedError('Login/Register to access this route!');
  }
  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: data.userID, name: data.name };
    next();
  } catch {
    throw new UnauthorizedError('Token is invalid!');
  }
};

module.exports = auth;
