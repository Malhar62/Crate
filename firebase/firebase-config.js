import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD2lRxLtubzxXtw-g9Gmawa7W9YfhnvM_A",
    authDomain: "saga-333613.firebaseapp.com",
    projectId: "saga-333613",
    storageBucket: "saga-333613.appspot.com",
    messagingSenderId: "355753409164",
    appId: "1:355753409164:web:d72cc487762659a8a4d9a9",
    measurementId: "G-W6WSSVX0GG"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);