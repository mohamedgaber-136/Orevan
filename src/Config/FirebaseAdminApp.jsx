import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCVvf3gBWoTTvErXwWNbeWWW8aLfx9S5Ag",
  authDomain: "orevanreg.firebaseapp.com",
  databaseURL: "https://orevanreg.firebaseio.com",
  projectId: "orevanreg",
  storageBucket: "orevanreg.appspot.com",
  messagingSenderId: "882583903364",
  appId: "1:882583903364:web:1d5c38ff461bb5f4e0f6d1",
  measurementId: "G-FRHV1QQFS9"
};
const AdminApp = initializeApp(firebaseConfig, "Admin");
// const AdminDatabase = getFirestore(AdminApp);
export const AdminAuth = getAuth(AdminApp);
