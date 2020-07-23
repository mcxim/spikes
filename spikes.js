let fr = 60;

let birdDiameter = 50;

let score;

let width = 400;
let height = 550;

let borderWidth = 40;
let borderHeight = 40;

let xVel;
let yVel;

let birdX;
let birdY;

let g = 0.2;

let spikeWidth = 20;
let spikeHeight = 24;

let rightProtrusion;

let rightSpikes;
let leftSpikes;

let spikesMoving;

let x;
let distances;

function setup() {
  createCanvas(400, 550);
  frameRate(fr);
  reset();
}

function draw() {
  background(100);

  fill(200);
  noStroke();
  rect(borderWidth, borderHeight, width - 2 * borderWidth, height - 2 * borderHeight);

  fill(100);
  ellipse(width / 2, height / 2, width / 2.5, width / 2.5);

  textSize(50);
  fill("white");
  textAlign(CENTER, CENTER);
  text(score.toString(), width / 2, height / 2);

  fill("red");
  ellipse(birdX, birdY, birdDiameter, birdDiameter);

  if (spikesMoving) {
    rightProtrusion += 0.04 * (xVel > 0 ? 1 : -1);
    if (rightProtrusion >= 1) {
      rightProtrusion = 1;
      movingSpikes = false;
      leftSpikes = randomSeq(5 + Math.floor(score / 3));
    }
    if (rightProtrusion <= 0) {
      rightProtrusion = 0;
      movingSpikes = false;
      rightSpikes = randomSeq(5 + Math.floor(score / 3));
    }
  }

  birdX += xVel;
  birdY += yVel;

  if (yVel <= 4) yVel += g;

  if (
    birdX >= width - borderWidth - birdDiameter / 2 ||
    birdX <= borderWidth + birdDiameter / 2
  ) {
    score++;
    xVel *= -1;
    spikesMoving = true;
  }

  if (
    birdY > height - borderHeight - birdDiameter / 2 ||
    birdY < borderHeight + birdDiameter / 2
  )
    reset();

  rightCollisions = renderSpikes(rightSpikes, false, rightProtrusion);
  leftCollisions = renderSpikes(leftSpikes, true, 1 - rightProtrusion);
  if (rightCollisions || leftCollisions) {
    reset();
  }
}

function reset() {
  score = 0;
  birdX = width / 2;
  birdY = height / 2;
  xVel = 2;
  yVel = -3;
  rightProtrusion = 1.0;
  spikesMoving = false;
  rightSpikes = randomSeq(6);
  leftSpikes = randomSeq(6);
}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    yVel = -4.5;
  }
}

const renderSpikes = (spikes, left, protrusion) => {
  fill(100);
  prot = spikeWidth * (1 - protrusion);
  distances = [];
  for (spike of spikes) {
    offset = spike * spikeHeight * 1.5 + borderHeight + 7;
    if (left) {
      x = borderWidth + spikeWidth - prot;
      triangle(
        borderWidth - prot,
        offset,
        borderWidth - prot,
        offset + spikeHeight,
        x,
        offset + 0.5 * spikeHeight
      );
    } else {
      x = width - borderWidth - spikeWidth + prot;
      triangle(
        width - borderWidth + prot,
        offset,
        width - borderWidth + prot,
        offset + spikeHeight,
        x,
        offset + 0.5 * spikeHeight
      );
    }
    distances.push(dist(x, offset + 0.5 * spikeHeight, birdX, birdY));
  }
  return distances.some((dist) => dist < birdDiameter / 2);
};

function randomSeq(n) {
  arr = [...Array(13).keys()];
  res = [];
  for (var i = 0; i < n; i++) {
    r = Math.floor(random() * arr.length);
    res.push(arr[r]);
    arr.splice(r, 1);
  }
  return res;
}
