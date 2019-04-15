//Store API endpoint inside queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

//GET request to query the URL
//send the features of the response body to the createFeatures function 
d3.json(queryUrl).then(data => createFeatures(data.features));


//def function to run once for each feature in the features array
//give each feature a popup describing the place and time of the earthquake
function addPopups(feature, layer) {
	layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`)
//	console.log("addPopups funct works");
}

//empty array to store data 
var quakes = [];


function createFeatures(EQData) {
	//create a GeoJSON layer containing the features array on the EQData object
	//run the onEachFeatures function once for each piece of data in the array
	var EQLayer = L.geoJSON(EQData, {
		onEachFeature: addPopups
	});
	var quakes = EQData;
	//Send our layer to the createMap funct
	createMap(EQLayer);
//	console.log("createFeatures function works");
//	console.log(quakes);

}

function createMap (earthquakes) {
	//Def street/start layers
	var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

	var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
	//Def a baseMaps object to hold our base layers
	var baseMaps = {
		"Street Map" : streetMap,
		"Dark Map" : darkMap
		};


	//Overlay that can be toggled on/off. The overlay is the array of markers
	var overlay ={
		Earthquakes: earthquakes 
	};

	//create our default map object with streetmap and earthquakes layers as default on load
	var myMap = L.map("map", {
	center : [40.760780, -111.891045],			//SLC, UT
	zoom: 4,
	layers: [streetMap, earthquakes]
});

//pass our map layers into our layer control
//add the layer control to the map
//the keys is what shows up in your layer control
//L.control creates the widget in top right.
		L.control.layers(baseMaps, overlay, {
			collapsed: true
		}).addTo(myMap);


}



//create a markerSize function giving each quake a different radius based on magnitude
function markerSize(mag){
	return mag * 10000;			//50 is arbitrary num. Usually want between 10-100
	console.log("markerSize function works");
}

 quakes.forEach(EQ => {
 	L.circle(features.geometry.coordinates, {
 		fillOpacity: 0.75,
 		color: "yellow",
 		fillColor: "yellow",
 		radius: markerSize(features.properties.mag)
 	  }).bindPopup(`<h1>${features.properties.mag}</h1><hr><h3>Population ${features.properties.place}</h3>`)
		.addTo(myMap);
 	console.log("marker loop works");

})
//Loop through the quakes array and create one marker for each quake object


// function circles(quake){
// 	console.log("circles function works");



// d3.json(queryUrl).then(data => {
// 	var earthQ = data.features;
// 	console.log(earthQ);

	

// 	for (var i = 0; i < earthQ.length; i++) {
//         var lat = earthQ[i].geometry["coordinates"][1]
//         var long = earthQ[i].geometry["coordinates"][0]
// 		var mag = earthQ[i].properties["mag"];
// 		var location = earthQ[i].properties["place"];
// 		L.circle([lat, long], {
// 			fillOpacity: 0.75,
// 			color: "yellow",
// 			fillColor: "yellow",
// 			radius: markerSize(mag)
// 		  }).bindPopup(`<h1>${mag}</h1><hr><h3>Population ${location}</h3>`)
// 			.addTo(myMap);

// }




//quakes.forEach(quake => quakeMarkers.push(L.marker(quakes.whatkey).bindPopup(`<h1>${quakes.otherkey}</h1>`)));

//Do i need this forEach ????
//add the quakeMarkers to a new layer group
// Now we can handle them as one group instead of referencing each individually
// var quakeLayer = L.layerGroup(quakeMarkers);		//do I need this


