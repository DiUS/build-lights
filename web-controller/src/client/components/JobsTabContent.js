'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { Job } from './Job'
import { addNewJob, save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const JobsTabContent = (model, lastUpdated) => {
  const handleFormSubmit = (event) => {
    let postData = { save: 'jobs', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  const handleAddNewJob = (event) => {
    addNewJob()
  }

  const jobs = model.items.map((i, idx) => <Job name={i.name} path={i.path} index={idx} />)

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='pollRate'>Rate to <span>poll your CI server</span> (in seconds)</label>
        <input type='number' name='pollRate' id='pollRate' value={model.pollrate} />
      </div>
      <div className='jobs-container form-container vertical'>
        {jobs}
        <button type='button' className='small secondary' onClick={handleAddNewJob}>Add new job</button>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
