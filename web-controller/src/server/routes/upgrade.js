'use strict'

const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const PROJECT_DIR = path.resolve(process.cwd(), '..')

module.exports = (router, configFile) => {
  router.get('/upgrade', (req, res) => {
    let model = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    const result = cp.execSync(`cd ${PROJECT_DIR} && git pull`).toString()

    if (result.indexOf('Already up-to-date') > -1) {
      model.result = { success: true, message: 'Software already on its latest version.' }
    } else {
      model.result = { success: true, message: 'Software updated. Please reboot the device for changes to take effect.' }
    }

    res.json(model)
  })
}
