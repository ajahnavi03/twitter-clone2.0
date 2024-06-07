import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyB8Ws2sDizikl2AOTXHYiGEDIsWjNh5iwI",
  authDomain: "twitter-clone-version-2-a40d5.firebaseapp.com",
  projectId: "twitter-clone-version-2-a40d5",
  storageBucket: "twitter-clone-version-2-a40d5.appspot.com",
  messagingSenderId: "535244107916",
  appId: "1:535244107916:web:78686fc4418670bad00ba9",
  measurementId: "G-GHSLD4H64Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
