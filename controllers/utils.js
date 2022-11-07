const { isEqual } = require('lodash');

function checkState(grid) {
  let count = 0;
  for (let i = 0; i < 3; i++) {
    // Checking if it is a tie
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] !== '') {
        count++;
      }
    }
  }
  if (count === 9) {
    return 'tie';
  }

  for (let i = 0; i < 3; i++) {
    if (
      grid[i][0] === grid[i][1] &&
      grid[i][1] === grid[i][2] &&
      grid[i][0] &&
      grid[i][1] &&
      grid[i][2]
    ) {
      return { win: grid[i][0] };
    }
    if (
      grid[0][i] === grid[1][i] &&
      grid[0][i] === grid[2][i] &&
      grid[0][i] &&
      grid[1][i] &&
      grid[2][i]
    ) {
      return { win: grid[0][i] };
    }
  }
  if (
    grid[0][0] &&
    grid[1][1] &&
    grid[2][2] &&
    grid[0][0] === grid[1][1] &&
    grid[0][0] === grid[2][2]
  ) {
    return { win: grid[0][0] };
  }
  if (
    grid[0][2] &&
    grid[1][1] &&
    grid[2][0] &&
    grid[0][2] === grid[1][1] &&
    grid[0][2] === grid[2][0]
  ) {
    return { win: grid[0][2] };
  }
  return false;
}

function placeMark(grid, mark, diff) {
  let possibleMoves = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === '') {
        possibleMoves.push([i, j]);
      }
    }
  }
  let choosePlace;
  if (diff === 'normal') {
    choosePlace = choosePlaceByDiff(grid, possibleMoves, mark, diff);
  } else if (diff === 'hard') {
    choosePlace = choosePlaceByDiff(grid, possibleMoves, mark, diff);
  } else {
    choosePlace =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  grid[choosePlace[0]][choosePlace[1]] = mark;
  return grid;
}

function choosePlaceByDiff(grid, possibleMoves, mark, diff) {
  let oppMark = mark === 'X' ? 'O' : 'X';
  let tempGrid = JSON.parse(JSON.stringify(grid)); // Cloning grid to tempGrid

  for (let i = 0; i < possibleMoves.length; i++) {
    // Checking if the bot can win in any position
    tempGrid[possibleMoves[i][0]][possibleMoves[i][1]] = mark;
    if (checkState(tempGrid)) {
      return possibleMoves[i];
    }
    tempGrid = JSON.parse(JSON.stringify(grid));
  }
  for (let i = 0; i < possibleMoves.length; i++) {
    tempGrid[possibleMoves[i][0]][possibleMoves[i][1]] = oppMark; // Checking if the user can win by placing the mark in any position | prevent the user from winning
    if (checkState(tempGrid)) {
      return possibleMoves[i];
    }
    tempGrid = JSON.parse(JSON.stringify(grid));
  }

  if (diff === 'hard') {
    // Hard difficulty prioritieses placing the mark on the corners to make 2v1 situations.
    let priorityMoves = [];
    for (let i = 0; i < possibleMoves.length; i++) {
      if (
        isEqual(possibleMoves[i], [0, 0]) ||
        isEqual(possibleMoves[i], [0, 2]) ||
        isEqual(possibleMoves[i], [2, 0]) ||
        isEqual(possibleMoves[i], [2, 2])
      ) {
        priorityMoves.push(possibleMoves[i]);
      }
    }
    return priorityMoves[Math.floor(Math.random() * priorityMoves.length)];
  }

  return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

module.exports = { checkState, placeMark };
