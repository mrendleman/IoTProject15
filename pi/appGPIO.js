var firebase = require('firebase/app');
require('firebase/database');
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4,'out'); // LED is in pin 4 for GPIO

// to turn on LED: LED.writeSync(1);
// to turn off LED: LED.writeSync(0);
