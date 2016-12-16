'use strict'

const fs = require('fs')
const logger = require('winston')
const fetch = require('node-fetch')

const jobStore = require('../store/jobs')

const fsOpts = { encoding: 'utf8' }

function restartLights () {
  return fetch('http://localhost:9001/index.html?processname=light_controller&action=restart')
}

module.exports = (router, configFile, lightConfigFile) => {
  router.get('/model', (req, res) => {
    const configuration = fs.readFileSync(configFile, fsOpts)
    let result = JSON.parse(configuration)

    // eventually all config will come from rethink. For now lets just jam in the bit we've changed
    jobStore.list().then((configuredJobs) => {
      result.tools.find((tool) => {
        return tool.name === 'jobs to monitor'
      }).configuration.items = configuredJobs

      res.json(result)
    })
  })

  router.put('/model', (req, res) => {
    const requestData = req.body || {}
    let model = JSON.parse(fs.readFileSync(configFile, fsOpts))

    if (requestData.tabChange && model.selectedTool !== requestData.tabChange) {
      logger.info('Updating active tab. Payload: "%j"', requestData)
      model.selectedTool = requestData.tabChange
    }

    if (requestData.save) {
      logger.info('About to save a configuration. Payload: "%j"', requestData)
      const moduleService = require(`../services/${requestData.save}`)
      moduleService.persist(requestData.payload, lightConfigFile)
      moduleService.mutateModel(model, requestData.payload)
      model.lastUpdated = new Date().toJSON()
    }

    fs.writeFileSync(configFile, JSON.stringify(model, null, 2))
    logger.info('Committed configuration to file.')

    if (requestData.save) {
      if (process.env['DISABLE_RESTART_ON_SAVE'] === 'true') {
        model.result = { success: true, message: 'Configuration successfully persisted.' }
        res.json(model)
      } else {
        restartLights().then(() => {
          model.result = { success: true, message: 'Configuration successfully persisted.' }
        }).catch(err => {
          logger.error(err)
          model.result = { success: false, message: 'Configuration successfully persisted, but unable to restart lights.' }
          res.json(model)
        })
      }
    } else {
      res.json(model)
    }
  })
}
