// flash code starter https://codepen.io/jlong64/pen/kXRxpA
// rain code starter https://dev.to/soorajsnblaze333/make-it-rain-in-html-canvas-1fj0

import * as utils from './utils.js';


let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, distanceDivider, lightningRandomness, lastFrame, totalBoltDuration, currentDurration ; // Init all objects here

let rainType;
let raindropCount;
let rainDrops; 
let environment;
let flashOpacity = 0; 

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

    distanceDivider = 6;
	// create a gradient that runs top to bottom
	//gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
    gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    lastFrame = (new Date()).getTime();

    let boltFlashDuration = 0.25;

    let boltFadeDuration = 0.25;

    totalBoltDuration = boltFlashDuration + boltFadeDuration;
    currentDurration = 0;
    rainDrops = [];
	
    
    rainType = {
        drizzle: { count: 30, speed: 0.27 },
        light: { count: 100, speed: 0.3 },
        medium: { count: 250, speed: 0.4 },
        downpour: { count: 500, speed: 0.5 },
        afteshower: { count: 3, speed: 0.4 }
    };
    
    environment = {
        wind: utils.createVector(-0.05, 0),
        rainType: rainType.light,
    };

    raindropCount = environment.rainType.count;

}





const draw = (params={},fps) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
	ctx.globalAlpha = 1/fps;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
    if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    else
    {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.globalAlpha = .1;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }


    
	//console.log(audioData);
            
    // Audio Data, analyising beat
    let totalLoudness =  audioData.reduce((total,num) => total + num);
    let averageLoudness =  totalLoudness/(analyserNode.fftSize/2);
    
    let loudnessAt2K = audioData[11];
    
    	
    
    let frame = (new Date()).getTime();
    let elapsed = (frame - lastFrame) / 1000.0;
    lastFrame = frame;
    currentDurration += elapsed;
    
    let beatCondition = (((loudnessAt2K > 225)) || ((loudnessAt2K > 150) && (currentDurration > totalBoltDuration)));
	// 4 - draw lightning
	if(params.showLightning && beatCondition) {
       
        
        currentDurration = 0;

        if(params.showFlash) flashOpacity = 0.15 + Math.random() * 0.2;
        let realitiveInputedStrikes = 10;

        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.50)`;
        ctx.strokeStyle = `rgba(0,0,0,0.50)`;
        //console.log(audioData.length);
        // loop through and draw data getting only values that have some frequency to them
        //console.log(audioData);

        // Entire Matrix of lightning strikes segments/lines
        let lightningStrikeLines = [];
        for (let i = 0; i < realitiveInputedStrikes; i++) {

            lightningStrikeLines.push([]);

        }

        

        // Add audio data to the lightning strikes
        let strikeSamples = Math.round(audioData.length/realitiveInputedStrikes);
        let loopStrikeCounter = -1;
        for (let i = 0; i < audioData.length; i++) {
            let checkLoopBranch = (i % strikeSamples)
            if (checkLoopBranch == 0)
            {
                loopStrikeCounter++;
            }
            // Ensurese no empty data is added
            if(audioData[i] > 0)
            {
                lightningStrikeLines[loopStrikeCounter].push({xEnd: 0, yEnd: 0, distance: audioData[i]});
            }
        }

        // Populate the lightning with distances and positions
        // Also Draw it Lightning
        ctx.save();
        ctx.strokeStyle = "white";
        
        ctx.lineWidth = 1;
        
        
        let xStart = canvasWidth/lightningStrikeLines.length;
        let yStart = canvasHeight/16;
        
        for(let j = 0; j < lightningStrikeLines.length; j++)
        {
            
            let lightningDis = (j *  xStart) + xStart;
            
            let currentX = utils.getRandom(lightningDis - xStart/2, lightningDis + xStart/2);
            let currentY = utils.getRandom(0, yStart);
            ctx.beginPath();
            ctx.lineTo(currentX,currentY);

            for (let i = 0; i < lightningStrikeLines[j].length; i++)
            {
                lightningStrikeLines[j][i] = createLightningSegment(currentX, currentY, lightningStrikeLines[j][i].distance);
                currentX =  lightningStrikeLines[j][i].xEnd;
                currentY = lightningStrikeLines[j][i].yEnd;
                ctx.lineTo(lightningStrikeLines[j][i].xEnd, lightningStrikeLines[j][i].yEnd);
            }
            ctx.stroke();

            ctx.closePath();
        }

        /*
        for (let i = 0; i < lightningStrikeLines[j].length; i++)
        {
           ctx.lineTo(lightningStrikeLines[j][i].xEnd, lightningStrikeLines[j][i].yEnd);
        }
        */
        
        //ctx.stroke();

        ctx.closePath();
        ctx.restore();

        /*
        for (let i = 0; i < audioData.length; i++) {
            //if()
            ctx.fillRect(margin + i * (barWidth + barSpacing), canvasHeight , barWidth, -(barHeight  - 256 + audioData[i]));
            ctx.strokeRect(margin + i * (barWidth + barSpacing), canvasHeight, barWidth, -(barHeight - 256 + audioData[i]));
        }
        */
        ctx.restore();
    }

    // Draw the flash
    if (flashOpacity > 0.0 && params.showFlash) {
        ctx.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
        ctx.fillRect(0.0, 0.0, window.innerWidth, window.innerHeight);
        flashOpacity = Math.max(0.0, flashOpacity - 2.0 * elapsed);
    }
    else
    {
        flashOpacity = 0;
    }


	// 5 - draw circles
    if(params.showRain && beatCondition)
    {
        addRain();
    }
    else if(params.showRain) {

        ctx.save();
        ctx.globalAlpha = 1;
        drawRain();
        ctx.restore();
    }



   // Create an end point of a lightnight segment 
    function createLightningSegment(xStart, yStart, distance) {
    
    // Radom angle between 45 and 135 degrees
    let minAngle =  0 + lightningRandomness;
    let maxAngle = (Math.PI ) - lightningRandomness;
    let randomAngle = utils.getRandom(minAngle, maxAngle);
    //console.log(Math.sin(randomAngle));
    let xFinal = xStart + ((distance / distanceDivider) * Math.cos(randomAngle));
    let yFinal = yStart + ((distance / distanceDivider) * Math.sin(randomAngle));
    
    return {xEnd: xFinal, yEnd: yFinal, distance: distance};
  }
  

    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if(params.showNoise && Math.random() < .05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
			//data[i] = 255; // make the red channel 100% red
            data[i+2] = 255;
        } // end if

        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
            // data[i+3] is alpha
        }
    } // end for


    if(params.showEmboss){
        for(let i = 0; i < length; i++) {
            if(i%4 == 3) continue; // skip alpha
            data[i] = 127 + 2*data[i] - data[i+4] - data[i + width*4];
        }
    }
	
	// D) copy image data back to canvas
    ctx.putImageData(imageData,0,0);
    
    /*
    //let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
    // let maxLoudness =  Math.max(...audioData); // ditto!
    // Now look at loudness in a specific bin
    // 22050 kHz divided by 128 bins = 172.23 kHz per bin
    // the 12th element in array represents loudness at 2.067 kHz
    console.log("-----Audio Stats-----"); 
    console.log(`averageLoudness = ${averageLoudness}`);
    //console.log(`minLoudness = ${minLoudness}`);
    //console.log(`maxLoudness = ${maxLoudness}`);
    console.log(`loudnessAt2K = ${loudnessAt2K}`);
    console.log("---------------------");
    */
	
};


//https://dev.to/soorajsnblaze333/make-it-rain-in-html-canvas-1fj0
  
  class Raindrop {
    constructor(x, y, radius, accY){
      this.location = utils.createVector(x, y); 
      this.radius = radius;
      this.velocity = utils.createVector(0, 0);
      this.acceleration = utils.createVector(0, accY);
      this.mass = 1;
  
      this.wind = environment.wind;
      this.acceleration = utils.vectorAddition(this.acceleration, this.wind);
    }
  
    draw() {
      const { x, y } = this.location;
      return utils.drawArc(ctx,x, y, this.radius, true);
    }
  
    fall() { 
      if (this.velocity.y <= (environment.rainType.speed * 50)) {
        this.velocity = utils.vectorAddition(this.velocity, this.acceleration);
      }
      this.location = utils.vectorAddition(this.location, this.velocity);
    }
  
  }
  
  
  
 
  
    const addRain = (rainToAdd = raindropCount) => { 
        for (let i = 0 ; i < rainToAdd ; i++) {
            let x = utils.getRandom(0, canvasWidth);
            let y = utils.getRandom(-350 , 0);
            // let accY = getRandomFloat(1, 5) * 0.05;
            let accY = environment.rainType.speed;
            rainDrops.push(new Raindrop(x, y, 1.0, accY));
        }
    }
  
  
  // continuous animation loop
  const drawRain = function() {


  
    for (let i = 0; i < rainDrops.length; i++) {
         
      rainDrops[i].fall();
      rainDrops[i].draw();
      if(rainDrops[i].location.y > canvasHeight || rainDrops[i].location.x > canvasWidth)
      {
        rainDrops.splice(i,1);
        i--;
      }
    }
  
  }





// Radom Ammount of Lighning squiggle
const setRandom = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    lightningRandomness = utils.lerp((Math.PI/2), 0, value);
};

export {setupCanvas,draw,setRandom};