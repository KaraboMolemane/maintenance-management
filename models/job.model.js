const mongoose = require("mongoose");

// Create schema
const JobSchema = mongoose.Schema({
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
    default: false,
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
const JobModel = mongoose.model("Job", JobSchema);
module.exports = JobModel;

