'use strict'

const fs = require('fs')
const cp = require('child_process')

const UTF_8 = 'utf8'

module.exports.makeFileSystemWritable = () => cp.execSync('rwroot')

module.exports.makeFileSystemReadOnly = () => cp.execSync('roroot')

module.exports.writeHostname = (newHostname) => {
  const hostname = fs.readFileSync('/etc/hostname', UTF_8)

  if (newHostname !== hostname) {
    // write to hosts file
    fs.writeFileSync('/etc/hostname', newHostname, UTF_8)

    // replaces 127.0.1.1 entry with new hostname
    let replacedEntry = false
    let hostsContent = fs.readFileSync('/etc/hosts', UTF_8).split(/\n/)
    hostsContent = hostsContent.map(line => {
      if (line.indexOf('127.0.1.1') > -1) {
        replacedEntry = true
        return `127.0.1.1\t${newHostname}`
      }
      return line
    })

    if (!replacedEntry) {
      hostsContent.push(`127.0.1.1\t${newHostname}`)
    }

    fs.writeFileSync('/etc/hosts', hostsContent.join('\n'), UTF_8)
  }
}

module.exports.writeStaticNetworkConfiguration = (iface, payload) => {
  let dhcpConfContent = fs.readFileSync('./templates/dhcpcd.conf.template', UTF_8).split(/\n/)

  if (payload.address && payload.gateway) {
    dhcpConfContent.push(`interface ${iface}`)
    dhcpConfContent.push(`static ip_address=${payload.address}`)
    dhcpConfContent.push(`static routers=${payload.gateway}`)
    dhcpConfContent.push(`static domain_name_servers=${payload.gateway}`)
  }

  fs.writeFileSync('/etc/dhcpcd.conf', dhcpConfContent.join('\n'), UTF_8)
}

module.exports.writeWirelessConfiguration = (payload) => {

}
