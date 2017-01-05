'use strict'

const cp = require('child_process')
const logger = require('winston')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    cp.execSync('shutdown -k -h now')
    logger.info('User able to perform shutdown action. Shutting down the device.')
    res.json({ shutdown: true, countdown: 15 })
    // delaying action so browser can load resources
    setTimeout(() => { cp.execSync('shutdown -h now') }, 300)
  })
}
