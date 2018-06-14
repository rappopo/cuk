'use strict'

module.exports = function(cuk) {
  return (value) => {
    return [null, undefined].indexOf(value) === -1
  }
}