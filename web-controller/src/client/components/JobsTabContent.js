'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { Job } from './Job' // eslint-disable-line
import { autoDiscoverJobs, save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const JobsTabContent = (model) => {
  const handleFormSubmit = (event) => {
    let postData = { save: 'jobs', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  const jobs = model.configuration.items.map((i, idx) => <Job name={i.name} active={i.active} branch={i.branch} index={idx} />)

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='pollRate'>Rate to <span>poll your CI server</span> (in seconds)</label>
        <input type='number' name='pollRate' id='pollRate' value={model.configuration.pollrate} />
      </div>
      <div className='jobs-container form-container vertical'>
        <label><span>Monitored jobs</span></label>
        {jobs}
        <button type='button' className='small secondary' onClick={autoDiscoverJobs}>Auto discover jobs</button>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {model.lastUpdated}</small>
      </div>
    </form>
  )
}
