const fs = require("fs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

module.exports = app => {
  if (!fs.existsSync("patientInfo.db")) {
    fs.writeFileSync("patientInfo.db", "");
  }
  const db = new sqlite3.Database("patientInfo.db");

  app.get("/server.js", cors(), (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({ msg: "hello" });
    console.log("request received from client");
  });

  app.post("/server.js", cors(), (req, res) => {
    console.log(JSON.parse(req.body).testString);
    res.end();
  });
};
