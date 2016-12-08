'use strict'

import Inferno from 'inferno'
import jsdomify from 'jsdomify'
import InfernoDOM from 'inferno-dom'

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
    jsdomify.clear()
    clock.restore()
  })

  it('renders alert message that disappears', () => {
    InfernoDOM.render(<Alert success="true" message="all good" />, document.getElementById('representation'))
    $ = cheerio.load(document.documentElement.outerHTML)

    expect($('.alert span').text()).to.contain('all good')
    expect($('.alert a').text()).to.contain('×')
    expect($('.alert').hasClass('success')).to.be.true

    clock.tick(8000)

    $ = cheerio.load(document.documentElement.outerHTML)
    expect($('.alert span').length).to.eql(0)
    expect($('.alert').hasClass('collapse')).to.be.true
  })

  it('should remove alert content when dismiss click occurs', () => {
    InfernoDOM.render(<Alert success="true" message="another message" />, document.getElementById('representation'))

    simulant.fire(document.getElementsByClassName('alert')[0].getElementsByTagName('a')[0], 'click')

    clock.tick(1000)

    $ = cheerio.load(document.documentElement.outerHTML)
    expect($('.alert span').length).to.eql(0)
    expect($('.alert').hasClass('collapse')).to.be.true
  })

})
