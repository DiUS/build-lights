'use strict'

import { tabComponent, display } from './view'

export function representation (model) {
  display(tabComponent(model))
}

export function render (model) {
  representation(model)
}
