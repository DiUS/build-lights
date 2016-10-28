'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

import { switchConnectionType, switchDhcp } from '../actions'

const WirelessConnectionConfig = (props) => {
  if (props.connectionType === 'wireless') {
    return (
      <div className='wireless-connection'>
        <label>
          <span>SSID</span>
          <input type='text' value={props.configuration.ssid} />
        </label>
        <label>
          <span>Password</span>
          <input type='text' value={props.configuration.key} />
        </label>
        <label>
          <input type='checkbox' value={props.configuration.hidden} />
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
          <input type='text' value={props.address} />
        </label>
        <label>
          <span>Netmask</span>
          <input type='text' value={props.netmask} />
        </label>
        <label>
          <span>Gateway</span>
          <input type='text' value={props.gateway} />
        </label>
      </div>
    )
  }
}

export const NetworkTabContent = (model) => {
  const handleConnectionTypeChange = (event) => {
    switchConnectionType(event.currentTarget.value)
  }

  const handleDhcpChange = (event) => {
    switchDhcp(event.currentTarget.value)
  }

  return (
    <form>
      <label>
        <span>Hostname</span>
        <input type='text' value={model.hostname} />
      </label>
      <label>
        <span>Connection type</span>
        <select value={model.connectionType} onChange={handleConnectionTypeChange}>
          <option value='wireless'>Wireless</option>
          <option value='ethernet'>Ethernet</option>
        </select>
      </label>
      <WirelessConnectionConfig connectionType={model.connectionType} configuration={model.wireless} />
      <label>
        <span>Use DHCP?</span>
        <select value={model.dhcp} onChange={handleDhcpChange}>
          <option value='true'>Yes</option>
          <option value='false'>No</option>
        </select>
      </label>
      <StaticConfiguration dhcp={model.dhcp} address={model.address} netmask={model.netmask} gateway={model.gateway} />
      <div className='actions'>
        <button type='button'>Save configuration</button>
        <br />
        <small>Last updated: July 15, 2016 10:19 AM</small>
      </div>
    </form>
  )
}
