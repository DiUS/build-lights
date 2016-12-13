'use strict'

import './styles/Alert.css'

import Inferno from 'inferno' // eslint-disable-line

export const Alert = (model) => {
  let content = <div />

  const className = model.success ? 'alert success' : 'alert error'

  content = (
    <div className={className}>
      <span>{model.message}</span>
      <a href='#' onClick={model.dismissHandler}>&times;</a>
    </div>
  )

  return content
}
