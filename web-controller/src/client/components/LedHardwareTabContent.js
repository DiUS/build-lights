'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const LedHardwareTabContent = (model, lastUpdated) => {
  const handleFormSubmit = (event) => {
    let postData = { save: 'led', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='ledType'>Which <span>LED strip</span> you are using</label>
        <select required id='ledType' name='ledType' value={model.ledType}>
          <option value='epistar_lpd8806'>Epistar LPD8806</option>
          <option value='adafruit_lpd8806'>Adafruit LPD8806</option>
        </select>
        <label for='numLeds'>Number of LEDs on your strip</label>
        <input type='number' required id='numLeds' name='numLeds' value={model.numLeds} />
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
