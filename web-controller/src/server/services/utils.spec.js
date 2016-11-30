'use strict'

const fs = require('fs')
const expect = require('chai').expect
const sinon = require('sinon')
const child_process = require('child_process')

const utils = require('./utils')

describe('Utils', () => {

  ['makeFileSystemWritable', 'makeFileSystemReadOnly'].forEach(fn => {
    describe(`#${fn}`, () => {
      it('returns result when operation succeeds', () => {
        const cpMock = sinon.mock(child_process)
        cpMock.expects('execSync').once().returns({ status: 0 })

        utils[fn]()
        cpMock.verify()
      })

      it('throws Error when operation fails', () => {
        const cpMock = sinon.mock(child_process)
        cpMock.expects('execSync').once().throws()

        expect(utils[fn]).to.throw(Error)
        cpMock.verify()
      })
    })
  })

  describe('#writeHostname', () => {
    it('does not overwrite host configuration when name is the same', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync').withArgs('/etc/hostname').once().returns('samesame')
      fsMock.expects('readFileSync').withArgs('/etc/hosts').never()
      fsMock.expects('writeFileSync').never()

      utils.writeHostname('samesame')
      fsMock.verify()
    })

    describe('when hostname differs', () => {

      let fsMock
      let originalHosts = '127.0.0.1\tlocalhost\n127.0.1.1\ttarcio-P640RE'
      let originalHostsNoEntry = '127.0.0.1\tlocalhost'

      beforeEach(() => {
        fsMock = sinon.mock(fs)
        fsMock.expects('readFileSync').withArgs('/etc/hostname').once().returns('samesame')
      })

      it('overwrites host configuration', () => {
        let expectedHosts = '127.0.0.1\tlocalhost\n127.0.1.1\tanother'

        fsMock.expects('readFileSync').withArgs('/etc/hosts').once().returns(originalHosts)
        fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'another').once()
        fsMock.expects('writeFileSync').withArgs('/etc/hosts', expectedHosts).once()

        utils.writeHostname('another')
        fsMock.verify()
      })

      it('adds entry for "127.0.0.1" when not available', () => {
        let expectedHosts = '127.0.0.1\tlocalhost\n127.0.1.1\tanother'

        fsMock.expects('readFileSync').withArgs('/etc/hosts').once().returns(originalHostsNoEntry)
        fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'another').once()
        fsMock.expects('writeFileSync').withArgs('/etc/hosts', expectedHosts).once()

        utils.writeHostname('another')
        fsMock.verify()
      })
    })
  })

  describe('#writeStaticNetworkConfiguration', () => {
    const payload = { address: '10.10.10.10/24', gateway: '10.10.10.1' }
    const data = fs.readFileSync(`${__dirname}/templates/dhcpcd.conf.template`, 'utf8')

    it('writes DHCP configuration from template', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync')
        .withArgs(`${__dirname}/templates/dhcpcd.conf.template`).once()
        .returns(data)

      fsMock.expects('writeFileSync')
        .withArgs('/etc/dhcpcd.conf', `${data}\ninterface wlan0\nstatic ip_address=${payload.address}\nstatic routers=${payload.gateway}\nstatic domain_name_servers=${payload.gateway}`)
        .once()

      utils.writeStaticNetworkConfiguration('wlan0', payload)
      fsMock.verify()
    })

    it('throws Error when cant write to /etc/dhcpcd.conf', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync')
        .withArgs(`${__dirname}/templates/dhcpcd.conf.template`).once()
        .returns(data)

      fsMock.expects('writeFileSync')
        .withArgs('/etc/dhcpcd.conf')
        .throws()

      expect(() => { utils.writeStaticNetworkConfiguration('wlan0', payload) }).to.throw(Error)
      fsMock.verify()
    })

    it('writes DHCP configuration from template without any static configuration when empty payload is provided', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync')
        .withArgs(`${__dirname}/templates/dhcpcd.conf.template`).once()
        .returns(data)

      fsMock.expects('writeFileSync')
        .withArgs('/etc/dhcpcd.conf', `${data}`)
        .once()

      utils.writeStaticNetworkConfiguration('wlan0', {})
      fsMock.verify()
    })

  })

  describe('#writeWirelessConfiguration', () => {
    const supplicantConf = 'country=AU\nctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1'
    const wpaPassphraseOut = 'network={\n\tssid="bla"\n\t#psk="12345abcde"\n\tpsk=44b494d80e42253602aba8fd7638e4964c01805052337b72280dd096245f7b2c\n}'

    it('writes custom wpa_supplicant with hashed password', () => {
      const dataToWrite = `${supplicantConf}\nnetwork={\n\tssid="bla"\n\tpsk=44b494d80e42253602aba8fd7638e4964c01805052337b72280dd096245f7b2c\n}`

      const fsMock = sinon.mock(fs)
      const cpMock = sinon.mock(child_process)

      fsMock.expects('readFileSync').withArgs('/etc/wpa_supplicant/wpa_supplicant.conf').once().returns(supplicantConf)
      cpMock.expects('execSync').withArgs('wpa_passphrase whatever mykey').once().returns(wpaPassphraseOut)
      fsMock.expects('writeFileSync').withArgs('/storage/etc/wpa_supplicant.conf', dataToWrite).once()

      utils.writeWirelessConfiguration({ ssid: 'whatever', key: 'mykey', hidden: 'false' })

      fsMock.verify()
      cpMock.verify()
    })

    it('replaces clear password with configuration when hidden ssid', () => {
      const dataToWrite = `${supplicantConf}\nnetwork={\n\tssid="bla"\n\tscan_ssid=1\n\tpsk=44b494d80e42253602aba8fd7638e4964c01805052337b72280dd096245f7b2c\n}`

      const fsMock = sinon.mock(fs)
      const cpMock = sinon.mock(child_process)

      fsMock.expects('readFileSync').withArgs('/etc/wpa_supplicant/wpa_supplicant.conf').once().returns(supplicantConf)
      cpMock.expects('execSync').withArgs('wpa_passphrase whatever mykey').once().returns(wpaPassphraseOut)
      fsMock.expects('writeFileSync').withArgs('/storage/etc/wpa_supplicant.conf', dataToWrite).once()

      utils.writeWirelessConfiguration({ ssid: 'whatever', key: 'mykey', hidden: 'true' })

      fsMock.verify()
      cpMock.verify()
    })
  })

})
