/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
const drawParams = {
  showGradient : false,
  showLightning: true,
  showRain     : false,
  showFlash    : true,
  showNoise    : false,
  showInvert   : false,
  showEmboss   : false
}

const fps = 60;
let audioData = null;

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/The Picard Song.mp3"
});

function init(){
    
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
	audio.setupWebaudio(DEFAULTS.sound1);
  let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
  audioData = new Uint8Array(audio.analyserNode.fftSize/2);
  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
}


function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };

  const playButton = document.querySelector("#playButton");

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

  let volumeSlider = document.querySelector("#volumeSlider");
  let volumeLabel = document.querySelector("#volumeLabel");

  let lightningSlider = document.querySelector("#lightningRadomness");
  let lightningLabel = document.querySelector("#lightningDisplay");

  // oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);
    // update value of label to match value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };
  
  lightningSlider.oninput = e => {
    // set the gain
    canvas.setRandom(e.target.value);
    // update value of label to match value of slider
    lightningLabel.innerHTML = Math.round((e.target.value * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));
  lightningSlider.dispatchEvent(new Event("input"));

  // hookup track select
  let trackSelect = document.querySelector("#trackSelect");

  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);
    // pause the current track if playing
    if(playButton.dataset.playing == "yes") {
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  document.querySelector("#gradientCB").onclick = function(e) {
    drawParams.showGradient = e.target.checked;
  }

  document.querySelector("#lightningCB").onclick = function(e) {
    drawParams.showLightning = e.target.checked;
  }

  document.querySelector("#rainCB").onclick = function(e) {
    drawParams.showRain = e.target.checked;
  }

  document.querySelector("#flashCB").onclick = function(e) {
    drawParams.showFlash = e.target.checked;
  }

  document.querySelector("#noiseCB").onclick = function(e) {
    drawParams.showNoise = e.target.checked;
  }
  
  document.querySelector("#invertCB").onclick = function(e) {
    drawParams.showInvert = e.target.checked;
  }

  document.querySelector("#embossCB").onclick = function(e) {
    drawParams.showEmboss = e.target.checked;
  }
	
} // end setupUI

function loop(){
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


export {init};