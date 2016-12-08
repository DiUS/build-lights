'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model, lastUpdated) => {
  const handleCiToolChange = (event) => {
    const el = event.currentTarget
    el.parentElement.classList.remove(el.parentElement.classList.item(2))
    el.parentElement.classList.add(el.value)

    const inputEls = el.parentElement.getElementsByTagName('input')
    for (let i = 0; i < inputEls.length; i++) {
      inputEls[i].required = (inputEls[i].offsetParent !== null)
    }
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={`form-container vertical ${model.tool}`}>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.tool} onChange={handleCiToolChange}>
          <option value='jenkins'>Jenkins</option>
          <option value='circleci'>Circle CI</option>
          <option value='travisci'>Travis CI</option>
        </select>
        <div className='fieldset'>
          <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
          <input type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.address} />
        </div>
        <div className='fieldset'>
          <label for='ciUsername'>Username associated with your CI</label>
          <input type='text' id='ciUsername' name='ciUsername' value={model.username} />
        </div>
        <div className='fieldset'>
          <label for='ciApiToken'>API token for CI account</label>
          <input type='text' id='ciApiToken' placeholder='' name='ciApiToken' value={model.apiToken} />
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
