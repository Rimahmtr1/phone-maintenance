import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

function getTransactionDetails(transactionId, categoryType) {
  const transactionRef = doc(db, "transactions", transactionId);
  getDoc(transactionRef).then(docSnap => {
    if (docSnap.exists()) {
      const tx = docSnap.data();
      displayTransaction(tx);
    } else {
      document.getElementById('transaction-details').innerHTML = `<p class="text-red-500">Transaction not found.</p>`;
    }
  });
}

function displayTransaction(tx) {
  document.getElementById('loading').style.display = 'none';

  const transactionDetails = `
    <div>
      <h3 class="font-semibold">Transaction Type: ${tx.transaction_type}</h3>
      <p>Transaction Date: ${new Date(tx.transaction_date).toLocaleString()}</p>
      <p>Category: ${tx.category_type}</p>
      <p>Amount: ${tx.amount.toLocaleString()}</p>
      <p>Balance Before: ${tx.balance_before}</p>
      <p>Balance After: ${tx.balance_after}</p>
      <p>Secret Code: ${tx.secretcode}</p>
    </div>
  `;
  document.getElementById('transaction-details').innerHTML += transactionDetails;
}

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get('transactionid');
  const categoryType = params.get('category_type');
  
  if (transactionId && categoryType) {
    getTransactionDetails(transactionId, categoryType);
  } else {
    document.getElementById('transaction-details').innerHTML = `<p class="text-red-500">Invalid transaction data.</p>`;
  }
};
