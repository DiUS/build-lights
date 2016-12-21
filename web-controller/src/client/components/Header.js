'use strict'

import './styles/Header.css'

import Inferno from 'inferno' // eslint-disable-line

import { reboot, shutdown, upgrade } from '../sam/actions'

export const Header = (model) => {
  const supervisorHref = `http://${location.hostname}:9001`

  const rebootDevice = () => reboot()
  const shutdownDevice = () => shutdown()
  const upgradeSoftware = () => upgrade()

  let deviceActionsMenu = (
    <div class='device-actions'>
      <button type='button' aria-haspopup='true'>Menu</button>
      <ul class='dropdown-device-actions'>
        <li>
          <a href='#' onClick={rebootDevice}>Reboot</a>
        </li>
        <li>
          <a href='#' onClick={shutdownDevice}>Shutdown</a>
        </li>
        <li class='separator'>
          <div />
        </li>
        <li>
          <a href='#' onClick={upgradeSoftware}>Upgrade software</a>
        </li>
        <li class='separator'>
          <div />
        </li>
        <li>
          <a id='supervisor' target='_blank' href={supervisorHref}>Supervisor</a>
        </li>
      </ul>
    </div>
  )
  if (model.reboot || model.shutdown) {
    deviceActionsMenu = ''
  }

  return (
    <header>
      <div class='container'>
        <span>Build Lights</span>
        {deviceActionsMenu}
      </div>
    </header>
  )
}
