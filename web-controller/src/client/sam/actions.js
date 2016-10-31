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
}

export function switchToTab (tabName, present) {
  persistState({ tabChange: tabName })
  return false
}

export function switchConnectionType (connectionType, present) {
  persistState({ connectionType })
  return false
}

export function switchDhcp (dhcp, present) {
  persistState({ dhcp })
  return false
}

export function addNewJob (present) {
  persistState({ newJob: true })
  return false
}

export function removeJob (jobIndex, present) {
  persistState({ deleteJob: jobIndex })
  return false
}

export function saveNetworkInformation (present) {
  // persistState()
  return false
}

export function saveJobInformation (present) {
  // persistState()
  return false
}
