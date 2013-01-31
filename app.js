/**
 * Module dependencies.
 */

var express = require('express'),
  app = express();

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

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('*', function(req, res, next){

  res.locals.subdomains = {
    'annarbor': 'Ann Arbor',
    'detroit': 'Detroit',
    'downriver': 'Downriver',
    'royaloak': 'Royal Oak'
  }

  var matches = req.headers.host.match(/^([^\.]*)\.?(coffeehousecoders.*)$/);
  if (matches) {
    res.locals.subdomain = matches[1];
    res.locals.domain = matches[2];
    req.url = '/' + matches[1] + req.url;
  }

  next();
});


// Routes

app.get('/', function(req, res) {
  res.render('index', { title: 'Coffee House Coders' });
});

app.get('/annarbor/', function(req, res) {
  res.render('annarbor/index', { title: 'Ann Arbor Coffee House Coders' });
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

app.get('/downriver/', function(req, res) {
  res.render('downriver/index', { title: 'Downriver Coffee House Coders' })
})

app.listen(app.get('port'), function(){
  console.log("Express server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
