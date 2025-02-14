import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,  // ✅ Import updateDoc
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAPXMVVVHUtadmEPvXJLk4Mr1tPeOBK2cI",
    authDomain: "lets-go-gambling-incorporated.firebaseapp.com",
    projectId: "lets-go-gambling-incorporated",
    storageBucket: "lets-go-gambling-incorporated.firebasestorage.app",
    messagingSenderId: "351332924647",
    appId: "1:351332924647:web:53717055ce33f75ca2b642",
    measurementId: "G-KP9034ETJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs };
