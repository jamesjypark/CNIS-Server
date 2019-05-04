const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const port = 3000;
app.use(bodyParser.text());

app.listen(port, "0.0.0.0", () => {
  console.info(`Server listening at port ${port}`);
});

app.get("/server.js", cors(), (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({ msg: "hello" });
  console.log("request received from client");
});

app.post("/server.js", cors(), (req, res) => {
  console.log(JSON.parse(req.body).testString);
  res.end();
});
