'use strict'

const createApp = () => {
  return new Vue({
    template: '<div id="app">You have been here for {{ counter }} seconds.</div>',
    data: {
      counter: 0
    },
    created: function () {
      var vm = this
      setInterval(() => {
        vm.counter += 1
      }, 1000)
    }
  })
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = createApp
} else {
  this.app = createApp()
}
