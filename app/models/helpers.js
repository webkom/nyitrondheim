exports.checkIfId = function(id) {
  return String(id).match(/^[0-9a-fA-F]{24}$/);
};
