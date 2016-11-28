'use strict'

const fs = require('fs')
const conf = require('../config')
const logger = require('winston')

const UTF_8 = 'utf8'

exports.persist = (payload) => {
  const lightConfiguration = `${process.cwd()}/${conf.get('lightConfig')}`

  try {
    fs.lstatSync(lightConfiguration)

    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfiguration, UTF_8))
    lightConfJSON.api.type = payload.ciTool
    lightConfJSON.api.url = `${payload.ciAddress}:${payload.ciPort}`

    fs.writeFileSync(lightConfiguration, JSON.stringify(lightConfJSON), UTF_8)
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}
