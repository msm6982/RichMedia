const circle = function(x, y, radius, filled) {
    const offset = radius / 2;
    x = x - offset;
    y = y - offset;
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    if (filled) {
      context.stroke();
    }
    context.strokeStyle = '#fff';
    context.closePath();
  }
  
  const createVector = function(x, y) { return { x, y } }
  
  const vectorAddition = function(vectorA, vectorB) {
    if (typeof vectorB === 'number') {
      return { x: vectorA.x + vectorB, y: vectorA.y + vectorB };
    }
    return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
  }
  
  
  const raintype = {
    drizzle: { count: 30, speed: 0.27 },
    light: { count: 100, speed: 0.3 },
    medium: { count: 250, speed: 0.4 },
    downpour: { count: 500, speed: 0.5 },
    afteshower: { count: 3, speed: 0.4 }
  }
  
  var environment = {
    wind: createVector(-0.05, 0),
    raintype: raintype.medium,
  }
  
  class RainParticle {
    constructor(x, accX, accY){
      this.damping = 0.025;
      this.location = createVector(x, canvasHeight); 
      this.radius = 0.4;
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(accX, -(accY * this.damping));
      this.mass = 1;
    }
  
    draw(particles, index) {
      const { x, y } = this.location;
      if (this.acceleration.y >= 0.3) {
        delete particles[index];
        return particles.splice(index, 1)
      }
      return circle(x, y, this.radius, true);
    }
  
    splash() {
      this.velocity = vectorAddition(this.velocity, this.acceleration);
      this.location = vectorAddition(this.location, this.velocity);
      this.acceleration = vectorAddition(this.acceleration, { x: 0, y: 0.12 });
    }
  }
  
  class Raindrop {
    constructor(x, y, radius, accY){
      this.location = createVector(x, y); 
      this.radius = radius;
      this.velocity = createVector(0, 0);
      this.acceleration = createVector(0, accY);
      this.mass = 1;
  
      this.wind = environment.wind;
      this.acceleration = vectorAddition(this.acceleration, this.wind);
    }
  
    draw() {
      const { x, y } = this.location;
      return circle(x, y, this.radius, true);
    }
  
    fall() { 
      if (this.velocity.y <= (environment.raintype.speed * 50)) {
        this.velocity = vectorAddition(this.velocity, this.acceleration);
      }
      this.location = vectorAddition(this.location, this.velocity);
    }
  
  }
  
  const particleX = [-0.12, 0.06, 0, 0.06, 0.12];
  const getParticleX = function() {
    const index = Math.floor(Math.random() * particleX.length);
    return particleX[index];
  }
  
  // init all objects here
  let raindrop = [];
  let particles = [];
  const raindropCount = environment.raintype.count;
  
  for (let i = 0 ; i < raindropCount ; i++) {
    let x = getRandomInteger(2, canvasWidth - 2);
    let y = getRandomInteger(-2000 , 0);
    // let accY = getRandomFloat(1, 5) * 0.05;
    let accY = environment.raintype.speed;
    raindrop[i] = new Raindrop(x, y, 1.3, accY);
  }
  
  // initiate all draw functions here
  const setup = function() {
    for (let i = 0 ; i < raindropCount ; i++) {
      raindrop[i].draw();
    }
  }
  
  // continuous animation loop
  const animate = function() {
    clearCanvas(); // don't remove this
  
    for (let i = 0 ; i < raindropCount ; i++) {
      let { location, radius, velocity } = raindrop[i];
      let rain = checkRaindropCollision(location, radius);
      if (rain.collided) {
        let particle1 = new RainParticle(location.x, getParticleX(), velocity.y);
        particles.push(particle1);
        let particle4 = new RainParticle(location.x, getParticleX(), velocity.y);
        particles.push(particle4);
  
        raindrop[i].relive(rain);
      }
      raindrop[i].fall();
      raindrop[i].draw();
    }
  
    for (let i = 0; i < particles.length; i ++) {
      particles[i].splash();
      particles[i].draw(particles, i);
    }
    requestAnimationFrame(animate);
  }
  
  // animation initiate
  setup();
  requestAnimationFrame(animate);