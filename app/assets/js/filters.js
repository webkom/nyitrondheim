
/**
 * Truncate article descriptions
 */

exports.limitDescription = function() {
  return function(input, max) {
    input = input || '';
    max = max || 95;
    var description = input.split('.').shift();
    return description.length > max
      ? description.slice(0, max) + '…'
      : description + '.';
  };
};

/**
 * Check if an object exists
 */

exports.exists = function() {
  return function(obj) {
    return obj !== null && obj !== undefined && obj !== 'null' && obj !== 'undefined';
  };
};
