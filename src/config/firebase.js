import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBbjyE_iOR5HSlOvw9hY6fpb5-MiYzdZqI",
  authDomain: "chat-bot-e978e.firebaseapp.com",
  databaseURL: "https://chat-bot-e978e-default-rtdb.firebaseio.com",
};

firebase.initializeApp(firebaseConfig);
export default firebase;