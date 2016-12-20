'use strict'

const cp = require('child_process')
const logger = require('../logger')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    cp.execSync('shutdown -k -h now')
    logger.info('User able to perform shutdown action. Shutting down the device.')
    res.json({ shutdown: true, countdown: 15 })
    cp.execSync('shutdown -h now')
  })
}
