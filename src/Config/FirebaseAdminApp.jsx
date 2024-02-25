import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBckxAp9_24tLxViaY6yX5BUln07nUk2sM",
  authDomain: "novartis-f3745.firebaseapp.com",
  projectId: "novartis-f3745",
  storageBucket: "novartis-f3745.appspot.com",
  messagingSenderId: "904353795718",
  appId: "1:904353795718:web:25f35b4c6c5f25688f8b07",
  measurementId: "G-2LMZXPR3L4",
};
const AdminApp = initializeApp(firebaseConfig, "Admin");
// const AdminDatabase = getFirestore(AdminApp);
export const AdminAuth = getAuth(AdminApp);
