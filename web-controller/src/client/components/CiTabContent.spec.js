'use strict'

import Inferno from 'inferno'
import jsdomify from 'jsdomify'
import InfernoDOM from 'inferno-dom'

const cheerio = require('cheerio')
const simulant = require('simulant')
const expect = require('chai').expect

import { CiTabContent } from './CiTabContent'

describe('CiTabContent', () => {

  xdescribe('#render', () => {
    let $

    ['jenkins', 'circleci', 'travisci'].forEach(tool => {
      // required to reset the DOM to initial state
      afterEach(() => {
        jsdomify.clear()
      })

      it(`renders form with visible address entry for ${tool} tool`, () => {
        const model = {
          tool,
          address: 'http://myci:9000',
          username: 'me',
          apiToken: '1bc355j'
        }

        const component = CiTabContent(model, new Date().toJSON())
        InfernoDOM.render(component, document.getElementById('representation'))
        $ = cheerio.load(document.documentElement.outerHTML)

        expect($(`form .form-container.${tool}`)).to.not.be.empty
        // expect($('form #ciAddress').val()).to.eql(model.address)
        // expect($('form #ciUsername').val()).to.eql(model.username)
        // expect($('form #ciApiToken').val()).to.eql(model.apiToken)
      })
    })
  })

  xdescribe('#change', () => {
    // required to reset the DOM to initial state
    afterEach(() => {
      jsdomify.clear()
    })

    const model = {
      tool: 'jenkins',
      address: 'http://myci:9000',
      username: 'me',
      apiToken: '1bc355j'
    }

    it('renders tool used based off newly selected tool', () => {
      const component = CiTabContent(model, new Date().toJSON())
      InfernoDOM.render(component, document.getElementById('representation'))

      expect(document.getElementById('ciAddress').offsetParent).to.not.eql(null)
      expect(document.getElementById('ciUsername').offsetParent).to.eql(null)
      expect(document.getElementById('ciApiToken').offsetParent).to.eql(null)

      document.getElementById('ciTool').getElementsByTagName('option')[2].selected = true
      simulant.fire(document.getElementById('ciTool'), 'change')
    })
  })

  xdescribe('#submit', () => {

  })

})
