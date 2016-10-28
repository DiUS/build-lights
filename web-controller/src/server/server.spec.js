'use strict'

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

  context('#home', () => {
    it('renders HTML page', done => {
      request(app)
        .get('/')
        .expect(200, done)
    })
  })

  context('#reboot', () => {
    it('renders home with message when cant reboot', done => {
      request(app)
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
      request(app)
        .get('/shutdown')
        .expect(200)
        .end((err, res) => {
          expect(res.text).to.contain('Could not shutdown')
          done()
        })
    })
  })
})
