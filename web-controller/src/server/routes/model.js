'use strict'

const fs = require('fs')
const fsOpts = { encoding: 'utf8' }

module.exports = (router, configFile) => {
  router.get('/model', (req, res) => {
    const configuration = fs.readFileSync(configFile, fsOpts)
    res.json(JSON.parse(configuration))
  })

  router.put('/model', (req, res) => {
    const requestData = req.body || {}
    let model = JSON.parse(fs.readFileSync(configFile, fsOpts))

    if (requestData.tabChange && model.selectedTool !== requestData.tabChange) {
      model.selectedTool = requestData.tabChange
    }

    if (requestData.connectionType) {
      model.tools[0].configuration.connectionType = requestData.connectionType
    }

    if (requestData.dhcp) {
      model.tools[0].configuration.dhcp = (requestData.dhcp === 'true')
    }

    if (requestData.newJob) {
      model.tools[1].configuration.items.push({ name: '', path: '', active: false })
    }

    if (requestData.deleteJob) {
      model.tools[1].configuration.items.splice(requestData.deleteJob, 1)
    }

    if (requestData.save) {
      require(`../services/${requestData.save}`).persist(requestData.payload)
    }

    model.lastUpdated = new Date().toJSON()

    fs.writeFileSync(configFile, JSON.stringify(model))
    res.json(model)
  })
}
