'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const utils = require('./utils')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
  lightConfJSON.light.type = payload.ledType
  lightConfJSON.light.num_leds = utils.defaultWhenInvalid(payload.numLeds, 32)

  fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
  logger.info('Persisted new LED configuration')
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'led hardware' })

  model.tools[toolIdx].configuration.ledType = payload.ledType
  model.tools[toolIdx].configuration.numLeds = utils.defaultWhenInvalid(payload.numLeds, 32)
}
