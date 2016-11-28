'use strict'

const convict = require('convict')

// Define a schema
const conf = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  lightConfig: {
    doc: 'The configuration used for the light controller.',
    format: '*',
    default: 'light-configuration.json',
    env: 'LIGHT_CONF'
  }
})

// Perform validation
conf.validate({ strict: true })

exports = conf
