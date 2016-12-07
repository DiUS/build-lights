'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const handleChange = (event) => {
    const ciTool = event.currentTarget.value
    const ciUsername = document.getElementById('ciUsername')
    ciUsername.parentNode.style.display = (ciTool === 'travisci' || ciTool === 'circleci') ? null : 'none'
    const apiToken = document.getElementById('apiToken')
    apiToken.parentNode.style.display = (ciTool ===  'circleci') ? null : 'none'
    const ciAddress = document.getElementById('ciAddress')
    ciAddress.parentNode.style.display = (ciTool ===  'jenkins') ? null : 'none'
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
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
        <div class="fieldset">
          <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
          <input required type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        </div>
        <div class="fieldset">
          <label for='apiToken'>API token for CI account</label>
          <input required type='text' id='apiToken' placeholder='' name='apiToken' value={model.apiToken} />
        </div>
        <div class="fieldset">
          <label for='ciUsername'>Username associated with your CI</label>
          <input required type='text' id='ciUsername' name='ciUsername' value={model.username} />
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
