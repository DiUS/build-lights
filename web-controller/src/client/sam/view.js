'use strict'

import Inferno from 'inferno'

import { Main } from '../components/Main'

export function mainComponent (model) {
  return Main(model)
}

export function display (representation) {
  const reprEl = document.getElementById('representation')
  if (reprEl) {
    Inferno.render(representation, reprEl)
  }
}
