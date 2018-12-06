'use strict'

const debug = require('debug')
const defTrace = debug('cuk')

module.exports = function (cuk, trace) {
  if (!trace) trace = defTrace
  return (text, ...arg) => {
    text = text
      .replace(/\+->/g, '┌▻')
      .replace(/-->/g, '──▻')
      .replace(/->/g, '→')
      .replace(/=>/g, '⇒')
      .replace(/\|=/g, '╞═')
      .replace(/\|-/g, '├─')
      .replace(/\|/g, '│')
      .replace(/\+=/g, '╒═')
      .replace(/-=/g, '╘═')

    trace(text, ...arg)
  }
}
