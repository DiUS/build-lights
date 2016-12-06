'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')

const UTF_8 = 'utf8'

exports.persist = (payload, lightConfigFile) => {
  try {
    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))

    lightConfJSON.api.pollrate_s = Number(payload.pollRate)

    if (!Array.isArray(payload.jobPath)) {
      payload.jobPath = [payload.jobPath]
    }

    lightConfJSON.jobs = payload.jobPath

    fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
    logger.info('Persisted new Jobs configuration')
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'jobs to monitor' })

  model.tools[toolIdx].configuration.pollrate = Number(payload.pollRate)
  model.tools[toolIdx].configuration.items = []

  if (Array.isArray(payload.jobName)) {
    for (let i = 0; i < payload.jobName.length; i++) {
      model.tools[toolIdx].configuration.items.push({ name: payload.jobName[i], path: payload.jobPath[i] })
    }
  } else {
    model.tools[toolIdx].configuration.items.push({ name: payload.jobName, path: payload.jobPath })
  }
}
