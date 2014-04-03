var mongoose = require('mongoose')
  , Union    = require('../models/union');

var nameOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {name: value};
};

exports.getUnion = function(req, res) {
  var union = req.params.union;

  Union.findOne(nameOrId(union), function(err, union) {
    if (err) return res.send(500, err);
    if (null === union) return res.send(404, {message: 'Union not found.'});
    res.send(union);
  });
};
