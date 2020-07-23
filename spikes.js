let fr = 60;

let birdDiameter = 50;
let birdRadius = 25;

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
let nndata;
let movingRight;

const round_ = (num) => Math.round(num * 100) / 100;

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
    rightProtrusion += 0.05 * (xVel > 0 ? 1 : -1);
    if (rightProtrusion >= 1) {
      rightProtrusion = 1;
      spikesMoving = false;
      leftSpikes = randomSeq(5 + Math.floor(score / 3));
    } else if (rightProtrusion <= 0) {
      rightProtrusion = 0;
      spikesMoving = false;
      rightSpikes = randomSeq(5 + Math.floor(score / 3));
    }
  }

  birdX += xVel;
  birdY += yVel;

  if (yVel <= 4.5) yVel += g;

  if (birdX >= width - borderWidth - birdRadius || birdX <= borderWidth + birdRadius) {
    score++;
    xVel *= -1;
    spikesMoving = true;
  }

  if (birdY > height - borderHeight - birdRadius || birdY < borderHeight + birdRadius)
    reset();

  rightCollisions = renderSpikes(rightSpikes, false, rightProtrusion);
  leftCollisions = renderSpikes(leftSpikes, true, 1 - rightProtrusion);
  if (rightCollisions || leftCollisions) {
    reset();
  }

  rightSpikesNN = Array(13);
  for (let i = 0; i < rightSpikesNN.length; i++)
    rightSpikesNN[i] = rightSpikes.includes(i) ? 1 : 0;

  leftSpikesNN = Array(13);
  for (let i = 0; i < leftSpikesNN.length; i++)
    leftSpikesNN[i] = leftSpikes.includes(i) ? 1 : 0;

  movingRight = xVel > 0,

  nndata = [
    ...(movingRight ? rightSpikesNN : leftSpikesNN),
    round_(
      (birdX - borderWidth - birdRadius) / (width - 2 * borderWidth - birdDiameter)
    ),
    round_(
      (birdY - borderHeight - birdRadius) / (height - 2 * borderHeight - birdDiameter)
    ),
    round_((yVel + 4.5) / 9),
    movingRight ? 1 : 0,
  ];
  print(nndata);
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
