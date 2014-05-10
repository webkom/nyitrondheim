exports.limitDescription = function() {
  return function(input) {
    input = input || '';
    var arr = input.split('.');
    if (arr[0].length > 95) {
      return arr[0].slice(0, 95) + '…';
    }
    return arr[0] + '.';
  };
};

exports.exists = function() {
  return function(obj) {
    return obj !== null && obj !== undefined && obj !== 'null' && obj !== 'undefined';
  };
};
