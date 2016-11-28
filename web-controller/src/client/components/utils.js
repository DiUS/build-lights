'use strict'

exports.transformFormIntoPayload = (formElements, payload) => {
  for (let i = 0; i < formElements.length; i++) {
    const formEl = formElements[i]
    if (formEl.name) {
      payload[formEl.name] = formEl.value

      if (formEl.type === 'checkbox' && !formEl.checked) {
        payload[formEl.name] = 'false'
      }
    }
  }
}
