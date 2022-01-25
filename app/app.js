let canvas1 = document.getElementById("canvas-1")
let context1 = canvas1.getContext("2d")
let canvas1Text = document.getElementById("canvas-1-text")
let context1Text = canvas1Text.getContext("2d")

let canvas2 = document.getElementById("canvas-2")
let context2 = canvas1.getContext("2d")
let canvas2Text = document.getElementById("canvas-2-text")
let context2Text = canvas1Text.getContext("2d")

let { BlueWitch, CrimsonWitch, defaultSprite } = require('./spriteData')
let { importRoundRect } = require('./canvasMethods')
let { fetchMessages } = require('./apiCalls')

let messageList = []
let toggle = true

let { frameWidth, frameHeight, scale } = defaultSprite


// SET DEFAULT VALUES AND METHODS

canvas1.width = 1900
canvas1.height = 10 + frameHeight * scale
canvas2.width = 1900
canvas2.height = 10 + frameHeight * scale

const textWidth = canvas1Text.width = 1900
const textHeight = canvas1Text.height = 55
canvas2Text.width = 1900
canvas2Text.height = 55

let spriteSheet1 = new Image()
spriteSheet1.src = BlueWitch.source.idle.img.right

let spriteSheet2 = new Image()
spriteSheet2.src = CrimsonWitch.source.idle.img.right

const startup = async () => {
  setInterval(async() => {
    if (toggle) {
      fetchMessages(messageList, BlueWitch, !messageList.length)
    } else {
      fetchMessages(messageList, CrimsonWitch, !messageList.length)
    }
  }, 3000)
  messageList = []
  setInterval(async() => {
    if (toggle) {
      await BlueWitch.getMessage(messageList)
      toggle = false
    } else {
      await CrimsonWitch.getMessage(messageList)
      toggle = true
    }
  }, 3000)
}

function frame() {
  context1.clearRect(0, 0, canvas1.width, frameHeight)
  context2.clearRect(0, 0, canvas1.width, frameHeight)
  context1Text.clearRect(0,0, textWidth, textHeight)
  context2Text.clearRect(0,0, textWidth, textHeight)
  BlueWitch.displayText(context1Text, frameWidth, scale, textWidth)
  CrimsonWitch.displayText(context2Text, frameWidth, scale, textWidth)
  BlueWitch.animate(context1, spriteSheet1, frameWidth, frameHeight, scale, canvas1.width)
  CrimsonWitch.animate(context2, spriteSheet2, frameWidth, frameHeight, scale, canvas2.width)
  requestAnimationFrame(frame)
}

setInterval(BlueWitch.randomState(spriteSheet1), (Math.floor(Math.random())*2000 + 2000))
setInterval(CrimsonWitch.randomState(spriteSheet2), (Math.floor(Math.random())*2000 + 2000))
importRoundRect()
startup()
frame()
