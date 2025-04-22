// Ensure Firebase functions are loaded as modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    limit,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
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

document.addEventListener("DOMContentLoaded", function () {
    // Function to open the custom alert
    function openAlert() {
        document.getElementById('customAlert').style.display = 'flex';
    }

    // Function to close the custom alert
    function closeAlert() {
        document.getElementById('customAlert').style.display = 'none';
    }

    // Check if the user is logged in
    const userId = localStorage.getItem('loggedUserId');

    // Handle action when "Buy" button is clicked
    function handleAction() {
        if (userId) {
            checkBalance(); // Go to the balance check
        } else {
            alert("Please log in or sign up to continue.");
        }
    }

    // Simulated user balance (replace this with real data from Firestore or your backend)
async function checkBalance() {
    const balance = 850000; // Example value, replace this with real balance logic

    if (balance >= 800000) {
        getOneAvailableItemCode();
    } else {
        alert("You don't have enough balance.");
    }
}

async function getOneAvailableItemCode() {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("selected", "==", false), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const itemDoc = querySnapshot.docs[0];
            const itemId = itemDoc.id;
            const itemData = itemDoc.data();

            // Display the item-code to the user
            alert("Your item code is: " + itemData["item-code"]);

            // Mark it as selected
            const itemRef = doc(db, "items", itemId);
            await updateDoc(itemRef, { selected: true });
        } else {
            alert("Sold out. No more item codes available.");
        }
    } catch (error) {
        alert("Error fetching item code: " + error.message);
    }
}

    // Attach event listeners after the DOM is loaded
    const openAlertBtn = document.getElementById("openAlertBtn");
    const closeAlertBtn = document.getElementById("closeAlertBtn");
    const buyBtn = document.getElementById("buyBtn");

    // Add event listeners to buttons
    if (openAlertBtn) {
        openAlertBtn.addEventListener("click", openAlert);
    }

    if (closeAlertBtn) {
        closeAlertBtn.addEventListener("click", closeAlert);
    }

    if (buyBtn) {
        buyBtn.addEventListener("click", handleAction);
    }
});

