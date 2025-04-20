// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, setDoc, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";



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

function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;

    },5000);
}
const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const firstName=document.getElementById('first-name').value;
    const lastName=document.getElementById('last-name').value;
    const auth=getAuth();
    const db=getFirestore();
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName:firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully','signUpMessage')
        const docRef=doc(db,"users" , user.uid);
        setDoc(docRef, userData)
        .then(()=>{
            Window.location.href="index.html";

        })
        .catch((error)=>{
            console.error("error writing document",error);
        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use')
        {
            showMessage('Email Address Already Exits!!!','signUpMessage');
        }
        else
        {
            showMessage('unable to create user','signUpMessage');
        }
    })
});
const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click',(event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedUserId',user.uid);
        window.location.href="homepage.html";
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrecr Email or Password',signInMessage);
        }
        else{
            showMessage('Account does not Exits','signInMessage');
        }
    })
})

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

// Function to save data to Firestore
async function saveData(firstName, lastName, phone, email, password) {
   const clientID = await generateClientID();
const messageDisplay = document.getElementById('messageDisplay');
try {
await setDoc(doc(db, "signup", clientID), {
    Fname: firstName,
    Lname: lastName,
    pnumber: phone,
    email: email,
    password: password // Note: Store hashed password instead of plain text
});
messageDisplay.textContent = `Welcome, ${firstName} ${lastName}! Your sign-up was successful.`;
messageDisplay.style.color = "green";
} catch (error) {
messageDisplay.textContent = "Error saving data. Please try again.";
messageDisplay.style.color = "red";
console.error("Error adding document: ", error);
}
}
async function generateClientID() {
    const clientsCollection = await getDocs(collection(db, "signup"));
    let maxID = 0;

    // Find the highest existing Client ID
    clientsCollection.forEach((doc) => {
        const id = parseInt(doc.id.split('-')[1]); // Extract the number from Client-ID
        if (id > maxID) {
            maxID = id;
        }
    });

    return `Client-${maxID + 1}`; // Increment the highest ID by 1
}
// Function to display an error message
function dis() {
document.getElementById('put').innerText = `Error fetching document:`; // Display error message
}

// Expose functions to window object
window.displayValue = displayValue;
window.dis = dis;
window.saveData = saveData;

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

