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
    const buyBtn = document.getElementById("buyBtn");

    // Listen for "Buy" button click
    if (buyBtn) {
        buyBtn.addEventListener("click", async function () {
            // Ask for user confirmation before proceeding with the purchase
            const confirmBuy = confirm("Are you sure you want to buy?");
            if (!confirmBuy) return; // Exit if user cancels

            // Proceed with the purchase if confirmed
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

            // Create the transaction before redirecting
            await createTransaction(itemData["item-code"], 800000); // Pass item code and amount

            // Proceed to show item code on the next page
            showItemCode(itemData["item-code"]);
        });
    }

    // Function to get available item code
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

            // Update the selected item as taken
            const itemRef = doc(db, "items", itemId);
            await updateDoc(itemRef, {
                selected: true,
                selectedBy: userId // Assign item to the user
            });

            return itemData;
        } catch (error) {
            alert("Error fetching item code: " + error.message);
            return null;
        }
    }

    // Function to create a transaction document in Firestore
    async function createTransaction(itemCode, amount) {
        try {
            const transactionsRef = collection(db, "transactions");

            // Prepare transaction data
            const transactionData = {
                date: new Date().toISOString(), // Current timestamp
                itemcode: itemCode,             // Item code
                amount: amount,                 // Amount spent (800000)
                type: "buy",                    // Transaction type
                status: "Success"               // Transaction status
            };

            // Add the transaction to Firestore
            const docRef = await addDoc(transactionsRef, transactionData);

            console.log("Transaction created successfully with ID:", docRef.id);

            // Optionally, you can update the document with the transaction ID
            await updateDoc(docRef, {
                "transaction-id": docRef.id
            });

        } catch (error) {
            console.error("Error creating transaction: ", error.message);
            alert("Error creating transaction: " + error.message);
        }
    }

    // Function to show item code on the next page
    function showItemCode(code) {
        window.location.href = `touch-buy.html?code=${encodeURIComponent(code)}`;
    }

}); // Closes DOMContentLoaded
