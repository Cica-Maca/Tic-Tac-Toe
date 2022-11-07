const express = require('express');
require('dotenv').config();
require('express-async-errors');

// middleware
const errorHandlerMiddleware = require('./middleware/errorHandler');
const notFoundMiddleware = require('./middleware/notFound');
const tokenAuthenticationMiddleware = require('./middleware/authentication');

// routes
const authRouter = require('./routes/auth');
const singleplayerRouter = require('./routes/singleplayer');

// database
const db = require('./db/db');

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use(
  '/api/v1/signleplayer',
  tokenAuthenticationMiddleware,
  singleplayerRouter
);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await db(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
