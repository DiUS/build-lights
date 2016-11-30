'use strict'

const fs = require('fs')
const logger = require('winston')
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
      logger.info('Updating active tab. Payload: %j', requestData)
      model.selectedTool = requestData.tabChange
    }

    if (requestData.newJob) {
      logger.info('Adding new job to be monitored. Payload: %j', requestData)
      const jobsIdx = findIndex(model.tools, { name: 'jobs to monitor' })
      model.tools[jobsIdx].configuration.items.push({ name: '', path: '' })
    }

    if (requestData.deleteJob) {
      logger.info('Removing job being monitored. Payload: %j', requestData)
      const jobsIdx = findIndex(model.tools, { name: 'jobs to monitor' })
      model.tools[jobsIdx].configuration.items.splice(requestData.deleteJob, 1)
    }

    let persistedConfiguration = false
    if (requestData.save) {
      logger.info('About to save a configuration. Payload: %j', requestData)
      const moduleService = require(`../services/${requestData.save}`)
      moduleService.persist(requestData.payload)
      moduleService.mutateModel(model, requestData.payload)
      model.lastUpdated = new Date().toJSON()

      persistedConfiguration = true
    }

    fs.writeFileSync(configFile, JSON.stringify(model))
    logger.info('Committed configuration to file.')

    if (persistedConfiguration) {
      model.result = { success: true, message: 'Configuration successfully persisted.' }
    }

    res.json(model)
  })
}
