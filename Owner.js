import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
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
    setDoc,
    increment
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
const auth = getAuth(app);

let selectedUserId = null;

onAuthStateChanged(auth, async (user) => {
    const authStatus = document.getElementById("authStatus");
    const ownerPanel = document.getElementById("ownerPanel");

    if (user) {
        const joinRef = doc(db, "joinedUsers", user.uid);
        const joinSnap = await getDoc(joinRef);

        if (joinSnap.exists()) {
            authStatus.style.display = "none";
            ownerPanel.style.display = "block";
            loadUserList();
        } else {
            authStatus.innerText = "Access denied: Not a joined user.";
        }
    } else {
        authStatus.innerText = "User not signed in.";
    }
});

async function loadUserList() {
    const userSelect = document.getElementById("userSelect");
    userSelect.innerHTML = "";

    const usersSnapshot = await getDocs(collection(db, "users"));
    usersSnapshot.forEach((userDoc) => {
        const option = document.createElement("option");
        option.value = userDoc.id;
        option.textContent = userDoc.id;
        userSelect.appendChild(option);
    });

    userSelect.addEventListener("change", () => {
        selectedUserId = userSelect.value;
        loadBalance(selectedUserId);
    });

    // Trigger once initially
    if (userSelect.options.length > 0) {
        selectedUserId = userSelect.options[0].value;
        loadBalance(selectedUserId);
    }
}

async function loadBalance(userId) {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        document.getElementById("balanceDisplay").innerText = userData.balance || 0;
    }
}

window.topupBalance = async function () {
    if (!selectedUserId) return;

    const topupAmount = parseFloat(document.getElementById("topupAmount").value);
    if (isNaN(topupAmount) || topupAmount <= 0) {
        alert("Enter a valid top-up amount");
        return;
    }

    const userRef = doc(db, "users", selectedUserId);

    // Update balance
    await updateDoc(userRef, {
        balance: increment(topupAmount)
    });

    // Add transaction record
    await setDoc(doc(collection(db, "transactions")), {
        userId: selectedUserId,
        amount: topupAmount,
        transaction_type: "topup",
        timestamp: new Date()
    });

    // Refresh UI
    loadBalance(selectedUserId);
    alert("Balance topped up successfully!");
};
