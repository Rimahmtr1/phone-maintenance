// Firebase Modules
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Format date
function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Render transaction card
function renderTransaction(tx) {
    const icon = tx.transaction_type === 'purchase' ? '🛒' : '💼';
    const color = tx.transaction_type === 'purchase' ? 'text-red-500' : 'text-green-500';
    const sign = tx.transaction_type === 'purchase' ? '-' : '+';

    return `
      <div class="bg-white p-4 rounded-2xl shadow flex justify-between items-center">
        <div class="flex items-center gap-4">
          <div class="text-2xl">${icon}</div>
          <div>
            <h3 class="font-semibold">Secret Code: ${tx.secretcode}</h3>
            <p class="text-sm text-gray-500">${formatDate(tx.transaction_date)} · ${tx.transaction_type}</p>
            <p class="text-xs text-gray-400">Balance: ${tx.balance_before} ➜ ${tx.balance_after}</p>
          </div>
        </div>
        <div class="${color} font-semibold">${sign} ${tx.amount.toLocaleString()}</div>
      </div>
    `;
}

// Load and display all transactions
async function loadTransactions() {
    const container = document.getElementById('transaction-list');
    container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

    try {
        const txQuery = query(collection(db, "transactions"), orderBy("transaction_date", "desc"));
        const snapshot = await getDocs(txQuery);

        if (snapshot.empty) {
            container.innerHTML = `<p class="text-gray-500">No transactions found.</p>`;
            return;
        }

        let html = "";
        snapshot.forEach(doc => {
            const tx = doc.data();
            html += renderTransaction(tx);
        });

        container.innerHTML = html;
    } catch (err) {
        console.error("Failed to fetch transactions:", err);
        container.innerHTML = `<p class="text-red-500">Failed to load transactions.</p>`;
    }
}

// Run when DOM is ready
document.addEventListener("DOMContentLoaded", loadTransactions);
