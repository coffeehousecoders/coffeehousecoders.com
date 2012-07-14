exports.index = function(req, res) {
  res.render('index', { title: 'Coffee House Coders', layout: 'layout.jade' })
};

