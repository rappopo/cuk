'use strict'

const generate = require('nanoid/generate')

module.exports = function(cuk) {
  return (alphabet, length) => {
    alphabet = alphabet || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    length = length || 12
    return generate(alphabet, length)
  }
}