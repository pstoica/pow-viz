var mapContainer = $("#map"),
    map;
// event info
var type = ['Decriminalization Laws', 'Medical Cannabis Laws', 
            'Both Medical and Decriminalization Laws', 'Legalized Cannabis'];
var events = [{
    date: new Date(2010, 0, 1),
    state: 'NJ', 
    fillKey: type[1],
    description: 'Jan. 11, 2010 - New Jersey Becomes 14th State to Legalize Medical Marijuana',
    latitude: 39.367,
    longitude: -74.751,
    radius: 5
  }, {
    date: new Date(2010, 10, 1),
    state: 'AZ', 
    fillKey: type[1],
    description: 'Nov. 2, 2010 - Arizona Becomes 15th State to Legalize Medical Marijuana',
    latitude: 34.251,
    longitude: -111.785,
    radius: 5 
  }, {
    date: new Date(2011, 4, 1),
    state: 'DE', 
    fillKey: type[1],
    description: 'May 13, 2011 - Delaware Becomes 16th State to Legalize Medical Marijuana',
    latitude: 38.891,
    longitude: -75.410,
    radius: 5
  }, {
    date: new Date(2012, 4, 1),
    state: 'CT', 
    fillKey: type[1],
    description: 'May 31, 2012 - Connecticut Becomes 17th State to Legalize Medical Marijuana',
    latitude: 41.67,
    longitude: -72.721,
    radius: 5
  }, {
    date: new Date(2012, 10, 1),
    state: 'MA', 
    fillKey: type[1],
    description: 'Nov. 6, 2012 - Massachusetts Becomes 18th state to Legalize Medical Marijuana',
    latitude: 42.407,
    longitude: -72.465,
    radius: 5
  }, {
    date: new Date(2013, 6, 1),
    state: 'NH', 
    fillKey: type[1],
    description: 'July 23, 2013 - New Hampshire Becomes 19th State to Legalize Medical Marijuana',
    latitude: 43.357,
    longitude: -71.589,
    radius: 5
  }, {
    date: new Date(2013, 7, 1),
    state: 'IL', 
    fillKey: type[1],
    description: 'Aug. 1, 2013 - Illinois Becomes 20th State to Legalize Medical Marijuana',
    latitude: 40.245,
    longitude: -89.472,
    radius: 5
  }, {
    date: new Date(2012, 10, 1),
    state: 'CO', 
    fillKey: type[3],
    description: 'Ballot initiatives make Washington and Colorado the first states to legalize recreation use',
    latitude: 39.095,
    longitude: -105.776,
    radius: 5
  }, {
    date: new Date(2012, 10, 1),
    state: 'WA', 
    fillKey: type[3],
    description: 'Ballot initiatives make Washington and Colorado the first states to legalize recreation use',
    latitude: 47.338,
    longitude: -120.014,
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
      defaultFill: '#555555',
      'Decriminalization Laws': '#4575D4',
      'Medical Cannabis Laws': '#FF4040',
      'Both Medical and Decriminalization Laws': '#9D3ED5',
      'Legalized Cannabis': '#FF7600'
    }
  });

  // bubbles for key events
  map.bubbles(events, {
    borderWidth: 0,
    highlightBorderColor: '#000000',
    highlightBorderWidth: 2,
    popupTemplate: function (geo, data) { 
            return ['<div class="hoverinfo"><strong>' + data.state + '</strong>',
            '<br/>Type: ' +  data.fillKey,
            '<br/>Date: ' +  data.date + '',
            '<br/>Description: ' +  data.description + '',
            '</div>'].join('');
    }
  });
}

// lazy responsive map hack
$(window).resize(function() {
  drawMap();
})

// initializing code
drawMap();