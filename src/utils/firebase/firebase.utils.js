import { initializeApp } from 'firebase/app'; // Import the functions you need from the SDKs you need
import { 
    getAuth, 
    signInWithRedirect, 
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword
} from 'firebase/auth'; // Import the functions you need for authentication

import {
    getFirestore, //instantiate our firestore instance
    doc, //retrieve documents inside of our firestore database and et a document instance
    getDoc, setDoc //to get and set data in the documents
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgpKKE0KhhAoEzawnZ-GS2_CrrLnTh4HE",
    authDomain: "crwn-clothing-db-f1793.firebaseapp.com",
    projectId: "crwn-clothing-db-f1793",
    storageBucket: "crwn-clothing-db-f1793.appspot.com",
    messagingSenderId: "280355490970",
    appId: "1:280355490970:web:0056fbc8acf5c99f2ae323"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  //Intialize Google Authentication
  const googleProvider = new GoogleAuthProvider();

  googleProvider.setCustomParameters({ //configuration google wants
    prompt: "select_account"
  });

  //auth keeps track of the authentication state of the entire application(as the users signs in through diffrent means and methods)
  export const auth = getAuth();

  //aynonimous functions that pass in google functions
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

  export const db = getFirestore(); //instantiate firestore

  //Async function that recieves some user authentication object
  //user authentication object is what we get back from our google signIn
  export const createUserDocumentFromAuth = async (
        userAuth, 
        additionalInformation = {}
    ) =>{
    if (!userAuth) return;

    //checking for an existing document reference
    // doc() takes 3 areguments : 1.the database 2.collections 3.an identifier that tells it waht it was
    const userDocRef = doc( db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    //if user data  does not exist
    //create/set the document with the data from userAuth in my collection
    if(!userSnapshot.exists()){
        // fields on the userAuth Object
        const{ displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            })
        }catch(error){
            console.log('error creating the user', error.message);
        }
    }

    //if user data exists
    //return userDocRef
    return userDocRef; 
  };

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await createUserWithEmailAndPassword(auth, email, password);

  }

  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;

    return await signInWithEmailAndPassword(auth, email, password);

  }