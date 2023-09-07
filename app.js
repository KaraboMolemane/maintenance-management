const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();

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
// mongoose.Promise = global.Promise;
// mongoose.connect(uri, {
//   useMongoClient: true,
// });
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

//get jobs - all
app.get("/get-all-jobs", async (req, res) => {
  try {
    if (req.query.name) {
    //   let allJobs = await Job.find({}).exec();
      const allJobs = await Job.find({});
      res.json(allJobs);
    } else {
      res.json({ error: "No name query found inside request" });
    }
  } catch (error) {
    throw error;

  }
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