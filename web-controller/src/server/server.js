'use strict'

require('nodejs-dashboard')

const fs = require('fs')
const helmet = require('helmet')
const logger = require('./logger')
const winston = require('winston')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const compression = require('compression')
const expressHandlebars = require('express-handlebars')
const jobStore = require('./store/jobs')

module.exports = (configFile, lightConfigFile) => {
  // when config file does not exist
  // prevents the server from starting
  fs.lstatSync(configFile)

  // same when light config file does not exist
  fs.lstatSync(lightConfigFile)

  app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: 'src/server/views/layouts'
  }))

  app.set('view engine', 'handlebars')
  app.set('views', `${process.cwd()}/src/server/views`)

  app.use(logger.accessLogger)
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(helmet())
  app.use(compression())
  app.use('/static', express.static(`${process.cwd()}/src/server/public`))

  const router = express.Router({ caseSensitive: true })

  require('./routes/home')(router)
  require('./routes/reboot')(router)
  require('./routes/shutdown')(router)
  require('./routes/model')(router, configFile, lightConfigFile)

  app.use(router)
  app.use(logger.errorLogger)

  app.use((err, req, res, next) => {
    res.status(500)
    winston.error('could not execute action: %j', err)

    let payload = JSON.parse(fs.readFileSync(configFile, { encoding: 'utf8' }))
    payload.result = { success: false, message: err.message }

    res.json(payload)
  })

  jobStore.listenForChanges((change) => {
    io.emit('job', change)
  })

  return http
}
