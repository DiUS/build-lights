'use strict'

const cp = require('child_process')

module.exports = (router) => {
  router.get('/shutdown', (req, res) => {
    cp.execSync('shutdown -k -h now')
    res.json({ shutdown: true, countdown: 15 })
    cp.execSync('shutdown -h now')
  })
}
