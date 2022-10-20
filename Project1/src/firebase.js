import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment, get } from  "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGWFerbKKqhsy-MRa1eMFf_vDEPN2vvIM",
    authDomain: "haiku-community.firebaseapp.com",
    projectId: "haiku-community",
    storageBucket: "haiku-community.appspot.com",
    messagingSenderId: "117993334428",
    appId: "1:117993334428:web:6a8c1f2e7ac68ed2ceef59"
};

const app = initializeApp(firebaseConfig);
//console.log(app);

const likedHaikuPath = "liked-haikus/";

const pushLikedHaikusToCloud = (haiku,incrementVal) => {
  const db = getDatabase();
  // Have the firebase reference be the first line of the poem 
  const favRef = ref(db, `${likedHaikuPath}${haiku.line1.replace("/", "")}`);
  //console.log(favRef);
  set(favRef, {
    line1 : haiku.line1,
    line2 : haiku.line2,
    line3 : haiku.line3,
    likes: increment(incrementVal)
  }); // `dog` is an object with `.title`, `.url`, `.likes` properties etc
};

const favoritesChanged = (snapshot) => {
  //const db = getDatabase();
  //const haikusRef = await getDocs(collection(db,`${likedHaikuPath}`))
  //const haikusRef = query(collection(db,"liked-haikus"), where);

  //console.log(snapshot);

  snapshot.forEach((haiku) => {
  //console.log(`Key ${haiku.key} and Likes ${haiku.val().likes}`)
  });
}

const init = () =>
{
  const db = getDatabase();
  const favoritesRef = ref(db, `${likedHaikuPath}`);
  onValue(favoritesRef,favoritesChanged);
}

init();
//onValue(scoresRef,scoresChanged);

// Initialize Firebase




export {likedHaikuPath as likedHaikuPath,ref,set,get,push,pushLikedHaikusToCloud as pushLikedHaikusToCloud,onValue};