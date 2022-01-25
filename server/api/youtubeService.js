const { google } = require('googleapis')
const youtube = google.youtube('v3')
const { magenta, redBright } = require('chalk')
const util = require('util')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

let liveChatId
let nextPage
let interval

const save = async (path, data) => {
  await writeFilePromise(path, data)
  console.log(magenta("Successfully saved!"))
}

const read = async (path) => {
  const fileContents = await readFilePromise(path)
  console.log(magenta("Successfully read!"))
  return JSON.parse(fileContents)
}

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
  console.log(magenta("Successfully set credentials"))
  save (path.normalize('../tokens.json'), JSON.stringify(tokens))
}

auth.on('tokens', (tokens) => {
  console.log(magenta('new tokens received'))
  save(path.normalize('../tokens.json'), JSON.stringify(tokens))
})

const checkTokens = async () => {
  const tokens = await read('./tokens.json')
  if (tokens) {
    console.log(magenta('setting tokens'))
    return auth.setCredentials(tokens)
  }
  console.log(redBright('No tokens found'))
}

youtubeService.findActiveChat = async () => {
  const res = await youtube.liveBroadcasts.list({
    auth,
    part: 'snippet',
    broadcastStatus: 'active'
  })
  const latestChat = res.data.items[0];
  liveChatId = latestChat.snippet.liveChatId
  console.log(magenta('ChatId found!'))
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
  console.log(magenta('Chat retrieved successfully! Number of new messages:', newMessages.length))
  if (!nextPage) {
    nextPage = data.nextPageToken
    console.log(redBright('No pageToken passed in; returning empty array'))
    return []
  }
  nextPage = data.nextPageToken
  return newMessages
}

youtubeService.stopTrackingChat = () => {
  clearInterval(interval)
}

checkTokens()

module.exports = youtubeService
