'use strict'

import * as view from './view'
import { model } from './model'

const cb = (event) => {
  view.display(view.tabComponent(model))
}

if (document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
  cb()
} else {
  document.addEventListener('DOMContentLoaded', cb)
}
