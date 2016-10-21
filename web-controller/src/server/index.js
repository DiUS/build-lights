'use strict'

const express = require('express')
const compression = require('compression')
const expressHandlebars = require('express-handlebars')

const app = express()

const handlebarsConfig = {
  defaultLayout: 'main',
  layoutsDir: 'src/server/views/layouts',
  partialsDir: 'src/server/views/partials'
}

app.engine('handlebars', expressHandlebars(handlebarsConfig))
app.set('view engine', 'handlebars')
app.set('views', `${process.cwd()}/src/server/views`)

app.use('/static', express.static(`${process.cwd()}/src/server/public`))

app.use(compression())

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(3000, () => {
  console.log('Build light web server successfully started.')
})
