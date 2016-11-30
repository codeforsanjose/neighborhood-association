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

  var directions = document.getElementById('directions');
  var neighborhood = document.getElementById('neighborhood');

  neighborhood.style.display = "block";
  directions.style.display = "none";
}

function loadDefaultNeighborhoods() {
  var org = '';
  var contact = '';
  var phone = '';
  var address = '';
  var city = '';
  var zip = '';
  var location = '';

  $.getJSON("js/Neighborhood_Organizations_region.geojson", function(data) {
    data.features.forEach((neighborhood) => {
      if (neighborhood.properties.ORG.charAt(0) === 'A') {
        org = neighborhood.properties.ORG;
        contact = neighborhood.properties.CONTACT !== null ? neighborhood.properties.CONTACT : '';
        phone = neighborhood.properties.PHONE0 !== null ? neighborhood.properties.PHONE0 : '';
        address = neighborhood.properties.ADDRESS;
        city = neighborhood.properties.CITY;
        zip = neighborhood.properties.ZIP;
        location = address !== null ? address + ', ' + city + ', CA ' + zip : ''; 
        console.log(org + ' ' + location);

        var neighborhoodDefaultSectionDiv = document.getElementById('neighborhoodDefaultSection');
        var neighborhoodAllDiv = document.createElement('div');
        neighborhoodAllDiv.className = 'neighborhoodAll';

        var lowDownDiv = document.createElement('span');
        lowDownDiv.className = 'lowDown';

        var neighborhoodTitle = document.createElement('h4');
        var neighborhoodTitleText = document.createTextNode(org);
        neighborhoodTitle.appendChild(neighborhoodTitleText);

        var contactElement = document.createElement('p');
        var contactText = document.createTextNode('Contact: ' + contact + '    ' + phone);
        contactElement.appendChild(contactText);

        var locationBoxDiv = document.createElement('span');
        locationBoxDiv.className = 'locationBox';
        var locationTitle = document.createElement('h5');
        var locationTitleText = document.createTextNode('Location:');
        locationTitle.appendChild(locationTitleText);
        locationBoxDiv.appendChild(locationTitle);
        var locationDetailsElement = document.createElement('p');
        var locationDetailsText = document.createTextNode(location);
        locationDetailsElement.appendChild(locationDetailsText);
        locationBoxDiv.appendChild(locationDetailsElement);

        lowDownDiv.appendChild(neighborhoodTitle);
        lowDownDiv.appendChild(contactElement);
        neighborhoodAllDiv.appendChild(lowDownDiv);
        neighborhoodAllDiv.appendChild(locationBoxDiv);
        neighborhoodDefaultSectionDiv.appendChild(neighborhoodAllDiv);
      }
    });
  });
}
function letterClickEvent(letter) {
  var neighborhoodSectionDiv = document.getElementById('neighborhoodSection');
  var neighborhoodDefaultSectionDiv = document.getElementById('neighborhoodDefaultSection');
  while (neighborhoodSectionDiv.hasChildNodes()) {
    neighborhoodSectionDiv.removeChild(neighborhoodSectionDiv.firstChild);
  }
  while (neighborhoodDefaultSectionDiv.hasChildNodes()) {
    neighborhoodDefaultSectionDiv.removeChild(neighborhoodDefaultSectionDiv.firstChild);
  }

  var org = '';
  var contact = '';
  var phone = '';
  var address = '';
  var city = '';
  var zip = '';
  var location = '';

  $.getJSON("js/Neighborhood_Organizations_region.geojson", function(data, error) {
    data.features.forEach((neighborhood) => {
      if (neighborhood.properties.ORG.charAt(0) === letter) {
        org = neighborhood.properties.ORG;
        contact = neighborhood.properties.CONTACT !== null ? neighborhood.properties.CONTACT : '';
        phone = neighborhood.properties.PHONE0 !== null ? neighborhood.properties.PHONE0 : '';
        address = neighborhood.properties.ADDRESS;
        city = neighborhood.properties.CITY;
        zip = neighborhood.properties.ZIP;
        location = address !== null ? address + ', ' + city + ', CA ' + zip : ''; 
        console.log(org + ' ' + location);

        var neighborhoodAllDiv = document.createElement('div');
        neighborhoodAllDiv.className = 'neighborhoodAll';

        var lowDownDiv = document.createElement('span');
        lowDownDiv.className = 'lowDown';

        var neighborhoodTitle = document.createElement('h4');
        var neighborhoodTitleText = document.createTextNode(org);
        neighborhoodTitle.appendChild(neighborhoodTitleText);

        var contactElement = document.createElement('p');
        var contactText = document.createTextNode('Contact: ' + contact + '    ' + phone);
        contactElement.appendChild(contactText);

        var locationBoxDiv = document.createElement('span');
        locationBoxDiv.className = 'locationBox';
        var locationTitle = document.createElement('h5');
        var locationTitleText = document.createTextNode('Location:');
        locationTitle.appendChild(locationTitleText);
        locationBoxDiv.appendChild(locationTitle);
        var locationDetailsElement = document.createElement('p');
        var locationDetailsText = document.createTextNode(location);
        locationDetailsElement.appendChild(locationDetailsText);
        locationBoxDiv.appendChild(locationDetailsElement);

        lowDownDiv.appendChild(neighborhoodTitle);
        lowDownDiv.appendChild(contactElement);
        neighborhoodAllDiv.appendChild(lowDownDiv);
        neighborhoodAllDiv.appendChild(locationBoxDiv);
        neighborhoodSectionDiv.appendChild(neighborhoodAllDiv);
      }
    });
  });
}

