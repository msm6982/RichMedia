import "./haiku-card.js";
import * as storage from "./local-storage.js";
import * as firebase from "./community.js";
import * as creation from "./app.js";

let cardsElement = null;

// Spawn some example Haikus
const init = () =>{
    cardsElement = document.querySelector("#element-card-holder");
    cardsElement.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        creation.createHaikuResults(creation.createHaiku("",""),cardsElement);
    }
    //creation.createHaikuResults(creation.createHaiku("",""),cardsElement);
    //console.log();
}

init();