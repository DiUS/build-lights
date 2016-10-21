(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  head.appendChild(style);
  return returnValue;
}
function init(model) {
  return '<p>test</p>';
}

function display(representation) {
  var stateRepresentation = document.getElementById('representation');
  stateRepresentation.innerHTML = representation;
}

// import { render } from './state'

var data = {
  activeTool: 'network',
  tools: [{ network: {} }, { jobs: {} }],
  networkConfigured: false
};

// export function present (updatedData) {
//   render(updatedData)
// }

// document.addEventListener('DOMContentLoaded', event => {
//   willLoadTasks(data, present)
// })

// window.onload = event => {
//   loadTasks(data, present)
// }

display(init(data));

})));
//# sourceMappingURL=bundle.js.map
