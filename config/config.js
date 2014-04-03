var path        = require('path')
  , rootPath    = path.normalize(__dirname + '/..');


module.exports = {
    development: {
        db: 'mongodb://localhost:27017/test',
        rootPath: rootPath,
        app: {
          name: 'Ny i Trondheim'
        }
    }
}