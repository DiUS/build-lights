'use strict'

import { present as presentModel } from './model'

export function switchToTab (tabName, present) {
  presentModel({ tabChange: tabName }, present || presentModel)
  return false
}

export function switchConnectionType (connectionType, present) {
  presentModel({ connectionType }, present || presentModel)
  return false
}

export function switchDhcp (dhcp, present) {
  presentModel({ dhcp }, present || presentModel)
  return false
}
