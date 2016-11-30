'use strict'

import * as view from './sam/view'

const cb = (event) => {
  fetch('/model')
    .then(res => res.json())
    .then(json => {
      view.display(view.tabComponent(json))
    })
}

if (document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  cb()
} else {
  document.addEventListener('DOMContentLoaded', cb)
}

const mutateScreen = (e) => {
  let endpoint = '/shutdown'
  if (e.currentTarget.id === 'actionReboot') {
    endpoint = '/reboot'
  }

  const representation = document.getElementById('representation')
  representation.classList.add('waiting')
  representation.innerHTML = '<div class="message"><p>Please wait...</p></div>'

  fetch(endpoint)
    .then(res => res.json())
    .then(json => { })
    .catch(() => {
      representation.classList.add('error')
      representation.innerHTML = '<div class="message"><p>Could not execute.<br/>Please restart manually.<br/><br/><a href="#" onclick="location.reload()">Reload</a></p></div>'
    })

  return false
}

document.getElementById('actionReboot').onclick = mutateScreen
document.getElementById('actionShutdown').onclick = mutateScreen
