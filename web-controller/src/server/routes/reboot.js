'use strict'

const cp = require('child_process')
const logger = require('../logger')

module.exports = (router) => {
  router.get('/reboot', (req, res) => {
    cp.execSync('shutdown -k -r now')
    logger.info('User able to perform reboot action. Rebootting the device.')
    res.json({ reboot: true, countdown: 30 })
    cp.execSync('shutdown -r now')
  })
}
