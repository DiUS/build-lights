'use strict'

import './styles/App.css'

import Inferno from 'inferno' // eslint-disable-line

import { Tab } from './Tab'
import { Header } from './Header'
import { Footer } from './Footer'
import { Intermission } from './Intermission'

export const Main = (model) => {
  let mainContent = ''
  if (model.reboot || model.shutdown) {
    mainContent = Intermission(model)
  } else {
    mainContent = Tab(model)
  }

  return (
    <div className='representation'>
      <Header />
      {mainContent}
      <Footer />
    </div>
  )
}
