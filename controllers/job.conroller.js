//find Jobs - All
exports.findAll = function (req, res) {
  Job.find(function (err, jobs) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Some error occurred while retrieving jobs" });
    } else {
      res.send(jobs);
    }
  });
};


//How does the app.js know about this file's existance? import/export? 