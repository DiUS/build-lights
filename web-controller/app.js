'use strict'

const fs = require('fs')
const path = require('path')
const express = require('express')
const app = require('./assets/app')

global.Vue = require('vue')

const renderer = require('vue-server-renderer').createRenderer()

const server = express()

server.use('/assets', express.static(
  path.resolve(__dirname, 'assets')
))

// Split the layout into two sections of HTML
const layout = fs.readFileSync('./index.html', 'utf8')
const layoutSections = layout.split('<div id="app"></div>')
const preAppHTML = layoutSections[0]
const postAppHTML = layoutSections[1]

server.get('*', (request, response) => {
  const stream = renderer.renderToStream(app())

  response.write(preAppHTML)

  stream.on('data', (chunk) => {
    response.write(chunk)
  })

  stream.on('end', () => {
    response.end(postAppHTML)
  })

  stream.on('error', (error) => {
    console.error(error)
    return response
      .status(500)
      .send('Server Error')
  })
})

server.listen(5000, (error) => {
  if (error) throw error
  console.log('Server is running at localhost:5000')
})
