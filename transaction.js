import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase Config
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

// Format ISO date
function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Load and render transactions
async function loadTransactions() {
  const container = document.getElementById('transaction-list');
  const template = document.getElementById('transaction-template');

  container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  try {
    const q = query(collection(db, "transactions"), orderBy("transaction_date", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<p class="text-gray-500">No transactions found.</p>`;
      return;
    }

    container.innerHTML = ''; // Clear loading text

    snapshot.forEach(doc => {
      const tx = doc.data();
      const clone = template.content.cloneNode(true);

      // Fill data
      clone.querySelector('.icon').textContent = tx.transaction_type === 'purchase' ? '🛒' : '💼';
      clone.querySelector('.code').textContent = `Secret Code: ${tx.secretcode}`;
      clone.querySelector('.date-type').textContent = `${formatDate(tx.transaction_date)} · ${tx.transaction_type}`;
      clone.querySelector('.balance-change').textContent = `Balance: ${tx.balance_before} ➜ ${tx.balance_after}`;
      clone.querySelector('.amount').textContent = `${tx.transaction_type === 'purchase' ? '-' : '+'} ${tx.amount.toLocaleString()}`;
      clone.querySelector('.amount').classList.add(
        tx.transaction_type === 'purchase' ? 'text-red-500' : 'text-green-500'
      );

      container.appendChild(clone);
    });

  } catch (err) {
    console.error("Error loading transactions:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load transactions.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadTransactions);
