'use strict'

import * as state from './sam/state'

const cb = (event) => {
  fetch('/model')
    .then(res => res.json())
    .then(json => {
      state.render(state.represent(json))
    })
}

if (document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  cb()
} else {
  document.addEventListener('DOMContentLoaded', cb)
}
