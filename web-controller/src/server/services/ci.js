'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  try {
    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
    let pollrateS = lightConfJSON.ci_server.pollrate_s
    lightConfJSON.ci_server = {
      type: payload.ciTool,
      url: payload.ciAddress,
      pollrate_s: pollrateS,
      username: payload.ciUsername,
      api_token: payload.ciApiToken
    }

    fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON, null, 2), UTF_8)
    logger.info('Persisted new CI configuration')
  } catch (e) {
    logger.error('Light Controller configuration could not be persisted.', e)
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'ci server' })

  model.tools[toolIdx].configuration.tool = payload.ciTool
  model.tools[toolIdx].configuration.address = payload.ciAddress
  model.tools[toolIdx].configuration.username = payload.ciUsername
  model.tools[toolIdx].configuration.apiToken = payload.ciApiToken
}
