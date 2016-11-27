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
      <label>Name:</label>
      <input type='text' name='jobName' value={props.name} />
      <label>URL:</label>
      <input type='text' name='jobPath' value={props.path} />
      <button type='button' className='small danger' data-job-index={props.index} onClick={handleRemoveJob}>Remove</button>
    </div>
  )
}
