'use strict'

const fs = require('fs')
const sinon = require('sinon')
const winston = require('winston')
const child_process = require('child_process')

const service = require('./network')

describe('Network Service', () => {

  describe('#persist', () => {

    let originalHosts = '127.0.0.1\tlocalhost\n127.0.1.1\ttarcio-P640RE'
    let hostsWithTest = `${originalHosts}\n#### BL\n127.0.1.1\ttest`
    let hostsWithOthertest = `${originalHosts}\n#### BL\n127.0.1.1\tothertest`

    it('should write hostname to /etc/hostname and /etc/hosts', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'test', 'utf8').once()
      fsMock.expects('readFileSync').withArgs('/etc/hosts', 'utf8').once().returns(originalHosts)
      fsMock.expects('writeFileSync').withArgs('/etc/hosts', hostsWithTest, 'utf8').once()

      const cpMock = sinon.mock(child_process)
      cpMock.expects('execSync').withArgs('service networking restart').once().returns({ status: 0 })

      service.persist({ hostname: 'test' })
      fsMock.verify()
      cpMock.verify()
    })

    it('replaces /etc/hosts with new hostname entry', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'othertest', 'utf8').once()
      fsMock.expects('readFileSync').withArgs('/etc/hosts', 'utf8').once().returns(hostsWithTest)
      fsMock.expects('writeFileSync').withArgs('/etc/hosts', hostsWithOthertest, 'utf8').once()

      const cpMock = sinon.mock(child_process)
      cpMock.expects('execSync').withArgs('service networking restart').once().returns({ status: 0 })

      service.persist({ hostname: 'othertest' })
      fsMock.verify()
      cpMock.verify()
    })

    describe('with "ethernet" connection', () => {

      let fsMock, cpMock
      let dataToPersist = {
        hostname: 'othertest',
        connectionType: 'ethernet',
        address: '10.0.0.10',
        netmask: '255.255.255.0',
        gateway: '10.0.0.1'
      }

      beforeEach(() => {
        fsMock = sinon.mock(fs)
        fsMock.expects('readFileSync').once().returns(hostsWithTest)
        fsMock.expects('writeFileSync').atLeast(2)
        fsMock.expects('writeFileSync').withArgs('/etc/network/interfaces.d/wlan0.cfg').never()

        cpMock = sinon.mock(child_process)
        cpMock.expects('execSync').withArgs('service networking restart').once().returns({ status: 0 })
      })

      it('creates "eth0" configuration file with DHCP method', () => {
        dataToPersist['useDhcp'] = 'true'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/eth0.cfg',
            'auto eth0\niface eth0 inet dhcp'
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })

      it('creates "eth0" configuration file with STATIC method', () => {
        dataToPersist['useDhcp'] = 'false'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/eth0.cfg',
            `auto eth0\niface eth0 inet static\n\taddress ${dataToPersist.address}\n\tnetmask ${dataToPersist.netmask}\n\tgateway ${dataToPersist.gateway}`
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })
    })

    describe('with "wireless" connection', () => {

      let fsMock, cpMock
      let dataToPersist = {
        hostname: 'othertest',
        connectionType: 'wireless',
        address: '10.0.0.10',
        netmask: '255.255.255.0',
        gateway: '10.0.0.1',
        ssid: 'test',
        key: 'akey',
        hidden: 'false'
      }

      beforeEach(() => {
        fsMock = sinon.mock(fs)
        fsMock.expects('readFileSync').once().returns(hostsWithTest)
        fsMock.expects('writeFileSync').atLeast(2)
        fsMock.expects('writeFileSync').withArgs('/etc/network/interfaces.d/eth0.cfg').never()

        cpMock = sinon.mock(child_process)
        cpMock.expects('execSync').withArgs('service networking restart').once().returns({ status: 0 })
      })

      it('creates "wlan0" configuration file for DHCP method', () => {
        dataToPersist['useDhcp'] = 'true'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/wlan0.cfg',
            `auto wlan0\niface wlan0 inet dhcp\n\twpa-ssid ${dataToPersist.ssid}\n\twpa-psk ${dataToPersist.key}`
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })

      it('creates "wlan0" configuration file for hidden network with DHCP method', () => {
        dataToPersist['useDhcp'] = 'true'
        dataToPersist['hidden'] = 'true'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/wlan0.cfg',
            `auto wlan0\niface wlan0 inet dhcp\n\twpa-scan-ssid 1\n\twpa-ssid ${dataToPersist.ssid}\n\twpa-psk ${dataToPersist.key}`
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })

      it('creates "wlan0" configuration file for STATIC method', () => {
        dataToPersist['useDhcp'] = 'false'
        dataToPersist['hidden'] = 'false'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/wlan0.cfg',
            `auto wlan0\niface wlan0 inet static\n\taddress ${dataToPersist.address}\n\tnetmask ${dataToPersist.netmask}\n\tgateway ${dataToPersist.gateway}\n\twpa-ssid ${dataToPersist.ssid}\n\twpa-psk ${dataToPersist.key}`
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })

      it('creates "wlan0" configuration file for hidden network with STATIC method', () => {
        dataToPersist['useDhcp'] = 'false'
        dataToPersist['hidden'] = 'true'

        fsMock.expects('writeFileSync')
          .withArgs(
            '/etc/network/interfaces.d/wlan0.cfg',
            `auto wlan0\niface wlan0 inet static\n\taddress ${dataToPersist.address}\n\tnetmask ${dataToPersist.netmask}\n\tgateway ${dataToPersist.gateway}\n\twpa-scan-ssid 1\n\twpa-ssid ${dataToPersist.ssid}\n\twpa-psk ${dataToPersist.key}`
          )
          .once()

        service.persist(dataToPersist)
        fsMock.verify()
        cpMock.verify()
      })
    })
  })
})
