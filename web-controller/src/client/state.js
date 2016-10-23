'use strict'

import { tabChange as tabChangeView, display } from './view'

export function representation (model) {
  let representation = 'Loading data...'

  if (tabChange(model)) {
    representation = tabChangeView(model)
  }

  display(representation)
}

export function tabChange (model) { return model.tabChanged }

export function render (model) {
  representation(model)
}
