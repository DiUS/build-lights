'use strict'

const sinon = require('sinon')
const expect = require('chai').expect
const proxyquire = require('proxyquire')

describe('Index', () => {

  const pargs = process.argv

  let spyStub
  const stub = (config) => {
    return { listen: function (port, cb) { } }
  }

  beforeEach(() => {
    spyStub = sinon.spy(stub)
  })

  afterEach(() => {
    spyStub.reset()
    process.argv = pargs
  })

  context('without configuration file parameter', () => {

    beforeEach(() => {
      process.argv = ['1', '2']
    })

    it('should invoke server with "undefined"', () => {
      proxyquire('./index', { './server': spyStub })
      expect(spyStub).to.have.been.calledWith(undefined)
    })
  })

  context('with configuration file parameter', () => {

    beforeEach(() => {
      process.argv = ['1', '2', '3']
    })

    it('should invoke server with proper argument', () => {
      proxyquire('./index', { './server': spyStub })
      expect(spyStub).to.have.been.calledWith('3')
    })
  })

})
