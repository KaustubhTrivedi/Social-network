import firebase from "firebase"


const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAP_K6-MXoOqulkKemKzxw03SdE20pZD-Y",
  authDomain: "social-59f2f.firebaseapp.com",
  projectId: "social-59f2f",
  // gs://social-59f2f.appspot.com
  storageBucket: "social-59f2f.appspot.com",
  messagingSenderId: "244973617294",
  appId: "1:244973617294:web:9f94aedf45a37c0a0c49df"
});



const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { db, auth, storage };
export default firebaseConfig;