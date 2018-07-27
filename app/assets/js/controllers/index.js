angular
  .module('nitControllers', [])
  .controller('MainController', require('./main-controller'))
  .controller('PageController', require('./page-controller'))
  .controller('PagesController', require('./pages-controller'))
  .controller('CalendarController', require('./calendar-controller'))
  .controller('AdminController', require('./admin-controller'))
  .controller('UnionAdminController', require('./union-admin-controller'));
