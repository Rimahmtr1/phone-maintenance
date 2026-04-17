import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const db = getFirestore(app);

// DOM Elements
const authButtons = document.getElementById("authButtons");
const userSection = document.getElementById("userSection");
const userBalance = document.getElementById("userBalance");
const heroText = document.getElementById("heroText");
const logoutBtn = document.getElementById("logoutBtn");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

let unsubscribe = null; // To clean up the listener

// Mobile Menu
menuToggle?.addEventListener("click", () => navMenu.classList.toggle("active"));

// Auth State Logic
onAuthStateChanged(auth, (user) => {
    if (user) {
        // 1. Swap Visibility
        authButtons.style.display = "none";
        userSection.style.display = "block";
        heroText.innerText = "Welcome Back";

        // 2. Start Live Balance Listener
        const userRef = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const bal = data.balance ?? 0;
                // Format with LBP and thousands separator
                userBalance.innerText = `${Number(bal).toLocaleString()} $`;
            } else {
                userBalance.innerText = "0 LBP";
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            userBalance.innerText = "Error Loading";
        });

    } else {
        // User Logged Out
        if (unsubscribe) unsubscribe(); // Stop listening
        authButtons.style.display = "block";
        userSection.style.display = "none";
        heroText.innerText = "Welcome to Our Website";
    }
});

// Logout Button Action
logoutBtn?.addEventListener("click", () => {
    signOut(auth).then(() => console.log("Logged out"));
});
