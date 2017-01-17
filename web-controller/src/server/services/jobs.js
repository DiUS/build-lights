'use strict'

const flatten = require('lodash.flatten')
const compact = require('lodash.compact')
const findIndex = require('lodash.findindex')

const utils = require('./utils')
const state = require('./state')

const DEFAULT_BRANCH = 'master'

exports.persist = (payload, lightConfigFile) => {
  state.write(lightConfigFile, data => {
    data.ci_server.pollrate_s = utils.defaultWhenInvalid(payload.pollRate, 3)

    const names = flatten([payload.jobName])
    const branches = flatten([payload.jobBranch])
    const actives = flatten([payload.jobActive])

    data.jobs = compact(names.map((name, index) => actives[index] ? { name, branch: branches[index] || DEFAULT_BRANCH } : null))
  })
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'jobs to monitor' })

  model.tools[toolIdx].configuration.pollrate = utils.defaultWhenInvalid(payload.pollRate, 3)

  const names = flatten([payload.jobName])
  const branches = flatten([payload.jobBranch])
  const actives = flatten([payload.jobActive])
  model.tools[toolIdx].configuration.items = names
    .map((name, index) => ({ name, branch: branches[index] || DEFAULT_BRANCH, active: actives[index] }))
    .filter((item) => { return item.name !== undefined })
}
