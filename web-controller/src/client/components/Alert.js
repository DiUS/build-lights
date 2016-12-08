'use strict'

import './styles/Alert.css'

import Inferno from 'inferno' // eslint-disable-line

function collapseAlert (el) {
  el.classList.add('collapse')
  setTimeout(() => { el.innerHTML = '' }, 300)
  return false
}

export const Alert = (model) => {
  let content = <div />

  const handleAlertClose = (e) => {
    const alertEl = e.currentTarget.parentElement
    return collapseAlert(alertEl)
  }

  if (model) {
    const className = model.success ? 'alert success' : 'alert error'

    content = (
      <div className={className}>
        <span>{model.message}</span>
        <a href='#' onClick={handleAlertClose}>&times;</a>
      </div>
    )

    setTimeout(() => {
      const alertEl = document.getElementsByClassName('alert')[0]
      collapseAlert(alertEl)
    }, 7000)
  }

  return content
}
