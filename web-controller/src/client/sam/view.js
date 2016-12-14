'use strict'

import InfernoDOM from 'inferno-dom'

import { Main } from '../components/Main'

export function mainComponent (model) {
  return Main(model)
}

export function display (representation) {
  const reprEl = document.getElementById('representation')
  if (reprEl) {
    InfernoDOM.render(representation, reprEl)
  }
}
