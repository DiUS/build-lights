'use strict'

import { render as renderState } from './state'

export const model = {
  tools: [
    { name: 'network', configuration: {}, active: true },
    { name: 'jobs', configuration: {}, active: true },
    { name: 'statistics', configuration: {}, active: false }
  ],
  selectedTool: 'network'
}

export function present (updatedData) {
  if (updatedData.tabChange && model.selectedTool !== updatedData.tabChange) {
    model.selectedTool = updatedData.tabChange
    model.tabChanged = true
  } else {
    model.tabChanged = false
  }

  renderState(model)
}
