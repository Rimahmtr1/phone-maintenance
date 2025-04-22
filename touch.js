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

    const openAlertBtn = document.getElementById("openAlertBtn");
    const closeAlertBtn = document.getElementById("closeAlertBtn");
    const buyBtn = document.getElementById("buyBtn");

    if (openAlertBtn) openAlertBtn.addEventListener("click", openAlert);
    if (closeAlertBtn) closeAlertBtn.addEventListener("click", closeAlert);
    if (buyBtn) buyBtn.addEventListener("click", handleAction);

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

        if (!userSnap.exists()) return alert("User data not found.");

        const userData = userSnap.data();
        const balance = userData.balance || 0;

        if (balance < 800000) return alert("You don't have enough balance.");

        const itemData = await getOneAvailableItemCode(userId); // 🔁 Pass userId
        if (!itemData) return; // ⛔ Don't show anything if item was not assigned

        // 👇 Update balance AFTER item was secured
        const newBalance = balance - 800000;
        await updateDoc(userRef, { balance: newBalance });

        showItemCode(itemData["item-code"]);

    } catch (error) {
        alert("Error checking balance: " + error.message);
    }
}
async function getOneAvailableItemCode(userId) {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("selected", "==", false), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Sold out. No more item codes available.");
            return null;
        }

        const itemDoc = querySnapshot.docs[0];
        const itemId = itemDoc.id;
        const itemData = itemDoc.data();

        const itemRef = doc(db, "items", itemId);
        await updateDoc(itemRef, {
            selected: true,
            selectedBy: userId // 👈 Required by Firestore rules
        });

        return itemData;

    } catch (error) {
        alert("Error fetching item code: " + error.message);
        return null;
    }
}

  

// ✅ This function lives outside DOMContentLoaded
function showItemCode(code) {
    window.location.href = `touch-buy.html?code=${encodeURIComponent(code)}`;
}
