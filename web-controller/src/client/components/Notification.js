'use strict'

import Inferno from 'inferno' // eslint-disable-line

export const Notification = (model) => {
  return (
    <div class='notifications'>
      <button onClick={model.onClick}>{model.message}</button>
    </div>
  )
}
