'use strict'

const fs = require('fs')
const logger = require('winston')
const merge = require('lodash.merge')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  let toolData = {}
  let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
  let pollrateS = lightConfJSON.ci_server.pollrate_s

  lightConfJSON.ci_server = {
    type: payload.ciTool,
    pollrate_s: pollrateS
  }

  switch (payload.ciTool) {
    case 'jenkins':
      toolData = { url: payload.ciAddress }
      break
    case 'circleci':
    case 'buildkite':
      toolData = {
        username: payload.ciUsername,
        api_token: payload.ciApiToken
      }
      break
    case 'travisci':
      toolData = { username: payload.ciUsername }
      break
  }

  merge(lightConfJSON.ci_server, toolData)

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
