'use strict'

const fs = require('fs')
const sinon = require('sinon')
const winston = require('winston')
const service = require('./network')

describe('Network Service', () => {

  describe('#persist', () => {

    let originalHosts = '127.0.0.1\tlocalhost\n127.0.1.1\ttarcio-P640RE'
    let hostsWithTest = `${originalHosts}\n#### BL\n127.0.1.1\ttest`
    let hostsWithOthertest = `${originalHosts}\n#### BL\n127.0.1.1\tothertest`

    beforeEach(() => {
      // winstonMock.expects('warn').once()
    })

    afterEach(() => {
      // winstonMock.restore()
    })

    it('should write hostname to /etc/hostname and /etc/hosts', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'test', 'utf8').once()
      fsMock.expects('readFileSync').withArgs('/etc/hosts', 'utf8').once().returns(originalHosts)
      fsMock.expects('writeFileSync').withArgs('/etc/hosts', hostsWithTest, 'utf8').once()

      service.persist({ hostname: 'test' })
      fsMock.verify()
    })

    it('replaces /etc/hosts with new hostname entry', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('writeFileSync').withArgs('/etc/hostname', 'othertest', 'utf8').once()
      fsMock.expects('readFileSync').withArgs('/etc/hosts', 'utf8').once().returns(hostsWithTest)
      fsMock.expects('writeFileSync').withArgs('/etc/hosts', hostsWithOthertest, 'utf8').once()

      service.persist({ hostname: 'othertest' })
      fsMock.verify()
    })

    it('creates "eth0" configuration file for ethernet connection method', () => {

    })

    it('creates "wlan0" configuration file for ethernet connection method', () => {

    })

  })

})
