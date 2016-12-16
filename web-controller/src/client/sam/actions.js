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

export function requestRefresh (refresh = true) {
  state.render(state.represent({requestRefresh: refresh}))
}

export function refresh () {
  fetch('/model')
    .then(res => res.json())
    .then(json => { state.render(state.represent(json)) })
    .catch(err => { state.render(state.represent(err)) })
}

export function switchToTab (tabName, present) {
  return persistState({ tabChange: tabName })
}

export function dismissAlert (model) {
  state.render(model)
  return false
}

export function reboot () {
  fetch('/reboot')
    .then(res => res.json())
    .then(json => { state.render(state.represent(json)) })
    .catch(err => { state.render(state.represent(err)) })

  return false
}

export function shutdown () {
  fetch('/shutdown')
    .then(res => res.json())
    .then(json => { state.render(state.represent(json)) })
    .catch(err => { state.render(state.represent(err)) })

  return false
}

export function completeDeviceAction (model) {
  if (model.reboot) {
    location.reload()
  } else {
    model.completed = true
    state.render(model)
  }
}

export function save (data, present) {
  return persistState(data)
}
