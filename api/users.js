const express = require('express');
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

const { getAllUsers, getUserByUsername, createUser } = require('../db');

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers()
  res.send({
    users
  });
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    const user = await createUser({
      username,
      password,
      name,
      location,
    });

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({ 
      message: "thank you for signing up",
      token 
    });
  } catch ({ name, message }) {
    next({ name, message })
  } 
});

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2I0Zjg2YWU4Y2VjNjAwMTczMGM1NTgiLCJ1c2VybmFtZSI6InNuamV6YSIsImlhdCI6MTY3MjgwNDQ2OX0.syRNnlTiRVEFR6l8-tah_0SkdQ2cDuKg5kboZD3Bt0M
  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      // create token & return to user
      res.send({ message: "you're logged in!" });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;
