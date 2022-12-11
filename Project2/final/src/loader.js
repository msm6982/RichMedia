import * as main from "./main.js";
window.onload = () => {
	
	// None of this JS will be called until HTML page is done loading
	loadJsonFetch("data/app-defaults.json",dataLoaded);

};

const loadJsonFetch = (url,callback) => {
	fetch(url)
		.then(response => {
			// If the response is successful, return the JSON
			if (response.ok) {
				return response.json();
			}

			// else throw an error that will be caught below
			return response.text().then(text =>{
				throw text;
			});
		}) // send the response.json() promise to the next .then()
		.then(json => { // the second promise is resolved, and `json` is a JSON object
			callback(json);
		}).catch(error => {
			// error
			console.log(error);
	});
};



const dataLoaded = json => {
	console.log(json);
	//document.querySelector("#text-title").innerHTML = json["page-title"] || "No 'page-title' found";
	//presets = json.presets || ["No 'presets' found"];
	main.init(json);
};