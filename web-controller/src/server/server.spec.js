'use strict'

const fs = require('fs')
const expect = require('chai').expect
const request = require('supertest')
const proxyquire = require('proxyquire')

describe('Server', () => {

  const stub = (cb) => {
    cb(new Error('could not execute'))
  }

  const app = proxyquire('./server', {
    'power-off': stub,
    'nodejs-system-reboot': stub
  })

  it('throws error when configuration file cannot be found', () => {
    expect(() => { app('notfound.json') }).to.throw(Error, /no such file or directory/)
  })

  context('#home', () => {
    it('renders HTML page', done => {
      request(app('fixtures/configuration.json'))
        .get('/')
        .expect(200, done)
    })
  })

  context('#reboot', () => {
    it('renders home with message when cant reboot', done => {
      request(app('fixtures/configuration.json'))
        .get('/reboot')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.contain('Could not reboot')
          done()
        })
    })
  })

  context('#shutdown', () => {
    it('renders home with message when cant shutdown', done => {
      request(app('fixtures/configuration.json'))
        .get('/shutdown')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.contain('Could not shutdown')
          done()
        })
    })
  })

  context('#model', () => {

    describe('GET success', () => {

      let responseBody

      before(() => {
        request(app('fixtures/configuration.json'))
          .get('/model')
          .expect(200)
          .end((err, res) => {
            responseBody = res.body
          })
      })

      it('should have "tools" property', () => {
        expect(responseBody).to.have.property('tools')
      })

      it('should have 3 tools', () => {
        expect(responseBody.tools).to.have.lengthOf(3)
        expect(responseBody.tools.map(t => t.name)).to.eql(['network', 'jobs', 'statistics'])
      })

      it('each tool should have "name", "configuration" and "active" status', () => {
        responseBody.tools.forEach(t => {
          expect(t).to.have.property('name')
          expect(t).to.have.property('configuration')
          expect(t).to.have.property('active')
        })
      })

      it('should have 2 active tools', () => {
        expect(responseBody.tools.filter(t => t.active)).to.have.lengthOf(2)
      })

      it('should have "selectedTool" property', () => {
        expect(responseBody).to.have.property('selectedTool', 'network')
      })

      it('should have "lastUpdated" property', () => {
        expect(responseBody).to.have.property('lastUpdated', '2016-10-30T21:49:16.307Z')
      })
    })

    describe('GET fail', () => {
      it('replies with HTTP 500 when configuration cant be parsed', () => {
        request(app('fixtures/wrong_configuration.json'))
          .get('/model')
          .expect(500)
      })
    })

    describe('PUT', () => {

      let data, parsedData, randomConfigFile = `fixtures/tmp_${Date.now()}.json`

      beforeEach(() => {
        data = fs.readFileSync('fixtures/configuration.json', { encoding: 'utf8' })
        fs.writeFileSync(randomConfigFile, data)
        parsedData = JSON.parse(data)
      })

      it('renders current model when no data is passed in', done => {
        request(app(randomConfigFile))
          .put('/model')
          .expect(200)
          .end((err, res) => {
            expect(res.body.selectedTool).to.eql(parsedData.selectedTool)
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders model with updated tab selection', () => {
        request(app(randomConfigFile))
          .put('/model')
          .send({ tabChange: 'abc' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.selectedTool).to.eql('abc')
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders model with connection type', () => {
        request(app(randomConfigFile))
          .put('/model')
          .send({ connectionType: 'ethernet' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.tools[0].configuration.connectionType).to.eql('ethernet')
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders model with updated DHCP setting', () => {
        request(app(randomConfigFile))
          .put('/model')
          .send({ dhcp: 'true' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.tools[0].configuration.dhcp).to.eql(true)
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders current model when no decision can be made to present', () => {
        request(app(randomConfigFile))
          .put('/model')
          .send({ foo: 'bar' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.tools).to.eql(parsedData.tools)
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('removes job from configuration when payload to remove is received by the model', () => {
        request(app(randomConfigFile))
          .put('/model')
          .send({ deleteJob: 1 })
          .expect(200)
          .end((err, res) => {
            expect(res.body.tools[1].configuration.items).to.have.lengthOf(2)
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })
    })
  })
})
