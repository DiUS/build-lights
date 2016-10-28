'use strict'

import chai from 'chai'
import sinonChai from 'sinon-chai'
import jsdomify from 'jsdomify'

chai.use(sinonChai)

// tell mocha to load css files
// hook({ extensions: ['.css'] })

// setup JSDOM
jsdomify.create('<!DOCTYPE html><html><head></head><body><div id="representation"></div></body></html>')
