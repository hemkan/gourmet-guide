import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6IVtYBgoUEfXq7e_tF9G4bRQLEA6VwN4",
  authDomain: "customer-support-2165c.firebaseapp.com",
  projectId: "customer-support-2165c",
  storageBucket: "customer-support-2165c.appspot.com",
  messagingSenderId: "672648123804",
  appId: "1:672648123804:web:1a5360712ae33d9443a459",
  measurementId: "G-WK0SMQF2EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();


export { auth, googleProvider, githubProvider}