'use strict'

import './styles/Alert.css'

import Inferno from 'inferno' // eslint-disable-line

export const Alert = (model) => {
  let content = <div />

  const handleAlertClose = (e) => {
    const alertEl = e.currentTarget.parentElement
    alertEl.classList.add('collapse')

    setTimeout(() => {
      alertEl.innerHTML = ''
    }, 300)

    return false
  }

  if (model) {
    const className = model.success ? 'alert success' : 'alert error'
    content = (
      <div className={className}>
        <span>{model.message}</span>
        <a href='#' onClick={handleAlertClose}>&times;</a>
      </div>
    )
  }

  return content
}
