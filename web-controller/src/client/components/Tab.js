'use strict'

import './styles/App.css'
import './styles/Tab.css'

import Inferno from 'inferno' // eslint-disable-line

import { Alert } from './Alert'
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
  const alert = Alert(model.result)

  return (
    <div className='tab'>
      <div className='tab-nav-container'>
        <ul className='container'>
          {tabs}
        </ul>
      </div>
      <div className='tab-content container'>
        {alert}
        {tabContent}
      </div>
    </div>
  )
}
