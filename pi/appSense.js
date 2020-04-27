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
		setPixelValue([255,0,0]);
	}else if (snapshot.val()==false){
		console.log(snapshot.val());
		setPixelValue([0,128,8]);
	}else if (snapshot.val()=='any'){
		console.log(snapshot.val());
		setPixelValue([0,0, 0]);
	}
});


function setPixelValue(color) {
	for (var i = 0; i < 8; i++) {
    		for (var j = 0; j < 8; j++) {
    			sense.setPixel(i,j,color);
		}
	}
	
}