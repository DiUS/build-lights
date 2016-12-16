'use strict'

import './styles/forms.css'
import './styles/jobs.css'

import Inferno from 'inferno' // eslint-disable-line

export const Job = (props) => {
  return (
    <div className='fieldset'>
      <input type='checkbox' name='jobActive' id={`jobActive_${props.index}`} checked={props.active} value={`jobActive_${props.index}`} />
      <label for={`jobActive_${props.index}`}><span><span /></span>{props.name}</label>
      <input type='hidden' name='jobName' id={`jobName_${props.index}`} value={props.name} />
    </div>
  )
}
