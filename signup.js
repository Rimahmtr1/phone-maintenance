// Import Firebase functions (if you're using modules, otherwise ensure they're included in your HTML)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('c-password');
    const signupForm = document.getElementById('Signup');
    const messageDisplay = document.createElement('p');
    signupForm.appendChild(messageDisplay); // Append message display to the form

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
        toggleConfirmPassword.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Clear previous messages
        messageDisplay.textContent = '';

        // Validation
        const namePattern = /^[A-Za-z]{3,}$/; // At least 3 letters, only letters allowed

        if (!namePattern.test(firstName)) {
            messageDisplay.textContent = "First name must be at least 3 letters and contain only letters.";
            messageDisplay.style.color = "red";
            return;
        }

        if (!namePattern.test(lastName)) {
            messageDisplay.textContent = "Last name must be at least 3 letters and contain only letters.";
            messageDisplay.style.color = "red";
            return;
        }

        // Validate phone number
        const phonePattern = /^(76|70|71|81|03|79|78)\d{6}$/;
        if (!phonePattern.test(phone)) {
            messageDisplay.textContent = "Phone number must be 8 digits and start with 76, 70, 71, 81, 03, 79, or 78.";
            messageDisplay.style.color = "red";
            return;
        }

        // Validate email
        if (!/\S+@\S+\.\S+/.test(email)) {
            messageDisplay.textContent = "Please enter a valid email address.";
            messageDisplay.style.color = "red";
            return;
        }

        // Validate password length
        if (password.length < 6) {
            messageDisplay.textContent = "Password must be at least 6 characters long.";
            messageDisplay.style.color = "red";
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            messageDisplay.textContent = "Passwords do not match!";
            messageDisplay.style.color = "red";
            return;
        }

        // Save first name to Firestore
        try {
            await setDoc(doc(db, "signup", "Client-1"), {
                Fname: firstName
            });
            messageDisplay.textContent = `Welcome, ${firstName}! Your sign-up was successful.`;
            messageDisplay.style.color = "green";
        } catch (error) {
            messageDisplay.textContent = "Error saving data. Please try again.";
            messageDisplay.style.color = "red";
            console.error("Error adding document: ", error);
        }

        // Reset form
        signupForm.reset();
    });
});
