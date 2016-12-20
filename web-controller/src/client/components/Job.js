'use strict'

import './styles/forms.css'
import './styles/jobs.css'
import { removeJob } from '../sam/actions'

import Inferno from 'inferno' // eslint-disable-line

export const Job = (props) => {
  const handleRemoveJob = (e) => { removeJob(props.index) }

  return (
    <div className='fieldset'>
      <input type='checkbox' name='jobActive' id={`jobActive_${props.index}`} checked={props.active} value={`jobActive_${props.index}`} />
      <label for={`jobActive_${props.index}`}><span><span /></span>&nbsp;</label>
      <input type='text' name='jobName' id={`jobName_${props.index}`} value={props.name} />
      <button type='button' className='small danger' onClick={handleRemoveJob}>Remove</button>
    </div>
  )
}
