'use strict'

import InfernoDOM from 'inferno-dom'

import { Tab } from './components/Tab'

export function init (model) {
  return Tab(model)
}

export function tabChange (model) {
  return Tab(model)
}

export function display (representation) {
  InfernoDOM.render(
    representation,
    document.getElementById('representation')
  )
}
