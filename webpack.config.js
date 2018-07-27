const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// List of static assets to be copied to dist
const assets = [
  'jquery/dist/jquery.js',
  'jquery-ui/ui/jquery-ui.js',
  'ng-file-upload/angular-file-upload-html5-shim.js',
  'angular/angular.min.js',
  'angular-i18n/angular-locale_no.js',
  'angular-local-storage/angular-local-storage.min.js',
  'angular-route/angular-route.min.js',
  'lodash/dist/lodash.min.js',
  'angular-bootstrap/ui-bootstrap-tpls.min.js',
  'fullcalendar/fullcalendar.js',
  'angular-ui-calendar/src/calendar.js',
  'textAngular/textAngular-sanitize.js',
  'textAngular/textAngular.js',
  'momentjs/min/moment.min.js',
  'ng-file-upload/angular-file-upload.js'
];

module.exports = {
  devtool: 'sourcemap',
  entry: {
    app: './app/assets/js/app.js'
  },
  output: {
    path: __dirname + '/public/',
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        loader:
          'file-loader?name=app.css!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      },
      {
        test: /\.css/,
        loader: 'file-loader?name=vendor.css'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [require('nib')()],
          import: ['~nib/lib/nib/index.styl']
        }
      }
    })
  ]
};
