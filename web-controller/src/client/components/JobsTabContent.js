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
      <h2>CI server</h2>
      <label>
        <span>Address</span>
        <input type='text' name='ciAddress' value={model.ci.address} />
      </label>
      <label>
        <span>Port</span>
        <input type='text' name='ciPort' value={model.ci.port} />
      </label>
      <h2>Hardware</h2>
      <label>
        <span>LED strip model</span>
        <select name='ledType' value={model.hardware.ledType}>
          <option value='adafruit'>Adafruit LPD8806</option>
          <option value='epistar'>Epistar LPD8806</option>
        </select>
      </label>
      <label>
        <span>Number of LEDs</span>
        <input type='number' name='numberLeds' value={model.hardware.numLeds} />
      </label>
      <h2>Jobs to monitor</h2>
      <label>
        <span>Polling rate (sec)</span>
        <input type='number' name='pollRate' value={model.pollrate} />
      </label>
      <div className='jobs-container'>
        {jobs}
      </div>
      <div className='actions'>
        <button type='submit'>Save configuration</button>
        <button type='button' className='small right' onClick={handleAddNewJob}>Add new job</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
