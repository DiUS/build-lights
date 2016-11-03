'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { save } from '../sam/actions'
import { transformFormIntoPayload } from './utils'

export const NetworkTabContent = (model, lastUpdated) => {
  const handleConnectionTypeChange = (event) => {
    const formEl = event.currentTarget.parentNode.parentNode
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
    const formEl = event.currentTarget.parentNode.parentNode
    const staticEl = formEl.getElementsByClassName('static-configuration')[0]

    if (event.currentTarget.value !== 'true') {
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

  const wirelessContainerHidden = (model.connectionType !== 'wireless' ? 'hidden' : 'shown')
  const staticContainerHidden = (model.dhcp === 'true' ? 'hidden' : 'shown')

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        <span>Hostname</span>
        <input type='text' name='hostname' value={model.hostname} />
      </label>
      <label>
        <span>Connection type</span>
        <select name='connectionType' value={model.connectionType} onChange={handleConnectionTypeChange}>
          <option value='wireless'>Wireless</option>
          <option value='ethernet'>Ethernet</option>
        </select>
      </label>
      <div className='wireless-connection' style={wirelessContainerHidden}>
        <label>
          <span>SSID</span>
          <input type='text' name='ssid' value={model.wireless.ssid} />
        </label>
        <label>
          <span>Password</span>
          <input type='password' name='key' value={model.wireless.key} />
        </label>
        <label>
          <input type='checkbox' name='hidden' value={model.wireless.hidden} />
          <span>Hidden network?</span>
        </label>
      </div>
      <label>
        <span>Use DHCP?</span>
        <select name='useDhcp' value={model.dhcp} onChange={handleDhcpChange}>
          <option value='true'>Yes</option>
          <option value='false'>No</option>
        </select>
      </label>
      <div className='static-configuration' style={staticContainerHidden}>
        <label>
          <span>Address</span>
          <input type='text' name='address' value={model.address} placeholder='192.168.0.10/24' />
        </label>
        <label>
          <span>Gateway</span>
          <input type='text' name='gateway' value={model.gateway} placeholder='192.168.0.1' />
        </label>
      </div>
      <div className='actions'>
        <button type='submit'>Save configuration</button>
        <br />
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
