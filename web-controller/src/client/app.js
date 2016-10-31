'use strict'

import * as view from './view'

const cb = (event) => {
  fetch('/model')
    .then(res => res.json())
    .then(json => {
      // window.model = json
      view.display(view.tabComponent(json))
    })
}

if (document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  cb()
} else {
  document.addEventListener('DOMContentLoaded', cb)
}
