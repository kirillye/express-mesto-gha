const { PORT = 3000 } = process.env;
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("build"));
// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "648d52c4fb36c5d56a908db3",
  };
  next();
});

const routes = require("./routes");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/database", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log("error conected to db");
  });

app.use(routes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
