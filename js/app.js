L.mapbox.accessToken = 'pk.eyJ1IjoiaWZlYXJjb21waWxlcmVycm9ycyIsImEiOiJjaXR6MXEwbHYwYjVnMnludnBuOGY0ZzNpIn0.Uhem8gvmgHnOhV55zvuYOQ';
// Create a map in the div #map
var map = L.mapbox.map('map', 'mapbox.streets').setView([37.3,-121.9], 11);
var popup = new L.Popup({ autoPan: false });
var myJson;

$.getJSON("https://raw.githubusercontent.com/codeforsanjose/neighborhood-association/master/Neighborhood_Organizations_region.geojson", function(data, error) {
  if(error != "success") console.log(error);
  myJson = data;

  var geojson = L.geoJson(data, {
    style: getStyle,
    onEachFeature: onEachFeature
  }).addTo(map);
  
  
  function getStyle(feature) {
    return {
      fillColor: '#41BCEF',
      opacity: 0.65,
      weight: 2
    }
  }
  function onEachFeature(feature, layer) {
    layer.on({
      mousemove: mousemove,
      mouseout: mouseout,
      click: click,
    });
  }
  var closeTooltip;
  
  function mousemove(e) {
    var layer = e.target;
    var titles = ["<div class='marker-title'>", "Person: ", "Person Phone: ", "Contact: ", "Contact Phone: ", "Address: ", "City: ", "Zip: "]
    var features = [layer.feature.properties.ORG, layer.feature.properties.PERSON, layer.feature.properties.PHONE, layer.feature.properties.CONTACT, layer.feature.properties.PHONE0, layer.feature.properties.ADDRESS, layer.feature.properties.CITY, layer.feature.properties.ZIP]
    var display = [];
    var content = "";

    for(var i = 0; i < features.length; i++) {
      if(features[i] !== null) {
        content = titles[i] + features[i];
        if(i === 0)
          display.push(content+"</div>");
        else
          display.push(content+"<br>");
      }
    }
    content = "";
    for(var x = 0; x < display.length; x++) {
      content += display[x];
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
  
  function click(e){
    var layer = e.target;
    var f = [
      layer.feature.properties.ORG, 
      layer.feature.properties.ADDRESS, 
      layer.feature.properties.CITY, 
      layer.feature.properties.ZIP, 
      layer.feature.properties.PERSON, 
      layer.feature.properties.PHONE, 
      layer.feature.properties.SIZE, 
    ];
      
    info.updateInfoMap(f[0], f[1], f[2], f[3], f[4], f[5], f[6]);
    zoomToFeature(e);
  }
  
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    
  }
});






var info = new Vue ({
  el: '.js-info',
  data:{
    notClicked:true,
    org: "Boys and Girls Club",
    address: "123 Seasame Street",
    city: "San Jose",
    zip: "95035",
    person: "Douglas Dunn",
    phone: "(408)719-0408",
    size: "42"
  },
  methods:{
    updateInfo: function(index){
      this.notClicked = false;
      this.org = myJson.features[index].properties.ORG;
      this.address = myJson.features[index].properties.ADDRESS;
      this.city = myJson.features[index].properties.CITY;
      this.zip = myJson.features[index].properties.ZIP;
      this.person = myJson.features[index].properties.PERSON;
      this.phone = myJson.features[index].properties.PHONE;
      this.size = myJson.features[index].properties.SIZE;
    },
    
    updateInfoMap: function(org, add, city, zip, person, phone, size){
      this.notClicked = false;
      this.org = org;
      this.address = add;
      this.city = city;
      this.zip = zip;
      this.person = person;
      this.phone = phone;
      this.size = size;
    }
  }
});

var list = new Vue ({
  el: ".list",
  data:{
    lists: geomap.features
  },
  methods:{
    transfer: function(index){
      info.updateInfo(index);
    },
    transfer2: function(org, add, city, zip, person, phone, size){
      info.notClicked = false;
      info.org = org;
      info.address = add;
      info.city = city;
      info.zip = zip;
      info.person = person;
      info.phone = phone;
      info.size = size;

    }
  }
});
function searchFilter (value){
  var arr = [];
  var size = 75;
  for (var x = 0; x < size; x++){
      var string = geomap.features[x].properties.ORG;
      value = value.toLowerCase();
      string = string.toLowerCase();

      if (string.includes(value)){
          arr.push(geomap.features[x]);
      }
  }
  list.lists = arr;

}
$('.search-input').keyup(function(){
  $value = $('.search-input').val();
  searchFilter($value);
});
$('.search-input').focusin(function(){
  $('#map').addClass('animated fadeOut').hide();
  $('.list').addClass('animated fadeInUp').show();
});

$('.fa-times').click(function(){
  $('.list').hide();
  $('#map').removeClass('fadeOut').show();
});