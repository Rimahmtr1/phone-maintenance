// Import necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

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

// Get UI elements
const userEmailSelect = document.getElementById('userEmail');
const userBalanceInput = document.getElementById('userBalance');
const newBalanceInput = document.getElementById('newBalance');
const updateBalanceBtn = document.getElementById('updateBalanceBtn');
const messageDiv = document.getElementById('message');
const loadingMessageDiv = document.getElementById('loadingMessage');
const logoutBtn = document.getElementById('logoutBtn');
const loggedInUserEmailDiv = document.getElementById('loggedInUserEmail');

// Define the owner UID
const OWNER_UID = "bvZbjkSBKMgRiSJpHrqvqGhOLbZ2";

// Get the users from Firestore and populate the dropdown
async function getUsers() {
    loadingMessageDiv.style.display = "block";

    const usersCollection = collection(db, "users");
    const usersSnapshot = await getDocs(usersCollection);
    const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    // Populate the dropdown with user emails and associate them with UIDs
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id; // Store UID as value
        option.textContent = user.email; // Display email in the dropdown
        userEmailSelect.appendChild(option);
    });

    loadingMessageDiv.style.display = "none";
}

// Display the balance of the selected user
async function displayUserBalance(uid) {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        userBalanceInput.value = userData.balance;
    } else {
        userBalanceInput.value = "";
    }
}

// Update the user's balance in Firestore
async function updateUserBalance(uid, updatedBalance) {
    const userRef = doc(db, "users", uid);
    
    // Update the balance in the Firestore document
    await updateDoc(userRef, {
        balance: updatedBalance
    });

    // Add a transaction record for this balance update
    await addDoc(collection(db, "transactions"), {
        amount: updatedBalance,
        balance_after: updatedBalance,
        balance_before: updatedBalance - parseFloat(newBalanceInput.value), // The previous balance before adding
        transaction_date: new Date().toISOString(),
        transaction_type: "Top-up",
        transactionid: uid
    });

    // Display success message
    messageDiv.textContent = "Balance updated successfully!";
    messageDiv.className = 'message-success';
    alert("Success update");
}

// Event listener for user email selection
userEmailSelect.addEventListener('change', async () => {
    const selectedUID = userEmailSelect.value;
    if (selectedUID) {
        await displayUserBalance(selectedUID);
    }
});

// Event listener for updating the balance
updateBalanceBtn.addEventListener('click', async () => {
    const selectedUID = userEmailSelect.value;
    const newBalanceValue = newBalanceInput.value; // Get the new balance from the input

    // Validate that a user is selected and that the new balance is a valid number
    if (!selectedUID || !newBalanceValue || isNaN(newBalanceValue)) {
        messageDiv.textContent = "Please select a user and enter a valid amount.";
        messageDiv.className = 'message-error';
        return;
    }

    const newBalance = parseFloat(newBalanceValue); // Convert new balance to a number

    // Get the user's current balance
    const userRef = doc(db, "users", selectedUID);
    const userDoc = await getDoc(userRef);
    
    // If the user exists, get the current balance, otherwise set it to 0
    const currentBalance = userDoc.exists() ? userDoc.data().balance : 0;

    // Sum the current balance with the new balance
    const updatedBalance = currentBalance + newBalance;

    // Now, update the user's balance in Firestore
    await updateUserBalance(selectedUID, updatedBalance);
});

// Event listener for logging out
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "owner.html"; // Redirect to login page after logout
    }).catch((error) => {
        console.error("Error during sign-out:", error);
    });
});

// Display the logged-in user's email
auth.onAuthStateChanged((user) => {
    if (user) {
        loggedInUserEmailDiv.textContent = `Logged in as: ${user.email}`;
    } else {
        loggedInUserEmailDiv.textContent = "No user logged in.";
    }
});

// Load users when the page loads
window.onload = getUsers;
