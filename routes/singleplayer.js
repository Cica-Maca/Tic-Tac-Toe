const express = require('express');
const { makeMove } = require('../controllers/singleplayer');

const Router = express.Router();

Router.get('', makeMove);

module.exports = Router;
