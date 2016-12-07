'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const ciToolFields = {
    ciAddress: ['jenkins'],
    ciUsername: ['travisci', 'circleci'],
    ciApiToken: ['circleci']
  }

  const handleChange = (event) => {
    const ciTool = event.currentTarget.value
    for (var key in ciToolFields) {
      const makeVisible = ciToolFields[key].indexOf(ciTool) > -1
      const fieldElement = document.getElementById(key)
      fieldElement.parentNode.classList.remove(makeVisible ? 'hidden' : 'shown')
      fieldElement.parentNode.classList.add(makeVisible ? 'shown' : 'hidden')
    }
  }

  const ciAddressVisibility = (ciToolFields['ciAddress'].indexOf(model.tool) > -1 ? 'shown' : 'hidden')
  const ciApiTokenVisibility = (ciToolFields['ciApiToken'].indexOf(model.tool) > -1 ? 'shown' : 'hidden')
  const ciUsernameVisibility = (ciToolFields['ciUsername'].indexOf(model.tool) > -1 ? 'shown' : 'hidden')

  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    for (var key in ciToolFields) {
      if (ciToolFields[key].indexOf(postData.payload.ciTool) === -1) {
        delete postData.payload[key]
      }
    }
    return save(postData)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.tool} onChange={handleChange}>
          <option value='jenkins'>Jenkins</option>
          <option value='circleci'>Circle CI</option>
          <option value='travisci'>Travis CI</option>
        </select>
        <div className={`fieldset ${ciAddressVisibility}`}>
          <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
          <input required type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        </div>
        <div className={`fieldset ${ciUsernameVisibility}`}>
          <label for='ciUsername'>Username associated with your CI</label>
          <input required type='text' id='ciUsername' name='ciUsername' value={model.username} />
        </div>
        <div className={`fieldset ${ciApiTokenVisibility}`}>
          <label for='ciApiToken'>API token for CI account</label>
          <input required type='text' id='ciApiToken' placeholder='' name='ciApiToken' value={model.apiToken} />
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
