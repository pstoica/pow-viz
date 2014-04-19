var mapContainer = $("#map"),
    map,
    start_year = 2010,
    start_month = 8,
    priceContainer = $("#price-chart");

var states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
// event info
var type = ['Decriminalization Laws', 'Medical Cannabis Laws', 
            'Both Medical and Decriminalization Laws', 'Legalized Cannabis'];

var curr_events;
var events = [
     // events that happened before 2010
     { date: new Date(2000, 1, 1), state: 'ME',  fillKey: type[2], description: 'It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess an oral or written "professional opinion" from their physician that he or she "might benefit from the medical use of marijuana"', latitude: 45.167, longitude: -69.051, radius: 5
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
    description: 'May 13, 2011 - Delaware Becomes 16th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 38.891,
    longitude: -75.410,
    radius: 5
  }, {
    date: new Date(2011, 6, 1),
    state: 'CT', 
    fillKey: type[0],
    description: 'Gov. Dan Malloy signed legislation into law ‘decriminalizing’ the possession of small, personal use amounts of marijuana by adults',
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
    description: ' Fifty-five percent of Colorado voters approved Amendment 64, which legalizes the adult personal use of cannabis',
    latitude: 39.095,
    longitude: -105.776,
    radius: 5
  }, {
    date: new Date(2012, 11, 1),
    state: 'WA', 
    fillKey: type[3],
    description: 'Fifty-six percent of voters approved Initiative 502, permitting an adult to possess up to one-ounce of cannabis for their own personal use in private',
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

// map drawing taken care of by datamaps: http://datamaps.github.io/
function drawMap() {
  mapContainer.empty();

  map = new Datamap({
    element: mapContainer[0],
    scope: 'usa',
    fills: {
      defaultFill: '#eeeeee',
      'Decriminalization Laws': '#F0AD4E',
      'Medical Cannabis Laws': '#D9534F',
      'Both Medical and Decriminalization Laws': '#5BC0DE',
      'Legalized Cannabis': '#886AB5'
    }
  });
}

function drawEvents() {
  var curr_date = new Date(start_year, start_month + parseInt(timeSlider.val()));
  curr_events = events.filter(function(e) { if (e.date <= curr_date) return e });

  // bubbles for key events based on current year
  map.bubbles(curr_events, {
    borderWidth: 0,
    fillOpacity: 1,
    //highlightOnHover: false,
  });
}

function colorMap() {
  var date = new Date(start_year, start_month + parseInt($("#time-slider").val())),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      quality = $("#quality-menu").val();

  d3.json("/data/averages/" + year + "/" + month + ".json", function(error, json) {
    if (error) return console.warn(error);

    var color = d3.scale.linear()
      .domain([0, 35])
      .range(["#FCF8E3", "#84C569"]);

    var choropleth = { };

    $.each(states, function(i, state) {
      choropleth[state] = "#eeeeee";
    });

    $.each(json, function(i, row) {
      if (quality == "high" && row.value.high_avg) {
        choropleth[row._id] = color(row.value.high_avg);
      } else if (quality == "medium" && row.value.mid_avg) {
        choropleth[row._id] = color(row.value.mid_avg);
      } else if (quality == "low" && row.value.low_avg) {
        choropleth[row._id] = color(row.value.low_avg);
      } else {
        choropleth[row._id] = "#eeeeee";
      }
    });

    map.updateChoropleth(choropleth);
  });
}

function trendChart() {
  // TODO: should transition using D3
  priceContainer.empty();

  var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 850 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom,
      trends,
      prices,
      filePath,
      location = $("#location-menu").val(),
      quality = $("#quality-menu").val();

  var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;

  var x = d3.time.scale()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); });

  var avgQuality = quality + "_avg";
  var priceLine = d3.svg.line()
    .x(function(d) { return x(d._id); })
    .y(function(d) { return y(d.value.avgQuality); });

  var svg = d3.select(priceContainer[0]).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (location == "US")
    filePath = "/data/us.json";
  else
    filePath = "/data/states/" + location + ".json";

  d3.json(filePath, function(error, json) {
    if (error) return console.warn(error);

    console.log(json);
    prices = json.prices;
    prices.forEach(function(d) {
      d._id = parseDate(d._id);
      d.value.avgQuality = +d.value.avgQuality;
    });

    // TODO: proportion trend values from 0-35
    trends = json.trends;
    trends.forEach(function(d) {
      d.date = parseDate(d.date);
      d.val = +d.val;
    });

    x.domain([new Date(2010, 8), new Date(2014, 3)]);
    y.domain([0,100]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("x", 50)
        .attr("dy", ".71em")
        .style("text-anchor", "center")
        .text("Google Trends");

    svg.append("path")
       .datum(trends)
        .attr("class", "line")
        .attr("d", line(trends));
    svg.append("path")
        .datum(prices)
        .attr("class", "line")
        .attr("d", priceLine(prices));

    // svg.selectAll("line.horizontalGrid").data(y.ticks(10)).enter()
    //   .append("line")
    //     .attr(
    //     {
    //         "class":"horizontalGrid",
    //         "x1" : margin.right,
    //         "x2" : width,
    //         "y1" : function(d){ return y(d);},
    //         "y2" : function(d){ return y(d);},
    //         "fill" : "none",
    //         "shape-rendering" : "crispEdges",
    //         "stroke" : "black",
    //         "stroke-width" : ".5px"
    //     });
  });
}

// lazy responsive map hack
/*$(window).resize(function() {
  drawMap();
})*/

// form field listeners
// TODO: change what bubbles are shown according to active date
var timeSlider = $("#time-slider"),
    qualityMenu = $("#quality-menu"),
    timeBack = $("#time-back"),
    timePlay = $("#time-play"),
    timeNext = $("#time-next"),
    currentDate = $("#current-date"),
    locationMenu = $("#location-menu"),
    playInterval,
    isPlaying = false;

timeSlider.on('change', updateTime);
qualityMenu.on('change', colorMap);
locationMenu.on('change', trendChart)

timeBack.on('click', function() {
  timeSlider.val(parseInt(timeSlider.val()) - 1);
  updateTime();
});

timePlay.on('click', function() {
  isPlaying = !isPlaying;

  if (!isPlaying) {
    timePlay.find('.glyphicon').removeClass('glyphicon-pause').addClass('glyphicon-play')

    clearInterval(playInterval);
  } else {
    timePlay.find('.glyphicon').removeClass('glyphicon-play').addClass('glyphicon-pause')

    nextTime();

    playInterval = setInterval(nextTime, 1000);
  }
})

timeNext.on('click', nextTime);

function nextTime() {
  timeSlider.val(parseInt(timeSlider.val()) + 1);
  updateTime();
}

function updateTime() {
  var date = new Date(start_year, start_month + parseInt($("#time-slider").val()));
  
  currentDate.find('.lead').html(moment(date).format('MMMM YYYY'));
  drawEvents();
  colorMap();
}

//$("#current-date-menu").on('change', colorMap, drawEvents);

// initializing code
function initialize() {
  drawMap();
  colorMap();
  drawEvents();
  trendChart();
}

initialize();
