'use strict'

const utils = require('./utils')
const logger = require('winston')
const findIndex = require('lodash.findindex')

module.exports.persist = (payload) => {
  utils.makeFileSystemWritable()
  logger.info('File system is now writable.')

  utils.writeHostname(payload.hostname)
  logger.info('Wrote new hostname "%s"', payload.hostname)

  let iface = 'eth0'
  if (payload.connectionType === 'wireless') {
    iface = 'wlan0'
    utils.writeWirelessConfiguration(payload)
  }
  logger.info('Wrote connection information for interface "%s"', iface)

  const dhcpConf = (payload.useDhcp === 'false' ? payload : {})
  utils.writeStaticNetworkConfiguration(iface, dhcpConf)
  logger.info('Wrote DHCP information')

  utils.makeFileSystemReadOnly()
  logger.info('File system is now read only.')
}

module.exports.mutateModel = (model, payload) => {
  const toolIdx = findIndex(model.tools, { name: 'network' })

  model.tools[toolIdx].configuration.hostname = payload.hostname
  model.tools[toolIdx].configuration.connectionType = payload.connectionType
  model.tools[toolIdx].configuration.dhcp = (payload.useDhcp === 'true')
  model.tools[toolIdx].configuration.address = payload.address
  model.tools[toolIdx].configuration.netmask = payload.netmask
  model.tools[toolIdx].configuration.gateway = payload.gateway
  model.tools[toolIdx].configuration.wireless.ssid = payload.ssid
  model.tools[toolIdx].configuration.wireless.key = payload.key
  model.tools[toolIdx].configuration.wireless.hidden = (payload.hidden === 'true')

  return model
}
