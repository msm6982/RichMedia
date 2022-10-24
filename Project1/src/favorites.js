import "./haiku-card.js";
import * as storage from "./local-storage.js";
import * as firebase from "./community.js";


let listFavorites = null,
    cardsElement = null,
    cardsStatus = null
    ;


// Create Haiku Cards to show all the local favorites
const showFavorites = () =>{
    const favorites = storage.getFavorites();
    cardsStatus.innerHTML = (favorites.length > 0) ? "Displaying Favorites" : "No Favorites yet!";
    
    for (const f of favorites) {
        const newHaiku = document.createElement("haiku-card");
        newHaiku.dataset.line1 = f.line1;
        newHaiku.dataset.line2 = f.line2;
        newHaiku.dataset.line3 = f.line3;
        newHaiku.dataset.addedToFavorites = true;
        newHaiku.callback = (function() {
            //let dataObj = null;
            removeFromFavorites( {
                "line1" : newHaiku.dataset.line1,
                "line2" : newHaiku.dataset.line2,
                "line3" : newHaiku.dataset.line3,
            });
            newHaiku.callback = newHaiku.remove();
        }) ;
        
        cardsElement.appendChild(newHaiku);
    }
    
} 

// Callback function for when a favorite is removed, remove the card 
const removeFromFavorites = (haikuObj) => {
    
    firebase.pushLikedHaikusToCloud(haikuObj, -1);
    storage.removeFavorite(haikuObj);
    //console.log("removing from favorite");
    if (storage.getFavorites().length <= 0) cardsStatus.innerHTML = "All favorites cleared! Add some more!";
}

// Clear the locally favorited Haikus
const clearFavorites = () =>{
    const favorites = storage.getFavorites();
    cardsStatus.innerHTML = "Cleared Favorites";

    for (const f of favorites) {
        removeFromFavorites({ 
        "line1" : f.line1,
        "line2" : f.line2,
        "line3" : f.line3,
        });
    }
    cardsElement.innerHTML = "";
    storage.clearFavorites();
    //showFavorites();
}

// Init show the favorites on load
const init = () =>{
    cardsElement = document.querySelector("#element-card-holder");
    cardsStatus = document.querySelector("#element-status");
    showFavorites();

    document.querySelector("#clear-btn").onclick = () => {
        clearFavorites();
    }

    
    window.onfocus = () => {
        cardsElement.innerHTML = "";
        showFavorites();
       };
    
}

window.onload = init;