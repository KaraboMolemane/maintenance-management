const Job = require("../models/job.model");

//find Jobs - All
exports.findAll = async function (req, res) {
  try {
    const allJobs = await Job.find({});
    res.json(allJobs);
  } catch (error) {
    throw error;
  }
};


