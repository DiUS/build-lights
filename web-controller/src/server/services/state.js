'use strict'

const fs = require('fs')
const logger = require('winston')

const UTF_8 = 'utf8'

exports.write = (lightConfigFile, fn) => {
  let contents = JSON.parse(fs.readFileSync(lightConfigFile, UTF_8))

  fn(contents)

  fs.writeFileSync(lightConfigFile, JSON.stringify(contents, null, 2), UTF_8)
  logger.info('Persisted light configuration.')
}
