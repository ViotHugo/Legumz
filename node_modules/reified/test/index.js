var fs = require('fs');
var path = require('path');

fs.readdirSync(__dirname).filter(function(name){ return path.extname(name) === '.js' }).forEach(function(name){
  require('./'+name);
});
