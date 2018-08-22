function auto() {
    var ways = document.getElementsByClassName("waypoints1");
    for(var i=0;i<ways.length;i++){
        var sourceSearch = new google.maps.places.SearchBox(ways[i]);
        sourceSearch.addListener('places_changed', function() {
        var places = sourceSearch.getPlaces();
    
        if (places.length == 0) {
          return;
        }
        });
    }
}


function createWay(){
    var way = document.getElementById("waypoints");
    var val = Number.parseInt(way.value);
    var show = document.getElementById("showway");
    show.innerHTML = "Enter Way points: "
    for(var i=0;i<val;i++){
        show.innerHTML = show.innerHTML + "<input type='text' class='waypoints1 feedback-input' name='waypoints["+(i)+"]' placeholder='Enter Waypoint "+(i+1)+"'>";
    }
    auto();
}




function route(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {lat: 20.3507, lng: 85.8063}
      });
    var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    // directionsDisplay.setDirections(null);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
}
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: {lat: 20.3507, lng: 85.8063}
    });
}


function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
  var checkboxArray = document.getElementsByClassName('waypoints1');
  for (var i = 0; i < checkboxArray.length; i++) {
      console.log(checkboxArray[i].value);
      waypts.push({
        location: checkboxArray[i].value,
        stopover: true
      });
  }
        
  
    directionsService.route({
      origin: document.getElementById('start').value,
      destination: document.getElementById('end').value,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
}

  function start() {
  
    var source = document.getElementById("start");
    var destination = document.getElementById("end");
    var sourceSearch = new google.maps.places.SearchBox(source);
    var destinationSearch = new google.maps.places.SearchBox(destination);
    
    sourceSearch.addListener('places_changed', function() {
     var places = sourceSearch.getPlaces();
 
     if (places.length == 0) {
       return;
     }
     });
     
     
     destinationSearch.addListener('places_changed', function() {
     var places = destinationSearch.getPlaces();
 
     if (places.length == 0) {
       return;
     }
     });
   
   initMap();
   }