'use strict'

const fs = require('fs')
const expect = require('chai').expect

const led = require('./led')
const UTF_8 = 'utf8'

describe('LED Service', () => {

  describe('#persist', () => {
    let lightConfig

    beforeEach(() => {
      lightConfig = `fixtures/tmp_${Date.now()}.json`
      const data = fs.readFileSync(`${process.cwd()}/fixtures/light-configuration.json`, UTF_8)
      fs.writeFileSync(lightConfig, data)
    })

    afterEach(() => {
      fs.unlinkSync(lightConfig)
    })

    it('saves polling rate and jobs marked as active', () => {
      const payload = {
        ledType: 'adafruit_lpd8806',
        numLeds: 12
      }

      led.persist(payload, lightConfig)

      const persistedData = JSON.parse(fs.readFileSync(lightConfig, UTF_8))
      expect(persistedData).to.have.property('light')
      expect(persistedData.light).to.have.property('type', 'adafruit_lpd8806')
      expect(persistedData.light).to.have.property('num_leds', 12)
    })

    it('throws error when light configuration file is not found', () => {
      expect(() => {
        led.persist(payload, 'bla.json')
      }).to.throw(Error)
    })
  })

  describe('#mutateModel', () => {
    it('mutates the model with new payload', () => {
      const payload = { ledType: 'adafruit_lpd8806', numLeds: 12 }
      const model = { tools: [{ name: 'led hardware', configuration: {} }] }

      led.mutateModel(model, payload)

      expect(model.tools[0].configuration.ledType).to.eql('adafruit_lpd8806')
      expect(model.tools[0].configuration.numLeds).to.eql(12)
    })
  })

})
