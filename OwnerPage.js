// Import necessary Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
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
const userUIDSelect = document.getElementById('userUID');
const userBalanceInput = document.getElementById('userBalance');
const newBalanceInput = document.getElementById('newBalance');
const updateBalanceBtn = document.getElementById('updateBalanceBtn');
const messageDiv = document.getElementById('message');
const loadingMessageDiv = document.getElementById('loadingMessage');
const logoutBtn = document.getElementById('logoutBtn');

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

    // Populate the dropdown with user UIDs
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.id;
        userUIDSelect.appendChild(option);
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
async function updateUserBalance(uid, newBalance) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        balance: newBalance
    });
    messageDiv.textContent = "Balance updated successfully!";
    messageDiv.className = 'message-success';
}

// Event listener for user UID selection
userUIDSelect.addEventListener('change', async () => {
    const selectedUID = userUIDSelect.value;
    if (selectedUID) {
        await displayUserBalance(selectedUID);
    }
});

// Event listener for updating the balance
updateBalanceBtn.addEventListener('click', async () => {
    const selectedUID = userUIDSelect.value;
    const newBalance = newBalanceInput.value;

    if (!selectedUID || !newBalance) {
        messageDiv.textContent = "Please select a user and enter a new balance.";
        messageDiv.className = 'message-error';
        return;
    }

    await updateUserBalance(selectedUID, newBalance);
});

// Event listener for logging out
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "owner.html"; // Redirect to login page after logout
    }).catch((error) => {
        console.error("Error during sign-out:", error);
    });
});

// Load users when the page loads
window.onload = getUsers;
