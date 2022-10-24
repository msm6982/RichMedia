import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, set, push, onValue, increment, get, remove } from  "https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js";

import "./haiku-card.js";
import * as storage from "./local-storage.js";


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

// Pushing Haiku data to the firebase clod and incrementing it by set value
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
  });
};

// Helper fuction that is called to toggle favoriting and unfavoriting
const addToCommunity = (haikuObj) => {

    if(haikuObj.addedToFavorites == 'true')
    {
        storage.addFavorite(haikuObj);
        pushLikedHaikusToCloud(haikuObj, 1);
        console.log("adding to favorite");
    }
    else
    {
        storage.removeFavorite(haikuObj);
        pushLikedHaikusToCloud(haikuObj, -1);
        console.log("removing from favorite");
    }

}


let communityCard = null,
    cardsStatus = null;

// Initialize, spawn Haiku cards on load
const init = () =>
{
  const db = getDatabase();
  const favoritesRef = ref(db, `${likedHaikuPath}`);

  communityCard = document.querySelector("#community-card-holder");
  if(communityCard == null) return;
  cardsStatus = document.querySelector("#element-status");
  cardsStatus.innerHTML = "Loading Community ..."
  communityCard.innerHTML = "";

  //onValue(favoritesRef, readAllFavorites);


  get(favoritesRef).then(haikuData => 
  {
    let fireValue = haikuData.val();
    console.log(fireValue);

    // Get keys
    const keys = Object.keys(fireValue);

    // Filter and sort the keys by ones that have one ore more likes
    let filteredKeys = keys.filter(haiku => fireValue[haiku].likes >= 1);
    if(filteredKeys.length == 0) {cardsStatus.innerHTML = "Community is Empty"; return;}
    //const sortAge = (a, b) => a[a.].likes - b[b].likes ;
    //filteredKeys.sort(sortAge);
    
    filteredKeys.forEach(haiku => 
    {
      let foundHaiku = fireValue[haiku];

      if(foundHaiku.likes >= 1)
      {
        const newHaiku = document.createElement("haiku-card");
            newHaiku.dataset.line1 = foundHaiku.line1;
            newHaiku.dataset.line2 = foundHaiku.line2;
            newHaiku.dataset.line3 = foundHaiku.line3;
            newHaiku.dataset.likes = foundHaiku.likes;
            const haikuObj = { "line1" : foundHaiku.line1,
            "line2" : foundHaiku.line2,
            "line3" : foundHaiku.line3,
             };
            newHaiku.dataset.addedToFavorites = storage.findHaikuInFav(haikuObj);
            newHaiku.callback = addToCommunity;
            communityCard.appendChild(newHaiku);
      }
      // Remove if there are no like, not implmented
      else
      {
        //var adaRef = db.ref(`${likedHaikuPath}${haiku}`);
        //adaRef.remove()
      }
    });
    cardsStatus.innerHTML = "Community Favorite Haikus!";
  });
}

window.onload = init();

export {likedHaikuPath as likedHaikuPath,ref,set,get,push,pushLikedHaikusToCloud as pushLikedHaikusToCloud,onValue, remove};
//onValue(scoresRef,scoresChanged);

// Initialize Firebase

/*
const readAllFavorites = (snapshot) =>
{
  firebaseHaikus.length = 0;
  /*
  const db = getDatabase();
  const favoritesRef = ref(db, `${likedHaikuPath}`);
  //console.log(favoritesRef);
  
  get(favoritesRef).then(haikuData => {
    haikuData.forEach((haiku) => {
      if(haiku.val().likes >= 1)
      {
        //console.log(`Key ${haiku.key} and Likes ${haiku.val().likes}`);
        allFavorites.push({
          line1 : haiku.val().line1,
          line2 : haiku.val().line2,
          line3 : haiku.val().line3,
          likes : haiku.val().likes
        });
      }
      else
      {
        //var adaRef = getdatabase().ref(`${likedHaikuPath}${haiku.key}`);
        //adaRef.remove()
      }
    });
    
  });
  
  snapshot.forEach((haiku) => {
    if(haiku.val().likes >= 1)
      {
        //console.log(`Key ${haiku.key} and Likes ${haiku.val().likes}`);
        firebaseHaikus.push({
          line1 : haiku.val().line1,
          line2 : haiku.val().line2,
          line3 : haiku.val().line3,
          likes : haiku.val().likes
        });
      }
      else
      {
        //var adaRef = getdatabase().ref(`${likedHaikuPath}${haiku.key}`);
        //adaRef.remove()
      }
    });

    
}

const showCommunity = (e) => {
        get(favoritesRef).then(haikuData => 
            {
              let fireValue = haikuData.val();
              console.log(fireValue)
              //onsole.log(fireValue.join(","));
              const keys = Object.keys(fireValue);
              console.log(keys);
              f.forEach(haiku => 
              {
                console.log("cool");
                if(haiku.val().likes >= 1)
                {
                  console.log(`Key ${haiku.key} and Likes ${haiku.val().likes}`);
            
                }
                else
                {
                  //var adaRef = getdatabase().ref(`${likedHaikuPath}${haiku.key}`);
                  //adaRef.remove()
                }
              });
            });


        //firebase.trigger("onValue");
        let favorites = firebase.getFirebasFav();
        console.log(favorites + " faves");
        cardsStatus.innerHTML = (favorites.length > 0) ? "Displaying Community" : "Nobody has favorited anything!";
        listCommunity = [];


        for (const f of favorites) {
            listCommunity.push(f);
            const newHaiku = document.createElement("haiku-card");
            newHaiku.dataset.line1 = f.line1;
            newHaiku.dataset.line2 = f.line2;
            newHaiku.dataset.line3 = f.line3;
            newHaiku.dataset.addedToFavorites = true;
            const haikuObj = { "line1" : f.line1,
            "line2" : f.line2,
            "line3" : f.line3};
            newHaiku.dataset.addedToFavorites = storage.findHaikuInFav(haikuObj);
            newHaiku.callback = addToCommunity;
            
            favCardsElement.appendChild(newHaiku);
        }
        
    } 
*/



