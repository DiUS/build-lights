'use strict'

const cp = require('child_process')

module.exports = (router) => {
  router.get('/reboot', (req, res) => {
    cp.execSync('shutdown -k -r now')
    res.json({ reboot: true, countdown: 30 })
    cp.execSync('shutdown -r now')
  })
}
