'use strict'

module.exports = function(cuk) {
  return (options = {}) => {
    options.deep = false
    return require('./_async')(cuk)(options)
  }
}
