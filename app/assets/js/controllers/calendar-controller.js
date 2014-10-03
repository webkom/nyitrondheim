module.exports = ['$scope', 'articleService', 'unionService', function($scope, articleService, unionService) {

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
  $scope.events = [];
  $scope.eventSources = [$scope.generalEvents, $scope.unionEvents];

  var findEvents = function() {
    if ($scope.unionEvents.length > 0) {
      $scope.unionEvents.splice(0, $scope.unionEvents.length);
      console.log($scope.unionEvents,'afte');
    }
    var lsUnion = unionService.last();
    articleService.findAllEvents(lsUnion._id)
      .success(function(events) {
        events.forEach(function(e) {
          $scope.unionEvents.push({
            title: e.title,
            start: new Date(e.start),
            end: new Date(e.end),
            url: '/' + lsUnion.slug + '/' + e.slug,
            allDay: false,
            color: e.color
          });
        });
      })
      .then(function() {
        if (_.isEmpty($scope.generalEvents)) {
          articleService.findAllEvents($scope.generalUnionSlug).success(function(events) {
            events.forEach(function(e) {
              $scope.generalEvents.push({
                title: e.title,
                start: new Date(e.start),
                end: new Date(e.end),
                url: '/' + $scope.generalUnionSlug + '/' + e.slug,
                allDay: false,
                color: e.color
              });
            });
          })
        }
      });
  };
  findEvents();

  $scope.$on('union:changed', function(e) {
    findEvents();
  });
}];
