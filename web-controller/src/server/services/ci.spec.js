'use strict'

const fs = require('fs')
const ci = require('./ci')
const sinon = require('sinon')
const logger = require('winston')
const proxyquire = require('proxyquire')

describe('CI Service', () => {

  describe('#persist', () => {

    const payload = { ciTool: 'jenkins_direct', ciAddress: 'http://my.ci', ciPort: 9090 }

    it('updates CI configuration', () => {
      const fsMock = sinon.mock(fs)
      sinon.stub(fs, 'readFileSync').returns('{ "api": { "type": "jenkins_direct", "url": "http://psn-ci:8080/api/json", "pollrate_s": 3 } }')

      fsMock.expects('writeFileSync').withArgs(`${process.cwd()}/light-configuration.json`, '{"api":{"type":"jenkins_direct","url":"http://my.ci:9090","pollrate_s":3}}', 'utf8').once()

      ci.persist(payload, `${process.cwd()}/light-configuration.json`)
      fsMock.verify()
      fs.readFileSync.restore()
    })

    it('keeps current configuration when light controller configuration does not exist', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync').never()
      fsMock.expects('writeFileSync').never()

      const logMock = sinon.mock(logger)
      logMock.expects('error').once()

      ci.persist(payload, `${process.cwd()}/bla.json`)
      fsMock.verify()
      logMock.verify()
    })

    it('keeps current configuration when fails to update', () => {
      const fsMock = sinon.mock(fs)
      fsMock.expects('readFileSync').never()

      const logMock = sinon.mock(logger)
      logMock.expects('error').once()

      sinon.stub(fs, 'writeFileSync').throws()

      ci.persist(payload, `${process.cwd()}/bla.json`)
      fsMock.verify()
      logMock.verify()
      fs.writeFileSync.restore()
    })

  })

})
