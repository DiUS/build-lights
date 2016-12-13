'use strict'

import Inferno from 'inferno' // eslint-disable-line

export const Intermission = (model) => {
  let message = (
    <p>
      Shutdown underway. <br /> <small>You can safely unplug your Raspberry Pi in {model.countdown} seconds.</small>
    </p>
  )

  if (model.reboot) {
    message = (
      <p>
        Reboot underway. <br /> <small>Will refresh in {model.countdown} seconds.</small>
      </p>
    )
  }

  if (model.completed) {
    <p>
      Shutdown completed. <br /> <small>You can safely unplug your Raspberry Pi now.</small>
    </p>
  }

  return (
    <div className='waiting'>
      <div className='message'>{message}</div>
    </div>
  )
}
