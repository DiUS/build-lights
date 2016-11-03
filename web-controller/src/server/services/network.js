'use strict'

const utils = require('./utils')

exports.persist = (payload) => {
  utils.makeFileSystemWritable()
  utils.writeHostname(payload.hostname)

  let iface = 'eth0'
  if (payload.connectionType === 'wireless') {
    iface = 'wlan0'
    utils.writeWirelessConfiguration(payload)
  }

  const dhcpConf = (payload.dhcp === 'false' ? payload : {})
  utils.writeStaticNetworkConfiguration(iface, dhcpConf)

  utils.makeFileSystemReadOnly()
}
