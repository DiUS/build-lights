'use strict'

const fs = require('fs')
const winston = require('winston')
const cp = require('child_process')

const CUSTOM_BL_MARKER = '#### BL'

function setupDHCP (payload, iface, data) {
  if (payload.useDhcp === 'true') {
    data.push(`iface ${iface} inet dhcp`)
  } else {
    data.push(`iface ${iface} inet static`)
    data.push(`\taddress ${payload.address}`)
    data.push(`\tnetmask ${payload.netmask}`)
    data.push(`\tgateway ${payload.gateway}`)
  }
}

exports.persist = (payload) => {
  // 1) save hostname on /etc/hostname
  fs.writeFileSync('/etc/hostname', payload.hostname, 'utf8')

  // 2) save host info on /etc/hosts
  let hostsData = fs.readFileSync('/etc/hosts', 'utf8')
  hostsData = hostsData.split(/\n/)

  const customBlConfig = hostsData.indexOf(CUSTOM_BL_MARKER)

  if (customBlConfig > -1) {
    hostsData.splice(customBlConfig)
  }

  hostsData.push(CUSTOM_BL_MARKER)
  hostsData.push(`127.0.1.1\t${payload.hostname}`)

  fs.writeFileSync('/etc/hosts', hostsData.join('\n'), 'utf8')

  // 3) save network config on /etc/network/interfaces
  let data = []
  switch (payload.connectionType) {
    case 'ethernet':
      data.push('auto eth0')
      setupDHCP(payload, 'eth0', data)
      fs.writeFileSync('/etc/network/interfaces.d/eth0.cfg', data.join('\n'), 'utf8')
      break
    case 'wireless':
      data.push('auto wlan0')
      setupDHCP(payload, 'wlan0', data)

      if (payload.hidden === 'true') {
        data.push('\twpa-scan-ssid 1')
      }

      data.push(`\twpa-ssid ${payload.ssid}`)
      data.push(`\twpa-psk ${payload.key}`)

      fs.writeFileSync('/etc/network/interfaces.d/wlan0.cfg', data.join('\n'), 'utf8')
      break
    default:
      winston.warn('could not persist network configuration')
  }

  // 4) restart service
  const result = cp.execSync('service networking restart')
  if (result.status === 0) {
    winston.info('successfully restarted networking service')
  } else {
    winston.error('could not restart networking service: %j', result.error)
    throw result.error
  }
}
