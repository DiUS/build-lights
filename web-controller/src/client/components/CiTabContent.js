'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { selectCiTool, save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const CiTabContent = (model) => {
  const handleCiToolChange = (event) => {
    selectCiTool(event.currentTarget.value)
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'ci', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  const isToolOneOf = (tools) => {
    return tools.indexOf(model.configuration.tool) > -1
  }

  const address = isToolOneOf(['bamboo', 'jenkins']) ? (
    <div className='fieldset'>
      <label for='ciAddress'>Address of the <span>CI server you want to connect to</span></label>
      <input type='text' id='ciAddress' placeholder='http://myci.mycompany' name='ciAddress' value={model.configuration.address} />
    </div>) : ''

  const usernameLabels = {
    'bamboo': 'User (Optional)',
    'buildkite': 'Organization Slug',
    'circleci': 'Team Name',
    'travisci': 'Account'
  }
  const username = isToolOneOf(['bamboo', 'buildkite', 'circleci', 'travisci']) ? (
    <div className='fieldset'>
      <label for='ciUsername'>{usernameLabels[model.configuration.tool]}</label>
      <input type='text' id='ciUsername' name='ciUsername' value={model.configuration.username} />
    </div>) : ''

  const password = isToolOneOf(['bamboo']) ? (
    <div className='fieldset'>
      <label for='ciPassword'>Password (Optional)</label>
      <input type='text' id='ciPassword' placeholder='' name='ciPassword' value={model.configuration.password} />
    </div>) : ''

  const apiToken = isToolOneOf(['buildkite', 'circleci']) ? (
    <div className='fieldset'>
      <label for='ciApiToken'>API token</label>
      <input type='text' id='ciApiToken' placeholder='' name='ciApiToken' value={model.configuration.apiToken} />
    </div>) : ''

  return (
    <form onSubmit={handleFormSubmit}>
      <div className={`form-container vertical ${model.configuration.tool}`}>
        <label for='ciTool'><span>CI tool</span> you are using</label>
        <select required id='ciTool' name='ciTool' value={model.configuration.tool} onChange={handleCiToolChange}>
          <option value='bamboo'>Bamboo</option>
          <option value='buildkite'>Buildkite</option>
          <option value='circleci'>Circle CI</option>
          <option value='jenkins'>Jenkins</option>
          <option value='travisci'>Travis CI</option>
        </select>
        {address}
        {username}
        {password}
        {apiToken}
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {model.lastUpdated}</small>
      </div>
    </form>
  )
}
