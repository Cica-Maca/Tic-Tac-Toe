const { StatusCodes } = require('http-status-codes');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/User');

const register = async (req, res, next) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email }, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please enter valid email and password!');
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthorizedError(`User with ${email} doesn't exist!`);
  }

  const passwordValid = await user.comparePassword(password);
  if (!passwordValid) {
    throw new UnauthorizedError('Password invalid!');
  }
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email }, token: token });
};

module.exports = { register, login };
