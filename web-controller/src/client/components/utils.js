'use strict'

exports.transformFormIntoPayload = (formElements, payload) => {
  for (let i = 0; i < formElements.length; i++) {
    if (formElements[i].name) {
      payload[formElements[i].name] = formElements[i].value
    }
  }
}
