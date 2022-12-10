/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
const drawParams = {
  showBackground : true,
  showLightning: true,
  showRain     : false,
  showFlash    : true,
  constLight : false
}

const fps = 60;
let audioData = null;

// HTML Elements
let themeSelect = null;
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
let cbFlash = null;
let cbConstLight = null;
let canvasElement = null;



import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/Crypteque (1-2).mp3"
});

function init(){
    
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	audio.setupWebaudio(DEFAULTS.sound1);
  canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	
  // Controls 
  playButton = document.querySelector("#playButton");
  trackSelect = document.querySelector("#trackSelect");
  themeSelect = document.querySelector("#themeSelect");
  volumeSlider = document.querySelector("#volumeSlider");
  lightningSlider = document.querySelector("#lightningRadomness");
  lightNumSlider = document.querySelector("#lightNumSlider");

  // Lables
  volumeLabel = document.querySelector("#volumeLabel");
  lightningLabel = document.querySelector("#lightningDisplay");
  lightNumLabel = document.querySelector("#lightNumLabel");
  

  // Checkboxes
  cbBackground = document.querySelector("#backgroundCB");
  cbRain = document.querySelector("#rainCB");
  cbFlash = document.querySelector("#flashCB");
  cbLightning = document.querySelector("#lightningCB");
  cbConstLight = document.querySelector("#constantLightningCB");
  

  
  setupUI();

  


  audioData = new Uint8Array(audio.analyserNode.fftSize/2);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  setupSceneDefaults()
  loop();
}


function setupSceneDefaults(){

  setVolumeMain(volumeSlider.value);
  setThemeMain(themeSelect.value);
  setTrackMain(trackSelect.value);
  setLightSliderMain(lightningSlider.value);
  setLightAmmountMain(lightNumSlider.value);
  
  cbRain.value = drawParams.showRain;
  cbRain.checked = drawParams.showRain;

  cbBackground.value = drawParams.showBackground;
  cbBackground.checked = drawParams.showBackground;

  cbFlash.value = drawParams.showFlash;
  cbFlash.checked = drawParams.showFlash;

  cbLightning.value = drawParams.showLightning;
  cbLightning.checked = drawParams.showLightning;

  cbConstLight.value = drawParams.constLight;
  cbConstLight.checked - drawParams.constLight;

}

const setupUI = () => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
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
  volumeSlider.oninput = e => { setVolumeMain(e.target.value); };
  
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

  cbRain.onclick = function(e) { drawParams.showRain = e.target.checked; }

  cbFlash.onclick = function(e) { 
    drawParams.showFlash = e.target.checked; 
    // Dont flash with constant lightning
    if(drawParams.constLight && e.target.checked == true)
    {
      drawParams.constLight = false;
      cbConstLight.value = false;
      cbConstLight.checked = false;
    } 
  }

  cbConstLight.onclick = function(e) { 
    drawParams.constLight = e.target.checked; 

    

    
    if(e.target.checked == true)
    {
      // Turn on ligthning
      drawParams.showLightning = true;
      cbLightning.value = true;
      cbConstLight.checked = true;

      // Dont flash with constant lightning
      if(drawParams.showFlash)
      {
        drawParams.showFlash = false;
        cbFlash.value = false;
        cbFlash.checked = false;
      } 
      
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

    // Helper Functions called after json files loads
    const setVolumeMain = (value) => {
      audio.setVolume(value);
      // update value of label to match value of slider
      volumeLabel.innerHTML = Math.round((value/2 * 100));
    }

    const setThemeMain = (value) => {
      canvas.setTheme(value);
    }

    const setTrackMain = (value) => {

      audio.loadSoundFile(value);
      // pause the current track if playing
      if(playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
      }
    }

    const setLightSliderMain = (value) => {
      
      canvas.setRandom(value);
      // update value of label to match value of slider
      lightningLabel.innerHTML = Math.round((value * 100));
    }

    //
    const setLightAmmountMain = (value) => {
      canvas.setStrike(value);
      // update value of label to match value of slider
      lightNumLabel.innerHTML =  `${value * 10} %`;
    }

export {init};