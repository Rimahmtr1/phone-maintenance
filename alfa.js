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
let selectedPrice = 0;

window.addEventListener("DOMContentLoaded", () => {
  const openAlertBtn1 = document.getElementById("openAlertBtn");
  const openAlertBtn2 = document.getElementById("openAlertBtn2");
  const alertBox1 = document.getElementById("customAlert");
  const alertBox2 = document.getElementById("Alert4.5");
  const closeAlertBtn1 = document.getElementById("closeAlertBtn1");
  const closeAlertBtn2 = document.getElementById("closeAlertBtn2");
  const buyBtn1 = document.getElementById("buyBtn1");
  const buyBtn2 = document.getElementById("buyBtn2");

  openAlertBtn1?.addEventListener("click", (event) => {
    selectedCategory = event.currentTarget.dataset.category;
    selectedPrice = 800000;
    alertBox1.style.display = "flex";
  });

  openAlertBtn2?.addEventListener("click", (event) => {
    selectedCategory = event.currentTarget.dataset.category;
    selectedPrice = 500000;
    alertBox2.style.display = "flex";
  });

  closeAlertBtn1?.addEventListener("click", () => {
    alertBox1.style.display = "none";
  });

  closeAlertBtn2?.addEventListener("click", () => {
    alertBox2.style.display = "none";
  });

  buyBtn1?.addEventListener("click", () => handleBuy());
  buyBtn2?.addEventListener("click", () => handleBuy());
});

async function handleBuy() {
  if (!selectedCategory || !selectedPrice) {
    return alert("No category selected.");
  }

  const confirmBuy = confirm("Are you sure you want to buy this item?");
  if (!confirmBuy) return;

  const userId = localStorage.getItem("loggedUserId");
  if (!userId) return alert("Please log in to proceed.");

  await handlePurchase(userId, selectedCategory, selectedPrice);
}

async function handlePurchase(userId, category, price) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return alert("User not found.");

    const userData = userSnap.data();
    const balance = userData.balance || 0;

    if (balance < price) return alert("Insufficient balance.");

    const itemData = await getAvailableItem(userId, category);
    if (!itemData) return;

    const newBalance = balance - price;
    await updateDoc(userRef, { balance: newBalance });

    await saveTransaction(
      userId,
      itemData["item-code"],
      price,
      "purchase",
      balance,
      newBalance,
      category // ✅ added category as category_type
    );

    window.location.href = `alfa-buy.html?code=${encodeURIComponent(itemData["item-code"])}&category=${encodeURIComponent(category)}`;
  } catch (err) {
    alert("Error during purchase: " + err.message);
  }
}

async function getAvailableItem(userId, category) {
  const q = query(
    collection(db, "items-alfa"),
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
  await updateDoc(doc(db, "items-alfa", docData.id), {
    selected: true,
    selectedBy: userId
  });

  return docData.data();
}

async function saveTransaction(userId, code, amount, type, before, after, category) {
  console.log("Saving transaction with category_type:", category); // ✅ check if value exists

  const ref = doc(collection(db, "transactions"));
  await setDoc(ref, {
    transactionid: userId,
    secretcode: code,
    transaction_date: new Date().toISOString(),
    amount,
    transaction_type: type,
    balance_before: before,
    balance_after: after,
    category_type: category
  });
}

