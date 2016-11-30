'use strict'

const winston = require('winston')
const powerOff = require('power-off')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    powerOff((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not shutdown server: %j', err)
        res.status(500).send()
      }

      res.end()
    })
  })
}
