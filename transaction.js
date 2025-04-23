// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase Initialization
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

// Function to format dates
function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Function to render each transaction
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

async function loadUserTransactions(userId) {
    const container = document.getElementById('transaction-list');
    const noTransactionsMessage = document.getElementById('no-transactions');

    container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

    try {
        // Query Firestore for transactions where transactionid matches userId
        const q = query(
            collection(db, "transactions"),
            where("transactionid", "==", userId), // Match the user's ID with the transaction ID
            orderBy("transaction_date", "desc")   // Order by transaction date, latest first
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            container.innerHTML = `<p class="text-gray-500">No transactions found for this user.</p>`;
            noTransactionsMessage.classList.remove('hidden');  // Show message if no transactions
            return;
        }

        container.innerHTML = '';  // Clear loading message
        noTransactionsMessage.classList.add('hidden');  // Hide message if transactions exist

        snapshot.forEach(doc => {
            const tx = doc.data();
            const html = renderTransaction(tx);
            container.innerHTML += html; // Append transaction to list
        });
    } catch (err) {
        console.error("Error loading transactions:", err);
        container.innerHTML = `<p class="text-red-500">Failed to load transactions. Please try again later.</p>`;
        // If it's a query index error, print more specific information
        if (err.message.includes("The query requires an index")) {
            container.innerHTML += `<p class="text-red-500">It seems like Firestore needs an index for this query. You can create it by following this link: <a href="${err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/)}" target="_blank" class="underline">Create Index</a></p>`;
        }
    }
}

// Check if the user is logged in and load their transactions
onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;  // Get the logged-in user's UID
        document.getElementById('auth-status').innerHTML = `<p class="text-green-500">Logged in as ${user.email}</p>`;
        loadUserTransactions(userId);  // Load transactions for the logged-in user
    } else {
        document.getElementById('auth-status').innerHTML = `<p class="text-red-500">Not logged in. Please log in to view transactions.</p>`;
        document.getElementById('transaction-list').innerHTML = ''; // Clear transactions if not logged in
        document.getElementById('no-transactions').classList.add('hidden');
    }
});
