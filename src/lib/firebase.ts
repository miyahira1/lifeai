import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFSHPBthfIJMipgNHr0LuIixzPdNhbAmI",
    authDomain: "lifeai-f305e.firebaseapp.com",
    projectId: "lifeai-f305e",
    storageBucket: "lifeai-f305e.firebasestorage.app",
    messagingSenderId: "994833105188",
    appId: "1:994833105188:web:476cc61329a3c0d68373b1",
    measurementId: "G-C04BXGDDCD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export { analytics };
