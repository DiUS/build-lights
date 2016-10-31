'use strict'

import Inferno from 'inferno' // eslint-disable-line

import { switchToTab } from '../sam/actions'

export const TabItem = (tabInfo) => {
  const selectedClass = tabInfo.active ? 'selected' : ''

  return (
    <li role='presentation' className={selectedClass}>
      <a href='#' onClick={() => switchToTab(tabInfo.name)} aria-controls={tabInfo.name} role='tab' data-toggle='tab'>{tabInfo.name}</a>
    </li>
  )
}
