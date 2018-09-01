'use strict'

const debug = require('debug')
const trace = debug('cuk')

module.exports = function (cuk) {
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
