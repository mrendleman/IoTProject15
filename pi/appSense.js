var firebase = require('firebase/app');
require('firebase/database');
var nodeimu = require('@trbll/nodeimu');
var IMU = new nodeimu.IMU();
var sense = require('@trbll/sense-hat-led'):
var firebaseConfig = require("./firebaseConfig.json");

firebase.intiializeApp(firebaseConfig);
var database = firebase.database();
