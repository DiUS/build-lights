'use strict'

import Inferno from 'inferno' // eslint-disable-line

import { NetworkTabContent } from './NetworkTabContent'
import { JobsTabContent } from './JobsTabContent'

export const TabContent = (tabInfo) => {
  const displayClass = !tabInfo.active ? 'hidden tab-content-container' : 'tab-content-container'

  const content = (tabInfo.name === 'network')
    ? NetworkTabContent(tabInfo.configuration)
    : JobsTabContent(tabInfo.configuration)

  return (
    <div className={displayClass}>{content}</div>
  )
}
