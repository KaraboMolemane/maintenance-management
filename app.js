const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

// const {findAll}  = require("./controllers/job.controller");

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

// Create schema
let JobSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    required: false,
    default: "anonymous",
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});
// Create Model
let Job = mongoose.model("Job", JobSchema);

app.get("/get-all-jobs", async (req, res) => {
  try {
    const allJobs = await Job.find({});
    console.log("allJobs:", allJobs);
    res.send(allJobs);
  } catch (error) {
    throw error;
  }
});

app.get("/get-jobs", function (req, res) {
  Job.find(function (err, jobs) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Some error occurred while retrieving jobs" });
    } else {
      res.send(jobs);
    }
  });
});

//get jobs - all (via Model and Controller)
// app.get("/get-all-jobs", findAll);

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
