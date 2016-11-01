'use strict'

import Inferno from 'inferno' // eslint-disable-line

import { NetworkTabContent } from './NetworkTabContent'
import { JobsTabContent } from './JobsTabContent'

export const TabContent = (tabInfo) => {
  const displayClass = !tabInfo.active ? 'hidden tab-content-container' : 'tab-content-container'
  let content

  switch (tabInfo.name) {
    case 'network':
      content = NetworkTabContent(tabInfo.configuration, tabInfo.lastUpdated)
      break
    case 'jobs':
      content = JobsTabContent(tabInfo.configuration, tabInfo.lastUpdated)
      break
    default:
      content = 'Nothing to see here.'
  }

  return (
    <div className={displayClass}>{content}</div>
  )
}
