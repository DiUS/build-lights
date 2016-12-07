'use strict'

const fs = require('fs')
const expect = require('chai').expect

const jobs = require('./jobs')
const UTF_8 = 'utf8'

describe('Jobs Service', () => {

  describe('#persist', () => {
    let lightConfig

    beforeEach(() => {
      lightConfig = `fixtures/tmp_${Date.now()}.json`
      const data = fs.readFileSync(`${process.cwd()}/fixtures/lightconfiguration.json`, UTF_8)
      fs.writeFileSync(lightConfig, data)
    })

    it('sets polling rate to 3 seconds in case provided is NaN', () => {
      const payload = {
        pollRate: 'a',
        jobName: ['a', 'b', 'c'],
        jobActive: [true, true, false]
      }

      jobs.persist(payload, lightConfig)

      const persistedData = JSON.parse(fs.readFileSync(lightConfig, UTF_8))
      expect(persistedData).to.have.property('api')
      expect(persistedData.api).to.have.property('pollrate_s', 3)
    })

    it('saves polling rate and jobs marked as active', () => {
      const payload = {
        pollRate: 10,
        jobName: ['a', 'b', 'c'],
        jobActive: [true, true, false]
      }

      jobs.persist(payload, lightConfig)

      const persistedData = JSON.parse(fs.readFileSync(lightConfig, UTF_8))
      expect(persistedData).to.have.property('api')
      expect(persistedData.api).to.have.property('pollrate_s', 10)

      expect(persistedData).to.have.property('jobs')
      expect(persistedData.jobs).to.not.be.empty
      expect(persistedData.jobs).to.have.lengthOf(2)
      expect(persistedData.jobs).to.eql(['a', 'b'])
    })

    it('ignores jobs not marked as active', () => {
      const payload = {
        pollRate: 10,
        jobName: ['a', 'b', 'c'],
        jobActive: [false, false, false]
      }

      jobs.persist(payload, lightConfig)

      const persistedData = JSON.parse(fs.readFileSync(lightConfig, UTF_8))
      expect(persistedData).to.have.property('jobs')
      expect(persistedData.jobs).to.be.empty
      expect(persistedData.jobs).to.have.lengthOf(0)
    })

    it('throws error when light configuration file is not found', () => {
      expect(() => {
        jobs.persist(payload, 'bla.json')
      }).to.throw(Error)
    })
  })

  describe('#mutateModel', () => {
    it('mutates the model with all jobs', () => {
      const payload = { pollRate: 10, jobName: ['a', 'b', 'c'], jobActive: [true, true, false] }
      const model = { tools: [{ name: 'jobs to monitor', configuration: {} }] }

      jobs.mutateModel(model, payload)

      expect(model.tools[0].configuration.pollrate).to.eql(10)
      expect(model.tools[0].configuration.items).to.have.lengthOf(3)
      expect(model.tools[0].configuration.items).to.eql([
        { name: 'a', active: true },
        { name: 'b', active: true },
        { name: 'c', active: false }
      ])
    })
  })

})
