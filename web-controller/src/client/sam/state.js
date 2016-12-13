'use strict'

import { completeDeviceAction } from './actions'
import { mainComponent, display } from './view'

export function represent (model) {
  if (model.reboot || model.shutdown) {
    return model
  }

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

export function hasCountdownEnded (stateModel) {
  return stateModel.countdown === 0
}

export function isExecutingDeviceAction (stateModel) {
  return stateModel.reboot || stateModel.shutdown
}

export function nextAction (stateModel) {
  if (isExecutingDeviceAction(stateModel)) {
    if (hasCountdownEnded(stateModel)) {
      completeDeviceAction(stateModel)
    } else {
      stateModel.countdown -= 1
      setTimeout(() => { render(stateModel) }, 1000)
    }
  }
}

export function render (stateModel) {
  display(mainComponent(stateModel))
  nextAction(stateModel)
}
