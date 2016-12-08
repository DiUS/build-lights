'use strict'

const fs = require('fs')
const ci = require('./ci')
const sinon = require('sinon')
const logger = require('winston')
const proxyquire = require('proxyquire')

describe('CI Service', () => {

  describe('#persist', () => {

    const payload = { ciTool: 'jenkins', ciAddress: 'http://my.ci:9090', ciUsername: 'test' }

    it('updates CI configuration', () => {
      const fsMock = sinon.mock(fs)
      sinon.stub(fs, 'readFileSync').returns('{ "ci_server": { "type": "jenkins", "url": "http://psn-ci:8080/api/json", "pollrate_s": 3 } }')

      const expected_result = {
        ci_server: {
          type: payload.ciTool,
          url: payload.ciAddress,
          pollrate_s: 3,
          username: payload.ciUsername
        }
      }

      fsMock.expects('writeFileSync').withArgs(`${process.cwd()}/light-configuration.json`, JSON.stringify(expected_result, null, 2), 'utf8').once()

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
