var firebase = require('firebase/app');
require('firebase/database');
var Gpio = require('onoff').Gpio;
var LED = new Gpio(4,'out');
