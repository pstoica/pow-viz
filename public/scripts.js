var mapContainer = $("#map"),
    map,
    start_year = 2010,
    start_month = 8,
    priceContainer = $("#price-chart");

var states = { "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "DC": "District Of Columbia", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VI": "Virgin Islands", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};
// event info
var type = ['Decriminalization Laws', 'Medical Cannabis Laws', 
            'Both Medical and Decriminalization Laws', 'Legalized Cannabis'];

var currentAverages,
    maxAverage = 25,
    radius = 10,
    curr_events;

var events = [
     // events that happened before 2010
     { date: new Date(2000, 1, 1), state: 'ME',  fillKey: type[2], description: 'It removes state-level criminal penalties on the use, possession and cultivation of marijuana by patients who possess an oral or written "professional opinion" from their physician that he or she "might benefit from the medical use of marijuana"', latitude: 45.167, longitude: -69.051, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'CA',  fillKey: type[2], description: '', latitude: 36.93, longitude: -119.86, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'NV',  fillKey: type[2], description: '', latitude: 39.89, longitude: -116.87, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'OR',  fillKey: type[2], description: '', latitude: 43.967, longitude: -120.591, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'NM',  fillKey: type[1], description: '', latitude: 34.61, longitude: -105.98, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'MT',  fillKey: type[1], description: '', latitude: 46.99, longitude: -109.89, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'NE',  fillKey: type[0], description: '', latitude: 41.39, longitude: -99.52, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'MN',  fillKey: type[0], description: '', latitude: 46.12, longitude: -94.64, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'AK',  fillKey: type[2], description: '', latitude: 65.62, longitude: -150.14, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'HI',  fillKey: type[1], description: '', latitude: 21.02, longitude: -157.08, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'MI',  fillKey: type[0], description: '', latitude: 32.82, longitude: -89.74, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'NY',  fillKey: type[0], description: '', latitude: 43.17, longitude: -75.74, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'MI',  fillKey: type[1], description: '', latitude: 43.30, longitude: -84.49, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'NC',  fillKey: type[0], description: '', latitude: 35.88, longitude: -79.09, radius: radius
  }, { date: new Date(2000, 1, 1), state: 'OH',  fillKey: type[0], description: '', latitude: 40.41, longitude: -82.75, radius: radius
  }, {
    date: new Date(2010, 0, 11),
    state: 'NJ', 
    fillKey: type[1],
    description: 'New Jersey Becomes 14th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 39.367,
    longitude: -74.751,
    radius: radius
  }, {
    date: new Date(2010, 10, 2),
    state: 'AZ', 
    fillKey: type[1],
    description: 'Arizona Becomes 15th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 34.251,
    longitude: -111.785,
    radius: radius 
  }, {
    date: new Date(2011, 4, 13),
    state: 'DE', 
    fillKey: type[1],
    description: 'Delaware Becomes 16th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 38.891,
    longitude: -75.410,
    radius: radius
  }, {
    date: new Date(2011, 6, 1),
    state: 'CT', 
    fillKey: type[0],
    description: 'Gov. Dan Malloy signed legislation into law ‘decriminalizing’ the possession of small, personal use amounts of marijuana by adults in Connecticut.',
    latitude: 41.67,
    longitude: -72.721,
    radius: radius
  }, {
    date: new Date(2012, 4, 31),
    state: 'CT', 
    fillKey: type[1],
    description: 'Connecticut Becomes 17th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 41.67,
    longitude: -72.721,
    radius: radius
  }, {
    date: new Date(2012, 10, 6),
    state: 'MA', 
    fillKey: type[1],
    description: 'Massachusetts Becomes 18th state to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 42.407,
    longitude: -72.465,
    radius: radius
  }, {
    date: new Date(2012, 11, 1),
    state: 'CO', 
    fillKey: type[3],
    description: ' Fifty-five percent of Colorado voters approved Amendment 64, which legalizes the adult personal use of cannabis',
    latitude: 39.095,
    longitude: -105.776,
    radius: radius
  }, {
    date: new Date(2012, 11, 1),
    state: 'WA', 
    fillKey: type[3],
    description: 'Fifty-six percent of voters approved Initiative 502, permitting an adult to possess up to one-ounce of cannabis for their own personal use in private',
    latitude: 47.338,
    longitude: -120.014,
    radius: radius
  }, {
    date: new Date(2013, 6, 1),
    state: 'NH', 
    fillKey: type[1],
    description: 'New Hampshire Becomes 19th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 43.357,
    longitude: -71.589,
    radius: radius
  }, {
    date: new Date(2013, 7, 1),
    state: 'IL', 
    fillKey: type[1],
    description: 'Illinois Becomes 20th State to Legalize Medical Marijuana',
    specificDate: true,
    latitude: 40.245,
    longitude: -89.472,
    radius: radius
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
    },
    geographyConfig: {
      highlightFillColor: 'rgba(91, 192, 222, 0.5)',
      highlightBorderColor: 'rgba(91, 192, 222, 0.9)',
      highlightBorderWidth: 2,
      popupTemplate: function(geography, data) {
        var result, stateData;

        result = '<div class="hoverinfo"><span class="lead">' + geography.properties.name + "</span><br/>";

        if (geography.properties.name == "Alaska" || geography.properties.name == "Hawaii") {
          result += 'Data unavailable for this state.</div>';

          return result;
        }

        if (currentAverages) {
          // super inefficient, but whatever
          stateData = $.grep(currentAverages, function(e){
            return states[e._id] === geography.properties.name;
          })[0].value;

          if (stateData.low_avg) {
            result += "<strong>Low</strong>";
            result += " $" + stateData.low_avg.toFixed(2) + "<br>";
          }
          if (stateData.mid_avg) {
            result += "<strong>Medium</strong>";
            result += " $" + stateData.mid_avg.toFixed(2) + "<br>";
          }
          if (stateData.high_avg) {
            result += "<strong>High</strong>";
            result += " $" + stateData.high_avg.toFixed(2) + "<br>";
          }
        }
        result += "</div>";
        return result;
      }
    }
  });
}

function drawEvents() {
  var curr_date = new Date(start_year, start_month + parseInt(timeSlider.val()) + 1);
  curr_events = events.filter(function(e) { if (e.date < curr_date) return e });

  // bubbles for key events based on current year
  map.bubbles(curr_events, {
    borderWidth: 2,
    borderColor: '#ffffff',
    fillOpacity: 1,
    popupOnHover: true,
    popupTemplate: function(geography, data) {
      var time,
          result;

      result = '<div class="hoverinfo"><span class="lead">';

      if (data.specificDate) {
        time = moment(data.date).format("MMMM Do, YYYY");
      } else {
        time = moment(data.date).format('MMMM YYYY');
      }

      result += time + '</span><br>';

      if (data.description) {
        result += data.description;
      }

      result += '</div>';

      return result;
    },
    //highlightOnHover: false,
    highlightBorderColor: '#555555',
    highlightBorderWidth: 2

  });
}

function colorMap() {
  var date = new Date(start_year, start_month + parseInt($("#time-slider").val())),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      quality = $("#quality-menu").val();

  currentAverages = null;

  d3.json("/data/averages/" + year + "/" + month + ".json", function(error, json) {
    if (error) return console.warn(error);

    var color = d3.scale.linear()
      .domain([0, maxAverage])
      .range(["#F2E187", "#529138"]);

    var choropleth = { };

    $.each(states, function(state, stateName) {
      choropleth[state] = "#eeeeee";
    });

    $.each(json, function(i, row) {
      if (quality == "high" && row.value.high_avg) {
        choropleth[row._id] = color(row.value.high_avg);
      } else if (quality == "mid" && row.value.mid_avg) {
        choropleth[row._id] = color(row.value.mid_avg);
      } else if (quality == "low" && row.value.low_avg) {
        choropleth[row._id] = color(row.value.low_avg);
      }
    });

    currentAverages = json;

    map.updateChoropleth(choropleth);
  });
}

// initialize chart
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 550 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom,
    trends,
    prices,
    filePath,
    quality = $("#quality-menu").val();

  var formatValue = d3.format(",.2f"),
      formatCurrency = function(d) { return "$" + formatValue(d); };

var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.year, 1);
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function (d) { return "$" + d; })
    .tickValues([5,15,25]);

var line = d3.svg.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.val); });

// getting error when switching qualities
var avgQuality = quality + "_avg";

var lowPriceLine = d3.svg.line()
  .defined(function(d) { return d.value['low_avg'] != null; })
  .x(function(d) { return x(d._id); })
  .y(function(d) { return y(d.value['low_avg']); });

var midPriceLine = d3.svg.line()
  .defined(function(d) { return d.value['mid_avg'] != null; })
  .x(function(d) { return x(d._id); })
  .y(function(d) { return y(d.value['mid_avg']); });

var highPriceLine = d3.svg.line()
  .defined(function(d) { return d.value['high_avg'] != null; })
  .x(function(d) { return x(d._id); })
  .y(function(d) { return y(d.value['high_avg']); });

var svg = d3.select(priceContainer[0])
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

d3.select(priceContainer[0])
  .append('div')
  .attr('class', 'datamaps-hoverover')
  .style('z-index', 10001)
  .style('position', 'absolute');

x.domain([new Date('2010'), new Date(2014, 2)]);
y.domain([0, maxAverage]);

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  /*.append("text")
    .attr("x", 20)
    .attr("y", -20)
    .attr("dy", ".75em")
    .text("Demand")
    .attr("fill", "#5BC0DE")
    .attr("opacity", 0.5);*/

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  /*.append("text")
    .attr("x", 100)
    .attr("y", -20)
    .attr("dy", ".75em")
    .text("Low")
    .attr("fill", "#F2E187");

  .append("text")
    .attr("x", 20)
    .attr("y", -20)
    .attr("dy", ".75em")
    .text("Medium")
    .attr("fill", "#98A758");

  .append("text")
    .attr("x", 20)
    .attr("y", -20)
    .attr("dy", ".75em")
    .text("High")
    .attr("fill", "#3D6C2A");*/

function drawChart() {
  var location = $("#location-menu").val();
  quality = $("#quality-menu").val();

  var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse,
      bisectDate = d3.bisector(function(d) { return d.date; }).left;

  if (location == "US")
    filePath = "/data/us.json";
  else
    filePath = "/data/states/" + location + ".json";

  d3.json(filePath, function(error, json) {
    if (error) return console.warn(error);

    var maxDate = d3.max(json.prices, function(d) { return new Date(d._id); }),
        currentMonth = start_month,
        currentDate = new Date(start_year, start_month),
        trendScale = d3.scale.linear().domain([0, 100]).range([0, maxAverage]);

    prices = [];

    while (currentDate <= maxDate) {
      prices.push({
        _id: currentDate,
        value: {
          low_avg: null,
          mid_avg: null,
          high_avg: null
        }
      });

      currentMonth++;
      currentDate = new Date(start_year, currentMonth);
    }

    prices = $.merge(prices, json.prices);

    prices.sort(function (a, b) { return d3.ascending(a._id, b._id) });
    prices.forEach(function(d) {
      d._id = new Date(d._id);
      //d.value[avgQuality] = +d.value[avgQuality];
    });

    trends = json.trends;
    trends.forEach(function(d) {
      d.date = new Date(d.date);
      d.val = trendScale(d.val);
    });

    // remove old lines
    d3.select("path.line").remove();
    d3.selectAll("path.priceLine").remove();

    svg.append("path")
        .datum(trends)
        .attr("class", "line trendLine")
        .attr("d", line);

      svg.append("path")
          .datum(prices)
          .attr("class", "priceLine lowPriceLine")
          .attr("d", lowPriceLine);

      svg.append("path")
          .datum(prices)
          .attr("class", "priceLine midPriceLine")
          .attr("d", midPriceLine);

      svg.append("path")
          .datum(prices)
          .attr("class", "priceLine highPriceLine")
          .attr("d", highPriceLine);
  });

  // display data on mouseover
  /*var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");
  focus.append("circle")
      .attr("r", 4.5);
  focus.append("text")
      .attr("x", -80)
      .attr("y", -20)
      .attr("dy", ".35em");*/

  d3.select('#price-chart').select('svg')
    .on('mousemove', null)
    .on('mouseenter', function() {
      d3.select('#price-chart').select('.datamaps-hoverover').style('display', 'block');
    })
    .on('mousemove', function() {
      var position = d3.mouse(this);

      var x0 = x.invert(d3.mouse(this)[0] - 45),
          i = bisectDate(trends, x0, 1),
          d0 = trends[i - 1],
          d,
          price;

      /*if (d0 && d1) {
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      }*/

      //console.log(d0);

      price = $.grep(prices, function(e) {
        return (e._id.getMonth() == d0.date.getMonth()) && (e._id.getFullYear() == d0.date.getFullYear());
      })[0];

      //console.log(price);

      d3.select('#price-chart').select('.datamaps-hoverover')
        .style('display', 'block')
        .style('top', ( (position[1] + 30)) + "px")
        .html(function() {
          //var data = JSON.parse(element.attr('data-info'));
          //if ( !data ) return '';
          //return options.popupTemplate(d, data);
          var result = '<div class="hoverinfo"><span class="lead">';

          time = moment(d0.date).format('MMMM YYYY');

          result += time + '</span><br>';

          result += "<strong>Demand</strong> " + d3.format("r")((d0.val * 4)) + "<br>";

          if (price) {
            if (price.value.low_avg) {
              result += "<strong>Low</strong> " + formatCurrency(price.value.low_avg) + "<br>";
            }

            if (price.value.mid_avg) {
              result += "<strong>Medium</strong> " + formatCurrency(price.value.mid_avg) + "<br>"; 
            }

            if (price.value.high_avg) {
              result += "<strong>High</strong> " + formatCurrency(price.value.high_avg) + "<br>";
            }
          }
          result += '</div>';

          return result;
        })
        .style('left', ( position[0]) + "px")
    })
    .on('mouseout', function() {
      d3.select('#price-chart').select('.datamaps-hoverover').style('display', 'none');
    });

  /*svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function() { focus.style("display", null); })
    .on("mouseout", function() { focus.style("display", "none"); })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(prices, x0, 1),
        d0 = prices[i - 1],
        d1 = prices[i],
        d = x0 - d0._id > d1._id - x0 ? d1 : d0;

    focus.attr("transform", "translate(" + x(d._id) + "," + y(d.value[avgQuality]) + ")");
    if (d.value[avgQuality] == null)
      focus.style("display", "none");
    focus.select("text").text(formatCurrency(d.value[avgQuality]) + " in " + d._id.getMonth() + "/" + d._id.getFullYear());
  }*/
}

// lazy responsive map hack
/*$(window).resize(function() {
  drawMap();
})*/

// form field listeners
var timeSlider = $("#time-slider"),
    qualityMenu = $("#quality-menu"),
    timeBack = $("#time-back"),
    timePlay = $("#time-play"),
    timeNext = $("#time-next"),
    currentDate = $("#current-date"),
    locationMenu = $("#location-menu"),
    timelineEvents = $(".timeline-event"),
    playInterval,
    isPlaying = false;

timeSlider.on('change', updateTime);
qualityMenu.on('change', function() {
  colorMap();
  drawChart();
});
locationMenu.on('change', drawChart);

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

timelineEvents.on('click', function(e) {
  var time = $(this).data('time');

  if (time) {
    timeSlider.val(time);
    updateTime();
  }
});

timelineEvents.on('mouseenter', function(e) {
  var state = $(this).data('state');

  $('.' + state).first()[0].classList.add('active-state');
});

timelineEvents.on('mouseleave', function(e) {
  var state = $(this).data('state');

  $('.' + state).first()[0].classList.remove('active-state');
});

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
  drawChart();
}

initialize();
