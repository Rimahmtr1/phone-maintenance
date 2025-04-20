// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase configuration
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

// Check if user is logged in
const userId = localStorage.getItem('loggedUserId');

if (!userId) {
    // Redirect to login page if no user is logged in
    window.location.href = 'signup.html';
} else {
    // Fetch user data from Firestore
    fetchUserData(userId);
}

// Fetch user profile data from Firestore
function fetchUserData(userId) {
    const userRef = doc(db, "users", userId);

    // Use the getDoc function to retrieve the document data
    getDoc(userRef)
        .then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('firstName').textContent = userData.firstName;
                document.getElementById('lastName').textContent = userData.lastName;
                document.getElementById('email').textContent = userData.email;
                document.getElementById('balance').textContent = userData.balance;

                // Hide loading and show profile info
                document.getElementById('loading').style.display = 'none';
                document.getElementById('profileInfo').style.display = 'block';
            } else {
                showError('No profile data found');
            }
        })
        .catch((error) => {
            console.error('Error getting document:', error);
            showError('Failed to load profile data.');
        });
}

// Show error message
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

// Log out functionality
document.getElementById('logoutButton').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('loggedUserId');
        window.location.href = 'index.html'; // Redirect to sign-in page
    }).catch((error) => {
        console.error('Logout Error: ', error);
    });
});
