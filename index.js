const PORT = 3000;
const express = require('express');
const server = express();


server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

const apiRouter = require('./api');
server.use("/api", apiRouter);


const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`The server is up on port ${port}`)
});