'use strict'

import './styles/Tab.css'

import Inferno from 'inferno' // eslint-disable-line

import { Alert } from './Alert'
import { TabItem } from './TabItem'
import { TabContent } from './TabContent'
import { SpinnerOverlay } from './Spinner'

import { dismissAlert } from '../sam/actions'

export const Tab = (model) => {
  const tabs = model.map(TabItem)
  const tabContent = model.filter(tool => tool.active).map(TabContent)

  const dismissHandler = (e) => {
    delete model.alert
    return dismissAlert(model)
  }

  let alert = ''
  if (model.alert) {
    alert = <Alert success={model.alert.success} message={model.alert.message} dismissHandler={dismissHandler} />
  }

  let saveIndicator = ''
  if (model.saveInProgress) {
    saveIndicator = <SpinnerOverlay />
  }

  return (
    <div className='tab'>
      <div className='tab-nav-container'>
        <ul className='container'>
          {tabs}
        </ul>
      </div>
      <div className='tab-content container'>
        {saveIndicator}
        {alert}
        {tabContent}
      </div>
    </div>
  )
}
