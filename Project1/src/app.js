const haikuCards = []; 
import "./haiku-card.js";
import * as storage from "./local-storage.js";

let fieldLimit = null,
    haikuInput = null,
    cardsElement = null,
    searchBtn = null,
    statusInfo = null;
let generationNum = 1;
let syllableCount = 0;

const init = () =>{

    fieldLimit = document.querySelector("#field-limit");
    haikuInput = document.querySelector("#haiku-input");
    cardsElement = document.querySelector("#element-card-holder");
    searchBtn = document.querySelector("#btn-search");
    statusInfo = document.querySelector("#element-status");
    generationNum = fieldLimit.value;

    fieldLimit.onchange = (e) => {
        generationNum = e.target.value;
        //console.log(generationNum);
    };

    searchBtn.onclick = (e) =>{
        e.target.classList.add("is-loading");
        showHaikus();
    }
}
window.onload = init;

const showHaikus = (e) =>{
    

    // syllable count check if it's less than 7 
    // Multi-Splitting of strings
    syllableCount = RiTa.syllables(`${haikuInput.value}`).split(" ").join(",").split("/").join(",").split(",")
    //console.log(syllableCount);
    if(syllableCount.length > 7)
    {
        statusInfo.innerHTML = `${haikuInput.value} has <b>too many</b> syllables for a Haiku!`
        searchBtn.classList.remove("is-loading");
        return;
    }
    if(haikuInput.value.trim() == "")
    {
        statusInfo.innerHTML = `Enter a phrase to Generate a Haiku!`
        searchBtn.classList.remove("is-loading");
        return;
    }

    statusInfo.innerHTML = `Generating Haikus with: ${haikuInput.value}`
    
    haikuCards.length = 0;
    cardsElement.innerHTML = "";
    for (let i = 0; i < generationNum; i++) {
        createHaikuResults(createHaiku());
    }
    searchBtn.classList.remove("is-loading");
}

const addToFavorites = (haikuObj) => {
    storage.addFavorite(haikuObj);
}

const createHaikuResults = (haiku) => {
    haikuCards.push(haiku);
    let splitHaiku = haiku.split(".");
    const newHaiku = document.createElement("haiku-card");
    newHaiku.dataset.line1 = splitHaiku[0];
    newHaiku.dataset.line2 = splitHaiku[1];
    newHaiku.dataset.line3 = splitHaiku[2];
    newHaiku.callback = addToFavorites; 
    cardsElement.appendChild(newHaiku);
}



function createHaiku()
{
    let generatedHaiku = []; 

    // 0 to 2
    let phrasePos = Math.floor(Math.random() * 3);
    
    // 7 syllable line
    if(syllableCount>5) phrasePos = 1;

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

function generateLine(addedPhrase, totalSyllable){

    let returnedLine = addedPhrase;
    let remainingSyl;
    if(addedPhrase == "")
    {
        remainingSyl = totalSyllable;
        returnedLine = [];
    }
    else
    {
        returnedLine = addedPhrase;
        remainingSyl = totalSyllable - RiTa.syllables(`${returnedLine}`).split(" ").join(",").split("/").join(",").split(",").length;
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
        if(returnedLine.length == 0)
        {
            returnedLine = ` ${randomWord}`
        }
        else
        {
            returnedLine += ` ${randomWord}`
        }
        

        // Calculate the remaining syllables of the line
        remainingSyl = totalSyllable - RiTa.syllables(`${returnedLine}`).split(" ").join(",").split("/").join(",").split(",").length;
    }

    // Radom ordering from https://flaviocopes.com/how-to-shuffle-array-javascript/
    //returnedLine = returnedLine.sort(() => Math.random() - 0.5)
    return returnedLine;
}

