const { google } = require('googleapis')
const youtube = google.youtube('v3')
const util = require('util')
const fs = require('fs')
require('dotenv').config()

const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

let liveChatId
let nextPage
const intervalTime = 5000
let interval



const save = async (path, data) => {
  await writeFilePromise(path, data)
  console.log("Successfully saved!")
}

const read = async (path) => {
  const fileContents = await readFilePromise(path)
  console.log("Successfully read!")
  return JSON.parse(fileContents)
}


// const Oauth2 = google.auth.Oauth2
const {clientID, clientSecret} = process.env
const redirectURI = 'http://localhost:8000/api/youtube/callback'
let auth = new google.auth.OAuth2(clientID, clientSecret, redirectURI)


const scope = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl'
]

const youtubeService = {}

youtubeService.getCode = (res) => {
  const authUrl = auth.generateAuthUrl({
    access_type: "offline",
    scope
  })
  res.redirect(authUrl)
}

youtubeService.getTokensWithCode = async (code) => {
  const credentials = await auth.getToken(code)
  youtubeService.authorize(credentials)
}

youtubeService.authorize = ({ tokens }) => {
  auth.setCredentials(tokens)
  console.log("Successfully set credentials")
  console.log("Tokens:", tokens)
  save ('./tokens.json', JSON.stringify(tokens))
}

auth.on('tokens', (tokens) => {
  console.log('new tokens received')
  save('../../tokens.json', JSON.stringify(tokens))
})

const checkTokens = async () => {
  const tokens = await read('./tokens.json')
  if (tokens) {
    console.log('setting tokens')
    return auth.setCredentials(tokens)
  }
  console.log('No tokens found')
}

youtubeService.findActiveChat = async () => {
  const res = await youtube.liveBroadcasts.list({
    auth,
    part: 'snippet',
    broadcastStatus: 'active'
  })
  const latestChat = res.data.items[0];
  liveChatId = latestChat.snippet.liveChatId
  console.log('ChatId found:', liveChatId)
}

youtubeService.retrieveChat = async () => {
  const res = await youtube.liveChatMessages.list({
    auth,
    part: 'snippet',
    liveChatId,
    pageToken: nextPage
  })
  const { data } = res
  const newMessages = data.items;
  nextPage = data.nextPageToken
  console.log('Next page:', nextPage)
  console.log('Number of new messages:', newMessages.length)
  console.log(newMessages[0])
  return newMessages
}

youtubeService.stopTrackingChat = () => {
  clearInterval(interval)
}

checkTokens()

module.exports = youtubeService
