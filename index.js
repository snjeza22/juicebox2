require('dotenv').config();


const PORT = 3000;
const express = require('express');
const server = express();
const jwt = require('jsonwebtoken');
const { createUser } = require('./db');

const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.static('public'));
server.use(express.json());


server.get('/', (req, res, next) => {
res.sendFile(__dirname,"/public/index.html");
})

server.post('/register', async (req, res, next)=>{
  console.log("request to register user...");
  const {username, password} = req.body;
  try {
    const user = await createUser({username, password});
    console.log (user);
    res.status(200).send({
      token: jwt.sign(
        {message: "register success,welcome aboard"},
        process.env.JWR_SECRET
      ),
    });
  } catch (error) {
    res.status(409).send({message: "could not register.."})
  }
})



server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.get('/background/:color', (req, res, next) => {
  res.send(`
    <body style="background: ${ req.params.color };">
      <h1>Hello World</h1>
    </body>
  `);
});

server.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`<h1>${ req.params.first } + ${ req.params.second } = ${
    Number(req.params.first) + Number(req.params.second)
   }</h1>`);
});

const apiRouter = require('./api');
server.use("/api", apiRouter);


const port = process.env.PORT || 3000;

const { client } = require('./db');
client.connect();

server.listen(port, () => {
  console.log(`The server is up on port ${port}`)
});