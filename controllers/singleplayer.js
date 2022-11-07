const { StatusCodes } = require('http-status-codes');
const { checkState, placeMark } = require('./utils');

const makeMove = (req, res, next) => {
  const { mark, difficulty } = req.body;
  let { grid } = req.body;
  let isFinished = checkState(grid);
  if (isFinished) {
    return res.status(StatusCodes.OK).json({ grid: grid, state: isFinished });
  }
  grid = placeMark(grid, mark, difficulty);
  isFinished = checkState(grid);
  if (isFinished) {
    return res.status(StatusCodes.OK).json({ grid: grid, state: isFinished });
  }
  res.status(StatusCodes.OK).json({ grid: grid, state: isFinished });
};
module.exports = { makeMove };
