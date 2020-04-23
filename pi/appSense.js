var firebase = require( 'firebase/app' );
require ( 'firebase/database' );
var nodeimu = require('@trbll/nodeimu');
var IMU = new nodeimu.IMU();
var sense = require( '@trbll/sense-hat-led' );


var firebaseConfig = require('./firebaseConfig.json');

  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();


var updateTouchRef = database.ref('lorena');
updateTouchRef.on('value', function(snapshot) {
	if (snapshot.val()==true) {
		console.log(snapshot.val());
		setPixelValue([255,99,71]);
	}else{
		console.log(snapshot.val());
		setPixelValue([0,128,8]);
	}
});

var idx = [0, 1, 2, 3, 4, 5, 6, 7];
function setPixelValue(color) {
	for (var i = 0; i < idx.length; i++) {
    		for (var j = 0; j < idx.length; j++) {
    			sense.setPixel(i,j,color);
		}
	}
	
}