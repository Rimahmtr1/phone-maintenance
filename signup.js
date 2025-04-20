// Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
        import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

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

 // Function to display a value from Firestore
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

        // Function to display an error message
        function dis() {
            document.getElementById('put').innerText = `Error fetching document:`; // Display error message
        }

        // Expose functions to window object
        window.displayValue = displayValue;
        window.dis = dis;
        document.getElementById('Signup').addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('first-name').value;
            await saveData(firstName); // Call saveData function
        });

        // Save first name to Firestore
        try {
            await setDoc(doc(db, "signup", "Client"), {
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
