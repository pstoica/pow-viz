var mapContainer = $("#map"),
    map;
// event info
var type = ['Decriminalization Laws', 'Medical Cannabis Laws', 
            'Both Medical and Decriminalization Laws', 'Legalized Cannabis'];
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
    date: new Date(2011, 6, 1),
    state: 'CT', 
    fillKey: type[0],
    description: 'Gov. Dan Malloy signed legislation into law ‘decriminalizing’ the possession of small, personal use amounts of marijuana by adults',
    latitude: 41.67,
    longitude: -72.721,
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
    fillOpacity: 1,
    highlightOnHover: false,
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