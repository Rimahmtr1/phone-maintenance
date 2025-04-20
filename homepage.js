import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js";
import { getAuth,onAuthStateChange, signOut} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, getDoc,doc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-Firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCJsJsuMx1LT6SXZcCqdHa5wkueqXTTT4Q",
    authDomain: "phone-maintenance-18b38.firebaseapp.com",
    projectId: "phone-maintenance-18b38",
    storageBucket: "phone-maintenance-18b38.firebasestorage.app",
    messagingSenderId: "881648450762",
    appId: "1:881648450762:web:b17fef83d6015c65a40833",
    measurementId: "G-0MD0GJJ0E2"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth=getAuth();
  const db=getFirestore();
  onAuthStateChange(auth,(user)=>{
    const loggedUserId=localStorage.getItem('loggedInUserId');
    if(loggedUserId){
        const docRef=doc(db,"users", loggedUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if((docSnap.exits())){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserLName').innerText=userData.lirstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                
            }
            else{
                console.log("no document found matching id ");
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else
    {
        console.log("User ID not found in local storage");
    }
  })