// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, getDocFromServer } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 AUTH + FIRESTORE GUARD (BLOCK ACCESS)
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // ❌ Not logged in
        window.location.replace("login.html");
        return;
    }

    try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDocFromServer(userRef);

        if (!snap.exists()) {
            // ❌ No Firestore profile
            await signOut(auth);
            window.location.replace("login.html");
            return;
        }

        // ✅ User allowed
        loadUserProfile(snap.data());

    } catch (error) {
        console.error("Access check failed:", error);
        await signOut(auth);
        window.location.replace("login.html");
    }
});

// Load user profile data
function loadUserProfile(userData) {
    document.getElementById('firstName').textContent = userData.firstName || "";
    document.getElementById('lastName').textContent = userData.lastName || "";
    document.getElementById('email').textContent = userData.email || "";
    document.getElementById('balance').textContent = userData.balance ?? 0;

    document.getElementById('loading').style.display = 'none';
    document.getElementById('profileInfo').style.display = 'block';
}

// Show error message
function showError(message) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

// 🚪 LOGOUT
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.replace("login.html");
    } catch (error) {
        console.error("Logout error:", error);
    }
});

// 🔙 RETURN BUTTON
document.getElementById("returnButton").addEventListener("click", () => {
    window.location.href = "index.html";
});
