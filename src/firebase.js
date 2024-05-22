// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyPTTWd7ajAda_LQH5o0eL3yq6358KBAc",
  authDomain: "nua-admin-dashboard-69fae.firebaseapp.com",
  projectId: "nua-admin-dashboard-69fae",
  storageBucket: "nua-admin-dashboard-69fae.appspot.com",
  messagingSenderId: "1013863834871",
  appId: "1:1013863834871:web:1ebcc2f4ca3dcc64991ff2",
  measurementId: "G-62JB8NGWCQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); // Remove "app" parameter

export { auth };