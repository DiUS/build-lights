'use strict'

const winston = require('winston')
const powerOff = require('power-off')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    powerOff((err, stdErr, stdOut) => {
      if (err) {
        winston.log('error', 'Could not shutdown server: %j', err)
        return res.status(500).render('home', { error: 'Could not shutdown.' })
      }
      res.render('wait', { message: 'You can now unplug me.' })
    })
  })
}
