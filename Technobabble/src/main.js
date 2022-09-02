"use strict";
// Sources used : https://www.baeldung.com/java-remove-start-end-double-quote#:~:text=To%20remove%20double%20quotes%20just,be%20replaced%20by%20empty%20strings.
	
	let babblePhrases1;
    let babblePhrases2;
    let babblePhrases3;
    
    window.onload = initJsonXHR;

    function initJsonXHR() {
        const url = "./data/babble-data.json";
        const xhr = new XMLHttpRequest();
        xhr.onload = (e) => {
            console.log(`In onload - HTTP Status Code = ${e.target.status}`);
            
            // Parsing JSon File
            const json = JSON.parse(e.target.responseText);
            const keys = Object.keys(json);
            let lines1 = json[keys[0]]["babblelist"];
            let lines2 = json[keys[1]]["babblelist"];
            let lines3 = json[keys[2]]["babblelist"];
            
            // Parsing XML File
            //const xml = e.target.responseXML;

            //let lines1 = xml.querySelector("phraselist[cid='babbles1']").textContent.split(",");
            //let lines2 = xml.querySelector("phraselist[cid='babbles2']").textContent.split(",");
            //let lines3 = xml.querySelector("phraselist[cid='babbles3']").textContent.split(",");

            // Parsing CSV File
            //const text = e.target.responseText;
            //console.log(`Sucess - the file length is ${text.length}`);
            
            //let lines = text.split("\n");
            //let lines1 = lines[0].split(",");
            //let lines2 = lines[1].split(",");
            //let lines3 = lines[2].split(",");

            // Set up globals
            // Replace all source: https://www.baeldung.com/java-remove-start-end-double-quote#:~:text=To%20remove%20double%20quotes%20just,be%20replaced%20by%20empty%20strings.
            babblePhrases1 = lines1.map(w => w.replaceAll("\"", "").trim());
            babblePhrases2 = lines2.map(w => w.replaceAll("\"", "").trim());
            babblePhrases3 = lines3.map(w => w.replaceAll("\"", "").trim());
            
            // Babble
            initialBabble();
        };
        xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
        xhr.open("GET", url);
        xhr.send();
    }


    // Generate at start after globals are set 
    function initialBabble() {
        babble(1);

        document.querySelector("#my-button").onclick = function(){babble(1)};
        document.querySelector("#five-button").addEventListener('click', function(){babble(5)});
    }

    // Generates Technobable from the three arrays, phrases represents an int value
    function babble (phrases) {

        let bab = "";
        function randomPhrase (array) {
           return array[Math.floor(Math.random() * array.length)];
        }
        
        //const bab += `${randomPhrase(words1)} ${randomPhrase(words2)} ${randomPhrase(words3)}`;
        for (let index = 0; index < phrases; index++) {
            bab += randomPhrase(babblePhrases1) + " " + randomPhrase(babblePhrases2) + " " + randomPhrase(babblePhrases3) + "<br>";           
        }
        
        console.log(bab);

        // Update the text
        document.querySelector("#output").innerHTML = bab;
    }