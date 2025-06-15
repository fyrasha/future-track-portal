
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Follow these steps to get your Firebase config:
// 1. Go to the Firebase console (https://console.firebase.google.com/).
// 2. Select your project (or create a new one).
// 3. In the project overview, click the "</>" icon to "Add an app" and choose "Web".
// 4. Register your app, and Firebase will provide you with a `firebaseConfig` object.
// 5. Copy the values from that object and paste them here.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
