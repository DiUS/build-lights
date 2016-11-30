'use strict'

const fs = require('fs')
const conf = require('../config')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

exports.persist = (payload) => {
  const lightConfiguration = `${process.cwd()}/${conf.get('lightConfig')}`

  try {
    fs.lstatSync(lightConfiguration)

    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfiguration, UTF_8))

    lightConfJSON.api.pollrate_s = Number(payload.pollRate)
    lightConfJSON.jobs = payload.jobPath

    fs.writeFileSync(lightConfiguration, JSON.stringify(lightConfJSON), UTF_8)
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'jobs to monitor' })

  model.tools[toolIdx].configuration.pollrate = Number(payload.pollRate)
  model.tools[toolIdx].configuration.items = []

  for (let i = 0; i < payload.jobName.length; i++) {
    model.tools[toolIdx].configuration.items.push({ name: payload.jobName[i], path: payload.jobPath[i] })
  }
}
