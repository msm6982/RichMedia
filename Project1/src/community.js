import "./haiku-card.js";
import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";

let listFavorites = null,
    cardsElement = null;


const showFavorites = () =>{
    const favorites = storage.getFavorites();
    document.querySelector("#element-status").innerHTML = (favorites.length > 0) ? "Displaying Favorites" : "No Favorites yet!";
    
    for (const f of favorites) {
        const newHaiku = document.createElement("haiku-card");
        newHaiku.dataset.line1 = f.line1;
        newHaiku.dataset.line2 = f.line2;
        newHaiku.dataset.line3 = f.line3;
        cardsElement.appendChild(newHaiku);
    }
    
} 

const clearFavorites = () =>{
    cardsElement.innerHTML = "";
    storage.clearFavorites();
    showFavorites();
}

const init = () =>{
    cardsElement = document.querySelector("#element-card-holder");
    document.querySelector("#element-status")
    showFavorites();

    document.querySelector("#clear-btn").onclick = () => {
        clearFavorites();
    }

    window.onfocus = () => {
        showFavorites();
       };
}

window.onload = init;