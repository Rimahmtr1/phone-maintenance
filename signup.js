// Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
        import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

        // Your web app's Firebase configuration
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
        const analytics = getAnalytics(app);
        const db = getFirestore(app);

 // Function to save data to Firestore
async function saveData(firstName, lastName, phone, email, password) {
    const messageDisplay = document.getElementById('messageDisplay');
    const clientID = await createClientID(); // Generate client ID

    try {
        await setDoc(doc(db, "signup", clientID), {
            email: email,
            pnumber: phone,
            password: password, // Storing plain text password
            Fname: firstName,
            Lname: lastName
        });
        messageDisplay.textContent = `Welcome, ${firstName} ${lastName}! Your sign-up was successful.`;
        messageDisplay.style.color = "green";
    } catch (error) {
        messageDisplay.textContent = "Error saving data. Please try again.";
        messageDisplay.style.color = "red";
        console.error("Error adding document: ", error);
    }
}

// Function to create a new client ID
async function createClientID() {
    const clientsCollection = await getDocs(collection(db, "signup"));
    const clientCount = clientsCollection.size + 1; // Count existing clients
    return `Client-${clientCount}`; // Generate ID in the format Client-ID
}

// Function to display a value from Firestore (if needed)
async function displayValue() {
    const docRef = doc(db, 'ph', 'ph1'); // Reference to the document
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const value = docSnap.data().number; // Access the 'number' field
            document.getElementById('valueDisplay').innerText = `Value from Firestore: ${value}`; // Display the value
        } else {
            document.getElementById('valueDisplay').innerText = "No such document!";
        }
    } catch (error) {
        document.getElementById('valueDisplay').innerText = `Error fetching document: ${error.message}`; // Display error message
    }
}

// Expose functions to window object
window.saveData = saveData;
window.displayValue = displayValue; // Expose if needed

// Event listener for form submission
document.getElementById('Signup').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('country-code').value + document.getElementById('phone').value; // Combine country code and phone
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    await saveData(firstName, lastName, phone, email, password); // Call saveData function
});

