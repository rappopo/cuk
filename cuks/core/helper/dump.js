'use strict'

const util = require('util')

module.exports = function(cuk) {
  return (...args) => {
    console.log(...args.map(o => {
      return util.inspect(o, false, null)
    }))
  }
}