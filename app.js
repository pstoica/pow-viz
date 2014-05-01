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

var states = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};
type = ['warning', 'danger', 'info', 'success']

var events = [
     { date: new Date(1978, 1, 1), specificDate: true, state: 'NC',  fillKey: type[0], description: 'Possession of a half ounce or less marijuana is a Class 3 misdemeanor and a maximum fine of $200.', latitude: 35.88, longitude: -79.09, radius: 5
  }, { date: new Date(1978, 1, 1), specificDate: true, state: 'OH',  fillKey: type[0], description: 'Decriminalization means no prison time or criminal record for first-time possession of a small amount for personal consumption.', latitude: 40.41, longitude: -82.75, radius: 5
  }, { date: new Date(1995, 1, 1), specificDate: true, state: 'MN',  fillKey: type[0], description: 'Possession of 42.5 grams or less is a misdmeanor punishable by a maximum fine of $200.', latitude: 46.12, longitude: -94.64, radius: 5
  }, { date: new Date(1996, 10, 1), specificDate: true, state: 'CA',  fillKey: type[2], description: 'It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess a "written or oral recommendation" from their physician that he or she "would benefit from medical marijuana." Decriminalization means no prison time or criminal record for first-time possession of a small amount for personal consumption.', latitude: 36.93, longitude: -119.86, radius: 5
  }, { date: new Date(1998, 11, 1), specificDate: true, state: 'OR',  fillKey: type[2], description: 'Measure 67 removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess a signed recommendation from their physician. Decriminalization means no prison time or criminal record for first-time possession of a small amount for personal consumption.', latitude: 43.967, longitude: -120.591, radius: 5
  }, { date: new Date(1999, 2, 1), specificDate: true, state: 'AK',  fillKey: type[2], description: 'Ballot Measure #8 removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess written documentation from their physician advising that they "might benefit from the medical use of marijuana."', latitude: 65.62, longitude: -150.14, radius: 5
  }, { date: new Date(2000, 1, 1), specificDate: true, state: 'ME',  fillKey: type[2], description: 'It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess an oral or written "professional opinion" from their physician that he or she "might benefit from the medical use of marijuana"', latitude: 45.167, longitude: -69.051, radius: 5
  }, { date: new Date(2000, 1, 1), specificDate: true, state: 'NY',  fillKey: type[0], description: 'For a first offender, possession of up to 25 grams of marijuana is punishable by a fine of $100.', latitude: 43.17, longitude: -75.74, radius: 5
  }, { date: new Date(2000, 10, 1), specificDate: true, state: 'NV',  fillKey: type[2], description: 'Sixty-five percent of voters approved Question 9 on November 7, 2000, which amends the states’ constitution to recognize the medical use of marijuana. Possession of 1 ounce or less of marijuana is a misdemeanor punishable by a fine up to $600 or mandatory assessment for addiction for the first offense.', latitude: 39.89, longitude: -116.87, radius: 5
  }, { date: new Date(2000, 11, 1), specificDate: true, state: 'HI',  fillKey: type[1], description: 'The law removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess a signed statement from their physician affirming that he or she suffers from a debilitating condition and that the "potential benefits of medical use of marijuana would likely outweigh the health risks."', latitude: 21.02, longitude: -157.08, radius: 5
  }, { date: new Date(2004, 10, 1), specificDate: true, state: 'MT',  fillKey: type[1], description: 'Initiative 148 on November 2, 2004. The law took effect that same day. It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess written documentation from their physicians authorizing the medical use of marijuana.', latitude: 46.99, longitude: -109.89, radius: 5
  }, { date: new Date(2006, 1, 1), specificDate: true, state: 'NE',  fillKey: type[0], description: 'Decriminalization means no prison time or criminal record for first-time possession of a small amount for personal consumption. The conduct is treated like a minor traffic violation.', latitude: 41.39, longitude: -99.52, radius: 5
  }, { date: new Date(2007, 9, 1), specificDate: true, state: 'NM',  fillKey: type[1], description: 'The law mandates the state Department of Health by October 1, 2007, to promulgate rules governing the use and distribution of medical cannabis to state-authorized patients.', latitude: 34.61, longitude: -105.98, radius: 5
  }, { date: new Date(2008, 11, 1), specificDate: true, state: 'MI',  fillKey: type[0], description: 'Proposal 1 removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess written documentation from their physicians authorizing the medical use of marijuana.', latitude: 32.82, longitude: -89.74, radius: 5
  }, {
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
      result.prices = priceResult;

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
      result.prices = priceResult;

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
