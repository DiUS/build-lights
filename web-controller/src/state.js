'use strict'

import { ready as viewReady, display } from './view'

export function representation (model) {
  let representation = 'Loading data...'

  if (ready(model.lastRetrieved)) {
    representation = viewReady(model)
  }

  display(representation)
}

export function ready (lastRetrieved) {
  return !!lastRetrieved
}

export function render (model) {
  representation(model)
}
