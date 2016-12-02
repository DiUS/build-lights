'use strict'

const winston = require('winston')
const expressWinston = require('express-winston')

module.exports.accessLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      json: true,
      colorize: false,
      filename: (process.env.NODE_ENV !== 'production') ? 'access.log' : '/var/log/web-controller-access.log'
    })
  ],
  meta: true,
  expressFormat: true,
  colorize: true
})

module.exports.errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: false,
      colorize: true
    }),
    new winston.transports.File({
      json: true,
      colorize: false,
      filename: (process.env.NODE_ENV !== 'production') ? 'error.log' : '/var/log/web-controller-error.log'
    })
  ]
})
