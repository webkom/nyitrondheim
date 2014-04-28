var nitControllers = angular.module('nitControllers', []);

nitControllers.controller('MainController',
  ['$scope', '$routeParams', 'unionService', function($scope, $routeParams, unionService) {

  $scope.name = $routeParams.slug;
  $scope.unions = [];
  $scope.chosenUnion = unionService.last();

  $scope.modalOpen = false;
  $scope.openModal = function() {
    $scope.modalOpen = true;
  };

  $scope.closeModal = function() {
    $scope.modalOpen = false;
  };

  unionService.findAll().success(function(unions) {
    $scope.unions = unions;
  });

  $scope.chooseUnion = function(union) {
    $scope.chosenUnion = union;
    unionService.save(union);
    $scope.closeModal();
    $scope.$broadcast('union:changed', union);
  };
}]);

nitControllers.controller('CalendarController',
  ['$scope', 'articleService', 'unionService', function($scope, articleService, unionService) {
  articleService.findAllEvents(unionService.last()._id)
    .success(function(events) {
      $scope.unionEvents = events.map(function(e) {
        return {
          id: e._id,
          text: e.title,
          start: e.startDate,
          end: e.endDate
        };
      });
    })
    .then(articleService.findAllEvents('general')
      .success(function(events) {
        $scope.generalEvents = events.map(function(e) {
          return {
            id: e._id,
            text: e.title,
            start: e.startDate,
            end: e.endDate
          };
        });
      })
      .finally(function() {
        console.log("got to finally", $scope.unionEvents, $scope.generalEvents);
        $scope.events = $scope.unionEvents.concat($scope.generalEvents);
      })
    );
}]);

nitControllers.controller('PageController',
  ['$scope', '$routeParams', 'articleService', function($scope, $routeParams, articleService) {
  $scope.article = {};

  var slugSegments = ($routeParams.slug || '').split('/');
  $scope.slug = slugSegments.pop();
  $scope.isGeneral = slugSegments[0] === 'generelt';

  $scope.update = function() {
    if ($scope.slug) {
      var union = $scope.isGeneral ? 'general' : $scope.chosenUnion._id;
      articleService.findBySlug(union, $scope.slug).success(function(article) {
        $scope.article = article;
      });
    }
  };

  $scope.$on('union:changed', function() {
    $scope.update();
  });

  $scope.update();
}]);

nitControllers.controller('PagesController',
  ['$scope', '$routeParams', 'articleService', function($scope, $routeParams, articleService) {

  $scope.articles = [];

  $scope.update = function() {
    articleService.findAll($scope.chosenUnion.slug).success(function(articles) {
      $scope.articles = articles;
    });
  };

  $scope.$on('union:changed', function(e) {
    $scope.update();
  });

  $scope.update();
}]);

nitControllers.controller('AdminController',
  ['$scope', 'articleService', function($scope, articleService) {
  $scope.selectedDate = new Date('6/22');
  $scope.union = union._id;
  $scope.articles = [];
  $scope.article = {priority: 1};
  $scope.priorities = _.range(1, 6);
  $scope.today = new Date();

  $scope.chooseArticle = function(article, selectedIndex) {
    $scope.selectedIndex = selectedIndex;
    $scope.article = article;
  };

  $scope.open = function($event, opened) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope[opened] = true
  };

  $scope.findAll = function() {
    articleService.findAll($scope.union).success(function (articles) {
      $scope.articles = articles.filter(function(article) {
        return !article.event;
      });
      $scope.events = articles.filter(function(article) {
        return article.event;
      });
      $scope.createArticle();
    });
  };

  $scope.findAll();

  $scope.createArticle = function() {
    $scope.selectedIndex = 0;
    $scope.article = {priority: 1};
  };

  $scope.createEvent = function() {
    $scope.selectedIndex = $scope.articles.length + 1;
    $scope.article = {priority: 1, event: true};
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
    articleService.save($scope.union, article).success(function(data) {
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
        $scope.articles[$scope.articles.indexOf($scope.article)] = data;
        $scope.article = data;
      }
    });
  };

  $scope.destroyArticle = function(article) {
    articleService.destroy($scope.union, article).success(function(data) {
      $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
      $scope.article = {};
    });
  };
}]);
