var express = require('express'),
    app = express(),
    lessMiddleware = require('less-middleware'),
    server, 
    db = require('monk')('localhost/pow'),
    moment = require('moment'),
    cache = require('memory-cache');

var DataAggregator = require('./data_aggregator.js'),
    da = new DataAggregator('mongodb://localhost/pow', 'weed_data'), //connectionURL, collection
    TrendLoader = require('./trend_loader.js'),
    tl = new TrendLoader();

var states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
type = ['warning', 'danger', 'info', 'success']

var events = [
     // events that happened before 2010
     // temporarily commented out
     /*{ date: new Date(2000, 1, 1), state: 'ME',  fillKey: type[2], description: 'It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess an oral or written "professional opinion" from their physician that he or she "might benefit from the medical use of marijuana"', latitude: 45.167, longitude: -69.051, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'CA',  fillKey: type[2], description: '', latitude: 36.93, longitude: -119.86, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'NV',  fillKey: type[2], description: '', latitude: 39.89, longitude: -116.87, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'OR',  fillKey: type[2], description: '', latitude: 43.967, longitude: -120.591, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'NM',  fillKey: type[1], description: '', latitude: 34.61, longitude: -105.98, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'MT',  fillKey: type[1], description: '', latitude: 46.99, longitude: -109.89, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'NE',  fillKey: type[0], description: '', latitude: 41.39, longitude: -99.52, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'MN',  fillKey: type[0], description: '', latitude: 46.12, longitude: -94.64, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'AK',  fillKey: type[2], description: '', latitude: 65.62, longitude: -150.14, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'HI',  fillKey: type[1], description: '', latitude: 21.02, longitude: -157.08, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'MI',  fillKey: type[0], description: '', latitude: 32.82, longitude: -89.74, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'NY',  fillKey: type[0], description: '', latitude: 43.17, longitude: -75.74, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'MI',  fillKey: type[1], description: '', latitude: 43.30, longitude: -84.49, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'NC',  fillKey: type[0], description: '', latitude: 35.88, longitude: -79.09, radius: 5
  }, { date: new Date(2000, 1, 1), state: 'OH',  fillKey: type[0], description: '', latitude: 40.41, longitude: -82.75, radius: 5
  },*/ {
    date: new Date(2010, 0, 11),
    state: 'NJ', 
    fillKey: type[1],
    description: 'New Jersey Becomes 14th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 39.367,
    longitude: -74.751,
    radius: 5
  }, {
    date: new Date(2010, 10, 2),
    state: 'AZ', 
    fillKey: type[1],
    description: 'Arizona Becomes 15th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 34.251,
    longitude: -111.785,
    radius: 5 
  }, {
    date: new Date(2011, 4, 13),
    state: 'DE', 
    fillKey: type[1],
    description: 'Delaware Becomes 16th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 38.891,
    longitude: -75.410,
    radius: 5
  }, {
    date: new Date(2011, 6, 1),
    state: 'CT', 
    fillKey: type[0],
    description: 'Gov. Dan Malloy signed legislation into law ‘decriminalizing’ the possession of small, personal use amounts of marijuana by adults in Connecticut.',
    latitude: 41.67,
    longitude: -72.721,
    radius: 5
  }, {
    date: new Date(2012, 4, 31),
    state: 'CT', 
    fillKey: type[1],
    description: 'Connecticut Becomes 17th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 41.67,
    longitude: -72.721,
    radius: 5
  }, {
    date: new Date(2012, 10, 6),
    state: 'MA', 
    fillKey: type[1],
    description: 'Massachusetts Becomes 18th state to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 42.407,
    longitude: -72.465,
    radius: 5
  }, {
    date: new Date(2012, 11, 1),
    state: 'CO', 
    fillKey: type[3],
    description: 'Fifty-five percent of Colorado voters approved Amendment 64, which legalizes the adult personal use of cannabis.',
    latitude: 39.095,
    longitude: -105.776,
    radius: 5
  }, {
    date: new Date(2012, 11, 1),
    state: 'WA', 
    fillKey: type[3],
    description: 'In Washington, fifty-six percent of voters approved Initiative 502, permitting an adult to possess up to one-ounce of cannabis for their own personal use in private.',
    latitude: 47.338,
    longitude: -120.014,
    radius: 5
  }, {
    date: new Date(2013, 6, 1),
    state: 'NH', 
    fillKey: type[1],
    description: 'New Hampshire Becomes 19th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 43.357,
    longitude: -71.589,
    radius: 5
  }, {
    date: new Date(2013, 7, 1),
    state: 'IL', 
    fillKey: type[1],
    description: 'Illinois Becomes 20th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 40.245,
    longitude: -89.472,
    radius: 5
  }
];

//Testing

// da.getStateData(new Date('2011'), new Date('2012'), 'GA', function(err, prices, stats){
//   console.log(prices);
// });

// setTimeout(function(){
//   console.log('set interval start');
//   da.getStateData(new Date('2011'), new Date('2012'), 'GA', function(err, prices, stats){
//     console.log(prices);
//   });
// }, 10000)

// da.getNationalData(new Date('2011'), new Date('2012'), function(err, prices, stats){
//   console.log(prices);
// });

// tl.getTrendData('US', function(trendResult){
//   trends = trendResult;
//   console.log(trends);
// });

// starting our main routes
app.get('/', function (req, res) {
  res.render('index', {
      events: events,
      moment: moment,
      start_date: new Date(2010, 8),
      end_date: new Date(2014, 3),
      states: states
    }
  );
});

app.get('/data/averages/:year/:month.json', function (req, res) {
  var year = req.params.year,
      month = req.params.month - 1,
      start_date = new Date(year, month),
      end_date = new Date(year, month + 1);

  if (result = cache.get(start_date + " " + end_date)) {
    res.send(result);
  } else {
    da.getStateAverages(start_date, end_date, function(err, prices, stats){
      cache.put(start_date + " " + end_date, prices);
      res.send(prices);
    });
  }
});

app.get('/data/us.json', function (req, res) {
  var start_date = new Date('2010'),
      end_date = new Date('2015');

  if (result = cache.get('US')) {
    res.send(result);
  } else {
    var result = {
      prices: { },
      trends: { }
    }

    // always show full date range
    da.getNationalData(new Date(2010, 8), new Date(2014, 3), function(err, priceResult, stats){
      result.prices = priceResult.sort(function(a, b) {
        return new Date(b._id) - new Date(a._id);
      });

      tl.getTrendData(start_date, end_date, 'US', function(trendResult){
        result.trends = trendResult;
        cache.put('US', result);
        res.send(result);
      });
    });
  }
});

app.get('/data/states/:state.json', function (req, res) {
  var start_date = new Date('2010'),
      end_date = new Date('2015'),
      state = req.params.state.toUpperCase();

  if (result = cache.get(state)) {
    res.send(result);
  } else {
    var result = {
      prices: { },
      trends: { }
    }

    //state needs to be an all caps 2 letter state code
    da.getStateData(start_date, end_date, state, function(err, priceResult, stats){
      result.prices = priceResult;/*.sort(function(a, b) {
        return new Date(a._id) - new Date(b._id);
      });*/

      tl.getTrendData(start_date, end_date, state, function(trendResult){
        result.trends = trendResult;

        cache.put(state, result);
        res.send(result);
      });
    });
  }
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
