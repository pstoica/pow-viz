var mapContainer = $("#map"),
    map;

// map drawing taken care of by datamaps: http://datamaps.github.io/
function drawMap() {
  mapContainer.empty();

  map = new Datamap({
    element: mapContainer[0],
    scope: 'usa',
    fills: {
      defaultFill: '#555555'
    }
  });

  // TODO: add bubbles for key events
}

// lazy responsive map hack
$(window).resize(function() {
  drawMap();
})

// initializing code
drawMap();