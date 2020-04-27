



var audioClip;
function preload() {
	audioClip=loadSound('./stoptouchingaudio.mp3');
}

function playClip() {
	audioClip.play();
}

function stopClip() {
	audioClip.stop();
}

// hiding person selector until Pi option is chosen
var personElem = document.getElementById("personWrapper");
personElem.style.visibility = "hidden";
var alert = document.getElementById("alert-type");
alert.onchange= function() {
    personElem.style.visibility = (this.value == "pi") ? "visible":"hidden";
}
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose
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
var database = firebase.database();

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/hDFjqd73v/";
let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
	// append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size; canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}
var touchState = false;

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // finally draw the poses
    drawPose(pose);
    // HERE IS WHERE ALERTS NEED TO HAPPEN
    var alertType = document.getElementById("alert-type");
    console.log("Alert type is: "+ alertType.value);
    var pred1 = prediction[0].probability.toFixed(2);
    var pred2 = prediction[1].probability.toFixed(2);
    console.log("pred1: "+ pred1);
    console.log("pred2: "+ pred2);
    var currentState = pred2>pred1;
	if (alertType.value == "browser") {
        if (touchState != currentState) {
            touchState = currentState;
            if (touchState) {
                playClip();
            } else {
                stopClip();
            }

        }
    } else if (alertType.value == "pi") {
        var personName = document.getElementById("person"); // get person selection
        database.ref(personName.value).once('value').then(function(data) { // get current person's value
            var val = data.val();
            if (val != currentState) { // if there is a change, send the change
                console.log("Sending update: "+currentState+" to value " + personName.value);
                var updates={}; 
                updates[personName.value] = currentState;
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

