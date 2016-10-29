'use strict'

import './styles/Tab.css'

import Inferno from 'inferno' // eslint-disable-line

import { TabItem } from './TabItem'
import { TabContent } from './TabContent'

export const Tab = (model) => {
  const enabledTabs = model.tools
    .filter(t => t.active)
    .map(t => {
      return {
        name: t.name,
        active: t.name === model.selectedTool,
        configuration: t.configuration,
        lastUpdated: new Date(model.lastUpdated).toString()
      }
    })

  const tabs = enabledTabs.map(TabItem)
  const tabContent = enabledTabs.map(TabContent)

  return (
    <div className='tab'>
      <ul className='tab-nav'>
        {tabs}
      </ul>
      <div className='tab-content'>
        {tabContent}
      </div>
    </div>
  )
}
