'use strict'

const server = require('./server')

const params = process.argv.slice(2)
const configFile = params[0]
const lightConfigFile = params[1]

const port = process.env.NODE_ENV === 'production' ? 80 : 3000

server(configFile, lightConfigFile).listen(port, () => {
  console.log('Build light web server successfully started.')
})
