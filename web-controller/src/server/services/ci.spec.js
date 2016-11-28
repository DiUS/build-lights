'use strict'

const fs = require('fs')
const sinon = require('sinon')
const logger = require('winston')
const config = require('../config')
const proxyquire = require('proxyquire')

describe('CI Service', () => {

  // stubbed dependency for config
  const getConfigStub = sinon.stub()

  // require with replaced stub
  const ci = proxyquire('./ci', { '../config': { get: getConfigStub } })

  describe('#persist', () => {

    const payload = { ciTool: 'jenkins_direct', ciAddress: 'http://my.ci', ciPort: 9090 }

    it('updates CI configuration', () => {
      getConfigStub.withArgs('lightConfig').returns('light-configuration.json')

      const fsMock = sinon.mock(fs)
      sinon.stub(fs, 'readFileSync').returns('{ "api": { "type": "jenkins_direct", "url": "http://psn-ci:8080/api/json", "pollrate_s": 3 } }')

      fsMock.expects('lstatSync').once()
      fsMock.expects('writeFileSync').withArgs(`${process.cwd()}/light-configuration.json`, '{"api":{"type":"jenkins_direct","url":"http://my.ci:9090","pollrate_s":3}}', 'utf8').once()

      ci.persist(payload)
      fsMock.verify()
      fs.readFileSync.restore()
    })

    it('keeps current configuration when light controller configuration does not exist', () => {
      getConfigStub.withArgs('lightConfig').returns('bla.json')

      const fsMock = sinon.mock(fs)
      fsMock.expects('lstatSync').once()
      fsMock.expects('readFileSync').never()
      fsMock.expects('writeFileSync').never()

      const logMock = sinon.mock(logger)
      logMock.expects('error').once()

      ci.persist(payload)
      fsMock.verify()
      logMock.verify()
    })

    it('keeps current configuration when fails to update', () => {
      getConfigStub.withArgs('lightConfig').returns('bla.json')

      const fsMock = sinon.mock(fs)
      fsMock.expects('lstatSync').once()
      fsMock.expects('readFileSync').never()

      const logMock = sinon.mock(logger)
      logMock.expects('error').once()

      sinon.stub(fs, 'writeFileSync').throws()

      ci.persist(payload)
      fsMock.verify()
      logMock.verify()
      fs.writeFileSync.restore()
    })

  })

})
