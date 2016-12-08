'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const ciToolFields = {
    ciAddress: ['jenkins'],
    ciUsername: ['travisci', 'circleci', 'buildkite'],
    ciApiToken: ['circleci', 'buildkite']
  }

  const isFieldRelevantForCiTool = (field, ciTool) => {
    return ciToolFields[field].indexOf(ciTool) > -1
  }

  const handleCiToolChange = (event) => {
    const ciTool = event.currentTarget.value
    for (var key in ciToolFields) {
      const makeVisible = isFieldRelevantForCiTool(key, ciTool)
      const fieldElement = document.getElementById(key)
      fieldElement.parentNode.classList.remove(makeVisible ? 'hidden' : 'shown')
      fieldElement.parentNode.classList.add(makeVisible ? 'shown' : 'hidden')
      fieldElement.required = makeVisible
    }
  }

  const ciAddressVisibility = (isFieldRelevantForCiTool('ciAddress', model.tool) ? 'shown' : 'hidden')
  const ciAddressRequired = isFieldRelevantForCiTool('ciAddress', model.tool)
  const ciApiTokenVisibility = (isFieldRelevantForCiTool('ciApiToken', model.tool) ? 'shown' : 'hidden')
  const ciApiTokenRequired = isFieldRelevantForCiTool('ciApiToken', model.tool)
  const ciUsernameVisibility = (isFieldRelevantForCiTool('ciUsername', model.tool) ? 'shown' : 'hidden')
  const ciUsernameRequired = isFieldRelevantForCiTool('ciUsername', model.tool)

  const removeIrrelevantFields = (obj) => {
    for (var key in ciToolFields) {
      if (ciToolFields[key].indexOf(obj.ciTool) === -1) {
        delete obj[key]
      }
    }
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    removeIrrelevantFields(postData.payload)
    return save(postData)
  }

  if (model.address === undefined) { model.address = '' }
  if (model.username === undefined) { model.username = '' }
  if (model.apiToken === undefined) { model.apiToken = '' }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.tool} onChange={handleCiToolChange}>
          <option value='jenkins'>Jenkins</option>
          <option value='circleci'>Circle CI</option>
          <option value='buildkite'>Buildkite</option>
          <option value='travisci'>Travis CI</option>
        </select>
        <div className={`fieldset ${ciAddressVisibility}`}>
          <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
          <input required={ciAddressRequired} type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        </div>
        <div className={`fieldset ${ciUsernameVisibility}`}>
          <label for='ciUsername'>Username associated with your CI</label>
          <input required={ciUsernameRequired} type='text' id='ciUsername' name='ciUsername' value={model.username} />
        </div>
        <div className={`fieldset ${ciApiTokenVisibility}`}>
          <label for='ciApiToken'>API token for CI account</label>
          <input required={ciApiTokenRequired} type='text' id='ciApiToken' placeholder='' name='ciApiToken' value={model.apiToken} />
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
