'use strict'

import Inferno from 'inferno' // eslint-disable-line

export const TabContent = (tabInfo) => {
  const displayClass = tabInfo.active ? 'shown' : ''
  return (
    <div className={displayClass}>{tabInfo.name}</div>
  )
}
