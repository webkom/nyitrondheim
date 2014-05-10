/**
 * Union Service
 */

module.exports = ['$http', 'localStorageService', function($http, localStorageService) {
  var error = function() {
    console.log(arguments);
  };

  var urlBase = '/api/unions';

  return {
    last: function() {
      return localStorageService.get('union') || {slug: 'general'};
    },

    pick: function(union) {
      localStorageService.add('union', union);
    },

    create: function(union) {
      return $http.post(urlBase, union).error(error);
    },

    update: function(union) {
      return $http.put(urlBase + union._id, union).error(error);
    },

    save: function(union) {
      if (union._id) return this.update(union);
      return this.create(union);
    },

    findAll: function() {
      return $http.get(urlBase).error(error);
    },

    findByName: function(name) {
      return $http.get(urlBase + name).error(error);
    }
  };
}];
