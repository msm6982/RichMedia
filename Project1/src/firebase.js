import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment } from  "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGWFerbKKqhsy-MRa1eMFf_vDEPN2vvIM",
    authDomain: "haiku-community.firebaseapp.com",
    projectId: "haiku-community",
    storageBucket: "haiku-community.appspot.com",
    messagingSenderId: "117993334428",
    appId: "1:117993334428:web:6a8c1f2e7ac68ed2ceef59"
};

const likedHaikuPath = "liked-haikus/";

const pushLikedHaikusToCloud = haiku => {
  const db = getDatabase();
  // Have the firebase reference be the first line of the poem 
  const favRef = ref(db, `${likedHaikuPath}${haiku.line1.replace("/", "")}`);
  console.log(favRef);
  set(favRef, {
    haiku,
    likes: increment(1)
  }); // `dog` is an object with `.title`, `.url`, `.likes` properties etc
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const db = getDatabase();

export {db,likedHaikuPath as likedHaikuPath,ref,set,push,pushLikedHaikusToCloud as pushLikedHaikusToCloud,onValue};