/**
 * AdminController
 */

module.exports = ['$scope', 'articleService', function($scope, articleService) {
  $scope.selectedDate = new Date();
  $scope.union = union._id;
  $scope.articles = [];
  $scope.events = [];
  $scope.articlesAndEvents = [];
  $scope.today = new Date();

  $scope.setImage = function(image, inputField) {
    if (image.size < 10000000 && image.type.slice(0, 5) === 'image') {
      if (!inputField) angular.element('#file-input').val(null);
      $scope.article.image = image;
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
      $scope.loading = false;
      $scope.articlesAndEvents = articles;
      $scope.articles = articles.filter(function(article) {
        return !article.event;
      });
      $scope.events = articles.filter(function(article) {
        return article.event;
      });
    });
  };

  $scope.findAllNoUnion = function() {
    articleService.findAllNoUnion().success(function(articles) {
      $scope.articlesAndEvents = articles;
      $scope.articles = articles.filter(function(article) {
        return !article.event;
      });
      $scope.events = articles.filter(function(article) {
        return article.event;
      });
    });
  };

  $scope.createArticle = function() {
    $scope.selectedIndex = 0;
    $scope.article = {
      approved: false
    };
  };

  $scope.createEvent = function() {
    $scope.selectedIndex = $scope.articles.length + 1;
    $scope.article = {
      event: true,
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
    articleService.save($scope.union, article)
      .success(function(data) {
        $scope.uploading = false;
        if (!article._id) {
          $scope.articlesAndEvents.push(data.data);
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
          $scope.articles[$scope.articles.indexOf($scope.article)] = data;
          $scope.article = data;
        }
      })
      .progress(function(evt) {
        $scope.uploading = true;
        $scope.progress = parseInt(100.0 * evt.loaded/evt.total);
        if ($scope.progress === 100) $scope.uploading = false;
      });

  };

  $scope.destroyArticle = function(article) {
    articleService.destroy($scope.union, article).success(function(data) {
      if (article.event) {
        $scope.events.splice($scope.events.indexOf(article), 1);
      }
      else {
        $scope.articles.splice($scope.articles.indexOf(article), 1);
      }
      $scope.article = {};
    });
  };
}];
