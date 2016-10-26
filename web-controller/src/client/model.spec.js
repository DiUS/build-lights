'use strict'

const expect = require('chai').expect
const sinon = require('sinon')
const clone = require('lodash.clone')
const proxyquire = require('proxyquire')

describe('Model', () => {

  const stub = { render: () => {} }

  describe('#present', () => {

    let model, dataModel, renderSpy = sinon.spy(stub, 'render')

    beforeEach(() => {
      model = proxyquire('./model', { './state': stub })
      dataModel = clone(model.model)
    })

    afterEach(() => {
      renderSpy.reset()
    })

    it('renders current model when no data is passed in', () => {
      model.present()
      expect(renderSpy).to.have.callCount(1)
      expect(renderSpy).to.have.been.calledWith(dataModel)
    })

    it('renders model with updated tab selection', () => {
      const data = { tabChange: 'abc' }
      dataModel.selectedTool = 'abc'

      model.present(data)

      expect(renderSpy).to.have.callCount(1)
      expect(renderSpy).to.have.been.calledWith(dataModel)
    })

    it('renders model with connection type', () => {
      const data = { connectionType: 'ethernet' }
      dataModel.tools[0].configuration.connectionType = data.connectionType

      model.present(data)

      expect(renderSpy).to.have.callCount(1)
      expect(renderSpy).to.have.been.calledWith(dataModel)
    })

    it('renders model with updated DHCP setting', () => {
      const data = { dhcp: 'true' }
      dataModel.tools[0].configuration.dhcp = true

      model.present(data)

      expect(renderSpy).to.have.callCount(1)
      expect(renderSpy).to.have.been.calledWith(dataModel)
    })

    it('renders current model when no decision can be made to present', () => {
      const data = { foo: 'bar' }

      model.present(data)

      expect(renderSpy).to.have.callCount(1)
      expect(renderSpy).to.have.been.calledWith(dataModel)
    })
  })
})
