var firebase = require('firebase/app');
require('firebase/database');
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4,'out'); // LED is in pin 4 for GPIO
var firebaseConfig = require("./firebaseConfig.json");

const args = process.argv.slice(2);
var user2measurement = {"michael": "michaelValue", "ding": "dingValue"};
console.log(user2measurement[args[0]]);


firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// to turn on LED: LED.writeSync(1);
// to turn off LED: LED.writeSync(0);
