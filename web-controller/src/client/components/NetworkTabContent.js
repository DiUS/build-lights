'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const NetworkTabContent = (model) => {
  const handleConnectionTypeChange = (event) => {
    const formEl = event.currentTarget.parentNode.parentNode.parentNode
    const wifiConfEl = formEl.getElementsByClassName('wireless-connection')[0]

    if (event.currentTarget.value === 'wireless') {
      wifiConfEl.classList.remove('hidden')
      wifiConfEl.classList.add('shown')
    } else {
      wifiConfEl.classList.remove('shown')
      wifiConfEl.classList.add('hidden')
    }
  }

  const handleDhcpChange = (event) => {
    const formEl = event.currentTarget.parentNode.parentNode.parentNode
    const staticEl = formEl.getElementsByClassName('static-configuration')[0]

    if (event.currentTarget.value === 'false') {
      staticEl.classList.remove('hidden')
      staticEl.classList.add('shown')
    } else {
      staticEl.classList.remove('shown')
      staticEl.classList.add('hidden')
    }
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'network', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

  const wirelessContainerHidden = (model.configuration.connectionType !== 'wireless' ? 'hidden' : 'shown')
  const staticContainerHidden = (model.configuration.dhcp === true ? 'hidden' : 'shown')

  return (
    <form name='networkForm' onSubmit={handleFormSubmit}>
      <div className='form-container vertical'>
        <label for='hostname'>Name of <span>this device</span> on the network</label>
        <input className='full-length' required type='text' id='hostname' name='hostname' placeholder='e.g. mycompany-build-lights' value={model.configuration.hostname} />
      </div>
      <div className='form-container vertical'>
        <div className='fieldset'>
          <label>Select your <span>preferred connection type</span></label>
          <div className='controls'>
            <input type='radio' name='connectionType' checked={model.configuration.connectionType === 'wireless' ? 'checked' : ''} value='wireless' id='wireless' onChange={handleConnectionTypeChange} />
            <label for='wireless'><span><span /></span>Wireless</label>
            <input type='radio' name='connectionType' checked={model.configuration.connectionType === 'ethernet' ? 'checked' : ''} value='ethernet' id='ethernet' onChange={handleConnectionTypeChange} />
            <label for='ethernet'><span><span /></span>Ethernet</label>
          </div>
        </div>
        <div className={`wireless-connection ${wirelessContainerHidden}`}>
          <div className='fieldset'>
            <label for='ssid'>SSID</label>
            <input type='text' id='ssid' name='ssid' value={model.configuration.wireless.ssid} />
          </div>
          <div className='fieldset'>
            <label for='key'>Password</label>
            <input type='password' id='key' name='key' value={model.configuration.wireless.key} />
          </div>
          <label className='checkbox'>
            <input type='checkbox' id='hidden' name='hidden' value={model.configuration.wireless.hidden} checked={model.configuration.wireless.hidden ? 'checked' : ''} />
            <label for='hidden'><span><span /></span>Hidden network?</label>
          </label>
        </div>
      </div>
      <div className='form-container vertical'>
        <div className='fieldset'>
          <label><span>IP address</span> assignment</label>
          <div className='controls'>
            <input type='radio' name='useDhcp' checked={!model.configuration.dhcp ? 'checked' : ''} value='false' id='yes' onChange={handleDhcpChange} />
            <label for='yes'><span><span /></span>Static (manual)</label>
            <input type='radio' name='useDhcp' checked={model.configuration.dhcp ? 'checked' : ''} value='true' id='no' onChange={handleDhcpChange} />
            <label for='no'><span><span /></span>DHCP (dynamic)</label>
          </div>
        </div>
        <div className={`static-configuration ${staticContainerHidden}`}>
          <div className='fieldset'>
            <label for='address'>Address</label>
            <input type='text' name='address' id='address' value={model.configuration.address} placeholder='192.168.0.10/24' />
          </div>
          <div className='fieldset'>
            <label for='gateway'>Gateway</label>
            <input type='text' name='gateway' id='gateway' value={model.configuration.gateway} placeholder='192.168.0.1' />
          </div>
        </div>
      </div>
      <div className='actions'>
        <button type='submit'>Save</button>
        <small>Last updated: {model.lastUpdated}</small>
      </div>
    </form>
  )
}
