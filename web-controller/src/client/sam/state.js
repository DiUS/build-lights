'use strict'

import { tabComponent, display } from './view'

export function representation (model) {
  display(tabComponent(model))
}

export function nextAction (model) {
  // automatic action that needs invoking
}

export function render (model) {
  representation(model)
  nextAction(model)
}
