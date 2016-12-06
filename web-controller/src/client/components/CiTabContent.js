'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const handleChange = (event) => {
    const val = event.currentTarget.value
    const ciUsername = document.getElementById('ciUsername')
    ciUsername.disabled = (val === 'jenkins')
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
        <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
        <input required type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        <label for='ciPort'>Port of the <span>CI server you want to connect to</span></label>
        <input required type='text' id='ciPort' name='ciPort' value={model.port} />
        <label for='ciUsername'>Username associated with your CI</label>
        <input disabled='disabled' required type='text' id='ciUsername' name='ciUsername' value={model.username} />
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
