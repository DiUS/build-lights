'use strict'

import { tabComponent, display } from './view'

export function representation (model) {
  display(tabComponent(model))
}

export function nextAction (model) {
  // nothing to do here for now
}

export function render (model) {
  representation(model)
  nextAction(model)
}
