import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAsKkBPQTGk-eyiaqMBkNh3XpLBkI9nw4",
  authDomain: "cpsc222-project4.firebaseapp.com",
  projectId: "cpsc222-project4",
  storageBucket: "cpsc222-project4.appspot.com",
  messagingSenderId: "282983387502",
  appId: "1:282983387502:web:2df273d5c74f021c25317f"
};

firebase.initializeApp(firebaseConfig);
export default firebase;