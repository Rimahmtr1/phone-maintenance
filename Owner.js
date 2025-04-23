import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, increment } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let selectedUserId = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const joinRef = doc(db, "joinedUsers", user.uid);
    const joinSnap = await getDoc(joinRef);

    if (joinSnap.exists()) {
      document.getElementById("authStatus").style.display = "none";
      document.getElementById("ownerPanel").style.display = "block";
      loadUserList();
    } else {
      document.getElementById("authStatus").innerText = "Access denied: Not a joined user.";
    }
  } else {
    document.getElementById("authStatus").innerText = "User not signed in.";
  }
});

async function loadUserList() {
  const userSelect = document.getElementById("userSelect");
  userSelect.innerHTML = "";

  const usersSnapshot = await getDocs(collection(db, "users"));
  usersSnapshot.forEach((doc) => {
    const option = document.createElement("option");
    option.value = doc.id;
    option.textContent = doc.id;
    userSelect.appendChild(option);
  });

  userSelect.addEventListener("change", () => {
    selectedUserId = userSelect.value;
    loadBalance(selectedUserId);
  });

  userSelect.dispatchEvent(new Event("change"));
}

async function loadBalance(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    document.getElementById("balanceDisplay").innerText = data.balance || 0;
  }
}

window.topupBalance = async function () {
  if (!selectedUserId) return;
  const amount = parseFloat(document.getElementById("topupAmount").value);
  if (isNaN(amount) || amount <= 0) {
    alert("Enter a valid amount");
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
  alert("Balance updated!");
};
