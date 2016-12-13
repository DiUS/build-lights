'use strict'

import { tabComponent, display } from './view'

export function represent (model) {
  let currentState = model.tools
    .filter(t => t.active)
    .map(t => {
      return {
        name: t.name,
        active: t.name === model.selectedTool,
        configuration: t.configuration,
        lastUpdated: new Date(model.lastUpdated).toString()
      }
    })

  currentState.alert = model.result
  return currentState
}

export function nextAction (stateModel) {
  // nothing to do here for now
}

export function render (stateModel) {
  display(tabComponent(stateModel))
  nextAction(stateModel)
}
