const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const queryHandler = require("./queryHandler");

const port = 3000;
app.use(bodyParser.text());

app.listen(port, "0.0.0.0", () => {
  console.info(`Server listening at port ${port}`);
});

queryHandler(app);
