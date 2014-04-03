var mongoose = require('mongoose')
  , Union    = require('../models/union');

var nameOrId = function(value) {
  if (value.match(/^[0-9a-fA-F]{24}$/)) return {_id: value};
  return {name: value};
};

var handleError = function(err, req, res) {
  console.log(err);
  res.send(500, err);
};

exports.list = function(req, res) {
  Union.find({}, function(err, unions) {
    if (err) return handleError(err, req, res);
    res.send(unions);
  });
};

exports.show = function(req, res) {
  var union = req.params.union;

  Union.findOne(nameOrId(union), function(err, union) {
    if (err) return res.send(500, err);
    if (null === union) return res.send(404, {message: 'Union not found.'});
    res.send(union);
  });
};

exports.create = function(req, res) {
  var union = new Union({name: req.body.name, description: req.body.description});
  union.save(function(err) {
    if (err) return handleError(err, req, res);
    res.send(201, union);
  });
};
