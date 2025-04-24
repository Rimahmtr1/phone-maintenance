// Firebase setup
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
  setDoc
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
  authDomain: "phone-maintenance-18b38.firebaseapp.com",
  projectId: "phone-maintenance-18b38",
  storageBucket: "phone-maintenance-18b38.appspot.com",
  messagingSenderId: "881648450762",
  appId: "1:881648450762:web:b17fef83d6015c65a40833"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

let selectedCategory = null;

window.addEventListener("DOMContentLoaded", () => {
  const openAlertBtn = document.getElementById("openAlertBtn");
  const alertBox = document.getElementById("customAlert");
  const closeAlertBtn = document.getElementById("closeAlertBtn");
  const buyBtn = document.getElementById("buyBtn");

  openAlertBtn.addEventListener("click", (event) => {
    selectedCategory = event.target.dataset.category || event.currentTarget.dataset.category;
    alertBox.style.display = "flex";
  });
  window.addEventListener("DOMContentLoaded", () => {
  const openAlertBtn = document.getElementById("openAlertBtn2");
  const alertBox = document.getElementById("Alert4.5");
  const closeAlertBtn = document.getElementById("closeAlertBtn");
  const buyBtn = document.getElementById("buyBtn");

  openAlertBtn2.addEventListener("click", (event) => {
    selectedCategory = event.target.dataset.category || event.currentTarget.dataset.category;
    alertBox.style.display = "flex";
  });

  closeAlertBtn.addEventListener("click", () => {
    alertBox.style.display = "none";
  });

  buyBtn.addEventListener("click", async () => {
    if (!selectedCategory) {
      return alert("No category selected.");
    }

    const confirmBuy = confirm("Are you sure you want to buy this item?");
    if (!confirmBuy) return;

    const userId = localStorage.getItem("loggedUserId");
    if (!userId) return alert("Please log in to proceed.");

    await handlePurchase(userId, selectedCategory);
  });
});

async function handlePurchase(userId, category) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return alert("User not found.");

    const userData = userSnap.data();
    const balance = userData.balance || 0;

    if (balance < 800000) return alert("Insufficient balance.");

    const itemData = await getAvailableItem(userId, category);
    if (!itemData) return;

    const newBalance = balance - 800000;
    await updateDoc(userRef, { balance: newBalance });

    await saveTransaction(userId, itemData["item-code"], 800000, "purchase", balance, newBalance);

    window.location.href = `touch-buy.html?code=${encodeURIComponent(itemData["item-code"])}&category=${encodeURIComponent(category)}`;
  } catch (err) {
    alert("Error during purchase: " + err.message);
  }
}

async function getAvailableItem(userId, category) {
  const q = query(
    collection(db, "items"),
    where("selected", "==", false),
    where("category", "==", category),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    alert("Sold out.");
    return null;
  }

  const docData = snapshot.docs[0];
  await updateDoc(doc(db, "items", docData.id), {
    selected: true,
    selectedBy: userId
  });

  return docData.data();
}

async function saveTransaction(userId, code, amount, type, before, after) {
  const ref = doc(collection(db, "transactions"));
  await setDoc(ref, {
    transactionid: userId,
    secretcode: code,
    transaction_date: new Date().toISOString(),
    amount,
    transaction_type: type,
    balance_before: before,
    balance_after: after
  });
}
