'use strict'

const fs = require('fs')
const conf = require('../config')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload) => {
  const lightConfiguration = `${process.cwd()}/${conf.get('lightConfig')}`

  try {
    fs.lstatSync(lightConfiguration)
    logger.info('Light configuration file "%s" exists and will be read.', lightConfiguration)

    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfiguration, UTF_8))
    lightConfJSON.api.type = payload.ciTool
    lightConfJSON.api.url = `${payload.ciAddress}:${payload.ciPort}`

    fs.writeFileSync(lightConfiguration, JSON.stringify(lightConfJSON), UTF_8)
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
}
