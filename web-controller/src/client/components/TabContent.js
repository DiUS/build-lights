'use strict'

import Inferno from 'inferno' // eslint-disable-line

import { CiTabContent } from './CiTabContent'
import { JobsTabContent } from './JobsTabContent'
import { NetworkTabContent } from './NetworkTabContent'
import { LedHardwareTabContent } from './LedHardwareTabContent'

export const TabContent = (tabInfo) => {
  const displayClass = !tabInfo.active ? 'hidden tab-content-container' : 'tab-content-container'
  let content

  switch (tabInfo.name) {
    case 'network':
      content = NetworkTabContent(tabInfo)
      break
    case 'ci server':
      content = CiTabContent(tabInfo)
      break
    case 'led hardware':
      content = LedHardwareTabContent(tabInfo)
      break
    case 'jobs to monitor':
      content = JobsTabContent(tabInfo)
      break
    default:
      content = 'Nothing to see here.'
  }

  return (
    <div className={displayClass}>{content}</div>
  )
}
