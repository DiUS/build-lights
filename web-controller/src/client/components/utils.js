'use strict'

exports.transformFormIntoPayload = (formElements, payload) => {
  for (let i = 0; i < formElements.length; i++) {
    const formEl = formElements[i]
    let alreadyContainsEl = false

    if (formEl.type === 'radio' && formEl.checked) {
      payload[formEl.name] = formElements[formEl.name].value
    }

    if (formEl.type !== 'radio') {
      if (typeof payload[formEl.name] !== 'undefined' && !Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true

        const originalValue = payload[formEl.name]
        delete payload[formEl.name]

        payload[formEl.name] = []
        payload[formEl.name].push(originalValue)
      }

      if (Array.isArray(payload[formEl.name])) {
        alreadyContainsEl = true
      }

      const value = (formEl.type === 'checkbox') ? formEl.checked : formEl.value
      if (formEl.name) {
        if (alreadyContainsEl) {
          payload[formEl.name].push(value)
        } else {
          payload[formEl.name] = value
        }
      }
    }
  }
}
