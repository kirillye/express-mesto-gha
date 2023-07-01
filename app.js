const { PORT = 3000 } = process.env;
const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const logErrors = require("./middlewares/logErrors");
const { errors } = require("celebrate");
const app = express();

app.use(cookieParser());
app.use(express.static("build"));
// parse application/json
app.use(express.json());

// app.get("/posts", (req, res) => {
//   console.log(req.cookies.jwt); // достаём токен
// });

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
app.use(errors());
app.use(logErrors);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
