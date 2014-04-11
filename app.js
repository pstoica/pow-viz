var express = require('express'),
    app = express(),
    stylus = require('stylus'),
    nib = require('nib'),
    server, 
    TrendLoader = require('./trend_loader.js'),
    tl = new TrendLoader(),
    db = require('monk')('localhost/pow'),

// starting our main routes
app.get('/', function (req, res) {
  res.render('index',
    { title : 'Price of Weed Explorer' }
  );
});

app.get('/events.json', function (req, res) {
  // perhaps we should use dates as keys instead of making an array
  // this'll make it easier to check if there's an event for a given day
  // are there multiple events for a day? maybe the value should be an array of events

  // events can likely have states associated with them, as well as a type
  var result = { };

  res.send(result);
});

app.get('/data/us.json', function (req, res) {
  var start_date = req.query.start_date,
      end_date = req.query.end_date;

  var result = {
    prices: { },
    trends: { }
  }

  res.send(result);
});

app.get('/data/states/:state.json', function (req, res) {
  var start_date = req.query.start_date,
      end_date = req.query.end_date,
      state = req.params.state;

  var result = {
    prices: { },
    trends: { }
  }

  res.send(result);
});

// setting up middleware

// stylus
app.use(stylus.middleware({
  src: __dirname,
  dest: __dirname + "/public",
  compile: function (str, path) {
    return stylus(str)
      .set('filename', path)
      .set('compress', true)
      .use(nib());
  }
}));

// jade
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// logger
app.use(express.logger('dev'));

// static assets
app.use(express.static(__dirname + '/public'));

server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});