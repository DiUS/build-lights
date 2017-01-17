'use strict'

import './styles/forms.css'
import './styles/jobs.css'

import Inferno from 'inferno' // eslint-disable-line

import { reorderJob } from '../sam/actions'

export const Job = (props) => {
  function dragStart (event) {
    event.dataTransfer.setData('text', JSON.stringify(props))
    return true
  }

  function dragDrop (event) {
    event.stopPropagation()
    reorderJob(JSON.parse(event.dataTransfer.getData('text')), props)
    return false
  }

  return (
    <div className='fieldset' draggable='true' onDragStart={dragStart} onDrop={dragDrop}>
      <input type='checkbox' name='jobActive' id={`jobActive_${props.index}`} checked={props.active} value={`jobActive_${props.index}`} />
      <label for={`jobActive_${props.index}`}><span><span /></span>&nbsp;</label>
      <input type='text' name='jobName' id={`jobName_${props.index}`} value={props.name} />
      <input type='text' name='jobBranch' id={`jobBranch_${props.index}`} value={props.branch} />
    </div>
  )
}
