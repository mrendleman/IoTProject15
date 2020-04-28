(function(){
    
    
    var user = firebase.auth().currentUser;
		if (user) {
			console.log(user);
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) {
    
				
      
//       var user = firebase.auth().currentUser;
// 		if (user) {
// 			console.log(user);
// 			firebase.auth().onAuthStateChanged(function(user) {
// 			  if (user) {
// 				console.log(user.email + 'here');
// 				// User is signed in.
			  } else {
				
				
			  }
			});
		}else{
			console.log('nobody');
			
			var ui = new firebaseui.auth.AuthUI(firebase.auth());
				//console.log(ui);
				var uiConfig = {
					callbacks: {
					  signInSuccessWithAuthResult: function(authResult, redirectUrl) {
						// User successfully signed in.
						// Return type determines whether we continue the redirect automatically
						// or whether we leave that to developer to handle.
						return true;
					  },
					  uiShown: function() {
						// The widget is rendered.
						// Hide the loader.
						document.getElementById('loader').style.display = 'none';
					  }
					},
					// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
					signInFlow: 'popup',
					signInSuccessUrl: 'index.html',//'main.html',
					signInOptions: [
					  // Leave the lines as is for the providers you want to offer your users.
					  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					//   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
					//   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
					//   firebase.auth.GithubAuthProvider.PROVIDER_ID,
					  firebase.auth.EmailAuthProvider.PROVIDER_ID
					//   firebase.auth.PhoneAuthProvider.PROVIDER_ID
					],
					// Terms of service url.
					tosUrl: 'index.html',//'main.html',
					// Privacy policy url.
					// privacyPolicyUrl: '<your-privacy-policy-url>'
				  };
				  console.log(uiConfig);
				  ui.start('#firebaseui-auth-container', uiConfig);
		}
})()
