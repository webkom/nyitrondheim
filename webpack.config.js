var webpack = require('webpack');

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
