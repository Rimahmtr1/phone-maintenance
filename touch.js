import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
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
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
    authDomain: "phone-maintenance-18b38.firebaseapp.com",
    projectId: "phone-maintenance-18b38",
    storageBucket: "phone-maintenance-18b38.appspot.com",
    messagingSenderId: "881648450762",
    appId: "1:881648450762:web:b17fef83d6015c65a40833",
    measurementId: "G-0MD0GJJ0E2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
    const buyBtn = document.getElementById("buyBtn");

    buyBtn.addEventListener("click", async () => {
        const userId = localStorage.getItem('loggedUserId');
        if (!userId) {
            alert("Please log in first.");
            return;
        }
        await checkBalance(userId);
    });
});

// Fetch balance and determine eligibility
async function checkBalance(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            const balance = userData.balance || 0;

            if (balance >= 800000) {
                await getOneAvailableItemCode();
            } else {
                alert("You don't have enough balance.");
            }
        } else {
            alert("User not found.");
        }
    } catch (error) {
        alert("Error checking balance: " + error.message);
    }
}

// Fetch available item and mark it as selected
async function getOneAvailableItemCode() {
    const itemsRef = collection(db, "items");
    const q = query(itemsRef, where("selected", "==", false), limit(1));

    try {
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const itemDoc = querySnapshot.docs[0];
            const itemId = itemDoc.id;
            const itemData = itemDoc.data();

            // Mark the item as selected
            const itemRef = doc(db, "items", itemId);
            await updateDoc(itemRef, { selected: true });

            // Show the item code in the styled box
            showItemCode(itemData["item-code"]);
        } else {
            alert("Sold out. No more item codes.");
        }
    } catch (error) {
        alert("Error fetching item: " + error.message);
    }
}

// Display the item code in custom box
function showItemCode(code) {
    document.getElementById("itemCodeText").textContent = code;
    document.getElementById("itemCodeBox").style.display = "block";
}

function closeItemCodeBox() {
    document.getElementById("itemCodeBox").style.display = "none";
}
