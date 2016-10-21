'use strict'

import * as view from './view'
import { data as model } from './model'

// document.addEventListener('DOMContentLoaded', event => {
//   willLoadTasks(data, present)
// })

// window.onload = event => {
//   loadTasks(data, present)
// }

view.display(view.init(model))
