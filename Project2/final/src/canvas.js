// flash code starter https://codepen.io/jlong64/pen/kXRxpA
// rain code starter https://dev.to/soorajsnblaze333/make-it-rain-in-html-canvas-1fj0

import * as utils from './utils.js';


let ctx,canvasWidth,canvasHeight,analyserNode,audioData, distanceDivider, lightningRandomness   ; // Init all objects here

let realitiveInputedStrikes;

let lightningStrikeLines;
let rainType;
let rainDrops; 
let environment;
let flashOpacity = 0; 
let image;
// let lastFrame;
// let totalBoltDuration ;
// let currentDurration;



const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

    distanceDivider = 6;
	// create a gradient that runs top to bottom
	//gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"blue"},{percent:.25,color:"green"},{percent:.5,color:"yellow"},{percent:.75,color:"red"},{percent:1,color:"magenta"}]);
    //gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(33, 32, 32)"},{percent:.25,color:"rgb(45, 45, 45)"},{percent:1,color:"rgb(79, 77, 76)"}]); 79, 77, 76
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    
    image = new Image();
    image.src = "media/window.png";
    
    //lastFrame = (new Date()).getTime();
    //let boltFlashDuration = 0.25;
    //let boltFadeDuration = 0.25;
    // totalBoltDuration = boltFlashDuration + boltFadeDuration;
    // currentDurration = 0;

    rainThemes = {
        natural : {
            backrondGradient : utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(33, 32, 32)"},{percent:.25,color:"rgb(45, 45, 45)"},{percent:1,color:"rgb(79, 77, 76)"}]),
            lightningColor : utils.createVector3(255,255,255),
            rainColor : utils.createVector3(255,255,255)
        },
        evil : {
            backrondGradient : utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(0, 0, 0)"},{percent:.25,color:"rgb(89, 17, 17)"},{percent:.75,color:"rgb(161, 22, 22)"}, {percent:1,color:"rgb(56, 24, 4)"}]),
            lightningColor : utils.createVector3(255, 0, 0),
            rainColor : utils.createVector3(200, 10, 0)
        },
        cartoon : {
            backrondGradient : utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(38, 38, 41)"},{percent:.40,color:"rgb(35, 31, 87)"}, {percent:1,color:"rgb(13, 56, 9)"}]),
            lightningColor : utils.createVector3(252, 231, 0),
            rainColor : utils.createVector3(52, 116, 235)
        }
    }

    rainDrops = [];
	
    rainType = {
        drizzle: { count: 30, speed: 0.1 },
        light: { count: 100, speed: 0.25 },
        medium: { count: 250, speed: 0.3 },
        downpour: { count: 500, speed: 0.4 },
        aftershower: { count: 3, speed: 0.4 }
    };
    
    environment = {
        wind: utils.createVector(-0.03, 0),
        rainType: rainType.light,
    };

    //currentSceneTheme = rainThemes.natualTheme;

}

let currentSceneTheme;
let rainThemes; 




const draw = (params={},fps) => {
    // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
    
    
    

    ctx.save();
    // Draw the background
    if(params.showBackground){
        
        ctx.fillStyle = currentSceneTheme.backrondGradient;
        ctx.globalAlpha = 1/fps * 10;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        //ctx.restore();
    }
    else
    {
        ctx.fillStyle = "black";
        ctx.globalAlpha = 1/fps * 10;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);
    }
    ctx.restore();
	
	

    

            
    // Audio Data, analyising beat
    let totalLoudness =  audioData.reduce((total,num) => total + num);
    let averageLoudness =  totalLoudness/(analyserNode.fftSize/2);
    
    let loudnessAt2K = audioData[11];
    
    	
    // Elapsing Time
    /*
    let frame = (new Date()).getTime();
    let elapsed = (frame - lastFrame) / 1000.0;
    lastFrame = frame;
    currentDurration += elapsed;
    */
    

    let loudnessThreshold = 140;
    let maxRangeLoud = loudnessThreshold + 20;

    let conditionChecks = [(averageLoudness > loudnessThreshold), (loudnessAt2K > 220)];
    let beatCondition;

    beatCondition = conditionChecks[0] /*|| conditionChecks[1]*/;


    if(params.showRain && rainDrops.length <= environment.rainType.count)
    {
        addRain();
    }

    // Draw any rain in the scene
    if(rainDrops.length > 0)
    {
        ctx.save();
        ctx.globalAlpha = 1;
        let color = `rgba(${currentSceneTheme.rainColor.x}, ${currentSceneTheme.rainColor.y}, ${currentSceneTheme.rainColor.z}, 0.75)`; 
        // Set radius based on the average size
        let radius = utils.diffInRange(averageLoudness, 60, 170);
        radius = Math.pow(5.5,radius);
        //let radius = utils.lerp(0.5, 5, averageLoudness/maxRangeLoud);
        if(averageLoudness == 0 || !(params.rainPulse)) radius = 1;
        drawRain(color, params.showRain, radius);
        ctx.restore();
    }


    // Popluate lightning Strikes
    if(params.showLightning && (beatCondition || params.constLight)) {
        
        // Entire array of lightning strikes segments/lines
        lightningStrikeLines = [];
        for (let i = 0; i < realitiveInputedStrikes; i++) {

            lightningStrikeLines.push([]);

        }
    }

    // If the song is playing and at least one of the params are active loop through the song sameple
    if(averageLoudness > 0 && (params.showLightning || params.showRain))
    {
        let strikeSamples;
        let loopStrikeCounter;
        
        // Add audio data to the lightning strikes
        if (params.showLightning && (beatCondition || params.constLight))
        {
            strikeSamples = Math.round(audioData.length/realitiveInputedStrikes);
            loopStrikeCounter = -1;
        }

        for (let i = 0; i < audioData.length; i++) {
            
            // Create audio data for lightning strikes
            if (params.showLightning && (beatCondition || params.constLight))
            {
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
        }
    }


	// Draw the lightning
	if(params.showLightning && (beatCondition ||  params.constLight)) {
       
        // Populate the lightning with distances and positions
        // Also Draw it Lightning
        ctx.save();
        //ctx.strokeStyle = "white";
        ctx.fillStyle = `rgb(${currentSceneTheme.lightningColor.x}, ${currentSceneTheme.lightningColor.y}, ${currentSceneTheme.lightningColor.z}, 0.75)`;
        ctx.strokeStyle = `rgb(${currentSceneTheme.lightningColor.x}, ${currentSceneTheme.lightningColor.y}, ${currentSceneTheme.lightningColor.z}, 0.75)`;
        ctx.lineWidth = 1;

        // Insure that one lightning strike stays on screne
        let xStart = (lightningStrikeLines.length>1) ? canvasWidth/lightningStrikeLines.length : canvasWidth/2;
        let yStart = canvasHeight/16;
        
        // Draw each of the lightning strikes 
        for(let j = 0; j < lightningStrikeLines.length; j++)
        { 
            let lightningDis = (j *  xStart) + xStart;
            let totalDistance = 0;
            let currentSegmentLoc = utils.createVector(utils.getRandom(lightningDis - (xStart/2), lightningDis + (xStart/2)), utils.getRandom(0, yStart))


            ctx.save();
            ctx.beginPath();
            ctx.lineTo(currentSegmentLoc.x,currentSegmentLoc.y);


            for (let i = 0; i < lightningStrikeLines[j].length; i++)
            {

                lightningStrikeLines[j][i] = createLightningSegment(currentSegmentLoc.x, currentSegmentLoc.y, lightningStrikeLines[j][i].distance);

                totalDistance += lightningStrikeLines[j][i].distance;

                currentSegmentLoc = utils.createVector(lightningStrikeLines[j][i].xEnd, lightningStrikeLines[j][i].yEnd);

                ctx.lineTo(currentSegmentLoc.x, currentSegmentLoc.y);

            }

            // Set the width of the lighning bolt based on its distance
            totalDistance  = (totalDistance/(200 * lightningStrikeLines[j].length))
            ctx.lineWidth = Math.pow(7.5,totalDistance);

            ctx.stroke();

            ctx.closePath();
            ctx.restore();
        }
        

        ctx.closePath();
        ctx.restore();


    }

    // Draw the flash
    if(params.showFlash && beatCondition)
    {
        // Set the flash ammount based on beat
        let flashPercentage =  (averageLoudness - loudnessThreshold) / (maxRangeLoud - loudnessThreshold);

        if(params.showFlash) flashOpacity = flashPercentage * 0.5;
        if(flashOpacity > 0.6) flashOpacity = 0.6;


        ctx.save();
        ctx.fillStyle = `rgba(${currentSceneTheme.lightningColor.x}, ${currentSceneTheme.lightningColor.y}, ${currentSceneTheme.lightningColor.z}, ${flashOpacity})`;
        ctx.fillRect(0.0, 0.0, window.innerWidth, window.innerHeight);
        flashOpacity = Math.max(0.0, flashOpacity - 2.0);
        ctx.restore();
    }
    else
    {
        flashOpacity = 0;
    }

    

    if(params.showImage){
        ctx.save();
        //ctx.scale(.10,.1);
        ctx.globalAlpha = 1;
        ctx.drawImage(image, 0, 0, image.width,    image.height,     // source rectangle
                   0, 0, canvasWidth, canvasHeight); // destination rectangle
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
  
	
};


//https://dev.to/soorajsnblaze333/make-it-rain-in-html-canvas-1fj0
  
  class Raindrop {
    constructor(x, y, radius, accY){
      this.location = utils.createVector(x, y); 
      this.velocity = utils.createVector(0, 0);
      this.wind = environment.wind;
      this.acceleration = 0;
      this.setAccel(accY);
      this.setRadius(radius);
    }

    setAccel(accY) {
        this.acceleration = utils.createVector(0, accY);
        this.acceleration = utils.vectorAddition(this.acceleration, this.wind);
        //this.velocity = utils.createVector(0, 0);
    }

    setRadius(radius){
        this.radius = radius;
    }
  
    draw(color) {
      const { x, y } = this.location;
      const lineWidth=.1;
      //const color = `rgb(${currentSceneTheme.rainColor})`
      //console.log (color);
      return utils.drawArc(ctx,x, y, this.radius, color,lineWidth,color, true);
    }
  
    fall() { 
      if (this.velocity.y <= (environment.rainType.speed * 50)) {
        this.velocity = utils.vectorAddition(this.velocity, this.acceleration);
      }
      this.location = utils.vectorAddition(this.location, this.velocity);
    }
  
  }
  
  
  
 
  
    const addRain = (rainToAdd = environment.rainType.count - rainDrops.length, radius = 1.0 , accY = environment.rainType.speed) => { 
        for (let i = 0 ; i < rainToAdd ; i++) {
            let x = utils.getRandom(0, canvasWidth+100);
            let y = utils.getRandom(-700 , -200);
            // let accY = getRandomFloat(1, 5) * 0.05;
            rainDrops.push(new Raindrop(x, y, radius, accY));
        }
    }
  
  
  // continuous rain animation loop
  const drawRain = function(color, rainContinue, radius = 1.0, accY = environment.rainType.speed) {

    for (let i = 0; i < rainDrops.length; i++) {
        // Set radius and acceleration
        rainDrops[i].setRadius(radius);
        rainDrops[i].setAccel(accY);
        rainDrops[i].fall();
        rainDrops[i].draw(color);
    
        // Despawn or removes rain out of bounds
        if(rainDrops[i].location.y > canvasHeight || rainDrops[i].location.x < 0)
        {
            
          // Remove rain if there's too much or it needs to stop
          if(rainContinue && (rainDrops.length <= environment.rainType.count))
          {
              let x = utils.getRandom(0, canvasWidth+50);
              let y = utils.getRandom(-50, 0);
              rainDrops[i].location = utils.createVector(x, y);
              
          }
          else
           {
              rainDrops.splice(i,1);
              i--;
           }
           
          
        }
        
      
      // Respawn or remove a rain drop
      
    }
  
  }


///
/*
Public Variables
*/
///

// Set the rain enviroment type
const setRainType = (type) => {
    environment["rainType"] = rainType[type];

}

// Set the theme of the scene theme type
const setTheme = (theme) => {
    currentSceneTheme =  rainThemes[theme];
}

// Set the relative number of lightning strikes
const setStrike = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    lightningStrikeLines = [];
    realitiveInputedStrikes = value;
    
};

// Radom Ammount of Lighning squiggle
const setRandom = (value) => {
    value = Number(value); // make sure that it's a Number rather than a String
    lightningRandomness = utils.lerp((Math.PI/2), 0, value);
};

export {setupCanvas,draw,setRandom, setStrike, setTheme, setRainType};