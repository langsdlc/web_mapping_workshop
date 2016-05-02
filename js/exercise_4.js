// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'vulibrarygis.019hb2al';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1IjoidnVsaWJyYXJ5Z2lzIiwiYSI6ImFaN2JkSlUifQ.Dl2sTO1mGKK7MCd1ViGPnQ';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = 'pk.eyJ1IjoidnVsaWJyYXJ5Z2lzIiwiYSI6ImFaN2JkSlUifQ.Dl2sTO1mGKK7MCd1ViGPnQ';
var map = L.mapbox.map('map', 'vulibrarygis.019hb2al');

// Set the initial view of the map to the whole US
map.setView([39, -96], 4);

// Great, now we have a basic web map!

var dataFileToAdd = 'data/restaurants.geojson';


var featureLayer = L.mapbox.featureLayer()
    .loadURL(dataFileToAdd)
    .addTo(map);

featureLayer.on('ready', function() {
  this.eachLayer(function(layer){
    layer.setIcon(L.mapbox.marker.icon({
      'marker-color': '#8834bb',
      'marker-size': 'large',
      'marker-symbol': 'restaurant'
    }))
  });
  map.fitBounds(featureLayer.getBounds());
});

var myLocation = L.mapbox.featureLayer().addTo(map);


map.on('locateionfound', function(e){
    myLocation.setGeoJSON({
       type: 'Feature',
       geometry: {
       	   type: 'Point',
           coordinates: [e.latlng.lng e.latlng.lat]
       },
       properties: {
         "title": "Here I am!",
         "marker-color": "#FF0000",
         "marker-symbol": "star-stroked"
       }
    })
})

map.locate({setView: true})

