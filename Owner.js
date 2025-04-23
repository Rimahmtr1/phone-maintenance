import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Hardcoded owner credentials
const OWNER_EMAIL = "remahmattar@gmail.com";
const OWNER_UID = "bvZbjkSBKMgRiSJpHrqvqGhOLbZ2";

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const status = document.getElementById("loginStatus");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.uid === OWNER_UID && user.email === OWNER_EMAIL) {
      status.textContent = "Login successful!";
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("ownerPanel").style.display = "block";
      loadUserList();
    } else {
      status.textContent = "Access denied: Not an authorized owner.";
    }
  } catch (error) {
    status.textContent = "Login failed: " + error.message;
  }
});

let selectedUserId = null;

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

  const amount = parseFloat(document.getElementById("topupAmount").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const userRef = doc(db, "users", selectedUserId);
  await updateDoc(userRef, {
    balance: increment(amount)
  });

  await setDoc(doc(collection(db, "transactions")), {
    userId: selectedUserId,
    amount: amount,
    transaction_type: "topup",
    timestamp: new Date()
  });

  loadBalance(selectedUserId);
  alert("Top-up successful");
};
