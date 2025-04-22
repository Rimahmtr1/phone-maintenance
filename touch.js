
  function openAlert() {
    document.getElementById('customAlert').style.display = 'flex';
  }

  function closeAlert() {
    document.getElementById('customAlert').style.display = 'none';
  }
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
  function handleAction() {
    if (userId) {
      checkBalance(); // Go to the balance check
    } else {
      alert("Please log in or sign up to continue.");
    }
  }

  function checkBalance() {
    // Example placeholder for actual balance check logic
    alert("Checking balance... (user is logged in)");
  }
