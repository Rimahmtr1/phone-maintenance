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
    getDoc,
    addDoc
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
    const openAlertBtn = document.getElementById("openAlertBtn");
    const closeAlertBtn = document.getElementById("closeAlertBtn");
    const buyBtn = document.getElementById("buyBtn");

    if (openAlertBtn) openAlertBtn.addEventListener("click", async function () {
        // Step 1: Confirm the buy action
        const confirmBuy = confirm("Are you sure you want to buy?");
        if (!confirmBuy) return; // Exit if user cancels

        // Step 2: Proceed with the purchase if confirmed
        const userId = localStorage.getItem('loggedUserId');
        if (!userId) return alert("Please log in or sign up to continue.");

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) return alert("User data not found.");
        const userData = userSnap.data();
        const balance = userData.balance || 0;

        if (balance < 800000) return alert("You don't have enough balance.");

        const itemData = await getOneAvailableItemCode(userId);
        if (!itemData) return;

        const newBalance = balance - 800000;
        await updateDoc(userRef, { balance: newBalance });

        // Step 3: Create the transaction before redirect
        await createTransaction(itemData["item-code"]);

        // Step 4: Go to the item page
        showItemCode(itemData["item-code"]);
    });

    if (closeAlertBtn) closeAlertBtn.addEventListener("click", closeAlert);

    // Handle the action on buy
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

            const itemData = await getOneAvailableItemCode(userId);
            if (!itemData) return;

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
                selectedBy: userId // 🔥 this is required for rule to pass
            });

            return itemData;

        } catch (error) {
            alert("Error fetching item code: " + error.message);
            return null;
        }
    }

    // Create transaction document in Firestore
    async function createTransaction(itemCode) {
        try {
            const transactionsRef = collection(db, "transactions");

            const transactionData = {
                date: new Date().toISOString(),
                itemcode: itemCode,
                amount: 800000,
                type: "buy",
                status: "Success"
            };

            const docRef = await addDoc(transactionsRef, transactionData);
            await updateDoc(docRef, {
                "transaction-id": docRef.id
            });

            console.log("Transaction created:", docRef.id);
        } catch (error) {
            alert("Error creating transaction: " + error.message);
        }
    }

    // This function will show the item code on the next page
    function showItemCode(code) {
        window.location.href = `touch-buy.html?code=${encodeURIComponent(code)}`;
    }

    // Close alert
    function closeAlert() {
        document.getElementById('customAlert').style.display = 'none';
    }

}); // Closes DOMContentLoaded
