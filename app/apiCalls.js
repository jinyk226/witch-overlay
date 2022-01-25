const axios = require('axios')

const fetchMessages = async (messageList, witchSprite, noMessages) => {
  let { data:messages } = await axios.get('/api/youtube/retrieve-chat')
  if (messages && messages.length) {
    console.log("Received data:", messages)
    messages.forEach((message) => {
      let messageText = message.snippet.textMessageDetails.messageText
      messageList.push(messageText)
    })
    clearInterval(witchSprite.timeout)
    witchSprite.timeout = null
  } else if (!witchSprite.timeout && noMessages) {
    witchSprite.timeout = setTimeout(() => {
      console.log("messageTimeout entered/reset")
      witchSprite.activeMessage = false
      witchSprite.displayMessage = ''
      console.log("setTimeout completed:", this.activeMessage)
      witchSprite.timeout = null
    }, 7000)
  }
}

module.exports = {
  fetchMessages
}
