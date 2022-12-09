// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const createVector = function(x, y) { return { x, y } }
  
  const vectorAddition = function(vectorA, vectorB) {
    if (typeof vectorB === 'number') {
      return { x: vectorA.x + vectorB, y: vectorA.y + vectorB };
    }
    return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
  }

  const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
      const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };


  function drawArc(ctx, startX, startY, radius, fillStyle = "white", lineWidth = 1, strokeStyle ="white", fill = true){
    
    let startAngle = 0;
    let endAngle = Math.PI * 2
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.beginPath();

    ctx.arc(startX,startY, radius, startAngle, endAngle);

    
    // Fill rect
    if (fill) ctx.stroke();
    // Add Line width
    if(lineWidth > 0){
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
    }
    ctx.closePath();
    ctx.restore();

}

  // https://www.folkstalk.com/2022/09/javascript-lerp-with-code-examples.html
  const lerp = (A, B, t) => {
    return A + (B - A) * t;
  }
  
  
  const goFullscreen = (element) => {
      if (element.requestFullscreen) {
          element.requestFullscreen();
      } else if (element.mozRequestFullscreen) {
          element.mozRequestFullscreen();
      } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
          element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
      }
      // .. and do nothing if the method is not supported
  };
  
  export {createVector, vectorAddition,drawArc,getRandom,makeColor, getRandomColor, getLinearGradient, goFullscreen, lerp};