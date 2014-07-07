
/**
 * Truncate article descriptions
 */

exports.limitDescription = function() {
  return function(input, max) {
    input = input || '';
    max = max || 95;
    var description = input.split('.').shift();
    var words = description.split(' ');
    var newDescription = '';
    words.some(function(word) {
      if ((newDescription + word).length > max) {
        return true;
      }
      newDescription += word + ' ';
    });
    newDescription = newDescription.slice(0, newDescription.length-1);
    return description.length > max
      ? newDescription + '…'
      : newDescription + '.';
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
