// =======================
// FIREBASE CONFIG & INIT
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
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
// DOM ELEMENTS
// =======================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const authButtons = document.getElementById("authButtons");
const userSection = document.getElementById("userSection");
const logoutBtn = document.getElementById("logoutBtn");
const heroText = document.getElementById("heroText");

// =======================
// MENU TOGGLE LOGIC
// =======================
menuToggle?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// =======================
// AUTH STATE LISTENER
// =======================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Logged in:", user.email);
        
        // 1. Hide Login/Signup container
        if (authButtons) authButtons.style.display = "none";
        
        // 2. Show Logout/User section
        if (userSection) userSection.style.display = "block";
        
        // 3. Update Text
        if (heroText) heroText.innerText = "Welcome Back!";
    } else {
        console.log("Not logged in");
        
        // 1. Show Login/Signup container
        if (authButtons) authButtons.style.display = "block";
        
        // 2. Hide Logout/User section
        if (userSection) userSection.style.display = "none";
        
        // 3. Update Text
        if (heroText) heroText.innerText = "Welcome to Our Website";
    }
});

// =======================
// LOGOUT LOGIC
// =======================
logoutBtn?.addEventListener("click", () => {
    signOut(auth).then(() => {
        alert("Signed out successfully!");
    }).catch((error) => {
        console.error("Sign out error:", error);
    });
});
