/**
 * AdminController
 */

module.exports = ['$scope', '$timeout', 'articleService', function($scope, $timeout, articleService) {
  $scope.selectedDate = new Date();
  $scope.union = union._id;
  $scope.selectedUnion = union._id;
  $scope.articles = [];
  $scope.events = [];
  $scope.today = new Date();

  $scope.alerts = {
    danger: { type: 'danger', msg: 'Oops, noe gikk galt :(. Prøv igjen!' },
    success: { type: 'success', msg: 'Ferdig!' }
  };

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
    //$scope.article = _.omit($scope.article, ['image', 'imageCropped', 'imageName']);
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
      console.log('res', result);
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
      // Merge times and dates into one:
      var start = moment(article.start);
      var end = moment(article.end);
      start.hour(article.startTime.slice(0, article.startTime.indexOf(':')));
      start.minutes(article.startTime.slice(article.startTime.indexOf(':')+1));
      end.hour(article.endTime.slice(0, article.endTime.indexOf(':')));
      end.minutes(article.endTime.slice(article.endTime.indexOf(':')+1));
      article.start = start.toDate();
      article.end = end.toDate();
    }

    articleService.save(article.union, article)
      .success(function(data) {
        $scope.uploading = false;
        $scope.addAlert($scope.alerts.success);
        if (!article._id) {

          if (article.event) {
            $scope.events.push(data);
            $scope.createEvent();
          }
          else {
            $scope.articles.push(data);
            $scope.createArticle();
          }
        }
        else {
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
        $scope.addAlert($scope.alerts.danger);
      });

  };

  $scope.destroyArticle = function(article) {
    articleService.destroy(article.union, article).success(function(data) {
      $scope.addAlert($scope.alerts.success);
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

  $scope.addAlert = function(alert) {
    $scope.alert = alert;
    // Fade the alert out after a second, remove it after 0,7 seconds.
    $timeout(function() {
      $scope.fade = true;
      $timeout(function() {
        $scope.alert = null;
        $scope.fade = false;
      }, 700);
    }, 1000);
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
