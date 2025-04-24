// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const auth = getAuth();

// Helper function to format the date
function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Render individual transaction
function renderTransaction(tx) {
  const icon = tx.transaction_type === 'purchase' ? '🛒' : '💼';
  const color = tx.transaction_type === 'purchase' ? 'text-red-500' : 'text-green-500';
  const sign = tx.transaction_type === 'purchase' ? '-' : '+';

  // Create the transaction div as a clickable link
  const transactionLink = document.createElement('a');
  transactionLink.href = '#';  // Prevent actual navigation
  transactionLink.classList.add('block', 'bg-white', 'p-4', 'rounded-2xl', 'shadow', 'flex', 'justify-between', 'items-center');
  
  // Add the content inside the link
  transactionLink.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="text-2xl">${icon}</div>
      <div>
        <h3 class="font-semibold">Secret Code: ${tx.secretcode}</h3>
        <p class="text-sm text-gray-500">${formatDate(tx.transaction_date)} · ${tx.transaction_type}</p>
        <p class="text-xs text-gray-400">Balance: ${tx.balance_before} ➜ ${tx.balance_after}</p>
        <p class="text-xs text-gray-500">Category: ${tx.category_type}</p>
      </div>
    </div>
    <div class="${color} font-semibold">${sign} ${tx.amount.toLocaleString()}</div>
  `;

  // Add an event listener to open an alert with transaction details
  transactionLink.addEventListener('click', () => {
    alert(`
Transaction INFO:
Secret Code: ${tx.secretcode}
Date: ${formatDate(tx.transaction_date)}
Type: ${tx.transaction_type}
Balance Before: ${tx.balance_before}
Balance After: ${tx.balance_after}
Amount: ${sign} ${tx.amount.toLocaleString()}
Category: ${tx.category_type}`);
  });

  return transactionLink;
}

// Load transactions for the user
async function loadUserTransactions(userId, startDate = null, endDate = null) {
  const container = document.getElementById('transaction-list');
  const noTransactionsMessage = document.getElementById('no-transactions');
  container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  try {
    let q = query(
      collection(db, "transactions"),
      where("transactionid", "==", userId),
      orderBy("transaction_date", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<p class="text-gray-500">No transactions found for this user.</p>`;
      noTransactionsMessage.classList.remove('hidden');
      return;
    }

    let results = snapshot.docs.map(doc => doc.data());

    if (startDate) {
      const start = new Date(startDate);
      results = results.filter(tx => new Date(tx.transaction_date) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      results = results.filter(tx => new Date(tx.transaction_date) <= end);
    }

    if (results.length === 0) {
      container.innerHTML = `<p class="text-gray-500">No transactions match your filters.</p>`;
      noTransactionsMessage.classList.remove('hidden');
      return;
    }

    container.innerHTML = '';
    noTransactionsMessage.classList.add('hidden');

    results.forEach(tx => {
      container.appendChild(renderTransaction(tx));
    });

  } catch (err) {
    console.error("Error loading transactions:", err);
    container.innerHTML = `<p class="text-red-500">Failed to load transactions. Please try again later.</p>`;
    if (err.message.includes("The query requires an index")) {
      const indexUrl = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
      if (indexUrl) {
        container.innerHTML += `<p class="text-red-500">Firestore needs an index. <a href="${indexUrl}" target="_blank" class="underline">Click here to create it.</a></p>`;
      }
    }
  }
}

// Check if the user is logged in and load transactions
onAuthStateChanged(auth, (user) => {
  const status = document.getElementById('auth-status');
  if (user) {
    status.innerHTML = `<p class="text-green-500">Logged in as ${user.email}</p>`;
    loadUserTransactions(user.uid);

    // Filter transactions by date
    document.getElementById('filter-button').addEventListener('click', () => {
      const start = document.getElementById('start-date').value;
      const end = document.getElementById('end-date').value;
      loadUserTransactions(user.uid, start, end);
    });

  } else {
    status.innerHTML = `<p class="text-red-500">Not logged in. Please log in to view transactions.</p>`;
    document.getElementById('transaction-list').innerHTML = '';
    document.getElementById('no-transactions').classList.remove('hidden');
  }
});
