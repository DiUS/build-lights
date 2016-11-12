'use strict'

import InfernoDOM from 'inferno-dom'

import { Tab } from '../components/Tab'

export function tabComponent (model) {
  return Tab(model)
}

export function display (representation) {
  const reprEl = document.getElementById('representation')
  if (reprEl) {
    InfernoDOM.render(representation, reprEl)
  }
}
