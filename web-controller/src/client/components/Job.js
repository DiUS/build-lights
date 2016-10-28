'use strict'

import './styles/forms.css'
import './styles/jobs.css'

import Inferno from 'inferno' // eslint-disable-line

export const Job = (props) => {
  const handleMouseOver = (e) => {
    const el = e.currentTarget.getElementsByClassName('remove-container')[0]
    if (!el.classList.contains('show')) {
      el.classList.add('show')
    }
  }

  const handleMouseOut = (e) => {
    const el = e.currentTarget.getElementsByClassName('remove-container')[0]
    el.classList.remove('show')
  }

  const handleOnFocus = (e) => {
    const el = e.currentTarget.parentElement.parentElement.nextSibling
    if (!el.classList.contains('show')) {
      el.classList.add('show')
    }
  }

  const handleOnBlur = (e) => {
    const el = e.currentTarget.parentElement.parentElement.nextSibling
    el.classList.remove('show')
  }

  return (
    <div className='job-container' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className='capture-container'>
        <label>
          <span>Name</span>
          <input type='text' value={props.name} onFocus={handleOnFocus} onBlur={handleOnBlur} />
        </label>
        <label>
          <span>URL</span>
          <input type='text' value={props.path} onFocus={handleOnFocus} onBlur={handleOnBlur} />
        </label>
      </div>
      <div className='remove-container'>
        <button className='button small danger'>Remove</button>
      </div>
    </div>
  )
}
