'use strict'

module.exports = function(cuk) {
  const lib = require('./_lib')(cuk)

  return (options = {}) => {
    options.deep = false
    return lib.boot(options)
  }
}
