
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var levelCreator = require('./routes/levelCreator');
var saveLevel = require('./routes/saveLevel');
var http = require('http');
var path = require('path');
var cons = require('consolidate');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', cons.swig);
app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/levelCreator', levelCreator.levelCreator);
app.post('/saveLevel', saveLevel.saveLevel);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
