// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBAMDAGYHNMtPaXAwJl-BRvxvl37E7Z3xE",
  authDomain: "engr-enes100tool-inv-firebase.firebaseapp.com",
  databaseURL: "https://engr-enes100tool-inv-firebase-velma.firebaseio.com",
  projectId: "engr-enes100tool-inv-firebase",
  storageBucket: "engr-enes100tool-inv-firebase.appspot.com",
  messagingSenderId: "763916402491",
  appId: "1:763916402491:web:e598de3c258f7d4faa811e"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const database = getDatabase(app);

// Export both the app and database instances for use in other files
export { app, database };