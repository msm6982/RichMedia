/* Checked by ESLint - https://eslint.org/demo */
import * as storage from "./localStorage.js";


let btnAddFavorite = null,
    btnChangeTitle = null,
    inputFavorite = null,
    inputTitle = null;

const showAppTitle = () => {
  const title = storage.getAppTitle();

  document.querySelector("title").textContent = title;
  document.querySelector(".title").textContent = title;


};

const init = () => {
  btnAddFavorite = document.querySelector("#btn-add-favorite");
  btnChangeTitle = document.querySelector("#btn-change-title");
  inputFavorite = document.querySelector("#input-favorite");
  inputTitle = document.querySelector("#input-title");

  showAppTitle();

  /* Event Handlers */
  btnAddFavorite.onclick = () => {
    const newFavorite = inputFavorite.value.trim();

    inputFavorite.value = "";
    if(newFavorite){
     storage.addFavorite(newFavorite);
    }
  };

  btnChangeTitle.onclick = () => {
   const newTitle = inputTitle.value.trim();

   inputTitle.value = "";
   if(newTitle){
    storage.setAppTitle(newTitle);
    showAppTitle(newTitle);
   }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
 // window.onstorage = showAppTitle;
};

init();
