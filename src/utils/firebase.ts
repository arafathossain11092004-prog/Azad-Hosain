import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_u7WBOBR-jo1Egl-9RFgQO6w76KI7oYY",
  authDomain: "azadhosain-ac5eb.firebaseapp.com",
  databaseURL: "https://azadhosain-ac5eb-default-rtdb.firebaseio.com",
  projectId: "azadhosain-ac5eb",
  storageBucket: "azadhosain-ac5eb.firebasestorage.app",
  messagingSenderId: "355442376385",
  appId: "1:355442376385:web:07a3fecc41a6fda661de40",
  measurementId: "G-4SGLZGMP95"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
