'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model) => {
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
      <div className={`form-container vertical ${model.configuration.tool}`}>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.configuration.tool} onChange={handleCiToolChange}>
          <option value='jenkins'>Jenkins</option>
          <option value='circleci'>Circle CI</option>
          <option value='buildkite'>Buildkite</option>
          <option value='travisci'>Travis CI</option>
        </select>
        <div className='fieldset'>
          <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
          <input type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.configuration.address} />
        </div>
        <div className='fieldset'>
          <label for='ciUsername' name='ciUsernameBuildkite'>Organization Slug</label>
          <label for='ciUsername' name='ciUsernameCircleCi'>Team Name</label>
          <label for='ciUsername' name='ciUsernameTravis'>Account</label>
          <input type='text' id='ciUsername' name='ciUsername' value={model.configuration.username} />
        </div>
        <div className='fieldset'>
          <label for='ciApiToken'>API token</label>
          <input type='text' id='ciApiToken' placeholder='' name='ciApiToken' value={model.configuration.apiToken} />
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {model.lastUpdated}</small>
      </div>
    </form>
  )
}
