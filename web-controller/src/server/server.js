'use strict'

require('nodejs-dashboard')

const fs = require('fs')
const winston = require('winston')
const express = require('express')
const powerOff = require('power-off')
const bodyParser = require('body-parser')
const compression = require('compression')
const reboot = require('nodejs-system-reboot')
const expressWinston = require('express-winston')
const expressHandlebars = require('express-handlebars')

module.exports = (configFile) => {
  // when config file does not exist
  // prevents the server from starting
  fs.lstatSync(configFile)

  const app = express()

  const handlebarsConfig = {
    defaultLayout: 'main',
    layoutsDir: 'src/server/views/layouts',
    partialsDir: 'src/server/views/partials'
  }

  app.engine('handlebars', expressHandlebars(handlebarsConfig))
  app.set('view engine', 'handlebars')
  app.set('views', `${process.cwd()}/src/server/views`)

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(expressWinston.logger({
    transports: [
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

  app.use(compression())
  app.use('/static', express.static(`${process.cwd()}/src/server/public`))

  app.get('/', (req, res) => {
    res.render('home')
  })

  app.get('/reboot', (req, res) => {
    reboot((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not reboot server: %j', err)
        return res.render('home', { error: 'Could not reboot.' })
      }
      res.end()
    })
  })

  app.get('/shutdown', (req, res) => {
    powerOff((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not shutdown server: %j', err)
        return res.render('home', { error: 'Could not shutdown.' })
      }
      res.end()
    })
  })

  app.get('/model', (req, res) => {
    const configuration = fs.readFileSync(configFile, { encoding: 'utf8' })
    res.json(JSON.parse(configuration))
  })

  app.put('/model', (req, res) => {
    const requestData = req.body || {}
    let model = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }))

    if (requestData.tabChange && model.selectedTool !== requestData.tabChange) {
      model.selectedTool = requestData.tabChange
    }

    if (requestData.connectionType) {
      model.tools[0].configuration.connectionType = requestData.connectionType
    }

    if (requestData.dhcp) {
      model.tools[0].configuration.dhcp = (requestData.dhcp === 'true')
    }

    if (requestData.newJob) {
      model.tools[1].configuration.items.push({ name: '', path: '', active: false })
    }

    if (requestData.deleteJob) {
      model.tools[1].configuration.items.splice(requestData.deleteJob, 1)
    }

    model.lastUpdated = new Date().toJSON()

    fs.writeFileSync(configFile, JSON.stringify(model))
    res.json(model)
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

  app.use((err, req, res, next) => {
    res.status(500)
    res.json(err)
  })

  return app
}
