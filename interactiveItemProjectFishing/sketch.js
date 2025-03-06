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
  createCanvas(400, 400);
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
  fill(0, 0, 139);
  rect(0, height / 2, width, height / 2);

  //create rod and line
  stroke(0);
  strokeWeight(4);
  line(fishingRodX, 0, fishingRodX, height / 2);
  line(fishingRodX, height / 2, fishingRodX, fishingLineY);
  stroke(0);
  strokeWeight(4);
  line(fishingRodX, 0, fishingRodX - 50, height / 2); 
  fill("red");
  circle(fishingRodX - 50, 160, 20);
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
    text(`Click: ${catchThreshold} times!`, width / 2 - 100, height / 2 - 20);

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

  //game info
  fill(255);
  textSize(20);
  text(`Fish Caught: ${fishCaught}`, 20, 30);

  //instructions @ pause
  if (gameState === "pause") {
    text("Move cursor to cast!", width / 2 - 100, height / 2 - 20);
    text(
      "Click many times to reel in when a fish bites!",
      width / 2 - 200,
      height / 2 + 20
    );
  } else if (gameState === "caught") {
    text("Caught!", width / 2 - 80, height / 2 - 20);
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
