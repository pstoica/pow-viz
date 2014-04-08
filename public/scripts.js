var mapContainer = $("#map"),
    map;

// map drawing taken care of by datamaps: https://github.com/markmarkoh/datamaps
function drawMap() {
  mapContainer.empty();

  map = new Datamap({
    element: mapContainer[0],
    scope: 'usa',
    fills: {
      defaultFill: '#555555'
    }
  });
}

// lazy responsive map hack
$(window).resize(function() {
  drawMap();
})

// initializing code
drawMap();