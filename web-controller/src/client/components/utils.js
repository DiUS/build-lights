'use strict'

exports.transformFormIntoPayload = (formElements, payload) => {
  for (let i = 0; i < formElements.length; i++) {
    const formEl = formElements[i]
    let alreadyContainsEl = false

    if (formEl.type === 'radio' && formEl.checked) {
      payload[formEl.name] = formElements[formEl.name].value
    }

    if (formEl.type !== 'radio') {
      if (payload[formEl.name] && !Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true

        const originalValue = payload[formEl.name]
        delete payload[formEl.name]

        payload[formEl.name] = []
        payload[formEl.name].push(originalValue)
      }

      if (Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true
      }

      if (alreadyContainsEl) {
        payload[formEl.name].push(formEl.value)
      } else {
        payload[formEl.name] = formEl.value
      }
    }

    if (formEl.type === 'checkbox' && !formEl.checked) {
      payload[formEl.name] = 'false'
    }
  }
}
