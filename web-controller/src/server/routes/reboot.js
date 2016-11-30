'use strict'

const winston = require('winston')
const reboot = require('nodejs-system-reboot')

module.exports = (router) => {
  router.get('/reboot', (req, res) => {
    reboot((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not reboot server: %j', err)
        res.status(500).send()
      }

      res.end()
    })
  })
}
