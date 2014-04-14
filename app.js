var express = require('express'),
    app = express(),
    lessMiddleware = require('less-middleware'),
    server, 
    db = require('monk')('localhost/pow');

var DataAggregator = require('./data_aggregator.js'),
    da = new DataAggregator('mongodb://localhost/pow', 'weed_data'), //connectionURL, collection
    TrendLoader = require('./trend_loader.js'),
    tl = new TrendLoader();

//Testing
// da.getNationalData(new Date('2011'), new Date('2012'), function(err, prices, stats){
//   console.log(prices);
// });

// da.getStateData(new Date('2011'), new Date('2012'), 'GA', function(err, prices, stats){
//   console.log(prices);
// });

// tl.getTrendData('US', function(trendResult){
//   trends = trendResult;
//   console.log(trends);
// });

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
  var start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date);

  var result = {
    prices: { },
    trends: { }
  }

  da.getNationalData(start_date, end_date, function(err, priceResult, stats){
    result.prices = priceResult;

    tl.getTrendData('US', function(trendResult){
      result.trends = trendResult;
      res.send(result);
    });
  });
});

app.get('/data/states/:state.json', function (req, res) {
  var start_date = new Date(req.query.start_date),
      end_date = new Date(req.query.end_date),
      state = req.params.state;

  var result = {
    prices: { },
    trends: { }
  }

  //state needs to be an all caps 2 letter state code
  da.getStateData(start_date, end_date, state, function(err, priceResult, stats){
    result.prices = priceResult;

    tl.getTrendData(state, function(trendResult){
      result.trends = trendResult;
      res.send(result);
    });
  });
});

// setting up middleware

// less
app.use(lessMiddleware({
  src: __dirname,
  dest: __dirname + '/public',
  compress: true
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
