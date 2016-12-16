'use strict'

import * as state from './sam/state'

const cb = (event) => {
  fetch('/model')
    .then(res => res.json())
    .then(json => {
      state.render(state.represent(json))
    })
}

if (document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  cb()
} else {
  document.addEventListener('DOMContentLoaded', cb)
}

import socketio from 'socket.io-client'
import { requestRefresh } from './sam/actions'

const socket = socketio()
socket.on('jobs_changed', function () {
  let jobsChecksum = (jobs) => {
    return jobs.map((job) => { return job.name + '_-_' + job.active }).sort().join(',')
  }

  const findJobsToMonitor = (tools) => {
    return tools.find((tool) => {
      return tool.name === 'jobs to monitor'
    })
  }

  window.fetch('/model')
    .then(res => res.json())
    .then(json => {
      let currentState = JSON.parse(window.localStorage.getItem('currentState'))
      const shouldRefresh = jobsChecksum(findJobsToMonitor(currentState).configuration.items) !==
        jobsChecksum(findJobsToMonitor(json.tools).configuration.items)
      requestRefresh(shouldRefresh)
    })
    .catch(err => { console.error('unable to fetch jobs', err) })
})
