// Import the necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
    authDomain: "phone-maintenance-18b38.firebaseapp.com",
    projectId: "phone-maintenance-18b38",
    storageBucket: "phone-maintenance-18b38.appspot.com",
    messagingSenderId: "881648450762",
    appId: "1:881648450762:web:b17fef83d6015c65a40833",
    measurementId: "G-0MD0GJJ0E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Show message function
function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// The specific Owner UID that can access the owner features
const OWNER_UID = "bvZbjkSBKMgRiSJpHrqvqGhOLbZ2";

// Sign In Event Listener
const signInButton = document.getElementById('submitSignIn');
signInButton.addEventListener('click', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Firebase Authentication to sign the user in
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('User signed in:', user);

            // Check if the logged-in user UID matches the Owner UID
            if (user.uid === OWNER_UID) {
                // Save user data to localStorage for session persistence
                localStorage.setItem('loggedUserId', user.uid);
                
                // Show success message
                showMessage('Login successful! Welcome, Owner.', 'signInMessage');
                
                // Redirect to the Owner's page
                window.location.href = "ownerPage.html";  // Redirect to the owner panel page
            } else {
                // Show message if the logged-in user is not the owner
                showMessage('Access denied: You are not an authorized owner.', 'signInMessage');
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Error during sign-in:', errorCode, errorMessage);

            // Display error message
            if (errorCode === 'auth/wrong-password') {
                showMessage('Incorrect password. Please try again.', 'signInMessage');
            } else if (errorCode === 'auth/user-not-found') {
                showMessage('No account found with this email. Please sign up.', 'signInMessage');
            } else {
                showMessage('Error logging in: ' + errorMessage, 'signInMessage');
            }
        });
});
