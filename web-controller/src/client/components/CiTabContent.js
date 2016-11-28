'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.tool}>
          <option value='jenkins_direct'>Jenkins</option>
        </select>
        <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
        <input required type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        <label for='ciPort'>Port of the <span>CI server you want to connect to</span></label>
        <input required type='text' id='ciPort' name='ciPort' value={model.port} />
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
