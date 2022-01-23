

const canvas1 = document.getElementById("canvas-1")
const context1 = canvas1.getContext("2d")

const canvas1Text = document.getElementById("canvas-1-text")
const context1Text = canvas1Text.getContext("2d")

const frameWidth = 32
const frameHeight = 48
const scale = 2
let xPos = 100
let yPos = 10
let xVel = 0
let frameIndex =  0
let maxFrameIndex = 5
let count = 0
let direction = 0

canvas1.width = 1900
let width = canvas1.width
canvas1.height = yPos + frameHeight * scale
let height = canvas1.height

const textWidth = canvas1Text.width = 1900
const textHeight = canvas1Text.height = 55


CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r, a) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  if (a <= 15) a = 15
  if (a >= textWidth - 15) a = textWidth - 15
  this.beginPath();
  this.strokeStyle = 'black'
  this.fillStyle = 'white'
  this.lineWidth = 3
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  this.fill()
  this.stroke();
  this.beginPath();
  this.moveTo(a-5, y+h-2);
  this.lineTo(a, y+h+5);
  this.lineTo(a+5, y+h-2);
  this.stroke();
  this.fill();
  return this;
}

// Set sprite data source
let source = [
  {
    name: 'idle',
    img: ['/Blue_witch/B_witch_idle.png', '/Blue_witch/B_witch_idle_left.png'],
    frames: 6
  },
  {
    name: 'run',
    img: ['/Blue_witch/B_witch_run.png', '/Blue_witch/B_witch_run_left.png'],
    frames: 8
  }
]

// Set state based off of source
const randomState = () => {
  let i = 1
  xVel = Math.floor(Math.random() * 3) - 1
  if (xVel > 0)     direction = 0
  if (xVel === 0)   i = 0
  if (xVel < 0)     direction = 1

  maxFrameIndex = source[i].frames - 1
  spriteSheet.src = source[i].img[direction]
}

const spriteSheet = new Image()
spriteSheet.src = source[0].img[direction]

setInterval(randomState, (Math.floor(Math.random())*2000 + 2000))

let animate = () => {
  context1.drawImage(
    spriteSheet,
    0,
    frameIndex * frameHeight,
    frameWidth,
    frameHeight,
    xPos,
    yPos,
    frameWidth * scale,
    frameHeight * scale
  )
  count ++
  if (xPos > width) {
    xPos = 0 - frameWidth * scale
  }
  if (xPos < 0 - frameWidth * scale) {
    xPos = width
  }
  xPos += xVel
  if (count > 10) {
    frameIndex ++;
    count = 0;
  }
  if (frameIndex > maxFrameIndex) {
    frameIndex = 0
  }
}

let displayText = () => {
  let rectWidth = xPos + frameWidth - 80
  if (rectWidth < 0) rectWidth = 0
  if (rectWidth > textWidth - 160) rectWidth = textWidth - 160
  context1Text.roundRect(rectWidth, 0, 160, 50, 10, xPos + frameWidth * scale / 2)
  context1Text.font = '16px Consolas'
  context1Text.fillStyle = 'black'
  // context1Text.textAlign = 'center'
  context1Text.fillText("Updating text", rectWidth + 5, 20)
  // context1Text.fillText("Multilines boii", rectWidth + 5, 40)
}

function frame() {
  context1.clearRect(0, 0, width, 100)
  context1Text.clearRect(0,0, textWidth, textHeight)
  displayText()
  animate()
  requestAnimationFrame(frame)
}

frame()
