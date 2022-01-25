const express = require('express')
const path = require('path')

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/witch-overlay', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/overlay1.html'))
})

app.use('/api', require('./api'))

app.use((req, res, next) => {
  res.redirect('/')
})

app.use((err, req, res, next) => {
  res.send(err.message || 'Internal server error')
})

module.exports = app
