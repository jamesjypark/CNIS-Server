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
    firstDate: "2019-05-20",
    fetalSize: "13",
    diastolic: "25",
    systolic: "21",
    coexistingConditions: "Test1",
    secondDate: "2019-05-21",
    cmds: "2"
  }
  const objectLength = Object.keys(testObject).length;
  const isPrenatal = objectLength === 12;
  db.run('CREATE TABLE IF NOT EXISTS PatientInfo (patientId TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, village TEXT NOT NULL, contact TEXT NOT NULL, age TEXT, height TEXT, weight TEXT, parity TEXT, duration TEXT, firstDate TEXT, fetalSize TEXT, diastolic TEXT, systolic TEXT, secondDate TEXT, cmds TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS MedicalHistory (patientId TEXT NOT NULL, medicalHistory TEXT NOT NULL, PRIMARY KEY (patientId, medicalHistory))');
  db.run('CREATE TABLE IF NOT EXISTS CoexistingConditions (patientId TEXT NOT NULL, coexstingConditions TEXT NOT NULL, PRIMARY KEY(patientId, coexstingConditions))');
  db.run('CREATE TABLE IF NOT EXISTS PreEclampsiaList (patientId TEXT NOT NULL, preEclampsia TEXT NOT NULL, PRIMARY KEY(patientId, preEclampsia))');

  app.get("/server.js", cors(), (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).send({ msg: "hello" });
    console.log("request received from client");
  });

  //If there are 'coexistingConditions' or 'medicalHistory', then we will add them onto MedicalHistory() or CoexistingCondition(). 

  app.post("/server.js", cors(), (req, res) => {
    const receivedObject = (JSON.parse(req.body).testString);
    const { patientId, name, village, contact, age, height, weight, parity, duration, medicalHistoryList, firstDate, preEclampsiaList, fetalSize, diastolic, systolic, coexistingConditionsList, secondDate, cmds } = receivedObject;
    const generalQuery = `INSERT OR REPLACE INTO PatientInfo (patientId, name, village, contact, age, height, weight, parity, duration, firstDate, fetalSize, diastolic, systolic, secondDate, cmds) VALUES ('${patientId}', '${name}', '${village}', '${contact}', '${age}', '${height}', '${weight}', '${parity}', '${duration}', '${firstDate}', '${fetalSize}', '${diastolic}', '${systolic}', '${secondDate}', '${cmds}')`;
    // console.log(`received object is:`);
    // console.log(receivedObject);
    // console.log('coexistingConditionsList is');
    // console.log(typeof coexistingConditionsList);

    db.serialize(() => {
      db.run(generalQuery, err => {
        if (err) {
          console.log(`error occurred: ${err}`);
        } else {
        }
      });
      if (coexistingConditionsList) {
        coexistingConditionsList.forEach((coexistingConditions) => {
          const coexsitingConditionsQuery = `INSERT OR REPLACE INTO CoexistingConditions (patientId, coexstingConditions) VALUES ('${patientId}', '${coexistingConditions}')`;
          db.run(coexsitingConditionsQuery, err => {
            if (err) {
              console.log(`error occurred from coexistingConditions: ${err}`);
            } else {
              console.log('success from coexisting conditions');
            }
          });
        });
      };
      if (preEclampsiaList) {        
        preEclampsiaList.forEach((preEclmapsia) => {
          const preEclampsiaQuery = `INSERT OR REPLACE INTO PreEclampsiaList (patientId, preEclampsia) VALUES ('${patientId}', '${preEclmapsia}')`;
          db.run(preEclampsiaQuery, err => {
            if (err) {
                console.log(`error occurred from preEclampsia: ${err}`);
            } else {
              console.log(`success from preEclampsia`);
            }
          });
        });        
      }
      if (medicalHistoryList) {
        medicalHistoryList.forEach((medicalHistory) => {
          const medicalHistoryQuery = `INSERT OR REPLACE INTO MedicalHistory (patientId, medicalHistory) VALUES ('${patientId}', '${medicalHistory}')`;
          db.run(medicalHistoryQuery, err => {
            if (err) {
              console.log(`error occurred: ${err}`);
            } else {
              console.log('success');
            }
          });
        });
      };
    });
    // console.log(JSON.parse(req.body).testString);
    res.end();
  });
};

// V00831725 Malaria
// V00831725 Diabetes
// V00831725 
