'use strict'

const sinon = require('sinon')
const network = require('./network')
const utils = require('./utils')

describe('Network Service', () => {

  describe('#persist', () => {

    let payload

    it('with ethernet DHCP', () => {
      payload = { hostname: 'samesame', connectionType: 'ethernet', dhcp: 'true' }

      const utilsMock = sinon.mock(utils)
      utilsMock.expects('makeFileSystemWritable').once()
      utilsMock.expects('writeHostname').withArgs('samesame').once()
      utilsMock.expects('writeWirelessConfiguration').never()
      utilsMock.expects('writeStaticNetworkConfiguration').withArgs('eth0', {}).once()
      utilsMock.expects('makeFileSystemReadOnly').once()

      network.persist(payload)
      utilsMock.verify()
    })

    it('with ethernet static', () => {
      payload = {
        hostname: 'samesame',
        connectionType: 'ethernet',
        dhcp: 'false',
        address: '10.10.10.10/24',
        gateway: '10.10.10.1'
      }

      const utilsMock = sinon.mock(utils)
      utilsMock.expects('makeFileSystemWritable').once()
      utilsMock.expects('writeHostname').withArgs('samesame').once()
      utilsMock.expects('writeWirelessConfiguration').never()
      utilsMock.expects('writeStaticNetworkConfiguration').withArgs('eth0', payload).once()
      utilsMock.expects('makeFileSystemReadOnly').once()

      network.persist(payload)
      utilsMock.verify()
    })

    it('with wireless DHCP', () => {
      payload = {
        hostname: 'samesame',
        connectionType: 'wireless',
        dhcp: 'true'
      }

      const utilsMock = sinon.mock(utils)
      utilsMock.expects('makeFileSystemWritable').once()
      utilsMock.expects('writeHostname').withArgs('samesame').once()
      utilsMock.expects('writeWirelessConfiguration').withArgs(payload).once()
      utilsMock.expects('writeStaticNetworkConfiguration').withArgs('wlan0', {}).once()
      utilsMock.expects('makeFileSystemReadOnly').once()

      network.persist(payload)
      utilsMock.verify()
    })

    it('with wireless static', () => {
      payload = {
        hostname: 'samesame',
        connectionType: 'wireless',
        dhcp: 'false',
        address: '10.10.10.10/24',
        gateway: '10.10.10.1'
      }

      const utilsMock = sinon.mock(utils)
      utilsMock.expects('makeFileSystemWritable').once()
      utilsMock.expects('writeHostname').withArgs('samesame').once()
      utilsMock.expects('writeWirelessConfiguration').withArgs(payload).once()
      utilsMock.expects('writeStaticNetworkConfiguration').withArgs('wlan0', payload).once()
      utilsMock.expects('makeFileSystemReadOnly').once()

      network.persist(payload)
      utilsMock.verify()
    })

  })

})
