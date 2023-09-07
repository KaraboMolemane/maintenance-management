const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use Helmet!
app.use(helmet());

app.get("/", (req, res) => {
  res.send(
    "Hello world! Helmet has been implemented for security reasons."
  );
});


// Connect to database
const uri = "mongodb+srv://karabopro10:10KAraboXX@cluster-hyperiondev.0kansgb.mongodb.net/";
mongoose.Promise = global.Promise;
mongoose.connect(uri, {
  useMongoClient: true,
});
mongoose.connection.on("error", function () {
  console.log("Connection to Mongo established.");
  console.log("Could not connect to the database. Exiting now...");
  process.exit();
});

mongoose.connection.once("open", function () {
  console.log("Successfully connected to the database");
});
