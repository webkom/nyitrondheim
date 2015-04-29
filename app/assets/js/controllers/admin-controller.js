/**
 * AdminController
 */

module.exports = ['$scope', '$timeout', 'articleService', 'alertService',
function($scope, $timeout, articleService, alertService) {
  $scope.selectedDate = new Date();
  $scope.union = union._id;
  $scope.selectedUnion = union._id;
  $scope.articles = [];
  $scope.events = [];
  $scope.today = new Date();

  $scope.getArticlesAndEvents = function() {
    return $scope.articles.concat($scope.events);
  };

  $scope.setImage = function(image, inputField) {
    if (image.size < 10000000 && image.type.slice(0, 5) === 'image') {
      if (!inputField) angular.element('#file-input').val(null);
      $scope.article.uploadFile = image;
      $scope.article.imageName = image.name;
      $scope.invalidImage = false;
    }
    else {
      $scope.invalidImage = true;
      console.log('Invalid image.');
    }
  };

  $scope.removeImage = function(image) {
    $scope.article.image = null;
    $scope.article.imageCropped = null;
    $scope.article.imageName = null;
  };

  $scope.chooseArticle = function(article, selectedIndex) {
    $scope.selectedIndex = selectedIndex;
    $scope.article = article;
  };

  $scope.open = function($event, opened) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[opened] = true;
  };

  $scope.findAll = function() {
    $scope.loading = true;
    articleService.findAll($scope.union).then(function(articles) {
      // Success callback

      $scope.loading = false;

      $scope.articles = articles.filter(function(article) {
        return !article.event;
      });
      $scope.events = articles.filter(function(article) {
        return article.event;
      });
    }, function(err) {
      // Error callback
      if (err) return console.log('Error finding articles:', err);
    });
  };

  $scope.findAllNoUnion = function() {
    articleService.findAllNoUnion().then(function(result) {
      var articles = result.data;

      $scope.articles = articles.filter(function(article) {
        return !article.event;
      });
      $scope.events = articles.filter(function(article) {
        return article.event;
      });
    }, function(err) {
      // Error callback
      if (err) return console.log('Error finding articles:', err);
    });
  };

  $scope.createArticle = function() {
    $scope.selectedIndex = 0;
    $scope.article = {
      union: $scope.selectedUnion,
      approved: false
    };
  };

  $scope.createEvent = function() {
    $scope.selectedIndex = $scope.articles.length + 1;
    $scope.article = {
      event: true,
      union: $scope.selectedUnion,
      approved: false,
      color: '#5bc0de'
    };
  };

  $scope.setApprovedStatus = function(status) {
    $scope.article.approved = status;
  };

  $scope.setColor = function(color) {
    if ($scope.article.event) {
      $scope.article.color = color;
    }
  };

  $scope.saveArticle = function(article) {
    if (article.event) {
      var startTime = moment(article.startTime, 'HH:mm');
      var endTime = moment(article.endTime, 'HH:mm');

      if (typeof article.start !== 'string') {
        var start = moment([
          article.start.getFullYear(),
          article.start.getMonth(),
          article.start.getDate(),
          startTime.hour(),
          startTime.minute()
        ]);
        article.start = start.toISOString();
      }

      if (typeof article.end !== 'string') {
        var end = moment([
          article.end.getFullYear(),
          article.end.getMonth(),
          article.end.getDate(),
          endTime.hour(),
          endTime.minute()
        ]);
        article.end = end.toISOString();
      }
    }

    articleService.save(article.union, article)
      .success(function(data) {
        $scope.uploading = false;

        if (!article._id) {
          if (article.event) {
            alertService.addSuccess(
              'Ferdig! Arrangementet må godkjennes før det vises i kalenderen.'
            );
            $scope.events.push(data);
            $scope.createEvent();
          }
          else {
            alertService.addSuccess(
              'Ferdig! Artikkelen må godkjennes før det vises på forsiden.'
            );
            $scope.articles.push(data);
            $scope.createArticle();
          }
        }
        else {
          alertService.addSuccess();
          $scope.articles[$scope.articles.indexOf(article)] = data;
          $scope.article = data;
        }
      })
      .progress(function(evt) {
        $scope.uploading = true;
        $scope.progress = parseInt(100.0 * evt.loaded/evt.total);
        if ($scope.progress === 100) $scope.uploading = false;
      })
      .error(function(err) {
        console.log('Error:', err);
        alertService.addError();
      });

  };

  $scope.destroyArticle = function(article) {
    articleService.destroy(article.union, article).success(function(data) {
      alertService.addSuccess();
      if (article.event) {
        $scope.events.splice($scope.events.indexOf(article), 1);
      }
      else {
        $scope.articles.splice($scope.articles.indexOf(article), 1);
      }
      $scope.article = {};
    })
    .error(function(err) {
      console.log('Error:', err);
      $scope.addAlert($scope.alerts.danger);
    });
  };

  $scope.getUnionName = function(unionId) {
    if (unionId) {
      var union = _.where($scope.unions, {_id: unionId});
      if (union[0]) {
        return union[0].name;
      }
      return 'N/A';
    }
  };
}];
