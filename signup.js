// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Firebase config
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
const auth = getAuth(app);

// Show message helper
function showMessage(message, divId) {
  const messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(() => {
    messageDiv.style.opacity = 0;
  }, 5000);
}

// Sign up button
const signUpButton = document.getElementById('submitSignUp');
signUpButton.addEventListener('click', async (event) => {
  event.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const phone = document.getElementById('country-code').value + document.getElementById('phone').value.trim();

  try {
    // ✅ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Create Firestore profile only after successful Auth
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      balance: 0
    };

    const userDocRef = doc(db, "users", user.uid);
    await setDoc(userDocRef, userData);

    showMessage("Account created successfully!", "signUpMessage");
    window.location.href = "login.html";

  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific Firebase Auth errors
    switch (error.code) {
      case "auth/email-already-in-use":
        showMessage("Email is already in use!", "signUpMessage");
        break;
      case "auth/invalid-email":
        showMessage("Invalid email format!", "signUpMessage");
        break;
      case "auth/weak-password":
        showMessage("Password is too weak!", "signUpMessage");
        break;
      default:
        showMessage("Error creating account: " + error.message, "signUpMessage");
    }
  }
});
