'use strict'

import * as state from './state'

function persistState (payload) {
  const requestOpts = {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' }
  }

  fetch('/model', requestOpts)
    .then(res => res.json())
    .then(json => { state.render(state.represent(json)) })
    .catch(err => { state.render(state.represent(err)) })

  return false
}

export function addNewJob (present) {
  return persistState({ newJob: true })
}

export function switchToTab (tabName, present) {
  return persistState({ tabChange: tabName })
}

export function dismissAlert (model) {
  state.render(model)
  return false
}

export function save (data, present) {
  return persistState(data)
}
