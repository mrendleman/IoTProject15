var firebase = require('firebase/app');
require('firebase/database');
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4,'out'); // LED is in pin 4 for GPIO
var firebaseConfig = require("./firebaseConfig.json");

// This node app requires a command line input: e.g. michael or ding (this must match the name of your corresponding firebase variable)
const args = process.argv.slice(2);

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// to turn on LED: LED.writeSync(1);
// to turn off LED: LED.writeSync(0);
var updateValueRef = database.ref(args[0]);
updateValueRef.on('value', function(snapshot) {
    if (snapshot.val()) { // if face touching value is true
        LED.writeSync(1);
    } else {
        LED.writeSync(0);
    }
});
