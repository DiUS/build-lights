'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

module.exports.persist = (payload, lightConfigFile) => {
  try {
    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))
    lightConfJSON.light.type = payload.ledType
    lightConfJSON.light.num_leds = payload.numLeds

    fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
    logger.info('Persisted new Jobs configuration')
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'led hardware' })

  model.tools[toolIdx].configuration.ledType = payload.ledType
  model.tools[toolIdx].configuration.numLeds = payload.numLeds
}
