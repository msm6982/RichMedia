/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
let drawParams = null;

const fps = 60;
let audioData = null;

// HTML Elements
let themeSelect = null;
let rainSelect = null;
let volumeSlider = null;
let volumeLabel = null;
let trackSelect = null;
let playButton = null;
let lightningSlider = null;
let lightningLabel = null;
let lightNumSlider = null;
let lightNumLabel = null;
let cbRain = null;
let cbBackground = null;
let cbLightning = null;
let cbImage = null;
let cbFlash = null;
let cbRainPulse = null;
let cbConstLight = null;
let canvasElement = null;
let savedVolume = 0;



import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Crypteque (1-2).mp3"
});



const init = (json) => {
    
	console.log("init called");
	console.log(`Testing JSON ${json}`);
	audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	canvas.setupCanvas(canvasElement, audio.analyserNode);

  // Controls 
  playButton = document.querySelector("#playButton");
  

  // Sliders and Lables set up
  setSliderDefaults(json["av-defaults"]["sliderDefaults"]);
  
  
  // CheckBoxSection setup
  const checkBoxSec1 = document.querySelector("#cb-1");
  checkBoxSec1.innerHTML = "";
  const checkBoxSec2 = document.querySelector("#cb-2");
  checkBoxSec2.innerHTML = "";
  loadCheckBoxes(json["av-defaults"]["checkBoxParams"], json["av-controls"]["checkBoxes"], checkBoxSec1); 

  

  
  // Drop down menu controlls 
  loadDropdown(json["av-controls"], json["av-defaults"]["dropdownSelect"]);
  
  // Set up on click events 
  setupUI();

  audioData = new Uint8Array(audio.analyserNode.fftSize/2);
 
  //setupSceneDefaults()
 
  loop();
};

// Load Options found in the dropdown menue
const loadDropdown = (jsonControls, jsonDefaults) => {
  trackSelect = document.querySelector("#trackSelect");
  themeSelect = document.querySelector("#themeSelect");
  rainSelect = document.querySelector("#rainSelect");

  const dropdowns = [trackSelect, themeSelect, rainSelect];

  for(let dropdown of dropdowns) { dropdown.innerHTML = ""; }

  rainSelect.innerHTML = jsonControls["rainDropDown"].map(option => `<option value="${option.value}">${option.title}</option>`).join(" ");
  rainSelect.value = jsonDefaults.rain;
  setRainTypeMain(rainSelect.value);

  trackSelect.innerHTML = jsonControls["tracks"].map(option => `<option value="${option.value}">${option.title}</option>`).join(" ");
  trackSelect.value = jsonDefaults.track;
  setTrackMain(trackSelect.value);

  themeSelect.innerHTML = jsonControls["sceneTheme"].map(option => `<option value="${option.value}">${option.title}</option>`).join(" ");
  themeSelect.value = jsonDefaults.theme;
  setThemeMain(themeSelect.value);
}

// Default values for when the app loads 
const loadCheckBoxes = (jsonParams, jsonCheckBoxes, checkBoxeSection) => {
  drawParams = jsonParams;

  // DOM creation
  checkBoxeSection.innerHTML =  jsonCheckBoxes.map(cb => `<span><input type="checkbox" id="${cb.id}"><label for="${cb.id}">${cb.title}</label></span>`).join(" ");

  // Checkboxes Id selection
  cbBackground = document.querySelector("#backgroundCB");

  cbLightning = document.querySelector("#lightningCB");

  cbRain = document.querySelector("#rainCB");

  cbFlash = document.querySelector("#flashCB");

  cbRainPulse = document.querySelector("#pulseRainCB");

  cbConstLight = document.querySelector("#constantLightningCB");

  cbImage = document.querySelector("#windowCB");


  // Checkbox states  
  cbBackground.value = drawParams.showBackground;
  cbBackground.checked = drawParams.showBackground;

  cbLightning.value = drawParams.showLightning;
  cbLightning.checked = drawParams.showLightning;

  cbRain.value = drawParams.showRain;
  cbRain.checked = drawParams.showRain;

  
  cbFlash.value = drawParams.showFlash;
  cbFlash.checked = drawParams.showFlash;

  cbRainPulse.value = drawParams.rainPulse;
  cbRainPulse.checked = drawParams.rainPulse;

  cbConstLight.value = drawParams.constLight;
  cbConstLight.checked = drawParams.constLight;

  
  cbImage.value = drawParams.showImage;
  cbImage.checked = drawParams.showImage;

}

// Set Slider Defaults
function setSliderDefaults(jsonDefaults){

  // Sliders
  volumeSlider = document.querySelector("#volumeSlider");
  lightningSlider = document.querySelector("#lightningRadomness");
  lightNumSlider = document.querySelector("#lightNumSlider");
  
  // Labels 
  volumeLabel = document.querySelector("#volumeLabel");
  lightningLabel = document.querySelector("#lightningDisplay");
  lightNumLabel = document.querySelector("#lightNumLabel");

  setVolumeMain(jsonDefaults.volume);
  setLightSliderMain(jsonDefaults.lightningRandomness);
  setLightAmmountMain(jsonDefaults.lighningAmm);

}

const setupUI = () => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  // Hook up a mute button
  const muteButton = document.querySelector("#muteButton");
  muteButton.onclick = () => {
    if(muteButton.innerHTML == "Unmute")
    {
      muteButton.innerHTML = "Mute";
      setVolumeMain(savedVolume);
    }
    else
    {
      savedVolume = volumeSlider.value;
      muteButton.innerHTML = "Unmute";
      setVolumeMain(0);
    }
    
  };

  // Pause and play on click
  playButton.onclick = e => {
    
    console.log (`audioCtx.state before = ${audio.audioCtx.state}`)
    
    if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    console.log (`audioCtx.state after = ${audio.audioCtx.state}`);
    if(e.target.dataset.playing == "no"){
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes"; // CSS will set the text to "Pause"
        //if track is playing, pause it
    }else{
        audio.pauseCurrentSound();
        e.target.dataset.playing ="no"; // // CSS will set the text to "Play"
    }
  };

  // oninput event to volume slider
  volumeSlider.oninput = e => { 
    setVolumeMain(e.target.value);
    if(e.target.value > 0)
    {
      muteButton.innerHTML = "Mute";
    } 
  };
  
  // on input event to lightning random strike Slider
  lightningSlider.oninput = e => { setLightSliderMain(e.target.value); };

  // on input event to lightning ammount strike Slider
  lightNumSlider.oninput = e => { setLightAmmountMain(e.target.value); };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));
  lightningSlider.dispatchEvent(new Event("input"));
  lightNumSlider.dispatchEvent(new Event("input"));

  // hookup track select
  trackSelect.onchange = e => { setTrackMain(e.target.value) }

  // hookup theme select
  themeSelect.onchange = e => { setThemeMain(e.target.value); }

  // hookup Rain type select
  rainSelect.onchange = e => {setRainTypeMain(e.target.value); }

  cbImage.onclick = function(e) { drawParams.showImage = e.target.checked;}

  // Checkbox change
  cbBackground.onclick = function(e) { drawParams.showBackground = e.target.checked; }

  cbLightning.onclick = function(e) { 
    drawParams.showLightning = e.target.checked; 
    if(drawParams.constLight && e.target.checked == false)
    {
      drawParams.constLight = false;
      cbConstLight.value = false;
      cbConstLight.checked = false;
    }
  }

  cbRain.onclick = function(e) { 
    drawParams.showRain = e.target.checked; 
    if(drawParams.rainPulse && e.target.checked == false)
    {
      drawParams.rainPulse = false;
      cbRainPulse.value = false;
      cbRainPulse.checked = false;
    }
  }

  cbRainPulse.onclick = function(e){ drawParams.rainPulse = e.target.checked;
    if(e.target.checked == true)
    {
      // Turn on ligthning
      drawParams.showRain = true;
      cbRain.value = true;
      cbRain.checked = true;
      
    }
  }

  cbFlash.onclick = function(e) { 
    drawParams.showFlash = e.target.checked; 
    // Dont flash with constant lightning
  }

  cbConstLight.onclick = function(e) { 
    drawParams.constLight = e.target.checked; 

    if(e.target.checked == true)
    {
      // Turn on ligthning
      drawParams.showLightning = true;
      cbLightning.value = true;
      cbLightning.checked = true;
      
    } 
  }

	
} // end setupUI

const loop = () => {
    /* NOTE: This is temporary testing code that we will delete in Part II */
        //requestAnimationFrame(loop);
        setTimeout(loop, 1000/fps);
        canvas.draw(drawParams, fps);
        // 1) create a byte array (values of 0-255) to hold the audio data
        // normally, we do this once when the program starts up, NOT every frame
        
        
        // 2) populate the array of audio data *by reference* (i.e. by its address)
        audio.analyserNode.getByteFrequencyData(audioData);
        //audio.analyserNode.getByteTimeDomainData(data); // waveform data
        
        // 3) log out the array and the average loudness (amplitude) of all of the frequency bins
            
        /*
        console.log(audioData);
            
            console.log("-----Audio Stats-----");
            let totalLoudness =  audioData.reduce((total,num) => total + num);
            let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
            let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
            let maxLoudness =  Math.max(...audioData); // ditto!
            // Now look at loudness in a specific bin
            // 22050 kHz divided by 128 bins = 172.23 kHz per bin
            // the 12th element in array represents loudness at 2.067 kHz
            let loudnessAt2K = audioData[11]; 
            console.log(`averageLoudness = ${averageLoudness}`);
            console.log(`minLoudness = ${minLoudness}`);
            console.log(`maxLoudness = ${maxLoudness}`);
            console.log(`loudnessAt2K = ${loudnessAt2K}`);
            console.log("---------------------");
        */

        
    }

    // Helper Functions called after json files loads and on interaction events


    const setVolumeMain = (value) => {
      audio.setVolume(value);
      // update value of label to match value of slider
      volumeSlider.value = value;
      volumeLabel.innerHTML = Math.round((value/2 * 100));
    };

    const setThemeMain = (value) => {
      canvas.setTheme(value);
    };

    const setRainTypeMain = (value) => { canvas.setRainType(value); };


    const setTrackMain = (value) => {

      audio.loadSoundFile(value);
      // pause the current track if playing
      //trackSelect.value = value;
      if(playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
      }
    }

    const setLightSliderMain = (value) => {
      
      canvas.setRandom(value);
      // update value of label to match value of slider
      lightningSlider.value = value;
      lightningLabel.innerHTML = Math.round((value * 100));
    };

    //
    const setLightAmmountMain = (value) => {
      canvas.setStrike(value);
      // update value of label to match value of slider
      lightNumSlider.value = value;
      lightNumLabel.innerHTML =  `${value * 10} %`;
    };

export {init};