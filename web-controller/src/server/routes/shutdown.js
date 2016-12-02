'use strict'

const winston = require('winston')
const cp = require('child_process')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    try {
      cp.execSync('shutdown -k -h now')
      res.send()
      cp.execSync('shutdown -h now')
    } catch (e) {
      winston.log('error', 'Could not shutdown server: %j', e)
      res.status(500).send()
    }
  })
}
