
/**
 * Truncate article descriptions
 */

exports.limitDescription = function() {
  return function(input, max) {
    input = input || '';
    max = max || 95;
    var sentences = input.split('.');
    var description = sentences[0];
    if (sentences.length > 1) {
      description += '.';
    }

    var words = description.split(' ');
    var newDescription = '';

    // Pick words until the length cap is hit.
    words.some(function(word) {
      if ((newDescription + word).length > max) {
        return true;
      }
      newDescription += word + ' ';
    });

    // Remove unneccessary whitespace
    newDescription = newDescription.trim();

    // Match everything except the ending character first, then the ending character.
    if (description.length > max) {
      return newDescription + '…';
    }
    else {
      // In case the description has no ending character, return it.
      return newDescription;
    }
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
