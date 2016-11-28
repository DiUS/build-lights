'use strict'

const fs = require('fs')
const findIndex = require('lodash.findindex')
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

    if (requestData.newJob) {
      const jobsIdx = findIndex(model.tools, { name: 'jobs to monitor' })
      model.tools[jobsIdx].configuration.items.push({ name: '', path: '' })
    }

    if (requestData.deleteJob) {
      const jobsIdx = findIndex(model.tools, { name: 'jobs to monitor' })
      model.tools[jobsIdx].configuration.items.splice(requestData.deleteJob, 1)
    }

    if (requestData.save) {
      require(`../services/${requestData.save}`).persist(requestData.payload)
    }

    model.lastUpdated = new Date().toJSON()

    fs.writeFileSync(configFile, JSON.stringify(model))
    res.json(model)
  })
}
