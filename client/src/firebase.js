import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  //FacebookAuthProvider 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAsCrsQI2ZklM7zXkKV93pJai-EQ51LpAs",
  authDomain: "nemmoh-ecommerce.firebaseapp.com",
  projectId: "nemmoh-ecommerce",
  storageBucket: "nemmoh-ecommerce.appspot.com",
  messagingSenderId: "394191972626",
  appId: "1:394191972626:web:a8af2e06fc405f928e6bcb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Add provider exports
export const googleProvider = new GoogleAuthProvider();
//export const facebookProvider = new FacebookAuthProvider();