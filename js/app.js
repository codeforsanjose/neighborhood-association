L.mapbox.accessToken = 'pk.eyJ1IjoiaWZlYXJjb21waWxlcmVycm9ycyIsImEiOiJjaXR6MXEwbHYwYjVnMnludnBuOGY0ZzNpIn0.Uhem8gvmgHnOhV55zvuYOQ';
// Create a map in the div #map
var map = L.mapbox.map('map', 'mapbox.streets').setView([37.3,-121.9], 11);
var popup = new L.Popup({ autoPan: false });
$.getJSON("js/Neighborhood_Organizations_region.geojson", function(data, error) {
  if(error != "success") console.log(error);
  var geojson = L.geoJson(data, {
    style: getStyle,
    onEachFeature: onEachFeature
  }).addTo(map);
  
  function getStyle(feature) {
    return {
      fillColor: 'blue',
      opacity: 0.65,
      weight: 2
    }
  }
  function onEachFeature(feature, layer) {
    layer.on({
      mousemove: mousemove,
      mouseout: mouseout,
      click: zoomToFeature,
    });
  }
  var closeTooltip;
  function mousemove(e) {
    var layer = e.target;
    var titles = ["<div class='marker-title'>", "Person: ", "Person Phone: ", "Contact: ", "Contact Phone: ", "Address: ", "City: ", "Zip: "]
    var features = [layer.feature.properties.ORG, layer.feature.properties.PERSON, layer.feature.properties.PHONE, layer.feature.properties.CONTACT, layer.feature.properties.PHONE0, layer.feature.properties.ADDRESS, layer.feature.properties.CITY, layer.feature.properties.ZIP]
    var display = [];
    var content = "";
    console.log(features);
    console.log(features.length);
    for(var i = 0; i < features.length; i++) {
      if(features[i] != null) {
        content = titles[i] + features[i];
        if(i == 0)
          display.push(content+"</div>");
        else
          display.push(content+"<br>");
      }
    }
    content = "";
    for(var i = 0; i < display.length; i++) {
      content += display[i];
    }
    popup.setLatLng(e.latlng);
    popup.setContent(content);
    if (!popup._map) popup.openOn(map);
      window.clearTimeout(closeTooltip);
    // highlight feature
    layer.setStyle({
      weight: 3,
      opacity: 0.3,
      fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
    }
  }
  function mouseout(e) {
    geojson.resetStyle(e.target);
    closeTooltip = window.setTimeout(function() {
      map.closePopup();
    }, 100);
  }
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }
});



var neighborhoods = [
	{
		city: "Alviso",
		description: "A quick description of the neighborhood or Alviso in general",
		location: "200 E Santa Clara",
		person: "Lucy Montelogo",
		facebook: "",
		twitter: "",
		phone: "(408) 945-9370"
	},

	{
		city: "Alum Rock",
		description: "A quick description of the neighborhood about Alum Rock",
		location: "200 E Santa Clara",
		person: "Douglas Dunn",
		facebook: "",
		twitter: "",
		phone: "(408) 445-9770"
	},

	{
		city: "North Side",
		description: "NorthSide Description goes here",
		location: "200 E Santa Clara",
		person: "Thomas Nguyen",
		facebook: "",
		twitter: "",
		phone: "(408) 785-9770"
	},

];

function toggleMobileMenu(){
  var menu = document.getElementById('mobileMenu');
  menu.style.display = "inline";
}

function closeMenu(){
  var menu = document.getElementById('mobileMenu');
  menu.style.display = "none";
}
function rightSideEvent(arr){
	// clear 
	$("#city").text(arr.city);
	$("#description").text(arr.description);
	$("#location").text(arr.location);
	$("#person").text(arr.person);
	$("#phone").text(arr.phone);

}

