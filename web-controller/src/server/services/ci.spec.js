'use strict'

const fs = require('fs')
const expect = require('chai').expect

const ci = require('./ci')
const UTF_8 = 'utf8'

describe('CI Service', () => {

  describe('#persist', () => {
    let lightConfig

    beforeEach(() => {
      lightConfig = `fixtures/tmp_${Date.now()}.json`
      const data = fs.readFileSync(`${process.cwd()}/fixtures/light-configuration.json`, UTF_8)
      fs.writeFileSync(lightConfig, data)
    })

    it('updates CI configuration', () => {
      const payload = {
        ciTool: 'jenkins',
        ciAddress: 'http://my.ci:9090',
        ciUsername: 'test'
      }


      ci.persist(payload, lightConfig)

      const persistedData = JSON.parse(fs.readFileSync(lightConfig, UTF_8))
      expect(persistedData).to.have.property('ci_server')
      expect(persistedData.ci_server).to.have.property('type', 'jenkins')
      expect(persistedData.ci_server).to.have.property('url', 'http://my.ci:9090')
      expect(persistedData.ci_server).to.have.property('username', 'test')
      expect(persistedData.ci_server).to.have.property('api_token', '')
    })

    it('throws error when light configuration file is not found', () => {
      expect(() => {
        ci.persist(payload, 'bla.json')
      }).to.throw(Error)
    })
  })

  describe('#mutateModel', () => {
    it('mutates the model with CI configuration', () => {
      const payload = {
        ciTool: 'jenkins',
        ciAddress: 'http://my.ci:9090',
        ciUsername: 'test'
      }

      const model = { tools: [{ name: 'ci server', configuration: {} }] }

      ci.mutateModel(model, payload)

      expect(model.tools[0].configuration.tool).to.eql(payload.ciTool)
      expect(model.tools[0].configuration.address).to.eql(payload.ciAddress)
      expect(model.tools[0].configuration.username).to.eql(payload.ciUsername)
      expect(model.tools[0].configuration.apiToken).to.eql('')
    })
  })

})
