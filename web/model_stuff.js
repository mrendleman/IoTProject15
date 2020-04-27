
// Classifier Variable
  let classifier;
  // Model URL
  
  //  "./"
  
  let imageModelURL = 'https://teachablemachine.withgoogle.com/models/jKkgyiPg2/';
  //let imageModelURL = 'https://teachablemachine.withgoogle.com/models/jKkgyiPg2/';

  
  // Video
  let video;
  let flippedVideo;
  // To store the classification
  let label = "";
  let label2 = "";
  let label3 = "";
  let confi_touch = 0.0;
  let confi_Notouch = 0.0;
  let song;
  var database;
  
  var started = false;
  

  // Load the model first
  function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  }
  
  

  function setup() {
  
  	var firebaseConfig = {
		apiKey: "AIzaSyAy10kU2kBqbgQnFsjkUknMScIlKqkdbZ4",
		authDomain: "finalporoject-team15.firebaseapp.com",
		databaseURL: "https://finalporoject-team15.firebaseio.com",
		projectId: "finalporoject-team15",
		storageBucket: "finalporoject-team15.appspot.com",
		messagingSenderId: "76330279348",
		appId: "1:76330279348:web:fdb070eba465285b91d2e1"
	  };
	
	firebase.initializeApp(firebaseConfig); 
	database = firebase.database();

    var cnv = createCanvas(640, 520);
    var x = (windowWidth - width) / 2;
  	var y = (windowHeight - height) / 2;
  	cnv.position(x, y);
  	
    // Create the video
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();
    
    
    song = loadSound('./stop3.m4a');
    
	noLoop();
	
    flippedVideo = ml5.flipImage(video);
    // Start classifying
    
    classifyVideo();
    //setInterval( classifyVideo(), 1000);
    
  }

  function draw() {
    
    if(started){
		background(0);
		//frameRate(2);
		// Draw the video
		image(flippedVideo, 0, 0);

		// Draw the label
		fill(255);
		textSize(16);
		textAlign(CENTER);
		text(label, width / 2, height - 4);
		text(label2, width / 2, height - 30);
		text(label3, width / 2, height - 60);
	
		let emoji = "🤷";
		let status = false;
		if (label == "touch" && confi_touch > 0.7) {
			emoji = "🙈";
			status = true;
			if(!song.isPlaying()){
				song.play();
			}
			
		}else if (label == "no_touch" && confi_touch > 0.6) {
			emoji = "🙉";
			status = false;
		}
		submitFaceStatus(status);
	
		textSize(50);
		text(emoji, width -100, height -30);
  	}
  }

  // Get a prediction for the current video frame
  function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();

  } 

  // When we get a result
  function gotResult(error, results) {
    // If there is an error
    if (error) {
      console.error(error);
      return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    
    
    label = results[0].label;
    confi_touch = results[0].confidence;
    label2 = results[0].label + ', '+results[0].confidence;
    label3 = results[1].label + ', '+results[1].confidence;
    
    //confi_Notouch = results[1].confidence;
    //console.log(typeof confi_touch);
    // Classifiy again!
    
    //setInterval( classifyVideo(), 120000);
    
    classifyVideo();
  }
  
  function submitFaceStatus(flag) {
  	//database.ref('lorena').set(status);
  	var alertType = document.getElementById("alert-type").value;
  	var person = document.getElementById("person").value;
  	console.log(alertType + person)
  	if (alertType == "pi"){
  		database.ref(person).once('value').then(function(data) { // get current person's value
			var val = data.val();
			var currentState = flag;
			if (val != currentState) { // if there is a change, send the change
				console.log("Sending update: "+currentState+" to value " + person);
				var updates={};
				updates[person] = currentState;
				database.ref().update(updates); 
			}
		});
  	}
  	
  	
  	//console.log(status + ', status');
  }
  
  function start(){
   	started = true;
   	loop();
  }
  
  function stop(){
  	console.log('STOP')
  	submitFaceStatus('any');
   	started = false;
   	noLoop();
  }
  
/*
// video

let video;
let flippedVideo;
let label = "waiting...";
let classifier;
let modelURL = 'https://teachablemachine.withgoogle.com/models/A3EYn6I1l/';

// 1. Load the model
function preload(){
	classifier = ml5.imageClassifier(modelURL+ "model.json");
	
}

function setup(){
	createCanvas(640, 520);
	
	// create video
	video = createCapture(VIDEO);
	video.size(640, 480);
	video.hide();
	
	flippedVideo = ml5.flipImage(video);
	
	// 2. start the classification 
	classifyVideo();
}

function classifyVideo(){
	//classifier.classify(video, gotResults);
	flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResults);
    flippedVideo.remove();
}


function draw(){
	background(0);
	
	// video
	image(flippedVideo, 0, 0);//image(video, 0, 0);
	
	// 4.  draw the label
	textSize(32);
	textAlign(CENTER, CENTER);
	fill(255);
	text(label, width / 2, height - 16);
	
	let emoji = "🚂";
	
	if (label == "touch") {
		emoji = "🌈";
	} else if (label == "Unicorn") {
		emoji = "🦄";
	}
	
	textSize(256);
  	text(emoji, width / 2, height / 2);
}

// 3. get the classification

function gotResults(error, results){
	if (error) {
      console.error(error);
      return;
    }
	label = results[0].label + ",  " + results[0].confidence;
	console.log(results[1].label + ",  " + results[1].confidence);
	
	
    
	//classifyVideo();
}

*/