import "./haiku-card.js";
import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";
import * as creation from "./app.js";

let cardsElement = null;

const init = () =>{
    cardsElement = document.querySelector("#element-card-holder");
    console.log(creation.createHaikuResults(creation.createHaiku("",""),cardsElement));
}

init();