
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABzyt-uKLvHmWXtb5JA-LZZRVpVXXvnyk",
  authDomain: "unisphere-fb9b3.firebaseapp.com",
  projectId: "unisphere-fb9b3",
  storageBucket: "unisphere-fb9b3.appspot.com", // Corrected the storage bucket URL
  messagingSenderId: "816187663600",
  appId: "1:816187663600:web:b8126aff037ca3f8c78e35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
