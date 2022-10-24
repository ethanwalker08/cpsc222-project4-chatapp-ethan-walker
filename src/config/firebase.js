import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "#{APIKEY}",
  authDomain: "#{DOMAIN}",
  projectId: "#{PROJECT_ID}",
  storageBucket: "#{BUCKET}",
  messagingSenderId: "#{SENDER_ID}",
  appId: "#{APP_ID}"
};

firebase.initializeApp(firebaseConfig);
export default firebase;
