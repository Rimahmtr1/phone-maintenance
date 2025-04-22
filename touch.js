// Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    limit,
    getDocs,
    updateDoc,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

document.addEventListener("DOMContentLoaded", function () {
    // UI functions
    function openAlert() {
        document.getElementById('customAlert').style.display = 'flex';
    }

    function closeAlert() {
        document.getElementById('customAlert').style.display = 'none';
    }

    // Button event listener setup
    const openAlertBtn = document.getElementById("openAlertBtn");
    const closeAlertBtn = document.getElementById("closeAlertBtn");
    const buyBtn = document.getElementById("buyBtn");

    if (openAlertBtn) openAlertBtn.addEventListener("click", openAlert);
    if (closeAlertBtn) closeAlertBtn.addEventListener("click", closeAlert);
    if (buyBtn) buyBtn.addEventListener("click", handleAction);

    // Main buy button action
    function handleAction() {
        const userId = localStorage.getItem('loggedUserId');
        if (userId) {
            checkBalance(userId);
        } else {
            alert("Please log in or sign up to continue.");
        }
    }
async function checkBalance(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data(); // ✅ define inside this block
            const balance = userData.balance || 0;

            if (balance >= 800000) {
                await getOneAvailableItemCode(); // ✅ wait for it
            } else {
                alert("You don't have enough balance.");
            }
        } else {
            alert("User data not found.");
        }
    } catch (error) {
        alert("Error checking balance: " + error.message);
    }
}



   // Get an unused item code and mark it as selected
async function getOneAvailableItemCode() {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("selected", "==", false), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const itemDoc = querySnapshot.docs[0];
            const itemId = itemDoc.id;
            const itemData = itemDoc.data();

            const itemRef = doc(db, "items", itemId);
            await updateDoc(itemRef, { selected: true });

            // ✅ Now redirect AFTER it's marked as selected
            showItemCode(itemData["item-code"]);

        } else {
            alert("Sold out. No more item codes available.");
        }
    } catch (error) {
        alert("Error fetching item code: " + error.message);
    }
}

function showItemCode(code) {
    // Redirect to touch-buy.html with the code as a query parameter
    window.location.href = `touch-buy.html?code=${encodeURIComponent(code)}`;
}

