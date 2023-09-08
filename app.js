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
    default: "Low",
  },
  status: {
    type: String,
    required: false,
    default: "submitted",
  },
  archived: {
    type: Boolean,
    required: false,
    default: "submitted",
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
let JobModel = mongoose.model("Job", JobSchema);

app.get("/get-all-jobs", async (req, res) => {
  try {
    const allJobs = await JobModel.find({});
    res.send(allJobs);
  } catch (error) {
    throw error;
  }
});

//get jobs - all (via Model and Controller)
// app.get("/get-all-jobs", findAll);

// Add new job
app.post("/new-job", function (req, res) {
  // Create and save a new jon
  let jobModel = new JobModel({
    description: req.body.description,
    location: req.body.location,
    priority: req.body.priority,
    status: req.body.status,
    archived: false,
    createdAt: req.body.createdAt,
    updatedAt: req.body.updatedAt,
  });

  jobModel
    .save()
    .then(function (doc) {
      console.log(doc._id.toString());
      res.send("The job has been added");
    })
    .catch(function (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Some error occurred while creating the job." });
    });
  // https://codeforgeek.com/insert-a-document-into-mongodb-using-mongoose/
});

// Edit existing job
app.post("/edit-job", function (req, res) {

    let filter = { _id: req.body.id };
  JobModel.findOneAndUpdate(
    filter,
    {    
        description: req.body.description,
        location: req.body.location,
        priority: req.body.priority,
        status: req.body.status,
        archived: false,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt
     },
    { new: true },
    function (err, doc) {
      if (err) {
        console.log("Something went wrong when updating data.");
      }
      res.send("Updated");
    }
  );
});

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
