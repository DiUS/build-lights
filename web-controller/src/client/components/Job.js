'use strict'

import './styles/forms.css'

import Inferno from 'inferno' // eslint-disable-line

export const Job = (props) => {
  return (
    <div className='job-container'>
      <div className='capture-container'>
        <label>
          <span>Name</span>
          <input type='text' value={props.name} />
        </label>
        <label>
          <span>URL</span>
          <input type='text' value={props.path} />
          <button className='button small danger'>Delete</button>
        </label>
      </div>
    </div>
  )
}
