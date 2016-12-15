'use strict'

import Inferno from 'inferno' // eslint-disable-line

export const Notification = (model) => {
  return (
    <div>
      <span>{model.message}</span>
    </div>
  )
}
