var firebase = require( 'firebase/app' );
require ( 'firebase/database' );
var nodeimu = require('@trbll/nodeimu');
var IMU = new nodeimu.IMU();
var sense = require( '@trbll/sense-hat-led' );



// var firebaseConfig = {
//     apiKey: "AIzaSyAHByCnBv9b45wFNCPcHbtvl4XZpvWBsss",
//     authDomain: "iot-lab2-7fa53.firebaseapp.com",
//     databaseURL: "https://iot-lab2-7fa53.firebaseio.com",
//     projectId: "iot-lab2-7fa53",
//     storageBucket: "iot-lab2-7fa53.appspot.com",
//     messagingSenderId: "860272082652",
//     appId: "1:860272082652:web:14531a855f5e6be16d7e19"
// };

var firebaseConfig = require('./firebaseConfig.json');
//{
//    apiKey: "AIzaSyAy10kU2kBqbgQnFsjkUknMScIlKqkdbZ4",
//    authDomain: "finalporoject-team15.firebaseapp.com",
//    databaseURL: "https://finalporoject-team15.firebaseio.com",
//    projectId: "finalporoject-team15",
//    storageBucket: "finalporoject-team15.appspot.com",
//    messagingSenderId: "76330279348",
//    appId: "1:76330279348:web:fdb070eba465285b91d2e1"
//  };
  
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// var updateLightRef = database.ref('Light_update');
// updateLightRef.on('value', function(snapshot) {
// 	if (snapshot.val()) {
// 		database.ref().once('value').then(function(dataSnapshot) {
// 			setPixelValue(dataSnapshot.child('Light_Row').val(),
// 				dataSnapshot.child('Light_Col').val(),
// 				[dataSnapshot.child('Light_R').val(), 
// 					dataSnapshot.child('Light_G').val(),
// 					dataSnapshot.child('Light_B').val()]
// 			);
// 			database.ref('Light_update').set(false);
// 		});
// 	}
// });

var updateTouchRef = database.ref('lorena');
updateTouchRef.on('value', function(snapshot) {
	if (snapshot.val()) {
		console.log(snapshot.val());
		database.ref().once('value').then(function(dataSnapshot) {
			setPixelValue('red');
			database.ref('lorena').set(false);
		});
	}
});

var idx = [0, 1, 2, 3, 4, 5, 6, 7];
function setPixelValue(color) {
	//console.log("Setting light %d, %d to RGB value [ %d, %d, %d ]",row,col,rgb[0],rgb[1],rgb[2]);
	
	for (var i = 0; i < idx.length; i++) {
    	for (var j = 0; i < idx.length; j++) {
    		sense.setPixel(i,j,[255,99,71]);
		}
	}
	
	//sense.clear(color);
}


setInterval( readSensors, 60000);

function readSensors() {
	IMU.getValue(callb);
}

function callb(e,data) {
	var updates= {};
	var temp = Math.round(data.temperature*100)/100;
	var hum = Math.round(data.humidity*100)/100;
// 	console.log("Updating database temperature and humidity values to %f and %f",temp,hum);
// 	updates['Temperature']=temp;
// 	updates['Humidity']=hum;
// 	database.ref().update(updates);
}
