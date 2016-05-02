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

///featureLayer.on('ready', function(){
///  this.eachLayer(function(layer){
///    layer.bindPopup('Welcome to ' + layer.feature.properties.name);
///  });
///});


///CLICK HANDLER
  var clickHandler = function(e){
  $('#info').empty();

  var feature = e.target.feature;

  $('#info').fadeIn(400,function(){
    var info = '';

    info += '<div>'
    info += '<h2>' + feature.properties.name + '</h2>'
    if(feature.properties.phone) info +=   '<p>'  + feature.properties.cuisine + '</p>'
    if(feature.properties.phone) info +=   '<p>'  + feature.properties.phone + '</p>'
    if(feature.properties.phone) info +=   '<p>'  + feature.properties.website + '</p>'
    if(feature.properties.phone) info +=   '<p><a href="' + feature.properties.website + '">'  + feature.properties.website + '</a></p>'
    info += '</div>'

    $('#info').append(info);
  })

  var myGeoJSON = myLocation.getGeoJSON();
  
  getDirections(myGeoJSON.geometry.coordinates, 
               feature.geometry.coordinates);
  
  }

featureLayer.on('ready', function(){
  this.eachLayer(function(layer){
    layer.on('click', clickHandler);
  })
})

map.on('click',function(e){
	$('#info').fadeOut(200);
    $('#info').empty();
})
 
///GEOLOCATION TOOL


var myLocation = L.mapbox.featureLayer().addTo(map);


map.on('locationfound', function(e){
    myLocation.setGeoJSON({
       type: 'Feature',
       geometry: {
       	   type: 'Point',
           coordinates: [e.latlng.lng, e.latlng.lat]
       },
       properties: {
         "title": "Here I am!",
         "marker-color": "#FF0000",
         "marker-symbol": "star"
       }
    })
})

map.locate({setView: true})


var routeLine = L.mapbox.featureLayer().addTo(map);

function getDirections(frm, to){
  var jsonPayload = JSON.stringify({
    locations:[
      {lat: frm[1], lon: frm[0]},
      {lat: to[1], lon: to[0]}
    ],
    costing: 'pedestrian',
    units: 'miles'
  })
  $.ajax({
    url:'https://valhalla.mapzen.com/route',
    data:{
      json: jsonPayload,
      api_key: 'valhalla-tw3wJQH'
    }
  }).done(function(data){
    var routeShape = polyline.decode(data.trip.legs[0].shape);
    routeLine.setGeoJSON({
     type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeShape
      },
      properties: {
        "stroke":"#ed23f1",
        "stroke-opacitity": 0.8,
        "stroke-width": 8
      }
    })
  })        
}
