import firebase from "firebase"


const firebaseConfig = firebase.initializeApp( {
    apiKey: "AIzaSyDqXDksy9QGY7dv52Pf_957AiveiEpff-s",
    authDomain: "instagram-clone-761ec.firebaseapp.com",
    projectId: "instagram-clone-761ec",
    storageBucket: "instagram-clone-761ec.appspot.com",
    messagingSenderId: "136706128381",
    appId: "1:136706128381:web:5d44995a52c9708d48c194"
  });


  
  const db = firebase.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();
  export {db,auth,storage};
  export default firebaseConfig;