let currentUser, model, webcam, ctx, labelContainer, maxPredictions, touchState, database, personElem,alertElem;


function setup() {
	audioClip=loadSound('./stoptouchingaudio.mp3');
/*	
	const firebaseConfig = {
	    "apiKey": "AIzaSyAy10kU2kBqbgQnFsjkUknMScIlKqkdbZ4",
	    "authDomain": "finalporoject-team15.firebaseapp.com",
	    "databaseURL": "https://finalporoject-team15.firebaseio.com",
	    "projectID": "finalporoject-team15",
	    "storageBucket": "finalporoject-team15.appspot.com",
	    "messagingSenderId": "76330279348",
	    "appId": "1:76330279348:web:fdb070eba465285b91d2e1"
	};
	firebase.initializeApp(firebaseConfig);
*/
	
	
	database = firebase.database();
	document.body.style.backgroundColor="green";
	alertElem = document.getElementById("alert-type");
	alertElem.onchange= function() {
		if (this.value == "pi") {
			document.body.style.backgroundColor="white";
		} else {
			document.body.style.backgroundColor="green";
		}
	}
	user = firebase.auth().currentUser;
	//console.log(user, 'user--');
	// if (user) {
// 		console.log(user);
// 	}

}


async function init() {
	const tmURL = "https://teachablemachine.withgoogle.com/models/hDFjqd73v/";
	touchState = false;
    const modelURL = tmURL + "model.json";
    const metadataURL = tmURL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 300;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loopCam);
	// append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
	// set bars to be visible
	document.getElementById("bar1").style.visibility = "visible";
	document.getElementById("bar-container1").style.visibility = "visible";
	document.getElementById("bar-container2").style.visibility = "visible";
	document.getElementById("bar2").style.visibility = "visible";

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loopCam(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loopCam);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

	let bar1 = document.getElementById("bar1");
	let bar2 = document.getElementById("bar2");
	bar1.style.width = 100*prediction[0].probability.toFixed(2) + "%";
	bar2.style.width = 100*prediction[1].probability.toFixed(2) + "%";

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + " probability: " + 100*prediction[i].probability.toFixed(2)+"%";
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);
    // HERE IS WHERE ALERTS NEED TO HAPPEN
    var alertType = document.getElementById("alert-type");
    console.log("Alert type is: "+ alertType.value);
    var pred1 = prediction[0].probability.toFixed(2);
    var pred2 = prediction[1].probability.toFixed(2);
    //console.log("pred1: "+ pred1);
    //console.log("pred2: "+ pred2);
    var currentState = pred2>0.7;
	if (alertType.value == "browser") {
        if (touchState != currentState) {
            touchState = currentState;
            if (touchState) {
                
                //audioClip.play();
                if(!audioClip.isPlaying()){
					//song.play();
					audioClip.play();
				}
				 document.body.style.backgroundColor="red";
            } else {
                audioClip.stop();
				document.body.style.backgroundColor="green";
            }

        }
    } else if (alertType.value == "pi") {
		//var persons = {"OHNuBBoydjRVQbm89tVh8eWIOJ13": "michael", "0403AizFXLWmCEu6YuzulIpr1Xr2": "lorena" };
		var persons = {"michael.c.rendleman@gmail.com": "michael", "lcastro@edumat.org": "lorena" };
		
		//user = firebase.auth().currentUser;
        //console(user);
        
        firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			currentUser = user.email;
			//console.log(user.email, "who am I? --sketch");
			
		  } else {
			// No user is signed in.
			currentUser = "";
			//console.log(user.email, "who am I? --sketch");
		  }
		});
        
        
        
        var personName = persons[currentUser]; // get person selection
		//console.log("User is "+personName+" with email "+currentUser);
        database.ref(personName).once('value').then(function(data) { // get current person's value
            var val = data.val();
            if (val != currentState) { // if there is a change, send the change
                console.log("Sending update: "+currentState+" to value " + personName);
                var updates = {}; 
                updates[personName] = currentState;
                database.ref().update(updates);
                touchState = currentState;
            }
        });
    }       
}       

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) { 
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
}

