'use strict'

require('nodejs-dashboard')

const winston = require('winston')
const express = require('express')
const powerOff = require('power-off')
const compression = require('compression')
const reboot = require('nodejs-system-reboot')
const expressWinston = require('express-winston')
const expressHandlebars = require('express-handlebars')

const app = express()

const handlebarsConfig = {
  defaultLayout: 'main',
  layoutsDir: 'src/server/views/layouts',
  partialsDir: 'src/server/views/partials'
}

app.engine('handlebars', expressHandlebars(handlebarsConfig))
app.set('view engine', 'handlebars')
app.set('views', `${process.cwd()}/src/server/views`)

app.use('/static', express.static(`${process.cwd()}/src/server/public`))
app.use(compression())

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize: true
    }),
    new winston.transports.File({
      json: true,
      colorize: false,
      filename: 'access.log'
    })
  ],
  meta: true,
  expressFormat: true,
  colorize: true
}))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/reboot', (req, res) => {
  reboot((err, stdErr, stdOut) => {
    if (err) {
      // TODO log error
      return res.render('home', { error: 'Could not reboot.' })
    }
    res.end()
  })
})

app.get('/shutdown', (req, res) => {
  powerOff((err, stdErr, stdOut) => {
    if (err) {
      // TODO log error
      return res.render('home', { error: 'Could not shutdown.' })
    }
    res.end()
  })
})

app.put('/save', (req, res) => {

})

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize: true
    }),
    new winston.transports.File({
      json: true,
      colorize: false,
      filename: 'error.log'
    })
  ]
}))

module.exports = app
