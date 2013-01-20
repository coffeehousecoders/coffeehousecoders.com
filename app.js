
/**
 * Module dependencies.
 */

var express = require('express'),
  airbrake = require('airbrake').createClient(process.env.AIRBRAKE_KEY);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('port', process.env.PORT || 8000)
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static('public'));
  app.use(app.router);
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

app.get('*', function(req, res, next){
  var matches = req.headers.host.match(/^([^\.]+)\.coffeehousecoders/);
  if (matches) {
    if (matches[1] == 'a2') {
      res.redirect('http://' + req.headers.host.replace(/^a2\./,'annarbor.') + req.url);
      res.send();
    } else {
      req.url = '/' + matches[1] + req.url
    }
  }
  next();
});

// Routes
app.get('/annarbor/', function(req, res) {
  res.render('annarbor/index', { title: 'Ann Arbor Coffee House Coders' })
});
app.get('/annarbor/about', function(req, res) {
  res.render('annarbor/about', { title: 'About CHC' })
});
app.get('/annarbor/about/organizers', function(req, res) {
  res.redirect('/organizers');
});
app.get('/annarbor/organizers', function(req, res) {
  res.render('annarbor/organizers', { title: 'Meet the organizers' })
});
app.get('/annarbor/discussions', function(req, res) {
  res.render('annarbor/discussions', { title: 'Discussions' })
});
app.get('/detroit/', function(req, res) {
  res.render('detroit/index', { title: 'Detroit Coffee House Coders' })
})

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
