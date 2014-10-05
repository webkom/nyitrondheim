exports.handleError = function(err, res) {
  console.log(err);
  res.status(500).send({
    error: err,
    status: 500
  });
};
