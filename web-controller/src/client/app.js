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
