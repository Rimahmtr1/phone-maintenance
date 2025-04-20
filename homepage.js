import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

// Function to fetch user data from Firestore
async function getUserData(uid) {
    const docRef = doc(db, "users", uid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById("first-name").innerText = userData.firstName;
            document.getElementById("last-name").innerText = userData.lastName;
            document.getElementById("email").innerText = userData.email;
            document.getElementById("balance").innerText = userData.balance;
        } else {
            console.error("No user document found!");
        }
    } catch (error) {
        console.error("Error fetching user data: ", error);
    }
}

// Handle authentication state change (user logged in or not)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Fetch and display user data if logged in
        getUserData(user.uid);
    } else {
        // If no user is logged in, redirect to login page
        window.location.href = "index.html";
    }
});

// Logout function
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html"; // Redirect to login page after logout
    }).catch((error) => {
        console.error("Error signing out: ", error);
    });
});
