'use strict'

module.exports = function (cuk) {
  return (value) => {
    const result = [null, undefined, NaN].indexOf(value) === -1
    return result
  }
}
