var path        = require('path')
  , rootPath    = path.normalize(__dirname + '/..');


module.exports = {
    development: {
        db: 'mongodb://localhost/nit_dev',
        rootPath: rootPath,
        app: {
          name: 'Ny i Trondheim'
        }
    }
}