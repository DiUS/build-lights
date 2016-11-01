'use strict'

import { render } from './state'

function persistState (payload) {
  const requestOpts = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  }

  fetch('/model', requestOpts)
    .then(res => res.json())
    .then(json => { render(json) })
    .catch(err => {
      console.log(err)
      // TODO fix this
      // render(window.model)
    })

  return false
}

export function switchToTab (tabName, present) {
  return persistState({ tabChange: tabName })
}

export function switchConnectionType (connectionType, present) {
  return persistState({ connectionType })
}

export function switchDhcp (dhcp, present) {
  return persistState({ dhcp })
}

export function addNewJob (present) {
  return persistState({ newJob: true })
}

export function removeJob (jobIndex, present) {
  return persistState({ deleteJob: jobIndex })
}

export function save (data, present) {
  return persistState(data)
}
