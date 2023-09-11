const Job = require("../models/job.model");

// find Jobs - All
exports.findAll = async function (req, res) {
  try {
    const allJobs = await Job.find({});
    res.json(allJobs);
  } catch (error) {
    throw error;
  }
};

// find Jobs - All non-archived jobs
exports.findOpenJobs = async (req, res) => {
  // get non-archived jobs
  try {
    const allOpenJobs = await Job.find({ archived: { $ne: true } });
    res.send(allOpenJobs);
  } catch (error) {
    throw error;
  }
  // https://www.mongodb.com/docs/manual/reference/operator/query/ne/
};

// Add a new job
exports.addNewJob = async (req, res) => {
    // Create and save a new job
    let jobModel = new Job({
      description: req.body.description,
      location: req.body.location,
      priority: req.body.priority,
      status: req.body.status,
      archived: false,
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
};

// Edit existing job
exports.editJob = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = {
      description: req.body.description,
      location: req.body.location,
      priority: req.body.priority,
      status: req.body.status,
      archived: false,
      updatedAt: Date.now(),
    };
    const doc = await Job.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.send("Updated");
  } catch (error) {
    console.log("Something went wrong when updating data.:", error);
    res.send({ message: "Some error occurred while creating the job.", error });
  }
  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
};

// archive existing job
exports.archiveJob = async (req, res) => {
  try {
    const filter = { _id: req.body.id };
    const update = {
      archived: true,
      updatedAt: Date.now(),
    };
    const doc = await Job.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.send("Updated");
  } catch (error) {
    console.log("Something went wrong when updating data.:", error);
    res.send({ message: "Some error occurred while creating the job.", error });
  }
  // https://mongoosejs.com/docs/tutorials/findoneandupdate.html
};


