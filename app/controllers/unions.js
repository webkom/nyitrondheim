
var mongoose = require('mongoose')
    , Union = mongoose.model('Union')
    ;

exports.getUnion = function(req, res) {
    var union = req.params.union;

    Union.findById(union, function(err, union) {
        if (err) return res.render('500');
        res.send(union);
    })
}