'use strict'

import './styles/forms.css'
import './styles/jobs.css'

import Inferno from 'inferno' // eslint-disable-line

import { removeJob } from '../sam/actions'

export const Job = (props) => {
  const handleRemoveJob = (e) => {
    removeJob(Number(e.currentTarget.dataset.jobIndex))
  }

  return (
    <div className='fieldset'>
      <input type='checkbox' name='jobActive' id={`jobActive_${props.index}`} checked={props.active} value={`jobActive_${props.index}`} />
      <label for={`jobActive_${props.index}`}><span><span /></span>&nbsp;</label>

      <input type='text' required placeholder='My job to monitor' name='jobName' id={`jobName_${props.index}`} value={props.name} />
      <button type='button' className='small danger' data-job-index={props.index} onClick={handleRemoveJob}>Remove</button>
    </div>
  )
}
