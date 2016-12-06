'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  try {
    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
    lightConfJSON.api.type = payload.ciTool
    lightConfJSON.api.url = `${payload.ciAddress}:${payload.ciPort}`
    lightConfJSON.api.username = payload.ciUsername

    fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
    logger.info('Persisted new CI configuration')
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'ci server' })

  model.tools[toolIdx].configuration.tool = payload.ciTool
  model.tools[toolIdx].configuration.address = payload.ciAddress
  model.tools[toolIdx].configuration.port = payload.ciPort
  model.tools[toolIdx].configuration.username = payload.ciUsername
}
