'use strict'

const server = require('./server')

const params = process.argv.slice(2)
const configFile = params[0]
const lightConfigFile = params[1]

server(configFile, lightConfigFile).listen(3000, () => {
  console.log('Build light web server successfully started.')
})
