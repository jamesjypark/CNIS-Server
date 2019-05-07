const fs = require("fs");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

module.exports = app => {
  if (!fs.existsSync("patientInfo.db")) {
    fs.writeFileSync("patientInfo.db", "");
  }
  const db = new sqlite3.Database("patientInfo.db");
  db.run(
    "CREATE TABLE IF NOT EXISTS PatientInfo (patientId TEXT NOT NULL PRIMARY KEY, name TEXT NOT NULL, village TEXT NOT NULL, contact TEXT NOT NULL, age TEXT, height TEXT, weight TEXT, parity TEXT, duration TEXT, firstDate TEXT, fetalSize TEXT, diastolic TEXT, systolic TEXT, secondDate TEXT, cmds TEXT)"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS MedicalHistory (patientId TEXT NOT NULL, medicalHistory TEXT NOT NULL, PRIMARY KEY (patientId, medicalHistory))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS CoexistingConditions (patientId TEXT NOT NULL, coexstingConditions TEXT NOT NULL, PRIMARY KEY(patientId, coexstingConditions))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS PreEclampsia (patientId TEXT NOT NULL, preEclampsia TEXT NOT NULL, PRIMARY KEY(patientId, preEclampsia))"
  );

  // POST request received from CNIS mobile app
  app.post("/server.js", cors(), (req, res) => {
    const receivedObject = JSON.parse(req.body).testString;
    const {
      patientId,
      name,
      village,
      contact,
      age,
      height,
      weight,
      parity,
      duration,
      medicalHistoryList,
      firstDate,
      preEclampsiaList,
      fetalSize,
      diastolic,
      systolic,
      coexistingConditionsList,
      secondDate,
      cmds
    } = receivedObject;
    const generalQuery = `INSERT OR REPLACE INTO PatientInfo (patientId, name, village, contact, age, height, weight, parity, duration, firstDate, fetalSize, diastolic, systolic, secondDate, cmds) VALUES ('${patientId}', '${name}', '${village}', '${contact}', '${age}', '${height}', '${weight}', '${parity}', '${duration}', '${firstDate}', '${fetalSize}', '${diastolic}', '${systolic}', '${secondDate}', '${cmds}')`;
    db.serialize(() => {
      db.run(generalQuery, err => {
        if (err) {
          console.log(`error occurred: ${err}`);
        } else {
        }
      });
      if (coexistingConditionsList) {
        coexistingConditionsList.forEach(coexistingConditions => {
          const coexsitingConditionsQuery = `INSERT OR REPLACE INTO CoexistingConditions (patientId, coexstingConditions) VALUES ('${patientId}', '${coexistingConditions}')`;
          db.run(coexsitingConditionsQuery, err => {
            if (err) {
              console.log(`error occurred from coexistingConditions: ${err}`);
            } else {
              console.log("success from coexisting conditions");
            }
          });
        });
      }
      if (preEclampsiaList) {
        preEclampsiaList.forEach(preEclmapsia => {
          const preEclampsiaQuery = `INSERT OR REPLACE INTO PreEclampsia (patientId, preEclampsia) VALUES ('${patientId}', '${preEclmapsia}')`;
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
        medicalHistoryList.forEach(medicalHistory => {
          const medicalHistoryQuery = `INSERT OR REPLACE INTO MedicalHistory (patientId, medicalHistory) VALUES ('${patientId}', '${medicalHistory}')`;
          db.run(medicalHistoryQuery, err => {
            if (err) {
              console.log(`error occurred: ${err}`);
            } else {
              console.log("success");
            }
          });
        });
      }
    });
    res.end();
  });

  // GET request by CNIS web client viewer

  app.get("/server.js/:info", cors(), (req, res) => {
    const info = req.params.info;
    db.all(`SELECT * FROM ${info}`, (err, rows) => {
      if (err) {
        res.status(204);
        console.log("error occurred writing coexisting conditions");
      } else {
        res.header("Content-Type", "application/json");
        res.status(200).send(rows);
      }
      res.end();
    });
  });

  // app.get("/server.js/CoexistingConditions", cors(), (req, res) => {
  //   db.all(`SELECT * FROM CoexistingConditions`, (err, rows) => {
  //     if (err) {
  //       res.status(204);
  //       console.log("error occurred writing coexisting conditions");
  //     } else {
  //       res.header("Content-Type", "application/json");
  //       res.status(200).send(rows);
  //     }
  //     res.end();
  //   });
  // });

  // app.get("/server.js/PreEclampsia", cors(), (req, res) => {
  //   db.all(`SELECT * FROM PreEclampsia`, (err, rows) => {
  //     if (err) {
  //       res.status(204);
  //       console.log("error occurred writing coexisting conditions");
  //     } else {
  //       res.header("Content-Type", "application/json");
  //       res.status(200).send(rows);
  //     }
  //     res.end();
  //   });
  // });
};
