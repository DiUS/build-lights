'use strict'

const fs = require('fs')
const sinon = require('sinon')
const expect = require('chai').expect
const request = require('supertest')
const proxyquire = require('proxyquire')

describe('Server', () => {

  const callback = sinon.stub()
  callback.onCall(0).yields(new Error('could not execute'))
  callback.onCall(2).yields(new Error('could not execute'))
  callback.onCall(1).yields()
  callback.onCall(3).yields()

  const serviceStub = { persist: (payload) => {} }
  const persistSpy = sinon.spy(serviceStub, 'persist')

  const modelRoute = proxyquire('./routes/model', {
    '../services/jobs': serviceStub,
    '../services/network': serviceStub
  })
  const rebootRoute = proxyquire('./routes/reboot', { 'nodejs-system-reboot': callback })
  const shutdownRoute = proxyquire('./routes/shutdown', { 'power-off': callback })

  const app = proxyquire('./server', {
    './routes/model': modelRoute,
    './routes/reboot': rebootRoute,
    './routes/shutdown': shutdownRoute
  })

  it('throws error when configuration file cannot be found', () => {
    expect(() => { app('notfound.json') }).to.throw(Error, /no such file or directory/)
  })

  it('throws error when light configuration file cannot be found', () => {
    expect(() => { app('fixtures/web-configuration.json', 'notfound.json') }).to.throw(Error, /no such file or directory/)
  })

  context('#home', () => {
    it('renders HTML page', done => {
      request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
        .get('/')
        .expect(200, done)
    })
  })

  context('#reboot', () => {
    it('renders home with message when cant reboot', done => {
      request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
        .get('/reboot')
        .expect(500)
        .end((err, res) => {
          expect(res.text).to.be.empty
          done()
        })
    })

    it('ends response when successfully reboots', done => {
      request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
        .get('/reboot')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.be.empty
          done()
        })
    })
  })

  context('#shutdown', () => {
    it('renders home with message when cant shutdown', done => {
      request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
        .get('/shutdown')
        .expect(500)
        .end((err, res) => {
          expect(res.text).to.be.empty
          done()
        })
    })

    it('ends response when successfully reboots', done => {
      request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
        .get('/shutdown')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.be.empty
          done()
        })
    })

  })

  context('#model', () => {

    describe('GET - HTTP 200', () => {

      let responseBody

      before(() => {
        request(app('fixtures/web-configuration.json', 'fixtures/lightconfiguration.json'))
          .get('/model')
          .expect(200)
          .end((err, res) => {
            responseBody = res.body
          })
      })

      it('should have "tools" property', () => {
        expect(responseBody).to.have.property('tools')
      })

      it('should have 5 tools', () => {
        expect(responseBody.tools).to.have.lengthOf(5)
        expect(responseBody.tools.map(t => t.name)).to.eql(['network', 'led hardware', 'ci server', 'jobs to monitor', 'statistics'])
      })

      it('each tool should have "name", "configuration" and "active" status', () => {
        responseBody.tools.forEach(t => {
          expect(t).to.have.property('name')
          expect(t).to.have.property('configuration')
          expect(t).to.have.property('active')
        })
      })

      it('should have 2 active tools', () => {
        expect(responseBody.tools.filter(t => t.active)).to.have.lengthOf(4)
      })

      it('should have "selectedTool" property', () => {
        expect(responseBody).to.have.property('selectedTool', 'network')
      })

      it('should have "lastUpdated" property', () => {
        expect(responseBody).to.have.property('lastUpdated', '2016-11-28T05:37:49.045Z')
      })
    })

    describe('GET - HTTP 500', () => {
      it('replies with HTTP 500 when configuration cant be parsed', () => {
        request(app('fixtures/wrong_configuration.json', 'fixtures/lightconfiguration.json'))
          .get('/model')
          .expect(500)
      })
    })

    describe('PUT - HTTP 200', () => {

      let data, parsedData, randomConfigFile = `fixtures/tmp_${Date.now()}.json`

      beforeEach(() => {
        data = fs.readFileSync('fixtures/web-configuration.json', { encoding: 'utf8' })
        fs.writeFileSync(randomConfigFile, data)
        parsedData = JSON.parse(data)
      })

      it('renders current model when no data is passed in', done => {
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
          .put('/model')
          .expect(200)
          .end((err, res) => {
            expect(res.body.selectedTool).to.eql(parsedData.selectedTool)
            expect(res.body.lastUpdated).to.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders model with updated tab selection', () => {
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
          .put('/model')
          .send({ tabChange: 'abc' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.selectedTool).to.eql('abc')
            expect(res.body.lastUpdated).to.eql(parsedData.lastUpdated)
            done()
          })
      })

      it('renders model with connection type', () => {
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
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
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
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
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
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
        request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
          .put('/model')
          .send({ deleteJob: 1 })
          .expect(200)
          .end((err, res) => {
            expect(res.body.tools[1].configuration.items).to.have.lengthOf(2)
            expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
            done()
          })
      })

      describe('persisting configuration', () => {
        ['network', 'jobs'].forEach(tool => {
          it(`invokes "${tool}" service to persist configuration`, () => {
            request(app(randomConfigFile, 'fixtures/lightconfiguration.json'))
              .put('/model')
              .send({ save: tool, payload: { a: 'b', c: 'd' } })
              .expect(200)
              .end((err, res) => {
                expect(persistSpy).to.have.been.calledWith({ a: 'b', c: 'd' })
                expect(res.body.lastUpdated).to.not.eql(parsedData.lastUpdated)
                done()
              })
          })
        })
      })
    })
  })
})
