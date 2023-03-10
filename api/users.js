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
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NzQ0NDk5ODAsImV4cCI6MTY3NTA1NDc4MH0.nIMhS9U1KZA0OMZI1us_3SOGi4dwfodWeJmZ0qR3v9U
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

try {
    const user = await getUserByUsername(username);

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    if (user && user.password == password) {
      // create token & return to user

      res.send({ message: `you logged in! ${token}` });
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
