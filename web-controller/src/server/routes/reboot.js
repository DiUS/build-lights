'use strict'

const winston = require('winston')
const reboot = require('nodejs-system-reboot')

module.exports = (router) => {
  router.get('/reboot', (req, res) => {
    reboot((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not reboot server: %j', err)
        return res.status(500).render('home', { error: 'Could not reboot.' })
      }
      res.render('wait', { message: 'Please wait while I am rebooting.' })
    })
  })
}
