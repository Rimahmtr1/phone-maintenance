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

// DOM ready
document.addEventListener("DOMContentLoaded", () => {
    const openAlertBtn = document.getElementById("openAlertBtn");
    const closeAlertBtn = document.getElementById("closeAlertBtn");
    const buyBtn = document.getElementById("buyBtn");

    // UI handlers
    openAlertBtn?.addEventListener("click", () => {
        document.getElementById('customAlert').style.display = 'flex';
    });

    closeAlertBtn?.addEventListener("click", () => {
        document.getElementById('customAlert').style.display = 'none';
    });

    buyBtn?.addEventListener("click", () => {
        document.getElementById('customAlert').style.display = 'none';
        const userId = localStorage.getItem('loggedUserId');
        if (userId) {
            checkBalance(userId);
        } else {
            alert("Please log in or sign up to continue.");
        }
    });
});

// Check balance and process purchase
async function checkBalance(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            alert("User data not found.");
            return;
        }

        const { balance = 0 } = userSnap.data();

        if (balance < 800000) {
            alert("You don't have enough balance.");
            return;
        }

        const itemData = await getOneAvailableItemCode(userId);
        if (!itemData) return;

        const newBalance = balance - 800000;
        await updateDoc(userRef, { balance: newBalance });

        showItemCode(itemData["item-code"]);

    } catch (error) {
        alert("Error checking balance: " + error.message);
    }
}

// Get one available item
async function getOneAvailableItemCode(userId) {
    try {
        const q = query(
            collection(db, "items"),
            where("selected", "==", false),
            limit(1)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            alert("Sold out. No more item codes available.");
            return null;
        }

        const itemDoc = snapshot.docs[0];
        const itemRef = doc(db, "items", itemDoc.id);

        await updateDoc(itemRef, {
            selected: true,
            selectedBy: userId
        });

        return itemDoc.data();

    } catch (error) {
        alert("Error fetching item code: " + error.message);
        return null;
    }
}

// Redirect with item code
function showItemCode(code) {
    window.location.href = `touch-buy.html?code=${encodeURIComponent(code)}`;
}
