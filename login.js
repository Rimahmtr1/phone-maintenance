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
const auth = getAuth(app);

// Show message function
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign In Event Listener
const signInButton = document.getElementById('submitSignIn');

signInButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('User signed in:', user.uid);

        // ✅ DO NOT store UID in localStorage
        // Firebase Auth already persists the session securely

        showMessage('Login successful!', 'signInMessage');

        // Redirect to homepage
        window.location.href = "homepage.html";

    } catch (error) {
        console.error('Error during sign-in:', error.code, error.message);

        if (error.code === 'auth/wrong-password') {
            showMessage('Incorrect password. Please try again.', 'signInMessage');
        } else if (error.code === 'auth/user-not-found') {
            showMessage('No account found with this email. Please sign up.', 'signInMessage');
        } else {
            showMessage('Error logging in: ' + error.message, 'signInMessage');
        }
    }
});
