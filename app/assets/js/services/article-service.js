module.exports = [
  '$http',
  '$q',
  '$upload',
  function($http, $q, $upload) {
    var error = function() {
      console.log(arguments);
    };

    var urlBase = '/api/unions/';
    var articleCache = {};

    var saveCache = function(union) {
      return function(response) {
        articleCache[union] = response.data;
        return articleCache[union];
      };
    };

    return {
      findAll: function(union) {
        if (!_.isEmpty(articleCache[union])) {
          var d = $q.defer();
          d.resolve(articleCache[union]);
          return d.promise;
        }
        return $http
          .get(urlBase + union + '/articles')
          .then(saveCache(union), error);
      },

      findAllEvents: function(union) {
        return $http.get(urlBase + union + '/events').error(error);
      },

      findAllNoUnion: function() {
        return $http.get('/api/articles').error(error);
      },

      findBySlug: function(union, slug) {
        return $http.get(urlBase + union + '/articles/' + slug).error(error);
      },

      create: function(union, article) {
        if (article.uploadFile) {
          var file = article.uploadFile;
          article = _.omit(article, ['uploadFile', 'imageName']);

          return $upload
            .upload({
              url: urlBase + union + '/articles',
              method: 'POST',
              data: article,
              file: file
            })
            .error(error);
        }

        return $upload
          .upload({
            url: urlBase + union + '/articles',
            method: 'POST',
            data: article
          })
          .error(error);
      },

      update: function(union, article) {
        if (article.uploadFile) {
          var file = article.uploadFile;
          article = _.omit(article, ['uploadFile', 'imageName']);
          return $upload
            .upload({
              url: urlBase + union + '/articles/' + article._id,
              method: 'PUT',
              data: article,
              file: file
            })
            .error(error);
        }

        return $upload
          .upload({
            url: urlBase + union + '/articles/' + article._id,
            method: 'PUT',
            data: article
          })
          .error(error);
      },

      destroy: function(union, article) {
        return $http
          .delete(urlBase + union + '/articles/' + article._id)
          .error(error);
      },

      save: function(union, article) {
        if (article._id) return this.update(union, article);
        return this.create(union, article);
      }
    };
  }
];
