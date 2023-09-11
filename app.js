const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

const controller  = require("./controllers/job.controller");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use Helmet!
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello world! Helmet has been implemented for security reasons.");
});

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", function () {
  console.log("Connection to Mongo established.");
  console.log("Could not connect to the database. Exiting now...");
  process.exit();
});
mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});

// CRUD endpoints 
app.get("/get-all-jobs", controller.findAll);
app.get("/get-open-jobs", controller.findOpenJobs);
app.post("/new-job", controller.addNewJob);
app.put("/edit-job", controller.editJob);
app.put("/archive-job", controller.archiveJob);


app.listen(8080, function () {
  console.log("Example app listening on port 8080!");
});

app.get("*", function (req, res, next) {
  let err = new Error("Sorry! Can't find that resource. Please check your URL");
  err.statusCode = 404;
  next(err);
});

/*
LINKS
https://medium.com/featurepreneur/connect-mongodb-database-to-express-server-step-by-step-53e548bb4967
*/
