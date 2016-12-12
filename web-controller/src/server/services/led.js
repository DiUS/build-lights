'use strict'

const findIndex = require('lodash.findindex')

const utils = require('./utils')
const state = require('./state')

module.exports.persist = (payload, lightConfigFile) => {
  state.write(lightConfigFile, data => {
    data.light.type = payload.ledType
    data.light.num_leds = utils.defaultWhenInvalid(payload.numLeds, 32)
  })
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'led hardware' })

  model.tools[toolIdx].configuration.ledType = payload.ledType
  model.tools[toolIdx].configuration.numLeds = utils.defaultWhenInvalid(payload.numLeds, 32)
}
