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
      <label for={`jobName_${props.index}`}>Name:</label>
      <input type='text' placeholder='My job to monitor' name='jobName' id={`jobName_${props.index}`} value={props.name} />
      <label for={`jobPath_${props.index}`}>URL:</label>
      <input type='text' placeholder='/path/to/job/on/ci' name='jobPath' id={`jobPath_${props.index}`} value={props.path} />
      <button type='button' className='small danger' data-job-index={props.index} onClick={handleRemoveJob}>Remove</button>
    </div>
  )
}
