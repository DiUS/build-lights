'use strict'

import { present as presentModel } from './model'

export function switchToTab (tabName, present) {
  presentModel({ tabChange: tabName }, present || presentModel)
  return false
}
