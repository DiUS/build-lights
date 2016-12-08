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
    .catch(err => { render(err) })

  return false
}

export function switchToTab (tabName, present) {
  return persistState({ tabChange: tabName })
}

export function save (data, present) {
  return persistState(data)
}
