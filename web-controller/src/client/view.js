'use strict'

export function init (model) {
  return '<p>test</p>'
}

export function display (representation) {
  const stateRepresentation = document.getElementById('representation')
  stateRepresentation.innerHTML = representation
}
