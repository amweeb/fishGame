//fishing rod positions
let fishingRodX;
let fishingLineY;
//store fish object
let fish;
//number of fish caught
let fishCaught = 0;
//game info
let catchThreshold;
let clicks = 0;
let gameState = "pause";
 // time when the fish meets the line
let stopTime = 0;

function setup() {
  createCanvas(700, 700);
  fishingRodX = width / 2;
  fishingLineY = height / 2;
  fish = new Fish();
  // Set a new catch threshold between 1 and 5
  catchThreshold = random(1, 5);
}
//preload sound
function preload() {
  biteSound = loadSound('bite.mp3');
  scoreSound = loadSound('score.mp3');
}

function draw() {
  //create bg
  background(135, 205, 250);
  fill(255, 223, 0);
  stroke("white");
  strokeWeight(30);
  line(0, height / 2, width, height / 2);
  noStroke();
  ellipse(100, 100, 80, 80);
  fill(0, 0, 139);
  rect(0, height / 2, width, height / 2);

  //create rod and line
  stroke(0);
  strokeWeight(4);
  stroke("white");
  //interactive line 
  line(fishingRodX, 0, fishingRodX, height / 2);
  line(fishingRodX, height / 2, fishingRodX, fishingLineY);
  stroke("black");
  strokeWeight(4);
  stroke(128); // grey color for the top part
  line(fishingRodX, 0, fishingRodX - 50, height / 2 - 60);
  stroke(0)
  strokeWeight(8);
  line(fishingRodX - 50, height / 2 - 50, fishingRodX - 60, height / 2);
  strokeWeight(4);
  fill("red");
  arc(fishingRodX, fishingLineY, 20, 20, PI, TWO_PI);
  fill(150);
  ellipse(fishingRodX - 50, height / 2 - 60, 30, 30);
  fill(100);
  ellipse(fishingRodX - 50, height / 2 - 60, 20, 20);
  stroke(0);
  strokeWeight(6);
  line(fishingRodX - 50, height / 2 - 60, fishingRodX - 50 - 25, height / 2 - 60);

 


  //draw chest
  strokeWeight(4);
  fill("red");
  rect(50, height / 2 - 80, 100, 80);
  fill("white");
  rect(50, height / 2 - 100, 100, 20);
  line(45, height / 2 - 60, 45, height / 2 - 20);
  line(155, height / 2 - 60, 155, height / 2 - 20);
  fill(0);
  rect(95, height / 2 - 100, 10, 10);
// fish caught display
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(`Fish Caught: ${fishCaught}`, 100, height / 2 - 40);
  

  // check if the game is in fishing state
  if (gameState === "fishing") {
    fishingLineY = constrain(mouseY, height / 2, height);
  }
  fish.display();
  fish.move();

  // Check if the fishing line meets the fish
  if (
    gameState === "fishing" &&
    dist(fishingRodX, fishingLineY, fish.x, fish.y) < 20
  ) {
    fill(255);
    textSize(20);
    text(`Click: ${catchThreshold} times!`, mouseX, mouseY);

    // slows fish when meeting line
    if (stopTime === 0) {
      stopTime = millis();
      fish.stop();
      biteSound.play();
    } else if (millis() - stopTime >= 1) {
      fish.resume();
      stopTime = 0;
    }
  }

  //instructions @ pause
  if (gameState === "pause") {
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Click and move cursor to cast!", width / 2, height / 2 - 20);
    text(
      "Click many times to reel in when a fish bites!",
      width / 2,
      height / 2 + 20
    );
  } else if (gameState === "caught") {
    textSize(20);
    textAlign(CENTER, CENTER);
    fill(255);
    text("Caught!", width / 2, height / 2 - 20);
  }
}

function mousePressed() {
  if (gameState === "pause") {
    gameState = "fishing";
    fishingLineY = height / 2;
    // Reset clicks when starting to fish
    clicks = 0;
    // Set a new catch threshold between 1 and 5
    catchThreshold = int(random(1, 5));
  } else if (gameState === "fishing") {
    clicks++;
    if (
      dist(fishingRodX, fishingLineY, fish.x, fish.y) < 20 &&
      clicks >= catchThreshold
    ) {
      gameState = "caught";
      fishCaught++;
      fish.reset();
      //play sound
      scoreSound.play();
      // Reset clicks after catching a fish
      clicks = 0;
    }
  } else if (gameState === "caught") {
    gameState = "pause";
  }
}
//indicate fish movement
class Fish {
  constructor() {
    this.reset();
    this.isStopped = false;
  }
//fish resets when caught
  reset() {
    this.x = random(width,width*1.5);
    this.y = random(height / 2 + 50, height - 50);
    this.size = random(20, 40);
    this.speed = random(1, 3);
    this.isStopped = false;
  }
//fish display
  display() {
    fill(255, 165, 0); 
    ellipse(this.x, this.y, this.size, this.size / 2);
    triangle(
      this.x + this.size / 2,
      this.y,
      this.x + this.size / 2 + 10,
      this.y - 10,
      this.x + this.size / 2 + 10,
      this.y + 10
    );
  }
// fish movement and reset location
  move() {
    if (!this.isStopped) {
      this.x -= this.speed;
      if (this.x < -this.size) {
        this.reset();
      }
    }
  }

  stop() {
    this.isStopped = true;
  }

  resume() {
    this.isStopped = false;
  }
}
