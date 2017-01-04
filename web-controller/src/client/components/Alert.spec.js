'use strict'

import Inferno from 'inferno'
import testUtils from 'inferno-test-utils'
import jsdomify from 'jsdomify'

const sinon = require('sinon')
const cheerio = require('cheerio')
const simulant = require('simulant')
const expect = require('chai').expect

import { Alert } from './Alert'

describe('Alert', () => {

  let $, clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })

  // required to reset the DOM to initial state
  afterEach(() => {
    // jsdomify.clear()
    clock.restore()
  })

  it('should remove alert content when dismiss click occurs', () => {
    testUtils.renderIntoDocument(<Alert success="true" message="another message" />)
console.log(document.getElementsByClassName('alert'));
    // simulant.fire(document.getElementsByClassName('alert')[0].getElementsByTagName('a')[0], 'click')
    //
    // clock.tick(1000)
    //
    // $ = cheerio.load(document.documentElement.outerHTML)
    // expect($('.alert span').length).to.eql(0)
    // expect($('.alert').hasClass('collapse')).to.be.true
  })

})
