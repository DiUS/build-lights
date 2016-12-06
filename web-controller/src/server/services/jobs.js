'use strict'

const fs = require('fs')
const logger = require('winston')
const findIndex = require('lodash.findindex')
const flatten = require('lodash.flatten')
const compact = require('lodash.compact')

const UTF_8 = 'utf8'

exports.persist = (payload, lightConfigFile) => {
  try {
    let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))

    lightConfJSON.api.pollrate_s = Number(payload.pollRate)

    const names = flatten([payload.jobName])
    const actives = flatten([payload.jobActive])
    lightConfJSON.jobs = compact(names.map((name, index) => actives[index] ? name : null))

    fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON), UTF_8)
    logger.info('Persisted new Jobs configuration')
  } catch (e) {
    logger.error('Light Controller configuration could not be found.')
  }
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'jobs to monitor' })

  model.tools[toolIdx].configuration.pollrate = Number(payload.pollRate)

  const names = flatten([payload.jobName])
  const actives = flatten([payload.jobActive])
  model.tools[toolIdx].configuration.items = names.map((name, index) => ({ name, active: actives[index] }))
}
