const haikuCards = []; 
import "./haiku-card.js";
import * as storage from "./local-storage.js";
import * as firebase from "./firebase.js";

let fieldLimit = null,
    haikuInput = null,
    cardsElement = null,
    searchBtn = null,
    statusInfo = null;
let generationNum = 1;
let syllableCount = 0;

const init = () =>{

    //storage.clearLocalStorage();

    fieldLimit = document.querySelector("#field-limit");
    haikuInput = document.querySelector("#haiku-input");
    cardsElement = document.querySelector("#element-card-holder");
    searchBtn = document.querySelector("#btn-search");
    statusInfo = document.querySelector("#element-status");

    // Insert the locally saved search changes
    //console.log(storage.getSavedNumeralInput());
    //fieldLimit.target.value = parseInt(storage.getSavedNumeralInput());
    haikuInput.value = storage.getSavedSearch();
    statusInfo.innerHTML = storage.getSavedUI();
    
    
    generationNum = fieldLimit.value;

    // Insert the last search term's saved haikus
    let savedHaikus = storage.getRecentlySearchedHaikus();
    for (let i = 0; i < savedHaikus.length; i++) {
        createHaikuResults(savedHaikus[i]);
    }


    fieldLimit.onchange = (e) => {
        generationNum = e.target.value;
        //console.log(generationNum);
    };

    searchBtn.onclick = (e) =>{
        e.target.classList.add("is-loading");
        showSearchResult();
        
    }
}
window.onload = init;

const showSearchResult = (e) =>{
    

    // syllable count check if it's less than 7 
    // RiTa syllables returns the sring of stressed syllables in this fassion
    //console.log(RiTa.syllables("very")) = v-eh/r-iy

    // Multi-Splitting of strings removes any extra spacing at first, and then the dashs 
    // The ammount of spits form dashes determine the number of stressed syllables  
    syllableCount = RiTa.syllables(`${haikuInput.value}`).split(" ").join(",").split("/").join(",").split(",").filter(words => words.length > 0)
    
    // Don't compete a search if what whas seached goes against the formating of a haiku
    let tooManySyl = syllableCount.length > 7;
    let nothingEntered = haikuInput.value.trim() == "";
    
    if(tooManySyl || nothingEntered)
    {
        if(tooManySyl) statusInfo.innerHTML = `<b>${haikuInput.value}</b> has <b>too many</b> syllables for a Haiku!<br> Remember <b>5-7-5</b>`;

        if(nothingEntered) statusInfo.innerHTML = `<b>Type</b> a phrase to Generate a Haiku!`;

        
        searchBtn.classList.remove("is-loading");
        return;
    }

    // Seach was sucsessful
    statusInfo.innerHTML = `Generating Haikus with: <b>${haikuInput.value}</b>`
    
    haikuCards.length = 0;
    cardsElement.innerHTML = "";

    for (let i = 0; i < generationNum; i++) {
        createHaikuResults(createHaiku());
    }

    // Save the current state of the app page if loading it was successful 
    storage.saveAppState(haikuInput.value, fieldLimit.value, statusInfo.innerHTML, haikuCards); 
    
    
    searchBtn.classList.remove("is-loading");
}

const addToFavorites = (haikuObj) => {
    console.log(haikuObj);
    
    if(haikuObj.addedToFavorites == 'true')
    {
        storage.addFavorite(haikuObj);
        firebase.pushLikedHaikusToCloud(haikuObj, 1);
        console.log("adding to favorite");
    }
    else
    {
        storage.removeFavorite(haikuObj);
        firebase.pushLikedHaikusToCloud(haikuObj, -1);
        console.log("removing from favorite");
    }
    // Increment by 1
}



const createHaikuResults = (haiku) => {
    haikuCards.push(haiku);
    let splitHaiku = haiku.split(".");
    const newHaiku = document.createElement("haiku-card");
    newHaiku.dataset.line1 = splitHaiku[0];
    newHaiku.dataset.line2 = splitHaiku[1];
    newHaiku.dataset.line3 = splitHaiku[2];
    newHaiku.dataset.addedToFavorites = storage.findHaikuInFav(splitHaiku[0], splitHaiku[1], splitHaiku[2]);
    newHaiku.callback = addToFavorites; 
    cardsElement.appendChild(newHaiku);
}



function createHaiku()
{
    let generatedHaiku = []; 

    // 0 to 2
    let phrasePos = Math.floor(Math.random() * 3);
    
    // 7 syllable line
    if(syllableCount.length>5) phrasePos = 1;

    // Generate each line individually
    for (let j = 0; j < 3; j++) {
        // Add the phrase to the list on the random
        let addedPhrase = (j==phrasePos) ? haikuInput.value.trim() : "";
        let syllablePerLine = (j==1) ? 7 : 5;
        if(generatedHaiku.length == 0)
        {
            generatedHaiku = `${generateLine(addedPhrase, syllablePerLine)}. `;
        }
        else
        {
            generatedHaiku += `${generateLine(addedPhrase, syllablePerLine)}. `;
        }  
    }
    //console.log(generatedHaiku);
    return generatedHaiku;
    
}

// Generate one of the three lines
function generateLine(addedPhrase, totalSyllable){

    let returnedLine = addedPhrase;
    let remainingSyl;
    if(addedPhrase == "")
    {
        remainingSyl = totalSyllable;
        // Make sure array is empty
        returnedLine = [];
        returnedLine.shift();
    }
    else
    {
        returnedLine = addedPhrase;
        remainingSyl = totalSyllable - RiTa.syllables(`${returnedLine}`).split(" ").join(",").split("/").join(",").split(",").filter(words => words.length > 0).length;
    }
   
    //console.log(remainingSyl);
    
    // Keep generating new phrases to the line while there are syllables to be filled
    while (remainingSyl > 0)
    {
        
        //console.log(remainingSyl)
        
        // Get a radom ammount of syllables to generate 
        let randomAmmount = Math.floor(Math.random() * remainingSyl);
        randomAmmount++;
        
        let randomWord = RiTa.randomWord({ numSyllables: randomAmmount});
        //console.log(`${randomAmmount} ${randomWord}`);

        // Add a random word to the returned line
        returnedLine = (returnedLine.length == 0) ? `${randomWord}` : returnedLine + ` ${randomWord}`;

        // Calculate the remaining syllables of the line
        remainingSyl = totalSyllable - RiTa.syllables(`${returnedLine}`).split(" ").join(",").split("/").join(",").split(",").filter(words => words.length > 0).length;
        
    }
    //console.log(returnedLine);

    // Insure that the words of the added prase are not shuffled, by replacing it with a placeholder value
    // https://www.w3schools.com/jsref/jsref_replace.asp
    if (addedPhrase != "") {returnedLine = returnedLine.replace(`${addedPhrase}`, "!");}

    // Shuffle the positioning of the words
    returnedLine = shuffleArray(returnedLine.split(" "));

    // Re add the added phrase to the line
    // https://www.w3schools.com/jsref/jsref_includes.asp
    if(returnedLine.includes("!")) {
        returnedLine = returnedLine.join(",");
        returnedLine = returnedLine.replace("!", `<b>${addedPhrase}</b>`);
        returnedLine = returnedLine.split(",")
    }

    //console.log(RiTa.syllables(`${returnedLine}`).split(" ").join(",").split("/").join(",").split(",").filter(words => words.length > 0));
    
    returnedLine = returnedLine.join(",").split(",").join(" ");
    return returnedLine;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
