import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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
const auth = getAuth();

// Format ISO date
function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Render individual transaction
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

// Load transactions for the signed-in user
async function loadUserTransactions(userId) {
    const container = document.getElementById('transaction-list');
    const template = document.getElementById('transaction-template');

    container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

    try {
        const q = query(
            collection(db, "transactions"),
            where("transactionid", "==", userId), // Fetch transactions where transactionid matches userId
            orderBy("transaction_date", "desc")
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = `<p class="text-gray-500">No transactions found.</p>`;
            return;
        }

        container.innerHTML = ''; // Clear loading text

        snapshot.forEach(doc => {
            const tx = doc.data();
            const html = renderTransaction(tx);
            container.innerHTML += html;
        });

    } catch (err) {
        console.error("Error loading transactions:", err);
        container.innerHTML = `<p class="text-red-500">Failed to load transactions.</p>`;
    }
}

// Check if user is logged in and load transactions
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        loadUserTransactions(userId);  // Load transactions only for the logged-in user
    } else {
        // If no user is logged in, display a message
        document.getElementById('transaction-list').innerHTML = '<p class="text-gray-500">Please log in to see your transactions.</p>';
    }
});
