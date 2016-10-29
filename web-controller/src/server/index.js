'use strict'

const server = require('./server')
const configFile = process.argv.slice(2)[0]

server(configFile).listen(3000, () => {
  console.log('Build light web server successfully started.')
})
