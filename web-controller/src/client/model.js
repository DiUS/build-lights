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
  selectedTool: 'network',
  lastUpdated: '2016-10-29T20:47:59.764Z'
}

export function present (data) {
  if (!data) {
    renderState(model)
    return
  }

  if (data.tabChange && model.selectedTool !== data.tabChange) {
    model.selectedTool = data.tabChange
  }

  if (data.connectionType) {
    model.tools[0].configuration.connectionType = data.connectionType
  }

  if (data.dhcp) {
    model.tools[0].configuration.dhcp = (data.dhcp === 'true')
  }

  renderState(model)
}
