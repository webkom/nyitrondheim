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
  $scope.uiConfig = {
    calendar: {
      height: 450,
      editable: false,
      dayNames: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
      dayNamesShort: ['Sø', 'Ma', 'Ti', 'On', 'To', 'Fr', 'Lø'],
      header: {
        left: 'month agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      allDaySlot: true,
      allDayText: 'all-day',
      firstHour: 6,
      slotMinutes: 30,
      defaultEventMinutes: 120,
      axisFormat: 'H:mm', //,'h(:mm)tt',
      timeFormat: 'H:mm',
      columnFormat: {
        month: 'ddd',
        week: 'ddd dd/MM',
        day: 'dddd dd/MM'
      },
      titleFormat: {
        month: 'MMMM yyyy',
        week: 'dd. MMM [ yyyy]{ &#8212; dd.[ MMM] yyyy}',
        day: 'dddd, d. MMM yyyy'
      },
      buttonText: {
        today: 'I dag',
        month: 'Måned',
        week: 'Uke',
        day: 'Dag'
      },
      dragOpacity: {
          agenda: 0.5
      },
      minTime: 0,
      maxTime: 24
    }
  };

  $scope.generalEvents = [];
  $scope.unionEvents = [];
  $scope.eventSources = [$scope.generalEvents, $scope.unionEvents];

  articleService.findAllEvents(unionService.last()._id)
    .success(function(events) {
      events.forEach(function(e) {
        $scope.unionEvents.push({
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
          url: '/' + e.slug,
          allDay: false,
          color: e.color
        });
      });
    })
    .then(articleService.findAllEvents('general')
      .success(function(events) {
        events.forEach(function(e) {
          $scope.generalEvents.push({
            title: e.title,
            start: new Date(e.start),
            end: new Date(e.end),
            url: '/' + e.slug,
            allDay: false,
            color: e.color
          });
        });
      })
      .finally(function() {
        $scope.eventSources = [$scope.unionEvents, $scope.generalEvents];
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
  $scope.events = [];
  $scope.articlesAndEvents = [];
  $scope.article = {priority: 1};
  $scope.priorities = _.range(1, 6);
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
    articleService.findAll($scope.union).success(function (articles) {
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
    articleService.findAllNoUnion().success(function (articles) {
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
      priority: 1,
      approved: false
    };
  };

  $scope.createEvent = function() {
    $scope.selectedIndex = $scope.articles.length + 1;
    $scope.article = {
      priority: 1,
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
}]);
