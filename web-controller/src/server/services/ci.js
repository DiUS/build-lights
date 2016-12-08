'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
  lightConfJSON.ci_server.type = payload.ciTool
  lightConfJSON.ci_server.url = payload.ciAddress || ''
  lightConfJSON.ci_server.username = payload.ciUsername || ''
  lightConfJSON.ci_server.api_token = payload.ciApiToken || ''

  fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
  logger.info('Persisted new CI configuration')
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'ci server' })

  model.tools[toolIdx].configuration.tool = payload.ciTool
  model.tools[toolIdx].configuration.address = payload.ciAddress || ''
  model.tools[toolIdx].configuration.username = payload.ciUsername || ''
  model.tools[toolIdx].configuration.apiToken = payload.ciApiToken || ''
}
