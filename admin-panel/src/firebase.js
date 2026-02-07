// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCCfJ7S5x2hZNZtTJv0fsvNg-JONHLGTQs",
    authDomain: "login-with-anyone.firebaseapp.com",
    projectId: "login-with-anyone",
    storageBucket: "login-with-anyone.firebasestorage.app",
    messagingSenderId: "421547516120",
    appId: "1:421547516120:web:fff5a2abc8548a5c5137ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
