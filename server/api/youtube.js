const router = require("express").Router();
const youtubeService = require('./youtubeService')
const path = require('path')

  router.get('/', (req, res) => {
    res.redirect(path.normalize("../../"))
  })

  router.get('/auth', (req, res) => {
    youtubeService.getCode(res)
    res.redirect('/')
  })

  router.get('/callback', (req, res) => {
    const { code } = req.query
    youtubeService.getTokensWithCode(code)
    res.redirect('/')
  })

  router.get('/find-active-chat', (req, res) => {
    youtubeService.findActiveChat();
    res.redirect('/')
  })

  router.get('/retrieve-chat', async (req, res) => {
    res.send(await youtubeService.retrieveChat())
  })

module.exports = router
