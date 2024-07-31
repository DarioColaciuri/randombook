import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAAmSe30WJWyR-KIwBQ30wMbjES8QC6M8g",
    authDomain: "randombook-14445.firebaseapp.com",
    projectId: "randombook-14445",
    storageBucket: "randombook-14445.appspot.com",
    messagingSenderId: "870003335669",
    appId: "1:870003335669:web:2d94c3e3e4bbd15b0f80bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };