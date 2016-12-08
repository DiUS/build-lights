'use strict'

import chai from 'chai'
import jsdomify from 'jsdomify'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)

// setup JSDOM
jsdomify.create('<!DOCTYPE html><html><head></head><body><div class="representation" id="representation"></div></body></html>')
