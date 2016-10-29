'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { Job } from './Job'

export const JobsTabContent = (model, lastUpdated) => {
  return (
    <form>
      <h2>CI server</h2>
      <label>
        <span>Address</span>
        <input type='text' value={model.ci.address} />
      </label>
      <label>
        <span>Port</span>
        <input type='text' value={model.ci.port} />
      </label>
      <h2>Hardware</h2>
      <label>
        <span>LED strip model</span>
        <select value={model.hardware.ledType}>
          <option value='adafruit'>Adafruit LPD8806</option>
          <option value='epistar'>Epistar LPD8806</option>
        </select>
      </label>
      <label>
        <span>Number of LEDs</span>
        <input type='number' value={model.hardware.numLeds} />
      </label>
      <h2>Jobs to monitor</h2>
      <label>
        <span>Polling rate (sec)</span>
        <input type='number' value={model.pollrate} />
      </label>
      <div className='jobs-container'>
        <Job name='QA Develop' path='/path/to/api/json' />
        <Job name='QA 2 Develop' path='/path/to/api/json' />
        <Job name='QA 3 Develop' path='/path/to/api/json' />
      </div>
      <div className='actions'>
        <button type='button'>Add new job</button>
        <button type='button'>Save configuration</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
