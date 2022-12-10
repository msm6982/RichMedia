// flash code starter https://codepen.io/jlong64/pen/kXRxpA
// rain code starter https://dev.to/soorajsnblaze333/make-it-rain-in-html-canvas-1fj0

import * as utils from './utils.js';


let ctx,canvasWidth,canvasHeight,analyserNode,audioData, distanceDivider, lightningRandomness   ; // Init all objects here

let realitiveInputedStrikes;

let lightningStrikeLines;
let rainType;
let raindropCount;
let rainDrops; 
let environment;
let flashOpacity = 0; 
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
    
    
    //lastFrame = (new Date()).getTime();
    //let boltFlashDuration = 0.25;
    //let boltFadeDuration = 0.25;
    // totalBoltDuration = boltFlashDuration + boltFadeDuration;
    // currentDurration = 0;

    rainThemes = {
        natual : {
            backrondGradient : utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(33, 32, 32)"},{percent:.25,color:"rgb(45, 45, 45)"},{percent:1,color:"rgb(79, 77, 76)"}]),
            lightningColor : utils.createVector3(255,255,255),
            rainColor : utils.createVector3(255,255,255)
        },
        evil : {
            backrondGradient : utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"rgb(0, 0, 0)"},{percent:.25,color:"rgb(89, 17, 17)"},{percent:1,color:"rgb(161, 22, 22)"}]),
            lightningColor : utils.createVector3(255, 0, 0),
            rainColor : utils.createVector3(99, 0, 0)
        }
    }

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

    // 2 - draw background
    
    

    ctx.save();
    // 3 - draw gradient
    if(params.showBackground){
        
        ctx.fillStyle = currentSceneTheme.backrondGradient;
        ctx.globalAlpha = 1/fps * 10;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        //ctx.restore();
    }
    else
    {
        //ctx.save();
        ctx.fillStyle = "black";
        //console.log(1/fps * 10);
        ctx.globalAlpha = 1/fps * 10;
        ctx.fillRect(0,0,canvasWidth, canvasHeight);
    }
    ctx.restore();
	
	

    	
	
    /*
    else
    {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.globalAlpha = .1;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    */
    

            
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
    //beatCondition = (((loudnessAt2K > 225)) /*|| ((loudnessAt2K > 150) && (currentDurration > totalBoltDuration)*/);
    beatCondition = conditionChecks[0] /*|| conditionChecks[1]*/;
    //beatCondition = (((averageLoudness > 135)) || ((loudnessAt2K > 150) /*&& (currentDurration > totalBoltDuration)*/));


    // Popluate lightning Strikes
    if(params.showLightning && (beatCondition || params.constLight)) {

        //console.log(`Avg L: ${averageLoudness} Flash % : ${flashPercentage} Flash Op ${flashOpacity}`);

        //ctx.save();
        

        // Entire Matrix of lightning strikes segments/lines
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

        let xStart = canvasWidth/lightningStrikeLines.length;
        let yStart = canvasHeight/16;
        
        for(let j = 0; j < lightningStrikeLines.length; j++)
        {
            
            let lightningDis = (j *  xStart) + xStart;
            let totalDistance = 0;
            let currentX = utils.getRandom(lightningDis - (xStart/2), lightningDis + (xStart/2));
            let currentY = utils.getRandom(0, yStart);
            ctx.save();
            ctx.beginPath();
            ctx.lineTo(currentX,currentY);

            //console.log(lightningStrikeLines[j]);
            //let totalDistance =  lightningStrikeLines[j].reduce((total,distance: num) => total + num);
            //let averageDistance =  totalDistance/lightningStrikeLines[j].length;
            //console.log(averageDistance);

            for (let i = 0; i < lightningStrikeLines[j].length; i++)
            {
                //if(lightningStrikeLines[j][i].distance> 255) console.log(lightningStrikeLines[j][i].distance);
                //let distancePercent = Math.abs(lightningStrikeLines[j][i].distance) / (3000);
                lightningStrikeLines[j][i] = createLightningSegment(currentX, currentY, lightningStrikeLines[j][i].distance);
                totalDistance += lightningStrikeLines[j][i].distance;
                currentX =  lightningStrikeLines[j][i].xEnd;
                currentY = lightningStrikeLines[j][i].yEnd;
                //ctx.save();
                //ctx.stroke();
                //ctx.lineWidth = (lightningStrikeLines[j].length*(i+1))/10;
                //console.log(lightningStrikeLines[j][i].distance);
                ctx.lineTo(lightningStrikeLines[j][i].xEnd, lightningStrikeLines[j][i].yEnd);
                
                //ctx.closePath();
                //ctx.restore();
            }
            totalDistance  = (totalDistance/(200 * lightningStrikeLines[j].length))
            console.log(totalDistance);
            //let widthPercentage =  Math.abs(totalDistance  - 10) / (20 - 10);
            //if (widthPercentage>1) console.log(lightningStrikeLines[j]);
            //console.log(totalDistance/200);
            ctx.lineWidth = Math.pow(7.5,totalDistance);

            ctx.stroke();

            ctx.closePath();
            ctx.restore();
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
        //ctx.restore();
    }

    // Draw the flash
    if(params.showFlash && beatCondition)
    {
        // Set the flash ammount based on beat
        let flashPercentage =  (averageLoudness - loudnessThreshold) / (maxRangeLoud - loudnessThreshold);

        if(params.showFlash) flashOpacity = flashPercentage * 0.5;
        if(flashOpacity > 0.6) flashOpacity = 0.6;

        // Draw the flash
        //if (flashOpacity > 0.0 && params.showFlash) {
            ctx.save();
            ctx.fillStyle = `rgba(${currentSceneTheme.lightningColor.x}, ${currentSceneTheme.lightningColor.y}, ${currentSceneTheme.lightningColor.z}, ${flashOpacity})`;
            ctx.fillRect(0.0, 0.0, window.innerWidth, window.innerHeight);
            flashOpacity = Math.max(0.0, flashOpacity - 2.0);
            ctx.restore();
        //}
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
        let color = `rgb(${currentSceneTheme.rainColor.x}, ${currentSceneTheme.rainColor.y}, ${currentSceneTheme.rainColor.z})`; 
        drawRain(color);
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
      this.radius = radius;
      this.velocity = utils.createVector(0, 0);
      this.acceleration = utils.createVector(0, accY);
      this.mass = 1;
  
      this.wind = environment.wind;
      this.acceleration = utils.vectorAddition(this.acceleration, this.wind);
    }
  
    draw(color) {
      const { x, y } = this.location;
      const lineWidth=1;
      //const color = `rgb(${currentSceneTheme.rainColor})`
      console.log (color);
      return utils.drawArc(ctx,x, y, this.radius, color,lineWidth,color, true);
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
  const drawRain = function(color) {

    for (let i = 0; i < rainDrops.length; i++) {
         
      rainDrops[i].fall();
      rainDrops[i].draw(color);
      if(rainDrops[i].location.y > canvasHeight || rainDrops[i].location.x > canvasWidth)
      {
        rainDrops.splice(i,1);
        i--;
      }
    }
  
  }


///
/*
Public Variables
*/
///

const setTheme = (theme) => {
    currentSceneTheme =  rainThemes[theme];
}

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

export {setupCanvas,draw,setRandom, setStrike, setTheme};