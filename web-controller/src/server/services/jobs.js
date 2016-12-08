'use strict'

const fs = require('fs')
const logger = require('winston')
const flatten = require('lodash.flatten')
const compact = require('lodash.compact')
const findIndex = require('lodash.findindex')

const utils = require('./utils')

const UTF_8 = 'utf8'

exports.persist = (payload, lightConfigFile) => {
  let lightConfJSON = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))

  lightConfJSON.ci_server.pollrate_s = utils.defaultWhenInvalid(payload.pollRate, 3)

  const names = flatten([payload.jobName])
  const actives = flatten([payload.jobActive])
  lightConfJSON.jobs = compact(names.map((name, index) => actives[index] ? name : null))

  fs.writeFileSync(lightConfigFile, JSON.stringify(lightConfJSON, null, 2), UTF_8)
  logger.info('Persisted new Jobs configuration')
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'jobs to monitor' })

  model.tools[toolIdx].configuration.pollrate = utils.defaultWhenInvalid(payload.pollRate, 3)

  const names = flatten([payload.jobName])
  const actives = flatten([payload.jobActive])
  model.tools[toolIdx].configuration.items = names.map((name, index) => ({ name, active: actives[index] }))
}
