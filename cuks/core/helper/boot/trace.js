'use strict'

const debug = require('debug')

debug.formatters.A = text => {
  return text || '│  ├─'
}

debug.formatters.B = text => {
  return text || '│  │  ├─'
}

debug.formatters.D = text => {
  return text || '│  ├───▻'
}

debug.formatters.E = text => {
  return text || '│  │  ├───▻'
}

debug.formatters.K = text => {
  return text || '⇒'
}

debug.formatters.L = text => {
  return text || '→'
}

const trace = debug('cuk')

module.exports = function(cuk) {

  return trace
}