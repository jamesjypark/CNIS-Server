const fs = require("fs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

module.exports = app => {
  if (!fs.existsSync("patientInfo.db")) {
    fs.writeFileSync("patientInfo.db", "");
  }
  const db = new sqlite3.Database("patientInfo.db");
  const testObject = {
    patientId: "test",
    name: "Josh",
    village: "Test",
    contact: "0000-1111-2222",
    age: "21",
    height: "180",
    weight: "180",
    parity: "3",
    duration: "523",
    medicalHistory: "Test",
    firstRecord: "2019-05-20",
    fetalSize: "13",
    diastolic: "25",
    systolic: "21",
    coexistingConditions: "Test1",
    secondRecord: "2019-05-21",
    CMDS: "2",
  }
  const objectLength = Object.keys(testObject).length;
  const isPrenatal = objectLength === 12;
  db.run('CREATE TABLE IF NOT EXISTS PatientInfo (patientId TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, village TEXT NOT NULL, contact TEXT NOT NULL, age TEXT, height TEXT, weight TEXT, parity TEXT, duration TEXT, medicalHistory TEXT, firstRecord TEXT, fetalSize TEXT, diastolic TEXT, systolic TEXT, coexistingConditions TEXT, secondRecord TEXT, CMDS TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS MedicalHistory (patientId TEXT NOT NULL, history TEXT NOT NULL, PRIMARY KEY (patientId, history))');
  db.run('CREATE TABLE IF NOT EXISTS CoexistingCondition (patientId TEXT NOT NULL, condition TEXT NOT NULL, PRIMARY KEY(patientId, condition))');

  app.get("/server.js", cors(), (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({ msg: "hello" });
    console.log("request received from client");
  });

  app.post("/server.js", cors(), (req, res) => {
    const { patientId, name, village, contact, age, height, weight, parity, duration, medicalHistory, firstRecord, fetalSize, diastolic, systolic, coexistingConditions, secondRecord, CMDS } = testObject;
    console.log(`${patientId}, ${name}, ${village}, ${contact}`)
    const query = `INSERT INTO PatientInfo (patientId, name, village, contact, age, height, weight, parity, duration, medicalHistory, firstRecord, fetalSize, diastolic, systolic, coexistingConditions, secondRecord, CMDS) VALUES ('${patientId}', '${name}', '${village}', '${contact}', '${age}', '${height}', '${weight}', '${parity}', '${duration}', '${medicalHistory}', '${firstRecord}', '${fetalSize}', '${diastolic}', '${systolic}', '${coexistingConditions}', '${secondRecord}', '${CMDS}')`
    db.serialize(() => {
      db.run(query, err => {
        if (err) {
          console.log(`error occurred: ${err}`);
        } else {
          console.log('success');
        }
      })
    })
    // console.log(JSON.parse(req.body).testString);
    res.end();
  });
};
