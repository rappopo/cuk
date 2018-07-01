'use strict'

const debug = require('debug')

debug.formatters.Z = text => {
  return text || '╞═'
}

debug.formatters.A = text => {
  return text || '│  ├─'
}

debug.formatters.B = text => {
  return text || '│  │  ├─'
}

debug.formatters.C = text => {
  return text || '├───▻'
}

debug.formatters.D = text => {
  return text || '│  ├───▻'
}

debug.formatters.E = text => {
  return text || '│  │  ├───▻'
}

debug.formatters.F = text => {
  return text || '│  │     ├─'
}

debug.formatters.G = text => {
  return text || '│  │  │     ├─'
}

debug.formatters.K = text => {
  return text || '⇒'
}

debug.formatters.L = text => {
  return text || '→'
}

debug.formatters.P = text => {
  return text || '│     ├─'
}



const trace = debug('cuk')

module.exports = function(cuk) {

  return trace
}