

let defaultSprite = {
  frameWidth: 128,
  frameHeight: 192,
  scale: 1
}

class Sprite {
  // id = SERIAL | source = OBJ | xPos = INT
  constructor(id, source, xPos) {
    this.id = id
    this.state = 'idle'
    this.source = source
    this.xPos = xPos
    this.yPos = 10
    this.xVel = 0
    this.frameIndex = 0
    this.count = 0
    this.direction = 'right'
    this.displayMessage = ''
    this.activeMessage = false
    this.timeout = null
  }

  randomState = (spriteSheet) => {
    console.log('RANDOM STATE IS RUNNING')
    this.xVel = Math.floor(Math.random() * 3) - 1
    if (this.xVel > 0)     {
      this.direction = 'right'
      this.state = 'run'
    }
    if (this.xVel === 0)   {
      i = 0
      this.state = 'idle'
    }
    if (this.xVel < 0)     {
      this.direction = 'left'
      this.state = 'run'
    }
    console.log("xVel:", this.xVel, "for ID:", this.id)
    spriteSheet.src = this.source[this.state].img[this.direction]
  }

  animate = (context, spriteSheet, frameWidth, frameHeight, scale, width) => {
    context.drawImage(
      spriteSheet,
      0,
      this.frameIndex * frameHeight,
      frameWidth,
      frameHeight,
      this.xPos,
      this.yPos,
      frameWidth * scale,
      frameHeight * scale
    )
    this.count ++
    if (this.xPos > width) {
      this.xPos = 0 - frameWidth * scale
    }
    if (this.xPos < 0 - frameWidth * scale) {
      this.xPos = width
    }
    this.xPos += this.xVel
    if (this.count > 10) {
      this.frameIndex ++;
      this.count = 0;
    }
    if (this.frameIndex > this.source[this.state].frames - 1) {
      this.frameIndex = 0
    }
  }

  displayText = (contextText, frameWidth, scale, textWidth) => {
    if (this.activeMessage) {
      let xRect = this.xPos + frameWidth * scale / 2 - 80
      if (xRect < 0) xRect = 0
      if (xRect > textWidth - 160) xRect = textWidth - 160
      contextText.roundRect(xRect, 0, 160, 50, 10, this.xPos + frameWidth * scale / 2, textWidth)
      contextText.font = '16px Consolas'
      contextText.fillStyle = 'black'
      if (this.displayMessage.length <= 20) {
        contextText.fillText(this.displayMessage, xRect + 5, 20)
      } else {
        contextText.fillText(this.displayMessage.slice(0,20), xRect + 5, 20)
        contextText.fillText(this.displayMessage.slice(20), xRect + 5, 40)
      }
    }
  }

  getMessage = (messageList) => {
    console.log(`getMessage is running on ID: ${this.id}`)
    if (messageList.length) {
      console.log("messageList has items:", messageList)
      this.activeMessage = true
      this.displayMessage = messageList.shift()
      console.log("display message:", this.displayMessage)
    }
  }

}

let source1 = {
  idle: {
    img: {
      right: '/Blue_witch/B_witch_idle.png',
      left: '/Blue_witch/B_witch_idle_left.png'
    },
    frames: 6
  },
  run: {
    img: {
      right: '/Blue_witch/B_witch_run.png',
      left: '/Blue_witch/B_witch_run_left.png'
    },
    frames: 8
  }
}

let source2 = {
  idle: {
    img: {
      right: '/Magenta_witch/M_witch_idle.png',
      left: '/Magenta_witch/M_witch_idle_left.png'
    },
    frames: 6
  },
  run: {
    img: {
      right: '/Magenta_witch/M_witch_run.png',
      left: '/Magenta_witch/M_witch_run_left.png'
    },
    frames: 8
  }
}

let BlueWitch = new Sprite(1, source1, 633)
let CrimsonWitch = new Sprite(2, source2, 1267)

console.log("BLUE WITCH:", BlueWitch)
console.log("CRIMSON WITCH:", CrimsonWitch)

module.exports = {
  BlueWitch,
  CrimsonWitch,
  defaultSprite
}
