'use strict'

const winston = require('winston')
const cp = require('child_process')

module.exports = (router) => {
  router.get('/reboot', (req, res) => {
    try {
      cp.execSync('shutdown -k -r now')
      res.send()
      cp.execSync('shutdown -r now')
    } catch (e) {
      winston.log('error', 'Could not reboot server: %j', e)
      res.status(500).send()
    }
  })
}
