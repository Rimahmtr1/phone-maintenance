// Import the necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const db = getFirestore(app);
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

// Function to validate phone number
function validatePhoneNumber(phone) {
    const validPrefixes = ['76', '71', '70', '78', '81', '03'];
    const phonePrefix = phone.substring(0, 2); // Extract first 2 digits
    const isValidPrefix = validPrefixes.includes(phonePrefix);
    
    if (phone.length !== 8) {
        return 'Phone number must be 8 digits long.';
    } 
    if (!isValidPrefix) {
        return 'Phone number must start with one of the following: 76, 71, 70, 78, 81, or 03.';
    }
    return null; // If no errors, return null
}

// Sign Up Event Listener
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener('click', (event) => {
    event.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    
    // Validate phone number
    const phoneError = validatePhoneNumber(phone);
    if (phoneError) {
        showMessage(phoneError, 'signUpMessage');
        return; // Stop the process if phone number is invalid
    }

    // Firebase Authentication to create the user
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: `+961${phone}`, // Prefix the phone number with the default country code
            };

            // Save user data to Firestore
            const userDocRef = doc(db, "users", user.uid);
            setDoc(userDocRef, userData)
                .then(() => {
                    showMessage('Account created successfully!', 'signUpMessage');
                    window.location.href = "index.html"; // Redirect to homepage after successful signup
                })
                .catch((error) => {
                    console.error("Error writing document:", error);
                    showMessage('Error saving data!', 'signUpMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email is already in use!', 'signUpMessage');
            } else {
                showMessage('Error creating account!', 'signUpMessage');
            }
        });
});
