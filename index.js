// =======================
// MENU TOGGLE
// =======================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});


// =======================
// FIREBASE AUTH UI CONTROL
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
    authDomain: "phone-maintenance-18b38.firebaseapp.com",
    projectId: "phone-maintenance-18b38",
    storageBucket: "phone-maintenance-18b38.appspot.com",
    messagingSenderId: "881648450762",
    appId: "1:881648450762:web:b17fef83d6015c65a40833"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


// =======================
// AUTH UI ELEMENTS
// =======================
const authButtons = document.getElementById("authButtons");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");


// =======================
// AUTH STATE LISTENER
// =======================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in:", user.uid);

        // ✅ Hide login/signup
        if (authButtons) authButtons.style.display = "none";

        // OPTIONAL: replace with account link
        // authButtons.innerHTML = `
        //     <a href="homepage.html">My Account</a>
        // `;
    } else {
        console.log("Not logged in");

        // ❌ Show login/signup
        if (authButtons) authButtons.style.display = "block";
    }
});
