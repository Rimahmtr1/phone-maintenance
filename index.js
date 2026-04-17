// ==========================================
// 1. FIREBASE IMPORTS
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// ==========================================
// 2. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
    authDomain: "phone-maintenance-18b38.firebaseapp.com",
    projectId: "phone-maintenance-18b38",
    storageBucket: "phone-maintenance-18b38.appspot.com",
    messagingSenderId: "881648450762",
    appId: "1:881648450762:web:b17fef83d6015c65a40833"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// 3. DOM ELEMENTS
// ==========================================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const authButtons = document.getElementById("authButtons");
const userSection = document.getElementById("userSection");
const userBalance = document.getElementById("userBalance");
const logoutBtn = document.getElementById("logoutBtn");
const heroText = document.getElementById("heroText");

let unsubscribeBalance = null; // Used to stop listening to updates on logout

// ==========================================
// 4. NAVIGATION LOGIC
// ==========================================
menuToggle?.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// ==========================================
// 5. AUTH & FIRESTORE LOGIC
// ==========================================
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.uid);

        // UI Adjustments
        if (authButtons) authButtons.style.display = "none";
        if (userSection) userSection.style.display = "block";
        if (heroText) heroText.innerText = "Welcome Back";

        // Listen for Real-time Balance from Firestore: users/{userId}/balance
        const userDocRef = doc(db, "users", user.uid);
        
        unsubscribeBalance = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const balance = data.balance || 0;
                
                // Format the balance with commas and LBP currency
                if (userBalance) {
                    userBalance.innerText = `${Number(balance).toLocaleString()} LBP`;
                }
            } else {
                if (userBalance) userBalance.innerText = "0 LBP";
                console.warn("User document does not exist in Firestore.");
            }
        }, (error) => {
            console.error("Error fetching balance:", error);
            if (userBalance) userBalance.innerText = "Error loading";
        });

    } else {
        console.log("User logged out");

        // UI Reset
        if (authButtons) authButtons.style.display = "block";
        if (userSection) userSection.style.display = "none";
        if (heroText) heroText.innerText = "Welcome to Our Website";

        // Stop listening to Firestore updates if logged out
        if (unsubscribeBalance) {
            unsubscribeBalance();
            unsubscribeBalance = null;
        }
    }
});

// ==========================================
// 6. LOGOUT LOGIC
// ==========================================
logoutBtn?.addEventListener("click", () => {
    signOut(auth).then(() => {
        console.log("Logged out successfully");
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
});
