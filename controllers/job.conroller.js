//find Jobs - All
exports.findAll = function (req, res) {
  Job.find(function (err, blogs) {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Some error occurred while retrieving jobs" });
    } else {
      res.send(blogs);
    }
  });
};
