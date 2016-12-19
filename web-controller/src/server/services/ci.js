'use strict'

const merge = require('lodash.merge')
const findIndex = require('lodash.findindex')

const state = require('./state')

module.exports.persist = (payload, lightConfigFile) => {
  state.write(lightConfigFile, data => {
    let toolData = {}

    let pollrateS = data.ci_server.pollrate_s

    data.ci_server = {
      type: payload.ciTool,
      pollrate_s: pollrateS
    }

    switch (payload.ciTool) {
      case 'bamboo':
        toolData = {url: payload.ciAddress}
        if (payload.ciUsername) { toolData.username = payload.ciUsername }
        if (payload.ciPassword) { toolData.password = payload.ciPassword }
        break
      case 'buildkite':
      case 'circleci':
        toolData = {
          username: payload.ciUsername,
          api_token: payload.ciApiToken
        }
        break
      case 'jenkins':
        toolData = { url: payload.ciAddress }
        break
      case 'travisci':
        toolData = { username: payload.ciUsername }
        break
    }

    merge(data.ci_server, toolData)
  })
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'ci server' })

  model.tools[toolIdx].configuration.tool = payload.ciTool
  model.tools[toolIdx].configuration.address = payload.ciAddress || ''
  model.tools[toolIdx].configuration.username = payload.ciUsername || ''
  model.tools[toolIdx].configuration.password = payload.ciPassword || ''
  model.tools[toolIdx].configuration.apiToken = payload.ciApiToken || ''
}
