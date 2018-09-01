'use strict'

module.exports = function (cuk) {
  return obj => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
  }
}
