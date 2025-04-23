// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Initialize Firebase
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

// Helper to format dates
function formatDate(iso) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Render individual transaction
function renderTransaction(tx) {
    const icon = tx.transaction_type === 'purchase' ? '🛒' : '💼';
    const color = tx.transaction_type === 'purchase' ? 'text-red-500' : 'text-green-500';
    const sign = tx.transaction_type === 'purchase' ? '-' : '+';

    return `
        <div class="bg-white p-4 rounded-2xl shadow flex justify-between items-start">
            <div class="flex gap-4">
                <div class="text-3xl pt-1">${icon}</div>
                <div>
                    <h3 class="text-lg font-semibold">Secret Code: ${tx.secretcode || 'N/A'}</h3>
                    <p class="text-sm text-gray-700"><strong>Date:</strong> ${formatDate(tx.transaction_date)}</p>
                    <p class="text-sm text-gray-700"><strong>Type:</strong> ${tx.transaction_type}</p>
                    <p class="text-xs text-gray-400">Balance: ${tx.balance_before} ➜ ${tx.balance_after}</p>
                </div>
            </div>
            <div class="${color} font-semibold text-lg">${sign} ${tx.amount.toLocaleString()}</div>
        </div>
    `;
}

// Load all user transactions from Firestore
async function loadUserTransactions(userId) {
    const container = document.getElementById('transaction-list');
    const noTransactionsMessage = document.getElementById('no-transactions');
    container.innerHTML = `<p class="text-gray-400">Loading...</p>`;

    try {
        const q = query(
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

        container.innerHTML = '';
        noTransactionsMessage.classList.add('hidden');

        snapshot.forEach(doc => {
            const tx = doc.data();
            container.innerHTML += renderTransaction(tx);
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

// Auth state listener
onAuthStateChanged(auth, (user) => {
    const status = document.getElementById('auth-status');
    if (user) {
        status.innerHTML = `<p class="text-green-500">Logged in as ${user.email}</p>`;
        loadUserTransactions(user.uid);
    } else {
        status.innerHTML = `<p class="text-red-500">Not logged in. Please log in to view transactions.</p>`;
        document.getElementById('transaction-list').innerHTML = '';
        document.getElementById('no-transactions').classList.remove('hidden');
    }
});
