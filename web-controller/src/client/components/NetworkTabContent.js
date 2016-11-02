'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { transformFormIntoPayload } from './utils'
import { switchConnectionType, switchDhcp, save } from '../sam/actions'

const WirelessConnectionConfig = (props) => {
  if (props.connectionType === 'wireless') {
    return (
      <div className='wireless-connection'>
        <label>
          <span>SSID</span>
          <input type='text' name='ssid' value={props.configuration.ssid} />
        </label>
        <label>
          <span>Password</span>
          <input type='password' name='key' value={props.configuration.key} />
        </label>
        <label>
          <input type='checkbox' name='hidden' value={props.configuration.hidden} />
          <span>Hidden network?</span>
        </label>
      </div>
    )
  }
}

const StaticConfiguration = (props) => {
  if (!props.dhcp) {
    return (
      <div className='static-configuration'>
        <label>
          <span>Address</span>
          <input type='text' name='address' value={props.address} />
        </label>
        <label>
          <span>Netmask</span>
          <input type='text' name='netmask' value={props.netmask} />
        </label>
        <label>
          <span>Gateway</span>
          <input type='text' name='gateway' value={props.gateway} />
        </label>
      </div>
    )
  }
}

export const NetworkTabContent = (model, lastUpdated) => {
  const handleConnectionTypeChange = (event) => {
    return switchConnectionType(event.currentTarget.value)
  }

  const handleDhcpChange = (event) => {
    return switchDhcp(event.currentTarget.value)
  }

  const handleFormSubmit = (event) => {
    let postData = { save: 'network', payload: {} }
    transformFormIntoPayload(event.currentTarget.elements, postData.payload)
    return save(postData)
  }

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
      <WirelessConnectionConfig connectionType={model.connectionType} configuration={model.wireless} />
      <label>
        <span>Use DHCP?</span>
        <select name='useDhcp' value={model.dhcp} onChange={handleDhcpChange}>
          <option value='true'>Yes</option>
          <option value='false'>No</option>
        </select>
      </label>
      <StaticConfiguration dhcp={model.dhcp} address={model.address} netmask={model.netmask} gateway={model.gateway} />
      <div className='actions'>
        <button type='submit'>Save configuration</button>
        <br />
        <small>Last updated: {lastUpdated}</small>
      </div>
    </form>
  )
}
