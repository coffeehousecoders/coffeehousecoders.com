
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  airbrake = require('airbrake').createClient(process.env.AIRBRAKE_KEY);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

airbrake.serviceHost = 'e.alfajango.com'
airbrake.developmentEnvironments = ['development']
airbrake.handleExceptions();

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
  airbrake.handleExceptions();
});

// Routes
app.get('/', routes.index);
app.get('/about', function(req,res) {
  res.render('about', { title: 'About CHC' })
});
app.get('/discussions', function(req,res) {
  res.render('discussions', { title: 'Discussions' })
});

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
