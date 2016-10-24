'use strict'

import { render as renderState } from './state'

export const model = {
  tools: [
    { name: 'network',
      configuration: {
        hostname: 'superpi',
        connectionType: 'ethernet',
        dhcp: true,
        address: '10.0.0.100',
        netmask: '255.255.255.0',
        gateway: '10.0.0.1',
        wireless: {
          ssid: 'netgear3',
          hidden: true,
          key: 'abc123'
        }
      },
      active: true },
    { name: 'jobs',
      configuration: {
        ci: {
          address: 'http://localhost',
          port: 80
        },
        hardware: {
          ledType: 'epistar', // adafruit + lpd8806
          numLeds: 32
        },
        pollrate: 3,
        items: []
      },
      active: true },
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

  if (updatedData.connectionType) {
    model.tools[0].configuration.connectionType = updatedData.connectionType
  }

  if (updatedData.dhcp) {
    model.tools[0].configuration.dhcp = (updatedData.dhcp === 'true')
  }

  renderState(model)
}
