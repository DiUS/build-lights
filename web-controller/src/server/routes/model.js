'use strict'

const fs = require('fs')
const logger = require('winston')
const fetch = require('node-fetch')

const fsOpts = { encoding: 'utf8' }

function restartLights () {
  return fetch('http://localhost:9001/index.html?processname=light_controller&action=restart')
}

module.exports = (router, configFile, lightConfigFile) => {
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

    if (requestData.save) {
      logger.info('About to save a configuration. Payload: %j', requestData)
      const moduleService = require(`../services/${requestData.save}`)
      moduleService.persist(requestData.payload, lightConfigFile)
      moduleService.mutateModel(model, requestData.payload)
      model.lastUpdated = new Date().toJSON()
    }

    fs.writeFileSync(configFile, JSON.stringify(model, null, 2))
    logger.info('Committed configuration to file.')

    if (requestData.save) {
      restartLights().then(() => {
        model.result = { success: true, message: 'Configuration successfully persisted.' }
        res.json(model)
      }).catch(err => {
        logger.error(err)
        model.result = { success: false, message: 'Configuration successfully persisted, but unable to restart lights.' }
        res.json(model)
      })
    } else {
      res.json(model)
    }
  })
}
