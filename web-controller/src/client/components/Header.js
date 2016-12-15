'use strict'

import './styles/Header.css'
import Inferno from 'inferno' // eslint-disable-line
import { Notification } from './Notification' // eslint-disable-line
import socketio from 'socket.io-client'

import { reboot, requestRefresh, shutdown } from '../sam/actions'

export const Header = (model) => {
  const supervisorHref = `http://${location.hostname}:9001`

  const rebootDevice = () => reboot()
  const shutdownDevice = () => shutdown()

  var socket = socketio()
  socket.on('jobs_changed', function () {
    requestRefresh()
  })

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
          <a id='supervisor' target='_blank' href={supervisorHref}>Supervisor</a>
        </li>
      </ul>
    </div>
  )
  if (model.reboot || model.shutdown) {
    deviceActionsMenu = ''
  }

  let refreshNotification = ''
  if (model.refreshNeeded) {
    refreshNotification = (
      <Notification message='Your data is out of date; please refresh' />
    )
  }

  return (
    <header>
      <div class='container'>
        <span>Build Lights</span>
        {refreshNotification}
        {deviceActionsMenu}
      </div>
    </header>
  )
}
