'use strict'

require('nodejs-dashboard')

const fs = require('fs')
const helmet = require('helmet')
const logger = require('./logger')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const expressHandlebars = require('express-handlebars')

module.exports = (configFile) => {
  // when config file does not exist
  // prevents the server from starting
  fs.lstatSync(configFile)

  const app = express()

  app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    layoutsDir: 'src/server/views/layouts',
    partialsDir: 'src/server/views/partials'
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

  router.get('/', (req, res) => {
    res.render('home')
  })

  require('./routes/reboot')(router)
  require('./routes/shutdown')(router)
  require('./routes/model')(router, configFile)

  app.use(router)

  app.use(logger.errorLogger)

  app.use((err, req, res, next) => {
    res.status(500)
    res.json(err)
  })

  return app
}
