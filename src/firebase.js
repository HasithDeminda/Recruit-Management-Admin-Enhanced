// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCGvpxqGfhvqXSAwCZSdb5o6BbpRlg-HE",
  authDomain: "recruiters-64229.firebaseapp.com",
  projectId: "recruiters-64229",
  storageBucket: "recruiters-64229.appspot.com",
  messagingSenderId: "122065097780",
  appId: "1:122065097780:web:14b96ae4476d6544f7e661",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const storageNew = "gs://research-management-syst-51836.appspot.com";

export default app;
