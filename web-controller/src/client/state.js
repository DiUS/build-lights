'use strict'

import { tabComponent, display } from './view'

export function representation (model) {
  display(tabComponent(model))
}

export function tabChange (model) { return model.tabChanged }

export function render (model) {
  representation(model)
}
