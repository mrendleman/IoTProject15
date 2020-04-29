var app_fireBase = {};
(function(){
   
    const config = {
	    "apiKey": "AIzaSyAy10kU2kBqbgQnFsjkUknMScIlKqkdbZ4",
	    "authDomain": "finalporoject-team15.firebaseapp.com",
	    "databaseURL": "https://finalporoject-team15.firebaseio.com",
	    "projectID": "finalporoject-team15",
	    "storageBucket": "finalporoject-team15.appspot.com",
	    "messagingSenderId": "76330279348",
	    "appId": "1:76330279348:web:fdb070eba465285b91d2e1"
	};
    // Initialize Firebase
    firebase.initializeApp(config);

    app_fireBase = firebase;
    
    googleSignIn=()=>{
        provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result){
            console.log(result)
            console.log("Success Google Authentication")
        }).catch(function(err){
            console.log(err)
            console.log("Failed")
        })
    }

})()